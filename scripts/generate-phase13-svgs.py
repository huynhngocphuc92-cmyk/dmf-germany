#!/usr/bin/env python3
"""
Generate 15 bespoke vector SVG diagrams for Phase 13 GEO Flagship Blog Articles (Posts 159–173).
Each SVG uses a 720x540 viewBox, DMF corporate palette (Navy #003366, Orange #FF6600, Slate #475569),
100% formal German text (zero du-forms), and strict XML validation.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path

OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")

INFORMAL_GERMAN_RE = re.compile(
    r"\b(du|dich|dir|dein|deine|deinem|deinen|deiner|deines|euch|euer|eure|eurem|euren|eures)\b",
    re.IGNORECASE,
)


def header_block(title: str, subtitle: str) -> str:
    return (
        f'  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>\n'
        f'  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>\n'
        f'  <rect x="20" y="20" width="680" height="72" rx="12" fill="#003366"/>\n'
        f'  <text x="44" y="50" fill="#FFFFFF" font-size="16" font-weight="700">{title}</text>\n'
        f'  <text x="44" y="74" fill="#CBD5E1" font-size="11.5">{subtitle}</text>'
    )


def footer_block(text: str) -> str:
    return (
        f'  <rect x="44" y="472" width="632" height="36" rx="8" fill="#003366"/>\n'
        f'  <text x="360" y="494" text-anchor="middle" fill="#FFFFFF" font-size="10.5" font-weight="600">{text}</text>'
    )


SVGS: dict[str, str] = {
    # Post 159
    "dmf-p13-159-saison-15d-15a-14-beschaeftigungsmatrix.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Saisonkräfte aus Vietnam: § 15d, § 15a &amp; § 14 Abs. 2 BeschV im Vergleich",
    "Rechtssichere Abgrenzung für Gastronomie, Hotellerie, Logistik und Landwirtschaft (Stand 2027)"
)}

  <!-- Top Decision Banner -->
  <rect x="44" y="106" width="632" height="32" rx="6" fill="#F1F5F9" stroke="#CBD5E1"/>
  <text x="360" y="126" text-anchor="middle" fill="#003366" font-size="12" font-weight="700">Branchen- &amp; Rechtsprüfung: Welcher ZAV-Weg gilt für vietnamesische Staatsangehörige?</text>

  <!-- Card 1: § 15d BeschV -->
  <g transform="translate(44, 150)">
    <rect width="202" height="196" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="202" height="40" rx="10" fill="#003366"/>
    <text x="101" y="18" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">§ 19c i. V. m. § 15d BeschV</text>
    <text x="101" y="33" text-anchor="middle" fill="#CBD5E1" font-size="10">Kurzzeitige Beschäftigung</text>
    <text x="12" y="60" fill="#003366" font-size="11" font-weight="700">Branchen (für Vietnam offen):</text>
    <text x="12" y="76" fill="#475569" font-size="10.5">• Gastronomie &amp; Hotellerie</text>
    <text x="12" y="92" fill="#475569" font-size="10.5">• Systemgastronomie &amp; Logistik</text>
    <text x="12" y="114" fill="#003366" font-size="11" font-weight="700">Dauer &amp; Kontingent:</text>
    <text x="12" y="130" fill="#475569" font-size="10.5">• Max. 8 Mon. in 12 Monaten</text>
    <text x="12" y="146" fill="#475569" font-size="10.5">• 25.000/Jahr bundesweit</text>
    <rect x="12" y="160" width="178" height="24" rx="5" fill="#003366"/>
    <text x="101" y="176" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="700">Tarifbindung (§ 3/5 TVG) Pflicht</text>
  </g>

  <!-- Card 2: § 15a BeschV -->
  <g transform="translate(259, 150)">
    <rect width="202" height="196" rx="10" fill="#F8FAFC" stroke="#475569" stroke-width="1.5"/>
    <rect width="202" height="40" rx="10" fill="#475569"/>
    <text x="101" y="18" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">§ 15a BeschV</text>
    <text x="101" y="33" text-anchor="middle" fill="#E2E8F0" font-size="10">Klassische Saisonarbeit</text>
    <text x="12" y="60" fill="#334155" font-size="11" font-weight="700">Branchen:</text>
    <text x="12" y="76" fill="#475569" font-size="10.5">• Landwirtschaft, Gartenbau</text>
    <text x="12" y="92" fill="#475569" font-size="10.5">• Obst-, Gemüse- &amp; Weinbau</text>
    <text x="12" y="114" fill="#334155" font-size="11" font-weight="700">Status für Vietnam:</text>
    <text x="12" y="130" fill="#9A3412" font-size="10.5" font-weight="700">• ZAV-Vermittlungsabsprache</text>
    <text x="12" y="146" fill="#475569" font-size="10.5">  erforderlich (max. 6 Mon.)</text>
    <rect x="12" y="160" width="178" height="24" rx="5" fill="#E2E8F0"/>
    <text x="101" y="176" text-anchor="middle" fill="#334155" font-size="10" font-weight="700">Aktuell ohne VN-Abkommen</text>
  </g>

  <!-- Card 3: § 14 Abs. 2 BeschV -->
  <g transform="translate(474, 150)">
    <rect width="202" height="196" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="202" height="40" rx="10" fill="#FF6600"/>
    <text x="101" y="18" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">§ 14 Abs. 2 BeschV</text>
    <text x="101" y="33" text-anchor="middle" fill="#FFEDD5" font-size="10">Ferienbeschäftigung</text>
    <text x="12" y="60" fill="#9A3412" font-size="11" font-weight="700">Branchen (für Vietnam offen):</text>
    <text x="12" y="76" fill="#475569" font-size="10.5">• Landwirtschaft &amp; Gartenbau</text>
    <text x="12" y="92" fill="#475569" font-size="10.5">• Gastronomie, Hotel, Logistik</text>
    <text x="12" y="114" fill="#9A3412" font-size="11" font-weight="700">Voraussetzungen:</text>
    <text x="12" y="130" fill="#475569" font-size="10.5">• Studierende (anabin H+)</text>
    <text x="12" y="146" fill="#475569" font-size="10.5">• Max. 90 Tage in 12 Mon.</text>
    <rect x="12" y="160" width="178" height="24" rx="5" fill="#FF6600"/>
    <text x="101" y="176" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="700">Keine Tarifbindung nötig</text>
  </g>

  <!-- Employer Checklist Box -->
  <g transform="translate(44, 360)">
    <rect width="632" height="98" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="16" y="22" fill="#003366" font-size="12" font-weight="700">Zwingende Arbeitgeberpflichten im Überblick (ZAV-Vorabzustimmung &amp; Zoll-Compliance 2027):</text>
    <text x="16" y="44" fill="#475569" font-size="11">✓ Echte Tarifbindung (§ 3 oder § 5 TVG) &amp; mind. 30 Std./Woche bei § 15d BeschV (max. 10 Mon./Betrieb)</text>
    <text x="16" y="64" fill="#475569" font-size="11">✓ Vollständige Übernahme der Hin- und Rückreisekosten durch den Arbeitgeber bei § 15d Abs. 2 Nr. 3 BeschV</text>
    <text x="16" y="84" fill="#475569" font-size="11">✓ Lückenloser Mindestlohn 2027 (14,60 €/Std. nach § 1 MiLoG) &amp; Arbeitszeiterfassung (§ 17 MiLoG)</text>
  </g>

{footer_block("Für ganzjährigen Bedarf: Nachhaltige Alternative über § 16a (Ausbildung) oder § 18a AufenthG (Fachkraft)")}
</svg>""",

    # Post 160
    "dmf-p13-160-ferienjob-14-beschv-mindestlohn-2027.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Ferienbeschäftigung (§ 14 Abs. 2 BeschV) &amp; Lohn-Compliance 2027",
    "ZAV-Verfahrenskette sowie gesetzliche Grenzen für Mindestlohn (14,60 €) und Unterkunft (SvEV)"
)}

  <!-- Left Column: § 14 Abs. 2 Process -->
  <g transform="translate(44, 110)">
    <rect width="304" height="346" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="16" y="25" fill="#FFFFFF" font-size="12.5" font-weight="700">Verfahren: § 14 Abs. 2 BeschV (90 Tage)</text>

    <rect x="16" y="54" width="272" height="54" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="28" y="75" fill="#003366" font-size="11.5" font-weight="700">1. Hochschulstatus &amp; Alter prüfen</text>
    <text x="28" y="94" fill="#475569" font-size="10.5">Immatrikulation an anabin H+/H+/- (&lt; 35 J.)</text>

    <text x="152" y="122" text-anchor="middle" fill="#003366" font-size="12" font-weight="700">↓</text>

    <rect x="16" y="128" width="272" height="54" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="28" y="149" fill="#003366" font-size="11.5" font-weight="700">2. ZAV-Vermittlungsbestätigung</text>
    <text x="28" y="168" fill="#475569" font-size="10.5">Offizielle Semesterferien der Heimatuni belegen</text>

    <text x="152" y="196" text-anchor="middle" fill="#003366" font-size="12" font-weight="700">↓</text>

    <rect x="16" y="202" width="272" height="54" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="28" y="223" fill="#003366" font-size="11.5" font-weight="700">3. Schengen-Visum (C-Visum)</text>
    <text x="28" y="242" fill="#475569" font-size="10.5">Zweckgebunden für bis zu 90 Tage in 12 Mon.</text>

    <text x="152" y="270" text-anchor="middle" fill="#003366" font-size="12" font-weight="700">↓</text>

    <rect x="16" y="276" width="272" height="54" rx="8" fill="#F1F5F9" stroke="#003366"/>
    <text x="28" y="297" fill="#003366" font-size="11.5" font-weight="700">4. Einsatz &amp; Nachweispflicht vor Ort</text>
    <text x="28" y="316" fill="#475569" font-size="10.5">Arbeitsvertrag, ZAV-Beleg &amp; Stundenzettel (§ 17)</text>
  </g>

  <!-- Right Column: 2027 Wage & Housing Compliance -->
  <g transform="translate(372, 110)">
    <rect width="304" height="346" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="16" y="25" fill="#FFFFFF" font-size="12.5" font-weight="700">Lohn- &amp; Unterkunftsgrenzen 2027</text>

    <rect x="16" y="54" width="272" height="62" rx="8" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="28" y="74" fill="#9A3412" font-size="12" font-weight="700">Mindestlohn ab 01.01.2027: 14,60 €/Std.</text>
    <text x="28" y="92" fill="#475569" font-size="10.5">Zwingend brutto in jeder geleisteten Stunde</text>
    <text x="28" y="107" fill="#475569" font-size="10.5">(§ 1, § 20 MiLoG — auch bei Stück-/Akkordlohn)</text>

    <rect x="16" y="128" width="272" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="28" y="148" fill="#003366" font-size="11" font-weight="700">Max. Unterkunftsanrechnung (SvEV 2027)</text>
    <text x="28" y="167" fill="#475569" font-size="10">Basis: § 107 Abs. 2 GewO i. V. m. SvEV 2027</text>
    <text x="28" y="186" fill="#334155" font-size="10">• Alleinbelegung: max. 289,00 €/Monat</text>
    <text x="28" y="203" fill="#334155" font-size="10">• 2 Beschäftigte: max. 173,40 €/Monat</text>
    <text x="28" y="220" fill="#334155" font-size="10">• 3 Beschäftigte: 144,50 € | &gt;3 Pers.: 115,60 €</text>
    <text x="28" y="235" fill="#475569" font-size="9.5">Qualitätsmindeststandard gemäß ASR A4.4 Pflicht</text>

    <rect x="16" y="254" width="272" height="76" rx="8" fill="#FFFFFF" stroke="#475569"/>
    <text x="28" y="274" fill="#003366" font-size="11" font-weight="700">Pfändungsfreigrenze &amp; Arbeitszeit</text>
    <text x="28" y="293" fill="#475569" font-size="10">• § 850c ZPO: Unpfändbarer Barlohn bleibt frei</text>
    <text x="28" y="310" fill="#475569" font-size="10">• § 17 MiLoG: Beginn, Ende &amp; Dauer (7 Tage)</text>
    <text x="28" y="324" fill="#475569" font-size="10">• § 3 ArbZG: Max. 8 Std. (Ausnahme 10 Std./Tag)</text>
  </g>

