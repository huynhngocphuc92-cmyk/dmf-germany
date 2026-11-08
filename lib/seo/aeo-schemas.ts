import { SITE_NAME, SITE_URL, siteUrl } from "@/lib/site";

export interface AeoFaqItem {
  question: string;
  answer: string;
}

export interface AeoTableRow {
  cells: string[];
}

export interface AeoPageConfig {
  path: string;
  serviceName: string;
  serviceType: string;
  legalBasis: string;
  directAnswerTitle: string;
  directAnswerText: string;
  keyFacts: Array<{ label: string; value: string }>;
  tableCaption: string;
  tableHeaders: string[];
  tableRows: AeoTableRow[];
  faqs: AeoFaqItem[];
}

export const SPEAKABLE_SPECIFICATION = {
  "@type": "SpeakableSpecification",
  cssSelector: [".aeo-direct-answer", "article h1", "article p:first-of-type", "h1", "h2"],
} as const;

export const SERVICE_AEO_CONFIGS: Record<"skilled-workers" | "azubi" | "seasonal", AeoPageConfig> =
  {
    "skilled-workers": {
      path: "/services/skilled-workers",
      serviceName: "Fachkräfte aus Vietnam rekrutieren (§ 18a / § 18b AufenthG)",
      serviceType: "Internationale Fachkräftevermittlung & Berufsanerkennung",
      legalBasis: "§ 18a, § 18b, § 18g, § 16d, § 81a AufenthG & BQFG",
      directAnswerTitle:
        "Wie funktioniert die Rekrutierung vietnamesischer Fachkräfte über DMF Talents?",
      directAnswerText:
        "DMF Talents vermittelt qualifizierte Fachkräfte aus Vietnam nach § 18a, § 18b und § 16d AufenthG in durchschnittlich 3 bis 6 Monaten. Das Komplettpaket umfasst Kompetenzprüfung, B1/B2-Fachsprachtraining (Goethe/telc), Gleichwertigkeitsprüfung (IHK FOSA, HWK, Landesamt für Pflege), das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) sowie 90 Tage Onboarding-Begleitung.",
      keyFacts: [
        { label: "Rechtsgrundlage", value: "§ 18a / § 18b / § 16d AufenthG" },
        { label: "Durchlaufzeit (§ 81a)", value: "3–6 Monate bis Einreise" },
        { label: "Sprachniveau", value: "Zertifiziert B1 / B2 (GER)" },
        { label: "Bleibequote", value: "> 90 % langfristige Bindung" },
      ],
      tableCaption: "Vergleich der Einwanderungswege für vietnamesische Fachkräfte (FEG 2026)",
      tableHeaders: [
        "Aufenthaltstitel",
        "Zielgruppe & Abschluss",
        "Anerkennung / Voraussetzung",
        "Durchlaufzeit (§ 81a)",
      ],
      tableRows: [
        {
          cells: [
            "§ 18a AufenthG (Ausbildungsfachkraft)",
            "Gesellen, Pflegefachkräfte, Techniker, Handwerker",
            "Volle Gleichwertigkeit nach BQFG / PflBG + B1/B2",
            "3–5 Monate (mit Vorabbescheid)",
          ],
        },
        {
          cells: [
            "§ 18b / § 18g AufenthG (Akademiker / Blaue Karte EU)",
            "Ingenieure, IT-Spezialisten, Hochschulabsolventen",
            "anabin H+ / ZAB-Zeugnisbewertung + Gehaltsschwelle",
            "2–4 Monate",
          ],
        },
        {
          cells: [
            "§ 16d Abs. 3 AufenthG (Anerkennungspartnerschaft)",
            "Berufserfahrene Fachkräfte im Anerkennungsverfahren",
            "Mind. 2-jährige staatl. Ausbildung + A2/B1 + Arbeitgebervertrag",
            "3–5 Monate (sofortiger Arbeitsbeginn)",
          ],
        },
      ],
      faqs: [
        {
          question: "Wie funktioniert das Anerkennungsverfahren für vietnamesische Fachkräfte?",
          answer:
            "Wir prüfen die vietnamesischen Berufs- und Hochschulabschlüsse bereits vor Vertragsschluss auf Gleichwertigkeit nach dem Berufsqualifikationsfeststellungsgesetz (BQFG) bei IHK FOSA, Handwerkskammer (HWK) oder den Landesämtern für Pflege. Liegt ein Defizitbescheid vor, organisieren wir die betriebliche Anpassungsqualifizierung oder Anerkennungspartnerschaft nach § 16d AufenthG.",
        },
        {
          question: "Wie schnell können vietnamesische Fachkräfte in Deutschland starten?",
          answer:
            "Dank des beschleunigten Fachkräfteverfahrens nach § 81a AufenthG beträgt die Zeit von der Vertragsunterzeichnung bis zur Einreise durchschnittlich 3 bis 6 Monate. Da DMF Talents über einen vorqualifizierten Bewerberpool mit laufendem B1/B2-Sprachtraining verfügt, verkürzt sich die Vorlaufzeit erheblich.",
        },
        {
          question: "Was ist der Unterschied zwischen § 18a AufenthG und § 16d Abs. 3 AufenthG?",
          answer:
            "Bei § 18a AufenthG muss der volle Gleichwertigkeitsbescheid bereits vor der Visumerteilung vorliegen. Bei der Anerkennungspartnerschaft nach § 16d Abs. 3 AufenthG kann die Fachkraft bereits vor Abschluss des Anerkennungsverfahrens nach Deutschland einreisen und sofort sozialversicherungspflichtig im Betrieb arbeiten, während die Nachqualifizierung parallel erfolgt.",
        },
        {
          question: "Welche Branchen und Berufe vermittelt DMF Talents im Fachkräfteprogramm?",
          answer:
            "Wir vermitteln schwerpunktmäßig Pflegefachkräfte, Elektroniker, Anlagenmechaniker SHK, CNC-Zerspanungsmechaniker, Schweißer (DIN EN ISO 9606-1), KFZ-Mechatroniker, Köche, Hotelfachkräfte, Berufskraftfahrer/Logistiker sowie Ingenieure und IT-Spezialisten.",
        },
        {
          question: "Wie stellt DMF Talents sicher, dass die Fachkräfte langfristig bleiben?",
          answer:
            "Unsere Kandidaten suchen eine dauerhafte berufliche Perspektive in Deutschland. Durch sorgfältiges fachliches Matching, interkulturelles Vorbereitungstraining in Vietnam, Unterstützung bei der Wohnungssuche und unser 90-Tage-Onboarding mit deutsch-vietnamesischen Ansprechpartnern erreichen wir eine Bleibequote von über 90 Prozent.",
        },
        {
          question:
            "Wie sind die Vermittlungsgebühren für Arbeitgeber bei DMF Talents strukturiert?",
          answer:
            "DMF Talents arbeitet nach dem gesetzlichen Employer-Pays-Prinzip mit erfolgsbasierten B2B-Leistungsmeilensteinen (Vertragsschluss, Vorabzustimmung nach § 81a AufenthG, Einreise). Es gibt keine versteckten laufenden Gebühren wie bei der Zeitarbeit; die Investition amortisiert sich typischerweise nach 3 bis 5 Monaten.",
        },
      ],
    },
    azubi: {
      path: "/services/azubi",
      serviceName: "Auszubildende (Azubis) aus Vietnam gewinnen (§ 16a AufenthG)",
      serviceType: "Rekrutierung & Vorbereitung internationaler Auszubildender",
      legalBasis: "§ 16a AufenthG, BBiG, PflBG, § 296a SGB III, § 75 SGB III (AsA flex)",
      directAnswerTitle: "Wie gewinnen deutsche Ausbildungsbetriebe Azubis aus Vietnam?",
      directAnswerText:
        "Über das Azubi-Programm von DMF Talents rekrutieren deutsche Betriebe motivierte Auszubildende aus Vietnam nach § 16a AufenthG für Pflege, Handwerk, Gastronomie und Industrie. Die Kandidaten absolvieren ein 9- bis 12-monatiges B1/B2-Vollzeitsprachtraining (Goethe/telc) inklusive Fachsprache. DMF Talents übernimmt IHK/HWK-Eintragung, ZAV-Zustimmung, § 81a-Visumverfahren und das 90-Tage-Onboarding (§ 296a SGB III konform).",
      keyFacts: [
        { label: "Rechtsgrundlage", value: "§ 16a AufenthG & § 296a SGB III" },
        { label: "Sprachniveau", value: "B1 / B2 (Goethe / telc / ÖSD)" },
        { label: "Ausbildungsstart", value: "August / September & März / April" },
        { label: "Übernahmequote", value: "> 90 % nach Ausbildungsabschluss" },
      ],
      tableCaption: "Kennzahlen & Voraussetzungen für Auszubildende aus Vietnam (§ 16a AufenthG)",
      tableHeaders: [
        "Kriterium",
        "Gesetzliche Vorgabe (2026)",
        "Standard bei DMF Talents",
        "Vorteil für Ausbildungsbetriebe",
      ],
      tableRows: [
        {
          cells: [
            "Sprachqualifikation",
            "Mind. B1 (Regelausbildung) / B2 (Pflege)",
            "Vollzeit-Akademie bis B1/B2 + Fachsprache",
            "Sofortige Verständigung in Betrieb & Berufsschule",
          ],
        },
        {
          cells: [
            "Lebensunterhaltssicherung",
            "Ca. 990 € brutto/Monat Richtwert",
            "Prüfung Tarifvergütung + Wohnraumkonzept",
            "100 % rechtssichere Visumerteilung ohne Sperrkonto-Hürde",
          ],
        },
        {
          cells: [
            "Ethik & Compliance",
            "§ 296a SGB III (Gebührenverbot für Azubis)",
            "Strikter Employer-Pays-Standard ohne Kautionen",
            "Volle Rechtssicherheit & schuldenfreie, motivierte Azubis",
          ],
        },
      ],
      faqs: [
        {
          question: "Wie stellen Sie das Sprachniveau B1/B2 der Azubis vor der Einreise sicher?",
          answer:
            "Alle Azubi-Kandidaten durchlaufen in unserer Akademie in Vietnam ein intensives 9- bis 12-monatiges Vollzeit-Sprachprogramm bis zum Niveau B1 bzw. B2 (für Pflege und kaufmännische Berufe), abgeschlossen mit offiziellen Prüfungen von Goethe-Institut, telc oder ÖSD. Zusätzlich unterrichten wir branchenspezifische Fachbegriffe und Berufsschul-Methodik.",
        },
        {
          question: "Wie hoch ist die Bleibeperspektive vietnamesischer Auszubildender?",
          answer:
            "Vietnamesische Auszubildende zeichnen sich durch hohe Lernbereitschaft und Betriebstreue aus. Über 90 Prozent unserer vermittelten Azubis schließen ihre Ausbildung erfolgreich ab und bleiben ihrem Ausbildungsbetrieb langfristig als Gesellen oder Fachkräfte erhalten.",
        },
        {
          question: "Was besagt § 296a SGB III bei der Vermittlung von Auszubildenden?",
          answer:
            "Nach § 296a SGB III dürfen von Auszubildenden keine Vermittlungsgebühren für die Anbahnung eines Ausbildungsverhältnisses verlangt werden. DMF Talents arbeitet zu 100 Prozent nach dem Employer-Pays-Prinzip ohne Knebelverträge oder Kautionen zulasten der Bewerber und schützt deutsche Betriebe so vor rechtlichen und reputativen Risiken.",
        },
        {
          question: "Unterstützt DMF Talents bei IHK/HWK-Eintragung, Visum und Wohnungssuche?",
          answer:
            "Ja. Wir begleiten den gesamten behördlichen Prozess von der Eintragung in das Verzeichnis der Berufsausbildungsverhältnisse bei IHK oder HWK über die Vorabzustimmung der Bundesagentur für Arbeit (ZAV) und das § 81a-Verfahren bis hin zur Organisation von Azubi-Wohnraum und der Anmeldung zu Förderprogrammen wie AsA flex (§ 75 SGB III).",
        },
        {
          question:
            "Wann sollte ein Betrieb mit der Rekrutierung für das neue Ausbildungsjahr beginnen?",
          answer:
            "Für den klassischen Ausbildungsbeginn im August oder September empfehlen wir den Projektstart zwischen Oktober und März. Für Pflegefachschulen mit April-Kursen ist ein Einstieg ganzjährig möglich. Bei vorqualifizierten B1/B2-Bewerbern aus unserem Pool genügen oft 3 bis 5 Monate Vorlauf.",
        },
        {
          question: "Welche Kosten entstehen für den Ausbildungsbetrieb?",
          answer:
            "Wir arbeiten mit einer transparenten, erfolgsabhängigen B2B-Pauschale in drei Projektmeilensteinen (Ausbildungsvertrag, Visumerteilung, Einreise). Im Vergleich zu unbesetzten Ausbildungsplätzen oder kostspieligen Fehlbesetzungen amortisiert sich die Investition bereits im ersten Ausbildungsjahr.",
        },
      ],
    },
    seasonal: {
      path: "/services/seasonal",
      serviceName: "Saisonkräfte & Kurzzeitbeschäftigung aus Vietnam (§ 19c AufenthG)",
      serviceType: "ZAV-konforme Vermittlung von Saisonpersonal & Erntehelfern",
      legalBasis: "§ 19c AufenthG i.V.m. § 15a BeschV (Bundesagentur für Arbeit / ZAV)",
      directAnswerTitle:
        "Wie funktioniert der rechtssichere Einsatz von Saisonkräften über DMF Talents?",
      directAnswerText:
        "DMF Talents vermittelt körperlich belastbare und zuverlässige Saisonkräfte sowie Kurzzeitbeschäftigte aus Vietnam für Landwirtschaft, Gastronomie, Hotellerie und Logistik. Die Vermittlung erfolgt 100 % ZAV-konform im Rahmen der gesetzlichen Regelungen (§ 19c AufenthG / BeschV) inklusive Behördenabwicklung, Gruppenanreise und deutsch-vietnamesischer Teamkoordination in 4 bis 8 Wochen Vorlaufzeit.",
      keyFacts: [
        { label: "Rechtsrahmen", value: "§ 19c AufenthG / BeschV (ZAV-konform)" },
        { label: "Vorlaufzeit", value: "4–8 Wochen bis Einsatzbeginn" },
        { label: "Einsatzdauer", value: "Saisonal (bis zu 90 Tage / 6–8 Monate)" },
        { label: "Ausfallquote", value: "< 2 % Fehlzeiten im Saisoneinsatz" },
      ],
      tableCaption: "Einsatzbereiche & Rahmenbedingungen für Saisonkräfte",
      tableHeaders: [
        "Branche / Einsatzfeld",
        "Typische Tätigkeiten",
        "Vorlaufzeit",
        "Besonderheit bei DMF Talents",
      ],
      tableRows: [
        {
          cells: [
            "Landwirtschaft & Gartenbau",
            "Erntehelfer (Spargel, Erdbeeren, Obst, Weinbau), Gewächshaus, Sortierung",
            "4–6 Wochen",
            "Hitzeerfahrenes, körperlich fittes Team + Stammkräfte-Aufbau",
          ],
        },
        {
          cells: [
            "Hotellerie & Gastronomie",
            "Housekeeping, Küchenhilfe, Spülküche, Bankett- & Saisonservice",
            "6–8 Wochen",
            "Hygieneschulung + Grundwortschatz Deutsch/Englisch",
          ],
        },
        {
          cells: [
            "Logistik & Lebensmittelverarbeitung",
            "Kommissionierung, Verpackung, Versandspitzen (Q4 / Saison)",
            "6–8 Wochen",
            "2-sprachige Teamleiter (Vorarbeiter) zur schnellen Einarbeitung",
          ],
        },
      ],
      faqs: [
        {
          question: "Ist der Einsatz von Saisonkräften über DMF Talents zu 100 % rechtssicher?",
          answer:
            "Ja. Wir vermitteln ausschließlich im Rahmen der geltenden gesetzlichen Bestimmungen der Beschäftigungsverordnung (BeschV) sowie § 19c AufenthG und übernehmen die vollständige Antragsabwicklung mit der Bundesagentur für Arbeit (ZAV). Alle Vorgaben zu Mindestlohn, Arbeitszeitgesetz und Unterkunftsstandards werden strikt eingehalten.",
        },
        {
          question: "Wie lange beträgt die Vorlaufzeit bis zum Arbeitsbeginn der Saisonkräfte?",
          answer:
            "Bei vorliegenden Kontingenten und vollständigen Betriebsunterlagen sind unsere vorselektierten Teams in durchschnittlich 4 bis 8 Wochen einsatzbereit. Wir koordinieren die ZAV-Zustimmung, Visumerteilung sowie den gesammelten Gruppentransfer direkt zu Ihrem Betrieb.",
        },
        {
          question: "Können bewährte Saisonkräfte in der nächsten Saison wiederkommen?",
          answer:
            "Ja, der Aufbau eines festen Stammpools ist ausdrücklich vorgesehen. Über 85 Prozent unserer Partnerbetriebe fordern dieselben eingearbeiteten Teams im Folgejahr erneut an, wodurch die Einarbeitungszeit ab der zweiten Saison nahezu entfällt.",
        },
        {
          question: "Wie erfolgt die Verständigung vor Ort auf dem Feld oder im Hotel?",
          answer:
            "Unsere Saisonkräfte erhalten vorab ein Grundlagentraining für arbeitsplatzrelevante Begriffe und Arbeitssicherheit. Bei Gruppenbuchungen stellen wir zudem zweisprachige Teamkoordinatoren (Vorarbeiter mit guten Deutsch- oder Englischkenntnissen) zusammen, die als direkte Schnittstelle zu Ihrer Betriebsleitung fungieren.",
        },
        {
          question:
            "Kann aus einem erfolgreichen Saisoneinsatz eine langfristige Ausbildung oder Fachkräftebeschäftigung entstehen?",
          answer:
            "Viele Arbeitgeber nutzen den Saisoneinsatz, um besonders engagierte Talente kennenzulernen. Nach regulärer Rückkehr und entsprechendem Spracherwerb (B1/B2) begleiten wir regelmäßig den rechtssicheren Wechsel in eine dreijährige duale Berufsausbildung (§ 16a AufenthG) oder Fachkräftebeschäftigung (§ 18a AufenthG).",
        },
      ],
    },
  };

