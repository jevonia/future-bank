# Standing and safety plan

Drafted October 15, 2026. This is a plan, not a spec. Phases 1 and 2 are now built in code and tested locally, but not applied to the hosted database; see [ROADMAP.md](ROADMAP.md) for what was built, what was left out, and the steps before members use it. It answers one question that people, mostly women, asked first when they saw the site: "How do I stay safe?"

The short answer we want to be able to give: **You get to know people the way neighbors always have, a little at a time and in company, and the site keeps track of who has been met so you never have to take a stranger's word for it.**

## Why this shape

The site says every hour is worth the same, everyone has something to offer, and you can always say no. The roadmap says kudos should "recognize care without ranking people or turning participation into a score." The dedication is to someone who "made neighbors into family." Any trust system has to fit inside those commitments, so these rules come first:

1. **Safety is a practice, not a badge.** A level on a profile says how well the community knows someone. It never says "this person is safe." The site must never imply a guarantee it cannot keep.
2. **Being known comes from showing up.** The main way to move up is to be met in person, by people who are already known, at things the community does together. This is how a lodge, a church, a block club, and a lending circle worked. It is also exactly what the site is for, so the path to trust and the path to belonging are the same path.
3. **Describe, do not rank.** Levels are words, not grades, stars, or scores. There are no public negative reviews. Concerns go to a person, privately.
4. **Nothing is closed to a new member.** A new member can post, ask, message, and exchange with anyone who is willing. Levels only control two things: what another member may *ask for* before saying yes to an in-person exchange, and who may vouch for others.
5. **Paper checks never become the only door.** An ID check or background check can be one input, offered and never required, because requiring one would shut out undocumented neighbors, people with old records, and people without a credit history. Those are often the people a time bank is for. A steward who has met you face to face is the identity check.
6. **Humans decide; software remembers.** No level is granted by an algorithm. Each change in standing records who made it and why, and can be looked at later.

## The levels

Four levels of standing. The letters in parentheses map to the A/B/C idea that started this plan. On the site we would use the words, not the letters.

| Level | Plain meaning | How you get there | What it lets you do |
| --- | --- | --- | --- |
| **New** (D) | Signed up with a real email. Nobody has met you yet. | Confirm your email. | Everything a member can do: post offers and requests, message, exchange with anyone willing, come to gatherings. |
| **Introduced** (C) | A steward has met you in person and confirmed you are who your profile says. | Come to any community gathering and get checked in by a steward, or meet a steward one to one (coffee, a porch visit, a phone-plus-video call if mobility is an issue). | Members whose requests say "Introduced and up" can now say yes to you. You appear with "Met by [steward] at [gathering], October 2026" on your profile. |
| **Known** (B) | The community has worked with you more than once and two known neighbors stand behind you. | Introduced, plus: at least 60 days as a member, 3 completed exchanges with at least 2 different members (both sides confirmed), 2 vouches from Known or Steward members who have done an exchange with you or met you in person, and no open concern. | Members whose requests say "Known and up" can say yes to you. You can vouch for others. You can host a gathering with a steward present. |
| **Steward** (A) | A neighbor the community has chosen to introduce others and to hear concerns. | Known, plus nomination by two current stewards (or by the coordinator for the founding group), a short conversation about the role, agreement to the steward commitments, and a waiting period of two weeks in which any member can raise a private concern with the coordinator. Renewed yearly by the other stewards. | Check people in at gatherings (which makes them Introduced), receive and work through concerns, pause an account while a concern is looked at, approve Known standing, nominate stewards. Stewards already exist in the app as the facilitator role; this plan widens that role. |

Rules that go with the table:

- Standing never expires except Steward, which is renewed yearly. People do not lose Introduced or Known by being quiet for a while. Life happens.
- Standing can be paused, never silently removed. A pause shows to the member as "A steward has asked to talk with you before your next exchange," and the member always knows who to call.
- Nobody vouches for family in the same household. A vouch needs either an in-person meeting or a completed exchange with the person.
- A vouch is a sentence, not a click: "I know Rosa from the repair day and she fixed my screen door." The form also asks the one question UK time bank coordinators ask a referee: "Would you be comfortable with this person in your home?" The sentence is shown on the profile with the voucher's name; the answer to the question is seen by stewards only. Vouches that are mutual on the same day are allowed but flagged to stewards. Couchsurfing's public references ran about 2,500 positive for every negative one, because people waited each other out and feared retaliation, so a positive-only public signal tells you almost nothing. Two vouchers who do not know each other count for more than two who do, as in Couchers.org's design.
- If someone a steward introduced or a member vouched for later causes harm, the introducer is not punished automatically. The other stewards look at that person's introductions and vouches together, and can pause their ability to introduce or vouch for a while. This is how Lobste.rs handles a banned invitee: review the inviter, suspend their invite power if there is a pattern, and ban only rarely. Automatic cascades make people stop introducing anyone.

