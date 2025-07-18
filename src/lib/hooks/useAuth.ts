// Replace src/app/supabase-provider.tsx with this new hook approach
// File: src/lib/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return {
    user,
    loading,
    supabase,
    // Helper functions
    signOut: () => supabase.auth.signOut(),
    signInWithEmail: (email: string, password: string) => 
      supabase.auth.signInWithPassword({ email, password }),
    signUpWithEmail: (email: string, password: string) => 
      supabase.auth.signUp({ email, password }),
  };
}