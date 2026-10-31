ALTER FUNCTION public.update_modified_column() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.dmf_is_admin() FROM PUBLIC, anon;
