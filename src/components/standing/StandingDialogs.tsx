"use client";

import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import type { CommunityAction } from "@/lib/community-api";
import type { AppState } from "@/lib/types";
import {
  HOME_ANSWER_LABELS,
  LEVEL_INFO,
  NOT_A_PROMISE,
  VOUCH_BASIS_LABELS,
  monthYear,
  shortDate,
} from "@/lib/standing";
import type { StandingIndex } from "@/lib/standing-view";
import { StandingBadge } from "./StandingBadge";

export type StewardAction =
  | "introduced"
  | "known"
  | "steward"
  | "nominate"
  | "renew"
  | "pause"
  | "unpause";

export type StandingDialog =
  | { kind: "neighbor"; memberId: string }
  | { kind: "concern"; aboutId: string | null; exchangeId: number | null }
  | { kind: "vouch"; memberId: string }
  | { kind: "gathering" }
  | { kind: "check-in"; gatheringId: number }
  | { kind: "steward"; memberId: string; action: StewardAction; concernId?: number }
  | { kind: "respond"; concernId: number };

type Act = (
  action: CommunityAction,
  payload: Record<string, unknown>,
  key?: string,
) => Promise<boolean>;

interface Props {
  dialog: StandingDialog | null;
  setDialog: (dialog: StandingDialog | null) => void;
  state: AppState;
  index: StandingIndex;
  currentUserId: string;
  act: Act;
  busy: string;
  actionError: string;
}

const small = "rounded-full px-3.5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";

function ErrorLine({ message }: { message: string }) {
  return message ? (
    <p role="alert" className="form-error">
      {message}
    </p>
  ) : null;
}

function Actions({
  onCancel,
  submit,
  busy,
}: {
  onCancel: () => void;
  submit: string;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-3 pt-2">
      <button className="button-secondary" type="button" onClick={onCancel}>
        Cancel
      </button>
      <button className="button-primary" type="submit" disabled={busy}>
        {busy ? "Saving…" : submit}
      </button>
    </div>
  );
}

/** What a level means and does not mean, shown wherever a level appears. */
export function LevelMeaning({ level }: { level: keyof typeof LEVEL_INFO }) {
  const info = LEVEL_INFO[level];
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
      <p>
        <strong>What it means:</strong> {info.means}
      </p>
      <p className="mt-1">
        <strong>What it does not mean:</strong> {info.doesNotMean}
      </p>
      <p className="mt-1 text-slate-600">
        {NOT_A_PROMISE}{" "}
        <Link href="/standing" className="font-bold text-violet-800 underline">
          How standing works
        </Link>
      </p>
    </div>
  );
}

