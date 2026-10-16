// Words and rules for community standing (docs/STANDING_AND_SAFETY_PLAN.md).
// The explainer page, the dashboard, and the tests all read from here, so the
// public description cannot drift from what members see. Copy follows
// docs/DESIGN.md: short sentences, everyday words, no em dashes. The site
// always uses the words below, never the plan's letters.

export const STANDING_LEVELS = ["new", "introduced", "known", "steward"] as const;
export type StandingLevel = (typeof STANDING_LEVELS)[number];

export const MIN_STANDING = ["anyone", "introduced", "known"] as const;
export type MinStanding = (typeof MIN_STANDING)[number];

export const MIN_STANDING_LABELS: Record<MinStanding, string> = {
  anyone: "Anyone",
  introduced: "Introduced and up",
  known: "Known and up",
};

/** Mirrors bank_known_ready() in supabase/migrations/20261015000100_standing.sql. */
export const KNOWN_RULES = {
  days: 60,
  exchanges: 3,
  partners: 2,
  vouches: 2,
} as const;
export const STEWARD_WAIT_DAYS = 14;

/** Shown next to every level, as the plan's "false confidence" rule asks. */
export const NOT_A_PROMISE =
  "A level is not a safety promise. It says how well the community knows someone, not what they will do.";
export const SAFETY_HABITS =
  "Meet in a public place the first time, tell a friend where you'll be, and remember you can always say no.";

export interface LevelInfo {
  /** The level's name as members see it. */
  name: string;
  /** How the level opens a profile line. */
  heading: string;
  means: string;
  doesNotMean: string;
  howToGetHere: string;
  letsYou: string[];
}

export const LEVEL_INFO: Record<StandingLevel, LevelInfo> = {
  new: {
    name: "New",
    heading: "New here",
    means:
      "Signed up with a real email. Nobody from the bank has met them in person yet.",
    doesNotMean:
      "That something is wrong. Everyone starts here, and most people stay New until their first gathering.",
    howToGetHere: "Sign up and confirm your email.",
    letsYou: [
      "Post offers and requests.",
      "Message anyone in the bank.",
      "Trade hours with anyone who is willing.",
      "Come to gatherings.",
    ],
  },
  introduced: {
    name: "Introduced",
    heading: "Introduced",
    means:
      "A steward has met them in person and checked that they are who their profile says.",
    doesNotMean:
      "That anyone checked their background or knows them well. One steward met them once.",
    howToGetHere:
      "Get checked in by a steward at a community gathering. If getting there is hard, a steward can meet you one to one, like coffee, a porch visit, or a video call.",
    letsYou: [
      "Everything a New member can do.",
      "Say yes to requests marked “Introduced and up.”",
    ],
  },
  known: {
    name: "Known",
    heading: "Known neighbor",
    means:
      "The community has worked with them more than once, and two Known neighbors stand behind them.",
    doesNotMean:
      "That they are safe in every situation. People who know someone well can still be wrong about them.",
    howToGetHere: `Be Introduced and a member for ${KNOWN_RULES.days} days. Finish ${KNOWN_RULES.exchanges} exchanges with at least ${KNOWN_RULES.partners} different people. Get ${KNOWN_RULES.vouches} vouches and have no open concern. Then a steward looks it over and confirms it.`,
    letsYou: [
      "Say yes to requests marked “Known and up.”",
      "Vouch for other members.",
      "Host a gathering, with a steward there to check people in.",
      "Be nominated as a steward.",
    ],
  },
  steward: {
    name: "Steward",
    heading: "Steward",
    means:
      "A neighbor the community chose to welcome new people and listen to concerns.",
    doesNotMean:
      "A boss or a judge. A steward is a neighbor with a job to do, and another steward can pause their standing too.",
    howToGetHere: `Be Known. Two stewards nominate you, talk with you about the role, and you agree to the steward commitments. Then there are ${STEWARD_WAIT_DAYS} days when anyone can raise a concern in private. Stewards renew each other every year.`,
    letsYou: [
      "Check people in at gatherings, which makes them Introduced.",
      "Read concerns and write back within two days.",
      "Pause someone's standing while a concern is looked at.",
      "Confirm Known neighbors and nominate new stewards.",
    ],
  },
};

