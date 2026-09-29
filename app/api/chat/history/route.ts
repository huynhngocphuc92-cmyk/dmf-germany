import { createPrivilegedAdminClient } from "@/lib/auth/admin";
import {
  adminAuthorizationResponse,
  adminResponseHeaders,
  parseAdminPagination,
} from "@/lib/auth/admin-http";
import { InvalidBody, readJsonBody } from "@/lib/intake/body";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { createIntakeClient } from "@/lib/supabase/intake";
import { chatHistorySchema } from "@/lib/validations/public-intake";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

const OWNER_COOKIE = "dmf_chat_owner";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await readJsonBody(request, 1000000);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid chat history" },
      { status: error instanceof InvalidBody ? error.status : 400 }
    );
  }
  const parsed = chatHistorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid chat history" }, { status: 400 });
  const { sessionId, messages, leadData } = parsed.data;
  const existingToken = request.cookies.get(OWNER_COOKIE)?.value;
  const ownerToken =
    existingToken && /^[a-f0-9]{64}$/.test(existingToken)
      ? existingToken
      : randomBytes(32).toString("hex");
  try {
    const rate = await checkRateLimit(`history:${getClientIp(request)}`, RATE_LIMITS.API);
    if (!rate.success)
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rate.resetIn) } }
      );
    const supabase = createIntakeClient();
    const { data: saved, error } = await supabase.rpc("dmf_save_chat", {
      p_session_id: sessionId,
      p_owner_token: ownerToken,
      p_messages: messages,
      p_lead_data: leadData ?? {},
    });
    if (error) return NextResponse.json({ error: "Chat could not be saved" }, { status: 503 });
    if (!saved)
      return NextResponse.json({ error: "Chat session ownership required" }, { status: 403 });
    const response = NextResponse.json(
      { success: true, saved: true },
      { headers: adminResponseHeaders }
    );
    response.cookies.set(OWNER_COOKIE, ownerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/chat/history",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Chat could not be saved" }, { status: 503 });
  }
}

// ============================================
// GET CHAT HISTORY (for admin)
// ============================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createPrivilegedAdminClient();

    const { searchParams } = new URL(request.url);
    const pagination = parseAdminPagination(searchParams);
    if (!pagination.success) {
      return NextResponse.json(
        { error: "Invalid pagination" },
        { status: 400, headers: adminResponseHeaders }
      );
    }
    const { limit, offset } = pagination.data;

    const { data, error, count } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        sessions: data,
        total: count,
        limit,
        offset,
      },
      { headers: adminResponseHeaders }
    );
  } catch (error) {
    const denied = adminAuthorizationResponse(error);
    if (denied) return denied;
    console.error("[ChatHistory] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500, headers: adminResponseHeaders }
    );
  }
}
