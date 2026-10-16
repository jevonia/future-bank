import { contactEmail } from "@/lib/site";

/**
 * Shown when a call request or a concern was saved but no steward could be
 * told: every active steward is part of the exchange, the reporter, or the
 * person the concern is about. The member gets another way to reach someone.
 */
export function NoStewardReached({ kind }: { kind: "call" | "concern" }) {
  return (
    <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
      <p className="font-bold">No steward could be reached</p>
      <p className="mt-1">
        {kind === "call"
          ? "Your request is saved, but every steward is part of this exchange or unavailable, so nobody was told."
          : "Your concern is saved, but no steward could be told. This happens when the only steward is you or the person it is about."}
      </p>
      <p className="mt-1">
        {contactEmail ? (
          <>
            Please write to the coordinator at{" "}
            <a className="font-bold underline underline-offset-2" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            , or tell someone you trust.
          </>
        ) : (
          "Please tell the coordinator or someone you trust."
        )}{" "}
        <strong>In an emergency, call 911.</strong>
      </p>
    </div>
  );
}
