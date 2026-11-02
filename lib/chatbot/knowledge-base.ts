import { SITE_URL } from "@/lib/site";
import { PRIMARY_CONTACT } from "@/lib/company/contact";
import type { SupportedChatLanguage } from "@/lib/chatbot/fallback";

// ============================================
// DMF TALENTS - CHATBOT KNOWLEDGE BASE
// ============================================

export const DMF_KNOWLEDGE_BASE = {
  // Company Overview
  company: {
    name: "DMF Talents",
    fullName: "DMF Talents",
    legalOperator: "DMF VIETNAM JOINT STOCK COMPANY",
    legalRepresentative: "NGUYEN HUYNH DANG KHOA",
    tagline: "Ihre Akademie für qualifizierte Talente aus Vietnam",
    description: `DMF Talents ist die öffentliche Marke für die Vermittlung und Ausbildung
vietnamesischer Talente für den deutschen Arbeitsmarkt. Wir bieten drei Hauptprogramme:
Ausbildung (duale Berufsausbildung), Studium (Universitätsprogramm) und Fachkräfte-Vermittlung (§18a/b).`,
    founded: "2020",
    location: "Deutschland & Vietnam",
    website: "https://dmf-talents.de",
    contact: {
      email: PRIMARY_CONTACT.email,
      phone: PRIMARY_CONTACT.phone,
    },
  },

  // Three Main Programs
  programs: {
    ausbildung: {
      name: "Ausbildungsprogramm",
      nameEN: "Vocational Training Program",
      nameVN: "Chương trình Du học Nghề",
      description: `Das duale Ausbildungsprogramm für vietnamesische Auszubildende in Deutschland.
Wir bereiten Kandidaten sprachlich (A1-B2), fachlich und kulturell vor.`,
      targetGroup: "Junge Vietnamesen (18-25 Jahre) mit Abitur oder vergleichbarem Abschluss",
      duration: "3 Jahre Ausbildung + 12 Monate Vorbereitung",
      highlights: [
        "156 Unterrichtseinheiten pro Jahr",
        "Sprachniveau A1 bis B2 vor Einreise",
        "Work Skills Training",
        "3-Jahres-Begleitung während der Ausbildung",
        "Interkulturelle Schulung",
      ],
      sectors: ["Pflege", "Handwerk", "Hotel & Gastronomie", "IT"],
      costs:
        "Kosten nur für Bildung & rechtliche Begleitung - keine versteckten Vermittlungsgebühren",
    },
    studium: {
      name: "Studienprogramm",
      nameEN: "University Program",
      nameVN: "Chương trình Du học Đại học",
      description: `Wir bereiten vietnamesische Studierende auf ein erfolgreiches Studium in Deutschland vor.
TestAS Coaching, DSH/TestDaF Vorbereitung, 1. Semester Mentoring und Karrierebegleitung.`,
      targetGroup: "Vietnamesische Abiturienten mit guten Noten",
      duration: "Bachelor: 3-4 Jahre, Master: 2 Jahre",
      highlights: [
        "TestAS Coaching",
        "Akademisches Deutsch (DSH/TestDaF Niveau)",
        "1. Semester Mentoring",
        "Werkstudenten-Vermittlung",
        "Karriere-Coaching bis zum Berufseinstieg",
      ],
      costs: "Kosten nur für Bildung & Studienbegleitung",
    },
    skilled_workers: {
      name: "Fachkräfte-Programm",
      nameEN: "Skilled Workers Program",
      nameVN: "Chương trình Lao động Chuyên môn",
      description: `Vermittlung qualifizierter Fachkräfte aus Vietnam nach §18a/b Aufenthaltsgesetz.
Wir begleiten bei der Anerkennung ausländischer Abschlüsse und dem erfolgreichen Einstieg in den deutschen Arbeitsmarkt.`,
      targetGroup: "Qualifizierte Fachkräfte mit Berufsabschluss oder Berufserfahrung",
      duration: "6-12 Monate bis zur Einreise",
      highlights: [
        "Anerkennung Support (Defizitbescheid, Anpassungsqualifizierung)",
        "Placement Service - Matching mit Arbeitgebern",
        "12 Monate Nachbetreuung",
        "Work Skills Training",
        "§18a/b Visa-Service",
      ],
      sectors: [
        "Pflege & Gesundheit",
        "Handwerk & Bau",
        "Industrie & Technik",
        "Gastronomie & Hotel",
      ],
      costs: "Kosten nur für Bildung & rechtliche Begleitung",
    },
  },

  // Service Modules (P1.1 - P3.7)
  serviceModules: {
    phase1_preparation: {
      name: "Phase 1: Vorbereitung",
      services: [
        {
          code: "P1.1",
          name: "Rekrutierung & Screening",
          desc: "Auswahl qualifizierter Kandidaten nach Ihren Anforderungen",
        },
        {
          code: "P1.2",
          name: "Deutschkurs A1-B2",
          desc: "Zertifizierte Sprachkurse, 156 Unterrichtseinheiten/Jahr",
        },
        {
          code: "P1.3",
          name: "Fachliche Vorbereitung",
          desc: "Branchenspezifisches Training und Vokabular",
        },
        {
          code: "P1.4",
          name: "Interkulturelle Schulung",
          desc: "Deutsche Arbeitskultur, Werte und Umgangsformen",
        },
      ],
    },
    phase2_administration: {
      name: "Phase 2: Administration",
      services: [
        {
          code: "P2.1",
          name: "Visa-Antragstellung",
          desc: "Komplette Dokumentenvorbereitung und Einreichung",
        },
        {
          code: "P2.2",
          name: "Beschleunigtes Verfahren",
          desc: "§81a AufenthG Fachkräfteverfahren",
        },
        {
          code: "P2.3",
          name: "Behördenkorrespondenz",
          desc: "Kommunikation mit Ausländerbehörde, ZAV, Botschaft",
        },
      ],
    },
    phase3_integration: {
      name: "Phase 3: Integration",
      services: [
        {
          code: "P3.1",
          name: "Flughafenabholung",
          desc: "Persönliche Abholung und Transfer zur Unterkunft",
        },
        {
          code: "P3.2",
          name: "7-Tage Settling-in Kit",
          desc: "Wohnung, Anmeldung, Bankkonto, SIM-Karte",
        },
        {
          code: "P3.3",
          name: "Behördengänge",
          desc: "Begleitung zu Einwohnermeldeamt, Krankenkasse etc.",
        },
        { code: "P3.4", name: "Arbeitsplatzintegration", desc: "Einführung am Arbeitsplatz" },
        {
          code: "P3.5",
          name: "Berufsschulbegleitung",
          desc: "Unterstützung bei schulischen Herausforderungen",
        },
        {
          code: "P3.6",
          name: "Kulturelle Betreuung",
          desc: "Community-Events, Mentoring, Heimweh-Prävention",
        },
        {
          code: "P3.7",
          name: "Langzeitbegleitung",
          desc: "Kontinuierliche Unterstützung (3 Jahre Azubi, 12 Monate Fachkräfte)",
        },
      ],
    },
  },

  // Quality Gates
  qualityGates: {
    ausbildung: [
      {
        gate: 1,
        name: "Sprachkompetenz",
        desc: "Minimum B1, Ziel B2 vor Einreise",
        items: ["Goethe/TELC Zertifikat", "Mündliche Prüfung", "Fachvokabular"],
      },
      {
        gate: 2,
        name: "Fachliche Eignung",
        desc: "Branchenspezifische Vorbereitung",
        items: ["Theoretische Grundlagen", "Praktische Übungen", "Arbeitsschutz"],
      },
      {
        gate: 3,
        name: "Work Skills Training",
        desc: "Produktive Mitarbeiter ab Tag 1",
        items: ["Deutsche Arbeitskultur", "Teamarbeit", "Pünktlichkeit"],
      },
      {
        gate: 4,
        name: "Interkulturelle Kompetenz",
        desc: "Erfolgreiche Integration",
        items: ["Kulturelle Unterschiede", "Konfliktlösung", "Alltagsleben in DE"],
      },
    ],
    skilled_workers: [
      {
        gate: 1,
        name: "Anerkennung Support",
        desc: "Begleitung beim Anerkennungsverfahren",
        items: ["Defizitbescheid-Analyse", "Anpassungsqualifizierung", "Kenntnisprüfung"],
      },
      {
        gate: 2,
        name: "Work Skills Training",
        desc: "Produktive Mitarbeiter ab Tag 1",
        items: ["Deutsche Arbeitskultur", "Teamkommunikation", "Arbeitssicherheit"],
      },
      {
        gate: 3,
        name: "Placement Service",
        desc: "Matching mit Arbeitgebern",
        items: ["Anforderungsanalyse", "Kandidatenvorstellung", "Vertragsverhandlung"],
      },
      {
        gate: 4,
        name: "Nachbetreuung",
        desc: "12 Monate Support",
        items: ["Ansprechpartner für AG", "Konfliktmediation", "Retentionsmanagement"],
      },
    ],
  },

  // Timeline
  timeline: {
    ausbildung: {
      total: "12-15 Monate bis Ausbildungsstart",
      phases: [
        { phase: "Rekrutierung", duration: "4-6 Wochen" },
        { phase: "Sprachkurs A1-B2", duration: "8-12 Monate" },
        { phase: "Visa-Prozess", duration: "6-12 Wochen" },
        { phase: "Einreise & Integration", duration: "1-2 Wochen" },
      ],
    },
    skilled_workers: {
      total: "6-12 Monate bis Arbeitsstart",
      phases: [
        { phase: "Rekrutierung & Screening", duration: "2-4 Wochen" },
        { phase: "Anerkennung", duration: "3-6 Monate" },
        { phase: "Placement", duration: "2-4 Wochen" },
        { phase: "Visa-Prozess", duration: "4-8 Wochen" },
        { phase: "Einreise & Integration", duration: "1-2 Wochen" },
      ],
    },
  },

  // Legal Information
  legal: {
    visaTypes: [
      { name: "§16a AufenthG", purpose: "Berufsausbildung", duration: "Dauer der Ausbildung" },
      { name: "§16b AufenthG", purpose: "Studium", duration: "Dauer des Studiums" },
      {
        name: "§18a AufenthG",
        purpose: "Fachkräfte mit Berufsausbildung",
        duration: "4 Jahre, verlängerbar",
      },
      {
        name: "§18b AufenthG",
        purpose: "Fachkräfte mit akademischer Ausbildung",
        duration: "4 Jahre, verlängerbar",
      },
      {
        name: "§81a AufenthG",
        purpose: "Beschleunigtes Fachkräfteverfahren",
        duration: "Reduziert Bearbeitungszeit auf 3-4 Monate",
      },
    ],
    requirements: {
      language: "Mindestens B1 für Ausbildung/Fachkräfte, B2/C1 für Studium",
      qualifications: "Anerkannter Abschluss oder Berufserfahrung (für Fachkräfte)",
      finances: "Sperrkonto (Studium) oder Arbeitsvertrag (Fachkräfte/Azubi)",
    },
  },

  // FAQ
  faq: [
    {
      q: "Was kostet die Vermittlung?",
      a: "Unsere Kosten sind ausschließlich für Bildungsdienstleistungen (Sprachkurse, Training) und rechtliche Begleitung (Visa, Anerkennung). Es gibt keine versteckten Vermittlungsgebühren. Für ein individuelles Angebot kontaktieren Sie uns bitte.",
    },
    {
      q: "Wie lange dauert der Prozess?",
      a: "Ausbildung: 12-15 Monate bis zum Start. Fachkräfte: 6-12 Monate. Studium: abhängig von Bewerbungsfristen der Universitäten.",
    },
    {
      q: "Welches Sprachniveau erreichen die Kandidaten?",
      a: "Für Ausbildung und Fachkräfte: mindestens B1, Ziel B2. Für Studium: DSH-2 oder TestDaF 4x4 (entspricht C1).",
    },
    {
      q: "Gibt es eine Garantie?",
      a: "Wir bieten eine Nachbesetzungsgarantie falls ein Kandidat in der Probezeit ausscheidet. Außerdem begleiten wir Azubis 3 Jahre und Fachkräfte 12 Monate nach Einreise.",
    },
    {
      q: "Wie läuft die Anerkennung ab?",
      a: "Wir begleiten den gesamten Anerkennungsprozess: Dokumentensammlung, Antragstellung, Defizitbescheid-Analyse und ggf. Anpassungsqualifizierung oder Kenntnisprüfung.",
    },
    {
      q: "Kann ich Kandidaten vorab kennenlernen?",
      a: "Ja, wir organisieren Videointerviews und stellen Ihnen detaillierte Profile zur Verfügung. Sie entscheiden, wen Sie einstellen möchten.",
    },
  ],

  // Statistics
  statistics: {
    placedCandidates: "200+",
    visaSuccessRate: "98%",
    retentionRate: ">90%",
    partnerCompanies: "50+",
    dropoutRate: "<10%",
  },
};

