'use client';
import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

interface HeaderProps {
    user: User | null;
    profile: Profile | null;
    onSignInClick: () => void;
}

export function Header({ user, profile, onSignInClick }: HeaderProps) {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };
    
    const displayName = profile?.username || user?.email?.split('@')[0] || "Community Member";
    const balance = profile?.time_balance || 0;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-violet-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            {user ? `Welcome, ${displayName}!` : 'Welcome to FutureBank!'}
                        </h1>
                        <p className="text-slate-500 text-sm">Your community dashboard.</p>
                    </div>
                </div>
                {user ? (
                     <div className="text-right">
                        <h2 className="text-sm font-medium text-slate-500">Time Credit Balance</h2>
                        <p className="text-4xl font-extrabold text-violet-500 balance-glow">{balance.toFixed(1)} TC</p>
                    </div>
                ) : (
                    <button 
                        onClick={onSignInClick}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Sign In / Sign Up
                    </button>
                )}
            </div>
            {user && (
                <div className="absolute top-4 right-4">
                     <button 
                        onClick={handleSignOut}
                        className="px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded-full font-semibold hover:bg-slate-300 transition"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </header>
    );
}