export const ROI_RECHNER_AEO_CONFIG: AeoPageConfig = {
  path: "/roi-rechner",
  serviceName: "B2B ROI-Rechner: Fachkräfte aus Vietnam vs. Zeitarbeit & Vakanzkosten",
  serviceType: "Wirtschaftlichkeitsberechnung für internationale Personalgewinnung",
  legalBasis: "B2B Personalkostenvergleich (Direktvermittlung vs. AÜG-Zeitarbeit)",
  directAnswerTitle:
    "Was kostet die Rekrutierung vietnamesischer Fachkräfte im Vergleich zu Zeitarbeit?",
  directAnswerText:
    "Die Direktrekrutierung einer Fachkraft über DMF Talents amortisiert sich gegenüber Zeitarbeit (Leiharbeit) oder unbesetzten Stellen (Cost of Vacancy) in durchschnittlich 3 bis 5 Monaten. Während Zeitarbeit laufende Aufschläge von 80 bis 120 % auf den Stundenlohn verursacht, fällt bei DMF Talents nur eine einmalige, meilensteinbasierte Vermittlungsgebühr an – bei über 90 % langfristiger Bleibequote.",
  keyFacts: [
    { label: "Break-Even (Amortisation)", value: "Ø 3–5 Monate nach Einsatzstart" },
    {
      label: "Ersparnis vs. Zeitarbeit (36 Mon.)",
      value: "35.000 € – 65.000 € pro Vollzeitstelle",
    },
    { label: "Gebührenmodell", value: "Einmalig nach Projektmeilensteinen" },
    { label: "Laufende Lizenz-/AÜG-Kosten", value: "0 € (Direktanstellung im Betrieb)" },
  ],
  tableCaption:
    "B2B-Kostenvergleich über 36 Monate: Direktvermittlung (DMF Talents) vs. Zeitarbeit",
  tableHeaders: [
    "Kostenfaktor / Kennzahl",
    "Direktrekrutierung (DMF Talents)",
    "Zeitarbeit / Leiharbeit (AÜG)",
    "Unbesetzte Stelle (Cost of Vacancy)",
  ],
  tableRows: [
    {
      cells: [
        "Einmalige Vermittlungs- & Visakosten",
        "Transparente Pauschale in 3 Meilensteinen",
        "0 € Einstieg, aber bis zu 3 Monatsgehälter Ablöse",
        "Fortlaufende Inserats- & Überstundenkosten",
      ],
    },
    {
      cells: [
        "Monatlicher Aufschlag auf Bruttolohn",
        "0 % (regulärer Tarif-/Betriebslohn)",
        "+80 % bis +120 % Verrechnungssatz",
        "Entgangener Deckungsbeitrag: 3.500–7.500 €/Monat",
      ],
    },
    {
      cells: [
        "Amortisation (Break-Even)",
        "Nach 3 bis 5 Monaten im Betrieb",
        "Keine Amortisation (dauerhaft hohe Monatskosten)",
        "Negativer ROI durch Auftragsverlust",
      ],
    },
    {
      cells: [
        "Mitarbeiterbindung & Fluktuation",
        "> 90 % Bleibequote über mehrere Jahre",
        "Hohe Wechselquote & Einarbeitungsverluste",
        "Überlastung des bestehenden Stammpersonals",
      ],
    },
  ],
  faqs: [
    {
      question: "Ab wann rechnet sich die Rekrutierung einer Fachkraft aus Vietnam (ROI)?",
      answer:
        "Im Vergleich zu einer unbesetzten Stelle (Cost of Vacancy von durchschnittlich 150 bis 300 Euro pro Ausfalltag) oder dem Einsatz von Leiharbeitskräften erreicht die Direktrekrutierung über DMF Talents den Break-Even-Point in der Regel bereits nach 3 bis 5 Monaten nach Arbeitsantritt.",
    },
    {
      question: "Was ist in der Vermittlungsgebühr von DMF Talents enthalten?",
      answer:
        "Die B2B-Pauschale umfasst die Rekrutierung und Fachprüfung in Vietnam, das zertifizierte Sprachprogramm bis B1/B2, die Dokumentenübersetzung und Beglaubigung, die Begleitung des Anerkennungsverfahrens (BQFG), das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) sowie unser 90-Tage-Onboarding nach Einreise.",
    },
    {
      question: "Wie werden die Zahlungsmeilensteine für Arbeitgeber aufgeteilt?",
      answer:
        "Unsere Vergütung ist an klare Erfolgsmeilensteine gekoppelt: Die erste Teilzahlung erfolgt nach Auswahl und Unterzeichnung des Arbeits- oder Ausbildungsvertrags, die zweite nach behördlicher Vorabzustimmung (§ 81a AufenthG / ZAV) und die Abschlussrate erst mit der erfolgreichen Einreise bzw. Visumerteilung.",
    },
    {
      question: "Welche staatlichen Gebühren fallen zusätzlich bei deutschen Behörden an?",
      answer:
        "Neben der Dienstleistungsgebühr fallen reguläre amtliche Gebühren an: 411 Euro für das beschleunigte Fachkräfteverfahren nach § 81a AufenthG bei der Ausländerbehörde, ca. 100 bis 600 Euro für die Gleichwertigkeitsprüfung bei IHK FOSA oder HWK sowie 75 Euro Visumgebühr bei der deutschen Auslandsvertretung.",
    },
    {
      question: "Gibt es eine Nachbesetzungs- oder Ersatzregelung?",
      answer:
        "Ja. Sollte ein Kandidat wider Erwarten das Visum nicht erhalten oder das Arbeitsverhältnis innerhalb der vertraglich vereinbarten Garantiefrist nicht antreten bzw. vorzeitig beenden, greift unsere im B2B-Vertrag verankerte Ersatzkandidaten-Regelung ohne erneute Vermittlungspauschale.",
    },
  ],
};

