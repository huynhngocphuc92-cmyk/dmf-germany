import { contactAutoReplyTemplate, profileInquiryAutoReplyTemplate } from "@/lib/email-templates";
import { getMailTransporter } from "@/lib/email/transporter";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/sanitize";
import { createIntakeClient } from "@/lib/supabase/intake";
import "server-only";
import { z } from "zod";

const jobSchema = z.object({
  id: z.uuid(),
  attemptToken: z.uuid(),
  channel: z.enum(["email", "telegram", "auto_reply"]),
  kind: z.enum(["contact", "profile", "lead"]),
  payload: z.object({
    email: z.email(),
    name: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().optional(),
    interest: z.string().optional(),
    candidateId: z.uuid().optional(),
  }),
});
type Job = z.infer<typeof jobSchema>;
type DeliveryResult = { status: "sent" | "failed" | "skipped"; error: string | null };

export async function deliverNotification(job: Job): Promise<DeliveryResult> {
  if (
    process.env.VERCEL_ENV === "preview" ||
    (process.env.VERCEL_ENV !== "production" && process.env.NOTIFICATION_DELIVERY !== "enabled")
  ) {
    return { status: "skipped", error: "non_production" };
  }
  const p = job.payload;
  const code = p.candidateId?.slice(0, 8).toUpperCase();
  const title =
    job.kind === "profile"
      ? `Neue Profil-Anfrage #${code}`
      : job.kind === "lead"
        ? "Neue Anfrage aus dem Chat"
        : "Neue Kontaktanfrage";
  try {
    if (job.channel === "telegram") {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (!token || !chatId) return { status: "skipped", error: "telegram_not_configured" };
      // Plain text; the notification links to the admin instead of forwarding private chat text.
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          chat_id: chatId,
          text: `${title}\nEine neue Anfrage wurde gespeichert. Bitte im DMF Admin prüfen.\nhttps://www.dmf-talents.de/admin/${job.kind === "lead" ? "leads" : "requests"}`,
        }),
      });
      const result = await response.json().catch(() => null);
      return response.ok && result?.ok === true
        ? { status: "sent", error: null }
        : { status: "failed", error: "telegram_rejected" };
    }
    const transporter = getMailTransporter();
    const from = process.env.SMTP_USER;
    const recipient = job.channel === "auto_reply" ? p.email : process.env.CONTACT_EMAIL;
    if (!transporter || !from || !recipient)
      return { status: "skipped", error: "smtp_not_configured" };
    const html =
      job.channel === "auto_reply"
        ? code
          ? profileInquiryAutoReplyTemplate(p.name || p.company || "", code)
          : contactAutoReplyTemplate(p.name || "")
        : `<h2>${escapeHtml(title)}</h2><p>Name: ${escapeHtml(p.name || "–")}</p><p>E-Mail: ${escapeHtml(p.email)}</p><p>Firma: ${escapeHtml(p.company || "–")}</p><p>Telefon: ${escapeHtml(p.phone || "–")}</p><p>${escapeHtmlWithBreaks(p.message || p.interest || "–")}</p>`;
    const result = await transporter.sendMail({
      from: { name: "DMF Talents", address: from },
      to: { address: recipient, name: "" },
      ...(job.channel === "email" ? { replyTo: { address: p.email, name: "" } } : {}),
      subject:
        job.channel === "auto_reply" ? "Ihre Anfrage wurde gespeichert – DMF Talents" : title,
      messageId: `<${job.id}@dmf-talents.de>`,
      html,
    });
    return result.accepted?.length
      ? { status: "sent", error: null }
      : { status: "failed", error: "smtp_rejected" };
  } catch {
    return { status: "failed", error: "provider_unavailable" };
  }
}

export async function dispatchNotification(id: string) {
  const db = createIntakeClient();
  const { data, error } = await db.rpc("dmf_claim_notification", { p_id: id });
  if (error) throw new Error("Notification claim failed");
  if (!data) return;
  const job = jobSchema.parse(data);
  const result = await deliverNotification(job);
  const { data: recorded, error: saveError } = await db.rpc("dmf_finish_notification", {
    p_id: job.id,
    p_attempt_token: job.attemptToken,
    p_status: result.status,
    p_error: result.error,
  });
  if (saveError || !recorded) throw new Error("Delivery result could not be recorded");
}

export async function dispatchSubmission(id: string) {
  const db = createIntakeClient();
  const { data, error } = await db
    .from("notification_deliveries")
    .select("id")
    .eq("submission_id", id)
    .eq("status", "pending");
  if (error) throw new Error("Notification jobs could not be loaded");
  await Promise.all((data ?? []).map((job) => dispatchNotification(job.id)));
}
