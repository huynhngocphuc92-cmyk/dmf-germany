import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/datenschutz",
  "Datenschutz",
  "Informationen zur Verarbeitung personenbezogener Daten auf der Website von DMF Talents."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
