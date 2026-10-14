# New Future Bank

New Future Bank is a community time bank built with Next.js 16 and Supabase. Members share offers and requests, coordinate exchanges, confirm completed help, and track credits in integer minutes. One hour equals one time credit; a new account receives a recorded two-hour welcome grant.

The public page can render without Supabase credentials. The bank schema is live and the updated application is deployed at [newfuturebank.com](https://newfuturebank.com/). Hosted auth and community QA have passed for synthetic members, including confirmation and recovery, private exchange access, reservations, settlement, donations, projects, and urgent notifications. Synthetic QA accounts and records have been cleaned up and the original fund baseline restored. The real member setup email was accepted by the sender; inbox delivery and account setup are unverified. Final PR/main alignment remains pending; see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the exact status.

## Requirements and local setup

- Node.js 22 LTS and npm
- A Supabase project for authenticated local development

Install dependencies and start the app:

```bash
npm ci
cp .env.example .env.local
# Set the two public values described below in .env.local.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without the Supabase values, the public page displays a disconnected/empty state and authentication actions explain that configuration is missing.

The application reads only these browser-safe variables:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | The Supabase project's API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The project's publishable/anon public API key |

Do not put a service-role key, database password, access token, or other privileged secret in a `NEXT_PUBLIC_` variable. Keep local values in the ignored `.env.local`; use Vercel environment settings for hosted environments. The example file contains names only, not working credentials.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development mode |
| `npm run lint` | Lint `src` and `tests` with ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run test` | Run the Node/tsx helper tests and PGlite database integration suite |
| `npm run test:concurrency` | Run PostgreSQL lock/concurrency checks against an explicitly disposable database |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |

The standard lint, typecheck, test, and build commands do not need hosted credentials. The concurrency test requires a newly created disposable PostgreSQL database and the `BANK_TEST_DATABASE_URL` and `BANK_TEST_CONFIRM_DISPOSABLE=1` variables; see [database setup and verification](docs/DATABASE.md). Never point it at production or a database containing real `auth.users`.

## Database and authentication

The authoritative database setup is the ordered migrations in [`supabase/migrations`](supabase/migrations). Read [docs/DATABASE.md](docs/DATABASE.md) before preparing a preview or an existing project. It covers the read-only preflight, backup and preview sequence, legacy data handling, grants, RLS, and the local integration/concurrency checks.

For email confirmation and password recovery, configure the Supabase Auth redirect allow list with:

- `http://localhost:3000/auth/callback` for local development
- `http://localhost:3001/auth/callback` for the current local QA server
- `https://newfuturebank.com/auth/callback` for the production domain

Add a preview callback only after confirming the exact preview hostname and that its Vercel environment points to the intended preview Supabase project. Do not enable an unbounded wildcard for unknown preview hosts. Google sign-in also requires the provider settings in Supabase Auth to match that project's configured provider callback.

The signup database trigger creates the profile and welcome-ledger entry when the auth user is created. Production Auth redirects, SMTP, and the confirmation and recovery templates are configured. Public DNS checks match the Resend records; the last Resend dashboard status was still Pending, while actual signup and recovery messages were accepted in hosted QA. Three synthetic signups, confirmation, server-side profile creation, and password recovery passed (the old password was rejected and the new password accepted). The designated member's setup email was accepted by the sender; inbox delivery and account setup are unverified. Google OAuth remains disabled in Supabase, and the deployed app hides that option.

## Deployment target and status

The recorded Vercel target is the existing **`future-bank`** project in scope **`novas-projects-c5420b8e`**, project ID **`prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`**. There is also a separate `future-bank-org` project; do not select it. The local Vercel CLI is linked to the exact target and the public environment was retrieved into ignored `.env.local`; values are not stored in this documentation. The associated Supabase project reference is `aitnqoqdkhvlgxuujowb` in TheVillage organization. The restored project responds to database and Auth API requests. The domain currently associated with this product is [newfuturebank.com](https://newfuturebank.com/).

The exact Vercel project, production branch (`main`), Node.js 22 runtime, and existing domain association have been verified. The production deployment is READY at deployment `dpl_2JumS368PxYf6uw8w5uJEQMnUhAN`; production smoke checks passed, including provider discovery, the development-only fixture's 404 response, anonymous API denial, and cross-origin mutation rejection. Both bank migrations were applied to the connected Supabase project and postflight checks passed. At that check, the four existing accounts and opening ledger amounts were zero. Hosted synthetic QA data has since been removed and the original fund baseline restored. The scoped data/schema snapshot was restored into native PostgreSQL, but a complete platform backup including Auth credentials and Storage has not been verified. Commit `d864c6f` is pushed and its CI run passed; PR/main alignment remains pending. The setup email was accepted by the sender, but inbox delivery and member setup are unverified. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for exact verification and remaining work.

## Historical documents

Root-level SQL/setup notes predate the reviewed migration model and may describe direct credit edits or obsolete exchange tables. Treat `DATABASE_SETUP.md`, `DATABASE_EXCHANGE_SYSTEM.md`, `DATABASE_MIGRATION*.md`, `DATABASE_RLS_FIX.md`, `DATABASE_TRIGGER_SETUP.md`, and `TEST_DATA_SETUP*.md` as historical reference only. Do not execute their SQL against any project. Use [`docs/DATABASE.md`](docs/DATABASE.md) and the versioned migrations instead. [PROJECT_REVIEW.md](PROJECT_REVIEW.md) and [HANDOFF.md](HANDOFF.md) record the audit and current implementation status.
