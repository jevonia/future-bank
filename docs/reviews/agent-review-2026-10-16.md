# Agent review, October 16, 2026

Run from [AGENT_REVIEW.md](../../AGENT_REVIEW.md). Find-only: no source, test, config, or migration was changed.

## 1. Summary

- **Ref:** `main` at `061f3c3`
- **Lanes run:** A through H, all of them. The lead ran A, B, F, and H. Sonnet subagents ran C, D, and E. A Haiku subagent ran G.
- **Counts after verification and merging:** 2 high, 12 medium, 25 low, 13 nit.

The base is solid. All four gates pass. RLS, grants, `SECURITY DEFINER` settings, lock ordering, and the money rules (reserve, release, settle once, no minting) all held under review and in-memory PGlite reproductions. Every public page loads at phone width with no horizontal scroll and no console errors. Production matches its documented smoke results.

Two findings need attention first:

- **C1:** an open redirect in the auth callback, which can be combined with login CSRF.
- **D1:** with today's single steward, a "Please have a steward call me" request made during an exchange with that steward reaches nobody, even though the member sees success.

The medium findings fall into three groups:

- Steward and safety edge cases in SQL: D2, D3, D4.
- Missing response headers: L2, C4.
- Dashboard state bugs a member would hit: E1, E3, E4, and the date hydration mismatch L1.

## 2. Gates

| Gate | Result |
| --- | --- |
| `npm run lint` | Pass, no warnings |
| `npm run typecheck` | Pass. The first attempt ran next to the build and failed with false TS6053 errors. Rerun alone, it passed. The playbook now says not to run them together. |
| `npm run test` | Pass: 28 helper tests, plus the bank and standing PGlite suites |
| `npm run build` | Pass, 14 routes, no warnings |

## 3. Findings

IDs keep the lane prefix so they can be traced back. "L" marks findings the lead agent found itself. Duplicates were merged into the first ID, and the other ID is listed under "Also".

### High

