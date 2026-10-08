#!/usr/bin/env python3
"""
Generate 12 technical vector SVG infographics for Phase 6 articles (Posts 72 to 83).
Dimensions: 720x540 (4:3)
DMF Brand Palette:
- Primary Dark: #1e3a5f / #0f172a
- Accent Cyan / Blue: #0891b2 / #0284c7 / #0e7490
- Soft Backgrounds: #f8fafc / #eef5f9
- Neutral Slate: #475569 / #64748b
- Cards & Borders: #ffffff, #cbd5e1
"""

from pathlib import Path

PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

SVGS = {
    # 72. Gerüstbau Sicherheit Stufen (TRBS 2121 / DIN EN 12811)
    "geruestbau-sicherheit-stufen.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="30" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#cardShadow)"/>
  <text x="360" y="60" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Sicherheitsarchitektur im Gerüstbauhandwerk</text>
  <text x="360" y="85" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Qualifikations- und Schutzstufen nach TRBS 2121 &amp; DIN EN 12811</text>
  
  <!-- Step 1 -->
  <rect x="50" y="130" width="280" height="160" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)"/>
  <rect x="50" y="130" width="280" height="34" rx="8" fill="#0891b2"/>
  <rect x="50" y="156" width="280" height="8" fill="#0891b2"/>
  <text x="190" y="153" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Eignung &amp; Vorab-Check</text>
  <text x="70" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• G41-Höhentauglichkeit (Arbeitsmedizin)</text>
  <text x="70" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Absolute Schwindelfreiheit &amp; Kraft</text>
  <text x="70" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• B1 Deutsch (Sicherheitskommandos)</text>
  <text x="70" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Einreise nach § 16a / § 18a AufenthG</text>
  <text x="70" y="265" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">DMF Vorauswahl Hanoi</text>

  <!-- Step 2 -->
  <rect x="390" y="130" width="280" height="160" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)"/>
  <rect x="390" y="130" width="280" height="34" rx="8" fill="#0284c7"/>
  <rect x="390" y="156" width="280" height="8" fill="#0284c7"/>
  <text x="530" y="153" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Montage-Sicherheit TRBS</text>
  <text x="410" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Vorlaufendes Geländer (MSG)</text>
  <text x="410" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• PSAgA-Auffanggurte (Höhensicherung)</text>
  <text x="410" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Verankerung nach Statik / Lastklassen</text>
  <text x="410" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• DGUV Vorschrift 38 Unterweisung</text>
  <text x="410" y="265" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Baustellen-Praxis Tag 1</text>

  <!-- Step 3 -->
  <rect x="50" y="320" width="280" height="160" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)"/>
  <rect x="50" y="320" width="280" height="34" rx="8" fill="#1e3a5f"/>
  <rect x="50" y="346" width="280" height="8" fill="#1e3a5f"/>
  <text x="190" y="343" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Bauarten &amp; Systemgerüste</text>
  <text x="70" y="375" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Fassadengerüste (Rahmengerüste)</text>
  <text x="70" y="395" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Modulgerüste (Allround / Ringlock)</text>
  <text x="70" y="415" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Hänge- &amp; Raumgerüste Industrie</text>
  <text x="70" y="435" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Treppentürme &amp; Bauaufzüge</text>
  <text x="70" y="455" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Ausbildung / Weiterbildung</text>

  <!-- Step 4 -->
  <rect x="390" y="320" width="280" height="160" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)"/>
  <rect x="390" y="320" width="280" height="34" rx="8" fill="#0e7490"/>
  <rect x="390" y="346" width="280" height="8" fill="#0e7490"/>
  <text x="530" y="343" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">4. Freigabe &amp; Prüfung</text>
  <text x="410" y="375" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Befähigte Person nach TRBS 1203</text>
  <text x="410" y="395" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Prüfprotokoll &amp; Freigabeschild (Grün)</text>
  <text x="410" y="415" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• SOKA-BAU &amp; Tariflohn Absicherung</text>
  <text x="410" y="435" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Führerschein C1E / CE Mobilität</text>
  <text x="410" y="455" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Fachkraft- &amp; Kolonnenstatus</text>
  
  <!-- Center Arrow -->
  <path d="M 345 210 L 375 210 M 365 200 L 375 210 L 365 220" stroke="#0891b2" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 345 400 L 375 400 M 365 390 L 375 400 L 365 410" stroke="#0891b2" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>""",

    # 73. Gleisbau Infrastruktur Komponenten (EBA / DB)
    "gleisbau-infrastruktur-komponenten.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Gleisbau &amp; Schieneninfrastruktur</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Kernkompetenzen und Sicherheitsauflagen nach EBA &amp; Deutsche Bahn Richtlinien</text>

  <!-- Card 1: Oberbau -->
  <rect x="40" y="120" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="120" width="200" height="38" rx="8" fill="#0891b2"/>
  <rect x="40" y="150" width="200" height="8" fill="#0891b2"/>
  <text x="140" y="145" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Oberbau &amp; Schienen</text>
  <text x="55" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Gleisrostmontage</text>
  <text x="55" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schwellenverlegung (Beton/Holz)</text>
  <text x="55" y="220" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schienenbefestigung (W-Oberbau)</text>
  <text x="55" y="240" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schienenschweißen (Thermit/AT)</text>
  <text x="55" y="270" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Weichenbau</text>
  <text x="55" y="290" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Weichenmontage &amp; Zungenprüfung</text>
  <text x="55" y="310" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Herzstückinstandsetzung</text>
  <text x="55" y="340" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Schotterbett</text>
  <text x="55" y="360" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Stopfarbeiten &amp; Schotterplanie</text>
  <text x="55" y="380" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Dynamische Gleisstabilisierung</text>
  <rect x="55" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="140" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Präzision auf Millimeter</text>

  <!-- Card 2: Unterbau -->
  <rect x="260" y="120" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="260" y="120" width="200" height="38" rx="8" fill="#0284c7"/>
  <rect x="260" y="150" width="200" height="8" fill="#0284c7"/>
  <text x="360" y="145" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Unterbau &amp; Entwässerung</text>
  <text x="275" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Planumsschutz</text>
  <text x="275" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Einbau Planumsschutzschicht (PSS)</text>
  <text x="275" y="220" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Geotextilien &amp; Bodenstabilisierung</text>
  <text x="275" y="240" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Verdichtungsprüfung dynamisch</text>
  <text x="275" y="270" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Tiefentwässerung</text>
  <text x="275" y="290" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Tiefensickerstränge &amp; Gräben</text>
  <text x="275" y="310" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Bahngräben nach Ril 836</text>
  <text x="275" y="340" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Kabeltiefbau</text>
  <text x="275" y="360" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Kabeltröge für Leit- &amp; Sicherung</text>
  <text x="275" y="380" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Gleisquerungen &amp; Bohrungen</text>
  <rect x="275" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="360" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Fundament für Hochlast</text>

  <!-- Card 3: Sicherheit -->
  <rect x="480" y="120" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="480" y="120" width="200" height="38" rx="8" fill="#1e3a5f"/>
  <rect x="480" y="150" width="200" height="8" fill="#1e3a5f"/>
  <text x="580" y="145" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Bahnsicherheit &amp; Schutz</text>
  <text x="495" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Sicherungsauflagen</text>
  <text x="495" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• EBA-Tauglichkeitsuntersuchung</text>
  <text x="495" y="220" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Selbstsicherer / Sicherungsposten</text>
  <text x="495" y="240" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Signalerkennung &amp; Notausrufe</text>
  <text x="495" y="270" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Nacht- &amp; Sperrpausen</text>
  <text x="495" y="290" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Disziplinierte Nachtschichten</text>
  <text x="495" y="310" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Taktung in Gleissperrungen</text>
  <text x="495" y="340" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Tarif &amp; Ausreise</text>
  <text x="495" y="360" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• BRTV Bau Ausbildungsvergütung</text>
  <text x="495" y="380" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• § 16a / § 18a AufenthG Visum</text>
  <rect x="495" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="580" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Zertifizierte Sicherheit</text>
