"use server";
import { revalidatePath } from "next/cache";

import { createAdminClient as createClient } from "@/lib/auth/admin";
import {
  BlogGenerationRequest,
  GeneratedBlog,
  TopicSuggestion,
  ImageSuggestion,
  BlogLanguage,
} from "./types";
import { buildBlogSystemPrompt, buildTopicSuggestionsPrompt } from "@/lib/prompts/blog-writer";
import { runWithGrokModelFallback, GrokMessage } from "@/lib/ai/grok";
import { runWithOpenRouterFallback } from "@/lib/ai/openrouter";

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

    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim() || "";
    const xaiKey = process.env.XAI_API_KEY?.trim() || "";

    if (!openRouterKey && !xaiKey) {
      return { success: false, error: "API not configured" };
    }

    const grokMessages: GrokMessage[] = [
      { role: "system", content: buildBlogSystemPrompt(request) },
      { role: "user", content: `Write a blog post about: "${request.topic}"` },
    ];

    const result = openRouterKey
      ? await runWithOpenRouterFallback(openRouterKey, grokMessages, {
          maxTokens: 2500,
          temperature: 0.4,
          timeoutMs: 28000,
        })
      : await runWithGrokModelFallback(xaiKey, grokMessages);
    const rawText = result.text;

    // Extract text content
    if (!rawText) {
      return { success: false, error: "No content generated" };
    }

    // Parse the JSON response
    let generatedBlog: GeneratedBlog;
    try {
      // Clean up potential markdown code blocks
      let jsonText = rawText.trim();

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
      console.error("Failed to parse AI response:", rawText.substring(0, 500));
      console.error("Parse error:", parseError);

      // Return the raw response for debugging
      return {
        success: false,
        error: `Failed to parse JSON. Raw response (first 300 chars): ${rawText.substring(0, 300)}...`,
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const systemPrompt = buildTopicSuggestionsPrompt(language, category);
    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim() || "";
    const xaiKey = process.env.XAI_API_KEY?.trim() || "";
    if (!openRouterKey && !xaiKey) {
      return { success: false, error: "API not configured" };
    }

    const messages: GrokMessage[] = [{ role: "user", content: systemPrompt }];
    const result = openRouterKey
      ? await runWithOpenRouterFallback(openRouterKey, messages, {
          maxTokens: 900,
          temperature: 0.5,
          timeoutMs: 18000,
        })
      : await runWithGrokModelFallback(xaiKey, messages);
    const rawText = result.text;
    if (!rawText) {
      return { success: false, error: "No content generated" };
    }

    let jsonText = rawText.trim();
    if (jsonText.startsWith("```json")) jsonText = jsonText.slice(7);
    if (jsonText.startsWith("```")) jsonText = jsonText.slice(3);
    if (jsonText.endsWith("```")) jsonText = jsonText.slice(0, -3);
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);
    const topics: TopicSuggestion[] = parsed.map((item: TopicSuggestion, index: number) => ({
      id: `topic-${Date.now()}-${index}`,
      topic: item.topic,
      description: item.description,
      category: item.category,
      keywords: item.keywords || [],
    }));

    return { success: true, data: topics };
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { success: false, error: "Query parameter is required" };
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
    if (unsplashKey) {
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=12&orientation=landscape`,
        {
          headers: { Authorization: `Client-ID ${unsplashKey}` },
        }
      );
      if (unsplashResponse.ok) {
        const unsplashData = await unsplashResponse.json();
        const images: ImageSuggestion[] = (unsplashData.results || []).map(
          (photo: {
            id: string;
            description: string | null;
            alt_description: string | null;
            urls: { small: string; regular: string; full: string };
            user: { name: string; links: { html: string } };
          }) => ({
            id: photo.id,
            query: cleanQuery,
            description: photo.alt_description || photo.description || cleanQuery,
            urls: {
              small: photo.urls.small,
              regular: photo.urls.regular,
              full: photo.urls.full,
            },
            author: photo.user.name,
            authorUrl: photo.user.links.html,
          })
        );
        return { success: true, data: images };
      }
    }

    const placeholders: ImageSuggestion[] = Array.from({ length: 6 }, (_, i) => ({
      id: `placeholder-${i}`,
      query: cleanQuery,
      description: `${cleanQuery} - Image ${i + 1}`,
      urls: {
        small: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery + i)}/400/300`,
        regular: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery + i)}/800/600`,
        full: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery + i)}/1920/1080`,
      },
      author: "Picsum Photos",
      authorUrl: "https://picsum.photos",
    }));
    return { success: true, data: placeholders };
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

    revalidatePath("/admin/posts");
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

    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin/posts");
    return { success: true, id: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
