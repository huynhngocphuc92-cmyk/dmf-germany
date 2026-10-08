#!/usr/bin/env python3
"""
Generate 12 custom vector SVG technical diagrams (720x540) for Phase 7 blog articles (Posts 84 to 95).
Palette:
  - Deep Navy: #002B49
  - Accent Red: #EE1C25
  - Accent Green: #00A86B
  - Light Slate / BG: #F8FAFC
  - Card Border / Stroke: #E2E8F0
  - Text Primary: #0F172A
  - Text Muted: #64748B
"""

from pathlib import Path

PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

SVGS = {}

# 1. Kältetechnik Kreislauf & F-Gase (Draft 84)
SVGS["kaeltetechnik-kreislauf-f-gase.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Kältekreislauf &amp; F-Gase Sachkunde (EU 2024/573)</text>
  
  <!-- Step 1: Verdampfer -->
  <g transform="translate(50, 120)">
    <rect width="280" height="160" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">1. Verdampfer (Niederdruck)</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Wärmeaufnahme aus Raum/Kühlgut</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Kältemittel siedet bei Minustemperatur</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Phasenwechsel: flüssig zu dampfförmig</text>
    <text x="20" y="140" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Prüfpflicht nach ChemKlimaschutzV</text>
  </g>

  <!-- Step 2: Verdichter -->
  <g transform="translate(390, 120)">
    <rect width="280" height="160" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#EE1C25"/>
    <text x="140" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">2. Verdichter / Kompressor</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Druckerhöhung des Heißgases</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Hubkolben-, Schrauben- oder Scroll-Technik</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Frequenzumrichter &amp; MSR-Steuerung</text>
    <text x="20" y="140" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Hochdrucküberwachung DIN EN 378</text>
  </g>

  <!-- Step 3: Verflüssiger -->
  <g transform="translate(390, 310)">
    <rect width="280" height="160" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">3. Verflüssiger / Kondensator</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Wärmeabgabe an Umwelt / Rückgewinnung</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Luft- oder wassergekühlte Wärmetauscher</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Phasenwechsel zurück in flüssigen Zustand</text>
    <text x="20" y="140" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Dichtheitsprüfung nach F-Gase-VO</text>
  </g>

  <!-- Step 4: Expansionsorgan -->
  <g transform="translate(50, 310)">
    <rect width="280" height="160" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#00A86B"/>
    <text x="140" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">4. Expansionsventil</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Druckentlastung vor Verdampfereintritt</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Thermostatisches oder elektronisches EEV</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Präzise Überhitzungsregelung</text>
    <text x="20" y="140" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Sachkundenachweis Kategorie I obligatorisch</text>
  </g>

  <!-- Circular connecting arrows -->
  <path d="M 330 200 L 390 200" fill="none" stroke="#EE1C25" stroke-width="3" stroke-dasharray="6,4"/>
  <path d="M 530 280 L 530 310" fill="none" stroke="#002B49" stroke-width="3" stroke-dasharray="6,4"/>
  <path d="M 390 390 L 330 390" fill="none" stroke="#00A86B" stroke-width="3" stroke-dasharray="6,4"/>
  <path d="M 190 310 L 190 280" fill="none" stroke="#002B49" stroke-width="3" stroke-dasharray="6,4"/>

  <!-- Footer Banner -->
  <rect x="50" y="490" width="620" height="32" rx="6" fill="#E2E8F0"/>
  <text x="360" y="511" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">DMF Talents: Fachausbildung Mechatroniker Kältetechnik nach ChemKlimaschutzV &amp; DIN EN 378</text>
</svg>"""

# 2. GaLaBau Leistungsbereiche (Draft 85)
SVGS["galabau-leistungsbereiche-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">GaLaBau: Die 4 Kern-Leistungsbereiche nach BGL</text>

  <!-- Card 1: Pflaster- & Wegebau -->
  <g transform="translate(50, 115)">
    <rect width="290" height="170" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="34" rx="8" fill="#002B49"/>
    <text x="145" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">1. Pflaster- &amp; Wegebau</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Naturstein- &amp; Betonsteinpflaster</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Tragschichten &amp; Gefälle nach DIN 18318</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Randeinfassungen, Treppenanlagen, Mauern</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Bedienung Rüttelplatten &amp; Minibagger</text>
  </g>

  <!-- Card 2: Vegetationstechnik -->
  <g transform="translate(380, 115)">
    <rect width="290" height="170" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="34" rx="8" fill="#00A86B"/>
    <text x="145" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">2. Vegetation &amp; Pflanzung</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Gehölzpflanzung &amp; Bodenvorbereitung</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Rasenansaat &amp; Rollrasenverlegung</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Gehölzschnitt &amp; Staudenpflege (FLL)</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Botanisches Grundwissen &amp; Pflanzenschutz</text>
  </g>

  <!-- Card 3: Baumpflege -->
  <g transform="translate(50, 310)">
    <rect width="290" height="170" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="34" rx="8" fill="#EE1C25"/>
    <text x="145" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">3. Baumpflege &amp; Forstarbeit</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Totholzbeseitigung &amp; Kronenpflege</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Motorsägen-Zertifikat AS Baum I / II</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Fällungen &amp; Häckslerbedienung</text>
    <text x="20" y="145" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ UVV Forsten &amp; DGUV Information 214-059</text>
  </g>

  <!-- Card 4: Wasser- & Dachbegrünung -->
  <g transform="translate(380, 310)">
    <rect width="290" height="170" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="34" rx="8" fill="#002B49"/>
    <text x="145" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">4. Entwässerung &amp; Gründächer</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Rigolenversickerung &amp; Drainageleitungen</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Extensive &amp; intensive Dachbegrünung</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Zisternenanschluss &amp; automatische Bewässerung</text>
    <text x="20" y="145" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Klimaanpassung &amp; Schwammstadt-Konzepte</text>
  </g>

  <rect x="50" y="495" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="515" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Qualifizierungsstandards des Bundesverbands Garten-, Landschafts- und Sportplatzbau (BGL)</text>
</svg>"""

# 3. Zahntechnik CAD/CAM Prozess (Draft 86)
SVGS["zahntechnik-fertigung-cad-cam.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Zahntechnik: Digitaler CAD/CAM Fertigungsprozess</text>

  <!-- Step 1 -->
  <g transform="translate(45, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#002B49"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">1. Scan &amp; Import</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Dateneingang</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• 3D-Intraoralscan</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Modellscan Gips</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• STL/PLY-Dateien</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Vorbereitung</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Präparationsgrenze</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Okklusionsabgleich</text>
    <text x="15" y="315" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Digitaler Eingang</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(210, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#002B49"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">2. CAD-Design</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Konstruktion</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• exocad / 3Shape</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Anatomische Krone</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Brückengerüste</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Implantat</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Individuelle Abutments</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Stegkonstruktionen</text>
    <text x="15" y="315" fill="#002B49" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ 100% Passung</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(375, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#EE1C25"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">3. CAM-Fräsen</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Fräszentrum</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• 5-Achs-Fräsmaschinen</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Zirkonoxid (ZrO2)</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• CoCr / Titan / PEEK</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Sinterbrand</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• 1.500 °C Hochofen</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Schrumpfungsausgleich</text>
    <text x="15" y="315" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Werkstoffprüfung</text>
  </g>

  <!-- Step 4 -->
  <g transform="translate(540, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#00A86B"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">4. Finish &amp; QA</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Handwerk</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Keramikschichtung</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Malfarben &amp; Glasur</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Hochglanzpolitur</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">MDR Konformität</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Chargenrückverfolgung</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Meisterendkontrolle</text>
    <text x="15" y="315" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ EU MDR 2017/745</text>
  </g>

  <!-- Connectors -->
  <line x1="185" y1="290" x2="210" y2="290" stroke="#002B49" stroke-width="3"/>
  <line x1="350" y1="290" x2="375" y2="290" stroke="#EE1C25" stroke-width="3"/>
  <line x1="515" y1="290" x2="540" y2="290" stroke="#00A86B" stroke-width="3"/>

  <rect x="45" y="485" width="635" height="30" rx="6" fill="#E2E8F0"/>
  <text x="362" y="505" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Dentallabore: Höchste handwerkliche Präzision nach deutschem ZTV-Standard &amp; EU-MDR</text>
</svg>"""

# 4. Busfahrer Qualifikation (Draft 87)
SVGS["busfahrer-qualifikation-bkrfqg-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Busfahrer im Linien- &amp; ÖPNV-Verkehr (§ 24a BeschV)</text>

  <!-- Step 1 -->
  <g transform="translate(50, 115)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">1. Fahrerlaubnis Klasse D/DE</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Umschreibung nach § 31 FeV</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Theoretische &amp; praktische Fahrprüfung</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Verkehrsmedizinisches Gutachten &amp; Sehtest</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Mindestalter 21 / 24 Jahre (FeV)</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(390, 115)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#EE1C25"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">2. BKrFQG &amp; Schlüsselzahl 95</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Beschleunigte Grundqualifikation (140 Std.)</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• IHK-Theorieprüfung Personenverkehr</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Eintragung Fahrerqualifizierungsnachweis (FQN)</text>
    <text x="20" y="145" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Gesetzliche Pflicht für gewerblichen ÖPNV</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(50, 310)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#00A86B"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">3. Fachsprach- &amp; Kundentraining</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• B1 Sprachzertifikat vor Visumserteilung</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Fahrticket-Verkauf &amp; Tariferklärung</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Durchsagen bei Störungen &amp; Umleitungen</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Deeskalation &amp; Fahrgastbetreuung</text>
  </g>

  <!-- Step 4 -->
  <g transform="translate(390, 310)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">4. Betriebliche Linienkunde</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Streckenkunde &amp; Haltestellenfolgen</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Bordsysteme (IBIS, RBL, Entwerter)</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• E-Bus Lademanagement &amp; Telematik</text>
    <text x="20" y="145" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ ZAV-Zustimmung nach § 24a Abs. 1 BeschV</text>
  </g>

  <rect x="50" y="495" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="515" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Beschleunigtes Fachkräfteverfahren für Verkehrsbetriebe &amp; private Busunternehmen</text>
</svg>"""

# 5. Fachinformatiker Systemintegration (Draft 88)
SVGS["systemintegration-infrastruktur-schichten.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Fachinformatiker Systemintegration: IT-Infrastruktur</text>

  <!-- Layer 4: Cloud & DevOps -->
  <g transform="translate(50, 115)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="75" rx="8" fill="#00A86B"/>
    <text x="80" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Cloud &amp; DevOps</text>
    <text x="180" y="35" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Hybride Architekturen: AWS, Azure, Google Cloud</text>
    <text x="180" y="58" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">Kubernetes, Docker Container, Terraform (Infrastructure as Code), CI/CD-Pipelines</text>
  </g>

  <!-- Layer 3: Security & Compliance -->
  <g transform="translate(50, 205)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="75" rx="8" fill="#EE1C25"/>
    <text x="80" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Cyber Security</text>
    <text x="180" y="35" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">NIS-2 Richtlinie &amp; BSI IT-Grundschutz Standards</text>
    <text x="180" y="58" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">Next-Gen Firewalls, VPN, Zero-Trust Architecture, Endpoint Detection (EDR), SIEM</text>
  </g>

  <!-- Layer 2: Virtualisierung & Server -->
  <g transform="translate(50, 295)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="75" rx="8" fill="#002B49"/>
    <text x="80" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Server &amp; Services</text>
    <text x="180" y="35" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Linux (Debian/RHEL) &amp; Windows Server Administration</text>
    <text x="180" y="58" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">Proxmox / VMware ESXi, Active Directory, DNS/DHCP, Backup-Konzepte (Veeam)</text>
  </g>

  <!-- Layer 1: Physische Netzwerkinfrastruktur -->
  <g transform="translate(50, 385)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#64748B" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="75" rx="8" fill="#64748B"/>
    <text x="80" y="43" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Hardware &amp; LAN</text>
    <text x="180" y="35" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Rechenzentren, Switches, Router, Glasfaserverkabelung</text>
    <text x="180" y="58" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">VLAN-Segmentierung, USV-Systeme, Patchmanagement, Hardware-Rollout</text>
  </g>

  <rect x="50" y="485" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="505" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Duale Ausbildung (§ 16a AufenthG) &amp; IT-Spezialisten mit Berufserfahrung (§ 19c BeschV)</text>
</svg>"""

# 6. ZFA Aufgaben & Behandlungsablauf (Draft 89)
SVGS["zfa-aufgaben-behandlungsablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Zahnmedizinische Fachangestellte (ZFA): Tätigkeitsmatrix</text>

  <!-- Block 1: Behandlungsassistenz -->
  <g transform="translate(50, 115)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">1. Stuhlassistenz (4-Hand-Technik)</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Konservierende &amp; chirurgische Eingriffe</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Absaugtechnik &amp; Trockenlegung (Kofferdam)</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Anmischen von Füllungswerkstoffen &amp; Alginat</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Empathische Angstpatienten-Betreuung</text>
  </g>

  <!-- Block 2: Strahlenschutz & Röntgen -->
  <g transform="translate(390, 115)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#EE1C25"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">2. Röntgen &amp; Strahlenschutz</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Gesetzlicher Röntgenschein nach StrlSchG</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Intraorale Zahnfilme &amp; Bissflügelaufnahmen</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Orthopantomogramm (OPG) &amp; DVT 3D</text>
    <text x="20" y="145" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Konstanzprüfung &amp; Dokumentationspflicht</text>
  </g>

  <!-- Block 3: Hygiene & Aufbereitung -->
  <g transform="translate(50, 310)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#00A86B"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">3. Hygiene &amp; Sterilisation</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• RKI- und BfArM-konforme Aufbereitung</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Thermodesinfektor (RDG) &amp; Autoklav</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Siegelung, Chargenfreigabe &amp; Barcode</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Sachkundenachweis Instrumentenaufbereitung</text>
  </g>

  <!-- Block 4: Verwaltung & Abrechnung -->
  <g transform="translate(390, 310)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">4. Praxisorganisation &amp; BEMA/GOZ</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Kassenabrechnung (BEMA) &amp; Privat (GOZ)</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Heil- und Kostenpläne (HKP) digital</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Praxisverwaltungssoftware (Charly, Dampsoft)</text>
    <text x="20" y="145" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Telefonischer Patientenservice in Deutsch B2</text>
  </g>

  <rect x="50" y="495" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="515" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Anerkennung nach ZHKG / Kammerprüfung vor der Landeszahnärztekammer (LZÄK)</text>
</svg>"""

# 7. MFA Praxisablauf & Diagnostik (Draft 90)
SVGS["mfa-praxisablauf-diagnostik-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Medizinische Fachangestellte (MFA): Praxisablauf</text>

  <!-- Step 1: Anmeldung & Triage -->
  <g transform="translate(45, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#002B49"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">1. Empfang</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Patientenannahme</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• eGK einlesen</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Notfalltriage</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Terminplanung</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Digitales PVS</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Medistar, Turbomed</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• eRezept &amp; eAU</text>
    <text x="15" y="315" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ B2 Sprachniveau</text>
  </g>

  <!-- Step 2: Labor & Diagnostik -->
  <g transform="translate(210, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#EE1C25"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">2. Labor</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Venenpunktion</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Blutabnahme</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Zentrifugieren</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Probenversand</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Schnelltests</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Troponin, CRP, Urin</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Blutzuckermessung</text>
    <text x="15" y="315" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ IfSG Hygienerichtlinie</text>
  </g>

  <!-- Step 3: Funktionsdiagnostik -->
  <g transform="translate(375, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#002B49"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">3. Diagnostik</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Kardiologie</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Ruhe- &amp; Belastungs-EKG</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Langzeit-Blutdruck</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Pulsoxymetrie</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Pneumologie</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Spirometrie (Lufu)</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Peak-Flow-Messung</text>
    <text x="15" y="315" fill="#002B49" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Gerätesicherheit MPG</text>
  </g>

  <!-- Step 4: Abrechnung -->
  <g transform="translate(540, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#00A86B"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">4. Abrechnung</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Gebührenziffern</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• EBM (Kassensitze)</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• GOÄ (Privatabrechnung)</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• DMP-Dokumentation</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Rechtssicherheit</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• KV-Quartalsabrechnung</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Datenschutz DSGVO</text>
    <text x="15" y="315" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ KV-Prüfsicherheit</text>
  </g>

  <!-- Connectors -->
  <line x1="185" y1="290" x2="210" y2="290" stroke="#002B49" stroke-width="3"/>
  <line x1="350" y1="290" x2="375" y2="290" stroke="#EE1C25" stroke-width="3"/>
  <line x1="515" y1="290" x2="540" y2="290" stroke="#002B49" stroke-width="3"/>

  <rect x="45" y="485" width="635" height="30" rx="6" fill="#E2E8F0"/>
  <text x="362" y="505" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Ausbildung &amp; Anerkennung nach BBiG über die zuständige Bezirksärztekammer</text>
</svg>"""

# 8. Mutterschutz & Elternzeit Zeitstrahl (Draft 91)
SVGS["mutterschutz-elternzeit-zeitstrahl.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Mutterschutz (MuSchG) &amp; Elternzeit (BEEG) bei Drittstaatenkräften</text>

  <!-- Timeline Phase 1 -->
  <g transform="translate(50, 115)">
    <rect width="180" height="240" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="36" rx="8" fill="#002B49"/>
    <text x="90" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">6 Wochen vor Geburt</text>
    <text x="15" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Schutzfrist § 3 MuSchG</text>
    <text x="15" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Beschäftigungsverbot</text>
    <text x="15" y="110" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Ausnahme nur bei</text>
    <text x="15" y="128" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  ausdrücklicher Erklärung</text>
    <text x="15" y="155" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Vergütung</text>
    <text x="15" y="180" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Mutterschaftsgeld</text>
    <text x="15" y="200" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• AG-Zuschuss (§ 20 MuSchG)</text>
    <text x="15" y="222" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ 100% U2-Umlage Erstattung</text>
  </g>

  <!-- Timeline Phase 2 -->
  <g transform="translate(270, 115)">
    <rect width="180" height="240" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="36" rx="8" fill="#EE1C25"/>
    <text x="90" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">8 bzw. 12 W. nach Geburt</text>
    <text x="15" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Absolutes Verbot</text>
    <text x="15" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Keine Arbeit zulässig</text>
    <text x="15" y="110" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• 12 Wochen bei Früh- oder</text>
    <text x="15" y="128" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  Mehrlingsgeburten</text>
    <text x="15" y="155" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Aufenthaltsstatus</text>
    <text x="15" y="180" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Aufenthaltstitel bleibt</text>
    <text x="15" y="200" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  vollumfänglich gültig</text>
    <text x="15" y="222" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Absoluter Kündigungsschutz</text>
  </g>

  <!-- Timeline Phase 3 -->
  <g transform="translate(490, 115)">
    <rect width="180" height="240" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="36" rx="8" fill="#00A86B"/>
    <text x="90" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Elternzeit (bis 3 Jahre)</text>
    <text x="15" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">BEEG Anspruch</text>
    <text x="15" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Rechtsanspruch nach BEEG</text>
    <text x="15" y="110" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Elterngeldbezug bei</text>
    <text x="15" y="128" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  Erwerbstätigentiteln</text>
    <text x="15" y="155" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Ausbildungsvertrag</text>
    <text x="15" y="180" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Verlängerungsantrag bei</text>
    <text x="15" y="200" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  Kammer (§ 8 Abs. 2 BBiG)</text>
    <text x="15" y="222" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Sichere Rückkehr in Betrieb</text>
  </g>

  <!-- Connectors -->
  <line x1="230" y1="235" x2="270" y2="235" stroke="#002B49" stroke-width="3"/>
  <line x1="450" y1="235" x2="490" y2="235" stroke="#EE1C25" stroke-width="3"/>

  <!-- Info Box bottom -->
  <g transform="translate(50, 380)">
    <rect width="620" height="90" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <text x="25" y="30" fill="#002B49" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Wichtig für Arbeitgeber bei Drittstaatsangehörigen (§ 16a / § 18a / § 18b):</text>
    <text x="25" y="55" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12">• Mutterschutz &amp; Elternzeit gefährden den Aufenthaltstitel nicht. Die ABH verlängert das Visum zweckentsprechend.</text>
    <text x="25" y="75" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• U2-Umlage erstattet Arbeitgebern 100% des Zuschusses zum Mutterschaftsgeld sowie die Arbeitgeberbeiträge.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="510" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Gesetzeskonforme Begleitung durch DMF Talents: HR-Compliance, Kammerabstimmung &amp; ABH-Meldung</text>
</svg>"""

# 9. Entgeltfortzahlung & Auslandskrankmeldung (Draft 92)
SVGS["entgeltfortzahlung-meldung-krankheit-prozess.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Entgeltfortzahlung (EFZG) &amp; Erkrankung im Ausland</text>

  <!-- Step 1: Krankmeldung -->
  <g transform="translate(50, 115)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">1. Meldung vor Arbeitsbeginn</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Gesetzliche Pflicht (§ 5 Abs. 1 EFZG)</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Unverzügliche Mitteilung per Telefon/Mail</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Voraussichtliche Krankheitsdauer angeben</text>
    <text x="20" y="145" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Gilt im Inland wie im Ausland gleichermaßen</text>
  </g>

  <!-- Step 2: eAU vs Ausland -->
  <g transform="translate(390, 115)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#EE1C25"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">2. Ärztliches Attest (eAU vs. Papier)</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Inland: Digitaler eAU-Abruf bei Krankenkasse</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Im Ausland (Vietnam): Papier-Attest mit Diagnose,</text>
    <text x="20" y="110" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">  ICD-10-Code &amp; Arbeitsunfähigkeitsbestätigung</text>
    <text x="20" y="145" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ § 5 Abs. 2 EFZG Sonderregeln beachten</text>
  </g>

  <!-- Step 3: Lohnfortzahlung -->
  <g transform="translate(50, 310)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#00A86B"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">3. 6 Wochen Entgeltfortzahlung</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Anspruch nach 4-wöchiger Wartezeit (§ 3 EFZG)</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• 100 % des regulären Arbeitsentgelts</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• U1-Umlageerstattung (40–80 %) für Kleinbetriebe</text>
    <text x="20" y="145" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Ab Woche 7: Krankengeld durch GKV (§ 44 SGB V)</text>
  </g>

  <!-- Step 4: Heimaturlaub Rückkehr -->
  <g transform="translate(390, 310)">
    <rect width="280" height="165" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="34" rx="8" fill="#002B49"/>
    <text x="140" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">4. Heimaturlaub &amp; Reiseunfähigkeit</text>
    <text x="20" y="65" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="600">• Meldeadresse &amp; Aufenthaltsort im Ausland</text>
    <text x="20" y="90" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Flugunfähigkeitsbescheinigung (Fit to fly Test)</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Krankenkassen-Information nach § 5 Abs. 2 EFZG</text>
    <text x="20" y="145" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Urlaubsunterbrechung nach § 9 BUrlG</text>
  </g>

  <rect x="50" y="495" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="515" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Rechtssicherer Umgang mit Attesten aus Nicht-EU-Staaten: BAG-Grundsätze zur Erschütterung des Beweiswerts</text>
</svg>"""

# 10. Arbeitsunfall DGUV (Draft 93)
SVGS["arbeitsunfall-dguv-meldekette.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Arbeitsunfall (SGB VII) &amp; Berufsgenossenschaft: Meldekette</text>

  <!-- Step 1 -->
  <g transform="translate(45, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#EE1C25"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">1. Akutphase</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Erstversorgung</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Betriebliche Ersthelfer</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Notruf 112</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Verbandbucheintrag</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">D-Arzt</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Vorstellung beim</text>
    <text x="15" y="208" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  Durchgangsarzt</text>
    <text x="15" y="315" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Sofort handeln</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(210, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#002B49"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">2. BG-Meldung</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">3-Tage-Frist</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Gesetzliche Pflicht</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  nach § 193 SGB VII</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Bei &gt; 3 Tagen AU</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Unfallanzeige</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Online-Portal der BG</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Kopie an Betriebsrat</text>
    <text x="15" y="315" fill="#002B49" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Gesetzliche Pflicht</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(375, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#00A86B"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">3. Leistungen</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Behandlung</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• 100% Kostenübernahme</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Keine Zuzahlungen</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Reha &amp; Heilmittel</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Verletztengeld</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• 80% des Regelentgelts</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Nach 6 Wochen EFZ</text>
    <text x="15" y="315" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Durch BG finanziert</text>
  </g>

  <!-- Step 4 -->
  <g transform="translate(540, 120)">
    <rect width="140" height="340" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="40" rx="8" fill="#002B49"/>
    <text x="70" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">4. Reha &amp; Titel</text>
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">BEM-Verfahren</text>
    <text x="15" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• § 167 Abs. 2 SGB IX</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Stufenweise Rückkehr</text>
    <text x="15" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">  (Hamburger Modell)</text>
    <text x="15" y="165" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Visumsschutz</text>
    <text x="15" y="190" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Kein Visumsverlust</text>
    <text x="15" y="210" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">• Unfallschutz ab Tag 1</text>
    <text x="15" y="315" fill="#002B49" font-family="system-ui, sans-serif" font-size="10" font-weight="600">✓ Aufenthaltsrecht sicher</text>
  </g>

  <!-- Connectors -->
  <line x1="185" y1="290" x2="210" y2="290" stroke="#EE1C25" stroke-width="3"/>
  <line x1="350" y1="290" x2="375" y2="290" stroke="#002B49" stroke-width="3"/>
  <line x1="515" y1="290" x2="540" y2="290" stroke="#00A86B" stroke-width="3"/>

  <rect x="45" y="485" width="635" height="30" rx="6" fill="#E2E8F0"/>
  <text x="362" y="505" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Voller Gesetzlicher Unfallversicherungsschutz ab dem ersten Tag – unabhängig von der Nationalität</text>
</svg>"""

# 11. Rückzahlungsklauseln Kriterien (Draft 94)
SVGS["rueckzahlungsklausel-wirksamkeits-kriterien.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Rückzahlungsklauseln: BAG-Rechtsprechung &amp; § 12 BBiG</text>

  <!-- Unwirksam (Rot) -->
  <g transform="translate(50, 115)">
    <rect width="290" height="350" rx="8" fill="#FFFFFF" stroke="#EE1C25" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="36" rx="8" fill="#EE1C25"/>
    <text x="145" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">❌ Gesetzlich UNWIRKSAM</text>
    
    <text x="20" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">1. Auszubildende (§ 12 BBiG):</text>
    <text x="20" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Absolute Unwirksamkeit aller</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">  Kostenrückzahlungen für Azubis</text>
    <text x="20" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Zwingendes Schutzrecht des BBiG</text>

    <text x="20" y="175" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">2. Vermittlungskosten Fachkräfte:</text>
    <text x="20" y="200" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Agenturhonorare sind reines AG-Risiko</text>
    <text x="20" y="220" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Keine Abwälzung auf Arbeitnehmer</text>
    <text x="20" y="240" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Klausel ist nach § 307 BGB nichtig</text>

    <text x="20" y="280" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">3. Starre Bindungsfristen:</text>
    <text x="20" y="305" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Ohne monatliche Abschmelzung</text>
    <text x="20" y="325" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Kündigung durch AG unverschuldet</text>
  </g>

  <!-- Wirksam (Grün) -->
  <g transform="translate(380, 115)">
    <rect width="290" height="350" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="36" rx="8" fill="#00A86B"/>
    <text x="145" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">✓ Unter Auflagen WIRKSAM</text>

    <text x="20" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">1. Echter geldwerter Vorteil:</text>
    <text x="20" y="95" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Erwerb übertragbarer Qualifikationen</text>
    <text x="20" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Z. B. Sprachkurse C1, Schweißerschein,</text>
    <text x="20" y="135" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">  Führerschein Klasse C/CE oder D</text>

    <text x="20" y="175" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">2. Angemessene Bindungsdauer:</text>
    <text x="20" y="200" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Bis 1 Monat Kurs: max. 6 Monate</text>
    <text x="20" y="220" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Bis 6 Monate Kurs: max. 12 Monate</text>
    <text x="20" y="240" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Bis 2 Jahre Weiterbildung: max. 24–36 Mon.</text>

    <text x="20" y="280" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">3. Pro-rata-temporis Abschmelzung:</text>
    <text x="20" y="305" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Minderung um z. B. 1/24 pro Monat</text>
    <text x="20" y="325" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">• Genaue Aufschlüsselung der Kosten</text>
  </g>

  <rect x="50" y="485" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="505" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">BAG-Leitlinien: Employer-Pays-Prinzip (§ 296a SGB III) schützt Betriebe vor teuren Abmahnungen</text>
</svg>"""

# 12. Daueraufenthalt EU vs Niederlassungserlaubnis (Draft 95)
SVGS["daueraufenthalt-eu-vs-niederlassung-vergleich.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC" rx="12"/>
  <rect x="30" y="30" width="660" height="60" rx="8" fill="#002B49"/>
  <text x="360" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Daueraufenthalt-EU (§ 9a) vs. Niederlassungserlaubnis (§ 18c)</text>

  <!-- Column 1: Kriterium -->
  <g transform="translate(45, 115)">
    <rect width="180" height="350" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="36" rx="8" fill="#002B49"/>
    <text x="90" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Kriterium</text>
    
    <text x="15" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Rechtsgrundlage</text>
    <text x="15" y="115" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Wartezeit (Aufenthalt)</text>
    <text x="15" y="160" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Rentenbeiträge</text>
    <text x="15" y="205" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">EU-Mobilität</text>
    <text x="15" y="250" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Sprachanforderung</text>
    <text x="15" y="295" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Erlöschen bei Abwesenheit</text>
    <text x="15" y="335" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Hauptvorteil</text>
  </g>

  <!-- Column 2: Daueraufenthalt-EU (§ 9a) -->
  <g transform="translate(235, 115)">
    <rect width="215" height="350" rx="8" fill="#FFFFFF" stroke="#00A86B" stroke-width="2"/>
    <rect x="0" y="0" width="215" height="36" rx="8" fill="#00A86B"/>
    <text x="107" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">§ 9a Daueraufenthalt-EU</text>
    
    <text x="15" y="70" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">EU-Richtlinie 2003/109/EG</text>
    <text x="15" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">5 Jahre (60 Monate) ununterbrochen</text>
    <text x="15" y="160" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">60 Monate Pflichtbeiträge</text>
    <text x="15" y="205" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">✓ Ja, vereinfachte Erwerbstätigkeit</text>
    <text x="15" y="218" fill="#00A86B" font-family="system-ui, sans-serif" font-size="10">  in fast allen EU-Ländern</text>
    <text x="15" y="250" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">B1 Deutsch (ausreichend)</text>
    <text x="15" y="295" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">Erst nach 12 Monaten Nicht-EU</text>
    <text x="15" y="308" fill="#64748B" font-family="system-ui, sans-serif" font-size="10">oder 6 Jahren Nicht-D</text>
    <text x="15" y="335" fill="#00A86B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Freizügigkeit im EU-Raum</text>
  </g>

  <!-- Column 3: Niederlassungserlaubnis (§ 18c) -->
  <g transform="translate(460, 115)">
    <rect width="215" height="350" rx="8" fill="#FFFFFF" stroke="#002B49" stroke-width="2"/>
    <rect x="0" y="0" width="215" height="36" rx="8" fill="#002B49"/>
    <text x="107" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">§ 18c Niederlassungserlaubnis</text>
    
    <text x="15" y="70" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">Nationales Aufenthaltsgesetz</text>
    <text x="15" y="115" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Nur 3 Jahre (21–27 M. Blaue Karte)</text>
    <text x="15" y="160" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Nur 36 bzw. 21–27 Monate</text>
    <text x="15" y="205" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="11">❌ Nein, nur auf Deutschland</text>
    <text x="15" y="218" fill="#EE1C25" font-family="system-ui, sans-serif" font-size="10">  beschränkt</text>
    <text x="15" y="250" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">B1 Deutsch (bei BK: A1 nach 27 M.)</text>
    <text x="15" y="295" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">Bereits nach 6 Monaten</text>
    <text x="15" y="308" fill="#64748B" font-family="system-ui, sans-serif" font-size="10">Auslandsaufenthalt (§ 51)</text>
    <text x="15" y="335" fill="#002B49" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Schnellere Verfestigung in D</text>
  </g>

  <rect x="50" y="485" width="620" height="30" rx="6" fill="#E2E8F0"/>
  <text x="360" y="505" fill="#0F172A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Strategische Mitarbeiterbindung: Beide Titel schließen sich nicht gegenseitig aus</text>
</svg>"""

def main():
    PUB_DIR.mkdir(parents=True, exist_ok=True)
    for filename, content in SVGS.items():
        out_path = PUB_DIR / filename
        out_path.write_text(content.strip(), encoding="utf-8")
        print(f"Generated SVG: {filename}")
    print(f"\nAll {len(SVGS)} Phase 7 SVG diagrams generated successfully in {PUB_DIR}")

if __name__ == "__main__":
    main()
