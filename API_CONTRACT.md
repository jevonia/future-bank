# Implementation contract

All client mutations use `mutateCommunity(action, payload)` from `src/lib/community-api.ts`; it POSTs JSON `{ action, ...payload }` to `/api/community`, throws a friendly Error on failure, and returns `{ data }` on success. Refresh with `router.refresh()`; DashboardClient renders current serverState directly (no frozen copy).

Root owns `src/lib/types.ts`, API routes, and query loading. Agents must not change these without agreement. UI can add optional props to Header via coordination with auth agent.

## Actions and SQL RPCs

| Action | Client fields | RPC and parameters |
| --- | --- | --- |
| save_listing | kind: offer/want, id?: number, title, description, category, criteria?: string[] | bank_save_listing(p_kind, p_id nullable, p_title, p_description, p_category, p_criteria) |
| archive_listing | kind, id | bank_archive_listing(p_kind, p_id) |
| request_exchange | listing_kind, listing_id, minutes, note | bank_request_exchange(p_listing_kind, p_listing_id, p_minutes, p_note) |
| exchange_action | id, operation: accept/decline/cancel/confirm | bank_exchange_action(p_id, p_operation) |
| send_message | exchange_id, body | bank_send_message(p_exchange_id, p_body) |
| give_kudos | exchange_id, labels: string[], note | bank_give_kudos(p_exchange_id, p_labels, p_note) |
| donate | minutes, note, request_id: UUID | bank_donate(p_minutes, p_note, p_request_id) |
| request_fund | minutes, reason | bank_request_fund(p_minutes, p_reason) |
| review_fund | id, decision: approve/decline | bank_review_fund(p_id, p_decision) |
| create_project | title, description, category, goal_minutes | bank_create_project(p_title, p_description, p_category, p_goal_minutes) |
| contribute_project | project_id, minutes, note, request_id: UUID | bank_contribute_project(p_project_id, p_minutes, p_note, p_request_id) |
| close_project | id | bank_close_project(p_id) |
| amplify_want | id | bank_amplify_want(p_id) |
| read_notifications | ids: number[] | bank_read_notifications(p_ids) |
| set_urgent_opt_in | enabled: boolean | bank_set_urgent_opt_in(p_enabled) |

## Tables / query names

Existing `profiles`: id, username, avatar_url (legacy time_balance frozen). `accounts`: user_id UUID PK, balance_minutes integer. `member_preferences`: user_id, urgent_opt_in boolean. `member_roles`: user_id, role ('facilitator').
`offers` and `wants`: existing fields plus active boolean; wants has criteria text[], is_urgent boolean and amplified_at timestamp nullable.
`exchanges`: id, offer_id nullable, want_id nullable, provider_id, requester_id, initiator_id, title, category, minutes, status (pending/accepted/completed/cancelled/declined), provider_confirmed, requester_confirmed, created_at, completed_at nullable. Non-initiating participant accepts or declines; provider receives credits from requester regardless of who initiated.
`exchange_messages`: id, exchange_id, sender_id, body, created_at.
`ledger_entries`: id, user_id, amount_minutes signed integer, balance_after_minutes integer, kind (welcome/opening/exchange/donation/fund), exchange_id nullable, description, created_at.
`notifications`: id, user_id, title, body, read_at nullable, created_at.
`kudos`: id, exchange_id, sender_id, recipient_id, labels text[], note, created_at.
`community_fund`: id = 1, balance_minutes integer.
`fund_requests`: id, user_id, minutes, reason, status (pending/approved/declined), created_at, reviewed_at nullable.
`projects`: id, owner_id, title, description, category, goal_minutes, active boolean, created_at.
`project_contributions`: id, project_id, user_id, minutes, note, created_at.

All bank_* RPCs require authenticated and confirmed users; enforce bounds/ownership in SQL, never just UI/API. No direct client writes to accounts, ledger, exchanges or fund. RPCs should return the created record id or null. Root GET queries tables under the caller's authenticated session. RLS must allow reading marketplace listings/member names for members, private records only for participants/owner/facilitator as appropriate. Public RPC `bank_public_summary()` returns only aggregate integers: member_count, completed_exchanges, contributed_minutes, active_projects. Other tables are not anonymously readable.

UI sees `AppState` in types.ts. Confirmed-owner-only bank_account_summary().single() supplies balance_minutes, reserved_minutes, and available_minutes. Profile.time_balance is total balance / 60; AppState.availableMinutes/reservedMinutes retain exact minutes. Accepted exchanges reserve requester credits; acceptance and donation lock the payer account and check unreserved availability, cancellation releases the reservation, completion transfers only after both confirmations. `isFacilitator`, `configured`, and `error` indicate permissions/configuration/runtime errors. Projects include exact current_minutes and contributor_count from confirmed-member-only bank_project_summaries() RPC; exchanges include provider/requester member records; messages and kudos are grouped client-side by exchange id. Public summary returns a single table row, so use RPC.single().
