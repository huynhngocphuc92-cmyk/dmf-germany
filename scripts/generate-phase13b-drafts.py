#!/usr/bin/env python3
"""
Generate 7 Phase 13B B2B GEO Flagship Blog Articles (Posts 167 to 173).
Owned exclusively by drafts-b:
- scripts/generate-phase13b-drafts.py
- content/drafts/167-<slug>.md .. 173-<slug>.md

Guaranteed compliance:
- Exact YAML frontmatter matching docs/PHASE_13_BLOG_PLAN.md verbatim
- Opening **Das Wichtigste in Kürze:** paragraph matching docs/PHASE_13_BLOG_PLAN.md
- 3 approved ## ...? headings, each immediately followed by a direct 2-sentence answer (>= 45 words)
  and a second analytical paragraph
- 1 operational non-question ## section for practical B2B depth
- Exact 4-row Markdown comparison table
- Standalone SVG diagram + italic caption
- 2-3 assigned <figure class="dmf-community-figure"> Google Drive community photos placed AFTER
  section paragraphs (never between ## ...? and its first <p>, never duplicating cover_image)
- Closing ### Nächster Schritt für Ihren Betrieb with verified internal routes
- 100% formal German ("Sie / Ihnen / Ihr"), 0 informal pronouns, 0 AI_PATTERNS, 0 "nicht nur ... sondern auch"
- 700-900 words per article, strict FACTS_GUARDRAIL compliance
"""

import json
import re
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DRAFTS_DIR = ROOT_DIR / "content" / "drafts"


def render_figure(fig: dict) -> str:
    return (
        '<figure class="dmf-community-figure">\n'
        "  <img\n"
        f'    src="{fig["src"]}"\n'
        f'    alt="{fig["alt"]}"\n'
        '    width="1200"\n'
        '    height="675"\n'
        '    loading="lazy"\n'
        "  />\n"
        "  <figcaption>\n"
        f'    <strong>{fig["lead"]}</strong> {fig["caption"]}\n'
        "  </figcaption>\n"
        "</figure>"
    )


