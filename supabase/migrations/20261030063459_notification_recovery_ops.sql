-- Apply before application rollout. No existing sent timestamps or statuses are rewritten.
begin;
alter table public.notification_deliveries add column next_attempt_at timestamptz not null default now();
create index notification_delivery_due on public.notification_deliveries(next_attempt_at) where status in ('pending','failed','sending') and attempts < 5;

-- One locking update is the arbiter for both automatic and explicit retries.
create function public.dmf_claim_notification_retry(p_id uuid, p_manual boolean default false)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare job public.notification_deliveries; submission public.intake_submissions;
begin
  update public.notification_deliveries set status='sending',attempts=attempts+1,
    attempt_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',
    next_attempt_at=now()+interval '5 minutes'+make_interval(secs=>least(3600,60*(2^least(attempts,6))::integer)),updated_at=now()
  where id=p_id and attempts<5 and sent_at is null
    and (status in ('pending','failed') or (p_manual and status='skipped')
      or (status='sending' and coalesce(lease_until,'-infinity'::timestamptz)<now()))
    and (p_manual or next_attempt_at<=now())
  returning * into job;
  if job.id is null then return null; end if;
  select * into submission from public.intake_submissions where id=job.submission_id;
  return jsonb_build_object('id',job.id,'attemptToken',job.attempt_token,'channel',job.channel,'kind',submission.kind,'payload',submission.payload);
end $$;
create or replace function public.dmf_claim_notification(p_id uuid)
returns jsonb language sql security invoker set search_path = '' as $$
  select public.dmf_claim_notification_retry(p_id,false)
$$;

-- Fixed-size server-selected batch. SKIP LOCKED lets overlapping workers make progress.
create function public.dmf_claim_notification_batch()
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare candidate record; job jsonb; jobs jsonb := '[]'::jsonb;
begin
  for candidate in select id from public.notification_deliveries
    where attempts<5 and sent_at is null and next_attempt_at<=now()
      and (status in ('pending','failed') or (status='sending' and coalesce(lease_until,'-infinity'::timestamptz)<now()))
    order by next_attempt_at,id limit 3 for update skip locked
  loop
    job := public.dmf_claim_notification(candidate.id);
    if job is not null then jobs := jobs || jsonb_build_array(job); end if;
  end loop;
  return jobs;
end $$;
create or replace function public.dmf_finish_notification(p_id uuid,p_attempt_token uuid,p_status text,p_error text default null)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if p_status is null or p_status not in ('sent','failed','skipped') or length(coalesce(p_error,''))>100 then
    raise exception 'Invalid delivery result' using errcode='22023';
  end if;
  update public.notification_deliveries set status=p_status,last_error=p_error,lease_until=null,
    next_attempt_at=now()+make_interval(secs=>least(3600,60*(2^least(greatest(attempts-1,0),6))::integer)),
    sent_at=case when p_status='sent' then now() else sent_at end,updated_at=now()
  where id=p_id and attempt_token=p_attempt_token and status='sending' and lease_until>clock_timestamp();
  return found;
end $$;

-- Also probes the migration contract. A missing function/column must not look healthy.
create function public.dmf_notification_health()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'pending',count(*) filter(where status='pending'),
    'failed',count(*) filter(where status='failed'),
    'staleSending',count(*) filter(where status='sending' and coalesce(lease_until,'-infinity'::timestamptz)<now()),
    'exhausted',count(*) filter(where attempts>=5 and status<>'sent' and status<>'skipped'),
    'oldestPendingSeconds',coalesce(greatest(0,floor(extract(epoch from now()-min(updated_at) filter(where status='pending')))),0),
    'due',count(*) filter(where next_attempt_at<=now() and attempts<5 and status in ('pending','failed')))
  from public.notification_deliveries
$$;
revoke all on function public.dmf_claim_notification_retry(uuid,boolean),public.dmf_claim_notification_batch(),public.dmf_notification_health(),public.dmf_claim_notification(uuid),public.dmf_finish_notification(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.dmf_claim_notification_retry(uuid,boolean),public.dmf_claim_notification_batch(),public.dmf_notification_health(),public.dmf_claim_notification(uuid),public.dmf_finish_notification(uuid,uuid,text,text) to service_role;
commit;
