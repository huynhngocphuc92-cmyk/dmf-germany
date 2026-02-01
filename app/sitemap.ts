import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/app/admin/posts/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dmf-vietnam.de";
  const lastModified = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - Highest Priority
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Main Service Pages - High Priority
    {
      url: `${baseUrl}/services/skilled-workers`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/azubi`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/seasonal`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // B2B Landing Pages
    {
      url: `${baseUrl}/ueber-uns/ausbildung`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ueber-uns/studium`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ueber-uns/skilled-workers`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // B2B Tools - High Priority
    {
      url: `${baseUrl}/roi-rechner`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fuer-arbeitgeber/roi-rechner`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fuer-arbeitgeber/zeitplan`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Content Pages - Medium Priority
    {
      url: `${baseUrl}/referenzen`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Legal Pages - Low Priority
    {
      url: `${baseUrl}/impressum`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const postsResult = await getPublishedPosts();
    if (postsResult.data && postsResult.data.length > 0) {
      blogPosts = postsResult.data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching blog posts:", error);
  }

  return [...staticPages, ...blogPosts];
}
