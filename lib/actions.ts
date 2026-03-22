"use server";

import nodemailer from "nodemailer";
import { appendToSheet, sanitizeForSheet } from "@/lib/google-sheets";
import { escapeHtml } from "@/lib/sanitize";

interface SendEmailResult {
  success: boolean;
  message: string;
}

export async function sendEmail(formData: FormData): Promise<SendEmailResult> {
  try {
    // Extract form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const company = formData.get("company") as string;
    const message = formData.get("message") as string;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        success: false,
        message: "Bitte füllen Sie alle Pflichtfelder aus.",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      };
    }

    // Validate required SMTP configuration before attempting to send.
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error("[Mail] SMTP credentials are missing.");
      return {
        success: false,
        message:
          "Die E-Mail-Serverkonfiguration ist unvollständig. Bitte kontaktieren Sie den Administrator.",
      };
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error("[Mail] CONTACT_EMAIL is not configured.");
      return {
        success: false,
        message:
          "Die Empfängeradresse ist nicht konfiguriert. Bitte kontaktieren Sie den Administrator.",
      };
    }

    // Determine the SMTP port and security mode.
    const port = parseInt(process.env.SMTP_PORT || "587");
    const isSecure = port === 465;

    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Keep verbose transport logs limited to development.
      logger: process.env.NODE_ENV === "development",
      debug: process.env.NODE_ENV === "development",
    });

    // Verify the SMTP connection before attempting delivery.
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("[Mail] SMTP verification failed:", verifyError);
      return {
        success: false,
        message:
          "Nicht möglich, eine Verbindung zum E-Mail-Server herzustellen. Bitte prüfen Sie die SMTP-Konfiguration.",
      };
    }

    // Email content - HTML formatted (with XSS protection)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1e3a5f; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #2d5a87; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📩 Neue Kontaktanfrage</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">DMF Vietnam Website</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name:</div>
              <div class="value">${escapeHtml(name)}</div>
            </div>
            <div class="field">
              <div class="label">📧 E-Mail:</div>
              <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
            </div>
            ${
              company
                ? `
            <div class="field">
              <div class="label">🏢 Firma:</div>
              <div class="value">${escapeHtml(company)}</div>
            </div>
            `
                : ""
            }
            <div class="field">
              <div class="label">💬 Nachricht:</div>
              <div class="value" style="white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch über das Kontaktformular der DMF Vietnam Website gesendet.</p>
              <p>🌐 <a href="https://dmf-vietnam.de">www.dmf-vietnam.de</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain-text version
    const textContent = `
Neue Kontaktanfrage von der DMF Vietnam Website

Name: ${name}
E-Mail: ${email}
${company ? `Firma: ${company}` : ""}

Nachricht:
${message}

---
Diese E-Mail wurde automatisch über das Kontaktformular gesendet.
    `.trim();

    // Gmail requires the from address to match the authenticated SMTP account.
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Neue Kontaktanfrage über die DMF Website - ${name}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    // =========================================
    // GOOGLE SHEETS CRM - "Fire and Forget"
    // =========================================
    // Save to Google Sheets as a non-blocking CRM backup.
    try {
      const sheetResult = await appendToSheet({
        name: sanitizeForSheet(name),
        email: sanitizeForSheet(email),
        company: sanitizeForSheet(company || ""),
        phone: "",
        industry: "",
        message: sanitizeForSheet(message),
        source: "Website Contact Form",
        language: "de",
      });

      if (sheetResult.error) {
        console.warn("[CRM] Google Sheets write failed and was ignored:", sheetResult.error);
      }
    } catch (sheetError) {
      console.error("[CRM] Google Sheets write failed and was ignored:", sheetError);
    }
    // =========================================

    return {
      success: true,
      message:
        "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.",
    };
  } catch (error) {
    console.error("[Mail] Failed to send contact email:", error);

    // Add extra diagnostic detail when the thrown value is an Error instance.
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Return a user-friendly error message.
    return {
      success: false,
      message:
        "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.",
    };
  }
}
