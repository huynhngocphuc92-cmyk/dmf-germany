// DMF Vietnam - Site Content Configuration
// Alle Textinhalte der Website werden hier gespeichert
// Basiert auf dem offiziellen DMF Vietnam Handbuch

export const siteContent = {
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
    
    // Hauptsitz Vietnam
    headquarters: {
      title: "Hauptsitz in Vietnam",
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
      nameLabel: "Name",
      emailLabel: "E-Mail",
      companyLabel: "Unternehmen",
      messageLabel: "Nachricht",
      submitLabel: "Nachricht senden",
      namePlaceholder: "Ihr Name",
      emailPlaceholder: "ihre.email@unternehmen.de",
      companyPlaceholder: "Ihr Unternehmen",
      messagePlaceholder: "Wie können wir Ihnen helfen?",
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
    links: {
      legal: "Impressum",
      privacy: "Datenschutz",
      terms: "AGB",
    },
    copyright: "© 2024 DMF Vietnam. Alle Rechte vorbehalten.",
    closing: "Herzlichst, Ihr DMF Vietnam Team",
  },
} as const;
