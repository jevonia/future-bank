# New Future Bank roadmap

Updated October 14, 2026. This roadmap is for reviving the existing time-bank concept with one small, real community. It prioritizes trust, personal introductions, and learning from actual exchanges over adding more software features.

## Current read

The local app now has the core exchange, reservation-aware integer-minute ledger, member listings, private exchange threads, projects, fund actions, urgent alerts, and a public introduction. The database migrations and local integration/concurrency tests cover important authorization and accounting cases. Hosted authentication, migrated-schema behavior, and two-member browser journeys have not yet been verified, so the application is not ready for a public invitation or production migration.

## P0 — Establish a safe launch boundary

Before inviting members:

- Confirm the exact Supabase and Vercel projects, production domain, redirect URLs, environment configuration, backup/restore path, and release branch. Keep the current production experience available until a tested replacement is ready.
- Inspect the live schema and legacy balances, then apply the migrations to a preview project first. Reconcile any prior exchange/transaction history and compare every account to its signed ledger. The migration intentionally retains legacy exchange tables instead of pretending old transfers are reconciled.
- Exercise signup, confirmation, sign-in, sign-out, recovery, profile editing, and the complete exchange with two confirmed preview members. Verify that a third member cannot read private messages, fund requests, or another member's ledger; verify reserved funds cannot be spent twice.
- Choose the membership boundary. Signup currently permits any person who can complete email confirmation; it is not an invite-only community or a member-approval system. If the first group should be closed, arrange a controlled invitation path before sharing the public URL.
- Provision at least one trusted facilitator using the documented privileged setup. The application cannot grant facilitator roles. Do not open community-fund requests until someone is responsible for reviewing them and the group has agreed on decision rules.
- Publish short community rules covering the one-hour/one-credit rule, the two-credit welcome grant for new accounts, privacy, consent and boundaries, cancellations, disputes, and what to do if help is not completed. Decide how existing members with zero or legacy balances participate; do not grant replacement credits ad hoc.

**Exit gate:** preview checks pass with two members and a third-party privacy check; balances match the ledger; the first facilitator, member boundary, welcome-credit policy, and support contact are known. Do not treat local test success or a successful production build as proof of hosted readiness.

## P1 — Run a deliberately small pilot

Start with roughly 10–20 people from one neighborhood, organization, or existing circle that already has a reason to trust one another. Name a human coordinator and make clear how members can contact them.

1. Invite people personally and explain that this is a time bank, not a paid marketplace. Ask each person to add one offer and one request during a short onboarding session.
2. Facilitate the first matches by hand. Help both people agree on scope, minutes, timing, accessibility, and cancellation expectations before accepting an exchange.
3. Encourage members to confirm completion promptly and check their ledger together after the first few exchanges. Ask what felt unclear or unsafe while the details are fresh.
4. Keep the first month simple. Projects can support an already-organized group effort. Hold off on fund transfers until the facilitator and members have agreed how requests are evaluated and reported.
5. For urgent requests, explain that notifications are currently in-app and appear while the member is using the dashboard or after a refresh. Use the community's established, consent-based channel for time-sensitive coordination during the pilot; do not imply email or push delivery.

Use learning signals, not growth targets: Did members find a match? How long did a request wait? Did both sides understand the reservation and confirmation steps? Did anyone return for another exchange? What requests went unanswered, and why? Review these with members weekly and adjust onboarding and norms before adding features.

## P2 — Stabilize from observed use

After the first handful of real exchanges, prioritize fixes that remove demonstrated friction or protect trust:

- Add pagination or load-more controls for marketplace, exchanges, messages, notifications, ledger, and contributions before the current bounded queries can hide relevant history. The loader caps several collections (for example, 200 exchanges and 200 ledger entries); this is acceptable only for an initial small pilot.
- Add hosted browser coverage for the account and exchange journeys, including retry behavior, reservation release, low available balance, two-party confirmation, and privacy between participants.
- Decide whether verified email is enough for the group's membership boundary. If not, implement and test a real invitation/approval mechanism before expanding beyond the original circle.
- Improve notification delivery only after asking members which channels they want and what they consider urgent. Preserve opt-in and avoid sending private exchange details to a shared channel.
- Move avatars to object storage if profile data URLs become a practical size or moderation problem.
- Make facilitation visible: a clear contact route and a documented response process for cancellations, disputes, unsafe requests, and account issues.

## Later — Extend the concept only when the community asks

- Improve matching using request criteria, availability, language, and location disclosure chosen by members. Do not infer or expose sensitive location data.
- Add project and fund reporting that members can understand, including agreed decision rules and a record of how shared resources were used.
- Refine the constellation and kudos based on whether members find them meaningful; they should recognize care without ranking people or turning participation into a score.
- Consider realtime updates, email/push notifications, recurring exchanges, or facilitator tools only after pilot feedback demonstrates a real need and the privacy and support costs are understood.

## Review limits

This roadmap is based on the current source, migrations, tests, and project handoff documents. It is a product and launch review, not a hosted security review. No hosted database migration, real-account browser journey, email delivery, or production release is claimed as verified.
