import { cache } from "react";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { getPublishedRedirect } from "@/app/admin/posts/actions";
import { notFound, permanentRedirect } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/app/admin/posts/actions";
import { BlogDetailClient } from "./blog-detail-client";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const resolvePost = cache(async (slug: string) => {
  const { data: post, error } = await getPostBySlug(slug);
  if (error) throw new Error("Blog content unavailable");
  if (post) return post;
  const redirectSlug = await getPublishedRedirect(slug);
  if (redirectSlug) permanentRedirect(`/blog/${encodeURIComponent(redirectSlug)}`);
  notFound();
});

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  const metadata = pageMetadata(
    `/blog/${encodeURIComponent(post.slug)}`,
    post.meta_title || post.title,
    post.meta_description || post.excerpt || post.title
  );
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      ...(post.cover_image ? { images: [post.cover_image] } : {}),
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await resolvePost(slug);

  // Fetch related posts
  const { data: relatedPosts } = await getRelatedPosts(slug, 3);

  return <BlogDetailClient post={post} relatedPosts={relatedPosts || []} />;
}
