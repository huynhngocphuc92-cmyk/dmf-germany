import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * Telegram Bot API Route
 * Sends notification messages to Telegram Admin
 * - Rate limited (10 requests per minute per IP)
 *
 * Environment Variables Required:
 * - TELEGRAM_BOT_TOKEN: Your Telegram Bot Token
 * - TELEGRAM_CHAT_ID: Your Telegram Chat ID
 *
 * Usage:
 * POST /api/telegram
 * Body: { message: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(`telegram:${clientIp}`, RATE_LIMITS.TELEGRAM);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: rateLimitResult.resetIn,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetIn.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Get credentials from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // If credentials are not set, log to console (for development)
    if (!botToken || !chatId) {
      console.log("[Telegram API] Credentials not set. Message would be:", message);
      return NextResponse.json(
        {
          success: false,
          message: "Telegram credentials not configured",
          logged: true,
        },
        { status: 200 } // Return 200 to avoid breaking the flow
      );
    }

    // Send message to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML", // Support HTML formatting
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Telegram API] Error:", errorData);
      return NextResponse.json(
        { error: "Failed to send Telegram message", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[Telegram API] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing (optional)
export async function GET() {
  return NextResponse.json(
    {
      message: "Telegram API endpoint",
      status: "active",
      configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    },
    { status: 200 }
  );
}