### C1 Auth callback redirects off-site when `next` contains a tab or newline
- Severity: high
- Lane: C
- Where: `src/lib/auth-config.ts:24-29` (`getSafeNextPath`), used by `src/app/auth/callback/route.ts:19`
- What happens: The guard rejects `//` and `\` but accepts `/` followed by a tab, CR, or LF. The URL parser strips those characters, so `new URL('/\t/evil.com', origin)` resolves to `https://evil.com/`.
- How to reproduce: `getSafeNextPath('/\t/evil.com')` returns it unchanged, and `new URL(that, 'https://newfuturebank.com').href` is `https://evil.com/`. The same happens for `\n` and `\r`. The lead ran all three. In practice an attacker signs up, takes the `token_hash` from their own confirmation email, and sends a victim `/auth/callback?token_hash=…&type=signup&next=%2F%09%2Fevil.com`. The victim is signed into the attacker's account on the real domain, then lands on the attacker's site.
- Expected: Any `next` that does not resolve to the same origin falls back to `/`.
- Evidence: Lead reproduction output: `"/\t/evil.com" -> "/\t/evil.com" -> https://evil.com/`. The tests cover only `//` and `/\`.
- Suggested fix (text only): Resolve against the origin and require the same origin, or reject any control character or whitespace in `next`.
- Confidence: confirmed (function level). The full end-to-end chain was not run, because it needs a real token.

### D1 Steward notices for "call me" and some concerns reach nobody
- Severity: high
- Lane: D
- Where: `supabase/migrations/20261015000100_standing.sql:393-399` (`bank_notify_stewards`) and `:598-599`; `supabase/migrations/20261015000200_vouches_and_safety.sql:217-221`
- What happens: There are two cases.
  - **(a)** `bank_safety_checkin(…,'call_me')` excludes both exchange participants from the notice. Today the facilitator is the only steward (HANDOFF.md). In any exchange with them, "Please have a steward call me" notifies nobody, but the member is shown success. A concern about the only steward is also hidden from that steward by RLS, so nobody can read it.
  - **(b)** A concern with no named member puts a NULL in the exclude array. `x <> all('{a,NULL}')` is NULL, so no steward is notified. The UI always fills in a member, so (b) can be reached only through a direct API call.
- How to reproduce: The subagent ran both cases in PGlite. With one steward in an accepted exchange, a `call_me` from the other member produced 0 notices. `bank_raise_concern(null,null,…)` produced 0 notices, and the same call with a named member produced 1. The lead read the SQL and confirmed both mechanisms.
- Expected: Every "call me" and every concern reaches at least one active steward, or the member is told that none could be reached.
- Evidence: `s.user_id <> all(coalesce(p_except,'{}'::uuid[]))`
- Suggested fix (text only): Remove NULLs from the exclude list. Return or raise when zero stewards were notified, and show that to the member.
- Confidence: confirmed

### Medium

### D2 A paused steward who is also the facilitator can still approve fund requests
- Severity: medium
- Lane: D
- Where: `supabase/migrations/20261014000200_bank_rpcs.sql:242-268`; `20261014000100_bank_schema.sql:315-319, 351-352`
- What happens: Fund review checks `bank_is_facilitator()` and ignores pauses. Every other steward power checks `bank_require_steward()`, which refuses a paused steward.
- How to reproduce: Run in PGlite. Pause the facilitator-steward. `bank_create_gathering` fails, but `bank_review_fund(…,'approve')` succeeds and moves fund minutes.
- Expected: A pause also stops fund review, or the docs say plainly that it does not.
- Confidence: confirmed

### D3 Two stewards can pause each other and leave no one able to unpause
- Severity: medium
- Lane: D
- Where: `supabase/migrations/20261015000100_standing.sql:632-666`, `:140-148`
- What happens: The steward check runs before any lock. Two stewards who pause each other at the same moment both succeed. That leaves zero active stewards, so nobody can unpause, check people in, or handle concerns. Only trusted SQL can recover.
- How to reproduce: The subagent inserted both pause rows to stand in for the race. Afterward, unpausing fails for both stewards. A true race was not run, because PGlite has a single connection.
- Expected: A pause that would leave no active steward is refused, and steward rows are locked during a pause.
- Confidence: likely

### D4 One member can file unlimited concerns about another, which blocks Known and Steward
- Severity: medium
- Lane: D
- Where: `supabase/migrations/20261015000100_standing.sql:581-601`, `:458`, `:465-468`, `:511-513`
- What happens: There is no cap or deduplication. Every open concern blocks the target from reaching Known or Steward, and every concern notifies every steward.
- How to reproduce: Run in PGlite. 30 calls produced 31 open concerns and 31 steward notices.
- Expected: A limit per reporter and target, or only distinct reporters count toward blocking.
- Confidence: confirmed

### C3 Editing a listing while standing failed to load resets "Who can say yes?" to anyone
- Severity: medium
- Lane: C (and D)
- Where: `src/lib/community-validation.ts:58`; `supabase/migrations/20261015000100_standing.sql` `bank_save_listing` (`v_min := coalesce(p_min_standing,'anyone')`, applied on update); `AddOfferModal.tsx:68`, `AddWantModal.tsx:88`; `src/lib/community-state.ts:68`
- What happens: If the standing query errors, `standingReady` is false and the field is hidden. Saving an edit then sends no `min_standing`, and the update overwrites a stored `known` or `introduced` with `anyone`. A safety setting gets wider without the member being told.
- How to reproduce: A listing has `min_standing='known'`. The standing RPC fails on load. Edit the title and save. The stored value becomes `anyone`.
- Expected: On update, a missing `p_min_standing` keeps the stored value.
- Confidence: likely. The lead confirmed the SQL path by reading it.

### C4 Session-refresh responses do not set the no-store headers that `@supabase/ssr` requires
- Severity: medium
- Lane: C
- Where: `src/proxy.ts:22-34`, `src/lib/supabase/server.ts:18-22`
- What happens: `setAll(cookiesToSet, headers)` ignores the `headers` argument. The library documents that `Cache-Control: private, no-store…` must be applied to any response that sets auth cookies, so that a CDN cannot cache one member's session cookie for others.
- How to reproduce: Compare `node_modules/@supabase/ssr/dist/main/types.d.ts` (the `setAll` docs) with `src/proxy.ts`.
- Expected: Copy those headers onto the response.
- Confidence: likely. Library docs were compared with the code. CDN behavior was not tested.

### C7 `/api/auth/resend-confirmation` has no origin check and no app-level rate limit
- Severity: medium
- Lane: C
- Where: `src/app/api/auth/resend-confirmation/route.ts:5-35`
- What happens: Any site can POST an address and trigger a confirmation email. Only Supabase's own throttle limits it, so a flood can use up the project's email quota and block real signups. The route also returns provider error text unchanged (`:26`) and builds `emailRedirectTo` from the request origin (`:22`).
- How to reproduce: Read the route and compare it with the origin check in `/api/community`. The route was not called, per the safety rules.
- Expected: A same-origin check, per-IP and per-email limits, and a fixed generic message.
- Confidence: likely

### C2 Fund request reason: the UI allows 1 to 9 characters, but the API and SQL require 10
- Severity: medium
- Lane: C
- Where: `src/components/dashboard/DashboardDialogs.tsx:365-370`; `src/lib/community-validation.ts:65`; `bank_schema.sql:170`
- What happens: A short reason passes the browser's checks, then fails with "reason must be 10 to 2000 characters."
- Expected: Add `minLength={10}`, checked against the trimmed text.
- Confidence: confirmed (the validator was run)

### L2 Production sends no frame protection, CSP, Referrer-Policy, or nosniff header
- Severity: medium
- Lane: H
- Where: `next.config.ts` (no `headers()`); live response from `https://newfuturebank.com/`
- What happens: The only security header is HSTS. With no `frame-ancestors` or `X-Frame-Options`, the dashboard can be framed by another site, so a member could be tricked into clicking Confirm, Accept, or Donate (clickjacking). There is also no CSP, `Referrer-Policy`, or `X-Content-Type-Options`, and `X-Powered-By: Next.js` is exposed.
- How to reproduce: `curl -sI https://newfuturebank.com/`
- Expected: `frame-ancestors 'none'` (or `X-Frame-Options: DENY`), `Referrer-Policy`, `nosniff`, a basic CSP, and `poweredByHeader: false`.
- Confidence: confirmed

