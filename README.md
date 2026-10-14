# New Future Bank

New Future Bank is a community time bank built with Next.js 16 and Supabase. Members share offers and requests, coordinate exchanges, confirm completed help, and track credits in integer minutes. One hour equals one time credit; a new account receives a recorded two-hour welcome grant.

The public page can render without Supabase credentials. The connected Supabase project now has the bank schema and RPC migrations applied, with the existing profile and listings preserved. The current production domain still serves the older application build: the updated app has not been deployed, and live signup, email delivery, or a member-to-member exchange has not yet been verified.

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

The signup database trigger creates the profile and welcome-ledger entry when the auth user is created. Production Auth redirect URLs are configured. Email delivery is not ready yet: the Resend sender domain is pending verification, and SMTP plus the matching confirmation and recovery templates remain to be configured. Google OAuth is disabled in Supabase; the updated app hides that option until a provider is enabled. Verify signup, recovery, and a full member exchange against the hosted project before onboarding.

## Deployment target and status

The recorded Vercel target is the existing **`future-bank`** project in scope **`novas-projects-c5420b8e`**, project ID **`prj_O0wo6gqYzDOLQ6X3Ramg4TrgU5B9`**. There is also a separate `future-bank-org` project; do not select it. The local Vercel CLI is linked to the exact target and the public environment was retrieved into ignored `.env.local`; values are not stored in this documentation. The associated Supabase project reference is `aitnqoqdkhvlgxuujowb` in TheVillage organization. The restored project responds to database and Auth API requests. The domain currently associated with this product is [newfuturebank.com](https://newfuturebank.com/).

The exact Vercel project, production branch (`main`), Node.js 22 runtime, and existing domain association have been verified. Both bank migrations were applied to the connected Supabase project through the Management API. Postflight checks passed; the original profile, offer, want, and four Auth references were preserved, and all four account balances and corresponding opening ledger amounts are zero minutes, with no discrepancies. A scoped data/schema snapshot was restored into a native PostgreSQL clone, but a complete platform backup including Auth credentials and Storage has not been verified. Local lint, typecheck, helper/PGlite tests, build, and disposable-PostgreSQL concurrency checks pass. No authenticated hosted journey or new app deployment has occurred. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for current status and remaining gates.

## Historical documents

Root-level SQL/setup notes predate the reviewed migration model and may describe direct credit edits or obsolete exchange tables. Treat `DATABASE_SETUP.md`, `DATABASE_EXCHANGE_SYSTEM.md`, `DATABASE_MIGRATION*.md`, `DATABASE_RLS_FIX.md`, `DATABASE_TRIGGER_SETUP.md`, and `TEST_DATA_SETUP*.md` as historical reference only. Do not execute their SQL against any project. Use [`docs/DATABASE.md`](docs/DATABASE.md) and the versioned migrations instead. [PROJECT_REVIEW.md](PROJECT_REVIEW.md) and [HANDOFF.md](HANDOFF.md) record the audit and current implementation status.
