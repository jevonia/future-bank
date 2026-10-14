"use client";

import type { Exchange, ExchangeMessage } from "@/lib/types";
import { formatCredits } from "@/lib/types";
import type { CommunityAction } from "@/lib/community-api";
import { DashboardCard } from "./DashboardCard";

const actionButton =
  "rounded-full px-3.5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";

export function ExchangeDesk({
  exchanges,
  currentExchange,
  currentUserId,
  messages,
  selectedExchange,
  message,
  busy,
  onSelect,
  onMessageChange,
  onSendMessage,
  onAction,
  onKudos,
}: {
  exchanges: Exchange[];
  currentExchange: Exchange | null;
  currentUserId: string;
  messages: ExchangeMessage[];
  selectedExchange: number | null;
  message: string;
  busy: string;
  onSelect: (id: number) => void;
  onMessageChange: (value: string) => void;
  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  onAction: (action: CommunityAction, payload: Record<string, unknown>) => void;
  onKudos: () => void;
}) {
  return (
    <DashboardCard title="Your exchange desk" eyebrow="Coordinate privately">
      <div className="grid gap-4 sm:grid-cols-[minmax(10rem,.7fr)_1.3fr]">
        {exchanges.length ? (
          <div className="max-h-[36rem] space-y-2 overflow-y-auto pr-1">
            {exchanges.map((exchange) => {
              const other =
                exchange.provider_id === currentUserId
                  ? exchange.requester
                  : exchange.provider;
              return (
                <button
                  key={exchange.id}
                  onClick={() => onSelect(exchange.id)}
                  aria-current={selectedExchange === exchange.id}
                  className={`w-full rounded-xl border p-3 text-left ${currentExchange?.id === exchange.id ? "border-violet-300 bg-violet-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <span className="block text-xs font-bold uppercase tracking-wide text-teal-700">
                    {exchange.status}
                  </span>
                  <span className="mt-1 block text-sm font-bold">
                    {exchange.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    With {other?.username || "neighbor"} ·{" "}
                    {formatCredits(exchange.minutes)} TC
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-7 text-center text-sm leading-6 text-slate-500 sm:col-span-2">
            No exchanges yet. Browse an offer or request to get started.
          </p>
        )}
        {currentExchange ? (
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold">{currentExchange.title}</h3>
                <p className="text-xs text-slate-500">
                  {formatCredits(currentExchange.minutes)} TC ·{" "}
                  {currentExchange.status}
                </p>
              </div>
              <span className="text-[.68rem] text-slate-500">
                Private thread
              </span>
            </div>
            <div
              className="max-h-48 space-y-2 overflow-y-auto py-1"
              aria-live="polite"
            >
              {messages.length ? (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${item.sender_id === currentUserId ? "ml-auto bg-violet-100 text-violet-950" : "bg-slate-100 text-slate-700"}`}
                  >
                    <p className="mb-1 text-[.65rem] font-bold opacity-70">
                      {item.sender_id === currentUserId
                        ? "You"
                        : item.sender?.username || "Neighbor"}
                    </p>
                    {item.body}
                  </div>
                ))
              ) : (
                <p className="py-5 text-center text-xs text-slate-500">
                  Use this private thread to coordinate a time and place.
                </p>
              )}
            </div>
            {["pending", "accepted"].includes(currentExchange.status) && (
              <form onSubmit={onSendMessage} className="mt-3 flex gap-2">
                <input
                  aria-label="Write a private message"
                  className="form-input mt-0 min-w-0"
                  maxLength={2000}
                  value={message}
                  onChange={(event) => onMessageChange(event.target.value)}
                  placeholder="Write a message"
                />
                <button
                  className={`${actionButton} bg-violet-700 text-white`}
                  disabled={busy === "message" || !message.trim()}
                >
                  {busy === "message" ? "…" : "Send"}
                </button>
              </form>
            )}
            {currentExchange.status === "pending" && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="mb-3 text-xs leading-5 text-slate-600">
                  Accepting reserves {formatCredits(currentExchange.minutes)} TC
                  from the requester&apos;s available balance. Credits transfer only
                  after both people confirm; cancelling releases the reservation.
                </p>
                <div className="flex flex-wrap gap-2">
                {currentExchange.initiator_id !== currentUserId ? (
                  <>
                    <button
                      className={`${actionButton} bg-teal-700 text-white`}
                      disabled={!!busy}
                      onClick={() =>
                        onAction("exchange_action", {
                          id: currentExchange.id,
                          operation: "accept",
                        })
                      }
                    >
                      Accept
                    </button>
                    <button
                      className={`${actionButton} bg-slate-100 text-slate-700`}
                      disabled={!!busy}
                      onClick={() =>
                        onAction("exchange_action", {
                          id: currentExchange.id,
                          operation: "decline",
                        })
                      }
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span className="self-center text-xs text-slate-500">
                    Waiting for the other person to respond.
                  </span>
                )}
                <button
                  className={`${actionButton} border border-slate-200 text-slate-700`}
                  disabled={!!busy}
                  onClick={() =>
                    onAction("exchange_action", {
                      id: currentExchange.id,
                      operation: "cancel",
                    })
                  }
                >
                  Cancel
                </button>
                </div>
              </div>
            )}
            {currentExchange.status === "accepted" && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="mr-auto text-xs text-slate-600">
                  Accepted time is reserved. Credits move only after both
                  people confirm; cancelling releases the reservation.
                </span>
                <button
                  className={`${actionButton} bg-teal-700 text-white`}
                  disabled={
                    !!busy ||
                    (currentExchange.provider_id === currentUserId
                      ? currentExchange.provider_confirmed
                      : currentExchange.requester_confirmed)
                  }
                  onClick={() =>
                    onAction("exchange_action", {
                      id: currentExchange.id,
                      operation: "confirm",
                    })
                  }
                >
                  {(
                    currentExchange.provider_id === currentUserId
                      ? currentExchange.provider_confirmed
                      : currentExchange.requester_confirmed
                  )
                    ? "You confirmed"
                    : "Confirm complete"}
                </button>
                <button
                  className={`${actionButton} bg-slate-100 text-slate-700`}
                  disabled={!!busy}
                  onClick={() =>
                    onAction("exchange_action", {
                      id: currentExchange.id,
                      operation: "cancel",
                    })
                  }
                >
                  Cancel
                </button>
              </div>
            )}
            {currentExchange.status === "completed" && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs text-teal-800">
                  Completed. Your time ledger has been updated.
                </p>
                <button
                  className={`mt-2 ${actionButton} bg-amber-100 text-amber-900`}
                  onClick={onKudos}
                >
                  Send kudos
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
            Select an exchange to see its private conversation and actions.
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
