import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/ueber-uns/skilled-workers",
  "Vorbereitung von Fachkr\u00e4ften",
  "Informationen zur Vorbereitung von Fachkr\u00e4ften aus Vietnam auf eine Besch\u00e4ftigung in Deutschland."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
