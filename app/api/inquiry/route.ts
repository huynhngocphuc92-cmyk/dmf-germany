import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/actions";

/**
 * Inquiry API Route
 * Handles candidate profile inquiry requests
 * Sends notifications to Telegram and Email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      candidateCode,
      candidateId,
      name,
      email,
      phone,
      company,
      message,
    } = body;

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
      return NextResponse.json(
        { success: false, error: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    // Send to Telegram
    try {
      const telegramResponse = await fetch(`${request.nextUrl.origin}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `🎯 <b>NEUE PROFIL-ANFRAGE</b>\n\n` +
            `👤 Kandidat: #${candidateCode}\n` +
            `📧 Kontakt: ${email}\n` +
            `📞 Telefon: ${phone || "Nicht angegeben"}\n` +
            `🏢 Firma: ${company || "Nicht angegeben"}\n` +
            `💬 Nachricht: ${message || "Keine zusätzliche Nachricht"}\n` +
            `📅 Zeitpunkt: ${new Date().toLocaleString("de-DE")}`
        }),
      });

      if (!telegramResponse.ok) {
        console.warn("[Inquiry API] Telegram notification failed");
      }
    } catch (telegramError) {
      console.error("[Inquiry API] Telegram error:", telegramError);
      // Non-blocking: Continue even if Telegram fails
    }

    // Send to Email (via server action)
    try {
      const emailFormData = new FormData();
      emailFormData.append("name", name);
      emailFormData.append("email", email);
      emailFormData.append("company", company || "");
      emailFormData.append(
        "message",
        `Profil-Anfrage für Kandidat #${candidateCode}\n\n` +
        `Kandidat-ID: ${candidateId}\n` +
        `Telefon: ${phone || "Nicht angegeben"}\n\n` +
        `Nachricht des Kunden:\n${message || "Keine zusätzliche Nachricht"}`
      );

      const emailResult = await sendEmail(emailFormData);
      
      if (!emailResult.success) {
        console.warn("[Inquiry API] Email sending failed:", emailResult.message);
        // Don't fail the whole request if email fails
      }
    } catch (emailError) {
      console.error("[Inquiry API] Email error:", emailError);
      // Non-blocking: Continue even if email fails
    }

    return NextResponse.json(
      { success: true, message: "Anfrage wurde erfolgreich gesendet." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Inquiry API] Unexpected error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten." 
      },
      { status: 500 }
    );
  }
}
