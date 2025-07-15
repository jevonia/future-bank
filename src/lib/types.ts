import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  time_balance: number;  // Changed from decimal to number for double precision
}

export interface Offer {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  category: string | null;
  user_id: string;
  profiles?: Profile; // Optional: To hold profile data if we join tables
}

export interface Want {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  category: string | null;
  user_id: string;
  criteria?: string[]; // Array of selected criteria
  profiles?: Profile;
}

export interface AppState {
    user: User | null;
    profile: Profile | null;
    offers: Offer[];
    wants: Want[];
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
