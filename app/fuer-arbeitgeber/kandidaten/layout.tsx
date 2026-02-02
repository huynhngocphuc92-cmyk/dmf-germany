import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kandidaten-Pool | DMF",
  description:
    "Unsere Top-Talente: Qualifizierte Fachkräfte aus Vietnam, die sẵn sàng làm việc. Alle Kandidaten haben ihre Qualifikationen bestätigt und sind visa-ready.",
  keywords: [
    "Kandidaten Pool",
    "Fachkräfte Vietnam",
    "Bewerber Pool",
    "Qualifizierte Kandidaten",
    "Visa-ready Personal",
    "DMF Kandidaten",
    "Talent Pool",
    "Personalvermittlung",
  ],
  openGraph: {
    title: "Kandidaten-Pool | DMF Manpower",
    description: "Unsere Top-Talente: Qualifizierte Fachkräfte aus Vietnam, die sẵn sàng làm việc.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DMF Kandidaten-Pool",
      },
    ],
  },
  alternates: {
    canonical: "/fuer-arbeitgeber/kandidaten",
  },
};

export default function KandidatenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
