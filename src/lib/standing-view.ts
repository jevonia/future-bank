import type { AppState, Gathering, MemberStanding, Vouch } from "./types";
import { standingLines, type StandingLevel } from "./standing";

type StandingState = Pick<
  AppState,
  "members" | "standings" | "vouches" | "gatherings" | "pauses"
>;

/** Lookups the dashboard needs to describe any member in plain words. */
export function buildStandingIndex(state: StandingState, now = new Date()) {
  const names = new Map(
    state.members.map((member) => [member.id, member.username?.trim() || "A member"]),
  );
  const standings = new Map(state.standings.map((item) => [item.user_id, item]));
  const paused = new Map(state.pauses.map((item) => [item.member_id, item]));
  const upcoming = state.gatherings
    .filter((item) => new Date(item.starts_at).getTime() > now.getTime())
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const nextGathering: Gathering | null = upcoming[0] ?? null;
  const name = (id: string | null | undefined) =>
    (id && names.get(id)) || "A member";
  const standingOf = (id: string): MemberStanding | undefined => standings.get(id);
  const levelOf = (id: string): StandingLevel => standings.get(id)?.level ?? "new";
  const vouchesFor = (id: string): Vouch[] =>
    state.vouches.filter((item) => item.member_id === id);
  const linesFor = (id: string) => {
    const facts = standings.get(id);
    if (!facts) return [];
    return standingLines(
      {
        ...facts,
        introduced_by_name: facts.introduced_by ? name(facts.introduced_by) : null,
      },
      { now, nextGathering },
    );
  };
  return { name, standingOf, levelOf, vouchesFor, linesFor, paused, upcoming, nextGathering };
}

export type StandingIndex = ReturnType<typeof buildStandingIndex>;
