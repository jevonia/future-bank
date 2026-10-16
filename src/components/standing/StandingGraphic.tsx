import {
  LEVEL_INFO,
  NOT_A_PROMISE,
  SAFETY_HABITS,
  STANDING_LEVELS,
  type StandingLevel,
} from "@/lib/standing";

/*
 * The standing explainer graphic: the four levels as a path, then how
 * vouching works. It is plain HTML and CSS with small inline drawings, so the
 * words stay real text, screen readers read it in order, and it reflows to a
 * single column on a phone. All copy comes from src/lib/standing.ts.
 */

const tones: Record<
  StandingLevel,
  { ring: string; emblem: string; head: string }
> = {
  new: {
    ring: "border-slate-200 dark:border-white/15",
    emblem: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200",
    head: "text-slate-700 dark:text-slate-200",
  },
  introduced: {
    ring: "border-sky dark:border-violet-400/40",
    emblem: "bg-sky text-cobalt dark:bg-violet-400/20 dark:text-violet-200",
    head: "text-cobalt dark:text-violet-200",
  },
  known: {
    ring: "border-mint dark:border-leaf/40",
    emblem: "bg-mint text-leaf-deep dark:bg-leaf/20 dark:text-mint",
    head: "text-leaf-deep dark:text-mint",
  },
  steward: {
    ring: "border-sun dark:border-sun/50",
    emblem: "bg-sun-soft text-ink dark:bg-sun/20 dark:text-sun",
    head: "text-ink dark:text-sun",
  },
};

