# Authentication and profile implementation

## What is covered

- Browser and server Supabase clients use public environment settings. The server client keeps the `@supabase/ssr` `getAll`/`setAll` cookie adapter; middleware uses the same adapter and calls `auth.getUser()` to refresh and verify the session.
- Browser components can render when the Supabase URL/key are absent. Auth actions show a configuration message instead of failing during render.
- Password sign-in and signup, email confirmation resend, password reset email, and password update have user-visible status and error states. Auth callback redirects accept only local absolute paths and callback failures lead to an explanatory page. The Google option appears only when `/api/auth/providers` confirms it is enabled in the current Supabase Auth settings.
- Signup confirmation state includes a resend action so accounts without an initial session can request a fresh verification link.
- Signup and profile edit share the 3–20 character username rule and store normalized lowercase names. Profile edits are limited to `username` and `avatar_url`.
- The shared `Dialog` provides a visible close button, Escape and backdrop dismissal, focus containment/restoration, scroll locking, dialog semantics, and bounded mobile scrolling.

## Avatar behavior and limitation

Uploads accept JPEG, PNG, WebP, and GIF files up to 256 KB. The browser stores these as data URLs in `profiles.avatar_url`; the database/object storage schema has no upload path yet, so this increases profile row size. Members can instead enter an HTTPS image URL. Only `username` and `avatar_url` are edited from the profile form. The form does not update urgent-request preferences; that preference uses the separately defined `bank_set_urgent_opt_in` action.

## Verification status

The Supabase signup trigger creates the profile and welcome ledger entry when `auth.users` is inserted, before email confirmation. The callback exchanges the confirmation code and redirects only to a same-site path. Supabase may return a fake user with no identities when an email already has an account; signup now directs that person to sign-in or password recovery instead of claiming an email was sent.

Password recovery sends a PKCE link back through the callback. The reset page verifies an authenticated user with `auth.getUser()` before showing the password form; the code exchange places the user in the browser's auth storage, so the link needs to be opened in that browser. Supabase also verifies the session on `updateUser`.

`node --import tsx --test tests/auth-config.test.ts` passed (4 focused tests for redirect safety, username boundaries, provider setting parsing, and missing environment values). `npm run lint` and `npm run typecheck` both passed after root integration. `npm run test` also covers the PGlite migration/security integration suite.

`npx eslint` on the auth-owned source paths passed with no warnings.

The local CLI is linked to Supabase project `aitnqoqdkhvlgxuujowb`, and the public environment is present in ignored `.env.local`; values are not recorded here. A read-only `GET /auth/v1/settings` using both the public `apikey` and bearer headers returned HTTP 200; `external.google` was not `true`, so provider discovery correctly reports Google as disabled. No provider setting was changed. The project was restored, and the public SDK connection was verified; bank migrations are not applied, so live signup, confirmation delivery, OAuth, resend, and password reset have not been exercised against the app schema. Before validating those journeys, allow `http://localhost:3001/auth/callback` and the production `/auth/callback` URL in Supabase Auth. Local PostgreSQL concurrency and desktop/mobile QA were reported as passing; no live migration, authenticated app E2E, or production deployment has been performed.
