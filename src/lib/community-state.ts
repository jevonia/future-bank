import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/auth-config';
import type { AppState, MemberProfile, PublicSummary } from '@/lib/types';

export function emptyCommunityState(): AppState {
  return {
    user: null, profile: null, offers: [], wants: [], configured: isSupabaseConfigured(), error: null,
    marketplaceOffers: [], marketplaceWants: [], exchanges: [], messages: [], transactions: [],
    notifications: [], kudos: [], projects: [], contributions: [], fundRequests: [],
    communityFund: { balance_minutes: 0 }, publicSummary: { member_count: 0, completed_exchanges: 0, contributed_minutes: 0, active_projects: 0 },
    isFacilitator: false, urgentOptIn: false, availableMinutes: 0, reservedMinutes: 0,
  };
}

/** Read with the member's session. RLS controls every record. */
export async function loadCommunityState(): Promise<AppState> {
  const state = emptyCommunityState();
  if (!state.configured) return state;
  try {
    const supabase = await createClient();
    const [{ data: auth, error: authError }, { data: summary, error: summaryError }] = await Promise.all([
      supabase.auth.getUser(), supabase.rpc('bank_public_summary').single(),
    ]);
    if (summaryError) state.error = 'Community data is temporarily unavailable. Please try again later.';
    else if (summary) state.publicSummary = summary as PublicSummary;
    state.user = auth.user;
    if (!auth.user) {
      if (authError && authError.name !== 'AuthSessionMissingError') state.error = 'Unable to verify your session. Please sign in again.';
      return state;
    }
    const userId = auth.user.id;
    const queries = await Promise.all([
      supabase.from('profiles').select('id,username,avatar_url'),
      supabase.rpc('bank_account_summary').single(),
      supabase.from('offers').select('*').eq('active', true).order('created_at', { ascending: false }).limit(500),
      supabase.from('wants').select('*').eq('active', true).order('created_at', { ascending: false }).limit(500),
      supabase.from('exchanges').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('exchange_messages').select('*').order('created_at', { ascending: false }).limit(1000),
      supabase.from('ledger_entries').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('kudos').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('project_contributions').select('*').order('created_at', { ascending: false }).limit(2000),
      supabase.from('fund_requests').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('community_fund').select('balance_minutes').eq('id', 1).maybeSingle(),
      supabase.from('member_roles').select('role').eq('user_id', userId),
      supabase.from('member_preferences').select('urgent_opt_in').eq('user_id', userId).maybeSingle(),
      supabase.rpc('bank_project_summaries'),
    ]);
    if (queries.some(result => result.error)) state.error = 'Some community information could not be loaded. Please refresh or contact your community facilitator.';
    const [members, account, offers, wants, exchanges, messages, ledger, notices, kudos, projects, contributions, requests, fund, roles, preferences, projectSummaries] = queries;
    const accountData = account.data as { balance_minutes: number; available_minutes: number; reserved_minutes: number } | null;
    const memberMap = new Map<string, MemberProfile>((members.data || []).map(member => [member.id, member]));
    const ownProfile = memberMap.get(userId);
    if (ownProfile) state.profile = { ...ownProfile, time_balance: (accountData?.balance_minutes || 0) / 60 };
    else state.error = 'Your member profile could not be loaded. Please contact your community facilitator.';
    const listing = <T extends { title?: string | null; description?: string | null; category?: string | null; user_id: string }>(row: T) => ({ ...row, title: row.title || 'Untitled', description: row.description || '', category: row.category || 'Other', profiles: memberMap.get(row.user_id) });
    state.marketplaceOffers = (offers.data || []).map(listing);
    state.marketplaceWants = (wants.data || []).map(listing);
    state.offers = state.marketplaceOffers.filter(item => item.user_id === userId);
    state.wants = state.marketplaceWants.filter(item => item.user_id === userId);
    state.exchanges = (exchanges.data || []).map(exchange => ({ ...exchange, provider: memberMap.get(exchange.provider_id), requester: memberMap.get(exchange.requester_id) }));
    state.messages = (messages.data || []).reverse().map(message => ({ ...message, sender: memberMap.get(message.sender_id) }));
    state.transactions = ledger.data || [];
    state.notifications = notices.data || [];
    state.kudos = kudos.data || [];
    state.contributions = (contributions.data || []).map(contribution => ({ ...contribution, note: contribution.note || '', member: memberMap.get(contribution.user_id) }));
    state.projects = (projects.data || []).map(project => {
      const totals = (projectSummaries.data as { project_id: number; current_minutes: number; contributor_count: number }[] | null)?.find(item => item.project_id === project.id);
      return { ...project, owner: memberMap.get(project.owner_id), current_minutes: totals?.current_minutes || 0, contributor_count: totals?.contributor_count || 0 };
    });
    state.fundRequests = (requests.data || []).map(request => ({ ...request, member: memberMap.get(request.user_id) }));
    state.communityFund = fund.data || { balance_minutes: 0 };
    state.isFacilitator = Boolean(roles.data?.some(role => role.role === 'facilitator'));
    state.urgentOptIn = preferences.data?.urgent_opt_in || false;
    state.availableMinutes = accountData?.available_minutes || 0;
    state.reservedMinutes = accountData?.reserved_minutes || 0;
    return state;
  } catch {
    state.error = 'The community connection is temporarily unavailable. Please try again later.';
    return state;
  }
}