{footer_block("Zollprüfung (FKS): Trennung von Bruttolohn, SvEV-Sachbezug &amp; Arbeitszeitkonto")}
</svg>""",

    # Post 161
    "dmf-p13-161-stammkraefte-wiederkehrer-uebergangspfad.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Stammkräfte-Wiederkehrer &amp; Übergangsrecht (§ 15d → § 16a / § 18a)",
    "Zwei rechtssichere strategische Pfade nach Ablauf des zeitlich befristeten Saisoneinsatzes"
)}

  <!-- Track 1: Wiederkehrer-Zyklus -->
  <g transform="translate(44, 110)">
    <rect width="632" height="122" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="632" height="32" rx="10" fill="#003366"/>
    <text x="16" y="21" fill="#FFFFFF" font-size="12" font-weight="700">Pfad A: Stammkräfte-Wiederkehrer-Zyklus (jährliche Wiederholung mit eingearbeitetem Pool)</text>

    <rect x="16" y="46" width="174" height="60" rx="8" fill="#FFFFFF" stroke="#003366"/>
    <text x="103" y="68" text-anchor="middle" fill="#003366" font-size="11.5" font-weight="700">Saison 1 in Deutschland</text>
    <text x="103" y="86" text-anchor="middle" fill="#475569" font-size="10">Max. 8 Mon. (§ 15d BeschV)</text>
    <text x="103" y="99" text-anchor="middle" fill="#475569" font-size="9.5">bzw. 90 Tage (§ 14 Abs. 2)</text>

    <text x="206" y="80" text-anchor="middle" fill="#003366" font-size="18" font-weight="700">→</text>

    <rect x="222" y="46" width="188" height="60" rx="8" fill="#FFFFFF" stroke="#475569"/>
    <text x="316" y="68" text-anchor="middle" fill="#334155" font-size="11.5" font-weight="700">Fristgerechte Ausreise</text>
    <text x="316" y="86" text-anchor="middle" fill="#475569" font-size="10">Rückkehr nach Vietnam vor</text>
    <text x="316" y="99" text-anchor="middle" fill="#475569" font-size="9.5">Visumablauf (Vertrauensbasis)</text>

    <text x="426" y="80" text-anchor="middle" fill="#003366" font-size="18" font-weight="700">→</text>

    <rect x="442" y="46" width="174" height="60" rx="8" fill="#F1F5F9" stroke="#003366"/>
    <text x="529" y="68" text-anchor="middle" fill="#003366" font-size="11.5" font-weight="700">Wiedereinreise Saison 2</text>
    <text x="529" y="86" text-anchor="middle" fill="#475569" font-size="10">Neues ZAV-Kontingent im</text>
    <text x="529" y="99" text-anchor="middle" fill="#475569" font-size="9.5">Folgejahr (0 Einarbeitungszeit)</text>
  </g>

  <!-- Middle Legal Rule Bar -->
  <rect x="44" y="246" width="632" height="44" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
  <text x="360" y="265" text-anchor="middle" fill="#9A3412" font-size="11.5" font-weight="700">Wichtige Gesetzesgrenze: Kein direkter Zweckwechsel im Inland aus § 15d oder § 14 Abs. 2 BeschV</text>
  <text x="360" y="281" text-anchor="middle" fill="#7C2D12" font-size="10.5">Ein langfristiger Wechsel in § 16a oder § 18a AufenthG erfolgt regulär über Rückkehr und nationales D-Visum</text>

  <!-- Track 2: Legal Upgrade Bridge -->
  <g transform="translate(44, 304)">
    <rect width="632" height="152" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="632" height="32" rx="10" fill="#FF6600"/>
    <text x="16" y="21" fill="#FFFFFF" font-size="12" font-weight="700">Pfad B: Legal Upgrade Bridge (Vom bewährten Saisonhelfer zur festen Fachkraft oder Azubi)</text>

    <rect x="16" y="48" width="136" height="86" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="84" y="68" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">1. Praxistest</text>
    <text x="84" y="86" text-anchor="middle" fill="#475569" font-size="10">Bewährung im</text>
    <text x="84" y="100" text-anchor="middle" fill="#475569" font-size="10">Saisonbetrieb</text>
    <text x="84" y="118" text-anchor="middle" fill="#9A3412" font-size="9.5" font-weight="700">Bindungsangebot</text>

    <text x="162" y="94" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">→</text>

    <rect x="172" y="48" width="142" height="86" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="243" y="68" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">2. Qualifizierung</text>
    <text x="243" y="86" text-anchor="middle" fill="#475569" font-size="10">Ausreise + B1/B2</text>
    <text x="243" y="100" text-anchor="middle" fill="#475569" font-size="10">in Vietnam sowie</text>
    <text x="243" y="118" text-anchor="middle" fill="#475569" font-size="9.5">BQFG / Ausbildungsvertrag</text>

    <text x="324" y="94" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">→</text>

    <rect x="334" y="48" width="136" height="86" rx="8" fill="#FFFFFF" stroke="#003366"/>
    <text x="402" y="68" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">3. § 81a Verfahren</text>
    <text x="402" y="86" text-anchor="middle" fill="#475569" font-size="10">Beschleunigte</text>
    <text x="402" y="100" text-anchor="middle" fill="#475569" font-size="10">Vorabzustimmung</text>
    <text x="402" y="118" text-anchor="middle" fill="#003366" font-size="9.5" font-weight="700">D-Visum (Hanoi/HCMC)</text>

    <text x="480" y="94" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">→</text>

    <rect x="490" y="48" width="126" height="86" rx="8" fill="#003366"/>
    <text x="553" y="68" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="700">4. Langfrist-Titel</text>
    <text x="553" y="88" text-anchor="middle" fill="#CBD5E1" font-size="10">§ 16a (Ausbildung)</text>
    <text x="553" y="104" text-anchor="middle" fill="#CBD5E1" font-size="10">oder § 18a / § 16d</text>
    <text x="553" y="122" text-anchor="middle" fill="#FFEDD5" font-size="9.5" font-weight="700">Perspektive § 18c</text>
  </g>

{footer_block("Planungssicherheit: Fristgerechte Ausreise sichert Wiederkehrer &amp; spätere § 81a-Anträge")}
</svg>""",

    # Post 162
    "dmf-p13-162-tvoed-avr-pflege-eingruppierungsstufen.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "TVöD-Pflege, TVAöD &amp; AVR Caritas/Diakonie: Eingruppierung (2026/2027)",
    "Vergütungsstufen von der Anerkennungsphase (§ 16d) bis zur Berufsurkunde (§ 18a) sowie § 72 SGB XI"
)}

  <!-- Top Progression Pipeline -->
  <g transform="translate(44, 108)">
    <rect x="0" y="0" width="186" height="92" rx="8" fill="#F8FAFC" stroke="#475569" stroke-width="1.5"/>
    <rect x="0" y="0" width="186" height="28" rx="8" fill="#475569"/>
    <text x="93" y="18" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="700">Stufe 1: Anerkennung (§ 16d)</text>
    <text x="12" y="46" fill="#003366" font-size="11" font-weight="700">Pflegehelfer / Anpassung</text>
    <text x="12" y="64" fill="#475569" font-size="10.5">• TVöD-P: P5 (ab 2.907,18 €)</text>
    <text x="12" y="80" fill="#475569" font-size="10.5">• TVöD-P: P6 (ab 3.012,49 €)</text>

    <text x="204" y="52" text-anchor="middle" fill="#003366" font-size="18" font-weight="700">→</text>

    <rect x="222" y="0" width="186" height="92" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect x="222" y="0" width="186" height="28" rx="8" fill="#FF6600"/>
    <text x="315" y="18" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="700">Meilenstein: Berufsurkunde</text>
    <text x="234" y="46" fill="#9A3412" font-size="11" font-weight="700">PflBG &amp; Sprache B2</text>
    <text x="234" y="64" fill="#475569" font-size="10.5">• B2 Pflege / Fachsprache</text>
    <text x="234" y="80" fill="#475569" font-size="10.5">• Kenntnisprüfung / Lehrgang</text>

    <text x="426" y="52" text-anchor="middle" fill="#003366" font-size="18" font-weight="700">→</text>

    <rect x="444" y="0" width="188" height="92" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect x="444" y="0" width="188" height="28" rx="8" fill="#003366"/>
    <text x="538" y="18" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="700">Stufe 2: Fachkraft (§ 18a)</text>
    <text x="456" y="46" fill="#003366" font-size="11" font-weight="700">Dreijährige Fachkraft</text>
    <text x="456" y="64" fill="#475569" font-size="10.5">• P7 (ab 3.510,30 € St. 2)</text>
    <text x="456" y="80" fill="#475569" font-size="10.5">• P8 Intensiv (ab 3.701,21 €)</text>
  </g>

  <!-- Lower Left: Tarifwerke Comparison -->
  <g transform="translate(44, 214)">
    <rect width="304" height="242" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#003366"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">Öffentliche &amp; kirchliche Tarifwerke</text>

    <text x="16" y="56" fill="#003366" font-size="11.5" font-weight="700">TVAöD-Pflege (Azubis § 16a, ab 05/2026):</text>
    <text x="16" y="73" fill="#475569" font-size="10.5">1.490,69 € / 1.552,07 € / 1.653,38 € + 400 € Prämie</text>

    <line x1="16" y1="86" x2="288" y2="86" stroke="#CBD5E1"/>
    <text x="16" y="106" fill="#003366" font-size="11.5" font-weight="700">AVR Caritas (Anl. 31/32, Reform 01/2027):</text>
    <text x="16" y="123" fill="#475569" font-size="10.5">• Einstieg Fachkraft in P7 Stufe 2 (Stufe 1 unbesetzt)</text>
    <text x="16" y="139" fill="#475569" font-size="10.5">• P8 (ab 3.701,21 €) zzgl. Pflege-/Schichtzulagen</text>

    <line x1="16" y1="152" x2="288" y2="152" stroke="#CBD5E1"/>
    <text x="16" y="172" fill="#003366" font-size="11.5" font-weight="700">AVR Diakonie Deutschland (AVR.DD):</text>
    <text x="16" y="189" fill="#475569" font-size="10.5">• EG 4 / EG 5 während Anpassungsqualifizierung</text>
    <text x="16" y="205" fill="#475569" font-size="10.5">• EG 7 (3.874–4.546 €) / EG 8 (4.242–5.004 €)</text>
    <text x="16" y="226" fill="#334155" font-size="10" font-weight="700">Stufenlaufzeit: Berufspraxis anrechenbar</text>
  </g>

  <!-- Lower Right: Private Träger & § 72 SGB XI -->
  <g transform="translate(372, 214)">
    <rect width="304" height="242" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <rect width="304" height="34" rx="10" fill="#FF6600"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">Private Träger &amp; § 72 SGB XI-Ausnahme</text>

    <text x="16" y="56" fill="#9A3412" font-size="11.5" font-weight="700">Ausnahme im § 16d Abs. 3 S. 1 AufenthG:</text>
    <text x="16" y="74" fill="#475569" font-size="10.5">• Nach § 72 SGB XI zugelassene Pflegebetriebe</text>
    <text x="16" y="90" fill="#475569" font-size="10.5">  nutzen § 16d (i. V. m. § 2a BeschV) auch ohne</text>
    <text x="16" y="106" fill="#475569" font-size="10.5">  eigene Tarifbindung (§ 3 / § 5 TVG)</text>

    <line x1="16" y1="120" x2="288" y2="120" stroke="#FDBA74"/>
    <text x="16" y="140" fill="#9A3412" font-size="11.5" font-weight="700">Tariftreue-Pflicht (§ 72 Abs. 3a/3b SGB XI):</text>
    <text x="16" y="158" fill="#475569" font-size="10.5">• Zahlung des regional üblichen Entgeltniveaus</text>
    <text x="16" y="174" fill="#475569" font-size="10.5">• Voraussetzung für Versorgungsvertrag &amp;</text>
    <text x="16" y="190" fill="#475569" font-size="10.5">  Refinanzierung über die Pflegekassen</text>

    <rect x="16" y="204" width="272" height="26" rx="5" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="152" y="221" text-anchor="middle" fill="#9A3412" font-size="9" font-weight="700">Nicht-§-72-Betriebe: Tarifbindung bei § 16d III Pflicht</text>
  </g>

