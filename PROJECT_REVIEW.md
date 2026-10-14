# New Future Bank: code review and revival plan

Reviewed October 14, 2026. Source: local `main` at `e52af16`; live public homepage: https://newfuturebank.com/.

This is the historical audit of the original application, before the revival changes. The findings below describe that earlier snapshot. The replacement application is now deployed and its hosted synthetic Auth/community checks passed; see [deployment status](docs/DEPLOYMENT.md) and [roadmap](docs/ROADMAP.md) for the current state and remaining work.

## Assessment

This is the right repository. It contains a compact Next.js/Supabase application for a community time bank. The foundation is reusable, but the product currently stops before its central promise: two people completing an exchange of help and recording the hours.

The distinctive ideas are worth retaining: mutual aid, accessibility preferences, gratitude, shared projects, a community fund, and a personal contribution constellation. The next milestone should be one complete, trustworthy exchange in a small community, with those ideas added as real participation grows.

The public deployed interface matches the local dashboard's text, sample numbers, and layout. This does not establish the deployed commit, dependency versions, database schema, or account configuration.

## What exists

| Area | Evidence in this checkout | Current status |
| --- | --- | --- |
| Accounts | `LoginModal`, OAuth callback, resend-confirmation endpoint | Email/password and Google entry points implemented; real account flows not tested in this review |
| Profiles | `ProfileSettingsModal`, profile query, header balance | Username/avatar editing implemented; avatar stored as a data URL rather than uploaded to object storage |
| Offers and wants | Creation modals insert into Supabase; server page queries the current user's listings | Database integration exists; dashboard does not refresh after creation; no listing edit/archive flow |
| Accessibility preferences | Wants support 18 criteria, displayed on service cards | Useful foundation; not used for matching or filtering |
| Marketplace | Search field in dashboard | No search logic, community listing query, results, or member connection flow |
| Exchanges and history | SQL designs in Markdown | No exchange routes, exchange UI, transaction-history component, or corresponding types in this checkout |
| Community pulse | Static import from `src/lib/data.ts` | Displays sample activity as current activity |
| Projects | Static projects and participant images | Contribute buttons have no handler |
| Community fund | Static 127.5-credit balance | Signed-in action only logs to console; modal exists but is not mounted and has no persistence |
| Constellation | Component and static contribution counts | Visualization exists; no actual contribution history |
| Welcome, kudos, amplification | Separate modal files and feature flags | Not wired into the dashboard; no corresponding persistence/notification system |

`EXCHANGE_SYSTEM_IMPLEMENTATION.md` claims endpoints, types, and components are complete and reports 70% progress. Those files are absent, and no commits containing the named exchange routes/components were found in the locally available Git history. `DEVELOPMENT_TIMELINE.md` contradicts that summary. Treat both as historical design notes, not implementation status.

## Verification

- Working tree was clean before review; repository has a single local `main` branch and an `origin/main` tracking ref. Remote: `jevonia/future-bank` on GitHub. Latest local commit: June 14, 2026.
- TypeScript: `tsc --noEmit --incremental false` passed.
- Lint: both `npm run lint` and direct ESLint passed with five warnings: four raw-image warnings and one missing image alt text.
- Production build: passed. The first sandboxed attempt could not resolve Google Fonts; the approved network-enabled retry completed successfully.
- Build routes confirm only `/`, `/auth/callback`, and `/api/auth/resend-confirmation`, plus the generated not-found route.
- Local runtime credentials are absent: no local `.env` file found, and both required Supabase variables are missing from the command environment. A successful build does not verify database-connected runtime behavior.
- Live public page loaded successfully. Its sample statistics and projects match the source. Clicking a project Contribute button produced no UI change. The sign-in modal opens; Escape does not dismiss it, and the screenshot shows an opaque black backdrop.
- No account was created, no live records were changed, and no live database policies were inspected. Mobile behavior and authenticated user journeys remain unverified.
- There are no automated test files or CI workflows in the tracked checkout. Several lint rules are disabled, so passing lint is limited evidence of quality.

## Fixes that matter first

### 1. Verify and patch the deployed framework

`package.json`, the lockfile, and installed dependencies use Next.js 15.3.5; installed React is 19.1.0. This App Router configuration falls in the affected range of the published React Server Components remote-code-execution advisory. Later advisories also describe denial of service and source exposure. Verify the actual deployed versions and update to a currently supported, patched release before renewed promotion. Do not treat an old minimum patch version as the current upgrade target.

If production remained on an affected version, review exposure and rotate relevant application secrets after patching, following the vendor advisory. This review found no evidence of compromise.