</svg>""",

    # 74. Karosseriebau Instandsetzung Ablauf
    "karosseriebau-instandsetzung-ablauf.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Karosserie- &amp; Fahrzeuginstandsetzung</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Vierphasen-Prozess: Von der Richtbank bis zur Hochvolt-Freigabe</text>

  <!-- Step 1 -->
  <rect x="40" y="125" width="300" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="300" height="34" rx="8" fill="#0891b2"/>
  <text x="190" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Phase 1: Diagnose &amp; Vermessung</text>
  <text x="55" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Elektronische 3D-Karosserievermessung</text>
  <text x="55" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schadensanalyse Tragstruktur &amp; Längsträger</text>
  <text x="55" y="220" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Auslesen von Fehlerspeichern &amp; Airbag-Sensorik</text>
  <text x="55" y="240" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• DGUV Information 209-093 (HV-Freischaltung)</text>
  <text x="55" y="270" fill="#0891b2" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Sicherer Reparaturplan</text>

  <!-- Step 2 -->
  <rect x="380" y="125" width="300" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="380" y="125" width="300" height="34" rx="8" fill="#0284c7"/>
  <text x="530" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Phase 2: Richten &amp; Trennen</text>
  <text x="395" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Rückverformung auf der Dozer-Richtbank</text>
  <text x="395" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Maßhaltigkeit nach Herstellertoleranz (mm)</text>
  <text x="395" y="220" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Trennschnitte an definierten Trennstellen</text>
  <text x="395" y="240" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ausbeulen ohne Lackieren (Smart Repair)</text>
  <text x="395" y="270" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Originalgetreue Geometrie</text>

  <!-- Step 3 -->
  <rect x="40" y="325" width="300" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="325" width="300" height="34" rx="8" fill="#1e3a5f"/>
  <text x="190" y="348" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Phase 3: Fügen &amp; Schweißen</text>
  <text x="55" y="380" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• MSG-Löten &amp; Punktschweißen (Inverter)</text>
  <text x="55" y="400" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Hochfeste Stähle (Borstahl / USIBOR)</text>
  <text x="55" y="420" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Kleben &amp; Nieten im Mischbau (Alu/Stahl)</text>
  <text x="55" y="440" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Hohlraumkonservierung &amp; Korrosionsschutz</text>
  <text x="55" y="470" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Crashsichere Verbindungen</text>

  <!-- Step 4 -->
  <rect x="380" y="325" width="300" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="380" y="325" width="300" height="34" rx="8" fill="#0e7490"/>
  <text x="530" y="348" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Phase 4: Finish &amp; Kalibrierung</text>
  <text x="395" y="380" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Spaltmaß-Einpassung Türen &amp; Hauben</text>
  <text x="395" y="400" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Übergabe an Lackiererei (Füller/Basis)</text>
  <text x="395" y="420" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Kalibrierung Fahrerassistenzsysteme (ADAS)</text>
  <text x="395" y="440" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Endabnahme &amp; Probefahrt</text>
  <text x="395" y="470" fill="#0e7490" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Zertifizierte Verkehrsfreigabe</text>
</svg>""",

    # 75. Konstruktionsmechanik Stahlbau Fertigung (DIN EN 1090)
    "konstruktionsmechanik-stahlbau-fertigung.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Konstruktionsmechanik &amp; Stahlbau</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Fertigungs- und Qualitätsstandards nach DIN EN 1090 (EXC 1 bis EXC 3)</text>

  <!-- 3 Pillars -->
  <rect x="40" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="200" height="38" rx="8" fill="#0891b2"/>
  <text x="140" y="150" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Zuschnitt &amp; Umformen</text>
  <text x="55" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">CNC-Brennschneiden</text>
  <text x="55" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Plasma- &amp; Autogenschneiden</text>
  <text x="55" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Fasenvorbereitung Schweißnaht</text>
  <text x="55" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Werkstoffzeugnisse EN 10204</text>
  <text x="55" y="275" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Abkanten &amp; Richten</text>
  <text x="55" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• CNC-Gesenkbiegepressen</text>
  <text x="55" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Walzen &amp; Profilstahlscheren</text>
  <text x="55" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Wärmerichten mit Flammbrenner</text>
  <rect x="55" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="140" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Präzise Vorfertigung</text>

  <rect x="260" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="260" y="125" width="200" height="38" rx="8" fill="#0284c7"/>
  <text x="360" y="150" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Schweißbaugruppen</text>
  <text x="275" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Schweißprozesse</text>
  <text x="275" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• MAG (135) &amp; Fülldraht (136)</text>
  <text x="275" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• WIG (141) für Wurzellagen</text>
  <text x="275" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• E-Hand (111) für Baustelle</text>
  <text x="275" y="275" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Heften &amp; Ausrichten</text>
  <text x="275" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schweißtische &amp; Spannsysteme</text>
  <text x="275" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Verzugsfreies Heften nach WPS</text>
  <text x="275" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vorwärmen bei Dickblechen</text>
  <rect x="275" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="360" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Zertifizierte Schweißer</text>

  <rect x="480" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="480" y="125" width="200" height="38" rx="8" fill="#1e3a5f"/>
  <text x="580" y="150" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Prüfung &amp; Montage</text>
  <text x="495" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Zerstörungsfreie Prüfung</text>
  <text x="495" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Sichtprüfung VT (ISO 17637)</text>
  <text x="495" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Magnetpulverprüfung MT</text>
  <text x="495" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ultraschall- &amp; Röntgenprüfung</text>
  <text x="495" y="275" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Endmontage</text>
  <text x="495" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schraubverbindungen HV-Sätze</text>
  <text x="495" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Hallenbau &amp; Brückenkonstruktion</text>
  <text x="495" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• CE-Kennzeichnung nach EN 1090</text>
  <rect x="495" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="580" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Lückenlose Werkskontrolle</text>
