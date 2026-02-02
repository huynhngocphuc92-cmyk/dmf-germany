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

    // Debug: Log environment variables (không log password)
    console.log("=== EMAIL CONFIG DEBUG ===");
    console.log("SMTP_HOST:", process.env.SMTP_HOST || "smtp.gmail.com (default)");
    console.log("SMTP_PORT:", process.env.SMTP_PORT || "587 (default)");
    console.log("SMTP_USER:", process.env.SMTP_USER ? "✓ Đã cấu hình" : "✗ CHƯA CẤU HÌNH!");
    console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "✓ Đã cấu hình" : "✗ CHƯA CẤU HÌNH!");
    console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL || "✗ CHƯA CẤU HÌNH!");
    console.log("==========================");

    // Kiểm tra env variables bắt buộc
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error("Lỗi: SMTP_USER hoặc SMTP_PASSWORD chưa được cấu hình trong .env.local");
      return {
        success: false,
        message: "Cấu hình email server chưa hoàn tất. Vui lòng liên hệ quản trị viên.",
      };
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error("Lỗi: CONTACT_EMAIL chưa được cấu hình trong .env.local");
      return {
        success: false,
        message: "Địa chỉ email nhận chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
      };
    }

    // Lấy port và xác định secure
    const port = parseInt(process.env.SMTP_PORT || "587");
    // Port 465 = SSL (secure: true), Port 587 = STARTTLS (secure: false)
    const isSecure = port === 465;

    console.log("Secure mode:", isSecure ? "true (SSL)" : "false (STARTTLS)");

    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: isSecure, // true cho port 465, false cho port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Thêm options cho debug
      logger: true,
      debug: process.env.NODE_ENV === "development",
    });

    // Verify connection trước khi gửi
    console.log("Đang kiểm tra kết nối SMTP...");
    try {
      await transporter.verify();
      console.log("✓ Kết nối SMTP thành công!");
    } catch (verifyError) {
      console.error("✗ Lỗi kết nối SMTP:", verifyError);
      return {
        success: false,
        message: "Không thể kết nối đến email server. Vui lòng kiểm tra cấu hình SMTP.",
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

    // Plain text version
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

    // Send email - Gmail yêu cầu 'from' phải trùng với SMTP_USER
    console.log("Đang gửi email...");
    const mailOptions = {
      from: process.env.SMTP_USER, // Gmail bắt buộc phải dùng đúng email đăng nhập
      to: process.env.CONTACT_EMAIL,
      replyTo: email, // Khi reply sẽ gửi về email của khách
      subject: `Liên hệ mới từ Website DMF - ${name}`,
      text: textContent,
      html: htmlContent,
    };

    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      replyTo: mailOptions.replyTo,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("✓ Email đã gửi thành công! Message ID:", info.messageId);

    // =========================================
    // GOOGLE SHEETS CRM - "Fire and Forget"
    // =========================================
    // Save to Google Sheets as CRM backup
    // This is non-blocking and fail-safe (won't affect user experience)
    try {
      console.log("[CRM] Đang lưu vào Google Sheets...");

      const sheetResult = await appendToSheet({
        name: sanitizeForSheet(name),
        email: sanitizeForSheet(email),
        company: sanitizeForSheet(company || ""),
        phone: "", // Form hiện tại chưa có trường này
        industry: "", // Form hiện tại chưa có trường này
        message: sanitizeForSheet(message),
        source: "Website Contact Form",
        language: "de", // Có thể lấy từ cookie/session sau này
      });

      if (sheetResult.error) {
        console.warn("[CRM] ⚠️ Lưu sheet có lỗi (đã bỏ qua):", sheetResult.error);
      } else {
        console.log("[CRM] ✓ Đã lưu vào Google Sheets thành công!");
      }
    } catch (sheetError) {
      // "Fail Safe" - Log error but don't affect user experience
      console.error("[CRM] ❌ Lỗi lưu Google Sheets (đã bỏ qua):", sheetError);
    }
    // =========================================

    return {
      success: true,
      message:
        "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.",
    };
  } catch (error) {
    // Log chi tiết lỗi ra Terminal
    console.error("========================================");
    console.error("Lỗi gửi mail:", error);
    console.error("========================================");

    // Log thêm thông tin nếu là Error object
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Return user-friendly error message
    return {
      success: false,
      message:
        "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.",
    };
  }
}