Sources: [Next.js critical advisory](https://nextjs.org/blog/CVE-2025-66478), [follow-up security update](https://nextjs.org/blog/security-update-2025-12-11).

### 2. Replace permissive SQL designs with reviewed migrations

These are findings about repository SQL, not confirmed production vulnerabilities:

- `DATABASE_SETUP.md:32` allows owners to update their profile row, which includes `time_balance`. Its insert policy also does not constrain the starting balance. With ordinary table privileges, clients can set their own credits. Restrict account fields and make credit changes accessible only through controlled ledger operations.
- `DATABASE_SETUP.md:39` calls its policy public username access, but `SELECT USING (true)` allows access to whole profile rows, including balances and avatar data. Expose a deliberately limited public member representation.
- `DATABASE_EXCHANGE_SYSTEM.md:124` allows either participant to update exchange rows without protecting status, participants, or credit amount. `:137` allows unrestricted transaction inserts. Those undermine a trustworthy ledger.
- Privileged SQL functions use comparisons such as `auth.uid() != provider_id` without an explicit null-authentication check. SQL null comparisons do not evaluate to true, so these checks are insufficient if unauthenticated callers have execute permission. Set explicit execution grants, require authentication, and pin the function search path.
- `complete_exchange()` reads status and balances without locking the exchange and account rows. Concurrent completion calls can both pass the status check and transfer credits twice. Concurrent spending across exchanges can also overdraw an account. Add row locking, an enforced state transition, and a unique ledger constraint; test retries and competing requests.
- All documented starting balances are zero while completion requires sufficient credits. Decide how the first exchange can occur: issued starter hours, a bounded debit allowance, or another explicit community policy.

Supabase confirms that row-level policies do not restrict individual columns: [column security documentation](https://supabase.com/docs/guides/database/postgres/column-level-security).

### 3. Fix account and dashboard state

- `dashboard-client.tsx:24` copies server props into local state, but never calls its state setter. New server props from `router.refresh()` will not update that stored state. Sign-out can leave old account content visible until reload.
- Successful password sign-in only closes the modal (`LoginModal.tsx:60`); it does not refresh the server dashboard or update its user state.
- Successful offer/want creation only closes the modal (`dashboard-client.tsx:36` and `:41`); the saved listing is not shown until a full reload.
- `page.tsx:17` discards query errors and substitutes empty arrays, making failures resemble a new or empty account.
- Middleware uses the older cookie adapter while the server client uses `getAll/setAll`. Standardize session refresh against the chosen Supabase version; preserve all refreshed cookies. The server page already validates the user with `getUser()`.

### 4. Make the public experience accurate and understandable

Introduce New Future Bank before showing account tools. Explain time credits with a concrete example, identify who the first community is for, and offer a clear next step. Label demo data explicitly or replace it with truthful empty states. Hide unfinished actions from the member experience until they work.

Use the same product name throughout: the domain says New Future Bank; metadata and UI currently say FutureBank. Keep the warmth and reciprocity while giving the public page a clearer identity.

### 5. Repair basic usability

Use accessible dialogs with focus management, Escape dismissal, a visible close control, associated form labels, and announced errors. Replace legacy opacity utilities with working Tailwind 4 styles. Provide password recovery and an actual callback-error page; the current callback redirects errors to a route that does not exist. Normalize/validate usernames across signup and profile editing, and handle OAuth-generated username collisions. Bound avatar file size and move images to storage.

## Proposed work sequence

### Phase 1: recover a reliable baseline

Confirm hosting, deployed commit, Supabase project, actual schema/policies/grants, authentication redirect URLs, SMTP settings, backups, and whether any real members/data exist. Record environment variable names without secrets in a setup example; replace the starter README with project-specific instructions. Patch dependencies, establish versioned migrations and a preview environment, fix dashboard/account refresh and failure states, and mark sample features accurately.

Exit criteria: reproducible setup/build, passing sign-in/confirmation/sign-out and listing-creation checks, verified access controls, and no unexplained sample balances presented as live.

### Phase 2: make one exchange work end to end

Build community offer/want browsing, basic category and virtual/in-person filters, listing details, and a request with agreed hours and a private coordination path. Implement request, accept/decline, cancel, completion confirmation, atomic ledger transfer, and readable history. Add notification of requests and decisions using a channel members can reliably receive.

Keep the architecture: Next.js plus Supabase is adequate for this scope. Separate editable profile data from protected account/ledger data. Model credit amounts as integer minutes or exact decimal hours; use one documented rule consistently.

Exit criteria: two test members can complete an exchange; balances/history agree; duplicate completion, concurrent spending, forged participants, and access by a third member are rejected. These authorization and concurrency checks deserve meaningful automated tests.

### Phase 3: pilot with one real community

Proposed pilot: 15–30 invited members who already share a neighborhood, organization, or interest, with a named human facilitator. Help each member post one offer and one request. Seed real needs and use manual introductions where needed. Publish clear consent, privacy, conduct, dispute, and credit rules before inviting people to exchange.

Proposed initial success gate: 10 completed exchanges, no unexplained credit discrepancies, and several members returning for a second exchange. Track request response time, completion rate, repeat exchanges, and why requests go unanswered. These are proposed learning targets, not forecasts.

### Phase 4: grow the distinctive features

Make the constellation and gratitude reflect completed exchanges first. Add a shared project once a group is ready to use it. Build the community fund only after defining who approves requests and how decisions and transfers are recorded. Introduce AI facilitation later, after observing actual matching and coordination needs.

## Product decisions to settle

1. Which first community will have a reason to participate together?
2. Does one hour always equal one credit? Recommended starting assumption: equal hours across services; the old sample data has variable rates that contradict this.
3. How can a new member receive help before earning credits?
4. What information is public, members-only, and private to exchange participants?
5. Who handles unsuccessful exchanges, disputes, and fund decisions?

The suggested next implementation batch is Phase 1, followed by the smallest complete exchange flow. This review changes documentation only; it does not modify or deploy the app.
