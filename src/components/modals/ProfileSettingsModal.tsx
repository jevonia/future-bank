'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { isValidUsername, normalizeUsername } from '@/lib/auth-config';
import type { Profile } from '@/lib/types';
import { Dialog } from '@/components/ui/Dialog';

const MAX_AVATAR_BYTES = 256 * 1024;
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onProfileUpdated?: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose, profile, onProfileUpdated }: ProfileSettingsModalProps) {
  const router = useRouter();
  const { user, supabase, configured } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setUsername(profile?.username || '');
    setAvatarUrl(profile?.avatar_url || '');
    setError('');
    setSuccess('');
  }, [profile, isOpen]);

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      setError('Choose a JPEG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Avatar images must be 256 KB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setError('');
      }
    };
    reader.onerror = () => setError('We could not read that image. Please try another file.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!configured) {
      setError('Profile settings are unavailable because this app is missing its Supabase configuration.');
      return;
    }
    if (!user) {
      setError('Sign in again to update your profile.');
      return;
    }
    const cleanUsername = normalizeUsername(username);
    if (!isValidUsername(cleanUsername)) {
      setError('Choose a username with 3–20 letters, numbers, or underscores.');
      return;
    }
    if (avatarUrl && !avatarUrl.startsWith('data:image/') && !isAllowedAvatarUrl(avatarUrl)) {
      setError('Enter a complete HTTPS image URL or choose an image file.');
      return;
    }

    setLoading(true);
    try {
      const { data: existing, error: lookupError } = await supabase
        .from('profiles').select('id').ilike('username', cleanUsername).neq('id', user.id).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) {
        setError('That username is already taken.');
        return;
      }

      const { error: updateError } = await supabase.from('profiles').update({
        username: cleanUsername,
        avatar_url: avatarUrl.trim() || null,
      }).eq('id', user.id);
      if (updateError) throw updateError;
      setSuccess('Your profile has been updated.');
      onProfileUpdated?.();
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Please try again.';
      setError(/duplicate|unique constraint/i.test(message)
        ? 'That username is already taken.'
        : 'We could not update your profile. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return <Dialog isOpen={isOpen} onClose={onClose} title="Profile settings" description="Update your public username and avatar.">
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-full bg-violet-600 text-2xl font-bold text-white">
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element -- user-provided avatar can be an external HTTPS URL or data URL */
            <img src={avatarUrl} alt="Profile avatar preview" className="h-full w-full object-cover" />
          ) : (username.charAt(0) || '?').toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="profile-avatar-file" className="inline-flex cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Choose image</label>
          <input id="profile-avatar-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleAvatarUpload} className="sr-only" />
          <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WebP, or GIF; up to 256 KB. Images are stored with your profile.</p>
          {avatarUrl && <button type="button" onClick={() => setAvatarUrl('')} className="mt-1 text-xs font-medium text-indigo-700 underline">Remove avatar</button>}
        </div>
      </div>

      <div>
        <label htmlFor="profile-username" className="mb-1 block text-sm font-medium text-slate-700">Username</label>
        <input id="profile-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} maxLength={20} pattern="[A-Za-z0-9_]{3,20}" className="w-full rounded-lg border border-slate-300 p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        <p className="mt-1 text-xs text-slate-500">3–20 characters: letters, numbers, and underscores. Usernames are lowercase.</p>
      </div>

      <div>
        <label htmlFor="profile-avatar-url" className="mb-1 block text-sm font-medium text-slate-700">Or use an image URL</label>
        <input id="profile-avatar-url" type="url" inputMode="url" placeholder="https://example.com/avatar.jpg" value={avatarUrl.startsWith('data:') ? '' : avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} className="w-full rounded-lg border border-slate-300 p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        <p className="mt-1 text-xs text-slate-500">Use a direct HTTPS URL to an image you’re allowed to share.</p>
      </div>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        <p><span className="font-medium text-slate-800">Email:</span> {user?.email || 'Unavailable'}</p>
        <p className="mt-1"><span className="font-medium text-slate-800">Time credits:</span> {profile?.time_balance?.toFixed(1) || '0.0'} hours</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {success && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Close</button>
        <button type="submit" disabled={loading} className="rounded-lg bg-indigo-700 px-5 py-2.5 font-semibold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60">{loading ? 'Saving…' : 'Save profile'}</button>
      </div>
    </form>
  </Dialog>;
}

function isAllowedAvatarUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
