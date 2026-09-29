import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/fuer-arbeitgeber/kandidaten",
  "Kandidaten aus Vietnam",
  "Freigegebene Kurzprofile ansehen und passende Kandidaten f\u00fcr Ihren Personalbedarf anfragen. Verf\u00fcgbarkeit wird individuell abgestimmt."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
