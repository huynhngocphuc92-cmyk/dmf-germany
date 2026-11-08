#!/usr/bin/env python3
"""
Generate 15 custom vector SVG diagrams for Phase 12 GEO Flagship Blog Articles (Posts 144–158).
Each SVG uses a 720x540 viewBox and the DMF corporate palette (Navy #003366, Orange #FF6600, Slate #475569).
"""

from pathlib import Path

OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")

SVCS = [
    (
        "dmf-geo-16d-vs-18a-aufenthg-entscheidungsmatrix.svg",
        "§ 16d Anerkennungspartnerschaft vs. § 18a AufenthG",
        "Vergleich von Vorlaufzeit, Sprachniveau und betrieblichem Einsatz für deutsche Arbeitgeber",
        "Pfad A: § 16d Abs. 3 AufenthG (Anerkennungspartnerschaft)",
        [
            "• Einreise bereits vor abgeschlossener Gleichwertigkeit möglich",
            "• Sprachvoraussetzung zum Start: mind. A2/B1 (GER)",
            "• Sofortige tarifgebundene Beschäftigung während Nachqualifizierung",
            "• Ziel: Vollanerkennung innerhalb von bis zu 36 Monaten",
        ],
        "Pfad B: § 18a AufenthG (Vollanerkennung vor Einreise)",
        [
            "• Abgeschlossene BQFG-Gleichwertigkeitsprüfung vor Visumerteilung",
            "• Sprachvoraussetzung: B1/B2 je nach reglementiertem Beruf",
            "• Direkter Einsatz als vollwertige Fachkraft ab Tag 1",
            "• Ideal für sofortige Fachkraft-Verantwortung ohne Auflagen",
        ],
        "Entscheidungsregel: Schneller Personalaufbau vor Ort (§ 16d) vs. sofortige Vollbefugnis ab Einreise (§ 18a)",
    ),
    (
        "dmf-geo-81a-verfahren-fristen-unterlagen-ablauf.svg",
        "Beschleunigtes Fachkräfteverfahren (§ 81a AufenthG)",
        "Gesetzliche Behördenfristen und Dokumenten-Checkliste für Personalabteilungen",
        "Gesetzliche Regelfristen nach § 81a AufenthG",
        [
            "• Schritt 1: Vereinbarung mit der Ausländerbehörde (Vollmacht)",
            "• Schritt 2: Gleichwertigkeitsprüfung max. 2 Monate (IHK FOSA / HWK)",
            "• Schritt 3: ZAV-Vorabzustimmung innerhalb von 1 Woche (§ 36 BeschV)",
            "• Schritt 4: Botschaftstermin in 3 Wochen + Entscheidung in 3 Wochen",
        ],
        "Pflichtunterlagen des Arbeitgebers",
        [
            "• Konkretes Arbeitsplatzangebot / Ausbildungsvertrag (IHK/HWK)",
            "• Erklärung zum Beschäftigungsverhältnis (EzB)",
            "• Unterzeichnete Vollmacht & Untervollmacht für DMF Talents",
            "• Verwaltungsgebühr nach § 47 Abs. 1 Nr. 15 AufenthV (411 EUR)",
        ],
        "Zeitvorteil für Arbeitgeber: Verbindliche Fristenkette verkürzt die Gesamtdauer auf ca. 3 bis 6 Monate",
    ),
    (
        "dmf-geo-296a-sgb-iii-compliance-pruefschema.svg",
        "Compliance-Prüfschema nach § 296a SGB III (Employer-Pays)",
        "Rechtssichere Ausbildungsvermittlung ohne Gebühren zulasten internationaler Azubis",
        "Gesetzlicher Schutzstandard (§ 296a SGB III & § 12 BBiG)",
        [
            "• Striktes Verbot von Vermittlungsgebühren für Auszubildende",
            "• Keine Kautionen, Strafversprechen oder Schuldknechtschaft",
            "• Transparente Leistungsabrechnung ausschließlich mit dem Betrieb",
            "• Schriftliche Bestätigung der Gebührenfreiheit im Kandidatendossier",
        ],
        "Prüffragen für deutsche Ausbildungsbetriebe",
        [
            "• Werden Sprachkurs- und Dokumentenkosten klar ausgewiesen?",
            "• Existieren Nebenabreden oder Darlehensverträge im Herkunftsland?",
            "• Erfolgt die Vorbereitung an einer eigenen Akademie statt über Subagenten?",
            "• Ist ein direkter Ansprechpartner in Deutschland benannt?",
        ],
        "Rechtssicherheit bei DMF Talents: 100 % Employer-Pays-Prinzip ohne finanzielle Belastung der Bewerber",
    ),
    (
        "dmf-geo-laendervergleich-vietnam-drittstaaten-matrix.svg",
        "Internationale Personalgewinnung: Sachlicher Ländervergleich",
        "Entscheidungskriterien für deutsche Mittelständler, Kliniken und Handwerksbetriebe",
        "Strukturelle Stärken des Standorts Vietnam",
        [
            "• Hohe Bildungs- und MINT-Affinität im schulischen Curriculum",
            "• Ausgeprägte Lern- und Arbeitsdisziplin im 5-Tage-Intensivkurs",
            "• Starke praktische Vorbildung in Pflege, Handwerk, Metall & HoGa",
            "• Etablierte Verwaltungswege (APS, Botschaft Hanoi, Generalkonsulat HCMC)",
        ],
        "Erfolgsfaktoren für nachhaltige Integration",
        [
            "• Stationäre Sprachausbildung (A1 bis B1/B2) vor Ausreise",
            "• 1:1 Interview-Coaching durch deutsche Muttersprachler",
            "• Strukturierte 30- bis 90-Tage-Onboarding-Begleitung vor Ort",
            "• Nachweislich über 90 % Verbleibquote im Ausbildungs- & Arbeitsverhältnis",
        ],
        "Qualitätsprinzip: Individuelle Eignungsprüfung und strukturierte Vorbereitung statt pauschaler Versprechen",
    ),
    (
        "dmf-geo-azubi-16a-oder-fachkraft-18a-vergleich.svg",
        "Auszubildende (§ 16a) vs. Anerkannte Fachkraft (§ 18a AufenthG)",
        "Strategische Personalplanung nach Betriebsgröße, Zeithorizont und Einarbeitungskapazität",
        "Duale Berufsausbildung (§ 16a AufenthG)",
        [
            "• Ideal für nachhaltigen Nachwuchsaufbau über 2,5 bis 3,5 Jahre",
            "• Keine langwierige BQFG-Gleichwertigkeitsprüfung erforderlich",
            "• Ausbildung exakt nach eigenen betrieblichen Abläufen und Kammernormen",
            "• Staatliche Förderung über AsA flex (§ 75 SGB III) nutzbar",
        ],
        "Anerkannte Fachkraft (§ 18a / § 16d AufenthG)",
        [
            "• Ideal bei akutem Fachkräftebedarf in Schicht, Werkstatt oder Baustelle",
            "• Mehrjährige Berufspraxis und abgeschlossenes Fachkolleg / Studium",
            "• Produktiver Wertbeitrag bereits in den ersten Monaten",
            "• Amortisation der Rekrutierungskosten durchschnittlich nach 3–5 Monaten",
        ],
        "Kombinationsempfehlung: Kurzfristige Entlastung über § 18a/§ 16d + langfristige Sicherung über § 16a",
    ),
    (
        "dmf-geo-pflege-kenntnispruefung-vs-anpassungslehrgang.svg",
        "Pflegefachkräfte (§ 16d / PflBG): Kenntnisprüfung vs. Anpassungslehrgang",
        "Entscheidungshilfe für Pflegedienstleitungen in Kliniken, Seniorenheimen und Pflegediensten",
        "Option 1: Kenntnisprüfung nach PflBG",
        [
            "• Mündlicher und praktischer Prüfungsteil am Patienten / Simulator",
            "• Fokus auf festgestellte Unterschiede aus dem Defizitbescheid",
            "• Kürzere Gesamtdauer bei hoher fachlicher und sprachlicher Reife",
            "• Gezielter Vorbereitungskurs parallel zum Einsatz als Pflegehelfer",
        ],
        "Option 2: Anpassungslehrgang nach PflBG",
        [
            "• Strukturierter Theorie- und Praxisunterricht mit Abschlussgespräch",
            "• Hohe Planungssicherheit ohne punktuelle Einzelprüfungsbelastung",
            "• Kontinuierliche Einbindung in den Stationsalltag des Betriebs",
            "• Sehr hohe Bestehensquote durch begleitende Praxisreflexion",
        ],
        "Voraussetzung für die Urkundenerteilung: Bestandene Ausgleichsmaßnahme + Fachsprache Deutsch B2 Pflege",
    ),
    (
        "dmf-geo-handwerk-arbeitsproben-elektroniker-shk.svg",
        "Fachpraxis vorab prüfen: Arbeitsproben im Handwerk (Elektro & SHK)",
        "Qualitätssicherung für Handwerksmeister vor Vertragsunterschrift und Visumantrag",
        "Praxistest Elektroniker (KldB 26212)",
        [
            "• Lesen und Erklären ein- und mehrpoliger Schaltpläne",
            "• Verdrahtung von Schützschaltungen und Verteilerkästen im Video-Test",
            "• Sicherheitsregeln und Messprotokolle (Einführung in DIN VDE 0100)",
            "• Fachgespräch zu Werkzeugen, Leitungsquerschnitten und Fehlersuche",
        ],
        "Praxistest Anlagenmechaniker SHK (KldB 34212)",
        [
            "• Rohrverbindungstechniken (Pressen, Löten, Schweißen) unter Kamera",
            "• Montage- und Hydraulikverständnis für Heizungs- und Sanitärsysteme",
            "• Grundlagen moderner Wärmepumpen- und Lüftungstechnik",
            "• Prüfung der HWK-Unterlagen für die Gleichwertigkeitsfeststellung",
        ],
        "DMF Quality Gate: Verifizierte Video-Arbeitsprobe + Fachinterview verhindern fachliche Fehlbesetzungen",
    ),
    (
        "dmf-geo-industrie-cnc-zerspaner-iso-9606-schweisser.svg",
        "Industrie & Metallbau: CNC-Zerspanung und ISO-9606-1-Schweißtechnik",
        "Technische Qualifikationsprofile und IHK-FOSA-Anerkennung für Fertigungsbetriebe",
        "CNC-Zerspanungsmechaniker (KldB 24232)",
        [
            "• 3- bis 5-Achs-Drehen und -Fräsen nach technischer Zeichnung",
            "• Erfahrung mit Fanuc-, Siemens-Sinumerik- oder Heidenhain-Steuerungen",
            "• Umgang mit Messmitteln (Bügelmessschraube, Messschieber, Prüflehren)",
            "• Gleichwertigkeitsprüfung über die IHK FOSA (§ 18a / § 16d AufenthG)",
        ],
        "Schweißer & Konstruktionsmechaniker (KldB 24412)",
        [
            "• Geprüfte Verfahren: MAG (135), WIG (141) und E-Hand (111)",
            "• Zertifizierung nach DIN EN ISO 9606-1 (Stahl / Edelstahl)",
            "• Sicht- und Nahtprüfung sowie Vorbereitung auf DIN EN 1090",
            "• Arbeitsschutz- und Schweißrauch-Unterweisung vor Betriebsstart",
        ],
        "Praxistransfer: Technische Vorprüfung in Vietnam + strukturierte Maschineneinweisung in Deutschland",
    ),
    (
        "dmf-geo-hotellerie-gastronomie-azubis-koeche-saison.svg",
        "Hotellerie & Gastronomie: 3 Rekrutierungsmodelle im Vergleich",
        "Rechtssichere Personalplanung für Hotels, Restaurants und Systemgastronomie",
        "Langfristige Säulen: § 16a Ausbildung & § 18a Fachkräfte",
        [
            "• Duale Ausbildung (§ 16a): Hotelfach, Restaurantfach, Koch (3 Jahre)",
            "• Ausgebildete Köche & Servicefachkräfte (§ 18a AufenthG)",
            "• Praktische Vorschulung in Lehrküche & Service-Simulation (BCIS)",
            "• Sprachniveau B1/B2 für sicheren Gästekontakt und Kassensystem",
        ],
        "Saisonale Verstärkung & Schichtstabilität",
        [
            "• Unterstützungskräfte für Hochsaison in Küche, Housekeeping & Bankett",
            "• Hohe Belastbarkeit an Wochenenden, Feiertagen und im Teildienst",
            "• Schulung in Lebensmittelhygiene (HACCP) und Allergenkennzeichnung",
            "• Planbare Vorlaufzeiten durch gebündelte Kohorten-Vorbereitung",
        ],
        "Empfehlung: Kombination aus erfahrenen Küchenfachkräften (§ 18a) und eigenen Nachwuchs-Azubis (§ 16a)",
    ),
    (
        "dmf-geo-zeitarbeit-vs-direktrekrutierung-vollkosten.svg",
        "Vollkosten- & ROI-Analyse: Zeitarbeit vs. Direktrekrutierung",
        "Betriebswirtschaftlicher 36-Monats-Vergleich für Geschäftsführer und kaufmännische Leiter",
        "Zeitarbeit / Arbeitnehmerüberlassung (AÜG)",
        [
            "• Laufender Verrechnungssatz-Aufschlag von 60 % bis 100 % auf den Bruttolohn",
            "• Hohe Fluktuation und wiederholter Einarbeitungsaufwand im Team",
            "• Höchstüberlassungsdauer begrenzt auf 18 Monate (§ 1 Abs. 1b AÜG)",
            "• Kein nachhaltiger Kompetenzaufbau im eigenen Stammpersonal",
        ],
        "Direktrekrutierung über DMF Talents (§ 18a / § 16a)",
        [
            "• Einmalige, transparente Vermittlungs- und Integrationsinvestition",
            "• Reguläres Tarif- bzw. Betriebsgehalt ohne laufende Agenturaufschläge",
            "• Break-Even (Amortisation) durchschnittlich nach 3 bis 5 Monaten",
            "• Über 90 % Verbleibquote schafft stabile Schicht- und Projektplanung",
        ],
        "Interaktives Planungstool: Berechnen Sie Ihren individuellen Break-Even unter dmf-talents.de/roi-rechner",
    ),
    (
        "dmf-geo-foerdermittel-asa-flex-berufssprachkurse.svg",
        "Staatliche Förderinstrumente für Ausbildungs- & Fachkräftebetriebe",
        "Öffentliche Unterstützungsangebote von Bundesagentur für Arbeit und BAMF gezielt nutzen",
        "Ausbildungsbegleitung: AsA flex (§ 75 SGB III)",
        [
            "• 100 % kostenfrei für Ausbildungsbetrieb und Auszubildende",
            "• Stützunterricht in Fachtheorie, Fachrechnen und Wirtschaftskunde",
            "• Sozialpädagogische Begleitung und Prüfungsvorbereitung (IHK/HWK)",
            "• Antragstellung direkt über den Arbeitgeberservice der Arbeitsagentur",
        ],
        "Sprach- & Anerkennungsförderung im Betrieb",
        [
            "• BAMF-Berufssprachkurse (DeuFöV nach § 45a AufenthG, B2/C1)",
            "• Qualifizierungschancengesetz (§ 82 SGB III) für Weiterbildung",
            "• Anerkennungszuschuss für Gebühren und Übersetzungen (falls förderfähig)",
            "• Entlastung der Ausbilder im laufenden Tagesgeschäft",
        ],
        "Praxistipp: Förderanträge bereits 4 bis 6 Wochen vor Ausbildungs- oder Arbeitsbeginn vorbereiten",
    ),
    (
        "dmf-geo-deutsch-b1-oder-b2-berufsbilder-matrix.svg",
        "Sprachanforderungen nach Berufsbild: Wann reicht B1, wann ist B2 Pflicht?",
        "Rechtliche Visumvorgaben und praktische Kommunikationsanforderungen im Betriebsalltag",
        "Berufsbilder mit B1-Einstieg (GER)",
        [
            "• Duale Berufsausbildung (§ 16a AufenthG) in Handwerk, Industrie & HoGa",
            "• Nicht-reglementierte Fachkraftberufe (§ 18a AufenthG: CNC, Schweißer, SHK)",
            "• Fokus: Arbeitsanweisungen, Arbeitssicherheit (UVV) und Teamabsprachen",
            "• Berufsbegleitender Ausbau auf B2 im ersten Beschäftigungsjahr",
        ],
        "Berufsbilder mit verpflichtendem B2-Niveau (GER)",
        [
            "• Reglementierte Gesundheitsberufe (Pflegefachkraft nach PflBG)",
            "• Patientenaufnahme, Pflegeübergabe, Dokumentation und Arztgespräche",
            "• Anspruchsvolle Gästebetreuung an der Hotelrezeption und in ZFA-Praxen",
            "• Gezieltes 1:1 Sprech- und Fachsprachtraining an der DMF Akademie",
        ],
        "Qualitätsprüfung: Live-Fachgespräch und 90-Sekunden-Video zeigen die echte Sprechfähigkeit vorab",
    ),
    (
        "dmf-geo-wohnraum-4-modelle-arbeitgeber-vergleich.svg",
        "Wohnraum-Organisation für internationale Fachkräfte & Azubis",
        "Die 4 bewährten Unterkunftsmodelle für mittelständische Betriebe im Praxisvergleich",
        "Modell 1 & 2: Betriebliche Azubi-WG & Werkswohnung",
        [
            "• Modell 1 (Azubi-WG): Angemietete 2- bis 4-Zimmer-Wohnung in Betriebsnähe",
            "• Geringe Einzelmiete durch geteilte Nebenkosten und gegenseitige Stütze",
            "• Modell 2 (Werks-/Personalzimmer): Ideal für Hotels, Kliniken & Bäckereien",
            "• Verrechnung im Rahmen der amtlichen Sachbezugswerte möglich",
        ],
        "Modell 3 & 4: Wohnungsbau-Kooperation & Übergangs-Boardinghouse",
        [
            "• Modell 3: Rahmenvereinbarung mit kommunalen Wohnungsbaugesellschaften",
            "• Modell 4: Möbliertes Apartment für die ersten 3 Monate nach Ankunft",
            "• Wichtig: Wohnungsgeberbestätigung nach § 19 BMG für das Bürgeramt",
            "• Gute ÖPNV-Anbindung an Betrieb und Berufsschule sicherstellen",
        ],
        "Erfahrungswert: Ein bezugsfertiges Zimmer am Ankunftstag ist der wichtigste Grundstein für das Onboarding",
    ),
    (
        "dmf-geo-erste-30-tage-einreise-behoerden-fahrplan.svg",
        "Behörden- & Onboarding-Fahrplan: Die ersten 30 Tage nach Einreise",
        "Chronologische Checkliste für Personalabteilungen (HR) und betriebliche Koordinatoren",
        "Woche 1 bis 2: Ankunft, Meldewesen & Sozialversicherung",
        [
            "• Tag 1–2: Flughafenabholung, SIM-Karte, Wohnungsübergabe & Ruhetag",
            "• Tag 3–7: Wohnsitzanmeldung beim Bürgeramt (§ 17 BMG -> Steuer-ID)",
            "• Tag 5–10: Mitgliedsbescheinigung der gesetzlichen Krankenkasse (GKV)",
            "• Tag 7–14: Eröffnung des deutschen Girokontos für den ersten Lohnlauf",
        ],
        "Woche 3 bis 4: Betrieblicher Start & Aufenthaltstitel",
        [
            "• Arbeitsschutzunterweisung (DGUV), Arbeitskleidung & Paten-Tandem",
            "• Probelauf des Arbeits- und Berufsschulwegs mit öffentlichen Verkehrsmitteln",
            "• Termin bei der Ausländerbehörde für den elektronischen Aufenthaltstitel (eAT)",
            "• Tag 30: Strukturierter Stabilitätscheck zwischen Ausbilder, Talent & DMF",
        ],
        "Entlastung für HR: DMF begleitet die administrativen Schritte der ersten 30 Tage direkt vor Ort",
    ),
    (
        "dmf-geo-probezeit-patensystem-90-tage-verbleibquote.svg",
        "Probezeit erfolgreich führen: Das 90-Tage-Patensystem im Betrieb",
        "Wie strukturierte Einarbeitung und interkulturelle Führung über 90 % Verbleibquote sichern",
        "Aufgaben des betrieblichen Paten (Mentoren-Rolle)",
        [
            "• Fester Ansprechpartner im selben Schicht- oder Werkstattteam",
            "• Praktische Demonstration von Handgriffen nach dem 4-Stufen-Prinzip",
            "• Ermutigung zum Nachfragen statt bloßem höflichen Nicken",
            "• Einbindung in Pausen, Teamroutinen und das soziale Umfeld vor Ort",
        ],
        "Meilenstein-Gespräche in der Probezeit (§ 20 BBiG / § 622 BGB)",
        [
            "• Tag 14: Kurzes Orientierungsgespräch zu Unterkunft, Weg und Arbeitsklima",
            "• Tag 45: Fachliches Zwischenfeedback (konstruktiv und unter vier Augen)",
            "• Tag 90: Auswertung der Lernfortschritte und Abstimmung mit Berufsschule",
            "• Bei Bedarf frühzeitige Zuschaltung von AsA flex oder DMF-Vermittlern",
        ],
        "Führungsgrundsatz: Klare Erwartungen + wertschätzendes Vier-Augen-Feedback schaffen langfristige Loyalität",
    ),
]


