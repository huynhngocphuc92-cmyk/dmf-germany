#!/usr/bin/env python3
"""
Generate 12 Custom Vector SVG Infographics for Phase 9 Articles (720x540 px).
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

# 1. Bayern Wirtschaftsregionen & Fachkräftebedarf
SVGS["bayern-wirtschaftsregionen-fachkraeftebedarf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Bayern: Industriestandorte &amp; Fachkräftebedarf</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, -apple-system, sans-serif" font-size="13" text-anchor="middle">Schwerpunkte für Fachkräfte und Auszubildende aus Vietnam im Freistaat</text>

  <!-- 4 Regional Cards -->
  <g transform="translate(50, 130)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#003366"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">1. Metropolregion München / Oberbayern</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Industrieschwerpunkte:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• IT, Halbleiter, Softwareentwicklung</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Luft- und Raumfahrt, Automatisierung</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Kliniken &amp; universitäre Spitzenmedizin</text>
  </g>

  <g transform="translate(375, 130)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#FF6600"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">2. Nürnberg / Mittelfranken</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Industrieschwerpunkte:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Maschinenbau, Antriebstechnik, Mechatronik</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Leistungselektronik, Energietechnik</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Sitz der ZABF Bayern (Zentrale Ausländerbehörde)</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#003366"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">3. Augsburg / Schwaben</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Industrieschwerpunkte:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Robotik, Faserverbundtechnologie (CFK)</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Bauhandwerk, SHK, Elektrotechnik</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Mittelständische Zulieferbetriebe</text>
  </g>

  <g transform="translate(375, 310)">
    <rect width="295" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="36" rx="8" fill="#003366"/>
    <text x="147" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">4. Niederbayern &amp; Oberpfalz</text>
    <text x="20" y="62" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Industrieschwerpunkte:</text>
    <text x="20" y="82" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Automobilfertigung (Dingolfing, Regensburg)</text>
    <text x="20" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Starker Nachwuchsmangel im ländlichen Handwerk</text>
    <text x="20" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Hohe betriebliche Übernahmequoten</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Behördenpartner: ZABF Nürnberg &amp; IHK/HWK Bayern für beschleunigte Verfahren (§ 81a AufenthG)</text>
</svg>"""

