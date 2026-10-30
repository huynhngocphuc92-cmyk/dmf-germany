import "server-only";
import { createHash } from "node:crypto";

// No customer content, provider errors, keys or raw intake/delivery identifiers.
export function notificationLog(event: string, id: string, reason?: string | null) {
  console.error("[Notifications]", {
    event,
    correlation: createHash("sha256").update(id).digest("hex").slice(0, 16),
    ...(reason ? { reason } : {}),
  });
}
