'use client';
import { Auth } from '@supabase/auth-ui-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../supabase-provider';
import { useEffect } from 'react';

// The ThemeSupa import is removed as it does not exist in the current library version.
// The component will be styled by Tailwind automatically.

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { session } = useSupabase();

  // If the user is already logged in, redirect them to the dashboard
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-slate-900">Welcome to FutureBank</h1>
        <p className="text-slate-600 text-center mb-8">Sign in or create an account to join the community.</p>
        <Auth
          supabaseClient={supabase}
          // The appearance prop is removed as we are not importing a theme object.
          // The `theme` prop correctly tells the component to use dark mode styles.
          theme="dark"
          providers={['google']} // Optional: Add social providers like Google
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>
    </div>
  );
}