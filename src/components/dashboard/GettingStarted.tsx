"use client";

import { AskCardArt, MugsArt, OfferCardArt } from "@/components/illustrations";

/** First-run checklist; disappears once a member has listed and exchanged. */
export function GettingStarted({
  hasOffer,
  hasRequest,
  hasExchange,
  onOffer,
  onRequest,
}: {
  hasOffer: boolean;
  hasRequest: boolean;
  hasExchange: boolean;
  onOffer: () => void;
  onRequest: () => void;
}) {
  if (hasOffer && hasRequest && hasExchange) return null;
  const steps = [
    {
      Art: OfferCardArt,
      done: hasOffer,
      title: "Share one thing you can do",
      copy: "Something small is fine, like a ride to the store or an hour of company.",
      action: hasOffer ? null : { label: "Add an offer", onClick: onOffer },
    },
    {
      Art: AskCardArt,
      done: hasRequest,
      title: "Ask for one thing you could use",
      copy: "Ask for something you need. You and your neighbor can agree on the hours together.",
      action: hasRequest ? null : { label: "Ask for help", onClick: onRequest },
    },
    {
      Art: MugsArt,
      done: hasExchange,
      title: "Start your first exchange",
      copy: 'Look through "Find a neighbor" below and reach out about an offer or a request.',
      action: hasExchange
        ? null
        : { label: "Browse neighbors", href: "#find-a-neighbor" },
    },
  ];
  const remaining = steps.filter((step) => !step.done).length;

  return (
    <section
      aria-labelledby="getting-started-title"
      className="rounded-3xl border border-sun bg-sun-soft p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[.68rem] font-bold uppercase tracking-[.18em] text-violet-700">
            Your first steps
          </p>
          <h2
            id="getting-started-title"
            className="mt-1 text-2xl font-semibold"
          >
            Welcome, neighbor.
          </h2>
        </div>
        <p className="text-sm text-slate-600">{remaining} of 3 left</p>
      </div>
      <ol className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map(({ Art, done, title, copy, action }) => (
          <li
            key={title}
            className={`flex gap-4 rounded-2xl bg-[#ffffff] p-4 ${done ? "opacity-70" : ""}`}
          >
            <Art className="h-16 w-16 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold leading-snug">
                {done && <span className="sr-only">Done: </span>}
                {title}
                {done && (
                  <span aria-hidden="true" className="ml-1.5 text-moss">
                    ✓
                  </span>
                )}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
              {action &&
                ("href" in action ? (
                  <a
                    href={action.href}
                    className="mt-2 inline-block text-sm font-bold text-violet-700 underline underline-offset-2"
                  >
                    {action.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-2 text-sm font-bold text-violet-700 underline underline-offset-2"
                  >
                    {action.label}
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