## A separate mark for care work

Watching children, caring for an elder, or working alone inside someone's home is different from fixing brakes in a parking lot. Many time banks either ban these categories or require a background check for them.

This plan proposes a **"Care checked"** mark that is separate from standing. It is an attribute, not a level, because:

- It applies to specific kinds of help, not to the person's place in the community.
- It costs money and personal data, so it must be opt-in.
- It should never be the only way to be trusted with anything.

How it would work, if and when the community asks for it:

1. A member who offers child care, elder care, or in-home help can ask for the mark.
2. A steward or the coordinator runs, with the member's written consent, a check that the group has agreed on. The minimum is a free search of the national sex-offender registry (NSOPW), which covers only convictions that led to registration and depends on each state keeping it current. A fuller check through a volunteer-screening service costs about $30 to $90 per person depending on depth; the community fund or a sponsor could cover it. Whatever check is chosen, the mark must say exactly which one it was.
3. The site stores only: checked, by whom, on what date, and what kind of check. It never stores the report. Reports are deleted after the decision.
4. The mark expires after two years and can be renewed.
5. Members posting a request in a care category can tick "Care checked members only." The default is off.

Legal note to settle before building: a paid background check bought from a screening company falls under the Fair Credit Reporting Act, and the FTC has treated volunteer screening as an "employment purpose." That means a standalone disclosure, written authorization, a pre-adverse-action notice with a copy of the report and the CFPB summary of rights, and a final notice. Care.com paid settlements in Massachusetts and California because its checks did not cover what its "premium" tier implied, and Uber and Lyft settled with California prosecutors over overstated checks. A volunteer group can do this correctly, but the procedure must be written down first and the coordinator should talk to a lawyer or a legal clinic once. Dane County TimeBank in Madison reportedly runs a court and registry check on every applicant and limits people with records to group or supervised activities; this plan deliberately does not go that far, for the reasons in principle 5.

## Safety practices that do not depend on levels

Levels tell you how well someone is known. These practices are what actually keep people safe, and they should be built first because they help everyone on day one.

**Before the first in-person exchange**

- When two members accept an in-person exchange and have never done one together, the site shows a short "first time meeting" card to both people, with three questions: Where will you meet? Who knows where you'll be? What time will you check in afterward? Answers are optional and are shared only between the two of them.
- A **"Tell a friend"** button on the exchange sends the time, place, and the other member's first name and profile link to a member or outside contact the person chooses. Only the sender sees who they told.
- Requests already carry a "public place" criterion. Add "I'd like someone else present the first time" and "I prefer a woman or nonbinary helper" as criteria a requester can set. The second one should be discussed with members before shipping. Uber and Lyft both added it in 2023 to 2025 as an opt-in preference that raises the odds of a match rather than guaranteeing one, and an earlier women-only ride service dropped the strict version after legal trouble. It should be a preference the requester states, never something the site verifies or enforces.

**During**

- A **check-in** on the exchange page: "I'm here and it's going fine" or "Please have a steward call me." The second option sends a notification to every steward on call. It does not replace calling emergency services, and the page says so.

**After**

- Both members confirm completion, as they do today. Add a private question only stewards can see: "Anything a steward should know?" Most answers will be empty. The ones that are not are the point. Because the answer is private to stewards, there is no retaliation to fear, which is the problem Airbnb's double-blind reviews were built to solve.
- Kudos stay as they are: positive, optional, and from completed exchanges.

**Gatherings as the front door**

- A monthly gathering with a job to do: a repair day in a church hall or community room, a cooking afternoon, a yard day for an elder's house. Barn raisings, quilting bees, and the Mexican *tequio* or *faena* all worked this way. People get to know each other while doing something, and nobody has to be alone with a stranger to get their first hours.
- Stewards check people in. That check-in is what makes someone Introduced. It is also a natural place for the first exchanges of new members to happen, in company.
- Each gathering is logged: date, host steward, who was checked in. Members see their own attendance. Stewards see all of it.

