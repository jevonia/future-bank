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

/** Only allow local application paths as post-auth redirect targets. */
export function getSafeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/';
  }
  return value;
}
