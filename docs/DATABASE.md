# New Future Bank database

The authoritative schema is `supabase/migrations/20261014000100_bank_schema.sql` followed by `20261014000200_bank_rpcs.sql`. Both were applied to the live Supabase project on October 14, 2026 in one reviewed, guarded transaction. Supabase's `supabase_migrations.schema_migrations` records versions `20261014000100` and `20261014000200`. A 14-query live postflight passed: original rows and Auth references were preserved, accounts and opening ledger entries reconcile, RLS and grants are narrow, and the bank functions have pinned empty search paths. Do not reapply these files or paste the older root-level database Markdown examples into Supabase; the older examples grant direct balance edits.

Before that live application, the original public tables and relevant Auth references were captured in a private scoped rollback snapshot, restored on disposable PostgreSQL, and used to test the exact migration request. That snapshot covers the objects and records affected by this migration; it is **not** a complete Supabase Auth, Storage, or disaster-recovery backup. The live postflight and later read-only audit are saved privately in `.private/` and are not committed.

## For future migrations on an existing project

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

Members cannot insert or edit `member_roles`, and facilitators cannot approve their own requests.

## Standing and safety migrations

`20261015000100_standing.sql` and `20261015000200_vouches_and_safety.sql` add the standing and safety plan's Phases 1 and 2. They are tested in PGlite (`supabase/tests/standing.integration.mjs`, and the bank suite now applies all four files) and were **applied to the hosted project on October 15, 2026** in one guarded transaction, after a read-only preflight, a private snapshot, and a rehearsed rollback; 13 postflight checks passed. See [DEPLOYMENT.md](DEPLOYMENT.md) for the record. Do not reapply them. They add tables (`member_standing`, `standing_events`, `gatherings`, `gathering_checkins`, `concerns`, `concern_notes`, `standing_pauses`, `steward_nominations`, `vouches`, `exchange_first_meetings`, `exchange_safety_checkins`, `exchange_steward_notes`), a `min_standing` column on offers and wants, and `bank_*` RPCs. They replace `bank_request_exchange` and `bank_exchange_action` with the same signatures, and replace `bank_save_listing` with one that takes an optional `p_min_standing`, so older callers keep working.

- A missing `member_standing` row means New. The backfill makes every `facilitator` a Steward and guesses nobody else. Fund review still uses the separate facilitator role.
- Every change in standing goes through a steward RPC and writes `standing_events` with who and why. Levels move up one step at a time and are never lowered by an RPC; a pause stops new exchanges instead. Steward needs nominations from two active stewards, a 14-day wait from the second, Known standing, and no open concern. Known needs `bank_known_ready()`: 60 days, 3 completed exchanges with 2 partners, 2 vouches from active Known or Steward members, and no open concern. Keep `KNOWN_RULES` in `src/lib/standing.ts` in step.
- Members read standing through `bank_member_standing()`, which never includes pauses, reasons, or concerns. Concerns are visible to the reporter and to stewards other than the subject. The vouch `home_answer` column is not granted to members; stewards read it with `bank_steward_vouches()`. Safety check-ins and after-exchange notes are visible to the writer and to stewards outside that exchange.

Founding stewards beyond the backfilled facilitator are named with trusted SQL, after a human decision, the same way as the facilitator role:

```sql
insert into public.member_standing(user_id,level,steward_renew_by)
values ('REPLACE_WITH_CONFIRMED_USER_UUID','steward',(now()+interval '1 year')::date)
on conflict (user_id) do update set level='steward',steward_renew_by=excluded.steward_renew_by;
insert into public.standing_events(member_id,kind,to_level,reason)
values ('REPLACE_WITH_CONFIRMED_USER_UUID','level','steward','Founding steward named by the coordinator');
``` The SQL RPCs enforce the same 18 want criteria and five kudos labels as `src/lib/types.ts`; update both allowlists together if product choices change. Project contributions track volunteered time and do not mint credits; they also require a stable UUID `request_id` so retries do not inflate hours. Urgent alerts require each recipient's opt-in via `bank_set_urgent_opt_in`; `bank_amplify_want` limits each member to one alert per 24 hours and each want to once per seven days. Notifications are in-app rows; there is no external email or push delivery in these migrations.

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

Both queries should return no mismatches/zero missing initial entries. For future schema changes, test a restorable backup or preview clone first, review the migration against the actual live shape, and verify signed-in flows and ledger integrity before deploying dependent code.
