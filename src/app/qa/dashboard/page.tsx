import { notFound } from "next/navigation";
import DashboardClient from "@/app/dashboard-client";
import {
  dashboardFixture,
  newMemberFixture,
} from "../../../../tests/fixtures/dashboard-state";

export const dynamic = "force-dynamic";

export default async function DashboardFixturePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.BANK_QA_FIXTURE !== "1"
  ) {
    notFound();
  }

  const { standing } = await searchParams;
  return (
    <DashboardClient
      serverState={standing === "new" ? newMemberFixture : dashboardFixture}
      qaReadOnly
    />
  );
}
