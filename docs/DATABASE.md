# New Future Bank database

The authoritative schema is `supabase/migrations/20261014000100_bank_schema.sql` followed by `20261014000200_bank_rpcs.sql`. Apply both in order with Supabase migrations or `psql -v ON_ERROR_STOP=1` against a **backup or preview project first**. These migrations have not been run against the live project. Do not paste the older root-level database Markdown examples into Supabase: those examples grant direct balance edits.

## Before applying to an existing project

Take a restorable database backup and run the read-only [`supabase/inspect/preflight.sql`](../supabase/inspect/preflight.sql) against the actual project. It reports table shapes, policies, role grants, auth triggers, migration versions, aggregate row counts, and legacy balance conversion risks without printing member details. Inspect `public.profiles`, `offers`, `wants`, `exchanges`, and `transactions` before applying anything. The migration supports the documented original `profiles/offers/wants` shape and retains their rows. If a documented legacy `exchanges` table with `time_credits` exists, it is renamed to `legacy_exchanges`; `transactions` and its foreign keys remain intact. Legacy exchange/transaction writes and reads by clients are revoked. Review those rows and decide separately how to reconcile them with the new minute ledger. Do not recreate old credit functions after migration.

Each existing profile receives an account initialized from its legacy `time_balance` and an `opening` ledger entry, including zero balances. Existing auth users who lack a profile are backfilled with a generated username and a zero-minute opening entry. If an account already exists, its current minutes take precedence. Conversion is exactly `time_balance * 60`; the original decimal value remains frozen in `profiles.time_balance` for audit. The migration stops if an imported value has a fractional minute, is negative, or is too large for an integer. Resolve such records manually under a reviewed balance policy before retrying; the migration will not silently change them. Existing users do **not** receive a welcome grant; new auth users receive exactly 120 minutes with a `welcome` entry. No migration resets existing records or balances.

The signup trigger creates a profile, account, preferences, and welcome entry in the same transaction. Only confirmed members can call member RPCs or read member tables. A fallback `member_<uuid-prefix>` name handles missing or invalid signup metadata; members can later change their username. For OAuth providers that do not populate `email_confirmed_at`, verify confirmation behavior in the actual Supabase auth project before onboarding.

## Data rules and access

One hour is 60 minutes. `accounts.balance_minutes` is the current nonnegative integer balance. `ledger_entries` records signed changes and the balance after each change. When an exchange is accepted, its minutes are reserved against the requester's account. Acceptance locks that account and checks the balance minus other accepted reservations; donations use the same account lock and can spend only available minutes. Cancelling an accepted exchange releases its reservation. `bank_account_summary()` returns the signed-in member's balance, reserved minutes, and available minutes. Reservations are derived from accepted exchanges rather than stored in a second wallet column. A unique constraint permits exactly one debit and one credit for each completed exchange. Exchange rows lock before completion; both participants confirm; account rows lock in UUID order. The second confirmation transfers the exact reserved minutes atomically. A failed transfer rolls back the second confirmation, and a repeated successful confirmation returns the same exchange ID. Fund donations debit a member and credit the fund atomically. Approvals debit the fund and credit a member atomically. The donation API requires a stable UUID `request_id` per user intent; retries with the same key return the original ledger ID, and changed payloads are rejected.

Marketplace, member names, projects, and contributions are readable only by confirmed members. Exchange rows, messages, and kudos are readable only by participants. Fund requests are readable only by the requester and facilitators. Ledger and notification rows are owner-only. Anonymous users can call only `bank_public_summary()`, which returns aggregate counts. Its `contributed_minutes` is completed exchange minutes plus project contribution minutes; it does not count uncompleted requests. `bank_project_summaries()` returns exact totals and distinct contributor counts for each project to confirmed members, independent of paginated contribution lists. All client writes use `bank_*` RPCs except edits to the `profiles.username` and `profiles.avatar_url` columns. The legacy `time_balance` column is not client-readable or writable. Broad table/sequence grants and legacy policies are removed.

Facilitator access is provisioned only with trusted SQL run by a database administrator or service role, after a human decision:

```sql
insert into public.member_roles(user_id,role)
values ('REPLACE_WITH_CONFIRMED_USER_UUID','facilitator')
on conflict do nothing;
```

Members cannot insert or edit `member_roles`, and facilitators cannot approve their own requests. The SQL RPCs enforce the same 18 want criteria and five kudos labels as `src/lib/types.ts`; update both allowlists together if product choices change. Project contributions track volunteered time and do not mint credits; they also require a stable UUID `request_id` so retries do not inflate hours. Urgent alerts require each recipient's opt-in via `bank_set_urgent_opt_in`; `bank_amplify_want` limits each member to one alert per 24 hours and each want to once per seven days. Notifications are in-app rows; there is no external email or push delivery in these migrations.

For an offer listing, the caller requests help and the owner is the provider. For a want listing, the caller offers help and the owner is the requester. `initiator_id` records who sent the request. The invited member accepts or declines; both members confirm completion. This resolves the ambiguity in the initial API contract while keeping credit flow from requester to provider.

## Local verification

The in-memory integration test requires Node and `@electric-sql/pglite`:

```bash
node supabase/tests/bank.integration.mjs
```

The test builds an old-schema fixture, applies both migrations, and checks opening and welcome entries, column grants, RLS, forged writes, participant privacy, reservation-aware acceptance and donation, cancellation release, two-party settlement, duplicate confirmation, donation retries, facilitator approval, project contributions, urgent opt-in, and public summary. For a real Supabase preview database, additionally test two simultaneous acceptances against one payer and two simultaneous confirmations for one exchange. The expected result is no over-reservation, one ledger pair per completed exchange, and no negative account balance. Supabase CLI can apply migrations with `supabase db reset` only to a disposable local project; never use that command against production.

With a fresh disposable PostgreSQL database and the `pg` Node package installed, run the two-session lock test:

```bash
BANK_TEST_DATABASE_URL='postgres://...' BANK_TEST_CONFIRM_DISPOSABLE=1 node supabase/tests/bank.concurrent.mjs
```

The script refuses a database that already has `auth.users`. It creates test roles and a mock auth schema, applies the migrations, then coordinates two transactions to test competing acceptances and duplicate completion; it also checks a competing donation, cancellation release, and settlement. The connection must have privilege to create roles and schemas. Use a database created solely for this test; it leaves fixture rows behind for inspection. This revised test passed on a disposable local PostgreSQL 18.4 cluster on October 14, 2026; the server was stopped afterward.

After any preview migration, compare `accounts.balance_minutes` with the latest ledger entry for each user, count missing initial entries, and inspect old exchange rows:

```sql
select a.user_id,a.balance_minutes,l.balance_after_minutes
from public.accounts a
left join lateral (
  select balance_after_minutes from public.ledger_entries
  where user_id=a.user_id order by id desc limit 1
) l on true
where a.balance_minutes is distinct from l.balance_after_minutes;

select count(*) from public.accounts a
where not exists (
  select 1 from public.ledger_entries l
  where l.user_id=a.user_id and l.kind in ('opening','welcome')
);
```

Both queries should return no mismatches/zero missing initial entries. Do not deploy until the preview migration and full signed-in flows have been verified against the actual Supabase project.