</svg>""",

    # 76. Kündigung Meldepflicht Zeitstrahl (§ 4a Abs. 5 AufenthG)
    "kuendigung-meldepflicht-zeitstrahl.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Meldepflicht bei Beendigung des Arbeitsverhältnisses</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Gesetzliche Fristen und Risiken nach § 4a Abs. 5 AufenthG &amp; § 404 SGB III</text>

  <!-- Timeline Bar -->
  <rect x="60" y="200" width="600" height="8" rx="4" fill="#cbd5e1"/>
  <rect x="60" y="200" width="280" height="8" rx="4" fill="#0891b2"/>

  <!-- Milestone 1 -->
  <circle cx="80" cy="204" r="16" fill="#1e3a5f"/>
  <text x="80" y="210" fill="#ffffff" font-size="12" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">T0</text>
  <rect x="40" y="110" width="160" height="60" rx="6" fill="#ffffff" stroke="#cbd5e1" filter="url(#shadow)"/>
  <text x="120" y="132" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Ereignis-Eintritt</text>
  <text x="120" y="152" fill="#475569" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">Kündigung / Aufhebung</text>

  <!-- Milestone 2 -->
  <circle cx="340" cy="204" r="16" fill="#0891b2"/>
  <text x="340" y="210" fill="#ffffff" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">4 W</text>
  <rect x="250" y="110" width="180" height="60" rx="6" fill="#ffffff" stroke="#0891b2" stroke-width="2" filter="url(#shadow)"/>
  <text x="340" y="132" fill="#0891b2" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Gesetzliche Frist: 4 Wochen</text>
  <text x="340" y="152" fill="#1e3a5f" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">Meldung an Ausländerbehörde</text>

  <!-- Milestone 3 -->
  <circle cx="620" cy="204" r="16" fill="#ef4444"/>
  <text x="620" y="210" fill="#ffffff" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">!</text>
  <rect x="520" y="110" width="160" height="60" rx="6" fill="#ffffff" stroke="#ef4444" filter="url(#shadow)"/>
  <text x="600" y="132" fill="#ef4444" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Fristversäumnis</text>
  <text x="600" y="152" fill="#475569" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">Bußgeld bis zu 30.000 €</text>

  <!-- 2 Bottom Comparison Boxes -->
  <rect x="50" y="255" width="290" height="240" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="50" y="255" width="290" height="34" rx="8" fill="#1e3a5f"/>
  <text x="195" y="278" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Pflichtinhalte der Mitteilung</text>
  <text x="70" y="315" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Vollständige Personalien des Mitarbeiters</text>
  <text x="70" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Datum der vorzeitigen Beendigung</text>
  <text x="70" y="355" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Aktenzeichen des Aufenthaltstitels / Visums</text>
  <text x="70" y="375" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Zuständige Ausländerbehörde des Wohnorts</text>
  <text x="70" y="395" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Schriftform oder elektronisch via Behördenportal</text>
  <text x="70" y="425" fill="#0891b2" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Aufbewahrung des Sendeprotokolls: 2 Jahre</text>

  <rect x="380" y="255" width="290" height="240" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="380" y="255" width="290" height="34" rx="8" fill="#0284c7"/>
  <text x="525" y="278" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Auswirkungen auf den Arbeitnehmer</text>
  <text x="400" y="315" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">• Zweckbindung des Visums entfällt</text>
  <text x="400" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ausländerbehörde setzt Suchfrist (meist 3–6 Mon.)</text>
  <text x="400" y="355" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Anspruch auf Arbeitslosengeld I nach § 137 SGB III</text>
  <text x="400" y="375" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• DMF Transferberatung für Nachfolgebeschäftigung</text>
  <text x="400" y="425" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Rechtssicherheit schützt vor Haftungsrisiken</text>
</svg>""",

    # 77. Vergleichsentgelt ZAV Prüfkriterien
    "vergleichsentgelt-zav-pruefkriterien.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Arbeitsbedingungsprüfung der ZAV</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Prüfkriterien nach § 39 AufenthG &amp; Bundesagentur für Arbeit Entgeltatlas</text>

  <!-- 3 Pillars of Evaluation -->
  <rect x="40" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="200" height="38" rx="8" fill="#0891b2"/>
  <text x="140" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Tarifbindung &amp; Lohn</text>
  <text x="55" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Tarifvertrag bindend?</text>
  <text x="55" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Wenn Tarifbindung: Genaue Entgeltgruppe maßgeblich</text>
  <text x="55" y="235" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Allgemeinverbindlich?</text>
  <text x="55" y="255" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Baugewerbe, Pflege, Gebäudereinigung nach AEntG</text>
  <text x="55" y="285" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Ohne Tarifvertrag?</text>
  <text x="55" y="305" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vergleichsentgelt Entgeltatlas der Region (Median/Quartil)</text>
  <text x="55" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Unterschreitung max. 10–15% toleriert, niemals Mindestlohn</text>
  <rect x="55" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="140" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Lohnabstandsgebot</text>

  <rect x="260" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="260" y="125" width="200" height="38" rx="8" fill="#0284c7"/>
  <text x="360" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Arbeitszeit &amp; Urlaub</text>
  <text x="275" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Wöchentliche Arbeitszeit</text>
  <text x="275" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vollzeit: Üblicherweise 38,5 bis 40 Std./Woche</text>
  <text x="275" y="235" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Urlaubsanspruch</text>
  <text x="275" y="255" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Gesetzlich mind. 24 Werktage / 20 Arbeitstage</text>
  <text x="275" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Branchentypisch: 28 bis 30 Urlaubstage</text>
  <text x="275" y="305" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Überstundenregelung</text>
  <text x="275" y="325" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Klare Vergütung oder Freizeitausgleich zwingend</text>
  <rect x="275" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="360" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Gleichbehandlung Inländer</text>

  <rect x="480" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="480" y="125" width="200" height="38" rx="8" fill="#1e3a5f"/>
  <text x="580" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. ZAV-Antragsprüfung</text>
  <text x="495" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Erklärung zum Beschäftigungsverhältnis</text>
  <text x="495" y="215" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Exakte Berufsbezeichnung nach KldB 2010</text>
  <text x="495" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ausführliche Tätigkeitsbeschreibung</text>
  <text x="495" y="275" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Bearbeitungsfristen</text>
  <text x="495" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Gesetzlich: 2 Wochen Fiktion (§ 36 Abs. 3 BeschV)</text>
  <text x="495" y="325" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• DMF Vorab-Abstimmung mit regionalem Arbeitgeber-Service</text>
  <rect x="495" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="580" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Schnelle Vorabzustimmung</text>
