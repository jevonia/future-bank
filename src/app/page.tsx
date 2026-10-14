import DashboardClient from './dashboard-client';
import { loadCommunityState } from '@/lib/community-state';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  return <DashboardClient serverState={await loadCommunityState()} />;
}
