"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppState, Offer, Want } from "@/lib/types";
import { CRITERIA_LABELS, formatCredits } from "@/lib/types";
import { mutateCommunity, type CommunityAction } from "@/lib/community-api";
import { Header } from "@/components/dashboard/Header";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ExchangeDesk } from "@/components/dashboard/ExchangeDesk";
import { DashboardDialogs } from "@/components/dashboard/DashboardDialogs";
import { AddOfferModal } from "@/components/modals/AddOfferModal";
import { AddWantModal } from "@/components/modals/AddWantModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { EmailConfirmationBanner } from "@/components/EmailConfirmationBanner";
import { Landing } from "@/components/landing/Landing";
import { GettingStarted } from "@/components/dashboard/GettingStarted";
import { PlusGlyph, StarGlyph } from "@/components/illustrations";
import { buildStandingIndex } from "@/lib/standing-view";
import { MIN_STANDING_LABELS, meetsMinimum } from "@/lib/standing";
import { StandingBadge } from "@/components/standing/StandingBadge";
import {
  StandingDialogs,
  type StandingDialog,
} from "@/components/standing/StandingDialogs";
import { Gatherings, YourStanding } from "@/components/standing/StandingPanel";
import { StewardDesk } from "@/components/standing/StewardDesk";
import { SafetyCard } from "@/components/standing/SafetyCard";

type Intent = { kind: "offer" | "want"; item: Offer | Want };
type DialogState =
  | "none"
  | "project"
  | "donate"
  | "fund-request"
  | "contribute"
  | "kudos"
  | "exchange";
const button =
  "rounded-full px-3.5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55";

