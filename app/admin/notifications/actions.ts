"use server";
import { requireAdmin } from "@/lib/auth/admin";
import { dispatchNotification } from "@/lib/intake/notifications";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type RetryState = { error?: string; success?: boolean };
export async function retryNotification(
  _previous: RetryState,
  formData: FormData
): Promise<RetryState> {
  try {
    const { user } = await requireAdmin();
    const parsed = z.uuid().safeParse(formData.get("id"));
    if (!parsed.success) return { error: "Ungültige Benachrichtigung." };
    const rate = await checkRateLimit(`notification-retry:${user.id}`, RATE_LIMITS.API);
    if (!rate.success) return { error: "Bitte warten Sie kurz und versuchen Sie es erneut." };
    await dispatchNotification(parsed.data);
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch {
    return {
      error: "Der Versand konnte nicht gestartet werden. Bitte prüfen Sie die Konfiguration.",
    };
  }
}
