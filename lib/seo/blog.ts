import type { Metadata } from "next";
import type { Post } from "@/app/admin/posts/types";
import { pageMetadata, SITE_NAME, SITE_URL, siteUrl } from "@/lib/site";

type BlogSeoPost = Pick<
  Post,
  | "slug"
  | "title"
  | "excerpt"
  | "cover_image"
  | "published_at"
  | "updated_at"
  | "meta_title"
  | "meta_description"
> & {
  content?: string | null;
};

export interface ExtractedBlogFaq {
  question: string;
  answer: string;
}

export interface ExtractedInlineImage {
  url: string;
  caption?: string;
}

function stripHtmlTags(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts citation-ready Q&A pairs from article HTML when `<h2>` or `<h3>`
 * subheadings are phrased as questions (ending with `?`) and followed by
 * explanatory `<p>` paragraphs. Used to emit `FAQPage` JSON-LD for GEO/AI engines.
 */
export function extractFaqFromHtml(html?: string | null): ExtractedBlogFaq[] {
  if (!html || typeof html !== "string") return [];

  const results: ExtractedBlogFaq[] = [];
  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const matches = Array.from(html.matchAll(headingRegex));

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const questionText = stripHtmlTags(match[2] || "");
    if (!questionText.endsWith("?") || questionText.length < 10) {
      continue;
    }

    const sectionStart = (match.index ?? 0) + match[0].length;
    const sectionEnd = i + 1 < matches.length ? (matches[i + 1].index ?? html.length) : html.length;
    const sectionHtml = html.slice(sectionStart, sectionEnd);

    const paragraphs = Array.from(sectionHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((m) => stripHtmlTags(m[1] || ""))
      .filter((p) => p.length > 0);

    if (paragraphs.length === 0) continue;

    // Combine up to the first 2 paragraphs for a concise, citation-ready answer
    const answerText = paragraphs.slice(0, 2).join(" ").trim();
    if (answerText.length >= 35) {
      results.push({
        question: questionText,
        answer: answerText,
      });
    }
  }

  return results.slice(0, 10);
}

function isoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function coverImageUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value, `${SITE_URL}/`);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extracts inline `<figure>` / `<img src="..." alt="...">` elements from article HTML
 * so multi-image editorial posts emit full `ImageObject` entries in `BlogPosting.image`
 * for Google Images SEO and Generative Engine Optimization (GEO).
 */
export function extractInlineImagesFromHtml(html?: string | null): ExtractedInlineImage[] {
  if (!html || typeof html !== "string") return [];

  const results: ExtractedInlineImage[] = [];
  const seenUrls = new Set<string>();

  // 1. Extract <figure> blocks with <img> and optional <figcaption>
  const figureRegex = /<figure[^>]*>([\s\S]*?)<\/figure>/gi;
  for (const figMatch of html.matchAll(figureRegex)) {
    const inner = figMatch[1] || "";
    const srcMatch = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (!srcMatch?.[1]) continue;
    const resolved = coverImageUrl(srcMatch[1]);
    if (!resolved || seenUrls.has(resolved)) continue;

    const altMatch = inner.match(/<img[^>]+alt=["']([^"']+)["'][^>]*>/i);
    const capMatch = inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const caption = stripHtmlTags(capMatch?.[1] || altMatch?.[1] || "");

    seenUrls.add(resolved);
    results.push({ url: resolved, ...(caption ? { caption } : {}) });
  }

  // 2. Extract any standalone <img> tags outside <figure>
  for (const imgMatch of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const fullTag = imgMatch[0] || "";
    const resolved = coverImageUrl(imgMatch[1]);
    if (!resolved || seenUrls.has(resolved)) continue;
    const altMatch = fullTag.match(/alt=["']([^"']+)["']/i);
    const caption = stripHtmlTags(altMatch?.[1] || "");
    seenUrls.add(resolved);
    results.push({ url: resolved, ...(caption ? { caption } : {}) });
  }

  return results.slice(0, 12);
}

export function blogMetadata(post: BlogSeoPost): Metadata {
  const metadata = pageMetadata(
    `/blog/${encodeURIComponent(post.slug)}`,
    post.meta_title || post.title,
    post.meta_description || post.excerpt || post.title
  );
  const image = coverImageUrl(post.cover_image);
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: isoDate(post.published_at),
      modifiedTime: isoDate(post.updated_at),
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      ...metadata.twitter,
      images: [{ url: image || siteUrl("/opengraph-image"), alt: post.title }],
    },
  };
}

export function blogStructuredData(post: BlogSeoPost) {
  const url = siteUrl(`/blog/${encodeURIComponent(post.slug)}`);
  const image = coverImageUrl(post.cover_image);
  const inlineImages = extractInlineImagesFromHtml(post.content);
  const faqs = extractFaqFromHtml(post.content);

  const structuredImages = [
    ...(image ? [image] : []),
    ...inlineImages
      .filter((item) => item.url !== image)
      .map((item) => ({
        "@type": "ImageObject" as const,
        url: item.url,
        ...(item.caption ? { caption: item.caption } : {}),
      })),
  ];

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt || undefined,
    // A draft creation date is not a publication date. Omit unknown dates.
    datePublished: isoDate(post.published_at),
    dateModified: isoDate(post.updated_at),
    ...(structuredImages.length > 0 ? { image: structuredImages } : {}),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", "article p:first-of-type", "article h2", "article h3"],
    },
    // author_id is a private account identifier, not a public author byline.
  } as const;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: siteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: siteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  } as const;

  if (faqs.length === 0) {
    return [article, breadcrumbs] as const;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;

  return [article, breadcrumbs, faqSchema] as const;
}

export function serializeJsonLd(value: unknown): string {
  // Prevent editorial text from closing the script element in server-rendered HTML.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
