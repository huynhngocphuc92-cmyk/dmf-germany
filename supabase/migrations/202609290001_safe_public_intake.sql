-- Additive step: install before deploying the application that calls these RPCs.
begin;

alter table public.chat_sessions add column if not exists owner_token_hash text;

create or replace function public.dmf_save_chat(
  p_session_id text, p_owner_token text, p_messages jsonb, p_lead_data jsonb default '{}'::jsonb
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  saved_id uuid;
  token_hash text;
begin
  if p_session_id is null or length(p_session_id) not between 1 and 200
     or p_owner_token is null or p_owner_token !~ '^[a-f0-9]{64}$'
     or p_messages is null or jsonb_typeof(p_messages) <> 'array'
     or jsonb_array_length(p_messages) > 200 or octet_length(p_messages::text) > 1000000
     or p_lead_data is null or jsonb_typeof(p_lead_data) <> 'object'
     or octet_length(p_lead_data::text) > 10000 then
    raise exception 'Invalid chat input' using errcode = '22023';
  end if;

  token_hash := encode(sha256(convert_to(p_owner_token, 'UTF8')), 'hex');
  insert into public.chat_sessions (
    session_id, owner_token_hash, messages, message_count,
    lead_email, lead_company, lead_phone, lead_interest, updated_at
  ) values (
    p_session_id, token_hash, p_messages, jsonb_array_length(p_messages),
    nullif(p_lead_data->>'email', ''), nullif(p_lead_data->>'company', ''),
    nullif(p_lead_data->>'phone', ''), nullif(p_lead_data->>'interest', ''), now()
  ) on conflict (session_id) do update set
    messages = excluded.messages, message_count = excluded.message_count,
    lead_email = coalesce(excluded.lead_email, chat_sessions.lead_email),
    lead_company = coalesce(excluded.lead_company, chat_sessions.lead_company),
    lead_phone = coalesce(excluded.lead_phone, chat_sessions.lead_phone),
    lead_interest = coalesce(excluded.lead_interest, chat_sessions.lead_interest),
    updated_at = now()
  -- Legacy rows have no owner and cannot be claimed by knowing their session ID.
  where chat_sessions.owner_token_hash = token_hash
  returning id into saved_id;
  return saved_id is not null;
end;
$$;

create or replace function public.dmf_submit_lead(p_lead jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if p_lead is null or jsonb_typeof(p_lead) <> 'object'
     or octet_length(p_lead::text) > 10000
     or nullif(btrim(p_lead->>'email'), '') is null
     or length(p_lead->>'email') > 320 then
    raise exception 'Invalid lead input' using errcode = '22023';
  end if;
  insert into public.leads (email, company, phone, interest, session_id, source, status)
  values (btrim(p_lead->>'email'), p_lead->>'company', p_lead->>'phone',
    p_lead->>'interest', p_lead->>'sessionId', coalesce(p_lead->>'source', 'website'), 'new')
  on conflict do nothing;
  -- A public submission can create a lead, never edit or reveal an existing one.
  return true;
end;
$$;

revoke all on function public.dmf_save_chat(text, text, jsonb, jsonb) from public;
revoke all on function public.dmf_submit_lead(jsonb) from public;
grant execute on function public.dmf_save_chat(text, text, jsonb, jsonb) to anon;
grant execute on function public.dmf_submit_lead(jsonb) to anon;

commit;
