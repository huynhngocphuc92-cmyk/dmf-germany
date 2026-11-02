import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth/admin";
import { adminAuthorizationResponse } from "@/lib/auth/admin-http";
import {
  getOpenRouterCandidateModels,
  runWithOpenRouterFallback,
  type OpenRouterMessage,
} from "@/lib/ai/openrouter";
import { providerFailure } from "@/lib/ai/provider-runtime";
import { getGuidedChatResponse, shouldUseGuidedCache } from "@/lib/chatbot/fallback";
import { buildChatbotSystemPrompt } from "@/lib/chatbot/knowledge-base";
import { InvalidBody, readJsonBody } from "@/lib/intake/body";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(10000) }))
    .max(200)
    .default([]),
  language: z.enum(["de", "en", "vi", "vn"]).default("de"),
});

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  const reply = (body: Record<string, unknown>, status = 200, headers = {}) =>
    NextResponse.json(
      { ...body, requestId, durationMs: Date.now() - startedAt },
      { status, headers: { "Cache-Control": "no-store", ...headers } }
    );
  try {
    const parsed = chatSchema.safeParse(await readJsonBody(request, 100000));
    if (!parsed.success) return reply({ error: "Invalid chat request" }, 400);
    const { message, history, language } = parsed.data;
    const rate = await checkRateLimit(`chat:${getClientIp(request)}`, RATE_LIMITS.CHAT);
    if (!rate.success)
      return reply({ error: "Too many requests. Please try again later." }, 429, {
        "Retry-After": String(rate.resetIn),
      });

    const normalizedLanguage = language === "vn" ? "vi" : language;
    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim() || "";

    if (openRouterKey && !shouldUseGuidedCache(message, history.length)) {
      try {
        const boundedHistory = history.slice(-8).map((item) => ({
          role: item.role,
          content: item.content.slice(0, 600),
        }));
        const openRouterMessages: OpenRouterMessage[] = [
          { role: "system", content: buildChatbotSystemPrompt(normalizedLanguage) },
          ...boundedHistory,
          { role: "user", content: message },
        ];
        const aiResult = await runWithOpenRouterFallback(openRouterKey, openRouterMessages, {
          timeoutMs: 12000,
        });
        return reply({
          message: aiResult.text,
          usage: aiResult.usage,
          provider: "openrouter",
          model: aiResult.modelName,
          mode: "ai",
        });
      } catch (aiError) {
        console.warn("[Chat] OpenRouter fallback to guided engine", {
          requestId,
          code: providerFailure(aiError),
        });
      }
    }

    return reply({
      message: getGuidedChatResponse(normalizedLanguage, message),
      usage: { inputTokens: 0, outputTokens: 0 },
      provider: "guided_engine",
      mode: "guided",
    });
  } catch (error) {
    if (error instanceof InvalidBody) return reply({ error: "Invalid chat request" }, error.status);
    console.error("[Chat] Request failed", { requestId, code: "chat_unavailable" });
    return reply({ error: "Chat service temporarily unavailable. Please try again." }, 503);
  }
}

export async function GET(request: NextRequest) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  const headers = { "Cache-Control": "no-store" };
  const reply = (body: Record<string, unknown>, status = 200, extraHeaders = {}) =>
    NextResponse.json(
      { ...body, requestId, durationMs: Date.now() - startedAt },
      { status, headers: { ...headers, ...extraHeaders } }
    );
  const diagnostics = request.nextUrl.searchParams.get("diagnostics") === "1";
  if (diagnostics) {
    try {
      const { user } = await requireAdmin();
      const rate = await checkRateLimit(`chat-diagnostics:${user.id}`, RATE_LIMITS.API);
      if (!rate.success)
        return reply({ error: "Too many diagnostic requests" }, 429, {
          "Retry-After": String(rate.resetIn),
        });
    } catch (error) {
      const denied = adminAuthorizationResponse(error);
      if (denied) return reply(await denied.json(), denied.status);
      return reply({ error: "Diagnostics unavailable" }, 503);
    }
  }
  const openRouterConfigured = Boolean(process.env.OPENROUTER_API_KEY?.trim());
  return reply({
    status: "ready",
    mode: "guided",
    aiEnabled: false,
    message:
      "Built-in scripted FAQ responder configured. This is not an availability guarantee or a backend health check.",
    ...(diagnostics
      ? {
          diagnostics: {
            ai: openRouterConfigured
              ? `openrouter configured (${getOpenRouterCandidateModels().join(" -> ")}); no provider requests performed`
              : "disabled in this public-chat phase; no provider requests performed",
          },
        }
      : {}),
  });
}
