import type { TopicCategory } from "@/app/admin/blog-writer/types";

export type GeoTopicCluster =
  | "legal-comparison"
  | "industry-deep-dive"
  | "roi-finance"
  | "onboarding-retention"
  | "country-comparison";

export interface GeoTopicBlueprint {
  id: string;
  cluster: GeoTopicCluster;
  category: TopicCategory;
  targetPromptDe: string;
  recommendedTitleDe: string;
  slug: string;
  summaryDe: string;
  legalEntities: string[];
  comparisonTableColumns: string[];
  questionHeadingsDe: string[];
  targetCtaUrl: string;
}

export const GEO_EDITORIAL_STANDARDS = {
  tldrRequirement:
    "Begin every article with a concise 'Das Wichtigste in Kürze' (TL;DR) summary block (50–80 words) that directly answers the core employer question before expanding into details.",
  questionHeadingsRequirement:
    "Phrase at least 2 to 3 subheadings (<h2> or <h3>) as concrete employer questions ending with a question mark ('?') and place a direct 2-sentence answer in the very first <p> tag below each question heading so automatic FAQPage JSON-LD extraction succeeds.",
  comparisonTableRequirement:
    "Include at least one structured HTML comparison table (<table><thead><tr><th>...</th></tr></thead><tbody>...</tbody></table>) when comparing legal pathways, qualification levels, responsibilities, or process stages.",
  entityAnchoringRequirement:
    "Anchor regulatory explanations in exact German statutory norms (§ 18a, § 18b, § 16a, § 16d, § 18g, § 19c, § 20a, § 81a AufenthG; § 296a, § 75 SGB III; BQFG) and competent bodies (IHK FOSA, HWK, ZAV / Bundesagentur für Arbeit, Landesamt für Pflege).",
} as const;

