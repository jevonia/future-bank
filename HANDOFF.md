# New Future Bank handoff

Updated October 14, 2026. The new app is deployed and hosted synthetic QA has passed. Synthetic records have been cleaned up and the original fund baseline restored. Finish PR/main alignment and verify delivery/setup for the accepted member email without exposing personal or credential details.

## Product rules

New Future Bank is a community time bank. One hour is 60 integer minutes, or one time credit. New accounts receive a recorded two-hour welcome grant; existing balances are preserved. Accepting an exchange reserves the requester's minutes, cancellation releases the reservation, and the balance transfer occurs only after both participants confirm. Project contributions record volunteer hours without minting personal credits. Facilitator roles require trusted administrative provisioning.

## Source, CI, and deployment

Commit `d864c6f` has been pushed. CI passed at [GitHub Actions run 38622472265](https://github.com/jevonia/future-bank/actions/runs/38622472265). Final PR/main alignment is still pending, so do not describe the work as merged or settled on `main` until confirmed.

Production deployment `dpl_2JumS368PxYf6uw8w5uJEQMnUhAN` is READY at [newfuturebank.com](https://newfuturebank.com/). The target remains Vercel project `future-bank`, ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`, scope `novas-projects-c5420b8e`; do not select `future-bank-org`. Production smoke checks passed: provider discovery reports Google disabled, `/qa/dashboard` returns 404, anonymous community API access returns 401, and cross-origin mutation returns 403.

Local lint, typecheck, 11 helper tests, PGlite migration/security tests, production build, and native PostgreSQL concurrency tests pass. Keep private environment and QA files under ignored `.private/`, `.env.local`, or `.vercel/`; never commit, display, or copy their contents into tracked docs.

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

1. Confirm PR/main alignment and that the deployed change is represented by the intended release commit. Record any CI run for the final SHA.
2. Follow up on inbox delivery and account setup for the already accepted member email. Do not claim delivery or password setup without confirmation, and avoid duplicate sends unless requested.
3. If the community fund will be used during the pilot, test hosted facilitator approval before inviting fund requests. Otherwise, defer fund activity until that check and the group's decision rules are ready.
4. Retain the Auth/Storage backup limitation in operational notes until a full recovery path is verified.

## Relevant files

- `src/app/auth/callback/route.ts`, `src/lib/auth-callback.ts`, and `tests/auth-callback.test.ts` cover the Auth callback flows.
- `supabase/templates/confirm-signup.html` and `supabase/templates/reset-password.html` are the configured email templates.
- `supabase/migrations/20261014000100_bank_schema.sql` and `supabase/migrations/20261014000200_bank_rpcs.sql` are already applied to the hosted project.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) records exact deployment and QA status; [`docs/DATABASE.md`](docs/DATABASE.md) explains the SQL contract; [`docs/ROADMAP.md`](docs/ROADMAP.md) records the activation plan.

Root owns live hosting, database, email, and browser operations. Coordinate before using the shared browser or changing hosted state. The development-only `/qa/dashboard` fixture requires `BANK_QA_FIXTURE=1`; it is read-only and never counts as production evidence.
