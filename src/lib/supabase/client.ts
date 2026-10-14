import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from '@/lib/auth-config';

export function createClient() {
  // A harmless placeholder lets client components render while local env vars
  // are absent. Auth entry points check isSupabaseConfigured before making calls.
  const configured = isSupabaseConfigured();
  return createBrowserClient(
    configured ? process.env.NEXT_PUBLIC_SUPABASE_URL! : 'http://127.0.0.1:54321',
    configured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : 'missing-public-anon-key'
  );
}
