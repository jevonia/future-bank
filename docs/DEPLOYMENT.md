# Deployment and release gates

## Current status

The Vercel target recorded for this repository is `future-bank` in scope `novas-projects-c5420b8e`, project ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`. A separate project named `future-bank-org` exists; this guide targets only `future-bank`. The local Vercel CLI is linked to the exact target. The associated product domain is `https://newfuturebank.com`.

The public Vercel environment was retrieved into ignored `.env.local`; the values are deliberately omitted here. The linked Supabase project is `aitnqoqdkhvlgxuujowb` in TheVillage organization. The restored project responds to database and Auth API requests. A public SDK connectivity check succeeded and one profile row was observed, but the required bank schema is absent and no authenticated end-to-end flow has been run. Local desktop/mobile QA and both real PostgreSQL concurrency scenarios passed. Production-branch mapping, callback settings, migration preview, production backup, and deployment remain pending. A successful build or Vercel login does not close these gaps.

Local QA used `http://localhost:3001` with `BANK_QA_FIXTURE=1`; that server is currently stopped. That fixture is development-only and read-only; both its UI and community mutation API reject writes while enabled. Do not use it as evidence of authenticated database behavior.

## Required checks

Run the same credential-free checks used by GitHub Actions:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

CI does not receive Supabase secrets. The production build must work without local Supabase configuration and render the public disconnected state. `npm run test` runs pure helper tests and the PGlite database integration suite. It does not prove hosted RLS, email delivery, OAuth, or Postgres concurrency. Run `npm run test:concurrency` only against a newly created disposable PostgreSQL database, with the explicit opt-in described in [docs/DATABASE.md](DATABASE.md).

## Vercel project and environment

Before using the CLI or changing project settings, confirm the linked project ID is exactly `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9` in scope `novas-projects-c5420b8e`. Do not select the similarly named `future-bank-org` project. Keep `.vercel/` local and uncommitted.

Configure these two public environment variables in Vercel for the appropriate environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Production must point to the verified production Supabase project. Preview deployments must point to an isolated preview project/branch, never production, until preview sign-in and data access have been verified. The values are public browser configuration; do not add a service-role key or database password to the app environment or any `NEXT_PUBLIC_` variable. Do not paste secret values into issue comments or CI logs.

The target project’s Git production branch and current deployment configuration still need confirmation in Vercel. Preserve the existing `newfuturebank.com` project/domain association; do not create or deploy to another Vercel project as a workaround.

## Supabase preview and migration sequence

These migrations operate on the existing `profiles`, `offers`, and `wants` data and replace older credit and exchange write paths. Run this sequence before production changes:

1. Confirm the Supabase project reference and whether it is production, preview, or a branch. Do not infer it from the Vercel project ID. Capture the existing schema/migration state and inspect the legacy exchange and transaction tables.
2. Run the read-only [`supabase/inspect/preflight.sql`](../supabase/inspect/preflight.sql) against the intended project. Review its output before proceeding. It reports table shapes, RLS, grants, functions, migration history, aggregate counts, and balance conversion risks without listing member identities.
3. Create a restorable backup of the current database and verify the recovery procedure. For production, confirm the backup is complete and available immediately before the migration window. A dashboard backup indicator alone is not a restore test.
4. Create an isolated Supabase preview project or branch and use preview Vercel environment variables pointed at it. Treat any copied member data as production data and limit access accordingly.
5. Apply `20261014000100_bank_schema.sql` followed by `20261014000200_bank_rpcs.sql` to the preview. Review the exact migration plan before applying it. The repository currently has no `supabase/config.toml`; do not run a remote CLI push until the CLI project configuration and migration history have been intentionally initialized and reviewed. Supabase CLI's `db push --dry-run` can show the pending migration set after the project is correctly linked.
6. Run `npm run test` locally, then exercise the preview with at least two confirmed accounts. Verify signup and profile creation, email confirmation, OAuth if configured, recovery and password update, listing visibility, request/accept, private messages, both completion confirmations, exact ledger balances, donations, facilitator approval, urgent opt-in, and denied access by a third member. Verify that retrying a donation or contribution with the same request ID does not duplicate it.
7. Compare every preview account balance to the latest ledger balance, confirm there are no missing opening/welcome entries, and review retained legacy exchanges and transactions. Resolve any discrepancies through an explicitly reviewed policy; do not silently mint or discard credits.
8. Test a new restorable backup and the rollback/recovery procedure. Then repeat the read-only preflight against production, compare it to the preview assumptions, and take a fresh production backup immediately before any production migration.
9. Apply the reviewed migrations to production only after the production data shape and migration plan match what passed in preview. Deploy the matching app commit to the `future-bank` Vercel project, then verify production auth and core signed-in flows. If the production schema differs from preview or historical balances need reconciliation, stop and resolve that before release.

Do not run `supabase db reset` against a linked/hosted project. Do not execute the historical root-level SQL examples; [`docs/DATABASE.md`](DATABASE.md) describes the authoritative migrations and legacy data behavior.

## Authentication redirect allow list

In Supabase Auth, configure the application redirect URL allow list with these exact callback routes:

- `http://localhost:3000/auth/callback` for local development
- `http://localhost:3001/auth/callback` for the local QA server
- `https://newfuturebank.com/auth/callback` for production

Password recovery also returns through `/auth/callback` with a safe local `next=/auth/reset-password` path. For a Vercel preview, add the exact verified preview host’s `/auth/callback` URL and ensure that preview uses its own Supabase project or branch. Remove temporary preview entries when they are no longer needed. Avoid broad wildcard entries for unverified hosts. If Google OAuth is enabled, configure the provider callback shown by the intended Supabase project and test it in preview before production.

## Release acceptance

Release is ready only when all of the following are recorded for the same commit:

- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` pass in CI.
- Preview migrations and balance/legacy-data checks pass against the intended Supabase schema.
- Two-account browser checks pass in preview, including confirmation, recovery, completed exchange, exact ledger movement, and participant privacy.
- Production target project ID, domain, environment values, and production branch are confirmed.
- A fresh production backup and a tested recovery path exist before applying production migrations.
- The production migration and app commit match the reviewed preview.

As of the latest recorded handoff, hosted auth end-to-end checks, preview migrations, production backup, and production deployment are still pending. Desktop/mobile local UI review is complete. No automated workflow deploys to production.

## Provider references

- [Supabase migration workflow and `db push --dry-run`](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Supabase preview branches](https://supabase.com/docs/guides/deployment/branching)
- [Supabase database backup features](https://supabase.com/features/database-backups)
- [Vercel project linking](https://vercel.com/docs/cli/project-linking)
