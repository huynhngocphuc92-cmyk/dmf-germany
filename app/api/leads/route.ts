import { createPrivilegedAdminClient } from "@/lib/auth/admin";
import {
  adminAuthorizationResponse,
  adminResponseHeaders,
  parseAdminPagination,
} from "@/lib/auth/admin-http";
import { acceptIntake } from "@/lib/intake/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return acceptIntake(request, "lead");
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
