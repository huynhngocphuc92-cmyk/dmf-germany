import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { BlogLanguage, TopicSuggestion } from "@/app/admin/blog-writer/types";
import { buildTopicSuggestionsPrompt } from "@/lib/prompts/blog-writer";
import { runWithGrokModelFallback, GrokMessage } from "@/lib/ai/grok";

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

    // Build the prompt
    const systemPrompt = buildTopicSuggestionsPrompt(language, category);

    const apiKey = process.env.XAI_API_KEY || "";
    const grokMessages: GrokMessage[] = [
      { role: "user", content: systemPrompt }
    ];
    const result = await runWithGrokModelFallback(apiKey, grokMessages);
    const rawText = result.text;

    if (!rawText) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    // Parse the JSON response
    let topics: TopicSuggestion[];
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

      topics = parsed.map((item: TopicSuggestion, index: number) => ({
        id: `topic-${Date.now()}-${index}`,
        topic: item.topic,
        description: item.description,
        category: item.category,
        keywords: item.keywords || [],
      }));
    } catch {
      console.error("Failed to parse topics response:", rawText);
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
