import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/auth-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Email confirmation is unavailable because authentication is not configured.' }, { status: 503 });
    }

    const supabase = await createClient();
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${new URL(request.url).origin}/auth/callback?next=/` },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to resend confirmation email' },
      { status: 500 }
    );
  }
}
