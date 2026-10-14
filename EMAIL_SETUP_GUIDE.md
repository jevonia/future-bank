# Supabase email setup for New Future Bank

This is the current guide for configuring signup confirmation and password recovery in Supabase Auth. The matching HTML templates live in [`supabase/templates`](supabase/templates). The former generic templates and raw `{{ .TokenHash }}` magic-link example were incorrect for this app and should not be used.

## Current status

The live Auth settings were checked read-only: signup and email auth are enabled, auto-confirm is disabled, and Google is disabled. The Auth redirect allow list contains the local callback URLs and the production callback; a legacy Vercel callback is retained in the hosted settings. SMTP configuration/provider and email delivery have not been verified. Supabase's built-in email service can be rate-limited and is intended for evaluation, so production delivery needs an approved SMTP provider and sender-domain setup. No live setting has been changed by this repository work.

The verified production Site URL is `https://newfuturebank.com`. Keep the callback allow list narrow and include the exact URLs used by the app:

- `http://localhost:3000/auth/callback`
- `http://localhost:3001/auth/callback` (local QA server)
- `https://newfuturebank.com/auth/callback`

The hosted project also retains `https://future-bank-six.vercel.app/auth/callback` for the legacy Vercel deployment. Preserve it only while that deployment remains in use. For preview deployments, add only a verified exact callback URL and point that preview at its intended Supabase project.

## Install the templates

In the intended Supabase project, open **Authentication → Email Templates** and copy the repository template into the corresponding body field:

| Supabase template | Subject | File |
| --- | --- | --- |
| Confirm signup | `Confirm your New Future Bank email` | [`supabase/templates/confirm-signup.html`](supabase/templates/confirm-signup.html) |
| Reset password | `Reset your New Future Bank password` | [`supabase/templates/reset-password.html`](supabase/templates/reset-password.html) |

Use a verified sender address and name from the configured SMTP provider. Do not use a placeholder sender domain in a production template. The app sends signup/resend redirects to `/auth/callback?next=/` and recovery redirects to `/auth/callback?next=/auth/reset-password`. The template appends the Supabase token hash and its fixed purpose (`email` or `recovery`) to that callback URL. `/auth/callback` verifies the token server-side, stores the session in the SSR cookie adapter, and redirects only to the validated same-site `next` path. It also accepts Supabase's `signup` OTP type for explicitly generated signup test links; the installed template uses `email`.

Do not change the template links to `href="{{ .TokenHash }}"`: a token hash is not a complete URL. Do not replace these app callbacks with `{{ .ConfirmationURL }}` unless you also verify the resulting PKCE callback flow against the app. The HTML templates intentionally use `{{ .RedirectTo }}` because the app provides a callback URL for each environment.

## SMTP and delivery

SMTP credentials are private operational settings and are not stored in the repository. Select an approved provider, verify sender-domain ownership and DNS authentication, and configure SMTP in the Supabase project only after the account owner authorizes that change. Do not place SMTP credentials in `NEXT_PUBLIC_*` variables, templates, commits, or support messages. Delivery, sender identity, throughput, bounce handling, and provider-specific configuration remain unverified.

## Validation before launch

After the project owner configures a sender and installs the templates, validate on a preview project first:

1. Create a new account and verify the message links to the matching local or preview origin and returns through `/auth/callback`.
2. Resend signup confirmation and verify the link still confirms the account.
3. Request password recovery and verify the link reaches `/auth/reset-password`, accepts a new user-entered password, and does not change it unless the form is submitted.
4. Confirm expired/reused links show the app's explanatory error page.
5. Check desktop and mobile email clients, including plain link fallback if the provider rewrites links. Disable click tracking for these authentication links if it alters their destination.

Live signup, confirmation delivery, recovery, and SMTP delivery have not yet been exercised end-to-end. No live auth settings, templates, or mail were changed during implementation. For the wider release state, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) and [`HANDOFF.md`](HANDOFF.md).
