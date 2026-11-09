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
  const mdPath = path === "/" ? "/index.md" : `${path.replace(/\/$/, "")}.md`;
  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: siteUrl(path),
      types: {
        "text/markdown": siteUrl(mdPath),
      },
    },
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
  "/fuer-arbeitgeber/branchen",
  "/fuer-arbeitgeber/branchen/pflege-gesundheit",
  "/fuer-arbeitgeber/branchen/gastronomie-hotellerie",
  "/fuer-arbeitgeber/branchen/handwerk-bau",
  "/fuer-arbeitgeber/branchen/industrie-metall-technik",
  "/fuer-arbeitgeber/branchen/logistik-lager",
  "/fuer-arbeitgeber/standorte",
  "/fuer-arbeitgeber/standorte/bayern",
  "/fuer-arbeitgeber/standorte/baden-wuerttemberg",
  "/fuer-arbeitgeber/standorte/nordrhein-westfalen",
  "/fuer-arbeitgeber/standorte/niedersachsen",
  "/fuer-arbeitgeber/standorte/hessen",
  "/fuer-arbeitgeber/standorte/berlin-brandenburg",
  "/fuer-arbeitgeber/standorte/sachsen-mitteldeutschland",
  "/fuer-arbeitgeber/standorte/hamburg-norddeutschland",
  "/fuer-arbeitgeber/kandidaten",
  "/fuer-arbeitgeber/personalbedarf",
  "/roi-rechner",
  "/fuer-arbeitgeber/roi-rechner",
  "/fuer-arbeitgeber/zeitplan",
  "/referenzen",
  "/blog",
  "/impressum",
  "/datenschutz",
] as const;
