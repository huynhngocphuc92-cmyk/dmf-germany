import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erfolgsgeschichten & Referenzen | DMF",
  description:
    "Überblick über unsere erfolgreichen Vermittlungen vietnamesischer Fachkräfte in ganz Deutschland. Erfahren Sie mehr über unsere Referenzen und Erfolgsgeschichten.",
  keywords: [
    "DMF Referenzen",
    "Erfolgsgeschichten",
    "Vermittlungen Deutschland",
    "Fachkräfte Referenzen",
    "Erfolgreiche Platzierungen",
    "Testimonials DMF",
  ],
  openGraph: {
    title: "Erfolgsgeschichten & Referenzen | DMF Manpower",
    description:
      "Überblick über unsere erfolgreichen Vermittlungen vietnamesischer Fachkräfte in ganz Deutschland.",
    type: "website",
  },
  alternates: {
    canonical: "/referenzen",
  },
};

export default function ReferenzenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
