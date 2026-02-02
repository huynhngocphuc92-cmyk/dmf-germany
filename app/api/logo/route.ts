import { NextResponse } from "next/server";
import { getSiteConfigByKey } from "@/actions/theme-actions";

/**
 * API Route to get logo URL from database
 * Used by Client Components that need logo (e.g., RecruitBot)
 */
export async function GET() {
  try {
    // Try to get logo from database (same priority order as HeaderWrapper)
    const logoKeys = ["site_logo", "header_logo", "logo_url"];
    let logoUrl: string | null = null;

    for (const key of logoKeys) {
      const { data: config } = await getSiteConfigByKey(key);
      if (config?.value) {
        logoUrl = config.value;
        break;
      }
    }

    return NextResponse.json({ logoUrl }, { status: 200 });
  } catch (error) {
    console.error("[Logo API] Error fetching logo:", error);
    return NextResponse.json({ logoUrl: null, error: "Failed to fetch logo" }, { status: 500 });
  }
}
