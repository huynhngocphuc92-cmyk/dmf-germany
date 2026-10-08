#!/usr/bin/env python3
"""
Generate 12 technical vector SVG infographics for Phase 5 B2B employer blog articles.
Canvas: 720x540, DMF Brand Palette (#1e3a5f, #0891b2, #eef5f9, #475569, #ffffff).
"""

from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

SVGS = {}

# 60. zav-vorabzustimmung-zeitstrahl.svg
SVGS["zav-vorabzustimmung-zeitstrahl.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">ZAV-Vorabzustimmung (§ 31 AufenthV): Der Beschleuniger</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Verfahrensvergleich: Reguläres Visum vs. Proaktive Vorabzustimmung</text>

  <!-- Left: Reguläres Verfahren (Langsam) -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="310" height="240" rx="12" fill="#ffffff" stroke="#ef4444" stroke-width="1.5"/>
    <rect x="36" y="115" width="310" height="40" rx="12" fill="#fee2e2"/>
    <text x="52" y="141" fill="#991b1b" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Ablauf OHNE Vorabprüfung (Standard)</text>

    <text x="52" y="180" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">1. Visumantrag bei Botschaft Hanoi eingereicht</text>
    <text x="52" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">2. Botschaft leitet Akte per Post/Diplomatenpost</text>
    <text x="52" y="230" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">3. ZAV prüft Arbeitsbedingungen (Wartezeit!)</text>
    <text x="52" y="255" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">4. Rückmeldung nach Wochen an Auslandsvertretung</text>

    <rect x="52" y="280" width="278" height="55" rx="8" fill="#fef2f2"/>
    <text x="62" y="303" fill="#b91c1c" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Gesamtdauer: 16 bis 24 Wochen</text>
    <text x="62" y="323" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Hohes Risiko für verpasste Ausbildungsstarts</text>
  </g>

  <!-- Right: Mit Vorabzustimmung (Schnell) -->
  <g filter="url(#shadow)">
    <rect x="374" y="115" width="310" height="240" rx="12" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <rect x="374" y="115" width="310" height="40" rx="12" fill="#dcfce7"/>
    <text x="390" y="141" fill="#166534" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Ablauf MIT ZAV-Vorabzustimmung</text>

    <text x="390" y="180" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">1. Arbeitgeber stellt ZAV-Antrag online (digital)</text>
    <text x="390" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">2. BA-Zustimmung liegt VOR Botschaftstermin vor</text>
    <text x="390" y="230" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">3. Vorlage der Genehmigung beim Schaltertermin</text>
    <text x="390" y="255" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">4. Visum wird ohne interne Schleife direkt gedruckt</text>

    <rect x="390" y="280" width="278" height="55" rx="8" fill="#f0fdf4"/>
    <text x="400" y="303" fill="#15803d" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Gesamtdauer: 2 bis 4 Wochen</text>
    <text x="400" y="323" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Planungssicherer Start zum 1. August / September</text>
  </g>

  <!-- Bottom: 3 Core Requirements -->
  <g filter="url(#shadow)">
    <rect x="36" y="380" width="648" height="135" rx="12" fill="#1e3a5f"/>
    <text x="56" y="410" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3 zwingende Voraussetzungen für die ZAV-Zustimmung:</text>
    <text x="56" y="438" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">✓ Vollständig ausgefüllte „Erklärung zum Beschäftigungsverhältnis“ (inkl. Arbeitszeit &amp; Vergütung)</text>
    <text x="56" y="463" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">✓ Einhaltung der orts- und branchenüblichen Tariflöhne (Gleichwertigkeit der Arbeitsbedingungen)</text>
    <text x="56" y="488" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">✓ Vorlage des anerkannten Berufsabschlusses oder Defizitbescheids der Kammer</text>
  </g>
</svg>"""

# 61. defizitbescheid-qualifizierungsplan-matrix.svg
SVGS["defizitbescheid-qualifizierungsplan-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Defizitbescheid &amp; Weiterbildungsplan (§ 16d Abs. 1 AufenthG)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Struktur eines behördlich anerkannten betrieblichen Qualifizierungsplans</text>

  <!-- 3 Steps -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Kammer-Bescheid</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Feststellungsbescheid</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• IHK FOSA oder HWK prüft</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Teilanerkennung bescheinigt</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Konkrete Defizite benannt</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  (z.B. CNC-Theorie, VDE-Norm)</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Visumsgrundlage</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Der Bescheid ist KEINE</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Absage, sondern die formale</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Voraussetzung für § 16d.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Der Bildungsplan</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Betrieblicher Plan</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Zeitraum: 12 bis 24 Monate</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Zuweisung Praxisanleiter</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Genaue Ausbildungsmodule</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Begleitender Theorieunterricht</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Arbeitsleistung</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Fachkraft darf ab Tag 1</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">im Betrieb mitarbeiten und</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">volles Gehalt beziehen.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Volle Anerkennung</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Abschlussprüfung</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kenntnisprüfung oder</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  Abschlussgespräch Kammer</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Erteilung Gleichwertigkeit</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Voller Facharbeiterstatus</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Titelwechsel</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Nahtloser Wechsel von</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">§ 16d in § 18a AufenthG</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">(Fachkraft mit Anerkennung).</text>
  </g>
</svg>"""

# 62. qualifikationsanalyse-ablauf-stufen.svg
SVGS["qualifikationsanalyse-ablauf-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Qualifikationsanalyse (§ 14 BQFG): Praxis statt Papier</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Verfahren bei unverschuldet fehlenden Ausbildungsnachweisen</text>

  <!-- Process Steps -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="648" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="70" cy="157" r="18" fill="#0891b2"/>
    <text x="65" y="163" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">1</text>
    <text x="105" y="147" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Glaubhaftmachung des Dokumentenverlusts</text>
    <text x="105" y="172" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">Schulschließung, Naturkatastrophe oder behördlicher Verlust in Vietnam</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="215" width="648" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="70" cy="257" r="18" fill="#1e3a5f"/>
    <text x="65" y="263" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">2</text>
    <text x="105" y="247" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Festlegung des Prüfverfahrens durch HWK / IHK</text>
    <text x="105" y="272" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">Fachgespräch mit Sachverständigen, Arbeitsprobe in Werkstatt oder Probearbeit</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="315" width="648" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="70" cy="357" r="18" fill="#f59e0b"/>
    <text x="65" y="363" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">3</text>
    <text x="105" y="347" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Finanzierungsprüfung (Anerkennungszuschuss)</text>
    <text x="105" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">Kosten (ca. 800–2.500 €) können staatlich über das BMBF gefördert werden</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="415" width="648" height="85" rx="10" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="70" cy="457" r="18" fill="#10b981"/>
    <text x="65" y="463" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">4</text>
    <text x="105" y="447" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Erteilung der vollen Gleichwertigkeit</text>
    <text x="105" y="472" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">Kammer stellt offizielle Urkunde aus; Erteilung des Fachkräftevisums gesichert</text>
  </g>
</svg>"""

# 63. minderjaehrige-azubis-schutz-pyramide.svg
SVGS["minderjaehrige-azubis-schutz-pyramide.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Minderjährige Azubis (U18): Jugendarbeitsschutz (JArbSchG)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Rechtliche Vorgaben für Ausbildungsbetriebe und Vormundschaft</text>

  <!-- 3 Blocks -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Vertragsabschluss</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Elterliche Zustimmung</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Beide Eltern müssen</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  Vertrag unterzeichnen</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Notariell beglaubigte</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  Vollmacht für Aufenthalt</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Bankkonto &amp; Ämter</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Eröffnung Girokonto bedarf</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Übertragung von Befugnissen</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">auf lokale Betreuungsperson.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Arbeitszeitgrenzen</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 8 JArbSchG</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Max. 8 Std./Tag</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Max. 40 Std./Woche</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Strikte 5-Tage-Woche</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Keine Wochenendarbeit</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Nachtruhe &amp; Pausen</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Keine Arbeit vor 6:00 Uhr</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Keine Arbeit nach 20:00 Uhr</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Mind. 60 Min. Pause</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Gesundheitscheck</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 32 Erstuntersuchung</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Pflicht vor Arbeitsantritt</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Ärztliche Bescheinigung</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  muss im Betrieb vorliegen</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Nachuntersuchung nach 1 J.</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Gefahrenverbot</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Verbot gefährlicher Arbeiten</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  (Hitze, Kälte, Gefahrstoffe)</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Keine Akkordarbeit</text>
  </g>
</svg>"""

# 64. rekrutierungskosten-steuer-hebel.svg
SVGS["rekrutierungskosten-steuer-hebel.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Steuerliche Behandlung von Vermittlungskosten</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Betriebsausgabenabzug (§ 4 Abs. 4 EStG) &amp; Vorsteuerabzug (§ 15 UStG)</text>

  <!-- 2 Cards -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="310" height="385" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <rect x="36" y="115" width="310" height="42" rx="12" fill="#0891b2"/>
    <text x="52" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">100% Betriebsausgaben (§ 4 EStG)</text>

    <text x="52" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Sofort abzugsfähige Kosten:</text>
    <text x="52" y="202" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Vermittlungshonorare der Agentur</text>
    <text x="52" y="222" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Gebühren für beschleunigtes Verfahren (411 €)</text>
    <text x="52" y="242" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Übersetzungskosten &amp; Urkundenbeglaubigung</text>
    <text x="52" y="262" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Anerkennungsgebühren der Kammern</text>

    <line x1="52" y1="285" x2="326" y2="285" stroke="#e2e8f0" stroke-width="1.5"/>

    <text x="52" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Keine Aktivierungspflicht:</text>
    <text x="52" y="332" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Rekrutierungskosten müssen NICHT</text>
    <text x="52" y="352" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  über mehrere Jahre abgeschrieben werden.</text>
    <text x="52" y="372" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Minderung des steuerlichen Gewinns</text>
    <text x="52" y="392" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  im laufenden Wirtschaftsjahr!</text>

    <rect x="52" y="420" width="278" height="60" rx="8" fill="#eef5f9"/>
    <text x="62" y="445" fill="#0369a1" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Körperschaft- &amp; Gewerbesteuer:</text>
    <text x="62" y="465" fill="#475569" font-family="system-ui, sans-serif" font-size="11.5">Effektive Kostenreduktion um ~30%</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="374" y="115" width="310" height="385" rx="12" fill="#ffffff" stroke="#1e3a5f" stroke-width="1.5"/>
    <rect x="374" y="115" width="310" height="42" rx="12" fill="#1e3a5f"/>
    <text x="390" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Vorsteuer &amp; Lohnsteuerfreibeträge</text>

    <text x="390" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Vorsteuerabzug (§ 15 UStG):</text>
    <text x="390" y="202" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• 19% Umsatzsteuer auf Vermittlungsrechnung</text>
    <text x="390" y="222" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  vom Finanzamt voll erstattungsfähig</text>

    <line x1="390" y1="245" x2="664" y2="245" stroke="#e2e8f0" stroke-width="1.5"/>

    <text x="390" y="270" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Sprachkurse &amp; Weiterbildung:</text>
    <text x="390" y="292" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Steuerfreier Arbeitslohn nach § 3 Nr. 19 EStG,</text>
    <text x="390" y="312" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  wenn im ganz überwiegenden betrieblichen</text>
    <text x="390" y="332" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  Interesse (z. B. Fachsprachkurse B2/C1).</text>

    <line x1="390" y1="355" x2="664" y2="355" stroke="#e2e8f0" stroke-width="1.5"/>

    <text x="390" y="380" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Umzugskosten &amp; Flüge:</text>
    <text x="390" y="402" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Steuerfreie Erstattung als Reisekosten</text>
    <text x="390" y="422" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  oder Umzugskostenvergütung möglich.</text>

    <rect x="390" y="445" width="278" height="40" rx="6" fill="#f0fdf4"/>
    <text x="400" y="470" fill="#15803d" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Rechtssichere Belegführung durch DMF</text>
  </g>
</svg>"""

# 65. zimmerer-holzbau-kompetenz-matrix.svg
SVGS["zimmerer-holzbau-kompetenz-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Zimmerer &amp; Holzbau-Fachkräfte: Qualifikationsprofil</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Moderner Holzrahmenbau, Abbundtechnik &amp; energetische Sanierung</text>

  <!-- 3 Pillars -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. CNC-Abbund &amp; Halle</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Maschinelle Fertigung</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Pläne &amp; CAD-Zeichnungen</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• CNC-Abbundanlagen</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  (Hundegger, Schmidler)</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Holzbauteile vorkonfektionieren</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Holzschutz</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• DIN 68800 Holzschutz</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kerve, Zapfen &amp; Schwalben-</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  schwanzverbindungen</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Holzrahmenbau</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Wand- &amp; Deckenelemente</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Riegelwerk aufbauen</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dämmung (Holzfaser/Zellulose)</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dampfbremse &amp; Luftdichtheit</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Beplankung mit OSB / Gips</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Klimaziele</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Unterstützung der bundes-</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">weiten Holzbau-Initiative</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">für CO2-neutrales Bauen.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Baustellenmontage</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Dachstühle &amp; Aufrichten</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kranmontage von Elementen</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Richten von Dachstühlen</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Schalung &amp; Lattung</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Gerüst- &amp; Absturzsicherung</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Teamgeist</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Hohe Schwindelfreiheit,</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Körperkraft und Verlässlichkeit</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">beim Richtfest im Team.</text>
  </g>
</svg>"""

# 66. tischler-innenausbau-module.svg
SVGS["tischler-innenausbau-module.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Tischler &amp; Schreiner: Kompetenzfelder Innenausbau</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Präzisionsfertigung, CNC-Holzbearbeitung &amp; Veredelung</text>

  <!-- 4 Cards -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="310" height="185" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="52" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. CNC &amp; Maschinentechnik</text>
    <text x="52" y="175" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• 3- bis 5-Achs-CNC-Bearbeitungszentren</text>
    <text x="52" y="198" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Formatkreissäge &amp; Kantenanleimmaschinen</text>
    <text x="52" y="221" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Korpuspressen &amp; Dübeleintreibautomaten</text>
    <text x="52" y="244" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• CAD/CAM-Datenübernahme</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="374" y="115" width="310" height="185" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="374" y="115" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="390" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Möbel- &amp; Individualbau</text>
    <text x="390" y="175" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Maßanfertigung von Küchen &amp; Schränken</text>
    <text x="390" y="198" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Furnierarbeiten &amp; Massivholzauswahl</text>
    <text x="390" y="221" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Hochwertige Beschlagstechnik (Blum, Hettich)</text>
    <text x="390" y="244" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Laden- &amp; Praxiseinrichtungen</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="325" width="310" height="185" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="325" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="52" y="348" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Oberflächenveredelung</text>
    <text x="52" y="385" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Spritzlackierung im Farbraum</text>
    <text x="52" y="408" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Beizen, Ölen &amp; Wachsen von Harthölzern</text>
    <text x="52" y="431" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Hochglanz- und Mattlackierungen</text>
    <text x="52" y="454" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Schleiftechnik (Kalibrieren &amp; Feinschliff)</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="374" y="325" width="310" height="185" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <rect x="374" y="325" width="310" height="36" rx="12" fill="#0891b2"/>
    <text x="390" y="348" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">4. Vor-Ort-Montage</text>
    <text x="390" y="385" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Einbau von Fenstern, Türen &amp; Zargen</text>
    <text x="390" y="408" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Passleisten &amp; Wandanschlüsse einpassen</text>
    <text x="390" y="431" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Saubere Baustellenübergabe an Kunden</text>
    <text x="390" y="454" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Freundliches Kundenauftreten (Deutsch B1/B2)</text>
  </g>
</svg>"""

# 67. staplerschein-dguv-pruefpfad.svg
SVGS["staplerschein-dguv-pruefpfad.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Gabelstapler &amp; Flurförderzeuge (DGUV Vorschrift 68)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Rechtssicherer Prüfpfad für internationale Lager- und Logistikkräfte</text>

  <!-- Left: Warum ausländische Scheine ungültig sind -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="310" height="230" rx="12" fill="#ffffff" stroke="#ef4444" stroke-width="1.5"/>
    <rect x="36" y="115" width="310" height="40" rx="12" fill="#fee2e2"/>
    <text x="52" y="141" fill="#991b1b" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Keine automatische Anerkennung!</text>

    <text x="52" y="180" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Drittstaaten-Staplerscheine gelten NICHT</text>
    <text x="52" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Keine Anlage zur Umschreibung wie bei Kfz</text>
    <text x="52" y="230" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Fahren ohne DGUV-Schein = Organisations-</text>
    <text x="52" y="250" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  verschulden des Arbeitgebers (§ 7 DGUV V68)</text>

    <rect x="52" y="275" width="278" height="50" rx="6" fill="#fef2f2"/>
    <text x="60" y="295" fill="#b91c1c" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Haftungsfalle:</text>
    <text x="60" y="312" fill="#b91c1c" font-family="system-ui, sans-serif" font-size="11.5">Regress der Berufsgenossenschaft bei Unfällen!</text>
  </g>

  <!-- Right: Die DGUV 308-001 Lösung -->
  <g filter="url(#shadow)">
    <rect x="374" y="115" width="310" height="230" rx="12" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <rect x="374" y="115" width="310" height="40" rx="12" fill="#dcfce7"/>
    <text x="390" y="141" fill="#166534" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Der 1-Tages-Schulungspfad (DGUV)</text>

    <text x="390" y="180" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Bei Vorerfahrung in Vietnam reicht ein</text>
    <text x="390" y="200" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  kompakter 1- bis 2-tägiger Nachschulungskurs</text>
    <text x="390" y="225" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Theoretische Prüfung (multiple choice, DE/VN)</text>
    <text x="390" y="250" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Praktische Fahrprüfung (Parcours &amp; Stapeln)</text>

    <rect x="390" y="275" width="278" height="50" rx="6" fill="#f0fdf4"/>
    <text x="400" y="295" fill="#15803d" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Ergebnis:</text>
    <text x="400" y="312" fill="#15803d" font-family="system-ui, sans-serif" font-size="11.5">Offizieller Bedienerausweis für Flurförderzeuge</text>
  </g>

  <!-- Bottom: 3 Stufen zur Beauftragung -->
  <g filter="url(#shadow)">
    <rect x="36" y="370" width="648" height="145" rx="12" fill="#1e3a5f"/>
    <text x="56" y="400" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Die 3 gesetzlichen Schritte vor der ersten Fahrt im Lager:</text>
    <text x="56" y="428" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">1. Ärztliche Eignungsuntersuchung nach Grundsatz G25 (Fahr- und Steuertätigkeit)</text>
    <text x="56" y="453" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">2. Erfolgreiche Prüfung nach DGUV Grundsatz 308-001 (Theorie &amp; Praxis)</text>
    <text x="56" y="478" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">3. Schriftliche innerbetriebliche Beauftragung durch den Arbeitgeber (§ 7 Abs. 1)</text>
  </g>
</svg>"""

# 68. infrastruktur-tiefbau-bereiche.svg
SVGS["infrastruktur-tiefbau-bereiche.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Tiefbau, Straßenbau &amp; Rohrleitungsbau: Einsatzbereiche</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Infrastrukturmodernisierung: Fernwärme, Glasfaser &amp; Verkehrswege</text>

  <!-- 3 Pillars -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Rohrleitungsbau</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Fernwärme &amp; Wasser</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Fernwärmetrassen verlegen</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• KMR-Rohre (Kunststoff-</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  mantelrohre) verschweißen</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Druckprüfung nach DVGW</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Kanal- &amp; Abwasser</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Beton- &amp; Steinzeugrohre</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Schachtbauwerke setzen</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dichtigkeitskontrollen</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Straßenbau</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Asphalt &amp; Pflaster</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Unterbau &amp; Schottertragschicht</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Verdichtung (Walzen, Rüttel-</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  platten) nach ZTV SoB-StB</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Bordsteine &amp; Pflasterflächen</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Verkehrssicherung</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• RSA-Verkehrsabsicherung</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Baustellenbeschilderung</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Asphalteinbau begleiten</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Breitband / FTTX</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Glasfaserausbau</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kabelzug &amp; Rohreinzug</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Grabenfräsen &amp; Mini-Trenching</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Speedpipe-Verlegung</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Hausanschlüsse bohren</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Tempo &amp; Ausdauer</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Hohe Arbeitsleistung im</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Meter-Fortschritt pro Tag;</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">hohe Wetterbeständigkeit.</text>
  </g>
</svg>"""

# 69. pflege-aufstiegsmodell-1plus2.svg
SVGS["pflege-aufstiegsmodell-1plus2.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Das 1+2 Aufstiegsmodell: Vom Helfer zur Fachkraft</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Sprachschonende Stufenkarriere für Kliniken &amp; Senioreneinrichtungen</text>

  <!-- 2 Steps Timeline -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="310" height="240" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <rect x="36" y="115" width="310" height="40" rx="12" fill="#eef5f9"/>
    <text x="52" y="141" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Stufe 1: Pflegehelfer (1 Jahr)</text>

    <text x="52" y="180" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Einreise mit solidem B1 Deutsch</text>
    <text x="52" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Staatliche Helferausbildung (PflAPrV)</text>
    <text x="52" y="230" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Grundpflege, Vitalzeichen, Dokumentation</text>
    <text x="52" y="255" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Schnelle Stationsentlastung von Tag 1 an</text>

    <rect x="52" y="280" width="278" height="55" rx="8" fill="#f0fdf4"/>
    <text x="62" y="303" fill="#15803d" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Ergebnis nach 12 Monaten:</text>
    <text x="62" y="323" fill="#15803d" font-family="system-ui, sans-serif" font-size="11.5">Staatliches Examen + B2-Niveau erreicht</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="374" y="115" width="310" height="240" rx="12" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <rect x="374" y="115" width="310" height="40" rx="12" fill="#dcfce7"/>
    <text x="390" y="141" fill="#166534" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Stufe 2: Verkürzung Fachkraft (2 Jahre)</text>

    <text x="390" y="180" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Einstieg direkt ins 2. Ausbildungsjahr</text>
    <text x="390" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Behandlungspflege, Medikation, Wundmgt.</text>
    <text x="390" y="230" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Akutstationen, Intensiv &amp; Pädiatrie</text>
    <text x="390" y="255" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Staatsexamen zur Pflegefachfrau / -mann</text>

    <rect x="390" y="280" width="278" height="55" rx="8" fill="#ecfdf5"/>
    <text x="400" y="303" fill="#047857" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Vollwertige Pflegefachkraft:</text>
    <text x="400" y="323" fill="#047857" font-family="system-ui, sans-serif" font-size="11.5">Volle Fachkraftquote &amp; Vorbehaltsaufgaben</text>
  </g>

  <!-- Bottom: Why 1+2 reduces dropouts -->
  <g filter="url(#shadow)">
    <rect x="36" y="380" width="648" height="135" rx="12" fill="#1e3a5f"/>
    <text x="56" y="410" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Die 3 unschlagbaren Vorteile des 1+2 Modells für Träger:</text>
    <text x="56" y="438" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">✓ Null Prüfungsangst: Leichterer Einstieg verhindert Frustration durch komplexe Fachtheorie im 1. Jahr</text>
    <text x="56" y="463" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">✓ Rechtssicherheit: Selbst bei Abbruch nach Stufe 1 bleibt eine anerkannte Fachassistenz im Betrieb</text>
    <text x="56" y="488" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12.5">✓ Höchste Loyalität: Kandidaten bleiben durchschnittlich &gt;5 Jahre beim ausbildenden Träger</text>
  </g>
</svg>"""

# 70. familiennachzug-voraussetzungen-check.svg
SVGS["familiennachzug-voraussetzungen-check.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Familiennachzug für Fachkräfte (§ 29 AufenthG)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Gesetzliche Voraussetzungen für Ehepartner- &amp; Kindernachzug</text>

  <!-- 3 Check Columns -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Wohnraumnachweis</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 29 Abs. 1 Nr. 2</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Ausreichender Wohnraum</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  nach Landesgesetzen</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Richtwert: 12 m² pro Person</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  ab 6 Jahren (10 m² U6)</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Mietvertrag &amp; Skizze</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Wohnungsgeberbestätigung</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">und Nachweis der Miet-</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">und Heizkosten zwingend.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Lebensunterhalt</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 5 Abs. 1 Nr. 1</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Keine Inanspruchnahme</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  öffentlicher Mittel</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Nettoeinkommen muss</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  Regelbedarf decken</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Berechnung</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Ehepaar: ~1.000 € Regelbedarf</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">+ Warmmiete. Bei Fachkräften</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">problemlos erfüllt.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Sprache &amp; Erleichterung</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 30 Abs. 1 Nr. 2</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Grundsatz: A1 Deutsch</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  für Ehegatten</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• <tspan font-weight="700">Ausnahme seit FEG:</tspan></text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  Bei Blue Card &amp; Fachkräften</text>
    <text x="498" y="280" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  kein A1 vor Einreise nötig!</text>

    <line x1="498" y1="295" x2="668" y2="295" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="320" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Arbeitserlaubnis</text>
    <text x="498" y="342" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Nachziehende Ehepartner</text>
    <text x="498" y="362" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">erhalten uneingeschränkten</text>
    <text x="498" y="382" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Arbeitsmarktzugang (§ 27 Abs. 5).</text>
  </g>
</svg>"""

# 71. bav-modell-internationale-mitarbeiter.svg
SVGS["bav-modell-internationale-mitarbeiter.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Betriebliche Altersvorsorge (bAV) für Drittstaatsangehörige</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">§ 1a BetrAVG, 15% Arbeitgeberzuschuss &amp; Rückkehr nach Vietnam</text>

  <!-- 3 Blocks -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Der Rechtsanspruch</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 1a BetrAVG</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Entgeltumwandlung gilt</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  für ausländische Fachkräfte</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  ohne jede Einschränkung</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Diskriminierungsverbot</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">15% Pflichtzuschuss</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Arbeitgeber muss ersparte</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Sozialabgaben weitergeben</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">(mindestens 15 Prozent).</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Steuer- &amp; SV-Vorteil</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 3 Nr. 63 EStG</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Bis zu 4% der BBG</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  steuer- und sozialabgabenfrei</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Direkte Senkung der Lohn-</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  steuer auf Gehaltszettel</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Bindungseffekt</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Wertvolles Instrument für</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Mittelständler zur Bindung</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">hochqualifizierter Ingenieure.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Rückkehr nach Asien</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Verfall oder Auszahlung?</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• <tspan font-weight="700">Kein Verfall!</tspan> Guthaben aus</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  Entgeltumwandlung ist sofort</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">  unverfallbar (§ 1b Abs. 5)</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Ruhendstellung bei Rückkehr</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Auszahlung im Alter</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Versicherung zahlt Rente</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">oder Kapitalbetrag weltweit</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">auch auf vietnamesisches Konto.</text>
  </g>
</svg>"""

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, content in SVGS.items():
        filepath = OUT_DIR / filename
        filepath.write_text(content.strip(), encoding="utf-8")
        print(f"Generated SVG: {filename} ({len(content)} bytes)")
    print(f"\nSUCCESS: Generated all {len(SVGS)} Phase 5 SVGs in {OUT_DIR}")

if __name__ == "__main__":
    main()
