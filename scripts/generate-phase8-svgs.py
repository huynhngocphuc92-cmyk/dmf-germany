#!/usr/bin/env python3
"""
Generate 12 Custom Vector SVG Infographics for Phase 8 Articles (720x540 px).
Color Palette:
- Primary Navy: #003366
- Accent Orange: #FF6600
- Secondary Slate: #64748B
- Background Tint: #F8FAFC
- Card Fill: #FFFFFF
- Border: #E2E8F0
- Text Primary: #1E293B
- Text Secondary: #475569
"""

from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

SVGS = {}

# 1. Feinwerkmechanik Formenbau Prozesskette
SVGS["feinwerkmechanik-formenbau-prozesskette.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Präzisionswerkzeugbau: Prozesskette im Formenbau</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, -apple-system, sans-serif" font-size="13" text-anchor="middle">Vom CAD-Datensatz bis zur mikrometergenauen Freigabe nach DIN ISO 1101</text>

  <!-- Step 1 -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <circle cx="45" cy="37" r="18" fill="#FF6600"/>
    <text x="45" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">1</text>
    <text x="80" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3D-CAD/CAM Konstruktion &amp; Elektrodenableitung</text>
    <text x="80" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Import von STEP/Parasolid, Werkzeugteilung, Ableitung von Kupferelektroden</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <circle cx="45" cy="37" r="18" fill="#003366"/>
    <text x="45" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">2</text>
    <text x="80" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">5-Achs-HSC-Fräsen &amp; Erodiertechnik (EDM)</text>
    <text x="80" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Hartfräsen gehärteter Formeinsätze, Drahterodieren (WEDM) und Senkerodieren</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <circle cx="45" cy="37" r="18" fill="#003366"/>
    <text x="45" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">3</text>
    <text x="80" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Manuelle Tuschierung &amp; Hochglanzpolitur</text>
    <text x="80" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Passungstest auf Tuschierpressen, Diamantpolitur für optische Oberflächen (Ra &lt; 0,05 µm)</text>
  </g>

  <!-- Step 4 -->
  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <circle cx="45" cy="37" r="18" fill="#003366"/>
    <text x="45" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">4</text>
    <text x="80" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3D-Koordinatenmesstechnik &amp; Erstbemusterung (EMPB)</text>
    <text x="80" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Prüfung von Form- und Lagetoleranzen nach DIN ISO 1101, FAI-Prüfbericht</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Qualifikationsstandard: Handwerksordnung Anlage A Nr. 7 (Feinwerkmechaniker)</text>
</svg>"""

# 2. Brauprozess & HACCP IFS
SVGS["brauprozess-qualitaet-haccp-ifs.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Brau- &amp; Getränketechnologie: Qualitätssicherung</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Vorgaben nach Vorläufigem Biergesetz (BierStG), IFS Food v8 und HACCP</text>

  <!-- Grid 4 Cards -->
  <g transform="translate(50, 130)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#003366"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">1. Sudhaus &amp; Würzekochen</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Rezeptur &amp; Maischverfahren:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Einhaltung Reinheitsgebot (BierStG)</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Läutern &amp; Stammwürze-Einstellung (°P)</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Whirlpool-Klärung &amp; Würzebelüftung</text>
  </g>

  <g transform="translate(375, 130)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#FF6600"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">2. Gärung &amp; Kaltreifung</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Mikrobiologische Kontrolle:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Reinzuchthefenführung &amp; Zellzählung</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Druck- und Temperaturkurven ZKT</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Diacetylabbau &amp; Kaltreifung bei 0 °C</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#003366"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">3. Filtration &amp; CIP-Reinigung</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Hygienemanagement (HACCP):</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Kieselgur- &amp; Schichtenfiltration</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• CIP-Säure-/Lauge-Kreisläufe (Cleaning in Place)</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• ATP-Hygienemonitoring nach DIN 10516</text>
  </g>

  <g transform="translate(375, 310)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#003366"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">4. Abfüllung &amp; IFS Food</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Endproduktkontrolle:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Isobarometrische Flaschen-/Fassabfüllung</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Restsauerstoffmessung (DO-Wert &lt; 50 ppb)</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Lückenlose Chargenrückverfolgung</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Berufsbild: Brauer und Mälzer / Fachkraft für Getränketechnologie (BBiG)</text>
</svg>"""

# 3. Schornsteinfeger Sicherheitsprüfung
SVGS["schornsteinfeger-sicherheitspruefung-schema.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Schornsteinfeger-Handwerk: Gesetzlicher Prüfzyklus</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Aufgaben nach SchfHwG, 1. BImSchV und Kehr- und Überprüfungsordnung (KÜO)</text>

  <!-- 4 Step Flow -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Feuerstättenschau (Hoheitliche Aufgabe nach § 14 SchfHwG)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Durchführung zweimal in 7 Jahren durch den bevollmächtigten Bezirksschornsteinfeger.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Emissions- &amp; Abgasmessung nach 1. BImSchV</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Prüfung von Abgasverlust, Rußzahl, CO-Gehalt und Staubemissionen bei Öl-, Gas- und Feststoffkesseln.</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Kehrung &amp; Überprüfung der Abgasanlage (KÜO)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Reinigung von Schornsteinen, Verbindungsstücken und Lüftungsanlagen zur Brandverhütung.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. Energieberatung &amp; Gebäudeenergiegesetz (GEG)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Beratung zu Wärmepumpen, Hybridheizungen und Ausstellung des elektronischen Feuerstättenbescheids.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Zulassungspflichtiges Handwerk: Handwerksordnung Anlage A Nr. 11</text>
</svg>"""

# 4. EASA Part-66 Lizenzierungsstufen
SVGS["easa-part66-lizenzierungsstufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Fluggerätmechaniker: EASA Part-66 Lizenzstruktur</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Qualifikationsstufen für Luftfahrzeuginstandhaltung nach europäischem Luftfahrtrecht</text>

  <!-- Step 1 -->
  <g transform="translate(50, 130)">
    <rect width="620" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="95" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#003366" font-family="system-ui, sans-serif" font-size="16" font-weight="700">Kategorie A: Freigabeberechtigtes Personal für Linienwartung</text>
    <text x="35" y="55" fill="#1E293B" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Befugnis: Freigabe einfacher planmäßiger Streckenwartungsarbeiten (Line Maintenance)</text>
    <text x="35" y="75" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Voraussetzung: 800 Unterrichtsstunden Grundausbildung + mind. 1 Jahr praktische Erfahrung.</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(50, 245)">
    <rect width="620" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="95" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#FF6600" font-family="system-ui, sans-serif" font-size="16" font-weight="700">Kategorie B1 (Mechanik) / B2 (Avionik): Technisches Prüfpersonal</text>
    <text x="35" y="55" fill="#1E293B" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Befugnis: Vollständige Freigabe von Struktur, Triebwerken und Elektroniksystemen</text>
    <text x="35" y="75" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Voraussetzung: 2.400 Ausbildungsstunden + bis zu 3 Jahre Praxis an Verkehrsflugzeugen.</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(50, 360)">
    <rect width="620" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="95" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#003366" font-family="system-ui, sans-serif" font-size="16" font-weight="700">Kategorie C: Freigabe nach Großwartung (Base Maintenance)</text>
    <text x="35" y="55" fill="#1E293B" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Befugnis: Ausstellung des Certificate of Release to Service (CRS) nach D-Check / C-Check</text>
    <text x="35" y="75" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Voraussetzung: Mehrjährige Tätigkeit als B1/B2-Ingenieur oder akademischer Luftfahrtingenieur.</text>
  </g>

  <rect x="50" y="480" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="502" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Sicherheitsanforderung: Zuverlässigkeitsüberprüfung (ZÜP nach § 7 LuftSiG) zwingend erforderlich</text>
</svg>"""

# 5. MTL Laboranalytik Arbeitsablauf
SVGS["mtl-laboranalytik-arbeitsablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Medizinische Technologen für Laboratoriumsanalytik (MTL)</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Diagnostischer Workflow im medizinischen Labor nach MTL-Gesetz und Rili-BÄK</text>

  <!-- 4 Columns Horizontal Flow -->
  <g transform="translate(50, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">1. Präanalytik</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Probenannahme</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Barcode-Scan (LIS)</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Hämolyse-Prüfung</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Zentrifugation</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Aliquotierung</text>
  </g>

  <g transform="translate(210, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#FF6600"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">2. Hämatologie</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Großes Blutbild</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Durchflusszytometrie</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Manuelle Differenzierung</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Blutausstriche</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Gerinnungsdiagnostik</text>
  </g>

  <g transform="translate(370, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">3. Klin. Chemie / PCR</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Elektrolyte, Enzyme</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Immunoassays (ELISA)</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Real-Time RT-PCR</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Erregernachweis</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Resistenzbestimmung</text>
  </g>

  <g transform="translate(530, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">4. Freigabe &amp; QC</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Interne Qualitätskontrolle</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Rili-BÄK Tabellen</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Plausibilitätsprüfung</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Technische Validation</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Laborarzt-Befundung</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Rechtliche Grundlage: Gesetz über die Berufe in der medizinischen Technologie (MTLG 2023)</text>
</svg>"""

# 6. MTR Radiologie Workflow
SVGS["mtr-radiologie-workflow-strahlenschutz.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Medizinische Technologen für Radiologie (MTR)</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Prüfschritte im radiologischen Untersuchungsablauf nach StrlSchG und ALARA-Prinzip</text>

  <!-- 4 Step Process -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Rechtfertigende Indikation &amp; Patientenvorbereitung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Prüfung des Facharztantrags nach § 83 StrlSchG; Ausschluss von Schwangerschaft und Metallimplantaten (MRT).</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Bildakquisition nach dem ALARA-Prinzip</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">As Low As Reasonably Achievable: Dosisoptimierung bei CT (kV/mAs-Modulation) und digitalem Röntgen.</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Kontrastmittel-Management &amp; Vitalüberwachung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Sichere Bedienung automatischer Hochdruckinjektoren; Prüfung von Nierenwerten (GFR/Kreatinin) und TSH.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. 3D-Rekonstruktion &amp; PACS-Übertragung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">MPR/MIP/VRT-Rekonstruktionen; lückenlose Dokumentation des Dosislängenprodukts (DLP) im Radiologie-System.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Gesetzliche Fachkunde im Strahlenschutz nach § 47 StrlSchV</text>
</svg>"""

# 7. Augenoptik Anpassungs-Workflow
SVGS["augenoptik-anpassungs-workflow.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Augenoptiker-Handwerk: Ablauf der Brillenanpassung</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Präzisionshandwerk nach ZVA-Richtlinien und RAL-RG 915 Gütebestimmungen</text>

  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Anamnese &amp; Refraktionsbestimmung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Objektive Autorefraktion &amp; subjektiver Feinabgleich (Sphäre, Zylinder, Achse, Nahzusatz/Addition).</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Fassungs- &amp; Glasberatung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Bedarfsanalyse für Einstärken-, Gleitsicht- oder Arbeitsplatzgläser; Materialwahl (Index 1.5 bis 1.74).</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Videozentrierung &amp; 3D-Vermessung (RAL-RG 915)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Messung von Pupillendistanz (PD), Einschleifhöhe, Vorneigung (Pan-Winkel) und Hornhautscheitelabstand (HSA).</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. CNC-Formrandung &amp; Endkontrolle</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Einschleifen der Brillengläser auf CNC-Schleifautomaten, Facettieren, Einpassen und anatomische Ausrichtung.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Zulassungspflichtiges Handwerk: Handwerksordnung Anlage A Nr. 12</text>
</svg>"""

# 8. Betriebsrat Mitbestimmung § 99 BetrVG
SVGS["betriebsrat-99-betrvg-prueffrist-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Betriebsrat &amp; Mitbestimmung nach § 99 BetrVG</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Gesetzliche Wochenfrist und Prüfschritte bei Einstellungen aus Drittstaaten</text>

  <!-- Timeline Flow -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="30" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 1: Vollständige schriftliche Unterrichtung des Betriebsrats</text>
    <text x="35" y="52" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Vorlage von Bewerbungsunterlagen, Arbeitsvertragsentwurf, geplanter Eingruppierung und Tätigkeitsbeschreibung.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="85" rx="8" fill="#FFFFFF" stroke="#FF6600" stroke-width="2"/>
    <rect width="8" height="85" rx="4" fill="#FF6600"/>
    <text x="35" y="30" fill="#FF6600" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Schritt 2: Gesetzliche Ein-Wochen-Frist (§ 99 Abs. 3 BetrVG)</text>
    <text x="35" y="52" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">• Beginn: Am Tag nach Zugang der vollständigen Unterlagen beim Betriebsrat.</text>
    <text x="35" y="70" fill="#475569" font-family="system-ui, sans-serif" font-size="12">• Reagiert der Betriebsrat nicht binnen einer Woche, gilt die Zustimmung als erteilt (Zustimmungsfiktion).</text>
  </g>

  <g transform="translate(50, 320)">
    <rect width="620" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="85" rx="4" fill="#003366"/>
    <text x="35" y="30" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 3: Zulässige Widerspruchsgründe (§ 99 Abs. 2 BetrVG)</text>
    <text x="35" y="52" fill="#475569" font-family="system-ui, sans-serif" font-size="12">• Nur abschließende gesetzliche Gründe: z. B. Gesetzesverstoß, Benachteiligung vorhandener Mitarbeiter.</text>
    <text x="35" y="70" fill="#475569" font-family="system-ui, sans-serif" font-size="12">• Drittstaatsangehörigkeit oder ausländische Herkunft stellen KEINEN zulässigen Verweigerungsgrund dar.</text>
  </g>

  <g transform="translate(50, 420)">
    <rect width="620" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="85" rx="4" fill="#003366"/>
    <text x="35" y="30" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 4: Lösung bei unberechtigtem Widerspruch</text>
    <text x="35" y="52" fill="#475569" font-family="system-ui, sans-serif" font-size="12">• Antrag des Arbeitgebers beim Arbeitsgericht auf Zustimmungsersetzung (§ 99 Abs. 4 BetrVG).</text>
    <text x="35" y="70" fill="#475569" font-family="system-ui, sans-serif" font-size="12">• Vorläufige personelle Maßnahme bei dringender betrieblicher Notwendigkeit nach § 100 BetrVG möglich.</text>
  </g>
</svg>"""

# 9. Rentenbeitrag Erstattung § 210 SGB VI
SVGS["rentenbeitrag-erstattung-210-sgb-vi-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Rentenbeitragserstattung bei Ausreise: § 210 SGB VI</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Rückzahlung gesetzlicher Rentenbeiträge bei dauerhafter Rückkehr ins Heimatland</text>

  <!-- Step 1 -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Beendigung des Aufenthalts in Deutschland</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Offizielle Abmeldung beim Einwohnermeldeamt, Erlöschen des Aufenthaltstitels und Rückkehr nach Vietnam.</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#FF6600" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Gesetzliche Wartefrist: 24 Kalendermonate (§ 210 Abs. 2 SGB VI)</text>
    <text x="35" y="55" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12">Seit Beendigung der Versicherungspflicht müssen mindestens 24 Monate ohne neue Beitragszahlung vergehen.</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Antragstellung bei der Deutschen Rentenversicherung (DRV)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Einreichung des Formulars V0901 über die Deutsche Botschaft Hanoi oder direkt postalisch an die DRV.</text>
  </g>

  <!-- Step 4 -->
  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. Auszahlung der reinen Arbeitnehmerbeiträge</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Überweisung der Arbeitnehmeranteile (ca. 9,3 % des Bruttogehalts). Der Arbeitgeberanteil verbleibt in der Rentenkasse.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Alternative: Ab 60 Beitragsmonaten (5 Jahre) besteht Anspruch auf deutsche Regelaltersrente im Ausland</text>
</svg>"""

# 10. ZAB Zeugnisbewertung Antragsschritte
SVGS["zab-zeugnisbewertung-antragsschritte.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">ZAB-Zeugnisbewertung: Ablauf &amp; Verifizierung</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Digitales Statement of Comparability der Zentralstelle für ausländisches Bildungswesen (KMK)</text>

  <!-- 4 Step Flow -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. anabin-Vorprüfung &amp; Dokumenten-Upload</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Prüfung des Hochschulstatus (H+) in der anabin-Datenbank; Upload von Diplom, Notenübersicht und Pass.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Gebührenzahlung (208 Euro)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Zahlung der gesetzlichen ZAB-Bearbeitungsgebühr (208 € für Erstausstellung, 104 € für jede weitere Bewertung).</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Gleichwertigkeitsprüfung durch KMK-Gutachter</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Vergleich des Curriculums mit deutschen Hochschulabschlüssen (Bachelor / Master) binnen 2–4 Wochen.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. Digitales Statement of Comparability</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Elektronisch signiertes PDF mit Verifizierungs-QR-Code zur Vorlage bei Botschaft und Ausländerbehörde.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Zwingende Visumvoraussetzung für die EU Blaue Karte (§ 18b Abs. 2 AufenthG)</text>
</svg>"""

# 11. Qualifizierungschancengesetz Förderstaffel
SVGS["qualifizierungschancengesetz-foerderstaffel-schema.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Betriebliche Förderung: § 82 SGB III</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Zuschüsse zu Lehrgangs- und Lohnkosten nach Betriebsgröße (Qualifizierungschancengesetz)</text>

  <!-- 3 Tier Cards -->
  <g transform="translate(50, 130)">
    <rect width="195" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="195" height="40" rx="8" fill="#FF6600"/>
    <text x="97" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Kleinstbetriebe</text>
    <text x="97" y="65" fill="#003366" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">&lt; 10 Beschäftigte</text>
    <line x1="20" y1="80" x2="175" y2="80" stroke="#E2E8F0"/>
    <text x="20" y="110" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Lehrgangskosten:</text>
    <text x="20" y="135" fill="#FF6600" font-family="system-ui, sans-serif" font-size="22" font-weight="800">bis zu 100 %</text>
    <text x="20" y="180" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Arbeitsentgeltzuschuss:</text>
    <text x="20" y="205" fill="#003366" font-family="system-ui, sans-serif" font-size="22" font-weight="800">bis zu 75 %</text>
    <text x="20" y="250" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Maximale Entlastung für Handwerks- und Praxisinhaber bei berufsbezogenen Deutschkursen.</text>
  </g>

  <g transform="translate(262, 130)">
    <rect width="195" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="195" height="40" rx="8" fill="#003366"/>
    <text x="97" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Mittelstand</text>
    <text x="97" y="65" fill="#003366" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">10 – 249 Beschäftigte</text>
    <line x1="20" y1="80" x2="175" y2="80" stroke="#E2E8F0"/>
    <text x="20" y="110" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Lehrgangskosten:</text>
    <text x="20" y="135" fill="#003366" font-family="system-ui, sans-serif" font-size="22" font-weight="800">bis zu 50 %</text>
    <text x="20" y="180" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Arbeitsentgeltzuschuss:</text>
    <text x="20" y="205" fill="#003366" font-family="system-ui, sans-serif" font-size="22" font-weight="800">bis zu 50 %</text>
    <text x="20" y="250" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Attraktive Kofinanzierung für Industrie- und Pflegebetriebe mit Weiterbildungsvereinbarung.</text>
  </g>

  <g transform="translate(475, 130)">
    <rect width="195" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="195" height="40" rx="8" fill="#003366"/>
    <text x="97" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Großunternehmen</text>
    <text x="97" y="65" fill="#003366" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">ab 250 Beschäftigte</text>
    <line x1="20" y1="80" x2="175" y2="80" stroke="#E2E8F0"/>
    <text x="20" y="110" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Lehrgangskosten:</text>
    <text x="20" y="135" fill="#003366" font-family="system-ui, sans-serif" font-size="22" font-weight="800">15 % – 25 %</text>
    <text x="20" y="180" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Arbeitsentgeltzuschuss:</text>
    <text x="20" y="205" fill="#003366" font-family="system-ui, sans-serif" font-size="22" font-weight="800">bis zu 25 %</text>
    <text x="20" y="250" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Förderung für großflächige Transformations- und Qualifizierungsprogramme im Konzern.</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Voraussetzung: AZAV-zertifizierte Maßnahme mit mehr als 120 Unterrichtsstunden</text>
</svg>"""

# 12. Statusfeststellung Scheinselbstständigkeit § 7a SGB IV
SVGS["statusfeststellung-clearingstelle-kriterienmatrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Statusfeststellung nach § 7a SGB IV: Abgrenzung</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Kriterien der Clearingstelle der DRV Bund: Selbstständigkeit vs. abhängige Beschäftigung</text>

  <!-- 2 Big Comparison Boxes -->
  <g transform="translate(50, 130)">
    <rect width="295" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="40" rx="8" fill="#003366"/>
    <text x="147" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Echte Selbstständigkeit (Freelancer)</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Rechtliche &amp; tatsächliche Merkmale:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Eigene Betriebsstätte &amp; eigene Arbeitsmittel</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Freie Zeiteinteilung und Ortswahl</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Echtes unternehmerisches Kapitalrisiko</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Recht zur Beauftragung Dritter/Subunternehmer</text>
    <text x="20" y="190" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Eigener Marktauftritt &amp; mehrere Auftraggeber</text>
    <text x="20" y="215" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Abrechnung nach Werk-/Dienstvertrag</text>
    <rect x="20" y="250" width="255" height="60" rx="6" fill="#003366" opacity="0.08"/>
    <text x="147" y="275" fill="#003366" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Keine Sozialversicherungspflicht</text>
    <text x="147" y="295" fill="#475569" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">Honorarabrechnung mit Vorsteuerabzug</text>
  </g>

  <g transform="translate(375, 130)">
    <rect width="295" height="330" rx="8" fill="#FFFFFF" stroke="#FF6600" stroke-width="2"/>
    <rect width="295" height="40" rx="8" fill="#FF6600"/>
    <text x="147" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Scheinselbstständigkeit (Risiko)</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Typische Warnsignale der DRV Bund:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Feste Einbindung in Dienstpläne des Betriebs</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Weisungsgebundenheit bezüglich Ort und Zeit</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Nutzung von Arbeitgeber-Laptop &amp; E-Mail</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Keine eigenen Mitarbeiter oder Werbung</text>
    <text x="20" y="190" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Mehr als 5/6 des Umsatzes von einem Kunden</text>
    <text x="20" y="215" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Höchstpersönliche Pflicht zur Leistung</text>
    <rect x="20" y="250" width="255" height="60" rx="6" fill="#FF6600" opacity="0.12"/>
    <text x="147" y="275" fill="#FF6600" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Rückwirkende Nachzahlungspflicht</text>
    <text x="147" y="295" fill="#475569" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">4 Jahre SV-Beiträge + Säumniszuschläge + § 266a StGB</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Rechtssicherheit: Freiwilliges Statusfeststellungsverfahren binnen 1 Monat nach Vertragsbeginn</text>
</svg>"""

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for filename, content in SVGS.items():
        p = OUT_DIR / filename
        p.write_text(content.strip(), encoding="utf-8")
        print(f"Created SVG: {filename}")
        count += 1
    print(f"\nSuccessfully generated all {count} Phase 8 technical SVGs in {OUT_DIR}")

if __name__ == "__main__":
    main()
