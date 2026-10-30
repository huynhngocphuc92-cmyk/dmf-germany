import { NextResponse } from "next/server";
import { opsAuthorized, opsHeaders } from "@/lib/ops/auth";
import { operationsHealth } from "@/lib/ops/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!opsAuthorized(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: opsHeaders });
  const health = await operationsHealth();
  return NextResponse.json(health, {
    status: health.status === "ok" ? 200 : 503,
    headers: opsHeaders,
  });
}
