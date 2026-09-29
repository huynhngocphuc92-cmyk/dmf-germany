import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/utils/supabase/public";
import { leadRequestSchema } from "@/lib/validations/public-intake";
import { createPrivilegedAdminClient } from "@/lib/auth/admin";
import {
  adminAuthorizationResponse,
  adminResponseHeaders,
  parseAdminPagination,
} from "@/lib/auth/admin-http";

export async function POST(request: NextRequest) {
  const parsed = leadRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid lead information" }, { status: 400 });
  try {
    const supabase = createPublicClient();
    const { error } = await supabase.rpc("dmf_submit_lead", { p_lead: parsed.data });
    if (error) return NextResponse.json({ error: "Lead could not be saved" }, { status: 503 });
    return NextResponse.json({ success: true, accepted: true }, { headers: adminResponseHeaders });
  } catch {
    return NextResponse.json({ error: "Lead could not be saved" }, { status: 503 });
  }
}

// ============================================
// GET LEADS (for admin)
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

    return NextResponse.json(
      {
        leads: data,
        total: count,
        limit,
        offset,
      },
      { headers: adminResponseHeaders }
    );
  } catch (error) {
    const denied = adminAuthorizationResponse(error);
    if (denied) return denied;
    console.error("[Leads] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500, headers: adminResponseHeaders }
    );
  }
}
