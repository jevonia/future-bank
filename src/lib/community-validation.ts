import { WANT_CRITERIA, KUDOS_LABELS } from './types';
import { MIN_STANDING } from './standing';

type Payload = Record<string, unknown>;
export class InputError extends Error {}

function text(p: Payload, name: string, min: number, max: number): string {
  const value = p[name];
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw new InputError(`${name.replaceAll('_', ' ')} must be ${min} to ${max} characters.`);
  return value.trim();
}
function integer(p: Payload, name: string, min = 1, max = Number.MAX_SAFE_INTEGER): number {
  const value = p[name];
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) throw new InputError(`Please provide a valid ${name.replaceAll('_', ' ')}.`);
  return value;
}
function choice(p: Payload, name: string, values: readonly string[]): string {
  const value = p[name];
  if (typeof value !== 'string' || !values.includes(value)) throw new InputError(`Please provide a valid ${name.replaceAll('_', ' ')}.`);
  return value;
}
function list(p: Payload, name: string, allowed: readonly string[], max: number, min = 0): string[] {
  const value = p[name] ?? [];
  if (!Array.isArray(value) || value.length > max || value.length < min || value.some(item => typeof item !== 'string' || !allowed.includes(item))) throw new InputError(`Please choose valid ${name}.`);
  return [...new Set(value)];
}
function requestId(p: Payload): string {
  const value = p.request_id;
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new InputError('Please reopen the form and try again.');
  return value;
}

function memberId(p: Payload, name: string): string {
  const value = p[name];
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new InputError('Please choose a member.');
  return value.toLowerCase();
}
function flag(p: Payload, name: string): boolean {
  if (typeof p[name] !== 'boolean') throw new InputError(`Please answer ${name.replaceAll('_', ' ')}.`);
  return p[name] as boolean;
}
function moment(p: Payload, name: string): string {
  const value = p[name];
  if (typeof value !== 'string' || value.length > 40 || Number.isNaN(Date.parse(value))) throw new InputError('Please choose a date and time.');
  return new Date(value).toISOString();
}
/** Optional free text: blank becomes null so the database keeps nothing. */
function optional(p: Payload, name: string, max: number): string | null {
  const value = text({ [name]: p[name] ?? '' }, name, 0, max);
  return value || null;
}

