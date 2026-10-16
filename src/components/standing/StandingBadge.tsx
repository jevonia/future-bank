import { LEVEL_INFO, type StandingLevel } from "@/lib/standing";

/** Plain colors per level. Words carry the meaning; color only helps scanning. */
export const LEVEL_TONES: Record<StandingLevel, string> = {
  new: "bg-slate-100 text-slate-700 ring-slate-200",
  introduced: "bg-sky text-cobalt-deep ring-violet-200",
  known: "bg-mint text-leaf-deep ring-leaf/30",
  steward: "bg-sun-soft text-ink ring-sun",
};

export function StandingBadge({
  level,
  long = false,
  className = "",
}: {
  level: StandingLevel;
  /** "Known neighbor" instead of "Known". */
  long?: boolean;
  className?: string;
}) {
  const info = LEVEL_INFO[level];
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${LEVEL_TONES[level]} ${className}`}
    >
      {long ? info.heading : info.name}
    </span>
  );
}
