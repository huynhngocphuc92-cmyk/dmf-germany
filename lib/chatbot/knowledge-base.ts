// ============================================
// DMF GERMANY - CHATBOT KNOWLEDGE BASE
// ============================================

export const DMF_KNOWLEDGE_BASE = {
  // Company Overview
  company: {
    name: "DMF Germany",
    fullName: "Deutsch-Management-Fachkräfte Germany",
    tagline: "Ihre Akademie für qualifizierte Talente aus Vietnam",
    description: `DMF Germany ist eine spezialisierte Akademie für die Vermittlung und Ausbildung von
vietnamesischen Talenten für den deutschen Arbeitsmarkt. Wir bieten drei Hauptprogramme:
Ausbildung (Duale Berufsausbildung), Studium (Universitätsprogramm) und Fachkräfte-Vermittlung (§18a/b).`,
    founded: "2020",
    location: "Deutschland & Vietnam",
    website: "https://dmf-germany.de",
    contact: {
      email: "contact@dmf-germany.de",
      phone: "+49 XXX XXXXXXX",
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
  const kb = DMF_KNOWLEDGE_BASE;

  return `
# DMF GERMANY - WISSENSBASIS

## Über uns
${kb.company.name} - ${kb.company.tagline}
${kb.company.description}

## Unsere Programme

### 1. ${kb.programs.ausbildung.name}
${kb.programs.ausbildung.description}
Zielgruppe: ${kb.programs.ausbildung.targetGroup}
Dauer: ${kb.programs.ausbildung.duration}
Highlights: ${kb.programs.ausbildung.highlights.join(", ")}
Branchen: ${kb.programs.ausbildung.sectors.join(", ")}

### 2. ${kb.programs.studium.name}
${kb.programs.studium.description}
Zielgruppe: ${kb.programs.studium.targetGroup}
Highlights: ${kb.programs.studium.highlights.join(", ")}

### 3. ${kb.programs.skilled_workers.name}
${kb.programs.skilled_workers.description}
Zielgruppe: ${kb.programs.skilled_workers.targetGroup}
Dauer: ${kb.programs.skilled_workers.duration}
Highlights: ${kb.programs.skilled_workers.highlights.join(", ")}
Branchen: ${kb.programs.skilled_workers.sectors.join(", ")}

## Service-Module (P1.1 - P3.7)

### Phase 1: Vorbereitung
${kb.serviceModules.phase1_preparation.services.map((s) => `- ${s.code}: ${s.name} - ${s.desc}`).join("\n")}

### Phase 2: Administration
${kb.serviceModules.phase2_administration.services.map((s) => `- ${s.code}: ${s.name} - ${s.desc}`).join("\n")}

### Phase 3: Integration
${kb.serviceModules.phase3_integration.services.map((s) => `- ${s.code}: ${s.name} - ${s.desc}`).join("\n")}

## Timeline
Ausbildung: ${kb.timeline.ausbildung.total}
Fachkräfte: ${kb.timeline.skilled_workers.total}

## Rechtliche Grundlagen
${kb.legal.visaTypes.map((v) => `- ${v.name}: ${v.purpose}`).join("\n")}

## Häufige Fragen
${kb.faq.map((f) => `F: ${f.q}\nA: ${f.a}`).join("\n\n")}

## Statistiken
- Vermittelte Kandidaten: ${kb.statistics.placedCandidates}
- Visa-Erfolgsquote: ${kb.statistics.visaSuccessRate}
- Verbleibquote: ${kb.statistics.retentionRate}
- Abbruchquote: ${kb.statistics.dropoutRate}
`.trim();
}
