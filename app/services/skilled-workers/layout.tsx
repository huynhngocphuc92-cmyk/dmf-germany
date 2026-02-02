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
    images: [
      {
        url: "/og-image.jpg", // Using default OG image, can be customized later
        width: 1200,
        height: 630,
        alt: "Fachkräfte aus Vietnam vermitteln | DMF Manpower",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fachkräfte aus Vietnam vermitteln | DMF Manpower",
    description: "Qualifizierte Fachkräfte für Ihr Unternehmen. Jetzt prüfen!",
    images: ["/og-image.jpg"],
  },
};

export default function SkilledWorkersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
