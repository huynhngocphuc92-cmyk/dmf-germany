# M2 — Publication and SEO

## Audit and strategy (2026-09-29)

Base: c973263. Root metadata inherits the homepage canonical into routes; four domains conflict across metadata/robots/JSON-LD. Robots blocks Next assets. Blog mutations miss sitemap and old-slug invalidation. Candidate publication is coupled to `is_featured`; four live profiles are featured and one has a sample name. Existing approvals cannot be inferred. Public hardcoded talent cards, reference maps, statistics and guarantees lack provenance.

Priority: explicit publication boundary → consistent URLs/cache → remove unverified public content. Preserve stored candidate/business records. Existing candidates start as drafts; admins review the actual public projection, record consent evidence and a validity date, then publish. Editing public fields returns a profile to draft. Featuring is independent. Expired/withdrawn profiles cannot accept new inquiries. Existing private columns remain private.

## Implementation / verification plan

1. One canonical site configuration and route-specific metadata; noindex private routes; sitemap only current public URLs; no `_next` crawl block.
2. Additive candidate review fields and database publication policy; dedicated admin preview/review actions; revalidate homepage/pool after changes. Validate at both action and database boundaries.
3. Preserve old blog slugs with an atomic database trigger; redirect only to a published target; invalidate list/detail/old slug/sitemap on every mutation. Reject reserved/colliding slugs.
4. Remove public sample profiles, sample media and unsupported proof claims; maintain a content evidence register. Do not invent contacts, consent, results or credentials.
5. Verify with PGlite policy/transition tests, HTTP metadata/redirect/publication smoke, lint/typecheck/build and browser checks. Apply reviewed migrations before application deployment; record exact CI/deployment and post-release checks.

## Pending business inputs

DMF must confirm which profiles/media may be public, official company/contact details, evidence and dates for success metrics, certifications and references. No profile is auto-approved by this release. Existing contact details are retained pending confirmation; legal entity details are not invented. Real email delivery and hosted staging remain M1 operational follow-ups, outside this release.

## Deployment / rollback

M0/M1 migrations were applied through SQL Editor; reconcile CLI migration history before `db push`. M2 migration is additive except replacement of public publication predicates. Preserve existing `is_featured` values and candidate content; new publication status defaults to draft. Rollback application must keep the stricter database boundary; do not restore broad public reads. Source and previous content remain recoverable in Git.

## Rendering and content decisions

Public candidate pages read on each request so withdrawal/expiry is not held in ISR. Blog metadata is resolved before the response starts; the former root loading boundary is scoped to admin to prevent streamed 200 responses for redirects/not-found. Static public pages remain prerendered. Measure TTFB in M4 before adding a publication-aware cache.

Six service/preparation pages now share a concise German/English/Vietnamese editorial template. Their routes stay intact. The previous extensive templates contained unsupported counts, visa guarantees, credentials and timings; Git retains them as historical source, not approved copy. M3 will expand the employer journey using confirmed business content. Homepage statistics, mock talent pool, partner banner and mock reference map are removed from the rendered website. The chatbot uses the same conservative information scope.

## Admin operation

1. **Kandidaten → bearbeiten:** save the candidate's real details. Public-field edits automatically return an approved profile to draft; featuring alone does not.
2. **Vorschau & Freigabe:** inspect the public card. Enter the internal location/date of consent evidence, choose the last public day (UTC), and confirm the profile/media/availability review.
3. **Geprüftes Profil veröffentlichen:** publishes only if the profile revision is still current. A concurrent edit requires a reload and a new review. Sample names/video and missing profession/consent are rejected. `is_featured` only controls homepage promotion.
4. **Veröffentlichung zurückziehen:** immediately removes the profile from new website responses and prevents new profile inquiries. Previously accepted requests remain in the inbox; existing request-id retries remain idempotent.
5. Profiles expire automatically after their validity date. Review and extend the date explicitly when the candidate remains available. The website has an honest empty state while no profiles are approved.
6. Blog slugs use lowercase letters, numbers and single hyphens. Published slug changes preserve former addresses and redirect directly to the current published slug. Withdrawn/deleted posts expose no active alias. A former URL cannot be taken by another post.

Candidate images remain in the existing public storage buckets. Withdrawing a profile does not make a previously distributed image URL private. No private-storage migration was bundled into this milestone.
