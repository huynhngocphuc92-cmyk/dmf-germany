-- Apply only AFTER the M1 application and its server-only key are verified.
begin;
revoke all on function public.dmf_save_chat(text,text,jsonb,jsonb),public.dmf_submit_lead(jsonb) from public,anon,authenticated;
grant execute on function public.dmf_save_chat(text,text,jsonb,jsonb) to service_role;
commit;
