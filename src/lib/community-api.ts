export type CommunityAction = 'save_listing' | 'archive_listing' | 'request_exchange' | 'exchange_action' | 'send_message' | 'give_kudos' | 'donate' | 'request_fund' | 'review_fund' | 'create_project' | 'contribute_project' | 'close_project' | 'amplify_want' | 'read_notifications' | 'set_urgent_opt_in'
  | 'create_gathering' | 'check_in' | 'set_standing' | 'nominate_steward' | 'renew_steward'
  | 'raise_concern' | 'respond_concern' | 'pause_standing' | 'unpause_standing'
  | 'vouch' | 'withdraw_vouch' | 'save_first_meeting' | 'safety_checkin' | 'steward_note';

export async function mutateCommunity(action: CommunityAction, payload: Record<string, unknown> = {}): Promise<{ data: unknown }> {
  const response = await fetch('/api/community', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, action }),
  });
  const result = await response.json().catch(() => ({ error: 'The server returned an unexpected response. Please try again.' }));
  if (!response.ok) throw new Error(result.error || 'Unable to save your changes. Please try again.');
  return result;
}
