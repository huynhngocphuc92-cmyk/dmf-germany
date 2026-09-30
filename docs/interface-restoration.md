# Restore the original public interface

The owner explicitly requested restoration after M2/M3 replaced the original page structure. Visual baseline: initial checkout `4443279`. Base for this corrective release: `8a57841`. M4 is stopped; it has no application changes.

## Audit, strategy and boundaries

M2 replaced six detailed landing pages with a short template. M3 replaced the homepage, desktop/mobile navigation and candidate listing, and stopped rendering most configured homepage assets. Restore these layouts rather than redesigning them again. Use the equivalent M1 versions where they already contain mechanical lint/runtime fixes; compare against the initial checkout.

Preserve server authorization, RLS, public candidate DTO/publication checks, durable intake, notification outbox, admin operations, dependency updates, consent controls, canonical metadata and redirects. No database rollback or mutation is needed. Existing editorial copy/illustrations return with their original sections; restoration does not validate historical business claims. Never restore mock candidates/sample videos or publish private/draft candidates to fill the design.

## Plan and standards

1. Restore homepage section order, hero/background/overlay and configured partner/program/intro imagery; restore original header dropdowns, scrolling behavior and footer layout.
2. Restore six service/program landing pages, reference layout and candidate listing. Restore the compact profile form while retaining saved-receipt/idempotency behavior. Keep the existing contact form and backend.
3. Reconnect the original talent section to approved public profiles. Use its original section styling and an empty state when no approved profiles exist.
4. Keep strict types, no `any`, current validation and consent. Verify lint, types, database/intake tests, build and HTTP smoke tests. Adjust only editorial expectations superseded by the explicit restoration request.
5. Inspect desktop/mobile rendering and navigation, theme assets, contact/profile submission against the isolated fixture backend, then create a PR and deploy through the existing production Git integration. Verify the deployed commit/domain and public/admin boundaries.

Any further redesign requires an explicit visual review with the owner. This restoration is already authorized for the live website.

## Validation before release

- All 95 tests pass; lint and TypeScript pass. Production build and the existing HTTP smoke suite pass against the isolated backend (17 canonical pages, public-field filtering, private API denial, persisted/idempotent intake, admin inbox and blog redirects).
- Browser: original contact form and compact profile form submitted synthetic records successfully; both appeared in the authenticated fixture inbox, including the selected profile ID. Outbound delivery is disabled in this environment; no real email was sent.
- Original dropdown groups and language switch work. Checked 360/390/768/1280 px layouts. Retained small compatibility corrections for header overlap, tablet menu width, keyboard dropdown access, modal scrolling and outline-button contrast. Mobile roadmap text is allowed to wrap within its card.
- Source comparison confirms the original homepage section order and six detailed landing pages. Authentication, API handlers, Supabase helpers, migrations and notification code have no changes in this release.
- Local fixtures intentionally have no branding assets; real configured images must be checked on the connected Vercel deployment before completion.
