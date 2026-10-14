"use client";
import type { Offer, Want } from "@/lib/types";
import { CRITERIA_LABELS } from "@/lib/types";

export function ServiceCard({
  item,
  type,
  own = false,
  onRequest,
  onEdit,
  onArchive,
  onAmplify,
}: {
  item: Offer | Want;
  type: "offer" | "want";
  own?: boolean;
  onRequest?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onAmplify?: () => void;
}) {
  const want = type === "want" ? (item as Want) : null;
  const canEdit = own && onEdit && onArchive;
  const canRequest = !own && onRequest;
  return (
    <article className="card-hover rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${type === "offer" ? "bg-teal-50 text-teal-800" : "bg-violet-50 text-violet-800"}`}
            >
              {item.category}
            </span>
            {want?.is_urgent && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                Urgent
              </span>
            )}
          </div>
          <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
        </div>
        <span
          aria-label={item.profiles?.username || "Community member"}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800"
        >
          {(item.profiles?.username || "N").slice(0, 1).toUpperCase()}
        </span>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
        {item.description || "No additional details yet."}
      </p>
      {!!want?.criteria?.length && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {want.criteria.map((value) => (
            <span
              key={value}
              className="rounded-full bg-slate-100 px-2 py-1 text-[.68rem] text-slate-600"
            >
              {CRITERIA_LABELS[value as keyof typeof CRITERIA_LABELS] || value}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">
          {item.profiles?.username || "Community member"}
        </span>
        {canEdit ? (
          <div className="flex gap-2">
            <button onClick={onEdit} className="button-secondary">
              Edit
            </button>
            <button onClick={onArchive} className="button-secondary">
              Archive
            </button>
          </div>
        ) : canRequest ? (
          <button onClick={onRequest} className="button-primary">
            {type === "offer" ? "Ask about this" : "Offer to help"}
          </button>
        ) : want && onAmplify ? (
          <button onClick={onAmplify} className="button-secondary">
            {want.is_urgent ? "Amplified" : "Mark urgent & amplify"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
