'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured, isValidUsername, normalizeUsername } from '@/lib/auth-config';
import { Dialog } from '@/components/ui/Dialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'sign-in' | 'sign-up' | 'forgot-password';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    let active = true;
    setGoogleEnabled(false);
    fetch('/api/auth/providers', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => response.ok ? response.json() : { googleEnabled: false })
      .then((result: { googleEnabled?: unknown }) => {
        if (active) setGoogleEnabled(result.googleEnabled === true);
      })
      .catch(() => {
        if (active) setGoogleEnabled(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [isOpen]);

  const clearMessages = () => { setError(''); setNotice(''); };
  const redirectTo = () => `${window.location.origin}/auth/callback?next=/`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();
    if (!isSupabaseConfigured()) {
      setError('Sign-in is temporarily unavailable because this app is missing its Supabase configuration.');
      return;
    }
    if (mode === 'sign-up' && !isValidUsername(username)) {
      setError('Choose a username with 3 to 20 letters, numbers, or underscores.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === 'forgot-password') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        });
        if (resetError) setError(resetError.message);
        else setNotice('If an account uses that email, a password reset link is on its way.');
      } else if (mode === 'sign-up') {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { username: normalizeUsername(username) },
            emailRedirectTo: redirectTo(),
          },
        });
        if (signUpError) setError(signUpError.message);
        else if (data.session) {
          closeModal();
          router.refresh();
        } else if (data.user?.identities?.length === 0) {
          setNotice('An account may already use this email. Try signing in or request a password reset.');
        } else if (data.user) setConfirmationEmail(email.trim());
        else setNotice('Check your email for a confirmation link to finish creating your account.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) setError(signInError.message);
        else {
          closeModal();
          router.refresh();
        }
      }
    } catch {
      setError('We could not complete that request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setGoogleEnabled(false);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    if (!isSupabaseConfigured()) {
      setError('Sign-in is temporarily unavailable because this app is missing its Supabase configuration.');
      return;
    }
    setLoading(true);
    try {
      const { error: oauthError } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectTo() },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError('We could not start Google sign-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setNotice('');
    setError('');
    setResending(true);
    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: confirmationEmail }),
      });
      const result = await response.json();
      if (!response.ok) setError(result.error || 'We could not resend the email. Please try again later.');
      else setNotice('Confirmation email sent. Check your inbox and spam folder.');
    } catch {
      setError('We could not resend the email. Check your connection and try again.');
    } finally {
      setResending(false);
    }
  };

  const isConfirming = Boolean(confirmationEmail);
  const title = isConfirming ? 'Check your email' : mode === 'sign-up' ? 'Join New Future Bank' : mode === 'forgot-password' ? 'Reset your password' : 'Welcome back';

  return (
    <Dialog isOpen={isOpen} onClose={closeModal} title={title} description={isConfirming ? undefined : 'Share skills and exchange time with your community.'}>
      {isConfirming ? (
        <div>
          <p className="text-slate-700">We sent a confirmation link to <strong>{confirmationEmail}</strong>. Open it to verify your email and finish joining.</p>
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {notice && <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
          <button type="button" onClick={handleResendConfirmation} disabled={resending} className="mt-5 w-full rounded-lg border border-indigo-700 px-5 py-3 font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-60">{resending ? 'Sending…' : 'Resend confirmation email'}</button>
          <button type="button" onClick={closeModal} className="mt-6 w-full rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800">Done</button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && <div>
              <label htmlFor="auth-username" className="mb-1 block text-sm font-medium text-slate-700">Username</label>
              <input id="auth-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} maxLength={20} pattern="[A-Za-z0-9_]{3,20}" className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <p className="mt-1 text-xs text-slate-500">3 to 20 characters: letters, numbers, and underscores.</p>
            </div>}
            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            {mode !== 'forgot-password' && <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input id="auth-password" type="password" autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>}

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60">
              {loading ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : mode === 'forgot-password' ? 'Send reset link' : 'Sign in'}
            </button>
          </form>
          {mode === 'sign-in' && <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <button type="button" onClick={() => { setMode('forgot-password'); clearMessages(); }} className="font-medium text-indigo-700 underline">Forgot password?</button>
            {googleEnabled && <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="font-medium text-indigo-700 underline">Continue with Google</button>}
          </div>}
          <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
            {mode === 'forgot-password' ? <button type="button" onClick={() => { setMode('sign-in'); clearMessages(); }} className="font-semibold text-indigo-700">Back to sign in</button> : <button type="button" onClick={() => { setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up'); clearMessages(); }} className="font-semibold text-indigo-700">{mode === 'sign-up' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>}
          </div>
        </>
      )}
    </Dialog>
  );
}
