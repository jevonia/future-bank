import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAuthCallbackInput } from '../src/lib/auth-callback';

test('accepts the existing PKCE callback and keeps its redirect local', () => {
  assert.deepEqual(
    parseAuthCallbackInput(new URLSearchParams('code=verified-code&next=%2Foffers')),
    { kind: 'code', code: 'verified-code', nextPath: '/offers' },
  );
});

test('accepts allowlisted confirmation and recovery token-hash types', () => {
  assert.deepEqual(
    parseAuthCallbackInput(new URLSearchParams('token_hash=opaque-hash&type=email&next=%2F')),
    { kind: 'token-hash', tokenHash: 'opaque-hash', type: 'email', nextPath: '/' },
  );
  assert.deepEqual(
    parseAuthCallbackInput(new URLSearchParams('token_hash=admin-test-hash&type=signup')),
    { kind: 'token-hash', tokenHash: 'admin-test-hash', type: 'signup', nextPath: '/' },
  );
  assert.deepEqual(
    parseAuthCallbackInput(new URLSearchParams('token_hash=opaque-hash&type=recovery&next=%2Fauth%2Freset-password')),
    { kind: 'token-hash', tokenHash: 'opaque-hash', type: 'recovery', nextPath: '/auth/reset-password' },
  );
});

test('rejects unknown types and ambiguous callback credentials', () => {
  assert.equal(parseAuthCallbackInput(new URLSearchParams('token_hash=x&type=magiclink')), null);
  assert.equal(parseAuthCallbackInput(new URLSearchParams('token_hash=x&type=invite')), null);
  assert.equal(parseAuthCallbackInput(new URLSearchParams('code=x&token_hash=y&type=email')), null);
  assert.equal(parseAuthCallbackInput(new URLSearchParams('')), null);
});

test('unsafe redirect targets fall back to the site root', () => {
  const callback = parseAuthCallbackInput(new URLSearchParams('token_hash=x&type=recovery&next=%2F%2Fevil.example'));
  assert.equal(callback?.nextPath, '/');
});
