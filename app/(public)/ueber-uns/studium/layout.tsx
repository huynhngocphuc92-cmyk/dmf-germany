import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/ueber-uns/studium",
  "Studium und Orientierung",
  "Informationen zur Studienorientierung und Vorbereitung in Deutschland. Pers\u00f6nliche Voraussetzungen gemeinsam besprechen."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
