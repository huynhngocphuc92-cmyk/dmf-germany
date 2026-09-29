# M1 implementation

The next release builds on M0 commit `09ecb0d` and keeps German employer enquiries as the primary workflow.

Observed production mismatch: `inquiries` lacks `company`, `candidate_id`, `candidate_code` and `updated_at`; contact/profile routes attempt to write these columns. Some routes return success after notification delivery even when persistence fails. Browser callers can invoke the generic Telegram endpoint. Database policies for inquiries, posts, theme and Storage authorize any signed-in account rather than the trusted admin role.

Implementation order:

1. Add the missing inquiry fields and a transactional, idempotent intake RPC. Preserve existing inquiries/leads and keep their current admin views.
2. Persist notification jobs with each accepted request; dispatch on the server and expose failure/retry controls to verified admins. Customer success means durable acceptance. Notifications use only stored, validated requests.
3. Use database-backed rate limits across server instances. Fail closed on production backend failure. Restrict public database writes after application cutover.
4. Complete admin RLS/Storage boundaries while preserving published blog/media reads.
5. Pin targeted dependency updates, resolve lint errors and add CI with synthetic data, no production credentials or outbound notifications.
6. Validate locally, on preview, and on production. Apply additive schema first and revoke legacy public intake only after the new deployment is ready.

The backend requires a server-only Supabase secret/service-role key. Preview writes and notifications stay disabled unless an isolated test backend is explicitly configured. SMTP/Telegram delivery is tested with stubs; sending a real test notification requires an explicitly agreed recipient/channel.

## Running and verifying locally

Use Node 24 (`nvm use`), `npm ci`, and copy `.env.example` to `.env.local` with an isolated test Supabase URL/public key and server key. Production builds reject missing required variables or a backend key in the public key variable. Do not copy production credentials into local files or CI.

Run `npm run lint`, `npm run type-check`, `npm test`, and `npm run test:smoke`. The smoke command builds Next.js and exercises real HTTP routes against an in-process fixture backend, with external delivery disabled. PGlite tests apply the actual migrations and exercise PostgreSQL privileges, RLS, atomic receipts, rate counters and delivery leases. CI runs the same checks after `npm ci`, plus an audit of the lockfile. It requires no deployment/backend secrets.

Vercel Preview cannot write to the production Supabase project, even if someone mistakenly supplies a production server key. To enable preview intake, configure a separate migrated Supabase project and set `INTAKE_TEST_BACKEND=true`. All Preview notifications remain disabled. No hosted staging database or real test email/channel has been provisioned in this release; positive intake tests use isolated local/CI fixtures. Production uses the existing configured SMTP/Telegram destinations. Local delivery requires `NOTIFICATION_DELIVERY=enabled` and an agreed test destination.

## Deployment order and recovery

1. Apply `20260929100707_reliable_intake.sql` to the verified `dmf-manager` project (`iihprcuhmilmymlbktpy`). This adds columns/tables/functions and preserves existing customer rows. The historical email uniqueness index, if present, is replaced by request-ID deduplication; production had no such index. Existing requests and chat RPCs continue to work during cutover.
2. Ensure the server-only `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` is present in Vercel **dmf-germany**, Production only. This release uses the existing service-role key. Never prefix it with `NEXT_PUBLIC_`.
3. Deploy the tested commit to that project and verify the new route/UI behavior. Do not promote a Preview artifact built with test environment values into Production; create a Production build with Production configuration.
4. Apply `20260929100708_admin_data_boundaries.sql` and `20260929100748_server_only_intake_cutover.sql`. These restrict legacy direct writes while retaining public published content/media reads and trusted admin workflows.
5. Verify the live database with transaction-scoped synthetic fixtures followed by `ROLLBACK`; no customer notifications are dispatched by those SQL checks. Check the actual signed-in admin UI and anonymous HTTP access after cutover.

Database changes are additive or permission-tightening. Stop before a failed stage; do not drop new tables or delete receipts to roll back. Before the permission cutover, the previous M0 application remains compatible with the additive migration. After cutover, prefer a forward fix on the M1 intake path; an M0 app rollback alone would break public submissions because its old public RPC permissions are revoked. Never restore broad anonymous/authenticated access as a shortcut. Supabase dashboard application does not reconcile CLI migration history; inspect/reconcile the existing history before a future `db push`. A production data restore/backup drill has not been performed here (M4).

## Operating incoming requests and notifications

Customer success means the inquiry/lead, receipt and notification jobs committed in one PostgreSQL transaction. An email/Telegram failure does not remove the inquiry or turn acceptance into a false failure. An idempotency key is reused across retries of the same form payload; changed content/new form intent gets a new key. A reused key with different content returns 409. Already-open legacy forms without a key remain accepted but cannot deduplicate a network retry.

Open **Admin → Benachrichtigungen** to see unfinished deliveries first; use **Alle Zustellungen** for history. The request reference groups channels from the same submission. Resolve a missing-provider configuration and select **Erneut senden** on the affected row. The action verifies admin access and rate limits retries. A sent job cannot be claimed again. A `sending` lease expires after five minutes so interrupted work can be recovered. Pending jobs left by a terminated `after()` callback require an admin retry; this release does not introduce a recurring worker.

Delivery is at least once: a provider may accept a message immediately before a process dies or database acknowledgement fails. A later retry can send it again. Stable email message IDs help tracing, but SMTP/Telegram do not promise exactly-once delivery. `sent` means accepted by the provider, not that the recipient read it or the email reached their inbox. Error storage contains bounded internal reason codes, never provider secrets or submitted content.

Production rate limits are atomic shared database counters, keyed by an HMAC of the request identifier; raw client IPs are not stored. Backend failure returns an error instead of falling back to an unshared production counter. Local development without a backend uses a bounded memory counter only. Client-IP headers follow [Vercel's documented forwarding rules](https://vercel.com/docs/headers/request-headers); requests behind an external proxy can share a bucket, which should be considered before changing DNS/proxy routing.

## QA exceptions

Lint runs with zero warnings. Two admin image previews intentionally use native `img` for original upload/data/blob URLs; inline explanations scope the exceptions to those elements. Maintenance scripts may print console output; application code still forbids `console.log`. Dependency updates are pinned for Next.js, Supabase, Tiptap, Nodemailer and Sentry; the lockfile audit reports zero known vulnerabilities at validation time. That audit is a dependency check, not proof that the whole application is free of vulnerabilities.