**When something goes wrong**

- A **concern** can be raised from any exchange or profile. It goes to the stewards, not to a public page. The reporter chooses whether their name is shared with the other member. The form asks what happened and what the person did. It never asks what someone looked like, because neighborhood apps that invited "suspicious person" reports became racial profiling tools, and a conduct-only form is how Nextdoor cut those posts.
- Stewards reply to the reporter within two days, even if just to say "we got it and here is what happens next."
- The first response to most concerns is a conversation, not a removal: a steward talks to both people. This is the restorative approach that mutual aid groups and the Quaker clearness tradition both use. Removal is for safety, not for punishment, and the coordinator plus one other steward must agree.
- While a concern is open, the member's standing is paused as described above. If the concern is dismissed, the pause is lifted and nothing shows on the profile.
- Concern records are the most sensitive data the site would hold. They should be visible only to stewards and the reporter, kept to what is needed, and reviewed yearly for deletion.

## What members see

On a profile, in plain words:

> **Known neighbor.** Met by Nova at the October repair day. Vouched for by Denise ("fixed my screen door, patient with my kids underfoot") and Marcus. 6 exchanges with 4 members since September.

No numbers bigger than that, no percentages, no stars. On a New member's profile:

> **New here.** Joined this week. Hasn't been to a gathering yet. The next one is Saturday the 25th.

That last sentence turns a status into an invitation, which is the whole idea.

On a request or offer, a single setting: **Who can say yes?** Anyone / Introduced and up / Known and up / Care checked only (care categories). The default is Anyone, except that the first time a member posts in a care category the site suggests Introduced and up.

The public FAQ answer to "Is it safe to meet someone new?" changes from "We do not run background checks" to something like:

> We check that each member's email is real, and we keep track of who has been met in person at community gatherings and who other members stand behind. You can ask that only people a steward has met in person reply to your request. Before a first meeting the site helps you tell a friend where you'll be. We don't run background checks on everyone, and we say so, because a check can't tell you what a neighbor who has worked beside someone can. Trust your gut, meet in public first, and you can always say no.

## What this draws from

Historic and modern practices that shaped the levels above. The research notes at the end hold the sources and say what could and could not be verified.

- **A committee that meets you, then a decision by the body** is the oldest pattern here. Masonic and Odd Fellows lodges sent an investigating committee to an applicant and asked members who did not know the person to trust the committee's report. Quaker meetings still appoint a clearness committee that meets an applicant "as many times as necessary" before the meeting records a decision, and a "not yet" is an allowed answer. Our steward conversation for Known and Steward standing is a lighter version of both.
- **Warnings before removal.** The Free African Society of Philadelphia (1787) warned a disorderly member through two members first, and removed them only if they did not change. Quaker meetings "labored with" a member before disownment, and the person could appeal and later be readmitted. That is the graduated path in the concerns section: conversation, pause, and removal only with two stewards agreeing.
- **No blackball.** The lodges' failure mode was the anonymous ballot: one black ball could exclude anyone with no reason given, and the orders used it to keep people out by race, religion, or grudge. So this plan has no anonymous veto, every "no" is a conversation with a named steward, and decisions can be appealed.
- **Credentials that travel with the person.** Quakers gave a travelling member a minute from the home meeting and a certificate of transfer when they moved. Journeymen carried a *Kundschaft*, a letter from the last guild certifying their work and conduct, and could not easily find work in the next town without one. If New Future Bank ever has a second neighborhood, standing should travel the same way: a letter from your stewards, carried with the member's consent, not a database flag.
- **Lending circles** (tandas, susus, Grameen groups of five) show that trust is cheap among a small group that chose each other, and that stakes should start small and grow in stages. Grameen's staged loans, where two people borrow before the next two, is the same idea as "gatherings before one-to-one, one-to-one before in-home." Their failure mode is that peer pressure can turn into harassment and you cannot join if nobody picks you, so we keep standing open to anyone who shows up.
- **Time bank practice.** Timebanking UK's own guidance is that local banks meet a new member in person before they join, run group events before one-to-one exchanges, and take two references that a coordinator actually phones, asking the referee whether they would be comfortable with the applicant in their home. One bank's safety guide tells members to meet in public first, agree a code word, bring a friend, and tell the broker when an exchange starts and ends. A New Zealand bank asks about criminal history but says a "yes" does not automatically exclude anyone, except that driving convictions bar offering rides. These are the direct ancestors of the vouch question, the first-meeting card, and the check-in.
- **Women's clubs met the train.** The Phillis Wheatley clubs and homes met Black women arriving in Washington and Cleveland at the station, because newcomers were being preyed upon by fake employers. Someone known meeting you at the door is the whole idea behind "Introduced."
- **Couchsurfing and its successor.** Couchsurfing's original vouch could only be given by someone who already had three vouches, and a vouch meant you knew the person in real life. That is the structure behind "stewards introduce, Known members vouch." Its public references inflated to near uselessness, and its verification badge became tied to payment. Couchers.org, built by former members, replaced both with in-person verification: an established member meets you, checks a photo ID, and scans a code in the app, and verifications count for more when the verifiers do not know each other. Our Introduced level is the same idea with the ID check made optional.
- **Invite trees.** Lobste.rs records who invited whom, shows it on the profile, and when an invitee is banned the moderators consider suspending the inviter's ability to invite, and only rarely ban them. That is our rule for stewards and vouchers whose people cause harm.
- **Trip-level safety tools.** Uber's share-my-trip, check-in, and PIN features work because they do not depend on anyone having a clean record. The first-meeting card, "Tell a friend," and the check-in button are the time bank version.
- **Pod mapping** and safety plans from transformative justice work: before anything goes wrong, know who you'd call. The "Tell a friend" button and the first-meeting card are the small, built-in version.

