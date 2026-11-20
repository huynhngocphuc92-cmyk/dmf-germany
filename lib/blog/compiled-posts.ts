import rawCompiledPosts from "@/content/compiled/all-posts.json";
import type { BlogPostSummary, Post } from "@/app/admin/posts/types";

interface RawCompiledPost {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
}

let cachedCompiledPosts: Post[] | null = null;
let cachedCompiledSummaries: BlogPostSummary[] | null = null;
let cachedBySlug: Map<string, Post> | null = null;
let cachedReadTimeBySlug: Map<string, number> | null = null;

export function estimateReadTimeMinutes(html?: string | null): number {
  if (!html) return 5;
  const text = html.replace(/<[^>]*>/g, " ").trim();
  if (!text) return 5;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function toSummary(post: Post, readTimeMinutes: number): BlogPostSummary {
  return {
    id: post.id,
    created_at: post.created_at,
    updated_at: post.updated_at,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover_image: post.cover_image,
    status: post.status,
    published_at: post.published_at,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    read_time_minutes: readTimeMinutes,
  };
}

function ensureLoaded(): {
  list: Post[];
  summaries: BlogPostSummary[];
  bySlug: Map<string, Post>;
  readTimeBySlug: Map<string, number>;
} {
  if (cachedCompiledPosts && cachedCompiledSummaries && cachedBySlug && cachedReadTimeBySlug) {
    return {
      list: cachedCompiledPosts,
      summaries: cachedCompiledSummaries,
      bySlug: cachedBySlug,
      readTimeBySlug: cachedReadTimeBySlug,
    };
  }

  try {
    const raw = rawCompiledPosts as RawCompiledPost[];
    const baseTimeMs = Date.UTC(2026, 10, 4, 14, 0, 0);
    const total = raw.length;

    const list: Post[] = raw.map((item, idx) => {
      const offsetMs = ((total - 1 - idx) * 48 + (idx % 5) * 3) * 3600 * 1000;
      const publishedIso = new Date(baseTimeMs - offsetMs).toISOString();
      return {
        id: `compiled-${idx + 1}`,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || undefined,
        content: item.content,
        cover_image: item.cover_image || "/images/blog/dmf-klassenzimmer.jpg",
        status: "published",
        published_at: publishedIso,
        created_at: publishedIso,
        updated_at: "2026-11-04T14:00:00.000Z",
        author_id: undefined,
        meta_title: item.meta_title || item.title,
        meta_description: item.meta_description || item.excerpt || undefined,
      };
    });

    // Sort newest published_at first
    list.sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));

    const bySlug = new Map<string, Post>();
    const readTimeBySlug = new Map<string, number>();
    const summaries: BlogPostSummary[] = [];

    for (const post of list) {
      const readTime = estimateReadTimeMinutes(post.content);
      bySlug.set(post.slug, post);
      readTimeBySlug.set(post.slug, readTime);
      summaries.push(toSummary(post, readTime));
    }

    cachedCompiledPosts = list;
    cachedCompiledSummaries = summaries;
    cachedBySlug = bySlug;
    cachedReadTimeBySlug = readTimeBySlug;
    return { list, summaries, bySlug, readTimeBySlug };
  } catch {
    return {
      list: [],
      summaries: [],
      bySlug: new Map(),
      readTimeBySlug: new Map(),
    };
  }
}

export function getCompiledPublishedPosts(): Post[] {
  return ensureLoaded().list;
}

export function getCompiledPostSummaries(): BlogPostSummary[] {
  return ensureLoaded().summaries;
}

export function getCompiledReadTimeBySlug(slug: string): number {
  return ensureLoaded().readTimeBySlug.get(slug) ?? 5;
}

export function getCompiledPostBySlug(slug: string): Post | null {
  return ensureLoaded().bySlug.get(slug) ?? null;
}

export function mergeWithCompiledPosts(dbPosts: Post[] | null | undefined): Post[] {
  const compiled = getCompiledPublishedPosts();
  if (!dbPosts || dbPosts.length === 0) {
    return compiled;
  }
  const seenSlugs = new Set(dbPosts.map((p) => p.slug));
  return [...dbPosts, ...compiled.filter((p) => !seenSlugs.has(p.slug))];
}

export function mergeWithCompiledPostSummaries(
  dbPosts: BlogPostSummary[] | null | undefined
): BlogPostSummary[] {
  const compiled = getCompiledPostSummaries();
  if (!dbPosts || dbPosts.length === 0) {
    return compiled;
  }
  const seenSlugs = new Set<string>();
  const normalizedDb: BlogPostSummary[] = [];
  for (const post of dbPosts) {
    seenSlugs.add(post.slug);
    normalizedDb.push({
      ...post,
      read_time_minutes:
        post.read_time_minutes ??
        (post.content
          ? estimateReadTimeMinutes(post.content)
          : getCompiledReadTimeBySlug(post.slug)),
    });
  }
  return [...normalizedDb, ...compiled.filter((p) => !seenSlugs.has(p.slug))];
}
