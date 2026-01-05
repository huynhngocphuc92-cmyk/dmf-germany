"use client";

import Script from "next/script";
import { useLanguage } from "@/lib/language-context";

// Type definitions for Schema.org structured data
interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: ContactPointSchema[];
  address: PostalAddressSchema;
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

interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  "@id": string;
  name: string;
  image: string;
  url: string;
  telephone: string;
  email: string;
  description: string;
  address: PostalAddressSchema;
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItemSchema[];
}

interface BreadcrumbItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
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

// Combined schema for better SEO
type SchemaType = 
  | OrganizationSchema 
  | LocalBusinessSchema 
  | BreadcrumbSchema 
  | WebSiteSchema;

interface JsonLdProps {
  /** Path for breadcrumb generation */
  path?: string;
  /** Page title for breadcrumbs */
  pageTitle?: string;
}

export function JsonLd({ path = "/", pageTitle }: JsonLdProps) {
  const { content, language } = useLanguage();

  const baseUrl = "https://dmf.edu.vn";
  const logoUrl = `${baseUrl}/logo.png`;

  // Organization Schema
  const organizationSchema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.header.logo,
    url: baseUrl,
    logo: logoUrl,
    description: content.hero.subtitle,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: content.contact.headquarters.phone,
        email: content.contact.headquarters.email,
        contactType: "customer service",
        areaServed: ["DE", "VN"],
        availableLanguage: ["German", "Vietnamese", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: content.contact.germanContact.phone,
        email: content.contact.germanContact.email,
        contactType: "sales",
        areaServed: ["DE"],
        availableLanguage: ["German", "English"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: content.legal.impressum.sections.address.street,
      addressLocality: content.legal.impressum.sections.address.city,
      addressRegion: content.legal.impressum.sections.address.province,
      addressCountry: "VN",
    },
    sameAs: [
      // Add social media links when available
      // "https://www.linkedin.com/company/dmf-vietnam",
      // "https://www.facebook.com/dmfvietnam"
    ],
  };

  // Local Business Schema (Vietnam Headquarters)
  const vietnamBusinessSchema: LocalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${baseUrl}/#vietnam-hq`,
    name: `${content.header.logo} - ${content.contact.headquarters.title}`,
    image: logoUrl,
    url: baseUrl,
    telephone: content.contact.headquarters.phone,
    email: content.contact.headquarters.email,
    description: content.about.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.legal.impressum.sections.address.street,
      addressLocality: content.legal.impressum.sections.address.city,
      addressRegion: content.legal.impressum.sections.address.province,
      addressCountry: "Vietnam",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.9804, // Approximate coordinates for Binh Duong
      longitude: 106.6519,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  };

  // Website Schema
  const websiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.header.logo,
    url: baseUrl,
    description: content.hero.subtitle,
    publisher: {
      "@type": "Organization",
      name: content.header.logo,
    },
    inLanguage: ["de-DE", "vi-VN"],
  };

  // Generate Breadcrumb based on current path
  const generateBreadcrumbs = (): BreadcrumbSchema => {
    const items: BreadcrumbItemSchema[] = [
      {
        "@type": "ListItem",
        position: 1,
        name: language === "de" ? "Startseite" : "Trang chủ",
        item: baseUrl,
      },
    ];

    if (path !== "/") {
      const pathSegments = path.split("/").filter(Boolean);
      const pathNames: Record<string, Record<"de" | "vn", string>> = {
        impressum: { de: "Impressum", vn: "Thông tin pháp lý" },
        datenschutz: { de: "Datenschutz", vn: "Bảo mật" },
      };

      pathSegments.forEach((segment, index) => {
        const name = pathNames[segment]?.[language] || pageTitle || segment;
        items.push({
          "@type": "ListItem",
          position: index + 2,
          name,
          item: `${baseUrl}/${pathSegments.slice(0, index + 1).join("/")}`,
        });
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  };

  // Combine all schemas
  const schemas: SchemaType[] = [
    organizationSchema,
    vietnamBusinessSchema,
    websiteSchema,
    generateBreadcrumbs(),
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`json-ld-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

/**
 * Service Schema for individual service pages (optional)
 */
export function ServiceJsonLd({ 
  serviceName, 
  serviceDescription 
}: { 
  serviceName: string; 
  serviceDescription: string;
}) {
  const baseUrl = "https://dmf.edu.vn";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: {
      "@type": "Organization",
      name: "DMF Vietnam",
      url: baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Germany",
    },
  };

  return (
    <Script
      id="json-ld-service"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema),
      }}
    />
  );
}

/**
 * FAQ Schema for FAQ sections (optional)
 */
export function FaqJsonLd({ 
  faqs 
}: { 
  faqs: Array<{ question: string; answer: string }>;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="json-ld-faq"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

