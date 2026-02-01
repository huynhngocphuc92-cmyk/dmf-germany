import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatHistoryRequest {
  sessionId: string;
  messages: ChatMessage[];
  leadData?: {
    company?: string;
    email?: string;
    phone?: string;
    interest?: string;
  };
}

// ============================================
// SUPABASE CLIENT
// ============================================

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: ChatHistoryRequest = await request.json();
    const { sessionId, messages, leadData } = body;

    if (!sessionId || !messages) {
      return NextResponse.json({ error: "sessionId and messages are required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      // Silently skip if Supabase is not configured
      console.warn("[ChatHistory] Supabase not configured, skipping save");
      return NextResponse.json({ success: true, saved: false });
    }

    // Upsert chat session
    const { error } = await supabase.from("chat_sessions").upsert(
      {
        session_id: sessionId,
        messages: messages,
        lead_email: leadData?.email || null,
        lead_company: leadData?.company || null,
        lead_phone: leadData?.phone || null,
        lead_interest: leadData?.interest || null,
        message_count: messages.length,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "session_id",
      }
    );

    if (error) {
      // Table might not exist, log but don't fail
      console.error("[ChatHistory] Save error:", error.message);
      return NextResponse.json({ success: true, saved: false, reason: "table_error" });
    }

    return NextResponse.json({ success: true, saved: true });
  } catch (error) {
    console.error("[ChatHistory] Error:", error);
    return NextResponse.json({ error: "Failed to save chat history" }, { status: 500 });
  }
}

// ============================================
// GET CHAT HISTORY (for admin)
// ============================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { data, error, count } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      sessions: data,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[ChatHistory] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}
