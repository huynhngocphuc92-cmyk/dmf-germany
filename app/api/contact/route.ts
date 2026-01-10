import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Contact API Route
 * Handles contact form submissions
 * - Saves to Supabase inquiries table
 * - Sends notification to Telegram
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      message,
      type = "contact", // Default to "contact", can be "contact" or "profile"
      candidateId,
      candidateCode,
    } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, Email và Message là bắt buộc." },
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

    // Determine inquiry type
    const inquiryType = type === "profile" ? "profile" : "contact";

    let supabaseSaved = false;
    let telegramSent = false;

    // 1. Save to Supabase
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

      // Add candidate info if it's a profile inquiry
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
        console.log("[Contact API] ✓ Saved to Supabase:", data?.id);
        supabaseSaved = true;
      }
    } catch (supabaseError) {
      console.error("[Contact API] Supabase unexpected error:", supabaseError);
      // Continue even if Supabase fails
    }

    // 2. Send to Telegram (non-blocking)
    try {
      const telegramTitle = inquiryType === "profile" 
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
        console.log("[Contact API] ✓ Telegram sent");
      }
    } catch (telegramError) {
      console.error("[Contact API] Telegram error:", telegramError);
      // Non-blocking: Continue even if Telegram fails
    }

    // Return success if Supabase saved (prioritize DB save)
    if (supabaseSaved) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Anfrage wurde erfolgreich gesendet und gespeichert.",
          saved: true,
          telegramSent: telegramSent,
        },
        { status: 200 }
      );
    } else if (telegramSent) {
      // If only Telegram sent, still return success but with warning
      return NextResponse.json(
        { 
          success: true, 
          message: "Anfrage wurde gesendet, konnte aber nicht gespeichert werden.",
          saved: false,
          telegramSent: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: "Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut." 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten." 
      },
      { status: 500 }
    );
  }
}
