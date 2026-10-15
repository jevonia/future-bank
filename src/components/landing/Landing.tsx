"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicSummary } from "@/lib/types";
import { formatCredits } from "@/lib/types";
import { contactEmail } from "@/lib/site";
import {
  AskCardArt,
  CarArt,
  CircleArt,
  FundJarArt,
  GardenArt,
  GroceryArt,
  HeroScene,
  KidsArt,
  LogoMark,
  MugsArt,
  OfferCardArt,
  PhoneArt,
  ReturnClockArt,
} from "@/components/illustrations";
import { archivePhotos } from "./archive-photos";
import { PhotoSlideshow } from "./PhotoSlideshow";

const [leadPhoto, ...morePhotos] = archivePhotos;

// Below this size, live counts read as "empty" rather than "growing", so the
// page invites people to be founding members instead.
const SHOW_STATS_AT_MEMBERS = 12;

// Copy guidelines (see docs/DESIGN.md): short sentences, everyday words,
// no em dashes, and concrete examples instead of slogans.

const sources = [
  {
    id: "groceries",
    label:
      "farmdoc daily (University of Illinois), “Inflation and Food Price Update,” May 2025. Uses the BLS food-at-home price index, December 2019 to April 2025.",
    href: "https://farmdocdaily.illinois.edu/2025/05/inflation-and-food-price-update-may-2025.html",
  },
  {
    id: "eggs",
    label:
      "U.S. Bureau of Labor Statistics, average price of a dozen Grade A large eggs. March 2025: $6.23.",
    href: "https://data.bls.gov/timeseries/APU0000708111",
  },
  {
    id: "emergency",
    label:
      "Federal Reserve, Economic Well-Being of U.S. Households in 2024, published May 2025.",
    href: "https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-executive-summary.htm",
  },
  {
    id: "loneliness",
    label:
      "U.S. Surgeon General, Our Epidemic of Loneliness and Isolation, 2023.",
    href: "https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf",
  },
  {
    id: "childcare",
    label:
      "Child Care Aware of America, Child Care in America: 2024 Price and Supply.",
    href: "https://www.childcareaware.org/price-landscape24/",
  },
  {
    id: "repairs",
    label:
      "U.S. Bureau of Labor Statistics, price index for car maintenance and repair, 2020 to 2025.",
    href: "https://data.bls.gov/timeseries/CUUR0000SETD",
  },
  {
    id: "mutual-aid",
    label:
      "LX News, “Hundreds of Mutual Aid Groups Formed in Response to COVID-19,” August 2021.",
    href: "https://www.lx.com/community/hundreds-of-mutual-aid-groups-formed-in-response-to-covid-19-what-comes-next-for-them/42112",
  },
  {
    id: "cahn",
    label:
      "New Weather Institute, “The man who invented a new kind of money,” January 2022.",
    href: "https://www.newweather.org/2022/01/30/th-man-who-invented-a-new-kind-of-money-for-heath-and-justice/",
  },
] as const;

type SourceId = (typeof sources)[number]["id"];

function Cite({ id }: { id: SourceId }) {
  const n = sources.findIndex((source) => source.id === id) + 1;
  return (
    <sup className="ml-0.5 text-[.7em] font-bold">
      <a
        href={`#source-${id}`}
        aria-label={`Source ${n}`}
        className="text-inherit underline decoration-1 underline-offset-2"
      >
        {n}
      </a>
    </sup>
  );
}

const pressures: { figure: string; copy: string; source: SourceId }[] = [
  {
    figure: "28%",
    copy: "more for groceries than at the end of 2019.",
    source: "groceries",
  },
  {
    figure: "$6.23",
    copy: "for a dozen eggs in March 2025, the highest price on record.",
    source: "eggs",
  },
  {
    figure: "37%",
    copy: "of adults could not pay a surprise $400 bill with cash.",
    source: "emergency",
  },
  {
    figure: "1 in 2",
    copy: "adults have said they feel lonely.",
    source: "loneliness",
  },
];

