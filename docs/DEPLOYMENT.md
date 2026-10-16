# Deployment and release status

Updated October 14, 2026. The bank migrations are live and the new app is deployed at the existing production domain. Production smoke checks, hosted email/authentication QA, and hosted core-community QA have passed for synthetic users. Synthetic QA accounts and records have been cleaned up and the original fund baseline restored. The real member setup email was accepted by the sender, but inbox delivery and account setup are unverified. The release was merged through [PR #1](https://github.com/jevonia/future-bank/pull/1) into main at `bf80508`; [main CI run 38629341354](https://github.com/jevonia/future-bank/actions/runs/38629341354) passed.

## Standing and safety migrations (applied October 15, 2026)

`20261015000100_standing.sql` and `20261015000200_vouches_and_safety.sql` (standing and safety, Phases 1 and 2) were applied to Supabase project `aitnqoqdkhvlgxuujowb` on the evening of October 15, 2026, after [PR #7](https://github.com/jevonia/future-bank/pull/7) merged to main at `cfd8d22`. `supabase_migrations.schema_migrations` now records all four versions. Do not reapply them.

- **Preflight (read-only):** migration history was exactly the two October 14 versions; none of the new tables, functions, or `min_standing` columns existed; the three replaced functions matched the repo source; the ledger reconciled with no mismatches. Four members, one facilitator, one offer, one want, no exchanges.
- **Backup:** the Management API listed **no Supabase backups** for the project, and point-in-time recovery is off. Before the write, a private read-only snapshot of profiles, accounts, offers, wants, member roles, ledger entries, and the live definitions and grants of the three replaced functions was saved under `.private/`, together with a rollback script built from those definitions. The rollback was rehearsed. Turning on platform backups is still open.
- **Rehearsal:** the exact request was run in PGlite on a fixture with the live functions and Supabase's default grants, then rolled back (schema and grants matched the prior state exactly) and re-applied.
- **Apply:** one serializable transaction through the Management API, guarded against drift since preflight, pinned to the rehearsed SQL by hash. HTTP 201.
- **Postflight:** all 13 read-only checks passed: four migration versions; RLS on all 12 new tables; no client writes and no anonymous reads on them; the vouch `home_answer` column hidden from members; no anonymous execute on any standing function; members can execute exactly the granted RPCs; pinned empty search paths; one `bank_save_listing`; the facilitator backfilled as Steward with one `standing_events` row; offers and wants unchanged apart from `min_standing='anyone'`; ledger reconciles; Auth, profile, account, and ledger counts unchanged. Anonymous REST calls to `bank_member_standing`, `bank_steward_vouches`, and the `vouches` table return 401 permission denied.
- **Signed-in flows:** checked on the production site the same evening; see the hosted standing QA below.

## Hosted standing QA (October 15, 2026)

Three synthetic members signed up and confirmed email on `newfuturebank.com` the way the October 14 hosted QA did. One of them was made a steward with a single guarded SQL insert. All 42 checks passed:

- **Your standing:** a New member's dashboard shows the "Your standing" and Gatherings cards.
- **Gatherings:** a steward created a gathering and checked a member in, and that member became Introduced. Members who aren't stewards can't create gatherings or check people in.
- **Who can say yes?:** an "Introduced and up" offer turned away the New member's request with the "met in person" message. The Introduced member's request went through.
- **Concerns:** a concern was visible to the reporter and to stewards, but not to the member it was about. The reporter saw the steward's reply, but not the steward's working notes.
- **Vouches:** members and the vouched-for member couldn't read `home_answer` (column denied, steward RPC denied, absent from their dashboard). A steward could read it.
- **Exchanges:** the first-meeting plan was shared only between the two people on the exchange. An "I'm fine" check-in was seen only by the person who wrote it.

The gathering was dated 45 days back, so it sent no all-member notice and never appeared on real members' cards. "Please have a steward call me" was not tested because it would notify the real steward. The concern test sent the one real steward a single in-app notice, which the user approved ahead of time.

A guarded cleanup removed every synthetic account and record, including that one notice. A read-only count then found zero remaining rows across Auth, profiles, accounts, ledger, notifications, and all 12 standing and safety tables. Steward, gathering, concern, and vouch totals match the preflight. The run's local session file was deleted. The scripts, manifest, and results are in `.private/` (`hosted-standing-qa*.mjs`, `hosted-standing-qa-results-<run>.json`).

## Current state

- **Vercel:** target `future-bank`, project ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`, scope `novas-projects-c5420b8e`. Do not select the separate `future-bank-org` project. The production branch setting is `main`; Node.js 22 and the existing `newfuturebank.com` association were verified. Production deployment `dpl_5KN846JAkvzBDvtAqZnga5FUYPxe` is READY. Production smoke checks passed: provider discovery reports Google disabled, `/qa/dashboard` returns 404, anonymous community API access is denied with 401, and a cross-origin mutation is denied with 403.
- **Supabase:** project `aitnqoqdkhvlgxuujowb` in TheVillage organization. Migrations `20261014000100_bank_schema.sql` and `20261014000200_bank_rpcs.sql` were applied atomically through the Management API. Fourteen postflight checks passed. Existing profile/listing data and four Auth references were preserved. At migration postflight, four existing account balances and corresponding opening ledger amounts were zero minutes with no discrepancy. Synthetic QA later added records; those records have since been removed and the original fund baseline restored. Do not reapply these migrations.
- **Recovery evidence:** the scoped snapshot of affected public objects/data and Auth references restored into native PostgreSQL, and a native clone dump restored independently. A complete platform backup/restore covering Auth credentials and Storage has not been verified. Keep that limitation visible before future production changes.
- **Email and Auth:** public DNS checks match the expected Resend records, though the last Resend dashboard status was **Pending**. SMTP and the confirmation/recovery templates are configured; actual signup and recovery emails were accepted in hosted QA. Hosted Auth QA passed three signups, email confirmations, server-side profile creation, and recovery; the old password failed and the new password succeeded. The designated member's setup message was accepted by the sender; inbox delivery and member account setup are unverified. Production redirects are configured. Google OAuth remains disabled and the deployed UI hides the option.
- **Hosted community QA:** synthetic-user checks passed for privacy, accepted-exchange reservation, donation/idempotency, settlement, project contributions, and urgent notifications. Cancellation-release behavior was not tested in hosted QA; native tests cover it. The hosted fund-review path was skipped; local/native fund tests passed. A facilitator role has been provisioned to the designated existing account. Do not put the member's email or other personal account detail in tracked documentation.
- **Source and CI:** commit `d864c6f` has been pushed. CI passed at [GitHub Actions run 38622472265](https://github.com/jevonia/future-bank/actions/runs/38622472265). The release was merged through [PR #1](https://github.com/jevonia/future-bank/pull/1) into main at `bf80508`; [main CI run 38629341354](https://github.com/jevonia/future-bank/actions/runs/38629341354) passed. The production deployment built from that merge is READY.
- **Completed cleanup:** synthetic Auth users and related community QA records were removed, and the original fund baseline was restored.
- **Still pending:** verify inbox delivery/account setup for the accepted member setup message. Do not resend automatically or claim the member completed setup without confirmation.

Private operational files and credentials stay under ignored `.private/`, `.env.local`, or private environment-file paths. Never commit them, display their contents, or copy secrets into logs or documentation. Keep the local Vercel project link uncommitted.

After cleanup, a final read-only audit passed all nine predicates: four real Auth users, profiles, and accounts remain; their balances and four opening ledger entries reconcile at zero minutes; original listings and Auth references are preserved; no QA records or synthetic notifications remain; the fund is zero and the designated facilitator is present.

Temporary local token copies, downloaded production environment copy, and QA password/session artifacts were removed. The remote SMTP sending key remains configured; private scoped recovery material and verification evidence were retained.

## Finish-up sequence

1. Retain the post-cleanup verification that synthetic accounts/records are gone and the original fund baseline is restored. Preserve the migration state; do not reapply migrations.
2. Release integration is complete through [PR #1](https://github.com/jevonia/future-bank/pull/1). The deployment from main at `bf80508` passed [main CI run 38629341354](https://github.com/jevonia/future-bank/actions/runs/38629341354); subsequent docs-only changes preserve the tested application.
3. Follow up to verify inbox delivery and account setup for the already accepted member setup message. Avoid sending a duplicate unless the member reports that it is needed.
4. Recheck the production domain and the deployed core journey after any PR/main or deployment change. Report the exact deployment and hosted flows verified.

## Recorded verification

These local checks pass: `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`. The test command runs helper tests and the PGlite schema/RPC integration suite. Native PostgreSQL concurrency scenarios also passed for competing reservations/spends, cancellation release, settlement, and duplicate confirmation. CI is green for commit `d864c6f` at the run linked above.

Hosted checks have also passed for the production smoke cases listed above, three synthetic signup/confirmation/profile/recovery flows, and hosted core exchange/community behavior. Hosted cancellation-release and fund-review were not run; cancellation/release and fund behavior passed native tests. Google OAuth was not tested because the provider is disabled.

## Migration and recovery notes

The installed migrations alter existing profiles, offers, and wants and replace older credit/exchange write paths. Legacy exchange and transaction tables remain preserved rather than silently reconciled into the new ledger. For any future schema change, inspect the live project and migration history with [`supabase/inspect/preflight.sql`](../supabase/inspect/preflight.sql), review the exact SQL, test against a representative environment, and verify a restorable backup before applying it. If live data differs from the tested assumptions, stop and reconcile first. Do not run historical root-level SQL examples or `supabase db reset` against a hosted project.

The snapshot evidence covers the scoped changed public schema/data and Auth references; it is not a full Supabase platform backup. A complete Auth credential and Storage recovery process remains a follow-up before the service is treated as fully recoverable.

## Authentication and deployment guardrails

The production site URL and four exact callback URLs are configured. For a new local or preview environment, add only its exact `/auth/callback` URL and ensure it points to the intended Supabase project. Password recovery returns through the safe `next=/auth/reset-password` path. Avoid broad redirect wildcards. If Google OAuth is later enabled, configure the provider client and callback first, then test it.

The production target remains the existing `future-bank` Vercel project and `newfuturebank.com` domain. Do not create or deploy to the similarly named `future-bank-org` project as a workaround.
