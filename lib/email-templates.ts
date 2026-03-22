/**
 * DMF Germany – Email Templates
 * HTML email templates cho auto-reply và notifications
 */

import { escapeHtml } from "@/lib/sanitize";
import { TRANSLATIONS } from "@/lib/translations";

const DMF_BLUE = "#1e3a5f";
const DMF_TEAL = "#0891b2";
const DMF_ORANGE = "#f97316";
const IMPRESSUM = TRANSLATIONS.de.legal.impressum.sections;
const CONTACT_EMAIL = TRANSLATIONS.de.contact.email;
const WEBSITE_URL = "https://dmf-talents.de";

// Base layout wrapper
function baseLayout(content: string, previewText = ""): string {
  const addressLine = [
    IMPRESSUM.address.street,
    IMPRESSUM.address.city,
    IMPRESSUM.address.province,
    IMPRESSUM.address.country,
  ].join(", ");

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DMF Talents</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,${DMF_BLUE} 0%,#2563a8 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">DMF Talents</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Fachkräfte aus Vietnam für Deutschland</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e8ecef;padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#475569;font-size:12px;line-height:1.7;text-align:left;">
                    <p style="margin:0 0 6px;font-weight:700;color:${DMF_BLUE};">${IMPRESSUM.company.name}</p>
                    <p style="margin:0 0 4px;">${IMPRESSUM.company.legalForm}</p>
                    <p style="margin:0 0 4px;">${addressLine}</p>
                    <p style="margin:0 0 10px;">Vertreten durch ${IMPRESSUM.representative.name}</p>
                    <p style="margin:0;color:#64748b;">
                      <a href="${WEBSITE_URL}" style="color:${DMF_TEAL};text-decoration:none;">dmf-talents.de</a>
                      &nbsp;·&nbsp;
                      <a href="mailto:${CONTACT_EMAIL}" style="color:${DMF_TEAL};text-decoration:none;">${CONTACT_EMAIL}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================
// TEMPLATE 1: Contact Form Auto-reply
// ============================================

export function contactAutoReplyTemplate(name: string): string {
  const safeName = escapeHtml(name);

  const content = `
    <h2 style="margin:0 0 8px;color:${DMF_BLUE};font-size:22px;font-weight:700;">Vielen Dank, ${safeName}! 🎉</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
      Wir haben Ihre Anfrage erhalten und werden uns innerhalb von <strong>1–2 Werktagen</strong> bei Ihnen melden.
    </p>

    <div style="background:#f0f9ff;border-left:4px solid ${DMF_TEAL};border-radius:4px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:${DMF_BLUE};font-size:14px;font-weight:600;">Was passiert als nächstes?</p>
      <ul style="margin:8px 0 0;padding-left:20px;color:#475569;font-size:14px;line-height:1.8;">
        <li>Unser Team prüft Ihre Anfrage</li>
        <li>Wir senden Ihnen passende Kandidatenprofile</li>
        <li>Auf Wunsch vereinbaren wir ein kostenloses Beratungsgespräch</li>
      </ul>
    </div>

    <div style="background:#fff7ed;border-radius:8px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 12px;color:${DMF_BLUE};font-size:15px;font-weight:600;">Möchten Sie sofort einen Termin buchen?</p>
      <a href="https://calendly.com/contact-dmf/30min" 
         style="display:inline-block;background:${DMF_ORANGE};color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
        📅 Kostenloses Beratungsgespräch
      </a>
    </div>

    <hr style="border:none;border-top:1px solid #e8ecef;margin:24px 0;" />

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="33.33%" valign="top" style="padding:0 8px 0 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;">
            <tr>
              <td style="padding:16px;text-align:center;">
                <div style="font-size:24px;margin-bottom:4px;">🏥</div>
                <p style="margin:0;color:${DMF_BLUE};font-size:13px;font-weight:600;">Pflege</p>
                <p style="margin:4px 0 0;color:#64748b;font-size:12px;">Pflegefachkräfte & Azubis</p>
              </td>
            </tr>
          </table>
        </td>
        <td width="33.33%" valign="top" style="padding:0 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;">
            <tr>
              <td style="padding:16px;text-align:center;">
                <div style="font-size:24px;margin-bottom:4px;">🔧</div>
                <p style="margin:0;color:${DMF_BLUE};font-size:13px;font-weight:600;">Handwerk</p>
                <p style="margin:4px 0 0;color:#64748b;font-size:12px;">Fachkräfte & Auszubildende</p>
              </td>
            </tr>
          </table>
        </td>
        <td width="33.33%" valign="top" style="padding:0 0 0 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;">
            <tr>
              <td style="padding:16px;text-align:center;">
                <div style="font-size:24px;margin-bottom:4px;">🍽️</div>
                <p style="margin:0;color:${DMF_BLUE};font-size:13px;font-weight:600;">Gastronomie</p>
                <p style="margin:4px 0 0;color:#64748b;font-size:12px;">Service & Küche</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return baseLayout(content, `Ihre Anfrage bei DMF Talents ist eingegangen – wir melden uns bald!`);
}

// ============================================
// TEMPLATE 2: B2B Inquiry Auto-reply
// ============================================

export function inquiryAutoReplyTemplate(name: string, company?: string): string {
  const safeName = escapeHtml(name);
  const safeCompany = company ? escapeHtml(company) : undefined;
  const greeting = safeCompany ? `${safeName} von ${safeCompany}` : safeName;

  const content = `
    <h2 style="margin:0 0 8px;color:${DMF_BLUE};font-size:22px;font-weight:700;">Ihre B2B-Anfrage ist eingegangen ✅</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
      Sehr geehrte/r <strong>${greeting}</strong>,<br/><br/>
      vielen Dank für Ihr Interesse an DMF Talents. Wir haben Ihre Anfrage erhalten 
      und ein spezialisierter Berater wird sich <strong>innerhalb von 24 Stunden</strong> bei Ihnen melden.
    </p>

    <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-radius:10px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:${DMF_BLUE};font-size:15px;font-weight:700;">🏆 Warum DMF Talents?</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;color:#475569;font-size:14px;">✓ Full-Service: Rekrutierung bis Visum & Integration</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#475569;font-size:14px;">✓ Rechtlich geprüfte Kandidaten (B1/B2 Deutschniveau)</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#475569;font-size:14px;">✓ Keine versteckten Vermittlungsgebühren</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#475569;font-size:14px;">✓ Über 200 erfolgreiche Vermittlungen in Deutschland</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://calendly.com/contact-dmf/30min" 
         style="display:inline-block;background:${DMF_BLUE};color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.3px;">
        📅 Erstgespräch jetzt buchen
      </a>
      <p style="margin:10px 0 0;color:#94a3b8;font-size:12px;">Kostenlos und unverbindlich · 30 Minuten</p>
    </div>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;">
      <p style="margin:0;color:#64748b;font-size:13px;">
        📞 <strong>Direktkontakt:</strong> ${CONTACT_EMAIL}<br/>
        🌐 <strong>Website:</strong> <a href="${WEBSITE_URL}" style="color:${DMF_TEAL};">dmf-talents.de</a>
      </p>
    </div>
  `;

  return baseLayout(content, `Ihre Anfrage bei DMF Talents wurde erfolgreich übermittelt`);
}

// ============================================
// TEMPLATE 3: Kandidaten-Profil-Anfrage Auto-reply
// ============================================

export function profileInquiryAutoReplyTemplate(name: string, candidateCode: string): string {
  const safeName = escapeHtml(name);
  const safeCandidateCode = escapeHtml(candidateCode);

  const content = `
    <h2 style="margin:0 0 8px;color:${DMF_BLUE};font-size:22px;font-weight:700;">Profil-Anfrage erhalten 👤</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
      Sehr geehrte/r <strong>${safeName}</strong>,<br/><br/>
      Ihre Anfrage für Kandidat <strong style="color:${DMF_TEAL};">#${safeCandidateCode}</strong> ist eingegangen. 
      Unser Team prüft die Verfügbarkeit und sendet Ihnen innerhalb von <strong>24 Stunden</strong> 
      das vollständige Profil und weitere Informationen.
    </p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#166534;font-size:14px;">
        ✅ <strong>Kandidat #${safeCandidateCode}</strong> – Anfrage in Bearbeitung
      </p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#475569;font-size:14px;">Möchten Sie mehr Kandidaten sehen oder direkt sprechen?</p>
      <a href="https://calendly.com/contact-dmf/30min" 
         style="display:inline-block;background:${DMF_ORANGE};color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
        📅 Beratungsgespräch buchen
      </a>
    </div>
  `;

  return baseLayout(content, `Ihre Profil-Anfrage #${safeCandidateCode} ist bei uns eingegangen`);
}
