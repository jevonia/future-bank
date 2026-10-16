import type { User } from '@supabase/supabase-js';
import type { MinStanding, StandingLevel } from './standing';

export interface MemberProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export interface Profile extends MemberProfile { time_balance: number; }

export interface Offer {
  id: number;
  created_at: string;
  title: string;
  description: string;
  category: string;
  user_id: string;
  active: boolean;
  min_standing?: MinStanding;
  profiles?: MemberProfile;
}

export interface Want {
  id: number;
  created_at: string;
  title: string;
  description: string;
  category: string;
  user_id: string;
  active: boolean;
  is_urgent: boolean;
  amplified_at: string | null;
  criteria?: string[]; // Array of selected criteria
  min_standing?: MinStanding;
  profiles?: MemberProfile;
}

export interface AppState {
    user: User | null;
    profile: Profile | null;
    offers: Offer[];
    wants: Want[];
    configured: boolean;
    error: string | null;
    marketplaceOffers: Offer[];
    marketplaceWants: Want[];
    exchanges: Exchange[];
    messages: ExchangeMessage[];
    transactions: LedgerEntry[];
    notifications: CommunityNotification[];
    kudos: Kudos[];
    projects: Project[];
    contributions: ProjectContribution[];
    fundRequests: FundRequest[];
    communityFund: { balance_minutes: number };
    publicSummary: PublicSummary;
    isFacilitator: boolean;
    urgentOptIn: boolean;
    availableMinutes: number;
    reservedMinutes: number;
    /** False until the standing migrations are applied. */
    standingReady: boolean;
    /** Every member's public name and picture, for showing who did what. */
    members: MemberProfile[];
    standings: MemberStanding[];
    gatherings: Gathering[];
    checkins: GatheringCheckin[];
    concerns: Concern[];
    pauses: StandingPause[];
    standingEvents: StandingEvent[];
    vouches: Vouch[];
    knownProgress: KnownProgress | null;
    firstMeetings: FirstMeeting[];
    safetyCheckins: SafetyCheckin[];
    stewardNotes: ExchangeStewardNote[];
    isSteward: boolean;
    /** Present only for an active steward. */
    steward: StewardData | null;
}

export interface MemberStanding {
  user_id: string; level: StandingLevel; since: string;
  introduced_by: string | null; introduced_at: string | null;
  gathering_title: string | null; gathering_starts_at: string | null;
  joined_at: string; completed_exchanges: number; exchange_partners: number;
  steward_renew_by: string | null;
}
export interface Gathering {
  id: number; title: string; starts_at: string; location: string; host_id: string; created_at: string;
}
export interface GatheringCheckin {
  gathering_id: number; member_id: string; steward_id: string | null; checked_in_at: string;
}
export interface Concern {
  id: number; reporter_id: string; about_id: string | null; exchange_id: number | null;
  body: string; share_name: boolean; status: 'open' | 'responded' | 'closed';
  response: string | null; responded_by: string | null; responded_at: string | null;
  closed_at: string | null; created_at: string;
}
export interface ConcernNote {
  id: number; concern_id: number; steward_id: string | null; body: string; created_at: string;
}
export interface StandingPause {
  member_id: string; paused_by: string | null; concern_id: number | null; reason: string; paused_at: string;
}
export interface StandingEvent {
  id: number; member_id: string; kind: 'level' | 'pause' | 'unpause' | 'renewal';
  from_level: string | null; to_level: string | null; changed_by: string | null; reason: string; created_at: string;
}
export interface StewardNomination {
  member_id: string; nominated_by: string; reason: string; created_at: string;
}
export interface Vouch {
  id: number; voucher_id: string; member_id: string; sentence: string; basis: 'met' | 'exchange'; created_at: string;
}
export interface StewardVouch {
  id: number; voucher_id: string; member_id: string; home_answer: 'yes' | 'no' | 'not_sure';
  mutual_same_day: boolean; created_at: string;
}
export interface KnownProgress {
  days_member: number; completed_exchanges: number; exchange_partners: number; vouches: number;
}
export interface KnownSuggestion extends KnownProgress {
  member_id: string; vouchers_connected: boolean;
}
export interface FirstMeeting {
  exchange_id: number; member_id: string; meet_place: string; who_knows: string; check_in_time: string; updated_at: string;
}
export interface SafetyCheckin {
  id: number; exchange_id: number; member_id: string; kind: 'fine' | 'call_me'; created_at: string;
}
export interface ExchangeStewardNote {
  exchange_id: number; member_id: string; body: string; created_at: string;
}
export interface SafetyFeedItem {
  kind: 'call_me' | 'note'; exchange_id: number; member_id: string; other_id: string;
  title: string; body: string | null; created_at: string;
}
export interface StewardData {
  concernNotes: ConcernNote[];
  nominations: StewardNomination[];
  vouchDetails: StewardVouch[];
  knownSuggestions: KnownSuggestion[];
  safetyFeed: SafetyFeedItem[];
}

