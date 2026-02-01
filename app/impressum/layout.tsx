import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-germany.de";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum und rechtliche Informationen der DMF Vietnam Joint Stock Company. Angaben gemäß § 5 DDG.",
  alternates: {
    canonical: `${baseUrl}/impressum`,
    languages: {
      de: `${baseUrl}/impressum`,
      en: `${baseUrl}/impressum`,
      vi: `${baseUrl}/impressum`,
    },
  },
  openGraph: {
    title: "Impressum | DMF Germany",
    description:
      "Impressum und rechtliche Informationen der DMF Vietnam Joint Stock Company. Angaben gemäß § 5 DDG.",
    url: `${baseUrl}/impressum`,
    type: "website",
    locale: "de_DE",
    alternateLocale: ["en_US", "vi_VN"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ImpressumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
