import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/services/azubi",
  "Azubis aus Vietnam einstellen (§ 16a) – Vermittlung",
  "Motivierte Auszubildende aus Vietnam (B1-Deutsch) für Pflege, Handwerk, Gastronomie & Industrie. Rechtssichere Vermittlung nach § 16a inkl. Visaservice."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
