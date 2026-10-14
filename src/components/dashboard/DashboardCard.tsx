"use client";
import React from "react";

export function DashboardCard({
  title,
  children,
  onAdd,
  addLabel = "Add new",
  disabled = false,
  eyebrow,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  disabled?: boolean;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <section className={`panel p-5 sm:p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="mb-1 text-[.68rem] font-bold uppercase tracking-[.18em] text-teal-700">
              {eyebrow}
            </p>
          )}
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-100 disabled:cursor-not-allowed"
          >
            <span aria-hidden="true">＋</span>
            {addLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