## Build order

Phase 0 needs no code and can start this week. Later phases are gated on the pilot actually running.

**Phase 0: words and people (now)**

- Rewrite the FAQ safety answer as above, honestly describing what exists today.
- Publish a one-page "Meeting a neighbor for the first time" guide: public place, tell a friend, bring someone, say no, call a steward.
- Coordinator names the founding stewards (two or three people from the first circle) and they agree to the steward commitments in writing.
- Schedule the first gathering. Check people in on paper if needed. This is the first batch of Introduced members and it costs nothing.

**Phase 1: standing and introductions**

- Database: `member_standing` (level, since, granted_by, reason), `gatherings` (title, when, host steward, private location), `gathering_checkins` (gathering, member, steward, time), `concerns` (reporter, about, exchange, body, status, share_name, steward notes). Add `min_standing` to offers and wants. RLS so standing is readable by members, concerns only by stewards and the reporter.
- RPCs: create gathering, check in member (steward only), set standing (steward only, with the two-steward rule for Steward level), raise concern, respond to concern, pause and unpause standing.
- UI: standing line on profiles, "Who can say yes?" on listing forms, a gatherings list on the dashboard, a concern button on exchanges and profiles, a steward view of open concerns.
- Backfill: the four existing members are Introduced if a steward has met them, else New. Nova's facilitator role becomes Steward.

**Phase 2: vouches, Known, and the safety card**

- `vouches` (voucher, member, sentence, basis: met or exchange, created_at, unique per pair). Known standing computed as a *suggestion* to stewards when the conditions are met; a steward confirms it.
- First-meeting card, "Tell a friend," check-in button, and the private "anything a steward should know" question on completion.
- New criteria: someone else present the first time; woman or nonbinary helper preferred (after member discussion).

**Phase 3: care checked, only if asked**

- Written procedure, consent form, FCRA review, decision on which check and who pays.
- `care_clearances` (member, kind, checked_by, checked_on, expires). No report data.
- "Care checked only" option on care-category requests.

## How we will know it is working

Not growth. The questions to ask members monthly during the pilot:

- Did the people who asked "how do I stay safe" go on to accept an in-person exchange? If not, what would have changed their mind?
- How many first exchanges between two members happened at or because of a gathering?
- How many in-person exchanges used the first-meeting card or "Tell a friend"?
- How many concerns were raised, how fast did a steward respond, and how many ended in a conversation versus a removal?
- Does anyone feel the levels are a clique? Ask the New members specifically.

## Risks to keep in view

