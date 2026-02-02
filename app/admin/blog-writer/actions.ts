"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/utils/supabase/server";
import {
  BlogGenerationRequest,
  GeneratedBlog,
  TopicSuggestion,
  ImageSuggestion,
  BlogLanguage,
} from "./types";
import { buildBlogSystemPrompt } from "@/lib/prompts/blog-writer";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

export async function generateBlogPost(
  request: BlogGenerationRequest
): Promise<{ success: boolean; data?: GeneratedBlog; error?: string }> {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!request.topic || !request.language || !request.tone || !request.length) {
      return { success: false, error: "Missing required fields" };
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return { success: false, error: "API not configured" };
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      ...(process.env.ANTHROPIC_BASE_URL && { baseURL: process.env.ANTHROPIC_BASE_URL }),
    });

    // Build the prompt
    const systemPrompt = buildBlogSystemPrompt(request);

    // Generate blog content
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Write a blog post about: "${request.topic}"`,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return { success: false, error: "No content generated" };
    }

    // Parse the JSON response
    let generatedBlog: GeneratedBlog;
    try {
      // Clean up potential markdown code blocks
      let jsonText = textContent.text.trim();

      // Remove markdown code blocks
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      // Try to find JSON object if there's extra text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonText);

      // Calculate read time (avg 200 words per minute)
      const wordCount = parsed.content.split(/\s+/).length;
      const estimatedReadTime = Math.ceil(wordCount / 200);

      generatedBlog = {
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        metaTitle: parsed.metaTitle,
        metaDescription: parsed.metaDescription,
        keywords: parsed.keywords || [],
        suggestedImages: (parsed.suggestedImageQueries || []).map(
          (query: string, index: number) => ({
            id: `suggestion-${index}`,
            query,
            description: query,
            urls: { small: "", regular: "", full: "" },
            author: "",
            authorUrl: "",
          })
        ),
        estimatedReadTime,
        language: request.language,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", textContent.text.substring(0, 500));
      console.error("Parse error:", parseError);

      // Return the raw response for debugging
      return {
        success: false,
        error: `Failed to parse JSON. Raw response (first 300 chars): ${textContent.text.substring(0, 300)}...`,
      };
    }

    return { success: true, data: generatedBlog };
  } catch (error) {
    console.error("Blog generation error:", error);
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
