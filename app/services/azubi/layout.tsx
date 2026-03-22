import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-vietnam.de";

export const metadata: Metadata = {
  title: "Azubi aus Vietnam vermitteln | DMF Talents",
  description:
    "Finden Sie motivierte Auszubildende aus Vietnam für Pflege, Handwerk und Industrie. Komplettservice inkl. Visum & B2-Sprachniveau.",
  openGraph: {
    title: "Azubi aus Vietnam vermitteln | DMF Talents",
    description: "Motivierte Azubis für Ihr Unternehmen. Jetzt informieren!",
    url: `${baseUrl}/services/azubi`,
    siteName: "DMF Talents",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azubi aus Vietnam vermitteln | DMF Talents",
    description: "Motivierte Azubis für Ihr Unternehmen. Jetzt informieren!",
  },
};

export default function AzubiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
