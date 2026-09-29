import type { Metadata } from "next";

// Canonical identity is independent of preview hosts and deployment environment variables.
export const SITE_URL = "https://www.dmf-talents.de";
export const SITE_NAME = "DMF Talents";
export const SITE_DESCRIPTION =
  "Personalvermittlung aus Vietnam für Unternehmen in Deutschland. Informieren Sie sich über Fachkräfte, Ausbildung und saisonalen Personalbedarf.";

export function siteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const cleanTitle = title.replace(/\s*\|\s*DMF(?: Talents| Vietnam| Germany)?(?: Blog)?\s*$/i, "");
  const socialTitle = `${cleanTitle} | ${SITE_NAME}`;
  return {
    title: cleanTitle,
    description,
    alternates: { canonical: siteUrl(path) },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: siteUrl(path),
      images: [{ url: siteUrl("/opengraph-image"), width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description },
  };
}

export const PRIVATE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const PUBLIC_ROUTES = [
  "/",
  "/services/skilled-workers",
  "/services/azubi",
  "/services/seasonal",
  "/ueber-uns/ausbildung",
  "/ueber-uns/studium",
  "/ueber-uns/skilled-workers",
  "/fuer-arbeitgeber/kandidaten",
  "/roi-rechner",
  "/fuer-arbeitgeber/roi-rechner",
  "/fuer-arbeitgeber/zeitplan",
  "/referenzen",
  "/blog",
  "/impressum",
  "/datenschutz",
] as const;
