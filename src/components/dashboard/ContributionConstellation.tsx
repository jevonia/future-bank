"use client";
import { DashboardCard } from "./DashboardCard";
import {
  formatCredits,
  type LedgerEntry,
  type ProjectContribution,
} from "@/lib/types";

export function ContributionConstellation({
  contributions,
  transactions,
  userId,
}: {
  contributions: ProjectContribution[];
  transactions: LedgerEntry[];
  userId: string;
}) {
  const contributionsByProject = contributions
    .filter((item) => item.user_id === userId)
    .reduce<Record<string, number>>((acc, item) => {
      const label = item.note?.trim() || "Community project";
      acc[label] = (acc[label] || 0) + item.minutes;
      return acc;
    }, {});
  const stars = [
    ...Object.entries(contributionsByProject).map(([label, minutes]) => ({
      label,
      minutes,
      kind: "Project hours",
    })),
    ...transactions
      .filter((item) => item.kind === "exchange" && item.amount_minutes > 0)
      .map((item) => ({
        label: item.description,
        minutes: item.amount_minutes,
        kind: "Neighbor exchange",
      })),
  ].slice(0, 16);

  return (
    <DashboardCard
      title="Your contribution constellation"
      eyebrow="Hours shared"
    >
      <p className="mb-4 text-sm text-slate-600">
        Your stars grow with time given to neighbors and community projects.
      </p>
      <div className="relative min-h-44 overflow-hidden rounded-2xl bg-[#141a4a] p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,107,117,.45),transparent_60%)]" />
        {stars.length === 0 ? (
          <div className="relative grid min-h-36 place-items-center text-center text-sm text-white/70">
            Your constellation will appear as you share time. Every exchange
            makes the community brighter.
          </div>
        ) : (
          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stars.map((star, index) => (
              <div
                key={`${star.kind}-${star.label}-${index}`}
                className="constellation-star flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <span aria-hidden="true" className="text-xl text-amber-200">
                  ✦
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">
                    {star.label}
                  </p>
                  <p className="text-[.68rem] text-white/60">
                    {formatCredits(star.minutes)} hours
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
