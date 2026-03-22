import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/sanitize";
import { contactAutoReplyTemplate, profileInquiryAutoReplyTemplate } from "@/lib/email-templates";
import { optionalBusinessPhoneSchema } from "@/lib/validations/phone";
import { getMailTransporter, isSmtpConfigured } from "@/lib/email/transporter";

// Define validation schema for backend (double safety)
const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: optionalBusinessPhoneSchema,
  company: z.string().optional(),
  message: z.string().min(10),
  privacy: z.boolean().refine((value) => value === true),
  type: z.enum(["contact", "profile"]).optional(),
  candidateId: z.string().optional(),
  candidateCode: z.string().optional(),
  bot_check: z.string().optional(), // Honeypot
});

/**
 * Contact API Route
 * Handles contact form submissions
 * - Rate limited (5 requests per minute per IP)
 * - Validates input with Zod
 * - Saves to Supabase inquiries table
 * - Sends email via nodemailer (SMTP)
 * - Sends notification to Telegram (optional)
 */
export async function POST(request: NextRequest) {
  try {
    // 0. Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(`contact:${clientIp}`, RATE_LIMITS.CONTACT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Zu viele Anfragen. Bitte warten Sie ${rateLimitResult.resetIn} Sekunden.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetIn.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();

    // 1. Validate data with Zod
    const validation = bodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Ungültige Anfrage.",
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;
    const {
      name,
      email,
      phone,
      company,
      message,
      type = "contact",
      candidateId,
      candidateCode,
      bot_check,
    } = validatedData;

    // 2. Honeypot check (Spam protection)
    if (bot_check) {
      return NextResponse.json({ success: false, error: "No bots allowed" }, { status: 400 });
    }

    const inquiryType = type === "profile" ? "profile" : "contact";

    let supabaseSaved = false;
    let emailSent = false;
    let telegramSent = false;

    // 3. Save to Supabase
    try {
      const supabase = await createClient();

      const insertData: Record<string, unknown> = {
        client_name: name,
        email: email,
        phone: phone || null,
        company: company || null,
        message: message,
        type: inquiryType,
        status: "new",
      };

      if (inquiryType === "profile" && candidateCode) {
        insertData.candidate_code = candidateCode;
        insertData.candidate_id = candidateId || null;
      }

      const { data, error } = await supabase
        .from("inquiries")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("[Contact API] Supabase error:", error);
      } else {
        console.warn("[Contact API] ✓ Saved to Supabase:", data?.id);
        supabaseSaved = true;
      }
    } catch (supabaseError) {
      console.error("[Contact API] Supabase unexpected error:", supabaseError);
      // Continue even if Supabase fails
    }

    // 4. Send Email via nodemailer (SMTP) - with XSS protection
    try {
      // Check if SMTP is configured
      if (isSmtpConfigured()) {
        const transporter = getMailTransporter();
        if (!transporter) {
          throw new Error("SMTP transporter could not be initialized.");
        }

        const emailSubject =
          inquiryType === "profile"
            ? `🎯 Neue Profil-Anfrage: ${escapeHtml(name)}`
            : `📧 Neue Kontaktanfrage: ${escapeHtml(name)}`;

        // Escape all user input to prevent XSS
        let emailHtml = `
          <h2>${escapeHtml(emailSubject)}</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone || "Nicht angegeben")}</p>
          <p><strong>Firma:</strong> ${escapeHtml(company || "Nicht angegeben")}</p>
        `;

        if (inquiryType === "profile" && candidateCode) {
          emailHtml += `<p><strong>Kandidat:</strong> #${escapeHtml(candidateCode)}</p>`;
        }

        emailHtml += `
          <br/>
          <p><strong>Nachricht:</strong></p>
          <p style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; white-space: pre-wrap;">${escapeHtmlWithBreaks(message)}</p>
        `;

        await transporter.sendMail({
          from: `"DMF Website" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          replyTo: email,
          subject: emailSubject,
          html: emailHtml,
        });

        // Auto-reply to the sender
        const autoReplyHtml =
          inquiryType === "profile" && candidateCode
            ? profileInquiryAutoReplyTemplate(name, candidateCode)
            : contactAutoReplyTemplate(name);

        await transporter.sendMail({
          from: `"DMF Manpower" <${process.env.SMTP_USER}>`,
          to: email,
          subject:
            inquiryType === "profile"
              ? `✅ Ihre Profil-Anfrage #${candidateCode} wurde erhalten – DMF Manpower`
              : `✅ Ihre Anfrage wurde erhalten – DMF Manpower`,
          html: autoReplyHtml,
        });

        emailSent = true;
        console.warn("[Contact API] ✓ Email sent via nodemailer (incl. auto-reply)");
      } else {
        console.warn("[Contact API] SMTP not configured, skipping email");
      }
    } catch (emailError) {
      console.error("[Contact API] Email error:", emailError);
      // Non-blocking: Continue even if email fails
    }

    // 5. Send to Telegram (non-blocking)
    try {
      const telegramTitle =
        inquiryType === "profile"
          ? `🎯 <b>NEUE PROFIL-ANFRAGE</b>`
          : `📧 <b>NEUE KONTAKTANFRAGE</b>`;

      let telegramMessage = `${telegramTitle}\n\n`;

      if (inquiryType === "profile" && candidateCode) {
        telegramMessage += `👤 Kandidat: #${candidateCode}\n`;
      }

      telegramMessage +=
        `👤 Name: ${name}\n` +
        `📧 E-Mail: ${email}\n` +
        `📞 Telefon: ${phone || "Nicht angegeben"}\n` +
        `🏢 Firma: ${company || "Nicht angegeben"}\n` +
        `💬 Nachricht:\n${message}\n\n` +
        `📅 Zeitpunkt: ${new Date().toLocaleString("de-DE")}`;

      const telegramResponse = await fetch(`${request.nextUrl.origin}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: telegramMessage }),
      });

      if (!telegramResponse.ok) {
        console.warn("[Contact API] Telegram notification failed");
      } else {
        telegramSent = true;
        console.warn("[Contact API] ✓ Telegram sent");
      }
    } catch (telegramError) {
      console.error("[Contact API] Telegram error:", telegramError);
      // Non-blocking: Continue even if Telegram fails
    }

    // 6. Return success if at least one method succeeded
    if (supabaseSaved || emailSent) {
      return NextResponse.json(
        {
          success: true,
          message: "Anfrage wurde erfolgreich gesendet.",
          saved: supabaseSaved,
          emailSent: emailSent,
          telegramSent: telegramSent,
        },
        {
          status: 200,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          },
        }
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
    console.error("[Contact API] Validation or unexpected error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Angaben.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten.",
      },
      { status: 500 }
    );
  }
}