{footer_block("ZAV-Prüfung (§ 39 AufenthG): Tarifliche bzw. ortsübliche Vergütung sichert Zustimmung")}
</svg>""",

    # Post 163
    "dmf-p13-163-3-jahres-tco-vollkostenvergleich.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "3-Jahres-Vollkostenrechnung (TCO): Direktrekrutierung vs. Alternativen",
    "Kumulierte Personalbeschaffungs- &amp; Mehrkosten über 36 Monate (Modellrechnung für CFO &amp; HR)"
)}

  <!-- Left Chart Area: Cumulative 36-Month Cost Comparison -->
  <g transform="translate(44, 108)">
    <rect width="388" height="348" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="16" y="24" fill="#003366" font-size="12" font-weight="700">Kumulierte Mehrkosten über 36 Monate (Modellwerte)</text>

    <!-- Axes -->
    <line x1="56" y1="276" x2="366" y2="276" stroke="#475569" stroke-width="1.5"/>
    <line x1="56" y1="54" x2="56" y2="276" stroke="#475569" stroke-width="1.5"/>

    <!-- Grid lines -->
    <line x1="56" y1="220" x2="366" y2="220" stroke="#E2E8F0" stroke-dasharray="3,3"/>
    <line x1="56" y1="164" x2="366" y2="164" stroke="#E2E8F0" stroke-dasharray="3,3"/>
    <line x1="56" y1="108" x2="366" y2="108" stroke="#E2E8F0" stroke-dasharray="3,3"/>
    <line x1="56" y1="62" x2="366" y2="62" stroke="#E2E8F0" stroke-dasharray="3,3"/>

    <text x="50" y="280" text-anchor="end" fill="#475569" font-size="9.5">0 €</text>
    <text x="50" y="224" text-anchor="end" fill="#475569" font-size="9.5">15 T€</text>
    <text x="50" y="168" text-anchor="end" fill="#475569" font-size="9.5">30 T€</text>
    <text x="50" y="112" text-anchor="end" fill="#475569" font-size="9.5">45 T€</text>
    <text x="50" y="66" text-anchor="end" fill="#475569" font-size="9.5">60 T€+</text>

    <!-- X-Axis labels -->
    <text x="56" y="294" text-anchor="middle" fill="#475569" font-size="9.5">M0</text>
    <text x="108" y="294" text-anchor="middle" fill="#475569" font-size="9.5">M6</text>
    <text x="160" y="294" text-anchor="middle" fill="#475569" font-size="9.5">M12</text>
    <text x="263" y="294" text-anchor="middle" fill="#475569" font-size="9.5">M24</text>
    <text x="364" y="294" text-anchor="middle" fill="#475569" font-size="9.5">M36</text>

    <!-- Zeitarbeit Line (+18k-25k/yr -> ~54k-65k at M36) -->
    <polyline points="56,276 108,236 160,196 263,128 364,66" fill="none" stroke="#FF6600" stroke-width="3"/>
    <circle cx="364" cy="66" r="4" fill="#FF6600"/>
    <text x="295" y="76" text-anchor="end" fill="#9A3412" font-size="10" font-weight="700">Zeitarbeit: +35–65 T€</text>

    <!-- Headhunter + Vakanz Line -->
    <polyline points="56,222 108,200 160,188 263,176 364,164" fill="none" stroke="#475569" stroke-width="2.5" stroke-dasharray="6,4"/>
    <circle cx="364" cy="164" r="3.5" fill="#475569"/>
    <text x="358" y="154" text-anchor="end" fill="#334155" font-size="10" font-weight="700">Headhunter (20–33 % + Vakanz)</text>

    <!-- DMF Direktrekrutierung Line (flat after initial milestone) -->
    <polyline points="56,238 108,234 160,234 263,234 364,234" fill="none" stroke="#003366" stroke-width="3.5"/>
    <circle cx="108" cy="234" r="4.5" fill="#003366"/>
    <circle cx="364" cy="234" r="4" fill="#003366"/>
    <text x="358" y="254" text-anchor="end" fill="#003366" font-size="10" font-weight="700">DMF Direkt (§ 18a): 0 € Laufaufschlag</text>

    <!-- Break-even callout -->
    <rect x="74" y="306" width="292" height="28" rx="6" fill="#003366"/>
    <text x="220" y="324" text-anchor="middle" fill="#FFFFFF" font-size="10.5" font-weight="700">Break-Even typischerweise nach 4–7 Monaten</text>
  </g>

  <!-- Right Column: CFO KPI Cards -->
  <g transform="translate(446, 108)">
    <rect width="230" height="108" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="12" y="24" fill="#003366" font-size="11.5" font-weight="700">1. DMF Direktrekrutierung</text>
    <text x="12" y="44" fill="#475569" font-size="10">• Einmalige Meilenstein-Pauschale</text>
    <text x="12" y="61" fill="#475569" font-size="10">• § 81a (411 €) + Visum (75 €) + Kammer</text>
    <text x="12" y="78" fill="#475569" font-size="10">• &gt; 95 % Verbleibquote (3 Jahre)</text>
    <text x="12" y="95" fill="#003366" font-size="10" font-weight="700">• Voll absetzbar (§ 4 Abs. 4 EStG)</text>

    <rect y="120" width="230" height="108" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <text x="12" y="144" fill="#9A3412" font-size="11.5" font-weight="700">2. Zeitarbeit (§ 1 Abs. 1b AÜG)</text>
    <text x="12" y="164" fill="#475569" font-size="10">• 18.000–25.000 €+ Mehrkosten/Jahr</text>
    <text x="12" y="181" fill="#475569" font-size="10">• Max. 18 Mon. Überlassungsdauer</text>
    <text x="12" y="198" fill="#475569" font-size="10">• Kein nachhaltiger Team-Aufbau</text>
    <text x="12" y="215" fill="#9A3412" font-size="10" font-weight="700">• § 40 AufenthG: Keine Neu-Überlassung</text>

    <rect y="240" width="230" height="108" rx="10" fill="#F1F5F9" stroke="#475569" stroke-width="1.5"/>
    <text x="12" y="264" fill="#334155" font-size="11.5" font-weight="700">3. Inlands-Headhunter</text>
    <text x="12" y="284" fill="#475569" font-size="10">• 20–33 % vom Jahresbruttogehalt</text>
    <text x="12" y="301" fill="#475569" font-size="10">• Lange Vakanzkosten (150–300 €/Tag)</text>
    <text x="12" y="318" fill="#475569" font-size="10">• Hohes Abwerberisiko im Inland</text>
    <text x="12" y="335" fill="#334155" font-size="10" font-weight="700">• DMF: 100 % Employer-Pays (§ 296a)</text>
  </g>

{footer_block("Eigene Betriebsdaten prüfen: dmf-talents.de/referenzen &amp; dmf-talents.de/roi-rechner")}
</svg>""",

    # Post 164
    "dmf-p13-164-aevo-bbig-ausbildungsbefugnis-verkuerzung.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "AEVO, Ausbildungsbefugnis (§§ 27–30 BBiG) &amp; Verkürzung (§ 8 BBiG)",
    "Rechtsgrundlagen für Ausbildungsbetriebe in IHK, Handwerk (HwO) und Pflege (PflAPrV)"
)}

  <!-- Left Column: Ausbildungsbefugnis -->
  <g transform="translate(44, 110)">
    <rect width="318" height="346" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="318" height="40" rx="10" fill="#003366"/>
    <text x="16" y="25" fill="#FFFFFF" font-size="12.5" font-weight="700">Säule 1: Ausbildungsbefugnis des Betriebs</text>

    <rect x="14" y="54" width="290" height="62" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="24" y="74" fill="#003366" font-size="11.5" font-weight="700">1. Eignung der Ausbildungsstätte (§ 27 BBiG)</text>
    <text x="24" y="92" fill="#475569" font-size="10.5">Einrichtung, Maschinen &amp; Fachkräftequote erfüllen</text>
    <text x="24" y="107" fill="#475569" font-size="10.5">den Ausbildungsrahmenplan der Kammer</text>

    <rect x="14" y="126" width="290" height="62" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="24" y="146" fill="#003366" font-size="11.5" font-weight="700">2. Persönliche &amp; fachliche Eignung (§§ 28–30)</text>
    <text x="24" y="164" fill="#475569" font-size="10.5">• IHK: Abschluss + Praxis + AEVO-Schein (§ 30 BBiG)</text>
    <text x="24" y="179" fill="#475569" font-size="10">• HWK: § 22b HwO (Meister IV ersetzt AEVO)</text>

    <rect x="14" y="198" width="290" height="68" rx="8" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="24" y="218" fill="#003366" font-size="11.5" font-weight="700">3. Praxisalltag: Ausbildungsbeauftragte</text>
    <text x="24" y="236" fill="#475569" font-size="10.5">• § 28 Abs. 3 BBiG: Fachkräfte dürfen im Alltag</text>
    <text x="24" y="251" fill="#475569" font-size="10.5">  unter Verantwortung des Ausbilders anleiten</text>

    <rect x="14" y="276" width="290" height="56" rx="8" fill="#F1F5F9" stroke="#003366"/>
    <text x="24" y="296" fill="#003366" font-size="11.5" font-weight="700">4. Sonderregel Pflege (§ 4 PflAPrV)</text>
    <text x="24" y="314" fill="#475569" font-size="10.5">300-Std.-Praxisanleiter + 10 % geplante Anleitung</text>
    <text x="24" y="326" fill="#9A3412" font-size="9.5" font-weight="700">(AEVO ersetzt in der Pflege keine Praxisanleitung)</text>
  </g>

  <!-- Right Column: Ausbildungsdauer & Verkürzung -->
  <g transform="translate(378, 110)">
    <rect width="298" height="346" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="298" height="40" rx="10" fill="#FF6600"/>
    <text x="16" y="25" fill="#FFFFFF" font-size="12.5" font-weight="700">Säule 2: Ausbildungsdauer &amp; Verkürzung</text>

    <rect x="14" y="54" width="270" height="106" rx="8" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="24" y="74" fill="#9A3412" font-size="11.5" font-weight="700">Verkürzung bei Start (§ 8 Abs. 1 BBiG)</text>
    <text x="24" y="93" fill="#475569" font-size="10.5">• Gemeinsamer Antrag bei IHK / HWK</text>
    <text x="24" y="110" fill="#475569" font-size="10.5">• Gründe: Abitur/Vorbildung oder Alter ≥ 21 J.</text>
    <text x="24" y="127" fill="#475569" font-size="10.5">• Umfang: 6 bis 12 Monate weniger</text>
    <text x="24" y="146" fill="#9A3412" font-size="10" font-weight="700">Empfehlung für § 16a: Sprachpuffer schützen</text>

    <rect x="14" y="172" width="270" height="96" rx="8" fill="#FFFFFF" stroke="#003366"/>
    <text x="24" y="192" fill="#003366" font-size="11.5" font-weight="700">Vorzeitige Zulassung (§ 45 Abs. 1 BBiG)</text>
    <text x="24" y="211" fill="#475569" font-size="10.5">• Nach guten Leistungen in Berufsschule &amp;</text>
    <text x="24" y="227" fill="#475569" font-size="10.5">  Zwischenprüfung / GAP Teil 1 beantragen</text>
    <text x="24" y="244" fill="#475569" font-size="10.5">• Bis 6 Monate frühere Abschlussprüfung</text>
    <text x="24" y="260" fill="#003366" font-size="10" font-weight="700">Ideal bei starker Praxis &amp; B2-Entwicklung</text>

    <rect x="14" y="280" width="270" height="52" rx="8" fill="#FFFFFF" stroke="#475569"/>
    <text x="24" y="300" fill="#334155" font-size="11" font-weight="700">Eintragung vor § 81a AufenthG</text>
    <text x="24" y="318" fill="#475569" font-size="10.5">Eintragung in das Verzeichnis (§ 34 BBiG)</text>
  </g>

