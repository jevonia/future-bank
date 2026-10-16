import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  KNOWN_RULES, LEVEL_INFO, MIN_STANDING, NOT_A_PROMISE, STANDING_LEVELS,
  knownChecklist, meetsMinimum, standingLines,
} from '../src/lib/standing';
import { buildStandingIndex } from '../src/lib/standing-view';
import { isFirstMeeting, noStewardReached, tellAFriendText } from '../src/lib/safety';
import { WANT_CRITERIA } from '../src/lib/types';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const standingSql = read('supabase/migrations/20261015000100_standing.sql');
const now = new Date('2026-10-15T16:00:00Z');

describe('standing rules match the database', () => {
  it('uses the same Known thresholds as bank_known_ready()', () => {
    const ready = standingSql.slice(standingSql.indexOf('function public.bank_known_ready'));
    assert.match(ready, new RegExp(`days_member>=${KNOWN_RULES.days}\\b`));
    assert.match(ready, new RegExp(`completed_exchanges>=${KNOWN_RULES.exchanges}\\b`));
    assert.match(ready, new RegExp(`exchange_partners>=${KNOWN_RULES.partners}\\b`));
    assert.match(ready, new RegExp(`vouches>=${KNOWN_RULES.vouches}\\b`));
  });

  it('offers the same "Who can say yes?" choices and criteria the SQL accepts', () => {
    assert.match(standingSql, new RegExp(`check \\(min_standing in \\(${MIN_STANDING.map(item => `'${item}'`).join(',')}\\)\\)`));
    const save = standingSql.slice(standingSql.indexOf('function public.bank_save_listing'));
    const start = save.indexOf('array[');
    const allowed = save.slice(start, save.indexOf('])', start)).match(/'([a-z_]+)'/g)?.map(item => item.slice(1, -1));
    assert.deepEqual(allowed, [...WANT_CRITERIA]);
  });
});

describe('who can say yes', () => {
  it('lets anyone answer an Anyone listing, even when paused', () => {
    assert.equal(meetsMinimum('new', 'anyone'), true);
    assert.equal(meetsMinimum('new', undefined, true), true);
  });
  it('counts levels in order and treats a pause as not meeting a minimum', () => {
    assert.equal(meetsMinimum('new', 'introduced'), false);
    assert.equal(meetsMinimum('introduced', 'introduced'), true);
    assert.equal(meetsMinimum('introduced', 'known'), false);
    assert.equal(meetsMinimum('steward', 'known'), true);
    assert.equal(meetsMinimum('steward', 'introduced', true), false);
  });
});

describe('standing lines in plain words', () => {
  const base = { joined_at: '2026-10-13T12:00:00Z', completed_exchanges: 0, exchange_partners: 0 };
  it('turns a New member into an invitation to the next gathering', () => {
    assert.deepEqual(
      standingLines({ ...base, level: 'new' }, { now, nextGathering: { title: 'October repair day', starts_at: '2026-10-24T15:00:00Z' } }),
      ['Joined this week.', "Hasn't been to a gathering yet.", 'The next one is October repair day, Saturday, October 24 at 11:00 AM.'],
    );
    assert.deepEqual(standingLines({ ...base, level: 'new', joined_at: '2026-08-02T12:00:00Z' }, { now }), ['Joined in August 2026.', "Hasn't been to a gathering yet."]);
  });
  it('says who introduced someone and how many exchanges, never more', () => {
    assert.deepEqual(standingLines({
      ...base, level: 'known', joined_at: '2026-09-01T12:00:00Z', introduced_by_name: 'Nova',
      introduced_at: '2026-10-03T16:00:00Z', gathering_title: 'October repair day', completed_exchanges: 6, exchange_partners: 4,
    }, { now }), ['Met by Nova at October repair day, October 2026.', '6 exchanges with 4 members since September 2026.']);
    assert.deepEqual(standingLines({ ...base, level: 'introduced', introduced_by_name: 'Nova', introduced_at: '2026-10-14T16:00:00Z', completed_exchanges: 1, exchange_partners: 1 }, { now }),
      ['Met by Nova, October 2026.', '1 exchange with 1 member since October 2026.']);
    assert.deepEqual(standingLines({ ...base, level: 'steward' }, { now }), ['One of the founding stewards.']);
  });
  it('shows a member their own Known checklist', () => {
    assert.deepEqual(knownChecklist({ days_member: 61, completed_exchanges: 3, exchange_partners: 1, vouches: 2 }).map(item => item.done), [true, true, false, true]);
  });
});

