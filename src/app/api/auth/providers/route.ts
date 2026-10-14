import { NextResponse } from 'next/server';
import { isGoogleProviderEnabled, isSupabaseConfigured } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

function providerResponse(googleEnabled: boolean) {
  return NextResponse.json(
    { googleEnabled },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function GET() {
  if (!isSupabaseConfigured()) return providerResponse(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !publicKey) return providerResponse(false);

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/auth/v1/settings`, {
      method: 'GET',
      headers: {
        apikey: publicKey,
        Authorization: `Bearer ${publicKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return providerResponse(false);
    return providerResponse(isGoogleProviderEnabled(await response.json()));
  } catch {
    return providerResponse(false);
  }
}
