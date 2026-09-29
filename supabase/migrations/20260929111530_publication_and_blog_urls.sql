begin;

-- Existing records remain intact. Featured/visa status is not publication consent.
alter table public.candidates
  add column publication_status text not null default 'draft' check (publication_status in ('draft','published')),
  add column publication_valid_until date,
  add column publication_consent_note text,
  add column publication_reviewed_at timestamptz,
  add column publication_reviewed_by uuid;

alter table public.candidates add constraint candidate_publication_review_required check (
  publication_status <> 'published' or (
    publication_valid_until is not null and publication_reviewed_at is not null
    and publication_reviewed_by is not null
    and coalesce(length(btrim(publication_consent_note)) between 10 and 1000,false)
    and coalesce(length(btrim(profession)) > 1,false)
  )
);

update public.candidates set updated_at=coalesce(created_at,now()) where updated_at is null;

create function public.dmf_review_candidate() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  if TG_OP = 'INSERT' and new.publication_status <> 'draft' then
    raise exception 'Save a draft before reviewing publication' using errcode='23514';
  end if;
  if TG_OP = 'UPDATE' then
    -- Changed public content requires another explicit review; private edits/featuring do not.
    if row(new.category,new.profession,new.experience_years,new.german_level,new.visa_status,new.avatar_url,new.video_url)
       is distinct from row(old.category,old.profession,old.experience_years,old.german_level,old.visa_status,old.avatar_url,old.video_url) then
      new.publication_status := 'draft';
    end if;
    if new.publication_status = 'published' and
       (old.publication_status <> 'published' or
        row(new.publication_valid_until,new.publication_consent_note) is distinct from
        row(old.publication_valid_until,old.publication_consent_note)) then
      if not public.dmf_is_admin() then
        raise exception 'Admin review required' using errcode='42501';
      end if;
      if new.publication_valid_until < current_date then
        raise exception 'Publication validity must not be in the past' using errcode='23514';
      end if;
      if new.full_name ~* '(^|[^a-z])(test|demo|sample|muster)([^a-z]|$)'
         or new.profession ~* '(^|[^a-z])(test|demo|sample|muster)([^a-z]|$)'
         or coalesce(new.video_url,'') like '%dQw4w9WgXcQ%' then
        raise exception 'Sample content cannot be published' using errcode='23514';
      end if;
      new.publication_reviewed_at := now();
      new.publication_reviewed_by := auth.uid();
    else
      -- Ordinary edits cannot forge who reviewed the profile.
      new.publication_reviewed_at := old.publication_reviewed_at;
      new.publication_reviewed_by := old.publication_reviewed_by;
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.dmf_review_candidate() from public,anon,authenticated;
create trigger dmf_candidate_publication_review before insert or update on public.candidates
  for each row execute function public.dmf_review_candidate();

grant select(publication_status,publication_valid_until) on public.candidates to anon;
alter policy dmf_public_candidate_boundary on public.candidates
  using (publication_status='published' and publication_valid_until >= current_date);
alter policy dmf_public_candidate_read on public.candidates
  using (publication_status='published' and publication_valid_until >= current_date);

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
    insert into public.leads(email,company,phone,interest,session_id,source,status)
    values(p_payload->>'email',nullif(p_payload->>'company',''),nullif(p_payload->>'phone',''),
      p_payload->>'interest',p_payload->>'sessionId','chatbot','new')
    returning id into saved_id;
  else
    if p_kind='profile' then
      profile_id := (p_payload->>'candidateId')::uuid;
      if not exists(select 1 from public.candidates where id=profile_id and publication_status = 'published' and publication_valid_until >= current_date) then
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

-- Guard the same boundary for inquiry intake, which runs with service-role privileges.
create function public.dmf_validate_profile_inquiry() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.candidate_id is not null and not exists (
    select 1 from public.candidates where id=new.candidate_id
      and publication_status='published' and publication_valid_until >= current_date
  ) then
    raise exception 'Profile unavailable' using errcode='P0002';
  end if;
  return new;
end;
$$;
revoke all on function public.dmf_validate_profile_inquiry() from public,anon,authenticated;
create trigger dmf_inquiry_public_profile before insert on public.inquiries
  for each row execute function public.dmf_validate_profile_inquiry();

-- Stable former blog URLs. Only aliases pointing to a currently published post are public.
create table public.post_slug_redirects (
  slug text primary key,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index post_slug_redirects_post_id_idx on public.post_slug_redirects(post_id);
alter table public.post_slug_redirects enable row level security;
revoke all on public.post_slug_redirects from public,anon,authenticated;
grant select(slug,post_id) on public.post_slug_redirects to anon;
grant select,insert,update,delete on public.post_slug_redirects to authenticated;
grant all on public.post_slug_redirects to service_role;
create policy dmf_public_post_redirect on public.post_slug_redirects for select to anon
  using (exists(select 1 from public.posts where id=post_id and status='published'));
create policy dmf_admin_post_redirect on public.post_slug_redirects for all to authenticated
  using ((select public.dmf_is_admin())) with check ((select public.dmf_is_admin()));

create function public.dmf_preserve_post_slug() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  -- Serialize slug changes so concurrent inserts cannot claim a former URL.
  perform pg_advisory_xact_lock(192837465);
  if TG_OP='UPDATE' and new.slug=old.slug then return new; end if;
  if new.slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(new.slug)>200 then
    raise exception 'Invalid blog slug' using errcode='23514';
  end if;
  if exists(select 1 from public.post_slug_redirects where slug=new.slug and post_id<>new.id) then
    raise exception 'This slug belongs to a previous publication' using errcode='23505';
  end if;
  delete from public.post_slug_redirects where slug=new.slug and post_id=new.id;
  if TG_OP='UPDATE' and (old.status='published' or old.published_at is not null) then
    insert into public.post_slug_redirects(slug,post_id) values(old.slug,old.id)
      on conflict(slug) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function public.dmf_preserve_post_slug() from public,anon,authenticated;
create trigger dmf_post_slug_history before insert or update of slug on public.posts
  for each row execute function public.dmf_preserve_post_slug();

commit;
