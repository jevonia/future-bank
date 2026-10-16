"use client";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import type { AppState } from "@/lib/types";
import { HOME_ANSWER_LABELS, STEWARD_WAIT_DAYS, shortDate } from "@/lib/standing";
import type { StandingIndex } from "@/lib/standing-view";
import { StandingBadge } from "./StandingBadge";
import type { StandingDialog } from "./StandingDialogs";

const small = "rounded-full px-3 py-1.5 text-xs font-bold transition";
const DAY = 86_400_000;

function Block({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 p-4" aria-label={title}>
      <h3 className="font-bold">{title}</h3>
      {children.length ? (
        <ul className="mt-2 space-y-2 text-sm leading-6">{children}</ul>
      ) : (
        <p className="mt-1 text-sm text-slate-500">{empty}</p>
      )}
    </section>
  );
}

/** Everything a steward follows up on. Members never see this card. */
export function StewardDesk({
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
  const steward = state.steward;
  if (!steward) return null;
  const open = (memberId: string) => () => onDialog({ kind: "neighbor", memberId });
  const concerns = state.concerns.filter(
    (item) => item.status !== "closed" && item.reporter_id !== currentUserId,
  );
  const lookAt = steward.vouchDetails.filter(
    (item) => item.mutual_same_day || item.home_answer !== "yes",
  );
  const nominees = [...new Set(steward.nominations.map((item) => item.member_id))];
  const renewals = state.standings.filter(
    (item) =>
      item.level === "steward" &&
      item.steward_renew_by &&
      new Date(item.steward_renew_by).getTime() - now.getTime() < 60 * DAY,
  );
  const members = [...state.members].sort((a, b) => index.name(a.id).localeCompare(index.name(b.id)));

  return (
    <DashboardCard title="Steward desk" eyebrow="Only stewards see this" id="steward-desk" className="scroll-mt-28">
      <p className="-mt-2 mb-4 text-sm leading-6 text-slate-600">
        Write back to every concern within two days, even just to say what
        happens next. Start with a conversation. Removal needs the coordinator
        and one other steward.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Block title="Concerns" empty="No open concerns.">
          {concerns.map((item) => {
            const late = !item.responded_at && now.getTime() - new Date(item.created_at).getTime() > 2 * DAY;
            return (
              <li key={item.id} className="rounded-lg bg-slate-50 p-3">
                <p>
                  From {index.name(item.reporter_id)}
                  {item.about_id ? ` about ${index.name(item.about_id)}` : ""}, {shortDate(item.created_at)}.{" "}
                  <span className="font-semibold">{item.status === "open" ? "No reply yet." : "Replied."}</span>
                </p>
                {late && <p className="font-bold text-tomato-deep">Waiting more than two days.</p>}
                <button className={`${small} mt-2 bg-violet-700 text-white`} onClick={() => onDialog({ kind: "respond", concernId: item.id })}>
                  Read and answer
                </button>
              </li>
            );
          })}
        </Block>
        <Block title="Calls and private notes" empty="No call requests or notes.">
          {steward.safetyFeed.map((item) => (
            <li key={`${item.kind}-${item.exchange_id}-${item.member_id}-${item.created_at}`} className={`rounded-lg p-3 ${item.kind === "call_me" ? "bg-amber-50" : "bg-slate-50"}`}>
              <p className="font-semibold">
                {item.kind === "call_me"
                  ? `${index.name(item.member_id)} asked a steward to call them`
                  : `Note from ${index.name(item.member_id)}`}
              </p>
              <p>
                Exchange “{item.title}” with {index.name(item.other_id)}, {shortDate(item.created_at)}.
              </p>
              {item.body && <p className="mt-1 whitespace-pre-line">{item.body}</p>}
            </li>
          ))}
        </Block>
        <Block title="Ready to confirm as Known" empty="Nobody meets every Known condition right now.">
          {steward.knownSuggestions.map((item) => (
            <li key={item.member_id} className="rounded-lg bg-mint/40 p-3">
              <p className="font-semibold">{index.name(item.member_id)}</p>
              <p>
                {item.completed_exchanges} exchanges with {item.exchange_partners} members, {item.vouches} vouches, a member for {item.days_member} days.
              </p>
              {item.vouchers_connected && (
                <p className="text-amber-900">Some of their vouchers know each other, so the vouches count for less.</p>
              )}
              <button className={`${small} mt-2 border border-slate-300 bg-white`} onClick={open(item.member_id)}>
                Open
              </button>
            </li>
          ))}
        </Block>
        <Block title="Vouches to look at" empty="Nothing unusual.">
          {lookAt.map((item) => (
            <li key={item.id} className="rounded-lg bg-slate-50 p-3">
              {index.name(item.voucher_id)} vouched for {index.name(item.member_id)}.{" "}
              Comfortable in their home: {HOME_ANSWER_LABELS[item.home_answer]}.
              {item.mutual_same_day && " They vouched for each other on the same day."}
            </li>
          ))}
        </Block>
        <Block title="Steward nominations" empty="No open nominations.">
          {nominees.map((memberId) => {
            const list = steward.nominations
              .filter((item) => item.member_id === memberId)
              .sort((a, b) => a.created_at.localeCompare(b.created_at));
            const waitEnds = list[1] ? new Date(new Date(list[1].created_at).getTime() + STEWARD_WAIT_DAYS * DAY) : null;
            return (
              <li key={memberId} className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold">{index.name(memberId)}</p>
                <p>
                  Nominated by {list.map((item) => index.name(item.nominated_by)).join(" and ")}.{" "}
                  {waitEnds ? `The waiting period ends ${shortDate(waitEnds)}.` : "Needs a second nomination."}
                </p>
                <button className={`${small} mt-2 border border-slate-300 bg-white`} onClick={open(memberId)}>
                  Open
                </button>
              </li>
            );
          })}
        </Block>
        <Block title="Paused and renewals" empty="Nobody is paused and no steward year ends soon.">
          {[
            ...state.pauses.map((item) => (
              <li key={`pause-${item.member_id}`} className="rounded-lg bg-amber-50 p-3">
                <p className="font-semibold">{index.name(item.member_id)} is paused</p>
                <p>
                  By {index.name(item.paused_by)}, {shortDate(item.paused_at)}: {item.reason}
                </p>
                <button className={`${small} mt-2 border border-slate-300 bg-white`} onClick={open(item.member_id)}>
                  Open
                </button>
              </li>
            )),
            ...renewals.map((item) => (
              <li key={`renew-${item.user_id}`} className="rounded-lg bg-sun-soft/60 p-3">
                {index.name(item.user_id)}&apos;s steward year ends {shortDate(`${item.steward_renew_by}T12:00:00Z`)}.
                {item.user_id !== currentUserId && (
                  <button className={`${small} ml-2 border border-slate-300 bg-white`} onClick={open(item.user_id)}>
                    Open
                  </button>
                )}
              </li>
            )),
          ]}
        </Block>
      </div>
      <details className="mt-4 rounded-xl border border-slate-200 p-4">
        <summary className="cursor-pointer font-bold">All members ({members.length})</summary>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <li key={member.id}>
              <button
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={open(member.id)}
              >
                <span className="truncate font-semibold">{index.name(member.id)}</span>
                <StandingBadge level={index.levelOf(member.id)} />
              </button>
            </li>
          ))}
        </ul>
      </details>
    </DashboardCard>
  );
}
