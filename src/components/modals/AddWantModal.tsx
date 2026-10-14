"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { mutateCommunity } from "@/lib/community-api";
import {
  CATEGORIES,
  WANT_CRITERIA,
  CRITERIA_LABELS,
  type WantCriteria,
} from "@/lib/types";

type ListingDraft = {
  id?: number;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  criteria?: string[];
};

export function AddWantModal({
  isOpen,
  onClose,
  initialData,
  onWantAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ListingDraft;
  onWantAdded?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Skills");
  const [criteria, setCriteria] = useState<WantCriteria[]>([]);
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
    setCriteria(
      (initialData?.criteria || []).filter((item): item is WantCriteria =>
        WANT_CRITERIA.includes(item as WantCriteria),
      ),
    );
    setError("");
  }, [initialData, isOpen]);

  function toggle(value: WantCriteria) {
    setCriteria((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await mutateCommunity("save_listing", {
        kind: "want",
        id: initialData?.id,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || "Skills",
        criteria,
      });
      onWantAdded?.();
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Your request could not be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit your request" : "Ask your community for help"}
      description="Naming what you need is a valuable contribution too. Add preferences that help others respond well."
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="form-label">
          What do you need help with?
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            maxLength={120}
            placeholder="A ride to the community garden"
            required
          />
        </label>
        <label className="form-label">
          A little more context
          <textarea
            className="form-input min-h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minLength={10}
            maxLength={4000}
            placeholder="What would make this exchange helpful for you?"
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
        <fieldset>
          <legend className="form-label mb-2">
            Preferences{" "}
            <span className="font-normal text-slate-500">(optional)</span>
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {WANT_CRITERIA.map((value) => (
              <label
                key={value}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs cursor-pointer ${criteria.includes(value) ? "border-violet-300 bg-violet-50 text-violet-800" : "border-slate-200 text-slate-600"}`}
              >
                <input
                  type="checkbox"
                  checked={criteria.includes(value)}
                  onChange={() => toggle(value)}
                />
                {CRITERIA_LABELS[value]}
              </label>
            ))}
          </div>
        </fieldset>
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
            {busy
              ? "Saving…"
              : initialData
                ? "Save changes"
                : "Publish request"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