function Member({
  name,
  className = "",
}: {
  name?: string | null;
  className?: string;
}) {
  const label = name?.trim() || "Community member";
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800 ring-2 ring-white ${className}`}
      aria-label={label}
    >
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-7 text-center text-sm leading-6 text-slate-500">
      {children}
    </div>
  );
}

function newRequestId() {
  return crypto.randomUUID();
}

export default function DashboardClient({
  serverState,
  qaReadOnly = false,
}: {
  serverState: AppState;
  qaReadOnly?: boolean;
}) {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [wantOpen, setWantOpen] = useState(false);
  const [offerDraft, setOfferDraft] = useState<Offer | undefined>();
  const [wantDraft, setWantDraft] = useState<Want | undefined>();
  const [dialog, setDialog] = useState<DialogState>("none");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [marketTab, setMarketTab] = useState<"offers" | "wants">("offers");
  const [wantFormat, setWantFormat] = useState<"any" | "virtual" | "in-person">(
    "any",
  );
  const [hours, setHours] = useState("1");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [kudosLabels, setKudosLabels] = useState<string[]>([]);
  const [donationRequestId, setDonationRequestId] = useState(() =>
    newRequestId(),
  );
  const [contributionRequestId, setContributionRequestId] = useState(() =>
    newRequestId(),
  );
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const [standingDialog, setStandingDialogState] =
    useState<StandingDialog | null>(null);
  const standing = useMemo(
    () => buildStandingIndex(serverState),
    [serverState],
  );

  const currentUserId = serverState.user?.id;
  const summary = serverState.publicSummary;
  const currentExchange =
    serverState.exchanges.find(
      (exchange) => exchange.id === selectedExchange,
    ) ||
    serverState.exchanges.find((exchange) => exchange.status === "accepted") ||
    serverState.exchanges.find((exchange) => exchange.status === "pending") ||
    serverState.exchanges[0] ||
    null;
  const liveExchanges = [...serverState.exchanges].sort(
    (a, b) =>
      Number(["pending", "accepted"].includes(b.status)) -
      Number(["pending", "accepted"].includes(a.status)),
  );
  const searchText = query.trim().toLocaleLowerCase();
  const availableCategories = useMemo(
    () => [
      "All categories",
      ...new Set(
        [...serverState.marketplaceOffers, ...serverState.marketplaceWants]
          .map((item) => item.category)
          .filter(Boolean),
      ),
    ],
    [serverState.marketplaceOffers, serverState.marketplaceWants],
  );
  const visibleOffers = useMemo(
    () =>
      serverState.marketplaceOffers.filter(
        (item) =>
          item.active &&
          item.user_id !== currentUserId &&
          (category === "All categories" || item.category === category) &&
          `${item.title} ${item.description} ${item.category} ${item.profiles?.username || ""}`
            .toLocaleLowerCase()
            .includes(searchText),
      ),
    [serverState.marketplaceOffers, currentUserId, category, searchText],
  );
  const visibleWants = useMemo(
    () =>
      serverState.marketplaceWants.filter(
        (item) =>
          item.active &&
          item.user_id !== currentUserId &&
          (category === "All categories" || item.category === category) &&
          (wantFormat === "any" ||
            (wantFormat === "virtual"
              ? item.criteria?.includes("virtual_ok")
              : item.criteria?.includes("in_person_only"))) &&
          `${item.title} ${item.description} ${item.category} ${item.profiles?.username || ""}`
            .toLocaleLowerCase()
            .includes(searchText),
      ),
    [
      serverState.marketplaceWants,
      currentUserId,
      category,
      searchText,
      wantFormat,
    ],
  );

  async function act(
    action: CommunityAction,
    payload: Record<string, unknown>,
    key: string = action,
  ) {
    if (qaReadOnly) return false;
    setBusy(key);
    setActionError("");
    try {
      await mutateCommunity(action, payload);
      router.refresh();
      return true;
    } catch (reason) {
      setActionError(
        reason instanceof Error
          ? reason.message
          : "That action could not be completed. Please try again.",
      );
      return false;
    } finally {
      setBusy("");
    }
  }

  function editListing(kind: "offer" | "want", item: Offer | Want) {
    if (kind === "offer") {
      setOfferDraft(item as Offer);
      setOfferOpen(true);
    } else {
      setWantDraft(item as Want);
      setWantOpen(true);
    }
  }

  function openRequest(kind: "offer" | "want", item: Offer | Want) {
    setIntent({ kind, item });
    setHours("1");
    setNote("");
    setDialog("exchange");
    setActionError("");
  }

  async function requestExchange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!intent) return;
    const parsedHours = Number(hours);
    const minutes = Math.round(parsedHours * 60);
    if (!Number.isFinite(parsedHours) || minutes < 15 || minutes > 24 * 60) {
      setActionError("Choose between 15 minutes and 24 hours.");
      return;
    }
    const done = await act(
      "request_exchange",
      {
        listing_kind: intent.kind,
        listing_id: intent.item.id,
        minutes,
        note: note.trim(),
      },
      "request",
    );
    if (done) setDialog("none");
  }

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentExchange || !message.trim()) return;
    const done = await act(
      "send_message",
      { exchange_id: currentExchange.id, body: message.trim() },
      "message",
    );
    if (done) setMessage("");
  }

  async function sendKudos(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentExchange) return;
    if (kudosLabels.length === 0) {
      setActionError("Choose at least one thank-you label.");
      return;
    }
    const done = await act(
      "give_kudos",
      {
        exchange_id: currentExchange.id,
        labels: kudosLabels,
        note: note.trim(),
      },
      "kudos",
    );
    if (done) {
      setDialog("none");
      setKudosLabels([]);
      setNote("");
    }
  }

  function setStandingDialog(next: StandingDialog | null) {
    setActionError("");
    setStandingDialogState(next);
  }

  /** Owner name, standing word, and the "Who can say yes?" gate on a listing. */
  function listingFooter(
    kind: "offer" | "want",
    item: Offer | Want,
    buttonClass: string,
    label: string,
  ) {
    const owner = item.profiles?.username || "Community member";
    const min = item.min_standing ?? "anyone";
    const viewerPaused = standing.paused.has(currentUserId ?? "");
    const allowed =
      !serverState.standingReady ||
      (!viewerPaused &&
        meetsMinimum(standing.levelOf(currentUserId ?? ""), min));
    return (
      <>
        {serverState.standingReady && min !== "anyone" && (
          <p className="mt-3 text-xs font-semibold text-slate-600">
            Who can say yes: {MIN_STANDING_LABELS[min]}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {serverState.standingReady ? (
            <button
              className="flex items-center gap-2 text-left text-xs text-slate-600 hover:underline"
              onClick={() =>
                setStandingDialog({ kind: "neighbor", memberId: item.user_id })
              }
              aria-label={`About ${owner}`}
            >
              {owner}
              <StandingBadge level={standing.levelOf(item.user_id)} />
            </button>
          ) : (
            <span className="text-xs text-slate-500">{owner}</span>
          )}
          <button
            className={`${button} ${buttonClass}`}
            disabled={!allowed}
            onClick={() => openRequest(kind, item)}
          >
            {label}
          </button>
        </div>
        {!allowed && (
          <p className="mt-2 text-xs leading-5 text-slate-600">
            {viewerPaused
              ? "A steward has asked to talk with you before your next exchange."
              : min === "known"
                ? "This neighbor asked for Known neighbors."
                : "This neighbor asked for members a steward has met. Come to a gathering to be introduced."}
          </p>
        )}
      </>
    );
  }

  function closeDialog() {
    setDialog("none");
    setActionError("");
    setIntent(null);
  }

  useEffect(() => {
    if (!currentUserId || qaReadOnly) return;
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const interval = window.setInterval(refreshWhenVisible, 45_000);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [currentUserId, qaReadOnly, router]);

  if (!serverState.user) {
    return (
      <>
        <Landing
          summary={summary}
          configured={serverState.configured}
          error={serverState.error}
          onJoin={() => setLoginOpen(true)}
        />
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  const user = serverState.user;
  const profileError = (
    serverState as AppState & { profileError?: string | null }
  ).profileError;
  const ownListings = [
    ...serverState.offers.map((item) => ({ kind: "offer" as const, item })),
    ...serverState.wants.map((item) => ({ kind: "want" as const, item })),
  ];
  const messages = currentExchange
    ? serverState.messages.filter(
        (item) => item.exchange_id === currentExchange.id,
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#201c35]">
      {qaReadOnly ? (
        <div className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950">
          Development fixture preview · all controls are disabled
        </div>
      ) : (
        <Header
          user={user}
          profile={serverState.profile}
          onSignInClick={() => setLoginOpen(true)}
          onProfileUpdated={() => router.refresh()}
        />
      )}
      <main
        inert={qaReadOnly}
        className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-7 lg:px-8"
      >
        <EmailConfirmationBanner />
        {serverState.error && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            {serverState.error}
          </div>
        )}
        {profileError && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Your profile could not be loaded: {profileError}
          </div>
        )}
        {actionError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
          >
            <span>{actionError}</span>
            <button
              onClick={() => setActionError("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}
        <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#141a4a] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-200">
              Your community, in motion
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Good to see you,{" "}
              {serverState.profile?.username ||
                user.email?.split("@")[0] ||
                "neighbor"}
              .
            </h1>
            <p className="mt-2 text-sm text-white/70">
              What would help your community move forward today?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setOfferDraft(undefined);
                setOfferOpen(true);
              }}
              className="rounded-full bg-[#ffc93c] px-5 py-3 text-sm font-bold text-[#141a4a] hover:bg-[#ffd766]"
            >
              <span className="inline-flex items-center gap-1.5">
                <PlusGlyph /> Share an offer
              </span>
            </button>
            <button
              onClick={() => {
                setWantDraft(undefined);
                setWantOpen(true);
              }}
              className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Ask for help
            </button>
          </div>
        </section>
        <GettingStarted
          hasOffer={serverState.offers.length > 0}
          hasRequest={serverState.wants.length > 0}
          hasExchange={serverState.exchanges.length > 0}
          onOffer={() => {
            setOfferDraft(undefined);
            setOfferOpen(true);
          }}
          onRequest={() => {
            setWantDraft(undefined);
            setWantOpen(true);
          }}
        />
        {serverState.standingReady && currentUserId && (
          <>
            <section className="grid gap-5 lg:grid-cols-2">
              <YourStanding
                state={serverState}
                index={standing}
                currentUserId={currentUserId}
              />
              <Gatherings
                state={serverState}
                index={standing}
                currentUserId={currentUserId}
                onDialog={setStandingDialog}
              />
            </section>
            {serverState.isSteward && (
              <StewardDesk
                state={serverState}
                index={standing}
                currentUserId={currentUserId}
                onDialog={setStandingDialog}
              />
            )}
          </>
        )}
        <section className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <DashboardCard title="Community pulse" eyebrow="Real activity">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                [summary.member_count, "members"],
                [summary.completed_exchanges, "completed exchanges"],
                [formatCredits(summary.contributed_minutes), "hours shared"],
                [summary.active_projects, "active projects"],
              ].map(([value, label]) => (
                <div
                  key={String(label)}
                  className="rounded-xl bg-[#f4f6fb] p-4"
                >
                  <p className="text-2xl font-bold text-violet-800">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
          <DashboardCard title="Your time balance" eyebrow="1 hour = 1 TC">
            <div className="flex items-end justify-between gap-3">
              <p className="text-5xl font-bold tracking-tight text-violet-800">
                {formatCredits((serverState.profile?.time_balance || 0) * 60)}
                <span className="ml-2 text-base font-semibold">TC</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-violet-50 px-4 py-3 text-sm">
              <p className="font-semibold text-violet-950">
                Available: {formatCredits(serverState.availableMinutes)} TC
              </p>
              {serverState.reservedMinutes > 0 && (
                <p className="text-slate-600">
                  Reserved for accepted exchanges: {formatCredits(serverState.reservedMinutes)} TC
                </p>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your hours are recorded in a signed ledger. Project volunteering
              adds to shared progress, not your personal credit balance.
            </p>
          </DashboardCard>
        </section>

        <DashboardCard
          id="find-a-neighbor"
          title="Find a neighbor"
          eyebrow="Member directory"
          className="scroll-mt-28"
        >
          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="flex rounded-full bg-slate-100 p-1"
              role="tablist"
              aria-label="Browse listings"
            >
              <button
                role="tab"
                aria-selected={marketTab === "offers"}
                onClick={() => setMarketTab("offers")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${marketTab === "offers" ? "bg-white text-violet-800 shadow-sm" : "text-slate-600"}`}
              >
                Offers
              </button>
              <button
                role="tab"
                aria-selected={marketTab === "wants"}
                onClick={() => setMarketTab("wants")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${marketTab === "wants" ? "bg-white text-violet-800 shadow-sm" : "text-slate-600"}`}
              >
                Requests
              </button>
            </div>
            <input
              aria-label="Search listings"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search skills, needs, or neighbors"
              className="form-input mt-0 min-w-0"
            />
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="form-input mt-0"
            >
              {availableCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {marketTab === "wants" && (
              <select
                aria-label="Filter requests by format"
                value={wantFormat}
                onChange={(event) =>
                  setWantFormat(event.target.value as typeof wantFormat)
                }
                className="form-input mt-0"
              >
                <option value="any">Any format</option>
                <option value="virtual">Virtual welcome</option>
                <option value="in-person">In person only</option>
              </select>
            )}
          </div>
          {serverState.standingReady && (
            <p className="-mt-2 mb-4 text-sm leading-6 text-slate-600">
              Words like Introduced and Known say how well the community knows
              someone. They are not a safety promise. Tap a name to see what
              they mean, or read{" "}
              <a href="/standing" className="font-bold text-violet-800 underline">
                how standing works
              </a>
              .
            </p>
          )}
          {marketTab === "offers" ? (
            visibleOffers.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {visibleOffers.map((item) => (
                  <article
                    key={item.id}
                    className="card-hover rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800">
                          {item.category}
                        </span>
                        <h3 className="mt-3 font-bold">{item.title}</h3>
                      </div>
                      <Member name={item.profiles?.username} />
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {item.description || "No additional details yet."}
                    </p>
                    {listingFooter(
                      "offer",
                      item,
                      "bg-violet-700 text-white hover:bg-violet-800",
                      "Ask about this",
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <Empty>
                {serverState.marketplaceOffers.length
                  ? "No offers match your search. Try another phrase or category."
                  : "No active offers yet. Be the first to share something you can do."}
              </Empty>
            )
          ) : visibleWants.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {visibleWants.map((item) => (
                <article
                  key={item.id}
                  className="card-hover rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-800">
                        {item.category}
                      </span>
                      {item.is_urgent && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                          Urgent
                        </span>
                      )}
                    </div>
                    <Member name={item.profiles?.username} />
                  </div>
                  <h3 className="mt-3 font-bold">{item.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.description || "No additional details yet."}
                  </p>
                  {!!item.criteria?.length && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.criteria.map((criteria) => (
                        <span
                          key={criteria}
                          className="rounded-full bg-slate-100 px-2 py-1 text-[.68rem] text-slate-600"
                        >
                          {CRITERIA_LABELS[
                            criteria as keyof typeof CRITERIA_LABELS
                          ] || criteria}
                        </span>
                      ))}
                    </div>
                  )}
                  {listingFooter(
                    "want",
                    item,
                    "bg-teal-700 text-white hover:bg-teal-800",
                    "Offer to help",
                  )}
                </article>
              ))}
            </div>
          ) : (
            <Empty>
              {serverState.marketplaceWants.length
                ? "No requests match your search. Try another phrase or category."
                : "No active requests yet."}
            </Empty>
          )}
        </DashboardCard>

        <section className="grid gap-5 lg:grid-cols-2">
          <DashboardCard
            title="My listings"
            eyebrow="Your corner of the community"
            onAdd={() => {
              setOfferDraft(undefined);
              setOfferOpen(true);
            }}
            addLabel="Add offer"
          >
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setOfferDraft(undefined);
                  setOfferOpen(true);
                }}
                className={`${button} bg-violet-50 text-violet-800`}
              >
                <span className="inline-flex items-center gap-1">
                  <PlusGlyph className="h-3.5 w-3.5" /> Offer
                </span>
              </button>
              <button
                onClick={() => {
                  setWantDraft(undefined);
                  setWantOpen(true);
                }}
                className={`${button} bg-teal-50 text-teal-800`}
              >
                <span className="inline-flex items-center gap-1">
                  <PlusGlyph className="h-3.5 w-3.5" /> Request help
                </span>
              </button>
            </div>
            {ownListings.length ? (
              <div className="space-y-3">
                {ownListings.map(({ kind, item }) => (
                  <article
                    key={`${kind}-${item.id}`}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span
                          className={`rounded-full px-2 py-1 text-[.68rem] font-bold ${kind === "offer" ? "bg-teal-50 text-teal-800" : "bg-violet-50 text-violet-800"}`}
                        >
                          {kind === "offer" ? "Offering" : "Requesting"} ·{" "}
                          {item.category}
                        </span>
                        <h3 className="mt-2 font-bold">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.description || "No description provided."}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editListing(kind, item)}
                          className={`${button} border border-slate-200 text-slate-700`}
                        >
                          Edit
                        </button>
                        <button
                          disabled={busy === `archive-${kind}-${item.id}`}
                          onClick={() =>
                            act(
                              "archive_listing",
                              { kind, id: item.id },
                              `archive-${kind}-${item.id}`,
                            )
                          }
                          className={`${button} bg-slate-100 text-slate-700`}
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                    {kind === "want" && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <span className="text-xs text-slate-500">
                          Urgent request alert
                        </span>
                        <button
                          aria-pressed={(item as Want).is_urgent}
                          className={`${button} ${(item as Want).is_urgent ? "bg-amber-100 text-amber-900" : "border border-slate-200 text-slate-700"}`}
                          disabled={busy === `amplify-${item.id}`}
                          onClick={() =>
                            act(
                              "amplify_want",
                              { id: item.id },
                              `amplify-${item.id}`,
                            )
                          }
                        >
                          {(item as Want).is_urgent
                            ? "Amplified"
                            : "Mark urgent & amplify"}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <Empty>
                Your offers and requests will live here. Add one to help
                neighbors find you.
              </Empty>
            )}
          </DashboardCard>
          <ExchangeDesk
            exchanges={liveExchanges}
            currentExchange={currentExchange}
            currentUserId={currentUserId!}
            messages={messages}
            selectedExchange={selectedExchange}
            message={message}
            busy={busy}
            onSelect={setSelectedExchange}
            onMessageChange={setMessage}
            onSendMessage={sendMessage}
            onAction={act}
            onKudos={() => {
              setSelectedExchange(currentExchange?.id ?? null);
              setNote("");
              setKudosLabels([]);
              setDialog("kudos");
            }}
            {...(serverState.standingReady
              ? {
                  onOpenMember: (memberId: string) =>
                    setStandingDialog({ kind: "neighbor", memberId }),
                  onConcern: (exchange: (typeof liveExchanges)[number]) =>
                    setStandingDialog({
                      kind: "concern",
                      aboutId: null,
                      exchangeId: exchange.id,
                    }),
                  renderSafety: (exchange: (typeof liveExchanges)[number]) => (
                    <SafetyCard
                      key={exchange.id}
                      exchange={exchange}
                      exchanges={serverState.exchanges}
                      currentUserId={currentUserId!}
                      otherName={standing.name(
                        exchange.provider_id === currentUserId
                          ? exchange.requester_id
                          : exchange.provider_id,
                      )}
                      state={serverState}
                      act={act}
                      busy={busy}
                    />
                  ),
                }
              : {})}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <DashboardCard
            title="Community projects"
            eyebrow="Volunteer hours"
            onAdd={() => setDialog("project")}
            addLabel="Start a project"
          >
            <p className="-mt-2 mb-4 text-sm text-slate-600">
              Log volunteer time to show collective progress. Project hours do
              not add credits to personal balances.
            </p>
            {serverState.projects.length ? (
              <div className="space-y-3">
                {serverState.projects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-teal-50 px-2 py-1 text-[.68rem] font-bold text-teal-800">
                          {project.category}
                        </span>
                        <h3 className="mt-2 font-bold">{project.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {project.description}
                        </p>
                      </div>
                      {project.active ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-800">
                          Open
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          Closed
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>
                          {formatCredits(project.current_minutes)} /{" "}
                          {formatCredits(project.goal_minutes)} hours
                        </span>
                        <span>{project.contributor_count} contributors</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-600"
                          style={{
                            width: `${Math.min(100, project.goal_minutes ? (100 * project.current_minutes) / project.goal_minutes : 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                    {project.active && (
                      <div className="mt-3 flex gap-2">
                        <button
                          className={`${button} bg-teal-700 text-white`}
                          onClick={() => {
                            setIntent({
                              kind: "offer",
                              item: {
                                ...project,
                                id: project.id,
                              } as unknown as Offer,
                            });
                            setHours("1");
                            setNote("");
                            setContributionRequestId(newRequestId());
                            setDialog("contribute");
                          }}
                        >
                          Log volunteer hours
                        </button>
                        {project.owner_id === currentUserId && (
                          <button
                            className={`${button} bg-slate-100 text-slate-700`}
                            disabled={!!busy}
                            onClick={() =>
                              act("close_project", { id: project.id })
                            }
                          >
                            Close project
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <Empty>
                No community projects yet. Start one around something your
                neighbors want to build.
              </Empty>
            )}
          </DashboardCard>
          <div className="space-y-5">
            <DashboardCard title="Community fund" eyebrow="A shared safety net">
              <div className="rounded-2xl bg-[#141a4a] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-200">
                  Time credits available
                </p>
                <p className="mt-2 text-4xl font-bold">
                  {formatCredits(serverState.communityFund.balance_minutes)}{" "}
                  <span className="text-base">TC</span>
                </p>
                <p className="mt-2 text-xs leading-5 text-white/70">
                  Donations and requests are handled privately. Fund requests go
                  to community facilitators for review.
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className={`${button} bg-violet-50 text-violet-800`}
                  onClick={() => {
                    setNote("");
                    setHours("1");
                    setDonationRequestId(newRequestId());
                    setDialog("donate");
                  }}
                >
                  Donate time
                </button>
                <button
                  className={`${button} bg-teal-50 text-teal-800`}
                  onClick={() => {
                    setNote("");
                    setHours("1");
                    setDialog("fund-request");
                  }}
                >
                  Request support
                </button>
              </div>
              {serverState.fundRequests.filter(
                (item) => item.user_id === currentUserId,
              ).length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold text-slate-600">
                    Your private requests
                  </p>
                  {serverState.fundRequests
                    .filter((item) => item.user_id === currentUserId)
                    .map((item) => (
                      <p
                        key={item.id}
                        className="mt-2 flex justify-between gap-2 text-xs text-slate-600"
                      >
                        <span>
                          {formatCredits(item.minutes)} TC · {item.reason}
                        </span>
                        <span className="font-bold capitalize">
                          {item.status}
                        </span>
                      </p>
                    ))}
                </div>
              )}
              {serverState.isFacilitator &&
                serverState.fundRequests.some(
                  (item) => item.status === "pending",
                ) && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="mb-2 text-xs font-bold text-slate-600">
                      Pending facilitator review
                    </p>
                    {serverState.fundRequests
                      .filter((item) => item.status === "pending")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="mb-2 rounded-lg bg-slate-50 p-3"
                        >
                          <p className="text-sm font-semibold">
                            {formatCredits(item.minutes)} TC ·{" "}
                            {item.member?.username || "Member"}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            {item.reason}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              className={`${button} bg-teal-700 text-white`}
                              disabled={!!busy}
                              onClick={() =>
                                act("review_fund", {
                                  id: item.id,
                                  decision: "approve",
                                })
                              }
                            >
                              Approve
                            </button>
                            <button
                              className={`${button} bg-slate-200 text-slate-700`}
                              disabled={!!busy}
                              onClick={() =>
                                act("review_fund", {
                                  id: item.id,
                                  decision: "decline",
                                })
                              }
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
            </DashboardCard>
            <DashboardCard
              title="Urgent request alerts"
              eyebrow="Your notification choices"
            >
              <p className="text-sm leading-6 text-slate-600">
                Opt in to get notified when a neighbor amplifies a
                time-sensitive request.
              </p>
              <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-amber-50 p-3">
                <span className="text-sm font-semibold text-amber-950">
                  Receive urgent alerts
                </span>
                <input
                  type="checkbox"
                  checked={serverState.urgentOptIn}
                  disabled={!!busy}
                  onChange={(e) =>
                    act("set_urgent_opt_in", { enabled: e.target.checked })
                  }
                  className="h-5 w-5 accent-amber-600"
                />
              </label>
            </DashboardCard>
          </div>
        </section>

        <DashboardCard
          title="Kudos you’ve received"
          eyebrow="A little appreciation"
        >
          <p className="-mt-2 mb-4 text-sm text-slate-600">
            Thank-yous from neighbors after completed exchanges.
          </p>
          {serverState.kudos.filter(
            (item) => item.recipient_id === currentUserId,
          ).length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {serverState.kudos
                .filter((item) => item.recipient_id === currentUserId)
                .map((item) => {
                  const exchange = serverState.exchanges.find(
                    (entry) => entry.id === item.exchange_id,
                  );
                  const senderName =
                    item.sender_id === exchange?.provider_id
                      ? exchange?.provider?.username
                      : item.sender_id === exchange?.requester_id
                        ? exchange?.requester?.username
                        : null;
                  return (
                    <article
                      key={item.id}
                      className="rounded-xl border border-amber-100 bg-amber-50/60 p-4"
                    >
                      <p className="text-sm font-bold text-slate-900">
                        From {senderName || "a community member"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.labels.map((label) => (
                          <span
                            key={label}
                            className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-900"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      {item.note && (
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          “{item.note}”
                        </p>
                      )}
                      <time className="mt-3 block text-[.68rem] text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </time>
                    </article>
                  );
                })}
            </div>
          ) : (
            <Empty>Kudos from completed exchanges will show up here.</Empty>
          )}
        </DashboardCard>
        <section className="grid gap-5 lg:grid-cols-2">
          <DashboardCard title="Notifications" eyebrow="For you">
            {serverState.notifications.length ? (
              <div className="space-y-2">
                {serverState.notifications.slice(0, 12).map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-xl p-3 ${item.read_at ? "bg-slate-50" : "bg-violet-50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.body}
                        </p>
                        <time className="mt-2 block text-[.68rem] text-slate-400">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      </div>
                      {!item.read_at && (
                        <button
                          aria-label={`Mark ${item.title} as read`}
                          className="text-xs font-bold text-violet-800 underline"
                          disabled={!!busy}
                          onClick={() =>
                            act("read_notifications", { ids: [item.id] })
                          }
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty>
                No notifications yet. New exchange activity will appear here.
              </Empty>
            )}
            {serverState.notifications.some((item) => !item.read_at) && (
              <button
                className="mt-3 text-xs font-bold text-violet-800 underline"
                disabled={!!busy}
                onClick={() =>
                  act("read_notifications", {
                    ids: serverState.notifications
                      .filter((item) => !item.read_at)
                      .map((item) => item.id),
                  })
                }
              >
                Mark all as read
              </button>
            )}
          </DashboardCard>
          <DashboardCard title="Time ledger" eyebrow="Your signed history">
            <p className="-mt-2 mb-4 text-sm text-slate-600">
              A record of time credits earned and used. Amounts are exact to the
              minute.
            </p>
            {serverState.transactions.length ? (
              <div className="divide-y divide-slate-100">
                {serverState.transactions.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {entry.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(entry.created_at).toLocaleDateString()} ·
                        Balance {formatCredits(entry.balance_after_minutes)} TC
                      </p>
                    </div>
                    <span
                      className={`shrink-0 font-bold ${entry.amount_minutes >= 0 ? "text-teal-700" : "text-rose-700"}`}
                    >
                      {entry.amount_minutes > 0 ? "+" : ""}
                      {formatCredits(entry.amount_minutes)} TC
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>
                Your completed exchanges and fund activity will appear in this
                ledger.
              </Empty>
            )}
          </DashboardCard>
        </section>

        <DashboardCard
          title="Your contribution constellation"
          eyebrow="Hours shared"
        >
          <p className="-mt-2 mb-4 text-sm text-slate-600">
            Each star represents time you have given to neighbors and community
            projects.
          </p>
          <div className="relative min-h-44 overflow-hidden rounded-2xl bg-[#141a4a] p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,107,117,.45),transparent_60%)]" />
            {serverState.contributions.filter(
              (item) => item.user_id === currentUserId,
            ).length === 0 &&
            serverState.transactions.filter(
              (item) => item.kind === "exchange" && item.amount_minutes > 0,
            ).length === 0 ? (
              <div className="relative grid min-h-36 place-items-center text-center text-sm text-white/70">
                Your constellation will appear as you share time. Every exchange
                makes the community brighter.
              </div>
            ) : (
              <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(
                  serverState.contributions
                    .filter((item) => item.user_id === currentUserId)
                    .reduce<Record<string, number>>((acc, item) => {
                      acc[item.member?.username || "Community projects"] =
                        (acc[item.member?.username || "Community projects"] ||
                          0) + item.minutes;
                      return acc;
                    }, {}),
                )
                  .concat(
                    serverState.transactions
                      .filter(
                        (item) =>
                          item.kind === "exchange" && item.amount_minutes > 0,
                      )
                      .map(
                        (item) =>
                          [item.description, item.amount_minutes] as [
                            string,
                            number,
                          ],
                      ),
                  )
                  .slice(0, 12)
                  .map(([label, minutes], index) => (
                    <div
                      key={`${label}-${index}`}
                      className="constellation-star flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <StarGlyph className="h-5 w-5 shrink-0 text-amber-200" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">
                          {label}
                        </p>
                        <p className="text-[.68rem] text-white/60">
                          {formatCredits(minutes)} hours
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </DashboardCard>
      </main>

      {!qaReadOnly && (
        <>
          <AddOfferModal
            isOpen={offerOpen}
            initialData={offerDraft}
            onClose={() => setOfferOpen(false)}
            onOfferAdded={() => router.refresh()}
            showWhoCanSayYes={serverState.standingReady}
          />
          <AddWantModal
            isOpen={wantOpen}
            initialData={wantDraft}
            onClose={() => setWantOpen(false)}
            onWantAdded={() => router.refresh()}
            showWhoCanSayYes={serverState.standingReady}
          />
          <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
          <DashboardDialogs
            dialog={dialog}
            closeDialog={closeDialog}
            intent={intent}
            hours={hours}
            setHours={setHours}
            note={note}
            setNote={setNote}
            requestExchange={requestExchange}
            busy={busy}
            actionError={actionError}
            act={act}
            contributionRequestId={contributionRequestId}
            setContributionRequestId={setContributionRequestId}
            donationRequestId={donationRequestId}
            setDonationRequestId={setDonationRequestId}
            kudosLabels={kudosLabels}
            setKudosLabels={setKudosLabels}
            sendKudos={sendKudos}
          />
        </>
      )}
      {/* Kept in the read-only preview so the wording can be reviewed; act()
          does nothing there. */}
      {currentUserId && (
        <StandingDialogs
          dialog={standingDialog}
          setDialog={setStandingDialog}
          state={serverState}
          index={standing}
          currentUserId={currentUserId}
          act={act}
          busy={busy}
          actionError={actionError}
        />
      )}
    </div>
  );
}
