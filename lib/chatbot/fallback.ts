import { SITE_URL } from "@/lib/site";
import { PRIMARY_CONTACT } from "@/lib/company/contact";

export type SupportedChatLanguage = "de" | "en" | "vi";
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/contact-dmf/30min";

// Curated orientation from the public azubi, skilled-workers, seasonal and
// university pages. No live availability, prices, deadlines or legal decisions.
const faq = {
  de: {
    training:
      "**Ausbildung:** DMF Talents bereitet vietnamesische Talente sprachlich und beruflich auf eine duale Ausbildung in Deutschland vor, etwa in Pflege, Handwerk oder Gastronomie.",
    workers:
      "**Fachkräfte:** DMF Talents verbindet Unternehmen mit qualifizierten Talenten aus Vietnam, unter anderem in Pflege und Technik. Qualifikation, Sprachstand und Anerkennungsbedarf werden individuell geklärt.",
    seasonal:
      "**Saisonarbeit:** DMF Talents unterstützt Unternehmen bei saisonalem Personalbedarf, etwa in Landwirtschaft und Gastronomie. Einsatzzeitraum, Voraussetzungen und Verfügbarkeit müssen individuell geklärt werden.",
    university:
      "**Studium:** DMF Talents bietet Vorbereitung auf ein Hochschulstudium in Deutschland, etwa akademisches Deutsch, TestAS-Vorbereitung und Orientierung zur Bewerbung. Zulassungsvoraussetzungen hängen von Hochschule und Studiengang ab.",
    pricing:
      "**Kosten:** Für Ihr Vorhaben ist ein individuelles Angebot erforderlich. Bitte nennen Sie Programm und gewünschten Leistungsumfang; Arbeitgeber können zusätzlich Branche und Personalbedarf angeben. Hier liegt keine verbindliche Preisliste vor.",
    documents:
      "**Unterlagen:** Zur ersten Orientierung können Lebenslauf, Reisepass, Schul- oder Berufsabschlüsse und vorhandene Sprachnachweise relevant sein. Bei Fachkräften kommen Nachweise zur Berufserfahrung und gegebenenfalls Anerkennungsunterlagen hinzu. Die genaue Liste hängt vom Programm und der zuständigen Stelle ab; bitte vor Einreichung bestätigen lassen. Bitte keine sensiblen Dokumente im Chat senden.",
    visa: "**Visum und Anerkennung:** Der passende Weg hängt von Qualifikation, Beruf und geplantem Aufenthalt ab. In reglementierten Berufen wie Pflege ist die Anerkennung besonders relevant. Verbindliche Anforderungen erhalten Sie bei der zuständigen Anerkennungsstelle und der deutschen Auslandsvertretung. Dies ist allgemeine Orientierung, keine Rechtsberatung oder Visumzusage.",
    process:
      "**Ablauf:** Zunächst werden Ziel, Profil und Bedarf geklärt. Danach folgen die Abstimmung passender Möglichkeiten, Vorbereitung und Prüfung der erforderlichen Unterlagen sowie gegebenenfalls Anerkennungs- und Visumschritte. Der genaue Ablauf und Zeitrahmen werden individuell vereinbart.",
    contact:
      "**Kontakt und Beratung:** Nutzen Sie das Anfrageformular oder buchen Sie einen Beratungstermin. Unternehmen können ihren Personalbedarf angeben; Studieninteressierte können ihr Studienziel und ihren bisherigen Abschluss nennen.",
    general:
      "Guten Tag! Dies ist der automatische FAQ-Chatbot von **DMF Talents** mit vorbereiteten Antworten zu Ausbildung, Fachkräften, Saisonarbeit, Studium, Ablauf, Unterlagen und Kosten. Wählen Sie ein Thema oder stellen Sie eine kurze Frage.",
    privacy:
      "**Datenschutz:** Bitte wenden Sie sich mit Fragen zu Ihren personenbezogenen Daten oder einem Löschwunsch direkt an DMF Talents. Die Datenschutzerklärung nennt die Kontaktmöglichkeiten. Dieser Chat führt keine Löschung aus und bestätigt keine Bearbeitung.",
    unknown:
      "Zu dieser Frage habe ich keine vorbereitete Antwort. Bitte wenden Sie sich per E-Mail oder Kontaktformular an das Team von DMF Talents.",
    links: [
      "Ausbildung",
      "Fachkräfte",
      "Saisonarbeit",
      "Studium",
      "Personalbedarf für Arbeitgeber",
      "Kontaktformular",
      "Beratung buchen",
    ],
    notice:
      "Eine Chatnachricht oder Kontaktdaten im Chat sind keine eingereichte Anfrage. Erst die Erfolgsbestätigung des abgesendeten Formulars bestätigt die Speicherung.",
  },
  en: {
    training:
      "**Vocational Training:** DMF Talents prepares Vietnamese talent for dual vocational training in Germany through language and professional preparation, for example in nursing, skilled crafts and hospitality.",
    workers:
      "**Skilled Workers:** DMF Talents connects companies with qualified Vietnamese talent, including nursing and technical professions. Qualifications, language skills and recognition needs are assessed individually.",
    seasonal:
      "**Seasonal work:** DMF Talents supports seasonal staffing needs, for example in agriculture and hospitality. Dates, requirements and availability need individual confirmation.",
    university:
      "**University:** DMF Talents offers preparation for study in Germany, including academic German, TestAS preparation and application orientation. Admission requirements depend on the university and degree programme.",
    pricing:
      "**Pricing:** An individual quote is required for your plans. Please specify the programme and services you need; employers can also indicate sector and staffing needs. No binding price list is available here.",
    documents:
      "**Documents:** For initial orientation, a CV, passport, school or vocational qualifications and available language certificates may be relevant. Skilled workers may also need evidence of experience and recognition documents. The exact checklist depends on the programme and responsible authority; confirm it before submitting. Please do not send sensitive documents in chat.",
    visa: "**Visa and recognition:** The appropriate route depends on qualifications, profession and purpose of stay. Recognition is particularly relevant for regulated professions such as nursing. Confirm binding requirements with the responsible recognition authority and German diplomatic mission. This is general orientation, not legal advice or a visa guarantee.",
    process:
      "**Process:** Start by clarifying your goal, profile and requirements. Next come matching suitable options, preparation and checking documents, followed by recognition and visa steps where applicable. The exact process and timing are agreed individually.",
    contact:
      "**Contact and booking:** Use the inquiry form or book a consultation. Employers can specify staffing needs; prospective students can describe their study goal and existing qualifications.",
    general:
      "Hello! This is the automated **DMF Talents** FAQ chatbot with prepared answers about vocational training, skilled workers, seasonal work, university, process, documents and pricing. Choose a topic or ask a short question.",
    privacy:
      "**Privacy:** Please contact DMF Talents directly about your personal data or a deletion request. The privacy notice lists contact details. This chatbot does not delete data or confirm that a privacy request has been processed.",
    unknown:
      "I have no prepared answer to this question. Please contact the DMF Talents team by email or through the contact form.",
    links: [
      "Vocational Training",
      "Skilled Workers",
      "Seasonal work",
      "University",
      "Employer staffing inquiry",
      "Contact form",
      "Book a consultation",
    ],
    notice:
      "A chat message or contact details pasted in chat are not a submitted inquiry. Only the success confirmation after submitting the form confirms that it was saved.",
  },
  vi: {
    training:
      "**Du học nghề:** DMF Talents chuẩn bị tiếng Đức và kỹ năng nghề cho nhân tài Việt Nam tham gia đào tạo nghề kép tại Đức, ví dụ trong điều dưỡng, kỹ thuật và nhà hàng – khách sạn.",
    workers:
      "**Lao động chuyên môn:** DMF Talents kết nối doanh nghiệp với nhân lực có chuyên môn từ Việt Nam, gồm điều dưỡng và kỹ thuật. Bằng cấp, trình độ tiếng Đức và nhu cầu công nhận bằng được xem xét theo từng hồ sơ.",
    seasonal:
      "**Lao động thời vụ:** DMF Talents hỗ trợ nhu cầu nhân sự theo mùa, ví dụ trong nông nghiệp và nhà hàng – khách sạn. Thời gian, điều kiện và khả năng bố trí cần được xác nhận riêng.",
    university:
      "**Đại học:** DMF Talents hỗ trợ chuẩn bị học đại học tại Đức, gồm tiếng Đức học thuật, luyện TestAS và định hướng nộp hồ sơ. Điều kiện nhập học tùy trường và ngành.",
    pricing:
      "**Chi phí:** Cần báo giá riêng theo chương trình và phạm vi dịch vụ bạn cần. Doanh nghiệp có thể nêu thêm ngành nghề và nhu cầu nhân sự. Chatbot không có bảng giá ràng buộc để cung cấp.",
    documents:
      "**Hồ sơ:** Để định hướng ban đầu, có thể cần CV, hộ chiếu, bằng học phổ thông hoặc bằng nghề và chứng chỉ ngoại ngữ hiện có. Lao động chuyên môn có thể cần thêm chứng nhận kinh nghiệm và hồ sơ công nhận bằng. Danh sách cụ thể tùy chương trình và cơ quan có thẩm quyền; hãy xác nhận trước khi nộp. Không gửi giấy tờ nhạy cảm trong chat.",
    visa: "**Visa và công nhận bằng:** Lộ trình phụ thuộc bằng cấp, nghề và mục đích lưu trú. Nghề có điều kiện như điều dưỡng đặc biệt cần chú ý công nhận bằng. Hãy xác nhận yêu cầu chính thức với cơ quan công nhận và cơ quan đại diện Đức. Đây là định hướng chung, không phải tư vấn pháp lý hay bảo đảm visa.",
    process:
      "**Quy trình:** Trước tiên làm rõ mục tiêu, hồ sơ và nhu cầu. Sau đó trao đổi phương án phù hợp, chuẩn bị và kiểm tra giấy tờ, rồi thực hiện bước công nhận bằng và visa nếu cần. Lộ trình và thời gian cụ thể được trao đổi riêng.",
    contact:
      "**Liên hệ và đặt lịch:** Hãy dùng biểu mẫu yêu cầu hoặc đặt lịch tư vấn. Doanh nghiệp có thể nêu nhu cầu nhân sự; người quan tâm đại học có thể nêu mục tiêu học tập và bằng cấp hiện có.",
    general:
      "Xin chào! Đây là chatbot tự động của **DMF Talents**, sử dụng câu trả lời soạn sẵn về du học nghề, lao động chuyên môn, thời vụ, đại học, quy trình, hồ sơ và chi phí. Hãy chọn chủ đề hoặc đặt câu hỏi ngắn.",
    privacy:
      "**Dữ liệu cá nhân:** Vui lòng liên hệ trực tiếp DMF Talents nếu muốn hỏi về dữ liệu cá nhân hoặc yêu cầu xóa dữ liệu. Chính sách bảo mật có thông tin liên hệ. Chatbot không xóa dữ liệu và không xác nhận yêu cầu đã được xử lý.",
    unknown:
      "Tôi chưa có câu trả lời soạn sẵn cho câu hỏi này. Vui lòng liên hệ đội ngũ DMF Talents qua email hoặc biểu mẫu liên hệ.",
    links: [
      "Du học nghề",
      "Lao động chuyên môn",
      "Lao động thời vụ",
      "Đại học",
      "Nhu cầu nhân sự cho doanh nghiệp",
      "Biểu mẫu liên hệ",
      "Đặt lịch tư vấn",
    ],
    notice:
      "Tin nhắn hoặc thông tin liên hệ trong chat không phải yêu cầu đã gửi. Chỉ thông báo thành công sau khi gửi biểu mẫu mới xác nhận yêu cầu đã được lưu.",
  },
};

