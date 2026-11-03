import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHEN_SLUGS, getBrancheBySlug } from "@/lib/content/branchen";
import { getFeaturedCandidates } from "@/lib/supabase/candidates";
import { loadAssets } from "@/lib/theme-helpers";
import { pageMetadata, siteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { BrancheDetailClient } from "./branche-detail-client";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BRANCHEN_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branche = getBrancheBySlug(slug);
  if (!branche) {
    return pageMetadata(
      `/fuer-arbeitgeber/branchen/${slug}`,
      "Branchenlösung nicht gefunden",
      "Übersicht unserer Rekrutierungslösungen für deutsche Arbeitgeber."
    );
  }
  return pageMetadata(
    `/fuer-arbeitgeber/branchen/${branche.slug}`,
    branche.metaTitle,
    branche.metaDescription
  );
}

export default async function BrancheDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branche = getBrancheBySlug(slug);
  if (!branche) {
    notFound();
  }

  const [{ data: allCandidates }, customAssets] = await Promise.all([
    getFeaturedCandidates(),
    loadAssets([branche.assetKey]),
  ]);
  const pool = allCandidates ?? [];
  const heroImageUrl = customAssets[branche.assetKey] || branche.heroImage;

  // Match candidates by profession keywords first, then fall back to matching categories
  const keywordMatches = pool.filter((c) => {
    const prof = (c.profession || "").toLowerCase();
    return branche.professionKeywords.some((kw) => prof.includes(kw));
  });

  const categoryMatches = pool.filter((c) => branche.candidateCategories.includes(c.category));

  const matchedCandidates = keywordMatches.length > 0 ? keywordMatches : categoryMatches;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: branche.metaTitle,
      description: branche.metaDescription,
      url: siteUrl(`/fuer-arbeitgeber/branchen/${branche.slug}`),
      provider: {
        "@type": "EmploymentAgency",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "Deutschland",
      },
      serviceType: branche.badge.de,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startseite",
          item: siteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Branchenlösungen",
          item: siteUrl("/fuer-arbeitgeber/branchen"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: branche.badge.de,
          item: siteUrl(`/fuer-arbeitgeber/branchen/${branche.slug}`),
        },
      ],
    },
    ...(branche.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: branche.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question.de,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer.de,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas).replace(/</g, "\\u003c"),
        }}
      />
      <BrancheDetailClient
        branche={branche}
        candidates={matchedCandidates}
        heroImageUrl={heroImageUrl}
      />
    </>
  );
}
