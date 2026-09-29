import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/services/seasonal",
  "Saisonkr\u00e4fte aus Vietnam",
  "Saisonalen Personalbedarf besprechen: Einsatzbereich, Zeitraum und Voraussetzungen f\u00fcr eine m\u00f6gliche Vermittlung kl\u00e4ren."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
