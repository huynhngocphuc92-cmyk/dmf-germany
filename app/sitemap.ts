import { MetadataRoute } from "next";
import { getPublishedSitemapPosts } from "@/app/admin/posts/actions";
import { isNoindexBlogSlug } from "@/lib/blog/seo-taxonomy";
import { getFeaturedCandidates } from "@/lib/supabase/candidates";
import { mergeWithDmfPoolCandidates } from "@/lib/candidates/dmf-pool-data";
import { PUBLIC_ROUTES, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data, error }, { data: candidates }] = await Promise.all([
    getPublishedSitemapPosts(),
    getFeaturedCandidates(),
  ]);
  // Do not cache an incomplete sitemap as a successful response during an outage.
  if (error) throw new Error("Published sitemap content unavailable");
  const allCandidates = mergeWithDmfPoolCandidates(candidates);
  return [
    ...PUBLIC_ROUTES.map((path) => ({ url: siteUrl(path) })),
    ...allCandidates.map((candidate) => ({
      url: siteUrl(`/fuer-arbeitgeber/kandidaten/${encodeURIComponent(candidate.id)}`),
    })),
    ...(data ?? [])
      .filter((post) => !isNoindexBlogSlug(post.slug))
      .map((post) => ({
        url: siteUrl(`/blog/${encodeURIComponent(post.slug)}`),
        lastModified: new Date(post.updated_at || post.created_at || Date.now()),
      })),
  ];
}
