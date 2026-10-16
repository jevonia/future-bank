// Pure helpers for the first-meeting safety card (plan Phase 2).
import type { Exchange } from "./types";

/** Two members who have never finished an exchange together. */
export function isFirstMeeting(
  exchanges: Pick<Exchange, "id" | "status" | "provider_id" | "requester_id">[],
  exchange: Pick<Exchange, "id" | "provider_id" | "requester_id">,
) {
  return !exchanges.some(
    (item) =>
      item.id !== exchange.id &&
      item.status === "completed" &&
      [item.provider_id, item.requester_id].sort().join() ===
        [exchange.provider_id, exchange.requester_id].sort().join(),
  );
}

/** The text a member can send to a friend. Nothing about it is stored. */
export function tellAFriendText(details: {
  otherName: string;
  title: string;
  place: string;
  checkIn: string;
}) {
  return [
    `I'm meeting ${details.otherName} from New Future Bank for "${details.title}".`,
    `Where: ${details.place || "not decided yet"}.`,
    `I'll check in with you: ${details.checkIn || "time not decided yet"}.`,
    "If you don't hear from me, please check on me.",
  ].join(" ");
}