### L1 Dashboard dates render in the server's time zone, then the browser's (hydration mismatch)
- Severity: medium
- Lane: B (also found by Lane E as E2)
- Where: `src/app/dashboard-client.tsx:1165` (kudos), `:1191` (notifications), `:1248` (ledger)
- What happens: These calls pass no locale or time zone. Vercel renders in UTC, and an Eastern-time browser re-renders in local time, so the text differs and React reports a hydration error. The notification time is wrong for everyone until hydration finishes. This also breaks the rule that dates use `COMMUNITY_TIME_ZONE`.
- How to reproduce: For `2026-10-14T15:00Z`, UTC renders `10/14/2026, 3:00:00 PM` and America/New_York renders `10/14/2026, 11:00:00 AM`. Both were run with Node. It does not show locally, because the dev server and browser share a time zone.
- Expected: Use the community time-zone formatters, as the standing cards do.
- Confidence: likely. The mechanism is confirmed. It was not seen in production, because production dashboards need sign-in.

### E1 An unsent message draft follows you to a different exchange
- Severity: medium
- Lane: E
- Where: `src/app/dashboard-client.tsx:96`, `241-250`, `838`
- What happens: One `message` state is shared by every exchange, and changing the selection does not clear it. A draft typed for one neighbor is sent to whichever exchange is selected when you press Send.
- How to reproduce: Type in exchange A, select exchange B, and press Send.
- Expected: Keep a draft per exchange, or clear it when the selection changes.
- Confidence: confirmed (code read by the lead)

### E3 The profile form resets on every background refresh
- Severity: medium
- Lane: E
- Where: `src/components/modals/ProfileSettingsModal.tsx:29-35`, `97-99`; refresh triggers in `src/app/dashboard-client.tsx:343-356`
- What happens: The reset effect depends on `profile`, which is a new object after every `router.refresh()`. Refreshes come every 45 seconds, on window focus, and on tab return. Each one erases a username being typed or an image just picked. The "profile updated" success message is erased right after Save.
- How to reproduce: Open Profile settings, type a new name, switch windows, and come back. The name reverts.
- Expected: Reset only when the dialog opens.
- Confidence: likely

