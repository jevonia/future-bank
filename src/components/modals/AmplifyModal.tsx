"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { mutateCommunity } from "@/lib/community-api";
import type { Want } from "@/lib/types";

export function AmplifyModal({
  item,
  onClose,
  onComplete,
}: {
  item: Want | null;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function amplify() {
    if (!item) return;
    setBusy(true);
    setError("");
    try {
      await mutateCommunity("amplify_want", { id: item.id });
      onComplete?.();
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "This request could not be amplified. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      isOpen={!!item}
      onClose={onClose}
      title="Amplify this urgent request"
      description="Members who opted in to urgent alerts will be notified. Use this for time-sensitive needs."
    >
      <div className="space-y-4">
        <p className="rounded-xl bg-amber-50 p-4 font-semibold text-amber-950">
          {item?.title}
        </p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button-primary"
            disabled={busy || !item}
            onClick={amplify}
          >
            {busy ? "Sending…" : "Amplify request"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
