import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { profileInquiryAutoReplyTemplate } from "@/lib/email-templates";
import { escapeHtml } from "@/lib/sanitize";
import { optionalBusinessPhoneSchema } from "@/lib/validations/phone";
import { getMailTransporter, isSmtpConfigured } from "@/lib/email/transporter";

const bodySchema = z.object({
  candidateCode: z.string().min(1, { message: "Kandidatencode ist erforderlich." }),
  candidateId: z.string().optional(),
  name: z.string().min(2, { message: "Name ist erforderlich." }),
  email: z.string().email({ message: "Ungültige E-Mail-Adresse." }),
  phone: optionalBusinessPhoneSchema,
  company: z.string().optional(),
  message: z.string().optional(),
});

/**
 * Inquiry API Route
 * Handles candidate profile inquiry requests
 * - Rate limited to prevent spam
 * - Saves to Supabase inquiries table
 * - Sends notifications to Telegram and Email
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(`inquiry:${clientIp}`, RATE_LIMITS.CONTACT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Zu viele Anfragen. Bitte warten Sie ${rateLimitResult.resetIn} Sekunden.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.resetIn),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const { candidateCode, candidateId, name, email, phone, company, message } = validation.data;

    let supabaseSaved = false;
    let telegramSent = false;
    let emailSent = false;

    // 1. Save to Supabase
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("inquiries")
        .insert([
          {
            client_name: name,
            email: email,
            phone: phone || null,
            company: company || null,
            message: message || null,
            type: "profile",
            status: "new",
            candidate_code: candidateCode,
            candidate_id: candidateId || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("[Inquiry API] Supabase error:", error);
      } else {
        supabaseSaved = true;
      }
    } catch (supabaseError) {
      console.error("[Inquiry API] Supabase unexpected error:", supabaseError);
      // Continue even if Supabase fails
    }

    // 2. Send to Telegram (non-blocking)
    try {
      const telegramResponse = await fetch(`${request.nextUrl.origin}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            `🎯 <b>NEUE PROFIL-ANFRAGE</b>\n\n` +
            `👤 Kandidat: #${candidateCode}\n` +
            `📧 Kontakt: ${email}\n` +
            `📞 Telefon: ${phone || "Nicht angegeben"}\n` +
            `🏢 Firma: ${company || "Nicht angegeben"}\n` +
            `💬 Nachricht: ${message || "Keine zusätzliche Nachricht"}\n` +
            `📅 Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
        }),
      });

      if (!telegramResponse.ok) {
        console.warn("[Inquiry API] Telegram notification failed");
      } else {
        telegramSent = true;
      }
    } catch (telegramError) {
      console.error("[Inquiry API] Telegram error:", telegramError);
      // Non-blocking: Continue even if Telegram fails
    }

    // 3. Send Email (admin notification + auto-reply to lead)
    try {
      if (isSmtpConfigured()) {
        const transporter = getMailTransporter();
        if (!transporter) {
          throw new Error("SMTP transporter could not be initialized.");
        }

        const safeCandidateCode = escapeHtml(String(candidateCode));
        const safeName = escapeHtml(String(name));
        const safeEmail = escapeHtml(String(email));
        const safeCompany = escapeHtml(company ? String(company) : "–");
        const safeMessage = escapeHtml(message ? String(message) : "–");

        // Notify admin
        await transporter.sendMail({
          from: `"DMF Website" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          replyTo: email,
          subject: `🎯 Neue Profil-Anfrage: #${candidateCode} von ${name}`,
          html:
            `<h2>Neue Profil-Anfrage</h2>` +
            `<p><b>Kandidat:</b> #${safeCandidateCode}</p>` +
            `<p><b>Name:</b> ${safeName}</p>` +
            `<p><b>Email:</b> ${safeEmail}</p>` +
            `<p><b>Firma:</b> ${safeCompany}</p>` +
            `<p><b>Nachricht:</b> ${safeMessage}</p>`,
        });

        // Auto-reply to lead
        await transporter.sendMail({
          from: `"DMF Manpower" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `✅ Ihre Profil-Anfrage #${candidateCode} wurde erhalten – DMF Manpower`,
          html: profileInquiryAutoReplyTemplate(name, candidateCode),
        });

        emailSent = true;
        console.warn("[Inquiry API] ✓ Email sent (incl. auto-reply)");
      }
    } catch (emailError) {
      console.error("[Inquiry API] Email error:", emailError);
      // Non-blocking: Continue even if email fails
    }

    // Return success if at least one operation succeeded
    if (supabaseSaved || telegramSent || emailSent) {
      return NextResponse.json(
        {
          success: true,
          message: "Anfrage wurde erfolgreich gesendet.",
          saved: supabaseSaved,
          telegramSent: telegramSent,
          emailSent: emailSent,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Inquiry API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten.",
      },
      { status: 500 }
    );
  }
}
