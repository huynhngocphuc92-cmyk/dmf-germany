#!/usr/bin/env python3
"""
Generate 12 technical vector SVG infographics for Phase 4 B2B employer blog articles.
Canvas: 720x540, DMF Brand Palette (#1e3a5f, #0891b2, #eef5f9, #475569, #ffffff).
"""

from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

SVGS = {}

# 1. fuehrerschein-umschreibung-ablauf.svg
SVGS["fuehrerschein-umschreibung-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700">Führerschein-Umschreibung aus Drittstaaten (§ 29 &amp; 31 FeV)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="13">Rechtlicher Ablauf für Arbeitgeber und internationale Fachkräfte</text>

  <!-- Step 1 -->
  <g filter="url(#shadow)">
    <rect x="36" y="110" width="310" height="180" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="110" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="52" y="133" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Phase 1: Die ersten 6 Monate (§ 29 FeV)</text>
    <circle cx="56" cy="165" r="4" fill="#0891b2"/>
    <text x="70" y="169" fill="#334155" font-family="system-ui, sans-serif" font-size="13">Gültigkeit ab Wohnsitzbegründung</text>
    <circle cx="56" cy="195" r="4" fill="#0891b2"/>
    <text x="70" y="199" fill="#334155" font-family="system-ui, sans-serif" font-size="13">Nur mit beglaubigter Übersetzung (ADAC)</text>
    <circle cx="56" cy="225" r="4" fill="#0891b2"/>
    <text x="70" y="229" fill="#334155" font-family="system-ui, sans-serif" font-size="13">Fahrten für Montage &amp; Probezeit erlaubt</text>
    <rect x="52" y="250" width="278" height="26" rx="6" fill="#fef2f2"/>
    <text x="62" y="267" fill="#b91c1c" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Achtung: Nach 6 Monaten striktes Fahrverbot!</text>
  </g>

  <!-- Step 2 -->
  <g filter="url(#shadow)">
    <rect x="374" y="110" width="310" height="180" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="374" y="110" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="390" y="133" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Phase 2: Umschreibung (Anlage 11 FeV)</text>
    <circle cx="394" cy="165" r="4" fill="#0891b2"/>
    <text x="408" y="169" fill="#334155" font-family="system-ui, sans-serif" font-size="13">Vietnam nicht in Anlage 11 geführt</text>
    <circle cx="394" cy="195" r="4" fill="#0891b2"/>
    <text x="408" y="199" fill="#334155" font-family="system-ui, sans-serif" font-size="13">Theorie- &amp; Praxisprüfung verpflichtend</text>
    <circle cx="394" cy="225" r="4" fill="#0891b2"/>
    <text x="408" y="229" fill="#334155" font-family="system-ui, sans-serif" font-size="13"><tspan font-weight="700">Vorteil:</tspan> Keine Pflichtfahrstunden nötig!</text>
    <rect x="390" y="250" width="278" height="26" rx="6" fill="#f0fdf4"/>
    <text x="400" y="267" fill="#15803d" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Ersparnis: 50% günstiger als Neuerwerb</text>
  </g>

  <!-- Bottom Panel: Employer Action -->
  <g filter="url(#shadow)">
    <rect x="36" y="315" width="648" height="195" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <rect x="36" y="315" width="648" height="36" rx="12" fill="#1e3a5f"/>
    <text x="52" y="338" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Best Practice für Arbeitgeber: Mobilitäts-Support</text>

    <rect x="56" y="365" width="186" height="125" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="70" y="390" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">1. Sofortige Anmeldung</text>
    <text x="70" y="415" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Fahrschulanmeldung im 1.</text>
    <text x="70" y="433" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Monat, um Wartezeiten bei</text>
    <text x="70" y="451" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">TÜV/DEKRA zu überbrücken.</text>

    <rect x="266" y="365" width="186" height="125" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="280" y="390" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">2. Kostenübernahme</text>
    <text x="280" y="415" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Prüfungskosten (~800–1.200 €)</text>
    <text x="280" y="433" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">als steuerfreie Weiterbildung</text>
    <text x="280" y="451" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">oder Darlehensmodell.</text>

    <rect x="476" y="365" width="186" height="125" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="490" y="390" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">3. Firmenwagen-Check</text>
    <text x="490" y="415" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Fahrerunterweisung UVV,</text>
    <text x="490" y="433" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Führerscheinkontrolle alle 6</text>
    <text x="490" y="451" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Monate dokumentieren.</text>
  </g>
</svg>"""

# 2. dba-steuerpflicht-stufen.svg
SVGS["dba-steuerpflicht-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Doppelbesteuerungsabkommen (DBA) &amp; Steuerklassen</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Steuerliche Behandlung vietnamesischer Fachkräfte &amp; Azubis in Deutschland</text>

  <!-- 3 Columns -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Ansässigkeit</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 1 Abs. 1 EStG</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Unbeschränkte Steuerpflicht</text>
    <text x="50" y="220" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">ab Tag 1 der Wohnsitznahme</text>
    <text x="50" y="238" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">in Deutschland.</text>

    <line x1="50" y1="260" x2="220" y2="260" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="285" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Art. 15 DBA</text>
    <text x="50" y="307" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Tätigkeitsortsprinzip:</text>
    <text x="50" y="325" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Besteuerungsrecht liegt zu</text>
    <text x="50" y="343" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">100% bei der Bundesrepublik</text>
    <text x="50" y="361" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Deutschland.</text>

    <rect x="50" y="390" width="172" height="85" rx="8" fill="#eef5f9"/>
    <text x="60" y="415" fill="#0369a1" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Keine Doppelbelastung</text>
    <text x="60" y="435" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Freistellung in Vietnam</text>
    <text x="60" y="453" fill="#475569" font-family="system-ui, sans-serif" font-size="11">durch DBA-Schutzmechanismus.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Steuerklassen</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Steuerklasse I</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Standard für ledige Azubis</text>
    <text x="274" y="220" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">und Fachkräfte. Grundfreibetrag</text>
    <text x="274" y="238" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">greift voll (&gt;11.784 €).</text>

    <line x1="274" y1="260" x2="444" y2="260" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="285" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Steuerklasse III / IV</text>
    <text x="274" y="307" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Bei verheirateten Kräften,</text>
    <text x="274" y="325" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">sobald Ehepartner nachzieht</text>
    <text x="274" y="343" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">und Wohnsitz anmeldet.</text>

    <rect x="274" y="390" width="172" height="85" rx="8" fill="#f0fdf4"/>
    <text x="284" y="415" fill="#15803d" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Azubi-Vorteil</text>
    <text x="284" y="435" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Viele Azubis zahlen 0 €</text>
    <text x="284" y="453" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Lohnsteuer (unter Freibetrag).</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#0f766e"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Rentenerstattung</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 210 SGB VI</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Kein bilaterales SV-Abkommen.</text>
    <text x="498" y="220" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Bei Rückkehr nach Vietnam</text>
    <text x="498" y="238" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Erstattung der Beiträge.</text>

    <line x1="498" y1="260" x2="668" y2="260" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="285" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Wartefrist: 24 Monate</text>
    <text x="498" y="307" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">Nach Ablauf von 24 Monaten</text>
    <text x="498" y="325" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">ohne Versicherungspflicht</text>
    <text x="498" y="343" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">in der DRV abrufbar.</text>

    <rect x="498" y="390" width="172" height="85" rx="8" fill="#fef3c7"/>
    <text x="508" y="415" fill="#b45309" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Arbeitnehmeranteil</text>
    <text x="508" y="435" fill="#475569" font-family="system-ui, sans-serif" font-size="11">Nur AN-Beiträge werden</text>
    <text x="508" y="453" fill="#475569" font-family="system-ui, sans-serif" font-size="11">erstattet, nicht AG-Anteil.</text>
  </g>
</svg>"""

# 3. probezeit-kuendigung-meldepflicht-ablauf.svg
SVGS["probezeit-kuendigung-meldepflicht-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Probezeitende &amp; Vorzeitige Beendigung (§ 45c &amp; § 82 AufenthG)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Gesetzliche Meldepflichten für Betriebe und Betreuungspuffer</text>

  <!-- Flow Steps -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="220" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="66" cy="145" r="16" fill="#ef4444"/>
    <text x="61" y="151" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1</text>
    <text x="94" y="150" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Kündigungsausspruch</text>
    <text x="50" y="185" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Schriftformerfordernis</text>
    <text x="50" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Frist: 2 Wochen (§ 622 BGB)</text>
    <text x="50" y="225" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Bei Azubis: Fristlos in</text>
    <text x="50" y="245" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  Probezeit ohne Angabe</text>
    <rect x="46" y="270" width="180" height="50" rx="6" fill="#fef2f2"/>
    <text x="54" y="290" fill="#991b1b" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Keine sofortige Ausreise</text>
    <text x="54" y="306" fill="#991b1b" font-family="system-ui, sans-serif" font-size="11">Titel bleibt vorerst gültig!</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="220" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <circle cx="290" cy="145" r="16" fill="#0891b2"/>
    <text x="285" y="151" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2</text>
    <text x="318" y="150" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Meldung an Behörde</text>
    <text x="274" y="185" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• <tspan font-weight="700">Frist: 4 Wochen</tspan></text>
    <text x="274" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Zuständige Ausländerbehörde</text>
    <text x="274" y="225" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Formlos per E-Mail / Fax</text>
    <text x="274" y="245" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Bußgeldrisiko bis 30.000 €</text>
    <rect x="270" y="270" width="180" height="50" rx="6" fill="#f0f9ff"/>
    <text x="278" y="290" fill="#0369a1" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Pflicht nach § 82 Abs. 6</text>
    <text x="278" y="306" fill="#0369a1" font-family="system-ui, sans-serif" font-size="11">Arbeitgeberhaftung beachten!</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="220" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="514" cy="145" r="16" fill="#10b981"/>
    <text x="509" y="151" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3</text>
    <text x="542" y="150" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Neuvermittlung</text>
    <text x="498" y="185" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Behörde setzt Suchfrist</text>
    <text x="498" y="205" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  (meist 3 bis 6 Monate)</text>
    <text x="498" y="225" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• DMF aktiviert Netzwerk</text>
    <text x="498" y="245" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Vermittlung in Alternativbetrieb</text>
    <rect x="494" y="270" width="180" height="50" rx="6" fill="#ecfdf5"/>
    <text x="502" y="290" fill="#047857" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Erfolgsgarantie DMF:</text>
    <text x="502" y="306" fill="#047857" font-family="system-ui, sans-serif" font-size="11">Kostenfreier Ersatzkandidat</text>
  </g>

  <!-- Bottom Box: Prevention -->
  <g filter="url(#shadow)">
    <rect x="36" y="360" width="648" height="150" rx="12" fill="#1e3a5f"/>
    <text x="56" y="392" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Frühwarnsystem: Warum Probezeitabbrüche bei DMF &lt; 2% liegen</text>
    <text x="56" y="420" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">✓ Zweisprachiges Integrations-Coaching im ersten Beschäftigungsquartal</text>
    <text x="56" y="445" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">✓ Monatliches Feedbackgespräch zwischen Betrieb, Fachkraft und DMF-Betreuer</text>
    <text x="56" y="470" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">✓ Sofortige Konfliktmediation bei kulturellen Missverständnissen oder Heimweh</text>
  </g>
</svg>"""

# 4. gkv-anmeldung-schritte.svg
SVGS["gkv-anmeldung-schritte.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Gesetzliche Krankenversicherung (GKV) &amp; DEÜV-Anmeldung</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Vollständiger Onboarding-Leitfaden für die Lohnbuchhaltung</text>

  <!-- 4 Step Flow -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="150" height="385" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="150" height="36" rx="10" fill="#eef5f9"/>
    <text x="48" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Schritt 1: Visum</text>
    <text x="46" y="175" fill="#0891b2" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Vorab-Bescheinigung</text>
    <text x="46" y="200" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Ausstellung einer</text>
    <text x="46" y="218" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Mitgliedsbescheinigung</text>
    <text x="46" y="236" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">für den Botschaftstermin</text>
    <text x="46" y="254" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">in Hanoi/HCMC.</text>
    <rect x="44" y="380" width="134" height="105" rx="6" fill="#f8fafc"/>
    <text x="50" y="405" fill="#334155" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Kassen:</text>
    <text x="50" y="423" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">• Techniker (TK)</text>
    <text x="50" y="441" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">• BARMER</text>
    <text x="50" y="459" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">• AOK / DAK</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="200" y="115" width="150" height="385" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="200" y="115" width="150" height="36" rx="10" fill="#eef5f9"/>
    <text x="212" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Schritt 2: Einreise</text>
    <text x="210" y="175" fill="#0891b2" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Aktivierung Schutz</text>
    <text x="210" y="200" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Ab dem 1. Tag des</text>
    <text x="210" y="218" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Arbeits- oder Ausbil-</text>
    <text x="210" y="236" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">dungsvertrags greift</text>
    <text x="210" y="254" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">der volle GKV-Schutz.</text>
    <rect x="208" y="380" width="134" height="105" rx="6" fill="#f8fafc"/>
    <text x="214" y="405" fill="#334155" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Reise-KV:</text>
    <text x="214" y="423" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">Überbrückungs-KV</text>
    <text x="214" y="441" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">vom Flugtag bis</text>
    <text x="214" y="459" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">Vertragsbeginn nötig.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="364" y="115" width="150" height="385" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="364" y="115" width="150" height="36" rx="10" fill="#eef5f9"/>
    <text x="376" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Schritt 3: DEÜV</text>
    <text x="374" y="175" fill="#0891b2" font-family="system-ui, sans-serif" font-size="12" font-weight="700">SV-Nummer generieren</text>
    <text x="374" y="200" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Arbeitgeber meldet AN</text>
    <text x="374" y="218" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">mit Geburtsdatum &amp;</text>
    <text x="374" y="236" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Geburtsort. DRV ver-</text>
    <text x="374" y="254" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">gibt neue SV-Nummer.</text>
    <rect x="372" y="380" width="134" height="105" rx="6" fill="#f8fafc"/>
    <text x="378" y="405" fill="#334155" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Lohnabrechnung:</text>
    <text x="378" y="423" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">Erfolgt auch ohne</text>
    <text x="378" y="441" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">vorliegende Karte</text>
    <text x="378" y="459" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">vollkommen legal.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="528" y="115" width="156" height="385" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="528" y="115" width="156" height="36" rx="10" fill="#eef5f9"/>
    <text x="540" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Schritt 4: eGK</text>
    <text x="538" y="175" fill="#0891b2" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Gesundheitskarte</text>
    <text x="538" y="200" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Lichtbild-Upload bei</text>
    <text x="538" y="218" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">der Krankenkasse.</text>
    <text x="538" y="236" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">Zusendung der eGK</text>
    <text x="538" y="254" fill="#64748b" font-family="system-ui, sans-serif" font-size="11.5">an die Meldeadresse.</text>
    <rect x="536" y="380" width="140" height="105" rx="6" fill="#f0fdf4"/>
    <text x="542" y="405" fill="#15803d" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Familie:</text>
    <text x="542" y="423" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">Kostenfreie Mit-</text>
    <text x="542" y="441" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">versicherung für</text>
    <text x="542" y="459" fill="#64748b" font-family="system-ui, sans-serif" font-size="10.5">Kinder (§ 10 SGB V).</text>
  </g>
</svg>"""

# 5. duales-studium-system-vergleich.svg
SVGS["duales-studium-system-vergleich.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Duales Studium vs. Duale Ausbildung (§ 16b vs. § 16a AufenthG)</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Vergleich für forschende Mittelständler &amp; High-Tech Betriebe</text>

  <!-- Left: Duales Studium -->
  <g filter="url(#shadow)">
    <rect x="36" y="110" width="310" height="395" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <rect x="36" y="110" width="310" height="42" rx="12" fill="#0891b2"/>
    <text x="52" y="137" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Duales Studium (§ 16b AufenthG)</text>

    <text x="52" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Zielgruppe &amp; Abschluss:</text>
    <text x="52" y="200" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Bachelor of Science / Engineering</text>
    <text x="52" y="220" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Gymnasiale Reife oder Uni-Vorbildung</text>

    <text x="52" y="255" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Sprachniveau:</text>
    <text x="52" y="275" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• B2 oder C1 Deutsch (hochschulabhängig)</text>
    <text x="52" y="295" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Englischkenntnisse meist B2</text>

    <text x="52" y="330" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Rolle im Unternehmen:</text>
    <text x="52" y="350" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• F&amp;E, Softwareentwicklung, Konstruktion</text>
    <text x="52" y="370" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Direkter Pfad zur Blue Card / Führung</text>

    <rect x="52" y="405" width="278" height="80" rx="8" fill="#eef5f9"/>
    <text x="62" y="430" fill="#0369a1" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Arbeitgeberaufwand:</text>
    <text x="62" y="450" fill="#475569" font-family="system-ui, sans-serif" font-size="11.5">Monatliche Vergütung ~1.200–1.800 €</text>
    <text x="62" y="468" fill="#475569" font-family="system-ui, sans-serif" font-size="11.5">+ ggf. Studiengebühren der DHBW</text>
  </g>

  <!-- Right: Duale Berufsausbildung -->
  <g filter="url(#shadow)">
    <rect x="374" y="110" width="310" height="395" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="374" y="110" width="310" height="42" rx="12" fill="#1e3a5f"/>
    <text x="390" y="137" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Duale Ausbildung (§ 16a AufenthG)</text>

    <text x="390" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Zielgruppe &amp; Abschluss:</text>
    <text x="390" y="200" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• IHK- / HWK-Gesellenbrief / Facharbeiter</text>
    <text x="390" y="220" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• 12 Jahre Schulbildung in Vietnam</text>

    <text x="390" y="255" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Sprachniveau:</text>
    <text x="390" y="275" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• B1 Zertifikat (Visumsvoraussetzung)</text>
    <text x="390" y="295" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• B2 begleitend im 1. Lehrjahr</text>

    <text x="390" y="330" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Rolle im Unternehmen:</text>
    <text x="390" y="350" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Operative Fachkräfte: Montage, Pflege,</text>
    <text x="390" y="370" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  Instandhaltung, SHK, Elektrotechnik</text>

    <rect x="390" y="405" width="278" height="80" rx="8" fill="#f8fafc"/>
    <text x="400" y="430" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Arbeitgeberaufwand:</text>
    <text x="400" y="450" fill="#475569" font-family="system-ui, sans-serif" font-size="11.5">Tarifliche Azubi-Vergütung nach</text>
    <text x="400" y="468" fill="#475569" font-family="system-ui, sans-serif" font-size="11.5">BBiG (~950–1.350 €) + Berufsschule</text>
  </g>
</svg>"""

# 6. sprachzertifikate-kriterien-matrix.svg
SVGS["sprachzertifikate-kriterien-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Anerkannte Sprachzertifikate für das Arbeitsvisum</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Prüfungskriterien der Deutschen Auslandsvertretungen (ALTE-Standard)</text>

  <!-- Comparison Matrix Table -->
  <g filter="url(#shadow)">
    <rect x="36" y="110" width="648" height="270" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="110" width="648" height="40" rx="12" fill="#1e3a5f"/>
    <text x="52" y="135" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Institut</text>
    <text x="180" y="135" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="700">ALTE-Mitglied?</text>
    <text x="320" y="135" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Botschaftsakzeptanz</text>
    <text x="500" y="135" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Wiederholung Module</text>

    <!-- Row 1: Goethe -->
    <text x="52" y="175" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Goethe-Zertifikat</text>
    <text x="180" y="175" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Ja (Vollmitglied)</text>
    <text x="320" y="175" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="600">100% Akzeptanz (Gold)</text>
    <text x="500" y="175" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">Einzelsegmente möglich</text>
    <line x1="36" y1="195" x2="684" y2="195" stroke="#f1f5f9" stroke-width="1.5"/>

    <!-- Row 2: telc -->
    <text x="52" y="225" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">telc Deutsch</text>
    <text x="180" y="225" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Ja (Vollmitglied)</text>
    <text x="320" y="225" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="600">100% Akzeptanz</text>
    <text x="500" y="225" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">Schriftl./Mündl. getrennt</text>
    <line x1="36" y1="245" x2="684" y2="245" stroke="#f1f5f9" stroke-width="1.5"/>

    <!-- Row 3: ÖSD -->
    <text x="52" y="275" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">ÖSD Zertifikat</text>
    <text x="180" y="275" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Ja (Vollmitglied)</text>
    <text x="320" y="275" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="600">100% Akzeptanz</text>
    <text x="500" y="275" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">Modulprüfungen möglich</text>
    <line x1="36" y1="295" x2="684" y2="295" stroke="#f1f5f9" stroke-width="1.5"/>

    <!-- Row 4: ECL / Private -->
    <text x="52" y="325" fill="#dc2626" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Private Testzentren</text>
    <text x="180" y="325" fill="#dc2626" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Nein / Teilweise</text>
    <text x="320" y="325" fill="#dc2626" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Hohes Ablehnungsrisiko</text>
    <text x="500" y="325" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">Oft nicht anerkannt</text>
    <line x1="36" y1="345" x2="684" y2="345" stroke="#f1f5f9" stroke-width="1.5"/>

    <!-- Row 5: TestDaF -->
    <text x="52" y="365" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">TestDaF / DSH</text>
    <text x="180" y="365" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Ja</text>
    <text x="320" y="365" fill="#16a34a" font-family="system-ui, sans-serif" font-size="13" font-weight="600">100% (Akademisch)</text>
    <text x="500" y="365" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">Nur Gesamtwiederholung</text>
  </g>

  <!-- Note Box -->
  <g filter="url(#shadow)">
    <rect x="36" y="405" width="648" height="105" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
    <text x="56" y="435" fill="#166534" font-family="system-ui, sans-serif" font-size="14" font-weight="700">DMF-Qualitätsversprechen:</text>
    <text x="56" y="460" fill="#334155" font-family="system-ui, sans-serif" font-size="12.5">• 100% der DMF-Talente legen ihre Prüfung am Goethe-Institut oder telc-Zentrum ab.</text>
    <text x="56" y="482" fill="#334155" font-family="system-ui, sans-serif" font-size="12.5">• Keine Fake-Zertifikate, keine Visumsverzögerungen durch Echtheitsprüfungen.</text>
  </g>
</svg>"""

# 7. verpflichtungserklaerung-haftung-pyramide.svg
SVGS["verpflichtungserklaerung-haftung-pyramide.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Verpflichtungserklärung (§§ 66–68 AufenthG): Haftungsmatrix</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Wann Betriebe haften und warum der reguläre Arbeitsvertrag ausreicht</text>

  <!-- Left: Was umfasst die Verpflichtungserklärung? -->
  <g filter="url(#shadow)">
    <rect x="36" y="110" width="310" height="395" rx="12" fill="#ffffff" stroke="#ef4444" stroke-width="1.5"/>
    <rect x="36" y="110" width="310" height="42" rx="12" fill="#ef4444"/>
    <text x="52" y="137" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Haftungsumfang (§ 68 AufenthG)</text>

    <text x="52" y="180" fill="#991b1b" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Umfassende Kostenerstattung:</text>
    <text x="52" y="202" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Sämtliche öffentlichen Mittel</text>
    <text x="52" y="222" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Krankenhilfe &amp; Pflegekosten</text>
    <text x="52" y="242" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Wohnraumversorgung</text>

    <line x1="52" y1="262" x2="326" y2="262" stroke="#fee2e2" stroke-width="1.5"/>

    <text x="52" y="287" fill="#991b1b" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Abschiebungskosten (§ 66):</text>
    <text x="52" y="309" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Flugkosten, Begleitpersonal</text>
    <text x="52" y="329" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Verwaltungskosten der Ausreise</text>

    <line x1="52" y1="349" x2="326" y2="349" stroke="#fee2e2" stroke-width="1.5"/>

    <text x="52" y="374" fill="#991b1b" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Haftungsdauer:</text>
    <text x="52" y="396" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Bis zu 5 Jahre ab Einreise!</text>
    <text x="52" y="416" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Gilt selbst bei Jobwechsel fort</text>

    <rect x="52" y="440" width="278" height="50" rx="6" fill="#fef2f2"/>
    <text x="60" y="460" fill="#b91c1c" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Empfehlung von Arbeitsrechtlern:</text>
    <text x="60" y="478" fill="#b91c1c" font-family="system-ui, sans-serif" font-size="11.5">Als Betrieb niemals leichtfertig zeichnen!</text>
  </g>

  <!-- Right: Der DMF Standardweg -->
  <g filter="url(#shadow)">
    <rect x="374" y="110" width="310" height="395" rx="12" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <rect x="374" y="110" width="310" height="42" rx="12" fill="#1e3a5f"/>
    <text x="390" y="137" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Der haftungsfreie DMF-Standard</text>

    <text x="390" y="180" fill="#047857" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Regulärer Arbeitsvertrag:</text>
    <text x="390" y="202" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Ausbildungs- oder Arbeitsvertrag</text>
    <text x="390" y="222" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  mit angemessener Vergütung reicht</text>
    <text x="390" y="242" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  als Lebensunterhaltssicherung aus.</text>

    <line x1="390" y1="262" x2="664" y2="262" stroke="#dcfce7" stroke-width="1.5"/>

    <text x="390" y="287" fill="#047857" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Keine Bürgschaft nötig:</text>
    <text x="390" y="309" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Visum nach § 16a / 18a/b AufenthG</text>
    <text x="390" y="329" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  erfordert KEINE private AG-Bürgschaft.</text>

    <line x1="390" y1="349" x2="664" y2="349" stroke="#dcfce7" stroke-width="1.5"/>

    <text x="390" y="374" fill="#047857" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Haftungsbeschränkung:</text>
    <text x="390" y="396" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Betrieb haftet ausschließlich für</text>
    <text x="390" y="416" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">  vereinbarte Lohn- &amp; SV-Pflichten.</text>

    <rect x="390" y="440" width="278" height="50" rx="6" fill="#ecfdf5"/>
    <text x="400" y="460" fill="#065f46" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600">Rechtssicherheit mit DMF:</text>
    <text x="400" y="478" fill="#065f46" font-family="system-ui, sans-serif" font-size="11.5">100% konforme Visumsanträge ohne Bürgschaft.</text>
  </g>
</svg>"""

# 8. dachdecker-qualifikation-solarpflicht.svg
SVGS["dachdecker-qualifikation-solarpflicht.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Dachdecker &amp; Fassadenbauer: Qualifikation zur Solarpflicht</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Anforderungsprofil für Steildach, Flachdach und Photovoltaik-Montage</text>

  <!-- 3 Pillars -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Dachabdichtung</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Flachdach &amp; Bitumen</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Bitumen-Schweißbahnen</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kunststoffbahnen (FPO/PVC)</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Wärmedämmung (GEG-Norm)</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dichtigkeitsprüfung</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Steildachtechnik</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Tondachziegel &amp; Schiefer</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Lattung &amp; Unterspannbahn</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dachfenster &amp; Gauben</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Solar &amp; Fassade</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">PV-Unterkonstruktion</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dachhakenmontage</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Schienensysteme &amp; Ballast</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Modulverlegung &amp; Verkabelung</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• DC-Kabelführung ins Haus</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Vorgehängte Fassaden</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Hinterlüftete Systeme (VHF)</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dämmung &amp; Brandriegel</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Verbundplattenmontage</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Arbeitssicherheit</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">BG BAU Standards</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• PSAgA (Absturzsicherung)</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Fanggerüste &amp; Dachfangnetz</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• DGUV Vorschrift 38</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Schwindelfreiheitsprüfung</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">DMF Vorqualifikation</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Praktische Höhensimulation</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Arbeitsschutz-Vokabular</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• G25/G41 Eignungscheck</text>
  </g>
</svg>"""

# 9. baumaschinen-kompetenz-kreislauf.svg
SVGS["baumaschinen-kompetenz-kreislauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Land- &amp; Baumaschinenmechatroniker: Kompetenzmatrix</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Hightech-Instandhaltung für Bagger, Radlader, Traktoren &amp; Anbaugeräte</text>

  <!-- 4 Competence Cards -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="310" height="185" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="52" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Hydraulik &amp; Pneumatik</text>
    <text x="52" y="175" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Hydraulikschaltpläne lesen &amp; Fehler suchen</text>
    <text x="52" y="198" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Hochdruckschläuche &amp; Ventile austauschen</text>
    <text x="52" y="221" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Proportionalventile &amp; Pumpen einstellen</text>
    <text x="52" y="244" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• DGUV Druckprüfung &amp; Dichtheitscheck</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="374" y="115" width="310" height="185" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="374" y="115" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="390" y="138" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Elektronik &amp; CAN-Bus</text>
    <text x="390" y="175" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• OBD-Diagnosegeräte &amp; Software (ISOBUS)</text>
    <text x="390" y="198" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Kabelbaumreparatur &amp; Sensorik kalibrieren</text>
    <text x="390" y="221" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• GPS- &amp; Telemetriesysteme konfigurieren</text>
    <text x="390" y="244" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Hochvolt-Grundlagen für E-Baumaschinen</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="325" width="310" height="185" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="325" width="310" height="36" rx="12" fill="#eef5f9"/>
    <text x="52" y="348" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Dieselmotoren &amp; Abgasreinigung</text>
    <text x="52" y="385" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Common-Rail Injektoren &amp; Turbosysteme</text>
    <text x="52" y="408" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• AdBlue / SCR-Katalysator &amp; DPF-Wartung</text>
    <text x="52" y="431" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Getriebeinstandsetzung (Lastschaltgetriebe)</text>
    <text x="52" y="454" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Kühl- und Schmiersysteme instand halten</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="374" y="325" width="310" height="185" rx="12" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
    <rect x="374" y="325" width="310" height="36" rx="12" fill="#0891b2"/>
    <text x="390" y="348" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">4. Metallbau &amp; Schweißtechnik</text>
    <text x="390" y="385" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• MAG-Schweißen von Baggerlöffeln</text>
    <text x="390" y="408" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Hartox-Verschleißbleche anpassen &amp; schweißen</text>
    <text x="390" y="431" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• Bolzen &amp; Buchsen auspressen / aufschweißen</text>
    <text x="390" y="454" fill="#475569" font-family="system-ui, sans-serif" font-size="12.5">• UVV-Prüfung nach BetrSichV begleiten</text>
  </g>
</svg>"""

# 10. fleischer-hygiene-ausbildung-stufen.svg
SVGS["fleischer-hygiene-ausbildung-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Fleischer &amp; Lebensmitteltechnik: Ausbildung &amp; Hygiene</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">HACCP-Konformität, handwerkliche Zerlegung &amp; Wurstwarenherstellung</text>

  <!-- 3 Stages -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#b91c1c"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Hygiene &amp; Recht</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">§ 43 IfSG Belehrung</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Gesundheitsamt-Nachweis</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Vor Antritt verpflichtend</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Dokumentation Personalakte</text>

    <line x1="50" y1="265" x2="220" y2="265" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="290" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">HACCP-Standards</text>
    <text x="50" y="312" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Lückenlose Kühlkette</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Desinfektion &amp; Reinigung</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Rückverfolgbarkeit Chargen</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kleidungsvorschriften</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Zerlegung &amp; Cut</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Fachgerechtes Ausbeinen</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Rind-, Schwein- &amp; Geflügel</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Anatomische Schnittführung</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Fleischreife &amp; Sortierung</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Edelteile parieren</text>

    <line x1="274" y1="265" x2="444" y2="265" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="290" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Maschinenführung</text>
    <text x="274" y="312" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Bandsägen, Kutter &amp; Wölfe</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Vakuum-Verpackungsanlagen</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Stechschutzschürze &amp; Handschuh</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• UVV-Sicherheit am Arbeitsplatz</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Veredelung &amp; Verkauf</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Wurst- &amp; Feinkost</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Brüh-, Koch- &amp; Rohwurst</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Pökeln &amp; Räuchern</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Gewürzmischungen nach Rezept</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Convenience-Herstellung</text>

    <line x1="498" y1="265" x2="668" y2="265" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="290" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Theke &amp; Beratung</text>
    <text x="498" y="312" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Fachberatung an Kunden</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Allergenkennzeichnung (LMIV)</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Deutsche Fleischbezeichnungen</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Party- &amp; Cateringservice</text>
  </g>
</svg>"""

# 11. hotelfach-kompetenz-matrix.svg
SVGS["hotelfach-kompetenz-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Hotelfachleute &amp; Restaurantfachkräfte: Einsatzbereiche</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Rotationsplan &amp; Qualifikationsmodule nach DEHOGA-Ausbildungsordnung</text>

  <!-- 3 Main Columns -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="200" height="42" rx="12" fill="#0891b2"/>
    <text x="50" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">1. Empfang &amp; Front Office</text>
    <text x="50" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Gästebetreuung</text>
    <text x="50" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Check-in &amp; Check-out</text>
    <text x="50" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Hotelsoftware (Opera, Fidelio)</text>
    <text x="50" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Telefonzentrale &amp; E-Mails</text>
    <text x="50" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Reklamationsmanagement</text>

    <line x1="50" y1="285" x2="220" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="50" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Sprachpraxis</text>
    <text x="50" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Höfliches Deutsch (Sie-Form)</text>
    <text x="50" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Englisch als Zweitsprache</text>
    <text x="50" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kulturelle Aufgeschlossenheit</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="260" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="260" y="115" width="200" height="42" rx="12" fill="#1e3a5f"/>
    <text x="274" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">2. Restaurant &amp; Bankett</text>
    <text x="274" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">À-la-carte Service</text>
    <text x="274" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Speisen &amp; Getränke servieren</text>
    <text x="274" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Weinkunde &amp; Empfehlungen</text>
    <text x="274" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kassensysteme &amp; Abrechnung</text>
    <text x="274" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Tischkultur &amp; Eindecken</text>

    <line x1="274" y1="285" x2="444" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="274" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Veranstaltungen</text>
    <text x="274" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Tagungen &amp; Konferenzen</text>
    <text x="274" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Hochzeiten &amp; Buffets</text>
    <text x="274" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Belastbarkeit bei Spitzen</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="484" y="115" width="200" height="385" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="484" y="115" width="200" height="42" rx="12" fill="#047857"/>
    <text x="498" y="141" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700">3. Housekeeping &amp; Mgt.</text>
    <text x="498" y="180" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Etage &amp; Hygiene</text>
    <text x="498" y="202" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Zimmerkontrolle &amp; Standards</text>
    <text x="498" y="222" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Wäschewirtschaft &amp; Lager</text>
    <text x="498" y="242" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Arbeitsschutz &amp; Ergonomie</text>
    <text x="498" y="262" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Minibar &amp; Guest Amenities</text>

    <line x1="498" y1="285" x2="668" y2="285" stroke="#e2e8f0" stroke-width="1"/>

    <text x="498" y="310" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Kaufmännische Basis</text>
    <text x="498" y="332" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Einkauf &amp; Warenwirtschaft</text>
    <text x="498" y="352" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Kennzahlen (RevPAR, Belegung)</text>
    <text x="498" y="372" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">• Marketing &amp; Sales Assistenz</text>
  </g>
</svg>"""

# 12. urkunden-legalisation-zeitachse.svg
SVGS["urkunden-legalisation-zeitachse.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" width="720" height="540">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="720" height="540" fill="#f8fafc" rx="16"/>
  <rect x="24" y="24" width="672" height="64" rx="12" fill="#1e3a5f"/>
  <text x="48" y="52" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Urkundenüberprüfung &amp; Legalisation in Vietnam: Zeitstrahl</text>
  <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13">Prüfverfahren der Deutschen Botschaft Hanoi &amp; Vertrauensanwälte</text>

  <!-- Process Timeline Cards -->
  <g filter="url(#shadow)">
    <rect x="36" y="115" width="648" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="115" width="8" height="85" rx="4" fill="#0891b2"/>
    <text x="60" y="145" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 1: Justizministerium &amp; Notariat Vietnam (Woche 1–2)</text>
    <text x="60" y="170" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• Beglaubigte Übersetzung ins Deutsche durch beeidigte Übersetzer in Vietnam</text>
    <text x="60" y="188" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• Vorbeglaubigung durch das vietnamesische Außenministerium (Konsularabteilung)</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="215" width="648" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="215" width="8" height="85" rx="4" fill="#1e3a5f"/>
    <text x="60" y="245" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 2: Antrag auf Urkundenprüfung bei der Botschaft (Woche 3)</text>
    <text x="60" y="270" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• Keine Apostille (Vietnam kein Haager Abkommen-Mitglied)!</text>
    <text x="60" y="288" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• Weiterleitung der Zeugnisse an Vertrauensanwälte der Botschaft vor Ort</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="315" width="648" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="36" y="315" width="8" height="85" rx="4" fill="#f59e0b"/>
    <text x="60" y="345" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 3: Überprüfung vor Ort durch Vertrauensanwälte (Woche 4–10)</text>
    <text x="60" y="370" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• Vor-Ort-Besuch bei Schulen, Universitäten &amp; vietnamesischen Standesämtern</text>
    <text x="60" y="388" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• <tspan font-weight="700" fill="#b45309">Dauer im Normalverfahren: 8 bis 12 Wochen</tspan> | Im § 81a Fast-Track: priorisiert</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="36" y="415" width="648" height="85" rx="10" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <rect x="36" y="415" width="8" height="85" rx="4" fill="#10b981"/>
    <text x="60" y="445" fill="#1e3a5f" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Schritt 4: Positiver Prüfbericht &amp; Visumserteilung (Woche 11–12)</text>
    <text x="60" y="470" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• Botschaft bestätigt Echtheit an deutsche Ausländerbehörde / Anerkennungsstelle</text>
    <text x="60" y="488" fill="#64748b" font-family="system-ui, sans-serif" font-size="12.5">• 100%ige Rechtssicherheit gegen nachträgliche Titelwiderrufe in Deutschland</text>
  </g>
</svg>"""

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, content in SVGS.items():
        filepath = OUT_DIR / filename
        filepath.write_text(content.strip(), encoding="utf-8")
        print(f"Generated SVG: {filename} ({len(content)} bytes)")
    print(f"\nSUCCESS: Generated all {len(SVGS)} SVGs in {OUT_DIR}")

if __name__ == "__main__":
    main()
