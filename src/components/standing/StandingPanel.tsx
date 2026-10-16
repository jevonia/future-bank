"use client";

import Link from "next/link";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import type { AppState } from "@/lib/types";
import { gatheringTime, knownChecklist, monthYear, shortDate } from "@/lib/standing";
import type { StandingIndex } from "@/lib/standing-view";
import { StandingBadge } from "./StandingBadge";
import { LevelMeaning, eventLabel, type StandingDialog } from "./StandingDialogs";

const concernStatus = {
  open: "Waiting for a steward",
  responded: "A steward replied",
  closed: "Closed",
} as const;

/** "Your standing": where you are, what it means, and the next step. */
export function YourStanding({
  state,
  index,
  currentUserId,
}: {
  state: AppState;
  index: StandingIndex;
  currentUserId: string;
}) {
  const level = index.levelOf(currentUserId);
  const own = index.standingOf(currentUserId);
  const pause = index.paused.get(currentUserId);
  const lines = index.linesFor(currentUserId);
  const vouches = index.vouchesFor(currentUserId);
  const myConcerns = state.concerns.filter((item) => item.reporter_id === currentUserId);
  const record = state.standingEvents.filter((item) => item.member_id === currentUserId);
  const next = index.nextGathering;

  return (
    <DashboardCard title="Your standing" eyebrow="How well the community knows you" id="your-standing" className="scroll-mt-28">
      {pause && (
        <div role="status" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">A steward has asked to talk with you before your next exchange.</p>
          <p className="mt-1">
            Please reach out to {index.name(pause.paused_by)}. They wrote: “{pause.reason}”
          </p>
          <p className="mt-1">
            Until you talk, you can&apos;t start or accept new exchanges. Exchanges already under way can still be finished.
          </p>
        </div>
      )}
      <StandingBadge level={level} long className="text-sm" />
      {lines.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <LevelMeaning level={level} />
      </div>
      <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
        {level === "new" && (
          <>
            <p className="font-bold">Next step: come to a gathering.</p>
            <p className="mt-1">
              A steward will check you in, and you&apos;ll be Introduced.{" "}
              {next
                ? "If getting there is hard, a steward can meet you one to one instead."
                : "No gathering is planned yet. A steward can also meet you one to one."}
            </p>
          </>
        )}
        {level === "introduced" && state.knownProgress && (
          <>
            <p className="font-bold">On the way to Known</p>
            <ul className="mt-2 space-y-1">
              {knownChecklist(state.knownProgress).map((item) => (
                <li key={item.label} className="flex gap-2">
                  <span aria-hidden="true">{item.done ? "✓" : "○"}</span>
                  <span>
                    {item.label}
                    <span className="sr-only">{item.done ? ", done" : ", not yet"}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2">When these are done, a steward looks it over and decides.</p>
          </>
        )}
        {level === "known" && (
          <p>
            You can vouch for neighbors you have met or traded hours with. Open
            someone&apos;s name to write a few words about them.
          </p>
        )}
        {level === "steward" && (
          <p>
            Thank you for being a steward.
            {own?.steward_renew_by &&
              ` Your steward year runs until ${shortDate(`${own.steward_renew_by}T12:00:00Z`)}. Another steward renews it.`}
          </p>
        )}
      </div>
      {vouches.length > 0 && (
        <section className="mt-4" aria-label="What neighbors wrote about you">
          <h3 className="text-base font-bold">What neighbors wrote about you</h3>
          <ul className="mt-2 space-y-2">
            {vouches.map((item) => (
              <li key={item.id} className="rounded-xl border border-mint bg-mint/30 p-3 text-sm leading-6">
                “{item.sentence}”
                <span className="mt-1 block text-xs text-slate-600">
                  From {index.name(item.voucher_id)}, {monthYear(item.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {myConcerns.length > 0 && (
        <section className="mt-4" aria-label="Concerns you raised">
          <h3 className="text-base font-bold">Concerns you raised</h3>
          <p className="text-xs text-slate-600">Only you and the stewards see these.</p>
          <ul className="mt-2 space-y-2">
            {myConcerns.map((item) => (
              <li key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm leading-6">
                <p className="font-semibold">
                  {shortDate(item.created_at)}
                  {item.about_id ? `, about ${index.name(item.about_id)}` : ""}: {concernStatus[item.status]}
                </p>
                {item.response && (
                  <p className="mt-1">
                    {index.name(item.responded_by)} wrote: {item.response}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
        {record.length > 0 ? (
          <details>
            <summary className="cursor-pointer font-bold text-slate-700">Your standing record</summary>
            <ul className="mt-2 space-y-1 text-slate-700">
              {record.map((item) => (
                <li key={item.id}>
                  {shortDate(item.created_at)}: {eventLabel(item.kind, item.to_level)} by{" "}
                  {item.changed_by ? index.name(item.changed_by) : "the coordinator"}. {item.reason}
                </li>
              ))}
            </ul>
          </details>
        ) : (
          <span className="text-slate-600">Every change to your standing will be listed here with who made it and why.</span>
        )}
        <Link href="/standing" className="font-bold text-violet-800 underline">
          How standing works
        </Link>
      </div>
    </DashboardCard>
  );
}

const small = "rounded-full px-3.5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";

/** Upcoming gatherings for everyone; check-in controls for stewards. */
export function Gatherings({
  state,
  index,
  currentUserId,
  onDialog,
  now = new Date(),
}: {
  state: AppState;
  index: StandingIndex;
  currentUserId: string;
  onDialog: (dialog: StandingDialog) => void;
  now?: Date;
}) {
  const mine = new Map(
    state.checkins.filter((item) => item.member_id === currentUserId).map((item) => [item.gathering_id, item]),
  );
  const soon = now.getTime() + 12 * 3_600_000;
  const recentPast = state.gatherings.filter((item) => {
    const start = new Date(item.starts_at).getTime();
    return start <= now.getTime() && start >= now.getTime() - 30 * 86_400_000;
  });
  const attended = state.gatherings.filter((item) => mine.has(item.id));
  const list = [...index.upcoming, ...recentPast.filter((item) => !index.upcoming.includes(item))];

  return (
    <DashboardCard
      title="Gatherings"
      eyebrow="Meet neighbors in person"
      onAdd={state.isSteward ? () => onDialog({ kind: "gathering" }) : undefined}
      addLabel="Plan a gathering"
    >
      <p className="-mt-2 mb-4 text-sm leading-6 text-slate-600">
        Gatherings have a job to do, like a repair day or a cooking afternoon.
        A steward checks people in, which is how New members become Introduced.
      </p>
      {list.length ? (
        <ul className="space-y-3">
          {list.map((item) => {
            const start = new Date(item.starts_at).getTime();
            const past = start <= now.getTime();
            const count = state.checkins.filter((entry) => entry.gathering_id === item.id).length;
            return (
              <li key={item.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  {past ? "Earlier" : "Coming up"}
                </p>
                <h3 className="mt-1 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{gatheringTime(item.starts_at)}</p>
                <p className="text-sm text-slate-700">{item.location}</p>
                <p className="mt-1 text-xs text-slate-500">Hosted by {index.name(item.host_id)}</p>
                {mine.has(item.id) && (
                  <p className="mt-2 text-sm font-semibold text-leaf-deep">You were checked in.</p>
                )}
                {state.isSteward && start <= soon && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      className={`${small} bg-teal-700 text-white`}
                      onClick={() => onDialog({ kind: "check-in", gatheringId: item.id })}
                    >
                      Check people in
                    </button>
                    <span className="text-xs text-slate-600">{count} checked in</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-7 text-center text-sm leading-6 text-slate-500">
          No gatherings are planned yet. Stewards post them here.
        </p>
      )}
      {attended.length > 0 && (
        <section className="mt-4 border-t border-slate-100 pt-3 text-sm" aria-label="Your attendance">
          <h3 className="font-bold">Your attendance</h3>
          <p className="text-xs text-slate-600">Only you and the stewards see this.</p>
          <ul className="mt-1 space-y-1 text-slate-700">
            {attended.map((item) => (
              <li key={item.id}>
                {item.title}, {shortDate(item.starts_at)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </DashboardCard>
  );
}