- **False confidence.** A level can make someone drop their guard. Every place a level appears should sit next to the words that say what it means and does not mean.
- **Gatekeeping.** Small groups drift toward letting in people like themselves. Stewards should be chosen for being different from each other, gatherings should be in places and at times that shift workers can reach, and the New level must keep full access to the bank.
- **Exclusion by paperwork.** No ID check and no background check may ever be required for standing. This is a rule, not a default.
- **Steward burnout.** Two days to respond to a concern is a real commitment. Start with at least three stewards and an on-call rotation, and give stewards hours for their time from the community fund if the group agrees.
- **Sensitive data.** Concerns and care checks are the first personal data of their kind the site would hold. A privacy policy and terms page, already on the open-decisions list, has to land before Phase 1.
- **Weight for a tiny pilot.** With 10 to 20 members, four levels may feel like a lot. It is fine to launch with New, Introduced, and Steward only, and add Known when there are enough exchanges to mean something.

## Open decisions for the community

1. The words. "Steward" or "coordinator"? "Introduced" or "Met"? Ask the first circle.
2. Whether to offer the "woman or nonbinary helper preferred" criterion, and how to word it.
3. Whether the Known thresholds (60 days, 3 exchanges, 2 members, 2 vouches) feel right or arbitrary. They are a starting guess.
4. Whether care categories should default to "Introduced and up" or stay open.
5. Who the first stewards are, and whether they are paid in hours.

## Research notes

Two research passes were run on October 15, 2026, one on historic community practices and one on modern platforms. They are kept here so the reasoning above can be checked. Several primary sources were unreadable to the research tool, and those items are marked. Do not cite anything marked unverified on the public page.

### Historic practices