</svg>""",

    # 78. Arbeitszeit ArbZG Grenzen Matrix
    "arbeitszeit-arbzg-grenzen-matrix.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Arbeitszeitgesetz (ArbZG) im Betrieb</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Gesetzliche Höchstgrenzen, Pausen und Ruhezeiten für internationale Teams</text>

  <!-- 4 Grid Boxes -->
  <rect x="50" y="125" width="280" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="50" y="125" width="280" height="34" rx="8" fill="#0891b2"/>
  <text x="190" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Tägliche Höchstarbeitszeit</text>
  <text x="70" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Grundsatz: 8 Stunden / Tag (§ 3)</text>
  <text x="70" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Verlängerung auf 10 Stunden möglich,</text>
  <text x="70" y="218" fill="#475569" font-size="11" font-family="system-ui, sans-serif">  wenn innerhalb von 6 Monaten ein</text>
  <text x="70" y="236" fill="#475569" font-size="11" font-family="system-ui, sans-serif">  Durchschnitt von 8 Std. erreicht wird.</text>
  <text x="70" y="265" fill="#0891b2" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Wöchentlich: Max. 48 Stunden</text>

  <rect x="390" y="125" width="280" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="390" y="125" width="280" height="34" rx="8" fill="#0284c7"/>
  <text x="530" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Ruhepausen während der Arbeit</text>
  <text x="410" y="180" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Feste Pausenzeiten (§ 4)</text>
  <text x="410" y="200" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• 6 bis 9 Stunden: Mind. 30 Minuten</text>
  <text x="410" y="220" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Über 9 Stunden: Mind. 45 Minuten</text>
  <text x="410" y="240" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Stückelung in mind. 15 Min. erlaubt</text>
  <text x="410" y="265" fill="#0284c7" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Keine Arbeit länger als 6 Std. ohne Pause</text>

  <rect x="50" y="325" width="280" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="50" y="325" width="280" height="34" rx="8" fill="#1e3a5f"/>
  <text x="190" y="348" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Ununterbrochene Ruhezeit</text>
  <text x="70" y="380" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">11 Stunden Ruhezeit (§ 5)</text>
  <text x="70" y="400" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Zwischen Arbeitsende und Arbeitsbeginn</text>
  <text x="70" y="420" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ausnahme: Pflege &amp; Gastronomie auf 10 Std.</text>
  <text x="70" y="438" fill="#475569" font-size="11" font-family="system-ui, sans-serif">  verkürzbar bei Ausgleich binnen 4 Wochen</text>
  <text x="70" y="465" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Gilt streng auch bei Schichtwechseln</text>

  <rect x="390" y="325" width="280" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="390" y="325" width="280" height="34" rx="8" fill="#0e7490"/>
  <text x="530" y="348" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">4. Dokumentationspflicht</text>
  <text x="410" y="380" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">BAG-Urteil &amp; EuGH-Vorgabe</text>
  <text x="410" y="400" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Lückenlose Aufzeichnung von Beginn,</text>
  <text x="410" y="418" fill="#475569" font-size="11" font-family="system-ui, sans-serif">  Ende und Dauer der Arbeitszeit</text>
  <text x="410" y="438" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Prüfung bei Verlängerung des Aufenthaltstitels</text>
  <text x="410" y="465" fill="#0e7490" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Digitale Stempeluhr oder Zeiterfassung</text>
</svg>""",

    # 79. Nebenjob Regelungen Drittstaaten (§ 16a Abs. 3)
    "nebenjob-regelungen-drittstaaten.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Nebentätigkeit &amp; Minijobs für Drittstaatsangehörige</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Gesetzliche Rahmenbedingungen nach § 16a Abs. 3 AufenthG &amp; § 8 SGB IV</text>

  <!-- Comparison Columns -->
  <rect x="50" y="125" width="290" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="50" y="125" width="290" height="38" rx="8" fill="#0891b2"/>
  <text x="195" y="150" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Auszubildende (§ 16a AufenthG)</text>
  <text x="70" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Gesetzliche Nebentätigkeit</text>
  <text x="70" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Bis zu 10 Stunden / Woche zulässig</text>
  <text x="70" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Unabhängig vom Ausbildungsberuf</text>
  <text x="70" y="255" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Zustimmung des Hauptarbeitgebers</text>
  <text x="70" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ausbildungsziel darf nicht gefährdet sein</text>
  <text x="70" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Noten &amp; Fehlzeiten Berufsschule im Blick</text>
  <text x="70" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vorherige schriftliche Anzeige üblich</text>
  <text x="70" y="345" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Sozialversicherung (538 € Minijob)</text>
  <text x="70" y="365" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Pauschale Abgaben durch Nebenarbeitgeber</text>
  <text x="70" y="385" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Keine Auswirkung auf Ausbildungsvergütung</text>
  <rect x="70" y="440" width="250" height="30" rx="4" fill="#e0f2fe"/>
  <text x="195" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Max. 10 Stunden / Woche</text>

  <rect x="380" y="125" width="290" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="380" y="125" width="290" height="38" rx="8" fill="#1e3a5f"/>
  <text x="525" y="150" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Fachkräfte (§ 18a / § 18b / § 18g)</text>
  <text x="400" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Zweckbindung des Aufenthaltstitels</text>
  <text x="400" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Titel ist an konkrete Fachkrafttätigkeit gebunden</text>
  <text x="400" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Nebenbeschäftigung bedarf oft ABH-Erlaubnis</text>
  <text x="400" y="255" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Genehmigung durch Arbeitgeber</text>
  <text x="400" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Wettbewerbsverbot (§ 60 HGB)</text>
  <text x="400" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Einhaltung Ruhezeiten nach ArbZG (11 Std.)</text>
  <text x="400" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Keine Beeinträchtigung der Hauptleistung</text>
  <text x="400" y="345" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Steuerklasse &amp; Abrechnung</text>
  <text x="400" y="365" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Minijob pauschal (2%) oder Steuerklasse VI</text>
  <text x="400" y="385" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Lohnsteuerbescheinigung bei Nebenjob</text>
  <rect x="400" y="440" width="250" height="30" rx="4" fill="#e0f2fe"/>
  <text x="525" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Prüfung Ausländerbehörde</text>