export const ZEITPLAN_AEO_CONFIG: AeoPageConfig = {
  path: "/fuer-arbeitgeber/zeitplan",
  serviceName: "Zeitplan-Simulator: Dauer des beschleunigten Fachkräfteverfahrens (§ 81a AufenthG)",
  serviceType: "Prozess- und Fristenplanung für internationale Rekrutierung",
  legalBasis: "§ 81a AufenthG (Beschleunigtes Fachkräfteverfahren), § 36 BeschV, BQFG",
  directAnswerTitle:
    "Wie lange dauert das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) bis zur Einreise?",
  directAnswerText:
    "Im beschleunigten Fachkräfteverfahren nach § 81a AufenthG dauert der Gesamtprozess von der Vertragsunterzeichnung bis zur Einreise nach Deutschland durchschnittlich 12 bis 20 Wochen (3 bis 5 Monate), sofern das Sprachzertifikat B1/B2 vorliegt. Das Gesetz schreibt verbindliche Behördenfristen vor: maximal 2 Monate für die Berufsanerkennung, 1 Woche für die ZAV-Zustimmung und 3 Wochen bis zum Visumtermin.",
  keyFacts: [
    { label: "Gesamtdauer (§ 81a)", value: "12–20 Wochen (bei B1/B2-Pool)" },
    { label: "Frist Anerkennungsstelle", value: "Max. 2 Monate gesetzlich (§ 81a)" },
    { label: "Frist Bundesagentur (ZAV)", value: "Max. 1 Woche (Zustimmungsfiktion)" },
    { label: "Frist Botschaft (Visum)", value: "Max. 3 Wochen Termin + 3 Wochen Erteilung" },
  ],
  tableCaption: "Gesetzliche Fristen im beschleunigten Fachkräfteverfahren nach § 81a AufenthG",
  tableHeaders: [
    "Prozessphase",
    "Zuständige Behörde / Stelle",
    "Gesetzliche Frist (§ 81a AufenthG)",
    "Dauer im Normalverfahren (ohne § 81a)",
  ],
  tableRows: [
    {
      cells: [
        "1. Unterlagenprüfung & § 81a-Vereinbarung",
        "Zuständige Ausländerbehörde / ZFE",
        "1–3 Wochen Vorbereitung durch DMF Talents",
        "Keine zentrale Verfahrenskoordination",
      ],
    },
    {
      cells: [
        "2. Gleichwertigkeitsprüfung (BQFG / PflBG)",
        "IHK FOSA / HWK / Landesamt für Pflege",
        "Maximal 2 Monate ab Vollständigkeit",
        "3 bis 6 Monate Bearbeitungszeit",
      ],
    },
    {
      cells: [
        "3. Arbeitsmarktzulassung (§ 39 AufenthG)",
        "Bundesagentur für Arbeit (ZAV)",
        "Maximal 1 Woche (danach Zustimmungsfiktion)",
        "2 bis 6 Wochen",
      ],
    },
    {
      cells: [
        "4. Vorabzustimmung & Visumtermin",
        "Deutsche Botschaft Hanoi / GK Ho-Chi-Minh-Stadt",
        "Termin in 3 Wochen + Entscheidung in 3 Wochen",
        "3 bis 9 Monate Wartezeit auf Regeltermin",
      ],
    },
  ],
  faqs: [
    {
      question:
        "Wie lange dauert das beschleunigte Fachkräfteverfahren nach § 81a AufenthG insgesamt?",
      answer:
        "Liegen alle Qualifikationsnachweise und das Sprachzertifikat (B1/B2) vor, beträgt die Durchlaufzeit im beschleunigten Verfahren nach § 81a AufenthG von der Beauftragung der Ausländerbehörde bis zur Einreise durchschnittlich 3 bis 5 Monate (12 bis 20 Wochen). Im regulären Botschaftsverfahren dauert derselbe Prozess oft 8 bis 12 Monate.",
    },
    {
      question: "Welche gesetzlichen Fristen gelten für Behörden im § 81a-Verfahren?",
      answer:
        "Nach § 81a Abs. 3 AufenthG ist die Anerkennungsstelle (z. B. IHK FOSA oder HWK) verpflichtet, innerhalb von 2 Monaten über die Gleichwertigkeit zu entscheiden. Die Bundesagentur für Arbeit (ZAV) muss innerhalb von 1 Woche zustimmen (sonst gilt die Zustimmung automatisch als erteilt). Die deutsche Botschaft vergibt den Visumtermin innerhalb von 3 Wochen nach Vorlage der Vorabzustimmung.",
    },
    {
      question: "Was kostet das beschleunigte Fachkräfteverfahren nach § 81a AufenthG?",
      answer:
        "Die gesetzliche Verwaltungsgebühr der Ausländerbehörde für die Durchführung des beschleunigten Fachkräfteverfahrens beträgt bundesweit einheitlich 411 Euro (§ 47 Abs. 1 Nr. 15 AufenthV). Hinzu kommen die Gebühren der Anerkennungsstelle und 75 Euro Visumgebühr.",
    },
    {
      question: "Gilt das beschleunigte Fachkräfteverfahren (§ 81a) auch für Auszubildende?",
      answer:
        "Ja. § 81a Abs. 1 AufenthG gilt ausdrücklich auch für die Einreise zur betrieblichen Berufsausbildung nach § 16a AufenthG. Da bei Auszubildenden keine Berufsanerkennung (BQFG) erforderlich ist, entfällt die 2-monatige Prüfungsphase, sodass die Vorabzustimmung oft bereits nach 3 bis 6 Wochen vorliegt.",
    },
    {
      question: "Wer beantragt das Verfahren nach § 81a AufenthG?",
      answer:
        "Antragsberechtigt ist der Arbeitgeber in Deutschland in Vollmacht der ausländischen Fachkraft bzw. des Auszubildenden. Der Arbeitgeber kann DMF Talents per Untervollmacht mit der kompletten Dokumentenaufbereitung und Kommunikation mit der Zentralen Fachkräfteeinwanderungsstelle beauftragen.",
    },
  ],
};

