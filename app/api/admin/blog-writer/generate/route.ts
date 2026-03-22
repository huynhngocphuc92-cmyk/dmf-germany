import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import { BlogGenerationRequest, GeneratedBlog } from "@/app/admin/blog-writer/types";
import { buildBlogSystemPrompt } from "@/lib/prompts/blog-writer";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      `blog-writer:${user.id}`,
      RATE_LIMITS.BLOG_GENERATION
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const body: BlogGenerationRequest = await request.json();

    if (!body.topic || !body.language || !body.tone || !body.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      systemInstruction: buildBlogSystemPrompt(body),
    });

    // Generate blog content
    const result = await model.generateContent(`Write a blog post about: "${body.topic}"`);
    const rawText = result.response.text();

    if (!rawText) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    // Parse the JSON response
    let generatedBlog: GeneratedBlog;
    try {
      // Clean up potential markdown code blocks
      let jsonText = rawText.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

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
        language: body.language,
      };
    } catch {
      console.error("Failed to parse AI response:", rawText);
      return NextResponse.json(
        { error: "Failed to parse generated content. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: generatedBlog,
      usage: {
        inputTokens: result.response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
      },
    });
  } catch (error) {
    console.error("Blog generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate blog" },
      { status: 500 }
    );
  }
}
