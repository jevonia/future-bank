"use client";

import Link from "next/link";
import {
  MIN_STANDING,
  MIN_STANDING_LABELS,
  type MinStanding,
} from "@/lib/standing";

/** Care work is where the plan suggests asking for Introduced and up. */
export function suggestedMinimum(category: string): MinStanding {
  return category === "Care" ? "introduced" : "anyone";
}

export function WhoCanSayYes({
  kind,
  value,
  suggested,
  onChange,
}: {
  kind: "offer" | "want";
  value: MinStanding;
  /** True when the form picked the value for care work. */
  suggested: boolean;
  onChange: (value: MinStanding) => void;
}) {
  return (
    <label className="form-label">
      Who can say yes?
      <select
        className="form-input"
        value={value}
        onChange={(event) => onChange(event.target.value as MinStanding)}
      >
        {MIN_STANDING.map((option) => (
          <option key={option} value={option}>
            {MIN_STANDING_LABELS[option]}
          </option>
        ))}
      </select>
      <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-600">
        {kind === "offer"
          ? "Choose who can ask you for this help."
          : "Choose who can offer to help you."}{" "}
        {suggested && "We suggest Introduced and up for care work. You can change it. "}
        Introduced means a steward has met them in person. It is not a safety
        promise.{" "}
        <Link href="/standing" target="_blank" className="font-bold text-violet-800 underline">
          What the words mean
        </Link>
      </span>
    </label>
  );
}