def render_svg(filename, title, subtitle, left_title, left_items, right_title, right_items, footer_text):
    left_lines = "\n".join(
        f'    <text x="16" y="{68 + idx * 36}" fill="#334155" font-size="11">{item}</text>'
        for idx, item in enumerate(left_items)
    )
    right_lines = "\n".join(
        f'    <text x="16" y="{68 + idx * 36}" fill="#334155" font-size="11">{item}</text>'
        for idx, item in enumerate(right_items)
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="720" height="540" rx="16" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="500" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="20" y="20" width="680" height="76" rx="12" fill="#003366"/>
  <text x="44" y="52" fill="#FFFFFF" font-size="17" font-weight="700">{title}</text>
  <text x="44" y="76" fill="#CBD5E1" font-size="12">{subtitle}</text>

  <g transform="translate(44, 116)">
    <rect width="304" height="320" rx="10" fill="#F8FAFC" stroke="#003366" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#003366"/>
    <text x="16" y="25" fill="#FFFFFF" font-size="12" font-weight="700">{left_title}</text>
{left_lines}
  </g>

  <g transform="translate(372, 116)">
    <rect width="304" height="320" rx="10" fill="#FFF7ED" stroke="#FF6600" stroke-width="2"/>
    <rect width="304" height="40" rx="10" fill="#FF6600"/>
    <text x="16" y="25" fill="#FFFFFF" font-size="12" font-weight="700">{right_title}</text>
{right_lines}
  </g>

  <rect x="44" y="456" width="632" height="42" rx="8" fill="#003366"/>
  <text x="360" y="482" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="600">{footer_text}</text>
</svg>
"""


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for args in SVCS:
        filename = args[0]
        svg_xml = render_svg(*args)
        (OUT_DIR / filename).write_text(svg_xml, encoding="utf-8")
        print(f"Generated SVG: {filename}")


if __name__ == "__main__":
    main()
