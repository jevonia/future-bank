"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { mutateCommunity } from "@/lib/community-api";
import { CATEGORIES } from "@/lib/types";

type ListingDraft = {
  id?: number;
  title?: string | null;
  description?: string | null;
  category?: string | null;
};

export function AddOfferModal({
  isOpen,
  onClose,
  initialData,
  onOfferAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ListingDraft;
  onOfferAdded?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Skills");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const categoryOptions =
    initialData?.category &&
    !CATEGORIES.includes(initialData.category as (typeof CATEGORIES)[number])
      ? [...CATEGORIES, initialData.category]
      : CATEGORIES;

  useEffect(() => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setCategory(initialData?.category || "Skills");
    setError("");
  }, [initialData, isOpen]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await mutateCommunity("save_listing", {
        kind: "offer",
        id: initialData?.id,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || "Skills",
      });
      onOfferAdded?.();
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Your offer could not be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit your offer" : "Share something you can offer"}
      description="Every hour is one time credit. Agree on the time together before you begin."
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="form-label">
          Offer title
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            maxLength={120}
            placeholder="Help set up a phone or laptop"
            required
          />
        </label>
        <label className="form-label">
          What would you like people to know?
          <textarea
            className="form-input min-h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minLength={10}
            maxLength={4000}
            placeholder="Share what you can help with and when you are usually available."
            required
          />
        </label>
        <label className="form-label">
          Category
          <select
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button className="button-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : initialData ? "Save changes" : "Publish offer"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