ARTICLES = [
    # 167: Verfahrensmechaniker für Kunststoff- und Kautschuktechnik
    {
        "num": 167,
        "slug": "verfahrensmechaniker-kunststoff-kautschuk-vietnam-ihk",
        "title": "Verfahrensmechaniker für Kunststoff- und Kautschuktechnik aus Vietnam: Fachkräfte für Spritzguss & Extrusion",
        "meta_title": "Verfahrensmechaniker Kunststoff aus Vietnam: IHK & § 81a",
        "meta_description": "Verfahrensmechaniker für Kunststoff- und Kautschuktechnik (Kunststofftechnologen) aus Vietnam gewinnen: 7 IHK-Fachrichtungen, IHK FOSA, § 16d und § 16a.",
        "keywords": [
            "Verfahrensmechaniker Kunststoff- und Kautschuktechnik Vietnam",
            "Kunststoff- und Kautschuktechnologen IHK FOSA",
            "Spritzguss Fachkräfte § 16d § 18a",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Wie Spritzguss-, Extrusions- und Faserverbundbetriebe über § 16a, § 16d Abs. 3 und § 18a AufenthG qualifizierte Kunststofftechnologen aus Vietnam für den Schichtbetrieb gewinnen.",
        "cover_image": "/images/blog/dmf-kunststoff-spritzguss-verfahrensmechaniker.jpg",
        "svg": "/images/blog/kunststofftechnologe-verfahrensmechaniker-fachrichtungen.svg",
        "svg_alt": "Qualifikationspfade und IHK-Fachrichtungen für Kunststoff- und Kautschuktechnologen aus Vietnam nach KldB 22102",
        "svg_caption": "Verbindung der sieben IHK-Fachrichtungen nach Neuordnung 2023 (KldB 22102) mit den Zuwanderungspfaden § 16a, § 16d Abs. 3 und § 18a AufenthG.",
        "tldr": "Deutsche Spritzguss-, Extrusions- und Faserverbundbetriebe gewinnen dringend benötigte Verfahrensmechaniker für Kunststoff- und Kautschuktechnik (seit August 2023 offiziell Kunststoff- und Kautschuktechnologen, KldB 22102) aus Vietnam über die dreijährige IHK-Ausbildung (§ 16a AufenthG) oder die Fachkräfteeinwanderung (§ 18a / § 16d Abs. 3 AufenthG). Die Gleichwertigkeitsprüfung über die IHK FOSA nach BQFG sowie die sieben spezialisierten Fachrichtungen von Formteilen bis Faserverbund lassen sich gezielt auf vietnamesische Fertigungsprofile abstimmen.",
        "intro": "Kunststoffverarbeitende Unternehmen in Automobilzulieferung, Medizintechnik und Bauprofilfertigung halten hochautomatisierte Spritzguss- und Extrusionslinien im Mehrschichtbetrieb rund um die Uhr am Laufen. Wenn Stellen für Anlagenführung und Werkzeugwechsel monatelang unbesetzt bleiben, sichern sich Werke unter anderem in [Baden-Württemberg](/fuer-arbeitgeber/standorte/baden-wuerttemberg) und [Bayern](/fuer-arbeitgeber/standorte/bayern) qualifizierten Nachwuchs aus Vietnam.",
        "table_headers": [
            "IHK-Fachrichtung (KldB 22102)",
            "Typische Industrieabnehmer",
            "Geeigneter Zuwanderungspfad",
            "Praxisfokus & Einarbeitung",
        ],
        "table_rows": [
            [
                "Formteile (Spritzgießen & Blasformen)",
                "Automotive-Zulieferer, Medizintechnik, Verpackung",
                "§ 16a Ausbildung (3 J.) oder § 16d Abs. 3 / § 18a",
                "Werkzeugwechsel, Prozessparameter, Qualitätsprüfung nach Zeichnung",
            ],
            [
                "Halbzeuge (Extrusion & Kalandrieren)",
                "Bauprofile, Folien-, Rohr- und Plattenhersteller",
                "§ 18a (IHK FOSA) oder § 16a Duale Ausbildung",
                "Liniensteuerung, Materialdosierung, Schichtübergabe B1",
            ],
            [
                "Faserverbundtechnologie & Bauteile",
                "Windkraft, Luftfahrtzulieferer, Apparatebau",
                "§ 16a Ausbildung oder IHK-FOSA-Defizitausgleich",
                "CFK-/GFK-Verarbeitung, Laminieren, Arbeitsschutz GefStoffV",
            ],
            [
                "Mehrschichtkautschuk & Compound-/Masterbatch",
                "Technische Gummiwaren, Dichtungen, Rohstoffaufbereitung",
                "§ 16d Abs. 3 Anerkennungspartnerschaft (sofortiger Start)",
                "Rezepturgenauigkeit, Vulkanisation, Zusatzmodul Kreislaufwirtschaft",
            ],
        ],
        "sections": [
            (
                "Was ändert die Neuordnung zum Kunststoff- und Kautschuktechnologen für das Recruiting aus Vietnam?",
                "Seit August 2023 trägt der dreijährige Ausbildungsberuf offiziell die Bezeichnung Kunststoff- und Kautschuktechnologe (KldB 22102) und verankert neben Digitalisierung sowie vernetzter Anlagensteuerung erstmals verbindliche Inhalte zur Kreislaufwirtschaft und zum Rezyklateinsatz. Für vietnamesische Fachkräfte bedeutet diese Aktualisierung, dass Anerkennungsstellen und Betriebe neben Maschinenkenntnissen gezielt Kompetenzen in Prozessdokumentation und Qualitätssicherung prüfen.",
                "Für Personalabteilungen greifen bei der dualen Ausbildung nach § 16a AufenthG alle sieben Fachrichtungen – Formteile, Halbzeuge, Mehrschichtkautschukteile, Bauteile, Faserverbundtechnologie, Kunststofffenster sowie Compound- und Masterbatchherstellung – im ersten Jahr auf eine gemeinsame Polymer-Grundbildung zurück. Bei erfahrenen Fachkräften wird dagegen jene Fachrichtung gewählt, die dem betrieblichen Maschinenpark entspricht.",
            ),
            (
                "Wie verläuft die IHK-FOSA-Anerkennung für erfahrene Spritzguss- und Extrusionstechniker nach dem BQFG?",
                "Für den direkten Einstieg als Fachkraft nach § 18a AufenthG prüft die IHK FOSA in Nürnberg gemäß dem Berufsqualifikationsfeststellungsgesetz (BQFG) die Gleichwertigkeit des vietnamesischen Abschlusses samt beglaubigten Stundentafeln und Arbeitszeugnissen anhand der deutschen Ausbildungsordnung. Im beschleunigten Fachkräfteverfahren nach § 81a AufenthG verkürzt sich diese behördliche Prüffrist nach § 14a BQFG gesetzlich auf maximal zwei Monate ab vollständiger Aktenlage.",
                "Besitzt ein Kandidat einen mindestens zweijährigen staatlich anerkannten Abschluss im Maschinenbau oder der Fertigungstechnik ohne unmittelbare Vollanerkennung, eröffnet die Anerkennungspartnerschaft nach § 16d Abs. 3 AufenthG einen flexiblen Einstieg. Tarifgebundene Betriebe (§ 3 / § 5 TVG) beschäftigen den Mitarbeitenden sofort im Werk und gleichen fehlende Module berufsbegleitend nach dem Bescheid aus.",
            ),
            (
                "Welche Fachrichtungen der Kunststofftechnik eignen sich besonders für den Einstieg nach § 16a oder § 16d AufenthG?",
                "Die Fachrichtungen Formteile und Halbzeuge eignen sich besonders gut für den Einstieg über § 16d Abs. 3 oder § 18a AufenthG, weil viele vietnamesische Fachschulen und Zulieferbetriebe bereits an vergleichbaren Spritzgießmaschinen, Extrudern und Peripheriegeräten ausbilden. Dagegen empfiehlt sich bei spezialisierten Bereichen wie Faserverbundtechnologie oder komplexer Compoundierung häufig die dreijährige duale Ausbildung nach § 16a AufenthG mit systematischer Berufsschulbegleitung.",
                "Unabhängig vom Paragraphen sollten Werke die Gefahrstoffverordnung (GefStoffV) beim Umgang mit Harzen und Additiven, das Lesen technischer Zeichnungen sowie klare Schichtübergaben fest einplanen. Ein stabiles B1-Sprachniveau sichert verständliche Meldungen bei Prozessabweichungen am Bedienpanel.",
            ),
        ],
        "operational_heading": "Betriebliche Vorbereitung für Schichtbetrieb und Arbeitssicherheit",
        "operational_intro": "In den ersten 60 Tagen sichert eine klare Einarbeitungsstruktur an Spritzgießwerkzeugen, Extrusionslinien und Trocknern die Produktionsqualität:",
        "operational_bullets": [
            "Gleichen Sie reale Bauteilzeichnungen und Maschinentypen vorab mit der passenden IHK-Fachrichtung ab.",
            "Führen Sie die gesetzliche GefStoffV-Unterweisung und PSA-Einweisung in Woche eins mit der Sicherheitsfachkraft durch.",
            "Setzen Sie in den ersten drei Monaten auf ein festes Schicht-Tandem vor der eigenständigen Nachtschicht.",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c0716.jpg",
                "alt": "Vollzeit-Deutschunterricht und interkulturelle Sprachpraxis mit deutscher Delegation in der DMF Talents Akademie",
                "lead": "Vollzeit-Sprachakademie für die Kunststoffindustrie:",
                "caption": "In modernen, verglasten Seminarräumen der DMF Talents Akademie trainieren künftige Auszubildende und Fachkräfte strukturierte Schichtkommunikation auf Niveau B1 bis B2.",
            },
            {
                "src": "/images/community/dmf-p13-c0077.jpg",
                "alt": "Intensiver Deutschunterricht durch Dozent Thầy Lộc an der DMF Akademie mit Fokus auf Lerndisziplin",
                "lead": "Strukturierte Lerndisziplin vor der Ausreise:",
                "caption": "Unter Anleitung erfahrener Lehrkräfte wie Thầy Lộc sichern tägliche Übungsphasen eine verlässliche Fachtheorie-Basis für die IHK-Ausbildung.",
            },
            {
                "src": "/images/community/dmf-p13-c1315.jpg",
                "alt": "Fachunterrichtsraum am DMF-Campus für technische Terminologie und Prüfungsvorbereitung",
                "lead": "Praxisnahe Campus-Infrastruktur:",
                "caption": "In spezialisierten Unterrichtsräumen bereitet DMF Talents Bewerber gezielt auf Fachbegriffe aus Spritzguss, Extrusion und Arbeitssicherheit vor.",
            },
        ],
        "cta_text": "Stellen Sie Ihren Bedarf für Spritzguss, Extrusion oder Faserverbund rechtssicher auf: Vergleichen Sie unsere [Branchenlösungen für Industrie, Metall & Technik](/fuer-arbeitgeber/branchen/industrie-metall-technik), regionale Abläufe in [Baden-Württemberg](/fuer-arbeitgeber/standorte/baden-wuerttemberg), unser [Fachkräfteprogramm](/services/skilled-workers) sowie das [Azubi-Programm](/services/azubi) und senden Sie Ihre Eckdaten über die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf).",
    },
    # 168: ZSEF Nürnberg & LfP Amberg Fast-Lane
    {
        "num": 168,
        "slug": "zsef-nuernberg-bayern-81a-lfp-amberg-fast-lane",
        "title": "ZSEF Nürnberg & LfP Amberg im „Fast-Lane“-Verfahren: § 81a-Behördenleitfaden für bayerische Arbeitgeber",
        "meta_title": "ZSEF Nürnberg & LfP Amberg: § 81a Fast-Lane Bayern Guide",
        "meta_description": "Verfahrensleitfaden für Bayern: Wann die ZSEF Nürnberg zwingend zuständig ist, wie das LfP Amberg in der Fast-Lane prüft und welche § 81a-Fristen gelten.",
        "keywords": [
            "ZSEF Nürnberg § 81a AufenthG",
            "LfP Amberg Fast-Lane Pflege Bayern",
            "Fachkräfteeinwanderung Bayern Arbeitgeber",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Praxisleitfaden für Arbeitgeber in Bayern: Wann Sie zwischen ZSEF Nürnberg und örtlicher Ausländerbehörde wählen können und wie die Pflege-Fast-Lane mit dem LfP Amberg abläuft.",
        "cover_image": "/images/blog/dmf-zsef-nuernberg-bayern-behoerden-dossier.jpg",
        "svg": "/images/blog/zsef-nuernberg-lfp-amberg-fast-lane-workflow.svg",
        "svg_alt": "Verfahrensfluss in Bayern: Pflege-Fast-Lane über ZSEF Nürnberg und LfP Amberg im Vergleich zum Wahlrecht bei IHK- und HWK-Berufen",
        "svg_caption": "Getrennte Zuständigkeitsbahnen nach § 81a AufenthG in Bayern: exklusive Pflege-Fast-Lane über ZSEF Nürnberg und LfP Amberg sowie Wahlrecht für IHK-, HWK- und Azubi-Anträge.",
        "tldr": "In Bayern bündelt die Zentrale Stelle für die Einwanderung von Fachkräften (ZSEF) bei der Regierung von Mittelfranken in Nürnberg das beschleunigte Fachkräfteverfahren nach § 81a AufenthG. Während bei regulären IHK- und HWK-Berufen ein Wahlrecht zwischen der ZSEF und der örtlichen Ausländerbehörde besteht, ist die ZSEF für Pflege- und Gesundheitsfachberufe in der bayerischen „Fast Lane“ gemeinsam mit dem Bayerischen Landesamt für Pflege (LfP) in Amberg zentral zuständig (411 EUR Gebühr nach § 47 Abs. 1 Nr. 15 AufenthV).",
        "intro": "Für Kliniken, Pflegeheime und Mittelstandsbetriebe im Freistaat entscheidet die richtige Zuständigkeitswahl am ersten Tag über Wochen bei der Einreise internationaler Bewerber. Aufbauend auf unserem allgemeinen Praxisüberblick zum [beschleunigten Fachkräfteverfahren nach § 81a AufenthG](/blog/beschleunigtes-fachkraefteverfahren-81a-unterlagen-fristen-praxis) zeigt dieser Leitfaden die verbindliche bayerische Behördenstruktur.",
        "table_headers": [
            "Verfahrenskonstellation in Bayern",
            "Zuständige § 81a-Behörde",
            "Anerkennungsstelle",
            "Gesetzliche Frist & Gebühr (§ 81a / § 47 AufenthV)",
        ],
        "table_rows": [
            [
                "Pflegefachkräfte & Gesundheitsfachberufe („Fast Lane“)",
                "ZSEF Nürnberg (Regierung von Mittelfranken – exklusiv)",
                "Bayerisches Landesamt für Pflege (LfP), Amberg",
                "411 EUR Gebühr; max. 2 Mon. LfP + 1 Wo. ZAV + 3+3 Wo. Visum",
            ],
            [
                "IHK-Berufe (Industrie, Gastro, IT, Logistik)",
                "Wahlrecht: ZSEF Nürnberg oder örtliche Ausländerbehörde",
                "IHK FOSA (Nürnberg) / entfällt bei § 16a Azubi",
                "411 EUR Gebühr; max. 2 Mon. IHK FOSA (§ 14a BQFG)",
            ],
            [
                "Handwerksberufe (SHK, Elektro, Bau, Gesundheitshandwerk)",
                "Wahlrecht: ZSEF Nürnberg oder örtliche Ausländerbehörde",
                "Zuständige bayerische HWK (München, Nürnberg, Schwaben u. a.)",
                "411 EUR Gebühr; max. 2 Mon. HWK ab Vollständigkeit",
            ],
            [
                "Duale Auszubildende (§ 16a AufenthG)",
                "ZSEF Nürnberg oder örtliche Ausländerbehörde",
                "Keine BQFG-Anerkennung (nur IHK/HWK-Vertragseintragung)",
                "411 EUR Gebühr; Entfall 2-Monats-Anerkennungsfrist",
            ],
        ],
        "sections": [
            (
                "Wann besteht in Bayern ein Wahlrecht zwischen ZSEF Nürnberg und örtlicher Ausländerbehörde?",
                "Bei nicht-reglementierten Ausbildungsberufen in Industrie, Handel, Gastronomie oder Handwerk sowie bei dualen Ausbildungsverhältnissen nach § 16a AufenthG wählen bayerische Arbeitgeber frei zwischen der ZSEF in Nürnberg und ihrer kommunalen Ausländerbehörde. Für Pflege- und Gesundheitsfachberufe hingegen gilt in der bayerischen „Fast Lane“ eine zwingende Zentralzuständigkeit der ZSEF Nürnberg gemeinsam mit dem Landesamt für Pflege (LfP) in Amberg.",
                "Dieses Wahlrecht zugunsten der ZSEF empfiehlt sich besonders dann, wenn örtliche Ausländerbehörden selten § 81a-Fälle bearbeiten. Die ZSEF bei der Regierung von Mittelfranken (Marienstraße 17, Nürnberg) nutzt eingespielte digitale Schnittstellen zur Bundesagentur für Arbeit (ZAV) sowie zur ebenfalls in Nürnberg ansässigen IHK FOSA.",
            ),
            (
                "Wie greifen ZSEF Nürnberg und das Landesamt für Pflege (LfP Amberg) in der „Fast Lane“ ineinander?",
                "Seit Juli 2023 prüft das Bayerische Landesamt für Pflege (LfP) in Amberg bayernweit zentral alle Anträge auf Berufsanerkennung für Pflegefachfrauen und Pflegefachmänner aus Drittstaaten. Im bayerischen „Fast-Lane“-Modell werden die Antragsunterlagen für die Berufsanerkennung beim LfP und die ausländerrechtliche Vorabzustimmung bei der ZSEF eng verzahnt, sodass Behördenrückfragen nicht mehr seriell über das Konsulat laufen.",
                "Für Kliniken und Seniorenheime gilt damit im § 81a-Verfahren ein fester Fristenrahmen von maximal zwei Monaten für das LfP ab vollständiger Aktenlage, gefolgt von einer Woche Zustimmungsfrist der ZAV nach § 36 Abs. 3 BeschV. Danach vergibt die Auslandsvertretung in Hanoi oder Ho-Chi-Minh-Stadt binnen drei Wochen den Visumtermin und entscheidet regelmäßig innerhalb weiterer drei Wochen.",
            ),
            (
                "Welche Unterlagen und Fristen gelten beim digitalen § 81a-Antrag in Bayern?",
                "Für den digitalen Start über das Online-Portal der ZSEF benötigen bayerische Betriebe die vom Bewerber unterzeichnete Vollmacht (gegebenenfalls samt Untervollmacht), eine farbige Passkopie, den unterschriebenen Arbeits- oder Ausbildungsvertrag sowie die Erklärung zum Beschäftigungsverhältnis (EzB). Ergänzend sind beglaubigte deutsche Übersetzungen von Abschlusszeugnissen, Stundentafeln sowie der geforderte Sprachnachweis hochzuladen.",
                "Die gesetzliche Verwaltungsgebühr nach § 47 Abs. 1 Nr. 15 AufenthV beträgt einheitlich 411 Euro bei Abschluss der Vereinbarung; hinzukommen gegebenenfalls Landesgebühren des LfP sowie 75 Euro Visumgebühr. Bei Auszubildenden nach § 16a AufenthG entfällt die zweimonatige Anerkennungsfrist komplett, weil nur Vertragseintragung und ZAV-Zustimmung nötig sind.",
            ),
        ],
        "operational_heading": "Praxis-Checkliste für Personalabteilungen in Bayern",
        "operational_intro": "Vermeiden Sie Nachforderungen von ZSEF oder LfP Amberg bereits vor dem digitalen Upload durch drei Prüfschritte:",
        "operational_bullets": [
            "Belegen Sie Praxisstunden aus der vietnamesischen Pflegeausbildung lückenlos tabellarisch für das LfP Amberg.",
            "Hinterlegen Sie bei Koordination durch Partner eine ausdrückliche Untervollmachtsklausel in der § 81a-Vollmacht.",
            "Prüfen Sie bei § 16d Abs. 3 AufenthG vorab Ihre Tarifbindung oder die Pflege-Ausnahme für § 72 SGB XI-Einrichtungen und koordinieren Sie die Ankunft über München (MUC) oder Nürnberg (NUE).",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c1101.jpg",
                "alt": "Kandidaten der DMF Talents Community in bayerischer Tracht beim deutsch-vietnamesischen Kulturprogramm",
                "lead": "Regionale Verbundenheit mit Bayern:",
                "caption": "Kulturelle Begegnungsprogramme am DMF-Campus machen bayerische Lebensart frühzeitig erlebbar und stärken die Bindung an Betriebe im Freistaat.",
            },
            {
                "src": "/images/community/dmf-p13-c0092.jpg",
                "alt": "Digitale Dokumentenprüfung für das § 81a-Verfahren am ZSEF-Bearbeitungsplatz bei DMF Talents",
                "lead": "Lückenlose Vorprüfung vor ZSEF-Einreichung:",
                "caption": "An digitalen Prüfplätzen kontrolliert das Verfahrensteam von DMF Talents Vollmachten, Übersetzungen und Stundentafeln vor dem Upload beim bayerischen Portal.",
            },
            {
                "src": "/images/community/dmf-p13-c1328.jpg",
                "alt": "Deutscher Fachexperte bewertet Kandidaten im strukturierten Auswahlinterview an der DMF Akademie",
                "lead": "Deutsches Qualitäts-Gate vor dem Arbeitsvertrag:",
                "caption": "Vor dem § 81a-Antrag bei der ZSEF Nürnberg prüfen deutsche Fachexperten Sprachfluss und Verlässlichkeit im simulierten Vorstellungsgespräch.",
            },
        ],
        "cta_text": "Planen Sie Ihr bayerisches § 81a-Verfahren ohne Verzögerung: Nutzen Sie unseren [Standort-Leitfaden für Bayern](/fuer-arbeitgeber/standorte/bayern), die Branchenlösung [Pflege & Gesundheit](/fuer-arbeitgeber/branchen/pflege-gesundheit) sowie den [Zeitplan-Simulator (§ 81a)](/fuer-arbeitgeber/zeitplan), oder besprechen Sie Ihren Bedarf über das [Fachkräfteprogramm](/services/skilled-workers) und die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf).",
    },
    # 169: ZFE NRW (Bonn/Bezirksregierung Köln) & ZAG Münster
    {
        "num": 169,
        "slug": "zfe-nrw-bonn-bezirksregierung-koeln-zag-muenster-81a",
        "title": "ZFE NRW (Bonn/Bezirksregierung Köln) & ZAG Münster: § 81a-Zuständigkeiten für Arbeitgeber in NRW",
        "meta_title": "ZFE NRW Bonn & ZAG Münster: § 81a Leitfaden Arbeitgeber",
        "meta_description": "§ 81a AufenthG in Nordrhein-Westfalen: Zuständigkeit der ZFE NRW (Bonn/Bezirksregierung Köln), ZAG Münster für Pflege und Abgrenzung zur Pflegekammer.",
        "keywords": [
            "ZFE NRW Bonn Bezirksregierung Köln",
            "ZAG Münster Pflege Anerkennung",
            "§ 81a AufenthG Nordrhein-Westfalen",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Klare Zuständigkeitsverteilung für Arbeitgeber in Nordrhein-Westfalen: Welche Rolle ZFE NRW in Bonn, ZAG Münster, LPA Düsseldorf, Pflegekammer NRW und kommunale Ausländerämter im § 81a-Prozess übernehmen.",
        "cover_image": "/images/blog/dmf-zfe-nrw-bonn-behoerden-koordination.jpg",
        "svg": "/images/blog/zfe-nrw-bonn-zag-muenster-zustaendigkeiten.svg",
        "svg_alt": "Zuständigkeitsarchitektur in Nordrhein-Westfalen mit ZFE NRW Bonn, ZAG Münster, IHK FOSA und Pflegekammer NRW",
        "svg_caption": "Behördenzusammenspiel für Arbeitgeber in NRW: ZFE NRW (Bezirksregierung Köln/Bonn) als zentrale § 81a-Leitstelle, ZAG Münster bzw. Kammern für Anerkennung sowie kommunale Ausländerbehörden nach Einreise.",
        "tldr": "In Nordrhein-Westfalen ist für jedes beschleunigte Fachkräfteverfahren nach § 81a AufenthG, bei dem sich die Fachkraft oder der Azubi noch im Ausland befindet, zentral die Zentralstelle Fachkräfteeinwanderung NRW (ZFE NRW) bei der Bezirksregierung Köln mit Dienstsitz in Bonn zuständig – nicht das örtliche Ausländeramt. Für Pflege- und Gesundheitsfachberufe übernimmt die ZAG bei der Bezirksregierung Münster die Gleichwertigkeitsprüfung, während die IHK Wuppertal-Solingen-Remscheid eine regionale IHK-FOSA-Ausnahme bildet.",
        "intro": "Unternehmen und Klinikverbünde in Nordrhein-Westfalen wenden sich bei der erstmaligen Rekrutierung aus Drittstaaten oft irrtümlich an das kommunale Ausländeramt ihrer Stadt, obwohl für Auslandsanträge landesweit eine eigene Zentralbehörde eingerichtet wurde. Wer die Schnittstellen zwischen Bonn, Münster, Düsseldorf und dem eigenen Betriebssitz vorab sauber trennt – etwa für [Pflegekräfte in NRW-Kliniken](/blog/pflegekraefte-vietnam-nordrhein-westfalen-nrw-kliniken) –, vermeidet unnötige Weiterleitungen.",
        "table_headers": [
            "Behörde / Kammer in NRW",
            "Zentrale Zuständigkeit im Recruiting",
            "Verfahrensschritt",
            "Wichtige Abgrenzung für HR",
        ],
        "table_rows": [
            [
                "ZFE NRW (Bezirksregierung Köln, Dienstsitz Bonn)",
                "Landesweit für alle § 81a AufenthG-Anträge aus dem Ausland",
                "§ 81a-Vereinbarung, Vorabzustimmung, 411 EUR Gebühr",
                "Kommunale Ausländerämter erst nach Einreise für eAT zuständig",
            ],
            [
                "ZAG-PuG & ZAG-aH (Bezirksregierung Münster)",
                "Landesweite Anerkennung Pflege-, Gesundheits- & Heilberufe",
                "Gleichwertigkeitsprüfung, Defizitbescheid (max. 2 Mon. im § 81a)",
                "Nicht zu verwechseln mit LPA Düsseldorf (Inlands-Staatsexamen)",
            ],
            [
                "Pflegekammer NRW",
                "Berufsständische Pflichtregistrierung nach Berufszulassung",
                "Registrierung nach erteilter Erlaubnis zum Führen der Berufsbezeichnung",
                "Kein Defizitbescheid und keine Gleichwertigkeitsprüfung",
            ],
            [
                "IHK FOSA / IHK Wuppertal / NRW-HWKs",
                "Anerkennung dualer IHK- und Handwerksberufe (BQFG)",
                "Gleichwertigkeitsbescheid im Vorfeld oder über ZFE NRW",
                "IHK Wuppertal-Solingen-Remscheid prüft eigenständig außerhalb IHK FOSA",
            ],
        ],
        "sections": [
            (
                "Warum ist in NRW die ZFE Bonn statt der kommunalen Ausländerbehörde für § 81a AufenthG zuständig?",
                "Nordrhein-Westfalen hat die Zuständigkeit für das beschleunigte Fachkräfteverfahren bei noch im Ausland lebenden Bewerbern per Zuständigkeitsverordnung zentral bei der ZFE NRW (Bezirksregierung Köln, Dienstsitz Bonn) gebündelt, sodass anders als in Bayern kein Wahlrecht mit dem kommunalen Ausländeramt besteht. Kommunale Ausländerbehörden in Köln, Düsseldorf, Dortmund oder Essen werden erst nach erfolgter Einreise für den elektronischen Aufenthaltstitel (eAT) zuständig.",
                "Diese Zentralisierung entlastet kommunale Ausländerämter erheblich und sichert einheitliche Prüfmaßstäbe bei der Vorabzustimmung nach § 81a AufenthG. Zudem arbeitet die ZFE NRW räumlich nahe mit der ZAV der Bundesagentur für Arbeit in Bonn zusammen, deren Zustimmungspflicht im beschleunigten Verfahren nach § 36 Abs. 3 BeschV auf eine Woche begrenzt ist.",
            ),
            (
                "Wie trennen sich die Aufgaben von ZAG Münster, Landesprüfungsamt Düsseldorf und Pflegekammer NRW?",
                "Für die Gleichwertigkeitsprüfung ausländischer Pflege-, Gesundheits- und Heilberufe ist in ganz Nordrhein-Westfalen die Zentrale Anerkennungsstelle bei der Bezirksregierung Münster (ZAG-PuG für Pflege- und Gesundheitsberufe sowie ZAG-aH für akademische Heilberufe) zuständig. Das Landesprüfungsamt (LPA) Düsseldorf sowie die Pflegekammer NRW stellen hingegen keine Defizitbescheide für Drittstaats-Abschlüsse aus: Das LPA betreut inländische Staatsexamina, während die Pflegekammer NRW erst nach erteilter Berufserlaubnis die Registrierung übernimmt.",
                "Bei dualen Handwerksberufen entscheidet weiterhin die örtliche Handwerkskammer wie etwa die HWK Düsseldorf, Köln, Dortmund oder Münster. Bei BBiG-Berufen prüft regelmäßig die IHK FOSA, mit Ausnahme des Bezirks der IHK Wuppertal-Solingen-Remscheid, die BQFG-Verfahren eigenständig vor Ort abwickelt.",
            ),
            (
                "Wie reichen NRW-Betriebe das § 81a-Verfahren digital über das Portal der Bezirksregierung Köln ein?",
                "Arbeitgeber in Nordrhein-Westfalen übermitteln den Antrag auf Abschluss einer § 81a-Vereinbarung elektronisch über das digitale Fachportal der Bezirksregierung Köln an die ZFE NRW, wobei die 411-Euro-Gebühr (§ 47 Abs. 1 Nr. 15 AufenthV) direkt im Verfahren erhoben wird. Alle Unterlagen – Vollmacht, Passkopie, Vertrag, EzB, Sprachzertifikat und beglaubigte Übersetzungen – müssen vorab vollständig und lesbar als strukturierte PDF-Dateien vorliegen.",
                "Der Durchlauf beschleunigt sich deutlich, wenn vorab geklärt ist, ob ein Bescheid von ZAG Münster, IHK oder HWK bereits vorliegt oder über die ZFE NRW eingeleitet wird. Bei Auszubildenden nach § 16a AufenthG entfällt das Anerkennungsverfahren komplett, sodass nach Kammer-Eintragung des Ausbildungsvertrags lediglich die ZAV-Zustimmung einzuholen ist.",
            ),
        ],
        "operational_heading": "Ankunft und Übergang zur kommunalen Ausländerbehörde in NRW",
        "operational_intro": "Nach Visumerteilung in Vietnam reisen Fachkräfte und Azubis meist über Düsseldorf (DUS) oder Köln/Bonn (CGN) ein und wechseln vor Ort in die kommunale Betreuung:",
        "operational_bullets": [
            "Melden Sie den Mitarbeitenden binnen 14 Tagen beim Einwohnermeldeamt für Steuer-ID und Krankenkassenanmeldung an.",
            "Beantragen Sie rechtzeitig vor Ablauf des Einreisevisums bei der kommunalen Ausländerbehörde die Umschreibung in den eAT.",
            "Veranlassen Sie bei Pflegekräften unmittelbar nach Erteilung der Berufserlaubnis die gesetzliche Registrierung bei der Pflegekammer NRW.",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c1427.jpg",
                "alt": "Deutscher Trainer im Seminar mit der Lernkohorte K24 an der DMF Talents Akademie",
                "lead": "Gezielte Vorbereitung auf den Einsatz in Nordrhein-Westfalen:",
                "caption": "In interaktiven Seminaren mit deutschen Trainern entwickeln Kohorten wie K24 die sprachliche Routine für Kliniken, Industrie und Handwerk an Rhein und Ruhr.",
            },
            {
                "src": "/images/community/dmf-p13-c1312.jpg",
                "alt": "Eingangsbereich der DMF Talents Akademie mit deutsch-vietnamesischer Beflaggung und Lernplätzen",
                "lead": "Institutionelle Standards für ZFE-Verfahren:",
                "caption": "Am Campus in Ho-Chi-Minh-Stadt verbinden sich transparente Dokumentationsprozesse für die ZFE NRW und ZAG Münster mit verlässlicher Vor-Ort-Betreuung.",
            },
        ],
        "cta_text": "Nutzen Sie für Ihre Planung in NRW unseren [Standort-Leitfaden für Nordrhein-Westfalen](/fuer-arbeitgeber/standorte/nordrhein-westfalen) sowie die bundesweite [Standorte-Übersicht](/fuer-arbeitgeber/standorte), prüfen Sie das Branchenprofil [Pflege & Gesundheit](/fuer-arbeitgeber/branchen/pflege-gesundheit) und berechnen Sie Ihre Fristen im [Zeitplan-Simulator (§ 81a)](/fuer-arbeitgeber/zeitplan) vor Ihrer [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf).",
    },
    # 170: IHK FOSA (Nürnberg) vs. Handwerkskammern (HWK)
    {
        "num": 170,
        "slug": "ihk-fosa-nuernberg-vs-handwerkskammern-hwk-bqfg-vergleich",
        "title": "IHK FOSA (Nürnberg) vs. Handwerkskammern (HWK): Zuständigkeiten, Gebühren & Fristen nach dem BQFG",
        "meta_title": "IHK FOSA vs. HWK: Zuständigkeiten, Gebühren & Fristen BQFG",
        "meta_description": "IHK FOSA oder Handwerkskammer? Abgrenzung nach HwO und BBiG, die 3 IHK-Ausnahmen, Gebührenrahmen (100–600 EUR) sowie 3-Monats- und 2-Monats-Fristen im BQFG.",
        "keywords": [
            "IHK FOSA Nürnberg vs Handwerkskammer HWK",
            "BQFG Gebühren Fristen § 6 § 14a",
            "IHK Hannover Braunschweig Wuppertal Anerkennung",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Welche Kammer entscheidet über den ausländischen Berufsabschluss nach dem BQFG? Vollständige Abgrenzung zwischen IHK FOSA, drei eigenständigen IHKs und 53 Handwerkskammern.",
        "cover_image": "/images/blog/dmf-ihk-fosa-hwk-anerkennung-dokumente.jpg",
        "svg": "/images/blog/ihk-fosa-vs-hwk-zustaendigkeit-fristen.svg",
        "svg_alt": "Entscheidungsbaum für BQFG-Anerkennungsstellen: IHK FOSA Nürnberg, 3 eigenständige IHKs und 53 regionale Handwerkskammern",
        "svg_caption": "Abgrenzung zwischen IHK-Berufen (BBiG) und Handwerksberufen (HwO Anlage A/B) samt gesetzlichen Bearbeitungsfristen nach § 6 Abs. 3 BQFG und § 14a BQFG.",
        "tldr": "Für die Gleichwertigkeitsprüfung nicht-reglementierter Ausbildungsberufe nach dem BQFG ist bei Industrie-, Handels- und Gastronomieberufen zentral die IHK FOSA in Nürnberg zuständig – mit Ausnahme der eigenständig prüfenden IHKs Hannover, Braunschweig und Wuppertal-Solingen-Remscheid. Bei Handwerksberufen der Handwerksordnung (HwO) entscheidet dagegen jeweils die örtliche Handwerkskammer am künftigen Betriebssitz. Die Bearbeitungsfrist beträgt regulär drei Monate (§ 6 Abs. 3 BQFG) und verkürzt sich im § 81a-Verfahren auf maximal zwei Monate (§ 14a BQFG).",
        "intro": "Bei der Einstellung beruflich qualifizierter Fachkräfte aus Vietnam nach § 18a AufenthG steht vor dem Visumantrag die Gleichwertigkeitsprüfung nach dem Berufsqualifikationsfeststellungsgesetz (BQFG). Gerade bei technisch verwandten Elektrotechnik- oder Metallberufen kostet ein Antrag bei der falschen Kammer Wochen an Vorlaufzeit; zugleich lohnt die Prüfung, ob eine [Anerkennungspartnerschaft nach § 16d Abs. 3 AufenthG](/blog/anerkennungspartnerschaft-16d-vs-18a-aufenthg-arbeitgeber-vergleich) die Vorab-Prüfung ersetzt.",
        "table_headers": [
            "Vergleichskriterium",
            "IHK FOSA (Zentralstelle Nürnberg)",
            "Eigenständige IHKs (Ausnahmen)",
            "Regionale Handwerkskammern (53 HWKs)",
        ],
        "table_rows": [
            [
                "Zuständige Berufsbilder & Abgrenzung",
                "BBiG-Industrie-, Handels- & Gastroberufe (z. B. Elektroniker Betriebstechnik, Chemikant, Koch)",
                "IHK Hannover, IHK Braunschweig, IHK Wuppertal-Solingen-Remscheid",
                "HwO-Berufe Anlage A/B (z. B. Elektroniker Gebäudetechnik, SHK, Kfz, Hörakustiker)",
            ],
            [
                "Örtliche Einreichungslogik",
                "Bundesweit zentral in Nürnberg (Ulmenstraße 52g)",
                "Direkt bei der jeweiligen Kammer des künftigen Arbeitsorts",
                "Immer bei der HWK des Betriebssitzes bzw. künftigen Arbeitsorts",
            ],
            [
                "Gebührenrahmen & Vorschuss",
                "100 bis 600 EUR (aufwandsabhängig; i. d. R. 600 EUR Vorauszahlung)",
                "Kammer-Gebührensatzung (typischerweise 100 bis 600 EUR)",
                "Regionale HWK-Gebührenordnung (oft ca. 100 bis 600 EUR)",
            ],
            [
                "Gesetzliche Prüfungsfrist (§ 6 / § 14a BQFG)",
                "3 Monate regulär (§ 6 Abs. 3) / max. 2 Monate im § 81a (§ 14a BQFG)",
                "Identische BQFG-Fristen (3 Mon. regulär / 2 Mon. im § 81a)",
                "Identische BQFG-Fristen (3 Mon. regulär / 2 Mon. im § 81a)",
            ],
        ],
        "sections": [
            (
                "Wie grenzen sich IHK FOSA und regionale Handwerkskammern bei technisch verwandten Berufen ab?",
                "Die Zuständigkeit richtet sich nach dem gewählten deutschen Referenzberuf und dessen gesetzlicher Zuordnung zum Berufsbildungsgesetz (BBiG) oder zur Handwerksordnung (HwO). Steht der künftige Einsatz in einem zulassungspflichtigen oder zulassungsfreien Handwerk der Anlage A oder B HwO – etwa als Elektroniker für Energie- und Gebäudetechnik, Anlagenmechaniker SHK oder Kfz-Mechatroniker –, prüft ausschließlich die örtliche Handwerkskammer am künftigen Betriebssitz.",
                "Handelt es sich um einen Industrie-, Gastronomie-, Logistik- oder Handelsberuf nach dem BBiG – etwa Industriemechaniker, Elektroniker für Betriebstechnik, Verfahrensmechaniker oder Koch –, führt regelmäßig die IHK FOSA in Nürnberg das Verfahren. Maßgeblich ist die klare Passung zwischen betrieblicher Tätigkeit im Arbeitsvertrag und dem gewählten Referenzberuf.",
            ),
            (
                "Welche Gebühren und gesetzlichen Bearbeitungsfristen gelten bei IHK FOSA und HWK nach dem BQFG?",
                "Sowohl bei der IHK FOSA als auch bei den 53 deutschen Handwerkskammern bewegt sich der Gebührenrahmen für ein Gleichwertigkeitsverfahren in aller Regel zwischen 100 und 600 Euro je nach Prüfaufwand, wobei die IHK FOSA standardmäßig einen Gebührenvorschuss von 600 Euro erhebt. Die gesetzliche Bearbeitungsfrist beträgt regulär drei Monate ab Eingang der vollständigen Unterlagen (§ 6 Abs. 3 BQFG) und verkürzt sich im § 81a-Verfahren zwingend auf maximal zwei Monate (§ 14a BQFG).",
                "Die Frist beginnt erst mit vollständiger Vorlage aller beglaubigten Übersetzungen, Stundentafeln und Arbeitszeugnisse. Fehlen Unterlagen unverschuldet oder reichen schriftliche Nachweise nicht aus, bietet die [Qualifikationsanalyse nach § 14 BQFG](/blog/qualifikationsanalyse-14-bqfg-nachweis-ohne-zeugnisse) über praktische Arbeitsproben einen gesetzlichen Ausweg.",
            ),
            (
                "Welche drei deutschen IHK-Bezirke prüfen Gleichwertigkeitsanträge eigenständig außerhalb der IHK FOSA?",
                "Zwar bündeln fast alle Industrie- und Handelskammern in Deutschland ihre Auslandsanerkennung bei der IHK FOSA in Nürnberg, doch drei Bezirke bilden eine wichtige Ausnahme: die IHK Hannover, die IHK Braunschweig und die IHK Wuppertal-Solingen-Remscheid. Arbeitgeber mit Arbeitsort in einem dieser drei Kammerbezirke reichen BBiG-Anerkennungsanträge direkt bei ihrer regionalen IHK ein und nicht in Nürnberg.",
                "Vor Antragstellung empfiehlt sich ein kurzer Abgleich über den IHK-Bezirksfinder anhand der Postleitzahl des Einsatzorts. Im § 81a-Verfahren steuert zudem die Ausländerbehörde beziehungsweise ZFE die Weiterleitung der Kammerakte, sodass Zahlungswege eindeutig geklärt sein sollten.",
            ),
        ],
        "operational_heading": "Praxis-Checkliste: Vollständige Akte vor dem Kammerantrag",
        "operational_intro": "Unklare Berufsbezeichnungen oder fehlende Stundennachweise verursachen die häufigsten Verzögerungen. Prüfen Sie vor dem Versand vier Punkte:",
        "operational_bullets": [
            "Legen Sie den deutschen Referenzberuf samt Fachrichtung (z. B. Betriebstechnik vs. Gebäudetechnik) eindeutig fest.",
            "Reichen Sie neben dem Abschlusszeugnis vollständige Fächer- und Stundentafeln sowie qualifizierte Arbeitszeugnisse ein.",
            "Sichern Sie Namenskonsistenz zwischen vietnamesischen Urkunden und Reisepass sowie eine klare Entscheidung zwischen § 18a und § 16d Abs. 3 AufenthG.",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c0154.jpg",
                "alt": "Unterschrift unter die Dokumenten-Checkliste vor Abreise gemeinsam mit dem DMF-Verfahrensteam",
                "lead": "Dokumentensicherheit bis zum Abflug:",
                "caption": "Vor der Ausreise werden übersetzte Ausbildungszeugnisse, Kammerbescheide der IHK FOSA oder HWK und Einreisedokumente gemeinsam per Checkliste gegengezeichnet.",
            },
            {
                "src": "/images/community/dmf-p13-c0057.jpg",
                "alt": "Dozent Thầy Khang im blauen DMF-Poloshirt beim Grammatik- und Fachsprachtraining am Whiteboard",
                "lead": "Präzise Fachsprache für die Kammerprüfung:",
                "caption": "Im Intensivunterricht bei Dozent Thầy Khang erarbeiten die Teilnehmenden die sprachliche Genauigkeit für schriftliche Nachweise und Anerkennungsmaßnahmen.",
            },
            {
                "src": "/images/community/dmf-p13-c1311.jpg",
                "alt": "Aufnahme- und Beratungsbereich der DMF Talents Akademie bei der digitalen Aktenführung",
                "lead": "Zentrale Aktenkoordinierung am Campus:",
                "caption": "Am Empfangs- und Beratungsschalter von DMF Talents werden Arbeitsbücher, Curricula und Beglaubigungen systematisch für deutsche Kammern erfasst.",
            },
        ],
        "cta_text": "Klären Sie die richtige Kammer und den passenden Zeithorizont für Ihre offenen Stellen: Informieren Sie sich in unserer [Standorte-Übersicht](/fuer-arbeitgeber/standorte), prüfen Sie die Branchenwege für [Handwerk & Bau](/fuer-arbeitgeber/branchen/handwerk-bau) sowie [Industrie, Metall & Technik](/fuer-arbeitgeber/branchen/industrie-metall-technik) und nutzen Sie unseren [Zeitplan-Simulator (§ 81a)](/fuer-arbeitgeber/zeitplan) sowie das [Fachkräfteprogramm](/services/skilled-workers).",
    },
    # 171: Gesellenprüfung Teil 1 & Teil 2 (GAP 1 / GAP 2) und Pflegeexamen bestehen
    {
        "num": 171,
        "slug": "gesellenpruefung-teil-1-teil-2-pflegeexamen-internationale-azubis",
        "title": "Gesellenprüfung Teil 1 & Teil 2 (GAP 1 / GAP 2) und Pflegeexamen bestehen: Betriebliche Prüfungsvorbereitung für internationale Azubis",
        "meta_title": "GAP 1/2 & Pflegeexamen: Prüfungsvorbereitung im Betrieb",
        "meta_description": "Wie bereiten Betriebe internationale Azubis auf GAP Teil 1/2 (§ 44 BBiG) und Pflegeexamen (PflBG) vor? Freistellung, AsA flex, Verlängerung (§ 21 BBiG).",
        "keywords": [
            "Gesellenprüfung Teil 1 Teil 2 GAP internationale Azubis",
            "Pflegeexamen PflAPrV Prüfungsvorbereitung",
            "§ 15 BBiG Freistellung § 21 Abs 3 BBiG",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Wie Ausbildungsbetriebe und Pflegeeinrichtungen vietnamesische Azubis im 2. und 3. Lehrjahr strukturiert auf GAP Teil 1/2 und das Pflegeexamen vorbereiten und rechtssicher in § 18a AufenthG übernehmen.",
        "cover_image": "/images/blog/dmf-p13-gesellenpruefung-pflegeexamen-azubis.jpg",
        "svg": "/images/blog/dmf-p13-171-gap-pflegeexamen-pruefungsfahrplan.svg",
        "svg_alt": "Zeitlicher Prüfungsfahrplan für internationale Azubis im zweiten und dritten Ausbildungsjahr bis zum Abschluss und Übergang in § 18a AufenthG",
        "svg_caption": "Meilensteine im 2. und 3. Ausbildungsjahr: von GAP Teil 1 über AsA flex (§ 75 SGB III) und DeuFöV (§ 45a AufenthG) bis zur Freistellung nach § 15 BBiG und Übernahme nach § 18a AufenthG.",
        "tldr": "Für internationale Auszubildende entscheidet die gezielte Prüfungsvorbereitung im zweiten und dritten Ausbildungsjahr über den erfolgreichen Abschluss vor IHK, HWK oder Pflegeprüfungsamt. Betriebe müssen nach § 15 BBiG für alle Prüfungen sowie am Arbeitstag unmittelbar vor der schriftlichen Abschlussprüfung freistellen. Kombiniert Ihr Unternehmen betriebliche Übungsaufträge mit AsA flex (§ 75 SGB III) und DeuFöV-Kursen (§ 45a AufenthG), schaffen Sie strukturierte Voraussetzungen für GAP Teil 1/2, Pflegeexamen und die anschließende Übernahme nach § 18a AufenthG.",
        "intro": "Viele Betriebe begleiten die ersten 90 Tage intensiv, betrachten das zweite und dritte Ausbildungsjahr aber als Selbstläufer. Internationale Auszubildende beherrschen praktische Abläufe meist sicher, stoßen jedoch bei Textaufgaben und Fachgesprächen auf sprachliche Hürden. Frühes Gegensteuern – ergänzend zu [Berufsschule, Fachtheorie und AsA flex](/blog/berufsschule-fachtheorie-asa-flex-vietnamesische-azubis) – beugt [Ausbildungsabbrüchen wirksam vor](/blog/ausbildungsabbrueche-verhindern-fruehwarnsignale-betreuung).",
        "table_headers": [
            "Prüfungsabschnitt / Meilenstein",
            "Rechtsgrundlage & Zuständigkeit",
            "Typische Hürde internationaler Azubis",
            "Konkrete Fördermaßnahme im Betrieb",
        ],
        "table_rows": [
            [
                "Gestreckte Gesellen-/Abschlussprüfung Teil 1 (GAP 1, ca. Monat 18)",
                "§§ 37, 44 BBiG / §§ 31, 36a HwO (IHK / HWK)",
                "Zeitdruck bei komplexen Textaufgaben & Fachbegriffen",
                "Probe-Arbeitsaufträge, Wörterbuch-Antrag prüfen, AsA flex (§ 75 SGB III)",
            ],
            [
                "Gestreckte Gesellen-/Abschlussprüfung Teil 2 (GAP 2) & Fachgespräch",
                "§§ 37, 44 BBiG / HwO (Prüfungsausschuss)",
                "Freies Erläutern des betrieblichen Auftrags im Fachgespräch",
                "Mock-Fachgespräche mit Meister/Ausbilder, Dokumentations-Review",
            ],
            [
                "Staatliche Abschlussprüfung Pflege (schriftlich, mündlich, praktisch)",
                "PflBG / §§ 9–17 PflAPrV (Pflegeschule & Landesamt)",
                "Pflegeplanung, Fallbeispiele & Übergabe unter Zeitdruck",
                "Gezielte Einsätze mit Praxisanleiter (§ 4 PflAPrV) & DeuFöV (§ 45a AufenthG)",
            ],
            [
                "Übergang nach bestandener Prüfung vs. Wiederholung",
                "§ 21 Abs. 2 & 3 BBiG; § 18a / § 16a / § 20 Abs. 1 Nr. 3 AufenthG",
                "Lückenhafter Aufenthaltstitel beim Statuswechsel",
                "Frühzeitige Verlängerung bei Nichtbestehen (§ 21 Abs. 3 BBiG) oder § 18a-Antrag",
            ],
        ],
        "sections": [
            (
                "Welche gesetzlichen Freistellungspflichten gelten für Betriebe nach § 15 BBiG vor der Abschlussprüfung?",
                "Nach § 15 Abs. 1 Satz 2 BBiG sind Ausbildungsbetriebe verpflichtet, Auszubildende unter Fortzahlung der Ausbildungsvergütung für sämtliche Teilnahmen an Prüfungen sowie für angeordnete Ausbildungsmaßnahmen außerhalb der Ausbildungsstätte freizustellen. Zusätzlich gewährt § 15 Abs. 1 Satz 2 Nr. 5 BBiG ausdrücklich einen bezahlten freien Tag an dem Arbeitstag, der der schriftlichen Abschlussprüfung unmittelbar vorangeht.",
                "Für Dienstpläne in Werkstatt oder Station gilt diese Freistellung bei gestreckten Prüfungen für Teil 1 und Teil 2 gleichermaßen. In der Pflegeausbildung sichern zudem das Pflegeberufegesetz (PflBG) und § 4 PflAPrV mindestens zehn Prozent geplante Praxisanleitung im Betrieb.",
            ),
            (
                "Wie lassen sich Fachtheorie, Fachgespräch und betrieblicher Auftrag in GAP 1, GAP 2 und Pflegeexamen gezielt trainieren?",
                "Da die gestreckte Gesellen- und Abschlussprüfung Teil 1 bereits etwa nach 18 Monaten mit erheblichem Gewicht in die Gesamtnote einfließt, sollten Ausbilder mindestens vier Monate vorher mit realitätsnahen Probe-Arbeitsaufträgen unter Zeitlimit starten. Gleichzeitig empfiehlt sich der Einsatz der Assistierten Ausbildung flexibel (AsA flex nach § 75 SGB III) sowie berufsbezogener Deutschkurse nach § 45a AufenthG (DeuFöV) für sichere Fachtheorie.",
                "Im mündlichen Fachgespräch von GAP Teil 2 trainieren Meister kurze, zehnminütige Erklärungen zum betrieblichen Auftrag mit typischen Rückfragen des Prüfungsausschusses. Prüfen Sie zudem rechtzeitig bei Kammer oder Pflegeschule, ob unkommentierte zweisprachige Wörterbücher als Hilfsmittel genehmigt werden.",
            ),
            (
                "Was passiert aufenthaltsrechtlich bei Nichtbestehen, Verlängerung nach § 21 Abs. 3 BBiG oder direkter Übernahme (§ 18a AufenthG)?",
                "Besteht ein Auszubildender die Abschlussprüfung nicht, verlängert sich das Berufsausbildungsverhältnis gemäß § 21 Abs. 3 BBiG auf Verlangen des Auszubildenden bis zur nächstmöglichen Wiederholungsprüfung, höchstens jedoch um ein Jahr, weshalb der Aufenthaltstitel nach § 16a AufenthG rechtzeitig angepasst werden muss. Bei bestandener Prüfung endet das Ausbildungsverhältnis gemäß § 21 Abs. 2 BBiG mit Bekanntgabe des Ergebnisses, sodass der Wechsel in § 18a AufenthG vorbereitet sein sollte.",
                "Personalabteilungen sollten Übernahmevertrag und Erklärung zum Beschäftigungsverhältnis drei Monate vor dem Prüfungstermin einreichen. Findet ausnahmsweise keine Übernahme statt, ermöglicht § 20 Abs. 1 Nr. 3 AufenthG Absolventen bis zu 18 Monate zur qualifizierten Arbeitsplatzsuche.",
            ),
        ],
        "operational_heading": "Jahresfahrplan ab Monat 15 für Ausbilder",
        "operational_intro": "Ein fester Fahrplan zwischen Monat 15 und Monat 36 entlastet Ausbilder, Stationen und Personalabteilung:",
        "operational_bullets": [
            "Monat 15–18: Lernstandscheck vor GAP 1 durchführen und bei Bedarf AsA flex (§ 75 SGB III) beantragen.",
            "Monat 22–30: DeuFöV-Kurs (B2) prüfen sowie Mock-Fachgespräche oder Übergabeübungen (§ 4 PflAPrV) ansetzen.",
            "Monat 34–36: Freistellung nach § 15 BBiG eintragen und § 18a-Übernahmeantrag rechtzeitig einreichen.",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c0511.jpg",
                "alt": "Lernkohorte K27 bei einer standardisierten B1- und B2-Modellprüfung unter Prüfungsaufsicht",
                "lead": "Frühe Prüfungssimulation unter Realbedingungen:",
                "caption": "Bereits vor der Einreise trainieren DMF-Kohorten wie K27 unter Zeitvorgaben und Aufsicht, was spätere Nervosität bei GAP Teil 1/2 oder dem Pflegeexamen mindert.",
            },
            {
                "src": "/images/community/dmf-p13-c1330.jpg",
                "alt": "Auszubildende machen sich im Prüfungs- und Interviewtraining mit deutschen Experten Notizen",
                "lead": "Systematische Rückmeldung für Fachgespräche:",
                "caption": "In Feedbackrunden mit deutschen Trainern lernen Auszubildende, Arbeitsschritte strukturiert zu notieren und im Fachgespräch präzise zu erklären.",
            },
            {
                "src": "/images/community/dmf-p13-c0059.jpg",
                "alt": "Dozent Thầy Khang erläutert Sprachstrukturen am Whiteboard für die schulische Fachtheorie",
                "lead": "Sprachlogik für komplexe Prüfungsaufgaben:",
                "caption": "Dozent Thầy Khang vermittelt Strategien zum schnellen Erfassen schriftlicher Aufgabentexte – eine entscheidende Kompetenz für gestreckte Abschlussprüfungen.",
            },
        ],
        "cta_text": "Sichern Sie Ihren Ausbildungserfolg vom Start bis zur Übernahme: Entdecken Sie unser [Azubi-Programm nach § 16a AufenthG](/services/azubi), die Branchenlösungen für [Pflege & Gesundheit](/fuer-arbeitgeber/branchen/pflege-gesundheit) sowie [Handwerk & Bau](/fuer-arbeitgeber/branchen/handwerk-bau), regionale Behörden in der [Standorte-Übersicht](/fuer-arbeitgeber/standorte) oder senden Sie Ihre Planung über die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf).",
    },
    # 172: Arbeitgeberwechsel, Zweckwechsel & Zusatzblatt zum eAT
    {
        "num": 172,
        "slug": "arbeitgeberwechsel-zweckwechsel-zusatzblatt-eat-aufenthg-arbeitgeber",
        "title": "Arbeitgeberwechsel, Zweckwechsel & Zusatzblatt zum eAT (§§ 16a, 16d, 18a AufenthG): Was Personalabteilungen bei Neueinstellung im Inland prüfen müssen",
        "meta_title": "Arbeitgeberwechsel & Zusatzblatt eAT (§ 4a, § 18a AufenthG)",
        "meta_description": "Checkliste für HR bei Einstellung im Inland: Zusatzblatt zum eAT prüfen, Arbeitgeberwechsel nach § 9 BeschV, Zweckwechsel §§ 16a/16d zu § 18a AufenthG.",
        "keywords": [
            "Zusatzblatt zum eAT prüfen Arbeitgeber",
            "Arbeitgeberwechsel § 9 BeschV § 18a AufenthG",
            "Zweckwechsel § 16a § 16d in § 18a",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Rechtssichere Checkliste für Personalabteilungen bei Inlands-Einstellungen: Zusatzblatt zum eAT nach § 4a Abs. 5 AufenthG prüfen, Arbeitgeberbindung (§ 9 BeschV) und Zweckwechsel rechtzeitig beantragen.",
        "cover_image": "/images/blog/dmf-p13-arbeitgeberwechsel-zusatzblatt-eat.jpg",
        "svg": "/images/blog/dmf-p13-172-eat-zusatzblatt-arbeitgeberwechsel-check.svg",
        "svg_alt": "HR-Prüfbaum für Inlands-Einstellungen: Prüfung von eAT und Zusatzblatt nach § 4a Abs. 5 AufenthG sowie Abgrenzung zu § 9 BeschV und Zweckwechsel",
        "svg_caption": "Prüfschema für Personalabteilungen vor Arbeitsantritt im Inland: Abgleich des Zusatzblatts zum eAT mit § 9 BeschV und den Genehmigungspflichten vor Tag 1 (§ 404 SGB III).",
        "tldr": "Wer eine internationale Fachkraft oder einen Auszubildenden bereits im deutschen Inland einstellt, darf sich nicht allein auf den elektronischen Aufenthaltstitel (eAT) verlassen. Entscheidend ist das Zusatzblatt zum eAT: In den ersten zwei Beschäftigungsjahren besteht häufig eine Bindung an den bisherigen Betrieb (§ 9 BeschV). Personalabteilungen müssen vor Arbeitsbeginn nach § 4a Abs. 5 AufenthG den Titel plus Zusatzblatt prüfen, eine Kopie archivieren und bei Arbeitgeber- oder Zweckwechsel (§§ 16a, 16d zu § 18a) die Erlaubnis der Ausländerbehörde abwarten.",
        "intro": "Wenn internationale Fachkräfte nach Ausbildungsabschluss den Betrieb wechseln oder eine neue Stelle antreten, birgt die Inlandsrekrutierung für Personalabteilungen ein oft übersehenes Haftungsrisiko. Während bei Einreisen die [HR-Checkliste für die ersten 30 Tage](/blog/erste-30-tage-einreise-behoerden-sozialversicherung-checkliste-hr) gilt, entscheidet bei Inlandswechslern stets der konkrete Vermerk auf dem Zusatzblatt zum eAT.",
        "table_headers": [
            "Inlands-Konstellation",
            "Rechtsgrundlage",
            "Eintrag im Zusatzblatt zum eAT",
            "Erforderlicher Schritt für HR vor Arbeitsbeginn",
        ],
        "table_rows": [
            [
                "Arbeitgeberwechsel innerhalb der ersten 2 Beschäftigungsjahre",
                "§ 4a Abs. 3, § 18a AufenthG; § 82 Abs. 6 AufenthG",
                "Bindung an bisherigen Arbeitgeber / konkrete Tätigkeit",
                "Änderung bei Ausländerbehörde beantragen, ZAV-Prüfung & Freigabe vor Tag 1 abwarten",
            ],
            [
                "Arbeitgeberwechsel nach ≥ 2 Jahren Beschäftigung / ≥ 3 Jahren Aufenthalt",
                "§ 9 Abs. 1 BeschV",
                "„Beschäftigung jeder Art gestattet“ oder offener Vermerk",
                "Zusatzblatt prüfen, Beschäftigungsnachweise sichern, eAT-Kopie nach § 4a Abs. 5 ablegen",
            ],
            [
                "Zweckwechsel nach Ausbildungsabschluss (§ 16a → § 18a AufenthG)",
                "§§ 16a, 18a, 81 Abs. 4 AufenthG",
                "Bisher beschränkt auf konkretes Ausbildungsverhältnis",
                "Abschlusszeugnis & § 18a-Antrag vor Vertragsende einreichen (Fiktionswirkung sichern)",
            ],
            [
                "Wechsel nach Abschluss der Anerkennungspartnerschaft (§ 16d → § 18a)",
                "§ 16d Abs. 3 → § 18a AufenthG; § 404 Abs. 2 Nr. 3 SGB III",
                "Gebunden an Anerkennungsbetrieb / Qualifizierungsplan",
                "Vollanerkennungsbescheid + neuen Arbeitsvertrag bei ABH zur Umschreibung einreichen",
            ],
        ],
        "sections": [
            (
                "Welche Prüfpflichten hat die Personalabteilung nach § 4a Abs. 5 AufenthG beim Zusatzblatt zum eAT?",
                "Gemäß § 4a Abs. 5 AufenthG muss jeder Arbeitgeber in Deutschland vor Beginn einer Beschäftigung prüfen, ob der Ausländer einen gültigen Aufenthaltstitel besitzt, der exakt die vorgesehene Erwerbstätigkeit im neuen Betrieb gestattet. Außerdem verpflichtet das Gesetz den Betrieb ausdrücklich dazu, für die gesamte Dauer der Beschäftigung eine Kopie des Aufenthaltstitels einschließlich des grünen Zusatzblatts in elektronischer oder Papierform aufzubewahren.",
                "Ein Blick allein auf die Scheckkarte des eAT genügt nicht, weil dort meist nur der Vermerk „Siehe Zusatzblatt“ steht. Erst das Zusatzblatt zeigt, ob eine Bindung an einen Vorarbeitgeber besteht; Verstöße gegen die Prüf- und Erlaubnispflicht können nach § 404 Abs. 2 Nr. 3 SGB III empfindliche Bußgelder auslösen.",
            ),
            (
                "Wann ist ein Arbeitgeberwechsel ohne Zustimmung der Ausländerbehörde nach § 9 BeschV möglich?",
                "Nach § 9 Abs. 1 Beschäftigungsverordnung (BeschV) entfällt die Zustimmungspflicht der Bundesagentur für Arbeit für einen Arbeitgeberwechsel regelmäßig dann, wenn die Fachkraft zuvor mindestens zwei Jahre rechtmäßig eine versicherungspflichtige Beschäftigung im Bundesgebiet ausgeübt hat oder sich seit mindestens drei Jahren ununterbrochen erlaubt im Inland aufhält. Maßgeblich für einen sofortigen Arbeitsbeginn bleibt jedoch, ob das Zusatzblatt bereits „Beschäftigung gestattet“ ausweist oder noch eine Firmenbindung enthält.",
                "Steht im Zusatzblatt weiterhin der frühere Betrieb, beantragt der Mitarbeitende vor Tag 1 die Änderung bei der Ausländerbehörde. Bei Beendigung gilt die vierwöchige Meldepflicht nach § 4a Abs. 5 Satz 3 Nr. 3 AufenthG, erläutert unter [Kündigung und Meldepflichten an die Ausländerbehörde](/blog/kuendigung-aufhebungsvertrag-drittstaaten-meldepflicht-auslaenderbehoerde).",
            ),
            (
                "Wie verläuft der Zweckwechsel von § 16a oder § 16d in die Fachkräftebeschäftigung nach § 18a AufenthG?",
                "Der Übergang von der betrieblichen Ausbildung (§ 16a AufenthG) oder einer Anerkennungspartnerschaft (§ 16d AufenthG) in eine reguläre Fachkraftstelle erfordert einen formellen Zweckwechsel in § 18a AufenthG bei der kommunalen Ausländerbehörde. Stellt die Fachkraft diesen Antrag gemeinsam mit Abschlusszeugnis bzw. Vollanerkennungsbescheid, Arbeitsvertrag und Erklärung zum Beschäftigungsverhältnis vor Ablauf des bisherigen Titels, greift für den bisherigen Titel die Fortgeltungsfiktion nach § 81 Abs. 4 AufenthG.",
                "Beachten Sie dabei die Grenze der Fiktionswirkung: Nach § 81 Abs. 4 AufenthG gelten zunächst die bisherigen Auflagen fort und erlauben beim Ausbildungs-eAT noch keine Vollzeitstelle im anderen Betrieb. Reichen Sie alle Unterlagen acht bis zwölf Wochen vor Abschluss ein und warten Sie die schriftliche Freigabe ab.",
            ),
        ],
        "operational_heading": "HR-Prüfroutine vor Arbeitsbeginn im Inland",
        "operational_intro": "Verankern Sie bei Inlands-Einstellungen aus Drittstaaten eine Vier-Augen-Freigabe vor der ersten Schicht:",
        "operational_bullets": [
            "eAT samt Zusatzblatt (bzw. Fiktionsbescheinigung) vor Vertragsschluss im Original prüfen.",
            "Bei Bindung oder Zweckwechsel (§§ 16a/16d zu § 18a) geänderte Erlaubnis vor Tag 1 abwarten.",
            "Kopien nach § 4a Abs. 5 AufenthG archivieren und Wiedervorlage sechs Monate vor Ablauf setzen.",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c1337.jpg",
                "alt": "Achim Betticher moderiert ein offenes deutsches Feedbackgespräch zur betrieblichen Kommunikation",
                "lead": "Vertrags- und Kommunikationssicherheit im Team:",
                "caption": "In moderierten Gesprächsrunden mit Herrn Achim Betticher üben Fachkräfte den offenen Austausch zu Arbeitsabläufen, Rechten und Pflichten im Betrieb.",
            },
            {
                "src": "/images/community/dmf-p13-c0628.jpg",
                "alt": "Deutsche Dozenten Tilman und Melda in einer Frage-und-Antwort-Runde mit DMF-Teilnehmenden",
                "lead": "Verständnis für deutsche Behördenregeln:",
                "caption": "Deutsche Lehrkräfte wie Tilman und Melda klären frühzeitig alltagsnahe Fragen zu Meldepflichten, Aufenthaltstitel und Kommunikation mit Personalabteilungen.",
            },
        ],
        "cta_text": "Vermeiden Sie Haftungsrisiken beim Inlandseinsatz oder beim Wechsel in eine Fachkraftstelle: Informieren Sie sich über unser [Fachkräfteprogramm](/services/skilled-workers), prüfen Sie Fristen im [Zeitplan-Simulator (§ 81a)](/fuer-arbeitgeber/zeitplan), orientieren Sie sich in unserer [Standorte-Übersicht](/fuer-arbeitgeber/standorte) sowie bei [Pflege & Gesundheit](/fuer-arbeitgeber/branchen/pflege-gesundheit) und senden Sie Ihre Anfrage über die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf).",
    },
    # 173: Ergotherapeuten & Pharmazeutisch-technische Assistenten (PTA)
    {
        "num": 173,
        "slug": "ergotherapeuten-pta-vietnam-anerkennung-ergthg-ptag-reha-apotheken",
        "title": "Ergotherapeuten & Pharmazeutisch-technische Assistenten (PTA) aus Vietnam: Anerkennung nach ErgThG und PTAG für Reha-Zentren & Apotheken",
        "meta_title": "Ergotherapeuten & PTA aus Vietnam: ErgThG & PTAG Leitfaden",
        "meta_description": "Fachkräftesicherung für Reha-Zentren und Apotheken: Berufsanerkennung vietnamesischer Ergotherapeuten (ErgThG) & PTA (PTAG) nach § 18a und § 81a AufenthG.",
        "keywords": [
            "Ergotherapeuten aus Vietnam ErgThG Anerkennung",
            "Pharmazeutisch-technische Assistenten PTA PTAG",
            "Reha-Zentren Apotheken Fachkräfte § 16d § 18a",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Wie Reha-Kliniken, Ergotherapie-Praxen und Apotheken Fachkräfte aus Vietnam nach ErgThG und PTAG anerkennen lassen und über § 16d, § 18a und § 81a AufenthG rechtssicher einsetzen.",
        "cover_image": "/images/blog/dmf-p13-ergotherapeuten-pta-reha-apotheke.jpg",
        "svg": "/images/blog/dmf-p13-173-ergthg-ptag-anerkennungspfad.svg",
        "svg_alt": "Anerkennungspfade für Ergotherapeuten nach ErgThG und PTA nach PTAG aus Vietnam über Anpassungslehrgang oder Kenntnisprüfung zu § 18a AufenthG",
        "svg_caption": "Paralleler Rechtsweg für reglementierte Therapie- und Apothekenberufe: Prüfung nach § 2 Abs. 3 ErgThG / § 16b ErgThAPrV sowie Abschnitt 5 PTAG / § 18b PTA-APrV bis zur vollen Erlaubnis.",
        "tldr": "Ergotherapeuten und Pharmazeutisch-technische Assistenten (PTA) zählen zu den reglementierten Gesundheitsberufen mit akutem Fachkräftemangel in Reha-Kliniken, Praxen und Apotheken. Für Abschlüsse aus Vietnam prüfen die Landesbehörden die Gleichwertigkeit nach § 2 Abs. 3 ErgThG (§ 16b ErgThAPrV) beziehungsweise §§ 34, 38–41 PTAG (§ 18b PTA-APrV) inklusive B2-Sprachnachweis. Bei wesentlichen Ausbildungsunterschieden schließen Betriebe die Lücke über Anpassungslehrgang oder Kenntnisprüfung (§ 16d oder § 18a i. V. m. § 81a AufenthG).",
        "intro": "Während Kliniken ihren Rekrutierungsprozess für Pflegekräfte vielfach standardisiert haben, bleiben Planstellen in Rehabilitationszentren, Ergotherapie-Praxen und Apotheken oft monatelang unbesetzt. Da beide Berufe staatlich reglementiert sind, erfordert die eigenständige Tätigkeit – ähnlich wie bei [Physiotherapeuten aus Drittstaaten nach dem MPhG](/blog/physiotherapeuten-aus-drittstaaten-anerkennung-mphg-praxen) – zwingend die deutsche Erlaubnis zum Führen der Berufsbezeichnung.",
        "table_headers": [
            "Berufsbild & Zielbetrieb",
            "Rechtsgrundlage & Zuständigkeit",
            "Sprach- & Fachprüfung",
            "Einsatz vor & nach voller Erlaubnis",
        ],
        "table_rows": [
            [
                "Ergotherapeut/-in (Reha-Zentren, Geriatrie, Ergotherapie-Praxen)",
                "§§ 1, 2 Abs. 3 ErgThG / § 16b ErgThAPrV (Landesprüfungsamt)",
                "Gleichwertigkeitsprüfung + B2-Deutsch / Fachsprache",
                "Assistenz unter Aufsicht (§ 16d) → eigenständige Therapie nach Urkunde (§ 18a)",
            ],
            [
                "Pharmazeutisch-technische/r Assistent/-in / PTA (Apotheken & Kliniken)",
                "§ 1, §§ 33–41 PTAG (v. a. §§ 34, 38) / § 18b PTA-APrV / ApBetrO (Landesbehörde)",
                "Prüfung Pharmazie, Rezeptur & B2-Fachkommunikation",
                "Mitarbeit unter Aufsicht approbierter Apotheker (§ 16d) → volle PTA-Befugnis",
            ],
            [
                "Ausgleichsmaßnahme: Anpassungslehrgang vs. Kenntnisprüfung",
                "§ 2 Abs. 3 ErgThG i. V. m. § 16b ErgThAPrV / §§ 38, 40–41 PTAG i. V. m. § 18b PTA-APrV",
                "Theoretisch-praktischer Lehrgang vs. staatl. Einzelprüfung",
                "Anpassungslehrgang integriert Praxisabläufe; Kenntnisprüfung bei starker Vorbildung",
            ],
            [
                "Visum- & Einreisebeschleunigung (§ 81a AufenthG)",
                "§ 16d Abs. 1/3, § 18a, § 81a AufenthG",
                "411 € Behördengebühr, max. 2 Mon. Anerkennungsfrist",
                "Rechtssichere Planung für Klinikverbünde, MVZ und Apothekenkooperationen",
            ],
        ],
        "sections": [
            (
                "Welche Voraussetzungen gelten für die staatliche Erlaubnis nach ErgThG und PTAG bei Abschlüssen aus Vietnam?",
                "Für die Erteilung der staatlichen Erlaubnis zum Führen der Berufsbezeichnung prüfen die zuständigen Landesprüfungsämter beziehungsweise Bezirksregierungen neben gesundheitlicher Eignung, Zuverlässigkeit und deutschen Sprachkenntnissen auf mindestens B2-Niveau vor allem die Gleichwertigkeit des Ausbildungsstands. Rechtliche Grundlage sind §§ 1, 2 Abs. 3 ErgThG in Verbindung mit § 16b ErgThAPrV bei Ergotherapeuten sowie Abschnitt 5 (§§ 33–41, insbesondere §§ 34, 38) PTAG in Verbindung mit § 18b PTA-APrV bei PTA.",
                "Für Bewerber aus Vietnam bieten staatlich anerkannte Hochschul- und Fachschulabschlüsse in Rehabilitationstherapie oder Pharmazie eine solide Ausgangsbasis, sofern Stundentafeln und Klinik- oder Laborstunden vollständig übersetzt vorliegen. Da sich deutsche Schwerpunkte in Geriatrie, Rezepturherstellung (Galenik) und Arzneimittelrecht teilweise unterscheiden, ergeht häufig ein Defizitbescheid.",
            ),
            (
                "Wann empfiehlt sich für Reha-Zentren und Apotheken der Anpassungslehrgang statt der Kenntnisprüfung?",
                "Ein Anpassungslehrgang (§ 16b Abs. 2 ErgThAPrV beziehungsweise § 41 PTAG i. V. m. § 18b PTA-APrV) empfiehlt sich immer dann, wenn der Bewerber neben einzelnen Wissenslücken zuerst deutsche Versorgungsstandards, Dokumentationssysteme, Rezepturabläufe oder Heilmittelrichtlinien direkt im Praxisalltag kennenlernen soll. Die Kenntnisprüfung (§ 16b Abs. 3 ErgThAPrV beziehungsweise § 40 PTAG) eignet sich dagegen besonders für erfahrene Kandidaten mit hohem Vorwissen und sicherem B2-Sprachstand.",
                "Gerade bei PTA spielt das Verständnis von Wechselwirkungen, Rezepturplausibilität und Beratung unter der Apothekenbetriebsordnung (ApBetrO) eine zentrale Rolle. Ein strukturierter Anpassungslehrgang in Kooperation mit einer PTA-Schule oder einem Reha-Lehrverbund führt Bewerber sicherer durch Fachtermini zur vollen Berufserlaubnis.",
            ),
            (
                "Wie planen Personalabteilungen den Einsatz während der Anerkennungsphase unter Aufsicht (§ 16d AufenthG)?",
                "Während der Ausgleichsmaßnahme nach § 16d Abs. 1 AufenthG arbeiten ausländische Ergotherapeuten und PTA nicht eigenverantwortlich in ihrer geschützten Berufsbezeichnung, sondern leisten qualifizierte Zuarbeit unter unmittelbarer fachlicher Aufsicht einer examinierten Fachkraft beziehungsweise nach ApBetrO unter Aufsicht approbierter Apotheker. Für Reha-Zentren oder Apotheken ohne Tarifbindung ist § 16d Abs. 1 AufenthG auf Basis des vorab erteilten Defizitbescheids meist geeigneter als § 16d Abs. 3, da Letzterer grundsätzlich Tarifbindung (§ 3 / § 5 TVG) voraussetzt.",
                "Über das beschleunigte Fachkräfteverfahren nach § 81a AufenthG lassen sich Defizitbescheid, ZAV-Zustimmung und Visum verlässlich planen (411 EUR Gebühr, maximal zwei Monate Anerkennungsfrist). Nach Abschluss der Ausgleichsmaßnahme und Vorliegen der Urkunde erfolgt im Inland die Umschreibung in § 18a AufenthG.",
            ),
        ],
        "operational_heading": "Praxis-Checkliste für Reha-Leitung und Apothekeninhaber",
        "operational_intro": "Berücksichtigen Sie bei der Einsatzplanung für Ergotherapeuten und PTA drei zentrale Punkte vor Vertragsabschluss:",
        "operational_bullets": [
            "Prüfen Sie bei Ihrem Landesprüfungsamt, ob neben B2-Deutsch eine berufsbezogene Fachsprachenprüfung verlangt wird.",
            "Trennen Sie im Dienstplan während § 16d sauber zwischen vorbereitender Zuarbeit und Tätigkeiten unter direkter Aufsicht nach ErgThG bzw. ApBetrO.",
            "Stimmen Sie Termine für schulische Ergänzungsmodule bei PTA- oder Ergotherapie-Fachschulen bereits parallel zum § 81a-Verfahren ab.",
        ],
        "figures": [
            {
                "src": "/images/community/dmf-p13-c1401.jpg",
                "alt": "DMF-Absolventin An im Poloshirt der Akademie bei der Abreise am internationalen Flughafen",
                "lead": "Begleitete Ausreise in deutsche Gesundheitsberufe:",
                "caption": "Mit vollständig geprüften Zeugnisunterlagen und B1/B2-Nachweis starten qualifizierte Absolventinnen wie An strukturiert in ihre Anerkennungsphase.",
            },
            {
                "src": "/images/community/dmf-p13-c1248.jpg",
                "alt": "Geprüftes Bewerberprofil einer Kandidatin aus der DMF Talents Akademie für Gesundheitsbetriebe",
                "lead": "Strukturierte Bewerbungsdossiers für Reha und Apotheken:",
                "caption": "Vorqualifizierte Fachkräfte präsentieren sich deutschen Personalverantwortlichen mit vollständigen Stundentafeln, Sprachzertifikaten und nachgewiesener Praxiserfahrung.",
            },
        ],
        "cta_text": "Besetzen Sie offene Therapie- und Apothekenstellen planbar mit Fachkräften aus Vietnam: Informieren Sie sich in unserem Bereich [Pflege & Gesundheit](/fuer-arbeitgeber/branchen/pflege-gesundheit), prüfen Sie unsere Leistungen im [Fachkräfteprogramm](/services/skilled-workers), vergleichen Sie regionale Abläufe am Beispiel des [Standorts Bayern](/fuer-arbeitgeber/standorte/bayern) und starten Sie Ihre Bedarfsprüfung über die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf).",
    },
]


def render_markdown(a: dict) -> str:
    kw_json = ", ".join(f'"{k}"' for k in a["keywords"])

    header_line = "| " + " | ".join(a["table_headers"]) + " |"
    sep_line = "| " + " | ".join("---" for _ in a["table_headers"]) + " |"
    row_lines = ["| " + " | ".join(r) + " |" for r in a["table_rows"]]
    table_md = "\n".join([header_line, sep_line] + row_lines)

    figures = a["figures"]
    section_blocks = []
    for idx, (q_heading, p1, p2) in enumerate(a["sections"]):
        block_parts = [f"## {q_heading}", p1, p2]
        if idx == 0:
            block_parts.append(table_md)
        if idx < len(figures):
            block_parts.append(render_figure(figures[idx]))
        section_blocks.append("\n\n".join(block_parts))

    bullets_md = "\n".join(f"- {b}" for b in a["operational_bullets"])
    operational_block = f"## {a['operational_heading']}\n\n{a['operational_intro']}\n\n{bullets_md}"
    section_blocks.append(operational_block)

    sections_md = "\n\n".join(section_blocks)

    return f"""---
title: "{a['title']}"
slug: "{a['slug']}"
published_at: "2026-11-18"
cover_image: "{a['cover_image']}"
meta_title: "{a['meta_title']}"
meta_description: "{a['meta_description']}"
keywords: [{kw_json}]
excerpt: "{a['excerpt']}"
---

**Das Wichtigste in Kürze:** {a['tldr']}

{a['intro']}

![{a['svg_alt']}]({a['svg']})
_{a['svg_caption']}_

{sections_md}

---

### Nächster Schritt für Ihren Betrieb

{a['cta_text']}
"""


def count_german_sentences(text: str) -> int:
    protected = text
    abbrevs = [
        r"Abs\.",
        r"Nr\.",
        r"S\.",
        r"i\.\s*V\.\s*m\.",
        r"z\.\s*B\.",
        r"u\.\s*a\.",
        r"bzw\.",
        r"ca\.",
        r"v\.\s*a\.",
        r"d\.\s*h\.",
        r"ggf\.",
        r"Reg\.",
        r"v\.",
        r"mind\.",
        r"max\.",
        r"staatl\.",
        r"allg\.",
        r"ehem\.",
        r"i\.\s*d\.\s*R\.",
        r"Dr\.",
    ]
    for ab in abbrevs:
        protected = re.sub(ab, lambda m: m.group(0).replace(".", "<DOT>"), protected)
    protected = re.sub(r"(\d+)\.", r"\1<DOT>", protected)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", protected.strip()) if s.strip()]
    return len(sentences)


def run_audit() -> bool:
    ai_audit_path = ROOT_DIR / "scripts" / "ai-tone-audit.py"
    ns = {}
    exec(compile(ai_audit_path.read_text(encoding="utf-8"), str(ai_audit_path), "exec"), ns)
    ai_patterns = ns["AI_PATTERNS"]

    informal_re = re.compile(
        r"\b(du|dich|dir|dein|deine|deinem|deinen|deiner|deines|euch|euer|eure|eurem|euren|eures)\b",
        re.IGNORECASE,
    )
    mojibake_re = re.compile(r"(Ã¤|Ã¶|Ã¼|ÃŸ|Ã©|Ã¨|Ã |â€“|â€”|Â|&amp;amp;|&#39;&#39;)")
    slug_re = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

    compiled_posts_path = ROOT_DIR / "content" / "compiled" / "all-posts.json"
    published_slugs = {p["slug"] for p in json.loads(compiled_posts_path.read_text(encoding="utf-8"))}

    valid_routes = {
        "/",
        "/blog",
        "/referenzen",
        "/roi-rechner",
        "/datenschutz",
        "/impressum",
        "/services/azubi",
        "/services/skilled-workers",
        "/services/seasonal",
        "/fuer-arbeitgeber/zeitplan",
        "/fuer-arbeitgeber/kandidaten",
        "/fuer-arbeitgeber/personalbedarf",
        "/fuer-arbeitgeber/branchen",
        "/fuer-arbeitgeber/branchen/pflege-gesundheit",
        "/fuer-arbeitgeber/branchen/handwerk-bau",
        "/fuer-arbeitgeber/branchen/industrie-metall-technik",
        "/fuer-arbeitgeber/branchen/gastronomie-hotellerie",
        "/fuer-arbeitgeber/branchen/logistik-lager",
        "/fuer-arbeitgeber/standorte",
        "/fuer-arbeitgeber/standorte/bayern",
        "/fuer-arbeitgeber/standorte/baden-wuerttemberg",
        "/fuer-arbeitgeber/standorte/nordrhein-westfalen",
        "/fuer-arbeitgeber/standorte/niedersachsen",
        "/fuer-arbeitgeber/standorte/hessen",
        "/fuer-arbeitgeber/standorte/berlin-brandenburg",
        "/fuer-arbeitgeber/standorte/sachsen-mitteldeutschland",
        "/fuer-arbeitgeber/standorte/hamburg-norddeutschland",
    }

    errors = []
    print("=" * 72)
    print("PHASE 13B DRAFTS AUDIT (Posts 167-173)")
    print("=" * 72)

    for a in ARTICLES:
        fname = f"{a['num']}-{a['slug']}.md"
        fpath = DRAFTS_DIR / fname
        raw = fpath.read_text(encoding="utf-8")
        parts = raw.split("---", 2)
        if len(parts) < 3:
            errors.append(f"[{fname}] Missing YAML frontmatter")
            continue
        body = parts[2].strip()

        clean_words_text = re.sub(r"<[^>]+>", " ", body)
        clean_words_text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", clean_words_text)
        clean_words_text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", clean_words_text)
        clean_words_text = re.sub(r"[#*_`|>-]+", " ", clean_words_text)
        words = [w for w in clean_words_text.split() if w.strip()]
        wc = len(words)

        raw_html_wc = len(re.sub(r"<[^>]+>", " ", body).split())

        if wc < 650:
            errors.append(f"[{fname}] Word count too low: {wc} (< 650)")
        if not (700 <= wc <= 900):
            errors.append(f"[{fname}] Prose word count {wc} outside target 700-900")
        if not (700 <= raw_html_wc <= 900):
            errors.append(f"[{fname}] Raw word count {raw_html_wc} outside target 700-900")

        if not slug_re.match(a["slug"]):
            errors.append(f"[{fname}] Invalid slug: {a['slug']}")
        if len(a["meta_title"]) > 60:
            errors.append(f"[{fname}] meta_title > 60 chars: {len(a['meta_title'])}")
        if not (135 <= len(a["meta_description"]) <= 160):
            errors.append(f"[{fname}] meta_description len {len(a['meta_description'])} not in 135..160")

        full_text = f"{a['title']} {a['meta_title']} {a['meta_description']} {a['excerpt']} " + re.sub(r"<[^>]+>", " ", body)
        for pat, label in ai_patterns:
            if re.search(pat, full_text, re.IGNORECASE):
                errors.append(f"[{fname}] AI_PATTERN match: {label}")

        if re.search(r"\bnicht nur\b.*?\bsondern auch\b", full_text, re.IGNORECASE):
            errors.append(f"[{fname}] Contains 'nicht nur ... sondern auch'")

        informal_hits = informal_re.findall(full_text)
        if informal_hits:
            errors.append(f"[{fname}] Informal pronouns: {informal_hits}")

        if mojibake_re.findall(raw):
            errors.append(f"[{fname}] Mojibake detected")

        if not body.startswith("**Das Wichtigste in Kürze:** "):
            errors.append(f"[{fname}] Missing opening **Das Wichtigste in Kürze:**")

        q_h2s = re.findall(r"^##\s+(.+\?)\s*$", body, re.MULTILINE)
        if len(q_h2s) < 3:
            errors.append(f"[{fname}] Fewer than 3 ## ...? headings ({len(q_h2s)})")

        h2_matches = list(re.finditer(r"^##\s+(.+)$", body, re.MULTILINE))
        for idx, m in enumerate(h2_matches):
            h_text = m.group(1).strip()
            if not h_text.endswith("?"):
                continue
            start = m.end()
            end = h2_matches[idx + 1].start() if idx + 1 < len(h2_matches) else len(body)
            sec = body[start:end].strip()
            blocks = [b.strip() for b in sec.split("\n\n") if b.strip()]
            if len(blocks) < 2:
                errors.append(f"[{fname}] Section '{h_text}' has fewer than 2 blocks")
                continue
            first_block = blocks[0]
            if first_block.startswith("<figure") or first_block.startswith("|") or first_block.startswith("-"):
                errors.append(f"[{fname}] First block after '{h_text}' is not a paragraph!")
                continue
            p1_wc = len(first_block.split())
            p1_sents = count_german_sentences(first_block)
            if p1_wc < 45:
                errors.append(f"[{fname}] First paragraph under '{h_text}' has {p1_wc} words (< 45)")
            if p1_sents != 2:
                errors.append(f"[{fname}] First paragraph under '{h_text}' has {p1_sents} sentences (expected 2)")

        table_lines = [ln for ln in body.splitlines() if ln.strip().startswith("|") and ln.strip().endswith("|")]
        if len(table_lines) != 6:
            errors.append(f"[{fname}] Expected 6 table lines (hdr+sep+4 rows), got {len(table_lines)}")

        if a["cover_image"] in body:
            errors.append(f"[{fname}] Cover image duplicated inside body!")

        if f"]({a['svg']})" not in body:
            errors.append(f"[{fname}] Missing SVG path {a['svg']}")

        fig_blocks = re.findall(r'<figure class="dmf-community-figure">[\s\S]*?</figure>', body)
        if len(fig_blocks) != len(a["figures"]):
            errors.append(f"[{fname}] Expected {len(a['figures'])} figures, found {len(fig_blocks)}")
        for fig in a["figures"]:
            if fig["src"] not in body:
                errors.append(f"[{fname}] Missing figure src {fig['src']}")
        for fb in fig_blocks:
            if 'width="1200"' not in fb or 'height="675"' not in fb or 'loading="lazy"' not in fb:
                errors.append(f"[{fname}] Figure missing width/height/loading attributes")
            if "<figcaption>" not in fb or "<strong>" not in fb:
                errors.append(f"[{fname}] Figure missing <figcaption><strong>")

        links = re.findall(r"(?<!!)\[[^\]]+\]\((/[^)]+)\)", body)
        if not links:
            errors.append(f"[{fname}] No internal links found")
        for lnk in links:
            if lnk.startswith("/blog/"):
                target_slug = lnk.replace("/blog/", "").strip("/")
                if target_slug not in published_slugs:
                    errors.append(f"[{fname}] Broken internal blog link: {lnk}")
            elif lnk not in valid_routes:
                errors.append(f"[{fname}] Unverified app route link: {lnk}")

        if "### Nächster Schritt für Ihren Betrieb" not in body:
            errors.append(f"[{fname}] Missing ### Nächster Schritt für Ihren Betrieb")

        # Verify standorte and branchen links in closing section
        closing = body.split("### Nächster Schritt für Ihren Betrieb", 1)[1]
        closing_links = re.findall(r"(?<!!)\[[^\]]+\]\((/[^)]+)\)", closing)
        if not any(l.startswith("/fuer-arbeitgeber/standorte") for l in closing_links):
            errors.append(f"[{fname}] Closing section missing /fuer-arbeitgeber/standorte* link")
        if not any(l.startswith("/fuer-arbeitgeber/branchen") for l in closing_links):
            errors.append(f"[{fname}] Closing section missing /fuer-arbeitgeber/branchen* link")

        print(
            f"Post {a['num']} ({a['slug']}): "
            f"prose_words={wc}, raw_words={raw_html_wc}, "
            f"meta_title={len(a['meta_title'])}, meta_desc={len(a['meta_description'])}, "
            f"q_h2={len(q_h2s)}, figures={len(fig_blocks)}, links={len(links)}"
        )

    print("-" * 72)
    if errors:
        print(f"AUDIT FAILED with {len(errors)} error(s):")
        for e in errors:
            print("  -", e)
        return False
    print("AUDIT PASSED: 0 errors across all 7 Phase 13B drafts (Posts 167-173)!")
    return True


def main():
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    for a in ARTICLES:
        fname = f"{a['num']}-{a['slug']}.md"
        out_path = DRAFTS_DIR / fname
        out_path.write_text(render_markdown(a), encoding="utf-8")
        print(f"Wrote Phase 13B draft: {fname}")

    ok = run_audit()
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main()
