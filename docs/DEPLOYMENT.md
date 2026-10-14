# Deployment and release status

Updated October 14, 2026. The production database schema has been migrated, but the updated application has not been deployed. The production domain still serves the previous app build. Do not describe the new member workflows as live until the app is deployed and the hosted journey is verified.

## Current state

- **Vercel:** exact target is `future-bank`, project ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`, scope `novas-projects-c5420b8e`. The similarly named `future-bank-org` is a different project and is not the target. The `main` production branch, Node.js 22 runtime, and `newfuturebank.com` association were verified. Vercel production environment settings were retrieved to a private local file; secret values are not documented.
- **Supabase:** project reference `aitnqoqdkhvlgxuujowb` in TheVillage organization. The two bank migrations, `20261014000100_bank_schema.sql` and `20261014000200_bank_rpcs.sql`, were applied atomically through the Management API. Fourteen postflight checks passed. The original profile, offer, want, and four Auth references remain. All four account balances and corresponding opening ledger amounts are zero minutes; no discrepancies were found. This is a SQL migration result, not a browser-flow test.
- **Recovery evidence:** a scoped snapshot of affected public schema/data and Auth references was restored into a disposable native PostgreSQL instance; a native clone dump was restored independently. The Supabase project did not report an available platform backup, and a complete restore path covering Auth credentials and Storage has not been verified. Preserve this limitation before further production changes.
- **Auth redirects:** the production site URL and four exact callback URLs were configured and read back successfully. The current production app is still the older build, so these settings alone do not prove that signup or recovery works end to end.
- **Email:** a sending-only Resend key is available locally. The `auth.newfuturebank.com` sender domain and three DNS records were created in the existing Vercel DNS zone. DNS records match the expected values, but Resend still reports the domain as **Pending**. SMTP configuration and the matching Supabase confirmation/recovery templates have not been completed or tested.
- **Google OAuth:** the hosted provider is disabled and no Google OAuth client credentials have been configured. The old production app still displays its Google option; the new source only displays Google when Supabase reports an enabled provider. Do not claim Google sign-in works.
- **Source and checks:** checkpoint `6e5fe6e` is on `codex/new-future-bank-revival` and has not been pushed. Auth callback/token-hash handling, four callback tests, templates, and documentation changes remain uncommitted. Local lint, typecheck, 11 helper tests, the PGlite migration/security suite, production build, and native PostgreSQL concurrency checks pass. CI and hosted account/exchange tests are not yet recorded.
- **Facilitator:** no facilitator role has been granted. The user has not yet chosen which existing account should receive it. A trusted account must be named before opening community-fund review.

Private operational files and credentials are kept under ignored `.private/` or `.env.local` paths. Never commit them, display their contents, or copy secrets into this document. The targeted Vercel project link is local-only and should stay uncommitted.

## Remaining release sequence

1. Verify the latest migration postflight and inspect the restored scoped snapshot artifact before relying on it for recovery. Do not reapply the already-installed migrations.
2. Wait for Resend to report `auth.newfuturebank.com` as verified. Then configure Supabase SMTP and install the confirmation and recovery templates from [`supabase/templates`](../supabase/templates). These templates use token-hash callbacks, so deploy the matching callback implementation before testing or enabling the templates.
3. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` on the final source commit. Confirm CI passes on the same commit.
4. Push the implementation branch and open a reviewable PR. Confirm the PR targets the intended `main` branch and that the Vercel preview uses the correct project/environment. No PR or push exists yet.
5. Verify Auth in the deployed preview: signup, confirmation email, sign-in, sign-out, recovery, password update, and resend. If Google OAuth is desired, first configure a Google OAuth client and the matching Supabase provider callback; otherwise keep the button hidden.
6. Use at least three synthetic accounts to verify the two-party exchange and privacy boundaries: member listings, request and response, private messages, reservation, cancellation release, both completion confirmations, exact ledger movement, and denial of access by a third member. Test donations, project contributions, fund review, and urgent opt-in only after the facilitator and pilot policy are established. Clean up synthetic auth and community records afterward.
7. Ask the user to identify the facilitator account before granting `member_roles.role='facilitator'` through an authorized administrative path. Confirm the account belongs to the intended community; the app does not let members self-assign roles.
8. Verify production database recovery coverage for Auth and Storage, not just public SQL objects, before treating the live project as fully recoverable. Review migration and legacy balance outcomes with the user. Deploy to the existing `future-bank` Vercel project only after preview tests pass.
9. After deployment, verify the production hostname, login/confirmation flow, and one controlled exchange. Confirm privacy, ledger totals, and error handling. Report exactly which hosted paths were exercised.

## Local verification commands

These checks do not mutate the hosted project:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run test` runs helper tests and the PGlite schema/RPC integration suite. It does not verify hosted RLS, email delivery, OAuth, or the deployed user experience. `npm run test:concurrency` requires a newly created disposable PostgreSQL database and explicit opt-in; see [docs/DATABASE.md](DATABASE.md). Never point the concurrency harness at production or a database containing real Auth users.

## Migration safety

The installed migrations modify the existing profiles, offers, and wants schema and replace older credit/exchange write paths. They preserve legacy exchange/transaction tables rather than reconciling them automatically. The migrations are already applied to the connected hosted project. For any future migration, first inspect the project and migration history with [`supabase/inspect/preflight.sql`](../supabase/inspect/preflight.sql), take and test a restorable backup, review the exact SQL, and test against a representative preview. If the live schema or balances differ from the reviewed assumptions, stop and reconcile them before applying changes. Do not execute the historical root-level SQL examples or run `supabase db reset` against a hosted project.

## Authentication redirects

The four exact callback URLs are already configured in the connected Supabase project. For a new local or preview environment, add only its exact `/auth/callback` URL and verify that it points to the intended Supabase project. Password recovery returns through `/auth/callback` with a safe `next=/auth/reset-password` path. Avoid broad wildcards for unverified hosts. Google OAuth also requires a configured provider client and matching callback; the provider is currently disabled.

## Current release gate

The database migration and local technical checks are complete. Release is still blocked on verified mail delivery, committed and pushed source, CI, authenticated hosted browser tests, facilitator selection/setup if fund review is in scope, and production deployment. The lack of a verified full Supabase Auth/Storage restore remains a recovery limitation. The current public domain still serves the previous application build.
