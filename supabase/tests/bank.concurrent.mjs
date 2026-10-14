// Requires a NEW disposable PostgreSQL database and the `pg` package.
// BANK_TEST_DATABASE_URL=postgres://... BANK_TEST_CONFIRM_DISPOSABLE=1 node supabase/tests/bank.concurrent.mjs
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

if (!process.env.BANK_TEST_DATABASE_URL || process.env.BANK_TEST_CONFIRM_DISPOSABLE !== '1') {
  throw new Error('A disposable BANK_TEST_DATABASE_URL and BANK_TEST_CONFIRM_DISPOSABLE=1 are required');
}
const { Client } = await import('pg');
const clients = Array.from({ length: 4 }, () => new Client({ connectionString: process.env.BANK_TEST_DATABASE_URL }));
const [admin,first,second,provider] = clients;
const ids = [randomUUID(),randomUUID(),randomUUID()];
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const q = (client,sql,params=[]) => client.query(sql,params);
const scalar = async (client,sql,params=[]) => Object.values((await q(client,sql,params)).rows[0])[0];
const actor = async (client,id) => {
  await q(client,'reset role');
  await q(client,'set role authenticated');
  await q(client,`select set_config('request.jwt.claim.sub',$1,false)`,[id]);
};
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));

try {
  await Promise.all(clients.map(client => client.connect()));
  if (await scalar(admin,`select to_regclass('auth.users') is not null`)) {
    throw new Error('Database is not empty; concurrency test refuses to alter an existing auth schema');
  }
  await q(admin,`
    do $$ begin
      if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
      if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
    end $$;
    create schema auth;
    create table auth.users (
      id uuid primary key,email text,email_confirmed_at timestamptz,
      raw_user_meta_data jsonb not null default '{}'
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
    $$;
  `);
  for (const migration of ['migrations/20261014000100_bank_schema.sql','migrations/20261014000200_bank_rpcs.sql']) {
    await q(admin,await readFile(path.join(base,migration),'utf8'));
  }
  for (const [i,id] of ids.entries()) {
    await q(admin,`insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())`,[id,`concurrent${i}@example.test`]);
  }
  await q(admin,`insert into public.offers(user_id,title,description,category) values
    ($1,'Provider one','A service for concurrency tests','Test'),
    ($2,'Provider two','Another concurrency test service','Test')`,[ids[1],ids[2]]);
  await actor(first,ids[0]);
  const e1 = await scalar(first,`select public.bank_request_exchange('offer',1,90,'First concurrent request')`);
  const e2 = await scalar(first,`select public.bank_request_exchange('offer',2,90,'Second concurrent request')`);
  await actor(provider,ids[1]);
  await actor(second,ids[2]);

  // Different invited members try to accept 90-minute requests against one
  // 120-minute account. Account locking must prevent over-reservation.
  await q(provider,'begin');
  await q(provider,`select public.bank_exchange_action($1,'accept')`,[e1]);
  await q(second,'begin');
  const competing = q(second,`select public.bank_exchange_action($1,'accept')`,[e2]);
  await pause(150);
  await q(provider,'commit');
  await assert.rejects(competing,/insufficient available minutes/i);
  await q(second,'rollback');
  assert.equal(await scalar(admin,'select status from public.exchanges where id=$1',[e1]),'accepted');
  assert.equal(await scalar(admin,'select status from public.exchanges where id=$1',[e2]),'pending');
  let account = (await q(first,'select * from public.bank_account_summary()')).rows[0];
  assert.deepEqual([Number(account.balance_minutes),Number(account.reserved_minutes),Number(account.available_minutes)],[120,90,30]);
  await assert.rejects(q(first,`select public.bank_donate(40,'Cannot spend reserved funds',$1)`,
    ['33333333-3333-4333-8333-333333333333']),/insufficient available minutes/i);

  // Cancelling releases the hold. A donation then succeeds before a second
  // request reserves 90 minutes, which are consumed on completion.
  await q(first,`select public.bank_exchange_action($1,'cancel')`,[e1]);
  account = (await q(first,'select * from public.bank_account_summary()')).rows[0];
  assert.deepEqual([Number(account.balance_minutes),Number(account.reserved_minutes),Number(account.available_minutes)],[120,0,120]);
  await q(first,`select public.bank_donate(20,'After cancellation',$1)`,
    ['44444444-4444-4444-8444-444444444444']);
  await q(second,`select public.bank_exchange_action($1,'accept')`,[e2]);
  account = (await q(first,'select * from public.bank_account_summary()')).rows[0];
  assert.deepEqual([Number(account.balance_minutes),Number(account.reserved_minutes),Number(account.available_minutes)],[100,90,10]);
  await q(second,`select public.bank_exchange_action($1,'confirm')`,[e2]);
  await q(first,`select public.bank_exchange_action($1,'confirm')`,[e2]);
  account = (await q(first,'select * from public.bank_account_summary()')).rows[0];
  assert.deepEqual([Number(account.balance_minutes),Number(account.reserved_minutes),Number(account.available_minutes)],[10,0,10]);
  assert.equal(Number(await scalar(admin,'select count(*) from public.ledger_entries where exchange_id=$1',[e2])),2);
  assert.equal(Number(await scalar(admin,'select count(*) from public.ledger_entries where exchange_id=$1',[e1])),0);

  // Two simultaneous confirmations for one exchange cannot create a second
  // ledger pair. The second sees the completed state and returns the same ID.
  const e3 = await scalar(first,`select public.bank_request_exchange('offer',1,10,'Duplicate completion test')`);
  await q(provider,`select public.bank_exchange_action($1,'accept')`,[e3]);
  await q(provider,`select public.bank_exchange_action($1,'confirm')`,[e3]);
  await actor(second,ids[0]);
  await q(first,'begin');
  await q(first,`select public.bank_exchange_action($1,'confirm')`,[e3]);
  await q(second,'begin');
  const duplicate = q(second,`select public.bank_exchange_action($1,'confirm')`,[e3]);
  await pause(150);
  await q(first,'commit');
  assert.equal(Number((await duplicate).rows[0].bank_exchange_action),Number(e3));
  await q(second,'commit');
  assert.equal(Number(await scalar(admin,'select count(*) from public.ledger_entries where exchange_id=$1',[e3])),2);
  assert.equal(Number(await scalar(admin,'select balance_minutes from public.accounts where user_id=$1',[ids[0]])),0);
  console.log('Bank concurrency tests passed');
} finally {
  await Promise.allSettled(clients.map(client => client.end()));
}
