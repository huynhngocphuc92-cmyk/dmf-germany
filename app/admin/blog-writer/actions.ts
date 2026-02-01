"use server";

import { createClient } from "@/utils/supabase/server";
import {
  BlogGenerationRequest,
  GeneratedBlog,
  TopicSuggestion,
  ImageSuggestion,
  BlogLanguage,
} from "./types";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

export async function generateBlogPost(
  request: BlogGenerationRequest
): Promise<{ success: boolean; data?: GeneratedBlog; error?: string }> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/blog-writer/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Generation failed" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTopicSuggestions(
  language: BlogLanguage = "de",
  category?: string
): Promise<{ success: boolean; data?: TopicSuggestion[]; error?: string }> {
  try {
    const params = new URLSearchParams({ language });
    if (category) params.append("category", category);

    const response = await fetch(`${getBaseUrl()}/api/admin/blog-writer/topics?${params}`);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to get topics" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function searchImages(
  query: string
): Promise<{ success: boolean; data?: ImageSuggestion[]; error?: string }> {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/admin/blog-writer/images?query=${encodeURIComponent(query)}`
    );
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to search images" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function saveBlogAsDraft(
  blog: GeneratedBlog
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        meta_title: blog.metaTitle,
        meta_description: blog.metaDescription,
        status: "draft",
        author_id: user.id,
        cover_image: blog.suggestedImages[0]?.urls.regular || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Save draft error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishBlog(
  blog: GeneratedBlog
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        meta_title: blog.metaTitle,
        meta_description: blog.metaDescription,
        status: "published",
        published_at: new Date().toISOString(),
        author_id: user.id,
        cover_image: blog.suggestedImages[0]?.urls.regular || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Publish error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
