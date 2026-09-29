import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/fuer-arbeitgeber/zeitplan",
  "Zeitplan f\u00fcr Ihre Personalgewinnung",
  "Planen Sie die Schritte Ihrer Personalgewinnung. Zeitangaben dienen der Orientierung und werden individuell abgestimmt."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
