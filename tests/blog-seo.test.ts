import { describe, expect, it } from "vitest";
import { blogMetadata, blogStructuredData, serializeJsonLd } from "@/lib/seo/blog";

const post = {
  slug: "fragen-für-arbeitgeber",
  title: "Fragen für Arbeitgeber",
  excerpt: "Praktische Fragen zur Personalgewinnung.",
  cover_image: "/images/team.jpg",
  published_at: "2026-09-01T09:00:00+02:00",
  updated_at: "2026-09-29T08:00:00Z",
};

describe("blog search metadata", () => {
  it("uses the article identity and cover consistently across metadata and structured data", () => {
    const metadata = blogMetadata(post);
    const [article, breadcrumbs] = blogStructuredData(post);
    const canonical = "https://www.dmf-talents.de/blog/fragen-f%C3%BCr-arbeitgeber";
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph).toMatchObject({
      url: canonical,
      type: "article",
      publishedTime: "2026-09-01T07:00:00.000Z",
      images: [{ url: "https://www.dmf-talents.de/images/team.jpg", alt: post.title }],
    });
    expect(metadata.twitter).toMatchObject({ images: metadata.openGraph?.images });
    expect(article).toMatchObject({
      "@type": "BlogPosting",
      headline: post.title,
      url: canonical,
      mainEntityOfPage: { "@id": canonical },
      datePublished: "2026-09-01T07:00:00.000Z",
    });
    expect(breadcrumbs.itemListElement?.map((item) => item.item)).toEqual([
      "https://www.dmf-talents.de/",
      "https://www.dmf-talents.de/blog",
      canonical,
    ]);
  });

  it("does not turn draft creation, private fields or missing images into article evidence", () => {
    const data = {
      ...post,
      published_at: undefined,
      updated_at: "invalid",
      created_at: "2020-01-01T00:00:00Z",
      cover_image: "javascript:alert(1)",
      author_id: "PRIVATE_AUTHOR_ID",
      internal_note: "PRIVATE_NOTE",
    };
    const serialized = serializeJsonLd(blogStructuredData(data));
    expect(serialized).not.toMatch(
      /PRIVATE_|2020-01|datePublished|dateModified|javascript|"image"/
    );
    expect(blogMetadata(data).twitter).toMatchObject({
      images: [{ url: "https://www.dmf-talents.de/opengraph-image" }],
    });
  });

  it("escapes script breakouts without corrupting editorial text", () => {
    const title = '</script><script>alert("test")</script> & Beratung';
    const serialized = serializeJsonLd(blogStructuredData({ ...post, title }));
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)[0].headline).toBe(title);
  });

  it("keeps a separate SEO title from the article headline", () => {
    const data = {
      ...post,
      meta_title: "Personalgewinnung | DMF Talents",
      meta_description: "SEO summary",
    };
    expect(blogMetadata(data)).toMatchObject({
      title: "Personalgewinnung",
      description: "SEO summary",
    });
    expect(blogStructuredData(data)[0].headline).toBe(post.title);
  });
});
