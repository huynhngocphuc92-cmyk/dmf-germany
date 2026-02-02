import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostenrechner & ROI | DMF",
  description:
    "Berechnen Sie die Wirtschaftlichkeit bei der Rekrutierung vietnamesischer Fachkräfte. Kostenvergleich zwischen deutschen und vietnamesischen Mitarbeitern mit unserem ROI-Rechner.",
  keywords: [
    "ROI Rechner",
    "Kostenrechner Personalvermittlung",
    "Wirtschaftlichkeitsberechnung",
    "Kostenvergleich Fachkräfte",
    "Personalkosten Vietnam",
    "DMF Kostenrechner",
    "ROI Calculator",
  ],
  openGraph: {
    title: "Kostenrechner & ROI | DMF Manpower",
    description:
      "Berechnen Sie die Wirtschaftlichkeit bei der Rekrutierung vietnamesischer Fachkräfte. Kostenvergleich zwischen deutschen und vietnamesischen Mitarbeitern.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DMF Kostenrechner & ROI",
      },
    ],
  },
  alternates: {
    canonical: "/roi-rechner",
  },
};

export default function RoiRechnerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