{footer_block("Qualitätsgeprüfte Betriebe mit eingetragener Ausbildungsbefugnis beschleunigen das § 16a-Verfahren")}
</svg>""",

    # Post 165
    "chemikant-pharmakant-ihk-qualifikationspfad.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Chemikanten, Pharmakanten &amp; Produktionsfachkräfte Chemie (KldB 41312)",
    "Zwei IHK-Rekrutierungswege aus Vietnam: Duale Ausbildung (§ 16a) und Fachkraft (§ 18a / § 16d)"
)}

  <!-- Left Branch: § 16a -->
  <g transform="translate(44, 110)">
    <rect width="304" height="222" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="12" font-weight="700">Weg 1: Duale Ausbildung (§ 16a AufenthG)</text>
    <text x="16" y="60" fill="#003366" font-size="11.5" font-weight="700">Berufsbilder (BBiG / Regionale IHK):</text>
    <text x="16" y="79" fill="#475569" font-size="10.5">• Chemikant/-in (3,5 Jahre dual)</text>
    <text x="16" y="96" fill="#475569" font-size="10.5">• Pharmakant/-in (3,5 Jahre dual)</text>
    <text x="16" y="113" fill="#475569" font-size="10.5">• Produktionsfachkraft Chemie (2 Jahre)</text>
    <line x1="16" y1="126" x2="288" y2="126" stroke="#CBD5E1"/>
    <text x="16" y="146" fill="#003366" font-size="11.5" font-weight="700">Vorteile für Chemie- &amp; Pharmabetriebe:</text>
    <text x="16" y="165" fill="#475569" font-size="10.5">• Keine BQFG-Gleichwertigkeitsprüfung nötig</text>
    <text x="16" y="182" fill="#475569" font-size="10.5">• Systematische Einweisung in Anlagen &amp; GMP</text>
    <text x="16" y="199" fill="#475569" font-size="10.5">• B1/B2-Vorbereitung &amp; Naturwissenschaften</text>
  </g>

  <!-- Right Branch: § 18a / § 16d -->
  <g transform="translate(372, 110)">
    <rect width="304" height="222" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#FF6600"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="12" font-weight="700">Weg 2: Fachkraft (§ 18a / § 16d Abs. 3)</text>
    <text x="16" y="60" fill="#9A3412" font-size="11.5" font-weight="700">Anerkennung über IHK FOSA (Nürnberg):</text>
    <text x="16" y="79" fill="#475569" font-size="10.5">• Gleichwertigkeitsprüfung nach BQFG</text>
    <text x="16" y="96" fill="#475569" font-size="10.5">• § 18a bei voller Gleichwertigkeit vorab</text>
    <text x="16" y="113" fill="#475569" font-size="10.5">• § 16d Abs. 3 bei Teilanerkennung/Praxis</text>
    <line x1="16" y1="126" x2="288" y2="126" stroke="#FDBA74"/>
    <text x="16" y="146" fill="#9A3412" font-size="11.5" font-weight="700">Ingenieure (Chemie- &amp; Pharmatechnik):</text>
    <text x="16" y="165" fill="#475569" font-size="10.5">• B.Sc.-Abschluss über anabin (H+) / ZAB</text>
    <text x="16" y="182" fill="#475569" font-size="10.5">• Blaue Karte EU (§ 18g) oder § 18b AufenthG</text>
    <text x="16" y="199" fill="#475569" font-size="10.5">• Beschleunigung via § 81a AufenthG (411 €)</text>
  </g>

  <!-- Bottom 4 KldB 41312 Core Modules -->
  <g transform="translate(44, 346)">
    <rect width="632" height="112" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="16" y="24" fill="#003366" font-size="12" font-weight="700">4 betriebliche Qualitätsmodule (Vorprüfung &amp; Einarbeitung für KldB 41312):</text>

    <rect x="16" y="38" width="142" height="60" rx="6" fill="#FFFFFF" stroke="#003366"/>
    <text x="87" y="58" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">Prozessleittechnik</text>
    <text x="87" y="75" text-anchor="middle" fill="#475569" font-size="9.5">Steuerung, Destillation,</text>
    <text x="87" y="88" text-anchor="middle" fill="#475569" font-size="9.5">Probenahme &amp; Sensorik</text>

    <rect x="168" y="38" width="142" height="60" rx="6" fill="#FFFFFF" stroke="#003366"/>
    <text x="239" y="58" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">GMP &amp; Reinraum</text>
    <text x="239" y="75" text-anchor="middle" fill="#475569" font-size="9.5">Hygieneschleusen,</text>
    <text x="239" y="88" text-anchor="middle" fill="#475569" font-size="9.5">Protokollierung, Chargen</text>

    <rect x="320" y="38" width="142" height="60" rx="6" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="391" y="58" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">GefStoffV-Schutz</text>
    <text x="391" y="75" text-anchor="middle" fill="#475569" font-size="9.5">Sicherheitsdatenblätter,</text>
    <text x="391" y="88" text-anchor="middle" fill="#475569" font-size="9.5">PSA &amp; Ex-Schutz-Regeln</text>

    <rect x="472" y="38" width="144" height="60" rx="6" fill="#FFFFFF" stroke="#475569"/>
    <text x="544" y="58" text-anchor="middle" fill="#334155" font-size="11" font-weight="700">Schichtbetrieb</text>
    <text x="544" y="75" text-anchor="middle" fill="#475569" font-size="9.5">Vollkonti-Bereitschaft,</text>
    <text x="544" y="88" text-anchor="middle" fill="#475569" font-size="9.5">ÖPNV-Planung &amp; B1/B2</text>
  </g>

{footer_block("DMF Quality Gate: Vorprüfung chemisch-pharmazeutischer Grundlagen vor dem Interview")}
</svg>""",

    # Post 166
    "gesundheitshandwerk-hoerakustik-orthopaedie-pfad.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Gesundheitshandwerk: Hörakustiker &amp; Orthopädietechnik-Mechaniker",
    "Anlage A HwO (Meisterpflicht), überbetriebliche Fachschulen Lübeck / BUFA und Sprachziel B1+/B2"
)}

  <!-- Left Profession: Hörakustiker -->
  <g transform="translate(44, 110)">
    <rect width="304" height="232" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="16" y="19" fill="#FFFFFF" font-size="12" font-weight="700">Hörakustiker/-in (KldB 82532)</text>
    <text x="16" y="33" fill="#CBD5E1" font-size="10">Anlage A HwO • Meisterpräsenzpflicht</text>
    <text x="16" y="62" fill="#003366" font-size="11.5" font-weight="700">Ausbildung &amp; Überbetriebliche Schule:</text>
    <text x="16" y="80" fill="#475569" font-size="10.5">• 3 Jahre dual (§ 16a AufenthG) über örtl. HWK</text>
    <text x="16" y="97" fill="#475569" font-size="10.5">• Akademie für Hörakustik (afh) in Lübeck</text>
    <text x="16" y="120" fill="#003366" font-size="11.5" font-weight="700">Aufgaben &amp; Patientenkontakt:</text>
    <text x="16" y="138" fill="#475569" font-size="10.5">• Audiometrie, Hörsystem-Anpassung, Otoplastik</text>
    <text x="16" y="155" fill="#475569" font-size="10.5">• Empathische Beratung älterer Patientinnen</text>
    <rect x="16" y="176" width="272" height="42" rx="6" fill="#F1F5F9" stroke="#003366"/>
    <text x="152" y="194" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">Sprachziel: B2 für Patientenberatung</text>
    <text x="152" y="210" text-anchor="middle" fill="#475569" font-size="9.5">Start mit B1+ und gezieltem Fachwortschatz</text>
  </g>

  <!-- Right Profession: Orthopädietechnik -->
  <g transform="translate(372, 110)">
    <rect width="304" height="232" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="16" y="19" fill="#FFFFFF" font-size="12" font-weight="700">Orthopädietechnik-Mechaniker (82512)</text>
    <text x="16" y="33" fill="#FFEDD5" font-size="10">Anlage A HwO • Sanitätshaus &amp; Werkstatt</text>
    <text x="16" y="62" fill="#9A3412" font-size="11.5" font-weight="700">Ausbildung &amp; Überbetriebliche Schule:</text>
    <text x="16" y="80" fill="#475569" font-size="10.5">• 3 Jahre dual (§ 16a AufenthG) über örtl. HWK</text>
    <text x="16" y="97" fill="#475569" font-size="10.5">• Bundesfachschule (BUFA) in Dortmund</text>
    <text x="16" y="120" fill="#9A3412" font-size="11.5" font-weight="700">Aufgaben &amp; Fertigungstechnik:</text>
    <text x="16" y="138" fill="#475569" font-size="10.5">• Prothesen-, Orthesen- &amp; Hilfsmittelbau</text>
    <text x="16" y="155" fill="#475569" font-size="10.5">• 3D-Scan, Gipsabdruck &amp; Feinmechanik</text>
    <rect x="16" y="176" width="272" height="42" rx="6" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="152" y="194" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">Sprachziel: B1+ Werkstatt / B2 Klinik</text>
    <text x="152" y="210" text-anchor="middle" fill="#475569" font-size="9.5">Abstimmung mit Ärzten, Reha &amp; Patienten</text>
  </g>

  <!-- Bottom HWK Paths (§ 16a vs. § 16d / § 18a) -->
  <g transform="translate(44, 356)">
    <rect width="632" height="102" rx="10" fill="#F8FAFC" stroke="#475569" stroke-width="1.5"/>
    <text x="16" y="24" fill="#003366" font-size="12" font-weight="700">Zuwanderungspfade über die örtliche Handwerkskammer (HWK) &amp; § 81a AufenthG:</text>
    <text x="16" y="45" fill="#475569" font-size="11">• Weg A (§ 16a Ausbildung): Einstieg für naturwissenschaftlich affine Talente ohne BQFG-Verfahren</text>
    <text x="16" y="64" fill="#475569" font-size="11">• Weg B (§ 16d Abs. 3 / § 18a): Für mind. 2-jährige medizinisch-technische Abschlüsse via HWK-Prüfung</text>
    <text x="16" y="84" fill="#9A3412" font-size="11" font-weight="700">• Abgrenzung: Eigenständige Anlage-A-Gewerke neben Augenoptik (KldB 82522) &amp; Zahntechnik (82542)</text>
  </g>

