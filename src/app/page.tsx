import { createClient } from '@/lib/supabase/server';
import DashboardClient from './dashboard-client';
import type { AppState } from '@/lib/types';

// Import mock data for features that are not yet dynamic
import { communityPulseData, contributionData, communityProjects, communityFundData, features } from '../lib/data';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let appState: AppState = {
    user: user,
    profile: null,
    offers: [],
    wants: [],
  };

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: offers } = await supabase.from('offers').select('*').eq('user_id', user.id);
    const { data: wants } = await supabase.from('wants').select('*').eq('user_id', user.id);
    
    appState = { ...appState, profile, offers: offers || [], wants: wants || [] };
  }

  return <DashboardClient serverState={appState} />;
}