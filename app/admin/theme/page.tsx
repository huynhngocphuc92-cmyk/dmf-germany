import { Suspense } from "react";
import { getSiteConfigs } from "@/actions/theme-actions";
import { ThemeManagerClient, ThemeManagerSkeleton } from "./theme-client";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = "force-dynamic";

export default async function ThemeManagerPage() {
  const { data: configs, error } = await getSiteConfigs();

  if (error) {
    console.error("Error loading theme configs:", error);
  }

  return (
    <Suspense fallback={<ThemeManagerSkeleton />}>
      <ThemeManagerClient initialConfigs={configs || {}} />
    </Suspense>
  );
}
