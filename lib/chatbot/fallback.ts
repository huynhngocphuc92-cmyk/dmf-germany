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
• **Full support in Germany:** Fast-track visa processing (§81a), airport pickup, 7-day settling-in kit, and continuous mentoring.

Next steps to connect with our team:
• **Book a consultation:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Or simply leave your contact details in this chat!`;
    }
    return `DMF Talents bietet ein strukturiertes **Duales Ausbildungsprogramm** für vietnamesische Talente:
• **Schwerpunktbranchen:** Pflege & Gesundheit, Handwerk, Gastronomie & Hotellerie, IT.
• **Vorbereitung in Vietnam:** Intensives Deutschtraining (A1 bis B2), fachliche Vorbereitung und interkulturelle Schulung.
• **Begleitung in Deutschland:** Beschleunigtes Fachkräfteverfahren (§81a), Behördenservice und persönliche 3-Jahres-Begleitung.

So erreichen Sie unsere Berater:
• **Beratungstermin buchen:** [Termin via Calendly vereinbaren](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Anfrage online:** [Kontaktformular öffnen](${SITE_URL}/#contact)
• Oder hinterlassen Sie einfach Ihre Kontaktdaten direkt hier im Chat!`;
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
• Hoặc để lại thông tin liên hệ ngay trong chat!`;
    }
    if (language === "en") {
      return `DMF Talents specializes in recruiting **Qualified Skilled Workers (§18a/b AufenthG)** from Vietnam:
• Rigorous pre-selection and verification of qualifications and practical experience.
• Full support for German credential recognition (Defizitbescheid & adaptation qualifications).
• Fast-track immigration under §81a AufenthG and long-term onboarding support.

How to get in touch:
• **Book a meeting:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Or submit your inquiry via [our contact form](${SITE_URL}/#contact).`;
    }
    return `DMF Talents vermittelt **qualifizierte Fachkräfte (§18a/b AufenthG)** aus Vietnam für deutsche Unternehmen:
• **Geprüfte Qualifikation:** Fachkräfte mit beruflicher Vorbildung und praktischer Erfahrung (insb. Pflege, Handwerk, Technik).
• **Anerkennungsverfahren:** Vollständige Unterstützung bei Defizitbescheid und Anpassungsqualifizierung.
• **Rechtliche Sicherheit:** Beschleunigtes Verfahren nach §81a AufenthG und umfassende Integrationsbegleitung vor Ort.

Kontaktieren Sie unser Beratungsteam für ein konkretes Kandidatenprofil:
• **Beratungstermin:** [Termin via Calendly buchen](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Online-Anfrage:** [Unverbindliche Personalanfrage stellen](${SITE_URL}/#contact)
• Oder hinterlassen Sie Ihre Kontaktdaten direkt im Chat!`;
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
• Mentoring học kỳ đầu tiên và hỗ trợ kết nối việc làm thêm (Werkstudent).

Liên hệ ngay để được đánh giá hồ sơ:
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})`;
    }
    if (language === "en") {
      return `DMF Talents supports international students entering **German Universities**:
• TestAS coaching, academic German preparation (DSH/TestDaF), and university admissions support.
• First-semester mentoring and working student (Werkstudent) job placement.

Connect with our education team:
• **Book a session:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})`;
    }
    return `DMF Talents bereitet Studierende auf ein erfolgreiches **Hochschulstudium in Deutschland** vor:
• TestAS Coaching, akademisches Deutsch (DSH/TestDaF) und Zulassungsbegleitung.
• Mentoring für das 1. Semester und Vermittlung von Werkstudentenstellen.
• Langfristige Karrierebegleitung bis zum Berufseinstieg.

