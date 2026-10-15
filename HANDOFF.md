# New Future Bank handoff

Updated October 15, 2026. The public page refresh below was merged through PR #2 and deploys to production from main. The October 14 app and hosted synthetic QA has passed. Synthetic records have been cleaned up and the original fund baseline restored. Verify delivery/setup for the accepted member email without exposing personal or credential details.

## Public page and design refresh (October 15, 2026)

This work was merged into main through [PR #2](https://github.com/jevonia/future-bank/pull/2) on October 15, 2026, after CI passed and the owner reviewed the Vercel preview. Production on the `future-bank` Vercel project builds from main. `NEXT_PUBLIC_COMMUNITY_CONTACT_EMAIL` is set in that project's Production environment to the owner's chosen coordinator address (not recorded here); it is not set for Preview.

What changed:

- New public page in `src/components/landing/Landing.tsx`, split out of `src/app/dashboard-client.tsx`. It tells the case for the time bank through four made-up neighbors and real, cited cost and loneliness statistics, followed by history, how it works, agreements, a FAQ, and a numbered Sources list.
- New look: blue, yellow, and red on white; system fonts (Verdana for text, Georgia for headings) chosen for readers of every literacy level; hand-drawn SVG illustrations in `src/components/illustrations.tsx` replacing the emoji. The signed-in dashboard picks up the same colors through remapped Tailwind scales.
- Public-domain historical photos of Black, Latino, and rural community life in a "How it used to look" section with a lead photo and a slideshow (twelve photos: seven from the Library of Congress, 1936 to 1943, and five color photos of Chicago, San Antonio, and Brooklyn from the National Archives, 1972 to 1974; city neighborhoods first), with credits and links to the original records.
- New favicon (`src/app/icon.svg`), phone home-screen icon (`src/app/apple-icon.tsx`), and link-preview image (`src/app/opengraph-image.tsx`).
- A first-steps checklist for new members (`src/components/dashboard/GettingStarted.tsx`) that hides once they have an offer, a request, and an exchange.
- Copy rewritten in plain language with no em dashes. Validation messages now say "3 to 20" instead of using a dash.
- Two optional settings: `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_COMMUNITY_CONTACT_EMAIL`.

The full design, writing, photo, and statistics guide is [docs/DESIGN.md](docs/DESIGN.md). Read it before changing the public page.

Checked: lint, typecheck, the 11 helper tests, the PGlite integration suite, and a production build pass locally and in CI. The page, the `/qa/dashboard` fixture, and the share image were reviewed in a browser at desktop and phone widths, and the owner reviewed the Vercel preview. Not yet checked: real phones and screen readers.

Decisions still open before sharing the link widely:

1. Done: the coordinator contact email is set in Vercel Production. Add it to Preview too if previews should show it.
2. Decide whether signup stays open or becomes invite-only for the first group.
3. Decide whether new members should check a box agreeing to the six agreements at signup. Today the page asks members to keep them but signup does not record agreement.
4. Done: the privacy policy and terms are one page at `/privacy` (`/terms` redirects to its second half), linked from the public footer and the sign-up form. It describes only what the code does today. Account deletion is still a request to the coordinator, done by hand. A lawyer or legal clinic should read the page once before the pilot grows, and it must be updated before any feature that keeps new member data ships.
5. Replace the made-up stories with real member stories, with permission, once the pilot has some.
6. Remove unused legacy components (`ServiceCard`, `ToolButton`, `CommunityPulse`, `CommunityProjects`, `ContributionConstellation`, `WelcomeModal`, `AmplifyModal`, `KudosModal`, `CommunityFundModal`, `src/components/icons.tsx`) and the default Next.js files in `public/`.

## Product rules

New Future Bank is a community time bank. One hour is 60 integer minutes, or one time credit. New accounts receive a recorded two-hour welcome grant; existing balances are preserved. Accepting an exchange reserves the requester's minutes, cancellation releases the reservation, and the balance transfer occurs only after both participants confirm. Project contributions record volunteer hours without minting personal credits. Facilitator roles require trusted administrative provisioning.

## Source, CI, and deployment

Commit `d864c6f` has been pushed. CI passed at [GitHub Actions run 38622472265](https://github.com/jevonia/future-bank/actions/runs/38622472265). The release was merged through [PR #1](https://github.com/jevonia/future-bank/pull/1) into main at `bf80508`; [main CI run 38629341354](https://github.com/jevonia/future-bank/actions/runs/38629341354) passed. The production deployment was automatically built from that merge and is READY. Later documentation-only updates retain the same application source.

Production deployment `dpl_5KN846JAkvzBDvtAqZnga5FUYPxe` is READY at [newfuturebank.com](https://newfuturebank.com/). The target remains Vercel project `future-bank`, ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`, scope `novas-projects-c5420b8e`; do not select `future-bank-org`. Production smoke checks passed: provider discovery reports Google disabled, `/qa/dashboard` returns 404, anonymous community API access returns 401, and cross-origin mutation returns 403.

Local lint, typecheck, 11 helper tests, PGlite migration/security tests, production build, and native PostgreSQL concurrency tests pass. Keep private environment and QA files under ignored `.private/`, `.env.local`, or `.vercel/`; never commit, display, or copy their contents into tracked docs.

Temporary local Supabase/Resend token files, downloaded production env copy, and QA password/session artifacts were removed after completion. The configured remote SMTP sending key remains active; the scoped rollback snapshot and sanitized verification evidence remain private. Operational scripts requiring those temporary credentials need fresh authorized access before future use.

## Supabase state

Supabase project `aitnqoqdkhvlgxuujowb` in TheVillage organization has migrations `20261014000100_bank_schema.sql` and `20261014000200_bank_rpcs.sql` applied. Fourteen postflight checks passed. The original profile/listing data and four Auth references were preserved. At migration postflight, the four existing accounts and their opening ledger amounts were zero minutes, with no discrepancy. Synthetic QA records were added after that check and have since been removed; the original fund baseline was restored. Do not reapply the migrations.

A scoped snapshot of affected public objects/data and Auth references was restored into native PostgreSQL, and a native clone dump restored independently. This does not cover a full Supabase restore of Auth credentials and Storage. Keep the recovery limitation explicit; the scoped SQL snapshot is not a full platform backup.

## Hosted Auth and email

The production Auth site URL and four exact callback URLs are configured. Public DNS checks match the Resend records, but the last dashboard status was **Pending**. SMTP and the signup-confirmation/recovery templates are configured, and actual signup/recovery emails were accepted. Hosted Auth QA passed three signups, email confirmation, server-side profile creation, and password recovery: the old password failed and the new password succeeded. The designated member setup message was accepted by the sender; inbox delivery and account setup remain unverified.

Google OAuth remains disabled because no provider client is configured. The deployed app hides Google sign-in while the Supabase provider is disabled. Do not report Google login as available.

## Hosted community QA

Synthetic hosted checks passed privacy boundaries, accepted-exchange reservation, donation and idempotency, settlement, project contributions, and urgent notifications. Hosted cancellation release was not tested; native/local cancellation tests passed. The hosted fund-review action was skipped even though a facilitator role has since been provisioned; native/local fund tests passed. Do not include the facilitator's email or personal account details in tracked documentation.

Synthetic Auth users and associated community records have been removed, and the original fund baseline restored. QA cleanup is complete. The real member setup/onboarding email was accepted by the sender; verify inbox delivery and member account setup without sending a duplicate unless needed.

## Next steps

1. Release integration is complete through [PR #1](https://github.com/jevonia/future-bank/pull/1); future changes should use a reviewed branch, passing CI, and the same Vercel project.
2. Follow up on inbox delivery and account setup for the already accepted member email. Do not claim delivery or password setup without confirmation, and avoid duplicate sends unless requested.
3. If the community fund will be used during the pilot, test hosted facilitator approval before inviting fund requests. Otherwise, defer fund activity until that check and the group's decision rules are ready.
4. Retain the Auth/Storage backup limitation in operational notes until a full recovery path is verified.

## Relevant files

- `src/app/auth/callback/route.ts`, `src/lib/auth-callback.ts`, and `tests/auth-callback.test.ts` cover the Auth callback flows.
- `supabase/templates/confirm-signup.html` and `supabase/templates/reset-password.html` are the configured email templates.
- `supabase/migrations/20261014000100_bank_schema.sql` and `supabase/migrations/20261014000200_bank_rpcs.sql` are already applied to the hosted project.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) records exact deployment and QA status; [`docs/DATABASE.md`](docs/DATABASE.md) explains the SQL contract; [`docs/ROADMAP.md`](docs/ROADMAP.md) records the activation plan.

Root owns live hosting, database, email, and browser operations. Coordinate before using the shared browser or changing hosted state. The development-only `/qa/dashboard` fixture requires `BANK_QA_FIXTURE=1`; it is read-only and never counts as production evidence.
