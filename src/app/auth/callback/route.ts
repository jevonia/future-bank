import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getSafeNextPath } from '@/lib/auth-config';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = getSafeNextPath(searchParams.get('next'));

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(next, origin));
    } catch {
      // Route all callback failures to an explanatory page.
    }
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}