# 2. Baden-Württemberg Industrie-Cluster-Matrix
SVGS["baden-wuerttemberg-industrie-cluster-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Baden-Württemberg: Industrie- &amp; Handwerkscluster</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Technologieführer, Formenbau und duale Ausbildung im Südwesten</text>

  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Region Stuttgart / Neckar-Alb: Maschinenbau &amp; Automotive</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Weltmarktführer in Antriebstechnik, Werkzeugmaschinen und E-Mobilität. Hoher Bedarf an Mechatronikern.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Schwarzwald-Baar-Heuberg: Präzisionstechnik &amp; Medizintechnik</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Europäisches Zentrum für chirurgische Instrumente und Feinmechanik. Bedarf an Zerspanern und Werkzeugmachern.</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. TechnologieRegion Karlsruhe &amp; Rhein-Neckar: IT &amp; Automatisierung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Führender IT- und Forschungsstandort. Hohe Nachfrage nach Fachinformatikern und Cloud-Spezialisten.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. Bodensee-Oberschwaben: Handwerk, Tourismus &amp; Zulieferer</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Starke Handwerksdichte mit akutem Nachwuchsmangel in SHK, Holzbau, Gastronomie und Pflege.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Tarifniveau: Metall BW / Dehoga BW bieten höchste Attraktivität für internationale Talente</text>
</svg>"""

# 3. NRW Gesundheitswirtschaft & Anerkennung
SVGS["nrw-gesundheitswirtschaft-anerkennung-schema.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Nordrhein-Westfalen: Pflegerekrutierung &amp; Anerkennung</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Ablauf über MAGS NRW, ZAG Münster und regionale Kliniken</text>

  <!-- 4 Step Process -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Zentrale Antragsstellung bei der ZAG Münster</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Zentrale Anerkennungsstelle für Gesundheitsberufe in NRW prüft vietnamesische Pflegediplome.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Einreise über die Anerkennungspartnerschaft (§ 16d Abs. 3)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Sofortiger Einsatz als Pflegeassistenzkraft in NRW-Kliniken und Seniorenzentren ab Tag 1.</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Berufsbegleitender Anpassungslehrgang / Kenntnisprüfung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Praktische Qualifizierung in Geriatrie, Pädiatrie und ambulanter Pflege an Partnerschulen in NRW.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. Urkunde als Pflegefachfrau / Pflegefachmann &amp; Registrierung</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Erteilung der staatlichen Erlaubnis und Übernahme in den TvöD-P-Tarifvertrag der Klinik.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Regionale Partner: Universitätskliniken (Köln, Essen, Düsseldorf) und caritative Träger</text>
</svg>"""

# 4. Hessen / Rhein-Main Logistik & IT
SVGS["hessen-rhein-main-logistik-it-infrastruktur.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Hessen &amp; Rhein-Main: IT- und Logistikdrehscheibe</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Rekrutierung für Flughafen Frankfurt, Rechenzentren und Systemhäuser</text>

  <!-- 3 Sector Columns -->
  <g transform="translate(50, 130)">
    <rect width="195" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="195" height="40" rx="8" fill="#003366"/>
    <text x="97" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Flughafen Frankfurt</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Bedarfsfelder:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Luftfahrt-Instandhaltung (MRO)</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Frachtlogistik &amp; Air Cargo</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Bodenverkehrsdienste</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Flugsicherheit (§ 7 LuftSiG)</text>
  </g>

  <g transform="translate(262, 130)">
    <rect width="195" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="195" height="40" rx="8" fill="#FF6600"/>
    <text x="97" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Data Center Capital</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Bedarfsfelder:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Rechenzentrums-Administration</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Kälte- und Klimatechnik (HVAC)</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• USV &amp; Hochspannungsnetze</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• IT-Sicherheit &amp; NIS-2</text>
  </g>

  <g transform="translate(475, 130)">
    <rect width="195" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="195" height="40" rx="8" fill="#003366"/>
    <text x="97" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Rhein-Main Mittelstand</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Bedarfsfelder:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Handwerk: Elektro &amp; SHK</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• ÖPNV: Bus- &amp; Bahnfahrer</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Gastronomie &amp; Hotelketten</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">• Spedition &amp; Kontraktlogistik</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Zuständige Behörde: Regierungspräsidium Darmstadt für beschleunigte Verfahren (§ 81a)</text>
</svg>"""

# 5. Niedersachsen & Bremen Wirtschaftssektoren
SVGS["niedersachsen-bremen-wirtschaftssektoren.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Niedersachsen &amp; Bremen: Wirtschaftssektoren</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Bedarfsanalyse für Industrie, maritime Logistik, Lebensmitteltechnik und Handwerk</text>

  <!-- 4 Step Overview -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1. Maritime Logistik &amp; Hafenwirtschaft (Bremen / Bremerhaven / JadeWeserPort)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Berufskraftfahrer (§ 24a BeschV), Hafenfacharbeiter, Container-Instandhaltung und Schiffstechnik.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2. Lebensmittelindustrie &amp; Agrartechnologie (Oldenburger Münsterland)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Fleischer, Fachkräfte für Lebensmitteltechnik, Land- und Baumaschinenmechatroniker.</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3. Automotive &amp; Mobilität (Hannover / Braunschweig / Wolfsburg)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Kfz-Mechatroniker, Hochvolt-Techniker, Elektroniker für Automatisierungstechnik.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4. Flächenhandwerk &amp; Erneuerbare Energien (Windkraft &amp; Solar)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Dachdecker, Solarteure, SHK-Wärmepumpenmonteure und Elektrotechniker in ländlichen Kreisen.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Zuständige Agenturen: ZAV Hannover &amp; Handwerkskammern Hannover, Braunschweig-Lüneburg-Stade</text>
</svg>"""

# 6. Ostdeutschland Demografie & Fachkräftelösung
SVGS["ostdeutschland-demografie-fachkraefte-loesung.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Ostdeutschland: Demografiewandel &amp; Fachkräftesicherung</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Lösungsmodelle für Sachsen, Thüringen und Sachsen-Anhalt</text>

  <!-- 2 Big Comparison Boxes -->
  <g transform="translate(50, 130)">
    <rect width="295" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="40" rx="8" fill="#FF6600"/>
    <text x="147" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Herausforderung in Ostdeutschland</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Demografischer Befund:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Renteneintritt der geburtenstarken Jahrgänge</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Über 30 % unbesetzte Ausbildungsplätze im Handwerk</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Boom in Silicon Saxony (Dresden Microchips)</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Massive Konkurrenz um regionale Bewerber</text>
    <text x="20" y="190" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Praxis- und Betriebsschließungen mangels Nachfolge</text>
  </g>

  <g transform="translate(375, 130)">
    <rect width="295" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="40" rx="8" fill="#003366"/>
    <text x="147" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Lösung durch DMF Talents</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Strategischer Ansatz:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Junge, motivierte Fachkräfte &amp; Azubis aus Vietnam</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Historische Verbundenheit &amp; kulturelle Nähe</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Günstigere Lebenshaltung &amp; Wohnkosten im Osten</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Feste DMF Integrationspaten vor Ort in Dresden/Leipzig</text>
    <text x="20" y="190" fill="#475569" font-family="system-ui, sans-serif" font-size="11">✓ Langfristige Bindung an regionale Betriebe</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Erfolgsfaktor: Gezielte Willkommenskultur und Begleitung im ländlichen Raum</text>
</svg>"""

# 7. Personalvermittlung Kostenstruktur
SVGS["personalvermittlung-kostenstruktur-aufschluesselung.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Personalvermittlung Vietnam: Transparente Kostenstruktur</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Gesamtkalkulation für Arbeitgeber nach Employer-Pays-Prinzip (§ 296a SGB III)</text>

  <!-- 4 Cost Pillars -->
  <g transform="translate(50, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">1. Auswahl</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Profilabgleich</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Fachinterviews VN</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Praxis-Werkstatttest</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Video-Vorstellung</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Zeugnisvorprüfung</text>
  </g>

  <g transform="translate(210, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#FF6600"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">2. Sprache</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Intensivkurs A1-B1</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Fachdeutsch Handwerk/Medizin</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Offizielle telc/Goethe Prüfung</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Interkulturelles Training</text>
  </g>

  <g transform="translate(370, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">3. Behörden</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• ZAV Vorabzustimmung</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• § 81a Verfahren (411 €)</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• ZAB / HWK / IHK Gebühr</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Botschaftsvisum (75 €)</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Beglaubigungen &amp; Übersetzungen</text>
  </g>

  <g transform="translate(530, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">4. Transfer</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Flugticket VN-DE</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Flughafenabholung</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Wohnungsvermittlung</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Bürgeramt &amp; Bankkonto</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• DMF Integrationspate</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Rechtssicherheit: 100 % Konformität mit dem Verbot von Vermittlungsgebühren für Bewerber</text>
</svg>"""

# 8. Agentur Auswahl Qualitaetskriterien Radar
SVGS["agentur-auswahl-qualitaetskriterien-radar.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Audit-Checkliste: Qualitätskriterien für Personalagenturen</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Die 5 Prüfdimensionen für Geschäftsführer und Personalentscheider</text>

  <!-- 5 Criteria Rows -->
  <g transform="translate(50, 125)">
    <rect width="620" height="60" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="60" rx="4" fill="#003366"/>
    <text x="35" y="26" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Eigene Infrastruktur &amp; Ausbildungszentren in Vietnam</text>
    <text x="35" y="46" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Keine reinen Sub-Vermittler; eigene Sprachinstitute mit Vollzeit-Lehrkräften in Hanoi und Ho-Chi-Minh-Stadt.</text>
  </g>

  <g transform="translate(50, 195)">
    <rect width="620" height="60" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="60" rx="4" fill="#FF6600"/>
    <text x="35" y="26" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Einhaltung des Employer-Pays-Prinzips (§ 296a SGB III)</text>
    <text x="35" y="46" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Transparenter Nachweis: Bewerber zahlen 0 € Vermittlungsgebühren. Schutz vor Schuldknechtschaft.</text>
  </g>

  <g transform="translate(50, 265)">
    <rect width="620" height="60" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="60" rx="4" fill="#003366"/>
    <text x="35" y="26" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Rechtssicherheit im beschleunigten Fachkräfteverfahren (§ 81a)</text>
    <text x="35" y="46" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Lückenlose Steuerung von ZAB, IHK FOSA, HWK, ZAV und Terminen an der Deutschen Botschaft.</text>
  </g>

  <g transform="translate(50, 335)">
    <rect width="620" height="60" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="60" rx="4" fill="#003366"/>
    <text x="35" y="26" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">4. Vertragliche Nachbesetzungsgarantie bei Ausbildungsabbruch</text>
    <text x="35" y="46" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Kostenfreie Nachvermittlung bei Nichtbestehen der Probezeit oder Abbruch binnen der ersten 6 Monate.</text>
  </g>

  <g transform="translate(50, 405)">
    <rect width="620" height="60" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="60" rx="4" fill="#003366"/>
    <text x="35" y="26" fill="#1E293B" font-family="system-ui, sans-serif" font-size="14" font-weight="700">5. Muttersprachliche 24/7 Vor-Ort-Betreuung in Deutschland</text>
    <text x="35" y="46" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Feste DMF Integrationspaten begleiten bei Behörden, Ärzten, Berufsschule und persönlicher Eingewöhnung.</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Qualitätssiegel: Faire Anwerbung Pflege Deutschland e.V. &amp; ZAV-geprüfte Partnerschaften</text>
</svg>"""

# 9. Ausbildungsabbruch Praevention & Garantie System
SVGS["ausbildungsabbruch-praevention-garantie-system.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Ausbildungsabbruch-Prävention &amp; Nachbesetzungsgarantie</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Das mehrstufige Sicherheitsnetz von DMF Talents für Ausbildungsbetriebe</text>

  <!-- 3 Stage Funnel -->
  <g transform="translate(50, 130)">
    <rect width="620" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="85" rx="4" fill="#003366"/>
    <text x="35" y="30" fill="#003366" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Stufe 1: Eignungsprüfung &amp; Matching in Vietnam (Prävention)</text>
    <text x="35" y="52" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Sorgfältige Selektion: Nur Bewerber mit echter Berufsaffinität und B1-Zertifikat.</text>
    <text x="35" y="70" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Transparente Aufklärung über Arbeitsalltag, Wetter, Kultur und Pflichten im deutschen Handwerk/Pflege.</text>
  </g>

  <g transform="translate(50, 230)">
    <rect width="620" height="85" rx="8" fill="#FFFFFF" stroke="#FF6600" stroke-width="2"/>
    <rect width="8" height="85" rx="4" fill="#FF6600"/>
    <text x="35" y="30" fill="#FF6600" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Stufe 2: Kontinuierliche Patenbegleitung im Betrieb (Frühwarnsystem)</text>
    <text x="35" y="52" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Monatliche Feedbackgespräche mit Ausbilder und Azubi durch zweisprachige DMF-Paten.</text>
    <text x="35" y="70" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Sofortige Schlichtung bei Sprachbarrieren, Heimweh oder Missverständnissen im Team.</text>
  </g>

  <g transform="translate(50, 330)">
    <rect width="620" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="85" rx="4" fill="#003366"/>
    <text x="35" y="30" fill="#003366" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Stufe 3: Vertragliche Nachbesetzungsgarantie (Ausfallschutz)</text>
    <text x="35" y="52" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Kündigt der Azubi in der Probezeit oder bricht die Ausbildung ab:</text>
    <text x="35" y="70" fill="#475569" font-family="system-ui, sans-serif" font-size="12">DMF Talents stellt kostenfrei einen geeigneten Ersatzkandidaten oder erstattet das Honorar anteilig.</text>
  </g>

  <rect x="50" y="445" width="620" height="65" rx="8" fill="#003366" opacity="0.06"/>
  <text x="360" y="470" fill="#003366" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">DMF-Erfolgsbilanz: Ausbildungsabbruchquote unter 3 %</text>
  <text x="360" y="492" fill="#475569" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">(Bundesweiter Branchendurchschnitt im Handwerk liegt bei ca. 30 %)</text>
</svg>"""

# 10. Eigenrekrutierung vs Agentur Aufwandsvergleich
SVGS["eigenrekrutierung-vs-agentur-aufwandsvergleich.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Make-or-Buy: Eigenrekrutierung vs. Vermittlungsagentur</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Zeitaufwand, Fehlerrisiken und Gesamtwirtschaftlichkeit im Vergleich</text>

  <!-- 2 Columns -->
  <g transform="translate(50, 130)">
    <rect width="295" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="40" rx="8" fill="#64748B"/>
    <text x="147" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Eigenrekrutierung durch Betrieb</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Typischer interner Aufwand:</text>
    <text x="20" y="90" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⏱ ca. 180 Arbeitsstunden für HR / Meister</text>
    <text x="20" y="115" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Sprachbarriere bei Interviews ohne Dolmetscher</text>
    <text x="20" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Behördenmarathon (ZAB, IHK, ZAV, Botschaft)</text>
    <text x="20" y="165" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Hohe Ablehnungsquote bei Formfehlern</text>
    <text x="20" y="190" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Kein Vor-Ort-Ansprechpartner in Vietnam</text>
    <text x="20" y="215" fill="#475569" font-family="system-ui, sans-serif" font-size="11">⚠ Volles finanzielles Risiko bei Abbruch</text>
  </g>

  <g transform="translate(375, 130)">
    <rect width="295" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="295" height="40" rx="8" fill="#003366"/>
    <text x="147" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Full-Service über DMF Talents</text>
    <text x="20" y="65" fill="#1E293B" font-family="system-ui, sans-serif" font-size="12" font-weight="600">Schlüsselfertige Betreuung:</text>
    <text x="20" y="90" fill="#003366" font-family="system-ui, sans-serif" font-size="11">✓ Nur ca. 10 Arbeitsstunden für den Betrieb</text>
    <text x="20" y="115" fill="#003366" font-family="system-ui, sans-serif" font-size="11">✓ Eigene Sprachschule bis B1/B2 in Vietnam</text>
    <text x="20" y="140" fill="#003366" font-family="system-ui, sans-serif" font-size="11">✓ Beschleunigtes Visumverfahren (§ 81a)</text>
    <text x="20" y="165" fill="#003366" font-family="system-ui, sans-serif" font-size="11">✓ 100 % Erfolgsquote bei Visumanträgen</text>
    <text x="20" y="190" fill="#003366" font-family="system-ui, sans-serif" font-size="11">✓ Wohnraumsuche &amp; Behördenservice inklusive</text>
    <text x="20" y="215" fill="#003366" font-family="system-ui, sans-serif" font-size="11">✓ Vertragliche Nachbesetzungsgarantie</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Fazit: Full-Service spart bis zu 170 Stunden HR-Kapazität und minimiert Fehlinvestitionen</text>
</svg>"""

# 11. Anerkennungspartnerschaft Praxisphasen Zeitstrahl
SVGS["anerkennungspartnerschaft-praxisphasen-zeitstrahl.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Anerkennungspartnerschaft (§ 16d Abs. 3): Der Zeitstrahl</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Vom Vertragsschluss bis zur vollwertigen Gleichwertigkeit im Betrieb</text>

  <!-- 4 Step Timeline -->
  <g transform="translate(50, 130)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Phase 1 (Monat 1–3): Einreise &amp; Arbeitsbeginn</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Einreise mit B1-Deutsch; Einbindung in Routineabläufe; Einreichung Gleichwertigkeitsantrag bei HWK/IHK.</text>
  </g>

  <g transform="translate(50, 220)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#FF6600"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Phase 2 (Monat 4–6): Defizitbescheid &amp; Qualifizierungsplan</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Kammer stellt fest: Welche theoretischen oder praktischen Module fehlen? Erstellung betrieblicher Lehrplan.</text>
  </g>

  <g transform="translate(50, 310)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Phase 3 (Monat 7–24): Betriebliche Nachqualifizierung &amp; B2-Kurs</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Gezielte Schulung im Betrieb, Teilnahme an Kammerlehrgängen und berufsbegleitender B2-Deutschkurs.</text>
  </g>

  <g transform="translate(50, 400)">
    <rect width="620" height="75" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="8" height="75" rx="4" fill="#003366"/>
    <text x="35" y="32" fill="#1E293B" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Phase 4 (Monat 24–36): Volle Gleichwertigkeit &amp; Fachkraftstatus (§ 18a)</text>
    <text x="35" y="55" fill="#475569" font-family="system-ui, sans-serif" font-size="12">Ausstellung des vollen Anerkennungsbescheids; Wechsel in die reguläre Fachkraft-Aufenthaltserlaubnis.</text>
  </g>

  <rect x="50" y="490" width="620" height="30" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="510" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Rechtliche Höchstdauer der Anerkennungspartnerschaft: Bis zu 3 Jahre (§ 16d Abs. 3 AufenthG)</text>
</svg>"""

# 12. Executive Leitfaden 360 Grad Strategie
SVGS["executive-leitfaden-360-grad-strategie.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <rect width="720" height="540" fill="#F8FAFC"/>
  <rect x="30" y="30" width="660" height="70" rx="12" fill="#003366"/>
  <text x="360" y="62" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">Der Executive-Leitfaden: 360-Grad-Fachkräftestrategie</text>
  <text x="360" y="86" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Das Erfolgsmodell für Geschäftsführung &amp; Personalvorstand bis zur dauerhaften Mitarbeiterbindung</text>

  <!-- 4 Pillars -->
  <g transform="translate(50, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">1. Sourcing</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Profildefinition</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Fachprüfungen VN</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Video-Interviews</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• B1 Sprachcampus</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Arbeitsvertrag</text>
  </g>

  <g transform="translate(210, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#FF6600"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">2. Behörden</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• § 81a Verfahren</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• ZAV Vorabzustimmung</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Botschaftsvisum</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Anerkennungsbescheid</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Fristeinhaltung</text>
  </g>

  <g transform="translate(370, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">3. Onboarding</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• Flughafenabholung</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Möblierter Wohnraum</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Bank, Krankenkasse</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• 90-Tage-Betriebsplan</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Feste Mentoren</text>
  </g>

  <g transform="translate(530, 130)">
    <rect width="140" height="330" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <rect width="140" height="36" rx="8" fill="#003366"/>
    <text x="70" y="23" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">4. Retention</text>
    <text x="12" y="60" fill="#1E293B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">• B2-Sprachförderung</text>
    <text x="12" y="80" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Weiterbildung (§ 82)</text>
    <text x="12" y="100" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Familiennachzug (§ 29)</text>
    <text x="12" y="120" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Niederlassung (§ 18c)</text>
    <text x="12" y="140" fill="#475569" font-family="system-ui, sans-serif" font-size="10">• Dauerhafte Treue</text>
  </g>

  <rect x="50" y="485" width="620" height="35" rx="6" fill="#003366" opacity="0.08"/>
  <text x="360" y="507" fill="#003366" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Ergebnis: Planbare Unternehmenszukunft und nachhaltige Sicherung der Produktionskapazitäten</text>
</svg>"""

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for filename, content in SVGS.items():
        p = OUT_DIR / filename
        p.write_text(content.strip(), encoding="utf-8")
        print(f"Created SVG: {filename}")
        count += 1
    print(f"\nSuccessfully generated all {count} Phase 9 technical SVGs in {OUT_DIR}")

if __name__ == "__main__":
    main()
