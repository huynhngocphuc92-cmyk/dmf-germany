import { pageMetadata } from "@/lib/site";
import { getPublishedPostSummaries } from "@/app/admin/posts/actions";
import { BlogListClient } from "./blog-list-client";

export const metadata = pageMetadata(
  "/blog",
  "Fachkräfte & Azubis aus Vietnam: Arbeitgeber-Ratgeber",
  "Praxisleitfäden für deutsche Arbeitgeber: Fachkräfte (§ 18a/§ 81a) & Azubis (§ 16a) aus Vietnam rekrutieren, Kosten kalkulieren und rechtssicher integrieren."
);

export const revalidate = 3600;

export default async function BlogPage() {
  const { data: posts, error } = await getPublishedPostSummaries();

  if (error) {
    console.error("Error loading posts:", error);
  }

  return <BlogListClient posts={posts || []} />;
}
