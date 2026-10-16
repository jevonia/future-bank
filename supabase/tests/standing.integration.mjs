// Run with: node supabase/tests/standing.integration.mjs
// Applies every migration to an in-memory PostgreSQL (PGlite) and checks the
// standing, gathering, concern, vouch, and safety-card rules and their privacy.
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const db = new PGlite();
const ids = {
  nova: '00000000-0000-4000-8000-0000000000a1',
  rosa: '00000000-0000-4000-8000-0000000000a2',
  marcus: '00000000-0000-4000-8000-0000000000a3',
  denise: '00000000-0000-4000-8000-0000000000a4',
  earl: '00000000-0000-4000-8000-0000000000a5',
  tyler: '00000000-0000-4000-8000-0000000000a6',
  unconfirmed: '00000000-0000-4000-8000-0000000000a7',
};
const run = async (sql, params = []) => db.query(sql, params);
const one = async (sql, params = []) => (await run(sql, params)).rows[0];
const scalar = async (sql, params = []) => Object.values(await one(sql, params))[0];
const count = async (sql, params = []) => Number(await scalar(sql, params));
const as = async (id, work) => {
  await run('set role authenticated');
  await run(`select set_config('request.jwt.claim.sub',$1,false)`, [id]);
  try { return await work(); }
  finally { await run('reset role'); await run(`select set_config('request.jwt.claim.sub','',false)`); }
};
const expectDenied = async (work, label, pattern) => {
  let error = null;
  try { await work(); } catch (caught) { error = caught; }
  assert.ok(error, `${label} should fail`);
  if (pattern) assert.match(error.message, pattern, label);
};
const notices = (id, title) => count('select count(*) from public.notifications where user_id=$1 and title=$2', [id, title]);
// level() reads as the database owner; seenLevel() reads as the signed-in member.
const level = (id) => scalar('select public.bank_level_of($1)', [id]);
const seenLevel = (id) => scalar('select level from public.bank_member_standing() where user_id=$1', [id]);
const migrations = [
  'migrations/20261014000100_bank_schema.sql',
  'migrations/20261014000200_bank_rpcs.sql',
  'migrations/20261015000100_standing.sql',
  'migrations/20261015000200_vouches_and_safety.sql',
];

