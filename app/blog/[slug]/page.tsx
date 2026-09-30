import { cache } from "react";
import { Metadata } from "next";
import { blogMetadata } from "@/lib/seo/blog";
import BlogJsonLd from "@/components/seo/BlogJsonLd";
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
  return blogMetadata(post);
}

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await resolvePost(slug);

  // Fetch related posts
  const { data: relatedPosts } = await getRelatedPosts(slug, 3);

  return (
    <>
      <BlogJsonLd post={post} />
      <BlogDetailClient post={post} relatedPosts={relatedPosts || []} />
    </>
  );
}
