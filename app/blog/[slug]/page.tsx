import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/app/admin/posts/actions";
import { BlogDetailClient } from "./blog-detail-client";

// Force dynamic rendering (uses cookies for Supabase client)
export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Beitrag nicht gefunden | DMF Vietnam",
    };
  }

  return {
    title: post.meta_title || `${post.title} | DMF Vietnam Blog`,
    description: post.meta_description || post.excerpt || post.title,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || post.title,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const { data: post, error } = await getPostBySlug(slug);

  if (error || !post) {
    notFound();
  }

  // Fetch related posts
  const { data: relatedPosts } = await getRelatedPosts(slug, 3);

  return <BlogDetailClient post={post} relatedPosts={relatedPosts || []} />;
}
