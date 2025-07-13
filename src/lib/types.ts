import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  time_balance: number;
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
  profiles?: Profile;
}

export interface AppState {
    user: User | null;
    profile: Profile | null;
    offers: Offer[];
    wants: Want[];
}
