import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/services/skilled-workers",
  "Fachkr\u00e4fte aus Vietnam",
  "Fachkr\u00e4fte aus Vietnam f\u00fcr Unternehmen in Deutschland. Qualifikationen, Personalbedarf und Vermittlungsm\u00f6glichkeiten besprechen."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