### E4 The sign-in dialog stays on "Check your email" after a sign-up
- Severity: medium
- Lane: E
- Where: `src/components/modals/LoginModal.tsx:28`, `:30-47`, `:105-108`, `:150`
- What happens: The modal stays mounted, and closing it never clears `confirmationEmail`, the mode, the typed password, or old errors. After a sign-up, every later opening shows only the confirmation screen, until the page is reloaded.
- How to reproduce: Sign up, press Done, then open "Join or sign in" again.
- Expected: Each opening starts with a fresh form.
- Confidence: confirmed (code read by the lead. The open effect resets only the Google flag.)

### Low

### C5 The username availability check treats `_` as a wildcard
- Severity: low
- Lane: C (also found as E6)
- Where: `src/components/modals/ProfileSettingsModal.tsx:85` (`.ilike('username', cleanUsername)`)
- What happens: `a_c` matches `abc`, so the form says "already taken". If two names match, `.maybeSingle()` errors and the member sees a generic failure.
- Expected: An exact case-insensitive match.
- Confidence: likely

### D6 Usernames are unique only case-sensitively, so a member can impersonate a steward
- Severity: low
- Lane: D (also found as C6)
- Where: `supabase/migrations/20261014000100_bank_schema.sql:6`, `:18-20`, and the username fallback in `:225-243`
- What happens: `Nova` can exist next to `nova`. A sign-up that collides is silently renamed `member_xxxx`, and the member is never told.
- How to reproduce: Run in PGlite. `update profiles set username='Nova'` succeeds while `nova` exists.
- Expected: A unique index on `lower(username)`, and the collision reported at sign-up.
- Confidence: confirmed

### D5 Project hours are self-reported without limit and feed the public statistic
- Severity: low
- Lane: D
- Where: `bank_rpcs.sql:284-307`, `:389-398`
- What happens: A member can log up to 2,880 minutes per call on their own project, with no overall cap. The total goes into `contributed_minutes` in the public summary.
- How to reproduce: Run in PGlite. Five calls raised the public total from 0 to 14,400.
- Expected: Cap the total or block self-contributions, or label the number as self-reported.
- Confidence: confirmed

### C9 Sign-up allows 6-character passwords, but reset requires 8
- Severity: low
- Lane: C
- Where: `src/components/modals/LoginModal.tsx:177`; `src/app/auth/reset-password/page.tsx:42, 77, 81`
- Confidence: confirmed

### C11 Text made only of spaces passes the browser's checks but fails on the server
- Severity: low
- Lane: C
- Where: `src/lib/community-validation.ts:7-11` trims before checking length. The UI's `minLength` counts untrimmed text, for example in `AddOfferModal.tsx:97-100` and in `StandingDialogs.tsx` at `:309`, `:386-389`, and `:622-624`.
- What happens: A title of `"ab "` or a 10-space vouch passes in the browser, then gets a server error.
- Confidence: confirmed (the validator was run)

### C10 Database errors other than three known codes become a generic 503
- Severity: low
- Lane: C
- Where: `src/app/api/community/route.ts:24-29`
- What happens: For example, `28000` "Confirmed sign-in required" shows "Your change could not be saved" instead of asking the member to sign in.
- Confidence: likely

### C13 The gathering time accepts loosely parsed dates
- Severity: low
- Lane: C
- Where: `src/lib/community-validation.ts:42-46`
- What happens: `"2026-02-31"` becomes March 3. `"12"` becomes 2001-12-01. A time with no offset is read in the server's time zone. Only direct API callers can send these, because the UI sends ISO strings.
- Confidence: confirmed (the validator was run)

### C15 `/api/auth/providers` calls Supabase on every request, with no cache
- Severity: low
- Lane: C
- Where: `src/app/api/auth/providers/route.ts:4`, `:21-30`
- Confidence: unverified

### E5 The profile dialog rounds the balance to one decimal
- Severity: low
- Lane: E
- Where: `src/components/modals/ProfileSettingsModal.tsx:141` (`toFixed(1)`), compared with `formatCredits` in `src/lib/types.ts:203-205`
- What happens: 1.25 hours shows as "1.3" in this dialog and as "1.25" everywhere else.
- Confidence: confirmed

### E7 Buttons turn back on before the refreshed data arrives
- Severity: low
- Lane: E
- Where: `src/app/dashboard-client.tsx:177-199`
- What happens: `router.refresh()` is not awaited. During that gap, clicking Accept a second time produces a confusing SQL error.
- Confidence: likely

