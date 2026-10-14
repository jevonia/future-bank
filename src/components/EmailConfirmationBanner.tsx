'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export function EmailConfirmationBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (!user || user.email_confirmed_at) return null;

  const resend = async () => {
    setSending(true);
    setStatus('');
    setError('');
    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const result = await response.json();
      if (!response.ok) setError(result.error || 'We could not send the email. Try again later.');
      else setStatus('Confirmation email sent. Check your inbox and spam folder.');
    } catch {
      setError('We could not send the email. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  return <aside aria-labelledby="confirmation-heading" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
    <h2 id="confirmation-heading" className="font-semibold text-amber-950">Confirm your email</h2>
    <p className="mt-1 text-sm text-amber-900">Check your inbox and follow the verification link to enable account actions.</p>
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
      <button type="button" onClick={resend} disabled={sending} className="rounded-md border border-amber-700 px-3 py-1.5 text-sm font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-60">{sending ? 'Sending…' : 'Resend confirmation email'}</button>
      {status && <p role="status" className="text-sm text-emerald-800">{status}</p>}
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    </div>
  </aside>;
}
