import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/illustrations";
import { contactEmail } from "@/lib/site";

// Copy guidelines (see docs/DESIGN.md): short sentences, everyday words,
// no em dashes. Every claim here describes what the code does today. Update
// this page before adding anything that keeps new information about members.

export const metadata: Metadata = {
  title: "Privacy and terms | New Future Bank",
  description:
    "What New Future Bank keeps about you, who can see it, and the rules every member agrees to.",
};

const updated = "October 15, 2026";

const agreements = [
  [
    "One hour equals one credit.",
    "It doesn't matter what the job is or who does it.",
  ],
  [
    "Agree before you start.",
    "Talk about what you'll do, when, how long it should take, and what happens if plans change.",
  ],
  [
    "You can always say no.",
    "Turn down any request you're not comfortable with. Meet in a public place the first time if you'd like.",
  ],
  [
    "Cancel early, and be kind about it.",
    "If an exchange is canceled, the hours go back to the person who set them aside.",
  ],
  [
    "Keep private things private.",
    "Messages stay between the two people in an exchange. Please don't share what someone tells you.",
  ],
  [
    "No cash and no selling.",
    "This is mutual aid. Hours are the only thing we trade.",
  ],
];

function CoordinatorContact({ fallback }: { fallback: string }) {
  if (!contactEmail) return <>{fallback}</>;
  return (
    <>
      {fallback} at{" "}
      <a
        className="font-bold text-cobalt underline underline-offset-2"
        href={`mailto:${contactEmail}`}
      >
        {contactEmail}
      </a>
    </>
  );
}

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-6 border-t border-slate-200 pt-10 font-display text-3xl font-bold sm:text-4xl"
    >
      {children}
    </h2>
  );
}

