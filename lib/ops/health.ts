import "server-only";
import { z } from "zod";
import { createIntakeClient } from "@/lib/supabase/intake";
import { isSmtpConfigured } from "@/lib/email/transporter";

const count = z.number().int().nonnegative();
const queueSchema = z.object({
  pending: count,
  failed: count,
  staleSending: count,
  exhausted: count,
  oldestPendingSeconds: count,
});
export async function operationsHealth() {
  const configuration = {
    databaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
    ),
    smtpConfigured: isSmtpConfigured() && Boolean(process.env.CONTACT_EMAIL),
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    deliveryEnabled:
      process.env.VERCEL_ENV !== "preview" &&
      (process.env.VERCEL_ENV === "production" || process.env.NOTIFICATION_DELIVERY === "enabled"),
  };
  // Telegram is optional; its absence is informational, not a required-email outage.
  const configured =
    configuration.databaseConfigured &&
    configuration.smtpConfigured &&
    configuration.deliveryEnabled;
  let queue: z.infer<typeof queueSchema> | null = null;
  try {
    if (process.env.VERCEL_ENV === "preview") throw new Error("Preview probe disabled");
    const { data, error } = await createIntakeClient()
      .rpc("dmf_notification_health")
      .abortSignal(AbortSignal.timeout(5000));
    if (!error) queue = queueSchema.parse(data);
  } catch {
    /* Missing migration, blocked preview or backend outage is degraded. */
  }
  const notificationOk =
    queue !== null &&
    queue.failed === 0 &&
    queue.staleSending === 0 &&
    queue.exhausted === 0 &&
    queue.oldestPendingSeconds < 900;
  const status = queue && notificationOk && configured ? "ok" : "degraded";
  return {
    status,
    checks: {
      database: { status: queue ? "ok" : "degraded" },
      notifications: {
        status: notificationOk ? "ok" : "degraded",
        ...(queue || {
          pending: null,
          failed: null,
          staleSending: null,
          exhausted: null,
          oldestPendingSeconds: null,
        }),
      },
      configuration: { status: configured ? "ok" : "degraded", ...configuration },
    },
  };
}
