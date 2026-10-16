import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateCommunityMutation, InputError } from '../src/lib/community-validation';

test('mutations allow only named RPCs and remove caller-selected identity/credit fields', () => {
  const result = validateCommunityMutation({ action: 'save_listing', kind: 'offer', title: 'Bike help', description: 'I can help repair your bike.', category: 'Repair', user_id: 'another-member', balance_minutes: 9000 });
  assert.equal(result.rpc, 'bank_save_listing');
  assert.equal(result.args.p_id, null);
  assert.equal('user_id' in result.args, false);
  assert.equal('balance_minutes' in result.args, false);
  assert.throws(() => validateCommunityMutation({ action: 'complete_exchange' }), InputError);
});
test('money-like hour amounts require exact bounded integers and a stable operation key', () => {
  const id = 'b7a05b4a-1604-4c76-9d84-c20aac938f8b';
  assert.equal(validateCommunityMutation({ action: 'donate', minutes: 30, request_id: id }).args.p_request_id, id);
  for (const minutes of [-1, 0, 0.5, Infinity, '30', 10081]) {
    assert.throws(() => validateCommunityMutation({ action: 'donate', minutes, request_id: id }), InputError);
  }
  assert.throws(() => validateCommunityMutation({ action: 'donate', minutes: 30 }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'contribute_project', project_id: 1, minutes: 30, request_id: 'invalid' }), InputError);
});
test('preferences, actions, and labels cannot be forged with arbitrary values', () => {
  assert.throws(() => validateCommunityMutation({ action: 'exchange_action', id: 1, operation: 'mint' }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'set_urgent_opt_in', enabled: 'false' }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'give_kudos', exchange_id: 1, labels: ['invented'] }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'save_listing', kind: 'want', title: 'Some help', description: 'More than ten characters.', category: 'Other', criteria: ['secret'] }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'read_notifications', ids: [1, -2] }), InputError);
});
test('standing actions accept only named levels, real member IDs, and complete answers', () => {
  const member = '00000000-0000-4000-8000-0000000000a2';
  const listing = { action: 'save_listing', kind: 'want', title: 'Sit with my mother', description: 'Two hours on Saturday.', category: 'Care' };
  assert.equal('p_min_standing' in validateCommunityMutation(listing).args, false, 'older databases keep working');
  assert.equal(validateCommunityMutation({ ...listing, min_standing: 'introduced', criteria: ['someone_else_present'] }).args.p_min_standing, 'introduced');
  assert.throws(() => validateCommunityMutation({ ...listing, min_standing: 'steward' }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'set_standing', member_id: member, level: 'new', reason: 'Lowering' }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'check_in', gathering_id: 1, member_id: 'rosa' }), InputError);
  assert.equal(validateCommunityMutation({ action: 'create_gathering', title: 'Repair day', starts_at: '2026-10-24T15:00:00Z', location: 'Church hall' }).args.p_starts_at, '2026-10-24T15:00:00.000Z');
  assert.throws(() => validateCommunityMutation({ action: 'create_gathering', title: 'Repair day', starts_at: 'someday', location: 'Church hall' }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'raise_concern', about_id: member, body: 'She arrived late and left early.' }), InputError, 'share choice is required');
  assert.throws(() => validateCommunityMutation({ action: 'raise_concern', about_id: member, body: 'Too short', share_name: false }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'respond_concern', id: 1, response: ' ', note: '', close: false }), InputError);
  assert.deepEqual(validateCommunityMutation({ action: 'respond_concern', id: 1, response: '', note: null, close: true }).args, { p_id: 1, p_response: null, p_note: null, p_close: true });
  assert.throws(() => validateCommunityMutation({ action: 'vouch', member_id: member, sentence: 'I know Rosa from the repair day.', basis: 'friend', home_answer: 'yes', not_household: true }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'vouch', member_id: member, sentence: 'I know Rosa from the repair day.', basis: 'met', home_answer: 'yes', not_household: 'yes' }), InputError);
  assert.throws(() => validateCommunityMutation({ action: 'safety_checkin', exchange_id: 1, kind: 'panic' }), InputError);
});
