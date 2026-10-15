"use client";
import { DashboardCard } from "./DashboardCard";
import { formatCredits } from "@/lib/types";

export function CommunityFund({
  balanceMinutes,
  onDonate,
  onRequest,
}: {
  balanceMinutes: number;
  onDonate: () => void;
  onRequest: () => void;
}) {
  return (
    <DashboardCard title="Community fund" eyebrow="A shared safety net">
      <div className="rounded-2xl bg-[#141a4a] p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-200">
          Time credits available
        </p>
        <p className="mt-2 text-4xl font-bold">
          {formatCredits(balanceMinutes)} <span className="text-base">TC</span>
        </p>
        <p className="mt-2 text-xs leading-5 text-white/70">
          Donations and requests are handled privately. Fund requests go to
          community facilitators for review.
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={onDonate} className="button-primary">
          Donate time
        </button>
        <button onClick={onRequest} className="button-secondary">
          Request support
        </button>
      </div>
    </DashboardCard>
  );
}
