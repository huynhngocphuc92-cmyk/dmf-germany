import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/ueber-uns/ausbildung",
  "Ausbildung und Vorbereitung",
  "Informationen zur Vorbereitung von Auszubildenden aus Vietnam und zur Zusammenarbeit mit Ausbildungsbetrieben."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
