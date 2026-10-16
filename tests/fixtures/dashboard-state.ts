import type { AppState } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

const now = "2026-10-14T15:00:00.000Z";
const user: User = {
  id: "qa-member-0001",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  aud: "authenticated",
  created_at: now,
  confirmed_at: now,
  email_confirmed_at: now,
  email: "neighbor@example.test",
  role: "authenticated",
  updated_at: now,
};

const neighbor = {
  id: "qa-neighbor-0002",
  username: "Jordan",
  avatar_url: null,
};
const rosa = { id: "qa-neighbor-0003", username: "Rosa", avatar_url: null };
const sam = { id: "qa-neighbor-0004", username: "Sam", avatar_url: null };
const monthsAgo = (months: number) =>
  new Date(Date.parse(now) - months * 30 * 86_400_000).toISOString();
const inDays = (days: number) =>
  new Date(Date.parse(now) + days * 86_400_000).toISOString();

export const dashboardFixture = {
  user,
  availableMinutes: 120,
  reservedMinutes: 90,
  profile: {
    id: user.id,
    username: "Alex",
    avatar_url: null,
    time_balance: 3.5,
  },
  offers: [
    {
      id: 101,
      created_at: now,
      title: "Help tune up a bicycle",
      description: "I can adjust brakes and gears on a neighborhood bike.",
      category: "Repair",
      user_id: user.id,
      active: true,
      profiles: { id: user.id, username: "Alex", avatar_url: null },
    },
  ],
  wants: [
    {
      id: 201,
      created_at: now,
      title: "Practice conversational Spanish",
      description: "Looking for a patient conversation partner once a week.",
      category: "Language",
      user_id: user.id,
      active: true,
      is_urgent: false,
      amplified_at: null,
      criteria: ["virtual_ok"],
      profiles: { id: user.id, username: "Alex", avatar_url: null },
    },
  ],
  configured: true,
  error: null,
  marketplaceOffers: [
    {
      id: 102,
      created_at: now,
      title: "Share a sourdough starter",
      description: "I can teach the basics and send you home with a starter.",
      category: "Food",
      user_id: neighbor.id,
      active: true,
      min_standing: "anyone",
      profiles: neighbor,
    },
    {
      id: 103,
      created_at: now,
      title: "Sit with an elder for an afternoon",
      description: "I can keep someone company, read aloud, or help with lunch.",
      category: "Care",
      user_id: rosa.id,
      active: true,
      min_standing: "known",
      profiles: rosa,
    },
  ],
  marketplaceWants: [
    {
      id: 202,
      created_at: now,
      title: "A hand with a porch planter",
      description: "Help me build a small raised planter on Saturday morning.",
      category: "Woodworking",
      user_id: neighbor.id,
      active: true,
      is_urgent: true,
      amplified_at: now,
      criteria: ["in_person_only", "weekend_only", "someone_else_present"],
      min_standing: "introduced",
      profiles: neighbor,
    },
  ],
  exchanges: [
    {
      id: 301,
      offer_id: 102,
      want_id: null,
      provider_id: user.id,
      requester_id: neighbor.id,
      initiator_id: neighbor.id,
      title: "Share a sourdough starter",
      category: "Food",
      minutes: 60,
      status: "pending",
      provider_confirmed: false,
      requester_confirmed: false,
      created_at: now,
      completed_at: null,
      provider: { id: user.id, username: "Alex", avatar_url: null },
      requester: neighbor,
    },
    {
      id: 302,
      offer_id: null,
      want_id: 202,
      provider_id: neighbor.id,
      requester_id: user.id,
      initiator_id: user.id,
      title: "Help with a porch planter",
      category: "Woodworking",
      minutes: 90,
      status: "accepted",
      provider_confirmed: false,
      requester_confirmed: false,
      created_at: now,
      completed_at: null,
      provider: neighbor,
      requester: { id: user.id, username: "Alex", avatar_url: null },
    },
    {
      id: 303,
      offer_id: 101,
      want_id: null,
      provider_id: user.id,
      requester_id: rosa.id,
      initiator_id: rosa.id,
      title: "Bicycle tune-up",
      category: "Repair",
      minutes: 45,
      status: "completed",
      provider_confirmed: true,
      requester_confirmed: true,
      created_at: now,
      completed_at: now,
      provider: { id: user.id, username: "Alex", avatar_url: null },
      requester: rosa,
    },
  ],
  messages: [
    {
      id: 401,
      exchange_id: 302,
      sender_id: neighbor.id,
      body: "Saturday morning works for me. I’ll bring the lumber.",
      created_at: now,
      sender: neighbor,
    },
    {
      id: 402,
      exchange_id: 302,
      sender_id: user.id,
      body: "Great, I have the tools ready.",
      created_at: now,
      sender: { id: user.id, username: "Alex", avatar_url: null },
    },
  ],
  transactions: [
    {
      id: 501,
      user_id: user.id,
      amount_minutes: 45,
      balance_after_minutes: 210,
      kind: "exchange",
      exchange_id: 303,
      description: "Bicycle tune-up",
      created_at: now,
    },
  ],
  notifications: [
    {
      id: 601,
      user_id: user.id,
      title: "A neighbor requested an exchange",
      body: "Jordan would like help tuning a bicycle.",
      read_at: null,
      created_at: now,
    },
  ],
  kudos: [
    {
      id: 701,
      exchange_id: 303,
      sender_id: rosa.id,
      recipient_id: user.id,
      labels: ["Reliable & Punctual", "Generous Spirit"],
      note: "Thanks for showing me what to check next time.",
      created_at: now,
    },
  ],
  projects: [
    {
      id: 801,
      owner_id: neighbor.id,
      title: "Neighborhood seed library",
      description: "Build a small shelf and organize seed packets for spring.",
      category: "Community",
      goal_minutes: 1200,
      active: true,
      created_at: now,
      current_minutes: 420,
      contributor_count: 3,
      owner: neighbor,
    },
  ],
  contributions: [
    {
      id: 901,
      project_id: 801,
      user_id: user.id,
      minutes: 120,
      note: "Sorted seed packets",
      created_at: now,
      member: { id: user.id, username: "Alex", avatar_url: null },
    },
  ],
  fundRequests: [],
  communityFund: { balance_minutes: 2400 },
  publicSummary: {
    member_count: 18,
    completed_exchanges: 42,
    contributed_minutes: 12600,
    active_projects: 4,
  },
  isFacilitator: false,
  urgentOptIn: true,
  standingReady: true,
  members: [{ id: user.id, username: "Alex", avatar_url: null }, neighbor, rosa, sam],
  standings: [
    { user_id: user.id, level: "steward", since: monthsAgo(5), introduced_by: null, introduced_at: null, gathering_title: null, gathering_starts_at: null, joined_at: monthsAgo(6), completed_exchanges: 1, exchange_partners: 1, steward_renew_by: inDays(200).slice(0, 10) },
    { user_id: neighbor.id, level: "introduced", since: monthsAgo(1), introduced_by: user.id, introduced_at: monthsAgo(1), gathering_title: "September repair day", gathering_starts_at: monthsAgo(1), joined_at: monthsAgo(3), completed_exchanges: 3, exchange_partners: 2, steward_renew_by: null },
    { user_id: rosa.id, level: "known", since: monthsAgo(1), introduced_by: user.id, introduced_at: monthsAgo(4), gathering_title: "June cooking afternoon", gathering_starts_at: monthsAgo(4), joined_at: monthsAgo(5), completed_exchanges: 6, exchange_partners: 4, steward_renew_by: null },
    { user_id: sam.id, level: "new", since: now, introduced_by: null, introduced_at: null, gathering_title: null, gathering_starts_at: null, joined_at: now, completed_exchanges: 0, exchange_partners: 0, steward_renew_by: null },
  ],
  gatherings: [
    { id: 1001, title: "October repair day", starts_at: inDays(10), location: "Grace church hall, side door on Elm Street", host_id: user.id, created_at: now },
    { id: 1000, title: "September repair day", starts_at: monthsAgo(1), location: "Grace church hall", host_id: user.id, created_at: monthsAgo(2) },
  ],
  checkins: [
    { gathering_id: 1000, member_id: neighbor.id, steward_id: user.id, checked_in_at: monthsAgo(1) },
  ],
  concerns: [
    { id: 1101, reporter_id: sam.id, about_id: neighbor.id, exchange_id: null, body: "We agreed on Saturday at ten. He arrived after twelve and did not answer messages.", share_name: false, status: "open", response: null, responded_by: null, responded_at: null, closed_at: null, created_at: now },
  ],
  pauses: [],
  standingEvents: [],
  vouches: [
    { id: 1201, voucher_id: user.id, member_id: rosa.id, sentence: "I know Rosa from the repair day. She fixed my screen door and was patient with my kids underfoot.", basis: "met", created_at: monthsAgo(2) },
    { id: 1202, voucher_id: neighbor.id, member_id: user.id, sentence: "Alex tuned up my bike and showed me how to keep it running.", basis: "exchange", created_at: monthsAgo(1) },
  ],
  knownProgress: { days_member: 180, completed_exchanges: 1, exchange_partners: 1, vouches: 1 },
  firstMeetings: [
    { exchange_id: 302, member_id: neighbor.id, meet_place: "The library steps on Main Street", who_knows: "My sister", check_in_time: "By noon", updated_at: now },
  ],
  safetyCheckins: [],
  stewardNotes: [],
  isSteward: true,
  steward: {
    concernNotes: [],
    nominations: [],
    vouchDetails: [
      { id: 1201, voucher_id: user.id, member_id: rosa.id, home_answer: "yes", mutual_same_day: false, created_at: monthsAgo(2) },
    ],
    knownSuggestions: [
      { member_id: neighbor.id, days_member: 90, completed_exchanges: 3, exchange_partners: 2, vouches: 2, vouchers_connected: true },
    ],
    safetyFeed: [
      { kind: "note", exchange_id: 299, member_id: rosa.id, other_id: sam.id, title: "Carry groceries upstairs", body: "Everything went fine. Sam's building has a broken stair light.", created_at: now },
    ],
  },
} satisfies AppState;

/** The same dashboard seen by a member nobody has met yet (`?standing=new`). */
export const newMemberFixture = {
  ...dashboardFixture,
  standings: dashboardFixture.standings.map((item) =>
    item.user_id === user.id
      ? { ...item, level: "new" as const, since: now, joined_at: now, steward_renew_by: null }
      : item,
  ),
  knownProgress: { days_member: 2, completed_exchanges: 1, exchange_partners: 1, vouches: 0 },
  vouches: dashboardFixture.vouches.filter((item) => item.member_id !== user.id),
  concerns: [],
  isSteward: false,
  steward: null,
} satisfies AppState;
