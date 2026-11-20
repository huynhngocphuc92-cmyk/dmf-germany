import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/fuer-arbeitgeber/roi-rechner",
  "Personalkosten-Vergleich: Direktrekrutierung Vietnam",
  "Vergleichen Sie Personalkosten und Amortisationszeit für vietnamesische Fachkräfte und Azubis anhand Ihrer betrieblichen Eckdaten."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
