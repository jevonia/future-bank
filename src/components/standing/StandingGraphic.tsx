import {
  LEVEL_INFO,
  NOT_A_PROMISE,
  SAFETY_HABITS,
  STANDING_LEVELS,
  STANDING_STORIES,
  type StandingLevel,
} from "@/lib/standing";
import { StandingScene } from "./StandingScenes";

const panelColors: Record<StandingLevel, string> = {
  new: "bg-sun-soft",
  introduced: "bg-sky",
  known: "bg-mint",
  steward: "bg-sun-soft",
};

function Label({ children }: { children: string }) {
  return (
    <dt className="mt-4 font-bold">{children}</dt>
  );
}

/** A comic-strip introduction, with the complete rules one tap away. */
export function StandingPath() {
  return (
    <div>
      <div className="mb-6 max-w-3xl space-y-2 leading-8">
        <p className="font-bold">You can trade hours from day one.</p>
        <p>These words tell you how well the community knows someone. Here’s what that can look like, one neighbor at a time.</p>
      </div>
      <ol className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="The four levels of standing, in order">
        {STANDING_LEVELS.map((level, index) => {
          const info = LEVEL_INFO[level];
          const story = STANDING_STORIES[level];
          return (
            <li key={level} className="overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[4px_4px_0_0_#121633] dark:border-sky/40 dark:bg-[#20264f] dark:shadow-[4px_4px_0_0_#0b102e]">
              <div className={`border-b-2 border-ink text-ink dark:border-sky/40 ${panelColors[level]}`}>
                <div className="flex items-center gap-3 px-5 pt-5">
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-base font-bold text-paper">{index + 1}</span>
                  <h3 className="text-2xl font-bold">{info.name}</h3>
                </div>
                <div className="relative mx-4 mt-4 rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-base font-bold leading-6 sm:min-h-[6.25rem]">
                  <p>“{story.dialogue}”</p>
                  <span aria-hidden="true" className="absolute -bottom-2.5 left-12 h-4 w-4 rotate-45 border-b-2 border-r-2 border-ink bg-paper" />
                </div>
                <StandingScene level={level} />
              </div>
              <div className="px-5 pb-5 pt-6">
                <h4 className="text-2xl font-bold leading-tight">{story.title}</h4>
                <p className="mt-3 text-base leading-7">{story.copy}</p>
                <p className="mt-4 border-l-4 border-sun pl-3 text-base leading-7 text-slate-700 dark:text-slate-200">{story.reminder}</p>
                <details className="group mt-5 border-t border-slate-200 pt-4 dark:border-white/20">
                  <summary className="cursor-pointer rounded-sm text-base font-bold text-cobalt underline decoration-cobalt/30 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt dark:text-sky dark:decoration-sky/50 dark:focus-visible:outline-sky">
                    Full details: {info.name}
                  </summary>
                  <dl className="text-base leading-7">
                    <Label>What it means</Label>
                    <dd className="mt-1">{info.means}</dd>
                    <Label>How you get here</Label>
                    <dd className="mt-1">{info.howToGetHere}</dd>
                    <Label>What it lets you do</Label>
                    <dd className="mt-1">
                      <ul className="list-disc space-y-1 pl-5">
                        {info.letsYou.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </dd>
                    <Label>What it does not mean</Label>
                    <dd className="mt-1">{info.doesNotMean}</dd>
                  </dl>
                </details>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-base leading-7 text-slate-700 dark:text-slate-300">
        You don’t have to become a steward. It’s a job some neighbors choose to take on.
      </p>
      <div role="note" className="mt-6 rounded-2xl border border-sky bg-haze p-5 leading-7 dark:border-sky/30 dark:bg-white/5">
        <p className="font-bold">{NOT_A_PROMISE}</p>
        <p className="mt-2">{SAFETY_HABITS}</p>
      </div>
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
