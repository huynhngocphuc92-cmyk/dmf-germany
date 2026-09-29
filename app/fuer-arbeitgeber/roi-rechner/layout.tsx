import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/fuer-arbeitgeber/roi-rechner",
  "Personalkosten vergleichen",
  "Vergleichen Sie Personalkosten anhand Ihrer Annahmen. Eine Modellrechnung ersetzt kein individuelles Angebot."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