function NeighborDialog({ memberId, ...props }: Props & { memberId: string }) {
  const { state, index, currentUserId, setDialog, act, busy } = props;
  const name = index.name(memberId);
  const level = index.levelOf(memberId);
  const lines = index.linesFor(memberId);
  const vouches = index.vouchesFor(memberId);
  const self = memberId === currentUserId;
  const viewerLevel = index.levelOf(currentUserId);
  const canVouch =
    !self &&
    (viewerLevel === "known" || viewerLevel === "steward") &&
    !index.paused.has(currentUserId);
  const myVouch = vouches.find((item) => item.voucher_id === currentUserId);
  const pause = index.paused.get(memberId);
  const steward = state.steward;
  const ready = steward?.knownSuggestions.some((item) => item.member_id === memberId);
  const nominatedByMe = steward?.nominations.some(
    (item) => item.member_id === memberId && item.nominated_by === currentUserId,
  );
  const nominations = steward?.nominations.filter((item) => item.member_id === memberId).length ?? 0;
  const history = state.standingEvents.filter((item) => item.member_id === memberId);
  const stewardActions: [StewardAction, string, boolean][] =
    state.isSteward && !self
      ? [
          ["introduced", "Mark Introduced (met one to one)", level === "new" && !pause],
          ["known", "Confirm Known", level === "introduced" && !!ready],
          ["nominate", "Nominate as steward", level === "known" && !pause && !nominatedByMe],
          ["steward", "Make steward", level === "known" && !pause && nominations >= 2],
          ["renew", "Renew for another year", level === "steward"],
          [pause ? "unpause" : "pause", pause ? "Lift the pause" : "Pause standing", true],
        ]
      : [];

  return (
    <Dialog isOpen onClose={() => setDialog(null)} title={name}>
      <div className="space-y-4">
        <div>
          <StandingBadge level={level} long />
          {lines.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
              {lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
        <LevelMeaning level={level} />
        {vouches.length > 0 && (
          <section aria-label="Vouches">
            <h3 className="text-base font-bold">Vouched for by</h3>
            <ul className="mt-2 space-y-2">
              {vouches.map((item) => (
                <li key={item.id} className="rounded-xl border border-mint bg-mint/30 p-3 text-sm leading-6">
                  <p>“{item.sentence}”</p>
                  <p className="mt-1 text-xs text-slate-600">
                    From {index.name(item.voucher_id)}, {monthYear(item.created_at)}.{" "}
                    {VOUCH_BASIS_LABELS[item.basis]}.
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
        {!self && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {canVouch &&
              (myVouch ? (
                <button
                  className={`${small} border border-slate-200 text-slate-700`}
                  disabled={!!busy}
                  onClick={async () => {
                    if (await act("withdraw_vouch", { member_id: memberId }, "withdraw")) setDialog(null);
                  }}
                >
                  Take back your vouch
                </button>
              ) : (
                <button
                  className={`${small} bg-leaf-deep text-white`}
                  onClick={() => setDialog({ kind: "vouch", memberId })}
                >
                  Vouch for {name}
                </button>
              ))}
            <button
              className={`${small} bg-slate-100 text-slate-800`}
              onClick={() => setDialog({ kind: "concern", aboutId: memberId, exchangeId: null })}
            >
              Tell a steward about a concern
            </button>
          </div>
        )}
        {stewardActions.length > 0 && (
          <section className="rounded-xl border border-sun bg-sun-soft/60 p-3" aria-label="Steward tools">
            <h3 className="text-base font-bold">Steward tools</h3>
            {pause && (
              <p className="mt-1 text-sm leading-6 text-slate-800">
                Paused by {index.name(pause.paused_by)} on{" "}
                {shortDate(pause.paused_at)}: {pause.reason}
              </p>
            )}
            {level === "introduced" && !ready && (
              <p className="mt-1 text-sm text-slate-700">Not every Known condition is met yet.</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {stewardActions
                .filter(([, , show]) => show)
                .map(([action, label]) => (
                  <button
                    key={action}
                    className={`${small} border border-slate-300 bg-white text-slate-800`}
                    onClick={() => setDialog({ kind: "steward", memberId, action })}
                  >
                    {label}
                  </button>
                ))}
            </div>
            {history.length > 0 && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-bold">Standing record</summary>
                <ul className="mt-2 space-y-1 text-slate-700">
                  {history.map((item) => (
                    <li key={item.id}>
                      {shortDate(item.created_at)}: {eventLabel(item.kind, item.to_level)} by{" "}
                      {item.changed_by ? index.name(item.changed_by) : "the coordinator"}. {item.reason}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}
      </div>
    </Dialog>
  );
}

export function eventLabel(kind: string, toLevel: string | null) {
  if (kind === "pause") return "Paused";
  if (kind === "unpause") return "Pause lifted";
  if (kind === "renewal") return "Steward year renewed";
  const info = LEVEL_INFO[toLevel as keyof typeof LEVEL_INFO];
  return info ? `Became ${info.name}` : "Changed";
}

function ConcernDialog({
  aboutId,
  exchangeId,
  ...props
}: Props & { aboutId: string | null; exchangeId: number | null }) {
  const { state, index, currentUserId, setDialog, act, busy, actionError } = props;
  const [body, setBody] = useState("");
  const [shareName, setShareName] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const exchange = state.exchanges.find((item) => item.id === exchangeId);
  const otherId =
    aboutId ||
    (exchange
      ? exchange.provider_id === currentUserId
        ? exchange.requester_id
        : exchange.provider_id
      : null);
  const otherName = otherId ? index.name(otherId) : "the other member";

  return (
    <Dialog
      isOpen
      onClose={() => setDialog(null)}
      title="Tell a steward about a concern"
      description="This goes to the stewards, never to a public page. A steward will write back to you within two days."
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (shareName === null) {
            setError("Please choose whether your name may be shared.");
            return;
          }
          setError("");
          const done = await act(
            "raise_concern",
            { about_id: aboutId, exchange_id: exchangeId, body: body.trim(), share_name: shareName },
            "concern",
          );
          if (done) setDialog(null);
        }}
      >
        <p className="text-sm text-slate-700">
          {exchange ? (
            <>
              About your exchange <strong>{exchange.title}</strong> with {otherName}.
            </>
          ) : (
            <>About {otherName}.</>
          )}
        </p>
        <label className="form-label">
          What happened, and what did the person do?
          <textarea
            className="form-input min-h-32"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            minLength={10}
            maxLength={4000}
            required
          />
          <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-600">
            Say what was said or done, and when. Please don&apos;t describe what
            anyone looks like.
          </span>
        </label>
        <fieldset>
          <legend className="form-label">May a steward tell {otherName} that you raised this?</legend>
          <div className="mt-2 grid gap-2">
            {[
              [true, "Yes, you can share my name"],
              [false, "No, keep my name private"],
            ].map(([value, label]) => (
              <label key={String(value)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <input
                  type="radio"
                  name="share-name"
                  checked={shareName === value}
                  onChange={() => setShareName(value as boolean)}
                />
                {label as string}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          If you are in danger right now, call 911. Stewards are neighbors, not
          an emergency service.
        </p>
        <ErrorLine message={error || actionError} />
        <Actions onCancel={() => setDialog(null)} submit="Send to the stewards" busy={busy === "concern"} />
      </form>
    </Dialog>
  );
}

function VouchDialog({ memberId, ...props }: Props & { memberId: string }) {
  const { index, setDialog, act, busy, actionError } = props;
  const name = index.name(memberId);
  const [sentence, setSentence] = useState("");
  const [basis, setBasis] = useState<"met" | "exchange" | "">("");
  const [home, setHome] = useState<"yes" | "no" | "not_sure" | "">("");
  const [notHousehold, setNotHousehold] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      isOpen
      onClose={() => setDialog(null)}
      title={`Vouch for ${name}`}
      description="A vouch is your word about someone you know. It is not a promise from the bank."
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!basis || !home) {
            setError("Please answer every question.");
            return;
          }
          setError("");
          const done = await act(
            "vouch",
            { member_id: memberId, sentence: sentence.trim(), basis, home_answer: home, not_household: notHousehold },
            "vouch",
          );
          if (done) setDialog(null);
        }}
      >
        <label className="form-label">
          One sentence about how you know {name}
          <textarea
            className="form-input min-h-24"
            value={sentence}
            onChange={(event) => setSentence(event.target.value)}
            minLength={10}
            maxLength={300}
            placeholder="I know Rosa from the repair day. She fixed my screen door."
            required
          />
          <span className="mt-1.5 block text-xs font-normal text-slate-600">
            Members will see this sentence with your name.
          </span>
        </label>
        <fieldset>
          <legend className="form-label">How do you know them?</legend>
          <div className="mt-2 grid gap-2">
            {(["met", "exchange"] as const).map((value) => (
              <label key={value} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <input type="radio" name="basis" checked={basis === value} onChange={() => setBasis(value)} />
                {VOUCH_BASIS_LABELS[value]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="form-label">Would you be comfortable with {name} in your home?</legend>
          <p className="text-xs text-slate-600">Only stewards see this answer.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["yes", "no", "not_sure"] as const).map((value) => (
              <label key={value} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <input type="radio" name="home" checked={home === value} onChange={() => setHome(value)} />
                {HOME_ANSWER_LABELS[value]}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={notHousehold}
            onChange={(event) => setNotHousehold(event.target.checked)}
            required
          />
          {name} and I don&apos;t live in the same household.
        </label>
        <ErrorLine message={error || actionError} />
        <Actions onCancel={() => setDialog(null)} submit="Vouch" busy={busy === "vouch"} />
      </form>
    </Dialog>
  );
}

function GatheringDialog(props: Props) {
  const { setDialog, act, busy, actionError } = props;
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [location, setLocation] = useState("");
  return (
    <Dialog
      isOpen
      onClose={() => setDialog(null)}
      title="Plan a gathering"
      description="A gathering with a job to do, like a repair day or a cooking afternoon. Members get a notice, and the place shows only to signed-in members."
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const done = await act(
            "create_gathering",
            { title: title.trim(), starts_at: new Date(when).toISOString(), location: location.trim() },
            "gathering",
          );
          if (done) setDialog(null);
        }}
      >
        <label className="form-label">
          Name
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} minLength={3} maxLength={120} placeholder="November repair day" required />
        </label>
        <label className="form-label">
          Date and time
          <input className="form-input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} required />
          <span className="mt-1.5 block text-xs font-normal text-slate-600">
            You can enter a past date to record a gathering that used a paper sign-in sheet.
          </span>
        </label>
        <label className="form-label">
          Place
          <input className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} minLength={3} maxLength={300} placeholder="Grace church hall, side door on Elm Street" required />
        </label>
        <ErrorLine message={actionError} />
        <Actions onCancel={() => setDialog(null)} submit="Post gathering" busy={busy === "gathering"} />
      </form>
    </Dialog>
  );
}

function CheckInDialog({ gatheringId, ...props }: Props & { gatheringId: number }) {
  const { state, index, currentUserId, setDialog, act, busy, actionError } = props;
  const gathering = state.gatherings.find((item) => item.id === gatheringId);
  const checkedIn = new Set(
    state.checkins.filter((item) => item.gathering_id === gatheringId).map((item) => item.member_id),
  );
  const choices = state.members
    .filter((member) => member.id !== currentUserId && !checkedIn.has(member.id))
    .sort((a, b) => index.name(a.id).localeCompare(index.name(b.id)));
  const [memberId, setMemberId] = useState("");
  if (!gathering) return null;
  return (
    <Dialog
      isOpen
      onClose={() => setDialog(null)}
      title={`Check people in: ${gathering.title}`}
      description="Check someone in only after you have met them here in person and they are who their profile says. A New member becomes Introduced."
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (await act("check_in", { gathering_id: gatheringId, member_id: memberId }, "check-in")) setMemberId("");
        }}
      >
        <label className="form-label">
          Member
          <select className="form-input" value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
            <option value="">Choose a member</option>
            {choices.map((member) => (
              <option key={member.id} value={member.id}>
                {index.name(member.id)} ({LEVEL_INFO[index.levelOf(member.id)].name})
              </option>
            ))}
          </select>
        </label>
        <ErrorLine message={actionError} />
        <Actions onCancel={() => setDialog(null)} submit="Check in" busy={busy === "check-in"} />
      </form>
      <section className="mt-5 border-t border-slate-100 pt-4">
        <h3 className="text-base font-bold">Checked in ({checkedIn.size})</h3>
        {checkedIn.size ? (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {[...checkedIn].map((id) => (
              <li key={id} className="rounded-full bg-slate-100 px-3 py-1">
                {index.name(id)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-slate-600">Nobody yet.</p>
        )}
      </section>
    </Dialog>
  );
}

const stewardCopy: Record<
  StewardAction,
  { title: (name: string) => string; label: string; hint: string; submit: string }
> = {
  introduced: {
    title: (name) => `Mark ${name} as Introduced`,
    label: "Where and how did you meet them?",
    hint: "Use this when you met one to one, like coffee, a porch visit, or a video call. Checking someone in at a gathering does this for you.",
    submit: "Mark Introduced",
  },
  known: {
    title: (name) => `Confirm ${name} as a Known neighbor`,
    label: "Why are you confirming this?",
    hint: "The site found that the conditions are met. You still decide. Read their vouches first.",
    submit: "Confirm Known",
  },
  steward: {
    title: (name) => `Make ${name} a steward`,
    label: "What did you talk about, and did they agree to the steward commitments?",
    hint: "This needs nominations from two stewards, a two-week wait, and no open concern.",
    submit: "Make steward",
  },
  nominate: {
    title: (name) => `Nominate ${name} as a steward`,
    label: "Why would they be a good steward?",
    hint: "When a second steward nominates them, every member is told and has two weeks to raise a concern in private.",
    submit: "Nominate",
  },
  renew: {
    title: (name) => `Renew ${name} as a steward for another year`,
    label: "What did the stewards decide?",
    hint: "Renewal is recorded by hand. Nobody loses the role automatically.",
    submit: "Renew",
  },
  pause: {
    title: (name) => `Pause ${name}'s standing`,
    label: "What do you want to talk with them about?",
    hint: "They will be told a steward wants to talk before their next exchange, with your name. Until the pause is lifted they cannot start new exchanges.",
    submit: "Pause standing",
  },
  unpause: {
    title: (name) => `Lift the pause on ${name}'s standing`,
    label: "What was decided?",
    hint: "They will be told the pause is lifted. Nothing shows on their profile.",
    submit: "Lift pause",
  },
};

function StewardActionDialog({
  memberId,
  action,
  concernId,
  ...props
}: Props & { memberId: string; action: StewardAction; concernId?: number }) {
  const { index, setDialog, act, busy, actionError } = props;
  const copy = stewardCopy[action];
  const name = index.name(memberId);
  const [reason, setReason] = useState("");
  return (
    <Dialog isOpen onClose={() => setDialog(null)} title={copy.title(name)} description={copy.hint}>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const payload = { member_id: memberId, reason: reason.trim() };
          const [rpc, extra]: [CommunityAction, Record<string, unknown>] =
            action === "nominate"
              ? ["nominate_steward", {}]
              : action === "renew"
                ? ["renew_steward", {}]
                : action === "pause"
                  ? ["pause_standing", { concern_id: concernId ?? null }]
                  : action === "unpause"
                    ? ["unpause_standing", {}]
                    : ["set_standing", { level: action }];
          if (await act(rpc, { ...payload, ...extra }, "steward-action")) setDialog(null);
        }}
      >
        <label className="form-label">
          {copy.label}
          <textarea
            className="form-input min-h-24"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            minLength={3}
            maxLength={500}
            required
          />
          <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-600">
            {name} can read this in their standing record. Don&apos;t include the
            name of anyone who asked to stay private.
          </span>
        </label>
        <ErrorLine message={actionError} />
        <Actions onCancel={() => setDialog(null)} submit={copy.submit} busy={busy === "steward-action"} />
      </form>
    </Dialog>
  );
}

function RespondDialog({ concernId, ...props }: Props & { concernId: number }) {
  const { state, index, setDialog, act, busy, actionError } = props;
  const concern = state.concerns.find((item) => item.id === concernId);
  const notes = state.steward?.concernNotes.filter((item) => item.concern_id === concernId) ?? [];
  const [response, setResponse] = useState("");
  const [note, setNote] = useState("");
  const [close, setClose] = useState(false);
  if (!concern) return null;
  const about = concern.about_id ? index.name(concern.about_id) : null;
  return (
    <Dialog isOpen onClose={() => setDialog(null)} title="Answer a concern">
      <div className="space-y-3 text-sm leading-6">
        <p>
          From <strong>{index.name(concern.reporter_id)}</strong>
          {about && (
            <>
              {" "}about <strong>{about}</strong>
            </>
          )}
          , {shortDate(concern.created_at)}.{" "}
          {concern.share_name
            ? "You may tell the other member who raised it."
            : "Keep the reporter's name private."}
        </p>
        <blockquote className="whitespace-pre-line rounded-xl bg-slate-50 p-3">{concern.body}</blockquote>
        {concern.response && (
          <p>
            <strong>Reply sent by {index.name(concern.responded_by)}:</strong> {concern.response}
          </p>
        )}
        {notes.length > 0 && (
          <div>
            <p className="font-bold">Steward notes</p>
            <ul className="mt-1 space-y-1">
              {notes.map((item) => (
                <li key={item.id} className="rounded-lg bg-sun-soft/60 px-3 py-2">
                  {index.name(item.steward_id)}, {shortDate(item.created_at)}: {item.body}
                </li>
              ))}
            </ul>
          </div>
        )}
        {concern.about_id && (
          <button
            type="button"
            className={`${small} border border-slate-300 text-slate-800`}
            onClick={() =>
              setDialog(
                index.paused.has(concern.about_id!)
                  ? { kind: "neighbor", memberId: concern.about_id! }
                  : { kind: "steward", memberId: concern.about_id!, action: "pause", concernId },
              )
            }
          >
            {index.paused.has(concern.about_id) ? `${about}'s standing is paused` : `Pause ${about}'s standing`}
          </button>
        )}
      </div>
      <form
        className="mt-4 space-y-4 border-t border-slate-100 pt-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (await act("respond_concern", { id: concernId, response, note, close }, "respond")) setDialog(null);
        }}
      >
        <label className="form-label">
          Reply to {index.name(concern.reporter_id)}
          <textarea className="form-input min-h-24" value={response} onChange={(e) => setResponse(e.target.value)} maxLength={2000} />
          <span className="mt-1.5 block text-xs font-normal text-slate-600">They will see this reply.</span>
        </label>
        <label className="form-label">
          Note for stewards
          <textarea className="form-input min-h-20" value={note} onChange={(e) => setNote(e.target.value)} maxLength={4000} />
          <span className="mt-1.5 block text-xs font-normal text-slate-600">Only stewards see notes.</span>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={close} onChange={(e) => setClose(e.target.checked)} />
          Close this concern
        </label>
        <ErrorLine message={actionError} />
        <Actions onCancel={() => setDialog(null)} submit="Save" busy={busy === "respond"} />
      </form>
    </Dialog>
  );
}

/** Renders whichever standing dialog is open. Each form starts fresh. */
export function StandingDialogs(props: Props) {
  const { dialog } = props;
  if (!dialog) return null;
  const key = JSON.stringify(dialog);
  switch (dialog.kind) {
    case "neighbor":
      return <NeighborDialog key={key} {...props} memberId={dialog.memberId} />;
    case "concern":
      return <ConcernDialog key={key} {...props} aboutId={dialog.aboutId} exchangeId={dialog.exchangeId} />;
    case "vouch":
      return <VouchDialog key={key} {...props} memberId={dialog.memberId} />;
    case "gathering":
      return <GatheringDialog key={key} {...props} />;
    case "check-in":
      return <CheckInDialog key={key} {...props} gatheringId={dialog.gatheringId} />;
    case "steward":
      return <StewardActionDialog key={key} {...props} memberId={dialog.memberId} action={dialog.action} concernId={dialog.concernId} />;
    case "respond":
      return <RespondDialog key={key} {...props} concernId={dialog.concernId} />;
  }
}
