import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

interface LeadRequest {
  email: string;
  company?: string;
  phone?: string;
  interest?: string;
  sessionId?: string;
  source?: string;
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
// API HANDLER - CREATE LEAD
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequest = await request.json();
    const { email, company, phone, interest, sessionId, source } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      // Silently skip if Supabase is not configured
      console.warn("[Leads] Supabase not configured, skipping save");
      return NextResponse.json({ success: true, saved: false });
    }

    // Insert lead
    const { data, error } = await supabase
      .from("leads")
      .insert({
        email,
        company: company || null,
        phone: phone || null,
        interest: interest || null,
        session_id: sessionId || null,
        source: source || "website",
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation (duplicate email)
      if (error.code === "23505") {
        // Update existing lead instead
        const { error: updateError } = await supabase
          .from("leads")
          .update({
            company: company || undefined,
            phone: phone || undefined,
            interest: interest || undefined,
            session_id: sessionId || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("email", email);

        if (updateError) {
          console.error("[Leads] Update error:", updateError.message);
        }

        return NextResponse.json({ success: true, updated: true });
      }

      // Table might not exist, log but don't fail
      console.error("[Leads] Insert error:", error.message);
      return NextResponse.json({ success: true, saved: false, reason: "table_error" });
    }

    return NextResponse.json({ success: true, saved: true, id: data?.id });
  } catch (error) {
    console.error("[Leads] Error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

// ============================================
// GET LEADS (for admin)
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
    const status = searchParams.get("status");

    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      leads: data,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[Leads] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
