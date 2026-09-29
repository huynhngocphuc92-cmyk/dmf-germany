import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/referenzen",
  "Referenzen und Zusammenarbeit",
  "Informieren Sie sich \u00fcber die Zusammenarbeit mit DMF Talents und besprechen Sie Ihren Personalbedarf."
);

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