describe('standing index', () => {
  it('names members, defaults to New, and finds the next gathering', () => {
    const index = buildStandingIndex({
      members: [{ id: 'a', username: 'Rosa', avatar_url: null }, { id: 'b', username: null, avatar_url: null }],
      standings: [],
      vouches: [{ id: 1, voucher_id: 'a', member_id: 'b', sentence: 'We met at the repair day.', basis: 'met', created_at: '2026-10-01T00:00:00Z' }],
      pauses: [],
      gatherings: [
        { id: 2, title: 'Later', starts_at: '2026-11-20T15:00:00Z', location: 'Hall', host_id: 'a', created_at: '' },
        { id: 1, title: 'Sooner', starts_at: '2026-10-24T15:00:00Z', location: 'Hall', host_id: 'a', created_at: '' },
        { id: 0, title: 'Past', starts_at: '2026-09-24T15:00:00Z', location: 'Hall', host_id: 'a', created_at: '' },
      ],
    }, now);
    assert.equal(index.name('a'), 'Rosa');
    assert.equal(index.name('b'), 'A member');
    assert.equal(index.levelOf('a'), 'new');
    assert.equal(index.nextGathering?.title, 'Sooner');
    assert.equal(index.vouchesFor('b').length, 1);
  });
});

describe('first-meeting card', () => {
  const exchange = { id: 3, status: 'accepted' as const, provider_id: 'a', requester_id: 'b' };
  it('shows only when two people have not finished an exchange together', () => {
    assert.equal(isFirstMeeting([exchange], exchange), true);
    assert.equal(isFirstMeeting([exchange, { id: 1, status: 'cancelled', provider_id: 'b', requester_id: 'a' }], exchange), true);
    assert.equal(isFirstMeeting([exchange, { id: 2, status: 'completed', provider_id: 'b', requester_id: 'a' }], exchange), false);
  });
  it('writes a "Tell a friend" message even before plans are set', () => {
    assert.equal(
      tellAFriendText({ otherName: 'Marcus', title: 'Brake pads', place: '', checkIn: 'By 4 p.m.' }),
      'I\'m meeting Marcus from New Future Bank for "Brake pads". Where: not decided yet. I\'ll check in with you: By 4 p.m.. If you don\'t hear from me, please check on me.',
    );
  });  it('flags a call request or concern that reached no steward', () => {
    assert.equal(noStewardReached({ checkin_id: 4, stewards_notified: 0 }), true);
    assert.equal(noStewardReached([{ concern_id: 9, stewards_notified: 0 }]), true);
    assert.equal(noStewardReached({ checkin_id: 4, stewards_notified: 2 }), false);
    assert.equal(noStewardReached({ checkin_id: 4, stewards_notified: null }), false, 'a fine check-in');
    assert.equal(noStewardReached(12), false, 'results from before the migration');
    assert.equal(noStewardReached(null), false);
  });
});

describe('standing copy follows the writing guide and the false-confidence rule', () => {
  const copy = [
    JSON.stringify(LEVEL_INFO), NOT_A_PROMISE,
    read('src/components/standing/StandingGraphic.tsx'),
    read('src/app/standing/page.tsx'),
    read('src/components/standing/StandingDialogs.tsx'),
    read('src/components/standing/StandingPanel.tsx'),
    read('src/components/standing/SafetyCard.tsx'),
    read('src/components/standing/NoStewardReached.tsx'),
  ].join('\n');
  it('has no em dashes', () => assert.equal(copy.includes('—'), false));
  it('uses the words, never the plan letters', () => {
    assert.doesNotMatch(copy, /\b(level|standing) [ABCD]\b/i);
    assert.doesNotMatch(copy, /\([ABCD]\)/);
  });
  it('says what every level means and does not mean', () => {
    for (const level of STANDING_LEVELS) {
      assert.ok(LEVEL_INFO[level].means.length > 20, level);
      assert.ok(LEVEL_INFO[level].doesNotMean.length > 20, level);
    }
    assert.match(NOT_A_PROMISE, /not a safety promise/);
  });
});