{footer_block("B1+/B2-Nachwuchs stärkt die Versorgungskompetenz im Gesundheitshandwerk")}
</svg>""",

    # Post 167
    "kunststofftechnologe-verfahrensmechaniker-fachrichtungen.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Kunststoff- und Kautschuktechnologen (Verfahrensmechaniker, KldB 22102)",
    "Neuordnung seit 08/2023: Fachrichtungen im Überblick sowie Wege über IHK FOSA &amp; § 16a/§ 16d"
)}

  <!-- Top Central Hub -->
  <rect x="44" y="108" width="632" height="44" rx="8" fill="#003366"/>
  <text x="360" y="128" text-anchor="middle" fill="#FFFFFF" font-size="12.5" font-weight="700">KldB 22102 • Neuordnung 2023 (7 IHK-Fachrichtungen) • 3 Jahre dual</text>
  <text x="360" y="144" text-anchor="middle" fill="#CBD5E1" font-size="10.5">Anerkennung über IHK FOSA (BQFG) bzw. direkte Ausbildung bei Spritzguss-, Extrusions- &amp; Verbundbetrieben</text>

  <!-- 4 Core Specializations -->
  <g transform="translate(44, 166)">
    <rect x="0" y="0" width="308" height="90" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="14" y="22" fill="#003366" font-size="12" font-weight="700">1. Formteile (Spritzgießen &amp; Blasformen)</text>
    <text x="14" y="42" fill="#475569" font-size="10.5">• Abnehmer: Automotive, Medizintechnik, Verpackung</text>
    <text x="14" y="59" fill="#475569" font-size="10.5">• Fokus: Werkzeugwechsel, Prozessparameter, PLC</text>
    <text x="14" y="76" fill="#003366" font-size="10.5" font-weight="700">• Pfad: § 16a (3 J.) oder § 16d Abs. 3 / § 18a</text>

    <rect x="324" y="0" width="308" height="90" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="338" y="22" fill="#003366" font-size="12" font-weight="700">2. Halbzeuge (Extrusion &amp; Kalandrieren)</text>
    <text x="338" y="42" fill="#475569" font-size="10.5">• Abnehmer: Bauprofile, Rohre, Folien &amp; Platten</text>
    <text x="338" y="59" fill="#475569" font-size="10.5">• Fokus: Liniensteuerung, Materialdosierung, B1</text>
    <text x="338" y="76" fill="#003366" font-size="10.5" font-weight="700">• Pfad: § 18a (IHK FOSA) oder § 16a Ausbildung</text>

    <rect x="0" y="102" width="308" height="90" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <text x="14" y="124" fill="#9A3412" font-size="12" font-weight="700">3. Faserverbundtechnologie &amp; Bauteile</text>
    <text x="14" y="144" fill="#475569" font-size="10.5">• Abnehmer: Windkraft, Luftfahrt, Apparatebau</text>
    <text x="14" y="161" fill="#475569" font-size="10.5">• Fokus: CFK-/GFK-Laminieren, GefStoffV-Schutz</text>
    <text x="14" y="178" fill="#9A3412" font-size="10.5" font-weight="700">• Pfad: § 16a oder IHK-FOSA-Defizitausgleich</text>

    <rect x="324" y="102" width="308" height="90" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <text x="338" y="124" fill="#9A3412" font-size="12" font-weight="700">4. Mehrschichtkautschuk &amp; Compound</text>
    <text x="338" y="144" fill="#475569" font-size="10.5">• Abnehmer: Technische Gummiwaren &amp; Dichtungen</text>
    <text x="338" y="161" fill="#475569" font-size="10.5">• Fokus: Rezeptur, Vulkanisation, Kreislaufwirtschaft</text>
    <text x="338" y="178" fill="#9A3412" font-size="10.5" font-weight="700">• Pfad: § 16d Abs. 3 Anerkennungspartnerschaft</text>
  </g>

  <!-- Bottom IHK FOSA & § 81a Bridge -->
  <g transform="translate(44, 372)">
    <rect width="632" height="86" rx="10" fill="#F1F5F9" stroke="#475569" stroke-width="1.5"/>
    <text x="16" y="24" fill="#003366" font-size="12" font-weight="700">Zugangswege für vietnamesische Fertigungsfachkräfte (BQFG &amp; § 81a AufenthG):</text>
    <text x="16" y="45" fill="#475569" font-size="10.5">1. Berufspraktische Video-Arbeitsprobe in Vietnam (Maschinenbedienung, Messmittel, Zeichnungslesen)</text>
    <text x="16" y="63" fill="#475569" font-size="10.5">2. IHK FOSA Prüfung (max. 2 Mon. im § 81a) oder direkter § 16a Ausbildungsvertrag bei IHK vor Ort</text>
    <text x="16" y="79" fill="#9A3412" font-size="10.5" font-weight="700">3. Ergänzt um Kunststoff-Kreislaufwirtschaft &amp; Digitalisierung gemäß Neuordnung 2023</text>
  </g>

{footer_block("Sichere Schichtbesetzung in der Kunststoffverarbeitung durch geprüfte Praxiskompetenz ab Tag 1")}
</svg>""",

    # Post 168
    "zsef-nuernberg-lfp-amberg-fast-lane-workflow.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Bayern § 81a-Leitfaden: ZSEF Nürnberg &amp; LfP Amberg („Fast Lane“)",
    "Zuständigkeiten nach Berufsgruppen, exklusive Pflege-Fast-Lane und gesetzliche Fristenkette"
)}

  <!-- Swimlane A: Pflege Fast-Lane -->
  <g transform="translate(44, 110)">
    <rect width="632" height="156" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="632" height="34" rx="10" fill="#FF6600"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">Spur A: Pflege- &amp; Gesundheitsfachberufe („Bayerische Fast Lane“ — zentral zwingend)</text>

    <rect x="14" y="48" width="136" height="90" rx="8" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="82" y="68" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">1. Arbeitgeber</text>
    <text x="82" y="86" text-anchor="middle" fill="#475569" font-size="10">Vollmacht, Vertrag</text>
    <text x="82" y="101" text-anchor="middle" fill="#475569" font-size="10">&amp; Antrag digital</text>
    <text x="82" y="122" text-anchor="middle" fill="#9A3412" font-size="9.5" font-weight="700">411 € Gebühr</text>

    <text x="160" y="96" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">→</text>

    <rect x="170" y="48" width="144" height="90" rx="8" fill="#FFFFFF" stroke="#003366"/>
    <text x="242" y="68" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">2. ZSEF Nürnberg</text>
    <text x="242" y="86" text-anchor="middle" fill="#475569" font-size="10">Regierung von</text>
    <text x="242" y="101" text-anchor="middle" fill="#475569" font-size="10">Mittelfranken</text>
    <text x="242" y="122" text-anchor="middle" fill="#003366" font-size="9.5" font-weight="700">Exklusiv zuständig</text>

    <text x="324" y="96" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">↔</text>

    <rect x="334" y="48" width="144" height="90" rx="8" fill="#FFFFFF" stroke="#003366"/>
    <text x="406" y="68" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">3. LfP Amberg</text>
    <text x="406" y="86" text-anchor="middle" fill="#475569" font-size="10">Bayerisches Landes-</text>
    <text x="406" y="101" text-anchor="middle" fill="#475569" font-size="10">amt für Pflege</text>
    <text x="406" y="122" text-anchor="middle" fill="#003366" font-size="9.5" font-weight="700">Max. 2 Mon. (§ 14a)</text>

    <text x="488" y="96" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">→</text>

    <rect x="498" y="48" width="120" height="90" rx="8" fill="#003366"/>
    <text x="558" y="68" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="700">4. ZAV &amp; Visum</text>
    <text x="558" y="86" text-anchor="middle" fill="#CBD5E1" font-size="10">1 Wo. ZAV-Frist</text>
    <text x="558" y="101" text-anchor="middle" fill="#CBD5E1" font-size="10">+ 3+3 Wo. Botschaft</text>
    <text x="558" y="122" text-anchor="middle" fill="#FFEDD5" font-size="9.5" font-weight="700">Hanoi / HCMC</text>
  </g>

  <!-- Swimlane B: Wahlrecht IHK / HWK / Azubi -->
  <g transform="translate(44, 282)">
    <rect width="632" height="176" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="632" height="34" rx="10" fill="#003366"/>
    <text x="16" y="22" fill="#FFFFFF" font-size="12" font-weight="700">Spur B: IHK-, HWK-Berufe &amp; Azubis (§ 16a) — Wahlrecht in Bayern</text>

    <rect x="14" y="48" width="290" height="112" rx="8" fill="#FFFFFF" stroke="#003366"/>
    <text x="26" y="68" fill="#003366" font-size="11.5" font-weight="700">Option 1: ZSEF Nürnberg ODER örtliche ABH</text>
    <text x="26" y="87" fill="#475569" font-size="10.5">• Industrie, Gastronomie, IT, Logistik, Bau, SHK</text>
    <text x="26" y="104" fill="#475569" font-size="10.5">• Freie Wahl je nach Kapazität vor Ort</text>
    <text x="26" y="121" fill="#475569" font-size="10.5">• Anerkennung: IHK FOSA (Nürnberg) oder</text>
    <text x="26" y="137" fill="#475569" font-size="10.5">  zuständige bayerische HWK (max. 2 Monate)</text>
    <text x="26" y="153" fill="#003366" font-size="10" font-weight="700">• Einheitliche Gebühr: 411 € (§ 47 AufenthV)</text>

    <rect x="320" y="48" width="298" height="112" rx="8" fill="#F1F5F9" stroke="#475569"/>
    <text x="332" y="68" fill="#334155" font-size="11.5" font-weight="700">Option 2: Duale Ausbildung (§ 16a AufenthG)</text>
    <text x="332" y="87" fill="#475569" font-size="10.5">• Wahlrecht zwischen ZSEF und örtlicher ABH</text>
    <text x="332" y="104" fill="#475569" font-size="10.5">• Keine BQFG-Anerkennungsprüfung nötig</text>
    <text x="332" y="121" fill="#475569" font-size="10.5">• Nur Kammer-Eintragung (IHK/HWK) erforderlich</text>
    <text x="332" y="137" fill="#475569" font-size="10.5">• 2-Monats-Anerkennungsfrist entfällt komplett</text>
    <text x="332" y="153" fill="#9A3412" font-size="10" font-weight="700">• Zügige Vorabzustimmung über das Online-Portal</text>
  </g>

