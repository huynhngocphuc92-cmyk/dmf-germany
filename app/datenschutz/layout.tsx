import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-germany.de";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung der DMF Vietnam Joint Stock Company. Informationen zur Erhebung und Verarbeitung personenbezogener Daten gemäß DSGVO.",
  alternates: {
    canonical: `${baseUrl}/datenschutz`,
    languages: {
      de: `${baseUrl}/datenschutz`,
      en: `${baseUrl}/datenschutz`,
      vi: `${baseUrl}/datenschutz`,
    },
  },
  openGraph: {
    title: "Datenschutzerklärung | DMF Germany",
    description:
      "Datenschutzerklärung der DMF Vietnam Joint Stock Company. Informationen zur Erhebung und Verarbeitung personenbezogener Daten gemäß DSGVO.",
    url: `${baseUrl}/datenschutz`,
    type: "website",
    locale: "de_DE",
    alternateLocale: ["en_US", "vi_VN"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DatenschutzLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
