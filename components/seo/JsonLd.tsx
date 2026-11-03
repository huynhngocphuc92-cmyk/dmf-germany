import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import { BRANCHEN_CONFIGS } from "@/lib/content/branchen";

export default function JsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "EmploymentAgency"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: siteUrl("/icon.png"),
      description: SITE_DESCRIPTION,
      areaServed: {
        "@type": "Country",
        name: "Deutschland",
      },
      knowsLanguage: ["de-DE", "en", "vi"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Personalvermittlung & Fachkräftegewinnung aus Vietnam",
        itemListElement: BRANCHEN_CONFIGS.map((b) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: b.metaTitle,
            description: b.metaDescription,
            url: siteUrl(`/fuer-arbeitgeber/branchen/${b.slug}`),
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }}
    />
  );
}
