import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-vietnam.de";

export const metadata: Metadata = {
  title: "Saisonarbeiter aus Vietnam vermitteln | DMF Talents",
  description:
    "Zuverlässige Saisonkräfte für Landwirtschaft & Gastronomie. Schnell verfügbar, rechtssicher nach §15a BeschV. Einsatzbereit in 4-8 Wochen.",
  openGraph: {
    title: "Saisonarbeiter aus Vietnam vermitteln | DMF Talents",
    description: "Saisonkräfte für Ihre Hochsaison. Jetzt verfügbarkeit prüfen!",
    url: `${baseUrl}/services/seasonal`,
    siteName: "DMF Talents",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saisonarbeiter aus Vietnam vermitteln | DMF Talents",
    description: "Saisonkräfte für Ihre Hochsaison. Jetzt verfügbarkeit prüfen!",
  },
};

export default function SeasonalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
