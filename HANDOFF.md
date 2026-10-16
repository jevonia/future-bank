# New Future Bank handoff

Updated October 15, 2026, evening. Start here. This page says what is live, what is still open, and where the details live. The exact verification record for every hosted change is [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Where things stand

- **Live site:** [newfuturebank.com](https://newfuturebank.com/) runs main at `8fd3f30` (merge of [PR #8](https://github.com/jevonia/future-bank/pull/8)). Main CI run [38836209100](https://github.com/jevonia/future-bank/actions/runs/38836209100) passed and the Vercel production deployment succeeded. Smoke checks after that deploy passed: the home, `/standing`, and `/privacy` pages load, Google sign-in is reported off, `/qa/dashboard` returns 404, anonymous community API writes return 401, and cross-origin writes return 403.
- **Database:** Supabase project `aitnqoqdkhvlgxuujowb` has all four migrations applied: the two bank migrations (October 14) and the two standing and safety migrations (October 15). Do not reapply any of them.
- **Members:** four real accounts, one facilitator. The facilitator is also the only Steward. No exchanges yet. All synthetic QA accounts and records from October 14 and 15 have been removed and verified gone.
- **Open PR:** [PR #5](https://github.com/jevonia/future-bank/pull/5) adds a first-meeting safety guide and an honest safety FAQ. It is Phase 0 of the standing plan and has not been merged.

## What has shipped

| PR | Merged | What it did |
| --- | --- | --- |
| [#1](https://github.com/jevonia/future-bank/pull/1) | Oct 14 | Revived the app: minute ledger, exchanges with reservations and two-sided confirmation, donations, projects, fund requests, urgent alerts. Bank migrations applied. |
| [#2](https://github.com/jevonia/future-bank/pull/2) | Oct 15 | Public page refresh: local stories, cited statistics, archive photos, plain design. See [docs/DESIGN.md](docs/DESIGN.md). |
| [#3](https://github.com/jevonia/future-bank/pull/3) | Oct 15 | Mobile header, onboarding copy, and slideshow accessibility fixes. |
| [#4](https://github.com/jevonia/future-bank/pull/4) | Oct 15 | Collapsible dedication on the home page. |
| [#6](https://github.com/jevonia/future-bank/pull/6) | Oct 15 | Privacy policy and terms at `/privacy` (`/terms` redirects to its second half). |
| [#7](https://github.com/jevonia/future-bank/pull/7) | Oct 15 | Community standing, vouching, the safety card, and the public `/standing` explainer. Standing migrations applied after merge. |
| [#8](https://github.com/jevonia/future-bank/pull/8) | Oct 15 | Docs recording the standing migration and the hosted standing QA. |

## Community standing and safety (live)

Phases 1 and 2 of the [standing and safety plan](docs/STANDING_AND_SAFETY_PLAN.md) are live:

- Four levels in plain words: New, Introduced, Known, Steward. A missing standing row means New. A level never limits access to the bank. It only controls who can say yes to a listing that asks for it, and who can vouch.
- Stewards create gatherings and check people in, which makes them Introduced. Known is suggested to stewards when its conditions are met, and a steward confirms it. Steward needs two nominations and a 14-day wait.
- Private concerns go to stewards, never to a public page. Stewards can pause a member, which stops new exchanges and never shows on a profile.
- Vouches are a sentence plus how you know the person. The "comfortable in your home?" answer is visible to stewards only.
- On exchanges: the first-meeting card, "Tell a friend," check-ins ("I'm here and it's going fine" / "Please have a steward call me"), and a private note for stewards after completion.
- "Who can say yes?" on offers and requests.

How it was applied (October 15): a read-only preflight, a private snapshot of affected rows, a rehearsed rollback, one guarded transaction, and 13 postflight checks, all passing. Afterward, 42 signed-in checks on the production site passed with synthetic members, who were then removed. Details are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The rules and the trusted SQL for naming stewards are in [docs/DATABASE.md](docs/DATABASE.md).

Not tested on production: "Please have a steward call me," because it would notify the real steward.

Not built: Phase 3 ("Care checked"), the "woman or nonbinary helper preferred" criterion (waits on member discussion), an on-call steward rotation (today every steward gets call requests), email or text delivery of call requests (in-app only), and removing an account from inside the app.

## Do these next

1. **Turn on Supabase backups.** The Management API lists no backups for the project and point-in-time recovery is off. The only recovery material is the scoped private snapshots in `.private/` from October 14 and 15, which do not cover Auth credentials or Storage.
2. **Revoke the Supabase access token** created on October 15 in the Supabase dashboard, then delete `.private/supabase-access-token`. The October 14 token was cleaned up the same way.
3. **Name the founding stewards.** Two or three people from the first circle, with the trusted SQL in [docs/DATABASE.md](docs/DATABASE.md), after they agree to the steward commitments in writing. Until then the facilitator is the only steward and receives every concern and call request.
4. **Schedule the first gathering** and post it from the dashboard. Paper sign-in sheets can be entered afterward.
5. **Review and merge [PR #5](https://github.com/jevonia/future-bank/pull/5)** (safety guide and FAQ) if it still fits after standing shipped.
6. **Follow up on the real member's setup email.** It was accepted by the sender on October 14; inbox delivery and account setup are unverified. Do not resend unless the member asks.
7. **Before using the community fund,** test hosted facilitator approval. It was skipped in hosted QA; native tests pass.

## Decisions still open

For the first circle (from the standing plan):

1. The words: "Steward" or "coordinator"? "Introduced" or "Met"?
2. Whether the Known thresholds (60 days, 3 exchanges with 2 members, 2 vouches) feel right. Keep `KNOWN_RULES` in `src/lib/standing.ts` in step with the SQL if they change.
3. Whether care work should default to "Introduced and up."
4. Whether to offer the "woman or nonbinary helper preferred" criterion, and how to word it.
5. Who the stewards are, and whether they are paid in hours.

For the coordinator:

1. Whether signup stays open or becomes invite-only for the first group.
2. Whether new members check a box agreeing to the six agreements at signup. Today signup does not record agreement.
3. Have a lawyer or legal clinic read `/privacy` once before the pilot grows. Update it before any feature that keeps new member data ships.
4. Replace the made-up stories on the public page with real ones, with permission, once the pilot has some.
5. Remove unused legacy components (`ServiceCard`, `ToolButton`, `CommunityPulse`, `CommunityProjects`, `ContributionConstellation`, `WelcomeModal`, `AmplifyModal`, `KudosModal`, `CommunityFundModal`, `src/components/icons.tsx`) and the default Next.js files in `public/`.

## Product rules

New Future Bank is a community time bank. One hour is 60 integer minutes, or one time credit. New accounts receive a recorded two-hour welcome grant; existing balances are preserved. Accepting an exchange reserves the requester's minutes, cancellation releases the reservation, and the balance transfer happens only after both participants confirm. Project contributions record volunteer hours without minting personal credits. Facilitator roles and founding stewards are provisioned only with trusted SQL after a human decision. A level of standing describes how well the community knows someone; it is never a safety promise, and the site says so wherever a level appears.

## Hosting and operations

- **Vercel:** project `future-bank`, ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`, scope `novas-projects-c5420b8e`. Production builds from main. Do not select the separate `future-bank-org` project, which also builds previews of every PR. `NEXT_PUBLIC_COMMUNITY_CONTACT_EMAIL` is set in Production only (value not recorded here).
- **Supabase:** project `aitnqoqdkhvlgxuujowb` in TheVillage organization. Production changes go through the Management API with a read-only preflight, a private snapshot, a rehearsed rollback, and postflight checks. The scripts are in `.private/` (`standing-migration.mjs` is the most recent pattern). Never run `supabase db reset` or the historical root-level SQL against a hosted project.
- **Auth and email:** production redirects, SMTP, and the confirmation and recovery templates are configured, and hosted signup, confirmation, and recovery passed. The last Resend dashboard status was **Pending** even though messages were accepted. Google OAuth is disabled and the UI hides it; do not report Google sign-in as available.
- **Secrets:** keep everything private under ignored `.private/`, `.env.local`, or `.vercel/`. Never commit, display, or copy their contents into tracked docs. Do not put member emails or personal details in tracked docs.

## Checks

`npm run lint`, `npm run typecheck`, `npm run test` (28 helper tests, the bank PGlite suite, and the standing PGlite suite), and `npm run build` pass locally and in CI. Native PostgreSQL concurrency tests passed on October 14. Hosted checks: October 14 Auth and core community QA, October 15 standing QA (42 checks), and the smoke checks after each production deploy. Not yet checked: hosted cancellation release, hosted fund approval, real phones, and screen readers.

## Relevant files

- `src/app/dashboard-client.tsx`: the signed-in dashboard. `src/components/landing/Landing.tsx`: the public page.
- `src/components/standing/`: standing cards, dialogs, steward desk, safety card, and the `/standing` graphic. `src/lib/standing.ts`: all level wording and the Known rules, shared by the page and the dashboard.
- `src/app/standing/page.tsx` and `src/app/privacy/page.tsx`: the public explainer and the privacy and terms page.
- `supabase/migrations/`: the four applied migrations, in order. `supabase/tests/`: the PGlite bank and standing suites and the native concurrency test.
- `src/app/auth/callback/route.ts`, `src/lib/auth-callback.ts`, and `supabase/templates/`: Auth callback and email templates.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): exact hosted state and verification. [docs/DATABASE.md](docs/DATABASE.md): the SQL contract and rules. [docs/ROADMAP.md](docs/ROADMAP.md): the pilot plan. [docs/DESIGN.md](docs/DESIGN.md): design and writing guide. [docs/STANDING_AND_SAFETY_PLAN.md](docs/STANDING_AND_SAFETY_PLAN.md): the reasoning behind standing.

Root owns live hosting, database, email, and browser operations. Coordinate before using the shared browser or changing hosted state. The development-only `/qa/dashboard` fixture requires `BANK_QA_FIXTURE=1`; add `?standing=new` for the New-member view. It is read-only and never counts as production evidence.
