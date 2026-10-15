'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';
import { formatCredits } from '@/lib/types';
import { ProfileSettingsModal } from '../modals/ProfileSettingsModal';
import { LogoMark } from '../illustrations';

interface HeaderProps {
  user: User | null;
  profile: Profile | null;
  onSignInClick: () => void;
  onProfileUpdated?: () => void;
}

export function Header({ user, profile, onSignInClick, onProfileUpdated }: HeaderProps) {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const displayName = profile?.username || user?.email?.split('@')[0] || 'Community member';
  const balance = profile?.time_balance || 0;

  const handleSignOut = async () => {
    setSignOutError('');
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.refresh();
    } catch {
      setSignOutError('We could not sign you out. Please try again.');
    }
  };

  return <>
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#ffffff]/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="h-11 w-11 flex-none" />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">New Future Bank</p>
            <p className="hidden text-xs text-slate-500 sm:block">A community where time is shared</p>
          </div>
        </div>

        {user ? <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden text-right sm:block">
            <p className="max-w-44 truncate text-sm font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-500">{formatCredits(balance * 60)} time credits</p>
          </div>
          <button type="button" onClick={() => setIsProfileModalOpen(true)} aria-label="Open profile settings" className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full bg-violet-600 font-bold text-white ring-2 ring-violet-100 hover:ring-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
            {profile?.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element -- member avatars may be external HTTPS URLs or stored data URLs */
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : displayName.charAt(0).toUpperCase()}
          </button>
          <button type="button" onClick={() => setIsProfileModalOpen(true)} className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:inline-flex">Profile</button>
          <button type="button" onClick={handleSignOut} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign out</button>
        </div> : <button type="button" onClick={onSignInClick} className="rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">Sign in / Join</button>}
      </div>
      {user && <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 pb-3 sm:hidden">
        <p className="max-w-[55vw] truncate text-sm font-medium text-slate-700">Hi, {displayName}</p>
        <p className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-800">{formatCredits(balance * 60)} credits</p>
      </div>}
      {signOutError && <p role="alert" className="mx-auto max-w-screen-xl px-4 pb-2 text-sm text-red-700">{signOutError}</p>}
    </header>
    <ProfileSettingsModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profile={profile} onProfileUpdated={onProfileUpdated} />
  </>;
}
