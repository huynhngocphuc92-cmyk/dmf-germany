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
  // Vercel may represent a bodyless POST as an empty ReadableStream.
  // Consume zero-byte chunks only; reject as soon as any content appears.
  if (request.body) {
    const reader = request.body.getReader();
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        if (part.value.byteLength > 0)
          return NextResponse.json(
            { error: "Body not allowed" },
            { status: 400, headers: opsHeaders }
          );
      }
    } finally {
      await reader.cancel().catch(() => {});
    }
  }
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
