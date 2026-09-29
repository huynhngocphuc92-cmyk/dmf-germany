import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/services/azubi",
  "Auszubildende aus Vietnam",
  "Auszubildende aus Vietnam f\u00fcr Ihr Unternehmen: Anforderungen, Vorbereitung und n\u00e4chste Schritte gemeinsam kl\u00e4ren."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
