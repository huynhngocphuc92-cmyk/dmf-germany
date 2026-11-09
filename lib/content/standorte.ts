import { SITE_NAME, SITE_URL, siteUrl } from "../site";
import { SPEAKABLE_SPECIFICATION, type AeoFaqItem } from "../seo/aeo-schemas";

export interface RegionalStandortConfig {
  slug: string;
  stateName: string;
  shortName: string;
  cities: string[];
  metaTitle: string;
  metaDescription: string;
  authority81aName: string;
  authority81aAddress: string;
  authority81aModel: string;
  nursingRecognitionOffice: string;
  ihkHwkRecognitionOffice: string;
  arrivalAirport: string;
  placementsCount: number;
  directAnswerTitle: string;
  directAnswerText: string;
  focusIndustries: string[];
  keyHighlights: Array<{ label: string; value: string }>;
  processSteps: Array<{ step: string; title: string; detail: string }>;
  faqs: AeoFaqItem[];
}

export const REGIONAL_STANDORTE: RegionalStandortConfig[] = [
  {
    slug: "bayern",
    stateName: "Bayern",
    shortName: "BY",
    cities: ["München", "Nürnberg", "Augsburg", "Regensburg", "Würzburg", "Ingolstadt"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Bayern rekrutieren (ZSEF § 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Unternehmen in Bayern: Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG) über die ZSEF Nürnberg, LfP Pflege-Anerkennung & IHK FOSA.",
    authority81aName:
      "Zentrale Stelle für die Einwanderung von Fachkräften (ZSEF) – Regierung von Mittelfranken",
    authority81aAddress: "Marienstraße 17, 90402 Nürnberg",
    authority81aModel:
      "Wahlrecht in Bayern: Zentral über die ZSEF Nürnberg (digitales Antragsportal) oder über die örtliche Ausländerbehörde am Betriebssitz.",
    nursingRecognitionOffice:
      "Bayerisches Landesamt für Pflege (LfP), Mildred-Scheel-Straße 4, 92224 Amberg",
    ihkHwkRecognitionOffice:
      "IHK FOSA (Nürnberg) für IHK-Berufe sowie die zuständigen bayerischen Handwerkskammern (HWK München, Nürnberg, Schwaben u. a.)",
    arrivalAirport: "Flughafen München (MUC) & Flughafen Nürnberg (NUE)",
    placementsCount: 14,
    directAnswerTitle:
      "Wie rekrutieren Arbeitgeber in Bayern Fachkräfte & Azubis aus Vietnam über die ZSEF (§ 81a AufenthG)?",
    directAnswerText:
      "Arbeitgeber in Bayern profitieren beim Recruiting aus Vietnam vom zentralisierten § 81a AufenthG-Verfahren über die Zentrale Stelle für die Einwanderung von Fachkräften (ZSEF) in Nürnberg sowie dem Bayerischen Landesamt für Pflege (LfP) in Amberg. Gegen eine gesetzliche Behördengebühr von 411 EUR bündelt die ZSEF die Gleichwertigkeitsprüfung (max. 2 Monate), die Vorabzustimmung der Bundesagentur für Arbeit (1 Woche) und die Visumerteilung in Vietnam (3 Wochen nach Vorabzustimmung), sodass qualifizierte Fachkräfte und Azubis in 4 bis 6 Monaten in Bayern einsatzbereit sind.",
    focusIndustries: [
      "Pflege & Kliniken (LfP Amberg Fast-Track)",
      "Industrie, Maschinenbau & Automotive",
      "Hotellerie & Alpengastronomie",
      "Handwerk, SHK & Elektrotechnik",
    ],
    keyHighlights: [
      { label: "§ 81a Zentralbehörde", value: "ZSEF Nürnberg (Reg. v. Mittelfranken)" },
      { label: "Pflege-Anerkennung", value: "Bayerisches Landesamt für Pflege (LfP Amberg)" },
      { label: "Verfahrensdauer § 81a", value: "4–6 Monate bis Einreise (MUC)" },
      { label: "Behördengebühr § 81a", value: "411 EUR (gesetzliche Pauschale)" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Kandidatenauswahl & Unterovollmacht für Bayern",
        detail:
          "DMF Talents präsentiert Ihnen geprüfte Kandidaten (B1/B2) und bereitet den Arbeits- oder Ausbildungsvertrag sowie die Vollmacht nach § 81a AufenthG für die ZSEF Nürnberg vor.",
      },
      {
        step: "Schritt 2",
        title: "Einreichung bei ZSEF Nürnberg & LfP Amberg / IHK FOSA",
        detail:
          "Abschluss der § 81a-Vereinbarung mit der ZSEF Nürnberg. Die ZSEF leitet die Gleichwertigkeitsprüfung beim LfP Amberg (Pflege) bzw. der IHK FOSA / HWK ein (Frist: max. 2 Monate).",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Zustimmung & Vorabzustimmung",
        detail:
          "Nach Anerkennung bzw. Defizitbescheid holt die ZSEF innerhalb von 1 Woche die Zustimmung der Bundesagentur für Arbeit (ZAV) ein und stellt die Vorabzustimmung aus.",
      },
      {
        step: "Schritt 4",
        title: "Visumerteilung in Hanoi/HCMC & Ankunft in München (MUC)",
        detail:
          "Vergabe des Botschaftstermins binnen 3 Wochen, Visumerteilung innerhalb weiterer 3 Wochen und koordinierte Einreise über den Flughafen München (MUC).",
      },
    ],
    faqs: [
      {
        question:
          "Ist in Bayern die ZSEF Nürnberg oder die lokale Ausländerbehörde für § 81a AufenthG zuständig?",
        answer:
          "In Bayern haben Arbeitgeber ein Wahlrecht: Sie können das beschleunigte Fachkräfteverfahren nach § 81a AufenthG entweder über die landesweite Zentrale Stelle für die Einwanderung von Fachkräften (ZSEF) in Nürnberg oder über die örtliche Ausländerbehörde beantragen. Wegen der hohen Spezialisierung empfiehlt DMF Talents in Bayern regelmäßig den digitalen Weg über die ZSEF Nürnberg.",
      },
      {
        question:
          "Welche Behörde prüft in Bayern die Anerkennung vietnamesischer Pflegefachkräfte?",
        answer:
          "Seit dem 01.07.2023 ist das Bayerische Landesamt für Pflege (LfP) in Amberg zentral für alle Anerkennungsverfahren im Bereich Pflegefachfrau/Pflegefachmann in ganz Bayern zuständig.",
      },
      {
        question:
          "Wie lange dauert die Rekrutierung vietnamesischer Azubis für bayerische Betriebe?",
        answer:
          "Für die duale Ausbildung nach § 16a AufenthG in Bayern beträgt die Gesamtvorlaufzeit inklusive B1/B2-Sprachqualifizierung in Vietnam und IHK/HWK-Vertragseintragung durchschnittlich 6 bis 9 Monate bis zum Ausbildungsstart im August oder September.",
      },
    ],
  },
  {
    slug: "baden-wuerttemberg",
    stateName: "Baden-Württemberg",
    shortName: "BW",
    cities: ["Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Ulm", "Heilbronn"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Baden-Württemberg (LZF § 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Arbeitgeber in Baden-Württemberg: § 81a AufenthG über die Landesagentur für die Zuwanderung von Fachkräften (LZF Stuttgart/Karlsruhe).",
    authority81aName: "Landesagentur für die Zuwanderung von Fachkräften (LZF Baden-Württemberg)",
    authority81aAddress: "Standorte Stuttgart & Karlsruhe (Digitales Serviceportal BW)",
    authority81aModel:
      "Zentralisierte Bearbeitung über die Landesagentur für die Zuwanderung von Fachkräften (LZF) mit spezialisiertem Fachbereich für Gesundheits- und Pflegeberufe.",
    nursingRecognitionOffice:
      "Regierungspräsidium Stuttgart – Referat 95 (Landesprüfungsamt für Gesundheitsberufe)",
    ihkHwkRecognitionOffice:
      "IHK FOSA sowie die Handwerkskammern in Baden-Württemberg (HWK Stuttgart, Karlsruhe, Mannheim, Freiburg, Ulm, Heilbronn, Reutlingen, Konstanz)",
    arrivalAirport: "Flughafen Stuttgart (STR) & Flughafen Frankfurt (FRA)",
    placementsCount: 11,
    directAnswerTitle:
      "Wie läuft das § 81a AufenthG Verfahren in Baden-Württemberg über die LZF ab?",
    directAnswerText:
      "In Baden-Württemberg wickelt die Landesagentur für die Zuwanderung von Fachkräften (LZF) mit Standorten in Stuttgart und Karlsruhe das beschleunigte Fachkräfteverfahren nach § 81a AufenthG digital und zentralisiert ab. In enger Verzahnung mit dem Regierungspräsidium Stuttgart (Referat 95 für Pflegeberufe) sowie den IHKs und HWKs verkürzt die LZF die Verfahrensdauer für vietnamesische Fachkräfte und Auszubildende auf 4 bis 6 Monate.",
    focusIndustries: [
      "Maschinenbau, Feinmechanik & Automobilzulieferer",
      "Alten- & Krankenpflege (RP Stuttgart Referat 95)",
      "SHK-Handwerk, Elektrotechnik & Bau",
      "Hotellerie & Gastronomie (Schwarzwald / Bodensee / Stuttgart)",
    ],
    keyHighlights: [
      { label: "§ 81a Zentralbehörde", value: "LZF Baden-Württemberg (Stuttgart/Karlsruhe)" },
      { label: "Pflege-Anerkennung", value: "Regierungspräsidium Stuttgart (Referat 95)" },
      { label: "Verfahrensdauer § 81a", value: "4–6 Monate bis Einsatzstart" },
      { label: "Behördengebühr § 81a", value: "411 EUR nach § 47 AufenthV" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Matching & Dossier-Aufbereitung für BW",
        detail:
          "Selektion passender Fachkräfte oder Azubis aus dem DMF-Pool inklusive beglaubigter Übersetzungen für die LZF Baden-Württemberg.",
      },
      {
        step: "Schritt 2",
        title: "Digitaler § 81a-Antrag bei der LZF Stuttgart/Karlsruhe",
        detail:
          "Einreichung über die LZF Baden-Württemberg und parallele Gleichwertigkeitsprüfung beim Regierungspräsidium Stuttgart bzw. IHK/HWK.",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Freigabe & Vorabzustimmung",
        detail:
          "Einholung der BA/ZAV-Zustimmung binnen 1 Woche und Ausstellung der Vorabzustimmung zur Weiterleitung nach Vietnam.",
      },
      {
        step: "Schritt 4",
        title: "Visum & Onboarding in Baden-Württemberg",
        detail:
          "Visumerteilung durch das Generalkonsulat Ho-Chi-Minh-Stadt oder die Botschaft Hanoi und Anreise nach Stuttgart (STR) oder Frankfurt (FRA).",
      },
    ],
    faqs: [
      {
        question:
          "Welche Behörde führt das § 81a-Verfahren für Arbeitgeber in Baden-Württemberg durch?",
        answer:
          "Für Unternehmen in Baden-Württemberg ist die Landesagentur für die Zuwanderung von Fachkräften (LZF) mit Standorten in Stuttgart und Karlsruhe die zentrale Anlaufstelle für das beschleunigte Fachkräfteverfahren nach § 81a AufenthG.",
      },
      {
        question:
          "Wer stellt in Baden-Württemberg den Defizitbescheid für vietnamesische Pflegekräfte aus?",
        answer:
          "In Baden-Württemberg ist das Regierungspräsidium Stuttgart (Referat 95 – Landesprüfungsamt für Gesundheitsberufe) zentral für die Prüfung ausländischer Pflegeabschlüsse und die Ausstellung des Defizitbescheids zuständig.",
      },
      {
        question:
          "Unterstützt DMF Talents auch mittelständische Handwerksbetriebe in Baden-Württemberg?",
        answer:
          "Ja, wir begleiten Handwerksbetriebe in ganz Baden-Württemberg bei der Gewinnung von Elektroniker-, SHK-, Kfz- und Bau-Fachkräften sowie Auszubildenden inklusive der Abstimmung mit der örtlichen Handwerkskammer (HWK).",
      },
    ],
  },
  {
    slug: "nordrhein-westfalen",
    stateName: "Nordrhein-Westfalen (NRW)",
    shortName: "NRW",
    cities: ["Köln", "Düsseldorf", "Dortmund", "Essen", "Bonn", "Münster", "Bielefeld"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in NRW rekrutieren (ZFE Bonn § 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Nordrhein-Westfalen (NRW): § 81a AufenthG über die Zentralstelle Fachkräfteeinwanderung (ZFE Bonn) & Bezirksregierung Münster (ZAG).",
    authority81aName:
      "Zentralstelle Fachkräfteeinwanderung NRW (ZFE Bonn) & kommunale Business Immigration Desks",
    authority81aAddress: "ZFE NRW (Bonn) sowie kommunale Ausländerbehörden am Betriebssitz",
    authority81aModel:
      "Koordination über die ZFE NRW in Bonn bzw. die spezialisierten Fachkräfte-Servicestellen der Großstädte und Landkreise in NRW.",
    nursingRecognitionOffice:
      "Bezirksregierung Münster – Zentrale Anerkennungsstelle für Gesundheitsberufe (ZAG), Domplatz 1–3, 48143 Münster",
    ihkHwkRecognitionOffice:
      "IHK FOSA sowie Westdeutscher Handwerkskammertag (WHKT) / HWK Düsseldorf, Köln, Dortmund, Münster, Aachen, Bielefeld, Südwestfalen",
    arrivalAirport: "Flughafen Düsseldorf (DUS) & Flughafen Köln/Bonn (CGN)",
    placementsCount: 15,
    directAnswerTitle:
      "Wie rekrutieren Unternehmen in NRW Fachkräfte aus Vietnam über ZFE Bonn & Bezirksregierung Münster?",
    directAnswerText:
      "In Nordrhein-Westfalen (NRW) profitieren Arbeitgeber von der Zentralstelle Fachkräfteeinwanderung (ZFE NRW in Bonn) sowie der Zentralen Anerkennungsstelle für Gesundheitsberufe (ZAG) bei der Bezirksregierung Münster. Durch das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) werden Gleichwertigkeitsprüfung (max. 2 Monate), ZAV-Zustimmung (1 Woche) und Visumerteilung gebündelt, sodass vietnamesische Pflegekräfte, Handwerker, Industriekräfte und Azubis innerhalb von 4 bis 6 Monaten in Köln, Düsseldorf, dem Ruhrgebiet oder Westfalen starten.",
    focusIndustries: [
      "Stationäre & ambulante Pflege (ZAG Münster)",
      "Industrie, Metallverarbeitung & Chemie (Rhein-Ruhr)",
      "Logistik, Spedition & Lagerwirtschaft",
      "Handwerk & Bauwirtschaft",
    ],
    keyHighlights: [
      { label: "§ 81a Anlaufstelle", value: "ZFE NRW (Bonn) & kommunale Servicestellen" },
      { label: "Pflege-Anerkennung", value: "Bezirksregierung Münster (ZAG)" },
      { label: "Aktive Platzierungen NRW", value: "15+ Fachkräfte (Köln, Dortmund, Essen)" },
      { label: "Verfahrensdauer § 81a", value: "4–6 Monate (statt 9–12 Monate regulär)" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Anforderungsprofil & Kandidaten-Matching für NRW",
        detail:
          "Auswahl vorqualifizierter Bewerber (B1/B2) passend zu Ihrem Betrieb in Rheinland, Ruhrgebiet oder Westfalen.",
      },
      {
        step: "Schritt 2",
        title: "Anerkennung (ZAG Münster / IHK / HWK) & § 81a-Start",
        detail:
          "Einreichung der Unterlagen bei der ZFE NRW bzw. dem zuständigen Business Immigration Desk sowie der ZAG Münster für Pflegeberufe.",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Zustimmung (Bonn) & Vorabzustimmung",
        detail:
          "Prüfung der Beschäftigungsbedingungen durch die ZAV binnen 7 Tagen und Erteilung der Vorabzustimmung.",
      },
      {
        step: "Schritt 4",
        title: "Einreise über Düsseldorf (DUS) oder Köln/Bonn (CGN)",
        detail:
          "Visumerteilung in Vietnam, Flugkoordination nach NRW und Begleitung beim Behörden- und Betriebs-Onboarding.",
      },
    ],
    faqs: [
      {
        question:
          "Welche Behörde ist in NRW für die Anerkennung vietnamesischer Pflegekräfte zuständig?",
        answer:
          "In Nordrhein-Westfalen ist die Zentrale Anerkennungsstelle für Gesundheitsberufe (ZAG) bei der Bezirksregierung Münster landesweit für die Gleichwertigkeitsprüfung von Pflegeabschlüssen aus Drittstaaten wie Vietnam zuständig.",
      },
      {
        question: "Welche Rolle spielt die Pflegekammer NRW bei der Rekrutierung aus Vietnam?",
        answer:
          "Die Pflegekammer NRW ist für die spätere berufsständische Registrierung anerkanannter Pflegefachkräfte zuständig, nicht jedoch für das eigentliche Anerkennungsverfahren oder den Defizitbescheid – dieser läuft über die Bezirksregierung Münster (ZAG).",
      },
      {
        question: "Hat DMF Talents bereits Referenzen in Nordrhein-Westfalen?",
        answer:
          "Ja, DMF Talents hat bereits erfolgreich Pflegefachkräfte, Elektroniker, Schreiner und Industriemechaniker an Arbeitgeber in Köln, Dortmund und Essen vermittelt.",
      },
    ],
  },
  {
    slug: "niedersachsen",
    stateName: "Niedersachsen & Bremen",
    shortName: "NI/HB",
    cities: ["Hannover", "Meppen (Emsland)", "Osnabrück", "Oldenburg", "Braunschweig", "Bremen"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Niedersachsen & Emsland (§ 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Niedersachsen & Bremen: Erfolgreiche Azubi- und Fachkräfte-Platzierungen (u. a. Meppen/Emsland, Hannover) nach § 16a & § 81a AufenthG.",
    authority81aName:
      "Kommunale Ausländerbehörden & Fachkräfte-Servicestellen in Niedersachsen / Migrationsamt Bremen",
    authority81aAddress:
      "Zuständige Ausländerbehörde am Betriebssitz (z. B. Hannover, Landkreis Emsland/Meppen, Osnabrück)",
    authority81aModel:
      "Direkte Vereinbarung nach § 81a AufenthG mit der örtlichen Ausländerbehörde in enger Kooperation mit den niedersächsischen IHKs und HWKs.",
    nursingRecognitionOffice:
      "Niedersächsisches Landesamt für Soziales, Jugend und Familie (LS) – Außenstelle Lüneburg",
    ihkHwkRecognitionOffice:
      "IHK FOSA sowie Handwerkskammern Niedersachsen (HWK Osnabrück-Emsland-Grafschaft Bentheim, Hannover, Oldenburg, Braunschweig-Lüneburg-Stade)",
    arrivalAirport: "Flughafen Hannover (HAJ), Bremen (BRE) & Amsterdam/Düsseldorf (für Emsland)",
    placementsCount: 9,
    directAnswerTitle:
      "Wie unterstützt DMF Talents Betriebe in Niedersachsen, Bremen und dem Emsland?",
    directAnswerText:
      "In Niedersachsen (u. a. Region Emsland/Meppen, Osnabrück, Hannover und Oldenburg) sowie Bremen begleitet DMF Talents Ausbildungsbetriebe, Pflegeeinrichtungen und Industrieunternehmen bei der rechtssicheren Gewinnung vietnamesischer Auszubildender (§ 16a AufenthG) und Fachkräfte (§ 18a/b, § 81a AufenthG). Die Anerkennung von Pflegeberufen erfolgt zentral über das Niedersächsische Landesamt für Soziales, Jugend und Familie in Lüneburg.",
    focusIndustries: [
      "Duale Ausbildung in Handwerk, ZFA & Industrie (Referenzregion Meppen/Emsland)",
      "Stationäre & ambulante Pflege (Landesamt Lüneburg)",
      "Ernährungswirtschaft, Logistik & Produktion",
      "Gastronomie & Küstentourismus (Nordsee)",
    ],
    keyHighlights: [
      { label: "Verifizierte Referenz", value: "Aktive DMF-Absolventen in Meppen (Emsland)" },
      { label: "Pflege-Anerkennung", value: "Niedersächsisches Landesamt (Außenstelle Lüneburg)" },
      { label: "Rechtsgrundlagen", value: "§ 16a, § 18a/b & § 81a AufenthG" },
      { label: "Compliance-Garantie", value: "100 % Employer-Pays nach § 296a SGB III" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Bedarfsklärung für Ihren Standort in Niedersachsen",
        detail:
          "Abstimmung der Stellen- oder Ausbildungsprofile inklusive Wohnraum- und Mobilitätsplanung im ländlichen oder urbanen Raum.",
      },
      {
        step: "Schritt 2",
        title: "Kammer-Eintragung (IHK/HWK) bzw. Anerkennung Lüneburg",
        detail:
          "Eintragung der Ausbildungsverträge bei der zuständigen Kammer oder Einreichung der Gleichwertigkeitsprüfung beim Landesamt in Lüneburg.",
      },
      {
        step: "Schritt 3",
        title: "§ 81a-Verfahren & ZAV-Vorabzustimmung",
        detail:
          "Koordination mit der örtlichen Ausländerbehörde und der ZAV zur beschleunigten Visumfreigabe.",
      },
      {
        step: "Schritt 4",
        title: "Anreise & persönliche Begleitung vor Ort",
        detail:
          "Flughafen-Briefing, koordinierte Einreise nach Niedersachsen und Unterstützung bei Anmeldung, Kontoeröffnung und Betriebsstart.",
      },
    ],
    faqs: [
      {
        question:
          "Hat DMF Talents bereits erfolgreich Auszubildende nach Niedersachsen vermittelt?",
        answer:
          "Ja, auf unserer Referenzseite dokumentieren wir unter anderem die erfolgreiche Visumerteilung und Ausreise unserer Absolventen nach Meppen (Landkreis Emsland, Niedersachsen) sowie in die Zahnmedizinische Fachangestellten-Ausbildung (ZFA).",
      },
      {
        question: "Wer prüft ausländische Pflegeabschlüsse in Niedersachsen?",
        answer:
          "In Niedersachsen ist das Niedersächsische Landesamt für Soziales, Jugend und Familie (Außenstelle Lüneburg, Auf der Hude 2, 21339 Lüneburg) zentral für die Anerkennung ausländischer Abschlüsse in den Pflege- und Gesundheitsfachberufen zuständig.",
      },
      {
        question:
          "Wie gelingt die Integration vietnamesischer Azubis im ländlichen Raum Niedersachsens?",
        answer:
          "Durch unsere Vorbereitung am Campus in Vietnam (B1/B2-Sprachniveau, interkulturelles Training) sowie die frühzeitige Organisation von WG-Wohnraum und ÖPNV-/Fahrradmobilität vor Ausbildungsbeginn erzielen unsere Azubis auch in ländlichen Regionen wie dem Emsland eine Bleibequote von über 95 %.",
      },
    ],
  },
  {
    slug: "hessen",
    stateName: "Hessen & Rhein-Main",
    shortName: "HE",
    cities: ["Frankfurt am Main", "Wiesbaden", "Darmstadt", "Kassel", "Offenbach", "Gießen"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Hessen & Frankfurt (§ 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Hessen & Rhein-Main: Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG), HLfGP Pflege-Anerkennung & Direktflug nach Frankfurt (FRA).",
    authority81aName:
      "Zuständige Ausländerbehörden & Business-Servicestellen in Hessen (Frankfurt, Wiesbaden, Darmstadt, Kassel)",
    authority81aAddress: "Jeweilige kommunale Ausländerbehörde am Betriebssitz in Hessen",
    authority81aModel:
      "Beschleunigtes Verfahren nach § 81a AufenthG über die Ausländerbehörde am Unternehmenssitz mit direkter Anbindung an das HLfGP und den Flughafen Frankfurt (FRA).",
    nursingRecognitionOffice:
      "Hessisches Landesamt für Gesundheit und Pflege (HLfGP), Postfach 10 07 40, 64207 Darmstadt",
    ihkHwkRecognitionOffice:
      "IHK FOSA sowie die hessischen Handwerkskammern (HWK Frankfurt-Rhein-Main, Wiesbaden, Kassel)",
    arrivalAirport: "Flughafen Frankfurt am Main (FRA – Direktflüge ab Hanoi & Ho-Chi-Minh-Stadt)",
    placementsCount: 8,
    directAnswerTitle:
      "Welche Vorteile bietet Hessen & die Region Frankfurt (FRA) bei der Rekrutierung aus Vietnam?",
    directAnswerText:
      "Unternehmen in Hessen und der Metropolregion Frankfurt/Rhein-Main profitieren von täglichen Direktflügen aus Hanoi und Ho-Chi-Minh-Stadt zum Flughafen Frankfurt (FRA) sowie der zentralisierten Pflege-Anerkennung über das Hessische Landesamt für Gesundheit und Pflege (HLfGP) in Darmstadt. Über das § 81a AufenthG-Verfahren rekrutiert DMF Talents Pflegekräfte, Gastronomie- und Logistikpersonal sowie Handwerker in 4 bis 6 Monaten.",
    focusIndustries: [
      "Kliniken, Intensiv- & Altenpflege (HLfGP Darmstadt)",
      "Flughafen-Logistik, Spedition & Systemgastronomie (Rhein-Main)",
      "IT, Elektrohandwerk & Gebäudetechnik",
      "Hotellerie & Messe-Gastronomie Frankfurt",
    ],
    keyHighlights: [
      { label: "Logistik-Vorteil", value: "Direktflug Hanoi/HCMC → Frankfurt (FRA)" },
      { label: "Pflege-Anerkennung", value: "Hessisches Landesamt (HLfGP Darmstadt)" },
      { label: "Verfahrensdauer § 81a", value: "4–6 Monate bis Arbeitsantritt" },
      { label: "Saison-Kontingent", value: "8-Monate ZAV-Programm für Gastronomie/Logistik" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Profildefinition & Kandidaten-Auswahl für Hessen",
        detail:
          "Kurzfristige Bereitstellung geprüfter Dossiers für Betriebe im Rhein-Main-Gebiet, Mittel- und Nordhessen.",
      },
      {
        step: "Schritt 2",
        title: "HLfGP- / IHK-Anerkennung & § 81a-Vereinbarung",
        detail:
          "Einreichung der Gleichwertigkeitsprüfung beim HLfGP Darmstadt (Pflege) bzw. IHK/HWK und Start des § 81a-Verfahrens.",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Vorabzustimmung & Botschaftstermin",
        detail:
          "Einholung der ZAV-Freigabe binnen 1 Woche und beschleunigte Visumausstellung in Vietnam.",
      },
      {
        step: "Schritt 4",
        title: "Direktflug nach Frankfurt (FRA) & Arbeitsbeginn",
        detail:
          "Direkte Einreise ohne Umstieg nach Frankfurt am Main (FRA) und strukturierter Start im Arbeitgeberbetrieb.",
      },
    ],
    faqs: [
      {
        question:
          "Welche Behörde ist in Hessen für die Anerkennung ausländischer Pflegekräfte zuständig?",
        answer:
          "In Hessen ist das Hessische Landesamt für Gesundheit und Pflege (HLfGP) mit Sitz in Darmstadt zentral für die staatliche Anerkennung ausländischer Gesundheits- und Pflegeberufe zuständig.",
      },
      {
        question:
          "Wie schnell können Saisonkräfte für Gastronomie und Logistik im Rhein-Main-Gebiet eingesetzt werden?",
        answer:
          "Über das ZAV-Kontingent nach § 15d BeschV können saisonale Arbeitskräfte aus Vietnam für bis zu 8 Monate innerhalb von 8 bis 12 Wochen Vorlaufzeit nach Frankfurt und Hessen vermittelt werden.",
      },
    ],
  },
  {
    slug: "berlin-brandenburg",
    stateName: "Berlin & Brandenburg",
    shortName: "BE/BB",
    cities: [
      "Berlin",
      "Potsdam",
      "Cottbus",
      "Frankfurt (Oder)",
      "Brandenburg an der Havel",
      "Oranienburg",
    ],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Berlin & Brandenburg (BIS § 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Berlin & Brandenburg: Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG) über den Business Immigration Service (LEA Berlin) & LAGeSo.",
    authority81aName:
      "Landesamt für Einwanderung (LEA) Berlin – Business Immigration Service (BIS) / Ausländerbehörden Brandenburg",
    authority81aAddress: "Fasanenstraße 85, 10623 Berlin (LEA Business Immigration Service)",
    authority81aModel:
      "Digitalisierte Bearbeitung für Berliner Arbeitgeber über das LEA Berlin (Abteilung B 5 / BIS) sowie die kommunalen Ausländerbehörden in Brandenburg.",
    nursingRecognitionOffice:
      "Landesamt für Gesundheit und Soziales (LAGeSo) Berlin / Landesamt für Arbeitsschutz, Verbraucherschutz und Gesundheit (LAVG) Brandenburg",
    ihkHwkRecognitionOffice:
      "IHK Berlin / IHK FOSA sowie Handwerkskammer Berlin, HWK Potsdam, HWK Cottbus und HWK Frankfurt (Oder)",
    arrivalAirport: "Flughafen Berlin Brandenburg (BER)",
    placementsCount: 12,
    directAnswerTitle:
      "Wie rekrutieren Arbeitgeber in Berlin & Brandenburg Personal aus Vietnam über das LEA / BIS?",
    directAnswerText:
      "In der Hauptstadtregion Berlin-Brandenburg ist Berlin mit 12+ aktiven DMF-Platzierungen einer unserer stärksten Standorte. Berliner Arbeitgeber nutzen für das beschleunigte Fachkräfteverfahren nach § 81a AufenthG das Landesamt für Einwanderung (LEA Berlin / Business Immigration Service in der Fasanenstraße 85) in Verbindung mit dem LAGeSo Berlin (Pflege) bzw. dem LAVG Brandenburg, um vietnamesische Fachkräfte und Azubis binnen 4 bis 6 Monaten einzustellen.",
    focusIndustries: [
      "Pflegeheime, Kliniken & Ambulante Dienste (LAGeSo / LAVG)",
      "Hotellerie, System- & Spitzengastronomie Berlin",
      "Bauhandwerk, Elektrotechnik & SHK",
      "IT, Software Engineering & Technische Dienste",
    ],
    keyHighlights: [
      { label: "Top-Standort", value: "12+ erfolgreiche DMF-Platzierungen in Berlin" },
      { label: "§ 81a Behörde Berlin", value: "LEA Berlin – Business Immigration Service (BIS)" },
      { label: "Pflege-Anerkennung", value: "LAGeSo Berlin / LAVG Brandenburg" },
      { label: "Zielflughafen", value: "Flughafen Berlin Brandenburg (BER)" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Kandidaten-Matching für Berlin & Brandenburg",
        detail:
          "Auswahl passender Pflegekräfte, Handwerker, Köche, IT-Spezialisten oder Auszubildender mit zertifiziertem B1/B2-Deutsch.",
      },
      {
        step: "Schritt 2",
        title: "Antragstellung beim LEA Berlin (BIS) & LAGeSo / LAVG",
        detail:
          "Abschluss der § 81a-Vereinbarung mit dem LEA Berlin bzw. der Brandenburger Ausländerbehörde und Start der Gleichwertigkeitsprüfung.",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Zustimmung & Vorabzustimmung",
        detail:
          "Einholung der BA-Zustimmung innerhalb einer Woche und Ausstellung der Vorabzustimmung für die Deutsche Botschaft.",
      },
      {
        step: "Schritt 4",
        title: "Ankunft am BER & Integration in die Berliner Community",
        detail:
          "Einreise über den Flughafen BER und schnelle soziale Eingewöhnung dank starker vietnamesischer Infrastruktur in Berlin-Brandenburg.",
      },
    ],
    faqs: [
      {
        question:
          "Warum ist die Bleibequote vietnamesischer Fachkräfte in Berlin und Brandenburg besonders hoch?",
        answer:
          "Berlin und Brandenburg verfügen über eine traditionsreiche, hervorragend vernetzte vietnamesische Gemeinschaft und kulturelle Infrastruktur. In Kombination mit unserer sprachlichen Vorbereitung reduziert dies den Kulturschock erheblich und sorgt für eine extrem hohe Betriebstreue.",
      },
      {
        question:
          "Welche Stelle im LEA Berlin bearbeitet das beschleunigte Fachkräfteverfahren (§ 81a AufenthG)?",
        answer:
          "Im Landesamt für Einwanderung (LEA) Berlin ist das Referat B 5 / Business Immigration Service (Fasanenstraße 85, 10623 Berlin) die spezialisierte Anlaufstelle für Berliner Arbeitgeber im Verfahren nach § 81a AufenthG.",
      },
    ],
  },
  {
    slug: "sachsen-mitteldeutschland",
    stateName: "Sachsen, Sachsen-Anhalt & Thüringen",
    shortName: "SN/ST/TH",
    cities: ["Leipzig", "Dresden", "Chemnitz", "Magdeburg", "Halle (Saale)", "Erfurt", "Jena"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Sachsen & Mitteldeutschland (§ 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Sachsen, Sachsen-Anhalt & Thüringen: § 81a AufenthG über die Landesdirektion Sachsen, KSV Leipzig & regionale Kammern.",
    authority81aName:
      "Landesdirektion Sachsen (Zentrale Ausländerbehörde Chemnitz/Dresden/Leipzig) & Ausländerbehörden ST/TH",
    authority81aAddress:
      "Landesdirektion Sachsen (Altchemnitzer Str. 41, 09120 Chemnitz / Standorte Dresden & Leipzig)",
    authority81aModel:
      "In Sachsen zentrale Abwicklung des § 81a-Verfahrens über die Landesdirektion Sachsen (Referat 26); in Sachsen-Anhalt und Thüringen über die zuständigen Ausländerbehörden.",
    nursingRecognitionOffice:
      "Kommunaler Sozialverband Sachsen (KSV, Leipzig) / Landesverwaltungsamt Sachsen-Anhalt (Halle) / TLVwA Thüringen (Weimar)",
    ihkHwkRecognitionOffice:
      "IHK FOSA sowie die Handwerkskammern Dresden, Leipzig, Chemnitz, Halle, Magdeburg, Erfurt, Ostthüringen und Südthüringen",
    arrivalAirport: "Flughafen Leipzig/Halle (LEJ), Dresden (DRS) & Berlin (BER)",
    placementsCount: 9,
    directAnswerTitle:
      "Wie läuft die Fachkräfte- & Azubi-Gewinnung aus Vietnam in Sachsen & Mitteldeutschland ab?",
    directAnswerText:
      "In Sachsen, Sachsen-Anhalt und Thüringen (mit bereits 9+ erfolgreichen DMF-Platzierungen in Leipzig und Dresden) ist das beschleunigte Fachkräfteverfahren nach § 81a AufenthG besonders effizient organisiert: In Sachsen bündelt die Landesdirektion Sachsen zentral alle § 81a-Verfahren, während der Kommunale Sozialverband Sachsen (KSV) in Leipzig die Pflege-Anerkennung bearbeitet. Dadurch gewinnen mitteldeutsche Betriebe qualifizierte Fachkräfte und Auszubildende in 4 bis 6 Monaten.",
    focusIndustries: [
      "Alten- & Krankenpflege (KSV Sachsen / LVwA Halle / TLVwA Weimar)",
      "Halbleiter-, Elektro- & Metallindustrie (Silicon Saxony / Mitteldeutschland)",
      "Bauhandwerk, Ausbaugewerke (Fliesenleger, Maler, SHK)",
      "Hotellerie & Tourismus (Leipzig, Dresden, Sächsische Schweiz, Thüringer Wald)",
    ],
    keyHighlights: [
      {
        label: "§ 81a Zentralbehörde SN",
        value: "Landesdirektion Sachsen (Chemnitz/Dresden/Leipzig)",
      },
      { label: "Pflege-Anerkennung SN", value: "Kommunaler Sozialverband Sachsen (KSV Leipzig)" },
      { label: "Aktive Platzierungen", value: "9+ Fachkräfte in Leipzig & Dresden" },
      { label: "Azubi-Vorlaufzeit", value: "6–9 Monate nach § 16a AufenthG" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Stellenprofil & Kandidaten-Auswahl für Mitteldeutschland",
        detail:
          "Passgenaue Vorauswahl vietnamesischer Fachkräfte oder Auszubildender für Betriebe in Sachsen, Sachsen-Anhalt und Thüringen.",
      },
      {
        step: "Schritt 2",
        title: "§ 81a-Antrag bei der Landesdirektion Sachsen & KSV Leipzig",
        detail:
          "Zentrale Einreichung des beschleunigten Verfahrens und der Gleichwertigkeitsprüfung (Frist: max. 2 Monate).",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Freigabe & Vorabzustimmung",
        detail:
          "Erteilung der BA-Zustimmung binnen 1 Woche und Übermittlung der Vorabzustimmung nach Vietnam.",
      },
      {
        step: "Schritt 4",
        title: "Einreise nach Leipzig/Dresden & Onboarding",
        detail:
          "Koordinierte Ankunft und Unterstützung bei Behördenanmeldung, Unterkunft und Betriebsintegration.",
      },
    ],
    faqs: [
      {
        question:
          "Wer ist in Sachsen für das beschleunigte Fachkräfteverfahren (§ 81a AufenthG) zuständig?",
        answer:
          "Im Freistaat Sachsen ist die Landesdirektion Sachsen mit ihren Standorten in Chemnitz, Dresden und Leipzig zentral für die Durchführung des beschleunigten Fachkräfteverfahrens nach § 81a AufenthG zuständig.",
      },
      {
        question:
          "Welche Behörde prüft in Sachsen die Gleichwertigkeit vietnamesischer Pflegeabschlüsse?",
        answer:
          "In Sachsen ist der Kommunale Sozialverband Sachsen (KSV) am Standort Leipzig für die staatliche Anerkennung ausländischer Berufsabschlüsse in den Pflege- und Gesundheitsfachberufen zuständig.",
      },
    ],
  },
  {
    slug: "hamburg-norddeutschland",
    stateName: "Hamburg & Schleswig-Holstein",
    shortName: "HH/SH",
    cities: ["Hamburg", "Kiel", "Lübeck", "Flensburg", "Neumünster", "Norderstedt"],
    metaTitle: "Fachkräfte & Azubis aus Vietnam in Hamburg & Norddeutschland (§ 81a)",
    metaDescription:
      "Personalvermittlung aus Vietnam für Hamburg & Schleswig-Holstein: § 81a AufenthG über das Hamburg Welcome Center (HWC) & Landesamt Schleswig-Holstein.",
    authority81aName:
      "Hamburg Welcome Center (HWC) für Fachkräfte / Landesamt für Zuwanderung und Flüchtlinge Schleswig-Holstein",
    authority81aAddress: "Süderstraße 32b, 20097 Hamburg (Hamburg Welcome Center)",
    authority81aModel:
      "In Hamburg zentrale Bearbeitung über das Hamburg Welcome Center (HWC); in Schleswig-Holstein über das Landesamt für Zuwanderung und Flüchtlinge (LaZuF) in Neumünster.",
    nursingRecognitionOffice:
      "Sozialbehörde Hamburg (Amt für Gesundheit) / Schleswig-Holsteinisches Institut für Berufliche Bildung (SHIBB)",
    ihkHwkRecognitionOffice:
      "Handelskammer Hamburg / IHK FOSA sowie Handwerkskammer Hamburg, HWK Lübeck und HWK Flensburg",
    arrivalAirport: "Flughafen Hamburg (HAM)",
    placementsCount: 9,
    directAnswerTitle:
      "Wie rekrutieren Arbeitgeber in Hamburg & Schleswig-Holstein Personal aus Vietnam?",
    directAnswerText:
      "In Hamburg und Schleswig-Holstein (mit 9+ aktiven DMF-Platzierungen in Altenpflege, Gastronomie und Rezeption) stehen Arbeitgebern zwei hochspezialisierte Zentralstellen für § 81a AufenthG zur Verfügung: das Hamburg Welcome Center (HWC) in der Süderstraße sowie das Landesamt für Zuwanderung und Flüchtlinge (LaZuF) in Schleswig-Holstein. DMF Talents begleitet den kompletten Prozess von der B1/B2-Vorbereitung bis zur Ankunft am Flughafen Hamburg (HAM).",
    focusIndustries: [
      "Hotellerie, Kreuzfahrt- & Küstengastronomie (Hamburg / Ostsee / Nordsee)",
      "Alten- & Krankenpflege (Sozialbehörde Hamburg / SHIBB)",
      "Hafenlogistik, Spedition & Maritime Industrie",
      "Handwerk & Gebäudetechnik",
    ],
    keyHighlights: [
      { label: "§ 81a Behörde Hamburg", value: "Hamburg Welcome Center (HWC)" },
      { label: "§ 81a Behörde SH", value: "Landesamt für Zuwanderung (LaZuF Neumünster)" },
      { label: "Aktive Platzierungen HH", value: "9+ Kräfte (Pflege, Küche, Hotellerie)" },
      { label: "Zielflughafen", value: "Flughafen Hamburg (HAM)" },
    ],
    processSteps: [
      {
        step: "Schritt 1",
        title: "Kandidaten-Vorauswahl für Hamburg & Schleswig-Holstein",
        detail:
          "Bereitstellung geprüfter Bewerberprofile für Pflege, Gastronomie, Logistik und Handwerk im Norden.",
      },
      {
        step: "Schritt 2",
        title: "§ 81a-Antrag beim Hamburg Welcome Center (HWC) bzw. LaZuF SH",
        detail:
          "Einreichung der Vollmacht, des Arbeits-/Ausbildungsvertrags und der Gleichwertigkeitsunterlagen.",
      },
      {
        step: "Schritt 3",
        title: "ZAV-Zustimmung & Vorabzustimmung",
        detail: "Beschleunigte Freigabe durch die Bundesagentur für Arbeit innerhalb von 1 Woche.",
      },
      {
        step: "Schritt 4",
        title: "Einreise über Hamburg (HAM) & Onboarding",
        detail:
          "Visumerteilung in Vietnam, Flug nach Hamburg (HAM) und strukturierte Einarbeitung im Betrieb.",
      },
    ],
    faqs: [
      {
        question:
          "Welche Behörde führt in Hamburg und Schleswig-Holstein das § 81a-Verfahren durch?",
        answer:
          "In der Freien und Hansestadt Hamburg ist das Hamburg Welcome Center (HWC, Süderstraße 32b) zuständig. In Schleswig-Holstein übernimmt das Landesamt für Zuwanderung und Flüchtlinge (LaZuF) in Neumünster zentral das beschleunigte Fachkräfteverfahren nach § 81a AufenthG.",
      },
      {
        question:
          "Vermittelt DMF Talents auch Saisonkräfte und Azubis für die norddeutsche Hotellerie?",
        answer:
          "Ja, wir vermitteln sowohl Auszubildende nach § 16a AufenthG (Koch, Hotelfach, Restaurantfach) als auch Saisonarbeitskräfte über das 8-Monate-ZAV-Kontingent nach § 15d BeschV für Hotels und Gastronomiebetriebe in Hamburg sowie an Nord- und Ostsee.",
      },
    ],
  },
];

export const REGIONAL_STANDORT_SLUGS = REGIONAL_STANDORTE.map((s) => s.slug);

export function getRegionalStandortBySlug(slug: string): RegionalStandortConfig | undefined {
  return REGIONAL_STANDORTE.find((s) => s.slug === slug);
}

export function buildRegionalStandortSchemas(config: RegionalStandortConfig) {
  const path = `/fuer-arbeitgeber/standorte/${config.slug}`;
  const url = siteUrl(path);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: `${config.metaTitle} | ${SITE_NAME}`,
      description: config.directAnswerText,
      inLanguage: "de-DE",
      speakable: SPEAKABLE_SPECIFICATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: config.metaTitle,
      serviceType: `Personalvermittlung Vietnam & § 81a AufenthG Prozessbegleitung (${config.stateName})`,
      description: config.directAnswerText,
      url,
      provider: {
        "@type": "EmploymentAgency",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: config.stateName,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: config.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startseite",
          item: siteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bundesländer & § 81a Standorte",
          item: siteUrl("/fuer-arbeitgeber/standorte"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: config.stateName,
          item: url,
        },
      ],
    },
  ];
}
