"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

// Type definitions for Schema.org structured data
interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description: string;
  contactPoint?: ContactPointSchema[];
  address?: PostalAddressSchema;
  sameAs?: string[];
}

interface ContactPointSchema {
  "@type": "ContactPoint";
  telephone: string;
  email: string;
  contactType: string;
  areaServed: string[];
  availableLanguage: string[];
}

interface PostalAddressSchema {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
  inLanguage: string[];
}

export default function JsonLd() {
  const { lang, t } = useLanguage();

  const baseUrl = "https://dmf.edu.vn";
  const logoUrl = `${baseUrl}/logo.png`;

  // Map language codes to schema.org language codes
  const languageMap: Record<string, string> = {
    de: "de-DE",
    en: "en-US",
    vn: "vi-VN",
  };

  // Organization Schema - Basic structure
  const organizationSchema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DMF Vietnam",
    url: baseUrl,
    logo: logoUrl,
    description: t.hero.subtitle,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+84 855 070773",
        email: "contact@dmf.edu.vn",
        contactType: "customer service",
        areaServed: ["DE", "VN"],
        availableLanguage: ["German", "Vietnamese", "English"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Binh Duong Province",
      addressLocality: "Binh Duong",
      addressRegion: "Binh Duong",
      addressCountry: "VN",
    },
    sameAs: [],
  };

  // Website Schema
  const websiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DMF Vietnam",
    url: baseUrl,
    description: t.hero.subtitle,
    publisher: {
      "@type": "Organization",
      name: "DMF Vietnam",
    },
    inLanguage: [languageMap[lang] || "de-DE"],
  };

  // Combine schemas
  const schemas = [organizationSchema, websiteSchema];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
}
