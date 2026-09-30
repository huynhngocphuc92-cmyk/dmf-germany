import { pageMetadata } from "@/lib/site";
import { getPublishedPosts } from "@/app/admin/posts/actions";
import { BlogListClient } from "./blog-list-client";

export const metadata = pageMetadata(
  "/blog",
  "Personalgewinnung aus Vietnam: Wissen für Arbeitgeber",
  "Informationen für Arbeitgeber zur Personalgewinnung aus Vietnam: Fachkräfte, Ausbildung und Zusammenarbeit. Lesen Sie den Blog von DMF Talents."
);

export const revalidate = 60;

export default async function BlogPage() {
  const { data: posts, error } = await getPublishedPosts();

  if (error) {
    console.error("Error loading posts:", error);
  }

  return <BlogListClient posts={posts || []} />;
}
