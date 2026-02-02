import { getSiteConfigByKey } from "@/actions/theme-actions";
import { Header } from "@/components/Header";

/**
 * Server Component wrapper for Header
 * Fetches logo URL from database and passes it to Header component
 */
export async function HeaderWrapper() {
  // Try to get logo from database (priority order)
  const logoKeys = ["site_logo", "header_logo", "logo_url"];
  let logoUrl: string | null = null;

  for (const key of logoKeys) {
    const { data: config } = await getSiteConfigByKey(key);
    if (config?.value) {
      logoUrl = config.value;
      break;
    }
  }

  // Also try to get hotline and email from database
  const { data: hotlineConfig } = await getSiteConfigByKey("header_hotline");
  const { data: emailConfig } = await getSiteConfigByKey("contact_email");

  const hotline = hotlineConfig?.value || null;
  const email = emailConfig?.value || null;

  return <Header logoUrl={logoUrl} hotline={hotline} email={email} />;
}