const stories: {
  Art: (props: { className?: string }) => React.JSX.Element;
  tone: string;
  who: string;
  title: string;
  squeeze: React.ReactNode;
  trade: string;
  result: string;
}[] = [
  {
    Art: GroceryArt,
    tone: "bg-sun",
    who: "Denise, home health aide and mother of two",
    title: "The grocery bill keeps growing",
    squeeze: (
      <>
        Her weekly cart used to cost about $120. Now it&apos;s over $150, and
        eggs went past six dollars a dozen.
        <Cite id="groceries" />
      </>
    ),
    trade:
      "Denise can make one pot of beans last a family three days. On Sundays she shows two neighbors how to cook for the whole week, and she earns two hours. She uses them when a neighbor watches her kids so she can take a Saturday double shift.",
    result:
      "Three families eat better on the same money, and Denise gets the extra shift.",
  },
  {
    Art: CarArt,
    tone: "bg-tomato",
    who: "Marcus, warehouse worker, and Earl, retired mechanic, 71",
    title: "The check-engine light",
    squeeze: (
      <>
        Car repairs cost about 40% more than they did in 2020.
        <Cite id="repairs" /> The shop wanted $480 to fix Marcus&apos;s brakes,
        mostly for labor. Like more than a third of adults, he didn&apos;t have
        $400 in cash for a surprise bill.
        <Cite id="emergency" />
      </>
    ),
    trade:
      "Earl fixed cars for forty years. Since his wife passed, he spends most days alone. Marcus buys the brake pads, and Earl puts them on in his driveway in two hours. Later, Marcus earns his two hours back by driving Earl to his heart doctor.",
    result:
      "Marcus keeps most of that $480. Earl has somewhere to be on Tuesdays.",
  },
  {
    Art: KidsArt,
    tone: "bg-cobalt",
    who: "Rosa, nursing assistant on the evening shift, single mom",
    title: "The childcare math",
    squeeze: (
      <>
        In 2024, child care cost $13,128 a year on average. For a single parent,
        that is about 35% of their income.
        <Cite id="childcare" /> Rosa works evenings at a nursing home, and the
        numbers never added up.
      </>
    ),
    trade:
      "Aisha lives two doors down and works days. Rosa watches Aisha's kids two mornings a week, and Aisha watches Rosa's kids two evenings. The time bank keeps track, so the trade stays fair.",
    result:
      "Both moms can work their shifts. Their four kids now call each other cousins.",
  },
  {
    Art: PhoneArt,
    tone: "bg-leaf",
    who: "Tyler, 24, works from home in customer service",
    title: "The new guy in 3B",
    squeeze: (
      <>
        Tyler moved to town for a job he does from home. Six months later, the
        only people he talked to were customers on the phone. Young people today
        spend much less time with friends. A 2023 Surgeon General report found
        it fell by almost 70% over about 20 years.
        <Cite id="loneliness" />
      </>
    ),
    trade:
      "Tyler is good with phones. On Saturday mornings he helps older neighbors set up video calls and block scam calls. He uses his hours for haircuts from a retired barber on the corner and for Sunday dinners at Denise's.",
    result:
      "Now six neighbors know his name, and the block gets fewer scam calls.",
  },
];

const values = [
  {
    title: "Every hour is worth the same.",
    copy: "An hour fixing brakes and an hour babysitting each earn one hour of credit.",
  },
  {
    title: "Everyone gives, and everyone gets help.",
    copy: "Asking for help is part of being a member. It gives someone else the chance to help.",
  },
  {
    title: "Everyone has something to offer.",
    copy: "A car, a second language, patience, a strong back, a good ear. You don't need a degree to be useful to someone.",
  },
  {
    title: "Money stays in your pocket.",
    copy: "Every hour you trade is one bill you didn't have to pay.",
  },
];

