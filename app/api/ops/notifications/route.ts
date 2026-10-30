import { NextResponse } from "next/server";
import { opsAuthorized, opsHeaders } from "@/lib/ops/auth";
import { dispatchNotificationBatch } from "@/lib/intake/notifications";
import { notificationLog } from "@/lib/intake/notification-log";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!opsAuthorized(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: opsHeaders });
  // No selectors, recipients or payloads can be supplied by an operator.
  if (request.body !== null)
    return NextResponse.json({ error: "Body not allowed" }, { status: 400, headers: opsHeaders });
  try {
    const result = await dispatchNotificationBatch();
    return NextResponse.json(result, {
      status: result.errors || result.failed ? 503 : 200,
      headers: opsHeaders,
    });
  } catch {
    notificationLog("batch_unavailable", randomUUID());
    return NextResponse.json(
      { error: "Notification processing unavailable" },
      { status: 503, headers: opsHeaders }
    );
  }
}
