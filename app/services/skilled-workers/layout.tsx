import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-vietnam.de";

export const metadata: Metadata = {
  title: "Fachkräfte aus Vietnam vermitteln | DMF Manpower",
  description:
    "Qualifizierte Fachkräfte für Ingenieurwesen, IT und Pflege. Anerkannte Abschlüsse, rechtssicher nach §18a/b AufenthG. Sofort einsatzbereit.",
  openGraph: {
    title: "Fachkräfte aus Vietnam vermitteln | DMF Manpower",
    description: "Qualifizierte Fachkräfte für Ihr Unternehmen. Jetzt prüfen!",
    url: `${baseUrl}/services/skilled-workers`,
    siteName: "DMF Manpower",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fachkräfte aus Vietnam vermitteln | DMF Manpower",
    description: "Qualifizierte Fachkräfte für Ihr Unternehmen. Jetzt prüfen!",
  },
};

export default function SkilledWorkersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
