"use client";
import { DashboardCard } from "./DashboardCard";
import { formatCredits, type PublicSummary } from "@/lib/types";

export function CommunityPulse({ data }: { data: PublicSummary }) {
  const values = [
    [data.member_count, "members"],
    [data.completed_exchanges, "completed exchanges"],
    [formatCredits(data.contributed_minutes), "hours shared"],
    [data.active_projects, "active projects"],
  ] as const;
  return (
    <DashboardCard title="Community pulse" eyebrow="Real activity">
      <p className="mb-5 text-sm text-slate-600">
        A snapshot of time and care shared by the community.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {values.map(([value, label]) => (
          <div key={label} className="rounded-xl bg-[#f7f6f2] p-4">
            <p className="text-2xl font-bold text-violet-800">{value}</p>
            <p className="mt-1 text-xs text-slate-600">{label}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
