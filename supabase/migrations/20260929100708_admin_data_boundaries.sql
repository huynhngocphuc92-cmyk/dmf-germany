begin;
-- Table-level REVOKE does not remove legacy column-level privileges.
do $$ declare tbl text; cols text; begin
  foreach tbl in array array['inquiries','posts','site_config','site_assets'] loop
    select string_agg(quote_ident(attname),',') into cols from pg_attribute
      where attrelid=format('public.%I',tbl)::regclass and attnum>0 and not attisdropped;
    execute format('revoke all (%s) on public.%I from public,anon,authenticated',cols,tbl);
  end loop;
end $$;
-- Complete the trusted-admin boundary across existing private/editor tables.
revoke all on public.inquiries from public,anon,authenticated;
grant select,insert,update,delete on public.inquiries to authenticated;
alter table public.inquiries enable row level security;
create policy dmf_inquiry_admin_boundary on public.inquiries as restrictive for all to authenticated
  using ((select public.dmf_is_admin())) with check ((select public.dmf_is_admin()));
create policy dmf_inquiry_admin_access on public.inquiries for all to authenticated
  using ((select public.dmf_is_admin())) with check ((select public.dmf_is_admin()));

do $$ declare tbl text; begin
  foreach tbl in array array['posts','site_config','site_assets'] loop
    execute format('revoke all on public.%I from public,anon,authenticated',tbl);
    execute format('grant select on public.%I to anon,authenticated',tbl);
    execute format('grant insert,update,delete on public.%I to authenticated',tbl);
    execute format('alter table public.%I enable row level security',tbl);
    execute format('create policy dmf_admin_insert_boundary on public.%I as restrictive for insert to authenticated with check ((select public.dmf_is_admin()))',tbl);
    execute format('create policy dmf_admin_update_boundary on public.%I as restrictive for update to authenticated using ((select public.dmf_is_admin())) with check ((select public.dmf_is_admin()))',tbl);
    execute format('create policy dmf_admin_delete_boundary on public.%I as restrictive for delete to authenticated using ((select public.dmf_is_admin()))',tbl);
    execute format('create policy dmf_admin_manage on public.%I for all to authenticated using ((select public.dmf_is_admin())) with check ((select public.dmf_is_admin()))',tbl);
  end loop;
end $$;
create policy dmf_published_posts_boundary on public.posts as restrictive for select to anon using (status='published');
create policy dmf_authenticated_posts_boundary on public.posts as restrictive for select to authenticated using (status='published' or (select public.dmf_is_admin()));

-- Existing public bucket URLs remain readable. Only the trusted admin can mutate assets.
create policy dmf_storage_insert_boundary on storage.objects as restrictive for insert to authenticated
  with check ((select public.dmf_is_admin()) and bucket_id in ('images','candidates'));
create policy dmf_storage_update_boundary on storage.objects as restrictive for update to authenticated
  using ((select public.dmf_is_admin()) and bucket_id in ('images','candidates'))
  with check ((select public.dmf_is_admin()) and bucket_id in ('images','candidates'));
create policy dmf_storage_delete_boundary on storage.objects as restrictive for delete to authenticated
  using ((select public.dmf_is_admin()) and bucket_id in ('images','candidates'));
create policy dmf_storage_anon_insert_boundary on storage.objects as restrictive for insert to anon with check (false);
create policy dmf_storage_anon_update_boundary on storage.objects as restrictive for update to anon using (false) with check (false);
create policy dmf_storage_anon_delete_boundary on storage.objects as restrictive for delete to anon using (false);
commit;
