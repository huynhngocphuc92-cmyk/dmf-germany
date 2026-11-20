import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/roi-rechner",
  "ROI-Rechner: Fachkräfte aus Vietnam vs. Zeitarbeit",
  "Berechnen Sie Ihre 3-Jahres-Einsparung: Direktrekrutierung aus Vietnam (§ 18a/§ 16a) im Vergleich zu Zeitarbeit und Headhuntern in Deutschland."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