export function buildFaqSchema(items: AeoFaqItem[], pagePath?: string) {
  const idUrl = pagePath ? `${siteUrl(pagePath)}#faq` : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(idUrl ? { "@id": idUrl } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServicePageSchemas(key: "skilled-workers" | "azubi" | "seasonal") {
  const config = SERVICE_AEO_CONFIGS[key];
  const url = siteUrl(config.path);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: config.serviceName,
      serviceType: config.serviceType,
      description: config.directAnswerText,
      url,
      provider: {
        "@type": "EmploymentAgency",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "Deutschland",
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Arbeitgeber, Personalentscheider und Ausbildungsbetriebe in Deutschland",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: config.serviceName,
      description: config.directAnswerText,
      inLanguage: "de-DE",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${url}#service` },
      speakable: SPEAKABLE_SPECIFICATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: siteUrl("/") },
        { "@type": "ListItem", position: 2, name: config.serviceName, item: url },
      ],
    },
  ];
}

export function buildRoiAppSchemas(pagePath: "/roi-rechner" | "/fuer-arbeitgeber/roi-rechner") {
  const url = siteUrl(pagePath);
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: ROI_RECHNER_AEO_CONFIG.serviceName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      url,
      description: ROI_RECHNER_AEO_CONFIG.directAnswerText,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      provider: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: ROI_RECHNER_AEO_CONFIG.serviceName,
      description: ROI_RECHNER_AEO_CONFIG.directAnswerText,
      inLanguage: "de-DE",
      speakable: SPEAKABLE_SPECIFICATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: siteUrl("/") },
        { "@type": "ListItem", position: 2, name: "ROI-Rechner", item: url },
      ],
    },
  ];
}

