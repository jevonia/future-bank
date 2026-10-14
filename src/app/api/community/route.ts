import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/auth-config';
import { InputError, validateCommunityMutation } from '@/lib/community-validation';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'development' && process.env.BANK_QA_FIXTURE === '1') {
    return NextResponse.json({ error: 'The interface preview is read-only.' }, { status: 403 });
  }
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Please submit changes from this site.' }, { status: 403 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'The community connection is not available yet.' }, { status: 503 });
  try {
    const body = await request.text();
    if (body.length > 16384) return NextResponse.json({ error: 'That request is too large.' }, { status: 413 });
    let parsed: unknown;
    try { parsed = JSON.parse(body); } catch { throw new InputError('Invalid request.'); }
    const { rpc, args } = validateCommunityMutation(parsed);
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 });
    if (!user.email_confirmed_at) return NextResponse.json({ error: 'Please confirm your email before participating.' }, { status: 403 });
    const { data, error } = await supabase.rpc(rpc, args);
    if (error) {
      if (error.code === 'P0001') return NextResponse.json({ error: error.message }, { status: 400 });
      if (error.code === '23505') return NextResponse.json({ error: 'That request already exists. Refresh to see its current status.' }, { status: 409 });
      if (error.code === '42501') return NextResponse.json({ error: 'You do not have permission for that action.' }, { status: 403 });
      return NextResponse.json({ error: 'Your change could not be saved. Please refresh and try again.' }, { status: 503 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof InputError ? error.message : 'Unable to connect to the community. Please try again.' }, { status: error instanceof InputError ? 400 : 503 });
  }
}
