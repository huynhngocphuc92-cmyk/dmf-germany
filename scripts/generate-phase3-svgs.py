#!/usr/bin/env python3
"""
Generate 12 professional technical SVG diagrams for Phase 3 blog articles (Posts 36-47).
DMF Design Tokens:
- Background: #eef5f9 (rounded rx=24)
- Primary Blue: #1e3a5f
- Secondary Cyan: #0891b2 / #087f9b
- Accent Green: #059669
- Accent Blue: #0284c7
- Text Dark: #1e3a5f, Text Muted: #475569, #64748b
- Cards: white with stroke #0891b2
"""

from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

svgs = {}

# 1. informationspflicht-45c-ablauf.svg
svgs["informationspflicht-45c-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Ablauf Informationspflicht nach § 45c AufenthG</title>
  <desc id="desc">Gesetzlicher Ablauf der Informationspflicht für Arbeitgeber bei Einstellung von Fachkräften aus Drittstaaten ab 2026.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">COMPLIANCE 2026</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">§ 45c AufenthG: Informationspflicht</text>

  <!-- Step 1 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="36" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="111" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">1. VERTRAG</text>
  <text x="111" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Arbeitsvertrags-</text>
  <text x="111" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">abschluss</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="48" y="250">• Vertragsschluss mit</text>
    <text x="48" y="270">  Drittstaatskraft</text>
    <text x="48" y="295">• Wohnsitz der Kraft</text>
    <text x="48" y="315">  liegt im Ausland</text>
    <text x="48" y="345">• Gilt für Vollzeit,</text>
    <text x="48" y="365">  Teilzeit &amp; Azubis</text>
    <text x="48" y="395">• Frist beginnt mit</text>
    <text x="48" y="415">  Vertragsabschluss</text>
  </g>

  <!-- Step 2 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="202" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="202" y="125" width="150" height="40" rx="16" fill="#0891b2"/>
  <text x="277" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">2. FORM &amp; FRIST</text>
  <text x="277" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Hinweis in</text>
  <text x="277" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Textform</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="214" y="250">• Form: Textform</text>
    <text x="214" y="270">  (Brief, E-Mail,</text>
    <text x="214" y="290">  Vertragsanlage)</text>
    <text x="214" y="320" font-weight="700" fill="#0284c7">• Spätester Termin:</text>
    <text x="214" y="340">  Erster Tag der</text>
    <text x="214" y="360">  Arbeitsleistung</text>
    <text x="214" y="395">• Mehrsprachige</text>
    <text x="214" y="415">  Vorlage nutzen</text>
  </g>

  <!-- Step 3 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="368" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="368" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="443" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">3. INHALT</text>
  <text x="443" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Faire Integration</text>
  <text x="443" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Beratungsstelle</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="380" y="250">• Hinweis auf das</text>
    <text x="380" y="270">  kostenlose Angebot</text>
    <text x="380" y="300">• Konkrete Adresse</text>
    <text x="380" y="320">  der nächstgelegenen</text>
    <text x="380" y="340">  Beratungsstelle</text>
    <text x="380" y="375">• Aufklärung über</text>
    <text x="380" y="395">  Rechte &amp; Pflichten</text>
    <text x="380" y="415">  im Arbeitsrecht</text>
  </g>

  <!-- Step 4 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="534" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="534" y="125" width="150" height="40" rx="16" fill="#059669"/>
  <text x="609" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">4. SICHERHEIT</text>
  <text x="609" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Nachweis &amp;</text>
  <text x="609" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Personalakte</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="546" y="250">• Empfangsbestätigung</text>
    <text x="546" y="270">  unterzeichnen lassen</text>
    <text x="546" y="300">• Dokumentation in</text>
    <text x="546" y="320">  der Personalakte</text>
    <text x="546" y="350">• Schutz vor Bußgeldern</text>
    <text x="546" y="370">  &amp; Prüfungen</text>
    <text x="546" y="405">• Transparente</text>
    <text x="546" y="425">  Willkommenskultur</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents stellt Partnerbetrieben geprüfte, mehrsprachige Hinweisvorlagen zur Verfügung</text>
</svg>"""

# 2. anerkennungspartnerschaft-stufen.svg
svgs["anerkennungspartnerschaft-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Anerkennungspartnerschaft nach § 16d Abs. 3 AufenthG</title>
  <desc id="desc">Drei Stufen der Anerkennungspartnerschaft: Vorab-Check, Einreise zur Vollzeitbeschäftigung und parallele Anerkennung in Deutschland.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">FEG NEUREGELUNG</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Anerkennungspartnerschaft (§ 16d Abs. 3)</text>

  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="205" height="340" rx="16"/>
    <rect x="257" y="125" width="205" height="340" rx="16"/>
    <rect x="478" y="125" width="205" height="340" rx="16"/>
  </g>

  <!-- Stage 1 -->
  <rect x="36" y="125" width="205" height="42" rx="16" fill="#1e3a5f"/>
  <text x="138" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">STUFE 1: VORAUSSETZUNG</text>
  <text x="138" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Basisprüfung im Ausland</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="50" y="240">• Staatlich anerkannter Abschluss</text>
    <text x="50" y="260">  im Herkunftsland (min. 2 Jahre)</text>
    <text x="50" y="290">• ZAB-Auskunft (DAB) liegt vor</text>
    <text x="50" y="320">• Deutschkenntnisse min. Niveau A2</text>
    <text x="50" y="350">• Konkreter Arbeitsvertrag</text>
    <text x="50" y="370">  mit qualifizierter Vergütung</text>
    <text x="50" y="405">• Partnerschaftsvereinbarung</text>
    <text x="50" y="425">  zwischen Betrieb &amp; Fachkraft</text>
  </g>

  <!-- Stage 2 -->
  <rect x="257" y="125" width="205" height="42" rx="16" fill="#0891b2"/>
  <text x="359" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">STUFE 2: EINREISE &amp; PRAXIS</text>
  <text x="359" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Sofortige Beschäftigung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="271" y="240">• Visum nach § 16d Abs. 3</text>
    <text x="271" y="260">  ohne vorherigen Defizitbescheid</text>
    <text x="271" y="290">• Volle Mitarbeit im Betrieb ab Tag 1</text>
    <text x="271" y="320">• Direkte Wertschöpfung &amp;</text>
    <text x="271" y="340">  Entlastung des Stammteams</text>
    <text x="271" y="370">• Aufenthalt zunächst für 1 Jahr</text>
    <text x="271" y="390">  (verlängerbar bis zu 3 Jahre)</text>
    <text x="271" y="420">• Begleitender betrieblicher Pate</text>
  </g>

  <!-- Stage 3 -->
  <rect x="478" y="125" width="205" height="42" rx="16" fill="#059669"/>
  <text x="580" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">STUFE 3: ANERKENNUNG</text>
  <text x="580" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Abschluss &amp; Festanstellung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="492" y="240">• Anerkennungsantrag wird</text>
    <text x="492" y="260">  parallel in Deutschland gestellt</text>
    <text x="492" y="290">• Notwendige Nachqualifizierung</text>
    <text x="492" y="310">  berufsbegleitend im Unternehmen</text>
    <text x="492" y="340">• Abschluss mit voller Gleichwertigkeit</text>
    <text x="492" y="375">• Nahtloser Wechsel in</text>
    <text x="492" y="395">  Fachkraft-Titel § 18a / § 18b</text>
    <text x="492" y="425">• Dauerhafte Bindung an den Betrieb</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents koordiniert die ZAB-Auskunft und begleitet den gesamten Nachqualifizierungsprozess</text>
</svg>"""

# 3. berufserfahrung-kriterien-matrix.svg
svgs["berufserfahrung-kriterien-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Kriterienmatrix für Fachkräfte mit Berufserfahrung (§ 6 BeschV)</title>
  <desc id="desc">Die 4 Kernvoraussetzungen für die Rekrutierung von Fachkräften über Berufserfahrung ohne deutsches Anerkennungsverfahren.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">ERFAHRUNGSSÄULE</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Fachkräfte mit Berufserfahrung (§ 6 BeschV)</text>

  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="315" height="160" rx="16"/>
    <rect x="369" y="125" width="315" height="160" rx="16"/>
    <rect x="36" y="305" width="315" height="160" rx="16"/>
    <rect x="369" y="305" width="315" height="160" rx="16"/>
  </g>

  <!-- Box 1 -->
  <rect x="36" y="125" width="315" height="36" rx="16" fill="#1e3a5f"/>
  <text x="193" y="149" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">1. BERUFSABSCHLUSS IM HERKUNFTSLAND</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="52" y="185">• Staatlich anerkannter Berufs- oder Hochschulabschluss</text>
    <text x="52" y="210">• Ausbildungsdauer von mindestens 2 Jahren</text>
    <text x="52" y="235">• Bestätigt durch Digitale ZAB-Auskunft (DAB)</text>
    <text x="52" y="260">• Keine deutsche Gleichwertigkeitsprüfung nötig</text>
  </g>

  <!-- Box 2 -->
  <rect x="369" y="125" width="315" height="36" rx="16" fill="#0891b2"/>
  <text x="526" y="149" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">2. MINDESTENS 2 JAHRE BERUFSPRAXIS</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="385" y="185">• Mindestens 24 Monate Berufserfahrung in den letzten 5 Jahren</text>
    <text x="385" y="210">• Tätigkeit muss im fachlichen Zusammenhang zur Stelle stehen</text>
    <text x="385" y="235">• Nachweise über Arbeitszeugnisse, Verträge &amp; Referenzen</text>
    <text x="385" y="260">• Praktische Fertigkeiten unmittelbar einsetzbar</text>
  </g>

  <!-- Box 3 -->
  <rect x="36" y="305" width="315" height="36" rx="16" fill="#0891b2"/>
  <text x="193" y="329" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">3. GEHALTSSCHWELLE ODER TARIF</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="52" y="365">• Gesetzliche Mindestgehaltsschwelle (jährlich angepasst)</text>
    <text x="52" y="390">• Tarifprivileg: Bei Tarifbindung gilt der Tariflohn</text>
    <text x="52" y="415">• Gewährleistet faire, marktgerechte Entlohnung</text>
    <text x="52" y="440">• Verhindert Dumping und sichert Visumserteilung</text>
  </g>

  <!-- Box 4 -->
  <rect x="369" y="305" width="315" height="36" rx="16" fill="#059669"/>
  <text x="526" y="329" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">4. NICHT-REGLEMENTIERTER BERUF</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="385" y="365">• Gilt für alle nicht-reglementierten Berufe</text>
    <text x="385" y="390">• Ideal für IT, Industrie, Handwerk, Technik &amp; Handel</text>
    <text x="385" y="415">• Ausgeschlossen: Reglementierte Berufe (Pflege, Ärzte, etc.)</text>
    <text x="385" y="440">• Schnellster Weg zur Arbeitsaufnahme für Techniker</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents prüft vorab die Anrechenbarkeit der vietnamesischen Praxiszeiten nach § 6 BeschV</text>
</svg>"""

# 4. leiharbeit-verbot-direktvermittlung-vergleich.svg
svgs["leiharbeit-verbot-direktvermittlung-vergleich.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Vergleich: Leiharbeitsverbot (§ 40 AufenthG) vs. Direktvermittlung</title>
  <desc id="desc">Rechtlicher Vergleich zwischen illegaler Leiharbeit für Drittstaatsangehörige und rechtssicherer Direktvermittlung durch DMF Talents.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">RECHTSSICHERHEIT</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Zeitarbeit (§ 40) vs. Direktvermittlung</text>

  <!-- Left: Zeitarbeit (Verboten/Riskant) -->
  <g fill="white" stroke="#ef4444" stroke-width="2">
    <rect x="36" y="125" width="315" height="340" rx="16"/>
  </g>
  <rect x="36" y="125" width="315" height="42" rx="16" fill="#dc2626"/>
  <text x="193" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="white">ZEITARBEIT / LEIHARBEIT (§ 40)</text>
  <text x="193" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#dc2626">Gesetzliches Versagungsverbot</text>
  <g font-family="Arial,sans-serif" font-size="13" fill="#475569">
    <text x="52" y="235" font-weight="700" fill="#dc2626">✗ Verbot nach § 40 Abs. 1 Nr. 2 AufenthG:</text>
    <text x="52" y="255">  BA muss Zustimmung zur Beschäftigung</text>
    <text x="52" y="275">  in der Leiharbeit zwingend versagen.</text>
    <text x="52" y="310" font-weight="700" fill="#dc2626">✗ Gravierende Haftungsrisiken:</text>
    <text x="52" y="330">  Entleiher haftet für Sozialversicherungs-</text>
    <text x="52" y="350">  beiträge &amp; drohende Bußgelder bis 500.000 €.</text>
    <text x="52" y="385" font-weight="700" fill="#dc2626">✗ Aufenthaltstitel erlischt:</text>
    <text x="52" y="405">  Ausländerbehörde widerruft das Visum;</text>
    <text x="52" y="425">  abrupter Verlust der Arbeitskraft im Betrieb.</text>
  </g>

  <!-- Right: Direktvermittlung (DMF) -->
  <g fill="white" stroke="#059669" stroke-width="2">
    <rect x="369" y="125" width="315" height="340" rx="16"/>
  </g>
  <rect x="369" y="125" width="315" height="42" rx="16" fill="#059669"/>
  <text x="526" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="white">DIREKTVERMITTLUNG (DMF)</text>
  <text x="526" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#059669">100% Rechtssicher &amp; Nachhaltig</text>
  <g font-family="Arial,sans-serif" font-size="13" fill="#475569">
    <text x="385" y="235" font-weight="700" fill="#059669">✓ Direkter Arbeitsvertrag:</text>
    <text x="385" y="255">  Fachkraft wird feste/r Mitarbeiter/in</text>
    <text x="385" y="275">  Ihres Unternehmens (§ 18a / § 18b / § 16a).</text>
    <text x="385" y="310" font-weight="700" fill="#059669">✓ Vollständige Behördenzustimmung:</text>
    <text x="385" y="330">  Offizielle Vorabzustimmung der BA</text>
    <text x="385" y="350">  und transparente Visumerteilung.</text>
    <text x="385" y="385" font-weight="700" fill="#059669">✓ Langfristige Mitarbeiterbindung:</text>
    <text x="385" y="405">  Loyale Fachkräfte, eingespieltes Team</text>
    <text x="385" y="425">  und planbare Zukunft für Ihren Betrieb.</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents vermittelt ausschließlich in rechtssichere Direktanstellung ohne Leiharbeitskonstrukte</text>
</svg>"""

# 5. shk-waermepumpen-qualifikation.svg
svgs["shk-waermepumpen-qualifikation.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Qualifikationsmatrix für Wärmepumpen-Monteure (SHK)</title>
  <desc id="desc">Die 3 Säulen der SHK-Qualifikation für Wärmepumpen und Klimatechnik: Hydraulik, Elektrik und Kältetechnik.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">ENERGIEWENDE HANDWERK</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Qualifikation: SHK &amp; Wärmepumpen</text>

  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="205" height="340" rx="16"/>
    <rect x="257" y="125" width="205" height="340" rx="16"/>
    <rect x="478" y="125" width="205" height="340" rx="16"/>
  </g>

  <!-- Pillar 1 -->
  <rect x="36" y="125" width="205" height="42" rx="16" fill="#1e3a5f"/>
  <text x="138" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">SÄULE 1: HYDRAULIK</text>
  <text x="138" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Rohrleitungsbau &amp; Puffer</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="50" y="235">• Verrohrung von Monoblock-</text>
    <text x="50" y="255">  und Split-Wärmepumpen</text>
    <text x="50" y="285">• Pufferspeicher &amp; Trinkwasser-</text>
    <text x="50" y="305">  erwärmung einbinden</text>
    <text x="50" y="335">• Hydraulischer Abgleich</text>
    <text x="50" y="355">  nach Verfahren A / B</text>
    <text x="50" y="385">• Dichtheitsprüfungen &amp;</text>
    <text x="50" y="405">  Dämmung nach GEG-Vorgaben</text>
    <text x="50" y="435">• Entlüftung &amp; Druckhaltung</text>
  </g>

  <!-- Pillar 2 -->
  <rect x="257" y="125" width="205" height="42" rx="16" fill="#0891b2"/>
  <text x="359" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">SÄULE 2: ELEKTRIK</text>
  <text x="359" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Regelung &amp; Steuerung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="271" y="235">• Elektrofachkraft für festgelegte</text>
    <text x="271" y="255">  Tätigkeiten (EFKffT)</text>
    <text x="271" y="285">• Netzanschluss, EVU-Sperre</text>
    <text x="271" y="305">  und Steuersignale (SG Ready)</text>
    <text x="271" y="335">• Fühlerinstallation für Vorlauf,</text>
    <text x="271" y="355">  Rücklauf &amp; Außentemperatur</text>
    <text x="271" y="385">• Parametrierung digitaler</text>
    <text x="271" y="405">  Heizungssteuerungen</text>
    <text x="271" y="435">• Schnittstelle zu Photovoltaik</text>
  </g>

  <!-- Pillar 3 -->
  <rect x="478" y="125" width="205" height="42" rx="16" fill="#059669"/>
  <text x="580" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">SÄULE 3: KÄLTETECHNIK</text>
  <text x="580" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Kälteschein &amp; Split-Kreis</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="492" y="235">• Sachkunde nach ChemKlimaschutzV</text>
    <text x="492" y="255">  (Kälteschein Kat. I / II)</text>
    <text x="492" y="285">• Bördeln, Löten &amp; Dichtheits-</text>
    <text x="492" y="305">  prüfung des Kältekreises</text>
    <text x="492" y="335">• Evakuierung mit Vakuumpumpe</text>
    <text x="492" y="355">  und Befüllung von Kältemittel</text>
    <text x="492" y="385">• Umgang mit natürlichen Kältemitteln</text>
    <text x="492" y="405">  (R290 / Propan-Sicherheitsregeln)</text>
    <text x="492" y="435">• Fachgerechte Entsorgung</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents bereitet Absolventen der Kälte-/Klimatechnik gezielt auf GEG-Wärmepumpen vor</text>
</svg>"""

# 6. erzieherinnen-anerkennung-stufen.svg
svgs["erzieherinnen-anerkennung-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Anerkennungsverfahren für ausländische Erzieherinnen</title>
  <desc id="desc">Vier Schritte von der vietnamesischen Pädagogik-Graduierung zur staatlichen Anerkennung als Erzieherin in deutschen Kitas.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">PÄDAGOGIK &amp; KITA</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Anerkennung: Erzieherinnen aus VN</text>

  <!-- Step 1 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="36" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="111" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">1. STUDIUM VN</text>
  <text x="111" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Pädagogischer</text>
  <text x="111" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Hochschulgrad</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="48" y="250">• 4-jähriges Studium</text>
    <text x="48" y="270">  Frühkindliche</text>
    <text x="48" y="290">  Erziehung / Pädagogik</text>
    <text x="48" y="320">• Hohe Methoden-</text>
    <text x="48" y="340">  kompetenz &amp; Praxis</text>
    <text x="48" y="370">• Deutsch intensiv</text>
    <text x="48" y="390">  bis Niveau B2</text>
    <text x="48" y="415">  (Fachsprache Kita)</text>
  </g>

  <!-- Step 2 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="202" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="202" y="125" width="150" height="40" rx="16" fill="#0891b2"/>
  <text x="277" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">2. ANTRAG LAND</text>
  <text x="277" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Landesjugend-</text>
  <text x="277" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">amt Prüfung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="214" y="250">• Zuständigkeit beim</text>
    <text x="214" y="270">  jeweiligen Bundesland</text>
    <text x="214" y="300">• Curricularer Abgleich</text>
    <text x="214" y="320">  mit Erzieherausbildung</text>
    <text x="214" y="350">• Feststellung der</text>
    <text x="214" y="370">  Gleichwertigkeit</text>
    <text x="214" y="400">• Bescheid über</text>
    <text x="214" y="420">  Ausgleichsmaßnahmen</text>
  </g>

  <!-- Step 3 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="368" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="368" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="443" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">3. EINSATZ KITA</text>
  <text x="443" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Anpassungs-</text>
  <text x="443" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">lehrgang</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="380" y="250">• Einreise mit Visum</text>
    <text x="380" y="270">  nach § 16d AufenthG</text>
    <text x="380" y="300">• Direkter Einsatz als</text>
    <text x="380" y="320">  pädagogische Assistenz</text>
    <text x="380" y="345">• Rechtsthemen (SGB VIII,</text>
    <text x="380" y="365">  Kinderschutz § 8a)</text>
    <text x="380" y="395">• Begleitung durch eine</text>
    <text x="380" y="415">  erfahrene Fachkraft</text>
  </g>

  <!-- Step 4 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="534" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="534" y="125" width="150" height="40" rx="16" fill="#059669"/>
  <text x="609" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">4. ANERKENNUNG</text>
  <text x="609" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Staatlich anerkannte</text>
  <text x="609" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Erzieherin</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="546" y="250">• Erteilung der staatlichen</text>
    <text x="546" y="270">  Berufsanerkennung</text>
    <text x="546" y="300">• Volle Anrechnung auf</text>
    <text x="546" y="320">  den Personalschlüssel</text>
    <text x="546" y="350">• Titelwechsel zu</text>
    <text x="546" y="370">  § 18a / § 18b</text>
    <text x="546" y="405">• Langfristige Entlastung</text>
    <text x="546" y="425">  für Träger und Eltern</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents wählt Hochschulabsolventinnen mit B2-Deutsch und starker pädagogischer Eignung aus</text>
</svg>"""

# 7. industriemechaniker-kompetenz-matrix.svg
svgs["industriemechaniker-kompetenz-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Kompetenzmatrix Industriemechaniker &amp; Instandhalter</title>
  <desc id="desc">Vier Kernkompetenzfelder qualifizierter Industriemechaniker aus Vietnam für den deutschen Maschinen- und Anlagenbau.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">MASCHINENBAU &amp; INDUSTRIE</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Kompetenzmatrix: Industriemechaniker</text>

  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="315" height="160" rx="16"/>
    <rect x="369" y="125" width="315" height="160" rx="16"/>
    <rect x="36" y="305" width="315" height="160" rx="16"/>
    <rect x="369" y="305" width="315" height="160" rx="16"/>
  </g>

  <!-- Module 1 -->
  <rect x="36" y="125" width="315" height="36" rx="16" fill="#1e3a5f"/>
  <text x="193" y="149" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">1. BAUGRUPPENMONTAGE &amp; JUSTAGE</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="52" y="185">• Montieren mechanischer Baugruppen nach Zeichnung</text>
    <text x="52" y="210">• Toleranzprüfungen mit Messschieber, Bügelmessschraube &amp; Uhr</text>
    <text x="52" y="235">• Passungsrost vermeiden, Passfedern &amp; Lager einpressen</text>
    <text x="52" y="260">• Ausrichten von Getrieben, Kupplungen und Wellen</text>
  </g>

  <!-- Module 2 -->
  <rect x="369" y="125" width="315" height="36" rx="16" fill="#0891b2"/>
  <text x="526" y="149" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">2. VORBEUGENDE INSTANDHALTUNG (TPM)</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="385" y="185">• Regelmäßige Inspektions- und Wartungsintervalle</text>
    <text x="385" y="210">• Tausch von Verschleißteilen (Riemen, Dichtungen, Filter)</text>
    <text x="385" y="235">• Schmierstoffpläne einhalten und Ölanalysen durchführen</text>
    <text x="385" y="260">• Digitale Dokumentation im betrieblichen ERP/CAFM</text>
  </g>

  <!-- Module 3 -->
  <rect x="36" y="305" width="315" height="36" rx="16" fill="#0891b2"/>
  <text x="193" y="329" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">3. PNEUMATIK &amp; HYDRAULIK</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="52" y="365">• Lesen und Umsetzen von Pneumatik- und Hydraulikschaltplänen</text>
    <text x="52" y="390">• Austausch von Ventilen, Zylindern und Druckschläuchen</text>
    <text x="52" y="415">• Fehlersuche bei Druckabfall oder Leckagen</text>
    <text x="52" y="440">• Beachtung strenger Sicherheitsvorschriften (Druckentlastung)</text>
  </g>

  <!-- Module 4 -->
  <rect x="369" y="305" width="315" height="36" rx="16" fill="#059669"/>
  <text x="526" y="329" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">4. ANLAGENFÜHRUNG &amp; FEHLERANALYSE</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="385" y="365">• Schnelle Störungsbehebung bei Linienstillstand</text>
    <text x="385" y="390">• Schnittstellenkommunikation mit SPS-Programmierern</text>
    <text x="385" y="415">• Optimierung von Taktraten und Rüstzeiten</text>
    <text x="385" y="440">• Einhaltung deutscher UVV und Maschinenschutzrichtlinien</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">Vietnamesische Mechaniker bringen fundierte Praxis aus internationalen Zulieferbetrieben mit</text>
</svg>"""

# 8. elektroniker-betriebstechnik-module.svg
svgs["elektroniker-betriebstechnik-module.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Kompetenzmodule Elektroniker für Betriebstechnik</title>
  <desc id="desc">DGUV V3 Sicherheitsstufen und Einsatzbereiche für Elektroniker für Betriebstechnik in Industrie und Schaltanlagenbau.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">ELEKTROTECHNIK &amp; DGUV</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Elektroniker für Betriebstechnik</text>

  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="205" height="340" rx="16"/>
    <rect x="257" y="125" width="205" height="340" rx="16"/>
    <rect x="478" y="125" width="205" height="340" rx="16"/>
  </g>

  <!-- Module 1 -->
  <rect x="36" y="125" width="205" height="42" rx="16" fill="#1e3a5f"/>
  <text x="138" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">SCHALTANLAGENBAU</text>
  <text x="138" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Aufbau &amp; Verdrahtung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="50" y="235">• Verdrahtung von Schaltschränken</text>
    <text x="50" y="255">  nach EPLAN / Stromlaufplan</text>
    <text x="50" y="285">• Bestückung mit Schützen,</text>
    <text x="50" y="305">  Relais &amp; Sicherungsautomaten</text>
    <text x="50" y="335">• Anschließen von Frequenz-</text>
    <text x="50" y="355">  umrichtern und Motoren</text>
    <text x="50" y="385">• Saubere Aderendhülsen &amp;</text>
    <text x="50" y="405">  normgerechte Kennzeichnung</text>
    <text x="50" y="435">• EMV-gerechte Schirmung</text>
  </g>

  <!-- Module 2 -->
  <rect x="257" y="125" width="205" height="42" rx="16" fill="#0891b2"/>
  <text x="359" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">AUTOMATISIERUNG</text>
  <text x="359" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">SPS &amp; Sensorik/Aktorik</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="271" y="235">• Anbindung von Initiatoren,</text>
    <text x="271" y="255">  Lichtschranken &amp; Encodern</text>
    <text x="271" y="285">• Einbindung in Feldbusse</text>
    <text x="271" y="305">  (PROFINET, IO-Link, AS-i)</text>
    <text x="271" y="335">• Diagnose an Siemens S7-1500 /</text>
    <text x="271" y="355">  TIA Portal &amp; Beckhoff</text>
    <text x="271" y="385">• Behebung von Sensorfehlern</text>
    <text x="271" y="405">  und Busunterbrechungen</text>
    <text x="271" y="435">• Kalibrierung von Messgebern</text>
  </g>

  <!-- Module 3 -->
  <rect x="478" y="125" width="205" height="42" rx="16" fill="#059669"/>
  <text x="580" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">SICHERHEIT DGUV V3</text>
  <text x="580" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Prüfung &amp; Schutz</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="492" y="235">• Die 5 Sicherheitsregeln der</text>
    <text x="492" y="255">  Elektrotechnik sicher anwenden</text>
    <text x="492" y="285">• Messungen nach DIN VDE 0100-600</text>
    <text x="492" y="305">  und DIN VDE 0105-100</text>
    <text x="492" y="335">• RCD-Auslösezeit, Schleifen-</text>
    <text x="492" y="355">  impedanz &amp; Isolationsprüfung</text>
    <text x="492" y="385">• Prüfprotokolle gerichtsfest</text>
    <text x="492" y="405">  dokumentieren</text>
    <text x="492" y="435">• Status: Elektrofachkraft (EFK)</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">Vorbereitungskurse der DMF-Akademie vertiefen deutsche VDE-Normen und DGUV V3 Vorschriften</text>
</svg>"""

# 9. pflegehelfer-karrierepfad-stufen.svg
svgs["pflegehelfer-karrierepfad-stufen.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Karrierepfad Pflegehelfer zur examinierten Fachkraft</title>
  <desc id="desc">Zwei-Stufen-Modell: Schnelle Stationsentlastung als 1-jährige Assistenzkraft und berufsbegleitende Höherqualifizierung zur Pflegefachkraft.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">PFLEGESTRATEGIE KLINIK</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Stufenmodell: Pflegehelfer zur Fachkraft</text>

  <!-- Left: Stufe 1 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="315" height="340" rx="16"/>
  </g>
  <rect x="36" y="125" width="315" height="42" rx="16" fill="#1e3a5f"/>
  <text x="193" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="white">STUFE 1: PFLEGEHELFER / ASSISTENZ</text>
  <text x="193" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#1e3a5f">Sofortige Entlastung auf Station</text>
  <g font-family="Arial,sans-serif" font-size="13" fill="#475569">
    <text x="52" y="235" font-weight="700" fill="#0891b2">• Rasche Visumerteilung:</text>
    <text x="52" y="255">  1-jährige Ausbildung oder Teilanerkennung</text>
    <text x="52" y="275">  erfordert nur B1-Sprachniveau.</text>
    <text x="52" y="310" font-weight="700" fill="#0891b2">• Übernahme von Grundpflege:</text>
    <text x="52" y="330">  Körperpflege, Mobilisation, Nahrungs-</text>
    <text x="52" y="350">  aufnahme, Vitalzeichenmessung.</text>
    <text x="52" y="385" font-weight="700" fill="#0891b2">• Entlastung der examinierten Kräfte:</text>
    <text x="52" y="405">  Fachkräfte gewinnen Zeit für Medikation,</text>
    <text x="52" y="425">  Visite, Wundversorgung &amp; Dokumentation.</text>
  </g>

  <!-- Right: Stufe 2 -->
  <g fill="white" stroke="#059669" stroke-width="2">
    <rect x="369" y="125" width="315" height="340" rx="16"/>
  </g>
  <rect x="369" y="125" width="315" height="42" rx="16" fill="#059669"/>
  <text x="526" y="152" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="white">STUFE 2: WEITERBILDUNG FACHKRAFT</text>
  <text x="526" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#059669">Aufstieg zur Pflegefachfrau/-mann</text>
  <g font-family="Arial,sans-serif" font-size="13" fill="#475569">
    <text x="385" y="235" font-weight="700" fill="#059669">• Verkürzte Regelausbildung:</text>
    <text x="385" y="255">  Pflegehilfeabschluss ermöglicht Verkürzung</text>
    <text x="385" y="275">  der 3-jährigen Ausbildung um bis zu 1 Jahr.</text>
    <text x="385" y="310" font-weight="700" fill="#059669">• Sprachliche &amp; fachliche Reife:</text>
    <text x="385" y="330">  Kandidaten beherrschen Stationsalltag,</text>
    <text x="385" y="350">  Kliniksoftware und Patientenkommunikation.</text>
    <text x="385" y="385" font-weight="700" fill="#059669">• 100% Bleibequote für den Träger:</text>
    <text x="385" y="405">  Voll integrierte, hochgradig loyale</text>
    <text x="385" y="425">  Fachkräfte mit langfristiger Bindung.</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">Vermeidung von Bettenstillstand: Kluge Träger kombinieren Pflegehelfer mit Fachkraft-Programmen</text>
</svg>"""

# 10. koeche-visum-11-beschv-ablauf.svg
svgs["koeche-visum-11-beschv-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Ablauf Spezialitätenköche-Visum nach § 11 Abs. 2 BeschV</title>
  <desc id="desc">Vier Schritte zur Einstellung von Spezialitätenköchen aus Vietnam für Gastronomie und Hotellerie in Deutschland.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">GASTRONOMIE &amp; DEHOGA</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Spezialitätenköche (§ 11 BeschV)</text>

  <!-- Step 1 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="36" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="111" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">1. QUALIFIKATION</text>
  <text x="111" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Praxisnachweis</text>
  <text x="111" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">&amp; Ausbildung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="48" y="250">• Min. 2-jährige</text>
    <text x="48" y="270">  Kochausbildung</text>
    <text x="48" y="295">• Mehrjährige</text>
    <text x="48" y="315">  Erfahrung in der</text>
    <text x="48" y="335">  Spezialitätenküche</text>
    <text x="48" y="365">• Nachweis über</text>
    <text x="48" y="385">  Arbeitsbücher &amp;</text>
    <text x="48" y="405">  Menübelege</text>
  </g>

  <!-- Step 2 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="202" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="202" y="125" width="150" height="40" rx="16" fill="#0891b2"/>
  <text x="277" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">2. BETRIEB &amp; MENÜ</text>
  <text x="277" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Restaurant-</text>
  <text x="277" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">anforderungen</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="214" y="250">• Nachweis eines</text>
    <text x="214" y="270">  Spezialitätenangebots</text>
    <text x="214" y="295">• Authentische Speise-</text>
    <text x="214" y="315">  karte (z.B. asiatisch)</text>
    <text x="214" y="345">• DEHOGA-Tariflohn</text>
    <text x="214" y="365">  oder ortsübliche</text>
    <text x="214" y="385">  Vergütung</text>
    <text x="214" y="415">• Vollzeitarbeitsplatz</text>
  </g>

  <!-- Step 3 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="368" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="368" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="443" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">3. ZAV PRÜFUNG</text>
  <text x="443" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Zustimmung</text>
  <text x="443" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Bundesagentur</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="380" y="250">• Vorabprüfung über</text>
    <text x="380" y="270">  die ZAV Gastronomie</text>
    <text x="380" y="300">• Prüfung der</text>
    <text x="380" y="320">  Beschäftigungs-</text>
    <text x="380" y="340">  bedingungen</text>
    <text x="380" y="370">• Erteilung der</text>
    <text x="380" y="390">  Vorabzustimmung</text>
    <text x="380" y="415">• Dauer: 2–4 Wochen</text>
  </g>

  <!-- Step 4 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="534" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="534" y="125" width="150" height="40" rx="16" fill="#059669"/>
  <text x="609" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">4. VISUMSERTEILUNG</text>
  <text x="609" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Arbeitserlaubnis</text>
  <text x="609" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">bis zu 4 Jahre</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="546" y="250">• Visumserteilung bei</text>
    <text x="546" y="270">  Botschaft Hanoi</text>
    <text x="546" y="300">• Aufenthaltserlaubnis</text>
    <text x="546" y="320">  für bis zu 4 Jahre</text>
    <text x="546" y="350">• Keine strikte B1-</text>
    <text x="546" y="370">  Pflicht bei Einreise</text>
    <text x="546" y="405">• Sofortige Meister-</text>
    <text x="546" y="425">  leistung in der Küche</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents vermittelt erfahrene Spezialitätenköche mit verifizierten Nachweisen nach § 11 BeschV</text>
</svg>"""

# 11. steuerfreie-benefits-matrix.svg
svgs["steuerfreie-benefits-matrix.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Steuerfreie Arbeitgeberleistungen für Azubis und Fachkräfte</title>
  <desc id="desc">Fünf gesetzlich begünstigte Arbeitgeberleistungen nach EStG zur gezielten Unterstützung und Bindung internationaler Mitarbeiter.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">FINANZEN &amp; STEUERN</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Steuerfreie Benefits (§ 8 Abs. 2 EStG)</text>

  <!-- Row 1 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="205" height="155" rx="16"/>
    <rect x="257" y="125" width="205" height="155" rx="16"/>
    <rect x="478" y="125" width="205" height="155" rx="16"/>
  </g>

  <rect x="36" y="125" width="205" height="34" rx="16" fill="#1e3a5f"/>
  <text x="138" y="147" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="white">50 € SACHBEZUG</text>
  <g font-family="Arial,sans-serif" font-size="11" fill="#475569">
    <text x="50" y="180">• § 8 Abs. 2 Satz 11 EStG</text>
    <text x="50" y="200">• Monatliche Freigrenze: 50 €</text>
    <text x="50" y="220">• Gutscheinkarten (Einkauf, Tanken)</text>
    <text x="50" y="240">• 100% abgaben- &amp; steuerfrei</text>
    <text x="50" y="260">• Direkte Kaufkraft für Azubis</text>
  </g>

  <rect x="257" y="125" width="205" height="34" rx="16" fill="#0891b2"/>
  <text x="359" y="147" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="white">FAHRTKOSTEN (ÖPNV)</text>
  <g font-family="Arial,sans-serif" font-size="11" fill="#475569">
    <text x="271" y="180">• § 3 Nr. 15 EStG</text>
    <text x="271" y="200">• Deutschlandticket Jobticket</text>
    <text x="271" y="220">• Steuer- und sozialversicherungsfrei</text>
    <text x="271" y="240">• Mobilität zwischen Betrieb,</text>
    <text x="271" y="260">  Berufsschule &amp; Wohnung</text>
  </g>

  <rect x="478" y="125" width="205" height="34" rx="16" fill="#059669"/>
  <text x="580" y="147" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="white">MIETZUSCHUSS / WOHNEN</text>
  <g font-family="Arial,sans-serif" font-size="11" fill="#475569">
    <text x="492" y="180">• § 8 Abs. 2 Satz 12 EStG</text>
    <text x="492" y="200">• Verbilligte Wohnraumüberlassung</text>
    <text x="492" y="220">• Bewertungsabschlag von einem Drittel</text>
    <text x="492" y="240">• Entlastung bei hohen Mietkosten</text>
    <text x="492" y="260">• Werkswohnung / WG-Beteiligung</text>
  </g>

  <!-- Row 2 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="295" width="315" height="170" rx="16"/>
    <rect x="369" y="295" width="315" height="170" rx="16"/>
  </g>

  <rect x="36" y="295" width="315" height="34" rx="16" fill="#1e3a5f"/>
  <text x="193" y="317" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="white">VERPFLEGUNGSZUSCHUSS &amp; KANTINE</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="52" y="350">• Essensgutscheine / Digitale Essensmarken (Sachbezugswert)</text>
    <text x="52" y="375">• Bis zu 7,23 € kalendertäglich arbeitgeberfinanziert</text>
    <text x="52" y="400">• Entlastung der Auszubildenden bei täglicher Verpflegung</text>
    <text x="52" y="425">• Fördert gesunde Ernährung &amp; Teamzusammenhalt</text>
  </g>

  <rect x="369" y="295" width="315" height="34" rx="16" fill="#0891b2"/>
  <text x="526" y="317" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="white">WEITERBILDUNG &amp; SPRACHFÖRDERUNG</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="385" y="350">• § 3 Nr. 19 EStG: 100% steuerfreie Weiterbildung</text>
    <text x="385" y="375">• Deutsch-Sprachkurse &amp; Fachsprachzertifikate (B2/C1)</text>
    <text x="385" y="400">• Fachbücher, E-Learning-Lizenzen &amp; Kammerlehrgänge</text>
    <text x="385" y="425">• Gilt nicht als steuerpflichtiger Arbeitslohn</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents berät Unternehmen bei der Gestaltung steueroptimierter Vergütungspakete</text>
</svg>"""

# 12. chancenkarte-wechsel-festanstellung-ablauf.svg
svgs["chancenkarte-wechsel-festanstellung-ablauf.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-labelledby="title desc">
  <title id="title">Wechsel von der Chancenkarte in die Festanstellung</title>
  <desc id="desc">Ablauf des rechtssicheren Statuswechsels von § 20a AufenthG (Chancenkarte) zu § 18a/18b (Fachkraftvisum) ohne Ausreise.</desc>
  <rect width="720" height="540" rx="24" fill="#eef5f9"/>
  <text x="36" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#087f9b">STATUSWECHSEL INLAND</text>
  <text x="36" y="88" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1e3a5f">Chancenkarte in Festanstellung (§ 20a)</text>

  <!-- Step 1 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="36" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="36" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="111" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">1. KENNENLERNEN</text>
  <text x="111" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Chancenkarte</text>
  <text x="111" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Status prüfen</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="48" y="250">• Fachkraft hält</text>
    <text x="48" y="270">  gültigen § 20a-Titel</text>
    <text x="48" y="295">• Bereits in Deutschland</text>
    <text x="48" y="315">  wohnhaft &amp; gemeldet</text>
    <text x="48" y="345">• Erlaubt: Bis zu 20h</text>
    <text x="48" y="365">  Nebenbeschäftigung</text>
    <text x="48" y="395">• Bis zu 2 Wochen</text>
    <text x="48" y="415">  Probebeschäftigung</text>
  </g>

  <!-- Step 2 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="202" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="202" y="125" width="150" height="40" rx="16" fill="#0891b2"/>
  <text x="277" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">2. PROBE &amp; MATCH</text>
  <text x="277" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Eignungsprüfung</text>
  <text x="277" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">im Betrieb</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="214" y="250">• Durchführung einer</text>
    <text x="214" y="270">  Probebeschäftigung</text>
    <text x="214" y="295">• Fachliche Eignung</text>
    <text x="214" y="315">  in der Praxis prüfen</text>
    <text x="214" y="345">• Team-Passung und</text>
    <text x="214" y="365">  Sprachpraxis testen</text>
    <text x="214" y="395">• Festes Jobangebot</text>
    <text x="214" y="415">  erstellen</text>
  </g>

  <!-- Step 3 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="368" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="368" y="125" width="150" height="40" rx="16" fill="#1e3a5f"/>
  <text x="443" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">3. STATUSWECHSEL</text>
  <text x="443" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Antrag bei</text>
  <text x="443" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Ausländerbehörde</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="380" y="250">• Antrag auf Wechsel</text>
    <text x="380" y="270">  in § 18a / § 18b</text>
    <text x="380" y="300" font-weight="700" fill="#0284c7">• Keine Ausreise</text>
    <text x="380" y="320">  notwendig!</text>
    <text x="380" y="345">• Beteiligung der BA</text>
    <text x="380" y="365">  (Erklärung zum</text>
    <text x="380" y="385">  Beschäftigungsverhältnis)</text>
    <text x="380" y="415">• Fiktionsbescheinigung</text>
  </g>

  <!-- Step 4 -->
  <g fill="white" stroke="#0891b2" stroke-width="2">
    <rect x="534" y="125" width="150" height="340" rx="16"/>
  </g>
  <rect x="534" y="125" width="150" height="40" rx="16" fill="#059669"/>
  <text x="609" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="white">4. FESTANSTELLUNG</text>
  <text x="609" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">Volle Fachkraft-</text>
  <text x="609" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3a5f">beschäftigung</text>
  <g font-family="Arial,sans-serif" font-size="12" fill="#475569">
    <text x="546" y="250">• Erteilung des neuen</text>
    <text x="546" y="270">  Aufenthaltstitels</text>
    <text x="546" y="300">• Nahtloser Beginn der</text>
    <text x="546" y="320">  Vollzeitbeschäftigung</text>
    <text x="546" y="350">• Perspektive auf</text>
    <text x="546" y="370">  Niederlassungserlaubnis</text>
    <text x="546" y="405">• Volle Planungssicherheit</text>
    <text x="546" y="425">  für den Arbeitgeber</text>
  </g>

  <text x="360" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="600" fill="#64748b">DMF Talents unterstützt Arbeitgeber bei der Prüfung von Chancenkarte-Kandidaten und dem Statuswechsel</text>
</svg>"""

for fname, content in svgs.items():
    fpath = OUTPUT_DIR / fname
    fpath.write_text(content.strip(), encoding="utf-8")
    print(f"Generated: {fname}")

print(f"\nSuccessfully generated all {len(svgs)} technical SVG diagrams in {OUTPUT_DIR}")