const steps = [
  {
    Art: OfferCardArt,
    title: "Say what you can do",
    copy: "Post an offer, like rides, cooking, repairs, babysitting, or help filling out a form. Only members can see it.",
  },
  {
    Art: AskCardArt,
    title: "Ask for what you need",
    copy: "Post a request, or reach out about someone's offer. Agree on what you'll do, when, and for how long.",
  },
  {
    Art: MugsArt,
    title: "Meet and help",
    copy: "When you both say yes, the hours are set aside so the help is covered. Then you meet up and get it done.",
  },
  {
    Art: ReturnClockArt,
    title: "The hours move",
    copy: "When you both mark it done, the time moves from one account to the other, down to the minute. Spend your hours whenever you need them.",
  },
];

const shares = [
  "Rides to work or the doctor",
  "Oil changes and brake pads",
  "Trading babysitting",
  "Cooking for the week",
  "Setting up a phone",
  "Help with forms",
  "Moving day",
  "Haircuts",
  "Homework help",
  "Small repairs",
  "Yard work",
  "Practicing English or Spanish",
  "Pet sitting",
  "A friendly visit",
];

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

function Eyebrow({
  children,
  className = "text-tomato-deep",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-lg font-bold ${className}`}>{children}</p>;
}

export function Landing({
  summary,
  configured,
  error,
  onJoin,
}: {
  summary: PublicSummary;
  configured: boolean;
  error?: string | null;
  onJoin: () => void;
}) {
  const showStats =
    configured && !error && summary.member_count >= SHOW_STATS_AT_MEMBERS;
  const faqs: [string, React.ReactNode][] = [
    [
      "Is this charity?",
      "No. Everyone gives and everyone gets help. Mutual aid means neighbors standing together as equals.",
    ],
    [
      "Will this fix rising prices?",
      "No. It can save you money on things neighbors can do for each other, like repairs, rides, and childcare. It also means you have people to call when things get hard.",
    ],
    [
      "I don't think I have anything to offer.",
      "Most people do. Some of the help people need most is simple: a ride, an extra pair of hands, someone patient to explain a form, or someone to talk to. Start with one small offer.",
    ],
    [
      "What if I can't give back right away?",
      "That's fine. Every new member starts with two hours, so you can ask for help first. If you need more help than you can return for now, you can ask the shared fund in private.",
    ],
    [
      "Does it cost anything?",
      "No. There are no fees, and members never pay each other money.",
    ],
    [
      "Who can see my information?",
      "Members who are signed in can see listings and who posted them. Only you can see your balance and your time record. Messages in an exchange are seen only by the two people in it.",
    ],
    [
      "Is it safe to meet someone new?",
      "We check that each member's email address is real. We do not run background checks. Use the same care you would with anyone new: meet in public first, bring a friend if you like, and trust your gut. You can turn down or cancel any exchange.",
    ],
    [
      "Who runs New Future Bank?",
      <>
        Neighbors run it. A community facilitator reviews requests to the shared
        fund and helps sort things out when something goes wrong.
        {contactEmail && (
          <>
            {" "}
            You can reach them at{" "}
            <a
              className="font-bold text-cobalt underline underline-offset-2"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            .
          </>
        )}
      </>,
    ],
  ];

  return (
    <div className="min-h-screen bg-paper text-lg text-ink">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a href="#home" className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <span className="whitespace-nowrap font-display text-xl font-bold sm:text-2xl">
            New Future Bank
          </span>
        </a>
        <nav
          aria-label="Page sections"
          className="hidden items-center gap-7 text-base font-bold text-slate-700 lg:flex"
        >
          <a href="#how-it-works" className="hover:text-cobalt">
            How it works
          </a>
          <a href="#stories" className="hover:text-cobalt">
            Stories
          </a>
          <a href="#agreements" className="hover:text-cobalt">
            Our agreements
          </a>
          <a href="#questions" className="hover:text-cobalt">
            Questions
          </a>
        </nav>
        <button
          type="button"
          onClick={onJoin}
          className="button-primary shrink-0 whitespace-nowrap text-base"
        >
          <span className="sm:hidden">Sign in</span>
          <span className="hidden sm:inline">Join or sign in</span>
        </button>
      </header>

      <main id="home">
        <div className="mx-auto max-w-7xl px-5 pb-2 sm:px-8">
          <details className="group rounded-2xl border border-leaf-deep/20 bg-mint/30">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-3 text-base font-bold text-leaf-deep hover:bg-mint/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-deep [&::-webkit-details-marker]:hidden">
              <span>In loving memory of my aunt</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="max-w-3xl px-5 pb-5 leading-8 text-slate-700">
              <p>
                This space is dedicated to my aunt, who found community and
                flourished in it. She made neighbors into family, giving and
                receiving love in the everyday moments of life. I am in awe of
                what she cultivated, and of the love that keeps growing in her
                absence.
              </p>
              <p className="mt-3 font-display text-xl font-bold text-leaf-deep">
                May we help each other feel that same belonging.
              </p>
            </div>
          </details>
        </div>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-10">
          <div>
            <span className="inline-flex rounded-full bg-sun px-4 py-1.5 text-base font-bold text-ink">
              A time bank for your neighborhood
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl">
              Everything costs more.{" "}
              <span className="text-cobalt">We have each other.</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-9 text-slate-700">
              Help a neighbor for an hour and you earn an hour of help back. You
              can use it with anyone in the group, for a ride, a babysitter, a
              home-cooked meal or a brake job. Nobody pays money, and every
              person&apos;s hour counts the same.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onJoin}
                className="button-primary px-6 py-3.5 text-lg"
              >
                Join your neighbors <span aria-hidden="true">→</span>
              </button>
              <a
                href="#stories"
                className="button-secondary px-6 py-3.5 text-lg"
              >
                Read their stories
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-slate-700">
              {["Free to join", "New members start with 2 hours"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-tomato" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <HeroScene
            className="mx-auto w-full max-w-xl"
            title="Drawing of a city block in the morning. One neighbor hands a pot of soup to another outside the corner store."
          />
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-6 bg-cobalt px-5 py-16 text-paper sm:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Eyebrow className="text-sun">How it works</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Easy enough to explain on the front porch
              </h2>
            </div>
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ Art, title, copy }, index) => (
                <li key={title} className="rounded-3xl bg-white/10 p-6">
                  <Art className="h-24 w-24" />
                  <p className="mt-5 text-base font-bold text-sun">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">{title}</h3>
                  <p className="mt-3 leading-8 text-paper/90">{copy}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-3xl leading-8 text-paper/95">
              Every new member starts with{" "}
              <strong className="text-sun">two hours</strong>, so you can ask
              for help before you&apos;ve given any. Your hours are kept in a
              private record that only you can see.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <Eyebrow>What neighbors share</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold">Everyday help adds up</h2>
              <p className="mt-4 leading-8 text-slate-700">
                Anything legal and kind that two people agree on can count.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {shares.map((item, index) => (
                <li
                  key={item}
                  className={`rounded-full px-4 py-2 text-base font-bold ${
                    [
                      "bg-sky text-cobalt-deep",
                      "bg-sun-soft text-ink",
                      "bg-blush text-tomato-deep",
                      "bg-mint text-leaf-deep",
                    ][index % 4]
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-2">
            <article className="flex flex-col gap-5 rounded-3xl bg-sun-soft p-7 sm:flex-row sm:items-start">
              <FundJarArt className="h-28 w-28 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold">A shared fund</h3>
                <p className="mt-3 leading-8 text-slate-700">
                  Members can give spare hours to a shared fund. If someone
                  needs more help than they can pay back right now, they can ask
                  the fund in private. A community facilitator looks at each
                  request.
                </p>
              </div>
            </article>
            <article className="flex flex-col gap-5 rounded-3xl bg-mint p-7 sm:flex-row sm:items-start">
              <GardenArt className="h-28 w-28 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold">Group projects</h3>
                <p className="mt-3 leading-8 text-slate-700">
                  Clean up a vacant lot, work a shift at the food pantry, or
                  plant a community garden. Projects count the hours people give
                  together, so everyone can see what the block has done. These
                  hours are a gift to the group and don&apos;t go into personal
                  accounts.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="photos"
          className="scroll-mt-6 bg-haze px-5 py-16 sm:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Eyebrow>Neighbors helping neighbors</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                How it used to look
              </h2>
              <p className="mt-5 leading-8 text-slate-700">
                Block parties, sidewalk stands, church on Sunday, and a dance on
                Saturday night. These photos were taken in city neighborhoods
                and small towns between 1936 and 1974.
              </p>
            </div>
            <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
              <a
                href={leadPhoto.href}
                target="_blank"
                rel="noreferrer"
                className="group block min-w-0"
              >
                <Image
                  src={leadPhoto.src}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
                <span className="mt-3 block leading-7 text-slate-700 group-hover:text-cobalt">
                  {leadPhoto.caption}
                </span>
                <span className="mt-1 block text-base text-slate-600">
                  {leadPhoto.credit}
                </span>
              </a>
              <PhotoSlideshow photos={morePhotos} />
            </div>
            <p className="mt-8 text-base leading-7 text-slate-600">
              Photos from the Library of Congress and the National Archives.
              They are free for anyone to use. Select a photo to see the
              original record.
            </p>
          </div>
        </section>

        <section className="bg-night px-5 py-16 text-paper sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <Eyebrow className="text-sun">It&apos;s not just you</Eyebrow>
                <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                  Paychecks don&apos;t stretch like they used to.
                </h2>
              </div>
              <p className="leading-8 text-paper/85">
                Prices went up fast after 2020, and many of us also lost touch
                with the people around us. These numbers come from government
                and university sources. You can check each one at the bottom of
                the page.
              </p>
            </div>
            <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pressures.map(({ figure, copy, source }) => (
                <div key={figure} className="rounded-3xl bg-white/[.08] p-6">
                  <dt className="font-display text-4xl font-bold text-sun sm:text-5xl">
                    {figure}
                  </dt>
                  <dd className="mt-3 leading-8 text-paper/90">
                    {copy}
                    <Cite id={source} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="stories"
          className="scroll-mt-6 bg-haze px-5 py-16 sm:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Eyebrow>What an hour can do</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Four neighbors on one block
              </h2>
              <p className="mt-5 leading-8 text-slate-700">
                In a time bank, help moves around the whole group. You help
                whoever needs what you&apos;re good at. When you need something,
                a different neighbor can help you.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {stories.map(
                ({ Art, tone, who, title, squeeze, trade, result }) => (
                  <article
                    key={title}
                    className="flex flex-col overflow-hidden rounded-3xl bg-paper shadow-[0_12px_32px_#1216330f]"
                  >
                    <div className={`h-2 ${tone}`} />
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="flex items-start gap-5">
                        <Art className="h-24 w-24 shrink-0" />
                        <div>
                          <h3 className="text-2xl font-bold">{title}</h3>
                          <p className="mt-2 text-base text-slate-600">{who}</p>
                        </div>
                      </div>
                      <p className="mt-5 leading-8 text-slate-700">{squeeze}</p>
                      <h4 className="mt-5 text-xl font-bold">
                        How the time bank helped
                      </h4>
                      <p className="mt-2 leading-8 text-slate-700">{trade}</p>
                      <p className="mt-auto pt-5">
                        <span className="block rounded-2xl bg-sun-soft px-4 py-3 font-bold leading-7 text-ink">
                          {result}
                        </span>
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
            <p className="mt-8 max-w-3xl leading-8 text-slate-700">
              These four people are made up, so no real member&apos;s story is
              shared without permission. The prices and statistics are real. A
              time bank won&apos;t raise wages or lower rent. What it can do is
              keep some money in your pocket and give you people to call when a
              month gets hard.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <Eyebrow>We&apos;ve done this before</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Neighbors have always helped each other get by
              </h2>
              <div className="mt-5 space-y-5 leading-8 text-slate-700">
                <p>
                  Ask your grandparents about barn raisings, church suppers, and
                  the lady down the street who watched every kid on the block.
                  In 2020, when the pandemic shut things down, people started at
                  least 800 mutual aid groups across the country. They ran
                  grocery and medicine trips for each other using group texts
                  and shared spreadsheets.
                  <Cite id="mutual-aid" />
                </p>
                <p>
                  The time bank idea comes from Edgar Cahn, a lawyer who worked
                  against poverty. After a heart attack in 1980, he hated
                  feeling useless. He started asking what people the job market
                  overlooks could do for each other. His answer was &ldquo;time
                  dollars,&rdquo; and this bank runs on the same idea.
                  <Cite id="cahn" />
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold">What we believe</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {values.map(({ title, copy }, index) => (
                  <article
                    key={title}
                    className={`rounded-3xl p-6 ${["bg-sun-soft", "bg-blush", "bg-sky", "bg-mint"][index]}`}
                  >
                    <h4 className="font-display text-xl font-bold">{title}</h4>
                    <p className="mt-2 leading-8 text-slate-700">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="agreements"
          className="scroll-mt-6 bg-haze px-5 py-16 sm:px-8 lg:py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Eyebrow>Our agreements</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold">
                Promises we make to each other
              </h2>
              <p className="mt-4 leading-8 text-slate-700">
                Trust is what makes this work. We ask every member to keep
                these.
              </p>
            </div>
            <ol className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {agreements.map(([title, copy], index) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cobalt font-display text-lg font-bold text-paper">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="mt-1 leading-8 text-slate-700">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="questions"
          className="mx-auto max-w-4xl scroll-mt-6 px-5 py-16 sm:px-8 lg:py-24"
        >
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold">Things people often ask</h2>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-bold sm:text-2xl">
                  {question}
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky text-2xl text-cobalt transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl leading-8 text-slate-700">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {error && (
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div
              role="status"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-900"
            >
              {error}
            </div>
          </div>
        )}

        <section className="px-5 pb-16 sm:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[2.5rem] bg-sun px-6 py-12 text-ink sm:px-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              {showStats ? (
                <dl className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {[
                    [summary.member_count, "neighbors"],
                    [summary.completed_exchanges, "exchanges"],
                    [
                      formatCredits(summary.contributed_minutes),
                      "hours shared",
                    ],
                    [summary.active_projects, "active projects"],
                  ].map(([value, label]) => (
                    <div key={String(label)}>
                      <dt className="sr-only">{label}</dt>
                      <dd className="font-display text-4xl font-bold">
                        {value}
                      </dd>
                      <dd className="font-bold">{label}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <Eyebrow className="text-ink">Founding members wanted</Eyebrow>
              )}
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Someone on your block needs what you&apos;re good at
              </h2>
              <p className="mt-5 max-w-xl leading-8">
                {showStats
                  ? "Post one thing you can offer and one thing you could use help with. That's all it takes to start."
                  : "We're starting with a small group of people who already know each other, from a street, a church, a union hall or a group chat. Join now and help decide how this community takes care of its own."}
              </p>
              <button
                type="button"
                onClick={onJoin}
                className="mt-8 rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-paper transition hover:bg-night"
              >
                Join your neighbors <span aria-hidden="true">→</span>
              </button>
            </div>
            <CircleArt className="mx-auto w-full max-w-xs" />
          </div>
        </section>

        <section
          id="sources"
          aria-labelledby="sources-title"
          className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-12 sm:px-8"
        >
          <h2 id="sources-title" className="text-2xl font-bold">
            Sources
          </h2>
          <ol className="mt-3 grid list-decimal gap-x-10 gap-y-2 pl-6 text-base leading-7 text-slate-700 md:grid-cols-2">
            {sources.map(({ id, label, href }) => (
              <li key={id} id={`source-${id}`} className="scroll-mt-6">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-slate-300 underline-offset-2 hover:text-cobalt"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <div>
              <p className="font-display text-xl font-bold">New Future Bank</p>
              <p className="text-base text-slate-600">
                Neighbors trading hours of help.
              </p>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-base font-bold text-slate-700"
          >
            <a href="#how-it-works" className="hover:text-cobalt">
              How it works
            </a>
            <a href="#stories" className="hover:text-cobalt">
              Stories
            </a>
            <a href="#agreements" className="hover:text-cobalt">
              Our agreements
            </a>
            <a href="#questions" className="hover:text-cobalt">
              Questions
            </a>
            <Link href="/privacy" className="hover:text-cobalt">
              Privacy and terms
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
