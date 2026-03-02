import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { profileInquiryAutoReplyTemplate } from "@/lib/email-templates";

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
    const rateLimitResult = checkRateLimit(`inquiry:${clientIp}`, RATE_LIMITS.CONTACT);

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
    const { candidateCode, candidateId, name, email, phone, company, message } = body;

    // Validation
    if (!name || !email || !candidateCode) {
      return NextResponse.json(
        { success: false, error: "Name, Email và Candidate Code là bắt buộc." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Email không hợp lệ." }, { status: 400 });
    }

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
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        });

        // Notify admin
        await transporter.sendMail({
          from: `"DMF Website" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          replyTo: email,
          subject: `🎯 Neue Profil-Anfrage: #${candidateCode} von ${name}`,
          html: `<h2>Neue Profil-Anfrage</h2><p><b>Kandidat:</b> #${candidateCode}</p><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Firma:</b> ${company || "–"}</p><p><b>Nachricht:</b> ${message || "–"}</p>`,
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
