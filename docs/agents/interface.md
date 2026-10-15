# Interface implementation handoff

Updated October 15, 2026.

## October 15 public page and design refresh (merged in PR #2)

- The signed-out page moved to `src/components/landing/Landing.tsx`. `dashboard-client.tsx` renders it when there is no user.
- `PhotoSlideshow.tsx` is the historical photo slideshow; photo data is in `archive-photos.ts`.
- Shared drawings are in `src/components/illustrations.tsx`. Use them instead of emoji or icon fonts.
- Colors and fonts are tokens in `src/styles/globals.css`. Tailwind `violet`, `indigo`, and `slate` class names in dashboard components now resolve to the new blue palette and default slate. See [DESIGN.md](../DESIGN.md).
- `GettingStarted.tsx` shows first steps to new members. `DashboardCard` accepts an `id` for in-page links.
- Follow the writing guide in DESIGN.md for any new interface text.

## October 14 implementation notes

## Implemented

- Replaced static/sample landing and dashboard content with a community-first introduction and server-state-backed member experience.
- Added member marketplace search and category filtering across offers and wants, with both exchange entry points.
- Added own listing creation, editing, and archive actions through the community API.
- Added exchange requests in integer minutes, participant actions, private message threads, two-party completion controls, post-completion kudos, and signed ledger history.
- Added project creation, volunteer-hour contributions, owner close controls, fund donations and requests, facilitator review, notification read actions, urgent-alert preferences, and urgent request amplification.
- Added retry-stable request IDs to donation and project-contribution submissions; IDs stay stable after errors and rotate when input changes or a new dialog opens.
- Displays the member's total, available, and reserved time-credit minutes separately; accepted exchanges reserve credits until both people confirm, while cancellation releases the reservation.
- Added a received-kudos panel and use `initiator_id` to limit incoming exchange acceptance to the non-initiating participant.
- Corrected the time-credit explanation, matched title/description form constraints to the server validator, used category selects with preserved legacy values, and added virtual/in-person request filters.
- Removed the exchange-list display cap and refresh member state when the page regains focus or every 45 seconds while visible.
- Extracted exchange coordination and the action forms into `src/components/dashboard/ExchangeDesk.tsx` and `src/components/dashboard/DashboardDialogs.tsx` so the client entry point remains focused on state and orchestration.
- Added a typed, read-only QA fixture at `/qa/dashboard`. It returns 404 unless `NODE_ENV=development` and `BANK_QA_FIXTURE=1`; the fixture is not imported by the production page, omits account/edit dialogs, disables the dashboard subtree with `inert`, and has no working mutation controls. The API route also rejects mutations when the same fixture flag is enabled.
- Reworked feature cards and legacy modal components to use real data and action callbacks; removed obsolete fictional dashboard data.
- Added responsive visual styles and reusable form treatments. Listing and action dialogs use the shared accessible `Dialog`.

## Files

`src/app/dashboard-client.tsx`, `src/styles/globals.css`, `src/components/dashboard/*` except `Header.tsx`, `src/components/modals/*` except authentication/profile settings, and this file.

## Validation and remaining work

- `npx tsc --noEmit --incremental false` passes after root replaced `src/app/page.tsx` with the community state loader.
- Targeted ESLint passes for interface and fixture files. Prettier ran through `npm exec` without changing package files.
- Preview locally with `BANK_QA_FIXTURE=1 npm run dev`, then open `/qa/dashboard`; the panel is read-only and uses sample names/records solely for visual QA.
- `npm run typecheck` and targeted ESLint over the dashboard, exchange/dialog components, and fixture pass. Local database integration and concurrency tests are documented by the root/database handoff; hosted authentication and two-member browser journeys remain unverified.
- Read-only product review: the primary exchange flow and credit reservation behavior are represented in the UI. Before a small-community launch, verify the live migration and auth flows, decide whether the pilot is open or invitation-only (signup is currently email-confirmed but otherwise open), and provision a facilitator through a trusted administrative path. Fund review has no self-service role setup, and notifications are in-app only.
- The launch and community-activation sequence is in [ROADMAP.md](../ROADMAP.md). The current loader has bounded collection sizes; pagination is a follow-up before the pilot outgrows those limits.

## Final release status — October 14, 2026

The earlier notes above are implementation history. The app is now live, PR #1 is merged into main, and main CI passed. Hosted synthetic Auth/community QA passed, temporary data was removed, the final database audit passed, and the designated member setup email was accepted. Inbox delivery and user password setup are unverified. Cancellation and fund approval have local/native coverage but were not exercised in hosted QA. See HANDOFF.md and docs/DEPLOYMENT.md for current operational state.
