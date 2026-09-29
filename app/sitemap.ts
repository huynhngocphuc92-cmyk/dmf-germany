import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/app/admin/posts/actions";
import { PUBLIC_ROUTES, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await getPublishedPosts();
  // Do not cache an incomplete sitemap as a successful response during an outage.
  if (error) throw new Error("Published sitemap content unavailable");
  return [
    ...PUBLIC_ROUTES.map((path) => ({ url: siteUrl(path) })),
    ...(data ?? []).map((post) => ({
      url: siteUrl(`/blog/${encodeURIComponent(post.slug)}`),
      lastModified: new Date(post.updated_at || post.created_at),
    })),
  ];
}