/** An allowlist prevents callers from selecting arbitrary tables or RPCs. */
export function validateCommunityMutation(value: unknown): { rpc: string; args: Payload } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('Invalid request.');
  const p = value as Payload;
  switch (p.action) {
    case 'save_listing': return { rpc: 'bank_save_listing', args: { p_kind: choice(p, 'kind', ['offer', 'want']), p_id: p.id == null ? null : integer(p, 'id'), p_title: text(p, 'title', 3, 120), p_description: text(p, 'description', 10, 4000), p_category: text(p, 'category', 2, 80), p_criteria: list(p, 'criteria', WANT_CRITERIA, WANT_CRITERIA.length), ...(p.min_standing == null ? {} : { p_min_standing: choice(p, 'min_standing', MIN_STANDING) }) } };
    case 'archive_listing': return { rpc: 'bank_archive_listing', args: { p_kind: choice(p, 'kind', ['offer', 'want']), p_id: integer(p, 'id') } };
    case 'request_exchange': return { rpc: 'bank_request_exchange', args: { p_listing_kind: choice(p, 'listing_kind', ['offer', 'want']), p_listing_id: integer(p, 'listing_id'), p_minutes: integer(p, 'minutes', 1, 2880), p_note: text({ note: '', ...p }, 'note', 0, 2000) } };
    case 'exchange_action': return { rpc: 'bank_exchange_action', args: { p_id: integer(p, 'id'), p_operation: choice(p, 'operation', ['accept', 'decline', 'cancel', 'confirm']) } };
    case 'send_message': return { rpc: 'bank_send_message', args: { p_exchange_id: integer(p, 'exchange_id'), p_body: text(p, 'body', 1, 4000) } };
    case 'give_kudos': return { rpc: 'bank_give_kudos', args: { p_exchange_id: integer(p, 'exchange_id'), p_labels: list(p, 'labels', KUDOS_LABELS, 5, 1), p_note: text({ note: '', ...p }, 'note', 0, 1000) } };
    case 'donate': return { rpc: 'bank_donate', args: { p_minutes: integer(p, 'minutes', 1, 10080), p_note: text({ note: '', ...p }, 'note', 0, 1000), p_request_id: requestId(p) } };
    case 'request_fund': return { rpc: 'bank_request_fund', args: { p_minutes: integer(p, 'minutes', 1, 10080), p_reason: text(p, 'reason', 10, 2000) } };
    case 'review_fund': return { rpc: 'bank_review_fund', args: { p_id: integer(p, 'id'), p_decision: choice(p, 'decision', ['approve', 'decline']) } };
    case 'create_project': return { rpc: 'bank_create_project', args: { p_title: text(p, 'title', 3, 120), p_description: text(p, 'description', 10, 4000), p_category: text(p, 'category', 2, 80), p_goal_minutes: integer(p, 'goal_minutes', 1, 600000) } };
    case 'contribute_project': return { rpc: 'bank_contribute_project', args: { p_project_id: integer(p, 'project_id'), p_minutes: integer(p, 'minutes', 1, 2880), p_note: text({ note: '', ...p }, 'note', 0, 1000), p_request_id: requestId(p) } };
    case 'close_project': return { rpc: 'bank_close_project', args: { p_id: integer(p, 'id') } };
    case 'amplify_want': return { rpc: 'bank_amplify_want', args: { p_id: integer(p, 'id') } };
    case 'read_notifications': {
      if (!Array.isArray(p.ids) || p.ids.length < 1 || p.ids.length > 100) throw new InputError('Please choose up to 100 notifications.');
      return { rpc: 'bank_read_notifications', args: { p_ids: [...new Set(p.ids.map(id => integer({ id }, 'id')))] } };
    }
    case 'set_urgent_opt_in': {
      if (typeof p.enabled !== 'boolean') throw new InputError('Please choose your alert preference.');
      return { rpc: 'bank_set_urgent_opt_in', args: { p_enabled: p.enabled } };
    }
    case 'create_gathering': return { rpc: 'bank_create_gathering', args: { p_title: text(p, 'title', 3, 120), p_starts_at: moment(p, 'starts_at'), p_location: text(p, 'location', 3, 300) } };
    case 'check_in': return { rpc: 'bank_check_in', args: { p_gathering_id: integer(p, 'gathering_id'), p_member_id: memberId(p, 'member_id') } };
    case 'set_standing': return { rpc: 'bank_set_standing', args: { p_member_id: memberId(p, 'member_id'), p_level: choice(p, 'level', ['introduced', 'known', 'steward']), p_reason: text(p, 'reason', 3, 500) } };
    case 'nominate_steward': return { rpc: 'bank_nominate_steward', args: { p_member_id: memberId(p, 'member_id'), p_reason: text(p, 'reason', 3, 500) } };
    case 'renew_steward': return { rpc: 'bank_renew_steward', args: { p_member_id: memberId(p, 'member_id'), p_reason: text(p, 'reason', 3, 500) } };
    case 'raise_concern': return { rpc: 'bank_raise_concern', args: { p_about_id: p.about_id == null ? null : memberId(p, 'about_id'), p_exchange_id: p.exchange_id == null ? null : integer(p, 'exchange_id'), p_body: text(p, 'body', 10, 4000), p_share_name: flag(p, 'share_name') } };
    case 'respond_concern': {
      const args = { p_id: integer(p, 'id'), p_response: optional(p, 'response', 2000), p_note: optional(p, 'note', 4000), p_close: flag(p, 'close') };
      if (!args.p_response && !args.p_note && !args.p_close) throw new InputError('Write a reply or a note, or close the concern.');
      return { rpc: 'bank_respond_concern', args };
    }
    case 'pause_standing': return { rpc: 'bank_pause_standing', args: { p_member_id: memberId(p, 'member_id'), p_reason: text(p, 'reason', 3, 500), p_concern_id: p.concern_id == null ? null : integer(p, 'concern_id') } };
    case 'unpause_standing': return { rpc: 'bank_unpause_standing', args: { p_member_id: memberId(p, 'member_id'), p_reason: text(p, 'reason', 3, 500) } };
    case 'vouch': return { rpc: 'bank_vouch', args: { p_member_id: memberId(p, 'member_id'), p_sentence: text(p, 'sentence', 10, 300), p_basis: choice(p, 'basis', ['met', 'exchange']), p_home_answer: choice(p, 'home_answer', ['yes', 'no', 'not_sure']), p_not_household: flag(p, 'not_household') } };
    case 'withdraw_vouch': return { rpc: 'bank_withdraw_vouch', args: { p_member_id: memberId(p, 'member_id') } };
    case 'save_first_meeting': return { rpc: 'bank_save_first_meeting', args: { p_exchange_id: integer(p, 'exchange_id'), p_meet_place: text({ meet_place: '', ...p }, 'meet_place', 0, 300), p_who_knows: text({ who_knows: '', ...p }, 'who_knows', 0, 300), p_check_in_time: text({ check_in_time: '', ...p }, 'check_in_time', 0, 120) } };
    case 'safety_checkin': return { rpc: 'bank_safety_checkin', args: { p_exchange_id: integer(p, 'exchange_id'), p_kind: choice(p, 'kind', ['fine', 'call_me']) } };
    case 'steward_note': return { rpc: 'bank_exchange_steward_note', args: { p_exchange_id: integer(p, 'exchange_id'), p_body: text(p, 'body', 1, 2000) } };
    default: throw new InputError('Unknown community action.');
  }
}