{footer_block("Bayern-Praxis: Digitale Vollständigkeit sichert die 3–6-Monats-Frist im § 81a-Verfahren")}
</svg>""",

    # Post 169
    "zfe-nrw-bonn-zag-muenster-zustaendigkeiten.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "NRW § 81a-Zuständigkeiten: ZFE NRW (Bonn) &amp; ZAG Münster",
    "Klare Behördenarchitektur von der Bezirksregierung Köln bis zu Pflegekammer und kommunaler ABH"
)}

  <!-- Top Row: Employer -> ZFE NRW -->
  <g transform="translate(44, 108)">
    <rect x="0" y="0" width="180" height="72" rx="8" fill="#F8FAFC" stroke="#475569" stroke-width="1.5"/>
    <text x="90" y="24" text-anchor="middle" fill="#003366" font-size="12" font-weight="700">NRW-Arbeitgeber</text>
    <text x="90" y="42" text-anchor="middle" fill="#475569" font-size="10">Klinik, Pflege, Industrie,</text>
    <text x="90" y="57" text-anchor="middle" fill="#475569" font-size="10">Handwerk (mit Vollmacht)</text>

    <text x="202" y="42" text-anchor="middle" fill="#003366" font-size="18" font-weight="700">→</text>

    <rect x="224" y="0" width="408" height="72" rx="8" fill="#003366"/>
    <text x="428" y="24" text-anchor="middle" fill="#FFFFFF" font-size="12.5" font-weight="700">ZFE NRW (Bezirksregierung Köln, Dienstsitz Bonn)</text>
    <text x="428" y="43" text-anchor="middle" fill="#CBD5E1" font-size="10.5">Landesweit zwingend für ALLE § 81a-Anträge aus dem Ausland (411 € Gebühr)</text>
    <text x="428" y="60" text-anchor="middle" fill="#FFEDD5" font-size="10" font-weight="700">Digitale Einreichung über das Serviceportal der Bezirksregierung Köln</text>
  </g>

  <!-- Middle Split: Recognition Bodies + ZAV -->
  <g transform="translate(44, 198)">
    <rect x="0" y="0" width="304" height="132" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect x="0" y="0" width="304" height="32" rx="10" fill="#FF6600"/>
    <text x="16" y="21" fill="#FFFFFF" font-size="11.5" font-weight="700">Pflege &amp; Gesundheit: ZAG Münster</text>
    <text x="16" y="52" fill="#9A3412" font-size="11" font-weight="700">Bezirksregierung Münster (ZAG-PuG / aH)</text>
    <text x="16" y="70" fill="#475569" font-size="10.5">• Zentrale Gleichwertigkeitsprüfung &amp; Bescheid</text>
    <text x="16" y="87" fill="#475569" font-size="10.5">• Max. 2 Monate Prüffrist im § 81a-Verfahren</text>
    <text x="16" y="106" fill="#9A3412" font-size="10" font-weight="700">Abgrenzung: Kein LPA Düsseldorf (nur Inlands-</text>
    <text x="16" y="120" fill="#9A3412" font-size="10" font-weight="700">Staatsexamen) &amp; nicht die Pflegekammer NRW</text>

    <rect x="328" y="0" width="304" height="132" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect x="328" y="0" width="304" height="32" rx="10" fill="#003366"/>
    <text x="344" y="21" fill="#FFFFFF" font-size="11.5" font-weight="700">IHK, Handwerk &amp; ZAV-Zustimmung</text>
    <text x="344" y="52" fill="#003366" font-size="11" font-weight="700">Kammern &amp; Bundesagentur für Arbeit:</text>
    <text x="344" y="70" fill="#475569" font-size="10.5">• IHK FOSA (Nürnberg) für IHK-Berufe in NRW</text>
    <text x="344" y="87" fill="#475569" font-size="10.5">• Ausnahme: IHK Wuppertal-Solingen-Remscheid</text>
    <text x="344" y="104" fill="#475569" font-size="10.5">• Örtliche NRW-HWKs für Handwerk (Anlage A/B)</text>
    <text x="344" y="121" fill="#003366" font-size="10" font-weight="700">• ZAV: Vorabzustimmung binnen 1 Woche (§ 36)</text>
  </g>

  <!-- Bottom Row: Visa -> Post-Arrival Municipal ABH & Pflegekammer -->
  <g transform="translate(44, 346)">
    <rect x="0" y="0" width="200" height="110" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="100" y="24" text-anchor="middle" fill="#003366" font-size="11.5" font-weight="700">Deutsche Auslandsvertretung</text>
    <text x="100" y="45" text-anchor="middle" fill="#475569" font-size="10.5">Vorabzustimmung der ZFE NRW</text>
    <text x="100" y="63" text-anchor="middle" fill="#475569" font-size="10.5">Termin in Hanoi/HCMC (3 Wo.)</text>
    <text x="100" y="81" text-anchor="middle" fill="#475569" font-size="10.5">+ Visumerteilung (3 Wo.)</text>
    <text x="100" y="99" text-anchor="middle" fill="#003366" font-size="10" font-weight="700">Einreise nach Deutschland</text>

    <text x="218" y="60" text-anchor="middle" fill="#003366" font-size="18" font-weight="700">→</text>

    <rect x="236" y="0" width="188" height="110" rx="8" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="330" y="24" text-anchor="middle" fill="#003366" font-size="11.5" font-weight="700">Kommunale ABH vor Ort</text>
    <text x="330" y="45" text-anchor="middle" fill="#475569" font-size="10.5">Erst nach Einreise in NRW</text>
    <text x="330" y="63" text-anchor="middle" fill="#475569" font-size="10.5">zuständig für Verlängerung</text>
    <text x="330" y="81" text-anchor="middle" fill="#475569" font-size="10.5">und den elektronischen</text>
    <text x="330" y="99" text-anchor="middle" fill="#003366" font-size="10.5" font-weight="700">Aufenthaltstitel (eAT)</text>

    <text x="436" y="60" text-anchor="middle" fill="#FF6600" font-size="18" font-weight="700">+</text>

    <rect x="448" y="0" width="184" height="110" rx="8" fill="#FFF7ED" stroke="#FF6600" stroke-width="1.5"/>
    <text x="540" y="24" text-anchor="middle" fill="#9A3412" font-size="11.5" font-weight="700">Pflegekammer NRW</text>
    <text x="540" y="45" text-anchor="middle" fill="#475569" font-size="10.5">Pflichtregistrierung erst</text>
    <text x="540" y="63" text-anchor="middle" fill="#475569" font-size="10.5">NACH Erlaubnis zur Führung</text>
    <text x="540" y="81" text-anchor="middle" fill="#475569" font-size="10.5">der Berufsbezeichnung</text>
    <text x="540" y="99" text-anchor="middle" fill="#9A3412" font-size="10" font-weight="700">(Kein Defizitbescheid)</text>
  </g>

{footer_block("NRW-Compliance: Kommunale Ausländerämter leiten Auslandsanträge an die zentrale ZFE Bonn ab")}
</svg>""",

    # Post 170
    "ihk-fosa-vs-hwk-zustaendigkeit-fristen.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "IHK FOSA (Nürnberg) vs. Handwerkskammern (HWK) nach dem BQFG",
    "Zuständigkeitsabgrenzung, 3 eigenständige IHK-Ausnahmen, Gebührenrahmen und Fristen (§ 6 vs. § 14a)"
)}

  <!-- Top Decision Gate -->
  <rect x="44" y="106" width="632" height="36" rx="8" fill="#003366"/>
  <text x="360" y="128" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">Entscheidungsfrage: Liegt der Referenzberuf im BBiG (IHK) oder in Anlage A/B der HwO (Handwerk)?</text>

  <!-- Left: IHK FOSA + 3 Ausnahmen -->
  <g transform="translate(44, 154)">
    <rect width="304" height="202" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="12" font-weight="700">IHK-Berufe (BBiG) → IHK FOSA Nürnberg</text>
    <text x="16" y="58" fill="#003366" font-size="11" font-weight="700">Zentrale Zuständigkeit (Ulmenstraße 52g):</text>
    <text x="16" y="76" fill="#475569" font-size="10.5">• Industrie, Handel, HoGa, IT, Chemikant, Koch</text>
    <text x="16" y="93" fill="#475569" font-size="10.5">• Z. B. Elektroniker für Betriebstechnik</text>
    <rect x="16" y="106" width="272" height="82" rx="6" fill="#FFF7ED" stroke="#FF6600"/>
    <text x="26" y="124" fill="#9A3412" font-size="11" font-weight="700">3 eigenständige IHK-Ausnahmen (direkt):</text>
    <text x="26" y="142" fill="#475569" font-size="10.5">1. IHK Hannover</text>
    <text x="26" y="158" fill="#475569" font-size="10.5">2. IHK Braunschweig</text>
    <text x="26" y="174" fill="#475569" font-size="10.5">3. IHK Wuppertal-Solingen-Remscheid</text>
  </g>

  <!-- Right: 53 HWKs -->
  <g transform="translate(372, 154)">
    <rect width="304" height="202" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#FF6600"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="12" font-weight="700">Handwerk (HwO) → 53 regionale HWKs</text>
    <text x="16" y="58" fill="#9A3412" font-size="11" font-weight="700">Örtliche Zuständigkeit am Betriebssitz:</text>
    <text x="16" y="76" fill="#475569" font-size="10.5">• Alle Gewerke der Anlage A und Anlage B HwO</text>
    <text x="16" y="93" fill="#475569" font-size="10.5">• Z. B. SHK, Dachdecker, Kfz, Hörakustiker,</text>
    <text x="16" y="110" fill="#475569" font-size="10.5">  Elektroniker für Energie- und Gebäudetechnik</text>
    <rect x="16" y="124" width="272" height="64" rx="6" fill="#FFFFFF" stroke="#475569"/>
    <text x="26" y="142" fill="#003366" font-size="11" font-weight="700">Praxistipp bei Doppel-Berufen:</text>
    <text x="26" y="159" fill="#475569" font-size="10.5">Betriebszugehörigkeit (IHK-Werk vs. Handwerks-</text>
    <text x="26" y="175" fill="#475569" font-size="10.5">betrieb) entscheidet über IHK FOSA oder HWK</text>
  </g>

  <!-- Bottom Deadlines & Fees Comparison -->
  <g transform="translate(44, 370)">
    <rect width="632" height="88" rx="10" fill="#F1F5F9" stroke="#003366" stroke-width="1.5"/>
    <rect x="14" y="12" width="194" height="64" rx="6" fill="#FFFFFF" stroke="#475569"/>
    <text x="111" y="32" text-anchor="middle" fill="#334155" font-size="11.5" font-weight="700">Regelfrist (§ 6 Abs. 3 BQFG)</text>
    <text x="111" y="51" text-anchor="middle" fill="#003366" font-size="13" font-weight="700">Max. 3 Monate</text>
    <text x="111" y="67" text-anchor="middle" fill="#475569" font-size="9.5">ab Vollständigkeit der Akte</text>

    <rect x="219" y="12" width="194" height="64" rx="6" fill="#FFFFFF" stroke="#FF6600" stroke-width="1.5"/>
    <text x="316" y="32" text-anchor="middle" fill="#9A3412" font-size="11.5" font-weight="700">Im § 81a (§ 14a BQFG)</text>
    <text x="316" y="51" text-anchor="middle" fill="#FF6600" font-size="13" font-weight="700">Max. 2 Monate</text>
    <text x="316" y="67" text-anchor="middle" fill="#475569" font-size="9.5">beschleunigte Kammer-Prüfung</text>

    <rect x="424" y="12" width="194" height="64" rx="6" fill="#FFFFFF" stroke="#003366"/>
    <text x="521" y="32" text-anchor="middle" fill="#003366" font-size="11.5" font-weight="700">Gebührenrahmen</text>
    <text x="521" y="51" text-anchor="middle" fill="#003366" font-size="13" font-weight="700">100 – 600 EUR</text>
    <text x="521" y="67" text-anchor="middle" fill="#475569" font-size="9.5">IHK FOSA i. d. R. 600 € Vorschuss</text>
  </g>

