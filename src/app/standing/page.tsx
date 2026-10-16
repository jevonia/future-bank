import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/illustrations";
import {
  NEVER_RULES,
  StandingPath,
  VOUCH_RULES,
  VouchingFlow,
} from "@/components/standing/StandingGraphic";
import { MIN_STANDING, MIN_STANDING_LABELS } from "@/lib/standing";
import { contactEmail } from "@/lib/site";

// Copy guidelines (see docs/DESIGN.md): short sentences, everyday words,
// no em dashes. Level copy lives in src/lib/standing.ts so this page says
// exactly what the dashboard says. Every claim here matches the code.

export const metadata: Metadata = {
  title: "How neighbors get to know each other | New Future Bank",
  description:
    "New, Introduced, Known, and Steward: what each word means, what it does not mean, and how vouching works.",
};

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="scroll-mt-6 border-t border-slate-200 pt-12 dark:border-white/15"
    >
      <p className="text-lg font-bold text-tomato-deep dark:text-tomato">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-2 text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 leading-8">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-3 h-3 w-3 shrink-0 rounded-full bg-sun"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function StandingPage() {
  return (
    <div className="min-h-screen bg-paper text-lg text-ink dark:bg-night dark:text-paper dark:[color-scheme:dark]">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <span className="whitespace-nowrap font-display text-xl font-bold sm:text-2xl">
            New Future Bank
          </span>
        </Link>
        <Link
          href="/"
          className="text-base font-bold text-slate-700 hover:text-cobalt dark:text-slate-200 dark:hover:text-sky"
        >
          Back to the main page
        </Link>
      </header>

      <main className="mx-auto max-w-7xl space-y-14 px-4 pb-16 pt-6 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-lg font-bold text-tomato-deep dark:text-tomato">
            Standing
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            How neighbors get to know each other
          </h1>
          <p className="mt-5 leading-8">
            You get to know people the way neighbors always have, a little at a
            time and in company. The site keeps track of who has been met, so
            you never have to take a stranger&apos;s word for it.
          </p>
          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Every member can post, ask, message, and trade hours from the first
            day. Standing is one word on your profile that says how well the
            community knows you. You move up by showing up: coming to
            gatherings, trading hours, and being met by people who are already
            known.
          </p>
        </div>

        <Section id="levels" eyebrow="The four levels" title="New, Introduced, Known, and Steward">
          <StandingPath />
        </Section>

        <Section id="vouching" eyebrow="Vouching" title="How vouching works">
          <VouchingFlow />
          <div className="mt-8 max-w-3xl">
            <Bullets items={VOUCH_RULES} />
          </div>
        </Section>

        <Section id="your-say" eyebrow="Your choice" title="Who can say yes to your request">
          <div className="max-w-3xl space-y-4 leading-8">
            <p>
              When you post an offer or a request, you choose who can say yes
              to it:
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="The choices">
              {MIN_STANDING.map((value) => (
                <li
                  key={value}
                  className="rounded-full bg-haze px-4 py-1 font-bold dark:bg-white/10"
                >
                  {MIN_STANDING_LABELS[value]}
                </li>
              ))}
            </ul>
            <p>
              The choice starts at Anyone. For care work, like sitting with an
              elder or watching children, the form suggests Introduced and up.
              When you ask for help, you can also ask for someone else to be
              there the first time.
            </p>
          </div>
        </Section>

        <Section id="concerns" eyebrow="When something goes wrong" title="Tell a steward">
          <div className="max-w-3xl space-y-4 leading-8">
            <p>
              You can raise a concern from any exchange or any member&apos;s
              profile. It goes to the stewards, never to a public page. You
              choose whether your name may be shared with the other person. The
              form asks what happened and what the person did. It never asks
              what anyone looks like.
            </p>
            <p>
              A steward writes back within two days, even if it is only to say
              what happens next. Most of the time the first step is a
              conversation with both people. While a concern is looked at, a
              steward can pause someone&apos;s standing, which stops them from
              starting new exchanges until they talk.
            </p>
            <p>
              During an exchange you can tap &quot;Please have a steward call
              me&quot;. That sends a notice to the stewards inside the site. It
              does not call anyone. <strong>In an emergency, call 911.</strong>
            </p>
          </div>
        </Section>

        <Section id="never" eyebrow="Promises" title="What standing never does">
          <div className="max-w-3xl">
            <Bullets items={NEVER_RULES} />
          </div>
        </Section>

        <section className="rounded-[2rem] bg-sun px-6 py-10 text-ink sm:px-10">
          <h2 className="text-3xl font-bold">Where to start</h2>
          <p className="mt-3 max-w-2xl leading-8">
            Come to a community gathering. A steward will check you in, and
            you&apos;ll meet neighbors while doing something useful together.
            Signed-in members can see the next gathering on their dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-base font-bold">
            <Link href="/" className="underline underline-offset-2">
              Join or sign in
            </Link>
            <Link href="/privacy" className="underline underline-offset-2">
              What we keep and who can see it
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-10 sm:px-8 dark:border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-xl font-bold">New Future Bank</p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-base font-bold text-slate-700 dark:text-slate-200"
          >
            <Link href="/" className="hover:text-cobalt dark:hover:text-sky">
              Main page
            </Link>
            <Link href="/privacy" className="hover:text-cobalt dark:hover:text-sky">
              Privacy and terms
            </Link>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-cobalt dark:hover:text-sky"
              >
                Contact a coordinator
              </a>
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}
