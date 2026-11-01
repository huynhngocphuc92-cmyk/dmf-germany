#!/usr/bin/env python3
"""
Generate 12 custom vector SVG diagrams for Phase 10 Blog Articles (Posts 120–131 / 123–134 total).
Each SVG uses a 720x540 viewBox and the DMF corporate palette (Navy #003366, Orange #FF6600, Slate #64748B).
"""

from pathlib import Path

OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")

SVGS = {
    # 120: Mindestausbildungsvergütung 2027 & Sperrkonto-Grenzen
    "mindestausbildungsverguetung-2027-sperrkonto-staffelung.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Mindestausbildungsvergütung 2027 (§ 17 BBiG) &amp; Sperrkonto-Schwelle</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Gesetzliche Mindestwerte ab 01.01.2027 im Vergleich zur Visum-Lebensunterhaltssicherung</text>

  <!-- Threshold Reference Box -->
  <rect x="44" y="112" width="632" height="56" rx="8" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5"/>
  <text x="62" y="135" fill="#9A3412" font-size="13" font-weight="700">Visum-Referenzwert 2026/2027 (Lebensunterhaltssicherung § 16a AufenthG):</text>
  <text x="62" y="154" fill="#C2410C" font-size="12">ca. 959 € netto / ~1.048 € brutto monatlich (Sperrkonto-frei ab ca. 1.050 € brutto im 1. Lehrjahr)</text>

  <!-- 4 Year Bars -->
  <g transform="translate(44, 188)">
    <rect width="632" height="60" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="18" y="26" fill="#003366" font-size="14" font-weight="700">1. Ausbildungsjahr (2027)</text>
    <text x="18" y="45" fill="#475569" font-size="12">Gesetzliches Minimum: 764 € brutto (+5,6 % ggü. 2026)</text>
    <rect x="360" y="16" width="145" height="28" rx="6" fill="#003366"/>
    <text x="432" y="35" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">764 € / Monat</text>
    <text x="520" y="34" fill="#DC2626" font-size="11" font-weight="700">Sperrkonto-Lücke</text>
  </g>

  <g transform="translate(44, 260)">
    <rect width="632" height="60" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="18" y="26" fill="#003366" font-size="14" font-weight="700">2. Ausbildungsjahr (+18 % Aufschlag)</text>
    <text x="18" y="45" fill="#475569" font-size="12">Gesetzliches Minimum: 902 € brutto monatlich</text>
    <rect x="360" y="16" width="172" height="28" rx="6" fill="#003366"/>
    <text x="446" y="35" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">902 € / Monat</text>
    <text x="544" y="34" fill="#D97706" font-size="11" font-weight="700">Geringe Differenz</text>
  </g>

  <g transform="translate(44, 332)">
    <rect width="632" height="60" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="18" y="26" fill="#003366" font-size="14" font-weight="700">3. Ausbildungsjahr (+35 % Aufschlag)</text>
    <text x="18" y="45" fill="#475569" font-size="12">Gesetzliches Minimum: 1.031 € brutto monatlich</text>
    <rect x="360" y="16" width="198" height="28" rx="6" fill="#FF6600"/>
    <text x="459" y="35" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">1.031 € / Monat</text>
    <text x="568" y="34" fill="#15803D" font-size="11" font-weight="700">Nahe Richtwert</text>
  </g>

  <g transform="translate(44, 404)">
    <rect width="632" height="60" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="18" y="26" fill="#003366" font-size="14" font-weight="700">4. Ausbildungsjahr (+40 % Aufschlag)</text>
    <text x="18" y="45" fill="#475569" font-size="12">Gesetzliches Minimum: 1.070 € brutto monatlich</text>
    <rect x="360" y="16" width="212" height="28" rx="6" fill="#15803D"/>
    <text x="466" y="35" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">1.070 € / Monat</text>
    <text x="580" y="34" fill="#15803D" font-size="11" font-weight="700">Sperrkonto-frei</text>
  </g>

  <rect x="44" y="476" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="497" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">DMF-Praxisempfehlung: Ab ~1.050 € brutto im 1. Lehrjahr entfällt das Sperrkonto komplett</text>
</svg>""",

    # 121: Blaue Karte EU 2027 & Mindestlohn 14,60 Euro
    "blaue-karte-eu-2027-gehaltsgrenzen-vergleich.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Gehaltsuntergrenzen 2027 für Drittstaaten-Fachkräfte</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Blaue Karte EU (§ 18g AufenthG), Mindestlohn 14,60 € &amp; Altersgrenze 45 Jahre</text>

  <!-- 4 Cards -->
  <g transform="translate(44, 114)">
    <rect width="304" height="165" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">1. Blaue Karte EU – Regelberufe</text>
    <text x="16" y="68" fill="#003366" font-size="24" font-weight="800">ca. 53.100 € / Jahr</text>
    <text x="16" y="92" fill="#475569" font-size="12">ca. 4.425 € brutto / Monat (50 % BBG RV)</text>
    <text x="16" y="118" fill="#334155" font-size="11">• Für Hochschulabsolventen aller Fachrichtungen</text>
    <text x="16" y="138" fill="#334155" font-size="11">• Beschleunigte Familienzusammenführung</text>
    <text x="16" y="156" fill="#334155" font-size="11">• Niederlassungserlaubnis ab 21–27 Monaten</text>
  </g>

  <g transform="translate(372, 114)">
    <rect width="304" height="165" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#FF6600"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">2. Blaue Karte EU – Engpassberufe &amp; IT</text>
    <text x="16" y="68" fill="#9A3412" font-size="24" font-weight="800">ca. 48.108 € / Jahr</text>
    <text x="16" y="92" fill="#9A3412" font-size="12">ca. 4.009 € brutto / Monat (45,3 % BBG RV)</text>
    <text x="16" y="118" fill="#7C2D12" font-size="11">• MINT, Ingenieure, IT-Spezialisten, Ärzte</text>
    <text x="16" y="138" fill="#7C2D12" font-size="11">• Berufseinsteiger (Abschluss vor &lt; 3 Jahren)</text>
    <text x="16" y="156" fill="#7C2D12" font-size="11">• IT-Fachkräfte auch ohne Hochschulabschluss</text>
  </g>

  <g transform="translate(44, 300)">
    <rect width="304" height="155" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect width="304" height="36" rx="10" fill="#334155"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">3. Fachkräfte § 18a / § 18b AufenthG</text>
    <text x="16" y="68" fill="#0F172A" font-size="20" font-weight="800">Ortsüblicher Tarif- / Branchenlohn</text>
    <text x="16" y="92" fill="#475569" font-size="12">Prüfung durch Bundesagentur für Arbeit (§ 39)</text>
    <text x="16" y="118" fill="#334155" font-size="11">• Ab 45. Lebensjahr: mind. 55 % BBG (~58.410 €)</text>
    <text x="16" y="138" fill="#334155" font-size="11">• Oder Nachweis angemessener Altersvorsorge</text>
  </g>

  <g transform="translate(372, 300)">
    <rect width="304" height="155" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect width="304" height="36" rx="10" fill="#15803D"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">4. Gesetzlicher Mindestlohn ab 01.01.2027</text>
    <text x="16" y="68" fill="#15803D" font-size="24" font-weight="800">14,60 € / Stunde</text>
    <text x="16" y="92" fill="#475569" font-size="12">ca. 2.530 € brutto bei 40-Stunden-Woche</text>
    <text x="16" y="118" fill="#334155" font-size="11">• Unterste gesetzliche Grenze (nach 13,90 € in 2026)</text>
    <text x="16" y="138" fill="#334155" font-size="11">• Achtung: BA fordert für § 18a meist Tarifniveau!</text>
  </g>

  <rect x="44" y="472" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="494" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">DMF-Service: Vorab-Check der Entgeltgruppe vor Einreichung der Erklärung zum Beschäftigungsverhältnis</text>
</svg>""",

    # 122: Ausbildungsstart Herbst 2027 Rückwärts-Zeitplan
    "ausbildungsstart-2027-rueckwaerts-zeitplan-phasen.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Rückwärts-Zeitplan für den Ausbildungsstart August/September 2027</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Warum Ausbildungsbetriebe im Winter 2026/2027 die Weichen stellen müssen</text>

  <!-- 5 Milestones Vertical / Stepped -->
  <g transform="translate(44, 110)">
    <rect width="632" height="64" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect x="14" y="14" width="130" height="36" rx="6" fill="#FF6600"/>
    <text x="79" y="37" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Nov 2026 – Jan 2027</text>
    <text x="160" y="28" fill="#003366" font-size="14" font-weight="700">Phase 1: Bedarfsprofil &amp; Bewerberauswahl (Matching)</text>
    <text x="160" y="48" fill="#475569" font-size="12">Video-Interviews mit vorselektierten B1/B2-Kandidaten &amp; Vertragsunterzeichnung (§ 10 BBiG)</text>
  </g>

  <g transform="translate(44, 186)">
    <rect width="632" height="64" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect x="14" y="14" width="130" height="36" rx="6" fill="#003366"/>
    <text x="79" y="37" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Feb – März 2027</text>
    <text x="160" y="28" fill="#003366" font-size="14" font-weight="700">Phase 2: IHK-/HWK-Eintragung &amp; B2-Sprachzertifizierung</text>
    <text x="160" y="48" fill="#475569" font-size="12">Lehrlingsrolle/Verzeichnis, Fachsprachenmodul in Vietnam &amp; Telc/Goethe-Zertifikat B2</text>
  </g>

  <g transform="translate(44, 262)">
    <rect width="632" height="64" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect x="14" y="14" width="130" height="36" rx="6" fill="#003366"/>
    <text x="79" y="37" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">April – Mai 2027</text>
    <text x="160" y="28" fill="#003366" font-size="14" font-weight="700">Phase 3: § 81a AufenthG Vorabzustimmung &amp; BA-Prüfung</text>
    <text x="160" y="48" fill="#475569" font-size="12">Beschleunigtes Fachkräfteverfahren über Ausländerbehörde &amp; Bundesagentur für Arbeit</text>
  </g>

  <g transform="translate(44, 338)">
    <rect width="632" height="64" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect x="14" y="14" width="130" height="36" rx="6" fill="#003366"/>
    <text x="79" y="37" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Juni – Juli 2027</text>
    <text x="160" y="28" fill="#003366" font-size="14" font-weight="700">Phase 4: Visumerteilung (digital.diplo.de) &amp; Wohnraumsicherung</text>
    <text x="160" y="48" fill="#475569" font-size="12">Botschaftstermin Hanoi/Ho-Chi-Minh-Stadt, Flugbuchung &amp; WG-/Apartment-Vorbereitung</text>
  </g>

  <g transform="translate(44, 414)">
    <rect width="632" height="64" rx="8" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
    <rect x="14" y="14" width="130" height="36" rx="6" fill="#15803D"/>
    <text x="79" y="37" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Aug – Sept 2027</text>
    <text x="160" y="28" fill="#14532D" font-size="14" font-weight="700">Phase 5: Pünktliche Einreise &amp; Ausbildungsbeginn im Betrieb</text>
    <text x="160" y="48" fill="#166534" font-size="12">Behördengänge (Anmeldung, Konto, Krankenkasse, Berufsschule) &amp; strukturierter Start</text>
  </g>
</svg>""",

    # 123: Auslandsportal & Work-and-Stay-Agentur
    "auslandsportal-work-and-stay-agentur-prozesskette.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Digitale Visa-Architektur 2026/2027: Auslandsportal &amp; WSA</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Zusammenspiel von digital.diplo.de, Bundesagentur für Arbeit und Ausländerbehörden</text>

  <!-- 3 Columns Process -->
  <g transform="translate(44, 116)">
    <rect width="196" height="270" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="196" height="40" rx="10" fill="#003366"/>
    <text x="98" y="25" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">1. Arbeitgeber &amp; DMF</text>
    <text x="16" y="66" fill="#0F172A" font-size="12" font-weight="700">Dokumenten-Aufbereitung</text>
    <text x="16" y="90" fill="#475569" font-size="11">• Arbeits-/Ausbildungsvertrag</text>
    <text x="16" y="112" fill="#475569" font-size="11">• Erklärung zum Beschäftigungs-</text>
    <text x="16" y="128" fill="#475569" font-size="11">  verhältnis (digitaler Datensatz)</text>
    <text x="16" y="150" fill="#475569" font-size="11">• Vollmacht nach § 81a AufenthG</text>
    <text x="16" y="172" fill="#475569" font-size="11">• Anerkennungsbescheid / ZAB</text>
    <text x="16" y="194" fill="#475569" font-size="11">• B1/B2-Sprachzertifikat</text>
    <rect x="16" y="218" width="164" height="36" rx="6" fill="#EFF6FF"/>
    <text x="98" y="240" text-anchor="middle" fill="#1D4ED8" font-size="11" font-weight="700">100 % Vollständigkeit vor Upload</text>
  </g>

  <g transform="translate(262, 116)">
    <rect width="196" height="270" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="196" height="40" rx="10" fill="#FF6600"/>
    <text x="98" y="25" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">2. Digitale Schnittstellen</text>
    <text x="16" y="66" fill="#9A3412" font-size="12" font-weight="700">Once-Only-Prüfung</text>
    <text x="16" y="90" fill="#7C2D12" font-size="11">• Auslandsportal (digital.diplo.de)</text>
    <text x="16" y="110" fill="#7C2D12" font-size="11">  Online-Vorprüfung vor Termin</text>
    <text x="16" y="134" fill="#7C2D12" font-size="11">• Bundesagentur für Arbeit (BA)</text>
    <text x="16" y="152" fill="#7C2D12" font-size="11">  Arbeitsmarktprüfung (§ 39)</text>
    <text x="16" y="176" fill="#7C2D12" font-size="11">• Zentrale Ausländerbehörde /</text>
    <text x="16" y="194" fill="#7C2D12" font-size="11">  Work-and-Stay-Agentur (WSA)</text>
    <rect x="16" y="218" width="164" height="36" rx="6" fill="#FFEDD5"/>
    <text x="98" y="240" text-anchor="middle" fill="#C2410C" font-size="11" font-weight="700">Keine Papierakten-Postwege</text>
  </g>

  <g transform="translate(480, 116)">
    <rect width="196" height="270" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
    <rect width="196" height="40" rx="10" fill="#15803D"/>
    <text x="98" y="25" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">3. Botschaft &amp; Einreise</text>
    <text x="16" y="66" fill="#14532D" font-size="12" font-weight="700">Hanoi &amp; Ho-Chi-Minh-Stadt</text>
    <text x="16" y="90" fill="#166534" font-size="11">• Biometrie &amp; Passvorlage vor Ort</text>
    <text x="16" y="114" fill="#166534" font-size="11">• Abgleich mit § 81a Vorab-</text>
    <text x="16" y="132" fill="#166534" font-size="11">  zustimmung im System</text>
    <text x="16" y="156" fill="#166534" font-size="11">• Visumerteilung innerhalb</text>
    <text x="16" y="174" fill="#166534" font-size="11">  weniger Wochen nach Termin</text>
    <text x="16" y="196" fill="#166534" font-size="11">• Planbarer Arbeitsbeginn</text>
    <rect x="16" y="218" width="164" height="36" rx="6" fill="#DCFCE7"/>
    <text x="98" y="240" text-anchor="middle" fill="#15803D" font-size="11" font-weight="700">Planbare Time-to-Hire</text>
  </g>

  <!-- Bottom Notice -->
  <rect x="44" y="408" width="632" height="90" rx="8" fill="#003366"/>
  <text x="64" y="434" fill="#FF6600" font-size="13" font-weight="700">Wichtige Erkenntnis für Personalverantwortliche:</text>
  <text x="64" y="456" fill="#FFFFFF" font-size="12">Digitale Portale beschleunigen den Aktentransport – ersetzen aber weder die Sprachausbildung</text>
  <text x="64" y="476" fill="#CBD5E1" font-size="12">noch die fehlerfreie Aufbereitung von Berufsabschlüssen, Lehrplänen und Stellenbeschreibungen.</text>
</svg>""",

    # 124: Ländervergleich Vietnam vs. Indien, Philippinen & Lateinamerika
    "laendervergleich-fachkraefte-vietnam-indien-philippinen-matrix.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Entscheidungsmatrix: Drittstaaten-Herkunftsländer im Vergleich</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Objektive Kriterien für Mittelstand, Handwerk, Industrie, Pflege und Hotellerie</text>

  <!-- Table Header -->
  <rect x="40" y="110" width="640" height="38" rx="6" fill="#1E293B"/>
  <text x="54" y="134" fill="#FFFFFF" font-size="12" font-weight="700">Kriterium</text>
  <text x="230" y="134" fill="#FF6600" font-size="12" font-weight="700">Vietnam (DMF)</text>
  <text x="375" y="134" fill="#CBD5E1" font-size="12" font-weight="700">Indien</text>
  <text x="485" y="134" fill="#CBD5E1" font-size="12" font-weight="700">Philippinen</text>
  <text x="595" y="134" fill="#CBD5E1" font-size="12" font-weight="700">Lateinamerika</text>

  <!-- Rows -->
  <g transform="translate(40, 154)">
    <rect width="640" height="56" rx="4" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="14" y="24" fill="#0F172A" font-size="12" font-weight="700">Fokus Duale</text>
    <text x="14" y="42" fill="#0F172A" font-size="12" font-weight="700">Ausbildung (Azubi)</text>
    <text x="190" y="34" fill="#15803D" font-size="12" font-weight="700">Sehr hoch (Kernmarkt)</text>
    <text x="335" y="34" fill="#475569" font-size="11">Mittel (Fokus IT/Studium)</text>
    <text x="445" y="34" fill="#475569" font-size="11">Gering (Fokus Pflege-FK)</text>
    <text x="555" y="34" fill="#475569" font-size="11">Mittel</text>
  </g>

  <g transform="translate(40, 216)">
    <rect width="640" height="56" rx="4" fill="#FFFFFF" stroke="#E2E8F0"/>
    <text x="14" y="24" fill="#0F172A" font-size="12" font-weight="700">MINT- &amp; Handwerks-</text>
    <text x="14" y="42" fill="#0F172A" font-size="12" font-weight="700">Affinität</text>
    <text x="190" y="34" fill="#15803D" font-size="12" font-weight="700">Exzellent (PISA/Technik)</text>
    <text x="335" y="34" fill="#475569" font-size="11">Hoch im IT-/Ing.-Sektor</text>
    <text x="445" y="34" fill="#475569" font-size="11">Schwerpunkt Klinik/Care</text>
    <text x="555" y="34" fill="#475569" font-size="11">Gut in Industrie/Bau</text>
  </g>

  <g transform="translate(40, 278)">
    <rect width="640" height="56" rx="4" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="14" y="24" fill="#0F172A" font-size="12" font-weight="700">Abwerberisiko in</text>
    <text x="14" y="42" fill="#0F172A" font-size="12" font-weight="700">angelsächs. Länder</text>
    <text x="190" y="34" fill="#15803D" font-size="12" font-weight="700">Gering (Fokus Deutsch)</text>
    <text x="335" y="34" fill="#DC2626" font-size="11">Hoch (UK/USA/Kanada)</text>
    <text x="445" y="34" fill="#DC2626" font-size="11">Hoch (USA/Golf/UK)</text>
    <text x="555" y="34" fill="#D97706" font-size="11">Mittel (Spanien/USA)</text>
  </g>

  <g transform="translate(40, 340)">
    <rect width="640" height="56" rx="4" fill="#FFFFFF" stroke="#E2E8F0"/>
    <text x="14" y="24" fill="#0F172A" font-size="12" font-weight="700">Diaspora-Netzwerk</text>
    <text x="14" y="42" fill="#0F172A" font-size="12" font-weight="700">in Deutschland</text>
    <text x="190" y="34" fill="#15803D" font-size="12" font-weight="700">&gt; 200.000 (seit Jahrzehnten)</text>
    <text x="335" y="34" fill="#475569" font-size="11">Stark in Metropolen</text>
    <text x="445" y="34" fill="#475569" font-size="11">Mittel (Klinikstandorte)</text>
    <text x="555" y="34" fill="#475569" font-size="11">Wachsend in Großstädten</text>
  </g>

  <g transform="translate(40, 402)">
    <rect width="640" height="56" rx="4" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="14" y="24" fill="#0F172A" font-size="12" font-weight="700">Verbleibquote im</text>
    <text x="14" y="42" fill="#0F172A" font-size="12" font-weight="700">ländlichen Raum</text>
    <text x="190" y="34" fill="#15803D" font-size="12" font-weight="700">Sehr hoch (Familienkultur)</text>
    <text x="335" y="34" fill="#475569" font-size="11">Eher Großstadt-orientiert</text>
    <text x="445" y="34" fill="#475569" font-size="11">Gut bei Klinik-Teams</text>
    <text x="555" y="34" fill="#475569" font-size="11">Stark standortabhängig</text>
  </g>

  <rect x="40" y="472" width="640" height="32" rx="6" fill="#003366"/>
  <text x="360" y="493" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Vietnam überzeugt insbesondere im gewerblich-technischen Mittelstand, in der Pflege und Gastronomie</text>
</svg>""",

    # 125: Tandem- & Kohorten-Recruiting
    "tandem-kohorten-recruiting-kostendegression-bindung.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Einzel-Rekrutierung vs. Tandem- &amp; Kohorten-Modell (2 bis 5 Talente)</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Ökonomische Skaleneffekte und psychologische Stabilität in den ersten 180 Tagen</text>

  <!-- Left Box: Single Hire -->
  <g transform="translate(44, 114)">
    <rect width="298" height="336" rx="10" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5"/>
    <rect width="298" height="42" rx="10" fill="#991B1B"/>
    <text x="149" y="26" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Einzel-Einstellung (1 Kandidat)</text>
    <text x="20" y="74" fill="#7F1D1D" font-size="13" font-weight="700">Typische Risiken im Mittelstand:</text>
    <text x="20" y="102" fill="#991B1B" font-size="12">• Hohes Heimweh-Risiko am Wochenende</text>
    <text x="20" y="128" fill="#991B1B" font-size="12">• Einzelapartment teuer (600–850 € Warmmiete)</text>
    <text x="20" y="154" fill="#991B1B" font-size="12">• Voller Behörden- &amp; Onboarding-Aufwand</text>
    <text x="20" y="174" fill="#991B1B" font-size="12">  für nur eine einzige Arbeitskraft</text>
    <text x="20" y="202" fill="#991B1B" font-size="12">• Kein Lernpartner für Berufsschule /</text>
    <text x="20" y="222" fill="#991B1B" font-size="12">  Anerkennungsprüfung</text>
    <rect x="20" y="262" width="258" height="54" rx="8" fill="#FEE2E2"/>
    <text x="149" y="285" text-anchor="middle" fill="#991B1B" font-size="12" font-weight="700">Ausfallrisiko bei Krankheit/Kündigung:</text>
    <text x="149" y="304" text-anchor="middle" fill="#DC2626" font-size="13" font-weight="800">100 % Projektverlust</text>
  </g>

  <!-- Right Box: Tandem / Cohort -->
  <g transform="translate(378, 114)">
    <rect width="298" height="336" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
    <rect width="298" height="42" rx="10" fill="#15803D"/>
    <text x="149" y="26" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Tandem / Kohorte (2 bis 5 Talente)</text>
    <text x="20" y="74" fill="#14532D" font-size="13" font-weight="700">Operative &amp; finanzielle Vorteile:</text>
    <text x="20" y="102" fill="#166534" font-size="12">• Soziale Stabilität &amp; gegenseitige Stütze</text>
    <text x="20" y="128" fill="#166534" font-size="12">• 2er-/3er-WG senkt Wohnkosten pro Kopf</text>
    <text x="20" y="148" fill="#166534" font-size="12">  um ca. 35–45 % (Sperrkonto-Vorteil!)</text>
    <text x="20" y="176" fill="#166534" font-size="12">• Gebündelte Behördengänge, Konten &amp;</text>
    <text x="20" y="196" fill="#166534" font-size="12">  Einarbeitung durch Ausbilder/Paten</text>
    <text x="20" y="224" fill="#166534" font-size="12">• Lerntandem für Fachbegriffe &amp; Prüfungen</text>
    <rect x="20" y="262" width="258" height="54" rx="8" fill="#DCFCE7"/>
    <text x="149" y="285" text-anchor="middle" fill="#14532D" font-size="12" font-weight="700">Verbleibquote nach 24 Monaten:</text>
    <text x="149" y="304" text-anchor="middle" fill="#15803D" font-size="13" font-weight="800">&gt; 92 % im Tandem-Modell</text>
  </g>

  <rect x="44" y="468" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="490" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">DMF-Empfehlung: Stellen Sie Kandidaten als bereits in Vietnam eingespieltes Lerntandem ein</text>
</svg>""",

    # 126: Babyboomer-Rentenwelle 2027–2030
    "babyboomer-rentenwelle-wissenstransfer-tandem-zeitstrahl.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Generationsbrücke 2027–2030: Wissenstransfer vor dem Ruhestand</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Überlappungsmodell zwischen erfahrenen Leistungsträgern (Jahrgänge 1961–1965) und Nachwuchs</text>

  <!-- Timeline Comparison -->
  <g transform="translate(44, 114)">
    <rect width="632" height="150" rx="10" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5"/>
    <text x="20" y="30" fill="#991B1B" font-size="15" font-weight="700">Szenario A: Reaktive Nachbesetzung (Zu spät gestartet)</text>
    <rect x="20" y="48" width="260" height="34" rx="6" fill="#64748B"/>
    <text x="150" y="70" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Altgeselle / Meister bis Renteneintritt</text>
    <rect x="290" y="48" width="120" height="34" rx="6" fill="#DC2626"/>
    <text x="350" y="70" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">9–12 Mon. Vakanz</text>
    <rect x="420" y="48" width="192" height="34" rx="6" fill="#991B1B"/>
    <text x="516" y="70" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Neustart ohne Einarbeitung</text>
    <text x="20" y="112" fill="#7F1D1D" font-size="12">• Implizites Erfahrungswissen (Kundenhistorie, Spezialmaschinen, Werkzeugbau) geht unwiederbringlich verloren</text>
    <text x="20" y="132" fill="#7F1D1D" font-size="12">• Auftragsablehnung und Überlastung des verbleibenden Stammteams</text>
  </g>

  <g transform="translate(44, 286)">
    <rect width="632" height="168" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
    <text x="20" y="30" fill="#14532D" font-size="15" font-weight="700">Szenario B: Strategische 24-Monats-Überlappung (DMF-Generationsmodell)</text>
    <rect x="20" y="48" width="380" height="30" rx="6" fill="#003366"/>
    <text x="210" y="68" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Erfahrener Meister / Facharbeiter (letzte 24–36 Berufsjahre-Monate)</text>
    <rect x="180" y="84" width="432" height="30" rx="6" fill="#FF6600"/>
    <text x="396" y="104" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Vietnamesische Fachkraft / Azubi (12–24 Monate gemeinsame Tandem-Phase)</text>
    <text x="20" y="136" fill="#166534" font-size="12">• Strukturierte Übergabe von Handgriffen, Qualitätsstandards und Betriebsabläufen im Alltag</text>
    <text x="20" y="156" fill="#166534" font-size="12">• Nahtlose Weiterführung von Produktionslinien und Kundenprojekten am Tag des Renteneintritts</text>
  </g>

  <rect x="44" y="470" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="492" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Planungsregel: Starten Sie das Recruiting mindestens 18 bis 30 Monate vor dem geplanten Ruhestand</text>
</svg>""",

    # 127: Probezeit-Management 6-Monats-Leitfaden
    "probezeit-management-180-tage-meilensteinplan.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Der 180-Tage-Fahrplan für die Probezeit (§ 20 BBiG / § 622 BGB)</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Strukturierte Führung internationaler Auszubildender und Fachkräfte durch Ausbilder &amp; Meister</text>

  <!-- 4 Phases Grid -->
  <g transform="translate(44, 112)">
    <rect width="304" height="165" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">Tag 1 bis 30: Ankommen &amp; Sicherheit</text>
    <text x="16" y="62" fill="#0F172A" font-size="12" font-weight="700">Operative Schwerpunkte:</text>
    <text x="16" y="84" fill="#334155" font-size="11">• Behördengänge, Bürgeramt, Girokonto, eAT</text>
    <text x="16" y="104" fill="#334155" font-size="11">• Arbeitsschutz-Unterweisung mit Bildkarten</text>
    <text x="16" y="124" fill="#334155" font-size="11">• Festes Paten-Tandem in der Schicht/Abteilung</text>
    <text x="16" y="148" fill="#FF6600" font-size="11" font-weight="700">Meilenstein: 1. Feedbackgespräch am Tag 30</text>
  </g>

  <g transform="translate(372, 112)">
    <rect width="304" height="165" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">Tag 31 bis 60: Fachwortschatz &amp; Routine</text>
    <text x="16" y="62" fill="#0F172A" font-size="12" font-weight="700">Operative Schwerpunkte:</text>
    <text x="16" y="84" fill="#334155" font-size="11">• Checklisten für wiederkehrende Arbeitsgänge</text>
    <text x="16" y="104" fill="#334155" font-size="11">• Prinzip „Vormachen – Nachmachen – Erklären“</text>
    <text x="16" y="124" fill="#334155" font-size="11">• Überwindung des 6-Wochen-Kulturschocks</text>
    <text x="16" y="148" fill="#FF6600" font-size="11" font-weight="700">Meilenstein: Lernziel-Abgleich am Tag 60</text>
  </g>

  <g transform="translate(44, 294)">
    <rect width="304" height="165" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#FF6600"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">Tag 61 bis 120: Eigenständigkeit &amp; Schule</text>
    <text x="16" y="62" fill="#7C2D12" font-size="12" font-weight="700">Operative Schwerpunkte:</text>
    <text x="16" y="84" fill="#7C2D12" font-size="11">• Erste Teilaufgaben in Eigenverantwortung</text>
    <text x="16" y="104" fill="#7C2D12" font-size="11">• Kontrolle Berichtsheft &amp; Berufsschulnoten</text>
    <text x="16" y="124" fill="#7C2D12" font-size="11">• Offene Fehlerkultur statt Gesichtsverlust</text>
    <text x="16" y="148" fill="#9A3412" font-size="11" font-weight="700">Meilenstein: Halbzeit-Bilanz am Tag 90/120</text>
  </g>

  <g transform="translate(372, 294)">
    <rect width="304" height="165" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#15803D"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">Tag 121 bis 180: Übernahme &amp; Perspektive</text>
    <text x="16" y="62" fill="#14532D" font-size="12" font-weight="700">Operative Schwerpunkte:</text>
    <text x="16" y="84" fill="#166534" font-size="11">• Volle Integration in Schicht- und Dienstpläne</text>
    <text x="16" y="104" fill="#166534" font-size="11">• Offizielle Bestätigung der bestandenen Probezeit</text>
    <text x="16" y="124" fill="#166534" font-size="11">• Entwicklungsplan für Lehrjahr 2 / Anerkennung</text>
    <text x="16" y="148" fill="#15803D" font-size="11" font-weight="700">Meilenstein: Langfristige Bindung gesichert</text>
  </g>

  <rect x="44" y="472" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="494" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Wichtig: In der südostasiatischen Kultur bedeutet „Ja“ oft „Ich habe Sie gehört“ – nutzen Sie Rückfragen!</text>
</svg>""",

    # 128: Berlin & Brandenburg
    "berlin-brandenburg-wirtschaftscluster-lea-verfahren.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Hauptstadtregion Berlin &amp; Brandenburg: Branchen &amp; Behördenwege</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Standortvorteile durch die größte vietnamesische Community Deutschlands (&gt; 40.000 Menschen)</text>

  <!-- Left: Berlin -->
  <g transform="translate(44, 114)">
    <rect width="304" height="260" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Metropole Berlin</text>
    <text x="18" y="68" fill="#003366" font-size="13" font-weight="700">Kernbranchen mit Höchstbedarf:</text>
    <text x="18" y="92" fill="#334155" font-size="12">• Kliniken, Seniorenpflege &amp; Medizintechnik</text>
    <text x="18" y="114" fill="#334155" font-size="12">• Hauptstadt-Hotellerie, Kongresse &amp; Gastro</text>
    <text x="18" y="136" fill="#334155" font-size="12">• SHK, Elektrohandwerk &amp; Gebäudetechnik</text>
    <text x="18" y="168" fill="#003366" font-size="13" font-weight="700">Behörden-Infrastruktur:</text>
    <text x="18" y="192" fill="#334155" font-size="11">• Landesamt für Einwanderung (LEA Berlin)</text>
    <text x="18" y="212" fill="#334155" font-size="11">  Business Immigration Service (BIS) &amp; § 81a</text>
    <text x="18" y="232" fill="#334155" font-size="11">• LaGeSo Berlin (Gesundheitsfachberufe)</text>
  </g>

  <!-- Right: Brandenburg -->
  <g transform="translate(372, 114)">
    <rect width="304" height="260" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Wachstumsland Brandenburg</text>
    <text x="18" y="68" fill="#9A3412" font-size="13" font-weight="700">Industrie- &amp; Wirtschaftscluster:</text>
    <text x="18" y="92" fill="#7C2D12" font-size="12">• E-Mobilität, Batteriezellfertigung &amp; Zulieferer</text>
    <text x="18" y="114" fill="#7C2D12" font-size="12">  (Grünheide, Lausitz, Oberhavel)</text>
    <text x="18" y="136" fill="#7C2D12" font-size="12">• Logistik-Drehkreuz BER &amp; Ernährungswirtschaft</text>
    <text x="18" y="158" fill="#7C2D12" font-size="12">• Tourismus (Spreewald, Potsdam, Seenland)</text>
    <text x="18" y="186" fill="#9A3412" font-size="13" font-weight="700">Behörden-Infrastruktur:</text>
    <text x="18" y="210" fill="#7C2D12" font-size="11">• ZABH Frankfurt (Oder) – Fachkräfteeinwanderung</text>
    <text x="18" y="230" fill="#7C2D12" font-size="11">• LAVG Brandenburg (Anerkennung Pflege)</text>
  </g>

  <!-- Bottom Synergy Banner -->
  <rect x="44" y="394" width="632" height="106" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
  <text x="64" y="422" fill="#14532D" font-size="14" font-weight="700">Der entscheidende Standortvorteil für Arbeitgeber in Berlin &amp; Brandenburg:</text>
  <text x="64" y="446" fill="#166534" font-size="12">• Hervorragende soziale Infrastruktur (vietnamesische Vereine, Märkte wie das Dong Xuan Center, Kulturangebote)</text>
  <text x="64" y="468" fill="#166534" font-size="12">• S-Bahn-/Regionalbahn-Pendelachsen ermöglichen günstiges Wohnen im Umland bei schneller Erreichbarkeit</text>
  <text x="64" y="488" fill="#15803D" font-size="12" font-weight="700">• Überdurchschnittlich hohe Bleibequote durch familiäre und kulturelle Anbindung in der Region</text>
</svg>""",

    # 129: Hamburg & Schleswig-Holstein
    "hamburg-schleswig-holstein-maritime-wirtschaft-welcome-center.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Norddeutschland-Achse: Hamburg &amp; Schleswig-Holstein</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Fachkräfte &amp; Auszubildende für Hafenlogistik, Luftfahrt, Erneuerbare Energien, Pflege &amp; Küste</text>

  <!-- Hamburg Card -->
  <g transform="translate(44, 114)">
    <rect width="304" height="260" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Freie und Hansestadt Hamburg</text>
    <text x="18" y="68" fill="#003366" font-size="13" font-weight="700">Schlüsselbranchen:</text>
    <text x="18" y="92" fill="#334155" font-size="12">• Hafenlogistik, Spedition &amp; Schiffbau-Zulieferer</text>
    <text x="18" y="114" fill="#334155" font-size="12">• Luftfahrtindustrie &amp; CNC-Präzisionstechnik</text>
    <text x="18" y="136" fill="#334155" font-size="12">• Kliniken, Pflegeheime &amp; Stadt-Hotellerie</text>
    <text x="18" y="168" fill="#003366" font-size="13" font-weight="700">Institutionelle Abwicklung:</text>
    <text x="18" y="192" fill="#334155" font-size="11">• Hamburg Welcome Center (HWC) für § 81a</text>
    <text x="18" y="212" fill="#334155" font-size="11">• Handelskammer &amp; Handwerkskammer Hamburg</text>
    <text x="18" y="232" fill="#334155" font-size="11">• Direktflüge &amp; schnelle Anbindung ab Airport HAM</text>
  </g>

  <!-- Schleswig-Holstein Card -->
  <g transform="translate(372, 114)">
    <rect width="304" height="260" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Schleswig-Holstein (Zwischen den Meeren)</text>
    <text x="18" y="68" fill="#9A3412" font-size="13" font-weight="700">Schlüsselbranchen:</text>
    <text x="18" y="92" fill="#7C2D12" font-size="12">• Nord- &amp; Ostsee-Hotellerie (Sylt, Lübecker Bucht)</text>
    <text x="18" y="114" fill="#7C2D12" font-size="12">• Windenergie, Netztechnik &amp; Elektrotechnik</text>
    <text x="18" y="136" fill="#7C2D12" font-size="12">• Medizintechnik (Lübeck/Kiel) &amp; Ernährung</text>
    <text x="18" y="168" fill="#9A3412" font-size="13" font-weight="700">Institutionelle Abwicklung:</text>
    <text x="18" y="192" fill="#7C2D12" font-size="11">• Landesamt für Zuwanderung und Flüchtlinge</text>
    <text x="18" y="212" fill="#7C2D12" font-size="11">  (LaZuF SH) in Neumünster – § 81a Zentrale</text>
    <text x="18" y="232" fill="#7C2D12" font-size="11">• IHK-Verbund Schleswig-Holstein &amp; HWK Lübeck</text>
  </g>

  <!-- Bottom Box -->
  <rect x="44" y="394" width="632" height="106" rx="10" fill="#003366"/>
  <text x="64" y="424" fill="#FF6600" font-size="14" font-weight="700">Praxislösung für Saison- und Küstenbetriebe im Norden:</text>
  <text x="64" y="448" fill="#FFFFFF" font-size="12">• Ganzjahresverträge statt kurzfristiger Saisonlücken sichern die Visumfähigkeit nach § 16a / § 18a AufenthG</text>
  <text x="64" y="470" fill="#CBD5E1" font-size="12">• Kombination aus Personalunterkunft vor Ort und Tandem-Recruiting sorgt für hohe Bindung auf Inseln &amp; an der Küste</text>
</svg>""",

    # 130: Rheinland-Pfalz & Saarland
    "rheinland-pfalz-saarland-zfe-kaiserslautern-turbo-prozess.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Südwest-Industrie &amp; Pflege: Rheinland-Pfalz &amp; Saarland</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Beschleunigte Verfahren über die ZFE Kaiserslautern und das Landesamt in Lebach</text>

  <!-- Left: RLP -->
  <g transform="translate(44, 114)">
    <rect width="304" height="255" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Rheinland-Pfalz (RLP)</text>
    <text x="18" y="68" fill="#003366" font-size="13" font-weight="700">Zentrale Behörde (§ 81a AufenthG):</text>
    <text x="18" y="90" fill="#15803D" font-size="12" font-weight="700">ZFE Kaiserslautern</text>
    <text x="18" y="108" fill="#475569" font-size="11">Zentrale Stelle für Fachkräfteeinwanderung</text>
    <text x="18" y="138" fill="#003366" font-size="13" font-weight="700">Wirtschaftsregionen &amp; Bedarf:</text>
    <text x="18" y="160" fill="#334155" font-size="11">• Ludwigshafen / Vorderpfalz: Chemie &amp; Anlagenbau</text>
    <text x="18" y="180" fill="#334155" font-size="11">• Mainz / Rheinhessen: Pharma, BioTech &amp; Kliniken</text>
    <text x="18" y="200" fill="#334155" font-size="11">• Koblenz / Mittelrhein / Mosel: Hotellerie &amp; Metall</text>
    <text x="18" y="220" fill="#334155" font-size="11">• Landesamt für Soziales (LSJV) für Pflegeberufe</text>
  </g>

  <!-- Right: Saarland -->
  <g transform="translate(372, 114)">
    <rect width="304" height="255" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Saarland</text>
    <text x="18" y="68" fill="#9A3412" font-size="13" font-weight="700">Zentrale Behörde (§ 81a AufenthG):</text>
    <text x="18" y="90" fill="#C2410C" font-size="12" font-weight="700">Zentrale Ausländerbehörde Lebach</text>
    <text x="18" y="108" fill="#7C2D12" font-size="11">Kurze Entscheidungswege im kompakten Bundesland</text>
    <text x="18" y="138" fill="#9A3412" font-size="13" font-weight="700">Transformation &amp; Kernbranchen:</text>
    <text x="18" y="160" fill="#7C2D12" font-size="11">• Saarbrücken / Saarlouis: Metall, Stahl &amp; Zulieferer</text>
    <text x="18" y="180" fill="#7C2D12" font-size="11">• Mechatronik, Industrieelektrik &amp; SHK-Handwerk</text>
    <text x="18" y="200" fill="#7C2D12" font-size="11">• Stationäre &amp; ambulante Altenpflege im ganzen Land</text>
    <text x="18" y="220" fill="#7C2D12" font-size="11">• IHK Saarland &amp; HWK des Saarlandes</text>
  </g>

  <!-- Bottom Process Advantage -->
  <rect x="44" y="388" width="632" height="112" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
  <text x="64" y="416" fill="#14532D" font-size="14" font-weight="700">Warum Arbeitgeber in RLP &amp; im Saarland besonders schnell rekrutieren können:</text>
  <text x="64" y="440" fill="#166534" font-size="12">1. Die ZFE Kaiserslautern bündelt das § 81a-Verfahren landesweit digital und entlastet kommunale Kreisverwaltungen.</text>
  <text x="64" y="462" fill="#166534" font-size="12">2. Bezahlbarer Wohnraum in Mittelzentren (Pfalz, Hunsrück, Westerwald, Saarpfalz) erleichtert das Onboarding.</text>
  <text x="64" y="484" fill="#15803D" font-size="12" font-weight="700">3. Nähe zum Flughafen Frankfurt (FRA) garantiert unkomplizierte Anreise und Abholung der Talente.</text>
</svg>""",

    # 131: Mecklenburg-Vorpommern & Sachsen-Anhalt
    "mecklenburg-vorpommern-sachsen-anhalt-branchen-fokus.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Mecklenburg-Vorpommern &amp; Sachsen-Anhalt: Bedarfscluster</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Demografische Sicherung für Ostsee-Tourismus, Chemie-Dreieck, Maschinenbau &amp; Pflege</text>

  <!-- Left: MV -->
  <g transform="translate(44, 114)">
    <rect width="304" height="255" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Mecklenburg-Vorpommern (MV)</text>
    <text x="18" y="68" fill="#003366" font-size="13" font-weight="700">Branchen mit akutem Personalbedarf:</text>
    <text x="18" y="92" fill="#334155" font-size="11">• Ostsee-Hotellerie &amp; Gastronomie (Rügen, Usedom,</text>
    <text x="18" y="110" fill="#334155" font-size="11">  Fischland-Darß, Kühlungsborn, Seenplatte)</text>
    <text x="18" y="132" fill="#334155" font-size="11">• Maritime Wirtschaft &amp; Werften (Rostock, Wismar)</text>
    <text x="18" y="152" fill="#334155" font-size="11">• Lebensmittelverarbeitung &amp; Gesundheitswesen</text>
    <text x="18" y="182" fill="#003366" font-size="13" font-weight="700">Wichtige Institutionen:</text>
    <text x="18" y="204" fill="#334155" font-size="11">• LAGuS MV (Anerkennung Gesundheitsberufe)</text>
    <text x="18" y="224" fill="#334155" font-size="11">• IHKs zu Rostock, Schwerin und Neubrandenburg</text>
  </g>

  <!-- Right: Sachsen-Anhalt -->
  <g transform="translate(372, 114)">
    <rect width="304" height="255" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="152" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="700">Sachsen-Anhalt</text>
    <text x="18" y="68" fill="#9A3412" font-size="13" font-weight="700">Branchen mit akutem Personalbedarf:</text>
    <text x="18" y="92" fill="#7C2D12" font-size="11">• Mitteldeutsches Chemiedreieck (Leuna, Bitterfeld,</text>
    <text x="18" y="110" fill="#7C2D12" font-size="11">  Schkopau) – Chemikanten &amp; Industriemechaniker</text>
    <text x="18" y="132" fill="#7C2D12" font-size="11">• Magdeburg &amp; Halle: Maschinenbau, Logistik, Bau</text>
    <text x="18" y="152" fill="#7C2D12" font-size="11">• Harz-Tourismus &amp; flächendeckende Altenpflege</text>
    <text x="18" y="182" fill="#9A3412" font-size="13" font-weight="700">Wichtige Institutionen:</text>
    <text x="18" y="204" fill="#7C2D12" font-size="11">• Landesverwaltungsamt Sachsen-Anhalt (Halle)</text>
    <text x="18" y="224" fill="#7C2D12" font-size="11">• WelcomeCenter Sachsen-Anhalt &amp; IHK/HWK</text>
  </g>

  <!-- Bottom Box -->
  <rect x="44" y="388" width="632" height="112" rx="10" fill="#003366"/>
  <text x="64" y="416" fill="#FF6600" font-size="14" font-weight="700">Standort-Hebel für Arbeitgeber in MV &amp; Sachsen-Anhalt:</text>
  <text x="64" y="440" fill="#FFFFFF" font-size="12">• Historisch gewachsene vietnamesische Gemeinschaften in Rostock, Schwerin, Magdeburg, Halle und Dessau</text>
  <text x="64" y="462" fill="#CBD5E1" font-size="12">• Moderate Mietpreise ermöglichen Auszubildenden eine sichere Lebensführung ohne finanzielle Überlastung</text>
  <text x="64" y="484" fill="#FFFFFF" font-size="12" font-weight="600">• Tandem-Einstellungen (2–4 Azubis pro Betrieb) sichern den Fachkräftenachwuchs unabhängig vom lokalen Schulabgänger-Rückgang</text>
</svg>""",
}


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, content in SVGS.items():
        path = OUT_DIR / filename
        path.write_text(content.strip() + "\n", encoding="utf-8")
        print(f"OK: {filename} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
