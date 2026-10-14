"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { mutateCommunity } from "@/lib/community-api";

export function CommunityFundModal({
  isOpen,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [tab, setTab] = useState<"donate" | "request">("donate");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  useEffect(() => {
    if (isOpen) {
      setRequestId(crypto.randomUUID());
      setError("");
    }
  }, [isOpen]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const minutes = Math.round(Number(form.get("hours")) * 60);
      if (tab === "donate")
        await mutateCommunity("donate", {
          request_id: requestId,
          minutes,
          note: String(form.get("reason") || "").trim(),
        });
      else
        await mutateCommunity("request_fund", {
          minutes,
          reason: String(form.get("reason") || "").trim(),
        });
      setRequestId(crypto.randomUUID());
      onComplete?.();
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Your fund action could not be completed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Community fund"
      description="A shared safety net built by all of us."
    >
      <div className="mb-5 flex gap-2 rounded-full bg-slate-100 p-1">
        <button
          role="tab"
          aria-selected={tab === "donate"}
          onClick={() => {
            setTab("donate");
            setRequestId(crypto.randomUUID());
            setError("");
          }}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${tab === "donate" ? "bg-white text-violet-800 shadow-sm" : "text-slate-600"}`}
        >
          Donate
        </button>
        <button
          role="tab"
          aria-selected={tab === "request"}
          onClick={() => {
            setTab("request");
            setError("");
          }}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${tab === "request" ? "bg-white text-violet-800 shadow-sm" : "text-slate-600"}`}
        >
          Request support
        </button>
      </div>
      <form
        onChange={() => tab === "donate" && setRequestId(crypto.randomUUID())}
        onSubmit={submit}
        className="space-y-4"
      >
        <p className="text-sm leading-6 text-slate-600">
          {tab === "donate"
            ? "Donations help neighbors access support when they need it."
            : "Requests are private to you and community facilitators, who review them in confidence."}
        </p>
        <label className="form-label">
          {tab === "donate" ? "Hours to donate" : "Hours requested"}
          <input
            name="hours"
            type="number"
            className="form-input"
            min="0.25"
            max="100"
            step="0.25"
            defaultValue="1"
            required
          />
        </label>
        <label className="form-label">
          {tab === "donate" ? "Note (optional)" : "What would this support?"}
          <textarea
            name="reason"
            className="form-input min-h-24"
            maxLength={1500}
            required={tab === "request"}
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="button-secondary">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="button-primary">
            {busy
              ? "Submitting…"
              : tab === "donate"
                ? "Confirm donation"
                : "Send private request"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
