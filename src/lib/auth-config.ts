export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(value.trim());
}

/** Fail closed unless Auth's public settings explicitly enable Google. */
export function isGoogleProviderEnabled(settings: unknown): boolean {
  if (!settings || typeof settings !== 'object' || !('external' in settings)) return false;
  const external = settings.external;
  return Boolean(external && typeof external === 'object' && 'google' in external && external.google === true);
}

// Placeholder origin; only used to check where a path would resolve.
const NEXT_PATH_PROBE_ORIGIN = 'https://next-path.invalid';

/** Only allow local application paths as post-auth redirect targets. */
export function getSafeNextPath(value: string | null | undefined): string {
  // The URL parser strips tabs/newlines and treats `\` like `/`, so `/\t/evil.com` would become `//evil.com`.
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001F\u007F\s]/.test(value)
  ) {
    return '/';
  }

  let resolved: URL;
  try {
    resolved = new URL(value, NEXT_PATH_PROBE_ORIGIN);
  } catch {
    return '/';
  }
  // Also reject paths that normalize to `//host` (e.g. `/a/..//evil.com`) in case a caller emits them relatively.
  if (resolved.origin !== NEXT_PATH_PROBE_ORIGIN || resolved.pathname.startsWith('//')) return '/';
  return value;
}