type Topic = Exclude<keyof typeof faq.en, "links" | "notice">;
function normalize(message: string) {
  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

// Match complete words/phrases, not fragments such as "hi" in "this" or
// "job" in "jobless". Specific questions take precedence over service names.
const intents: [Topic, RegExp][] = [
  [
    "privacy",
    /\b(datenschutz\w*|dsgvo|gdpr|privacy|personal data|personenbezogen\w*|daten losch\w*|delete my data|du lieu ca nhan|bao mat|quyen rieng tu|xoa du lieu)\b/,
  ],
  [
    "pricing",
    /\b(preis\w*|kost\w*|gebuhr\w*|price\w*|pricing|cost\w*|fees?|tuition|chi phi|hoc phi|le phi|gia|bao nhieu|how much)\b/,
  ],
  [
    "documents",
    /\b(unterlagen|bewerbungsunterlagen|dokument\w*|documents?|paperwork|checklist|ho so|giay to|can nop)\b/,
  ],
  ["visa", /\b(visa\w*|visum\w*|anerkenn\w*|recognition|cong nhan|thi thuc)\b/],
  [
    "process",
    /\b(ablauf\w*|prozess\w*|schritte|process|steps?|how long|time frame|timeline|wie lange|dauert\w*|thoi gian|bao lau|quy trinh|lo trinh|thu tuc)\b/,
  ],
  [
    "contact",
    /\b(kontakt\w*|termin\w*|beratung\w*|buch\w*|contact|book\w*|consult\w*|appointments?|meetings?|schedule|email|e mail|lien he|dat lich|tu van)\b/,
  ],
  [
    "training",
    /\b(ausbildung\w*|auszubildende\w*|azubi\w*|vocational|apprentice\w*|trainee\w*|hoc nghe)\b/,
  ],
  ["seasonal", /\b(saison\w*|ernte\w*|seasonal|thoi vu|mua vu)\b/],
  [
    "university",
    /\b(studium|studien\w*|universit\w*|hochschul\w*|bachelor|master|students?|dai hoc)\b/,
  ],
  [
    "workers",
    /\b(fachkraft\w*|fachkrafte\w*|pflege\w*|nurs\w*|skilled|workers?|hire|hiring|staff\w*|recruit\w*|mitarbeiter\w*|personalbedarf|personalvermittlung|personalsuche|lao dong|tay nghe|dieu duong)\b/,
  ],
];

export function getGuidedChatResponse(
  language: SupportedChatLanguage,
  userMessage: string
): string {
  const text = normalize(userMessage)
    .replace(/[^a-z0-9@]+/g, " ")
    .trim();
  const t = faq[language];
  const topic: Topic =
    intents.find(([, pattern]) => pattern.test(text))?.[0] ??
    (/^(hi|hello|hey|hallo|guten tag|xin chao|chao)( there| ban)?$/.test(text) ||
    /\b(services?|programs?|programmes?|leistungen|angebote|dich vu|chuong trinh)\b/.test(text)
      ? "general"
      : "unknown");
  const paths = [
    "/services/azubi",
    "/services/skilled-workers",
    "/services/seasonal",
    "/ueber-uns/studium",
    "/fuer-arbeitgeber/personalbedarf",
    "/#contact",
  ];
  const link = (index: number) => `[${t.links[index]}](${SITE_URL}${paths[index]})`;
  const serviceIndex = { training: 0, workers: 1, seasonal: 2, university: 3 };
  // Keep the question first, while still linking its service context.
  const serviceTopic = intents.find(
    ([candidate, pattern]) => candidate in serviceIndex && pattern.test(text)
  )?.[0];
  const service = serviceTopic
    ? serviceIndex[serviceTopic as keyof typeof serviceIndex]
    : undefined;
  const employer =
    /\b(arbeitgeber\w*|unternehmen\w*|personalbedarf|firma|employers?|company|hiring|hire|staff\w*|doanh nghiep|cong ty)\b/.test(
      text
    );
  const links =
    topic === "general"
      ? [0, 1, 2, 3].map(link)
      : service !== undefined && topic !== "privacy"
        ? [link(service)]
        : [];
  if (employer && topic !== "privacy") links.push(link(4));
  if (topic === "privacy")
    links.push(
      `[${language === "de" ? "Datenschutzerklärung" : language === "en" ? "Privacy notice" : "Chính sách bảo mật"}](${SITE_URL}/datenschutz)`
    );
  if (topic === "visa")
    links.push(
      `[${language === "de" ? "Offizielle Informationen zur Anerkennung" : language === "en" ? "Official recognition information" : "Thông tin công nhận bằng chính thức"}](https://www.make-it-in-germany.com/en/visa-recognition/recognition/who-needs)`
    );
  links.push(
    link(5),
    `[${t.links[6]}](${CALENDLY_URL})`,
    `[${PRIMARY_CONTACT.email}](mailto:${PRIMARY_CONTACT.email})`
  );
  return `${t[topic]}\n\n${links.map((item) => `• ${item}`).join("\n")}\n\n${t.notice}`;
}

// Backward compatible for existing consumers; the public route uses the primary name.
export const getFallbackChatResponse = getGuidedChatResponse;