</svg>""",

    # 80. Hebammen Anerkennungspfad HebG
    "hebammen-anerkennungspfad-hebg.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Anerkennung von Hebammen aus Drittstaaten</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Verfahrensschritte nach Hebammengesetz (HebG) &amp; Studienreform</text>

  <!-- 4 Process Cards -->
  <rect x="40" y="125" width="145" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="145" height="36" rx="8" fill="#0891b2"/>
  <text x="112" y="148" fill="#ffffff" font-size="12" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Antragstellung</text>
  <text x="50" y="180" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Landesprüfungsamt</text>
  <text x="50" y="200" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Bachelor-Diplom Vietnam (4 Jahre)</text>
  <text x="50" y="230" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Fächer- &amp; Notenübersichten</text>
  <text x="50" y="260" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Nachweis Geburten- und Praxisstunden</text>
  <text x="50" y="300" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Straffreiheit &amp; Gesundheitseignung</text>

  <rect x="205" y="125" width="145" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="205" y="125" width="145" height="36" rx="8" fill="#0284c7"/>
  <text x="277" y="148" fill="#ffffff" font-size="12" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Defizitprüfung</text>
  <text x="215" y="180" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Gutachten HebG</text>
  <text x="215" y="200" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Vergleich mit deutschem Hebammenstudium</text>
  <text x="215" y="240" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Feststellung wesentlicher Unterschiede</text>
  <text x="215" y="280" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Defizitbescheid mit Ausgleichsmaßnahmen</text>

  <rect x="370" y="125" width="145" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="370" y="125" width="145" height="36" rx="8" fill="#1e3a5f"/>
  <text x="442" y="148" fill="#ffffff" font-size="12" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Qualifizierung</text>
  <text x="380" y="180" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Anpassungslehrgang</text>
  <text x="380" y="200" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Klinik-Einsatz im Kreißsaal (§ 16d)</text>
  <text x="380" y="230" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Begleitung von Geburten unter Aufsicht</text>
  <text x="380" y="270" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Fachsprachprüfung B2 Geburtshilfe</text>
  <text x="380" y="310" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Oder: Kenntnisprüfung (mündlich/praktisch)</text>

  <rect x="535" y="125" width="145" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="535" y="125" width="145" height="36" rx="8" fill="#0e7490"/>
  <text x="607" y="148" fill="#ffffff" font-size="12" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">4. Berufserlaubnis</text>
  <text x="545" y="180" fill="#1e3a5f" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">Staatliche Anerkennung</text>
  <text x="545" y="200" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Erteilung der Erlaubnis zum Führen der Berufsbezeichnung</text>
  <text x="545" y="250" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• Eigenständige Geburtsleitung im Kreißsaal</text>
  <text x="545" y="290" fill="#475569" font-size="10" font-family="system-ui, sans-serif">• TVöD-P / TV-L Eingruppierung Fachkraft</text>
</svg>""",

    # 81. Physiotherapie Anerkennung Stufen (MPhG)
    "physiotherapie-anerkennung-stufen.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Anerkennung von Physiotherapeuten (MPhG)</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Stufenmodell für Praxen, Kliniken und ambulante Rehazentren</text>

  <!-- 3 Big Cards -->
  <rect x="40" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="200" height="38" rx="8" fill="#0891b2"/>
  <text x="140" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Vorbildung Vietnam</text>
  <text x="55" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Bachelor Physiotherapie</text>
  <text x="55" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• 4-jähriges Vollzeitstudium an medizinischen Universitäten</text>
  <text x="55" y="245" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Starke Praxiserfahrung</text>
  <text x="55" y="265" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Neurologische Reha (Schlaganfall)</text>
  <text x="55" y="285" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Orthopädie &amp; Traumatologie</text>
  <text x="55" y="305" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Manuelle Techniken &amp; Faszientherapie</text>
  <rect x="55" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="140" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Akademische Basis</text>

  <rect x="260" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="260" y="125" width="200" height="38" rx="8" fill="#0284c7"/>
  <text x="360" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Anpassung in Praxis</text>
  <text x="275" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Visum § 16d AufenthG</text>
  <text x="275" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Mitarbeit als Therapieassistent</text>
  <text x="275" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vergütung nach Vereinbarung</text>
  <text x="275" y="255" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Ausgleichsmaßnahmen</text>
  <text x="275" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Ausgleich deutscher Heilmittelrichtlinien</text>
  <text x="275" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Dokumentation in Praxissoftware</text>
  <text x="275" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• B2 Medizin-Fachsprachprüfung</text>
  <rect x="275" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="360" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Klinische Einarbeitung</text>

  <rect x="480" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="480" y="125" width="200" height="38" rx="8" fill="#1e3a5f"/>
  <text x="580" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Vollanerkennung</text>
  <text x="495" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Berufszulassung MPhG</text>
  <text x="495" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Staatliche Urkunde Physiotherapeut</text>
  <text x="495" y="235" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Kassenabrechnung</text>
  <text x="495" y="255" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Volle Abrechnungsfähigkeit gegenüber GKV (Krankenkassen)</text>
  <text x="495" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Weiterbildung: Manuelle Lymphdrainage (MLD), Bobath, PNF</text>
  <rect x="495" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="580" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Volle Wertschöpfung</text>
