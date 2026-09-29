-- Cutover step: first configure the existing admin's trusted app_metadata.role,
-- deploy the RPC-based intake, then apply this transaction. No customer rows change.
begin;

create or replace function public.dmf_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users where id = auth.uid()
    and raw_app_meta_data->>'role' = 'admin' and is_anonymous is false);
$$;
revoke all on function public.dmf_is_admin() from public;
grant execute on function public.dmf_is_admin() to authenticated;

-- Revoke both table and any older column grants; a column grant survives a table revoke.
revoke all on table public.candidates, public.chat_sessions, public.leads
  from public, anon, authenticated;
do $$
declare tbl text; cols text;
begin
  foreach tbl in array array['candidates', 'chat_sessions', 'leads'] loop
    select string_agg(quote_ident(attname), ',') into cols
    from pg_attribute where attrelid = ('public.' || tbl)::regclass
      and attnum > 0 and not attisdropped;
    execute format('revoke select (%s), insert (%s), update (%s), references (%s) on public.%I from public, anon, authenticated',
      cols, cols, cols, cols, tbl);
  end loop;
end;
$$;

grant select (id, category, profession, experience_years, german_level, visa_status,
  avatar_url, video_url, is_featured, created_at) on public.candidates to anon;
grant select, insert, update, delete on public.candidates, public.chat_sessions, public.leads
  to authenticated;

alter table public.candidates enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.leads enable row level security;

-- Restrictive policies also constrain permissive policies from earlier migrations.
create policy dmf_public_candidate_boundary on public.candidates as restrictive
  for select to anon using (is_featured is true);
create policy dmf_public_candidate_read on public.candidates
  for select to anon using (is_featured is true);

create policy dmf_candidate_admin_boundary on public.candidates as restrictive
  for all to authenticated using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));
create policy dmf_candidate_admin_access on public.candidates
  for all to authenticated using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));

create policy dmf_chat_admin_boundary on public.chat_sessions as restrictive
  for all to authenticated using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));
create policy dmf_chat_admin_access on public.chat_sessions
  for all to authenticated using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));

create policy dmf_lead_admin_boundary on public.leads as restrictive
  for all to authenticated using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));
create policy dmf_lead_admin_access on public.leads
  for all to authenticated using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));

commit;
