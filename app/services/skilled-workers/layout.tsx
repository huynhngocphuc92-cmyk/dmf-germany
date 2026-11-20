import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/services/skilled-workers",
  "Fachkräfte aus Vietnam einstellen (§ 18a & § 81a)",
  "Personalvermittlung qualifizierter Fachkräfte aus Vietnam (B1/B2) für deutsche Unternehmen. Anerkennung, § 81a-Visabeschleunigung und Betreuung vor Ort."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
