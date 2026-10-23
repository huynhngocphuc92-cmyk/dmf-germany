import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import { PRIMARY_CONTACT } from "@/lib/company/contact";

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
        name: "Germany",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: PRIMARY_CONTACT.email,
        telephone: PRIMARY_CONTACT.phone,
        availableLanguage: ["de", "en", "vi"],
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
