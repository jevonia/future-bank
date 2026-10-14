import { notFound } from "next/navigation";
import DashboardClient from "@/app/dashboard-client";
import { dashboardFixture } from "../../../../tests/fixtures/dashboard-state";

export const dynamic = "force-dynamic";

export default function DashboardFixturePage() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.BANK_QA_FIXTURE !== "1"
  ) {
    notFound();
  }

  return <DashboardClient serverState={dashboardFixture} qaReadOnly />;
}
