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

  // Debug logging
  if (configs) {
    const sections = Object.keys(configs);
    const totalItems = Object.values(configs).reduce((sum, items) => sum + items.length, 0);
    console.log(
      `Theme Manager: Loaded ${totalItems} items across ${sections.length} sections:`,
      sections
    );
  } else {
    console.log("Theme Manager: No configs loaded (configs is null or empty)");
  }

  return (
    <Suspense fallback={<ThemeManagerSkeleton />}>
      <ThemeManagerClient initialConfigs={configs || {}} />
    </Suspense>
  );
}
