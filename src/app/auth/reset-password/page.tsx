'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/auth-config';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'checking' | 'ready' | 'invalid' | 'unavailable'>('checking');

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthStatus('unavailable');
      return;
    }
    let active = true;
    createClient().auth.getUser().then(({ data, error: authError }) => {
      if (active) setAuthStatus(!authError && data.user ? 'ready' : 'invalid');
    }).catch(() => {
      if (active) setAuthStatus('invalid');
    });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!isSupabaseConfigured()) {
      setError('Password reset is unavailable because this app is missing its Supabase configuration.');
      return;
    }
    if (authStatus !== 'ready') {
      setError('This reset link is invalid or expired. Request a fresh password reset link and open it in this browser.');
      return;
    }
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await createClient().auth.updateUser({ password });
      if (updateError) setError(updateError.message);
      else setSuccess(true);
    } catch {
      setError('We could not update your password. Request a fresh reset link and try again.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg" aria-labelledby="reset-title">
      <h1 id="reset-title" className="text-2xl font-bold text-slate-900">Choose a new password</h1>
      {authStatus === 'checking' ? <p role="status" className="mt-3 text-slate-600">Verifying your reset link…</p> : authStatus === 'unavailable' ? <p role="alert" className="mt-3 text-red-800">Password reset is unavailable because this app is missing its Supabase configuration.</p> : authStatus === 'invalid' ? <div>
        <p role="alert" className="mt-3 text-slate-600">This reset link is invalid or expired. Request a fresh link and open it in the same browser.</p>
        <button onClick={() => router.replace('/')} className="mt-6 rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800">Return to New Future Bank</button>
      </div> : success ? <div>
        <p role="status" className="mt-3 text-emerald-800">Your password has been updated.</p>
        <button onClick={() => { router.replace('/'); router.refresh(); }} className="mt-6 rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800">Continue to New Future Bank</button>
      </div> : <>
        <p className="mt-3 text-slate-600">Enter and confirm your new password to finish the reset.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-slate-700">New password</label>
            <input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-slate-700">Confirm new password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">{loading ? 'Updating…' : 'Update password'}</button>
        </form>
      </>}
    </section>
  </main>;
}