### E8 An old error message appears inside an unrelated dialog
- Severity: low
- Lane: E
- Where: the openers in `src/app/dashboard-client.tsx` at `:842-847`, `:883`, `:938-950`, `:993-1000`, and `:1006-1010`. The banners are in `DashboardDialogs.tsx`.
- What happens: These five openers do not clear `actionError`. For example, a failed Accept shows its error again when the Donate dialog is opened.
- Confidence: confirmed (code reading)

### E9 Action errors appear far from the button, and the neighbor dialog shows none
- Severity: low
- Lane: E
- Where: `src/app/dashboard-client.tsx:421-434`; `src/components/standing/StandingDialogs.tsx:106-241`
- What happens: Errors appear in a banner at the top of the page, with no scrolling or focus change. A failed "Take back your vouch" shows no error inside its own dialog.
- Confidence: likely

### E10 Accept is offered to paused members, and SQL rejects it
- Severity: low
- Lane: E
- Where: `src/components/dashboard/ExchangeDesk.tsx:109-135`
- Confidence: confirmed

### E11 The "Amplified" button stays clickable and fails, and the daily limit is not explained
- Severity: low
- Lane: E
- Where: `src/app/dashboard-client.tsx:802-817`
- Confidence: confirmed

### E12 Every project star in the contribution constellation is labeled with the member's own name
- Severity: low
- Lane: E
- Where: `src/app/dashboard-client.tsx:1292-1300`
- What happens: The code groups contributions by `item.member?.username`, which is always the viewer. All project hours collapse into a single star with your own name.
- Confidence: confirmed (code read by the lead)

### E13 Screen readers do not hear the listing owner's standing level
- Severity: low
- Lane: E/F
- Where: `src/app/dashboard-client.tsx:303-312`
- What happens: `aria-label="About {owner}"` replaces the button's content, including the standing badge.
- Confidence: confirmed

### E14 A click on the dim background throws away a long draft
- Severity: low
- Lane: E
- Where: `src/components/ui/Dialog.tsx:66-69`
- What happens: Any mousedown on the backdrop closes the dialog. A concern, vouch, or note that was being written is lost.
- Confidence: confirmed

### E15 Gathering times are entered in the browser's time zone but shown in the community's
- Severity: low
- Lane: E
- Where: `src/components/standing/StandingDialogs.tsx:453`; `src/lib/standing.ts:176-205`
- Confidence: likely

### E16 Kudos can be sent again, and the second one is silently dropped
- Severity: low
- Lane: E
- Where: `src/components/dashboard/ExchangeDesk.tsx:199-211`; the `on conflict do nothing` in `bank_give_kudos`
- Confidence: confirmed

### G6 The privacy page understates what is public and what is stored
- Severity: low
- Lane: G
- Where: `src/app/privacy/page.tsx:216`, `:197-198`
- What happens: There are two problems.
  - The page says signed-out visitors see only member and hour totals. The public summary, and the landing page, also show completed exchanges and active projects.
  - The page does not mention these stored records: `bank_operation_keys`, `member_roles`, or `steward_renew_by`. It also says the site sets only one cookie, but `@supabase/ssr` can split the session across several cookies and adds a PKCE verifier cookie.
- Confidence: confirmed for the totals. Likely for the cookie claim.

### G1 Standing level words are written into components instead of coming from `standing.ts`
- Severity: low
- Lane: G
- Where: About 25 places, including `StandingDialogs.tsx:546` ("Mark Introduced"), `Landing.tsx:369`, `privacy/page.tsx:181`, `WhoCanSayYes.tsx:45-46`, and `StandingPanel.tsx:65, 74, 199`
- What happens: Renaming a level, which is still an open question in HANDOFF.md, would leave these behind.
- Confidence: confirmed

### G2 Some public-page figures have weak or no source support
- Severity: low
- Lane: G
- Where: `Landing.tsx:738` ("at least 800", while the cited article title says "hundreds"); `:111` ("highest on record"); the story dollar amounts at `:142` and `:160`, next to the line "the prices and statistics are real"
- Confidence: unverified (the sources were not opened)

