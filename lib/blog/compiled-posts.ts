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
const cachedReadTimeBySlug = new Map<string, number>();

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

function ensurePostsLoaded(): {
  list: Post[];
  bySlug: Map<string, Post>;
} {
  if (cachedCompiledPosts && cachedBySlug) {
    return {
      list: cachedCompiledPosts,
      bySlug: cachedBySlug,
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
    for (const post of list) {
      bySlug.set(post.slug, post);
    }

    cachedCompiledPosts = list;
    cachedBySlug = bySlug;
    return { list, bySlug };
  } catch {
    return {
      list: [],
      bySlug: new Map(),
    };
  }
}

export function getCompiledPublishedPosts(): Post[] {
  return ensurePostsLoaded().list;
}

export function getCompiledReadTimeBySlug(slug: string): number {
  const existing = cachedReadTimeBySlug.get(slug);
  if (existing !== undefined) return existing;

  const post = ensurePostsLoaded().bySlug.get(slug);
  if (!post) return 5;

  const computed = estimateReadTimeMinutes(post.content);
  cachedReadTimeBySlug.set(slug, computed);
  return computed;
}

export function getCompiledPostSummaries(): BlogPostSummary[] {
  if (cachedCompiledSummaries) {
    return cachedCompiledSummaries;
  }
  const { list } = ensurePostsLoaded();
  cachedCompiledSummaries = list.map((post) =>
    toSummary(post, getCompiledReadTimeBySlug(post.slug))
  );
  return cachedCompiledSummaries;
}

export function getCompiledPostBySlug(slug: string): Post | null {
  return ensurePostsLoaded().bySlug.get(slug) ?? null;
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