/** Short, illustrated introduction; full requirements stay in LEVEL_INFO. */
export const STANDING_STORIES: Record<StandingLevel, {
  speaker: string;
  people: { x: number; role: string }[];
  dialogue: string;
  title: string;
  copy: string;
  reminder: string;
}> = {
  new: {
    speaker: "A new member",
    people: [{ x: 171, role: "New member" }],
    dialogue: "I can cook. Who needs a hand?",
    title: "Start with what you can share",
    copy: "Confirm your email, post an offer, or ask for help. You can trade hours from day one.",
    reminder: "Everyone starts here. Nobody from the bank has met you yet.",
  },
  introduced: {
    speaker: "The steward",
    people: [{ x: 86, role: "New member" }, { x: 233, role: "Steward" }],
    dialogue: "Come on in. Let’s meet the neighbors!",
    title: "Meet a steward",
    copy: "Come to a gathering and get checked in. If getting there is hard, ask about meeting one to one.",
    reminder: "A steward has met you. They haven’t checked your background.",
  },
  known: {
    speaker: "A Known neighbor",
    people: [{ x: 86, role: "Known neighbor" }, { x: 233, role: "Our neighbor" }],
    dialogue: "We’ve helped each other. I’ll vouch for you.",
    title: "Keep showing up for each other",
    copy: "Trade hours with neighbors and get two vouches. A steward checks the full requirements before confirming Known.",
    reminder: "People have worked with you. That still isn’t a safety promise.",
  },
  steward: {
    speaker: "Our neighbor, now a steward",
    people: [{ x: 88, role: "Now a steward" }, { x: 239, role: "New member" }],
    dialogue: "Welcome! Let’s sit down and talk.",
    title: "Help welcome the next neighbor",
    copy: "If you choose this role, two stewards nominate you. You agree to help welcome people and listen to concerns.",
    reminder: "A steward is a neighbor with a job to do. Everyone’s hour stays equal.",
  },
};

export const VOUCH_BASIS_LABELS = {
  met: "We have met in person",
  exchange: "We finished an exchange together",
} as const;
export const HOME_ANSWER_LABELS = {
  yes: "Yes",
  no: "No",
  not_sure: "Not sure",
} as const;

export function levelRank(level: StandingLevel | string | null | undefined) {
  const index = STANDING_LEVELS.indexOf(level as StandingLevel);
  return index < 0 ? 0 : index;
}

/** Same rule as bank_meets_minimum(): a paused member meets only "Anyone". */
export function meetsMinimum(
  level: StandingLevel | undefined,
  min: MinStanding | string | null | undefined,
  paused = false,
) {
  if (!min || min === "anyone") return true;
  return !paused && levelRank(level) >= levelRank(min);
}

/** Many places show dates, so fix one zone to keep server and browser in step. */
export const COMMUNITY_TIME_ZONE =
  process.env.NEXT_PUBLIC_COMMUNITY_TIME_ZONE?.trim() || "America/New_York";

export function monthYear(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: COMMUNITY_TIME_ZONE,
  });
}

export function shortDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: COMMUNITY_TIME_ZONE,
  });
}

export function gatheringTime(value: string | Date) {
  return new Date(value).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: COMMUNITY_TIME_ZONE,
  });
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

export interface StandingFacts {
  level: StandingLevel;
  joined_at: string;
  introduced_by_name?: string | null;
  introduced_at?: string | null;
  gathering_title?: string | null;
  completed_exchanges: number;
  exchange_partners: number;
}

/**
 * The plain-words line from the plan's "What members see". It never shows a
 * pause, a concern, or any number larger than a count of exchanges.
 */
export function standingLines(
  facts: StandingFacts,
  options: { now?: Date; nextGathering?: { title: string; starts_at: string } | null } = {},
): string[] {
  const now = options.now ?? new Date();
  const lines: string[] = [];
  if (facts.level === "new") {
    const days = (now.getTime() - new Date(facts.joined_at).getTime()) / 86_400_000;
    lines.push(days < 7 ? "Joined this week." : `Joined in ${monthYear(facts.joined_at)}.`);
    lines.push("Hasn't been to a gathering yet.");
    if (options.nextGathering) {
      lines.push(
        `The next one is ${options.nextGathering.title}, ${gatheringTime(options.nextGathering.starts_at)}.`,
      );
    }
    return lines;
  }
  if (facts.introduced_at && facts.introduced_by_name) {
    lines.push(
      facts.gathering_title
        ? `Met by ${facts.introduced_by_name} at ${facts.gathering_title}, ${monthYear(facts.introduced_at)}.`
        : `Met by ${facts.introduced_by_name}, ${monthYear(facts.introduced_at)}.`,
    );
  } else if (facts.level === "steward") {
    lines.push("One of the founding stewards.");
  }
  if (facts.completed_exchanges > 0) {
    lines.push(
      `${plural(facts.completed_exchanges, "exchange", "exchanges")} with ${plural(facts.exchange_partners, "member", "members")} since ${monthYear(facts.joined_at)}.`,
    );
  }
  return lines;
}

export interface KnownProgressFacts {
  days_member: number;
  completed_exchanges: number;
  exchange_partners: number;
  vouches: number;
}

/** A member's own checklist toward Known. Open concerns are never shown here. */
export function knownChecklist(progress: KnownProgressFacts) {
  return [
    {
      label: `A member for ${KNOWN_RULES.days} days`,
      done: progress.days_member >= KNOWN_RULES.days,
    },
    {
      label: `${KNOWN_RULES.exchanges} finished exchanges`,
      done: progress.completed_exchanges >= KNOWN_RULES.exchanges,
    },
    {
      label: `With at least ${KNOWN_RULES.partners} different people`,
      done: progress.exchange_partners >= KNOWN_RULES.partners,
    },
    {
      label: `${KNOWN_RULES.vouches} vouches from Known neighbors or stewards`,
      done: progress.vouches >= KNOWN_RULES.vouches,
    },
  ];
}
