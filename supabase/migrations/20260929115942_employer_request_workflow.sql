begin;
-- Preserve existing records and source-specific statuses. New fields are additive.
alter table public.inquiries
  add column request_purpose text check(request_purpose is null or request_purpose='hiring'),
  add column service text check(service is null or service in ('skilled','azubi','seasonal','unsure')),
  add column headcount integer check(headcount between 1 and 1000),
  add column work_location text check(length(work_location)<=200),
  add column start_window text check(length(start_window)<=200),
  add column source_path text check(length(source_path)<=300),
  add column campaign jsonb not null default '{}'::jsonb check(jsonb_typeof(campaign)='object' and octet_length(campaign::text)<=2000),
  add column assigned_to uuid references auth.users(id) on delete set null,
  add column follow_up_on date,
  add column next_action text check(length(next_action)<=500),
  add column notes text,
  add column workflow_version integer not null default 0;
alter table public.leads
  add column source_path text check(length(source_path)<=300),
  add column campaign jsonb not null default '{}'::jsonb check(jsonb_typeof(campaign)='object' and octet_length(campaign::text)<=2000),
  add column assigned_to uuid references auth.users(id) on delete set null,
  add column follow_up_on date,
  add column next_action text check(length(next_action)<=500),
  add column workflow_version integer not null default 0;
create index inquiries_follow_up_idx on public.inquiries(follow_up_on) where follow_up_on is not null;
create index leads_follow_up_idx on public.leads(follow_up_on) where follow_up_on is not null;
create index inquiries_assigned_idx on public.inquiries(assigned_to);
create index leads_assigned_idx on public.leads(assigned_to);
create index intake_record_idx on public.intake_submissions(record_id,kind);

-- A narrow directory, never exposed as an unguarded auth.users view.
create schema if not exists dmf_private;
revoke all on schema dmf_private from public,anon;
grant usage on schema dmf_private to authenticated;
create function dmf_private.request_assignees() returns table(id uuid,label text)
language plpgsql stable security definer set search_path='' as $$
begin
  if not public.dmf_is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
  return query select u.id,coalesce(u.email,u.id::text) from auth.users u
    where u.raw_app_meta_data->>'role'='admin' and u.is_anonymous is false order by u.email,u.id;
end $$;
revoke all on function dmf_private.request_assignees() from public,anon,authenticated;
grant execute on function dmf_private.request_assignees() to authenticated;
create function public.dmf_request_assignees() returns table(id uuid,label text)
language sql stable security invoker set search_path='' as $$select * from dmf_private.request_assignees()$$;
revoke all on function public.dmf_request_assignees() from public,anon,authenticated;
grant execute on function public.dmf_request_assignees() to authenticated;

create function public.dmf_request_workflow_revision() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if new.assigned_to is not null and (TG_OP='INSERT' or new.assigned_to is distinct from old.assigned_to) then
    if not exists(select 1 from public.dmf_request_assignees() a where a.id=new.assigned_to) then
      raise exception 'Owner must be an existing administrator' using errcode='23514';
    end if;
  end if;
  if TG_OP='UPDATE' then
    new.workflow_version := old.workflow_version+1;
    new.updated_at := clock_timestamp();
    if new.notes is distinct from old.notes and length(new.notes)>10000 then
      raise exception 'Notes too long' using errcode='23514';
    end if;
  else new.workflow_version := 0;
  end if;
  return new;
end $$;
revoke all on function public.dmf_request_workflow_revision() from public,anon,authenticated;
create trigger dmf_inquiry_workflow before insert or update on public.inquiries for each row execute function public.dmf_request_workflow_revision();
create trigger dmf_lead_workflow before insert or update on public.leads for each row execute function public.dmf_request_workflow_revision();

create view public.dmf_request_inbox with (security_invoker=true) as
select inbox.*,coalesce(receipt.id,inbox.id) as reference,
  concat_ws(' ',inbox.contact_name,inbox.email,inbox.company,inbox.candidate_code,inbox.id,receipt.id) as search_text