try {
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin;
    create schema auth;
    grant usage on schema auth to authenticated, anon;
    create table auth.users (
      id uuid primary key,
      email text,
      email_confirmed_at timestamptz,
      raw_user_meta_data jsonb not null default '{}'
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
    $$;
  `);
  for (const migration of migrations.slice(0, 2)) {
    await db.exec(await readFile(path.join(base, migration), 'utf8'));
  }
  for (const [name, id] of Object.entries(ids)) {
    await run(`insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values($1,$2,$3,$4)`,
      [id, `${name}@example.test`, name === 'unconfirmed' ? null : new Date(), { username: name }]);
  }
  // The facilitator who exists before standing ships becomes the first steward.
  await run(`insert into public.member_roles(user_id,role) values($1,'facilitator')`, [ids.nova]);
  for (const migration of migrations.slice(2)) {
    await db.exec(await readFile(path.join(base, migration), 'utf8'));
  }

  // Backfill: facilitator -> Steward with a renewal date and a recorded reason.
  assert.equal(await scalar('select level from public.member_standing where user_id=$1', [ids.nova]), 'steward');
  assert.ok(await scalar('select steward_renew_by from public.member_standing where user_id=$1', [ids.nova]));
  assert.equal(await count(`select count(*) from public.standing_events where member_id=$1 and to_level='steward'`, [ids.nova]), 1);
  assert.equal(await count('select count(*) from public.member_standing'), 1, 'nobody else is guessed into a level');

  // Grants: no direct writes, no private columns, no internal helpers.
  for (const table of ['member_standing', 'gatherings', 'gathering_checkins', 'concerns', 'standing_pauses', 'vouches']) {
    assert.equal(await scalar(`select has_table_privilege('authenticated','public.${table}','INSERT')`), false, `${table} insert`);
    assert.equal(await scalar(`select has_table_privilege('anon','public.${table}','SELECT')`), false, `${table} anon read`);
  }
  assert.equal(await scalar(`select has_column_privilege('authenticated','public.vouches','home_answer','SELECT')`), false);
  assert.equal(await scalar(`select has_column_privilege('authenticated','public.vouches','sentence','SELECT')`), true);
  for (const fn of ['bank_level_of(uuid)', 'bank_known_ready(uuid)', 'bank_notify_stewards(text,text,uuid[])', 'bank_known_facts(uuid)']) {
    assert.equal(await scalar(`select has_function_privilege('authenticated','public.${fn}','EXECUTE')`), false, fn);
  }
  assert.equal(await scalar(`select has_function_privilege('anon','public.bank_member_standing()','EXECUTE')`), false);

  await as(ids.unconfirmed, async () => {
    await expectDenied(() => run('select * from public.bank_member_standing()'), 'unconfirmed standing list');
    assert.equal(await count('select count(*) from public.member_standing'), 0);
  });

  // Only stewards plan gatherings and check people in.
  await as(ids.rosa, () => expectDenied(
    () => run(`select public.bank_create_gathering('Repair day','2026-01-01','Church hall')`), 'member creates gathering'));
  const repairDay = await as(ids.nova, () => scalar(
    `select public.bank_create_gathering('October repair day',now()-interval '2 hours','Grace church hall, side door')`));
  assert.equal(await notices(ids.rosa, 'New community gathering'), 0, 'past gatherings are logged quietly');
  const nextMonth = await as(ids.nova, () => scalar(
    `select public.bank_create_gathering('November cooking afternoon',now()+interval '20 days','Community room')`));
  assert.equal(await notices(ids.rosa, 'New community gathering'), 1);
  assert.equal(await notices(ids.unconfirmed, 'New community gathering'), 0);
  await as(ids.nova, async () => {
    await expectDenied(() => run(`select public.bank_create_gathering('Old',now()-interval '200 days','Somewhere')`), 'gathering too old');
    await expectDenied(() => run(`select public.bank_check_in($1,$2)`, [nextMonth, ids.rosa]), 'check in before the day', /day of the gathering/);
    await expectDenied(() => run(`select public.bank_check_in($1,$2)`, [repairDay, ids.nova]), 'self check-in');
    await expectDenied(() => run(`select public.bank_check_in($1,$2)`, [repairDay, ids.unconfirmed]), 'unconfirmed check-in');
    await run(`select public.bank_check_in($1,$2)`, [repairDay, ids.rosa]);
    await run(`select public.bank_check_in($1,$2)`, [repairDay, ids.rosa]);
    await run(`select public.bank_check_in($1,$2)`, [repairDay, ids.tyler]);
  });
  assert.equal(await count('select count(*) from public.gathering_checkins where member_id=$1', [ids.rosa]), 1);
  assert.equal(await notices(ids.rosa, 'You are now Introduced'), 1);
  await as(ids.marcus, async () => {
    const rosa = await one('select * from public.bank_member_standing() where user_id=$1', [ids.rosa]);
    assert.equal(rosa.level, 'introduced');
    assert.equal(rosa.introduced_by, ids.nova);
    assert.equal(rosa.gathering_title, 'October repair day');
    assert.equal(await seenLevel(ids.marcus), 'new');
    assert.equal(await count('select count(*) from public.gathering_checkins'), 0, 'others do not see attendance');
    assert.equal(await count('select count(*) from public.standing_events'), 0, 'others do not see reasons');
    assert.equal(await count('select count(*) from public.gatherings'), 2, 'members see gatherings');
  });
  await as(ids.rosa, async () => {
    assert.equal(await count('select count(*) from public.gathering_checkins'), 1, 'members see their own attendance');
    assert.equal(await count('select count(*) from public.standing_events'), 1);
  });
  await as(ids.nova, async () => assert.equal(await count('select count(*) from public.gathering_checkins'), 2));

  // Moving up: one step at a time, never lowered, never your own.
  await as(ids.nova, async () => {
    await expectDenied(() => run(`select public.bank_set_standing($1,'known','Skipping ahead')`, [ids.marcus]), 'skip a step', /one step/);
    await expectDenied(() => run(`select public.bank_set_standing($1,'introduced','x')`, [ids.marcus]), 'missing reason');
    await run(`select public.bank_set_standing($1,'introduced','Met for coffee on his porch')`, [ids.marcus]);
    await expectDenied(() => run(`select public.bank_set_standing($1,'introduced','Again')`, [ids.marcus]), 'same level');
    await expectDenied(() => run(`select public.bank_set_standing($1,'known','Not ready')`, [ids.rosa]), 'known not ready', /Known conditions/);
    await expectDenied(() => run(`select public.bank_set_standing($1,'steward','Myself')`, [ids.nova]), 'own standing');
  });
  await as(ids.marcus, () => expectDenied(
    () => run(`select public.bank_set_standing($1,'introduced','I met her')`, [ids.denise]), 'member sets standing'));
  assert.equal(await scalar('select introduced_by from public.member_standing where user_id=$1', [ids.marcus]), ids.nova);

  // "Who can say yes?" is enforced when someone responds and again on accept.
  const careWant = await as(ids.denise, () => scalar(
    `select public.bank_save_listing('want',null,'Sit with my mother','Two hours on Saturday afternoon','Care',array['someone_else_present'],'introduced')`));
  assert.equal(await scalar('select min_standing from public.wants where id=$1', [careWant]), 'introduced');
  await as(ids.denise, () => expectDenied(
    () => run(`select public.bank_save_listing('want',null,'Bad setting','A listing with a bad setting','Care','{}','steward')`), 'invalid min standing'));
  const oldClient = await as(ids.denise, () => scalar(
    `select public.bank_save_listing(p_kind=>'offer',p_id=>null,p_title=>'Bread',p_description=>'Fresh bread on Sundays',p_category=>'Food',p_criteria=>'{}')`));
  assert.equal(await scalar('select min_standing from public.offers where id=$1', [oldClient]), 'anyone', 'old callers default to Anyone');
  await as(ids.earl, () => expectDenied(
    () => run(`select public.bank_request_exchange('want',$1,60,'I can help')`, [careWant]), 'New member responds', /met in person/));
  const careExchange = await as(ids.rosa, () => scalar(`select public.bank_request_exchange('want',$1,60,'I can sit with her')`, [careWant]));
  await as(ids.earl, () => scalar(`select public.bank_request_exchange('offer',$1,30,'Bread please')`, [oldClient]));

  // A pause stops new exchanges, is visible to the member, and is lifted openly.
  await as(ids.nova, () => run(`select public.bank_pause_standing($1,'Checking in about a missed exchange',null)`, [ids.rosa]));
  assert.equal(await notices(ids.rosa, 'A steward has asked to talk with you before your next exchange'), 1);
  await as(ids.denise, async () => {
    await expectDenied(() => run(`select public.bank_exchange_action($1,'accept')`, [careExchange]), 'accept with paused member');
    assert.equal(await count('select count(*) from public.standing_pauses'), 0, 'pauses are private');
    assert.equal(await seenLevel(ids.rosa), 'introduced', 'a pause does not show on the profile');
  });
  await as(ids.rosa, async () => {
    assert.equal(await count('select count(*) from public.standing_pauses'), 1);
    await expectDenied(() => run(`select public.bank_request_exchange('offer',$1,30,'Bread')`, [oldClient]), 'paused request', /talk with you/);
  });
  await as(ids.nova, async () => {
    await expectDenied(() => run(`select public.bank_pause_standing($1,'Twice',null)`, [ids.rosa]), 'double pause');
    await expectDenied(() => run(`select public.bank_set_standing($1,'known','While paused')`, [ids.rosa]), 'raise while paused');
    await run(`select public.bank_unpause_standing($1,'We talked and it is sorted')`, [ids.rosa]);
  });
  await as(ids.denise, () => run(`select public.bank_exchange_action($1,'accept')`, [careExchange]));
  assert.equal(await count(`select count(*) from public.standing_events where member_id=$1 and kind in ('pause','unpause')`, [ids.rosa]), 2);

  // Concerns go to stewards, never to the person they are about.
  const concern = await as(ids.denise, () => scalar(
    `select public.bank_raise_concern($1,null,'She arrived an hour late and left before we finished.',false)`, [ids.rosa]));
  assert.equal(await notices(ids.nova, 'A private concern needs a steward'), 1);
  assert.equal(await notices(ids.rosa, 'A private concern needs a steward'), 0);
  await as(ids.denise, async () => {
    await expectDenied(() => run(`select public.bank_raise_concern($1,null,'About myself somehow',false)`, [ids.denise]), 'self concern');
    await expectDenied(() => run(`select public.bank_raise_concern(null,$1,'Not my exchange at all',false)`, [careExchange + 100]), 'unknown exchange');
    assert.equal(await count('select count(*) from public.concerns'), 1);
  });
  await as(ids.rosa, () => count('select count(*) from public.concerns').then(n => assert.equal(n, 0, 'subject cannot see')));
  await as(ids.marcus, () => count('select count(*) from public.concerns').then(n => assert.equal(n, 0, 'other members cannot see')));
  await as(ids.marcus, () => expectDenied(
    () => run(`select public.bank_respond_concern($1,'Thanks',null,false)`, [concern]), 'member responds to concern'));
  await as(ids.nova, async () => {
    assert.equal(await count('select count(*) from public.concerns'), 1);
    await run(`select public.bank_respond_concern($1,'Thank you for telling us. I will call you tomorrow.','Spoke with Denise by phone.',false)`, [concern]);
    const progress = await one('select * from public.bank_known_progress($1)', [ids.rosa]);
    assert.equal(progress.unresolved_concerns, 1);
  });
  assert.equal(await notices(ids.denise, 'A steward answered your concern'), 1);
  await as(ids.denise, async () => {
    assert.equal(await scalar('select status from public.concerns where id=$1', [concern]), 'responded');
    assert.match(await scalar('select response from public.concerns where id=$1', [concern]), /call you tomorrow/);
    assert.equal(await count('select count(*) from public.concern_notes'), 0, 'notes stay with stewards');
  });
  await as(ids.rosa, async () => {
    const own = await one('select * from public.bank_known_progress($1)', [ids.rosa]);
    assert.equal(own.unresolved_concerns, null, 'members never learn of concerns from progress');
    await expectDenied(() => run('select * from public.bank_known_progress($1)', [ids.marcus]), 'another member progress');
  });
  // A concern about a steward is hidden from that steward.
  const aboutNova = await as(ids.tyler, () => scalar(
    `select public.bank_raise_concern($1,null,'He was short with me at the repair day.',true)`, [ids.nova]));
  await as(ids.nova, async () => {
    assert.equal(await count('select count(*) from public.concerns where id=$1', [aboutNova]), 0);
    await expectDenied(() => run(`select public.bank_respond_concern($1,'No',null,true)`, [aboutNova]), 'steward answers own concern');
  });

  // A second steward, named by the coordinator with trusted SQL as documented.
  await run(`insert into public.member_standing(user_id,level,granted_by,steward_renew_by) values($1,'steward',null,(now()+interval '1 year')::date)`, [ids.earl]);
  await as(ids.earl, async () => {
    assert.equal(await count('select count(*) from public.concerns where id=$1', [aboutNova]), 1);
    await run(`select public.bank_respond_concern($1,'Thanks for saying so. We will talk with him.',null,true)`, [aboutNova]);
  });

  // Vouches: only Known or Steward, never for yourself, a sentence plus a private answer.
  await as(ids.rosa, () => expectDenied(
    () => run(`select public.bank_vouch($1,'I know Marcus from the repair day.','met','yes',true)`, [ids.marcus]), 'Introduced vouches', /Known neighbors/));
  await as(ids.nova, async () => {
    await expectDenied(() => run(`select public.bank_vouch($1,'Myself, truly great.','met','yes',true)`, [ids.nova]), 'self vouch');
    await expectDenied(() => run(`select public.bank_vouch($1,'I know Rosa from the repair day.','met','yes',false)`, [ids.rosa]), 'same household');
    await expectDenied(() => run(`select public.bank_vouch($1,'We traded hours last week.','exchange','yes',true)`, [ids.rosa]), 'exchange basis without exchange', /not finished an exchange/);
    await run(`select public.bank_vouch($1,'I know Rosa from the repair day. She fixed my screen door.','met','yes',true)`, [ids.rosa]);
    await expectDenied(() => run(`select public.bank_vouch($1,'Saying it twice.','met','yes',true)`, [ids.rosa]), 'duplicate vouch');
  });
  await as(ids.earl, () => run(`select public.bank_vouch($1,'Rosa helped me carry tables after the repair day.','met','not_sure',true)`, [ids.rosa]));
  assert.equal(await notices(ids.rosa, 'A neighbor vouched for you'), 2);
  await as(ids.marcus, async () => {
    assert.equal(await count('select count(*) from public.vouches where member_id=$1', [ids.rosa]), 2);
    await expectDenied(() => run('select home_answer from public.vouches'), 'member reads private answer');
    await expectDenied(() => run('select * from public.bank_steward_vouches()'), 'member reads steward vouches');
    await expectDenied(() => run('select * from public.bank_known_suggestions()'), 'member reads suggestions');
  });
  await as(ids.nova, async () => {
    const answers = (await run('select home_answer from public.bank_steward_vouches() where member_id=$1 order by created_at', [ids.rosa])).rows;
    assert.deepEqual(answers.map(row => row.home_answer), ['yes', 'not_sure']);
  });

  // Known is suggested only when every condition holds, then a steward confirms.
  const finish = async (provider, requester, title) => {
    const offer = await as(provider, () => scalar(
      `select public.bank_save_listing('offer',null,$1,'A short neighborly job','Skills','{}')`, [title]));
    const exchange = await as(requester, () => scalar(`select public.bank_request_exchange('offer',$1,15,null)`, [offer]));
    await as(provider, () => run(`select public.bank_exchange_action($1,'accept')`, [exchange]));
    await as(provider, () => run(`select public.bank_exchange_action($1,'confirm')`, [exchange]));
    await as(requester, () => run(`select public.bank_exchange_action($1,'confirm')`, [exchange]));
    return exchange;
  };
  await finish(ids.rosa, ids.marcus, 'Fix a screen door');
  await finish(ids.rosa, ids.marcus, 'Patch a bike tire');
  await finish(ids.denise, ids.rosa, 'Braid hair');
  await as(ids.nova, async () => {
    assert.equal(await count('select count(*) from public.bank_known_suggestions()'), 0, 'too new and an open concern');
  });
  await run(`update public.profiles set created_at=now()-interval '61 days' where id=$1`, [ids.rosa]);
  await as(ids.nova, async () => {
    assert.equal(await count('select count(*) from public.bank_known_suggestions()'), 0, 'open concern blocks Known');
    await run(`select public.bank_respond_concern($1,null,null,true)`, [concern]);
    const suggestion = await one('select * from public.bank_known_suggestions()');
    assert.equal(suggestion.member_id, ids.rosa);
    assert.deepEqual([suggestion.completed_exchanges, suggestion.exchange_partners, suggestion.vouches], [3, 2, 2]);
    assert.equal(suggestion.vouchers_connected, false);
    await run(`select public.bank_set_standing($1,'known','Two vouches, three exchanges, we talked at the cooking afternoon')`, [ids.rosa]);
  });
  assert.equal(await level(ids.rosa), 'known');
  assert.equal(await scalar('select introduced_by from public.member_standing where user_id=$1', [ids.rosa]), ids.nova, 'introduction is kept');

  // A Known neighbor can vouch, but an "exchange" vouch needs a real exchange.
  await as(ids.rosa, async () => {
    await run(`select public.bank_vouch($1,'Marcus and I traded hours twice. He is careful and on time.','exchange','yes',true)`, [ids.marcus]);
    await expectDenied(() => run(`select public.bank_vouch($1,'We traded hours once.','exchange','yes',true)`, [ids.tyler]), 'no shared exchange');
    await run('select public.bank_withdraw_vouch($1)', [ids.marcus]);
    assert.equal(await count('select count(*) from public.vouches where voucher_id=$1', [ids.rosa]), 0);
  });

  // Steward: two stewards nominate, two weeks pass, then a steward confirms.
  await as(ids.nova, () => run(`select public.bank_nominate_steward($1,'Rosa already welcomes new people')`, [ids.rosa]));
  await as(ids.nova, () => expectDenied(() => run(`select public.bank_nominate_steward($1,'Again')`, [ids.rosa]), 'double nomination'));
  await as(ids.nova, () => expectDenied(() => run(`select public.bank_nominate_steward($1,'Not Known')`, [ids.marcus]), 'nominate non-Known'));
  await as(ids.nova, () => expectDenied(() => run(`select public.bank_set_standing($1,'steward','One nomination')`, [ids.rosa]), 'one nomination', /two current stewards/));
  await as(ids.earl, () => run(`select public.bank_nominate_steward($1,'She runs the repair table')`, [ids.rosa]));
  assert.equal(await notices(ids.marcus, 'A neighbor was nominated as a steward'), 1, 'everyone hears so they can raise a concern');
  await as(ids.nova, () => expectDenied(() => run(`select public.bank_set_standing($1,'steward','Too soon')`, [ids.rosa]), 'waiting period', /two-week/));
  await run(`update public.steward_nominations set created_at=now()-interval '15 days' where member_id=$1`, [ids.rosa]);
  await as(ids.nova, () => run(`select public.bank_set_standing($1,'steward','Talked about the role; she signed the steward commitments')`, [ids.rosa]));
  assert.equal(await level(ids.rosa), 'steward');
  assert.equal(await count('select count(*) from public.steward_nominations'), 0);
  await as(ids.earl, () => run(`select public.bank_renew_steward($1,'Another good year')`, [ids.nova]));
  await as(ids.nova, () => expectDenied(() => run(`select public.bank_renew_steward($1,'Myself')`, [ids.nova]), 'self renewal'));

  // A paused steward loses steward powers until the pause is lifted.
  await as(ids.nova, () => run(`select public.bank_pause_standing($1,'Talking through the November plan',null)`, [ids.earl]));
  await as(ids.earl, async () => {
    assert.equal(await scalar('select public.bank_is_steward()'), false);
    await expectDenied(() => run(`select public.bank_create_gathering('Yard day',now()+interval '3 days','Ms. Lee''s yard')`), 'paused steward');
  });
  await as(ids.rosa, () => run(`select public.bank_unpause_standing($1,'All sorted')`, [ids.earl]));

  // Safety card: first-meeting answers are shared by the two people only.
  const offer = await as(ids.marcus, () => scalar(`select public.bank_save_listing('offer',null,'Change a car battery','I have the tools','Repair','{}')`));
  const meeting = await as(ids.tyler, () => scalar(`select public.bank_request_exchange('offer',$1,30,null)`, [offer]));
  await as(ids.marcus, () => run(`select public.bank_exchange_action($1,'accept')`, [meeting]));
  await as(ids.tyler, () => run(`select public.bank_save_first_meeting($1,'Library parking lot','My sister','By 4pm')`, [meeting]));
  await as(ids.marcus, async () => {
    assert.equal(await scalar('select meet_place from public.exchange_first_meetings where exchange_id=$1', [meeting]), 'Library parking lot');
    await expectDenied(() => run(`select public.bank_exchange_steward_note($1,'Too early')`, [meeting]), 'note before confirming');
  });
  await as(ids.denise, async () => assert.equal(await count('select count(*) from public.exchange_first_meetings'), 0));
  await as(ids.tyler, async () => {
    await expectDenied(() => run(`select public.bank_safety_checkin($1,'panic')`, [meeting]), 'bad check-in');
    await run(`select public.bank_safety_checkin($1,'call_me')`, [meeting]);
  });
  assert.equal(await notices(ids.nova, 'A member asked a steward to call them'), 1);
  assert.equal(await notices(ids.marcus, 'A member asked a steward to call them'), 0, 'the other person is never told');
  await as(ids.marcus, async () => assert.equal(await count('select count(*) from public.exchange_safety_checkins'), 0));
  await as(ids.denise, () => expectDenied(() => run(`select public.bank_safety_checkin($1,'fine')`, [meeting]), 'outsider check-in'));
  await as(ids.marcus, () => run(`select public.bank_exchange_action($1,'confirm')`, [meeting]));
  await as(ids.marcus, () => run(`select public.bank_exchange_steward_note($1,'He was kind. Nothing to report.')`, [meeting]));
  await as(ids.tyler, async () => {
    assert.equal(await count('select count(*) from public.exchange_steward_notes'), 0, 'the other person cannot read the note');
    await expectDenied(() => run('select * from public.bank_steward_safety_feed()'), 'member reads safety feed');
  });
  await as(ids.nova, async () => {
    const feed = (await run('select kind,member_id from public.bank_steward_safety_feed() order by kind')).rows;
    assert.deepEqual(feed.map(row => [row.kind, row.member_id]), [['call_me', ids.tyler], ['note', ids.marcus]]);
  });
  console.log('Standing integration/security tests passed');
} finally {
  await db.close();
}