export type ExchangeStatus = 'pending' | 'accepted' | 'completed' | 'cancelled' | 'declined';
export interface Exchange {
  id: number;
  offer_id: number | null;
  want_id: number | null;
  provider_id: string;
  requester_id: string;
  initiator_id: string;
  title: string;
  category: string;
  minutes: number;
  status: ExchangeStatus;
  provider_confirmed: boolean;
  requester_confirmed: boolean;
  created_at: string;
  completed_at: string | null;
  provider?: MemberProfile;
  requester?: MemberProfile;
}
export interface ExchangeMessage {
  id: number; exchange_id: number; sender_id: string; body: string; created_at: string;
  sender?: MemberProfile;
}
export interface LedgerEntry {
  id: number; user_id: string; amount_minutes: number; balance_after_minutes: number;
  kind: 'welcome' | 'opening' | 'exchange' | 'donation' | 'fund';
  exchange_id: number | null; description: string; created_at: string;
}
export interface CommunityNotification {
  id: number; user_id: string; title: string; body: string; read_at: string | null; created_at: string;
}
export interface Kudos {
  id: number; exchange_id: number; sender_id: string; recipient_id: string;
  labels: string[]; note: string; created_at: string;
}
export interface Project {
  id: number; owner_id: string; title: string; description: string; category: string;
  goal_minutes: number; active: boolean; created_at: string;
  current_minutes: number; contributor_count: number; owner?: MemberProfile;
}
export interface ProjectContribution {
  id: number; project_id: number; user_id: string; minutes: number; note: string; created_at: string;
  member?: MemberProfile;
}
export interface FundRequest {
  id: number; user_id: string; minutes: number; reason: string;
  status: 'pending' | 'approved' | 'declined'; created_at: string; reviewed_at: string | null;
  member?: MemberProfile;
}
export interface PublicSummary {
  member_count: number; completed_exchanges: number; contributed_minutes: number; active_projects: number;
}

export const KUDOS_LABELS = ['Great Teacher', 'Patient Listener', 'Creative Problem-Solver', 'Reliable & Punctual', 'Generous Spirit'] as const;
export const CATEGORIES = ['Creative', 'Tech', 'Lifestyle', 'Repair', 'Skills', 'Language', 'Care', 'Other'] as const;
export function formatCredits(minutes: number): string {
  return (minutes / 60).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Criteria options for wants
export const WANT_CRITERIA = [
  'public_place',
  'accessible',
  'daytime_only',
  'evening_only',
  'weekend_only',
  'child_friendly',
  'pet_friendly',
  'wheelchair_accessible',
  'quiet_environment',
  'outdoor',
  'indoor',
  'near_public_transit',
  'parking_available',
  'flexible_schedule',
  'one_time_only',
  'ongoing_help',
  'virtual_ok',
  'in_person_only',
  'someone_else_present'
] as const;

export type WantCriteria = typeof WANT_CRITERIA[number];

// Human-readable labels for criteria
export const CRITERIA_LABELS: Record<WantCriteria, string> = {
  public_place: 'Public Place',
  accessible: 'Accessible',
  daytime_only: 'Daytime Only',
  evening_only: 'Evening Only',
  weekend_only: 'Weekend Only',
  child_friendly: 'Child Friendly',
  pet_friendly: 'Pet Friendly',
  wheelchair_accessible: 'Wheelchair Accessible',
  quiet_environment: 'Quiet Environment',
  outdoor: 'Outdoor',
  indoor: 'Indoor',
  near_public_transit: 'Near Public Transit',
  parking_available: 'Parking Available',
  flexible_schedule: 'Flexible Schedule',
  one_time_only: 'One Time Only',
  ongoing_help: 'Ongoing Help',
  virtual_ok: 'Virtual OK',
  in_person_only: 'In Person Only',
  someone_else_present: 'Someone Else There the First Time'
};
