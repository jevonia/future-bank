"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { mutateCommunity } from "@/lib/community-api";
import { KUDOS_LABELS } from "@/lib/types";

export function KudosModal({
  exchangeId,
  title,
  isOpen,
  onClose,
  onComplete,
}: {
  exchangeId: number | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [labels, setLabels] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!exchangeId) return;
    if (!labels.length) {
      setError("Choose at least one thank-you label.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await mutateCommunity("give_kudos", {
        exchange_id: exchangeId,
        labels,
        note: note.trim(),
      });
      onComplete?.();
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Your kudos could not be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Say thank you"
      description={
        title
          ? `Share what you appreciated about “${title}”.`
          : "A short note can make a completed exchange feel seen."
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <fieldset>
          <legend className="form-label mb-2">
            Choose what you appreciated
          </legend>
          <div className="flex flex-wrap gap-2">
            {KUDOS_LABELS.map((label) => (
              <label
                key={label}
                className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold ${labels.includes(label) ? "border-violet-400 bg-violet-50 text-violet-900" : "border-slate-200 text-slate-600"}`}
              >
                <input
                  className="sr-only"
                  type="checkbox"
                  checked={labels.includes(label)}
                  onChange={() =>
                    setLabels((current) =>
                      current.includes(label)
                        ? current.filter((item) => item !== label)
                        : [...current, label],
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="form-label">
          A personal note
          <textarea
            className="form-input min-h-20"
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thank you for…"
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" disabled={busy || !exchangeId}>
            {busy ? "Saving…" : "Send kudos"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
