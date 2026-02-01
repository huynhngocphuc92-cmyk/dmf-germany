import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/utils/supabase/server";
import { BlogLanguage, TopicSuggestion } from "@/app/admin/blog-writer/types";
import { buildTopicSuggestionsPrompt } from "@/lib/prompts/blog-writer";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get("language") || "de") as BlogLanguage;
    const category = searchParams.get("category") || undefined;

    // Initialize Anthropic client - use Haiku for cost efficiency
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      ...(process.env.ANTHROPIC_BASE_URL && { baseURL: process.env.ANTHROPIC_BASE_URL }),
    });

    // Build the prompt
    const systemPrompt = buildTopicSuggestionsPrompt(language, category);

    // Generate topic suggestions
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-20250514", // Use Haiku for cost efficiency
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    // Parse the JSON response
    let topics: TopicSuggestion[];
    try {
      // Clean up potential markdown code blocks
      let jsonText = textContent.text.trim();
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

      topics = parsed.map((item: TopicSuggestion, index: number) => ({
        id: `topic-${Date.now()}-${index}`,
        topic: item.topic,
        description: item.description,
        category: item.category,
        keywords: item.keywords || [],
      }));
    } catch {
      console.error("Failed to parse topics response:", textContent.text);
      return NextResponse.json(
        { error: "Failed to parse topic suggestions. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error("Topic suggestions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate topics" },
      { status: 500 }
    );
  }
}
