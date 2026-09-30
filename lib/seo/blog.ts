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
>;

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
  return [
    {
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
      ...(image ? { image: [image] } : {}),
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      // author_id is a private account identifier, not a public author byline.
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: siteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: siteUrl("/blog") },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ] as const;
}

export function serializeJsonLd(value: unknown): string {
  // Prevent editorial text from closing the script element in server-rendered HTML.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
