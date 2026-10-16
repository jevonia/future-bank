"use client";

import { useState } from "react";
import type { CommunityAction } from "@/lib/community-api";
import type { AppState, Exchange } from "@/lib/types";
import { COMMUNITY_TIME_ZONE } from "@/lib/standing";
import { isFirstMeeting, tellAFriendText } from "@/lib/safety";

const small = "rounded-full px-3.5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";

/**
 * The first-meeting card, "Tell a friend", the check-in buttons, and the
 * private note for stewards after an exchange.
 */
export function SafetyCard({
  exchange,
  exchanges,
  currentUserId,
  otherName,
  state,
  act,
  busy,
}: {
  exchange: Exchange;
  exchanges: Exchange[];
  currentUserId: string;
  otherName: string;
  state: Pick<AppState, "firstMeetings" | "safetyCheckins" | "stewardNotes">;
  act: (action: CommunityAction, payload: Record<string, unknown>, key?: string) => Promise<boolean>;
  busy: string;
}) {
  const mine = state.firstMeetings.find(
    (item) => item.exchange_id === exchange.id && item.member_id === currentUserId,
  );
  const theirs = state.firstMeetings.find(
    (item) => item.exchange_id === exchange.id && item.member_id !== currentUserId,
  );
  const [place, setPlace] = useState(mine?.meet_place ?? "");
  const [whoKnows, setWhoKnows] = useState(mine?.who_knows ?? "");
  const [checkIn, setCheckIn] = useState(mine?.check_in_time ?? "");
  const savedNote = state.stewardNotes.find(
    (item) => item.exchange_id === exchange.id && item.member_id === currentUserId,
  );
  const [note, setNote] = useState(savedNote?.body ?? "");
  const [copied, setCopied] = useState("");
  const lastCheckin = state.safetyCheckins.find(
    (item) => item.exchange_id === exchange.id && item.member_id === currentUserId,
  );
  const live = exchange.status === "pending" || exchange.status === "accepted";
  const iConfirmed =
    exchange.provider_id === currentUserId ? exchange.provider_confirmed : exchange.requester_confirmed;
  const canNote = exchange.status === "completed" || (exchange.status === "accepted" && iConfirmed);
  const first = isFirstMeeting(exchanges, exchange);
  const friendText = tellAFriendText({
    otherName,
    title: exchange.title,
    place: place || theirs?.meet_place || "",
    checkIn,
  });

  async function share() {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text: friendText });
        return;
      }
      await navigator.clipboard.writeText(friendText);
      setCopied("Copied. Paste it into a text to a friend.");
    } catch {
      setCopied("Select the text above and copy it.");
    }
  }

  if (!live && !canNote) return null;

  return (
    <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
      {live && first && (
        <form
          className="rounded-xl border border-sky bg-haze p-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await act(
              "save_first_meeting",
              { exchange_id: exchange.id, meet_place: place.trim(), who_knows: whoKnows.trim(), check_in_time: checkIn.trim() },
              "first-meeting",
            );
          }}
        >
          <h4 className="font-bold">Meeting {otherName} for the first time</h4>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Every answer is optional. Only you and {otherName} see them.
          </p>
          <div className="mt-3 grid gap-3">
            <label className="form-label">
              Where will you meet?
              <input className="form-input" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={300} placeholder="A public place, like the library steps" />
            </label>
            <label className="form-label">
              Who knows where you&apos;ll be?
              <input className="form-input" value={whoKnows} onChange={(e) => setWhoKnows(e.target.value)} maxLength={300} placeholder="My sister" />
            </label>
            <label className="form-label">
              What time will you check in with them afterward?
              <input className="form-input" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} maxLength={120} placeholder="By 4 p.m." />
            </label>
          </div>
          {theirs && (theirs.meet_place || theirs.who_knows || theirs.check_in_time) && (
            <p className="mt-3 rounded-lg bg-white p-2 text-sm leading-6">
              <strong>{otherName} wrote:</strong>{" "}
              {[
                theirs.meet_place && `meet at ${theirs.meet_place}`,
                theirs.who_knows && `${theirs.who_knows} knows`,
                theirs.check_in_time && `checking in ${theirs.check_in_time}`,
              ]
                .filter(Boolean)
                .join("; ")}
              .
            </p>
          )}
          <button className={`${small} mt-3 bg-violet-700 text-white`} disabled={!!busy}>
            {busy === "first-meeting" ? "Saving…" : "Save"}
          </button>
        </form>
      )}
      {live && (
        <details className="rounded-xl border border-slate-200 p-3">
          <summary className="cursor-pointer font-bold">Tell a friend where you&apos;ll be</summary>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Send this from your own phone. The site does not send or save it,
            so only you know who you told.
          </p>
          <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm leading-6">{friendText}</p>
          <button type="button" className={`${small} mt-2 bg-slate-100 text-slate-800`} onClick={share}>
            Share or copy
          </button>
          {copied && <p role="status" className="mt-1 text-xs text-slate-600">{copied}</p>}
        </details>
      )}
      {exchange.status === "accepted" && (
        <div className="rounded-xl border border-slate-200 p-3">
          <h4 className="font-bold">Check in during the exchange</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className={`${small} bg-mint text-leaf-deep`}
              disabled={!!busy}
              onClick={() => act("safety_checkin", { exchange_id: exchange.id, kind: "fine" }, "checkin")}
            >
              I&apos;m here and it&apos;s going fine
            </button>
            <button
              className={`${small} bg-amber-100 text-amber-950`}
              disabled={!!busy}
              onClick={() => act("safety_checkin", { exchange_id: exchange.id, kind: "call_me" }, "checkin")}
            >
              Please have a steward call me
            </button>
          </div>
          {lastCheckin && (
            <p role="status" className="mt-2 text-xs text-slate-600">
              You checked in at{" "}
              {new Date(lastCheckin.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: COMMUNITY_TIME_ZONE })}
              {lastCheckin.kind === "call_me" ? " and asked for a call." : "."}
            </p>
          )}
          <p className="mt-2 text-xs leading-5 text-slate-600">
            The call request is a notice to the stewards inside the site. They
            see it the next time they open it. {otherName} is not told.{" "}
            <strong>It does not call anyone. In an emergency, call 911.</strong>
          </p>
        </div>
      )}
      {canNote && (
        <form
          className="rounded-xl border border-slate-200 p-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await act("steward_note", { exchange_id: exchange.id, body: note.trim() }, "steward-note");
          }}
        >
          <label className="form-label">
            Anything a steward should know?
            <textarea className="form-input min-h-20" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
          </label>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Only stewards see this. {otherName} never does. Most people leave it empty.
          </p>
          <button className={`${small} mt-2 bg-slate-100 text-slate-800`} disabled={!!busy || !note.trim()}>
            {savedNote ? "Update note" : "Send to stewards"}
          </button>
        </form>
      )}
    </div>
  );
}