function Emblem({ level }: { level: StandingLevel }) {
  const common = {
    viewBox: "0 0 48 48",
    className: "h-9 w-9",
    "aria-hidden": true as const,
    fill: "currentColor",
  };
  switch (level) {
    case "new":
      return (
        <svg {...common}>
          <path d="M10 39h28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 39V22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 26c-8 0-12-5-12-11 7 0 12 4 12 11Z" />
          <path d="M24 22c0-7 5-11 12-11 0 7-4 11-12 11Z" opacity=".65" />
        </svg>
      );
    case "introduced":
      return (
        <svg {...common}>
          <circle cx="17" cy="16" r="6" />
          <path d="M6 39c0-7 5-12 11-12s11 5 11 12Z" />
          <circle cx="32" cy="18" r="5" opacity=".6" />
          <path d="M23 39c1-6 4-10 9-10s9 4 10 10Z" opacity=".6" />
        </svg>
      );
    case "known":
      return (
        <svg {...common}>
          <circle cx="24" cy="25" r="19" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
          <circle cx="24" cy="19" r="5" />
          <path d="M15 34c0-5 4-9 9-9s9 4 9 9Z" />
          <circle cx="8" cy="17" r="3.5" opacity=".6" />
          <circle cx="40" cy="17" r="3.5" opacity=".6" />
          <circle cx="10" cy="37" r="3.5" opacity=".6" />
          <circle cx="38" cy="37" r="3.5" opacity=".6" />
        </svg>
      );
    case "steward":
      return (
        <svg {...common}>
          <path d="M20 10a4 4 0 0 1 8 0" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M16 16h16l-3-5H19Z" />
          <rect x="16" y="16" width="16" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M24 20c3.5 3 3.5 7 0 10-3.5-3-3.5-7 0-10Z" className="text-tomato" fill="currentColor" />
          <path d="M13 39h22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
}

function Arrow({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M4 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Label({ children }: { children: string }) {
  return (
    <dt className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
      {children}
    </dt>
  );
}

// Shown on the connectors between levels on wide screens. Each card's "How
// you get here" says the same in full, so these are hidden from screen readers.
const stepLabels = [
  "A steward meets you",
  "Exchanges and two vouches",
  "Two stewards nominate you",
];

/** The four levels in order, each with what it means and does not mean. */
export function StandingPath() {
  return (
    <div>
      <p
        role="note"
        className="flex gap-3 rounded-2xl border-2 border-tomato-deep/30 bg-blush/40 p-4 leading-7 text-ink sm:p-5 dark:border-tomato/50 dark:bg-tomato/10 dark:text-paper"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-tomato-deep dark:text-tomato">
          <path d="M12 3 2 20h20L12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.2" fill="currentColor" />
        </svg>
        <span>
          <strong>{NOT_A_PROMISE}</strong> {SAFETY_HABITS}
        </span>
      </p>
      <ol className="mt-8 grid gap-6 lg:grid-cols-4" aria-label="The four levels of standing, in order">
        {STANDING_LEVELS.map((level, index) => {
          const info = LEVEL_INFO[level];
          const tone = tones[level];
          const last = index === STANDING_LEVELS.length - 1;
          return (
            <li key={level} className="relative pl-16 lg:flex lg:flex-col lg:pl-0">
              {!last && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-1.5rem] left-7 top-16 border-l-[3px] border-dashed border-slate-300 lg:hidden dark:border-white/25"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-[4.25rem] right-[-1.25rem] top-7 hidden border-t-[3px] border-dashed border-slate-300 lg:block dark:border-white/25"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-[4.5rem] right-0 top-0 hidden text-center text-xs font-bold leading-4 text-slate-500 lg:block dark:text-slate-400"
                  >
                    {stepLabels[index]}
                  </span>
                  <Arrow className="absolute -right-5 top-[1.2rem] hidden h-5 w-5 text-slate-400 lg:block dark:text-white/50" />
                  <Arrow className="absolute bottom-[-1.6rem] left-[1.15rem] h-5 w-5 rotate-90 text-slate-400 lg:hidden dark:text-white/50" />
                </>
              )}
              <div
                className={`absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-full ring-4 ring-paper lg:static dark:ring-night ${tone.emblem}`}
              >
                <Emblem level={level} />
              </div>
              <div
                className={`rounded-3xl border-2 bg-paper p-5 lg:mt-4 lg:flex-1 dark:bg-white/5 ${tone.ring}`}
              >
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Step {index + 1} of 4
                </p>
                <h3 className={`mt-1 text-2xl font-bold ${tone.head}`}>
                  {info.name}
                </h3>
                <p className="mt-2 leading-7">{info.means}</p>
                <dl className="text-base leading-7">
                  <Label>How you get here</Label>
                  <dd className="mt-1">{info.howToGetHere}</dd>
                  <Label>What it lets you do</Label>
                  <dd className="mt-1">
                    <ul className="list-disc space-y-1 pl-5">
                      {info.letsYou.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                  <Label>What it does not mean</Label>
                  <dd className="mt-1 rounded-xl bg-haze p-3 dark:bg-white/10">
                    {info.doesNotMean}
                  </dd>
                </dl>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const vouchSteps = [
  {
    title: "Someone who knows you writes one sentence",
    copy: "Only a Known neighbor or a steward can vouch. They must have met you in person or finished an exchange with you.",
  },
  {
    title: "They answer one private question",
    copy: "Would they be comfortable with you in their home? Only stewards see the answer.",
  },
  {
    title: "Members see the sentence and who wrote it",
    copy: "It shows on your standing. The voucher can take it back later.",
  },
  {
    title: "Two vouches count toward Known",
    copy: "Software only suggests it. A steward looks it over and decides.",
  },
];

/** How a vouch is given, who sees what, and the rules around it. */
export function VouchingFlow() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
      <ol className="grid gap-4 sm:grid-cols-2" aria-label="How vouching works, in order">
        {vouchSteps.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-paper p-5 dark:border-white/15 dark:bg-white/5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cobalt font-display text-lg font-bold text-paper dark:bg-violet-400 dark:text-night">
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-bold leading-6">{step.title}</h3>
              <p className="mt-1 text-base leading-7 text-slate-700 dark:text-slate-300">
                {step.copy}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="space-y-4" aria-label="An example vouch">
        <figure className="rounded-2xl border-2 border-mint bg-paper p-5 dark:border-leaf/40 dark:bg-white/5">
          <p className="text-sm font-bold uppercase tracking-wide text-leaf-deep dark:text-mint">
            What members see
          </p>
          <blockquote className="mt-2 font-display text-xl leading-8">
            “I know Rosa from the repair day. She fixed my screen door.”
          </blockquote>
          <figcaption className="mt-2 text-base text-slate-600 dark:text-slate-300">
            From Denise, a Known neighbor, October 2026
          </figcaption>
        </figure>
        <div className="flex gap-3 rounded-2xl border-2 border-dashed border-slate-300 p-5 dark:border-white/25">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-slate-600 dark:text-slate-300">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              What only stewards see
            </p>
            <p className="mt-1 leading-7">
              Would you be comfortable with Rosa in your home?{" "}
              <strong>Yes.</strong>
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The people in this example are made up.
        </p>
      </div>
    </div>
  );
}

export const VOUCH_RULES = [
  "Nobody can vouch for themselves or for someone they live with.",
  "Two vouchers who don't know each other count for more than two who do. Stewards can see when vouchers know each other.",
  "When two people vouch for each other on the same day, it is flagged on the stewards' desk so they can take a closer look.",
  "If someone you vouched for later causes harm, you are not punished automatically. Stewards look at what happened and talk with you. If they see a pattern, they can pause your standing for a while.",
];

export const NEVER_RULES = [
  "Standing never closes the bank to a new member. Levels only decide who can say yes to a request that asks for them.",
  "There are no stars, ratings, or scores, and no public complaints. Concerns go to a steward in private.",
  "Nobody ever has to show an ID or pass a background check to move up.",
  "Standing is never removed in secret. A steward can pause it while a concern is looked at. You are told, and told who to call. If nothing was wrong, the pause is lifted and nothing shows on your profile.",
  "No computer grants a level. Every change names the steward who made it and why, and you can see your own record.",
];
