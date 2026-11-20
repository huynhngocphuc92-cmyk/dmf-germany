import type { TopicCategory } from "@/app/admin/blog-writer/types";

export type GeoTopicCluster =
  | "legal-comparison"
  | "industry-deep-dive"
  | "roi-finance"
  | "onboarding-retention"
  | "country-comparison"
  | "seasonal-compliance"
  | "regional-authorities";

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

  // Phase 13 Cluster 1: Seasonal Employment, Short-Term Quotas & Transition Law
  {
    id: "geo-16-saison-15d-beschv-zav-kontingent",
    cluster: "seasonal-compliance",
    category: "visa-legal",
    targetPromptDe:
      "Wie funktioniert die Rekrutierung von Saisonarbeitskräften aus Vietnam über das 8-Monate-Kontingent der ZAV (§ 15d BeschV) in Gastronomie und Landwirtschaft?",
    recommendedTitleDe:
      "Saisonarbeitskräfte aus Vietnam: § 15d BeschV, ZAV-Kontingent & Rechtspraxis in Gastronomie und Landwirtschaft",
    slug: "saisonarbeitskraefte-aus-vietnam-zav-kontingent-gastronomie-landwirtschaft",
    summaryDe:
      "Rechtssichere Abgrenzung zwischen § 15d BeschV (8-Monate-Kontingent mit Tarifbindung für HoGa/Logistik), § 15a BeschV (bilaterale ZAV-Vermittlungsabsprache) und § 14 Abs. 2 BeschV (90-Tage-Ferienbeschäftigung).",
    legalEntities: [
      "§ 19c Abs. 1 AufenthG",
      "§ 15d BeschV",
      "§ 15a BeschV",
      "§ 14 Abs. 2 BeschV",
      "ZAV / Bundesagentur für Arbeit",
    ],
    comparisonTableColumns: [
      "Rechtsgrundlage",
      "Branchen & Zulässigkeit für Vietnam",
      "Höchstdauer & Kontingent",
      "Zwingende Arbeitgeberpflichten",
    ],
    questionHeadingsDe: [
      "Welche rechtlichen Wege gelten für Saisonarbeitskräfte aus Vietnam in Gastronomie und Landwirtschaft?",
      "Welche Pflichtvoraussetzungen verlangt die ZAV für das 8-Monate-Kontingent nach § 15d BeschV?",
      "Wie beantragen Sie die Vorabzustimmung bei der ZAV für kurzzeitige Beschäftigte aus Vietnam?",
    ],
    targetCtaUrl: "/services/seasonal",
  },
  {
    id: "geo-17-ferienbeschaeftigung-14-beschv-mindestlohn-2027",
    cluster: "seasonal-compliance",
    category: "visa-legal",
    targetPromptDe:
      "Wie stellen Betriebe Studierende aus Vietnam zur Ferienbeschäftigung nach § 14 Abs. 2 BeschV ein und wie dürfen Unterkunft und Verpflegung 2027 auf den Mindestlohn von 14,60 Euro angerechnet werden?",
    recommendedTitleDe:
      "Ferienbeschäftigung (§ 14 Abs. 2 BeschV), Unterkunft & Mindestlohn 2027: Compliance-Leitfaden für Saisonbetriebe",
    slug: "ferienbeschaeftigung-14-abs-2-beschv-unterkunft-mindestlohn-2027",
    summaryDe:
      "Compliance-Leitfaden zur 90-Tage-Ferienbeschäftigung nach § 14 Abs. 2 BeschV, zum gesetzlichen Mindestlohn 2027 (14,60 €/Std.), SvEV-Unterkunftswerten nach § 107 Abs. 2 GewO und Arbeitszeitaufzeichnung (§ 17 MiLoG).",
    legalEntities: [
      "§ 14 Abs. 2 BeschV",
      "§§ 1, 17, 20 MiLoG",
      "§ 107 Abs. 2 GewO",
      "SvEV 2027",
      "§ 850c ZPO",
      "ArbZG",
    ],
    comparisonTableColumns: [
      "Compliance-Bereich 2027",
      "Gesetzliche Vorgabe & Wert 2027",
      "Rechtsgrundlage",
      "Typische Prüffrage von ZAV / Zoll (FKS)",
    ],
    questionHeadingsDe: [
      "Welche Voraussetzungen prüft die ZAV für die Ferienbeschäftigung nach § 14 Abs. 2 BeschV?",
      "Wie dürfen Sie Unterkunft und Verpflegung 2027 nach § 107 Abs. 2 GewO auf den Mindestlohn anrechnen?",
      "Welche Arbeitszeit-, Zoll- und Sozialversicherungspflichten gelten beim Saisoneinsatz im Betrieb?",
    ],
    targetCtaUrl: "/services/seasonal",
  },
  {
    id: "geo-18-stammkraefte-wiederkehrer-15d-16a-18a",
    cluster: "seasonal-compliance",
    category: "visa-legal",
    targetPromptDe:
      "Können bewährte Saisonarbeitskräfte aus Vietnam jedes Jahr wiederkommen oder direkt in Deutschland in eine Ausbildung (§ 16a AufenthG) oder Fachkräftebeschäftigung (§ 18a AufenthG) wechseln?",
    recommendedTitleDe:
      "Stammkräfte-Wiederkehrer & Übergangsrecht: Vom Saisoneinsatz (§ 15d BeschV) in Ausbildung (§ 16a) oder Fachkraft (§ 18a)",
    slug: "stammkraefte-wiederkehrer-saisonarbeit-uebergang-16a-18a-aufenthg",
    summaryDe:
      "Wie Saisonbetriebe einen wiederkehrenden Stammpool rechtssicher aufbauen und wie der Übergang aus § 15d oder § 14 Abs. 2 BeschV nach fristgerechter Ausreise über B1/B2-Qualifizierung und § 81a AufenthG in § 16a oder § 18a gelingt.",
    legalEntities: [
      "§ 19c Abs. 1 AufenthG",
      "§ 15d Abs. 3 BeschV",
      "§ 14 Abs. 2 BeschV",
      "§ 16a AufenthG",
      "§ 18a AufenthG",
      "§ 81a AufenthG",
    ],
    comparisonTableColumns: [
      "Strategiepfad nach Saisonende",
      "Rechtsgrundlage",
      "Ausreise erforderlich?",
      "Typischer Zeitplan & Sprachziel",
    ],
    questionHeadingsDe: [
      "Wie funktioniert das Wiederkehrer-Modell für eingearbeitete Saisonkräfte im Folgejahr?",
      "Warum ist ein direkter Zweckwechsel aus § 15d BeschV in § 16a oder § 18a AufenthG im Inland nicht zulässig?",
      "Wie planen Betriebe den rechtssicheren Übergang vom Saisoneinsatz zur festen Ausbildung oder Fachkraftstelle?",
    ],
    targetCtaUrl: "/services/seasonal",
  },

  // Phase 13 Cluster 2: Tariffs, 3-Year TCO & Employer Training Authority
  {
    id: "geo-19-tvoed-avr-pflege-eingruppierung",
    cluster: "roi-finance",
    category: "industry-specific",
    targetPromptDe:
      "In welche Entgeltgruppe im TVöD-Pflege (P5, P6, P7, P8), TVAöD-Pflege oder AVR Caritas und Diakonie werden Pflegekräfte aus Vietnam während der Anerkennung (§ 16d) und nach der Urkunde (§ 18a) eingruppiert?",
    recommendedTitleDe:
      "TVöD-Pflege (P5–P8), TVAöD & AVR Caritas/Diakonie: Tarifliche Eingruppierung internationaler Pflegekräfte und Azubis",
    slug: "tvoed-pflege-tvaoed-avr-eingruppierung-internationale-pflegekraefte",
    summaryDe:
      "Praxisvergleich der Eingruppierung internationaler Pflegekräfte (§ 16d / § 18a) und Pflege-Azubis (§ 16a) in TVöD-P, TVAöD-Pflege, AVR Caritas und AVR.DD inklusive § 72 Abs. 3a/3b SGB XI.",
    legalEntities: [
      "TVöD-P (P5–P8)",
      "TVAöD-Pflege",
      "AVR Caritas Anlagen 31/32",
      "AVR.DD",
      "§ 72 Abs. 3a/3b SGB XI",
      "§ 16d Abs. 3 AufenthG",
      "§ 2a BeschV",
    ],
    comparisonTableColumns: [
      "Tarifwerk / Arbeitsrechtsregelung",
      "Pflege-Azubi (§ 16a)",
      "Anerkennungsphase (§ 16d / Helfer)",
      "Nach Berufsurkunde (§ 18a Fachkraft)",
    ],
    questionHeadingsDe: [
      "Welche Entgeltgruppen im TVöD-P und in den AVR gelten vor und nach der Pflege-Anerkennung?",
      "Wie erkennen Sie vietnamesische Berufserfahrung bei der Stufenzuordnung im TVöD und bei Caritas/Diakonie an?",
      "Wie greifen Tariftreue (§ 72 Abs. 3a/3b SGB XI) und die Pflege-Ausnahme im § 16d Abs. 3 AufenthG für private Träger ineinander?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/pflege-gesundheit",
  },
  {
    id: "geo-20-3-jahres-tco-direktrekrutierung",
    cluster: "roi-finance",
    category: "company-news",
    targetPromptDe:
      "Wie fällt die 3-Jahres-Vollkostenrechnung (Total Cost of Ownership) der Direktrekrutierung aus Vietnam im Vergleich zu deutschen Headhuntern, klassischer Personalvermittlung und Zeitarbeit aus?",
    recommendedTitleDe:
      "3-Jahres-Vollkostenrechnung (TCO): Direktrekrutierung aus Vietnam vs. Headhunter, Personalvermittlung & Zeitarbeit",
    slug: "3-jahres-tco-vollkostenrechnung-direktrekrutierung-vs-headhunter",
    summaryDe:
      "36-Monats-Vollkostenvergleich (TCO) für CFOs und Geschäftsführungen zwischen DMF-Direktrekrutierung (§ 18a / § 81a), Inlands-Headhuntern und Zeitarbeit (§ 1 Abs. 1b AÜG) inklusive Vakanzkosten und § 4 Abs. 4 EStG.",
    legalEntities: [
      "§ 18a AufenthG",
      "§ 81a AufenthG",
      "§ 40 AufenthG",
      "§ 47 AufenthV",
      "§ 1 Abs. 1b AÜG",
      "§ 296a SGB III",
      "§ 4 Abs. 4 EStG",
    ],
    comparisonTableColumns: [
      "TCO-Kostenkomponente (36 Monate)",
      "DMF Direktrekrutierung (§ 18a / § 81a)",
      "Inlands-Headhunter / Personalberatung",
      "Zeitarbeit / AÜG (Vergleichswert)",
    ],
    questionHeadingsDe: [
      "Welche Kostenpositionen gehören in eine belastbare 3-Jahres-Vollkostenrechnung (TCO) für eine Fachkraftstelle?",
      "Wie schneidet die Direktrekrutierung aus Vietnam über 36 Monate gegenüber Headhuntern und Zeitarbeit ab?",
      "Wie wirken sich § 81a-Gebühren, Nachbesetzungsgarantie und § 4 Abs. 4 EStG auf die CFO-Bilanz aus?",
    ],
    targetCtaUrl: "/referenzen",
  },
  {
    id: "geo-21-aevo-ausbildungsbefugnis-28-30-bbig",
    cluster: "legal-comparison",
    category: "visa-legal",
    targetPromptDe:
      "Welche gesetzlichen Voraussetzungen nach AEVO und §§ 28–30 BBiG muss ein Betrieb erfüllen, um Auszubildende aus Vietnam einzustellen, und wann ist eine Ausbildungszeitverkürzung nach § 8 BBiG sinnvoll?",
    recommendedTitleDe:
      "AEVO, Ausbildungsbefugnis (§§ 28–30 BBiG) & Verkürzung (§ 8 BBiG): Rechtlicher Leitfaden für Ausbildungsbetriebe",
    slug: "ausbildereignungsverordnung-aevo-ausbildungsbefugnis-28-30-bbig-verkuerzung-8-bbig",
    summaryDe:
      "Rechtlicher Leitfaden zur Eignung von Ausbildungsstätte (§ 27 BBiG) und Ausbilder (§§ 28–30 BBiG, AEVO, § 22b HwO, § 4 PflAPrV) sowie zur Verkürzung (§ 8 BBiG) und vorzeitigen Zulassung (§ 45 BBiG).",
    legalEntities: [
      "§§ 27, 28–30, 8, 45 BBiG",
      "AEVO",
      "§§ 22a, 22b, 46 HwO",
      "§ 4 PflAPrV",
      "§ 16a AufenthG",
    ],
    comparisonTableColumns: [
      "Rechtsbereich & Norm",
      "Geltungsbereich (IHK / HWK / Pflege)",
      "Pflichtnachweis für den Betrieb",
      "Praxishinweis für internationale Azubis (§ 16a)",
    ],
    questionHeadingsDe: [
      "Welche Voraussetzungen verlangen §§ 28–30 BBiG und die AEVO von Ihrem Ausbildungsbetrieb?",
      "Wann genügen Ausbildungsbeauftragte (§ 28 Abs. 3 BBiG) und was gilt abweichend in Pflege und Handwerk (§ 22b HwO)?",
      "Wann sollten Sie eine Verkürzung nach § 8 BBiG oder eine vorzeitige Zulassung (§ 45 BBiG) für internationale Azubis nutzen?",
    ],
    targetCtaUrl: "/services/azubi",
  },

  // Phase 13 Cluster 3: White-Space Industry Verticals 2027
  {
    id: "geo-22-chemikanten-pharmakanten-chemie-ihk",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Wie können Chemie- und Pharmaunternehmen Chemikanten, Pharmakanten oder Azubis für die chemische Produktion aus Vietnam über IHK FOSA und § 81a AufenthG einstellen?",
    recommendedTitleDe:
      "Chemikanten, Pharmakanten & Produktionsfachkräfte Chemie aus Vietnam: IHK-Anerkennung und Schichtbetrieb",
    slug: "chemikanten-pharmakanten-chemieproduktion-vietnam-ihk",
    summaryDe:
      "Rekrutierung und Anerkennung von Chemikanten, Pharmakanten und Produktionsfachkräften Chemie (KldB 41312) über § 16a, § 18a oder § 16d Abs. 3 AufenthG inklusive IHK FOSA, GefStoffV und GMP-Schichtbetrieb.",
    legalEntities: [
      "§ 16a AufenthG",
      "§ 18a AufenthG",
      "§ 16d Abs. 3 AufenthG",
      "§ 18b / § 18g AufenthG",
      "BQFG / IHK FOSA",
      "GefStoffV",
      "KldB 41312",
    ],
    comparisonTableColumns: [
      "Berufsbild / KldB 2010",
      "Ausbildungsdauer (BBiG) & Einstiegspfad",
      "Zuständige Stelle",
      "Betriebliche Schwerpunkte (Schicht / Normen)",
    ],
    questionHeadingsDe: [
      "Welche vietnamesischen Abschlüsse eignen sich für die Anerkennung als Chemikant oder Pharmakant?",
      "Wann ist für Chemie- und Pharmabetriebe die duale Ausbildung (§ 16a AufenthG) sinnvoller als § 16d?",
      "Wie bereiten Sie vietnamesische Fachkräfte auf Gefahrstoffrecht (GefStoffV), GMP-Standards und Wechselschicht vor?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/industrie-metall-technik",
  },
  {
    id: "geo-23-hoerakustiker-orthopaedietechnik-hwk",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Wie können Hörakustik-Fachgeschäfte und Sanitätshäuser Hörakustiker oder Orthopädietechnik-Mechaniker sowie Auszubildende aus Vietnam nach § 16a und § 16d AufenthG gewinnen?",
    recommendedTitleDe:
      "Hörakustiker & Orthopädietechnik-Mechaniker aus Vietnam: HWK-Wege für das Gesundheitshandwerk",
    slug: "hoerakustiker-orthopaedietechnik-gesundheitshandwerk-vietnam-hwk",
    summaryDe:
      "Ausbildung (§ 16a) und HWK-Anerkennung (§ 18a / § 16d Abs. 3) für die meisterpflichtigen Gesundheitshandwerke Hörakustik (afh Lübeck) und Orthopädietechnik (BUFA Dortmund) nach Anlage A HwO.",
    legalEntities: [
      "Anlage A HwO",
      "§ 16a AufenthG",
      "§ 18a AufenthG",
      "§ 16d Abs. 3 AufenthG",
      "BQFG / HWK",
      "KldB 82532 / 82512",
    ],
    comparisonTableColumns: [
      "Gesundheitshandwerk (Anlage A HwO)",
      "KldB 2010 & Ausbildungsdauer",
      "Überbetriebliche Fachschule & Kammer",
      "Typische Aufgaben & Sprachziel",
    ],
    questionHeadingsDe: [
      "Welche Voraussetzungen gelten im Gesundheitshandwerk für die Ausbildung aus Vietnam nach § 16a AufenthG?",
      "Wann greift für vorqualifizierte Techniker die HWK-Anerkennung nach § 18a oder § 16d AufenthG?",
      "Warum benötigen Hörakustiker und Orthopädietechniker ein stabiles B1+- bis B2-Sprachniveau im Betrieb?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/handwerk-bau",
  },
  {
    id: "geo-24-verfahrensmechaniker-kunststoff-kautschuk-ihk",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Wie rekrutieren deutsche Kunststoffverarbeiter und Spritzgussbetriebe Verfahrensmechaniker für Kunststoff- und Kautschuktechnik bzw. Kunststofftechnologen aus Vietnam?",
    recommendedTitleDe:
      "Verfahrensmechaniker für Kunststoff- und Kautschuktechnik aus Vietnam: Fachkräfte für Spritzguss & Extrusion",
    slug: "verfahrensmechaniker-kunststoff-kautschuk-vietnam-ihk",
    summaryDe:
      "Praxisleitfaden zur Gewinnung von Verfahrensmechanikern bzw. Kunststoff- und Kautschuktechnologen (KldB 22102, Neuordnung 2023) für Spritzguss, Extrusion und Faserverbund über IHK FOSA, § 16a und § 16d Abs. 3.",
    legalEntities: [
      "§ 16a AufenthG",
      "§ 18a AufenthG",
      "§ 16d Abs. 3 AufenthG",
      "BQFG / IHK FOSA",
      "GefStoffV",
      "KldB 22102",
    ],
    comparisonTableColumns: [
      "IHK-Fachrichtung (KldB 22102)",
      "Typische Industrieabnehmer",
      "Geeigneter Zuwanderungspfad",
      "Praxisfokus & Einarbeitung",
    ],
    questionHeadingsDe: [
      "Was ändert die Neuordnung zum Kunststoff- und Kautschuktechnologen für das Recruiting aus Vietnam?",
      "Wie verläuft die IHK-FOSA-Anerkennung für erfahrene Spritzguss- und Extrusionstechniker nach dem BQFG?",
      "Welche Fachrichtungen der Kunststofftechnik eignen sich besonders für den Einstieg nach § 16a oder § 16d AufenthG?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/industrie-metall-technik",
  },

  // Phase 13 Cluster 4: Regional § 81a ZFE Authorities & Chamber Practice
  {
    id: "geo-25-zsef-nuernberg-lfp-amberg-bayern",
    cluster: "regional-authorities",
    category: "visa-legal",
    targetPromptDe:
      "Wann muss ein Arbeitgeber in Bayern das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) über die ZSEF Nürnberg und das Landesamt für Pflege (LfP Amberg) beantragen?",
    recommendedTitleDe:
      "ZSEF Nürnberg & LfP Amberg im „Fast-Lane“-Verfahren: § 81a-Behördenleitfaden für bayerische Arbeitgeber",
    slug: "zsef-nuernberg-bayern-81a-lfp-amberg-fast-lane",
    summaryDe:
      "Verfahrensleitfaden für bayerische Arbeitgeber zur Abgrenzung zwischen zentraler Pflichtzuständigkeit in der Pflege-Fast-Lane (ZSEF Nürnberg + LfP Amberg) und Wahlrecht bei IHK-, HWK- und § 16a-Anträgen.",
    legalEntities: [
      "§ 81a AufenthG",
      "§ 47 Abs. 1 Nr. 15 AufenthV",
      "§ 14a BQFG",
      "ZSEF Nürnberg",
      "Bayerisches Landesamt für Pflege (LfP Amberg)",
    ],
    comparisonTableColumns: [
      "Verfahrenskonstellation in Bayern",
      "Zuständige § 81a-Behörde",
      "Anerkennungsstelle",
      "Gesetzliche Frist & Gebühr (§ 81a / § 47 AufenthV)",
    ],
    questionHeadingsDe: [
      "Wann besteht in Bayern ein Wahlrecht zwischen ZSEF Nürnberg und örtlicher Ausländerbehörde?",
      "Wie greifen ZSEF Nürnberg und das Landesamt für Pflege (LfP Amberg) in der „Fast Lane“ ineinander?",
      "Welche Unterlagen und Fristen gelten beim digitalen § 81a-Antrag in Bayern?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/standorte/bayern",
  },
  {
    id: "geo-26-zfe-nrw-bonn-zag-muenster",
    cluster: "regional-authorities",
    category: "visa-legal",
    targetPromptDe:
      "Wie beantragen Unternehmen und Kliniken in NRW das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) über die ZFE NRW in Bonn und die ZAG bei der Bezirksregierung Münster?",
    recommendedTitleDe:
      "ZFE NRW (Bonn/Bezirksregierung Köln) & ZAG Münster: § 81a-Zuständigkeiten für Arbeitgeber in NRW",
    slug: "zfe-nrw-bonn-bezirksregierung-koeln-zag-muenster-81a",
    summaryDe:
      "Behörden-Playbook für Arbeitgeber in Nordrhein-Westfalen: Exklusivzuständigkeit der ZFE NRW (Bonn/Bezirksregierung Köln) für Auslandsanträge nach § 81a sowie Trennung zwischen ZAG Münster, LPA Düsseldorf und Pflegekammer NRW.",
    legalEntities: [
      "§ 81a AufenthG",
      "ZFE NRW (Bezirksregierung Köln / Bonn)",
      "ZAG-PuG / ZAG-aH Münster",
      "Pflegekammer NRW",
      "IHK Wuppertal-Solingen-Remscheid",
    ],
    comparisonTableColumns: [
      "Behörde / Kammer in NRW",
      "Zentrale Zuständigkeit im Recruiting",
      "Verfahrensschritt",
      "Wichtige Abgrenzung für HR",
    ],
    questionHeadingsDe: [
      "Warum ist in NRW die ZFE Bonn statt der kommunalen Ausländerbehörde für § 81a AufenthG zuständig?",
      "Wie trennen sich die Aufgaben von ZAG Münster, Landesprüfungsamt Düsseldorf und Pflegekammer NRW?",
      "Wie reichen NRW-Betriebe das § 81a-Verfahren digital über das Portal der Bezirksregierung Köln ein?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/standorte/nordrhein-westfalen",
  },
  {
    id: "geo-27-ihk-fosa-vs-hwk-bqfg",
    cluster: "regional-authorities",
    category: "visa-legal",
    targetPromptDe:
      "Wann ist die IHK FOSA in Nürnberg und wann die regionale Handwerkskammer für die Berufsanerkennung nach dem BQFG zuständig, und welche Gebühren und Fristen gelten?",
    recommendedTitleDe:
      "IHK FOSA (Nürnberg) vs. Handwerkskammern (HWK): Zuständigkeiten, Gebühren & Fristen nach dem BQFG",
    slug: "ihk-fosa-nuernberg-vs-handwerkskammern-hwk-bqfg-vergleich",
    summaryDe:
      "Klare Abgrenzung zwischen IHK FOSA (Nürnberg), den drei eigenständig prüfenden IHK-Bezirken (Hannover, Braunschweig, Wuppertal-Solingen-Remscheid) und 53 regionalen Handwerkskammern inkl. Gebühren und Fristen (§ 6 / § 14a BQFG).",
    legalEntities: [
      "§§ 6 Abs. 3, 14a BQFG",
      "IHK FOSA (Nürnberg)",
      "BBiG",
      "HwO Anlage A/B (53 HWKs)",
      "§ 81a AufenthG",
    ],
    comparisonTableColumns: [
      "Vergleichskriterium",
      "IHK FOSA (Zentralstelle Nürnberg)",
      "Eigenständige IHKs (Ausnahmen)",
      "Regionale Handwerkskammern (53 HWKs)",
    ],
    questionHeadingsDe: [
      "Wie grenzen sich IHK FOSA und regionale Handwerkskammern bei technisch verwandten Berufen ab?",
      "Welche Gebühren und gesetzlichen Bearbeitungsfristen gelten bei IHK FOSA und HWK nach dem BQFG?",
      "Welche drei deutschen IHK-Bezirke prüfen Gleichwertigkeitsanträge eigenständig außerhalb der IHK FOSA?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/standorte",
  },

  // Phase 13 Cluster 5: Retention, Year-2/3 Exam Prep & Inland Compliance + Allied Health
  {
    id: "geo-28-gesellenpruefung-gap-pflegeexamen-azubis",
    cluster: "onboarding-retention",
    category: "language-learning",
    targetPromptDe:
      "Wie bereiten deutsche Ausbildungsbetriebe und Kliniken vietnamesische Auszubildende erfolgreich auf die Gesellenprüfung Teil 1 & 2 (GAP) oder das Pflegeexamen vor?",
    recommendedTitleDe:
      "Gesellenprüfung Teil 1 & Teil 2 (GAP 1 / GAP 2) und Pflegeexamen bestehen: Betriebliche Prüfungsvorbereitung für internationale Azubis",
    slug: "gesellenpruefung-teil-1-teil-2-pflegeexamen-internationale-azubis",
    summaryDe:
      "Betriebliche Prüfungsvorbereitung im zweiten und dritten Lehrjahr: Freistellungspflichten nach § 15 BBiG, AsA flex (§ 75 SGB III), DeuFöV (§ 45a AufenthG), Verlängerung (§ 21 Abs. 3 BBiG) und Übernahme nach § 18a.",
    legalEntities: [
      "§§ 15, 21, 37, 44 BBiG",
      "§§ 31, 36a HwO",
      "PflBG / PflAPrV",
      "§ 75 SGB III (AsA flex)",
      "§ 45a / § 18a AufenthG",
    ],
    comparisonTableColumns: [
      "Prüfungsabschnitt / Meilenstein",
      "Rechtsgrundlage & Zuständigkeit",
      "Typische Hürde internationaler Azubis",
      "Konkrete Fördermaßnahme im Betrieb",
    ],
    questionHeadingsDe: [
      "Welche gesetzlichen Freistellungspflichten gelten für Betriebe nach § 15 BBiG vor der Abschlussprüfung?",
      "Wie lassen sich Fachtheorie, Fachgespräch und betrieblicher Auftrag in GAP 1, GAP 2 und Pflegeexamen gezielt trainieren?",
      "Was passiert aufenthaltsrechtlich bei Nichtbestehen, Verlängerung nach § 21 Abs. 3 BBiG oder direkter Übernahme (§ 18a AufenthG)?",
    ],
    targetCtaUrl: "/services/azubi",
  },
  {
    id: "geo-29-zusatzblatt-eat-arbeitgeberwechsel",
    cluster: "onboarding-retention",
    category: "visa-legal",
    targetPromptDe:
      "Worauf müssen deutsche Personalabteilungen achten, wenn sie eine Fachkraft oder einen Auszubildenden aus Vietnam im Inland einstellen (§ 4a AufenthG, Zusatzblatt zum eAT, § 9 BeschV)?",
    recommendedTitleDe:
      "Arbeitgeberwechsel, Zweckwechsel & Zusatzblatt zum eAT (§§ 16a, 16d, 18a AufenthG): Was Personalabteilungen bei Neueinstellung im Inland prüfen müssen",
    slug: "arbeitgeberwechsel-zweckwechsel-zusatzblatt-eat-aufenthg-arbeitgeber",
    summaryDe:
      "Compliance-Checkliste für HR bei Einstellungen im Inland: Pflichtprüfung von eAT und Zusatzblatt (§ 4a Abs. 5 AufenthG), Arbeitgeberwechsel nach § 9 BeschV sowie Zweckwechsel aus § 16a oder § 16d in § 18a AufenthG.",
    legalEntities: [
      "§§ 4a Abs. 3/5, 16a, 16d, 18a, 81 Abs. 4, 82 Abs. 6 AufenthG",
      "§ 9 BeschV",
      "§ 404 SGB III",
    ],
    comparisonTableColumns: [
      "Inlands-Konstellation",
      "Rechtsgrundlage",
      "Eintrag im Zusatzblatt zum eAT",
      "Erforderlicher Schritt für HR vor Arbeitsbeginn",
    ],
    questionHeadingsDe: [
      "Welche Prüfpflichten hat die Personalabteilung nach § 4a Abs. 5 AufenthG beim Zusatzblatt zum eAT?",
      "Wann ist ein Arbeitgeberwechsel ohne Zustimmung der Ausländerbehörde nach § 9 BeschV möglich?",
      "Wie verläuft der Zweckwechsel von § 16a oder § 16d in die Fachkräftebeschäftigung nach § 18a AufenthG?",
    ],
    targetCtaUrl: "/services/skilled-workers",
  },
  {
    id: "geo-30-ergotherapeuten-pta-anerkennung",
    cluster: "industry-deep-dive",
    category: "industry-specific",
    targetPromptDe:
      "Wie rekrutieren Reha-Zentren und Apotheken Ergotherapeuten oder Pharmazeutisch-technische Assistenten (PTA) aus Vietnam und wie läuft die Anerkennung nach ErgThG und PTAG?",
    recommendedTitleDe:
      "Ergotherapeuten & Pharmazeutisch-technische Assistenten (PTA) aus Vietnam: Anerkennung nach ErgThG und PTAG für Reha-Zentren & Apotheken",
    slug: "ergotherapeuten-pta-vietnam-anerkennung-ergthg-ptag-reha-apotheken",
    summaryDe:
      "Berufsanerkennung und Zuwanderung von Ergotherapeuten (§ 2 Abs. 3 ErgThG / § 16b ErgThAPrV) und PTA (§§ 33–41 PTAG / § 18b PTA-APrV) über Anpassungslehrgang oder Kenntnisprüfung (§ 16d / § 18a / § 81a AufenthG).",
    legalEntities: [
      "§§ 1, 2 Abs. 3 ErgThG",
      "§ 16b ErgThAPrV",
      "§§ 1, 33–41 PTAG",
      "§ 18b PTA-APrV",
      "ApBetrO",
      "§ 16d / § 18a / § 81a AufenthG",
    ],
    comparisonTableColumns: [
      "Berufsbild & Zielbetrieb",
      "Rechtsgrundlage & Zuständigkeit",
      "Sprach- & Fachprüfung",
      "Einsatz vor & nach voller Erlaubnis",
    ],
    questionHeadingsDe: [
      "Welche Voraussetzungen gelten für die staatliche Erlaubnis nach ErgThG und PTAG bei Abschlüssen aus Vietnam?",
      "Wann empfiehlt sich für Reha-Zentren und Apotheken der Anpassungslehrgang statt der Kenntnisprüfung?",
      "Wie planen Personalabteilungen den Einsatz während der Anerkennungsphase unter Aufsicht (§ 16d AufenthG)?",
    ],
    targetCtaUrl: "/fuer-arbeitgeber/branchen/pflege-gesundheit",
  },
];

export function getGeoTopicsByCategory(category?: string): GeoTopicBlueprint[] {
  if (!category) return GEO_TOPIC_MATRIX;
  return GEO_TOPIC_MATRIX.filter((item) => item.category === category);
}
