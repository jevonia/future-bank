# Design, writing, and public page guide

Updated October 15, 2026. This file explains how the public page and the shared visual style work, so the next person can change them without undoing the reasons behind them.

## Who the page is for

The public page at `/` is written for working people who are short on money and short on time: people who feel the rising cost of groceries, car repairs, and child care, and who may not know many neighbors. Readers come from every background and reading level. Many will open the link on an older phone with a slow data plan. Every design and writing decision below follows from that.

## Fonts

The site uses fonts that already come with the reader's device, so nothing downloads.

| Use       | Font stack                                                   | Why                                                                                                                                                                                                                                                                                                     |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Body text | Verdana, Verdana Pro, Tahoma, DejaVu Sans, Arial, sans-serif | Verdana is named in the federal health-literacy guide ([ODPHP, Health Literacy Online](https://odphp.health.gov/healthliteracyonline/2016/display/section-3-3/)) and in dyslexia style guides based on the British Dyslexia Association's guidance. It has wide letters, open shapes, and a plain zero. |
| Headings  | Georgia, Gelasio, Noto Serif, Times New Roman, serif         | Georgia was drawn for screens and is familiar from newspapers and church bulletins. It stays easy to read at large sizes and gives the page some warmth.                                                                                                                                                |

Both stacks live in `src/styles/globals.css` as `--font-sans` and `--font-display`. Android and Linux do not ship Verdana or Georgia, so they fall back to similar fonts (DejaVu Sans or Arial, and Gelasio or Noto Serif).

Fonts that were tried and dropped:

- Fraunces and Source Sans 3 felt too much like a generic tech brand ("beige").
- Bricolage Grotesque was bold but has unusual letter shapes that slow down new readers.
- Atkinson Hyperlegible draws zeros with a slash, so "$400" looked like "$4Ø0".
- Courier and other typewriter fonts are slower to read in paragraphs. Nobody we surveyed uses them for body text.

Quick survey of community sites (October 2026): Feeding America and United Way use Arial for body text. Habitat for Humanity, 211.org, and TimeBanks.org use plain sans-serif fonts. None use decorative or typewriter fonts for reading text.

Reading comfort rules in use: body text is 18px on the public page with 1.6 or more line spacing, text is left-aligned, headings are bold instead of all caps, italics are avoided, and bold is used for emphasis.

## Colors

The palette is meant to feel like a neighborhood flyer or union poster: blue, yellow, and red on white. It replaced an earlier cream and terracotta palette that read as generic.

| Token                         | Hex                               | Use                                 |
| ----------------------------- | --------------------------------- | ----------------------------------- |
| `cobalt`                      | `#2340d9`                         | Primary buttons, links, logo        |
| `cobalt-deep`                 | `#1b32b0`                         | Hover states                        |
| `night` / `ink`               | `#141a4a` / `#121633`             | Dark bands, body text               |
| `sun` / `sun-soft`            | `#ffc93c` / `#fff1c2`             | Highlights, closing band            |
| `tomato` / `tomato-deep`      | `#ef4f2b` / `#c4361a`             | Accents; use `tomato-deep` for text |
| `leaf` / `leaf-deep` / `mint` | `#12a06b` / `#0b7350` / `#d3f3e4` | Green accents                       |
| `sky` / `haze`                | `#d9e3ff` / `#f2f5ff`             | Light section backgrounds           |

The tokens are defined in the `@theme` block of `globals.css`. The signed-in dashboard still uses Tailwind's `violet-*` and `indigo-*` class names, so those scales are remapped to the blue there instead of renaming classes in every component. Keep that in mind before using `violet` to mean purple.

## Illustrations

All drawings are hand-written SVG in `src/components/illustrations.tsx` and share the `palette` object. Nothing is AI-generated or downloaded.

- `LogoMark`: a clock face with a sprout for hands. `src/app/icon.svg` is a static copy for the browser tab; keep them in sync.
- `HeroScene`: a city block with an apartment building, a corner store, rowhouses, and a neighbor handing over a pot of soup.
- Story drawings: `GroceryArt`, `CarArt`, `KidsArt`, `PhoneArt`.
- Step and feature drawings: `OfferCardArt`, `AskCardArt`, `MugsArt`, `ReturnClockArt`, `FundJarArt`, `GardenArt`, `CircleArt`.
- Small glyphs: `StarGlyph`, `PlusGlyph`.
- Standing graphic: `StandingPath` and `VouchingFlow` in `src/components/standing/StandingGraphic.tsx`. See "Standing words" below.

The share image (`src/app/opengraph-image.tsx`) reuses `HeroScene`. The image renderer only accepts plain SVG elements, so the file flattens helper components first. It loads Gelasio (matches Georgia) and Noto Sans from Google Fonts while building; if that fails it falls back to a default font. `src/app/apple-icon.tsx` renders the logo for phone home screens.

## Historical photos

The "How it used to look" section, right after group projects, shows twelve historical photos: one large lead photo and a slideshow of the rest. Because the first pilot is in Black and Latino city neighborhoods, the city photos come first, led by the 1936 Newport News, Virginia picnic.

- Seven black-and-white photos (1936 to 1943) from the Library of Congress Farm Security Administration and Office of War Information collection, marked "No known restrictions on publication."
- Five color photos (1972 to 1974) from the EPA's DOCUMERICA project at the National Archives: John H. White's Chicago South Side series, Bob Smith in San Antonio, and Danny Lyon in Brooklyn. These are U.S. government works. They were downloaded from the Wikimedia Commons copies of the National Archives records because the Library of Congress site blocks scripts.

Files are in `src/components/landing/photos/`, captions and links in `src/components/landing/archive-photos.ts` (array order is display order), and original archive titles and rights in `src/components/landing/photos/CREDITS.md`.

Rules for adding photos:

- Use only US government works or items marked "No known restrictions on publication." Record the rights statement and the record URL.
- Show groups of people together. Lead with Black and Latino city neighborhoods, and keep some rural photos. Avoid images of suffering, police, or stereotypes, and skip photos where young people are smoking or drinking.
- Write captions only from what the record says or the photo plainly shows. Do not guess family relationships.
- Archive titles from the 1930s and 1940s often use outdated terms. Write a new respectful caption for the page and link to the original record instead of copying the title.
- Crop off film borders and save as JPEG, about 1000 to 1600px on the long side. Keep the original title, rights statement, and record link in `src/components/landing/photos/CREDITS.md`.

## Writing guide

Write the way a neighbor would explain it on the front steps.

- Use short sentences and everyday words. Aim for a reader in middle school.
- Use concrete examples (a brake job, a babysitter) instead of slogans.
- Do not use em dashes. Use a period or a comma.
- Avoid the "It's not X, it's Y" pattern unless it answers a real question someone asked, as in the FAQ.
- Do not group everything in threes. Lists can have two, four, or five items.
- Avoid stacked sentence fragments for drama ("Four neighbors. Real numbers. No money.").
- Avoid words that sound like marketing or machine writing: delve, vibrant, tapestry, testament, foster, seamless, journey, empower, crucial, pivotal, and similar.
- Say plainly what the time bank cannot do. It does not raise wages or lower rent.
- Every number needs a source in the Sources list at the bottom of the page.

Background on machine-writing patterns: [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## Public page structure

`src/components/landing/Landing.tsx`, in order:

1. Header with logo and section links.
2. Hero: "Everything costs more. We have each other."
3. How it works (four steps).
4. What neighbors share, the shared fund, and group projects.
5. "How it used to look": one large lead photo (the 1936 Newport News picnic) next to a slideshow of the other eleven (`PhotoSlideshow.tsx`).
6. "It's not just you": four sourced statistics.
7. Four story cards: Denise (groceries), Marcus and Earl (car repair), Rosa (child care), Tyler (loneliness). The people are made up and the page says so. The prices and statistics are real.
8. "We've done this before": mutual aid history, Edgar Cahn, and what we believe.
9. Our agreements (six ground rules).
10. Questions.
11. Closing invitation. It shows live member counts once there are at least 12 members (`SHOW_STATS_AT_MEMBERS`); before that it asks for founding members.
12. Sources, then footer.

Besides the public page, `/privacy` (`src/app/privacy/page.tsx`) holds the privacy policy and the terms on one page, and `/terms` redirects to the terms section. It is linked from the public page footer and from the sign-up and sign-in forms. Every sentence on it describes what the code does today, so update it before shipping anything that keeps new information about members. It now covers standing, gathering check-ins, vouches, concerns, pauses, steward nominations, and the first-meeting card. A lawyer or legal clinic should read it once before the pilot grows.

`/standing` (`src/app/standing/page.tsx`) explains the four levels of standing and how vouching works. It is linked from the public page footer, from a question in "Things people often ask," from the privacy page, and from the dashboard (the "Your standing" card, the note above "Find a neighbor," every member's profile dialog, and the "Who can say yes?" field). It is a separate page rather than a section of `/` because the same explanation has to be reachable from inside the dashboard and from every place a level appears, and because the public page is already long. It is the only page with a dark-mode style so far.

## Standing words

The standing and safety plan (`docs/STANDING_AND_SAFETY_PLAN.md`) names four levels. The site uses the words New, Introduced, Known, and Steward, never the plan's letters. All level copy lives in `src/lib/standing.ts` (`LEVEL_INFO`, `NOT_A_PROMISE`, `KNOWN_RULES`), so the explainer page, the dashboard, and the tests say the same thing. Change the words there, not in components.

- **Never a level alone.** The plan's "false confidence" rule: wherever a level appears, the words for what it means and does not mean are next to it or one tap away. The explainer opens with "A level is not a safety promise." The dashboard shows `LevelMeaning` in "Your standing" and in every profile dialog, and a one-line note sits above "Find a neighbor."
- **No scores.** No stars, percentages, or counts bigger than "6 exchanges with 4 members." Pauses and concerns never show on a profile.
- **Colors help, words carry the meaning.** Each level has a tone (`LEVEL_TONES` in `StandingBadge.tsx`): slate for New, sky and cobalt for Introduced, mint and leaf for Known, sun for Steward.
- **The graphic** (`StandingPath`) introduces the four standing words as a comic strip. The same neighbor in a red shirt appears joining, meeting a steward, helping another neighbor, and optionally welcoming someone new. `StandingScenes.tsx` contains the decorative inline SVG people and neighborhood scenes, using the homepage palette. Dialogue, speaker attribution, role labels, and short captions come from `STANDING_STORIES` in `src/lib/standing.ts`; all words remain selectable HTML. Speech tails share each speaker’s horizontal position with the SVG drawing, so they point to the right person at every width. The blue-shirted steward speaks in the Introduced panel, the green-shirted Known neighbor speaks in Known, and the red-shirted neighbor speaks in New and Steward. Role labels make that change clear; checkmarks are not used as badges of standing. Each panel keeps a brief limit on what its level means visible, and a native “Full details” disclosure contains the unchanged `LEVEL_INFO` requirements, permissions, and limits. The panels run four across on wide desktops, two across on smaller screens, and one per row on phones. Dark mode keeps the illustrated panels bright and the reading areas dark. The safety note and the reminder that becoming a steward is optional sit below the strip. `VouchingFlow` shows the four steps of a vouch next to an example of what members see and what only stewards see. The example people are made up and the page says so.
- **Dates** in standing UI use `COMMUNITY_TIME_ZONE` (`NEXT_PUBLIC_COMMUNITY_TIME_ZONE`, default `America/New_York`) so the server and the browser print the same gathering time.

The slideshow shows one photo at a time. Visitors can swipe or use the arrow buttons. It moves to the next photo every 6 seconds, stops while the pointer or keyboard focus is on it, has a Pause button, and does not move on its own for visitors whose device asks for reduced motion.

## Statistics to refresh

The numbers were checked in October 2026. Re-check them about once a year.

| Claim on the page                                                                       | Source                                                                                                                                           | Note                                                            |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Groceries cost about 28% more than at the end of 2019                                   | [farmdoc daily, May 2025](https://farmdocdaily.illinois.edu/2025/05/inflation-and-food-price-update-may-2025.html)                               | Data through April 2025. Later monthly data suggests about 30%. |
| Eggs reached $6.23 a dozen in March 2025                                                | [BLS series APU0000708111](https://data.bls.gov/timeseries/APU0000708111)                                                                        | Record national average.                                        |
| 37% of adults could not cover a $400 expense with cash                                  | [Federal Reserve SHED 2024](https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-executive-summary.htm) | 63% could.                                                      |
| About 1 in 2 adults report loneliness; young people's time with friends fell almost 70% | [Surgeon General, 2023](https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf)                                  | Pre-pandemic surveys.                                           |
| Child care averaged $13,128 in 2024, about 35% of a single parent's income              | [Child Care Aware of America](https://www.childcareaware.org/price-landscape24/)                                                                 | The 2025 report gives $13,184.                                  |
| Car repair costs about 40% more than in 2020                                            | [BLS series CUUR0000SETD](https://data.bls.gov/timeseries/CUUR0000SETD)                                                                          | 2020 to 2025 annual averages.                                   |
| At least 800 mutual aid groups formed in 2020                                           | [LX News, August 2021](https://www.lx.com/community/hundreds-of-mutual-aid-groups-formed-in-response-to-covid-19-what-comes-next-for-them/42112) |                                                                 |
| Edgar Cahn started time dollars after a 1980 heart attack                               | [New Weather Institute, January 2022](https://www.newweather.org/2022/01/30/th-man-who-invented-a-new-kind-of-money-for-heath-and-justice/)      |                                                                 |

## Settings

| Variable                              | Effect                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | Base URL used in share-preview tags. Defaults to `https://newfuturebank.com`.                                          |
| `NEXT_PUBLIC_COMMUNITY_CONTACT_EMAIL` | Shows a coordinator address in the FAQ and footer. Hidden when unset. Set in Vercel Production as of October 15, 2026. |
| `NEXT_PUBLIC_COMMUNITY_TIME_ZONE`     | Time zone for gathering times and standing dates. Defaults to `America/New_York`.                                      |

## Previewing

```bash
npm run dev
```

Open http://localhost:3000 for the public page and http://localhost:3000/standing for the standing explainer. To see the signed-in dashboard with sample data, start with `BANK_QA_FIXTURE=1 npm run dev` and open http://localhost:3000/qa/dashboard. That sample member is a steward, so the steward desk shows. Add `?standing=new` to see the same dashboard as a New member. The share image is at `/opengraph-image`.
