'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';
import { ProfileSettingsModal } from '../modals/ProfileSettingsModal';

interface HeaderProps {
    user: User | null;
    profile: Profile | null;
    onSignInClick: () => void;
    onProfileUpdated?: () => void;
}

export function Header({ user, profile, onSignInClick, onProfileUpdated }: HeaderProps) {
    const supabase = createClient();
    const router = useRouter();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };
    
    const displayName = profile?.username || user?.email?.split('@')[0] || "Community Member";
    const balance = profile?.time_balance || 0;

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => user && setIsProfileModalOpen(true)}
                            className="relative group"
                        >
                            <div className="h-14 w-14 bg-violet-500 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:bg-violet-600 transition">
                                {profile?.avatar_url ? (
                                    <img 
                                        src={profile.avatar_url} 
                                        alt="Avatar" 
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </div>
                            {user && (
                                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            )}
                        </button>
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
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button 
                            onClick={() => setIsProfileModalOpen(true)}
                            className="px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded-full font-semibold hover:bg-slate-300 transition"
                        >
                            Profile
                        </button>
                        <button 
                            onClick={handleSignOut}
                            className="px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded-full font-semibold hover:bg-slate-300 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </header>

            <ProfileSettingsModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={profile}
                onProfileUpdated={onProfileUpdated}
            />
        </>
    );
}
