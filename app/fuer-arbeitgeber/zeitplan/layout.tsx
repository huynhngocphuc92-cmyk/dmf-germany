import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zeitplan & Ablauf | DMF",
  description:
    "Planungssicherheit ist uns wichtig. Simulieren Sie hier den zeitlichen Ablauf von der Vertragsunterzeichnung bis zur Ankunft Ihrer Fachkraft in Deutschland.",
  keywords: [
    "Zeitplan Personalvermittlung",
    "Prozessablauf Fachkräfte",
    "Visum Prozess Zeit",
    "Zeitplan Simulator",
    "DMF Zeitplan",
    "Beschleunigtes Fachkräfteverfahren",
    "Timeline Rekrutierung",
  ],
  openGraph: {
    title: "Zeitplan & Ablauf | DMF Talents",
    description:
      "Planungssicherheit ist uns wichtig. Simulieren Sie hier den zeitlichen Ablauf von der Vertragsunterzeichnung bis zur Ankunft Ihrer Fachkraft in Deutschland.",
    type: "website",
  },
  alternates: {
    canonical: "/fuer-arbeitgeber/zeitplan",
  },
};

export default function ZeitplanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
