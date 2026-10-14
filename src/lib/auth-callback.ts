import { getSafeNextPath } from '@/lib/auth-config';

export type AuthCallbackInput =
  | { kind: 'code'; code: string; nextPath: string }
  | { kind: 'token-hash'; tokenHash: string; type: 'email' | 'signup' | 'recovery'; nextPath: string }
  | null;

/** Parse only the callback methods and email OTP types used by this app. */
export function parseAuthCallbackInput(searchParams: URLSearchParams): AuthCallbackInput {
  const code = searchParams.get('code')?.trim() || '';
  const tokenHash = searchParams.get('token_hash')?.trim() || '';
  const type = searchParams.get('type');

  // Ambiguous callbacks fail closed instead of picking one credential.
  if (Boolean(code) === Boolean(tokenHash)) return null;

  const nextPath = getSafeNextPath(searchParams.get('next'));
  if (code) return { kind: 'code', code, nextPath };
  if ((type === 'email' || type === 'signup' || type === 'recovery') && tokenHash) {
    return { kind: 'token-hash', tokenHash, type, nextPath };
  }
  return null;
}
