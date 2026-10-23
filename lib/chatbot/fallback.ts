import { SITE_URL } from "@/lib/site";
import { PRIMARY_CONTACT } from "@/lib/company/contact";

export type SupportedChatLanguage = "de" | "en" | "vi";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/contact-dmf/30min";

export function getFallbackChatResponse(
  language: SupportedChatLanguage,
  userMessage: string
): string {
  const lower = userMessage.toLowerCase();

  // 1. Ausbildung / Vocational Training
  if (
    lower.includes("ausbildung") ||
    lower.includes("azubi") ||
    lower.includes("du học nghề") ||
    lower.includes("học nghề") ||
    lower.includes("vocation") ||
    lower.includes("apprentice") ||
    lower.includes("trainee")
  ) {
    if (language === "vi") {
      return `DMF Talents cung cấp chương trình **Du học nghề tại Đức** toàn diện:
• **Ngành nghề:** Điều dưỡng / Y tế, Khách sạn - Nhà hàng, Cơ khí - Điện tử, CNTT.
• **Đào tạo tại Việt Nam:** Tiếng Đức đạt chuẩn B1/B2, kỹ năng làm việc & hòa nhập văn hóa Đức.
• **Đồng hành tại Đức:** Hỗ trợ thủ tục visa §81a, đưa đón sân bay và đồng hành 3 năm suốt quá trình học.

Bạn có thể liên hệ trực tiếp để được tư vấn lộ trình:
• **Đặt lịch tư vấn 1-1:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Hoặc bạn có thể để lại thông tin liên hệ ngay trong khung chat này!`;
    }
    if (language === "en") {
      return `DMF Talents provides a structured **Dual Vocational Training (Ausbildung)** program for Vietnamese talents:
• **Key sectors:** Nursing & Healthcare, Hospitality, Skilled Crafts & Technical, IT.
• **Preparation in Vietnam:** Intensive German language training (A1 to B2), cultural orientation, and professional skills.
• **Support in Germany:** Fast-track visa processing (§81a), administrative onboarding, and continuous mentoring.

Next steps to connect with our team:
• **Book a consultation:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Online inquiry:** [Submit hiring inquiry](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
    }
    return `DMF Talents bietet ein strukturiertes **Duales Ausbildungsprogramm** für vietnamesische Talente:
• **Schwerpunktbranchen:** Pflege & Gesundheit, Handwerk, Gastronomie & Hotellerie, IT.
• **Vorbereitung in Vietnam:** Intensives Deutschtraining (A1 bis B2), fachliche Vorbereitung und interkulturelle Schulung.
• **Begleitung in Deutschland:** Beschleunigtes Fachkräfteverfahren (§81a), Behördenservice und individuelle Begleitung.

So erreichen Sie unsere Berater:
• **Beratungstermin buchen:** [Termin via Calendly vereinbaren](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Anfrage online:** [Personalbedarf melden](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
  }

  // 2. Fachkräfte / Skilled Workers / Pflege
  if (
    lower.includes("fachkraft") ||
    lower.includes("fachkräfte") ||
    lower.includes("pflege") ||
    lower.includes("nurs") ||
    lower.includes("skilled") ||
    lower.includes("worker") ||
    lower.includes("hire") ||
    lower.includes("hiring") ||
    lower.includes("staff") ||
    lower.includes("recruit") ||
    lower.includes("lao động") ||
    lower.includes("tay nghề") ||
    lower.includes("mitarbeiter") ||
    lower.includes("personal")
  ) {
    if (language === "vi") {
      return `DMF Talents hỗ trợ chương trình **Lao động chuyên môn (§18a/b AufenthG)**:
• Tuyển chọn nhân sự đã có bằng cấp và kinh nghiệm thực tế tại Việt Nam.
• Hỗ trợ toàn diện thủ tục công nhận bằng cấp (Anerkennung, Defizitbescheid) và visa lao động.
• Đào tạo tiếng Đức chuyên ngành B1/B2 và đồng hành ổn định cuộc sống tại Đức.

Hãy kết nối với chúng tôi để nhận hồ sơ ứng viên:
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Gửi yêu cầu trực tuyến:** [Đăng ký nhu cầu nhân sự](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
    }
    if (language === "en") {
      return `DMF Talents specializes in recruiting **Qualified Skilled Workers (§18a/b AufenthG)** from Vietnam:
• Rigorous pre-selection and verification of qualifications and practical experience.
• Full support for German credential recognition (Defizitbescheid & adaptation qualifications).
• Fast-track immigration under §81a AufenthG and long-term onboarding support.

How to get in touch:
• **Book a meeting:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Or submit your inquiry via [our employer form](${SITE_URL}/fuer-arbeitgeber/personalbedarf).`;
    }
    return `DMF Talents vermittelt **qualifizierte Fachkräfte (§18a/b AufenthG)** aus Vietnam für deutsche Unternehmen:
• **Geprüfte Qualifikation:** Fachkräfte mit beruflicher Vorbildung und praktischer Erfahrung (insb. Pflege, Handwerk, Technik).
• **Anerkennungsverfahren:** Vollständige Unterstützung bei Defizitbescheid und Anpassungsqualifizierung.
• **Rechtliche Begleitung:** Beschleunigtes Verfahren nach §81a AufenthG und abgestimmte Integrationsbegleitung vor Ort.

Kontaktieren Sie unser Beratungsteam für ein konkretes Kandidatenprofil:
• **Beratungstermin:** [Termin via Calendly buchen](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Online-Anfrage:** [Unverbindliche Personalanfrage stellen](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
  }

  // 3. Studium / University
  if (
    lower.includes("studium") ||
    lower.includes("universit") ||
    lower.includes("đại học") ||
    lower.includes("bachelor") ||
    lower.includes("master") ||
    lower.includes("student")
  ) {
    if (language === "vi") {
      return `DMF Talents đồng hành cùng sinh viên Việt Nam trong **Chương trình Du học Đại học tại Đức**:
• Luyện thi TestAS, đào tạo tiếng Đức học thuật DSH/TestDaF.
• Hướng dẫn nộp hồ sơ xin thư mời nhập học tại các trường đại học uy tín.
• Định hướng học kỳ đầu tiên và hỗ trợ thông tin học tập tại Đức.

Liên hệ ngay để được đánh giá hồ sơ:
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})`;
    }
    if (language === "en") {
      return `DMF Talents supports international students preparing for **German Universities**:
• TestAS coaching, academic German preparation (DSH/TestDaF), and university admissions guidance.
• First-semester orientation and academic mentoring.

Connect with our education team:
• **Book a session:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})`;
    }
    return `DMF Talents bereitet Studierende auf ein erfolgreiches **Hochschulstudium in Deutschland** vor:
• TestAS Coaching, akademisches Deutsch (DSH/TestDaF) und Zulassungsbegleitung.
• Orientierung für das 1. Semester und Studienbegleitung.

Sprechen Sie mit unserem Bildungsteam:
• **Beratungstermin:** [Termin via Calendly buchen](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})`;
  }

  // 4. Termine / Beratung / Booking
  if (
    lower.includes("termin") ||
    lower.includes("beratung") ||
    lower.includes("buch") ||
    lower.includes("book") ||
    lower.includes("consult") ||
    lower.includes("appointment") ||
    lower.includes("lịch") ||
    lower.includes("liên hệ") ||
    lower.includes("contact")
  ) {
    if (language === "vi") {
      return `Bạn có thể dễ dàng đặt lịch trao đổi hoặc liên hệ trực tiếp với đội ngũ DMF Talents:
• **Đặt lịch hẹn trực tuyến:** [Chọn khung giờ trên Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Biểu mẫu trực tuyến:** [Gửi yêu cầu nhân sự](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
    }
    if (language === "en") {
      return `You can easily book a meeting or contact the DMF Talents advisory team directly:
• **Schedule an online meeting:** [Pick a slot on Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Employer inquiry:** [Submit online form](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
    }
    return `Gerne können Sie direkt einen persönlichen Beratungstermin vereinbaren oder uns kontaktieren:
• **Online-Terminbuchung:** [Termin auf Calendly wählen](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Kontaktformular:** [Personalbedarf online melden](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
  }

  // 5. Kosten / Preise
  if (
    lower.includes("preis") ||
    lower.includes("kost") ||
    lower.includes("gebühr") ||
    lower.includes("cost") ||
    lower.includes("price") ||
    lower.includes("fee") ||
    lower.includes("giá") ||
    lower.includes("chi phí")
  ) {
    if (language === "vi") {
      return `Tại DMF Talents, mọi chi phí và phạm vi dịch vụ đều được **thỏa thuận minh bạch theo hợp đồng**:
• Phạm vi đào tạo, chuẩn bị ngôn ngữ và hỗ trợ thủ tục được xây dựng theo nhu cầu cụ thể.
• Chi phí cho doanh nghiệp được tùy chỉnh theo từng dự án tuyển dụng và số lượng nhân sự.

Để nhận bảng dự toán chi tiết:
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Trực tuyến:** [Gửi yêu cầu báo giá](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
    }
    if (language === "en") {
      return `At DMF Talents, we maintain **transparent, contractually agreed pricing**:
• Service scope, language preparation, and administrative support are tailored to your specific project requirements.
• Custom proposals depend on the sector, qualification profile, and hiring volume.

To request a detailed proposal:
• **Book a call:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Or submit your details via our [employer inquiry form](${SITE_URL}/fuer-arbeitgeber/personalbedarf).`;
    }
    return `Bei DMF Talents setzen wir auf **100% Kostentransparenz** – Leistungsumfang und Konditionen werden individuell vereinbart:
• Unsere Angebote umfassen je nach Bedarf Kandidatenauswahl, Sprachvorbereitung sowie Begleitung im Anerkennungs- und Visaverfahren.
• Die konkreten Konditionen für Arbeitgeber richten sich nach Branche, Anforderungsprofil und gewünschtem Betreuungsumfang.

Fordern Sie gerne ein individuelles Angebot an:
• **Beratungsgespräch buchen:** [Termin via Calendly vereinbaren](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Online:** [Unverbindliches Angebot anfragen](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
  }

  // 6. Default / General Greeting
  if (language === "vi") {
    return `Xin chào! Tôi là trợ lý ảo của **DMF Talents** - Học viện đào tạo và kết nối nhân tài Việt Nam với thị trường Đức.

Chúng tôi cung cấp 3 chương trình chính:
1. **Du học nghề (Ausbildung):** Điều dưỡng, Nhà hàng - Khách sạn, Kỹ thuật, IT (Đào tạo tiếng Đức A1-B2 & đồng hành).
2. **Lao động chuyên môn (§18a/b):** Hỗ trợ công nhận văn bằng và thủ tục visa cho nhân sự có tay nghề.
3. **Du học Đại học (Studium):** Định hướng hồ sơ và chuẩn bị tiếng Đức học thuật.

Bạn đang quan tâm đến chương trình nào?
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Gửi yêu cầu:** [Biểu mẫu dành cho doanh nghiệp](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
  }

  if (language === "en") {
    return `Hello! I am the virtual assistant for **DMF Talents** — connecting qualified Vietnamese talent with employers in Germany.

We offer three primary programs:
1. **Vocational Training (Ausbildung):** Nursing, Skilled Crafts, Hospitality, IT (A1-B2 language preparation & onboarding support).
2. **Skilled Workers (§18a/b):** Foreign credential recognition and fast-track visa support.
3. **University Program (Studium):** TestAS, academic German, and admissions guidance.

How can we assist you today?
• **Book a consultation:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Employer Inquiry:** [Submit hiring needs](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
  }

  return `Guten Tag! Ich bin der virtuelle Assistent von **DMF Talents** — Ihrer Akademie für qualifizierte Fachkräfte und Auszubildende aus Vietnam.

Unsere drei Kernprogramme:
1. **Duale Ausbildung:** Pflege, Handwerk, Gastronomie, IT mit intensiver Sprachvorbereitung (A1-B2) und strukturierter Begleitung.
2. **Fachkräfte (§18a/b AufenthG):** Qualifizierte Kräfte mit Anerkennungsbegleitung und beschleunigtem Visumsverfahren (§81a).
3. **Studienprogramm:** Gezielte Vorbereitung auf ein Hochschulstudium in Deutschland.

Wie kann ich Ihnen weiterhelfen?
• **Persönliche Beratung:** [Termin via Calendly vereinbaren](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Kontakt:** [Personalbedarf online melden](${SITE_URL}/fuer-arbeitgeber/personalbedarf)`;
}