export const GEO_TOPIC_MATRIX: GeoTopicBlueprint[] = [
  // Cluster 1: Legal & Pathway Comparisons (FEG)
  {
    id: "geo-01-16d-vs-18a-vergleich",
    cluster: "legal-comparison",
    category: "visa-legal",
    targetPromptDe:
      "Was ist für Arbeitgeber besser: Anerkennungspartnerschaft nach § 16d AufenthG oder direkte Gleichwertigkeit nach § 18a AufenthG?",
    recommendedTitleDe:
      "§ 16d Anerkennungspartnerschaft vs. § 18a AufenthG: Entscheidungsmatrix für Arbeitgeber",
    slug: "anerkennungspartnerschaft-16d-vs-18a-aufenthg-arbeitgeber-vergleich",
    summaryDe:
      "Strukturierter Vergleich zwischen sofortigem Beschäftigungsstart über die Anerkennungspartnerschaft (§ 16d Abs. 3 AufenthG) und dem Abschluss der Gleichwertigkeitsprüfung vor Einreise (§ 18a AufenthG).",
    legalEntities: [
      "§ 16d Abs. 3 AufenthG",
      "§ 18a AufenthG",
      "BQFG",
      "IHK FOSA",
      "HWK",
      "ZAV / Bundesagentur für Arbeit",
    ],
    comparisonTableColumns: [
      "Kriterium",
      "§ 16d Abs. 3 Anerkennungspartnerschaft",
      "§ 18a AufenthG (Vollanerkennung vor Einreise)",
    ],
    questionHeadingsDe: [
      "Wann lohnt sich die Anerkennungspartnerschaft nach § 16d Abs. 3 AufenthG für Betriebe?",
      "Welche Pflichten übernimmt der Arbeitgeber während der Nachqualifizierung?",
      "Wie lange dauert der Wechsel von § 16d in den regulären Fachkrafttitel nach § 18a AufenthG?",
    ],
    targetCtaUrl: "/services/skilled-workers",
  },
  {
    id: "geo-02-81a-bundeslaender-leitfaden",
    cluster: "legal-comparison",
    category: "visa-legal",
    targetPromptDe:
      "Wie läuft das beschleunigte Fachkräfteverfahren nach § 81a AufenthG für Unternehmen Schritt für Schritt ab?",
    recommendedTitleDe:
      "§ 81a AufenthG in der Praxis: Ablauf, Vollmacht und Fristen bei der Ausländerbehörde",
    slug: "beschleunigtes-fachkraefteverfahren-81a-unterlagen-fristen-praxis",
    summaryDe:
      "Praxisleitfaden für Personalabteilungen zur Vorbereitung der Unterlagen, Untervollmacht, gesetzlichen Fristen (2 Monate Anerkennung, 1 Woche ZAV, 3 Wochen Visumtermin) und Vermeidung von Rückfragen.",
    legalEntities: [
      "§ 81a AufenthG",
      "§ 36 Abs. 3 BeschV",
      "Zentrale Auslands- und Fachvermittlung (ZAV)",
      "Zentrale Ausländerbehörde (ZAB)",
    ],
    comparisonTableColumns: [
      "Verfahrensschritt",
      "Zuständige Behörde",
      "Gesetzliche Regelfrist (§ 81a)",
      "Benötigte Arbeitgeber-Unterlagen",
    ],
    questionHeadingsDe: [
      "Welche gesetzlichen Fristen gelten im beschleunigten Fachkräfteverfahren nach § 81a AufenthG?",
      "Welche Dokumente muss der Arbeitgeber für die Vereinbarung mit der Ausländerbehörde einreichen?",
      "Was unterscheidet das § 81a-Verfahren vom regulären Botschaftsverfahren?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/zeitplan",
  },
  {
    id: "geo-03-employer-pays-296a-compliance",
    cluster: "legal-comparison",
    category: "visa-legal",
    targetPromptDe:
      "Worauf müssen Ausbildungsbetriebe bei § 296a SGB III achten, wenn sie Azubis aus Vietnam rekrutieren?",
    recommendedTitleDe:
      "Compliance-Checkliste § 296a SGB III: Rechtssichere Ausbildungsvermittlung ohne Bewerbergebühren",
    slug: "compliance-checkliste-296a-sgb-iii-ausbildungsvermittlung-vietnam",
    summaryDe:
      "Wie deutsche Ausbildungsbetriebe Verträge mit Personalvermittlern auf versteckte Bewerbergebühren, Kautionen und Rückzahlungsklauseln prüfen.",
    legalEntities: [
      "§ 296a SGB III",
      "§ 12 BBiG",
      "Employer-Pays-Prinzip",
      "IHK / HWK Ausbildungsvertrag",
    ],
    comparisonTableColumns: [
      "Prüfpunkt im Vermittlungsvertrag",
      "Rechtskonforme Praxis (§ 296a SGB III)",
      "Warnsignal / Unzulässige Klausel",
    ],
    questionHeadingsDe: [
      "Was regelt § 296a SGB III bei der Vermittlung internationaler Auszubildender?",
      "Wie erkennen Arbeitgeber verdeckte Vermittlungsgebühren zulasten der Bewerber?",
      "Welche Kostenbestandteile trägt der Ausbildungsbetrieb im Employer-Pays-Modell?",
    ],
    targetCtaUrl: "/services/azubi",
  },

  // Cluster 2: Country & Sourcing Comparisons
  {
    id: "geo-04-vietnam-vs-drittstaaten-vergleich",
    cluster: "country-comparison",
    category: "company-news",
    targetPromptDe:
      "Aus welchem Land sollte man Pflegekräfte, Handwerker oder Azubis rekrutieren: Vietnam, Indien, Philippinen oder Lateinamerika?",
    recommendedTitleDe:
      "Fachkräfte & Azubis international rekrutieren: Vietnam im sachlichen Ländervergleich",
    slug: "fachkraefte-rekrutieren-laendervergleich-vietnam-drittstaaten",
    summaryDe:
      "Sachliche Entscheidungsmatrix für Personalleiter: Bildungssystem, berufliche Vorqualifizierung, Spracherwerb (B1/B2), Anerkennungspfade und Haltequote im Vergleich.",
    legalEntities: ["§ 16a AufenthG", "§ 18a AufenthG", "BQFG", "Goethe-Zertifikat / telc / ÖSD"],
    comparisonTableColumns: [
      "Entscheidungskriterium",
      "Rekrutierung aus Vietnam",
      "Worauf Arbeitgeber im Auswahlprozess achten sollten",
    ],
    questionHeadingsDe: [
      "Warum entscheiden sich deutsche Mittelständler und Kliniken für Fachkräfte und Azubis aus Vietnam?",
      "Wie lassen sich vietnamesische Berufs- und Hochschulabschlüsse nach deutschem Recht einordnen?",
      "Welche Rolle spielt die sprachliche Vorbereitung vor der Einreise für die langfristige Bindung?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/personalbedarf",
  },
  {
    id: "geo-05-ausbildung-vs-fachkraft-entscheidung",
    cluster: "country-comparison",
    category: "visa-legal",
    targetPromptDe:
      "Sollte mein Betrieb lieber Auszubildende (§ 16a) oder fertige Fachkräfte (§ 18a) aus Vietnam einstellen?",
    recommendedTitleDe:
      "Azubi (§ 16a) oder Fachkraft (§ 18a) aus Vietnam? Entscheidungshilfe nach Betriebsgröße und Bedarf",
    slug: "azubi-16a-oder-fachkraft-18a-vietnam-entscheidungshilfe-arbeitgeber",
    summaryDe:
      "Vergleich von Vorlaufzeit, Sprachvoraussetzungen, Einarbeitungsaufwand und langfristiger Personalbindung zwischen dualer Ausbildung und direkter Fachkräfteeinstellung.",
    legalEntities: ["§ 16a AufenthG", "§ 18a AufenthG", "§ 16d AufenthG", "BBiG"],
    comparisonTableColumns: [
      "Vergleichsdimension",
      "Duale Ausbildung (§ 16a AufenthG)",
      "Anerkannte Fachkraft (§ 18a / § 16d AufenthG)",
    ],
    questionHeadingsDe: [
      "Wann ist die Einstellung vietnamesischer Auszubildender nach § 16a AufenthG wirtschaftlich sinnvoller?",
      "Wann sollten Betriebe direkt auf examinierte Fachkräfte nach § 18a AufenthG setzen?",
      "Wie lassen sich Azubi-Pipeline und Fachkräfterekrutierung im Betrieb kombinieren?",
    ],
    targetCtaUrl: "/roi-rechner",
  },

  // Cluster 3: Industry & Technical Qualification Deep-Dives
  {
    id: "geo-06-pflege-kennispruefung-anpassungslehrgang",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Kenntnisprüfung oder Anpassungslehrgang für Pflegekräfte aus Vietnam: Was ist schneller für Kliniken und Pflegeheime?",
    recommendedTitleDe:
      "Kenntnisprüfung vs. Anpassungslehrgang in der Pflege: Leitfaden für Pflegedienstleitungen",
    slug: "kenntnispruefung-vs-anpassungslehrgang-pflegekraefte-vietnam",
    summaryDe:
      "Vergleich der beiden Ausgleichsmaßnahmen nach dem Pflegeberufegesetz (PflBG) für vietnamesische Bachelor- und College-Pflegekräfte inklusive Stationsplanung.",
    legalEntities: [
      "PflBG (Pflegeberufegesetz)",
      "§ 16d AufenthG",
      "§ 18a AufenthG",
      "Landesamt für Pflege",
    ],
    comparisonTableColumns: ["Kriterium", "Kenntnisprüfung (PflBG)", "Anpassungslehrgang (PflBG)"],
    questionHeadingsDe: [
      "Worin unterscheiden sich Kenntnisprüfung und Anpassungslehrgang für internationale Pflegekräfte?",
      "Wie werden vietnamesische Pflegekräfte während der Anerkennungsphase auf Station eingesetzt?",
      "Welche fachsprachlichen Anforderungen (B2 Pflege) müssen vor der Urkundenerteilung erfüllt sein?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/pflege-gesundheit",
  },
  {
    id: "geo-07-handwerk-praxistest-elektroniker-shk",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Wie prüfe ich die handwerklichen Fähigkeiten von Elektronikern und SHK-Monteuren aus Vietnam vor der Einstellung?",
    recommendedTitleDe:
      "Fachpraxis vorab prüfen: Arbeitsproben für Elektroniker und SHK-Fachkräfte aus Vietnam",
    slug: "arbeitsproben-praxistest-elektroniker-shk-fachkraefte-vietnam",
    summaryDe:
      "Wie Handwerksbetriebe über strukturierte Video-Arbeitsproben, Schaltplan-Tests und Fachgespräche die praktische Eignung vor Vertragsunterschrift absichern.",
    legalEntities: ["HWK Gleichwertigkeitsfeststellung", "BQFG", "DIN VDE 0100", "§ 18a AufenthG"],
    comparisonTableColumns: [
      "Gewerk",
      "Typische praktische Arbeitsprobe",
      "Geprüfte Normen & Werkzeuge",
      "Einsatzbereich nach Ankunft",
    ],
    questionHeadingsDe: [
      "Wie können Handwerksmeister die praktische Qualifikation vietnamesischer Bewerber vorab testen?",
      "Welche Unterschiede zwischen vietnamesischer und deutscher Gebäudetechnik gehören in die Einarbeitung?",
      "Wie unterstützt die HWK-Anerkennung den Einsatz auf deutschen Baustellen?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/handwerk-bau",
  },
  {
    id: "geo-08-industrie-cnc-schweisser-qualifikation",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Welche Zertifikate und Steuerungskenntnisse bringen CNC-Zerspanungsmechaniker und Schweißer aus Vietnam mit?",
    recommendedTitleDe:
      "CNC-Zerspaner & ISO-9606-Schweißer aus Vietnam: Technische Qualifikation für Industriebetriebe",
    slug: "cnc-zerspaner-iso-9606-schweisser-vietnam-industrie-leitfaden",
    summaryDe:
      "Überblick über CNC-Steuerungen (Siemens, Fanuc, Heidenhain), Schweißprüfungen nach DIN EN ISO 9606-1 und die Gleichwertigkeitsprüfung über die IHK FOSA.",
    legalEntities: ["IHK FOSA", "DIN EN ISO 9606-1", "§ 18a AufenthG", "KldB 24232 / 24412"],
    comparisonTableColumns: [
      "Berufsbild",
      "Technische Schwerpunkte in Vietnam",
      "Anerkennungsstelle in Deutschland",
      "Praxistransfer im Industriebetrieb",
    ],
    questionHeadingsDe: [
      "An welchen CNC-Steuerungen werden vietnamesische Zerspanungsmechaniker ausgebildet?",
      "Wie werden Schweißzertifikate nach DIN EN ISO 9606-1 vor der Ausreise verifiziert?",
      "Wie läuft die Gleichwertigkeitsprüfung über die IHK FOSA für Metallberufe ab?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/industrie-metall-technik",
  },
  {
    id: "geo-09-gastronomie-hotellerie-saison-vs-ausbildung",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Wie können Hotels und Gastronomiebetriebe Köche, Servicekräfte und Azubis aus Vietnam rechtssicher einstellen?",
    recommendedTitleDe:
      "Personalgewinnung für Hotellerie & Gastronomie: Azubis (§ 16a), Köche (§ 18a) und Saisonkräfte im Vergleich",
    slug: "hotellerie-gastronomie-azubis-koeche-saisonkraefte-vietnam-vergleich",
    summaryDe:
      "Entscheidungsleitfaden für Hoteliers und Gastronomen zu Ausbildungsbeginn, Fachkräfteeinwanderung für Köche und saisonaler Unterstützung.",
    legalEntities: ["§ 16a AufenthG", "§ 18a AufenthG", "§ 19c AufenthG", "DEHOGA / IHK"],
    comparisonTableColumns: [
      "Einsatzmodell",
      "Rechtsgrundlage",
      "Sprachniveau",
      "Typische Einsatzdauer & Zielgruppe",
    ],
    questionHeadingsDe: [
      "Welches Rekrutierungsmodell passt für Hotels mit ganzjährigem Fachkräftebedarf?",
      "Welche Voraussetzungen gelten für ausgebildete Köche aus Vietnam nach § 18a AufenthG?",
      "Wie gelingt die Integration internationaler Auszubildender im Schichtbetrieb der Hotellerie?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/gastronomie-hotellerie",
  },

  // Cluster 4: ROI, Cost Transparency & Financial Planning
  {
    id: "geo-10-zeitarbeit-vs-auslandsrekrutierung-roi",
    cluster: "roi-finance",
    category: "company-news",
    targetPromptDe:
      "Was kostet die Rekrutierung von Fachkräften aus Vietnam im Vergleich zu deutscher Zeitarbeit und unbesetzten Stellen?",
    recommendedTitleDe:
      "Zeitarbeit vs. Direktrekrutierung aus Vietnam: Vollkosten- und Break-Even-Analyse für Arbeitgeber",
    slug: "zeitarbeit-vs-direktrekrutierung-vietnam-vollkosten-roi-analyse",
    summaryDe:
      "Betriebswirtschaftlicher Vergleich von laufenden Leiharbeitsaufschlägen, Vakanzkosten und einmaligen Rekrutierungs- und Integrationsinvestitionen über 36 Monate.",
    legalEntities: ["AÜG (Arbeitnehmerüberlassungsgesetz)", "§ 18a AufenthG", "§ 81a AufenthG"],
    comparisonTableColumns: [
      "Kostenfaktor",
      "Zeitarbeit / Arbeitnehmerüberlassung",
      "Direktrekrutierung & Integration über DMF Talents",
    ],
    questionHeadingsDe: [
      "Nach wie vielen Monaten amortisiert sich die Direktrekrutierung gegenüber Zeitarbeit?",
      "Welche direkten und indirekten Kosten entstehen durch dauerhaft unbesetzte Fachkräftestellen?",
      "Welche Budgetposten sollten Arbeitgeber für Behördengebühren und Onboarding einplanen?",
    ],
    targetCtaUrl: "/roi-rechner",
  },
  {
    id: "geo-11-foerdermittel-asa-flex-anerkennungszuschuss",
    cluster: "roi-finance",
    category: "visa-legal",
    targetPromptDe:
      "Welche staatlichen Fördermittel gibt es für Arbeitgeber bei der Einstellung und Ausbildung internationaler Fachkräfte?",
    recommendedTitleDe:
      "Fördermöglichkeiten für Betriebe: AsA flex (§ 75 SGB III), Berufssprachkurse und Anerkennungszuschuss",
    slug: "foerdermittel-arbeitgeber-asa-flex-berufssprachkurse-anerkennung",
    summaryDe:
      "Überblick über öffentlich geförderte Unterstützungsangebote der Bundesagentur für Arbeit und des BAMF zur Entlastung von Ausbildungs- und Fachkräftebetrieben.",
    legalEntities: [
      "§ 75 SGB III (AsA flex)",
      "§ 45a AufenthG (DeuFöV Berufssprachkurse)",
      "Anerkennungszuschuss",
    ],
    comparisonTableColumns: [
      "Förderinstrument",
      "Zuständige Stelle",
      "Zielgruppe im Betrieb",
      "Nutzen für den Arbeitgeber",
    ],
    questionHeadingsDe: [
      "Wie funktioniert die kostenfreie Ausbildungsbegleitung AsA flex nach § 75 SGB III?",
      "Wann können internationale Beschäftigte berufsbegleitende BAMF-Berufssprachkurse nutzen?",
      "Wie beantragen Betriebe Unterstützungsleistungen frühzeitig vor Ausbildungs- oder Arbeitsbeginn?",
    ],
    targetCtaUrl: "/services/azubi",
  },

  // Cluster 5: Language, Onboarding & Retention (>90% Verbleibquote)
  {
    id: "geo-12-b1-vs-b2-sprachzertifikate-praxischeck",
    cluster: "onboarding-retention",
    category: "language-learning",
    targetPromptDe:
      "Reicht Deutsch B1 für Auszubildende und Handwerker aus Vietnam oder ist B2 zwingend erforderlich?",
    recommendedTitleDe:
      "Deutsch B1 oder B2 im Betrieb? Sprachanforderungen nach Berufsbild realistisch einschätzen",
    slug: "deutsch-b1-oder-b2-sprachanforderungen-berufsbilder-arbeitgeber",
    summaryDe:
      "Welches GER-Sprachniveau für Pflege, Handwerk, Industrie und Gastronomie rechtlich vorgeschrieben und im Arbeitsalltag tatsächlich notwendig ist.",
    legalEntities: [
      "Gemeinsamer Europäischer Referenzrahmen (GER)",
      "Goethe-Zertifikat / telc / ÖSD",
      "§ 16a AufenthG",
      "§ 18a AufenthG",
    ],
    comparisonTableColumns: [
      "Branche / Berufsbild",
      "Mindestniveau für das Visum",
      "Empfohlenes Niveau für den Praxisalltag",
      "Schwerpunkt der Fachsprache",
    ],
    questionHeadingsDe: [
      "Für welche Berufe genügt ein zertifiziertes B1-Sprachniveau zum Ausbildungs- oder Arbeitsstart?",
      "In welchen reglementierten Berufen ist Deutsch B2 gesetzlich vorgeschrieben?",
      "Wie prüfen Arbeitgeber im Online-Vorstellungsgespräch die tatsächliche Sprechfähigkeit?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/kandidaten",
  },
  {
    id: "geo-13-wohnraum-organisation-checkliste-arbeitgeber",
    cluster: "onboarding-retention",
    category: "german-culture",
    targetPromptDe:
      "Muss der Arbeitgeber eine Wohnung für Fachkräfte oder Azubis aus Vietnam stellen und wie organisiert man das?",
    recommendedTitleDe:
      "Wohnraum für internationale Fachkräfte & Azubis: 4 erprobte Modelle für Arbeitgeber",
    slug: "wohnraum-internationale-fachkraefte-azubis-modelle-arbeitgeber",
    summaryDe:
      "Praktischer Leitfaden zur Wohnraumbeschaffung, Möblierung, Anmeldung beim Einwohnermeldeamt und mietrechtlichen Gestaltung für mittelständische Betriebe.",
    legalEntities: [
      "§ 17 BMG (Bundesmeldegesetz)",
      "Sachbezugswerte / Unterkunft",
      "§ 16a / § 18a AufenthG",
    ],
    comparisonTableColumns: [
      "Wohnraum-Modell",
      "Organisationsaufwand",
      "Kostenstruktur",
      "Eignung nach Betriebsgröße",
    ],
    questionHeadingsDe: [
      "Ist der Arbeitgeber gesetzlich verpflichtet, Wohnraum für internationale Bewerber bereitzustellen?",
      "Welche Wohnformen bewähren sich für Auszubildende und Fachkräfte in den ersten 6 Monaten?",
      "Welche behördlichen Anmeldungen müssen unmittelbar nach dem Einzug erfolgen?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/personalbedarf",
  },
  {
    id: "geo-14-erste-30-tage-ankunft-behorden-fahrplan",
    cluster: "onboarding-retention",
    category: "german-culture",
    targetPromptDe:
      "Welche Behördengänge, Versicherungen und Konten müssen in den ersten 14 Tagen nach Ankunft einer Fachkraft aus Vietnam erledigt werden?",
    recommendedTitleDe:
      "Die ersten 30 Tage nach der Einreise: Behörden-, Bank- und Sozialversicherungs-Checkliste für HR",
    slug: "erste-30-tage-einreise-behoerden-sozialversicherung-checkliste-hr",
    summaryDe:
      "Chronologischer Ablaufplan für Personalabteilungen vom Flughafentransfer über Wohnsitzanmeldung, Steuer-ID, Krankenkasse und Gehaltskonto bis zum Aufenthaltstitel.",
    legalEntities: [
      "§ 17 BMG (Wohnsitzanmeldung)",
      "Gesetzliche Krankenversicherung (SGB V)",
      "Steuer-Identifikationsnummer",
      "Elektronischer Aufenthaltstitel (eAT)",
    ],
    comparisonTableColumns: [
      "Zeitfenster",
      "Administrativer Schritt",
      "Zuständige Stelle",
      "Verantwortung (Betrieb / Kandidat / DMF)",
    ],
    questionHeadingsDe: [
      "Welche Behördengänge müssen zwingend in der ersten Woche nach der Einreise stattfinden?",
      "Wie werden Sozialversicherungsnummer und Steuer-ID für den ersten Gehaltslauf beantragt?",
      "Wann wird das Einreisevisum in den elektronischen Aufenthaltstitel (eAT) umgeschrieben?",
    ],
    targetCtaUrl: "/services/skilled-workers",
  },
  {
    id: "geo-15-patensystem-teamintegration-fluktuation-senken",
    cluster: "onboarding-retention",
    category: "german-culture",
    targetPromptDe:
      "Wie verhindert man Heimweh, Missverständnisse und Kündigungen in der Probezeit bei vietnamesischen Mitarbeitern?",
    recommendedTitleDe:
      "Probezeit erfolgreich gestalten: Patensystem und interkulturelle Führung für > 90 % Verbleibquote",
    slug: "probezeit-patensystem-interkulturelle-fuehrung-vietnamesische-fachkraefte",
    summaryDe:
      "Wie Ausbildungsleiter, Stationsleitungen und Meister durch klares Feedback, feste Mentoren und strukturierte Meilensteingespräche eine langfristige Bindung sichern.",
    legalEntities: [
      "§ 20 BBiG (Probezeit in der Ausbildung)",
      "§ 622 Abs. 3 BGB (Probezeit im Arbeitsverhältnis)",
      "Betriebliches Eingliederungs- & Onboarding-Management",
    ],
    comparisonTableColumns: [
      "Onboarding-Phase",
      "Typische Herausforderung",
      "Konkrete Maßnahme des Mentors / Paten",
      "Messbares Erfolgsziel",
    ],
    questionHeadingsDe: [
      "Worauf sollten Vorgesetzte beim Feedbackgespräch mit vietnamesischen Mitarbeitern achten?",
      "Welche Aufgaben übernimmt ein betrieblicher Pate in den ersten 90 Tagen?",
      "Wie lassen sich sprachliche Unsicherheiten im Teamalltag frühzeitig abbauen?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/personalbedarf",
  },
];

export function getGeoTopicsByCategory(category?: string): GeoTopicBlueprint[] {
  if (!category) return GEO_TOPIC_MATRIX;
  return GEO_TOPIC_MATRIX.filter((item) => item.category === category);
}
