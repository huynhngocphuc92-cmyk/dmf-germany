// DMF Vietnam - Site Content Configuration
// Multilingual support: German (de) and Vietnamese (vn)
// Basiert auf dem offiziellen DMF Vietnam Handbuch

export type Language = "de" | "vn";

// Forward declaration for types
interface NavItem {
  label: string;
  href: string;
}

interface Feature {
  title: string;
  description: string;
}

interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface IndustryItem {
  name: string;
  description: string;
}

export interface SiteContent {
  header: {
    logo: string;
    navItems: NavItem[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    greeting: string;
    ctaPrimary: string;
    ctaSecondary: string;
    downloadProfile: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    features: Feature[];
  };
  values: {
    title: string;
    subtitle: string;
    badge: string;
    items: ValueItem[];
  };
  services: {
    title: string;
    subtitle: string;
    learnMore: string;
    items: ServiceItem[];
  };
  process: {
    title: string;
    subtitle: string;
    badge: string;
    steps: ProcessStep[];
  };
  industries: {
    title: string;
    subtitle: string;
    items: IndustryItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    headquarters: {
      title: string;
      location: string;
      phone: string;
      email: string;
      website: string;
    };
    germanContact: {
      name: string;
      title: string;
      phone: string;
      email: string;
    };
    form: {
      title: string;
      description: string;
      nameLabel: string;
      emailLabel: string;
      companyLabel: string;
      messageLabel: string;
      submitLabel: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      companyPlaceholder: string;
      messagePlaceholder: string;
      sending: string;
    };
    cta: {
      title: string;
      description: string;
    };
  };
  footer: {
    companyName: string;
    tagline: string;
    quickLinks: {
      title: string;
      items: NavItem[];
    };
    contactTitle: string;
    links: {
      legal: string;
      privacy: string;
      terms: string;
    };
    copyright: string;
    closing: string;
    downloadProfile: string;
  };
}

// German Content
const deContent: SiteContent = {
  // Header/Navigation
  header: {
    logo: "DMF Vietnam",
    navItems: [
      { label: "Startseite", href: "#home" },
      { label: "Über uns", href: "#about" },
      { label: "Unsere Werte", href: "#values" },
      { label: "Leistungen", href: "#services" },
      { label: "Prozess", href: "#process" },
      { label: "Kontakt", href: "#contact" },
    ],
  },

  // Hero Section
  hero: {
    badge: "Ihr Partner für Fachkräfte aus Vietnam",
    title: "Brücken bauen zwischen Vietnam und Deutschland",
    subtitle:
      "DMF Vietnam vermittelt qualifizierte Fachkräfte und Auszubildende aus Vietnam an deutsche Unternehmen. Mit professioneller Sprachausbildung, interkulturellem Training und umfassender Betreuung.",
    greeting: "Sehr geehrte Partnerinnen und Partner,",
    ctaPrimary: "Kontakt aufnehmen",
    ctaSecondary: "Mehr erfahren",
    downloadProfile: "Unternehmensprofil (PDF)",
  },

  // About Section (Wer wir sind?)
  about: {
    title: "Wer wir sind?",
    subtitle: "DMF Vietnam – Ihr zuverlässiger Partner",
    description:
      "DMF Vietnam ist ein spezialisiertes Unternehmen für die Vermittlung und Ausbildung vietnamesischer Fachkräfte für den deutschen Arbeitsmarkt. Mit unserem Hauptsitz in Vietnam und starken Partnerschaften in Deutschland bieten wir eine durchgängige Betreuung – von der Rekrutierung über die Sprachausbildung bis zur erfolgreichen Integration in deutsche Unternehmen.",
    features: [
      {
        title: "Sprachausbildung",
        description:
          "Intensive Deutschkurse von A1 bis B2 mit muttersprachlichen und vietnamesischen Lehrkräften.",
      },
      {
        title: "Interkulturelles Training",
        description:
          "Vorbereitung auf die deutsche Arbeitskultur, Teamarbeit und Kommunikationsstile.",
      },
      {
        title: "Persönliche Betreuung",
        description:
          "Individuelle Begleitung jedes Kandidaten während des gesamten Prozesses.",
      },
    ],
  },

  // Values Section (Unsere Werte und Verpflichtungen)
  values: {
    title: "Unsere Werte und Verpflichtungen",
    subtitle: "Wofür wir stehen",
    badge: "Unsere Philosophie",
    items: [
      {
        title: "Qualität",
        description:
          "Höchste Standards in der Ausbildung und Vermittlung unserer Kandidaten. Wir setzen auf Exzellenz in allen Bereichen.",
        icon: "award",
      },
      {
        title: "Sorgfältige Auswahl",
        description:
          "Auswahl der Bewerber nach Kompetenz, Haltung und Motivation, damit sie wirklich zu den Anforderungen der Unternehmen passen.",
        icon: "search",
      },
      {
        title: "Transparenz",
        description:
          "Offene und ehrliche Kommunikation mit allen Partnern. Klare Prozesse und nachvollziehbare Entscheidungen.",
        icon: "eye",
      },
      {
        title: "Verantwortung",
        description:
          "Wir übernehmen Verantwortung für unsere Kandidaten und Partner – vor, während und nach der Vermittlung.",
        icon: "shield",
      },
    ],
  },

  // Services Section (Unser Angebot)
  services: {
    title: "Unser Angebot",
    subtitle: "Umfassende Dienstleistungen für Ihren Erfolg",
    learnMore: "Mehr erfahren",
    items: [
      {
        title: "Interkulturelles Training",
        description:
          "Durch unsere Trainings lernen die Kandidaten deutsche Arbeitskultur, Teamarbeit und Kommunikationsstile. Wir bereiten sie umfassend auf das Leben und Arbeiten in Deutschland vor.",
        icon: "globe",
      },
      {
        title: "Vermittlungsservice",
        description:
          "Professionelle Rekrutierung und Auswahl qualifizierter Fachkräfte und Auszubildender. Wir finden die passenden Kandidaten für Ihre spezifischen Anforderungen.",
        icon: "users",
      },
      {
        title: "Betreuung und Nachsorge",
        description:
          "Umfassende Unterstützung bei Integration und Nachbetreuung. Wir begleiten sowohl Unternehmen als auch Kandidaten langfristig für nachhaltigen Erfolg.",
        icon: "heart",
      },
    ],
  },

  // Process Section (Unser Kooperationsprozess)
  process: {
    title: "Unser Kooperationsprozess",
    subtitle: "Von der Bedarfsanalyse bis zur Integration",
    badge: "Schritt für Schritt",
    steps: [
      {
        number: "1",
        title: "Bedarfsanalyse",
        description:
          "Gemeinsame Analyse Ihrer Anforderungen und Definition des Kandidatenprofils.",
      },
      {
        number: "2",
        title: "Rekrutierung und Auswahl",
        description:
          "Sorgfältige Auswahl geeigneter Kandidaten nach Kompetenz, Haltung und Motivation.",
      },
      {
        number: "3",
        title: "Sprach- und Fachtraining",
        description:
          "Intensive Deutschkurse und fachspezifische Vorbereitung in Vietnam.",
      },
      {
        number: "4",
        title: "Interview und Vertrag",
        description:
          "Organisation von Vorstellungsgesprächen und Unterstützung beim Vertragsabschluss.",
      },
      {
        number: "5",
        title: "Visa und Ausreise",
        description:
          "Begleitung bei allen administrativen Prozessen für Visum und Einreise.",
      },
      {
        number: "6",
        title: "Integration und Nachbetreuung",
        description:
          "Langfristige Unterstützung für erfolgreiche Integration in Deutschland.",
      },
    ],
  },

  // Industries (Branchen & Berufsfelder)
  industries: {
    title: "Branchen & Berufsfelder",
    subtitle: "Fachkräfte für verschiedene Sektoren",
    items: [
      { name: "Gesundheit & Pflege", description: "Pflegefachkraft, Altenpflege, Krankenpflege" },
      { name: "Hotellerie & Gastronomie", description: "Koch, Service, Hotelmanagement" },
      { name: "Technik & IT", description: "Mechatronik, Elektrotechnik, IT-Berufe" },
      { name: "Handwerk & Produktion", description: "Industriemechaniker, CNC-Fachkraft" },
      { name: "Logistik & Handel", description: "Lagerlogistik, Spedition, Einzelhandel" },
    ],
  },

  // Contact Section
  contact: {
    title: "Kontakt",
    subtitle: "Lassen Sie uns zusammenarbeiten",
    description:
      "Nehmen Sie Kontakt mit uns auf, um mehr über unsere Dienstleistungen zu erfahren oder ein individuelles Beratungsgespräch zu vereinbaren.",
    badge: "Jetzt Kontakt aufnehmen",
    
    // Hauptsitz Vietnam
    headquarters: {
      title: "Hauptsitz in Vietnam",
      location: "Đồng Nai, Vietnam",
      phone: "+84 251 6609 500",
      email: "contact@dmf.edu.vn",
      website: "dmf.edu.vn",
    },
    
    // Ansprechpartner Deutschland
    germanContact: {
      name: "Herr Achim Betticher",
      title: "Ansprechpartner Deutschland",
      phone: "+84 85 507 0773",
      email: "achim@betticher.de",
    },

    form: {
      title: "Nachricht senden",
      description: "Füllen Sie das Formular aus und wir melden uns zeitnah bei Ihnen.",
      nameLabel: "Name",
      emailLabel: "E-Mail",
      companyLabel: "Unternehmen",
      messageLabel: "Nachricht",
      submitLabel: "Nachricht senden",
      namePlaceholder: "Ihr Name",
      emailPlaceholder: "ihre.email@unternehmen.de",
      companyPlaceholder: "Ihr Unternehmen",
      messagePlaceholder: "Wie können wir Ihnen helfen?",
      sending: "Wird gesendet...",
    },

    cta: {
      title: "Fachkräfte gesucht?",
      description: "Wir helfen Ihnen, qualifizierte vietnamesische Fachkräfte für Ihr Unternehmen zu finden.",
    },
  },

  // Footer
  footer: {
    companyName: "DMF Vietnam",
    tagline: "Brücken bauen zwischen Vietnam und Deutschland",
    quickLinks: {
      title: "Schnellzugriff",
      items: [
        { label: "Über uns", href: "#about" },
        { label: "Leistungen", href: "#services" },
        { label: "Kontakt", href: "#contact" },
      ],
    },
    contactTitle: "Kontakt",
    links: {
      legal: "Impressum",
      privacy: "Datenschutz",
      terms: "AGB",
    },
    copyright: "© 2024 DMF Vietnam. Alle Rechte vorbehalten.",
    closing: "Herzlichst, Ihr DMF Vietnam Team",
    downloadProfile: "Unternehmensprofil herunterladen",
  },
};

// Vietnamese Content
const vnContent: SiteContent = {
  // Header/Navigation
  header: {
    logo: "DMF Vietnam",
    navItems: [
      { label: "Trang chủ", href: "#home" },
      { label: "Về chúng tôi", href: "#about" },
      { label: "Giá trị", href: "#values" },
      { label: "Dịch vụ", href: "#services" },
      { label: "Quy trình", href: "#process" },
      { label: "Liên hệ", href: "#contact" },
    ],
  },

  // Hero Section
  hero: {
    badge: "Đối tác tin cậy cho nguồn nhân lực Việt Nam",
    title: "Xây cầu nối giữa Việt Nam và Đức",
    subtitle:
      "DMF Vietnam chuyên tuyển dụng và đào tạo nhân lực Việt Nam chất lượng cao cho các doanh nghiệp Đức. Với chương trình đào tạo ngôn ngữ chuyên nghiệp, huấn luyện văn hóa và hỗ trợ toàn diện.",
    greeting: "Kính gửi quý Đối tác,",
    ctaPrimary: "Liên hệ ngay",
    ctaSecondary: "Tìm hiểu thêm",
    downloadProfile: "Hồ sơ năng lực (PDF)",
  },

  // About Section
  about: {
    title: "Chúng tôi là ai?",
    subtitle: "DMF Vietnam – Đối tác đáng tin cậy của bạn",
    description:
      "DMF Vietnam là doanh nghiệp chuyên về tuyển dụng và đào tạo nhân lực Việt Nam cho thị trường lao động Đức. Với trụ sở chính tại Việt Nam và mạng lưới đối tác mạnh mẽ tại Đức, chúng tôi cung cấp dịch vụ hỗ trợ toàn diện – từ tuyển dụng, đào tạo ngôn ngữ đến hội nhập thành công vào doanh nghiệp Đức.",
    features: [
      {
        title: "Đào tạo ngôn ngữ",
        description:
          "Khóa học tiếng Đức chuyên sâu từ A1 đến B2 với giáo viên bản ngữ và giáo viên Việt Nam.",
      },
      {
        title: "Huấn luyện văn hóa",
        description:
          "Chuẩn bị về văn hóa làm việc Đức, làm việc nhóm và phong cách giao tiếp.",
      },
      {
        title: "Hỗ trợ cá nhân",
        description:
          "Đồng hành cá nhân hóa cho từng ứng viên trong suốt quá trình.",
      },
    ],
  },

  // Values Section
  values: {
    title: "Giá trị và cam kết của chúng tôi",
    subtitle: "Những gì chúng tôi đại diện",
    badge: "Triết lý của chúng tôi",
    items: [
      {
        title: "Chất lượng",
        description:
          "Tiêu chuẩn cao nhất trong đào tạo và tuyển dụng ứng viên. Chúng tôi hướng đến sự xuất sắc trong mọi lĩnh vực.",
        icon: "award",
      },
      {
        title: "Tuyển chọn kỹ lưỡng",
        description:
          "Lựa chọn ứng viên dựa trên năng lực, thái độ và động lực để phù hợp thực sự với yêu cầu của doanh nghiệp.",
        icon: "search",
      },
      {
        title: "Minh bạch",
        description:
          "Giao tiếp cởi mở và trung thực với tất cả đối tác. Quy trình rõ ràng và quyết định minh bạch.",
        icon: "eye",
      },
      {
        title: "Trách nhiệm",
        description:
          "Chúng tôi chịu trách nhiệm với ứng viên và đối tác – trước, trong và sau khi tuyển dụng.",
        icon: "shield",
      },
    ],
  },

  // Services Section
  services: {
    title: "Dịch vụ của chúng tôi",
    subtitle: "Giải pháp toàn diện cho thành công của bạn",
    learnMore: "Tìm hiểu thêm",
    items: [
      {
        title: "Huấn luyện văn hóa",
        description:
          "Qua các khóa đào tạo, ứng viên học về văn hóa làm việc Đức, làm việc nhóm và phong cách giao tiếp. Chúng tôi chuẩn bị toàn diện cho cuộc sống và làm việc tại Đức.",
        icon: "globe",
      },
      {
        title: "Dịch vụ tuyển dụng",
        description:
          "Tuyển dụng và lựa chọn chuyên nghiệp các nhân sự và học viên có chất lượng. Chúng tôi tìm ứng viên phù hợp với yêu cầu cụ thể của bạn.",
        icon: "users",
      },
      {
        title: "Hỗ trợ và chăm sóc",
        description:
          "Hỗ trợ toàn diện trong hội nhập và chăm sóc sau. Chúng tôi đồng hành cùng doanh nghiệp và ứng viên lâu dài để đạt thành công bền vững.",
        icon: "heart",
      },
    ],
  },

  // Process Section
  process: {
    title: "Quy trình hợp tác",
    subtitle: "Từ phân tích nhu cầu đến hội nhập",
    badge: "Từng bước một",
    steps: [
      {
        number: "1",
        title: "Phân tích nhu cầu",
        description:
          "Cùng phân tích yêu cầu của bạn và xác định hồ sơ ứng viên phù hợp.",
      },
      {
        number: "2",
        title: "Tuyển dụng và lựa chọn",
        description:
          "Lựa chọn kỹ lưỡng ứng viên phù hợp theo năng lực, thái độ và động lực.",
      },
      {
        number: "3",
        title: "Đào tạo ngôn ngữ và chuyên môn",
        description:
          "Khóa tiếng Đức chuyên sâu và chuẩn bị chuyên môn tại Việt Nam.",
      },
      {
        number: "4",
        title: "Phỏng vấn và hợp đồng",
        description:
          "Tổ chức phỏng vấn và hỗ trợ ký kết hợp đồng.",
      },
      {
        number: "5",
        title: "Visa và xuất cảnh",
        description:
          "Đồng hành trong tất cả thủ tục hành chính về visa và nhập cảnh.",
      },
      {
        number: "6",
        title: "Hội nhập và chăm sóc",
        description:
          "Hỗ trợ lâu dài để hội nhập thành công tại Đức.",
      },
    ],
  },

  // Industries
  industries: {
    title: "Ngành nghề & Lĩnh vực",
    subtitle: "Nhân lực cho các ngành đa dạng",
    items: [
      { name: "Y tế & Điều dưỡng", description: "Điều dưỡng viên, chăm sóc người cao tuổi" },
      { name: "Khách sạn & Nhà hàng", description: "Đầu bếp, phục vụ, quản lý khách sạn" },
      { name: "Kỹ thuật & CNTT", description: "Cơ điện tử, điện kỹ thuật, nghề CNTT" },
      { name: "Thủ công & Sản xuất", description: "Thợ cơ khí, CNC" },
      { name: "Logistics & Thương mại", description: "Kho bãi, vận tải, bán lẻ" },
    ],
  },

  // Contact Section
  contact: {
    title: "Liên hệ",
    subtitle: "Hãy cùng hợp tác",
    description:
      "Liên hệ với chúng tôi để tìm hiểu thêm về dịch vụ hoặc đặt lịch tư vấn riêng.",
    badge: "Liên hệ ngay",
    
    headquarters: {
      title: "Trụ sở tại Việt Nam",
      location: "Đồng Nai, Việt Nam",
      phone: "+84 251 6609 500",
      email: "contact@dmf.edu.vn",
      website: "dmf.edu.vn",
    },
    
    germanContact: {
      name: "Ông Achim Betticher",
      title: "Đại diện tại Đức",
      phone: "+84 85 507 0773",
      email: "achim@betticher.de",
    },

    form: {
      title: "Gửi tin nhắn",
      description: "Điền vào biểu mẫu và chúng tôi sẽ liên hệ lại sớm nhất.",
      nameLabel: "Họ tên",
      emailLabel: "Email",
      companyLabel: "Công ty",
      messageLabel: "Tin nhắn",
      submitLabel: "Gửi tin nhắn",
      namePlaceholder: "Họ tên của bạn",
      emailPlaceholder: "email@congty.vn",
      companyPlaceholder: "Tên công ty",
      messagePlaceholder: "Chúng tôi có thể giúp gì cho bạn?",
      sending: "Đang gửi...",
    },

    cta: {
      title: "Cần tuyển nhân sự?",
      description: "Chúng tôi giúp bạn tìm kiếm nhân lực Việt Nam chất lượng cao cho doanh nghiệp.",
    },
  },

  // Footer
  footer: {
    companyName: "DMF Vietnam",
    tagline: "Xây cầu nối giữa Việt Nam và Đức",
    quickLinks: {
      title: "Liên kết nhanh",
      items: [
        { label: "Về chúng tôi", href: "#about" },
        { label: "Dịch vụ", href: "#services" },
        { label: "Liên hệ", href: "#contact" },
      ],
    },
    contactTitle: "Liên hệ",
    links: {
      legal: "Thông tin pháp lý",
      privacy: "Chính sách bảo mật",
      terms: "Điều khoản",
    },
    copyright: "© 2024 DMF Vietnam. Bảo lưu mọi quyền.",
    closing: "Trân trọng, Đội ngũ DMF Vietnam",
    downloadProfile: "Tải hồ sơ năng lực",
  },
} as const;

// Export multilingual content
export const siteContent: Record<Language, SiteContent> = {
  de: deContent,
  vn: vnContent,
};
