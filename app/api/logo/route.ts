import { NextResponse } from "next/server";
import { loadAssets } from "@/lib/theme-helpers";

/**
 * API Route to get logo URL from database
 * Used by Client Components that need logo (e.g., RecruitBot)
 */
export async function GET() {
  try {
    // Fetch logo keys in a single batched query (same priority order as HeaderWrapper)
    const assets = await loadAssets(["site_logo", "header_logo", "logo_url"]);
    const logoUrl = assets.site_logo || assets.header_logo || assets.logo_url || null;

    return NextResponse.json({ logoUrl }, { status: 200 });
  } catch (error) {
    console.error("[Logo API] Error fetching logo:", error);
    return NextResponse.json({ logoUrl: null, error: "Failed to fetch logo" }, { status: 500 });
  }
}