export function buildTimelinePageSchemas() {
  const url = siteUrl(ZEITPLAN_AEO_CONFIG.path);
  return [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: "Ablauf des beschleunigten Fachkräfteverfahrens (§ 81a AufenthG) mit DMF Talents",
      description: ZEITPLAN_AEO_CONFIG.directAnswerText,
      totalTime: "P120D",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "EUR",
        value: "411",
      },
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Bedarfsanalyse, Kandidatenauswahl & Vertragsschluss",
          text: "Auswahl vorqualifizierter Fachkräfte oder Azubis aus Vietnam per Video-Interview sowie Unterzeichnung des Arbeits- oder Ausbildungsvertrags und der § 81a-Vollmacht.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Einleitung § 81a AufenthG bei der Ausländerbehörde",
          text: "Abschluss der Vereinbarung mit der zuständigen Ausländerbehörde bzw. Zentralen Fachkräfteeinwanderungsstelle (ZFE) in Deutschland.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Gleichwertigkeitsprüfung (max. 2 Monate Frist)",
          text: "Prüfung der Berufsqualifikation durch IHK FOSA, Handwerkskammer oder Landesamt für Pflege innerhalb der gesetzlichen Höchstfrist von zwei Monaten.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Zustimmung der Bundesagentur für Arbeit (max. 1 Woche Frist)",
          text: "Prüfung der Beschäftigungsbedingungen nach § 39 AufenthG durch die ZAV mit einwöchiger Zustimmungsfiktion.",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Vorabzustimmung, Visumerteilung (max. 3+3 Wochen) & Einreise",
          text: "Ausstellung der Vorabzustimmung, bevorzugte Terminvergabe an der Deutschen Botschaft in Vietnam innerhalb von 3 Wochen, Visumerteilung und begleitete Einreise nach Deutschland.",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: ZEITPLAN_AEO_CONFIG.serviceName,
      description: ZEITPLAN_AEO_CONFIG.directAnswerText,
      inLanguage: "de-DE",
      speakable: SPEAKABLE_SPECIFICATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: siteUrl("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: "Zeitplan-Simulator (§ 81a AufenthG)",
          item: url,
        },
      ],
    },
  ];
}
