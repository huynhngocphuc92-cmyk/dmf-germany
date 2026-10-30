import { getSiteConfigsByKeys } from "@/actions/theme-actions";
import { Header } from "@/components/Header";

const brandingKeys = ["site_logo", "header_logo", "logo_url", "header_hotline", "contact_email"];

/** Public branding is fetched together; logo fallback priority remains unchanged. */
export async function HeaderWrapper() {
  let values = new Map<string, string | null>();
  try {
    const { data, error } = await getSiteConfigsByKeys(brandingKeys);
    values = new Map((error ? [] : (data ?? [])).map((item) => [item.key, item.value]));
  } catch {
    console.warn("[Header] Optional branding could not be loaded.");
  }
  const logoUrl =
    values.get("site_logo") || values.get("header_logo") || values.get("logo_url") || null;
  return (
    <Header
      logoUrl={logoUrl}
      hotline={values.get("header_hotline") || null}
      email={values.get("contact_email") || null}
    />
  );
}
