# M3 — Employer journey and request operations

## Audit and strategy

Base: `cf912ec` (M2). Production preflight: 0 inquiries, 1 lead (`new`), 1 trusted admin. Existing inquiries and leads use different statuses; no source records will be merged or rewritten. Homepage still mixes recruitment with a salary simulator; service pages are concise M2 placeholders. Profile forms lose company/source context. Cookie rejection requires extra clicks, settings cannot be reopened, and embedded services interpret consent inconsistently.

Priorities: reliable employer request context and safe operations → employer-focused pages/forms → consent, navigation and responsive polish. Existing M1 durable intake, idempotency and notification queue remain the receiving path. Existing M2 publication review remains authoritative. Use typed components, shared Zod validation, accessible labels/error focus, and existing design tokens.

## Implementation plan

1. Add bounded hiring/context fields to inquiries/leads. Keep contact/profile/lead receipt kinds compatible. One security-invoker inbox view reads both tables through their existing admin RLS. Add ownership, follow-up date, next action, notes and optimistic workflow revision.
2. Preserve status meanings: inquiries `new` → new, `in_progress` → active, `completed` → closed; leads `new` → new, `contacted`/`qualified` → active, `converted`/`lost` → closed. `completed` is not a sale. Edit each source's valid statuses without destructive migration.
3. A verified admin may select an existing trusted admin as owner. A narrow guarded directory helper returns only admin IDs and labels; no new users or privileges are created. Mutations use the signed-in client and RLS, validate inputs and reject stale revisions.
4. Build a shared employer form for the homepage, service routes and profile inquiry. Require company/contact/email/service/need; optional location/headcount/timing/phone. Preserve candidate ID, page path and bounded campaign identifiers; never forward personal form data to analytics.
5. Rework homepage and three service pages around employer fit, scope, responsibilities, process, FAQs and the request. Keep all existing URLs and languages. Use verified public profiles only; no fabricated references, prices, timings or guarantees. Move salary tools out of the main employer journey and clarify gross/net labels.
6. Make accept/reject/settings equally reachable, allow reopening settings, synchronize consent and gate optional embeds. Verify 360/390/768/1280px, keyboard, forms, menus and both consent choices.
7. Test actual SQL with PGlite and transaction-scoped production rollback fixtures; test real Next HTTP and browser journeys using an isolated local backend with outbound delivery disabled. CI, preview, migration, production verification and release record follow before handoff.

The latest allowlisted campaign survives client navigation in tab memory only and resets on document reload. The request keeps the actual submission page path. Admin search and detail show the same receipt reference given to the employer, with the historical record ID as a fallback. Consent revocation synchronizes across tabs, and clearing browser storage never restores an earlier in-memory grant.

## Inputs and scope limits

M2 profile/media consent, missing legacy candidate categories, official contact confirmation and business evidence remain pending. Do not publish or alter these facts by inference. Positive production email tests still need an agreed recipient; local/CI tests do not dispatch real mail. No paid service, new account, bulk migration or hosted staging is required for this milestone.

## Operations and release

Apply `20260929115942_employer_request_workflow.sql` before the M3 application. It is additive and keeps all historical values. Deploy through the existing Git → Vercel project `dmf-germany`; the unrelated duplicate project is not the serving project. SQL Editor migrations have not been reconciled with CLI migration history, so do not run an unattended `db push`.

In **Anfragen & Personalbedarf**, filter by source, processing stage, owner or overdue follow-up. Search accepts contact/company/profile and the employer's receipt reference. Open the request, assign an existing admin, record the next action and follow-up date, then save. A stale-edit warning means another change won: keep your intended notes, load the current record and reconcile before saving again. Internal notes and assignment changes do not send messages. Notification delivery/retry remains under **Benachrichtigungen**.

For application rollback, restore the prior verified Vercel deployment while retaining this additive schema and the existing RLS/publication guards. The intake function remains compatible with M1/M2 payloads. Preserve captured hiring/workflow data; do not drop the new columns, rewrite historical statuses or grant public table writes as a rollback shortcut. Real profile publication, verified business content, SMTP delivery and Search Console checks remain separate pending inputs.