### L3 Section links are hidden below 1024px, with no replacement
- Severity: low
- Lane: A
- Where: `src/components/landing/Landing.tsx:395-397` (`hidden … lg:flex`)
- What happens: Phones and tablets get no "How it works / Stories / Agreements / Questions" links. On a 375px phone, the header also wraps the Sign in button onto its own line.
- Confidence: confirmed (screenshot)

### D9 Important rules have no PGlite test
- Severity: low
- Lane: D
- What happens: These rules are untested:
  - An initiator who is paused or below standing at accept time
  - `min_standing='known'` on a request
  - A nomination by a paused steward
  - Steward promotion blocked by an open concern
  - Decline
  - Cancel by the initiator
  - Messages after an exchange closes
  - Non-owner close or archive
  - Non-participant message or kudos
  - Check-in of a paused member
  - Both D1 notification paths
- Confidence: confirmed

### C12 / D7 Bounds differ between the UI, the API, and SQL
- Severity: low
- Lane: C, D
- What happens: The project goal is 600,000 minutes in the API and 1,000,000 in SQL. Exchange minutes are 1,440 in the UI and 2,880 in the API and SQL. Messages are 2,000 characters in the UI and 4,000 in the API. The kudos note is 500 in the UI and 1,000 in the API. In each case the UI is the stricter one, so no member sees a failure.
- Confidence: confirmed

### Nit

- **C8:** `resend-confirmation` returns 500 instead of 400 for a `null` or invalid JSON body (`route.ts:7-8`).
- **C14:** A title made only of zero-width characters passes validation (`community-validation.ts:7-11`). Confirmed.
- **E17:** Cancelling the share sheet shows "Select the text above and copy it." (`SafetyCard.tsx:61-72`).
- **E18:** The dialog's Tab trap leaves out `summary`. When a dialog swaps its content, focus falls to `<body>` (`Dialog.tsx:36-38`).
- **E19:** Returning to the tab fires both `focus` and `visibilitychange`, so the full state loads twice. "Ask about this" stays enabled when an exchange on that listing is already open.
- **E20:** The ledger says amounts are "exact to the minute" but shows hours to two decimals, so 7 minutes appears as 0.12.
- **G3:** The egg price is cited to the grocery source, and the 1936 to 1974 photo date range has no source entry.
- **G4:** `WhoCanSayYes.tsx:48` uses `target="_blank"` with no `rel`. The other links use `rel="noreferrer"`, which already implies noopener.
- **G5:** The unit is called hours, time credits, credits, and "TC". "TC" is defined only once, at `dashboard-client.tsx:533`. The header says "Sign in / Join" and the landing page says "Join or sign in".
- **D8:** `API_CONTRACT.md` lists 15 actions and leaves out `min_standing` and all 14 standing and safety actions. `docs/DATABASE.md` says there are 18 want criteria, but there are 19.
- **L4:** `Dialog` sets `aria-modal`, but the page behind it is not `inert`. Some screen readers can still move into the background.
- **L5:** `/auth/auth-code-error`, `/auth/reset-password`, and the 404 page all use the home page's `<title>`.
- **L6:** `/api/community` validates the payload before checking sign-in, so anonymous callers receive field-level 400 messages. Production returned 400 to a no-session request with an empty `ids` list, and 401 with a valid one.

## 4. Previous findings

None. This is the first run.

## 5. Not covered

- **Signed-in flows on a real database.** By design, no account was created or used. Signed-in UI was reviewed only through the read-only `/qa/dashboard` fixture, where the dashboard is `inert`. Dialog interactions inside the dashboard were reviewed in code, not clicked.
- **True concurrency.** The race in D3, double accept, and double confirm need two connections. `test:concurrency` is off-limits in this playbook.
- **Dark mode.** The site has no dark theme. All styles are light only, so there was nothing to check.
- **Real phones, screen readers, email delivery, and the CDN caching behavior behind C4.**
- **The external sources behind the statistics (G2).**

## 6. Notes for the next run

- Add a check for control characters in redirect parameters to Lane C. That check found C1.
- Lane D should test steward notices with exactly one steward, which matches today's production.
- Lane B could use a second fixture with the dashboard not `inert`, so dialogs can be clicked without touching Supabase. That would need a code change, which is a decision for the maintainer.
- Re-check C1, D1, L1, and L2 first next time.