function Sub({ children }: { children: string }) {
  return <h3 className="mt-8 text-xl font-bold sm:text-2xl">{children}</h3>;
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6 leading-8 text-slate-700">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyAndTermsPage() {
  return (
    <div className="min-h-screen bg-paper text-lg text-ink">
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <span className="whitespace-nowrap font-display text-xl font-bold sm:text-2xl">
            New Future Bank
          </span>
        </Link>
        <Link
          href="/"
          className="text-base font-bold text-slate-700 hover:text-cobalt"
        >
          Back to the main page
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8">
        <p className="text-lg font-bold text-tomato-deep">Privacy and terms</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          What we keep, who can see it, and the rules we share
        </h1>
        <p className="mt-4 text-base text-slate-600">Updated {updated}.</p>
        <p className="mt-6 leading-8 text-slate-700">
          This page is in two parts. The first says what New Future Bank keeps
          about you and who can see it. The second is the rules every member
          agrees to. We wrote it in plain words. If something is unclear, ask
          the coordinator.
        </p>
        <nav
          aria-label="On this page"
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base font-bold"
        >
          <a href="#privacy" className="text-cobalt underline underline-offset-2">
            Privacy
          </a>
          <a href="#terms" className="text-cobalt underline underline-offset-2">
            Terms
          </a>
        </nav>

        <section aria-labelledby="privacy" className="mt-10">
          <SectionTitle id="privacy">Privacy</SectionTitle>

          <Sub>What we keep about you</Sub>
          <p className="mt-3 leading-8 text-slate-700">When you join, we keep:</p>
          <List
            items={[
              <>
                <strong>Your email address and a password.</strong> Our
                sign-in service stores the password in a scrambled form. We
                never see it.
              </>,
              <>
                <strong>A username you choose.</strong> Other members see it
                next to what you post.
              </>,
              <>
                <strong>A profile picture, if you add one.</strong> You can
                upload a small image or paste a link to one. It is stored with
                your profile.
              </>,
            ]}
          />
          <p className="mt-5 leading-8 text-slate-700">
            While you use the bank, we keep:
          </p>
          <List
            items={[
              "Offers and requests you post: the title, description, category, and any conditions you set, like asking to meet in a public place.",
              "Exchanges: who is helping whom, for how many hours, and whether each person has confirmed.",
              "Messages you send inside an exchange.",
              "Your balance and your time record. The time record lists every change to your hours, starting with the two-hour welcome grant.",
              "Kudos you give or get after an exchange.",
              "Requests you make to the shared fund, including the reason you write.",
              "Group projects you start and the hours you log on them.",
              "Notices the site shows you, and whether you have read them.",
              "Whether you chose to get urgent alerts.",
            ]}
          />
          <p className="mt-5 leading-8 text-slate-700">
            We do not ask for your home address, phone number, age, or ID.
            Please keep your address and phone number out of your listings.
            Share them in a message when you are ready.
          </p>
          <p className="mt-5 leading-8 text-slate-700">
            When you sign in, the site sets a cookie that keeps you signed in.
            That is the only cookie we set. We do not use ad trackers or
            analytics tools.
          </p>

          <Sub>Who can see what</Sub>
          <List
            items={[
              "Members who are signed in with a confirmed email can see offers, requests, and group projects, and the username and picture of the person who posted them.",
              "Only you can see your balance, your time record, your notices, and your settings.",
              "Messages and kudos in an exchange are seen only by the two people in it.",
              "Requests to the shared fund are seen by you and by the facilitators who review them.",
              "People who are not signed in see only totals: how many members there are and how many hours have been traded.",
              "The coordinator, who runs the site, can see all of this in order to keep the bank working and to sort things out when something goes wrong.",
            ]}
          />

          <Sub>Who else handles your data</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            Three companies help run the site. Each one handles only what it
            needs to do its job.
          </p>
          <List
            items={[
              <>
                <strong>Supabase</strong> stores the database and runs sign-in.
                Everything listed above lives there.
              </>,
              <>
                <strong>Vercel</strong> hosts the website.
              </>,
              <>
                <strong>Resend</strong> delivers the emails that confirm your
                address and reset your password.
              </>,
            ]}
          />
          <p className="mt-5 leading-8 text-slate-700">
            Like any web host, Vercel and Supabase keep short-term technical
            logs of requests. Those logs include the internet address your
            device connects from.
          </p>
          <p className="mt-5 leading-8 text-slate-700">
            We do not sell your data. We do not show ads. We do not share your
            data with anyone else, and we would do so only if the law required
            it.
          </p>

          <Sub>Changing or deleting your information</Sub>
          <List
            items={[
              "You can change your username and picture any time in Profile settings.",
              "You can edit or archive your own offers and requests.",
              <>
                To delete your account,{" "}
                <CoordinatorContact fallback="email the coordinator" />. There
                is no delete button yet, so a person does it by hand. They will
                remove your sign-in, profile, offers, requests, messages, and
                notices as soon as they can. Hours you already traded in
                completed exchanges stay in the bank&apos;s records, because
                other members&apos; balances depend on them.
              </>,
            ]}
          />

          <Sub>What may change</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            We are planning ways for members to get to know each other, like
            check-ins at community gatherings and a private way to tell a
            steward about a concern. None of that exists yet. Before we add
            anything that keeps new information about you, we will update this
            page to say what is kept and who can see it.
          </p>

          <Sub>Questions</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            <CoordinatorContact fallback="Ask the coordinator" />. They can
            tell you exactly what the bank holds about you.
          </p>
        </section>

        <section aria-labelledby="terms" className="mt-12">
          <SectionTitle id="terms">Terms</SectionTitle>
          <p className="mt-4 leading-8 text-slate-700">
            These are the rules for using New Future Bank. By creating an
            account, you agree to them.
          </p>

          <Sub>Our agreements</Sub>
          <ol className="mt-3 space-y-4">
            {agreements.map(([title, copy], index) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cobalt font-display text-base font-bold text-paper">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="leading-8 text-slate-700">{copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <Sub>How hours work</Sub>
          <List
            items={[
              "One hour of help equals one time credit, no matter what the work is or who does it.",
              "Every new member starts with two hours.",
              "Credits have no cash value. You cannot buy them, sell them, or trade them for money. They exist only inside this bank, and they end if the bank closes.",
              "When you accept an exchange, the hours are set aside. They move only after both people confirm the work is done. If an exchange is canceled, the hours go back.",
            ]}
          />

          <Sub>What the bank does not do</Sub>
          <List
            items={[
              "We check that each member's email address is real. We do not run background checks or check IDs.",
              "We do not vouch for any member or any work. We cannot promise that a member is who they say they are, or that a job will be done well or safely.",
              "You decide who to meet, where, and when. You are responsible for your own safety choices and for the help you give. Meet in public the first time if you like, tell a friend where you will be, and say no to anything that does not feel right.",
              "The bank has no insurance. If something breaks or someone gets hurt, the bank cannot pay for it.",
            ]}
          />

          <Sub>Pausing or removing an account</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            The coordinator may pause or remove an account to keep members safe,
            or if it is used for selling, spam, or harm. Most of the time they
            will talk with you first. If your account is removed, the hours in
            it are gone with it.
          </p>

          <Sub>Changes to this page</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            We will change this page as the bank grows. The date at the top
            shows when it last changed.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-xl font-bold">New Future Bank</p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-base font-bold text-slate-700"
          >
            <Link href="/" className="hover:text-cobalt">
              Main page
            </Link>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="hover:text-cobalt">
                Contact a coordinator
              </a>
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}
