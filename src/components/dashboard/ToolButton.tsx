"use client";
import React from "react";

export function ToolButton({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex flex-col items-center justify-center p-4 bg-slate-100 rounded-xl text-slate-700 font-semibold hover:bg-indigo-100 hover:text-indigo-700 transition card-hover border border-slate-200 disabled:opacity-50"
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm">{label}</span>
    </button>
  );
}
