import { loadAssets } from "@/lib/theme-helpers";
import { Header } from "@/components/Header";

/**
 * Server Component wrapper for Header
 * Fetches logo URL and contact info from database in a single batched query
 */
export async function HeaderWrapper() {
  let logoUrl: string | null = null;
  let hotline: string | null = null;
  let email: string | null = null;

  try {
    const assets = await loadAssets([
      "site_logo",
      "header_logo",
      "logo_url",
      "header_hotline",
      "contact_email",
    ]);

    logoUrl = assets.site_logo || assets.header_logo || assets.logo_url || null;
    hotline = assets.header_hotline || null;
    email = assets.contact_email || null;
  } catch (error) {
    console.error("HeaderWrapper fetch error:", error);
  }

  return <Header logoUrl={logoUrl} hotline={hotline} email={email} />;
}
