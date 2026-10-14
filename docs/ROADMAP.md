# New Future Bank roadmap

Updated October 14, 2026. This roadmap is for reviving the existing time-bank concept with one small, real community. It prioritizes trust, personal introductions, and learning from actual exchanges over adding more software features.

## Current read

The connected production Supabase project has both bank migrations applied and passed postflight checks. Existing account/listing data was preserved; at migration postflight the four existing accounts and opening ledger amounts were zero minutes with no discrepancy. Hosted synthetic QA later added records, which have since been removed; the original fund baseline was restored. The deployed app is READY at `newfuturebank.com`. Production smoke checks passed, and hosted synthetic-user QA passed for signup, confirmation, recovery, privacy, reservation, donation/idempotency, settlement, projects, and urgent notifications. Local helper/PGlite and native PostgreSQL concurrency suites pass, and CI passed for pushed commit `d864c6f`.

Synthetic QA accounts and records have been removed, and the original fund baseline was restored. The real member setup message was accepted by the sender; inbox delivery and account setup are unverified. Final PR/main alignment remains pending. Hosted cancellation-release and fund-review actions were not tested; native tests passed, and a facilitator is provisioned. Google OAuth remains disabled. A scoped database snapshot was restored successfully, but full Supabase Auth credential and Storage recovery has not been verified. See [Deployment status](DEPLOYMENT.md) for the precise scope of verification.

## P0 — Establish a safe launch boundary

Before broader member onboarding:

- Verify PR/main alignment for the deployed code and follow up on delivery of the already accepted member setup message. Do not send a duplicate unless requested; account setup is not confirmed.
- Keep the production migration evidence and scoped recovery limitations recorded. Existing exchange and transaction history remains preserved in legacy tables rather than converted into the new ledger. Resolve any future historical credit policy explicitly; do not silently mint or discard credits.
- The production app, SMTP, confirmation/recovery templates, and hosted core exchange have already passed synthetic QA. Keep Google sign-in disabled unless its provider is configured and tested. Hosted fund review remains unverified; test it with the provisioned facilitator or defer fund use until it is.
- Choose the membership boundary. Signup currently permits any person who can complete email confirmation; it is not an invite-only community or a member-approval system. If the first group should be closed, arrange a controlled invitation path before sharing the public URL.
- Confirm the provisioned facilitator is the trusted community contact and that the group has agreed on fund-request rules. The application cannot grant facilitator roles. The hosted approval path still needs a test before opening fund requests.
- Publish short community rules covering the one-hour/one-credit rule, the two-credit welcome grant for new accounts, privacy, consent and boundaries, cancellations, disputes, and what to do if help is not completed. Decide how existing members with zero or legacy balances participate; do not grant replacement credits ad hoc.

**Exit gate:** synthetic QA records are cleaned up, the live branch/PR state is settled, and the real member confirms receipt/setup or reports a blocker. Before treating the community fund as part of the pilot, the hosted facilitator approval path and group decision rules must also be verified. Full Auth/Storage recovery remains a known operational limitation.

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
- Preserve the successful hosted synthetic QA as repeatable regression coverage where practical, including retry behavior, reservations, low available balance, two-party confirmation, and privacy between participants. Cancellation-release behavior is currently covered by native tests only; add a hosted check separately. The one-off hosted checks are not a substitute for CI coverage.
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

This roadmap is based on the current source, migrations, tests, and project handoff documents. It is a product and activation plan, not a hosted security review. The production SQL migration, app deployment, hosted synthetic Auth/email/core-community QA, synthetic-data cleanup, and CI run are complete. Sender acceptance of the real member setup message is confirmed, but inbox delivery/account setup, final PR/main alignment, hosted cancellation release, hosted fund approval, and complete Auth/Storage restore are not yet verified.