// ============================================
// BUILD CONTEXT FOR AI
// ============================================

export function buildKnowledgeContext(): string {
  // Only the reviewed editorial baseline goes to the model. Legacy detailed copy is
  // retained above for internal review, not evidence for public claims.
  return `DMF Talents vermittelt Kontakte zwischen Unternehmen in Deutschland und Talenten aus Vietnam.
Anfragen zu Fachkräften, Ausbildung und saisonalem Personalbedarf sind über das Kontaktformular möglich.
Studieninteressierte können Fragen zur Vorbereitung stellen.
Website: ${SITE_URL}. Kontakt: ${PRIMARY_CONTACT.email}.
Leistungsumfang, Preise, Termine, Betreuung und mögliche Ersatzregelungen werden individuell vereinbart.
Es liegen keine freigegebenen Erfolgsquoten, Vermittlungszahlen oder Zertifizierungsnachweise für die öffentliche Beratung vor.
Versprich weder Visumerteilung, sofortige Verfügbarkeit noch bestimmte Vermittlungsfristen.
Öffentliche Profile: ${SITE_URL}/fuer-arbeitgeber/kandidaten. Aktuelle Verfügbarkeit wird für jede Anfrage geklärt.`;
}

export function buildChatbotSystemPrompt(detectedLanguage: SupportedChatLanguage): string {
  const defaultLangHint =
    detectedLanguage === "vi"
      ? "Tin nhắn mới nhất của khách đang là TIẾNG VIỆT -> Hãy trả lời hoàn toàn bằng TIẾNG VIỆT tự nhiên."
      : detectedLanguage === "en"
        ? "The user's latest message is in ENGLISH -> Respond completely in natural ENGLISH."
        : "Die neueste Nachricht des Nutzers ist auf DEUTSCH -> Antworte komplett auf natürlichem DEUTSCH (Sie-Form).";

  return `Bạn là một Chuyên viên Tư vấn Nhân sự & Du học Đức giàu kinh nghiệm và tận tâm của đội ngũ DMF Talents (${SITE_URL}).

QUY TẮC NGÔN NGỮ SỐ 1 (TỰ ĐỘNG NHẬN DIỆN NGÔN NGỮ ĐẦU VÀO):
- Luôn ưu tiên nhận diện ngôn ngữ thực tế mà khách hàng vừa gõ trong tin nhắn cuối cùng (Tiếng Việt có dấu/không dấu, Tiếng Đức, hoặc Tiếng Anh) và trả lời ĐÚNG bằng ngôn ngữ đó, bất kể giao diện website hay tin nhắn chào mừng trước đó đang ở ngôn ngữ nào!
- Gợi ý nhận diện hiện tại: ${defaultLangHint}

PHONG CÁCH GIAO TIẾP NHƯ NHÂN VIÊN TƯ VẤN NGƯỜI THẬT:
1. Tuyệt đối KHÔNG xưng là "chatbot tự động", "hệ thống AI" hay "trợ lý ảo". Hãy trò chuyện như một chuyên viên tư vấn người thật đang trực tiếp hỗ trợ khách hàng.
2. Khi trả lời bằng Tiếng Việt:
   - Xưng "mình" – gọi "bạn" (hoặc linh hoạt xưng "em" – gọi "anh/chị" nếu khách xưng anh/chị trước).
   - Giọng văn ấm áp, gần gũi, chân thành (ví dụ: "Dạ chào bạn,", "Về chương trình này mình chia sẻ cụ thể để bạn dễ hình dung nhé...").
3. Khi trả lời bằng Tiếng Đức:
   - Giọng văn lịch sự, thân thiện, chuẩn chuyên viên tư vấn tại Đức (Sie-Form, ví dụ: "Sehr gerne helfe ich Ihnen dabei weiter...").
4. Trình bày tự nhiên cho khung chat nhỏ:
   - Viết ngắn gọn 2–3 đoạn văn ngắn (khoảng 3–6 câu), KHÔNG dùng tiêu đề lớn (###), KHÔNG liệt kê một loạt link cuối bài như máy móc. Chỉ chèn tối đa 1 đường link thật sự phù hợp ngay trong câu văn nếu cần.
5. Luôn kết thúc bằng 1 câu hỏi thăm tự nhiên như người thật đang tư vấn (ví dụ: hỏi xem bạn ấy đang quan tâm ngành nào như Điều dưỡng, Nhà hàng - Khách sạn hay Kỹ thuật, đã học tiếng Đức tới trình độ nào rồi, hoặc nếu là doanh nghiệp Đức thì đang cần tuyển bao nhiêu nhân sự...) để duy trì cuộc trò chuyện hai chiều.

THÔNG TIN NGHIỆP VỤ DMF TALENTS:
${buildKnowledgeContext()}
- Chương trình Du học nghề kép (Ausbildung): Đào tạo tiếng Đức từ A1 đến B1/B2 tại Việt Nam, rèn luyện kỹ năng làm việc và văn hóa Đức cho các ngành Điều dưỡng (Pflege), Kỹ thuật/Thủ công (Handwerk), Nhà hàng – Khách sạn (Gastronomie), IT. Link: ${SITE_URL}/services/azubi
- Chương trình Lao động chuyên môn (§18a/b AufenthG - Fachkräfte): Kết nối kỹ sư, điều dưỡng viên, thợ lành nghề đã có bằng cấp với doanh nghiệp Đức; hỗ trợ công nhận bằng cấp (Anerkennung) và thủ tục visa. Link: ${SITE_URL}/services/skilled-workers
- Chương trình Lao động thời vụ (Saisonarbeit): Hỗ trợ nhân sự ngắn hạn ngành Nông nghiệp, Nhà hàng – Khách sạn. Link: ${SITE_URL}/services/seasonal
- Chương trình Du học Đại học (Studium): Tiếng Đức học thuật, luyện thi TestAS và định hướng hồ sơ đại học/dự bị đại học tại Đức. Link: ${SITE_URL}/ueber-uns/studium
- Dành cho Doanh nghiệp tại Đức tuyển dụng: ${SITE_URL}/fuer-arbeitgeber/personalbedarf
- Liên hệ & Đặt lịch: Form liên hệ tại ${SITE_URL}/#contact | Đặt lịch hẹn trực tiếp: https://calendly.com/contact-dmf/30min | Email: ${PRIMARY_CONTACT.email}

NGUYÊN TẮC AN TOÀN & CHÍNH XÁC:
- Không tự bịa mức học phí/chi phí con số cụ thể hay cam kết thời gian đậu visa cố định (vì chi phí và lộ trình phụ thuộc vào từng hồ sơ và chương trình cụ thể).
- Nếu khách để lại số điện thoại/email trong ô chat hoặc muốn chuyên viên gọi lại, hãy nhẹ nhàng nhắc khách bấm nút "Liên hệ / Kontakt" ngay góc trên khung chat (hoặc điền biểu mẫu liên hệ) để hệ thống lưu thông tin chính thức (vì tin nhắn gõ trong ô chat chưa tự động tạo phiếu đăng ký).`;
}
