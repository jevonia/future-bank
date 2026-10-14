import type { User } from '@supabase/supabase-js';

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
  'in_person_only'
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
  in_person_only: 'In Person Only'
};
