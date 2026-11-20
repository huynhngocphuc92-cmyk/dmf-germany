import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/services/seasonal",
  "Saisonkräfte aus Vietnam einstellen (§ 15d BeschV)",
  "Zuverlässige Saisonkräfte aus Vietnam für Gastronomie, Hotellerie, Logistik & Landwirtschaft. ZAV-konforme Vermittlung mit planbarer Vorlaufzeit."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
