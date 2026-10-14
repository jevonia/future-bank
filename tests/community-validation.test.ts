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
