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
            So members can get to know each other safely, we also keep:
          </p>
          <List
            items={[
              <>
                <strong>Your standing.</strong> That is the word New,
                Introduced, Known, or Steward, plus a record of every change:
                when it happened, which steward made it, and the reason they
                wrote. We also keep who introduced you and at which gathering.{" "}
                <Link className="font-bold text-cobalt underline underline-offset-2" href="/standing">
                  How standing works
                </Link>
              </>,
              "Gatherings: the name, time, and place, and which steward hosts it. When a steward checks you in, we keep which gathering, which steward, and when.",
              "Who can say yes to each offer or request you post: Anyone, Introduced and up, or Known and up.",
              "Vouches: the sentence a member writes about another member, how they know them, and their private answer to one question, whether they would be comfortable with that person in their home.",
              "Concerns: who raised it, which member or exchange it is about, what they wrote, whether their name may be shared, the steward's reply, and notes stewards write while they look into it.",
              "Pauses: who paused a member's standing, when, and the reason they wrote.",
              "Steward nominations: which steward nominated whom, when, and why.",
              "On an exchange: your answers to the first-meeting questions (where you'll meet, who knows where you'll be, when you'll check in), any check-in you tap during the exchange, and any private note you leave for stewards afterward.",
            ]}
          />
          <p className="mt-5 leading-8 text-slate-700">
            We do not ask for your home address, phone number, age, or ID, and
            no level of standing ever requires them. We do not run background
            checks.
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
              "Signed-in members can see each member's standing word, who introduced them and at which gathering, the date they joined, and how many exchanges they have finished with how many different members. They can also see vouches with the name of the person who wrote them, and the time and place of gatherings.",
              "The private answer in a vouch, about being comfortable with someone in your home, is seen only by stewards.",
              "Your gathering check-ins and the record of changes to your standing are seen by you and by the stewards.",
              "A concern is seen by the person who raised it and by the stewards. The member it is about does not see it, and a steward never sees a concern about themselves. Steward notes and nominations are seen only by stewards.",
              "A pause is seen by the paused member and by the stewards. It does not show on anyone's profile.",
              "First-meeting answers are seen only by the two people in the exchange. Check-ins and private notes for stewards are seen by you and by stewards who are not part of that exchange. The other person never sees them.",
              "When two stewards have nominated someone to be a steward, every member gets a notice with that person's name, so anyone can raise a concern in private.",
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
            The &quot;Tell a friend&quot; button on an exchange uses your own
            phone&apos;s share or copy. The site does not send that message or
            keep a copy, so only you know who you told.
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
              "You can take back a vouch you wrote.",
              "Concern records are the most private things the bank holds. They stay until the coordinator deletes them by hand. The plan is to review them once a year and delete the ones no longer needed.",
              <>
                To delete your account,{" "}
                <CoordinatorContact fallback="email the coordinator" />. There
                is no delete button yet, so a person does it by hand. They will
                remove your sign-in, profile, offers, requests, messages,
                notices, standing record, check-ins, vouches, and the concerns
                you raised as soon as they can. Hours you already traded in
                completed exchanges stay in the bank&apos;s records, because
                other members&apos; balances depend on them.
              </>,
            ]}
          />

          <Sub>What may change</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            Some time banks offer an optional check for people who do care
            work, like watching children. We do not offer one. If the
            community ever decides to, it will be optional, and we will update
            this page before it starts. Before we add anything else that keeps
            new information about you, we will update this page first.
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
              "The bank itself does not vouch for any member or any work. When a member vouches for someone, that is their own word. We cannot promise that a member is who they say they are, or that a job will be done well or safely.",
              "A standing word like Introduced or Known says how well the community knows someone. It is not a promise that they are safe.",
              "You decide who to meet, where, and when. You are responsible for your own safety choices and for the help you give. Meet in public the first time if you like, tell a friend where you will be, and say no to anything that does not feel right.",
              "The bank has no insurance. If something breaks or someone gets hurt, the bank cannot pay for it.",
            ]}
          />

          <Sub>Pausing or removing an account</Sub>
          <p className="mt-3 leading-8 text-slate-700">
            A steward may pause your standing while a concern is looked at. You
            will be told, and told which steward to talk to. While it is
            paused, you can&apos;t start or accept new exchanges, but you can
            finish ones already under way. If nothing was wrong, the pause is
            lifted and nothing shows on your profile.
          </p>
          <p className="mt-3 leading-8 text-slate-700">
            The coordinator, with one other steward agreeing, may remove an
            account to keep members safe, or if it is used for selling, spam,
            or harm. Most of the time they will talk with you first. If your
            account is removed, the hours in it are gone with it.
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
