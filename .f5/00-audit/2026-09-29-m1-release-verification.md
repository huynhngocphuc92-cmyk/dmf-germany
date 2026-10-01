# M1 release verification — 29 September 2026

- Repository: huynhngocphuc92-cmyk/dmf-germany; PR [#2](https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/2), merged as `ce0e0cfab3fbd5ed5c5c99b598d863d636a2b3f8`.
- Primary Vercel project: `dmf-germany`, Production deployment `D99vpGs1DzPVgxSXx5ZWSW5WMALa`; domain `https://www.dmf-talents.de`.
- Supabase: `dmf-manager`, ref `iihprcuhmilmymlbktpy`.
- Existing service-role key copied directly from the correct Supabase dashboard to a Vercel Secret for Production only, at the user's explicit request. Not recorded in code, local environment files, logs, or chat.

## Verified before release

- Local: 77 tests pass, type-check passes, lint has zero warnings. Production build/HTTP smoke tests use a local fixture backend and no real outbound notification credentials.
- [GitHub CI 36557341008](https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36557341008) passed on `7fda4d0`: clean npm install, lint, type-check, tests, dependency audit and production build/HTTP smoke.
- Primary Preview `Fa15bKLGqW1Lg7FrzsXAAaJa7oMy` is Ready. The public form retained inputs and displayed an error when submitting a synthetic `.invalid` address, confirming preview intake did not write to production. Database afterwards showed zero fixture receipts and zero notification jobs.
- Additive migration `20260929100707_reliable_intake.sql` applied successfully through Supabase SQL Editor. New tables have RLS enabled and the public intake RPC rejects anon execution. No user-defined triggers on inquiries/leads/new intake or delivery tables.
- Live transaction under `service_role` verified one durable inquiry/receipt for a duplicate key, three outbox jobs, exclusive delivery leasing, failed-job retry, and an atomic rate counter. All fixtures were rolled back. No real notification was dispatched.
- Vercel SMTP and CONTACT_EMAIL variables already exist. Telegram variables are absent. No real SMTP delivery/inbox arrival was tested.
- The duplicate Vercel project `dmf-germany-hb75` fails its separate deployment because it has no NEXT_PUBLIC_SUPABASE_URL/ANON_KEY. It is not the active domain project and was not reconfigured.

## Release completion

The M1 application and all three migrations are deployed and verified. Confirmed results and the final UI follow-up are recorded below.

Confirmed at 17:48–17:51 ICT:

- Production `D99vpGs1DzPVgxSXx5ZWSW5WMALa` is **Ready**, build duration 1m44s, serving `www.dmf-talents.de`, source `ce0e0cf`.
- Main-branch [CI 36557637351](https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36557637351) passed on the merged commit.
- Actual HTTPS requests: homepage/candidate list/blog 200; anonymous chat-history and lead reads 401 with no-store; legacy Telegram endpoint 410. A syntactically valid profile enquiry for an independently verified absent UUID returned the specific database-backed unavailable-profile 400, verifying the production server key, shared rate RPC and intake RPC without creating a lead or dispatching notifications.
- Admin-boundary and server-only cutover migrations both applied successfully. Live transaction verified anon RPC/column denial, simulated authenticated non-admin denial, actual existing admin create/read/update access, six restrictive Storage boundaries, and service-only chat execution. Fixtures were rolled back.
- The same production HTTP probe passed again after cutover. Signed-in administrator can open the new notifications page and the requests page without an error. Notifications are empty, consistent with the absence of test jobs.
- Narrow viewport inspection uncovered an existing mobile-sidebar wrapper width bug: a closed menu overlapped content. The UI follow-ups below correct this issue; no schema changes were needed.

UI follow-up:

- PR [#3](https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/3), merged as `33e0966`; CI 36558298558 passed. Production `C7re6gmnwgXgxBtGd5VqwguxG5Vu` is Ready. Screenshot/AX inspection confirms the closed mobile sidebar no longer covers the notifications page or appears in the accessibility tree.
- The same inspection exposed the fixed public header covering the admin header's controls. PR [#4](https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/4) hides the public header on admin routes and aligns chatbot instructions with form-confirmed intake instead of promising action on plain chat messages.
- Runtime log filter for Error/Fatal on deployment `D99vpGs1DzPVgxSXx5ZWSW5WMALa`, last 30 minutes at approximately 17:54 ICT: no matching request logs. This is a bounded check, not continuous monitoring or proof of real email delivery.

## Final handoff

- Final production source: `c9732632ab19756de72a2853868e07ca0bde464b`, branch `main`, with PRs #2, #3 and #4 merged and attached to this task.
- Final [Production deployment](https://vercel.com/huynhngocphuc92-cmyks-projects/dmf-germany/3dujo1aeBxxbWnLzhFkGPzoxw66E) is **Ready**, build duration 47s, serving `www.dmf-talents.de` at 18:02 ICT.
- PR #4 final [CI 36558912943](https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36558912943) passed on `1446d74`: 77 tests, lint, type-check, audit and production HTTP smoke.
- Final main-branch [CI 36559189536](https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36559189536) also passed on `c973263`; final homepage HTTP check returned 200.
- Actual production admin session after reload: public header is absent, admin menu control is visible, the closed sidebar is absent from the accessibility tree, keyboard opening reveals navigation, selecting Notifications closes it again. Screenshot inspection at the browser's default narrow viewport confirms content is readable. No viewport override remains.
- [Notifications](https://www.dmf-talents.de/admin/notifications) is left open for the user. Local checkout is synchronized to `main` / `c973263`; the original local audit/roadmap files were preserved.

Remaining operational limits: no hosted staging Supabase project has been configured; previews are prevented from using production admin/intake paths. Real email delivery/inbox arrival was not tested (SMTP configuration is retained); Telegram is unconfigured. Jobs require manual retry if the immediate background attempt is interrupted. See the committed [operating guide](../../docs/m1-implementation.md) for these delivery semantics and rollback constraints. No real customer records were removed or changed during verification, and no test notifications were sent.
