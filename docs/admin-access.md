# Administrator access

Every private data action and admin API must verify the caller with Supabase `auth.getUser()` before using a database or service-role client. Use `requireAdmin`, `createAdminClient`, or `createPrivilegedAdminClient` from `lib/auth/admin.ts`. A page redirect is not an authorization boundary.

Membership requires the server-controlled Supabase `app_metadata.role` to be exactly `admin`. Anonymous Auth users, ordinary authenticated users, and `user_metadata.role` never grant access. With no trusted membership, access is denied. Do not add a public environment variable, an email-domain rule, or an “all logged-in users” fallback.

The database helper checks current membership in `auth.users` by verified `auth.uid()`, so database access is revoked immediately when the trusted role is removed. It does not rely on a stale role embedded in an older JWT.

## Release procedure

1. Identify the existing administrator in the correct project's Supabase Authentication users. Record their UUID privately. Preserve all existing `app_metadata` fields when setting `role` to `admin`; do not grant membership to an unverified account.
2. Verify environment scope separately for Preview and Production. Never copy production service keys or customer rows into local fixtures. Database and application membership use the same trusted role.
3. Inspect and retain the live schema/grants/policies for the three affected tables. Apply `202609290001_safe_public_intake.sql` first: it adds ownership hashes and restricted intake RPCs without changing the old routes. Public intake uses the anon key with narrowly scoped RPCs; no new service key is required. Configure the verified existing administrator's trusted role before switching application code.
4. Run `npm test`, `npm run type-check`, and `npm run test:smoke` in an isolated checkout. The smoke test builds and serves the app against a local fixture backend, checks both public candidate pages including serialized data, and verifies anonymous API/page denial. It defaults to port 4198 (`SMOKE_PORT` overrides it).
5. Deploy a preview. Verify real administrator sign-in, list/export/update workflows, a non-admin denial, anonymous website contact/chat behavior, and the correct candidate ID in profile requests using approved test data. Avoid sending test notifications to customers.
6. Deploy the verified commit, then apply `202609290002_private_data_policies.sql` to restrict direct table/column access. The second migration is transactional and changes no customer rows. It preserves admin reads/writes, permits only approved candidate fields for anon, and blocks direct anon chat/lead access. Invalidate any old public HTML/RSC caches and verify both candidate pages and private APIs on the canonical production domain. Recheck after cache expiry. Record the deployed commit and the outcome; a successful build alone is not production verification.

## Public intake

Chat updates require a 256-bit token held in an HttpOnly, SameSite cookie. Only its SHA-256 hash is stored. The RPC atomically verifies ownership before an update; knowing a session ID or the stored hash is insufficient. Legacy chat rows remain read-only to visitors. The chatbot starts a new owned session on an ownership denial and retries once, retaining the visitor's current conversation text.

Lead submissions insert new rows only. They never update an existing row by email. With an existing unique email index, a duplicate is accepted without modifying the original; without that index, a repeat request is stored separately. Responses do not reveal existing customer IDs. Failed persistence returns an error.

## Public candidate data

`lib/supabase/candidates.ts` selects only the fields in `PUBLIC_CANDIDATE_FIELDS` and requires `is_featured=true`, the existing explicit publication control. `visa_status` never grants publication. Empty/error queries do not fall back to unrestricted profiles. The runtime schema strips unknown columns; public components receive `PublicCandidate`, not the admin database model.

The public contract includes a profile ID, category, profession, experience, German level, visa readiness, and approved media URLs. Names, contact details, dates of birth, and internal notes stay out of public props. Invalid profiles are omitted. Publication approval also needs to cover the media and text itself; a field allowlist cannot anonymize information embedded in an approved image, video, or profession text.

## Recovery

For a legitimate admin denied after release, verify their identity in Supabase and correct the trusted `app_metadata.role`, preserving other metadata. Reauthenticate to obtain a current session. Do not bypass the guard. Keep a known-good deployment reference; rolling back to a build with the original public-data paths would reintroduce that exposure.