{footer_block("Bei fehlenden Zeugnissen: Qualifikationsanalyse nach § 14 BQFG über IHK FOSA oder HWK nutzen")}
</svg>""",

    # Post 171
    "dmf-p13-171-gap-pflegeexamen-pruefungsfahrplan.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Prüfungsfahrplan Jahr 2–3: GAP Teil 1/2 (§ 44 BBiG) &amp; Pflegeexamen",
    "Betriebliche Förderung, Freistellungspflicht (§ 15 BBiG) und Übernahme in § 18a AufenthG"
)}

  <!-- 4 Timeline Phases -->
  <g transform="translate(44, 110)">
    <rect x="0" y="0" width="148" height="206" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect x="0" y="0" width="148" height="36" rx="10" fill="#003366"/>
    <text x="74" y="22" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="700">Monat 16–18</text>
    <text x="12" y="56" fill="#003366" font-size="11.5" font-weight="700">GAP Teil 1 / Zwischen</text>
    <text x="12" y="75" fill="#475569" font-size="10">• §§ 37, 44 BBiG / HwO</text>
    <text x="12" y="92" fill="#475569" font-size="10">• Zählt 25–40 % zur</text>
    <text x="12" y="106" fill="#475569" font-size="10">  Gesamtnote (GAP 1)</text>
    <text x="12" y="128" fill="#003366" font-size="10" font-weight="700">Maßnahmen:</text>
    <text x="12" y="145" fill="#475569" font-size="10">• Probe-Aufträge</text>
    <text x="12" y="161" fill="#475569" font-size="10">• Wörterbuch-Antrag</text>
    <text x="12" y="177" fill="#475569" font-size="10">• Fachbegriffe sichern</text>

    <text x="155" y="104" text-anchor="middle" fill="#003366" font-size="15" font-weight="700">→</text>

    <rect x="162" y="0" width="148" height="206" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect x="162" y="0" width="148" height="36" rx="10" fill="#FF6600"/>
    <text x="236" y="22" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="700">Monat 24–30</text>
    <text x="174" y="56" fill="#9A3412" font-size="11.5" font-weight="700">AsA flex &amp; DeuFöV</text>
    <text x="174" y="75" fill="#475569" font-size="10">• AsA flex (§ 75 SGB III)</text>
    <text x="174" y="92" fill="#475569" font-size="10">  kostenfrei für Betrieb</text>
    <text x="174" y="109" fill="#475569" font-size="10">• DeuFöV (§ 45a AufenthG)</text>
    <text x="174" y="130" fill="#9A3412" font-size="10" font-weight="700">Praxistraining:</text>
    <text x="174" y="147" fill="#475569" font-size="10">• Mock-Fachgespräch</text>
    <text x="174" y="163" fill="#475569" font-size="10">• Pflegeplanung &amp;</text>
    <text x="174" y="177" fill="#475569" font-size="10">  Berichtsheft-Review</text>

    <text x="317" y="104" text-anchor="middle" fill="#003366" font-size="15" font-weight="700">→</text>

    <rect x="324" y="0" width="148" height="206" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect x="324" y="0" width="148" height="36" rx="10" fill="#003366"/>
    <text x="398" y="22" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="700">Monat 34–36</text>
    <text x="336" y="56" fill="#003366" font-size="11.5" font-weight="700">GAP 2 &amp; PflAPrV</text>
    <text x="336" y="75" fill="#475569" font-size="10">• Pflicht-Freistellung</text>
    <text x="336" y="90" fill="#475569" font-size="10">  nach § 15 BBiG:</text>
    <text x="336" y="106" fill="#475569" font-size="10">  Prüfungstage + Arbeitstag</text>
    <text x="336" y="121" fill="#475569" font-size="10">  vor schriftl. Prüfung</text>
    <text x="336" y="143" fill="#003366" font-size="10" font-weight="700">Pflege (§§ 9–17):</text>
    <text x="336" y="160" fill="#475569" font-size="10">• Schriftlich, mündlich,</text>
    <text x="336" y="175" fill="#475569" font-size="10">  praktisch am Patienten</text>

    <text x="479" y="104" text-anchor="middle" fill="#003366" font-size="15" font-weight="700">→</text>

    <rect x="486" y="0" width="146" height="206" rx="10" fill="#F1F5F9" stroke="#475569" stroke-width="2"/>
    <rect x="486" y="0" width="146" height="36" rx="10" fill="#475569"/>
    <text x="559" y="22" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="700">Abschluss / Tag X</text>
    <text x="498" y="56" fill="#003366" font-size="11.5" font-weight="700">Statuswechsel</text>
    <text x="498" y="75" fill="#475569" font-size="10">• Bestanden (§ 21 II):</text>
    <text x="498" y="90" fill="#003366" font-size="10" font-weight="700">  Übernahme § 18a</text>
    <text x="498" y="112" fill="#475569" font-size="10">• Nicht bestanden:</text>
    <text x="498" y="127" fill="#9A3412" font-size="10" font-weight="700">  Verlängerung nach</text>
    <text x="498" y="142" fill="#9A3412" font-size="10" font-weight="700">  § 21 Abs. 3 BBiG</text>
    <text x="498" y="163" fill="#475569" font-size="10">• Ggf. Suchtitel nach</text>
    <text x="498" y="177" fill="#475569" font-size="10">  § 20 Abs. 1 Nr. 3</text>
  </g>

  <!-- Bottom Support Matrix -->
  <g transform="translate(44, 332)">
    <rect width="632" height="124" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="1.5"/>
    <text x="16" y="24" fill="#003366" font-size="12" font-weight="700">So sichern Ausbildungsbetriebe die Bestehensquote bei internationalen Auszubildenden:</text>
    <text x="16" y="46" fill="#475569" font-size="11">1. Rechtzeitige Antragstellung auf zweisprachiges Wörterbuch oder Zeitzuschlag bei IHK / HWK prüfen</text>
    <text x="16" y="66" fill="#475569" font-size="11">2. Gezielte Simulationen des betrieblichen Auftrags und Fachgesprächs (GAP Teil 2) mit dem Ausbilder</text>
    <text x="16" y="86" fill="#475569" font-size="11">3. Nahtlose Abstimmung mit der Ausländerbehörde (§ 81 Abs. 4 AufenthG Fiktionswirkung) vor Vertragsende</text>
    <text x="16" y="106" fill="#9A3412" font-size="11" font-weight="700">4. Praxisanleitung (§ 4 PflAPrV) und AsA flex (§ 75 SGB III) konsequent ab dem 2. Lehrjahr verzahnen</text>
  </g>

{footer_block("Retention-Erfolg: Rechtzeitige Prüfungsvorbereitung schützt Ihre 3-jährige Ausbildungsinvestition")}
</svg>""",

    # Post 172
    "dmf-p13-172-eat-zusatzblatt-arbeitgeberwechsel-check.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Inlands-Compliance: Zusatzblatt zum eAT &amp; Arbeitgeberwechsel prüfen",
    "Prüfpflichten für Personalabteilungen (§ 4a Abs. 5 AufenthG, § 9 BeschV, §§ 16a/16d → § 18a)"
)}

  <!-- Top HR Entry Gate -->
  <g transform="translate(44, 108)">
    <rect width="632" height="68" rx="10" fill="#003366"/>
    <text x="316" y="25" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="700">Neueinstellung im Inland: eAT + Zusatzblatt vor Start prüfen (§ 4a Abs. 5 AufenthG)</text>
    <text x="316" y="45" text-anchor="middle" fill="#CBD5E1" font-size="10.5">Ohne gültiges Zusatzblatt bzw. behördliche Erlaubnis drohen Bußgelder nach § 404 Abs. 2 Nr. 3 SGB III</text>
  </g>

  <!-- Left Branch: Kein Arbeitgeberwechsel / § 9 BeschV erfüllt -->
  <g transform="translate(44, 192)">
    <rect width="304" height="264" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#003366"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="12" font-weight="700">Pfad A: Freier Wechsel (§ 9 BeschV)</text>

    <text x="16" y="60" fill="#003366" font-size="11.5" font-weight="700">Wann keine neue ABH-Erlaubnis nötig ist:</text>
    <text x="16" y="80" fill="#475569" font-size="10.5">• Vermerk im Zusatzblatt zum eAT lautet:</text>
    <text x="16" y="96" fill="#003366" font-size="10.5" font-weight="700">  „Beschäftigung jeder Art gestattet“</text>
    <text x="16" y="116" fill="#475569" font-size="10.5">• Vorbeschäftigung ≥ 2 Jahre versicherungspflichtig</text>
    <text x="16" y="132" fill="#475569" font-size="10.5">  in Deutschland ODER ≥ 3 Jahre rechtmäßiger</text>
    <text x="16" y="148" fill="#475569" font-size="10.5">  ununterbrochener Aufenthalt (§ 9 Abs. 1 BeschV)</text>

    <rect x="16" y="166" width="272" height="82" rx="8" fill="#F1F5F9" stroke="#003366"/>
    <text x="26" y="186" fill="#003366" font-size="11" font-weight="700">HR-Pflichten nach § 4a Abs. 5 AufenthG:</text>
    <text x="26" y="204" fill="#475569" font-size="10.5">1. Vorder- und Rückseite eAT + Zusatzblatt</text>
    <text x="26" y="220" fill="#475569" font-size="10.5">   als Kopie/Scan in der Personalakte ablegen</text>
    <text x="26" y="236" fill="#475569" font-size="10.5">2. Ablaufdatum im HR-System fristüberwachen</text>
  </g>

  <!-- Right Branch: Bindung / Zweckwechsel -->
  <g transform="translate(372, 192)">
    <rect width="304" height="264" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="38" rx="10" fill="#FF6600"/>
    <text x="16" y="24" fill="#FFFFFF" font-size="12" font-weight="700">Pfad B: Bindung / Zweckwechsel</text>

    <text x="16" y="60" fill="#9A3412" font-size="11" font-weight="700">Wann die ABH vorab freigeben muss:</text>
    <text x="16" y="80" fill="#475569" font-size="10.5">• Zusatzblatt nennt konkreten Alt-Arbeitgeber</text>
    <text x="16" y="96" fill="#475569" font-size="10.5">  (erste 2 Jahre bei § 18a / § 18b / § 18g)</text>
    <text x="16" y="114" fill="#475569" font-size="10.5">• Zweckwechsel nach Abschluss:</text>
    <text x="16" y="130" fill="#9A3412" font-size="10.5" font-weight="700">  § 16a (Azubi) → § 18a oder § 16d → § 18a</text>

    <rect x="16" y="146" width="272" height="102" rx="8" fill="#FFFFFF" stroke="#FF6600"/>
    <text x="26" y="166" fill="#9A3412" font-size="11" font-weight="700">Zwingender Ablauf vor Arbeitstag 1:</text>
    <text x="26" y="184" fill="#475569" font-size="10.5">1. Antrag auf Titeländerung / Zweckwechsel bei</text>
    <text x="26" y="199" fill="#475569" font-size="10.5">   der zuständigen Ausländerbehörde stellen</text>
    <text x="26" y="216" fill="#475569" font-size="10.5">2. Arbeitsvertrag, EzB &amp; Abschlussurkunde</text>
    <text x="26" y="232" fill="#9A3412" font-size="10" font-weight="700">3. Fiktion (§ 81 IV) / Freigabe abwarten</text>
  </g>

