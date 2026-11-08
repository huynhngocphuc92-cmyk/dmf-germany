import { describe, expect, it } from "vitest";
import {
  blogMetadata,
  blogStructuredData,
  extractFaqFromHtml,
  serializeJsonLd,
} from "@/lib/seo/blog";

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
      author: {
        "@type": "Organization",
        "@id": "https://www.dmf-talents.de/#organization",
        name: "DMF Talents",
        url: "https://www.dmf-talents.de",
      },
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

  it("extracts question-form <h2>/<h3> headings into FAQPage JSON-LD while keeping BlogPosting and BreadcrumbList first", () => {
    const htmlWithQuestions = `
      <p><strong>Das Wichtigste in Kürze:</strong> Überblick zum § 81a AufenthG.</p>
      <h2>Welche Fristen gelten im beschleunigten Fachkräfteverfahren nach § 81a AufenthG?</h2>
      <p>Die Gleichwertigkeitsprüfung ist gesetzlich auf zwei Monate verkürzt, und die Bundesagentur für Arbeit entscheidet innerhalb einer Woche.</p>
      <h2>Nicht als Frage formulierte Überschrift</h2>
      <p>Dieser Abschnitt wird nicht als FAQ extrahiert.</p>
      <h3>Wer unterzeichnet die Vereinbarung mit der Ausländerbehörde?</h3>
      <p>Der Arbeitgeber in Deutschland schließt die Vereinbarung direkt oder über einen Bevollmächtigten mit der zuständigen Ausländerbehörde ab.</p>
    `;
    const faqs = extractFaqFromHtml(htmlWithQuestions);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe(
      "Welche Fristen gelten im beschleunigten Fachkräfteverfahren nach § 81a AufenthG?"
    );
    expect(faqs[1].question).toBe("Wer unterzeichnet die Vereinbarung mit der Ausländerbehörde?");

    const schemas = blogStructuredData({ ...post, content: htmlWithQuestions });
    expect(schemas).toHaveLength(3);
    expect(schemas[0]["@type"]).toBe("BlogPosting");
    expect(schemas[1]["@type"]).toBe("BreadcrumbList");
    expect(schemas[2]).toMatchObject({
      "@type": "FAQPage",
      "@id": "https://www.dmf-talents.de/blog/fragen-f%C3%BCr-arbeitgeber#faq",
    });
  });

  it("extracts inline <figure> and <img> tags into structured ImageObject entries in BlogPosting JSON-LD", () => {
    const htmlWithFigures = `
      <p>Einleitung</p>
      <figure class="dmf-community-figure">
        <img src="/images/blog/dmf-community-1.jpg" alt="DMF Talents Sprachunterricht" />
        <figcaption><strong>Einblick in die DMF Talents Community:</strong> B2-Training in Ho-Chi-Minh-Stadt.</figcaption>
      </figure>
      <img src="javascript:alert(1)" alt="bad" />
    `;
    const [article] = blogStructuredData({ ...post, content: htmlWithFigures });
    expect(article.image).toEqual([
      "https://www.dmf-talents.de/images/team.jpg",
      {
        "@type": "ImageObject",
        url: "https://www.dmf-talents.de/images/blog/dmf-community-1.jpg",
        caption: "Einblick in die DMF Talents Community: B2-Training in Ho-Chi-Minh-Stadt.",
      },
    ]);
  });
});
