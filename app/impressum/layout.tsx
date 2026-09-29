import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/impressum",
  "Impressum",
  "Anbieter- und Kontaktinformationen von DMF Talents."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
