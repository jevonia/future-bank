import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getSafeNextPath, isGoogleProviderEnabled, isSupabaseConfigured, isValidUsername, normalizeUsername } from '../src/lib/auth-config';

describe('auth config helpers', () => {
  it('accepts only same-site absolute paths for auth callbacks', () => {
    assert.equal(getSafeNextPath('/dashboard?tab=offers'), '/dashboard?tab=offers');
    assert.equal(getSafeNextPath('/'), '/');
    assert.equal(getSafeNextPath(null), '/');
    assert.equal(getSafeNextPath('https://attacker.example/path'), '/');
    assert.equal(getSafeNextPath('//attacker.example/path'), '/');
    assert.equal(getSafeNextPath('/\\attacker.example/path'), '/');

    const destination = new URL(getSafeNextPath('//attacker.example/path'), 'https://newfuturebank.example');
    assert.equal(destination.origin, 'https://newfuturebank.example');
  });

  it('normalizes and validates the signup username format and boundaries', () => {
    assert.equal(normalizeUsername('  Help_Me42  '), 'help_me42');
    assert.equal(isValidUsername('a_b'), true);
    assert.equal(isValidUsername('12345678901234567890'), true);
    assert.equal(isValidUsername('ab'), false);
    assert.equal(isValidUsername('123456789012345678901'), false);
    assert.equal(isValidUsername('has space'), false);
    assert.equal(isValidUsername('name@example'), false);
  });

  it('enables Google only when the public Auth settings explicitly say true', () => {
    assert.equal(isGoogleProviderEnabled({ external: { google: true } }), true);
    assert.equal(isGoogleProviderEnabled({ external: { google: false } }), false);
    assert.equal(isGoogleProviderEnabled({ external: {} }), false);
    assert.equal(isGoogleProviderEnabled({}), false);
    assert.equal(isGoogleProviderEnabled(null), false);
  });

  it('requires both public Supabase values before enabling auth', () => {
    const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const oldKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'public-key';
      assert.equal(isSupabaseConfigured(), false);
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'public-key';
      assert.equal(isSupabaseConfigured(), true);
    } finally {
      if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      else process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
      if (oldKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = oldKey;
    }
  });
});
