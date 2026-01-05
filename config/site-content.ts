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
  legal: {
    impressum: {
      title: string;
      subtitle: string;
      backToHome: string;
      sections: {
        company: {
          title: string;
          name: string;
          legalForm: string;
        };
        address: {
          title: string;
          street: string;
          city: string;
          province: string;
          country: string;
        };
        representative: {
          title: string;
          name: string;
          role: string;
        };
        contact: {
          title: string;
          vietnamHQ: string;
          germanContact: string;
        };
        responsibleContent: {
          title: string;
          description: string;
        };
        disputeResolution: {
          title: string;
          description: string;
          platformLink: string;
          platformText: string;
          disclaimer: string;
        };
        liability: {
          title: string;
          contentTitle: string;
          contentText: string;
          linksTitle: string;
          linksText: string;
        };
        copyright: {
          title: string;
          text: string;
        };
      };
    };
    datenschutz: {
      title: string;
      subtitle: string;
      lastUpdated: string;
      backToHome: string;
      sections: {
        overview: {
          title: string;
          generalTitle: string;
          generalText: string;
          responsibleTitle: string;
          responsibleText: string;
        };
        dataCollection: {
          title: string;
          whoTitle: string;
          whoText: string;
          howTitle: string;
          howText: string;
          purposeTitle: string;
          purposeText: string;
        };
        cookies: {
          title: string;
          whatTitle: string;
          whatText: string;
          whichTitle: string;
          whichText: string;
          typesTitle: string;
          typesText: string;
        };
        contactForm: {
          title: string;
          processingTitle: string;
          processingText: string;
          legalBasisTitle: string;
          legalBasisText: string;
          storageTitle: string;
          storageText: string;
          nodemailerTitle: string;
          nodemailerText: string;
        };
        rights: {
          title: string;
          informationTitle: string;
          informationText: string;
          rectificationTitle: string;
          rectificationText: string;
          erasureTitle: string;
          erasureText: string;
          restrictionTitle: string;
          restrictionText: string;
          portabilityTitle: string;
          portabilityText: string;
          objectionTitle: string;
          objectionText: string;
          complaintTitle: string;
          complaintText: string;
        };
        ssl: {
          title: string;
          text: string;
        };
      };
    };
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

  // Legal Pages (Impressum & Datenschutz)
  legal: {
    impressum: {
      title: "Impressum",
      subtitle: "Angaben gemäß § 5 TMG (Telemediengesetz)",
      backToHome: "Zurück zur Startseite",
      sections: {
        company: {
          title: "Firmenname",
          name: "DMF Vietnam",
          legalForm: "Bildungsunternehmen für internationale Fachkräftevermittlung",
        },
        address: {
          title: "Anschrift",
          street: "Tan Phu Industrial Park",
          city: "Phu Hoa Ward, Thu Dau Mot City",
          province: "Binh Duong Province",
          country: "Vietnam",
        },
        representative: {
          title: "Vertreten durch",
          name: "Herr Achim Betticher",
          role: "Geschäftsführer und Ansprechpartner Deutschland",
        },
        contact: {
          title: "Kontakt",
          vietnamHQ: "Hauptsitz Vietnam",
          germanContact: "Ansprechpartner Deutschland",
        },
        responsibleContent: {
          title: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
          description: "Die inhaltliche Verantwortung für diese Website liegt bei Herrn Achim Betticher. Für redaktionelle Inhalte und die Richtigkeit der Angaben ist DMF Vietnam verantwortlich.",
        },
        disputeResolution: {
          title: "Streitschlichtung",
          description: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:",
          platformLink: "https://ec.europa.eu/consumers/odr",
          platformText: "Online-Streitbeilegungsplattform der EU",
          disclaimer: "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        },
        liability: {
          title: "Haftungsausschluss",
          contentTitle: "Haftung für Inhalte",
          contentText: "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
          linksTitle: "Haftung für Links",
          linksText: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
        },
        copyright: {
          title: "Urheberrecht",
          text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
        },
      },
    },
    datenschutz: {
      title: "Datenschutzerklärung",
      subtitle: "Informationen zur Datenverarbeitung gemäß DSGVO (Datenschutz-Grundverordnung)",
      lastUpdated: "Stand: Januar 2024",
      backToHome: "Zurück zur Startseite",
      sections: {
        overview: {
          title: "1. Datenschutz auf einen Blick",
          generalTitle: "Allgemeine Hinweise",
          generalText: "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.",
          responsibleTitle: "Wer ist verantwortlich für die Datenerfassung auf dieser Website?",
          responsibleText: "Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber DMF Vietnam. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Verantwortlich im Sinne der DSGVO ist Herr Achim Betticher.",
        },
        dataCollection: {
          title: "2. Datenerfassung auf dieser Website",
          whoTitle: "Wer ist verantwortlich für die Datenerfassung?",
          whoText: "Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.",
          howTitle: "Wie erfassen wir Ihre Daten?",
          howText: "Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in unser Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).",
          purposeTitle: "Wofür nutzen wir Ihre Daten?",
          purposeText: "Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten (insbesondere aus dem Kontaktformular) können zur Analyse Ihres Nutzerverhaltens oder zur Bearbeitung Ihrer Anfrage verwendet werden.",
        },
        cookies: {
          title: "3. Cookies und ähnliche Technologien",
          whatTitle: "Was sind Cookies?",
          whatText: "Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.",
          whichTitle: "Welche Cookies nutzen wir?",
          whichText: "Wir nutzen ausschließlich technisch notwendige Cookies, um die Funktionalität unserer Website zu gewährleisten. Diese Cookies werden automatisch gesetzt und sind für den Betrieb der Website erforderlich. Sie werden nach Beendigung Ihrer Browser-Sitzung automatisch gelöscht (Session-Cookies).",
          typesTitle: "Arten von Cookies",
          typesText: "Session-Cookies: Diese Cookies werden nach dem Schließen Ihres Browsers automatisch gelöscht. Funktionale Cookies: Diese speichern Ihre Spracheinstellung und andere Präferenzen. Sie haben die Möglichkeit, Cookies in Ihren Browser-Einstellungen zu deaktivieren. Bitte beachten Sie jedoch, dass die Website dann möglicherweise nicht vollständig funktioniert.",
        },
        contactForm: {
          title: "4. Kontaktformular und E-Mail-Kommunikation",
          processingTitle: "Datenverarbeitung beim Kontaktformular",
          processingText: "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail-Adresse, Firmenname und Nachricht) zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
          legalBasisTitle: "Rechtsgrundlage der Verarbeitung",
          legalBasisText: "Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt auf der Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung jederzeit widerrufen. Eine formlose Mitteilung per E-Mail an uns genügt. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.",
          storageTitle: "Speicherdauer",
          storageText: "Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z.B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.",
          nodemailerTitle: "E-Mail-Versand über Nodemailer (Gmail SMTP)",
          nodemailerText: "Für den Versand der Formulardaten verwenden wir den SMTP-Dienst von Gmail über die Bibliothek Nodemailer. Die von Ihnen eingegebenen Daten werden verschlüsselt über TLS/SSL an unsere E-Mail-Adresse übertragen. Empfänger der E-Mail ist ausschließlich DMF Vietnam. Gmail verarbeitet die Übertragung als technischer Dienstleister gemäß den Google-Datenschutzbestimmungen.",
        },
        rights: {
          title: "5. Ihre Rechte als betroffene Person",
          informationTitle: "Recht auf Auskunft (Art. 15 DSGVO)",
          informationText: "Sie haben das Recht, Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten. Diese Auskunft umfasst insbesondere die Verarbeitungszwecke, die Kategorien personenbezogener Daten, die Empfänger, die geplante Speicherdauer sowie das Bestehen eines Beschwerderechts.",
          rectificationTitle: "Recht auf Berichtigung (Art. 16 DSGVO)",
          rectificationText: "Sie haben das Recht, die unverzügliche Berichtigung unrichtiger oder unvollständiger personenbezogener Daten zu verlangen.",
          erasureTitle: "Recht auf Löschung (Art. 17 DSGVO)",
          erasureText: "Sie haben das Recht, die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die weitere Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist.",
          restrictionTitle: "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
          restrictionText: "Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, wenn die Richtigkeit der Daten bestritten wird oder die Verarbeitung unrechtmäßig ist.",
          portabilityTitle: "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
          portabilityText: "Sie haben das Recht, die Sie betreffenden personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten und diese Daten einem anderen Verantwortlichen zu übermitteln.",
          objectionTitle: "Widerspruchsrecht (Art. 21 DSGVO)",
          objectionText: "Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch einzulegen.",
          complaintTitle: "Beschwerderecht bei einer Aufsichtsbehörde",
          complaintText: "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. In Deutschland können Sie sich an die für Ihren Wohnort zuständige Landesdatenschutzbehörde wenden.",
        },
        ssl: {
          title: "6. SSL- bzw. TLS-Verschlüsselung",
          text: "Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von 'http://' auf 'https://' wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.",
        },
      },
    },
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

  // Legal Pages
  legal: {
    impressum: {
      title: "Thông tin pháp lý",
      subtitle: "Thông tin công ty theo luật Đức (§ 5 TMG)",
      backToHome: "Quay lại trang chủ",
      sections: {
        company: {
          title: "Tên công ty",
          name: "DMF Vietnam",
          legalForm: "Doanh nghiệp giáo dục và tuyển dụng nhân lực quốc tế",
        },
        address: {
          title: "Địa chỉ",
          street: "Khu công nghiệp Tân Phú",
          city: "Phường Phú Hòa, Thành phố Thủ Dầu Một",
          province: "Tỉnh Bình Dương",
          country: "Việt Nam",
        },
        representative: {
          title: "Người đại diện",
          name: "Ông Achim Betticher",
          role: "Giám đốc điều hành và Đại diện tại Đức",
        },
        contact: {
          title: "Liên hệ",
          vietnamHQ: "Trụ sở Việt Nam",
          germanContact: "Đại diện tại Đức",
        },
        responsibleContent: {
          title: "Người chịu trách nhiệm nội dung (§ 55 Abs. 2 RStV)",
          description: "Trách nhiệm nội dung của trang web này thuộc về Ông Achim Betticher. DMF Vietnam chịu trách nhiệm về nội dung biên tập và tính chính xác của thông tin.",
        },
        disputeResolution: {
          title: "Giải quyết tranh chấp",
          description: "Ủy ban Châu Âu cung cấp nền tảng giải quyết tranh chấp trực tuyến (OS):",
          platformLink: "https://ec.europa.eu/consumers/odr",
          platformText: "Nền tảng giải quyết tranh chấp trực tuyến của EU",
          disclaimer: "Chúng tôi không sẵn sàng hoặc không bắt buộc tham gia vào thủ tục giải quyết tranh chấp trước cơ quan hòa giải người tiêu dùng.",
        },
        liability: {
          title: "Từ chối trách nhiệm",
          contentTitle: "Trách nhiệm về nội dung",
          contentText: "Nội dung trên trang web này được tạo với sự cẩn thận cao nhất. Tuy nhiên, chúng tôi không thể đảm bảo tính chính xác, đầy đủ và cập nhật của nội dung. Là nhà cung cấp dịch vụ, chúng tôi chịu trách nhiệm về nội dung riêng của mình trên các trang này theo các luật chung (§ 7 Abs.1 TMG). Tuy nhiên, theo §§ 8 đến 10 TMG, với tư cách là nhà cung cấp dịch vụ, chúng tôi không có nghĩa vụ giám sát thông tin của bên thứ ba được truyền tải hoặc lưu trữ.",
          linksTitle: "Trách nhiệm về liên kết",
          linksText: "Trang web của chúng tôi có chứa liên kết đến các trang web bên ngoài của bên thứ ba mà chúng tôi không có quyền kiểm soát nội dung. Do đó, chúng tôi không thể chịu trách nhiệm cho các nội dung bên ngoài này. Nhà cung cấp hoặc người vận hành các trang được liên kết luôn chịu trách nhiệm về nội dung của các trang đó.",
        },
        copyright: {
          title: "Bản quyền",
          text: "Nội dung và tác phẩm được tạo bởi người vận hành trang web này thuộc bản quyền Đức. Việc sao chép, chỉnh sửa, phân phối và bất kỳ hình thức sử dụng nào vượt quá giới hạn bản quyền đều cần có sự đồng ý bằng văn bản của tác giả hoặc người tạo. Tải xuống và sao chép trang này chỉ được phép cho mục đích sử dụng cá nhân, phi thương mại.",
        },
      },
    },
    datenschutz: {
      title: "Chính sách bảo mật",
      subtitle: "Thông tin về xử lý dữ liệu theo DSGVO (Quy định Bảo vệ Dữ liệu Chung)",
      lastUpdated: "Cập nhật: Tháng 1/2024",
      backToHome: "Quay lại trang chủ",
      sections: {
        overview: {
          title: "1. Tổng quan về bảo mật dữ liệu",
          generalTitle: "Thông tin chung",
          generalText: "Các thông tin sau đây cung cấp một cái nhìn tổng quan đơn giản về những gì xảy ra với dữ liệu cá nhân của bạn khi bạn truy cập trang web này. Dữ liệu cá nhân là tất cả dữ liệu có thể xác định danh tính cá nhân của bạn. Thông tin chi tiết về bảo vệ dữ liệu có thể được tìm thấy trong chính sách bảo mật của chúng tôi bên dưới.",
          responsibleTitle: "Ai chịu trách nhiệm thu thập dữ liệu trên trang web này?",
          responsibleText: "Việc xử lý dữ liệu trên trang web này được thực hiện bởi người vận hành trang web DMF Vietnam. Thông tin liên hệ có thể được tìm thấy trong phần thông tin pháp lý của trang web này. Người chịu trách nhiệm theo DSGVO là Ông Achim Betticher.",
        },
        dataCollection: {
          title: "2. Thu thập dữ liệu trên trang web này",
          whoTitle: "Ai chịu trách nhiệm thu thập dữ liệu?",
          whoText: "Việc xử lý dữ liệu trên trang web này được thực hiện bởi người vận hành trang web. Thông tin liên hệ có thể được tìm thấy trong phần thông tin pháp lý của trang web này.",
          howTitle: "Chúng tôi thu thập dữ liệu của bạn như thế nào?",
          howText: "Dữ liệu của bạn được thu thập một phần bằng cách bạn cung cấp cho chúng tôi. Đây có thể là dữ liệu bạn nhập vào biểu mẫu liên hệ. Dữ liệu khác được thu thập tự động hoặc sau khi bạn đồng ý khi truy cập trang web bởi hệ thống IT của chúng tôi. Đây chủ yếu là dữ liệu kỹ thuật (ví dụ: trình duyệt internet, hệ điều hành hoặc thời gian truy cập trang).",
          purposeTitle: "Chúng tôi sử dụng dữ liệu của bạn để làm gì?",
          purposeText: "Một phần dữ liệu được thu thập để đảm bảo trang web hoạt động không có lỗi. Dữ liệu khác (đặc biệt là từ biểu mẫu liên hệ) có thể được sử dụng để phân tích hành vi người dùng hoặc xử lý yêu cầu của bạn.",
        },
        cookies: {
          title: "3. Cookies và công nghệ tương tự",
          whatTitle: "Cookies là gì?",
          whatText: "Trang web của chúng tôi sử dụng cookies. Đây là các tệp văn bản nhỏ mà trình duyệt web của bạn lưu trữ trên thiết bị của bạn. Cookies giúp chúng tôi làm cho dịch vụ của mình thân thiện, hiệu quả và an toàn hơn với người dùng.",
          whichTitle: "Chúng tôi sử dụng cookies nào?",
          whichText: "Chúng tôi chỉ sử dụng cookies kỹ thuật cần thiết để đảm bảo chức năng của trang web. Các cookies này được đặt tự động và cần thiết cho hoạt động của trang web. Chúng sẽ tự động bị xóa sau khi bạn đóng trình duyệt (Session Cookies).",
          typesTitle: "Các loại cookies",
          typesText: "Session Cookies: Các cookies này sẽ tự động bị xóa sau khi bạn đóng trình duyệt. Cookies chức năng: Lưu trữ cài đặt ngôn ngữ và các tùy chọn khác. Bạn có thể vô hiệu hóa cookies trong cài đặt trình duyệt. Tuy nhiên, xin lưu ý rằng trang web có thể không hoạt động đầy đủ nếu bạn làm điều này.",
        },
        contactForm: {
          title: "4. Biểu mẫu liên hệ và giao tiếp qua email",
          processingTitle: "Xử lý dữ liệu từ biểu mẫu liên hệ",
          processingText: "Nếu bạn gửi yêu cầu cho chúng tôi qua biểu mẫu liên hệ, dữ liệu của bạn từ biểu mẫu bao gồm thông tin liên hệ bạn cung cấp (tên, địa chỉ email, tên công ty và tin nhắn) sẽ được lưu trữ bởi chúng tôi để xử lý yêu cầu và trong trường hợp có câu hỏi tiếp theo. Chúng tôi không chia sẻ dữ liệu này mà không có sự đồng ý của bạn.",
          legalBasisTitle: "Cơ sở pháp lý cho việc xử lý",
          legalBasisText: "Việc xử lý dữ liệu được nhập vào biểu mẫu liên hệ được thực hiện trên cơ sở sự đồng ý của bạn (Art. 6 Abs. 1 lit. a DSGVO). Bạn có thể thu hồi sự đồng ý này bất cứ lúc nào. Một thông báo không chính thức qua email cho chúng tôi là đủ. Tính hợp pháp của các hoạt động xử lý dữ liệu đã thực hiện trước khi thu hồi không bị ảnh hưởng bởi việc thu hồi.",
          storageTitle: "Thời gian lưu trữ",
          storageText: "Dữ liệu bạn nhập vào biểu mẫu liên hệ sẽ được lưu trữ cho đến khi bạn yêu cầu chúng tôi xóa, thu hồi sự đồng ý lưu trữ hoặc mục đích lưu trữ dữ liệu không còn (ví dụ: sau khi hoàn thành xử lý yêu cầu của bạn). Các quy định pháp lý bắt buộc - đặc biệt là thời hạn lưu trữ - vẫn không bị ảnh hưởng.",
          nodemailerTitle: "Gửi email qua Nodemailer (Gmail SMTP)",
          nodemailerText: "Để gửi dữ liệu biểu mẫu, chúng tôi sử dụng dịch vụ SMTP của Gmail thông qua thư viện Nodemailer. Dữ liệu bạn nhập sẽ được mã hóa qua TLS/SSL và gửi đến địa chỉ email của chúng tôi. Người nhận email chỉ là DMF Vietnam. Gmail xử lý việc truyền tải với tư cách là nhà cung cấp dịch vụ kỹ thuật theo chính sách bảo mật của Google.",
        },
        rights: {
          title: "5. Quyền của bạn với tư cách là người có liên quan",
          informationTitle: "Quyền được biết (Art. 15 DSGVO)",
          informationText: "Bạn có quyền nhận thông tin về dữ liệu cá nhân của bạn được lưu trữ bởi chúng tôi. Thông tin này đặc biệt bao gồm mục đích xử lý, danh mục dữ liệu cá nhân, người nhận, thời gian lưu trữ dự kiến và sự tồn tại của quyền khiếu nại.",
          rectificationTitle: "Quyền sửa chữa (Art. 16 DSGVO)",
          rectificationText: "Bạn có quyền yêu cầu sửa chữa ngay lập tức dữ liệu cá nhân không chính xác hoặc không đầy đủ.",
          erasureTitle: "Quyền xóa (Art. 17 DSGVO)",
          erasureText: "Bạn có quyền yêu cầu xóa dữ liệu cá nhân của bạn được lưu trữ bởi chúng tôi, trừ khi cần thiết tiếp tục xử lý để thực hiện nghĩa vụ pháp lý.",
          restrictionTitle: "Quyền hạn chế xử lý (Art. 18 DSGVO)",
          restrictionText: "Bạn có quyền yêu cầu hạn chế xử lý dữ liệu cá nhân của bạn nếu tính chính xác của dữ liệu bị tranh chấp hoặc việc xử lý là bất hợp pháp.",
          portabilityTitle: "Quyền chuyển dữ liệu (Art. 20 DSGVO)",
          portabilityText: "Bạn có quyền nhận dữ liệu cá nhân liên quan đến bạn ở định dạng có cấu trúc, thường dùng và có thể đọc bằng máy và chuyển dữ liệu này cho một bên chịu trách nhiệm khác.",
          objectionTitle: "Quyền phản đối (Art. 21 DSGVO)",
          objectionText: "Bạn có quyền phản đối việc xử lý dữ liệu cá nhân liên quan đến bạn bất cứ lúc nào vì lý do phát sinh từ tình huống đặc biệt của bạn.",
          complaintTitle: "Quyền khiếu nại với cơ quan giám sát",
          complaintText: "Bạn có quyền khiếu nại với cơ quan giám sát bảo vệ dữ liệu về việc xử lý dữ liệu cá nhân của bạn bởi chúng tôi. Ở Đức, bạn có thể liên hệ với cơ quan bảo vệ dữ liệu của bang có thẩm quyền tại nơi bạn cư trú.",
        },
        ssl: {
          title: "6. Mã hóa SSL/TLS",
          text: "Trang web này sử dụng mã hóa SSL/TLS vì lý do bảo mật và để bảo vệ việc truyền tải nội dung bảo mật. Bạn có thể nhận biết kết nối được mã hóa khi thanh địa chỉ của trình duyệt chuyển từ 'http://' sang 'https://' và có biểu tượng ổ khóa trên thanh địa chỉ. Khi mã hóa SSL/TLS được kích hoạt, dữ liệu bạn gửi cho chúng tôi không thể bị đọc bởi bên thứ ba.",
        },
      },
    },
  },
} as const;

// Export multilingual content
export const siteContent: Record<Language, SiteContent> = {
  de: deContent,
  vn: vnContent,
};