**Free African Society (Philadelphia, 1787).** Members paid one shilling a month. No "drunkard nor disorderly person" could be admitted; membership was open regardless of religion to anyone living "an orderly and sober life." Benefits began after one year of subscriptions. A disorderly member was warned by two members and removed only if he did not amend. [NPS transcription of the Articles](https://www.nps.gov/articles/000/inde-preamble-and-articles-of-association-for-the-free-african-society.htm). Failure mode: aid was withheld if the need came from the member's "own imprudence," a moral test on who deserves help.

**Independent Order of St. Luke.** Founded 1867 in Baltimore for sick care and burial; Maggie Walker led it from 1899 and grew it to about 100,000 members. Its admission and visiting rules were not found. [NPS](https://www.nps.gov/articles/000/independent-order-of-st-luke.htm).

**Other Black orders.** A Prince Hall Eastern Star chapter in Charleston kept a "sick committee" that contacted ill members and helped as long as needed ([College of Charleston finding aid](https://findingaids.library.cofc.edu/repositories/3/resources/196)). The Grand United Order of True Reformers paid sick benefits on monthly dues ([SSA history](https://ai.ssa.gov/history/oasis/december1979.pdf)).

**Mutualistas.** The Alianza Hispano-Americana (Tucson, 1894) was organized along Masonic lines, with 88 lodges by 1919, insuring people other insurers refused. Women usually had separate auxiliaries, and some groups were men-only or Mexican-citizen-only. Historian Vicki Ruiz reads mutualistas as institutionalized *compadrazgo*. Sponsorship rules were not found. [Wikipedia](https://en.wikipedia.org/wiki/Mutualista), [University of Arizona](https://lib.arizona.edu/special-collections/collections/alianza-hispano-americana-records).

**Lodges and friendly societies.** Masonic practice: an investigating committee reports on the applicant; members who do not know him are "bound to give faith" to the committee; historically one black ball rejected ([Freimaurer-Wiki](https://freimaurer-wiki.de/index.php/En:Ballot), [Grand Lodge of Florida](https://www.grandlodgefl.com/wp-content/uploads/2021/11/Chapter-33.pdf)). Pennsylvania Odd Fellows: a three-member interview committee, then a ballot ([glpaioof.org](https://www.glpaioof.org/membership-request.html)). Friendly societies had visiting committees that checked on sick claimants and fined members who failed to visit, and denied benefits for illness from "intemperance" (Beito, *From Mutual Aid to the Welfare State*; the summary page could not be fetched, so verify against the book). **Unverified:** a fixed "two sponsors in good standing" rule and formal probationary degrees did not appear in the sources reached. The two-vouch rule in this plan is our own choice, not a historic citation.

**Quakers.** New England Yearly Meeting's membership steps: letter to the clerk, a clearness committee appointed that meets the applicant as often as needed, a report, and a minuted decision; the process can be extended if the applicant is "not yet ready" ([NEYM](https://neym.org/node/316)). A certificate of transfer moves membership between meetings, and the receiving meeting runs its own clearness. A travelling minute is a written endorsement carried to meetings visited ([Illinois Yearly Meeting glossary](https://ilym.org/ilym/glossary/)). Discipline: a committee "labored with" a member before disownment, with appeal to the quarterly and yearly meeting and readmission by petition. Failure mode: by 1722 marrying a non-Friend was a disownable offense ([Wikipedia](https://en.wikipedia.org/wiki/Quaker_wedding)).

**Lending circles.** ROSCA members select each other, so trust and social pressure carry the group; a Kobe University experiment found circles sustained by voting out defaulters ([Wikipedia](https://en.wikipedia.org/wiki/Rotating_savings_and_credit_association), [Kobe DP2015-31](https://www.rieb.kobe-u.ac.jp/academic/ra/dp/English/DP2015-31.pdf)). Grameen: self-selected groups of about five from one village; credit is staged two-two-one; default costs the group future credit, with no formal joint liability ([Wikipedia](https://en.wikipedia.org/wiki/Grameen_Bank), [Ghatak](https://personal.lse.ac.uk/ghatak/ej.pdf)). Critics link microcredit to coercion and debt stress.

**Guilds and merchants.** The wandering journeyman's name went into the guild chest for about half a year; on leaving he received a *Kundschaft* certifying work, conduct, and orderly departure, and hostels posted lists of absconders with unpaid debts ([Wikipedia](https://en.wikipedia.org/wiki/Wandering_journeyman)). Greif's Maghribi traders shared information on agents and refused to hire a known cheater; the model works best in small, tight-knit groups and its evidence is contested ([Greif](https://web.stanford.edu/~avner/Greif_Instutions/0%203%20Chapter%203%20Maghribis1.pdf), [critique](https://researchonline.lse.ac.uk/id/eprint/45680/1/wp169.pdf)).

**Time banks.** Edgar Cahn coined "Time Dollars" in a 1992 book with Jonathan Rowe ([Wikipedia](https://en.wikipedia.org/wiki/Time_banking)). UK brokers interview new members, match exchanges, and take references ([Timebanking UK](https://timebanking.org/?p=4304)). Coastal New Brighton Timebank: screening plus orientation and two referees the coordinator phones, asking whether they would be comfortable with the applicant entering homes ([terms PDF](https://tol2.timebanking.org/downloads/SkillsExchangeTsandCs.pdf), from search text; the PDF was unreadable). Timebanking UK guidance: in-person meeting before joining, group events before one-to-one exchanges, and broker risk-assessment training (search summary). HOurBank safety guide: meet in public, agree a password, bring a friend, tell the broker when an exchange starts and ends ([page](https://made-open-docs.helpscoutdocs.com/article/153-stay-safe-when-timebanking), returned 404; from search excerpt). Mid Canterbury (NZ) form: a criminal-history "yes" does not automatically exclude, but driving convictions bar offering rides. Greenbelt, MD: a reference can be a member or community person, membership stays pending until notified, and members can be dismissed ([greenbeltonline.org](https://www.greenbeltonline.org/?p=6088)). The UK Disclosure and Barring Service said in 2018 that time bank members would not appear eligible for standard or enhanced checks because exchanges are personal arrangements. Ithaca HOURS had a paid directory and elected board but no vetting found; only about a fifth of local currencies started after 1991 survived ([Wikipedia](https://en.wikipedia.org/wiki/Ithaca_Hours)). **Not found:** TimeBanks USA and hOurworld written orientation or background-check policy; check those sites directly.

**Churches, clubs, block clubs.** Prospective Great Migration migrants wrote to Chicago churches, which helped with housing and jobs ([Maxwell School](https://www.maxwell.syr.edu/research/article/bound-for-the-promised-land-african-american-religion-and-the-great-migration)); the "church letter" mechanics were not confirmed and are background only. Phillis Wheatley clubs housed Black women migrants and met them at the station; Jane Edna Hunter founded the Cleveland association in 1911 because newcomers were "preyed upon" ([BlackPast](https://blackpast.org/aah/phyllis-wheatley-womens-clubs-1895), [NPS](https://www.nps.gov/people/jane-edna-hunter.htm)). Block clubs trace to the Chicago Urban League and Lugenia Burns Hope's Neighborhood Union (Atlanta, 1908), largely run by women; the same structure was also used by white neighborhoods to resist integration ([Wikipedia](https://en.wikipedia.org/wiki/Block_club)).

**Gaps worth closing later:** lodge constitutions and Black-order rulebooks on sponsor counts; Quaker Faith and Practice texts on travelling minutes; Baptist and AME church-letter practice; TimeBanks USA and hOurworld official policies.

### Modern platforms

**Couchsurfing.** Early vouching required three vouches before you could vouch, and implied knowing the person in real life; members felt a vouch reflected on the voucher ([Dark Reading](https://darkreading.com/cyber-risk/couchsurfing-a-working-trust-model)). Verification moved from a paid postcard code to optional government-ID verification ([help center](https://support.couchsurfing.org/hc/en-us/articles/50048662619163-I-Already-Paid-Why-Isn-t-My-Account-Verified)). **Unverified:** no source found saying vouching was abolished or when. A study of Couchsurfing data found positive references for about 88 percent of guests and 90 percent of hosts, positive outnumbering negative by roughly 2,500 to 1, with "reference chicken" and fear of retaliation ([MIT Civic Media](https://civic.mit.edu/blog/natematias/to-friend-and-to-trust-mapping-couchsurfers-and-evaluating-online-rankings.html)). Couchers.org (a competitor, so biased) says the badge came to mean "they have paid" and that growth outran the volunteer community ([couchers.org](https://couchers.org/issues/communities-and-trust)). Couchers.org's own design: in-person verification by an established member who checks photo ID and scans a QR code, storing only ID type and last digits; verifications weigh more when verifiers are unconnected; "fully verified" needs three or more well-trusted, unconnected people; a separate standing score tracks whether people feel safe around someone ([plan](https://couchers.org/plan/communities-and-trust)). BeWelcome keeps first contact on-site, has a safety team, and says final responsibility is yours ([safety FAQ](https://bewelcome.org/safety/faq)). Trustroots publishes experiences only after both sides write one or 14 days pass, and asks for serious problems to go to support rather than a public review ([wiki](https://wiki.trustroots.org/en/Experiences), blocked; from summary).

**Time banks.** No published national safety policy was found for TimeBanks USA or hOurworld. Timebanking UK: meet prospective members in person, group activities before one-to-one, signed code of conduct, risk-assessed activities, public liability insurance ([FAQ](https://timebanking.org/faqs/)); its working declaration asks for verbal safety checks and a reference per new member ([PDF](https://timebanking.org/wp-content/uploads/2020/12/TBUK-Working-Declaration-2020_1.pdf)); DBS said in 2018 members were unlikely to be eligible for checks ([DBS guidelines](https://timebanking.org/dbs-guidelines/)); one-to-one work with vulnerable adults may need a check at the bank's discretion ([safeguarding policy](https://timebanking.org/timebanking-uk-safeguarding-policy/)). Plumas County, CA: no background checks, no liability insurance, requestors told to check their homeowner's policy ([Plumas News](https://www.plumasnews.com/?p=21029)). Dane County TimeBank (secondhand, page blocked): coordinator runs a Wisconsin court and sex-offender-registry check on every applicant plus one reference; people with records may be limited to group or supervised activities; members told the check is not comprehensive ([FAQ](https://danecountytimebank.org/faq)). Hour Exchange Portland: membership "a privilege" that can be revoked; minors only with parental consent and supervision ([orientation](https://www.hourexchangeportland.org/orientation.htm)). A Bristol study of English time banks found safeguarding bureaucracy a significant burden ([DOI 10.1111/hsc.13166](https://research-information.bris.ac.uk/ws/files/256308008/hsc.13166.pdf)).

**Neighborhood platforms.** Buy Nothing ties membership to a home address checked by volunteer admins ([admin agreement](https://help.buynothingproject.org/admin_agreement)). Nextdoor verified by mailed postcard, billing address, phone call, or a verified neighbor's invite, later automated through Persona ([case study](https://withpersona.com/customers/nextdoor/)); after racial profiling in Oakland "suspicious person" posts it added required forms and two non-race descriptors and reported a 75 percent drop in test markets, a company figure ([Nextdoor blog](https://blog.nextdoor.com/2016/08/24/reducing-racial-profiling-on-nextdoor)). Front Porch Forum requires real name and address and reviews every post by hand; critics call it opaque ([Boston Globe](https://www.bostonglobe.com/2024/12/05/business/front-porch-forum-social-media-network-vermont-williamstown)).

**Rides, stays, and care.** Uber Women Preferences (2025): opt-in, "increases your chances," not guaranteed ([Uber](https://uber.com/newsroom/women-preferences)). Lyft Women+ Connect (2023): opt-in for women and nonbinary riders and drivers ([Lyft](https://www.lyft.com/blog/posts/women-plus-connect)). Safr dropped women-only service after legal obstacles and kept a preference ([WBUR](https://www.wbur.org/news/2017/03/23/safr-female-ride-hailing-company)). Uber trip tools: share my trip, RideCheck, 4-digit PIN ([Uber](https://www.uber.com/newsroom/set-it-and-forget-it-how-to-maximize-your-safety-features)). Airbnb: optional government ID and selfie, never shown to other users; reviews are double-blind with a 14-day window ([ID help](https://www.airbnb.com/help/article/3033/types-of-id-for-verification)). Rover via Checkr: basic checks identity, national criminal database, and sex-offender registry; enhanced adds seven years of county records ([Rover](https://rover.com/background-checks)). Care.com: about $482,000 Massachusetts settlement in 2018 because checks did not routinely search district courts ([WBUR](https://www.wbur.org/news/2018/02/27/care-com-background-check-settlement)); $1 million California settlement in 2020 over registry-search claims (secondhand). Uber settled California prosecutors' claims about name-based checks for at least $10 million and Lyft for $250,000 (secondhand, [NPR](https://www.npr.org/transcripts/759899409)).

**Web of trust and invite trees.** Debian requires an advocate who has worked with the applicant plus a signed key and an application manager ([guide](https://www.debian.org/doc/manuals/developers-reference/new-maintainer.en.html)). Wikipedia adminship: community discussion, roughly 70 percent support needed, widely described as hostile ([RFA](https://en.wikipedia.org/wiki/Wikipedia:Requests_for_adminship)). Lobste.rs: no invites for the first 70 days, public invite tree, and on a ban moderators "will consider disabling their inviter's ability to send invitations or, rarely, also ban them" ([about](https://lobste.rs/about)). Metafilter's $5 fee has only anecdotal evidence ([Metafilter](https://www.metafilter.com/newuser.mefi)).

**Mutual aid and transformative justice.** Pod mapping (Mia Mingus, BATJC, 2014): name real people, chosen for skills and proximity as well as closeness, and ask their consent ([Build the Wheel](https://buildthewheel.org/?p=1488)). A Sussex study of UK COVID mutual aid groups found one group used a single safeguarding contact who also took anonymous reports, and told volunteers to report rather than intervene alone ([toolbox PDF](https://sussex.ac.uk/research/projects/groups-and-covid/documents/mutual-aid-toolbox-final-.pdf)). Restorative approaches to online harm are argued for normatively ([Brookings](https://www.brookings.edu/articles/the-promise-of-restorative-justice-in-addressing-online-harm)); no rigorous outcome data was found, and threats or sexual violence call for removal and reporting, not mediation.

**US legal basics.** FCRA for a purchased check: standalone disclosure, written authorization, pre-adverse-action notice with the report and CFPB summary of rights, final notice; vendors say the FTC treats volunteer screening as employment purposes ([backgroundchecks.com](https://backgroundchecks.com/fcra-compliance)). The Volunteers for Children Act authorizes fingerprint FBI checks for qualified entities through a state agency; whether an informal time bank qualifies is state by state ([Minnesota BCA](https://dps.mn.gov/divisions/bca/bca-divisions/mnjis/background-checks/employers/children-elderly-disabled/ncpavca-background-checks)). NSOPW is a free national registry search limited to registrable convictions and each jurisdiction's upkeep ([SMART](https://smart.ojp.gov/nsopw-fact-sheet)). Checkr lists about $30, $55, and $90 tiers ([pricing](https://checkr.com/pricing)); Sterling Volunteers roughly $17 to $40 ([VCU](https://equity.vcu.edu/protection-of-minors/background-check-platform/)). **No study was found** showing verified badges reduce harm; one model shows badges can help impersonators ([HICSS 2025](https://aisel.aisnet.org/hicss-58/dsm/influencers/2)).
