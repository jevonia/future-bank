import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { parseAuthCallbackInput } from '@/lib/auth-callback';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const callback = parseAuthCallbackInput(requestUrl.searchParams);

  if (callback) {
    try {
      const supabase = await createClient();
      const { error } = callback.kind === 'code'
        ? await supabase.auth.exchangeCodeForSession(callback.code)
        : await supabase.auth.verifyOtp({
          token_hash: callback.tokenHash,
          type: callback.type,
        });
      if (!error) return NextResponse.redirect(new URL(callback.nextPath, origin));
    } catch {
      // Route all callback failures to an explanatory page.
    }
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}
