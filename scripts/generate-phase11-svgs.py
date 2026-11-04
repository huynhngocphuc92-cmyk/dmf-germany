#!/usr/bin/env python3
"""
Generate 12 custom vector SVG diagrams for Phase 11 Blog Articles (Posts 132–143 / 135–146 total).
Each SVG uses a 720x540 viewBox and the DMF corporate palette (Navy #003366, Orange #FF6600, Slate #64748B).
"""

from pathlib import Path

OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")

SVGS = {
    # 132: DMF Vietnam & DMF Talents Unternehmensprofil & Akademie-Struktur
    "dmf-vietnam-unternehmensprofil-akademie-struktur.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">DMF Vietnam &amp; DMF Talents: Integrierte Akademie- &amp; Brückenstruktur</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Zwei Trainingsstandorte in Vietnam + Direkte Repräsentanz in Deutschland (Über 58 Sprachkohorten)</text>

  <!-- Left Column: Vietnam Operations -->
  <g transform="translate(44, 110)">
    <rect width="304" height="230" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">Hauptsitz &amp; Akademie in Vietnam</text>
    <text x="16" y="62" fill="#003366" font-size="13" font-weight="700">1. Campus Biên Hòa (Đồng Nai)</text>
    <text x="16" y="80" fill="#475569" font-size="11">A11 KDC Quang Vinh, P. Quang Vinh, TP. Biên Hòa</text>
    <text x="16" y="106" fill="#003366" font-size="13" font-weight="700">2. Campus Ho-Chi-Minh-Stadt</text>
    <text x="16" y="124" fill="#475569" font-size="11">174/11 Điện Biên Phủ, Bình Thạnh, TP.HCM</text>
    <line x1="16" y1="138" x2="288" y2="138" stroke="#CBD5E1" stroke-width="1"/>
    <text x="16" y="158" fill="#9A3412" font-size="12" font-weight="700">Leitung vor Ort: Herr Achim Betticher</text>
    <text x="16" y="176" fill="#334155" font-size="11">• 58+ gestartete Sprachklassen (K1 bis K58)</text>
    <text x="16" y="194" fill="#334155" font-size="11">• 1:1 Bewerbungsgespräch-Coaching auf Deutsch</text>
    <text x="16" y="212" fill="#334155" font-size="11">• Praktische Vorschulung (Gastronomie &amp; Pflege)</text>
  </g>

  <!-- Right Column: Germany Representation -->
  <g transform="translate(372, 110)">
    <rect width="304" height="230" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#FF6600"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="13" font-weight="700">Direkte Vertretung in Deutschland</text>
    <text x="16" y="62" fill="#9A3412" font-size="13" font-weight="700">Ansprechpartner: Herr Umit Elezov</text>
    <text x="16" y="80" fill="#7C2D12" font-size="11">Direkter Kontakt: +49 174 9015811</text>
    <text x="16" y="106" fill="#9A3412" font-size="13" font-weight="700">Arbeitgeberbetreuung vor Ort</text>
    <text x="16" y="124" fill="#7C2D12" font-size="11">Persönliche Betriebsbesuche &amp; Bedarfsanalyse</text>
    <line x1="16" y1="138" x2="288" y2="138" stroke="#FDBA74" stroke-width="1"/>
    <text x="16" y="158" fill="#003366" font-size="12" font-weight="700">Behörden- &amp; Onboarding-Begleitung</text>
    <text x="16" y="176" fill="#334155" font-size="11">• Abstimmung mit IHK, HWK, BA &amp; Pflegeschulen</text>
    <text x="16" y="194" fill="#334155" font-size="11">• Flughafenabholung &amp; 30-Tage-Startbegleitung</text>
    <text x="16" y="212" fill="#334155" font-size="11">• 3 Jahre Nachbetreuung während der Ausbildung</text>
  </g>

  <!-- Bottom 5 Business Pillars -->
  <g transform="translate(44, 358)">
    <rect width="632" height="106" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="18" y="25" fill="#003366" font-size="13" font-weight="700">Die 5 Kernbereiche des DMF-Ökosystems (Qualitätsgesichert nach internem Governance-Standard):</text>
    <rect x="18" y="38" width="114" height="54" rx="6" fill="#FFFFFF" stroke="#003366"/>
    <text x="75" y="60" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">1. Sprachakademie</text>
    <text x="75" y="78" text-anchor="middle" fill="#475569" font-size="10">Intensiv A1 bis B2</text>

    <rect x="142" y="38" width="114" height="54" rx="6" fill="#FFFFFF" stroke="#003366"/>
    <text x="199" y="60" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">2. Ausbildung §16a</text>
    <text x="199" y="78" text-anchor="middle" fill="#475569" font-size="10">Pflege, HoGa, Technik</text>

    <rect x="266" y="38" width="114" height="54" rx="6" fill="#FFFFFF" stroke="#003366"/>
    <text x="323" y="60" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">3. Fachkräfte §18a/b</text>
    <text x="323" y="78" text-anchor="middle" fill="#475569" font-size="10">Anerkennung &amp; Visa</text>

    <rect x="390" y="38" width="114" height="54" rx="6" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="447" y="60" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">4. DMF Quality Gate</text>
    <text x="447" y="78" text-anchor="middle" fill="#7C2D12" font-size="10">Profil + 90s-Video</text>

    <rect x="514" y="38" width="100" height="54" rx="6" fill="#FFFFFF" stroke="#15803D"/>
    <text x="564" y="60" text-anchor="middle" fill="#15803D" font-size="11" font-weight="700">5. Studium</text>
    <text x="564" y="78" text-anchor="middle" fill="#475569" font-size="10">APS &amp; Studienkolleg</text>
  </g>

  <rect x="44" y="476" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="497" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Kein anonymer CV-Versand: Eigene Sprachausbildung + persönliche Vertretung in Deutschland &amp; Vietnam</text>
</svg>""",

    # 133: Deutschunterricht Intensivkurs A1 bis B2 an der DMF Sprachakademie
    "dmf-deutschunterricht-intensivkurs-a1-b2-curriculum.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">DMF Sprachakademie: 5-Tage-Intensivcurriculum (A1 bis B2)</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Kleine Lerngruppen (8–15 Teilnehmende) • 5 Sitzungen/Woche à 90 Min. • Vietnamesische &amp; deutsche Lehrkräfte</text>

  <!-- 4 Course Stages -->
  <g transform="translate(44, 112)">
    <rect width="632" height="68" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect width="120" height="68" rx="8" fill="#003366"/>
    <text x="60" y="30" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="800">Stufe A1</text>
    <text x="60" y="50" text-anchor="middle" fill="#CBD5E1" font-size="11">60 Sitzungen</text>
    <text x="140" y="26" fill="#003366" font-size="13" font-weight="700">Fundament &amp; Phonetik-Training (ca. 2,5–3 Monate)</text>
    <text x="140" y="45" fill="#334155" font-size="11">• Systematische Aussprachekorrektur ab Woche 1 • Basisgrammatik (Grammatik aktiv)</text>
    <text x="140" y="61" fill="#475569" font-size="11">• Alltagsdialoge, Zahlen, Uhrzeiten &amp; erste Hörverständnis-Routinen</text>
  </g>

  <g transform="translate(44, 192)">
    <rect width="632" height="68" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect width="120" height="68" rx="8" fill="#003366"/>
    <text x="60" y="30" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="800">Stufe A2</text>
    <text x="60" y="50" text-anchor="middle" fill="#CBD5E1" font-size="11">70 Sitzungen</text>
    <text x="140" y="26" fill="#003366" font-size="13" font-weight="700">Satzbau-Sicherheit &amp; Aktives Sprechen (ca. 3–3,5 Monate)</text>
    <text x="140" y="45" fill="#334155" font-size="11">• Nebensätze, Perfekt/Präteritum, Modalverben im Arbeitskontext</text>
    <text x="140" y="61" fill="#475569" font-size="11">• Freies Erzählen über den eigenen Lebenslauf ohne Ablesen von Notizen</text>
  </g>

  <g transform="translate(44, 272)">
    <rect width="632" height="68" rx="8" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5"/>
    <rect width="120" height="68" rx="8" fill="#FF6600"/>
    <text x="60" y="30" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="800">Stufe B1</text>
    <text x="60" y="50" text-anchor="middle" fill="#FFEDD5" font-size="11">80 Sitzungen</text>
    <text x="140" y="26" fill="#9A3412" font-size="13" font-weight="700">Berufsorientierte Kommunikationsfähigkeit (ca. 3,5–4 Monate)</text>
    <text x="140" y="45" fill="#7C2D12" font-size="11">• Ausgewogenes 4-Fertigkeiten-Training (Hören, Sprechen, Lesen, Schreiben)</text>
    <text x="140" y="61" fill="#9A3412" font-size="11">• Start des 1:1 Interview-Coachings mit Herrn Achim Betticher &amp; Videoaufnahme</text>
  </g>

  <g transform="translate(44, 352)">
    <rect width="632" height="68" rx="8" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.5"/>
    <rect width="120" height="68" rx="8" fill="#15803D"/>
    <text x="60" y="30" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="800">Stufe B2</text>
    <text x="60" y="50" text-anchor="middle" fill="#DCFCE7" font-size="11">100 Sitzungen</text>
    <text x="140" y="26" fill="#166534" font-size="13" font-weight="700">Fachsprache für Pflege, Gastronomie &amp; Berufsschule (ca. 4,5 Monate)</text>
    <text x="140" y="45" fill="#14532D" font-size="11">• Dienstübergabe, Patienten-/Gästegespräche, Beschwerdemanagement &amp; Fachberichte</text>
    <text x="140" y="61" fill="#166534" font-size="11">• Präsenz- &amp; Online-B2-Klassen (z. B. K44) für nahtlosen Übergang bis zur Ausreise</text>
  </g>

  <rect x="44" y="434" width="632" height="32" rx="6" fill="#F1F5F9" stroke="#CBD5E1"/>
  <text x="360" y="455" text-anchor="middle" fill="#003366" font-size="12" font-weight="700">Lehrkörper-Mix: Vietnamesische Grammatik-Dozenten (Lộc, Khang, Ly) + Muttersprachler (Achim, Tamara, Ralf)</text>

  <rect x="44" y="476" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="497" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Ergebnis: Echte Hör- und Sprechkompetenz im Betrieb statt reiner Multiple-Choice-Prüfungsroutine</text>
</svg>""",

    # 134: Interview-Coaching durch Achim Betticher in Vietnam
    "dmf-interview-coaching-achim-betticher-methodik.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">DMF Interview-Coaching: Die Methodik von Achim Betticher</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">„Nicht Mustertexte auswendig lernen, sondern Fragen verstehen und authentisch antworten“</text>

  <!-- Comparison Top: Klassischer Fehler vs. DMF Coaching -->
  <g transform="translate(44, 110)">
    <rect width="304" height="145" rx="10" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#DC2626"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">Typisches Problem bei Standard-Agenturen</text>
    <text x="16" y="56" fill="#7F1D1D" font-size="11">• Auswendig gelernte Standardantworten</text>
    <text x="16" y="76" fill="#7F1D1D" font-size="11">• Blockade bei spontanen Zwischenfragen</text>
    <text x="16" y="96" fill="#7F1D1D" font-size="11">• Höfliches Lächeln trotz Nichtverstehen</text>
    <text x="16" y="116" fill="#7F1D1D" font-size="11">• Enttäuschung in der ersten Arbeitswoche</text>
  </g>

  <g transform="translate(372, 110)">
    <rect width="304" height="145" rx="10" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#15803D"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">1:1 Training mit Achim Betticher (DMF)</text>
    <text x="16" y="56" fill="#14532D" font-size="11">• Training mit deutschem Muttersprachler vor Ort</text>
    <text x="16" y="76" fill="#14532D" font-size="11">• Antworten aus der eigenen Biografie formulieren</text>
    <text x="16" y="96" fill="#14532D" font-size="11">• Aktives Nachfragen bei akustischer Unsicherheit</text>
    <text x="16" y="116" fill="#14532D" font-size="11">• Realistische Einschätzung vor dem Arbeitgeber-Call</text>
  </g>

  <!-- 4 Coaching Modules -->
  <g transform="translate(44, 274)">
    <rect width="632" height="186" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="20" y="28" fill="#003366" font-size="14" font-weight="700">Die 4 Trainingsbausteine vor jedem Vorstellungsgespräch bei DMF Vietnam:</text>

    <rect x="20" y="44" width="286" height="58" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="32" y="65" fill="#003366" font-size="12" font-weight="700">1. Akustische Gewöhnung (Originaltempo)</text>
    <text x="32" y="84" fill="#475569" font-size="11">Hörtraining mit verschiedenen deutschen Sprechweisen</text>

    <rect x="326" y="44" width="286" height="58" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="338" y="65" fill="#003366" font-size="12" font-weight="700">2. Berufsmotivation &amp; Branchenwissen</text>
    <text x="338" y="84" fill="#475569" font-size="11">Warum Pflege, Küche oder Technik? Ehrliche Erwartungen</text>

    <rect x="20" y="114" width="286" height="58" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="32" y="135" fill="#9A3412" font-size="12" font-weight="700">3. Professionelle Rückfrage-Technik</text>
    <text x="32" y="154" fill="#475569" font-size="11">„Können Sie die Frage bitte noch einmal wiederholen?“</text>

    <rect x="326" y="114" width="286" height="58" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="338" y="135" fill="#15803D" font-size="12" font-weight="700">4. Generalprobe &amp; Freigabe-Votum</text>
    <text x="338" y="154" fill="#475569" font-size="11">Freigabe für Arbeitgeber-Gespräch erst bei echter Reife</text>
  </g>

  <rect x="44" y="476" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="497" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Mehrwert für Ausbilder: Sie erleben im Video-Call genau den Menschen, der später im Betrieb startet</text>
</svg>""",

    # 135: Direkte Vertretung in Deutschland (Umit Elezov) & Tandem-Modell
    "dmf-direkte-vertretung-deutschland-umit-elezov-tandem.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Das DMF Tandem-Modell: Direkte Präsenz in Deutschland &amp; Vietnam</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Verbindliche Ansprechpartner in beiden Zeitzonen für deutsche Ausbildungsbetriebe</text>

  <!-- Left Card: Umit Elezov -->
  <g transform="translate(44, 112)">
    <rect width="290" height="260" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="290" height="44" rx="10" fill="#FF6600"/>
    <text x="16" y="20" fill="#FFFFFF" font-size="13" font-weight="700">Direkte Vertretung in Deutschland</text>
    <text x="16" y="36" fill="#FFEDD5" font-size="11">Herr Umit Elezov (+49 174 9015811)</text>
    <text x="16" y="70" fill="#9A3412" font-size="12" font-weight="700">Aufgaben vor Ort in Deutschland:</text>
    <text x="16" y="94" fill="#334155" font-size="11">• Persönliche Besuche im Ausbildungsbetrieb</text>
    <text x="16" y="116" fill="#334155" font-size="11">• Klärung von Ausbildungsplan, Schicht &amp; Wohnraum</text>
    <text x="16" y="138" fill="#334155" font-size="11">• Abstimmung mit IHK/HWK, Pflegeschulen &amp; Behörden</text>
    <text x="16" y="160" fill="#334155" font-size="11">• Begleitung beim Onboarding nach der Einreise</text>
    <text x="16" y="182" fill="#334155" font-size="11">• Direkter Krisen- &amp; Mediationskontakt in der Probezeit</text>
    <rect x="16" y="202" width="258" height="42" rx="6" fill="#FFFFFF" stroke="#FDBA74"/>
    <text x="145" y="220" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">Keine Sprach- oder Zeitzonenbarriere</text>
    <text x="145" y="236" text-anchor="middle" fill="#7C2D12" font-size="10">Direkt erreichbar zu deutschen Bürozeiten</text>
  </g>

  <!-- Center Arrow / Bridge -->
  <g transform="translate(342, 210)">
    <rect x="0" y="0" width="36" height="44" rx="6" fill="#003366"/>
    <text x="18" y="27" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="800">⇄</text>
  </g>

  <!-- Right Card: Achim Betticher & VN Team -->
  <g transform="translate(386, 112)">
    <rect width="290" height="260" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="290" height="44" rx="10" fill="#003366"/>
    <text x="16" y="20" fill="#FFFFFF" font-size="13" font-weight="700">Vertretung &amp; Akademie in Vietnam</text>
    <text x="16" y="36" fill="#CBD5E1" font-size="11">Herr Achim Betticher (+84 855 070773)</text>
    <text x="16" y="70" fill="#003366" font-size="12" font-weight="700">Aufgaben vor Ort in Vietnam:</text>
    <text x="16" y="94" fill="#334155" font-size="11">• Qualitätskontrolle des Deutschunterrichts (A1–B2)</text>
    <text x="16" y="116" fill="#334155" font-size="11">• Gezielte Kandidatenauswahl nach Betriebsprofil</text>
    <text x="16" y="138" fill="#334155" font-size="11">• 1:1 Interview-Vorbereitung &amp; Sprechtest</text>
    <text x="16" y="160" fill="#334155" font-size="11">• Dokumentenprüfung, Übersetzung &amp; Visumverfahren</text>
    <text x="16" y="182" fill="#334155" font-size="11">• Eltern- &amp; Familienkommunikation vor dem Abflug</text>
    <rect x="16" y="202" width="258" height="42" rx="6" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="145" y="220" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">Operative Steuerung (Khoa, Sún, Phượng, Vy)</text>
    <text x="145" y="236" text-anchor="middle" fill="#475569" font-size="10">Lückenlose Übergabe von Kurs bis Abflug</text>
  </g>

  <!-- Bottom Workflow Bar -->
  <g transform="translate(44, 390)">
    <rect width="632" height="72" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="20" y="24" fill="#003366" font-size="12" font-weight="700">Wie das Tandem im Alltag für Ihren Betrieb zusammenspielt:</text>
    <text x="20" y="44" fill="#334155" font-size="11">1. Anforderungsprofil mit Umit Elezov / Achim Betticher klären → 2. Geprüfte Shortlist aus Vietnam erhalten</text>
    <text x="20" y="61" fill="#334155" font-size="11">3. Gemeinsames Video-Interview → 4. IHK-/BA-/Visum-Abwicklung → 5. Abholung &amp; Vor-Ort-Betreuung in Deutschland</text>
  </g>

  <rect x="44" y="476" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="497" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Volle Verantwortlichkeit aus einer Hand – vom ersten Sprachtag in Biên Hòa bis zur Abschlussprüfung</text>
</svg>""",

    # 136: Das DMF Quality Gate & Entscheidungsfähige Kandidatenprofile
    "dmf-quality-gate-kandidatenprofil-90s-video.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Das 4-stufige DMF Quality Gate vor jedem Arbeitgeber-Vorschlag</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Warum DMF Talents nur entscheidungsfähige Profile mit 60–90-Sekunden-Video vorlegt</text>

  <!-- 4 Quality Gates -->
  <g transform="translate(44, 110)">
    <rect width="298" height="118" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="298" height="30" rx="8" fill="#003366"/>
    <text x="14" y="20" fill="#FFFFFF" font-size="12" font-weight="700">Gate 1: Dokumenten- &amp; Berufskonsistenz</text>
    <text x="14" y="52" fill="#334155" font-size="11">• Schulabschluss, Notenbild &amp; Reisepass geprüft</text>
    <text x="14" y="72" fill="#334155" font-size="11">• Einheitlicher Berufswunsch in CV &amp; Anschreiben</text>
    <text x="14" y="92" fill="#334155" font-size="11">• Gesundheitliche Eignung &amp; Führungszeugnis</text>
  </g>

  <g transform="translate(378, 110)">
    <rect width="298" height="118" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="298" height="30" rx="8" fill="#003366"/>
    <text x="14" y="20" fill="#FFFFFF" font-size="12" font-weight="700">Gate 2: Realer Sprech- &amp; Hörtest (B1/B2)</text>
    <text x="14" y="52" fill="#334155" font-size="11">• Nicht nur Zertifikatsstatus, sondern freies Gespräch</text>
    <text x="14" y="72" fill="#334155" font-size="11">• Prüfung durch Akademieleitung (Khoa &amp; Achim)</text>
    <text x="14" y="92" fill="#334155" font-size="11">• Transparente Angabe laufender B2-Module</text>
  </g>

  <g transform="translate(44, 244)">
    <rect width="298" height="118" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <rect width="298" height="30" rx="8" fill="#FF6600"/>
    <text x="14" y="20" fill="#FFFFFF" font-size="12" font-weight="700">Gate 3: 60–90 Sekunden Vorstellungsvideo</text>
    <text x="14" y="52" fill="#7C2D12" font-size="11">• Authentische Aufnahme auf Deutsch ohne Teleprompter</text>
    <text x="14" y="72" fill="#7C2D12" font-size="11">• Ausbilder hören Aussprache &amp; Sprechfluss sofort</text>
    <text x="14" y="92" fill="#7C2D12" font-size="11">• Spart Personalabteilungen 70 % Vorauswahlzeit</text>
  </g>

  <g transform="translate(378, 244)">
    <rect width="298" height="118" rx="8" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
    <rect width="298" height="30" rx="8" fill="#15803D"/>
    <text x="14" y="20" fill="#FFFFFF" font-size="12" font-weight="700">Gate 4: Erwartungs- &amp; Standort-Check</text>
    <text x="14" y="52" fill="#14532D" font-size="11">• Bereitschaft zu Schicht-, Wochenend- &amp; Feiertagsdienst</text>
    <text x="14" y="72" fill="#14532D" font-size="11">• Akzeptanz auch ländlicher Regionen / ÖPNV-Wege</text>
    <text x="14" y="92" fill="#14532D" font-size="11">• Verbindlicher Starttermin &amp; Finanzierungsplan</text>
  </g>

  <!-- Deliverable Box -->
  <g transform="translate(44, 380)">
    <rect width="632" height="82" rx="8" fill="#F1F5F9" stroke="#003366" stroke-width="1.5"/>
    <text x="20" y="24" fill="#003366" font-size="13" font-weight="700">Das erhalten Sie als Arbeitgeber im DMF-Kandidaten-Dossier:</text>
    <text x="20" y="46" fill="#334155" font-size="11">✓ Strukturierter deutscher Lebenslauf &amp; Motivationsschreiben   ✓ Ehrliche Sprachstand-Einschätzung (Mündlich/Schriftlich)</text>
    <text x="20" y="66" fill="#334155" font-size="11">✓ Direkt abrufbares 60–90s Kurzvideo des Kandidaten           ✓ Geprüfte Zeugnisse, Verfügbarkeit &amp; Interview-Terminvorschläge</text>
  </g>

  <rect x="44" y="476" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="497" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Qualität vor Quantität: 2 bis 3 passgenaue Profile statt 30 ungeprüfter Standard-Bewerbungen</text>
</svg>""",

    # 137: Praktische Berufsvorbereitung Gastronomie, Hotellerie & Bäckerei (BCIS)
    "dmf-praxisvorbereitung-gastronomie-hotellerie-bcis.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Praxisvorbereitung in Vietnam für Hotellerie, Küche &amp; Bäckerei</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Praktische Trainingseinheiten (u. a. BCIS-Lehrküche) vor dem Ausbildungsstart in Deutschland</text>

  <!-- 4 Practical Training Modules -->
  <g transform="translate(44, 112)">
    <rect width="304" height="158" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#003366"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">1. Küche &amp; Lebensmittelhandwerk (Koch)</text>
    <text x="16" y="54" fill="#334155" font-size="11">• Schneidetechniken, Mise en Place &amp; Küchengeräte</text>
    <text x="16" y="74" fill="#334155" font-size="11">• Deutsche Küchenbegriffe &amp; Posten-Kommunikation</text>
    <text x="16" y="94" fill="#334155" font-size="11">• Arbeitssicherheit, Arbeitskleidung &amp; Tempo</text>
    <text x="16" y="114" fill="#334155" font-size="11">• Grundverständnis für HACCP &amp; Kühlketten</text>
    <text x="16" y="138" fill="#003366" font-size="11" font-weight="700">Ziel: Sofortige Einsatzfähigkeit in Woche 1</text>
  </g>

  <g transform="translate(372, 112)">
    <rect width="304" height="158" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#FF6600"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">2. Bäckerei &amp; Konditorei (Praxislabor)</text>
    <text x="16" y="54" fill="#7C2D12" font-size="11">• Teigführung, Abwiegen, Formen &amp; Ofenarbeit</text>
    <text x="16" y="74" fill="#7C2D12" font-size="11">• Umgang mit Rezepturen &amp; deutschen Maßeinheiten</text>
    <text x="16" y="94" fill="#7C2D12" font-size="11">• Vorbereitung auf Frühschichten &amp; Backstuben-Rhythmus</text>
    <text x="16" y="114" fill="#7C2D12" font-size="11">• Sauberkeit am Arbeitsplatz nach deutschem Standard</text>
    <text x="16" y="138" fill="#9A3412" font-size="11" font-weight="700">Ziel: Reale Vorstellung vom Bäcker-/Konditorberuf</text>
  </g>

  <g transform="translate(44, 288)">
    <rect width="304" height="158" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#334155"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">3. Restaurant- &amp; Veranstaltungsservice</text>
    <text x="16" y="54" fill="#334155" font-size="11">• Eindecken nach deutschem Standard, Tragegriffe</text>
    <text x="16" y="74" fill="#334155" font-size="11">• Gästebegrüßung, Bestellaufnahme &amp; Wein-/Getränke-ABC</text>
    <text x="16" y="94" fill="#334155" font-size="11">• Höfliche Redewendungen bei Reklamationen</text>
    <text x="16" y="114" fill="#334155" font-size="11">• Teamarbeit zwischen Service und Küche</text>
    <text x="16" y="138" fill="#003366" font-size="11" font-weight="700">Ziel: Souveränes Auftreten am Gast</text>
  </g>

  <g transform="translate(372, 288)">
    <rect width="304" height="158" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#15803D"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">4. Hotelfach (Housekeeping &amp; Rezeption)</text>
    <text x="16" y="54" fill="#14532D" font-size="11">• Verständnis für abteilungsübergreifende Rotation</text>
    <text x="16" y="74" fill="#14532D" font-size="11">• Qualitätsstandards im Housekeeping &amp; Frühstücksdienst</text>
    <text x="16" y="94" fill="#14532D" font-size="11">• Check-in/Check-out-Dialoge &amp; Telefon-Etikette</text>
    <text x="16" y="114" fill="#14532D" font-size="11">• Realistische Einstellung zu Wochenend-/Teildiensten</text>
    <text x="16" y="138" fill="#15803D" font-size="11" font-weight="700">Ziel: Hohe Bleibequote in der Probezeit</text>
  </g>

  <rect x="44" y="468" width="632" height="38" rx="6" fill="#003366"/>
  <text x="360" y="492" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Praxis-Effekt: Unsere HoGa-Azubis kennen Handgriffe, Fachbegriffe &amp; Arbeitsrealität schon vor dem Abflug</text>
</svg>""",

    # 138: Pflegeausbildung Vorbereitung bei DMF Vietnam
    "dmf-pflegeausbildung-vorbereitung-traeger-pflegeschule.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">DMF-Spezialprüfung für die generalistische Pflegeausbildung</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Verzahnung von Sprachreife (B1/B2), Empathie, Schichtdienst-Bereitschaft &amp; Pflegeschul-Abstimmung</text>

  <!-- Top Dual Check: Kandidat vs. Struktur -->
  <g transform="translate(44, 110)">
    <rect width="304" height="195" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#003366"/>
    <text x="16" y="23" fill="#FFFFFF" font-size="12" font-weight="700">A. Kandidaten-Vorbereitung in Vietnam</text>
    <text x="16" y="58" fill="#003366" font-size="12" font-weight="700">1. Sprachniveau B1+ / B2-Pflegefokus</text>
    <text x="16" y="76" fill="#475569" font-size="11">Körperteile, Vitalwerte, Pflegebericht, Übergabe</text>
    <text x="16" y="102" fill="#003366" font-size="12" font-weight="700">2. Realistisches Berufsbild Grundpflege</text>
    <text x="16" y="120" fill="#475569" font-size="11">Körperpflege, Mobilisation, Ernährung &amp; Hygiene</text>
    <text x="16" y="146" fill="#003366" font-size="12" font-weight="700">3. Psychologische Schichtdienst-Reife</text>
    <text x="16" y="164" fill="#475569" font-size="11">Früh-, Spät- und Wochenenddienste klar besprochen</text>
  </g>

  <g transform="translate(372, 110)">
    <rect width="304" height="195" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#FF6600"/>
    <text x="16" y="23" fill="#FFFFFF" font-size="12" font-weight="700">B. Struktur-Check mit dem deutschen Träger</text>
    <text x="16" y="58" fill="#9A3412" font-size="12" font-weight="700">1. Träger der praktischen Ausbildung</text>
    <text x="16" y="76" fill="#7C2D12" font-size="11">Klinikum, Pflegeheim oder ambulanter Dienst</text>
    <text x="16" y="102" fill="#9A3412" font-size="12" font-weight="700">2. Fester Schulplatz an der Pflegeschule</text>
    <text x="16" y="120" fill="#7C2D12" font-size="11">Kooperationsvertrag &amp; Starttermin (April/Aug./Okt.)</text>
    <text x="16" y="146" fill="#9A3412" font-size="12" font-weight="700">3. Praxisanleitung &amp; Wohnortnähe</text>
    <text x="16" y="164" fill="#7C2D12" font-size="11">Erreichbarkeit im Frühdienst &amp; feste Mentoren</text>
  </g>

  <!-- Bottom Checklist -->
  <g transform="translate(44, 324)">
    <rect width="632" height="134" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="20" y="26" fill="#003366" font-size="13" font-weight="700">Vollständiges Dokumentenpaket für Pflege- &amp; ZFA-Ausbildungsbetriebe:</text>
    <text x="20" y="50" fill="#334155" font-size="11">• Beglaubigte &amp; übersetzte Schulzeugnisse + ggf. Schulabschluss-Anerkennung der Landesbehörde</text>
    <text x="20" y="72" fill="#334155" font-size="11">• Ärztliches Attest zur gesundheitlichen Eignung + Impfnachweise (Masernschutz / Hepatitis-Status)</text>
    <text x="20" y="94" fill="#334155" font-size="11">• Erweitertes Führungszeugnis + B1/B2-Zertifikat + Bestätigung des laufenden Fachsprachkurses</text>
    <text x="20" y="116" fill="#15803D" font-size="11" font-weight="700">• Vorabstimmung bei verspätetem Start (z. B. Musterfall Willy-Hellpach-Schule Heidelberg)</text>
  </g>

  <rect x="44" y="474" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="495" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Sicherheit für Pflegedienstleitungen: Keine Fehlbesetzungen durch lückenlose Vorab-Aufklärung</text>
</svg>""",

    # 139: 30-Tage-Onboarding-Protokoll in Deutschland (Ankunft & Nachbetreuung)
    "dmf-ankunft-onboarding-30-tage-protokoll.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">DMF 30-Tage-Onboarding-Protokoll nach der Ankunft in Deutschland</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Vertraglich verankerte Fürsorge (Anlage II) vom Zielflughafen bis zum ersten Berufsschultag</text>

  <!-- 4 Weeks Timeline -->
  <g transform="translate(44, 110)">
    <rect width="632" height="76" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <rect width="136" height="76" rx="8" fill="#FF6600"/>
    <text x="68" y="32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="800">Tag 1 – 3</text>
    <text x="68" y="52" text-anchor="middle" fill="#FFEDD5" font-size="11">Landung &amp; Einzug</text>
    <text x="154" y="26" fill="#9A3412" font-size="13" font-weight="700">Persönlicher Empfang am Flughafen &amp; Wohnungsübergabe</text>
    <text x="154" y="46" fill="#7C2D12" font-size="11">• Abholung am Airport (z. B. Frankfurt/München) + Übergabe einer deutschen SIM-Karte</text>
    <text x="154" y="64" fill="#7C2D12" font-size="11">• Begleitung bis zur Unterkunft, Wohnungsübergabe, Erst-Einkauf &amp; Rückmeldung an Eltern/Betrieb</text>
  </g>

  <g transform="translate(44, 198)">
    <rect width="632" height="76" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="136" height="76" rx="8" fill="#003366"/>
    <text x="68" y="32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="800">Tag 4 – 10</text>
    <text x="68" y="52" text-anchor="middle" fill="#CBD5E1" font-size="11">Behörden &amp; Bank</text>
    <text x="154" y="26" fill="#003366" font-size="13" font-weight="700">Einwohnermeldeamt, Steuer-ID, Girokonto &amp; Krankenkasse</text>
    <text x="154" y="46" fill="#334155" font-size="11">• Wohnsitzanmeldung mit Wohnungsgeberbestätigung (Meldeschein) beim Bürgeramt</text>
    <text x="154" y="64" fill="#334155" font-size="11">• Eröffnung des deutschen Gehaltskontos + Aktivierung der gesetzlichen Krankenversicherung</text>
  </g>

  <g transform="translate(44, 286)">
    <rect width="632" height="76" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="136" height="76" rx="8" fill="#334155"/>
    <text x="68" y="32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="800">Tag 11 – 20</text>
    <text x="68" y="52" text-anchor="middle" fill="#CBD5E1" font-size="11">Mobilität &amp; Schule</text>
    <text x="154" y="26" fill="#003366" font-size="13" font-weight="700">Arbeitsweg-Training, Deutschlandticket &amp; Berufsschul-Anmeldung</text>
    <text x="154" y="46" fill="#334155" font-size="11">• Einüben der Bus-/Bahnverbindung zwischen Wohnung, Ausbildungsbetrieb und Berufsschule</text>
    <text x="154" y="64" fill="#334155" font-size="11">• Gesundheitsbelehrung (§ 43 IfSG) / arbeitsmedizinische Vorsorge &amp; Arbeitskleidung</text>
  </g>

  <g transform="translate(44, 374)">
    <rect width="632" height="76" rx="8" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
    <rect width="136" height="76" rx="8" fill="#15803D"/>
    <text x="68" y="32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="800">Tag 21 – 30+</text>
    <text x="68" y="52" text-anchor="middle" fill="#DCFCE7" font-size="11">Stabilitäts-Check</text>
    <text x="154" y="26" fill="#166534" font-size="13" font-weight="700">Feedbackgespräch mit Ausbilder &amp; Übergang in die 3-Jahres-Begleitung</text>
    <text x="154" y="46" fill="#14532D" font-size="11">• 30-Tage-Check durch DMF: Erste Lohnabrechnung, Einleben im Team &amp; Berufsschulstart</text>
    <text x="154" y="64" fill="#14532D" font-size="11">• Langzeitbegleitung bei Aufenthaltstitel-Verlängerung (eAT) und Zwischen-/Abschlussprüfung</text>
  </g>

  <rect x="44" y="468" width="632" height="36" rx="6" fill="#003366"/>
  <text x="360" y="491" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Entlastung für HR &amp; Ausbilder: Ihre neuen Azubis starten ausgeschlafen, angemeldet und orientiert</text>
</svg>""",

    # 140: Fallstudie Industrie & Technik – Phạm Ngọc Hoàng Duy (BBS Meppen)
    "dmf-fallstudie-industrie-hoang-duy-bbs-meppen.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Praxis-Fallstudie Industrie: Phạm Ngọc Hoàng Duy (BBS Meppen)</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Dokumentierter End-to-End-Prozess für die Ausbildung zum Maschinen- und Anlagenführer (MAF)</text>

  <!-- 5 Milestone Steps -->
  <g transform="translate(44, 112)">
    <rect width="632" height="62" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
    <circle cx="34" cy="31" r="18" fill="#003366"/>
    <text x="34" y="36" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">1</text>
    <text x="66" y="25" fill="#003366" font-size="13" font-weight="700">Sprachausbildung &amp; Profilaufbau bei DMF Vietnam</text>
    <text x="66" y="45" fill="#475569" font-size="11">Intensivkurs bis B1 + technischer Grundwortschatz + Interview-Training mit Herrn Achim Betticher</text>
  </g>

  <g transform="translate(44, 184)">
    <rect width="632" height="62" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
    <circle cx="34" cy="31" r="18" fill="#003366"/>
    <text x="34" y="36" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">2</text>
    <text x="66" y="25" fill="#003366" font-size="13" font-weight="700">Ausbildungsvertrag &amp; Berufsschul-Anmeldung (BBS Meppen)</text>
    <text x="66" y="45" fill="#475569" font-size="11">Unterzeichneter Vertrag zum 01.08.2026 + offizielle Schulanmeldung an den Berufsbildenden Schulen Meppen</text>
  </g>

  <g transform="translate(44, 256)">
    <rect width="632" height="62" rx="8" fill="#FFF7ED" stroke="#FDBA74"/>
    <circle cx="34" cy="31" r="18" fill="#FF6600"/>
    <text x="34" y="36" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">3</text>
    <text x="66" y="25" fill="#9A3412" font-size="13" font-weight="700">Wohnraumsicherung &amp; Meldeschein vor der Einreise</text>
    <text x="66" y="45" fill="#7C2D12" font-size="11">Vorab gesicherte Unterkunft inkl. vorbereitetem Meldeschein ab 01.08.2026 für das Visum- &amp; Meldeverfahren</text>
  </g>

  <g transform="translate(44, 328)">
    <rect width="632" height="62" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
    <circle cx="34" cy="31" r="18" fill="#003366"/>
    <text x="34" y="36" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">4</text>
    <text x="66" y="25" fill="#003366" font-size="13" font-weight="700">Visumerteilung &amp; Personalisiertes DMF-Reisehandbuch</text>
    <text x="66" y="45" fill="#475569" font-size="11">Maßgeschneidertes Handbuch: Packliste, Dokumentenmappe, Flugroute, Zugverbindung &amp; Notfallkontakte</text>
  </g>

  <g transform="translate(44, 400)">
    <rect width="632" height="62" rx="8" fill="#F0FDF4" stroke="#86EFAC"/>
    <circle cx="34" cy="31" r="18" fill="#15803D"/>
    <text x="34" y="36" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">5</text>
    <text x="66" y="25" fill="#166534" font-size="13" font-weight="700">Pünktlicher Ausbildungsstart im Emsland (Niedersachsen)</text>
    <text x="66" y="45" fill="#14532D" font-size="11">Planmäßige Einreise zum 01.08.2026, Behördengänge in der ersten Woche &amp; strukturierter Praxisstart</text>
  </g>

  <rect x="44" y="474" width="632" height="32" rx="6" fill="#003366"/>
  <text x="360" y="495" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Erfolgsfaktor für Industriebetriebe: Jedes Detail von der BBS-Anmeldung bis zum Zugticket ist vorab geklärt</text>
</svg>""",

    # 141: Doppel-Fallstudie Hotellerie (Thiện Tuấn) & ZFA (Hoàng Dung)
    "dmf-fallstudie-hotellerie-zfa-thien-tuan-hoang-dung.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">Zwei reale DMF-Erfolgsfälle: Hotellerie (IHK) &amp; Zahnmedizin (ZFA)</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Wie strukturierte Dokumentenführung bei IHK, Berufsschule und Botschaft Verzögerungen vermeidet</text>

  <!-- Left Case: Thien Tuan -->
  <g transform="translate(44, 112)">
    <rect width="304" height="344" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="44" rx="10" fill="#003366"/>
    <text x="16" y="20" fill="#FFFFFF" font-size="13" font-weight="700">Fall 1: Nguyễn Thiện Tuấn</text>
    <text x="16" y="36" fill="#CBD5E1" font-size="11">Ausbildung zum Hotelfachmann (IHK)</text>

    <text x="16" y="68" fill="#003366" font-size="12" font-weight="700">Ausbildungsbetrieb:</text>
    <text x="16" y="86" fill="#334155" font-size="11">Daled Hotel Grundstücks GmbH</text>

    <text x="16" y="114" fill="#003366" font-size="12" font-weight="700">Dokumentierte Meilensteine:</text>
    <text x="16" y="136" fill="#334155" font-size="11">✓ Ausbildungsvertrag &amp; Erklärung zum</text>
    <text x="28" y="152" fill="#334155" font-size="11">Beschäftigungsverhältnis (EzB)</text>
    <text x="16" y="176" fill="#334155" font-size="11">✓ Offizielle IHK-Eintragungsbestätigung</text>
    <text x="16" y="200" fill="#334155" font-size="11">✓ § 16a-Visumerteilung &amp; Flugbuchung</text>
    <text x="16" y="224" fill="#334155" font-size="11">✓ Persönliche Begleitung nach der Landung</text>
    <text x="28" y="240" fill="#334155" font-size="11">(„DMF cùng Thiện Tuấn ở Đức“)</text>

    <rect x="16" y="268" width="272" height="58" rx="6" fill="#EFF6FF" stroke="#93C5FD"/>
    <text x="152" y="290" text-anchor="middle" fill="#1E3A8A" font-size="11" font-weight="700">Praxis-Takeaway für Hoteliers:</text>
    <text x="152" y="308" text-anchor="middle" fill="#1E40AF" font-size="10">IHK-Eintragung + Vor-Ort-Begleitung sichern</text>
    <text x="152" y="321" text-anchor="middle" fill="#1E40AF" font-size="10">einen reibungslosen Start in der Saison</text>
  </g>

  <!-- Right Case: Hoang Dung -->
  <g transform="translate(372, 112)">
    <rect width="304" height="344" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="44" rx="10" fill="#FF6600"/>
    <text x="16" y="20" fill="#FFFFFF" font-size="13" font-weight="700">Fall 2: Trần Thị Hoàng Dung</text>
    <text x="16" y="36" fill="#FFEDD5" font-size="11">Zahnmedizinische Fachangestellte (ZFA)</text>

    <text x="16" y="68" fill="#9A3412" font-size="12" font-weight="700">Berufsschule:</text>
    <text x="16" y="86" fill="#7C2D12" font-size="11">Willy-Hellpach-Schule Heidelberg</text>

    <text x="16" y="114" fill="#9A3412" font-size="12" font-weight="700">Dokumentierte Meilensteine:</text>
    <text x="16" y="136" fill="#334155" font-size="11">✓ ZFA-Ausbildungsvertrag &amp; Vorabstimmung</text>
    <text x="28" y="152" fill="#334155" font-size="11">der Bundesagentur für Arbeit</text>
    <text x="16" y="176" fill="#334155" font-size="11">✓ Schriftliche Schulbestätigung über flexiblen/</text>
    <text x="28" y="192" fill="#334155" font-size="11">verspäteten Ausbildungsbeginn</text>
    <text x="16" y="216" fill="#334155" font-size="11">✓ Visumerteilung, Unterkunft &amp; Anreiseplan</text>
    <text x="16" y="240" fill="#334155" font-size="11">✓ Strukturierte Übergabe an die Zahnarztpraxis</text>

    <rect x="16" y="268" width="272" height="58" rx="6" fill="#FFFFFF" stroke="#FDBA74"/>
    <text x="152" y="290" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">Praxis-Takeaway für Zahnarztpraxen:</text>
    <text x="152" y="308" text-anchor="middle" fill="#7C2D12" font-size="10">Auch unterjährige Einstiege gelingen durch</text>
    <text x="152" y="321" text-anchor="middle" fill="#7C2D12" font-size="10">saubere Abstimmung mit der Berufsschule</text>
  </g>

  <rect x="44" y="472" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="494" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Beide Fälle belegen: DMF begleitet jeden Einzelfall mit echter Akten- und Behördendisziplin</text>
</svg>""",

    # 142: DMF Campus-Leben, Gemeinschaft & 3-Jahres-Bleibequote
    "dmf-campus-leben-gemeinschaft-retention-vietnam.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">DMF Campus-Kultur &amp; Auswirkung auf die Ausbildungs-Bleibequote</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Warum soziale Einbindung vor der Ausreise das Heimweh- und Abbruchrisiko in Deutschland senkt</text>

  <!-- 3 Pillars of Campus Culture -->
  <g transform="translate(44, 112)">
    <rect width="198" height="205" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="198" height="36" rx="10" fill="#003366"/>
    <text x="99" y="23" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">1. Verbindliche Alltagsdisziplin</text>
    <text x="14" y="60" fill="#334155" font-size="11">• Pünktlichkeit im 5-Tage-Kurs</text>
    <text x="14" y="82" fill="#334155" font-size="11">• Feste Hausaufgaben- &amp; Prüfroutinen</text>
    <text x="14" y="104" fill="#334155" font-size="11">• Ordnung &amp; Teamverantwortung</text>
    <text x="14" y="126" fill="#334155" font-size="11">• Transparente Lernstandberichte</text>
    <rect x="14" y="150" width="170" height="40" rx="6" fill="#EFF6FF"/>
    <text x="99" y="174" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">Basis für deutsche Arbeitsmoral</text>
  </g>

  <g transform="translate(261, 112)">
    <rect width="198" height="205" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <rect width="198" height="36" rx="10" fill="#FF6600"/>
    <text x="99" y="23" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">2. „Dorf der Deutschland-Azubis“</text>
    <text x="14" y="60" fill="#7C2D12" font-size="11">• Tết-Fest &amp; Weihnachtsfeiern</text>
    <text x="14" y="82" fill="#7C2D12" font-size="11">• Open Days, Uni Fair &amp; Sporttage</text>
    <text x="14" y="104" fill="#7C2D12" font-size="11">• Feierliche Visa-Übergaben</text>
    <text x="14" y="126" fill="#7C2D12" font-size="11">• Kohorten-Zusammenhalt (K1–K58)</text>
    <rect x="14" y="150" width="170" height="40" rx="6" fill="#FFEDD5"/>
    <text x="99" y="174" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">Starke Peer-Group gegen Einsamkeit</text>
  </g>

  <g transform="translate(478, 112)">
    <rect width="198" height="205" rx="10" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
    <rect width="198" height="36" rx="10" fill="#15803D"/>
    <text x="99" y="23" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">3. Alumni-Netzwerk in DE</text>
    <text x="14" y="60" fill="#14532D" font-size="11">• Erfahrungsaustausch mit Azubis,</text>
    <text x="22" y="76" fill="#14532D" font-size="11">die bereits in Deutschland leben</text>
    <text x="14" y="98" fill="#14532D" font-size="11">• Gegenseitige Hilfe beim Einleben</text>
    <text x="14" y="120" fill="#14532D" font-size="11">• Einbindung der Eltern in Vietnam</text>
    <rect x="14" y="150" width="170" height="40" rx="6" fill="#DCFCE7"/>
    <text x="99" y="174" text-anchor="middle" fill="#15803D" font-size="11" font-weight="700">Langfristige Bindung an Betrieb</text>
  </g>

  <!-- Impact Box -->
  <g transform="translate(44, 336)">
    <rect width="632" height="122" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="20" y="28" fill="#003366" font-size="13" font-weight="700">Warum Gemeinschaft in Vietnam über den Erfolg in der deutschen Probezeit entscheidet:</text>
    <text x="20" y="52" fill="#334155" font-size="11">1. Wer 8 bis 14 Monate lang gemeinsam an der DMF-Akademie lernt, baut ein stabiles soziales Sicherheitsnetz auf.</text>
    <text x="20" y="74" fill="#334155" font-size="11">2. Bei Tandem-Platzierungen (2 Azubis im selben Betrieb/Ort) unterstützen sich die Kandidaten im Alltag gegenseitig.</text>
    <text x="20" y="96" fill="#334155" font-size="11">3. Deutsche Werte wie Direktheit, Pünktlichkeit und Eigeninitiative werden schon im Campus-Alltag eingeübt.</text>
  </g>

  <rect x="44" y="472" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="494" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Ergebnis: Sozial gefestigte Persönlichkeiten statt isolierter Einzelkämpfer im ersten Lehrjahr</text>
</svg>""",

    # 143: Das 5-Schritte-Kooperationsmodell für deutsche Arbeitgeber mit DMF Talents
    "dmf-kooperationsmodell-5-schritte-arbeitgeber.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="18" font-weight="700">In 5 Schritten zur erfolgreichen Besetzung mit DMF Talents</text>
  <text x="44" y="75" fill="#CBD5E1" font-size="12">Transparenter Kooperationsablauf für deutsche Ausbildungsbetriebe, Kliniken, Hotels &amp; Industrie</text>

  <!-- 5 Horizontal Process Bars -->
  <g transform="translate(44, 110)">
    <rect width="632" height="62" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="128" height="62" rx="8" fill="#003366"/>
    <text x="64" y="28" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Schritt 1</text>
    <text x="64" y="46" text-anchor="middle" fill="#CBD5E1" font-size="10">Woche 1</text>
    <text x="146" y="25" fill="#003366" font-size="13" font-weight="700">Unverbindliches Erstgespräch &amp; Anforderungsprofil</text>
    <text x="146" y="45" fill="#475569" font-size="11">Abstimmung mit Umit Elezov (DE) oder Achim Betticher (VN): Ausbildungsberuf, Starttermin, Vergütung, Wohnraum</text>
  </g>

  <g transform="translate(44, 182)">
    <rect width="632" height="62" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <rect width="128" height="62" rx="8" fill="#FF6600"/>
    <text x="64" y="28" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Schritt 2</text>
    <text x="64" y="46" text-anchor="middle" fill="#FFEDD5" font-size="10">Woche 2</text>
    <text x="146" y="25" fill="#9A3412" font-size="13" font-weight="700">Vorauswahl &amp; Entscheidungsfähiges Kandidaten-Dossier</text>
    <text x="146" y="45" fill="#7C2D12" font-size="11">Sie erhalten 2–3 geprüfte Profile inkl. deutschem CV, ehrlicher Spracheinschätzung &amp; 60–90s Vorstellungsvideo</text>
  </g>

  <g transform="translate(44, 254)">
    <rect width="632" height="62" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="128" height="62" rx="8" fill="#003366"/>
    <text x="64" y="28" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Schritt 3</text>
    <text x="64" y="46" text-anchor="middle" fill="#CBD5E1" font-size="10">Woche 3</text>
    <text x="146" y="25" fill="#003366" font-size="13" font-weight="700">Persönliches Video-Interview &amp; Auswahlentscheidung</text>
    <text x="146" y="45" fill="#475569" font-size="11">Direktes Kennenlernen per Zoom/Teams; Moderation bei Bedarf durch DMF; transparente Rückmeldung</text>
  </g>

  <g transform="translate(44, 326)">
    <rect width="632" height="62" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="128" height="62" rx="8" fill="#334155"/>
    <text x="64" y="28" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Schritt 4</text>
    <text x="64" y="46" text-anchor="middle" fill="#CBD5E1" font-size="10">Monat 1–3</text>
    <text x="146" y="25" fill="#003366" font-size="13" font-weight="700">Vertrag, Behördenmanagement (IHK/BA/§ 81a) &amp; Visum</text>
    <text x="146" y="45" fill="#475569" font-size="11">DMF bereitet EzB, Ausbildungsplan, Schulanmeldung &amp; Visumakte vor; parallel läuft die B2-/Praxisvorbereitung</text>
  </g>

  <g transform="translate(44, 398)">
    <rect width="632" height="62" rx="8" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/>
    <rect width="128" height="62" rx="8" fill="#15803D"/>
    <text x="64" y="28" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Schritt 5</text>
    <text x="64" y="46" text-anchor="middle" fill="#DCFCE7" font-size="10">Ab Einreise</text>
    <text x="146" y="25" fill="#166534" font-size="13" font-weight="700">Flughafenabholung, 30-Tage-Onboarding &amp; 3-Jahres-Begleitung</text>
    <text x="146" y="45" fill="#14532D" font-size="11">Empfang in Deutschland, SIM, Wohnungsübergabe, Bürgeramt, Bankkonto, Krankenkasse &amp; Probezeit-Betreuung</text>
  </g>

  <rect x="44" y="472" width="632" height="34" rx="6" fill="#003366"/>
  <text x="360" y="494" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">Direktkontakt: Herr Umit Elezov (+49 174 9015811) • Herr Achim Betticher (+84 855 070773) • contact@dmf-talents.de</text>
</svg>""",
}


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, content in SVGS.items():
        path = OUT_DIR / name
        path.write_text(content.strip() + "\n", encoding="utf-8")
        print(f"OK: {name} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
