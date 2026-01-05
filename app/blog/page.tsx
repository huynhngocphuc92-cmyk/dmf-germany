import { Metadata } from "next";
import { getPublishedPosts } from "@/app/admin/posts/actions";
import { BlogListClient } from "./blog-list-client";

export const metadata: Metadata = {
  title: "Blog | DMF Vietnam",
  description: "Aktuelle Nachrichten und Artikel über Fachkräfte aus Vietnam, Visum-Informationen und Rekrutierungstipps.",
};

export default async function BlogPage() {
  const { data: posts, error } = await getPublishedPosts();
  
  if (error) {
    console.error("Error loading posts:", error);
  }
  
  return <BlogListClient posts={posts || []} />;
}

