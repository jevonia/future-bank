'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const supabase = createClientComponentClient();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to FutureBank</h1>
        <p className="text-slate-600 text-center mb-8">Sign in or create an account to join the community.</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google']} // Optional: Add social providers
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>
    </div>
  );
}