import { pageMetadata } from "@/lib/site";
import { getPublishedPosts } from "@/app/admin/posts/actions";
import { BlogListClient } from "./blog-list-client";

export const metadata = pageMetadata(
  "/blog",
  "Blog",
  "Nachrichten und Artikel zur Personalgewinnung aus Vietnam für Unternehmen in Deutschland."
);

export const revalidate = 60;

export default async function BlogPage() {
  const { data: posts, error } = await getPublishedPosts();

  if (error) {
    console.error("Error loading posts:", error);
  }

  return <BlogListClient posts={posts || []} />;
}
