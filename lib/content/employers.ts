import type { HiringService } from "@/lib/validations/hiring";
import type { Language } from "@/lib/translations";
export const servicePaths = {
  skilled: "/services/skilled-workers",
  azubi: "/services/azubi",
  seasonal: "/services/seasonal",
} as const;
interface ServiceCopy {
  title: string;
  description: string;
  fit: string;
  requirements: string[];
  scope: string[];
  employer: string[];
  faq: [string, string][];
}
interface EmployerCopy {
  eyebrow: string;
  title: string;
  intro: string;
  primary: string;
  secondary: string;
  servicesTitle: string;
  servicesIntro: string;
  readMore: string;
  processTitle: string;
  processIntro: string;
  steps: { title: string; body: string }[];
  profilesTitle: string;
  profilesIntro: string;
  emptyProfiles: string;
  aboutTitle: string;
  aboutText: string;
  supportTitle: string;
  supportText: string;
  fit: string;
  requirements: string;
  scope: string;
  employer: string;
  faq: string;
  planningNote: string;
  services: Record<Exclude<HiringService, "unsure">, ServiceCopy>;
  form: {
    title: string;
    intro: string;
    company: string;
    name: string;
    email: string;
    service: string;
    message: string;
    messagePlaceholder: string;
    optional: string;
    phone: string;
    location: string;
    headcount: string;
    timing: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    sending: string;
    success: string;
    next: string;
    reference: string;
    again: string;
    error: string;
    required: string;
    profile: string;
    services: Record<HiringService, string>;
  };
  pool: {
    title: string;
    intro: string;
    category: string;
    german: string;
    visa: string;
    all: string;
    visaYes: string;
    reset: string;
    empty: string;
    error: string;
    retry: string;
    count: string;
    visaNote: string;
  };
}
const de: EmployerCopy = {
  eyebrow: "PERSONALGEWINNUNG FÜR UNTERNEHMEN IN DEUTSCHLAND",
  title: "Personal aus Vietnam. Passend zu Ihrem Betrieb.",
  intro:
    "Fachkräfte, Auszubildende oder saisonale Unterstützung: Beschreiben Sie Ihren Bedarf. Gemeinsam klären wir passende Profile, Voraussetzungen und den Weg zur Zusammenarbeit.",
  primary: "Personalbedarf melden",
  secondary: "Kandidaten ansehen",
  servicesTitle: "Welche Unterstützung braucht Ihr Team?",
  servicesIntro: "Wählen Sie den Einstieg, der zu Ihrer Personalplanung passt.",
  readMore: "Leistung und Ablauf ansehen",
  processTitle: "Von Ihrem Bedarf zum nächsten Schritt",
  processIntro:
    "Ein klarer Ablauf mit Entscheidungen auf beiden Seiten. Den konkreten Zeitplan vereinbaren wir nach Prüfung Ihres Bedarfs.",
  steps: [
    {
      title: "Bedarf besprechen",
      body: "Beruf, Einsatzort, Anzahl, Startwunsch und Anforderungen klären.",
    },
    {
      title: "Profile und Voraussetzungen prüfen",
      body: "Qualifikation, Sprache und nötige Nachweise gemeinsam abgleichen.",
    },
    {
      title: "Kennenlernen und entscheiden",
      body: "Gespräche führen, offene Fragen klären und die Zusammenarbeit vereinbaren.",
    },
    {
      title: "Start vorbereiten",
      body: "Dokumente, Zuständigkeiten und Einarbeitung aufeinander abstimmen.",
    },
  ],
  profilesTitle: "Menschen kennenlernen",
  profilesIntro:
    "Hier erscheinen ausschließlich freigegebene Profile. Die konkrete Verfügbarkeit klären wir für Ihre Anfrage.",
  emptyProfiles:
    "Aktuell sind keine Profile zur öffentlichen Ansicht freigegeben. Senden Sie uns Ihren Bedarf – wir klären passende Möglichkeiten mit Ihnen.",
  aboutTitle: "Eine Verbindung zwischen Vietnam und Ihrem Unternehmen",
  aboutText:
    "DMF Talents unterstützt den Austausch zwischen vietnamesischen Bewerbern und Unternehmen in Deutschland. Am Anfang steht ein gemeinsames Verständnis von Tätigkeit, Anforderungen und Zusammenarbeit.",
  supportTitle: "Auch den Start im Betrieb mitdenken",
  supportText:
    "Besprechen Sie mit uns Ansprechpartner, Einarbeitung, Sprachbedarf und gewünschte Begleitung. Den vereinbarten Leistungsumfang und die Zuständigkeiten halten wir vor Beginn fest.",
  fit: "Für wen ist das geeignet?",
  requirements: "Was wird geprüft?",
  scope: "Das besprechen wir mit Ihnen",
  employer: "Was Ihr Unternehmen einbringt",
  faq: "Häufige Fragen",
  planningNote:
    "Zeitrahmen und Kosten hängen unter anderem von Beruf, Nachweisen, Sprachstand und behördlichen Verfahren ab. Einreise und behördliche Entscheidungen können nicht garantiert werden.",
  services: {
    skilled: {
      title: "Fachkräfte für Ihren Betrieb",
      description:
        "Berufserfahrene Bewerber aus Vietnam für einen längerfristigen Personalbedarf kennenlernen.",
      fit: "Für Unternehmen, die eine konkrete Fachrolle besetzen und Anforderungen, Qualifikation und Einarbeitung sorgfältig abstimmen möchten.",
      requirements: [
        "Ausbildung und Berufserfahrung für die konkrete Tätigkeit",
        "Deutschkenntnisse passend zu Aufgaben und Arbeitsplatz",
        "Erforderliche Anerkennung, Nachweise und Einreisevoraussetzungen im Einzelfall",
      ],
      scope: [
        "Anforderungsprofil und Auswahlkriterien schärfen",
        "Passende Profile und Kennenlerngespräche abstimmen",
        "Dokumentenbedarf, Ablauf und Ansprechpartner vereinbaren",
      ],
      employer: [
        "Tätigkeit, Einsatzort und Arbeitsbedingungen beschreiben",
        "Verantwortliche für Auswahl und Einarbeitung benennen",
        "Vertragsbedingungen und nötige Arbeitgeberunterlagen bereitstellen",
      ],
      faq: [
        [
          "Welche Berufe kommen infrage?",
          "Nennen Sie uns Ihre Tätigkeit und Anforderungen. Wir prüfen daraufhin passende Profile und berufsspezifische Voraussetzungen.",
        ],
        [
          "Wann kann eine Fachkraft beginnen?",
          "Das hängt vom Profil, den Unterlagen und gegebenenfalls der Anerkennung und Einreise ab. Einen belastbaren Zeitplan besprechen wir nach der Prüfung.",
        ],
        [
          "Wie werden die Kosten festgelegt?",
          "Sie erhalten ein individuelles Angebot zum vereinbarten Leistungsumfang. Auf dieser Website wird kein pauschaler Preis zugesagt.",
        ],
      ],
    },
    azubi: {
      title: "Auszubildende für Ihr Team",
      description:
        "Ausbildung gemeinsam vorbereiten – mit klaren Erwartungen an Sprache, Betrieb und Lernweg.",
      fit: "Für Ausbildungsbetriebe, die Nachwuchs aufbauen und Zeit für Anleitung, Sprache und Integration einplanen.",
      requirements: [
        "Motivation und Eignung für den Ausbildungsberuf",
        "Sprachstand und Anforderungen von Betrieb und Berufsschule",
        "Schulische Nachweise und Voraussetzungen für Ausbildung und Einreise",
      ],
      scope: [
        "Ausbildungsplatz und Erwartung an Bewerber abstimmen",
        "Kennenlernen und Rückfragen zu Profilen koordinieren",
        "Vorbereitung und Ansprechpartner für den Ausbildungsstart besprechen",
      ],
      employer: [
        "Ausbildungsberuf, Beginn und Rahmenbedingungen benennen",
        "Ausbildungsbetreuung und Einarbeitung planen",
        "Berufsschule, Unterlagen und praktische Unterstützung klären",
      ],
      faq: [
        [
          "Welches Sprachniveau ist nötig?",
          "Die Anforderungen unterscheiden sich nach Beruf, Schule und Verfahren. Wir stimmen den notwendigen Sprachstand für Ihren konkreten Platz ab.",
        ],
        [
          "Ist der Ausbildungsstart garantiert?",
          "Nein. Auswahl, Unterlagen und behördliche Entscheidungen müssen rechtzeitig zusammenpassen. Wir besprechen Abhängigkeiten offen.",
        ],
        [
          "Welche Begleitung gibt es nach dem Start?",
          "Gewünschte Begleitung und Ansprechpartner werden vorab vereinbart. Sprechen Sie uns auf Ihren Unterstützungsbedarf an.",
        ],
      ],
    },
    seasonal: {
      title: "Unterstützung für saisonalen Bedarf",
      description: "Zeitlich begrenzten Personalbedarf strukturiert prüfen und planen.",
      fit: "Für Betriebe mit einem klar begrenzten Einsatzzeitraum, konkreten Tätigkeiten und nachvollziehbarer Personalplanung.",
      requirements: [
        "Einsatzzeitraum, Tätigkeiten und betriebliche Rahmenbedingungen",
        "Passende Erfahrung und Kommunikation am Arbeitsplatz",
        "Ob ein rechtlich zulässiger Beschäftigungs- und Einreiseweg für den Fall besteht",
      ],
      scope: [
        "Bedarf und Machbarkeit des geplanten Einsatzes prüfen",
        "Profile und Einsatzbedingungen abstimmen",
        "Zeitplan, Dokumente und Verantwortlichkeiten klären",
      ],
      employer: [
        "Zeitraum, Anzahl und Tätigkeiten konkretisieren",
        "Arbeitszeit, Vergütung und gegebenenfalls Unterkunft klären",
        "Betriebliche Betreuung und erforderliche Unterlagen vorbereiten",
      ],
      faq: [
        [
          "Kann jeder Betrieb Saisonkräfte aus Vietnam einsetzen?",
          "Das wird für den konkreten Fall geprüft. Ein kurzfristiger Bedarf allein schafft noch keinen passenden Beschäftigungs- oder Einreiseweg.",
        ],
        [
          "Wie früh sollte die Planung beginnen?",
          "Melden Sie den Zeitraum möglichst früh. Wir prüfen die Voraussetzungen, bevor wir einen Zeitplan mit Ihnen abstimmen.",
        ],
        [
          "Sind bereits Personen verfügbar?",
          "Verfügbarkeit wird anhand Ihrer Anfrage geprüft. Öffentlich sichtbare Profile sind keine Zusage für einen bestimmten Einsatztermin.",
        ],
      ],
    },
  },
  form: {
    title: "Erzählen Sie uns von Ihrem Personalbedarf",
    intro:
      "Die wichtigsten Angaben genügen für den ersten Kontakt. Sie benötigen kein Benutzerkonto.",
    company: "Unternehmen",
    name: "Ansprechperson",
    email: "Geschäftliche E-Mail",
    service: "Gesuchte Unterstützung",
    message: "Ihr Bedarf",
    messagePlaceholder: "Welche Tätigkeit möchten Sie besetzen? Was ist Ihnen besonders wichtig?",
    optional: "Weitere Angaben (optional)",
    phone: "Telefon",
    location: "Einsatzort",
    headcount: "Anzahl Personen",
    timing: "Gewünschter Start / Zeitraum",
    privacy: "Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung dieser Anfrage gemäß der",
    privacyLink: "Datenschutzerklärung",
    submit: "Personalbedarf absenden",
    sending: "Wird gespeichert…",
    success: "Vielen Dank. Ihre Anfrage ist gespeichert.",
    next: "DMF prüft Ihren Bedarf und meldet sich über Ihre angegebenen Kontaktdaten, um Anforderungen und nächste Schritte zu klären. Mit dieser Anfrage schließen Sie keinen Vermittlungsvertrag ab.",
    reference: "Ihre Anfragereferenz",
    again: "Weitere Anfrage senden",
    error:
      "Die Anfrage konnte nicht gespeichert werden. Ihre Angaben bleiben erhalten. Bitte versuchen Sie es erneut.",
    required: "* Pflichtfelder",
    profile: "Anfrage zu Profil",
    services: {
      skilled: "Fachkräfte",
      azubi: "Auszubildende",
      seasonal: "Saisonkräfte",
      unsure: "Noch offen – bitte beraten",
    },
  },
  pool: {
    title: "Profile für Ihren Personalbedarf",
    intro:
      "Freigegebene Profile aus Vietnam. Qualifikation und Verfügbarkeit stimmen wir für Ihre konkrete Anfrage ab.",
    category: "Unterstützung",
    german: "Deutschkenntnisse",
    visa: "Visum laut geprüftem Profil",
    all: "Alle",
    visaYes: "Visum vorhanden",
    reset: "Filter zurücksetzen",
    empty: "Aktuell keine passenden öffentlichen Profile.",
    error: "Profile konnten nicht geladen werden.",
    retry: "Erneut laden",
    count: "Profile",
    visaNote: "Ein Visum im Profil ist keine Zusage für einen bestimmten Einsatz oder Starttermin.",
  },
};
const en: EmployerCopy = {
  eyebrow: "RECRUITMENT FOR EMPLOYERS IN GERMANY",
  title: "People from Vietnam. A fit for your business.",
  intro:
    "Skilled staff, apprentices or seasonal support: tell us what your team needs. Together we review suitable profiles, requirements and next steps.",
  primary: "Tell us your hiring needs",
  secondary: "View candidates",
  servicesTitle: "What does your team need?",
  servicesIntro: "Choose the path that fits your workforce planning.",
  readMore: "Explore scope and process",
  processTitle: "From your needs to the next step",
  processIntro:
    "A clear process with decisions on both sides. We agree on a timeline after reviewing your requirements.",
  steps: [
    {
      title: "Discuss your needs",
      body: "Clarify role, location, numbers, preferred start and requirements.",
    },
    {
      title: "Review profiles and requirements",
      body: "Match qualifications, language and required documents.",
    },
    {
      title: "Meet and decide",
      body: "Arrange discussions, resolve questions and agree on cooperation.",
    },
    { title: "Prepare the start", body: "Coordinate documents, responsibilities and onboarding." },
  ],
  profilesTitle: "Get to know candidates",
  profilesIntro: "Only approved profiles appear here. Availability is checked for your request.",
  emptyProfiles:
    "No profiles are currently approved for public viewing. Tell us your needs so we can explore suitable options.",
  aboutTitle: "Connecting Vietnam with your business",
  aboutText:
    "DMF Talents supports the connection between Vietnamese candidates and employers in Germany. It starts with a shared understanding of the role, requirements and cooperation.",
  supportTitle: "Plan for the start at work",
  supportText:
    "Discuss contacts, onboarding, language needs and support with us. Scope and responsibilities are agreed before work begins.",
  fit: "Who is it for?",
  requirements: "What is reviewed?",
  scope: "What we discuss together",
  employer: "Your company's contribution",
  faq: "Frequently asked questions",
  planningNote:
    "Timing and costs depend on the role, documents, language skills and official procedures. Entry and official decisions cannot be guaranteed.",
  services: {
    skilled: {
      title: "Skilled staff for your business",
      description: "Meet experienced candidates from Vietnam for longer-term staffing needs.",
      fit: "Employers hiring for a defined role and ready to align qualifications, requirements and onboarding.",
      requirements: [
        "Education and experience relevant to the role",
        "German skills appropriate to the workplace",
        "Recognition, documents and entry requirements for the individual case",
      ],
      scope: [
        "Clarify role and selection criteria",
        "Coordinate suitable profiles and introductory meetings",
        "Agree documents, process and contacts",
      ],
      employer: [
        "Describe duties, location and working conditions",
        "Identify selection and onboarding contacts",
        "Provide contract terms and required employer documents",
      ],
      faq: [
        [
          "Which occupations are possible?",
          "Tell us the duties and requirements. We review suitable profiles and role-specific prerequisites.",
        ],
        [
          "When can someone start?",
          "Timing depends on the profile, documents and any recognition or entry procedures. We discuss a realistic plan after reviewing the case.",
        ],
        [
          "How are fees determined?",
          "An individual proposal covers the agreed scope. No fixed fee is promised on this website.",
        ],
      ],
    },
    azubi: {
      title: "Apprentices for your team",
      description:
        "Prepare vocational training with clear expectations for language, workplace and learning.",
      fit: "Training companies investing in junior staff and planning time for supervision, language and integration.",
      requirements: [
        "Motivation and suitability for the training role",
        "Language requirements of the company and vocational school",
        "School records and training and entry requirements",
      ],
      scope: [
        "Align training places and expectations",
        "Coordinate introductions and profile questions",
        "Discuss preparation and contacts for the training start",
      ],
      employer: [
        "Define occupation, start and training conditions",
        "Plan supervision and onboarding",
        "Clarify school, documents and practical support",
      ],
      faq: [
        [
          "What language level is needed?",
          "It varies by occupation, school and procedure. We agree requirements for the specific place.",
        ],
        [
          "Is the start date guaranteed?",
          "No. Selection, documents and official decisions need to align. We discuss these dependencies openly.",
        ],
        [
          "What support follows the start?",
          "Support and contacts are agreed in advance. Tell us what your company needs.",
        ],
      ],
    },
    seasonal: {
      title: "Support for seasonal needs",
      description: "Review and plan time-limited staffing needs in a structured way.",
      fit: "Companies with a defined assignment period, duties and staffing plan.",
      requirements: [
        "Assignment period, duties and workplace conditions",
        "Relevant experience and workplace communication",
        "Whether a lawful employment and entry pathway exists for the case",
      ],
      scope: [
        "Review needs and feasibility",
        "Align profiles and assignment conditions",
        "Clarify timeline, documents and responsibilities",
      ],
      employer: [
        "Specify dates, numbers and duties",
        "Clarify hours, pay and any accommodation",
        "Prepare supervision and required documents",
      ],
      faq: [
        [
          "Can every business employ seasonal staff from Vietnam?",
          "The specific case must be reviewed. Short-term demand alone does not establish a suitable employment or entry pathway.",
        ],
        [
          "When should planning begin?",
          "Tell us your dates as early as possible. We review requirements before agreeing a timeline.",
        ],
        [
          "Are people already available?",
          "Availability is checked against your request. A public profile does not promise a particular start date.",
        ],
      ],
    },
  },
  form: {
    title: "Tell us about your hiring needs",
    intro: "The essentials are enough for the first conversation. No account is needed.",
    company: "Company",
    name: "Contact person",
    email: "Business email",
    service: "Support needed",
    message: "Your requirements",
    messagePlaceholder: "Which role are you hiring for? What matters most?",
    optional: "More details (optional)",
    phone: "Phone",
    location: "Work location",
    headcount: "Number of people",
    timing: "Preferred start / period",
    privacy: "I agree to the processing of my details to handle this request under the",
    privacyLink: "privacy policy",
    submit: "Send hiring request",
    sending: "Saving…",
    success: "Thank you. Your request has been saved.",
    next: "DMF will review your needs and use your contact details to clarify requirements and next steps. This request does not form a recruitment contract.",
    reference: "Request reference",
    again: "Send another request",
    error:
      "We could not save your request. Your details are retained in this form. Please try again.",
    required: "* Required fields",
    profile: "Request for profile",
    services: {
      skilled: "Skilled staff",
      azubi: "Apprentices",
      seasonal: "Seasonal staff",
      unsure: "Not sure – please advise",
    },
  },
  pool: {
    title: "Profiles for your hiring needs",
    intro:
      "Approved profiles from Vietnam. We confirm qualifications and availability for your specific request.",
    category: "Support",
    german: "German skills",
    visa: "Visa per reviewed profile",
    all: "All",
    visaYes: "Visa held",
    reset: "Reset filters",
    empty: "No matching public profiles at the moment.",
    error: "Profiles could not be loaded.",
    retry: "Reload",
    count: "profiles",
    visaNote: "A visa shown on a profile does not guarantee a particular assignment or start date.",
  },
};
const vn: EmployerCopy = {
  eyebrow: "TUYỂN DỤNG CHO DOANH NGHIỆP TẠI ĐỨC",
  title: "Nhân lực Việt Nam. Phù hợp với doanh nghiệp anh chị.",
  intro:
    "Nhân lực tay nghề, học viên nghề hay lao động thời vụ: hãy chia sẻ nhu cầu. Chúng ta cùng xem xét hồ sơ, điều kiện và các bước hợp tác.",
  primary: "Gửi nhu cầu tuyển dụng",
  secondary: "Xem ứng viên",
  servicesTitle: "Đội ngũ của anh chị cần hỗ trợ gì?",
  servicesIntro: "Chọn hướng phù hợp với kế hoạch nhân sự của doanh nghiệp.",
  readMore: "Xem dịch vụ và quy trình",
  processTitle: "Từ nhu cầu đến bước tiếp theo",
  processIntro:
    "Quy trình rõ ràng, có quyết định từ cả hai bên. Tiến độ cụ thể được thống nhất sau khi xem xét nhu cầu.",
  steps: [
    {
      title: "Trao đổi nhu cầu",
      body: "Làm rõ vị trí, nơi làm việc, số lượng, thời điểm và yêu cầu.",
    },
    {
      title: "Xem hồ sơ và điều kiện",
      body: "Đối chiếu chuyên môn, tiếng Đức và giấy tờ cần thiết.",
    },
    { title: "Gặp gỡ và quyết định", body: "Trao đổi, giải đáp và thống nhất cách hợp tác." },
    { title: "Chuẩn bị bắt đầu", body: "Phối hợp giấy tờ, trách nhiệm và kế hoạch hội nhập." },
  ],
  profilesTitle: "Tìm hiểu ứng viên",
  profilesIntro:
    "Chỉ hiển thị hồ sơ đã duyệt. Khả năng tham gia được xác nhận theo yêu cầu cụ thể.",
  emptyProfiles:
    "Hiện chưa có hồ sơ được duyệt để công khai. Anh chị có thể gửi nhu cầu để DMF xem xét phương án phù hợp.",
  aboutTitle: "Kết nối Việt Nam với doanh nghiệp tại Đức",
  aboutText:
    "DMF Talents hỗ trợ kết nối ứng viên Việt Nam và doanh nghiệp Đức. Điểm bắt đầu là hiểu rõ công việc, yêu cầu và phương thức hợp tác.",
  supportTitle: "Cùng chuẩn bị giai đoạn bắt đầu",
  supportText:
    "Trao đổi về đầu mối phụ trách, hội nhập, ngôn ngữ và hỗ trợ mong muốn. Phạm vi dịch vụ và trách nhiệm được thống nhất trước khi thực hiện.",
  fit: "Phù hợp với ai?",
  requirements: "Cần xem xét những gì?",
  scope: "Nội dung trao đổi cùng DMF",
  employer: "Doanh nghiệp cần chuẩn bị",
  faq: "Câu hỏi thường gặp",
  planningNote:
    "Thời gian và chi phí tùy thuộc ngành nghề, giấy tờ, ngôn ngữ và thủ tục của cơ quan chức năng. Không thể bảo đảm quyết định cấp phép hay nhập cảnh.",
  services: {
    skilled: {
      title: "Nhân lực tay nghề cho doanh nghiệp",
      description: "Tìm hiểu ứng viên có kinh nghiệm từ Việt Nam cho nhu cầu nhân sự dài hạn.",
      fit: "Doanh nghiệp có vị trí chuyên môn rõ ràng và sẵn sàng phối hợp về bằng cấp, yêu cầu và hội nhập.",
      requirements: [
        "Đào tạo và kinh nghiệm phù hợp công việc",
        "Tiếng Đức phù hợp nhiệm vụ và môi trường",
        "Công nhận bằng cấp, giấy tờ và điều kiện nhập cảnh từng trường hợp",
      ],
      scope: [
        "Làm rõ vị trí và tiêu chí tuyển chọn",
        "Phối hợp hồ sơ và buổi gặp gỡ",
        "Thống nhất giấy tờ, quy trình và đầu mối",
      ],
      employer: [
        "Mô tả công việc, địa điểm và điều kiện làm việc",
        "Bố trí người phụ trách tuyển chọn và hội nhập",
        "Chuẩn bị điều kiện hợp đồng và giấy tờ doanh nghiệp",
      ],
      faq: [
        [
          "Có thể tuyển những ngành nào?",
          "Anh chị nêu vị trí và yêu cầu để DMF xem xét hồ sơ và điều kiện chuyên ngành.",
        ],
        [
          "Khi nào ứng viên có thể bắt đầu?",
          "Tùy hồ sơ, giấy tờ và thủ tục công nhận hoặc nhập cảnh. Tiến độ được trao đổi sau khi kiểm tra.",
        ],
        [
          "Chi phí được xác định thế nào?",
          "Báo giá riêng dựa trên phạm vi thống nhất. Website không cam kết mức phí cố định.",
        ],
      ],
    },
    azubi: {
      title: "Học viên nghề cho đội ngũ",
      description:
        "Chuẩn bị đào tạo nghề với kỳ vọng rõ về ngôn ngữ, doanh nghiệp và lộ trình học.",
      fit: "Doanh nghiệp đào tạo muốn xây dựng nhân lực trẻ và dành thời gian hướng dẫn, ngôn ngữ, hội nhập.",
      requirements: [
        "Động lực và sự phù hợp với nghề",
        "Yêu cầu ngôn ngữ của doanh nghiệp và trường nghề",
        "Hồ sơ học vấn, điều kiện đào tạo và nhập cảnh",
      ],
      scope: [
        "Thống nhất vị trí đào tạo và kỳ vọng",
        "Phối hợp gặp gỡ và giải đáp về hồ sơ",
        "Trao đổi chuẩn bị và đầu mối trước ngày bắt đầu",
      ],
      employer: [
        "Nêu nghề, thời điểm và điều kiện đào tạo",
        "Lên kế hoạch hướng dẫn và hội nhập",
        "Làm rõ trường nghề, giấy tờ và hỗ trợ thực tế",
      ],
      faq: [
        [
          "Cần tiếng Đức trình độ nào?",
          "Tùy nghề, trường và thủ tục. Yêu cầu được đối chiếu cho vị trí cụ thể.",
        ],
        [
          "Có bảo đảm ngày bắt đầu không?",
          "Không. Tuyển chọn, hồ sơ và quyết định của cơ quan chức năng cần phù hợp tiến độ.",
        ],
        [
          "Có hỗ trợ sau khi bắt đầu không?",
          "Phạm vi hỗ trợ và đầu mối được thỏa thuận trước theo nhu cầu doanh nghiệp.",
        ],
      ],
    },
    seasonal: {
      title: "Hỗ trợ nhu cầu nhân sự thời vụ",
      description: "Xem xét và lập kế hoạch cho nhu cầu nhân sự có thời hạn.",
      fit: "Doanh nghiệp xác định rõ thời gian, công việc và kế hoạch nhân sự.",
      requirements: [
        "Thời gian, nhiệm vụ và điều kiện tại nơi làm việc",
        "Kinh nghiệm và giao tiếp phù hợp",
        "Khả năng đáp ứng điều kiện lao động và nhập cảnh hợp pháp trong trường hợp cụ thể",
      ],
      scope: [
        "Xem xét nhu cầu và tính khả thi",
        "Thống nhất hồ sơ và điều kiện công việc",
        "Làm rõ tiến độ, giấy tờ và trách nhiệm",
      ],
      employer: [
        "Nêu thời gian, số lượng và nhiệm vụ",
        "Làm rõ giờ làm, lương và chỗ ở nếu có",
        "Chuẩn bị người hướng dẫn và giấy tờ cần thiết",
      ],
      faq: [
        [
          "Doanh nghiệp nào cũng tuyển được lao động thời vụ từ Việt Nam?",
          "Cần kiểm tra từng trường hợp. Có nhu cầu ngắn hạn không đồng nghĩa đã có con đường lao động và nhập cảnh phù hợp.",
        ],
        [
          "Nên chuẩn bị từ khi nào?",
          "Thông báo kế hoạch sớm để kiểm tra điều kiện trước khi thống nhất tiến độ.",
        ],
        [
          "Đã có người sẵn sàng chưa?",
          "Khả năng tham gia được kiểm tra theo yêu cầu. Hồ sơ công khai không phải cam kết về ngày bắt đầu.",
        ],
      ],
    },
  },
  form: {
    title: "Chia sẻ nhu cầu tuyển dụng",
    intro: "Chỉ cần thông tin chính cho lần trao đổi đầu tiên. Không cần tạo tài khoản.",
    company: "Doanh nghiệp",
    name: "Người liên hệ",
    email: "Email công việc",
    service: "Nhu cầu hỗ trợ",
    message: "Nội dung nhu cầu",
    messagePlaceholder: "Anh chị muốn tuyển vị trí nào? Yêu cầu quan trọng là gì?",
    optional: "Thông tin bổ sung (không bắt buộc)",
    phone: "Điện thoại",
    location: "Nơi làm việc",
    headcount: "Số lượng người",
    timing: "Thời điểm / thời gian dự kiến",
    privacy: "Tôi đồng ý xử lý thông tin để giải quyết yêu cầu này theo",
    privacyLink: "chính sách bảo mật",
    submit: "Gửi yêu cầu tuyển dụng",
    sending: "Đang lưu…",
    success: "Cảm ơn. Yêu cầu đã được lưu.",
    next: "DMF xem xét nhu cầu và liên hệ qua thông tin đã cung cấp để làm rõ yêu cầu và bước tiếp theo. Gửi yêu cầu này không tạo thành hợp đồng tuyển dụng.",
    reference: "Mã yêu cầu",
    again: "Gửi yêu cầu khác",
    error: "Chưa lưu được yêu cầu. Thông tin vẫn được giữ trong biểu mẫu. Vui lòng thử lại.",
    required: "* Thông tin bắt buộc",
    profile: "Yêu cầu hồ sơ",
    services: {
      skilled: "Nhân lực tay nghề",
      azubi: "Học viên nghề",
      seasonal: "Lao động thời vụ",
      unsure: "Chưa xác định – cần tư vấn",
    },
  },
  pool: {
    title: "Hồ sơ cho nhu cầu tuyển dụng",
    intro:
      "Hồ sơ từ Việt Nam đã được duyệt. Chuyên môn và khả năng tham gia được xác nhận theo yêu cầu cụ thể.",
    category: "Nhóm nhân lực",
    german: "Tiếng Đức",
    visa: "Visa theo hồ sơ đã duyệt",
    all: "Tất cả",
    visaYes: "Đã có visa",
    reset: "Xóa bộ lọc",
    empty: "Hiện chưa có hồ sơ công khai phù hợp.",
    error: "Không tải được hồ sơ.",
    retry: "Tải lại",
    count: "hồ sơ",
    visaNote: "Visa trong hồ sơ không bảo đảm một công việc hoặc ngày bắt đầu cụ thể.",
  },
};
export const EMPLOYER_COPY: Record<Language, EmployerCopy> = { de, en, vn };
