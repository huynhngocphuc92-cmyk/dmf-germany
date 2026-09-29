-- Additive release step. Apply before deploying the M1 application.
begin;

alter table public.inquiries
  add column if not exists company text,
  add column if not exists candidate_id uuid,
  add column if not exists candidate_code text,
  add column if not exists updated_at timestamptz not null default now();
alter table public.inquiries alter column status set default 'new';
-- New submissions are deduplicated by request ID, not by a person's email.
drop index if exists public.leads_email_unique;

create table public.intake_submissions (
  id uuid primary key,
  kind text not null check (kind in ('contact','profile','lead')),
  payload jsonb not null,
  payload_hash text not null,
  record_id uuid,
  created_at timestamptz not null default now()
);
create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.intake_submissions(id) on delete cascade,
  channel text not null check (channel in ('email','telegram','auto_reply')),
  status text not null default 'pending' check (status in ('pending','sending','sent','failed','skipped')),
  attempts integer not null default 0,
  attempt_token uuid,
  lease_until timestamptz,
  last_error text,
  sent_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (submission_id, channel)
);
create index notification_delivery_pending on public.notification_deliveries(status, updated_at);
create table public.intake_rate_limits (
  key text primary key,
  count integer not null,
  expires_at timestamptz not null
);
create index intake_rate_limit_expiry on public.intake_rate_limits(expires_at);

alter table public.intake_submissions enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.intake_rate_limits enable row level security;
revoke all on public.intake_submissions, public.notification_deliveries, public.intake_rate_limits from public, anon, authenticated;
grant select on public.intake_submissions, public.notification_deliveries to authenticated;
grant all on public.intake_submissions, public.notification_deliveries, public.intake_rate_limits to service_role;
create policy intake_admin_read on public.intake_submissions for select to authenticated using ((select public.dmf_is_admin()));
create policy notifications_admin_read on public.notification_deliveries for select to authenticated using ((select public.dmf_is_admin()));

-- Service-only functions use invoker permissions; no new public privileged RPC.
create function public.dmf_check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare current_count integer; deadline timestamptz;
begin
  if length(p_key) <> 64 or p_limit not between 1 and 1000 or p_window_seconds not between 1 and 86400 then
    raise exception 'Invalid limit' using errcode='22023';
  end if;
  delete from public.intake_rate_limits where expires_at < now() - interval '1 day';
  insert into public.intake_rate_limits as limits(key,count,expires_at)
    values(p_key,1,now()+make_interval(secs=>p_window_seconds))
  on conflict(key) do update set
    count=case when limits.expires_at<=now() then 1 else least(limits.count+1,p_limit+1) end,
    expires_at=case when limits.expires_at<=now() then now()+make_interval(secs=>p_window_seconds) else limits.expires_at end
  returning count,expires_at into current_count,deadline;
  return jsonb_build_object('success',current_count<=p_limit,'remaining',greatest(p_limit-current_count,0),'resetIn',greatest(1,ceil(extract(epoch from deadline-now()))::integer));
end $$;

create function public.dmf_receive_intake(p_id uuid, p_kind text, p_payload jsonb)
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
    insert into public.leads(email,company,phone,interest,session_id,source,status)
    values(p_payload->>'email',nullif(p_payload->>'company',''),nullif(p_payload->>'phone',''),
      p_payload->>'interest',p_payload->>'sessionId','chatbot','new')
    returning id into saved_id;
  else
    if p_kind='profile' then
      profile_id := (p_payload->>'candidateId')::uuid;
      if not exists(select 1 from public.candidates where id=profile_id and is_featured is true) then
        raise exception 'Profile unavailable' using errcode='P0002';
      end if;
    end if;
    insert into public.inquiries(client_name,email,phone,company,message,type,status,candidate_id,candidate_code)
    values(p_payload->>'name',p_payload->>'email',nullif(p_payload->>'phone',''),nullif(p_payload->>'company',''),
      p_payload->>'message',p_kind,'new',profile_id,case when profile_id is null then null else upper(left(profile_id::text,8)) end)
    returning id into saved_id;
  end if;
  update public.intake_submissions set record_id=saved_id where id=p_id;
  insert into public.notification_deliveries(submission_id,channel) values(p_id,'email'),(p_id,'telegram');
  if p_kind<>'lead' then insert into public.notification_deliveries(submission_id,channel) values(p_id,'auto_reply'); end if;
  return jsonb_build_object('duplicate',false);
end $$;

create function public.dmf_claim_notification(p_id uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare job public.notification_deliveries; submission public.intake_submissions;
begin
  update public.notification_deliveries set status='sending',attempts=attempts+1,
    attempt_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',updated_at=now()
  where id=p_id and (status in ('pending','failed','skipped') or (status='sending' and lease_until<now()))
  returning * into job;
  if job.id is null then return null; end if;
  select * into submission from public.intake_submissions where id=job.submission_id;
  return jsonb_build_object('id',job.id,'attemptToken',job.attempt_token,'channel',job.channel,'kind',submission.kind,'payload',submission.payload);
end $$;

create function public.dmf_finish_notification(p_id uuid,p_attempt_token uuid,p_status text,p_error text default null)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if p_status not in ('sent','failed','skipped') or length(coalesce(p_error,''))>100 then
    raise exception 'Invalid delivery result' using errcode='22023';
  end if;
  update public.notification_deliveries set status=p_status,last_error=p_error,lease_until=null,
    sent_at=case when p_status='sent' then now() else sent_at end,updated_at=now()
  where id=p_id and attempt_token=p_attempt_token and status='sending';
  return found;
end $$;

revoke all on function public.dmf_check_rate_limit(text,integer,integer), public.dmf_receive_intake(uuid,text,jsonb), public.dmf_claim_notification(uuid), public.dmf_finish_notification(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.dmf_check_rate_limit(text,integer,integer), public.dmf_receive_intake(uuid,text,jsonb), public.dmf_claim_notification(uuid), public.dmf_finish_notification(uuid,uuid,text,text) to service_role;
grant select,insert,update on public.inquiries,public.leads to service_role;
grant select on public.candidates to service_role;
commit;
