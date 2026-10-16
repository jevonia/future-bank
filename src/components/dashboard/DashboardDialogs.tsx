"use client";

import type { Offer, Want } from "@/lib/types";
import { CATEGORIES, KUDOS_LABELS } from "@/lib/types";
import type { CommunityAct } from "@/lib/community-api";
import { Dialog } from "@/components/ui/Dialog";

type ListingIntent = { kind: "offer" | "want"; item: Offer | Want };
type DialogState =
  | "none"
  | "project"
  | "donate"
  | "fund-request"
  | "contribute"
  | "kudos"
  | "exchange";
type Action = CommunityAct;

function newRequestId() {
  return crypto.randomUUID();
}

export function DashboardDialogs({
  dialog,
  closeDialog,
  intent,
  hours,
  setHours,
  note,
  setNote,
  requestExchange,
  busy,
  actionError,
  act,
  contributionRequestId,
  setContributionRequestId,
  donationRequestId,
  setDonationRequestId,
  kudosLabels,
  setKudosLabels,
  sendKudos,
}: {
  dialog: DialogState;
  closeDialog: () => void;
  intent: ListingIntent | null;
  hours: string;
  setHours: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  requestExchange: (event: React.FormEvent<HTMLFormElement>) => void;
  busy: string;
  actionError: string;
  act: Action;
  contributionRequestId: string;
  setContributionRequestId: (value: string) => void;
  donationRequestId: string;
  setDonationRequestId: (value: string) => void;
  kudosLabels: string[];
  setKudosLabels: (value: string[] | ((current: string[]) => string[])) => void;
  sendKudos: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <Dialog
        isOpen={dialog === "exchange" && !!intent}
        onClose={closeDialog}
        title={
          intent?.kind === "offer" ? "Request an exchange" : "Offer to help"
        }
            description="Agree on the number of minutes together. One hour of help equals one time credit. Accepted time is reserved until both people confirm, and cancellation releases it."
      >
        <form onSubmit={requestExchange} className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="font-bold">{intent?.item.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              With {intent?.item.profiles?.username || "a community member"}
            </p>
          </div>
          <label className="form-label">
            Agreed time in hours
            <input
              className="form-input"
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Quarter-hour increments · 15 minutes to 24 hours
            </span>
          </label>
          <label className="form-label">
            A note to start the conversation
            <textarea
              className="form-input min-h-20"
              maxLength={2000}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell them a little about what you have in mind."
            />
          </label>
          {actionError && (
            <p role="alert" className="form-error">
              {actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button className="button-primary" disabled={busy === "request"}>
              {busy === "request" ? "Sending…" : "Send request"}
            </button>
          </div>
        </form>
      </Dialog>
      <Dialog
        isOpen={dialog === "project"}
        onClose={closeDialog}
        title="Start a community project"
        description="Set a shared goal and invite neighbors to contribute volunteer time."
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const done = await act("create_project", {
              title: String(form.get("title")).trim(),
              description: String(form.get("description")).trim(),
              category: String(form.get("category")),
              goal_minutes: Math.round(Number(form.get("goal")) * 60),
            });
            if (done) closeDialog();
          }}
          className="space-y-4"
        >
          <label className="form-label">
            Project name
            <input
              name="title"
              className="form-input"
              minLength={3}
              maxLength={120}
              required
            />
          </label>
          <label className="form-label">
            What are you working on?
            <textarea
              name="description"
              className="form-input min-h-20"
              minLength={10}
              maxLength={4000}
              required
            />
          </label>
          <label className="form-label">
            Category
            <select name="category" className="form-input">
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Volunteer time goal (hours)
            <input
              name="goal"
              type="number"
              min="0.25"
              max="10000"
              step="0.25"
              defaultValue="10"
              className="form-input"
              required
            />
          </label>
          {actionError && (
            <p role="alert" className="form-error">
              {actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button className="button-primary" disabled={!!busy}>
              Create project
            </button>
          </div>
        </form>
      </Dialog>
      <Dialog
        isOpen={dialog === "contribute"}
        onClose={closeDialog}
        title="Log volunteer time"
        description="Your hours increase the project's shared progress; they do not change your personal time-credit balance."
      >
        <form
          onChange={() => setContributionRequestId(newRequestId())}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!intent) return;
            const form = new FormData(e.currentTarget);
            const done = await act("contribute_project", {
              request_id: contributionRequestId,
              project_id: intent.item.id,
              minutes: Math.round(Number(form.get("hours")) * 60),
              note: String(form.get("note")).trim(),
            });
            if (done) {
              setContributionRequestId(newRequestId());
              closeDialog();
            }
          }}
          className="space-y-4"
        >
          <label className="form-label">
            Hours contributed
            <input
              name="hours"
              className="form-input"
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              defaultValue="1"
              required
            />
          </label>
          <label className="form-label">
            What did you do?
            <textarea
              name="note"
              className="form-input min-h-20"
              maxLength={500}
            />
          </label>
          {actionError && (
            <p role="alert" className="form-error">
              {actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button className="button-primary" disabled={!!busy}>
              Log hours
            </button>
          </div>
        </form>
      </Dialog>
      <Dialog
        isOpen={dialog === "donate"}
        onClose={closeDialog}
        title="Donate time credits"
        description="Your donation goes to the shared community fund. The signed ledger will record the transfer."
      >
        <form
          onChange={() => setDonationRequestId(newRequestId())}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const done = await act("donate", {
              request_id: donationRequestId,
              minutes: Math.round(Number(form.get("hours")) * 60),
              note: String(form.get("note")).trim(),
            });
            if (done) {
              setDonationRequestId(newRequestId());
              closeDialog();
            }
          }}
          className="space-y-4"
        >
          <label className="form-label">
            Donation in hours
            <input
              name="hours"
              className="form-input"
              type="number"
              min="0.25"
              max="100"
              step="0.25"
              defaultValue="1"
              required
            />
          </label>
          <label className="form-label">
            Note <span className="font-normal text-slate-500">(optional)</span>
            <input name="note" className="form-input" maxLength={240} />
          </label>
          {actionError && (
            <p role="alert" className="form-error">
              {actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button className="button-primary" disabled={!!busy}>
              Donate credits
            </button>
          </div>
        </form>
      </Dialog>
      <Dialog
        isOpen={dialog === "fund-request"}
        onClose={closeDialog}
        title="Request support from the fund"
        description="Only community facilitators can review this private request. Please share only what you are comfortable disclosing."
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const done = await act("request_fund", {
              minutes: Math.round(Number(form.get("hours")) * 60),
              reason: String(form.get("reason")).trim(),
            });
            if (done) closeDialog();
          }}
          className="space-y-4"
        >
          <label className="form-label">
            Credits requested (hours)
            <input
              name="hours"
              className="form-input"
              type="number"
              min="0.25"
              max="100"
              step="0.25"
              defaultValue="1"
              required
            />
          </label>
          <label className="form-label">
            What would this support?
            <textarea
              name="reason"
              className="form-input min-h-24"
              maxLength={1500}
              required
            />
          </label>
          {actionError && (
            <p role="alert" className="form-error">
              {actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button className="button-primary" disabled={!!busy}>
              Send private request
            </button>
          </div>
        </form>
      </Dialog>
      <Dialog
        isOpen={dialog === "kudos"}
        onClose={closeDialog}
        title="Say thank you"
        description="A short note can make a completed exchange feel seen."
      >
        <form onSubmit={sendKudos} className="space-y-4">
          <fieldset>
            <legend className="form-label mb-2">
              Choose what you appreciated
            </legend>
            <div className="flex flex-wrap gap-2">
              {KUDOS_LABELS.map((label) => (
                <label
                  key={label}
                  className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold ${kudosLabels.includes(label) ? "border-violet-400 bg-violet-50 text-violet-900" : "border-slate-200 text-slate-600"}`}
                >
                  <input
                    className="sr-only"
                    type="checkbox"
                    checked={kudosLabels.includes(label)}
                    onChange={() =>
                      setKudosLabels((current) =>
                        current.includes(label)
                          ? current.filter((item) => item !== label)
                          : [...current, label],
                      )
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="form-label">
            Your note
            <textarea
              className="form-input min-h-20"
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thank you for…"
            />
          </label>
          {actionError && (
            <p role="alert" className="form-error">
              {actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button className="button-primary" disabled={busy === "kudos"}>
              Send kudos
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
