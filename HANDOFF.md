# New Future Bank handoff

Updated October 14, 2026. Work is active. Preserve the existing Vercel project, domain, Supabase data, and member balances. Do not expose credential values or commit local private artifacts.

## Goal and product rules

Revive New Future Bank as a community time bank: members post offers and requests, coordinate privately, and confirm completed help. One hour is 60 integer minutes, or one time credit. New accounts receive a recorded two-hour welcome grant. Existing balances are preserved. Accepting an exchange reserves the requester's minutes; a donation cannot spend reserved minutes; both people must confirm before settlement; cancellation releases the reservation. Project contributions record volunteer time and do not mint member credits. Facilitators must be provisioned through a trusted administrative path.

## Source and change state

The implementation checkpoint is commit `6e5fe6e` on branch `codex/new-future-bank-revival`. It has not been pushed and there is no PR or new deployment. The matching production domain still serves the older app build. The latest changes to the auth callback, templates, callback tests, and documentation are in the shared worktree and need review, commit, push, and CI. Local lint, typecheck, 11 helper tests, PGlite database tests, production build, and disposable PostgreSQL concurrency checks pass.

Important implementation files include:

- `src/app/auth/callback/route.ts` and `src/lib/auth-callback.ts` for PKCE, token-hash confirmation, recovery, and safe redirects.
- `supabase/templates/confirm-signup.html` and `supabase/templates/reset-password.html` for the matching email templates. Deploy the callback implementation before installing templates that use token-hash callbacks.
- `tests/auth-callback.test.ts` for callback behavior.
- `supabase/migrations/20261014000100_bank_schema.sql` and `supabase/migrations/20261014000200_bank_rpcs.sql` for the bank schema and atomic RPCs.
- `docs/DEPLOYMENT.md`, `docs/DATABASE.md`, `docs/ROADMAP.md`, and `EMAIL_SETUP_GUIDE.md` for operational and product guidance.

## Hosted database and recovery

The Supabase project is `aitnqoqdkhvlgxuujowb` in TheVillage organization. Both bank migrations were applied atomically through the Management API. Fourteen postflight checks passed. The existing profile, offer, want, and four Auth references were preserved. Four accounts have zero-minute balances, with matching zero-minute opening ledger entries; no ledger discrepancies were found. Do not reapply these migrations.

The postflight verifier initially disagreed over how an empty `search_path` was represented. That was a verifier-format issue only; it required no database patch. The final postflight reported 14 passing checks.

A scoped snapshot of the changed public objects/data and Auth references was restored into a disposable native PostgreSQL instance; a native clone dump was also restored independently. The Supabase project did not expose a full platform backup. Auth credential and Storage recovery are not covered by the scoped snapshot, so do not describe it as a full-project backup or verified disaster-recovery plan. Local evidence and operational scripts remain under ignored `.private/`, including the legacy snapshot/restore material and the verifier. Keep this directory out of Git and never print its contents.

## Hosting and authentication

The Vercel target is `future-bank`, project ID `prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`, scope `novas-projects-c5420b8e`. The separate `future-bank-org` project is not the target. The repository is linked to the intended project; production branch `main`, Node.js 22, and the existing `newfuturebank.com` domain association were verified. Development environment values are in ignored `.env.local`; the production environment was pulled to a private local file. Never copy values into docs or logs.

The Supabase site URL and four exact callback URLs were configured and verified. Hosted signup is enabled, email confirmation is required, and Google OAuth is disabled. The old production app still displays a Google button, while the new source hides it unless Supabase reports an enabled provider. No Google OAuth client credentials have been found or configured.

Resend is connected through the user's GitHub sign-in. Its local API key is sending-only. The sender domain `auth.newfuturebank.com` has been created and all three DNS records were added through the existing Vercel DNS zone; public DNS matches the expected records. Resend still reports the domain as **Pending**. SMTP and templates are not yet configured, and no confirmation or recovery email has been delivered in a hosted test.

The user has not selected which existing account should receive the facilitator role. Do not grant it until the user identifies the intended member. The app has no self-service role assignment. Community-fund review should remain out of the pilot until a facilitator and the group's request/approval rules are established.

## Next work

1. Check Resend domain verification using the existing private DNS checker. Once verified, configure Supabase SMTP and install the two templates from `supabase/templates/`.
2. Commit and push the auth callback/template work, open a PR against the intended branch, and confirm CI. Deploy to a preview using the exact Vercel project and intended Supabase environment.
3. Run hosted synthetic-account checks for signup, confirmation, sign-in/out, recovery, resend, and the complete exchange. Use three accounts to verify that a nonparticipant cannot access private messages, fund requests, or another member's ledger. Cover reservations, cancellation release, both confirmations, and exact ledger totals.
4. If the user wants Google sign-in, configure a Google OAuth client and its Supabase callback, then test it. Otherwise, leave Google disabled.
5. Ask the user to identify the facilitator account before granting the role through a trusted administrative route. Keep fund review disabled in the pilot if no facilitator or agreed policy is ready.
6. Remove synthetic accounts and related community records after testing. Review local `.private/` tokens, keys, and session artifacts; delete or rotate them when no longer needed without exposing their contents.
7. Deploy the reviewed commit to the existing production Vercel project only after hosted preview checks pass. Verify the production hostname and one controlled exchange, then record exactly what was tested.

## Guardrails

- Root owns integration, hosting, and browser/server operations. Do not start another server or take over the shared browser without coordination.
- Keep `.private/`, `.env.local`, `.vercel/`, and downloaded production environment files ignored and uncommitted.
- Use [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for migration/release gates, [`docs/DATABASE.md`](docs/DATABASE.md) for SQL behavior, and [`docs/ROADMAP.md`](docs/ROADMAP.md) for the pilot sequence. Historical root-level SQL setup documents are not runnable instructions.
- The local `/qa/dashboard` fixture is read-only and works only in development with `BANK_QA_FIXTURE=1`; never use its records as production evidence.