</svg>""",

    # 82. Bankkonto Eröffnung ZKG Prozess
    "bankkonto-eroeffnung-zkg-prozess.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Girokonto-Eröffnung für internationale Fachkräfte</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Gesetzlicher Anspruch auf das Basiskonto nach §§ 31 ff. ZKG (Zahlungskontengesetz)</text>

  <!-- 3 Workflow Boxes -->
  <rect x="40" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="200" height="38" rx="8" fill="#0891b2"/>
  <text x="140" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Voraussetzungen</text>
  <text x="55" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Erforderliche Dokumente</text>
  <text x="55" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Gültiger Reisepass Vietnam</text>
  <text x="55" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Visum (§ 16a, § 18a, § 16d)</text>
  <text x="55" y="245" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Meldebescheinigung Einwohnermeldeamt</text>
  <text x="55" y="275" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Steuer-ID</text>
  <text x="55" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Steuer-Identifikationsnummer</text>
  <text x="55" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">  (wird vom BZSt nach Anmeldung per Post zugestellt)</text>
  <rect x="55" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="140" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Lückenlose Identifikation</text>

  <rect x="260" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="260" y="125" width="200" height="38" rx="8" fill="#0284c7"/>
  <text x="360" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. ZKG Basiskonto</text>
  <text x="275" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Rechtsanspruch</text>
  <text x="275" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Jede Bank ist verpflichtet, ein Basiskonto zu eröffnen (§ 31 ZKG)</text>
  <text x="275" y="245" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Keine Schufa-Prüfung</text>
  <text x="275" y="265" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Fehlende Kredithistorie darf kein Ablehnungsgrund sein</text>
  <text x="275" y="305" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Guthabenbasis</text>
  <text x="275" y="325" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Kein Dispositionskredit</text>
  <text x="275" y="345" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Debitkarte &amp; Onlinebanking</text>
  <rect x="275" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="360" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Gesetzliche Eröffnungspflicht</text>

  <rect x="480" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="480" y="125" width="200" height="38" rx="8" fill="#1e3a5f"/>
  <text x="580" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Gehaltsüberweisung</text>
  <text x="495" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">IBAN für Arbeitgeber</text>
  <text x="495" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Bereitstellung innerhalb der ersten 7–10 Tage</text>
  <text x="495" y="235" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Pünktliche Überweisung der ersten Ausbildungsvergütung</text>
  <text x="495" y="275" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Heimatüberweisungen</text>
  <text x="495" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Sichere Geldtransfers nach Vietnam über zugelassene Institute</text>
  <text x="495" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vermeidung dubioser Bargeldkuriere</text>
  <rect x="495" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="580" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Finanzielle Stabilität</text>
</svg>""",

    # 83. Wohnungsgeber Anmeldung BMG Prozess (§ 19 BMG / GEZ)
    "wohnungsgeber-anmeldung-bmg-prozess.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="url(#bgGrad)"/>
  <rect x="30" y="25" width="660" height="70" rx="8" fill="#1e3a5f" filter="url(#shadow)"/>
  <text x="360" y="55" fill="#ffffff" font-size="20" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Wohnungsanmeldung &amp; Rundfunkbeitrag</text>
  <text x="360" y="80" fill="#93c5fd" font-size="13" font-family="system-ui, sans-serif" text-anchor="middle">Pflichten des Arbeitgebers als Wohnungsgeber nach § 19 BMG &amp; GEZ-Regelungen</text>

  <!-- 3 Sequential Columns -->
  <rect x="40" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="125" width="200" height="38" rx="8" fill="#0891b2"/>
  <text x="140" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">1. Wohnungsgeberbestätigung</text>
  <text x="55" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Gesetzliche Frist: 2 Wochen</text>
  <text x="55" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Pflicht des Vermieters nach § 19 BMG</text>
  <text x="55" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Gilt auch bei Arbeitgeber-WG / Zimmer</text>
  <text x="55" y="255" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Pflichtangaben</text>
  <text x="55" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Name &amp; Anschrift des Vermieters</text>
  <text x="55" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Einzugsdatum</text>
  <text x="55" y="315" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Anschrift der Mietwohnung</text>
  <text x="55" y="335" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Namen aller einziehenden Personen</text>
  <rect x="55" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="140" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Basis für alle Behördengänge</text>

  <rect x="260" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="260" y="125" width="200" height="38" rx="8" fill="#0284c7"/>
  <text x="360" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">2. Einwohnermeldeamt</text>
  <text x="275" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Anmeldung vor Ort</text>
  <text x="275" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Terminierung direkt in Woche 1</text>
  <text x="275" y="225" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vorlage Reisepass &amp; Bestätigung</text>
  <text x="275" y="255" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Folgeprozesse ausgelöst</text>
  <text x="275" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Automatische Benachrichtigung BZSt</text>
  <text x="275" y="295" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Vergabe Steuer-ID für Gehaltsabrechnung</text>
  <text x="275" y="325" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Voraussetzung für eAT (Elektronischer Aufenthaltstitel)</text>
  <rect x="275" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="360" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Amtliche Meldebestätigung</text>

  <rect x="480" y="125" width="200" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="480" y="125" width="200" height="38" rx="8" fill="#1e3a5f"/>
  <text x="580" y="148" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">3. Rundfunkbeitrag (GEZ)</text>
  <text x="495" y="185" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Grundsatz: Eine Wohnung zahlt</text>
  <text x="495" y="205" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• 18,36 € pro Monat pro Wohnung</text>
  <text x="495" y="235" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Wohngemeinschaften (WG)</text>
  <text x="495" y="255" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Nur ein Hauptmieter zahlt,</text>
  <text x="495" y="275" fill="#475569" font-size="11" font-family="system-ui, sans-serif">  andere Bewohner melden Beitragsnummer</text>
  <text x="495" y="305" fill="#1e3a5f" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">Doppelzahlungen vermeiden</text>
  <text x="495" y="325" fill="#475569" font-size="11" font-family="system-ui, sans-serif">• Rechtzeitige Zuordnung schützt Azubis vor Mahnbescheiden</text>
  <rect x="495" y="440" width="170" height="30" rx="4" fill="#e0f2fe"/>
  <text x="580" y="460" fill="#0369a1" font-size="11" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">Transparente Kostenaufteilung</text>
</svg>"""
}

def generate_svgs():
    PUB_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for filename, code in SVGS.items():
        out_path = PUB_DIR / filename
        out_path.write_text(code.strip(), encoding="utf-8")
        print(f"Generated SVG: {filename} ({len(code)} bytes)")
        count += 1

    print(f"\nSUCCESS: Generated {count} / {len(SVGS)} Phase 6 SVG infographics in {PUB_DIR}")

if __name__ == "__main__":
    generate_svgs()