from (
select id,'inquiry'::text as source,coalesce(request_purpose,type,'contact') as kind,client_name as contact_name,
  email,phone,company,message,status,
  case status when 'new' then 'new' when 'completed' then 'closed' else 'active' end as stage,
  candidate_id,candidate_code,service,headcount,work_location,start_window,source_path,campaign,
  assigned_to,follow_up_on,next_action,notes,workflow_version,created_at,updated_at
from public.inquiries
union all
select id,'lead','lead',null::text,email,phone,company,interest,status,
  case status when 'new' then 'new' when 'converted' then 'closed' when 'lost' then 'closed' else 'active' end,
  null::uuid,null::text,null::text,null::integer,null::text,null::text,source_path,campaign,
  assigned_to,follow_up_on,next_action,notes,workflow_version,created_at,updated_at
from public.leads
) inbox
left join lateral (
  select s.id from public.intake_submissions s where s.record_id=inbox.id
    and ((inbox.source='lead' and s.kind='lead') or (inbox.source='inquiry' and s.kind in ('contact','profile')))
    order by s.created_at,s.id limit 1
) receipt on true;
revoke all on public.dmf_request_inbox from public,anon,authenticated;
grant select on public.dmf_request_inbox to authenticated;

create or replace function public.dmf_receive_intake(p_id uuid, p_kind text, p_payload jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare digest text; existing_hash text; existing_kind text; saved_id uuid; profile_id uuid;
begin
  if p_id is null or p_kind not in ('contact','profile','lead') or jsonb_typeof(p_payload) is distinct from 'object'
    or octet_length(p_payload::text)>30000 or nullif(btrim(p_payload->>'email'),'') is null
    or length(p_payload->>'email')>320 then raise exception 'Invalid intake' using errcode='22023'; end if;
  digest:=encode(sha256(convert_to(p_payload::text,'UTF8')),'hex');
  insert into public.intake_submissions(id,kind,payload,payload_hash) values(p_id,p_kind,p_payload,digest)
    on conflict(id) do nothing;
  if not found then
    select payload_hash,kind into existing_hash,existing_kind from public.intake_submissions where id=p_id;
    if existing_hash is distinct from digest or existing_kind is distinct from p_kind then
      raise exception 'Idempotency conflict' using errcode='23505';
    end if;
    return jsonb_build_object('duplicate',true);
  end if;
  if p_kind='lead' then
    insert into public.leads(email,company,phone,interest,session_id,source,status,source_path,campaign)
    values(p_payload->>'email',nullif(p_payload->>'company',''),nullif(p_payload->>'phone',''),
      p_payload->>'interest',p_payload->>'sessionId','chatbot','new',p_payload->>'sourcePath',coalesce(p_payload->'campaign','{}'::jsonb))
    returning id into saved_id;
  else
    if p_kind='profile' then
      profile_id := (p_payload->>'candidateId')::uuid;
      if not exists(select 1 from public.candidates where id=profile_id and publication_status = 'published' and publication_valid_until >= current_date) then
        raise exception 'Profile unavailable' using errcode='P0002';
      end if;
    end if;
    insert into public.inquiries(client_name,email,phone,company,message,type,status,candidate_id,candidate_code,request_purpose,service,headcount,work_location,start_window,source_path,campaign)
    values(p_payload->>'name',p_payload->>'email',nullif(p_payload->>'phone',''),nullif(p_payload->>'company',''),
      p_payload->>'message',p_kind,'new',profile_id,case when profile_id is null then null else upper(left(profile_id::text,8)) end,
      p_payload->>'requestPurpose',p_payload->>'service',(p_payload->>'headcount')::integer,p_payload->>'location',p_payload->>'timing',p_payload->>'sourcePath',coalesce(p_payload->'campaign','{}'::jsonb))
    returning id into saved_id;
  end if;
  update public.intake_submissions set record_id=saved_id where id=p_id;
  insert into public.notification_deliveries(submission_id,channel) values(p_id,'email'),(p_id,'telegram');
  if p_kind<>'lead' then insert into public.notification_deliveries(submission_id,channel) values(p_id,'auto_reply'); end if;
  return jsonb_build_object('duplicate',false);
end $$;

commit;