{footer_block("Bei vorzeitiger Kündigung: Meldepflicht des Alt-Arbeitgebers binnen 4 Wochen (§ 82 Abs. 6 AufenthG)")}
</svg>""",

    # Post 173
    "dmf-p13-173-ergthg-ptag-anerkennungspfad.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
{header_block(
    "Ergotherapeuten (ErgThG) &amp; PTA (PTAG): Anerkennung in Deutschland",
    "Paralleler Zulassungsweg für Reha-Zentren und Apotheken über § 16d, § 18a und § 81a AufenthG"
)}

  <!-- Branch A: Ergotherapeuten -->
  <g transform="translate(44, 110)">
    <rect width="304" height="148" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#003366"/>
    <text x="16" y="23" fill="#FFFFFF" font-size="12" font-weight="700">Spur A: Ergotherapeuten (Reha &amp; Praxen)</text>
    <text x="16" y="56" fill="#003366" font-size="11" font-weight="700">Gesetzliche Grundlage:</text>
    <text x="16" y="74" fill="#475569" font-size="10.5">• §§ 1, 2 Abs. 3 ErgThG &amp; § 16b ErgThAPrV</text>
    <text x="16" y="91" fill="#475569" font-size="10.5">• Zuständiges Landesprüfungsamt am Einsatzort</text>
    <text x="16" y="109" fill="#003366" font-size="11" font-weight="700">Einsatzfeld &amp; Vorbereitung:</text>
    <text x="16" y="127" fill="#475569" font-size="10.5">• Reha-Kliniken, Geriatrie, Neurologie &amp; Praxen</text>
    <text x="16" y="141" fill="#475569" font-size="10.5">• B2-Deutsch + medizinisch-therapeutische Doku</text>
  </g>

  <!-- Branch B: PTA -->
  <g transform="translate(372, 110)">
    <rect width="304" height="148" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="36" rx="10" fill="#FF6600"/>
    <text x="16" y="23" fill="#FFFFFF" font-size="12" font-weight="700">Spur B: PTA (Apotheken &amp; Kliniken)</text>
    <text x="16" y="56" fill="#9A3412" font-size="11" font-weight="700">Gesetzliche Grundlage (PTAG 2023):</text>
    <text x="16" y="74" fill="#475569" font-size="10">• §§ 33–41 PTAG (§§ 34, 38) &amp; § 18b PTA-APrV</text>
    <text x="16" y="91" fill="#475569" font-size="10.5">• Aufsicht nach ApBetrO durch approb. Apotheker</text>
    <text x="16" y="109" fill="#9A3412" font-size="11" font-weight="700">Einsatzfeld &amp; Vorbereitung:</text>
    <text x="16" y="127" fill="#475569" font-size="10.5">• Öffentliche Apotheken, Krankenhausapotheken</text>
    <text x="16" y="141" fill="#475569" font-size="10.5">• Rezeptur, Arzneimittelprüfung &amp; B2-Beratung</text>
  </g>

  <!-- Convergence Arrows -->
  <text x="196" y="276" text-anchor="middle" fill="#003366" font-size="16" font-weight="700">↘</text>
  <text x="524" y="276" text-anchor="middle" fill="#FF6600" font-size="16" font-weight="700">↙</text>

  <!-- Convergence Flow: Defizitbescheid -> Ausgleichsmaßnahme -> Urkunde -->
  <g transform="translate(44, 282)">
    <rect width="632" height="176" rx="10" fill="#F1F5F9" stroke="#003366" stroke-width="2"/>
    <text x="16" y="24" fill="#003366" font-size="12" font-weight="700">Gemeinsamer Anerkennungs- &amp; Visapfad (§ 81a AufenthG: 411 € Gebühr, max. 2 Mon. Prüffrist):</text>

    <rect x="16" y="38" width="166" height="122" rx="8" fill="#FFFFFF" stroke="#475569"/>
    <text x="99" y="58" text-anchor="middle" fill="#003366" font-size="11" font-weight="700">1. Defizitbescheid</text>
    <text x="99" y="77" text-anchor="middle" fill="#475569" font-size="10">Prüfung des vietnam.</text>
    <text x="99" y="93" text-anchor="middle" fill="#475569" font-size="10">Abschlusses durch die</text>
    <text x="99" y="109" text-anchor="middle" fill="#475569" font-size="10">Landesbehörde inkl.</text>
    <text x="99" y="125" text-anchor="middle" fill="#003366" font-size="10" font-weight="700">B2-Sprachnachweis</text>
    <text x="99" y="145" text-anchor="middle" fill="#475569" font-size="9.5">(§ 16d oder § 18a Visum)</text>

    <text x="196" y="104" text-anchor="middle" fill="#003366" font-size="16" font-weight="700">→</text>

    <rect x="210" y="38" width="218" height="122" rx="8" fill="#FFFFFF" stroke="#FF6600" stroke-width="1.5"/>
    <text x="319" y="58" text-anchor="middle" fill="#9A3412" font-size="11" font-weight="700">2. Ausgleichsmaßnahme (§ 16d)</text>
    <text x="220" y="78" fill="#475569" font-size="10">• Anpassungslehrgang (§ 16b Abs. 2</text>
    <text x="220" y="93" fill="#475569" font-size="10">  ErgThAPrV / § 41 PTAG): Praxiseinsatz</text>
    <text x="220" y="112" fill="#475569" font-size="10">• ODER Kenntnisprüfung (§ 16b Abs. 3</text>
    <text x="220" y="127" fill="#475569" font-size="10">  ErgThAPrV / § 40 PTAG)</text>
    <text x="220" y="147" fill="#9A3412" font-size="9.5" font-weight="700">Mitarbeit unter fachlicher Aufsicht</text>

    <text x="442" y="104" text-anchor="middle" fill="#003366" font-size="16" font-weight="700">→</text>

    <rect x="456" y="38" width="160" height="122" rx="8" fill="#003366"/>
    <text x="536" y="58" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="700">3. Berufsurkunde</text>
    <text x="536" y="80" text-anchor="middle" fill="#CBD5E1" font-size="10">Staatliche Erlaubnis</text>
    <text x="536" y="96" text-anchor="middle" fill="#CBD5E1" font-size="10">zum Führen der</text>
    <text x="536" y="112" text-anchor="middle" fill="#CBD5E1" font-size="10">Berufsbezeichnung</text>
    <text x="536" y="135" text-anchor="middle" fill="#FFEDD5" font-size="10.5" font-weight="700">→ § 18a AufenthG</text>
    <text x="536" y="150" text-anchor="middle" fill="#CBD5E1" font-size="9.5">(volle Fachkraft)</text>
  </g>

{footer_block("Planbare Verstärkung für Reha-Zentren, Kliniken und Apotheken durch strukturierte B2-Fachvorbereitung")}
</svg>""",
}


def validate_svg(filename: str, xml_content: str) -> None:
    root = ET.fromstring(xml_content)
    if not root.tag.endswith("svg"):
        raise ValueError(f"{filename}: Root element is not <svg>: {root.tag}")
    if root.attrib.get("viewBox") != "0 0 720 540":
        raise ValueError(f"{filename}: Invalid viewBox {root.attrib.get('viewBox')}")
    # Strip tags and check formal German
    plain = re.sub(r"<[^>]+>", " ", xml_content)
    plain = plain.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    bad = INFORMAL_GERMAN_RE.findall(plain)
    if bad:
        raise ValueError(f"{filename}: Informal German pronoun(s) found: {bad}")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    assert len(SVGS) == 15, f"Expected 15 SVGs, got {len(SVGS)}"
    for filename, svg_xml in SVGS.items():
        validate_svg(filename, svg_xml)
        out_path = OUT_DIR / filename
        out_path.write_text(svg_xml + "\n", encoding="utf-8")
        print(f"✓ Generated & validated SVG: {filename} ({out_path.stat().st_size} B)")


if __name__ == "__main__":
    main()
