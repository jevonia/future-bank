"use client";
import { Dialog } from "@/components/ui/Dialog";

export function WelcomeModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null };
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Welcome${user.name ? `, ${user.name}` : ""} to New Future Bank`}
      description="Share what you know, ask for the help you need, and strengthen your community together."
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">
          New members receive 2 time credits to make their first exchange
          possible. Every hour of help is one credit, and every contribution
          helps your neighbors thrive.
        </p>
        <button onClick={onClose} className="button-primary w-full">
          Explore the community
        </button>
      </div>
    </Dialog>
  );
}