Sprechen Sie mit unserem Bildungsteam:
• **Beratungstermin:** [Termin via Calendly buchen](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Oder hinterlassen Sie Ihre Kontaktdaten im Chat!`;
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
• Hoặc bạn có thể để lại số điện thoại/email trong khung chat, chúng tôi sẽ liên hệ lại trong vòng 24 giờ làm việc.`;
    }
    if (language === "en") {
      return `You can easily book a meeting or contact the DMF Talents advisory team directly:
• **Schedule an online meeting:** [Pick a slot on Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Or leave your contact details in this chat window, and we will get back to you within 24 hours.`;
    }
    return `Gerne können Sie direkt einen persönlichen Beratungstermin vereinbaren oder uns kontaktieren:
• **Online-Terminbuchung:** [Termin auf Calendly wählen](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Kontaktformular:** [Formular aufrufen](${SITE_URL}/#contact)
• Oder hinterlassen Sie einfach Ihre Kontaktdaten direkt hier im Chat – wir melden uns innerhalb von 24 Stunden bei Ihnen!`;
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
      return `Tại DMF Talents, mọi chi phí đều **minh bạch và rõ ràng**:
• Chỉ tính phí đào tạo và thủ tục hỗ trợ pháp lý, cam kết không có phí ẩn.
• Chi phí cho doanh nghiệp được tùy chỉnh theo từng dự án tuyển dụng và đào tạo.

Để nhận bảng dự toán chi tiết:
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Hoặc để lại thông tin để chúng tôi gửi báo giá riêng!`;
    }
    if (language === "en") {
      return `At DMF Talents, we maintain **complete pricing transparency**:
• Fees cover language training, professional qualification, and legal support — no hidden placement commissions.
• Tailored project quotes depend on the sector and group size.

To request a detailed proposal:
• **Book a call:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Or submit your details via our [contact form](${SITE_URL}/#contact).`;
    }
    return `Bei DMF Talents steht **Kostentransparenz** an erster Stelle:
• Gebühren fallen nur für Ausbildung, Sprachvorbereitung und rechtliche Begleitung an – keine versteckten Vermittlungsgebühren.
• Angebote für Arbeitgeber richten sich nach Branche, Gruppengröße und gewünschtem Leistungsumfang (P1.1 bis P3.7).

Fordern Sie gerne ein individuelles Angebot an:
• **Beratungsgespräch buchen:** [Termin via Calendly vereinbaren](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Online:** [Unverbindliches Angebot anfragen](${SITE_URL}/#contact)`;
  }

  // 6. Default / General Greeting
  if (language === "vi") {
    return `Xin chào! Tôi là trợ lý ảo của **DMF Talents** - Học viện đào tạo và kết nối nhân tài Việt Nam với thị trường Đức.

Chúng tôi cung cấp 3 chương trình chính:
1. **Du học nghề (Ausbildung):** Điều dưỡng, Nhà hàng - Khách sạn, Kỹ thuật, IT (Đào tạo tiếng Đức A1-B2 & hỗ trợ trọn gói).
2. **Lao động chuyên môn (§18a/b):** Hỗ trợ công nhận văn bằng và visa cho người đã có tay nghề.
3. **Du học Đại học (Studium):** TestAS, DSH/TestDaF và đồng hành hòa nhập.

Bạn đang quan tâm đến chương trình nào?
• **Đặt lịch tư vấn:** [Đặt lịch qua Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• Hoặc để lại lời nhắn kèm thông tin liên hệ ngay tại đây!`;
  }

  if (language === "en") {
    return `Hello! I am the virtual assistant for **DMF Talents** — bridging qualified Vietnamese talent with the German labor market.

We offer three primary programs:
1. **Vocational Training (Ausbildung):** Nursing, Skilled Crafts, Hospitality, IT (A1-B2 language school & 3-year support).
2. **Skilled Workers (§18a/b):** Foreign credential recognition and fast-track immigration.
3. **University Program (Studium):** TestAS, academic German, and university placement.

How can we assist you today?
• **Book a consultation:** [Schedule via Calendly](${CALENDLY_URL})
• **Email:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Website:** [Visit dmf-talents.de](${SITE_URL})
• Or leave your contact details here so our team can follow up!`;
  }

  return `Guten Tag! Ich bin der virtuelle Assistent von **DMF Talents** — Ihrer Akademie für qualifizierte Fachkräfte und Auszubildende aus Vietnam.

Unsere drei Kernprogramme:
1. **Duale Ausbildung:** Pflege, Handwerk, Gastronomie, IT mit intensiver Sprachvorbereitung (A1-B2) und 3-Jahres-Begleitung.
2. **Fachkräfte (§18a/b AufenthG):** Qualifizierte Kräfte mit Anerkennungsbegleitung und beschleunigtem Visumsverfahren (§81a).
3. **Studienprogramm:** Gezielte Vorbereitung auf ein Hochschulstudium in Deutschland.

Wie kann ich Ihnen weiterhelfen?
• **Persönliche Beratung:** [Termin via Calendly vereinbaren](${CALENDLY_URL})
• **E-Mail:** [${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})
• **Kontakt:** [Anfrage über Website senden](${SITE_URL}/#contact)
• Oder hinterlassen Sie uns gerne Ihre Kontaktdaten direkt hier im Chat!`;
}
