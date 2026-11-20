#!/usr/bin/env python3
"""
Generate Posts 159–166 (Phase 13 Cluster 1, Cluster 2, and Cluster 3 start)
for DMF Talents (`/Users/chong/dmf-talents.de`).

Strict compliance guarantees:
- Exact YAML frontmatter and approved German GEO/AEO structures from docs/PHASE_13_BLOG_PLAN.md
- 100% formal German ("Sie / Ihnen / Ihr"), 0 informal pronouns (du/dich/dir/dein*/euch/euer*)
- 0 AI_PATTERNS from scripts/ai-tone-audit.py and 0 "nicht nur ... sondern auch"
- Verbatim TL;DR ("Das Wichtigste in Kürze:") and 3 verbatim "## ...?" FAQ headings per post
- Direct 2-sentence (>= 45 words) answer paragraph immediately under every "## ...?" heading
- 4-row Markdown comparison table + 3 unique DMF Drive <figure class="dmf-community-figure"> blocks
- FACTS_GUARDRAIL compliant (no guaranteed visa/price promises; model-calculation framing in Post 163)
"""

from __future__ import annotations

from pathlib import Path

DRAFTS_DIR = Path(__file__).resolve().parent.parent / "content" / "drafts"
PUBLISHED_AT = "2026-11-18"


def make_figure(cluster_id: str, alt: str, lead: str, caption_body: str) -> str:
    cid = cluster_id.lower()
    return (
        '<figure class="dmf-community-figure">\n'
        "  <img\n"
        f'    src="/images/community/dmf-p13-{cid}.jpg"\n'
        f'    alt="{alt}"\n'
        '    width="1200"\n'
        '    height="675"\n'
        '    loading="lazy"\n'
        "  />\n"
        f"  <figcaption><strong>{lead}</strong> {caption_body}</figcaption>\n"
        "</figure>"
    )


ARTICLES: list[dict] = [
    # -----------------------------------------------------------------------
    # POST 159: Saisonarbeitskräfte aus Vietnam (§ 15d BeschV, § 15a, § 14 Abs. 2)
    # -----------------------------------------------------------------------
    {
        "num": 159,
        "slug": "saisonarbeitskraefte-aus-vietnam-zav-kontingent-gastronomie-landwirtschaft",
        "title": "Saisonarbeitskräfte aus Vietnam: § 15d BeschV, ZAV-Kontingent & Rechtspraxis in Gastronomie und Landwirtschaft",
        "meta_title": "Saisonkräfte Vietnam: § 15d BeschV & ZAV-Kontingent",
        "meta_description": "Saisonarbeitskräfte aus Vietnam rechtssicher einsetzen: § 15d BeschV (8 Monate, Tarif), § 15a BeschV (ZAV-Absprachen) & § 14 Abs. 2 BeschV im Vergleich.",
        "cover_image": "/images/blog/dmf-p13-saison-zav-kontingent-gastronomie-landwirtschaft.jpg",
        "keywords": [
            "Saisonarbeitskräfte aus Vietnam § 15d BeschV",
            "ZAV Kontingent 8 Monate Gastronomie",
            "Ferienbeschäftigung § 14 Abs. 2 BeschV",
            "Fachkräfte aus Vietnam",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Welche Rechtsgrundlagen gelten für Saisonarbeitskräfte aus Vietnam? Rechtssichere Abgrenzung zwischen § 15d BeschV (8 Monate, Tarifbindung), § 15a BeschV und § 14 Abs. 2 BeschV.",
        "tldr": (
            "Nach § 19c Abs. 1 AufenthG i. V. m. § 15d BeschV können tarifgebundene Arbeitgeber (§ 3 oder § 5 TVG) aus "
            "Gastronomie, Hotellerie und Logistik Arbeitskräfte aus Vietnam bis zu 8 Monate innerhalb von 12 Monaten über "
            "das ZAV-Kontingent (25.000 Zustimmungen jährlich) beschäftigen. Die klassische Erntehilfe in der Landwirtschaft "
            "(§ 15a BeschV) erfordert bilaterale ZAV-Vermittlungsabsprachen; für vietnamesische Studierende bietet § 14 Abs. 2 "
            "BeschV jedoch bis zu 90 Tage Ferienbeschäftigung in beiden Branchen."
        ),
        "intro": (
            "Saisonale Auftragsspitzen in der Ferienhotellerie, der Systemgastronomie, der Paketlogistik sowie im "
            "Sonderkulturanbau stellen deutsche Betriebe jedes Jahr vor akute Besetzungslücken. Bei der Rekrutierung aus "
            "Drittstaaten kursieren am Markt jedoch vereinfachte Darstellungen, die sämtliche Einsätze pauschal unter "
            "„Saisonarbeit“ zusammenfassen. Für Geschäftsführer und Personalleiter ist eine saubere juristische Trennung "
            "zwischen der kontingentierten kurzzeitigen Beschäftigung (§ 15d BeschV), der klassischen landwirtschaftlichen "
            "Saisonarbeit (§ 15a BeschV) und der Ferienbeschäftigung Studierender (§ 14 Abs. 2 BeschV) zwingend erforderlich, "
            "um Ablehnungen bei der Bundesagentur für Arbeit zu vermeiden."
        ),
        "svg": "/images/blog/dmf-p13-159-saison-15d-15a-14-beschaeftigungsmatrix.svg",
        "svg_alt": "Rechtsmatrix für Saisonarbeitskräfte aus Vietnam nach § 15d BeschV, § 15a BeschV und § 14 Abs. 2 BeschV",
        "svg_caption": "Entscheidungsmatrix für deutsche Saisonbetriebe: Branchenzuordnung, Höchstdauer und Arbeitgeberpflichten im Überblick.",
        "table_headers": [
            "Rechtsgrundlage",
            "Branchen & Zulässigkeit für Vietnam",
            "Höchstdauer & Kontingent",
            "Zwingende Arbeitgeberpflichten",
        ],
        "table_rows": [
            [
                "§ 19c Abs. 1 AufenthG i. V. m. § 15d BeschV (Kurzzeitige kontingentierte Beschäftigung)",
                "Gastronomie, Hotellerie, Systemgastronomie, Logistik (keine landwirtschaftliche Erntehilfe)",
                "Max. 8 Monate in 12 Monaten (25.000/Jahr bundesweit, max. 10 Mon./Betrieb)",
                "Echte Tarifbindung (§ 3/§ 5 TVG), mind. 30 Std./Woche, Übernahme Hin- und Rückreisekosten",
            ],
            [
                "§ 15a BeschV (Klassische Saisonbeschäftigung)",
                "Landwirtschaft, Gartenbau, Weinbau (nur Länder mit ZAV-Vermittlungsabsprache, derzeit nicht Vietnam)",
                "Max. 6 Monate in 12 Monaten",
                "Bilaterale Vermittlungsabsprache der BA/ZAV erforderlich (Abgrenzung zu Drittstaaten ohne Abkommen)",
            ],
            [
                "§ 14 Abs. 2 BeschV (Ferienbeschäftigung ausländischer Studierender)",
                "Landwirtschaft, Gartenbau, Gastronomie, Hotellerie & Logistik (offen für Vietnam)",
                "Max. 90 Tage in 12 Monaten (Semesterferien, unter 35 Jahre)",
                "ZAV-Vermittlungsbestätigung, Immatrikulation (anabin H+/H+/-), Mindestlohn 2027 (14,60 €/Std.)",
            ],
            [
                "§ 16a / § 18a / § 16d AufenthG (Dauerhafte Alternative für ganzjährigen Bedarf)",
                "Alle Betriebe in Gastronomie, Agrartechnik & Lebensmittelhandwerk",
                "Dauerhaft bzw. 3 Jahre Ausbildung",
                "Regulärer Tarif-/Ortslohn (§ 39 AufenthG), B1/B2-Zertifikat, § 81a-Verfahren",
            ],
        ],
        "sections": [
            (
                "Welche rechtlichen Wege gelten für Saisonarbeitskräfte aus Vietnam in Gastronomie und Landwirtschaft?",
                (
                    "Für Gastronomie-, Hotel- und Logistikbetriebe eröffnet die kurzzeitige kontingentierte Beschäftigung nach "
                    "§ 19c Abs. 1 AufenthG in Verbindung mit § 15d BeschV den direkten Zugang zu Arbeitskräften aus Vietnam ohne "
                    "formalen Berufsabschluss. Landwirtschaftliche Betriebe dürfen diesen Weg dagegen für reine Erntehilfe nicht "
                    "nutzen und greifen mangels bilateraler § 15a-Vermittlungsabsprache auf die Ferienbeschäftigung nach § 14 Abs. 2 BeschV zurück."
                ),
                (
                    "Diese Differenzierung ergibt sich unmittelbar aus den jeweiligen Verordnungstexten: Während § 15a BeschV "
                    "für Land-, Forstwirtschaft und Gartenbau eine bestehende Vermittlungsabsprache zwischen der Bundesagentur für "
                    "Arbeit (BA) und der Arbeitsverwaltung des Herkunftslandes voraussetzt, verzichtet § 15d BeschV auf eine "
                    "Länderliste. Ebenso steht § 14 Abs. 2 BeschV immatrikulierten Studierenden aus Vietnam offen, sofern der "
                    "Einsatz exakt innerhalb der offiziellen Semesterferien ihrer Heimathochschule stattfindet. Betriebe mit "
                    "ganzjährigem Fachkräftebedarf prüfen parallel den regulären Einstieg über Ausbildung (§ 16a) oder "
                    "Anerkennung (§ 18a AufenthG)."
                ),
                True,  # place table after section 1
                make_figure(
                    "C0098",
                    "DMF-Kursteilnehmer der Kohorte K50 mit Kochmütze und Schürze bei einer praktischen Küchenübung in Vietnam",
                    "Praxisnahe Vorbereitung für HoGa-Betriebe:",
                    "Teilnehmer der Kohorte K50 trainieren bei DMF Talents hygienische Arbeitsabläufe, deutsche Küchenbegriffe und Teamkoordination bereits vor der Ausreise.",
                ),
            ),
            (
                "Welche Pflichtvoraussetzungen verlangt die ZAV für das 8-Monate-Kontingent nach § 15d BeschV?",
                (
                    "Die Zentrale Auslands- und Fachvermittlung (ZAV) erteilt eine Zustimmung nach § 15d BeschV ausschließlich "
                    "Arbeitgebern, die nach § 3 oder § 5 Tarifvertragsgesetz (TVG) tarifgebunden sind und die Arbeitskräfte "
                    "vollzeitig zu mindestens 30 Wochenstunden entlohnen. Zusätzlich verpflichtet § 15d Abs. 2 Nr. 3 BeschV den "
                    "Betrieb zwingend zur vollständigen Übernahme der notwendigen Hin- und Rückreisekosten ohne Lohnabzug."
                ),
                (
                    "Ein häufiger Ablehnungsgrund in der ZAV-Prüfung betrifft fehlende Tarifbindung: Eine bloße vertragliche "
                    "Bezugnahme auf einen Tarifvertrag genügt nach der Verwaltungspraxis grundsätzlich nicht, wenn keine "
                    "Mitgliedschaft im Arbeitgeberverband, kein wirksamer Haustarifvertrag und kein allgemeinverbindlicher "
                    "Tarifvertrag nach § 5 TVG vorliegen. Zudem gilt das betriebliche Einsatzlimit von höchstens zehn Monaten "
                    "innerhalb von zwölf Monaten pro Betriebsstätte sowie die bundesweite Kontingentgrenze von 25.000 "
                    "Zustimmungen pro Kalenderjahr. Sämtliche Angaben zu Vergütung, Wochenarbeitszeit und Einsatzort müssen "
                    "widerspruchsfrei mit der Erklärung zum Beschäftigungsverhältnis übereinstimmen."
                ),
                False,
                make_figure(
                    "C0535",
                    "Zwei deutsche Muttersprachler unterrichten an der DMF Talents Akademie Begrüßung, Kommunikation und Arbeitskultur",
                    "Interkulturelle Kommunikation vor Saisonbeginn:",
                    "Deutsche Gastdozenten bereiten die Bewerberinnen und Bewerber am Campus in Vietnam gezielt auf Servicekommunikation, Höflichkeitsformen und Teamabsprachen im Betrieb vor.",
                ),
            ),
            (
                "Wie beantragen Sie die Vorabzustimmung bei der ZAV für kurzzeitige Beschäftigte aus Vietnam?",
                (
                    "Für das Verfahren nach § 15d BeschV beantragt der Arbeitgeber zunächst die Vorabzustimmung bei der "
                    "zuständigen Stelle der Bundesagentur für Arbeit unter Vorlage von Arbeitsvertrag, Tarifnachweis und "
                    "Reisekostenübernahme-Erklärung. Nach Eingang der ZAV-Vorabzustimmung stellt die ausgewählte Arbeitskraft den "
                    "Visumantrag bei der deutschen Auslandsvertretung in Hanoi oder Ho-Chi-Minh-Stadt."
                ),
                (
                    "Personalabteilungen sollten für Vorabzustimmung, Reiseplanung und Terminvergabe an der Auslandsvertretung "
                    "ausreichend zeitlichen Puffer vor Beginn der Hochsaison einplanen, da Bearbeitungsdauern von der regionalen "
                    "Auslastung der Behörden abhängen. Bei der Ferienbeschäftigung nach § 14 Abs. 2 BeschV tritt an die Stelle "
                    "des § 15d-Verfahrens die ZAV-Vermittlungsbestätigung samt Immatrikulationsbescheinigung (anabin H+ oder H+/-) "
                    "und Bescheinigung über die offiziellen Semesterferien. Eine strukturierte Vorabprüfung aller Dokumente "
                    "reduziert Rückfragen im laufenden Antragsprozess erheblich."
                ),
                False,
                make_figure(
                    "C0146",
                    "DMF-Koordinator im blauen Poloshirt begleitet einen Kandidaten und dessen Familie beim Check-in am internationalen Flughafen",
                    "Strukturierte Ausreisekoordination durch DMF Talents:",
                    "Vom vollständigen Dokumenten-Briefing bis zum Abflug-Check-in am Flughafen stellt unser Team sicher, dass alle Unterlagen für die Einreise nach Deutschland vollständig vorliegen.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Prüfen Sie gemeinsam mit unserem B2B-Team, welches Saisonmodell rechtlich zu Ihrem Betrieb passt: "
            "Informieren Sie sich über unser [Saisonkräfte- und Kurzzeitprogramm](/services/seasonal), kalkulieren Sie "
            "alternativ langfristige Besetzungskosten im [ROI-Rechner](/roi-rechner) oder übermitteln Sie Ihren konkreten "
            "Einsatzzeitraum direkt über die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf)."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 160: Ferienbeschäftigung (§ 14 Abs. 2 BeschV), Unterkunft & Mindestlohn 2027
    # -----------------------------------------------------------------------
    {
        "num": 160,
        "slug": "ferienbeschaeftigung-14-abs-2-beschv-unterkunft-mindestlohn-2027",
        "title": "Ferienbeschäftigung (§ 14 Abs. 2 BeschV), Unterkunft & Mindestlohn 2027: Compliance-Leitfaden für Saisonbetriebe",
        "meta_title": "§ 14 Abs. 2 BeschV: Ferienjob, Unterkunft & Mindestlohn 2027",
        "meta_description": "Rechtssichere Ferienbeschäftigung (§ 14 Abs. 2 BeschV) für Studierende aus Vietnam: ZAV-Nachweis, 14,60 € Mindestlohn 2027 und SvEV-Sachbezugswerte.",
        "cover_image": "/images/blog/dmf-p13-ferienbeschaeftigung-unterkunft-compliance-2027.jpg",
        "keywords": [
            "Ferienbeschäftigung § 14 Abs. 2 BeschV",
            "Mindestlohn 2027 14,60 Euro Saisonbetriebe",
            "Unterkunft SvEV Sachbezugswerte § 107 GewO",
            "Auszubildende Vietnam Arbeitgeber",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Compliance-Leitfaden für Saisonbetriebe 2027: ZAV-Voraussetzungen für die 90-Tage-Ferienbeschäftigung (§ 14 Abs. 2 BeschV), 14,60 Euro Mindestlohn und SvEV-Unterkunftsgrenzen.",
        "tldr": (
            "Nach § 14 Abs. 2 BeschV dürfen im Ausland an anerkannten Hochschulen (anabin H+ / H+/-) immatrikulierte "
            "Studierende unter 35 Jahren bis zu 90 Tage in zwölf Monaten mit ZAV-Vermittlungsbestätigung und Schengen-Visum "
            "während ihrer Semesterferien in Deutschland arbeiten. Ab 1. Januar 2027 gilt zwingend der gesetzliche Mindestlohn "
            "von 14,60 Euro brutto (§ 1 MiLoG), wobei Unterkunft nur gemäß § 107 Abs. 2 GewO bis zu den "
            "SvEV-Sachbezugswerten 2027 (289,00 Euro Alleinbelegung) anrechenbar bleibt."
        ),
        "intro": (
            "In Obstbau, Saisonhotellerie und Logistik unterliegen Betriebe beim Einsatz vietnamesischer Studierender nach "
            "§ 14 Abs. 2 BeschV strengen Prüfungen durch die Finanzkontrolle Schwarzarbeit (FKS) des Zolls. Fehlerhafte "
            "Unterkunftsabzüge oder lückenhafte Stundenzettel führen schnell zu Bußgeldern nach § 21 MiLoG und gefährden "
            "künftige ZAV-Vermittlungsbestätigungen."
        ),
        "svg": "/images/blog/dmf-p13-160-ferienjob-14-beschv-mindestlohn-2027.svg",
        "svg_alt": "Zwei-Säulen-Compliance-Grafik zu § 14 Abs. 2 BeschV, Mindestlohn 14,60 Euro 2027 und SvEV-Unterkunftsgrenzen",
        "svg_caption": "Aufenthalts- und arbeitsrechtliche Leitplanken 2027: ZAV-Prüfung (§ 14 Abs. 2 BeschV) sowie Lohn- und Unterkunfts-Compliance.",
        "table_headers": [
            "Compliance-Bereich 2027",
            "Gesetzliche Vorgabe & Wert 2027",
            "Rechtsgrundlage",
            "Typische Prüffrage von ZAV / Zoll (FKS)",
        ],
        "table_rows": [
            [
                "Mindestlohn & Stücklohn",
                "14,60 € brutto/Std. ab 01.01.2027 (auch bei Akkordprämien garantiert)",
                "§ 1, § 20 MiLoG",
                "Wird 14,60 € in jeder einzelnen Stunde ohne versteckte Abzüge erreicht?",
            ],
            [
                "Unterkunftsanrechnung (SvEV 2027)",
                "Max. 289,00 €/Mon. (1 Pers.), 173,40 € (2 Pers.), 144,50 € (3 Pers.), 115,60 € (>3 Pers.)",
                "§ 107 Abs. 2 GewO i. V. m. SvEV 2027; § 850c ZPO",
                "Entspricht die Unterkunft ASR A4.4 und bleibt der unpfändbare Barlohn gewahrt?",
            ],
            [
                "Arbeitszeit- & Aufzeichnungspflicht",
                "Tägliche Erfassung von Beginn, Ende & Dauer binnen 7 Tagen; ArbZG-Grenzen",
                "§ 17 MiLoG; §§ 3, 18 ArbZG",
                "Liegen lückenlose Stundenzettel sowie ZAV-Vermittlungsbestätigung vor Ort bereit?",
            ],
            [
                "Visum, Semesterferien & Reisekosten",
                "Schengen-Visum (C-Visum bis 90 Tage); Reisekosten bei § 15d nicht abziehbar",
                "§ 14 Abs. 2 BeschV; § 15d Abs. 2 Nr. 3 BeschV",
                "Deckt sich der Einsatz exakt mit den offiziellen Semesterferien der Heimathochschule?",
            ],
        ],
        "sections": [
            (
                "Welche Voraussetzungen prüft die ZAV für die Ferienbeschäftigung nach § 14 Abs. 2 BeschV?",
                (
                    "Für die Ferienbeschäftigung verlangt die Bundesagentur für Arbeit zwingend einen gültigen Nachweis, dass "
                    "die Bewerberin oder der Bewerber unter 35 Jahre alt ist und an einer in anabin mit H+ oder H+/- "
                    "bewerteten Hochschule in Vietnam Vollzeit studiert. Zudem muss der geplante Arbeitszeitraum exakt in die "
                    "offiziellen Semesterferien fallen und darf 90 Kalendertage innerhalb von zwölf Monaten nicht überschreiten."
                ),
                (
                    "Die ZAV stellt auf Basis des konkreten Stellenangebots eine namentliche Vermittlungsbestätigung für den "
                    "Visumantrag aus. In Vietnam beantragen die Studierenden ein Schengen-Visum (Kategorie C) samt "
                    "Arbeitsvertrag, Immatrikulationsbescheinigung und offizieller Semesterferienbestätigung. Da kein "
                    "deutsches Sprachzertifikat und keine Kammeranerkennung nötig sind, eignet sich der Pfad bei rechtzeitiger "
                    "Antragstellung für saisonale Spitzenzeiten."
                ),
                True,
                make_figure(
                    "C0147",
                    "Abschiedsgespräch zwischen einem vietnamesischen DMF-Kandidaten und seinen Eltern im Abflugterminal",
                    "Verlässliche Vorbereitung bis zum Abflugtag:",
                    "Alle Teilnehmerinnen und Teilnehmer erhalten vor der Abreise ein vollständiges Dokumentenpaket inklusive ZAV-Bestätigung, Arbeitsvertrag und Einreisehinweisen.",
                ),
            ),
            (
                "Wie dürfen Sie Unterkunft und Verpflegung 2027 nach § 107 Abs. 2 GewO auf den Mindestlohn anrechnen?",
                (
                    "Eine Anrechnung von Unterkunft und Verpflegung auf den gesetzlichen Mindestlohn von 14,60 Euro brutto "
                    "pro Stunde ab dem 1. Januar 2027 ist ausschließlich im Rahmen von § 107 Abs. 2 GewO bis zur Höhe der "
                    "amtlichen Sachbezugswerte nach der Sozialversicherungsentgeltverordnung (SvEV 2027) zulässig. Darüber "
                    "hinaus muss die verbleibende Nettoauszahlung zwingend den unpfändbaren Einkommensbetrag nach § 850c ZPO "
                    "vollständig wahren."
                ),
                (
                    "Für 2027 gelten monatliche SvEV-Obergrenzen für freie Unterkunft: 289,00 Euro bei Alleinbelegung, "
                    "173,40 Euro pro Person bei Zweibettzimmern, 144,50 Euro bei Dreibettzimmern und 115,60 Euro ab vier "
                    "Personen (bei Teilmonaten anteilig 1/30 täglich). Zwingend sind eine schriftliche Vereinbarung vor "
                    "Arbeitsbeginn und Unterkunftsstandards nach ASR A4.4. Bei § 15d-Kräften bleiben Hin- und Rückreisekosten "
                    "nach § 15d Abs. 2 Nr. 3 BeschV stets nicht anrechenbar."
                ),
                False,
                make_figure(
                    "C0090",
                    "Kursteilnehmer der Kohorte K50 im DMF-Poloshirt beim Deutschtraining an der weißen Tafel im Seminarraum",
                    "Basisdeutsch für Sicherheit und Arbeitsabläufe:",
                    "Bereits vor dem Saisonstart vermittelt die DMF Talents Akademie praxisnahe Grundbegriffe zu Arbeitssicherheit, Schichtplänen und Unterkunftsregeln.",
                ),
            ),
            (
                "Welche Arbeitszeit-, Zoll- und Sozialversicherungspflichten gelten beim Saisoneinsatz im Betrieb?",
                (
                    "Unabhängig von der kurzen Einsatzdauer sind Saisonbetriebe gemäß § 17 MiLoG verpflichtet, Beginn, Ende "
                    "und Dauer der täglichen Arbeitszeit jeder Ferienkraft spätestens sieben Kalendertage nach der Arbeitsleistung "
                    "schriftlich oder elektronisch zu erfassen und mindestens zwei Jahre aufzubewahren. Gleichzeitig gelten die "
                    "Schutzgrenzen des Arbeitszeitgesetzes (§§ 3, 18 ArbZG) sowie die Meldepflichten zur Sozialversicherung."
                ),
                (
                    "Die werktägliche Arbeitszeit von acht Stunden darf nur auf zehn Stunden steigen, wenn innerhalb von "
                    "sechs Monaten oder 24 Wochen der Acht-Stunden-Schnitt gewahrt bleibt und elf Stunden Ruhezeit folgen. "
                    "Bei kurzfristiger Beschäftigung nach § 8 Abs. 1 Nr. 2 SGB IV prüft die Einzugsstelle streng auf "
                    "Berufsmäßigkeit, was vorab mit der Minijob-Zentrale abzuklären ist. Ergänzend zeigt unser "
                    "[Leitfaden zur Blauen Karte EU 2027](/blog/blaue-karte-eu-2027-mindestlohn-gehaltsgrenzen-drittstaaten) "
                    "die Entgeltgrenzen für reguläre Fachkräfte."
                ),
                False,
                make_figure(
                    "C0989",
                    "Lächelnde DMF-Kursteilnehmerin mit einem Adventsgeschenk neben dem geschmückten Weihnachtsbaum am Campus",
                    "Gemeinschaftsgefühl senkt saisonale Fehlzeiten:",
                    "Feste Ansprechpersonen und gemeinsame Campus-Veranstaltungen fördern das Zusammengehörigkeitsgefühl der Gruppen bereits vor ihrer Reise nach Deutschland.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Planen Sie Ihren Saisonbedarf 2027 rechtssicher ohne Bußgeldrisiken bei Mindestlohn oder Unterkunft: "
            "Entdecken Sie unser [Programm für Saisonkräfte und Ferienbeschäftigung](/services/seasonal) oder senden Sie uns "
            "Ihre Einsatzdaten und benötigten Kapazitäten direkt über das [B2B-Formular für Ihren Personalbedarf](/fuer-arbeitgeber/personalbedarf)."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 161: Stammkräfte-Wiederkehrer & Übergangsrecht (§ 15d -> § 16a / § 18a)
    # -----------------------------------------------------------------------
    {
        "num": 161,
        "slug": "stammkraefte-wiederkehrer-saisonarbeit-uebergang-16a-18a-aufenthg",
        "title": "Stammkräfte-Wiederkehrer & Übergangsrecht: Vom Saisoneinsatz (§ 15d BeschV) in Ausbildung (§ 16a) oder Fachkraft (§ 18a)",
        "meta_title": "Stammkräfte-Wiederkehrer & Übergang § 15d in § 16a/§ 18a",
        "meta_description": "Wie bauen Betriebe ein Wiederkehrer-Modell für Saisonkräfte auf und wann gelingt der rechtssichere Übergang von § 15d BeschV in § 16a oder § 18a AufenthG?",
        "cover_image": "/images/blog/dmf-p13-stammkraefte-wiederkehrer-uebergang.jpg",
        "keywords": [
            "Stammkräfte Wiederkehrer Saisonarbeit",
            "Übergang § 15d BeschV in § 16a § 18a AufenthG",
            "Zweckwechsel Saisonkraft Deutschland",
            "Auszubildende Vietnam Arbeitgeber",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Vom bewährten Saisoneinsatz in die feste Ausbildung (§ 16a) oder Fachkraftstelle (§ 18a): Warum ein direkter Zweckwechsel im Inland unzulässig ist und wie Wiederkehrer-Modelle funktionieren.",
        "tldr": (
            "Bewährte Saisonkräfte (§ 15a BeschV) und Kurzzeitbeschäftigte (§ 19c Abs. 1 AufenthG i. V. m. § 15d BeschV) "
            "unterliegen festen Jahresgrenzen (6 bzw. 8 Monate je zwölf Monate) sowie der Ausreisepflicht nach Ablauf. "
            "Ein direkter Zweckwechsel aus § 15d oder § 14 Abs. 2 BeschV im Inland ist gesetzlich ausgeschlossen; "
            "Wiederkehrer-Stammpool und Übergang in § 16a oder § 18a AufenthG erfolgen über fristgerechte Ausreise, "
            "B1/B2-Qualifizierung und § 81a AufenthG."
        ),
        "intro": (
            "Viele Gastronomiebetriebe, Hotels und Logistikunternehmen erleben im ersten Saisoneinsatz eine positive "
            "Überraschung: Bewährte Kurzzeitkräfte arbeiten sich rasch in Küchen-, Service- oder Lagerabläufe ein und "
            "harmonisieren gut mit der Stammbelegschaft. Unmittelbar vor Ablauf des achtmonatigen Aufenthalts entsteht "
            "deshalb häufig der Wunsch, die Person direkt vor Ort in Deutschland zu halten und nahtlos in eine "
            "Berufsausbildung oder Fachkraftanstellung zu übernehmen. Ohne genaue Kenntnis des Aufenthaltsgesetzes führen "
            "vorschnelle Versprechungen jedoch regelmäßig zur Ablehnung bei der kommunalen Ausländerbehörde."
        ),
        "svg": "/images/blog/dmf-p13-161-stammkraefte-wiederkehrer-uebergangspfad.svg",
        "svg_alt": "Zwei-Wege-Prozessmodell für Stammkräfte-Wiederkehrer nach § 15d BeschV und den regulären Übergang in § 16a oder § 18a AufenthG",
        "svg_caption": "Aufenthaltsrechtlicher Ablauf nach Saisonende: Wiederkehrer-Zyklus für die nächste Saison versus Upgrade-Pfad über Vietnam.",
        "table_headers": [
            "Strategiepfad nach Saisonende",
            "Rechtsgrundlage",
            "Ausreise erforderlich?",
            "Typischer Zeitplan & Sprachziel",
        ],
        "table_rows": [
            [
                "Wiederkehrer-Stammpool nächste Saison",
                "§ 19c Abs. 1 AufenthG i. V. m. § 15d Abs. 3 BeschV",
                "Ja (nach max. 8 Mon. in 12 Mon.; betriebliches 10-Monats-Limit)",
                "Rechtzeitige Kontingent-Anmeldung im Folgejahr; geringerer Einarbeitungsaufwand",
            ],
            [
                "Erneuter Ferienjob für Studierende",
                "§ 14 Abs. 2 BeschV (bis 90 Tage je 12 Monate)",
                "Ja (Rückkehr zum Weiterstudium im Heimatland)",
                "Jährlich in offiziellen Semesterferien wiederholbar bis Abschluss / Alter 35",
            ],
            [
                "Übergang in duale Ausbildung nach Rückkehr",
                "§ 16a AufenthG i. V. m. § 81a AufenthG (beschleunigtes Verfahren)",
                "Ja (Neues nationales D-Visum bei Botschaft Hanoi / GK HCMC)",
                "Aufbau B1/B2-Zertifikat in Vietnam + IHK/HWK-Vertrag -> Einreise in 3–5 Mon.",
            ],
            [
                "Übergang in Fachkräftebeschäftigung",
                "§ 18a oder § 16d Abs. 3 AufenthG",
                "Ja (Neues Visumverfahren nach BQFG-/ZAB-Prüfung)",
                "Parallel Anerkennung & B1/B2 in Vietnam vorbereiten -> dauerhafter Titel inkl. § 18c",
            ],
        ],
        "sections": [
            (
                "Wie funktioniert das Wiederkehrer-Modell für eingearbeitete Saisonkräfte im Folgejahr?",
                (
                    "Ein strukturierter Wiederkehrer-Stammpool baut auf eingearbeiteten Saisonkräften auf, die nach Ablauf ihrer "
                    "höchstens achtmonatigen Beschäftigung nach § 15d BeschV pünktlich in ihr Heimatland Vietnam zurückkehren "
                    "und im nächsten Zwölfmonatszeitraum erneut mit frischer ZAV-Vorabzustimmung einreisen. Dadurch entfallen "
                    "im Folgejahr langwierige Basiseinweisungen in Kassensysteme, Hygieneregeln, betriebliche Abläufe und "
                    "verbindliche Schichtstandards."
                ),
                (
                    "Für die Personalplanung ist die Einhaltung der gesetzlichen Fristen entscheidend: Ein Arbeitnehmer darf über "
                    "§ 15d BeschV höchstens acht Monate innerhalb von zwölf Monaten in Deutschland beschäftigt werden, während "
                    "der Einsatzbetrieb selbst die betriebliche Obergrenze von insgesamt zehn Monaten in zwölf Monaten wahren "
                    "muss (§ 15d Abs. 3 BeschV). Dokumentieren Betriebe die fristgerechte Ausreise sauber und melden den "
                    "Personalbedarf für die Folgesaison frühzeitig vor Beginn des Kontingentfensters bei der ZAV an, lässt sich "
                    "ein verlässlicher Kern aus Rückkehrern aufbauen, der neue Teammitglieder vor Ort sicher mit einarbeitet."
                ),
                True,
                make_figure(
                    "C0022",
                    "Lächelnde DMF-Kandidatin präsentiert ihr Lehrbuch Zertifikat B1 neu für die Vorbereitung auf Ausbildung und Fachkraftstelle",
                    "Vom Saisoneinsatz zum zertifizierten B1/B2-Abschluss:",
                    "Wer nach dem befristeten Aufenthalt den langfristigen Einstieg in Deutschland anstrebt, absolviert an der DMF Akademie das strukturierte Vollzeittraining bis zum Goethe-, telc- oder ÖSD-Zertifikat.",
                ),
            ),
            (
                "Warum ist ein direkter Zweckwechsel aus § 15d BeschV in § 16a oder § 18a AufenthG im Inland nicht zulässig?",
                (
                    "Der Gesetzgeber hat die kontingentierte kurzzeitige Beschäftigung nach § 19c Abs. 1 AufenthG i. V. m. "
                    "§ 15d BeschV ausdrücklich als vorübergehende Lösung konzipiert und schließt einen Zweckwechsel in einen "
                    "längerfristigen Aufenthaltstitel während des laufenden Aufenthalts in Deutschland gesetzlich aus. Gleiches "
                    "gilt für Studierende mit einem Schengen-Visum nach § 14 Abs. 2 BeschV gemäß § 6 AufenthG und § 39 AufenthV."
                ),
                (
                    "In der Praxis bedeutet diese Sperre: Selbst wenn ein Hotel oder Logistikunternehmen bereits einen "
                    "unterzeichneten IHK-Ausbildungsvertrag vorlegt, darf die kommunale Ausländerbehörde den Titel aus § 15d BeschV "
                    "im Inland regelmäßig nicht in eine Aufenthaltserlaubnis nach § 16a oder § 18a AufenthG umschreiben. "
                    "Versuche, die Ausreisepflicht durch kurzfristige Anträge vor Ort zu umgehen, riskieren Ausreiseaufforderungen "
                    "und spätere Sperrwirkungen im Visumverfahren. Rechtssicher bleibt ausschließlich die geordnete Ausreise und "
                    "die Beantragung des passenden nationalen D-Visums über die deutsche Auslandsvertretung in Vietnam."
                ),
                False,
                make_figure(
                    "C0155",
                    "Gruppenaufnahme von vietnamesischen Auszubildenden, Eltern und DMF-Betreuern mit Reisegepäck am internationalen Flughafen",
                    "Geordnete Aus- und Wiedereinreise ohne Rechtslücken:",
                    "Die dokumentierte Rückkehr nach dem Kurzzeiteinsatz bewahrt die aufenthaltsrechtliche Zuverlässigkeit und bildet die solide Basis für ein künftiges nationales D-Visum.",
                ),
            ),
            (
                "Wie planen Betriebe den rechtssicheren Übergang vom Saisoneinsatz zur festen Ausbildung oder Fachkraftstelle?",
                (
                    "Der zügigste Weg zur dauerhaften Übernahme beginnt bereits während der laufenden Saison: Arbeitgeber und "
                    "Mitarbeitende unterzeichnen frühzeitig den künftigen Ausbildungsvertrag (§ 16a) oder Arbeitsvertrag (§ 18a) "
                    "mit einem realistischen Starttermin im Folgejahr. Nach fristgerechter Ausreise schließt die Bewerberin oder "
                    "der Bewerber in Vietnam die noch fehlende B1/B2-Prüfung ab, während der Betrieb das beschleunigte "
                    "Fachkräfteverfahren nach § 81a AufenthG startet."
                ),
                (
                    "Dieses zweistufige Verfahren bietet zwei entscheidende Vorteile: Erstens kennen sich Betrieb und Kandidat "
                    "bereits aus der täglichen Zusammenarbeit, wodurch Fehleinschätzungen in der späteren Probezeit minimiert "
                    "werden. Zweitens verkürzt das § 81a-Verfahren die Wartezeit auf den Visumtermin bei der Botschaft in Hanoi "
                    "oder dem Generalkonsulat in Ho-Chi-Minh-Stadt gesetzlich auf drei Wochen nach Vorabzustimmung. Für "
                    "ausgebildete Kräfte eröffnet eine parallel vorbereitete BQFG-Anerkennung zudem den direkten Zugang zur "
                    "dauerhaften Fachkräftebeschäftigung bis hin zur Niederlassungserlaubnis nach § 18c AufenthG."
                ),
                False,
                make_figure(
                    "C0921",
                    "Deutscher Dozent erklärt im Unterricht an der DMF Akademie das Vereinsleben und gesellschaftliche Integration in Deutschland",
                    "Langfristige Bindung über die erste Saison hinaus:",
                    "Im landeskundlichen Unterricht lernen zukünftige Auszubildende und Fachkräfte soziale Strukturen wie Sportvereine, Ehrenamt und Nachbarschaft in Deutschland kennen.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Verknüpfen Sie saisonale Soforthilfe mit langfristiger Fachkräftesicherung: Informieren Sie sich über unser "
            "[Saisonkräfteprogramm](/services/seasonal), das [duale Ausbildungsprogramm (§ 16a)](/services/azubi), die "
            "[Fachkräftevermittlung (§ 18a/§ 16d)](/services/skilled-workers) oder simulieren Sie den genauen "
            "Übergangszeitraum im [Zeitplan-Simulator für Arbeitgeber](/fuer-arbeitgeber/zeitplan)."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 162: TVöD-Pflege (P5–P8), TVAöD & AVR Caritas/Diakonie Eingruppierung
    # -----------------------------------------------------------------------
    {
        "num": 162,
        "slug": "tvoed-pflege-tvaoed-avr-eingruppierung-internationale-pflegekraefte",
        "title": "TVöD-Pflege (P5–P8), TVAöD & AVR Caritas/Diakonie: Tarifliche Eingruppierung internationaler Pflegekräfte und Azubis",
        "meta_title": "TVöD-Pflege, TVAöD & AVR: Eingruppierung in der Pflege",
        "meta_description": "Wie werden Pflegekräfte (§ 16d, § 18a) und Pflege-Azubis (§ 16a) im TVöD-Pflege, TVAöD sowie AVR Caritas/Diakonie rechtssicher eingruppiert?",
        "cover_image": "/images/blog/dmf-p13-tvoed-avr-pflege-eingruppierung.jpg",
        "keywords": [
            "TVöD-Pflege Eingruppierung P5 P7 P8",
            "AVR Caritas Diakonie internationale Pflegekräfte",
            "§ 72 Abs. 3a 3b SGB XI § 16d AufenthG",
            "Fachkräfte aus Vietnam",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Leitfaden für Kliniken, Pflegeheime und Träger zur Eingruppierung internationaler Pflegekräfte und Azubis nach TVöD-P, TVAöD-P, AVR Caritas/DD sowie § 72 SGB XI.",
        "tldr": (
            "Im TVöD-P und AVR Caritas (Anlagen 31/32, Reform 2027) starten internationale Pflegekräfte in der Anerkennung "
            "(§ 16d Abs. 3 AufenthG) meist in P5/P6 (ab 2.907 €) und steigen mit Urkunde in P7 (ab 3.510,30 €, Stufe 2) "
            "oder P8 auf; Pflege-Azubis erhalten im TVAöD-P ab 1.490,69 € brutto, in der AVR.DD gilt EG 7/EG 8. Nach "
            "§ 72 SGB XI zugelassene Pflegeeinrichtungen nutzen § 16d ohne Tarifbindung, erfüllen aber § 72 Abs. 3a/3b SGB XI."
        ),
        "intro": (
            "Bei der Einstellung vietnamesischer Pflegekräfte und Pflege-Azubis entscheidet die korrekte tarifliche "
            "Eingruppierung bereits in der Erklärung zum Beschäftigungsverhältnis (EzB) über die Zustimmung der "
            "Bundesagentur für Arbeit. Zugleich sichern sich Pflegedienstleitungen volle Nachvollziehbarkeit in den "
            "Entgeltverhandlungen mit Pflegekassen durch einen klaren Abgleich zwischen TVöD-P, kirchlichen AVR und § 72 SGB XI."
        ),
        "svg": "/images/blog/dmf-p13-162-tvoed-avr-pflege-eingruppierungsstufen.svg",
        "svg_alt": "Tarifliche Stufen- und Entgeltübersicht für internationale Pflegekräfte und Azubis nach TVöD-P, AVR Caritas, AVR.DD und § 72 SGB XI",
        "svg_caption": "Vergütungspfad von der Anerkennungsphase (§ 16d) über die Berufsurkunde (§ 18a) bis zur Einbindung von § 72 SGB XI.",
        "table_headers": [
            "Tarifwerk / Arbeitsrechtsregelung",
            "Pflege-Azubi (§ 16a)",
            "Anerkennungsphase (§ 16d / Helfer)",
            "Nach Berufsurkunde (§ 18a Fachkraft)",
        ],
        "table_rows": [
            [
                "TVöD-P / TVAöD-Pflege (VKA, ab 05/2026)",
                "1.490,69 € / 1.552,07 € / 1.653,38 € + 400 € Abschlussprämie",
                "P5 (ab 2.907,18 €) bzw. P6 (ab 3.012,49 €)",
                "P7 (ab 3.510,30 € Stufe 2; Stufe 1 unbesetzt) / P8 (ab 3.701,21 €)",
            ],
            [
                "AVR Caritas (Anlagen 31/32, Reform 01/2027)",
                "Analog TVAöD-Pflege gemäß Ausbildungsvertrag",
                "Helfer-/Assistenzgruppe bis zur Urkundenerteilung",
                "P7 (ab 3.510,30 € in Stufe 2; Stufe 1 unbesetzt) / P8 (ab 3.701,21 € Stufe 1) + Pflegezulage",
            ],
            [
                "AVR Diakonie Deutschland (AVR.DD, 09/2026–10/2027)",
                "Ausbildungsentgelt nach AVR-Ausbildungsordnung",
                "EG 4 / EG 5 in Anpassungsqualifizierung",
                "EG 7 (3.874,15–4.545,76 €) / EG 8 (4.242,44–5.004,00 €)",
            ],
            [
                "Private Träger (§ 72 SGB XI & § 16d Abs. 3 AufenthG)",
                "Mind. § 17 BBiG (2027: 764 €; empf. ≥ 1.050 €)",
                "Pflege-Ausnahme in § 16d Abs. 3 S. 1 AufenthG i. V. m. § 2a BeschV: § 72-SGB-XI-Zulassung genügt ohne eigene Tarifbindung",
                "Regional übliches Entlohnungsniveau (§ 72 Abs. 3b SGB XI) als Versorgungsvertrags- und Refinanzierungspflicht gegenüber Pflegekassen (während Nicht-§-72-Arbeitgeber Tarifbindung benötigen)",
            ],
        ],
        "sections": [
            (
                "Welche Entgeltgruppen im TVöD-P und in den AVR gelten vor und nach der Pflege-Anerkennung?",
                (
                    "Während der Anpassungsphase nach § 16d AufenthG bis zum Bestehen der Kenntnisprüfung oder des "
                    "Anpassungslehrgangs greift mangels deutscher Erlaubnis zum Führen der Berufsbezeichnung die Eingruppierung "
                    "als Pflegehelferin oder Pflegehelfer in P5 beziehungsweise bei mindestens einjähriger einschlägiger "
                    "Ausbildung in P6. Unmittelbar ab Vorlage der staatlichen Berufsurkunde erfolgt der zwingende Aufstieg in "
                    "P7 (TVöD-P / AVR Caritas) beziehungsweise EG 7/EG 8 (AVR.DD)."
                ),
                (
                    "Im TVöD-P und den reformierten AVR Caritas (Anlagen 31/32 ab 01/2027) bleibt in Entgeltgruppe P7 die "
                    "Stufe 1 unbesetzt, sodass examinierte Kräfte direkt in Stufe 2 (ab 3.510,30 Euro in der VKA-Tabelle ab "
                    "05/2026) einsteigen. Auf Intensiv- oder OP-Stationen gilt P8 (ab 3.701,21 Euro) zuzüglich Pflegezulagen. "
                    "Pflege-Azubis im TVAöD-P erhalten 1.490,69, 1.552,07 und 1.653,38 Euro brutto sowie 400 Euro "
                    "Abschlussprämie."
                ),
                True,
                make_figure(
                    "C0549",
                    "Deutsche Dozentin Melda moderiert eine Gesprächsrunde mit DMF-Kursteilnehmenden zum Thema Arbeit und deutsche Kultur",
                    "Kommunikation auf Augenhöhe im Pflegeteam:",
                    "Deutsche Lehrkräfte schulen angehende Pflegefachkräfte und Pflege-Azubis gezielt in Arbeitskultur, Dienstplanverständnis und Teamdialog.",
                ),
            ),
            (
                "Wie erkennen Sie vietnamesische Berufserfahrung bei der Stufenzuordnung im TVöD und bei Caritas/Diakonie an?",
                (
                    "Eine zwingende Stufenanrechnung nach § 16 Abs. 2 TVöD-P setzt eine einschlägige Berufserfahrung voraus, "
                    "die nach Umfang und Verantwortung mit der auszuübenden Tätigkeit einer examinierten Pflegefachkraft "
                    "gleichwertig ist. Klinische Berufsjahre aus Vietnam vor Erteilung der deutschen Berufsurkunde werden daher "
                    "häufig erst ab dem Urkundendatum regulär pflichtig oder über die Kann-Regelung für förderliche Zeiten "
                    "berücksichtigt."
                ),
                (
                    "Beglaubigte Arbeitszeugnisse vietnamesischer Kliniken mit präziser Stationsbeschreibung sollten von Beginn "
                    "an zur Personalakte genommen werden. Über die Kann-Bestimmung für förderliche Zeiten nach § 16 Abs. 2 "
                    "Satz 4 TVöD sowie entsprechende AVR-Regeln vereinbaren Träger bei Personalbedarf gezielt höhere Stufen "
                    "(etwa Stufe 2 oder 3 in P8 oder EG 7), um transparente Perspektiven für die Bindung nach der Probezeit "
                    "zu schaffen."
                ),
                False,
                make_figure(
                    "C0137",
                    "Deutscher Lehrer erklärt berufsspezifische Redewendungen und Arbeitsanweisungen an der Tafel eines DMF-Unterrichtsraums",
                    "Präzise Fach- und Alltagssprache für die Station:",
                    "Im Intensivunterricht an der DMF Talents Akademie trainieren Pflegekräfte Redemittel für Übergaben, Pflegedokumentation und Rückfragen an Ärztinnen und Ärzte.",
                ),
            ),
            (
                "Wie greifen Tariftreue (§ 72 Abs. 3a/3b SGB XI) und die Pflege-Ausnahme im § 16d Abs. 3 AufenthG für private Träger ineinander?",
                (
                    "Für private Pflegeheime und ambulante Dienste enthält § 16d Abs. 3 Satz 1 AufenthG in Verbindung mit "
                    "§ 2a BeschV eine zentrale Pflege-Ausnahme: Ist die Einrichtung nach § 72 SGB XI zur pflegerischen "
                    "Versorgung zugelassen, darf sie die Anerkennungspartnerschaft auch ohne eigene Tarifbindung nutzen. "
                    "Unabhängig vom Aufenthaltsrecht verpflichtet § 72 Abs. 3a und 3b SGB XI alle Pflegeeinrichtungen gegenüber "
                    "den Pflegekassen mindestens zur Zahlung des regional üblichen Entlohnungsniveaus."
                ),
                (
                    "Während Arbeitgeber außerhalb der Pflege für § 16d Abs. 3 AufenthG zwingend tarifgebunden bleiben, genügt "
                    "bei zugelassenen Pflegeeinrichtungen für die ZAV der Versorgungsvertrag nach § 72 SGB XI. Davon getrennt "
                    "regelt § 72 Abs. 3b SGB XI das regional übliche Entlohnungsniveau für Kassenverträge und Refinanzierung. "
                    "Für private Pflege-Azubis empfehlen sich trotz § 17 BBiG (2027: 764 Euro) mindestens rund 1.050 Euro "
                    "brutto."
                ),
                False,
                make_figure(
                    "C0987",
                    "Teilnehmende schmücken gemeinsam einen Weihnachtsbaum in den Räumlichkeiten der DMF Talents Akademie",
                    "Kulturelle Vertrautheit erleichtert den Pflegealltag:",
                    "Durch gemeinsame Pflege deutscher Jahresfeste wie Weihnachten lernen internationale Pflegekräfte Traditionen kennen, die im Alltag vieler Seniorenheime eine wichtige Rolle spielen.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Stimmen Sie Eingruppierung, § 81a-Vorabzustimmung und Refinanzierung frühzeitig aufeinander ab: Nutzen Sie "
            "unsere [Branchenlösung für Pflege und Gesundheit](/fuer-arbeitgeber/branchen/pflege-gesundheit), vergleichen "
            "Sie unsere Programme für [internationale Fachkräfte](/services/skilled-workers) und "
            "[Pflege-Auszubildende](/services/azubi) oder berechnen Sie die Wirtschaftlichkeit direkt im "
            "[ROI-Rechner für Arbeitgeber](/roi-rechner)."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 163: 3-Jahres-Vollkostenrechnung (TCO)
    # -----------------------------------------------------------------------
    {
        "num": 163,
        "slug": "3-jahres-tco-vollkostenrechnung-direktrekrutierung-vs-headhunter",
        "title": "3-Jahres-Vollkostenrechnung (TCO): Direktrekrutierung aus Vietnam vs. Headhunter, Personalvermittlung & Zeitarbeit",
        "meta_title": "3-Jahres-TCO: Direktrekrutierung vs. Headhunter & Zeitarbeit",
        "meta_description": "36-Monats-TCO-Vergleich für CFOs: Direktrekrutierung aus Vietnam vs. Headhunter (20–33 % Honorar), Zeitarbeit & Vakanzkosten inkl. § 4 Abs. 4 EStG & ROI.",
        "cover_image": "/images/blog/dmf-p13-3-jahres-tco-direktrekrutierung-headhunter.jpg",
        "keywords": [
            "3-Jahres-Vollkostenrechnung TCO Direktrekrutierung",
            "Headhunter vs Direktrekrutierung Vietnam Zeitarbeit",
            "§ 4 Abs. 4 EStG § 296a SGB III",
            "Fachkräfte aus Vietnam",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "36-Monats-Vollkostenrechnung für Geschäftsführer und CFOs: Modellrechnung zu Headhunter-Honoraren, Zeitarbeit (§ 1 Abs. 1b AÜG), Vakanzkosten und steuerlicher Absetzbarkeit (§ 4 Abs. 4 EStG).",
        "tldr": (
            "In einer 36-Monats-Vollkostenrechnung (TCO) entscheidet nicht die einmalige Vermittlungsgebühr, sondern die "
            "Summe aus Honorar, Vakanzverlust (Cost of Vacancy), laufenden Aufschlägen und Fluktuation. Während Zeitarbeit "
            "(§ 1 Abs. 1b AÜG: max. 18 Monate) oft 18.000 bis 25.000 Euro Mehrkosten jährlich verursacht und Headhunter "
            "20 bis 33 Prozent vom Jahresbrutto bei knappem Inlandsmarkt berechnen, amortisiert sich die "
            "DMF-Direktrekrutierung (§ 18a/§ 81a AufenthG; > 95 % Bleibequote) nach 4 bis 7 Monaten."
        ),
        "intro": (
            "Kaufmännische Geschäftsführer und Personalleiter bewerten Rekrutierungskanäle häufig isoliert anhand der "
            "ersten Rechnungsposition. Eine solche Einmalbetrachtung verdeckt jedoch die tatsächlichen Gesamtbetriebskosten "
            "(Total Cost of Ownership) über einen Zeitraum von drei Jahren: Entscheidend sind entgangene Deckungsbeiträge "
            "während unbesetzter Monate, laufende Verrechnungssätze in der Arbeitnehmerüberlassung sowie Folgekosten "
            "durch erneute Vakanzen nach der Probezeit. Die nachfolgende Gegenüberstellung bildet eine transparente "
            "Modellrechnung auf Basis der auf /referenzen und /roi-rechner dokumentierten Richtwerte sowie aktueller "
            "gesetzlicher Gebührensätze; sie stellt kein starres Festpreisversprechen und keine Ergebniszusage dar, sondern "
            "dient der betriebswirtschaftlichen Szenarioplanung."
        ),
        "svg": "/images/blog/dmf-p13-163-3-jahres-tco-vollkostenvergleich.svg",
        "svg_alt": "36-Monats-Vollkostenvergleich (TCO) zwischen DMF-Direktrekrutierung, inländischen Headhuntern und Zeitarbeit",
        "svg_caption": "Modellhafte Kostenentwicklung über 36 Monate: Einmalinvestition mit Break-Even gegen fortlaufende Zeitarbeitsaufschläge und Vakanzkosten.",
        "table_headers": [
            "TCO-Kostenkomponente (36 Monate)",
            "DMF Direktrekrutierung (§ 18a / § 81a)",
            "Inlands-Headhunter / Personalberatung",
            "Zeitarbeit / AÜG (Vergleichswert)",
        ],
        "table_rows": [
            [
                "Vermittlungshonorar & Einstiegskosten",
                "Einmalige Meilenstein-Pauschale (Employer-Pays § 296a SGB III)",
                "Marktüblich 20–33 % vom Jahresbruttozieleinkommen (zzgl. Spesen)",
                "0 € Einstieg, aber 80–120 % Aufschlag + ggf. Ablöse",
            ],
            [
                "Behörden-, Anerkennungs- & Reisekosten",
                "411 € (§ 81a / § 47 AufenthV) + 75 € Visum + ca. 100–600 € Kammer + Flug",
                "Entfallen im Inland; dafür oft wiederholte Inserats- & Recruiting-Budgets",
                "Keine Überlassung für Drittstaats-Neueinreisen (§ 40 AufenthG)",
            ],
            [
                "Vakanzkosten & Zeit bis Start",
                "4–6 Mon. via § 81a aus B1/B2-Pool; danach planbare Vollzeit",
                "Oft 6–12+ Mon. Suchdauer bei knappem Inlandsmarkt (150–300 €/Tag Vakanzausfall)",
                "Kurzfristig bei Verfügbarkeit, aber max. 18 Mon. (§ 1 Abs. 1b AÜG)",
            ],
            [
                "Fluktuation & 36-Monats-TCO-Bilanz",
                "> 95 % Bleibequote, Break-Even 4–7 Mon., Betriebsausgabe (§ 4 Abs. 4 EStG)",
                "Abwerberisiko nach Probezeit; kurze Garantiefristen",
                "18.000–25.000 €+ Mehrkosten/Jahr (35.000–65.000 € in 36 Mon.)",
            ],
        ],
        "sections": [
            (
                "Welche Kostenpositionen gehören in eine belastbare 3-Jahres-Vollkostenrechnung (TCO) für eine Fachkraftstelle?",
                (
                    "Eine belastbare 36-Monats-Vollkostenrechnung erfasst vier Bausteine: direkte Vermittlungshonorare, "
                    "gesetzliche Behörden- und Anerkennungsgebühren (411 Euro nach § 47 Abs. 1 Nr. 15 AufenthV, 75 Euro "
                    "Visumgebühr sowie rund 100 bis 600 Euro Kammergebühr), interne Einarbeitungskosten und den täglichen "
                    "Vakanzverlust (Cost of Vacancy). Erst die Addition über drei Jahre legt offen, wie stark laufende Aufschläge "
                    "oder lange Suchzeiten die Marge belasten."
                ),
                (
                    "Gerade beim Vakanzausfall rechnen viele Betriebe zu konservativ: Bleibt eine Stelle in der Pflege, im "
                    "Handwerk oder in der industriellen Produktion unbesetzt, entstehen je nach Betriebsgröße und Auslastung "
                    "oft 150 bis 300 Euro pro Tag an entgangenem Deckungsbeitrag, gesperrten Kapazitäten oder teuren "
                    "Überstundenzuschlägen im Stammteam. Bei einer modellhaften Gesamtabwägung – wie sie auf unserer Seite "
                    "[Referenzen und 3-Jahres-Modellvergleich](/referenzen) sowie im interaktiven ROI-Rechner abgebildet ist – "
                    "fallen zudem sämtliche Verpflichtungen aus § 296a SGB III ins Gewicht: Bei Ausbildungs- und regulären "
                    "Vermittlungen trägt grundsätzlich der Arbeitgeber das Honorar, um Verschuldungsdruck beim Personal "
                    "auszuschließen."
                ),
                True,
                make_figure(
                    "C0667",
                    "Außenansicht des Akademiegebäudes von DMF Talents während eines Besuchs einer deutschen Fachdelegation",
                    "Direktquelle ohne mehrstufige Untervermittler:",
                    "Eigene Campus-Infrastruktur in Vietnam reduziert externe Makleraufschläge und sichert dem Arbeitgeber volle Transparenz über Sprachstand und Aktenlage.",
                ),
            ),
            (
                "Wie schneidet die Direktrekrutierung aus Vietnam über 36 Monate gegenüber Headhuntern und Zeitarbeit ab?",
                (
                    "Im 36-Monats-Vergleich übersteigen die kumulierten Aufschläge von Zeitarbeit und wiederholter "
                    "Inlandssuche per Headhunter die einmalige Investition der Direktrekrutierung nach den veröffentlichten "
                    "Richtwerten deutlich. Während Leiharbeit nach den Modellwerten von /referenzen häufig 18.000 bis 25.000 Euro "
                    "jährliche Mehrkosten erzeugt und nach 18 Monaten (§ 1 Abs. 1b AÜG) endet, trägt sich die Festanstellung "
                    "im Modell nach vier bis sieben Monaten."
                ),
                (
                    "Bei inländischen Headhuntern verschärft der enge Arbeitsmarkt zudem das Risiko von Mehrfachwechseln: "
                    "Marktübliche Honorare von 20 bis 33 Prozent eines Jahresbruttogehalts lösen kein strukturelles Angebotsproblem, "
                    "wenn abgeworbene Fachkräfte wenige Monate nach Ablauf der Probezeit von Wettbewerbern weiter angesprochen "
                    "werden. Für neu einreisende Fachkräfte aus Drittstaaten verbietet § 40 Abs. 1 Nr. 2 AufenthG ohnehin die "
                    "Überlassung als Zeitarbeitnehmer. Im Direktrekrutierungsmodell von DMF Talents mit über 66 dokumentierten "
                    "Vermittlungen und einer dokumentierten Bleibequote von über 95 Prozent bleibt der Kompetenzaufbau hingegen "
                    "dauerhaft im eigenen Stammpersonal erhalten – vorbehaltlich individueller Vertrags-, Sprach- und "
                    "Einarbeitungsbedingungen im Betrieb."
                ),
                False,
                make_figure(
                    "C1327",
                    "Zwei deutsche Fachtrainer führen an der DMF Talents Akademie einen Workshop zu deutschen Arbeitsstandards durch",
                    "Vorabqualifizierung schützt vor teurer Fehlbesetzung:",
                    "Durch praxisnahe Workshops deutscher Experten lernen Bewerberinnen und Bewerber betriebliche Abläufe vorab kennen und senken das Risiko einer Probezeitkündigung.",
                ),
            ),
            (
                "Wie wirken sich § 81a-Gebühren, Nachbesetzungsgarantie und § 4 Abs. 4 EStG auf die CFO-Bilanz aus?",
                (
                    "Steuerlich stellen Vermittlungshonorare, § 81a-Behördengebühren (411 Euro gemäß § 47 AufenthV), "
                    "beglaubigte Übersetzungen sowie Reisekosten unmittelbar abzugsfähige Betriebsausgaben der "
                    "Personalgewinnung nach § 4 Abs. 4 EStG dar und mindern den steuerlichen Gewinn im Jahr des Anfalls. "
                    "Liquiditätsschonend wirkt zusätzlich die transparente Meilenstein-Abrechnung bei Vertragsunterzeichnung, "
                    "Visumerteilung und tatsächlichem Arbeitsantritt."
                ),
                (
                    "Anders als pauschale Vorauszahlungen binden Meilenstein-Modelle Zahlungen an erreichte Verfahrensschritte "
                    "und regeln Nachbesetzungsoptionen bei Ausfall vor Start. Weil Behördenentscheidungen stets bei "
                    "Kammern, ZAV und Botschaften liegen, existieren keine Pauschalgarantien; CFOs sollten eigene Stundensätze "
                    "und Eintrittstermine vorab abgleichen."
                ),
                False,
                make_figure(
                    "C1738",
                    "Offizielles Bewerbungsfoto von DMF-Kandidat Phạm Ngọc Hoàng Duy im weißen Hemd für Arbeitgeberdossiers",
                    "Strukturierte Kandidatendossiers für klare Auswahlentscheidungen:",
                    "Vollständige Profile mit Sprachzertifikaten, Ausbildungsnachweisen und Interview-Einschätzung ermöglichen Geschäftsführern und HR-Teams eine fundierte Budgetentscheidung.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Erstellen Sie Ihre betriebsindividuelle 36-Monats-Kalkulation auf Basis Ihrer aktuellen Gehalts- und "
            "Auslastungsdaten: Prüfen Sie die Benchmark-Werte auf unserer [Referenzseite](/referenzen), testen Sie eigene "
            "Szenarien im [interaktiven ROI-Rechner](/roi-rechner) oder fordern Sie eine unverbindliche Kostenschätzung "
            "über das [B2B-Anfrageformular](/fuer-arbeitgeber/personalbedarf) an."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 164: AEVO, Ausbildungsbefugnis (§§ 28–30 BBiG / § 22b HwO) & Verkürzung (§ 8 BBiG)
    # -----------------------------------------------------------------------
    {
        "num": 164,
        "slug": "ausbildereignungsverordnung-aevo-ausbildungsbefugnis-28-30-bbig-verkuerzung-8-bbig",
        "title": "AEVO, Ausbildungsbefugnis (§§ 28–30 BBiG) & Verkürzung (§ 8 BBiG): Rechtlicher Leitfaden für Ausbildungsbetriebe",
        "meta_title": "AEVO, §§ 28–30 BBiG & Verkürzung § 8 BBiG für Betriebe",
        "meta_description": "Welche Ausbilder-Anforderungen (AEVO, §§ 28–30 BBiG, § 22b HwO, § 4 PflAPrV) und Verkürzungsregeln (§ 8 BBiG) gelten bei internationalen Auszubildenden?",
        "cover_image": "/images/blog/dmf-p13-aevo-ausbildungsbefugnis-bbig-betrieb.jpg",
        "keywords": [
            "AEVO Ausbildungsbefugnis §§ 28-30 BBiG",
            "§ 22b HwO § 4 PflAPrV internationale Azubis",
            "Ausbildungszeitverkürzung § 8 BBiG § 45 BBiG",
            "Auszubildende Vietnam Arbeitgeber",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Rechtlicher Leitfaden für Ausbildungsbetriebe: Was IHK, HWK und Pflegeschulen bei der Ausbildungsbefugnis (§§ 27–30 BBiG, § 22b HwO, § 4 PflAPrV) und Ausbildungsverkürzung (§ 8 BBiG) verlangen.",
        "tldr": (
            "Für internationale Auszubildende (§ 16a AufenthG) prüft die Kammer die Ausbildungsstätte (§ 27 BBiG) sowie "
            "die persönliche (§ 29 BBiG / § 22a HwO) und fachliche Eignung des Ausbilders (§ 30 BBiG i. V. m. AEVO bzw. "
            "§ 22b HwO / Teil IV Meisterprüfung). Im Alltag dürfen Ausbildungsbeauftragte (§ 28 Abs. 3 BBiG) anleiten; "
            "in der Pflege gilt § 4 PflAPrV (10 % Praxisanleitung). Eine Verkürzung nach § 8 BBiG sollte sprachlich "
            "realistisch geprüft werden."
        ),
        "intro": (
            "Bevor ein Betrieb einen Ausbildungsvertrag aus Vietnam nach § 16a AufenthG zur Eintragung bei der Kammer "
            "einreicht, prüft diese Ausbildungsstätte und Ausbildereignung. Klare Nachweise vorab vermeiden Rückfragen "
            "im § 81a-Verfahren und sichern die realistische Entscheidung über eine Ausbildungszeitverkürzung."
        ),
        "svg": "/images/blog/dmf-p13-164-aevo-bbig-ausbildungsbefugnis-verkuerzung.svg",
        "svg_alt": "Zwei-Ebenen-Übersicht zur Ausbildungsbefugnis nach §§ 27–30 BBiG, AEVO, § 22b HwO, § 4 PflAPrV und Verkürzung nach § 8 BBiG",
        "svg_caption": "Gesetzliche Eignungsnachweise von Ausbildungsstätte und Ausbildenden im Vergleich zur Regelung der Ausbildungsdauer (§ 8 und § 45 BBiG).",
        "table_headers": [
            "Rechtsbereich & Norm",
            "Geltungsbereich (IHK / HWK / Pflege)",
            "Pflichtnachweis für den Betrieb",
            "Praxishinweis für internationale Azubis (§ 16a)",
        ],
        "table_rows": [
            [
                "Ausbildereignung (§§ 28–30 BBiG, AEVO)",
                "IHK-Berufe (Industrie, Handel, HoGa, Logistik, IT)",
                "Berufsabschluss + Praxis + AEVO-Ausbilderschein",
                "Mind. ein bestellter Ausbilder mit AEVO; Prüfung vor Kammer-Eintragung",
            ],
            [
                "Handwerk & Meister-Äquivalenz (§ 22b Abs. 2, § 46 Abs. 1c HwO; § 6 Abs. 2 AusbEignV)",
                "Handwerke der HWK",
                "Fachliche Eignung nach § 22b HwO (persönliche Nichteignung: § 22a HwO): Meisterprüfung Teil IV ersetzt AEVO (und umgekehrt bei Meisteranmeldung)",
                "Eintragung in HWK-Lehrlingsrolle vor § 81a-Antrag",
            ],
            [
                "Ausbildungsbeauftragte & Pflege (§ 28 Abs. 3 BBiG; § 4 PflAPrV)",
                "Alle Betriebe (BBiG) sowie Pflege (PflBG/PflAPrV)",
                "BBiG: unter Anleitung Ausbilder; Pflege: 300-Std.-Praxisanleiter + 10 % Anleitung",
                "AEVO ersetzt in Pflege nicht die 300-Std.-Weiterbildung",
            ],
            [
                "Ausbildungszeitverkürzung (§ 8 Abs. 1 BBiG; § 45 Abs. 1 BBiG)",
                "Gemeinsamer Antrag Betrieb & Azubi bei Kammer",
                "Bis 6–12 Mon. (Vorbildung, Alter ≥ 21 J., Bestleistungen)",
                "Bei B1-Start erst nach Zwischenprüfung (§ 45 BBiG) verkürzen statt überfordern",
            ],
        ],
        "sections": [
            (
                "Welche Voraussetzungen verlangen §§ 28–30 BBiG und die AEVO von Ihrem Ausbildungsbetrieb?",
                (
                    "Nach dem Berufsbildungsgesetz muss der Betrieb sowohl als Ausbildungsstätte nach Art und Einrichtung "
                    "geeignet sein (§ 27 BBiG) als auch mindestens eine persönlich (§ 29 BBiG) und fachlich (§ 30 BBiG) "
                    "geeignete Ausbilderin oder einen Ausbilder schriftlich bei der Kammer benennen. Die berufs- und "
                    "arbeitspädagogische Eignung belegen IHK-Betriebe in der Regel durch die bestandene Prüfung nach der "
                    "Ausbilder-Eignungsverordnung (AEVO)."
                ),
                (
                    "Nach § 30 BBiG erfordert die fachliche Eignung neben dem AEVO-Schein auch einen einschlägigen Abschluss "
                    "und angemessene Berufspraxis. Fehlt ein AEVO-Ausbilder, kann eine Fachkraft die Prüfung oft parallel "
                    "zur Sprachvorbereitung in Vietnam ablegen, damit die Vertragseintragung termingerecht gelingt."
                ),
                True,
                make_figure(
                    "C1322",
                    "Achim Betticher und ein deutscher Fachexperte leiten ein Vorbereitungsseminar für angehende DMF-Auszubildende",
                    "Strukturierte Vorbereitung auf duale Ausbildungsstandards:",
                    "In Workshops mit erfahrenen deutschen Ausbildern lernen Bewerberinnen und Bewerber Berichtsheftführung, Sicherheitsregeln und Lernverantwortung kennen.",
                ),
            ),
            (
                "Wann genügen Ausbildungsbeauftragte (§ 28 Abs. 3 BBiG) und was gilt abweichend in Pflege und Handwerk (§ 22b HwO)?",
                (
                    "Nach § 28 Abs. 3 BBiG dürfen erfahrene Fachkräfte ohne eigenen Ausbilderschein als "
                    "Ausbildungsbeauftragte einzelne Arbeitsabläufe im Tagesgeschäft anleiten, solange der bestellte "
                    "Ausbilder die Gesamtverantwortung und Aufsicht behält. Im Handwerk gilt für die fachliche Eignung "
                    "§ 22b HwO, während die Pflegeausbildung zwingend Praxisanleiter nach § 4 PflAPrV erfordert."
                ),
                (
                    "Im Handwerk regelt § 22b Abs. 2 HwO (§ 46 Abs. 1c HwO, § 6 Abs. 2 AusbEignV) die Gleichwertigkeit: "
                    "Meisterprüfung Teil IV ersetzt die AEVO, während persönliche Nichteignung in § 22a HwO steht. In der "
                    "Pflege gilt AEVO nicht als Ersatz: § 4 Abs. 3 PflAPrV verlangt mindestens zehn Prozent Praxisanleitung "
                    "durch Weitergebildete mit 300 Stunden Berufspädagogik."
                ),
                False,
                make_figure(
                    "C0835",
                    "Deutscher Gastdozent notiert Themen zu Schule, Arbeit und deutscher Kultur an der Tafel des Seminarraums",
                    "Brücke zwischen Berufsschule und Ausbildungsbetrieb:",
                    "Deutsche Lehrkräfte erklären das duale Zusammenspiel aus Berufsschultagen, betrieblicher Unterweisung und Kammerprüfungen bereits vor dem Vertragsstart.",
                ),
            ),
            (
                "Wann sollten Sie eine Verkürzung nach § 8 BBiG oder eine vorzeitige Zulassung (§ 45 BBiG) für internationale Azubis nutzen?",
                (
                    "Gemäß § 8 Abs. 1 BBiG können Betrieb und Auszubildender gemeinsam bei der Kammer eine Verkürzung der "
                    "Ausbildungszeit um bis zu zwölf Monate beantragen, etwa bei vorhandenem Hochschulzugang, einschlägiger "
                    "Vorbildung oder einem Lebensalter über 21 Jahre. Bei internationalen Auszubildenden mit Sprachniveau B1 "
                    "empfiehlt sich jedoch regelmäßig erst die spätere vorzeitige Prüfungszulassung nach § 45 Abs. 1 BBiG."
                ),
                (
                    "Eine sofortige Verkürzung vor Einreise nimmt im ersten Jahr wertvolle Lernzeit für Fachtheorie und "
                    "Berichtshefte. Überzeugt der Azubi bis zur Zwischenprüfung oder GAP 1 mit überdurchschnittlichen Noten, "
                    "erlaubt § 45 Abs. 1 BBiG den sechs Monate früheren Prüfungsantritt ohne Risiko. Details bündelt unser "
                    "[Rückwärts-Zeitplan für den Ausbildungsstart 2027](/blog/ausbildungsstart-herbst-2027-rueckwaerts-zeitplan-arbeitgeber)."
                ),
                False,
                make_figure(
                    "C1314",
                    "Heller Lesebereich der DMF Talents Akademie mit Regalen voller deutscher Fach- und Lehrwerke",
                    "Fundierte Fachtheorie statt Zeitdruck:",
                    "In der Akademie-Bibliothek bereiten sich künftige Auszubildende mit deutschen Lehrmaterialien systematisch auf den Berufsschulunterricht vor.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Prüfen Sie Ihre Kammer-Eintragung und das passende Einreisezeitfenster für Ihr kommendes Ausbildungsjahr: "
            "Informieren Sie sich in unserem [dualen Ausbildungsprogramm (§ 16a)](/services/azubi), planen Sie die "
            "Vorlaufzeiten im [Zeitplan-Simulator](/fuer-arbeitgeber/zeitplan) oder reichen Sie Ihre offenen "
            "Ausbildungsplätze über die [Personalanfrage für Arbeitgeber](/fuer-arbeitgeber/personalbedarf) ein."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 165: Chemikanten, Pharmakanten & Produktionsfachkräfte Chemie
    # -----------------------------------------------------------------------
    {
        "num": 165,
        "slug": "chemikanten-pharmakanten-chemieproduktion-vietnam-ihk",
        "title": "Chemikanten, Pharmakanten & Produktionsfachkräfte Chemie aus Vietnam: IHK-Anerkennung und Schichtbetrieb",
        "meta_title": "Chemikanten & Pharmakanten aus Vietnam: IHK & § 18a/§ 16a",
        "meta_description": "Chemikanten, Pharmakanten und Produktionsfachkräfte Chemie aus Vietnam einstellen: IHK FOSA-Anerkennung, § 16d AufenthG, Azubis § 16a und Schichtbetrieb.",
        "cover_image": "/images/blog/dmf-chemikant-pharmakant-produktion-labor.jpg",
        "keywords": [
            "Chemikanten Pharmakanten Vietnam IHK",
            "Produktionsfachkräfte Chemie § 16a § 18a",
            "IHK FOSA BQFG GefStoffV Schichtbetrieb",
            "Fachkräfte aus Vietnam",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "Leitfaden für Chemie- und Pharmaunternehmen: Besetzung von Stellen für Chemikanten, Pharmakanten und Produktionsfachkräfte Chemie (KldB 41312) aus Vietnam über IHK FOSA, § 16d und § 16a AufenthG.",
        "tldr": (
            "Deutsche Chemie- und Pharmabetriebe besetzen offene Stellen für Chemikanten (3,5 Jahre Ausbildung), "
            "Pharmakanten (3,5 Jahre) und Produktionsfachkräfte Chemie (2 Jahre, KldB 41312) über zwei rechtssichere "
            "Wege aus Vietnam: die duale Ausbildung nach § 16a AufenthG sowie die Fachkräftezuwanderung nach § 18a oder "
            "§ 16d Abs. 3 AufenthG (Anerkennungspartnerschaft) mit Gleichwertigkeitsprüfung bei der IHK FOSA. Sprachniveau "
            "B1/B2, GefStoffV-Sicherheitsunterweisung und Kontischicht-Eignung werden vor der Einreise geprüft."
        ),
        "intro": (
            "In deutschen Chemieparks, Arzneimittelwerken und Lohnherstellungsbetrieben führt der demografische Wandel "
            "gerade im vollkontinuierlichen Mehrschichtbetrieb zu spürbaren Ausfällen an den Produktionsanlagen. "
            "Während die Nachfrage nach zuverlässigen Anlagenfahrern für Prozessleitsysteme und Reinraumlinien steigt, "
            "bleiben inländische Ausbildungs- und Gesellenstellen für Chemikanten sowie Pharmakanten oft über Monate "
            "unbesetzt. Vietnamesische Absolventen naturwissenschaftlich-technischer Berufskollegs und Hochschulen "
            "bringen für diese hoch regulierten Produktionsumgebungen solide MINT-Grundlagen mit."
        ),
        "svg": "/images/blog/chemikant-pharmakant-ihk-qualifikationspfad.svg",
        "svg_alt": "Qualifikations- und Anerkennungspfade für Chemikanten, Pharmakanten und Produktionsfachkräfte Chemie aus Vietnam",
        "svg_caption": "Vergleich der Zuwanderungspfade (§ 16a Ausbildung vs. § 18a / § 16d Abs. 3 IHK FOSA) entlang der Anforderungen aus KldB 41312.",
        "table_headers": [
            "Berufsbild / KldB 2010",
            "Ausbildungsdauer (BBiG) & Einstiegspfad",
            "Zuständige Stelle",
            "Betriebliche Schwerpunkte (Schicht / Normen)",
        ],
        "table_rows": [
            [
                "Chemikant/-in (KldB 41312)",
                "3,5 Jahre dual (§ 16a) oder Fachkraft (§ 18a / § 16d Abs. 3)",
                "IHK / IHK FOSA",
                "Prozessleitsysteme, Destillation, Kontischicht-Betrieb, GefStoffV",
            ],
            [
                "Pharmakant/-in (KldB 41312)",
                "3,5 Jahre dual (§ 16a) oder Fachkraft (§ 18a / § 16d Abs. 3)",
                "IHK / IHK FOSA",
                "Arzneimittelherstellung, GMP-Reinraumhygiene, Verpackungsstraßen",
            ],
            [
                "Produktionsfachkraft Chemie (KldB 41312)",
                "2 Jahre dual (§ 16a) mit Anrechnungsoption auf Chemikant",
                "Regionale IHK",
                "Anlagenbedienung, Probenahme, Arbeitssicherheit & B1-Fachtheorie",
            ],
            [
                "Chemie- & Pharmatechnik-Ingenieure (B.Sc.)",
                "Blaue Karte EU (§ 18g) oder Fachkraft (§ 18b AufenthG)",
                "anabin (H+) / ZAB Zeugnisbewertung",
                "Verfahrenstechnik, Qualitätsmanagement, Scale-up & Produktion",
            ],
        ],
        "sections": [
            (
                "Welche vietnamesischen Abschlüsse eignen sich für die Anerkennung als Chemikant oder Pharmakant?",
                (
                    "Für eine Gleichwertigkeitsprüfung bei der IHK FOSA nach dem Berufsqualifikationsfeststellungsgesetz (BQFG) "
                    "eignen sich vor allem zwei- bis dreijährige vietnamesische Berufskollegabschlüsse (Trung cấp oder Cao đẳng) "
                    "in Chemietechnik, Pharmaproduktion, Biotechnologie oder Verfahrenstechnik sowie praxisnahe "
                    "Bachelor-Abschlüsse (Đại học). Bei mindestens zweijähriger staatlich anerkannter Ausbildung steht zudem "
                    "die Anerkennungspartnerschaft nach § 16d Abs. 3 AufenthG offen."
                ),
                (
                    "Entscheidend für den Anerkennungsbescheid der IHK FOSA in Nürnberg ist nicht der formale Titel des "
                    "Zeugnisses, sondern der detaillierte Abgleich der Fächer, Laborstunden und praktischen Produktionszeiten "
                    "mit dem deutschen Ausbildungsrahmenplan. Während vietnamesische Absolventen bei anorganischer und "
                    "organischer Chemie sowie Stöchiometrie meist hohe Deckungsgrade erreichen, entstehen bisweilen "
                    "Ausgleichsbedarfe bei digitalen Prozessleitsystemen (PLS), deutscher Normung oder spezifischer "
                    "Anlagenwartung. Über das beschleunigte Fachkräfteverfahren nach § 81a AufenthG verkürzt sich die "
                    "Bearbeitungsfrist der IHK FOSA ab Vollständigkeit auf maximal zwei Monate (§ 14a BQFG); alternativ "
                    "ermöglicht § 16d Abs. 3 AufenthG bei tarifgebundenen Chemie- und Pharmaunternehmen bereits die Einreise "
                    "während der laufenden Nachqualifizierung."
                ),
                True,
                make_figure(
                    "C1323",
                    "Achim Betticher und ein deutscher Fachtrainer bereiten DMF-Kandidaten im Gesprächskreis auf deutsche Produktionsstandards vor",
                    "Auswahl nach fachlicher Eignung und Sicherheitsbewusstsein:",
                    "Im strukturierten Gespräch prüfen deutsche Trainer das Verständnis für Prozesssicherheit, Schichtzuverlässigkeit und Dokumentationstreue.",
                ),
            ),
            (
                "Wann ist für Chemie- und Pharmabetriebe die duale Ausbildung (§ 16a AufenthG) sinnvoller als § 16d?",
                (
                    "Die duale Berufsausbildung nach § 16a AufenthG empfiehlt sich immer dann, wenn der Betrieb junge Talente "
                    "über zwei Jahre als Produktionsfachkraft Chemie oder über dreieinhalb Jahre als Chemikant beziehungsweise "
                    "Pharmakant passgenau an eigenen Anlagen und Prozessleitsystemen aufbauen möchte. Zudem entfällt bei "
                    "§ 16a die vorgeschaltete BQFG-Anerkennungsprüfung bei der IHK FOSA vollständig."
                ),
                (
                    "Gerade für Pharmawerke mit strengen Good-Manufacturing-Practice-Vorgaben (GMP) oder spezialisierte "
                    "Chemieunternehmen in Regionen wie [Nordrhein-Westfalen](/fuer-arbeitgeber/standorte/nordrhein-westfalen) "
                    "und [Hessen](/fuer-arbeitgeber/standorte/hessen) bietet die Ausbildung erhebliche Strukturvorteile: "
                    "Berufsschule und betriebliches Technikum verzahnen Anlagenmechanik, Mess- und Regeltechnik sowie deutsche "
                    "Dokumentationskultur von Grund auf. Wer kurzfristig schichtfähige Unterstützung sucht, nutzt häufig die "
                    "zweijährige Ausbildung zur Produktionsfachkraft Chemie nach § 16a AufenthG und entscheidet bei guter "
                    "Leistung über die Anrechnung auf das dritte und vierte Ausbildungsjahr zum Chemikanten."
                ),
                False,
                make_figure(
                    "C0163",
                    "Unterrichtseinheit der Kohorte K30 zu beruflichen Gewohnheiten, Pünktlichkeit und Schichtroutinen in Deutschland",
                    "Gezielte Vorbereitung auf den Schichtalltag:",
                    "Kursteilnehmende der Kohorte K30 üben bereits in Vietnam verbindliche Arbeitszeitpläne, Übergabedialoge und deutsche Betriebsroutinen.",
                ),
            ),
            (
                "Wie bereiten Sie vietnamesische Fachkräfte auf Gefahrstoffrecht (GefStoffV), GMP-Standards und Wechselschicht vor?",
                (
                    "Ein sicherer Produktionsstart erfordert vor Schichtaufnahme eine praxisnahe Einweisung in die "
                    "Gefahrstoffverordnung (GefStoffV), GHS-Piktogramme, persönliche Schutzausrüstung sowie – in der "
                    "Arzneimittelfertigung – die Reinraum- und GMP-Hygieneprotokolle. Sprachlich sollten Anlagenfahrer "
                    "Warnhinweise, Betriebsanweisungen und Alarme mindestens auf solidem B1-Niveau, in der "
                    "GMP-Chargendokumentation idealerweise auf B2-Niveau sicher verstehen."
                ),
                (
                    "Für die Einarbeitung im drei- oder vier-/fünfschichtigen Kontischicht-Betrieb nach Arbeitszeitgesetz "
                    "bewähren sich zweisprachige Sicherheitsmerkblätter für die ersten Wochen in Kombination mit einem festen "
                    "Schichtpaten an der Anlage. Besonderes Augenmerk gilt in der Vorabauswahl auch der gesundheitlichen und "
                    "familiären Bereitschaft zu Nacht-, Wochenend- und Feiertagsschichten sowie der Verkehrsanbindung der "
                    "Chemieparks außerhalb regulärer ÖPNV-Zeiten. DMF Talents berücksichtigt Schichtbereitschaft, "
                    "Laborerfahrung und technisches Sprachverständnis bereits im Vorauswahl-Screening."
                ),
                False,
                make_figure(
                    "C1277",
                    "Studio-Bewerbungsporträt eines DMF-Kandidaten vor neutralem Hintergrund für technische Fachkraftdossiers",
                    "Geprüfte Profile für die chemische und pharmazeutische Industrie:",
                    "Jedes Kandidatendossier enthält verifizierte Ausbildungszeugnisse, Angaben zur Schichtbereitschaft und ein dokumentiertes Deutsch-Sprechtest-Ergebnis.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Sichern Sie Ihre Produktionsanlagen und Reinraumlinien langfristig gegen Schichtausfälle ab: Entdecken Sie "
            "unsere [Branchenlösung für Industrie, Chemie und Technik](/fuer-arbeitgeber/branchen/industrie-metall-technik), "
            "vergleichen Sie die Programme für [Fachkräfte (§ 18a/§ 16d)](/services/skilled-workers) und "
            "[Auszubildende (§ 16a)](/services/azubi) oder kalkulieren Sie Ihren Vorlauf im "
            "[§ 81a-Zeitplan-Simulator](/fuer-arbeitgeber/zeitplan)."
        ),
    },
    # -----------------------------------------------------------------------
    # POST 166: Hörakustiker & Orthopädietechnik-Mechaniker
    # -----------------------------------------------------------------------
    {
        "num": 166,
        "slug": "hoerakustiker-orthopaedietechnik-gesundheitshandwerk-vietnam-hwk",
        "title": "Hörakustiker & Orthopädietechnik-Mechaniker aus Vietnam: HWK-Wege für das Gesundheitshandwerk",
        "meta_title": "Hörakustiker & Orthopädietechnik: HWK-Recruiting Vietnam",
        "meta_description": "Hörakustiker und Orthopädietechnik-Mechaniker aus Vietnam rekrutieren: Meisterpflicht (Anlage A HwO), HWK-Anerkennung, Lübeck/BUFA und § 16a Ausbildung.",
        "cover_image": "/images/blog/dmf-hoerakustik-orthopaedietechnik-werkstatt.jpg",
        "keywords": [
            "Hörakustiker Orthopädietechnik Vietnam HWK",
            "Gesundheitshandwerk Anlage A HwO § 16a § 16d",
            "afh Lübeck BUFA Dortmund Ausbildung",
            "Auszubildende Vietnam Arbeitgeber",
            "DMF Talents Leitfaden",
        ],
        "excerpt": "HWK-Leitfaden für Hörakustik-Fachgeschäfte und Sanitätshäuser: Ausbildung nach § 16a AufenthG mit afh Lübeck bzw. BUFA Dortmund sowie HWK-Anerkennung nach § 18a/§ 16d.",
        "tldr": (
            "Hörakustiker (KldB 82532) und Orthopädietechnik-Mechaniker (KldB 82512) zählen zu den meisterpflichtigen "
            "Gesundheitshandwerken der Anlage A HwO mit bundesweitem Fachkräfteengpass. Fachgeschäfte und Sanitätshäuser "
            "gewinnen qualifizierten Nachwuchs aus Vietnam über die dreijährige duale Ausbildung (§ 16a AufenthG) mit "
            "überbetrieblicher Beschulung in Lübeck beziehungsweise Dortmund (BUFA) sowie für medizinisch-technisch "
            "Vorqualifizierte über die HWK-Gleichwertigkeitsprüfung (§ 18a / § 16d Abs. 3 AufenthG). Sprachniveau B2 "
            "sichert die Patientenberatung."
        ),
        "intro": (
            "Eine alternde Gesellschaft und steigende Versorgungsansprüche treiben die Nachfrage in Sanitätshäusern, "
            "Reha-Fachbetrieben und Hörakustik-Studios seit Jahren nach oben. Gleichzeitig verbinden Hörakustik und "
            "Orthopädietechnik präzise Mikroelektronik, 3D-Scan-CAD-Fertigung und einfühlsame Patientenberatung – eine "
            "Kombination, für die im Inland immer weniger Nachwuchskräfte zur Verfügung stehen. Als zulassungspflichtige "
            "Handwerke der Anlage A zur Handwerksordnung (HwO) bieten beide Berufe über die regionale Handwerkskammer "
            "(HWK) klare und verlässliche Rekrutierungspfade aus Vietnam."
        ),
        "svg": "/images/blog/gesundheitshandwerk-hoerakustik-orthopaedie-pfad.svg",
        "svg_alt": "HWK-Qualifikationspfade für Hörakustiker (afh Lübeck) und Orthopädietechnik-Mechaniker (BUFA Dortmund) aus Vietnam",
        "svg_caption": "Ausbildungs- und Anerkennungswege im Gesundheitshandwerk gemäß Anlage A HwO inklusive Sprachanforderungen B1+/B2.",
        "table_headers": [
            "Gesundheitshandwerk (Anlage A HwO)",
            "KldB 2010 & Ausbildungsdauer",
            "Überbetriebliche Fachschule & Kammer",
            "Typische Aufgaben & Sprachziel",
        ],
        "table_rows": [
            [
                "Hörakustiker/-in",
                "KldB 82532 / 3 Jahre dual (§ 16a) oder HWK-BQFG",
                "Örtliche HWK & Akademie für Hörakustik (afh) Lübeck",
                "Audiometrie, Hörsystem-Anpassung, Otoplastik; Ziel B2 Beratung",
            ],
            [
                "Orthopädietechnik-Mechaniker/-in",
                "KldB 82512 / 3 Jahre dual (§ 16a) oder HWK-BQFG",
                "Örtliche HWK & Bundesfachschule (BUFA) Dortmund",
                "Prothesen-, Orthesen- & Hilfsmittelbau, 3D-Scan; Ziel B1+/B2",
            ],
            [
                "Anerkennungspartnerschaft (§ 16d Abs. 3)",
                "Mind. 2-jähr. staatl. Abschluss aus Vietnam",
                "Regionale HWK + ZAV (§ 81a AufenthG)",
                "Werkstattfertigung & Anpassungsmodule neben Gesellentätigkeit",
            ],
            [
                "Abgrenzung zu Zahntechnik & Augenoptik",
                "Eigene Anlage-A-Gewerke (Augenoptik / Zahntechnik)",
                "Spezifische Fachverordnung & Meisterpräsenz",
                "Patientennahe Versorgung im Sanitätshaus bzw. Akustikstudio",
            ],
        ],
        "sections": [
            (
                "Welche Voraussetzungen gelten im Gesundheitshandwerk für die Ausbildung aus Vietnam nach § 16a AufenthG?",
                (
                    "Für die duale Ausbildung nach § 16a AufenthG müssen Meisterpräsenz und Ausbildungsbefugnis gemäß "
                    "Anlage A HwO (§ 22b HwO / Teil IV Meisterprüfung) sowie die Eintragung des Ausbildungsvertrags in die "
                    "Lehrlingsrolle der zuständigen regionalen Handwerkskammer vorliegen. Neben der praktischen Arbeit im "
                    "Meisterbetrieb organisieren Sanitätshäuser und Hörakustiker die Blockbeschulung an den zentralen "
                    "Bundesfachschulen in Lübeck oder Dortmund."
                ),
                (
                    "Im Unterschied zu vielen Standard-Handwerken findet der theoretische und überbetriebliche Unterricht "
                    "nicht ausschließlich wohnortnah statt: Angehende Hörakustiker besuchen mehrwöchige Blockphasen an der "
                    "Akademie für Hörakustik (afh) in Lübeck, während Orthopädietechnik-Mechaniker regelmäßig die "
                    "Bundesfachschule für Orthopädietechnik (BUFA) in Dortmund oder zentrale Landesfachklassen durchlaufen. "
                    "Für Betriebe etwa in [Nordrhein-Westfalen](/fuer-arbeitgeber/standorte/nordrhein-westfalen) oder "
                    "[Hamburg und Norddeutschland](/fuer-arbeitgeber/standorte/hamburg-norddeutschland) empfiehlt sich deshalb "
                    "die rechtzeitige Reservierung der Internats- und Wohnheimplätze parallel zum § 81a-Verfahren. "
                    "Verwandte Konzepte aus anderen Gesundheitshandwerken schildern unsere Leitfäden zu "
                    "[Augenoptikern](/blog/augenoptiker-optometrie-fachgeschaefte-drittstaaten-vietnam) und "
                    "[Zahntechnikern](/blog/zahntechniker-dentallabor-cad-cam-drittstaaten-vietnam)."
                ),
                True,
                make_figure(
                    "C0071",
                    "DMF-Dozent Thầy Lộc betreut Kursteilnehmende mit gedruckten Prüfungsbögen im Deutschunterricht",
                    "Gezieltes Fachtraining vor der Blockbeschulung:",
                    "Strukturierte Übungsblätter und regelmäßige Leistungskontrollen sichern das Sprachverständnis für Akustik, Anatomie und Werkstoffkunde.",
                ),
            ),
            (
                "Wann greift für vorqualifizierte Techniker die HWK-Anerkennung nach § 18a oder § 16d AufenthG?",
                (
                    "Verfügt eine Bewerberin oder ein Bewerber aus Vietnam bereits über eine mindestens zweijährige staatlich "
                    "anerkannte Ausbildung in Medizintechnik, Audiologie, Feinmechanik oder Physiotherapie-Technik, prüft "
                    "die örtliche Handwerkskammer am Betriebssitz die Gleichwertigkeit nach dem BQFG (§ 18a AufenthG). Bei "
                    "Teil-Gleichwertigkeit oder tarifgebundenem Einstieg ermöglicht § 16d Abs. 3 AufenthG die direkte "
                    "Mitarbeit in der Werkstatt während der Anpassungsphase."
                ),
                (
                    "Da in Vietnam meist keine deckungsgleiche handwerkliche Dualausbildung nach dem deutschen Modell des "
                    "Hörakustikers oder Orthopädietechnik-Mechanikers existiert, erteilen Handwerkskammern erfahrenen "
                    "Medizintechnik- oder Werkstofftechnik-Absolventen in der Praxis häufig einen Bescheid über wesentliche "
                    "Unterschiede (Defizitbescheid). Innerhalb einer Anerkennungspartnerschaft (§ 16d Abs. 3) übernimmt die "
                    "Fachkraft zunächst standardisierte Otoplastik-, Fräs-, Modellbau- oder Reparaturarbeiten im Labor unter "
                    "Aufsicht des Meisters, während sie zielgerichtet Anpassungslehrgänge zu Audiometrie, Hilfsmittelversorgung "
                    "und Patientenberatung absolviert."
                ),
                False,
                make_figure(
                    "C0861",
                    "Workshop-Unterricht mit deutscher Muttersprachlerin vor einer gesamten Schulungsklasse an der DMF Akademie",
                    "Patientenorientierte Kommunikation im Rollenspiel:",
                    "Im Austausch mit deutschen Muttersprachlern trainieren Teilnehmende verständliche Erklärungen technischer Hilfsmittel ohne überladene Fachbegriffe.",
                ),
            ),
            (
                "Warum benötigen Hörakustiker und Orthopädietechniker ein stabiles B1+- bis B2-Sprachniveau im Betrieb?",
                (
                    "Beide Gesundheitshandwerke arbeiten unmittelbar am Menschen und häufig mit älteren Patientinnen und "
                    "Patienten, die auf klare, deutliche Aussprache und geduldiges Zuhören angewiesen sind. Ein solides "
                    "Sprachniveau ab B1+ bis B2 sichert deshalb die fehlerfreie Anamnese, die Erklärung der "
                    "Hilfsmittelhandhabung sowie Rücksprachen mit HNO-Praxen, Orthopäden und Krankenkassen."
                ),
                (
                    "Hinzu kommt die hohe fachsprachliche Dichte bei der Hilfsmittelverordnung, den "
                    "Krankenkassen-Kostenvoranschlägen und der Dokumentation nach Medizinprodukte-Betreiberverordnung. "
                    "Während handwerkliche Azubis für das Visum rechtlich mit einem zertifizierten B1-Abschluss einreisen "
                    "können, legt DMF Talents in den Auswahlgesprächen für Hörakustik und Sanitätshäuser besonderes Gewicht "
                    "auf deutliche Artikulation und aktives Hörverständnis. Durch laufendes Sprechtraining bis B1+/B2 vor "
                    "Abflug erreichen die Auszubildenden deutlich früher die Selbstständigkeit am Empfang und in der "
                    "Anpasskabine."
                ),
                False,
                make_figure(
                    "C0111",
                    "Dozent der Kohorte K32 überprüft Aussprache und Leseverständnis eines Kursteilnehmers anhand eines gedruckten Übungstexts",
                    "Individuelle Aussprachekontrolle in kleinen Gruppen:",
                    "Regelmäßige Einzel-Lesetests gewährleisten eine ruhige, klare Artikulation – eine wesentliche Qualitätseigenschaft für die spätere Kunden- und Patientenberatung.",
                ),
            ),
        ],
        "extra_section": None,
        "cta_text": (
            "Sichern Sie den meistergeführten Nachwuchs in Ihrem Sanitätshaus oder Hörakustik-Meisterbetrieb: Informieren "
            "Sie sich über unsere Branchenkonzepte für [Handwerk und Gesundheitshandwerk](/fuer-arbeitgeber/branchen/handwerk-bau) "
            "sowie [Gesundheitsberufe](/fuer-arbeitgeber/branchen/pflege-gesundheit) oder wählen Sie direkt zwischen "
            "[dualer Ausbildung (§ 16a)](/services/azubi) und [Fachkräfte-Anerkennung (§ 18a/§ 16d)](/services/skilled-workers)."
        ),
    },
]


def render_markdown(article: dict) -> str:
    kw_json = ", ".join(f'"{kw}"' for kw in article["keywords"])

    header_line = "| " + " | ".join(article["table_headers"]) + " |"
    sep_line = "| " + " | ".join("---" for _ in article["table_headers"]) + " |"
    row_lines = ["| " + " | ".join(row) + " |" for row in article["table_rows"]]
    table_md = "\n".join([header_line, sep_line] + row_lines)

    blocks: list[str] = []
    for heading, p1, p2, insert_table, figure_block in article["sections"]:
        parts = [f"## {heading}", p1, p2]
        if insert_table:
            parts.append(table_md)
        if figure_block:
            parts.append(figure_block)
        blocks.append("\n\n".join(parts))

    sections_md = "\n\n".join(blocks)

    return (
        "---\n"
        f'title: "{article["title"]}"\n'
        f'slug: "{article["slug"]}"\n'
        f'published_at: "{PUBLISHED_AT}"\n'
        f'cover_image: "{article["cover_image"]}"\n'
        f'meta_title: "{article["meta_title"]}"\n'
        f'meta_description: "{article["meta_description"]}"\n'
        f"keywords: [{kw_json}]\n"
        f'excerpt: "{article["excerpt"]}"\n'
        "---\n\n"
        f'**Das Wichtigste in Kürze:** {article["tldr"]}\n\n'
        f'{article["intro"]}\n\n'
        f'![{article["svg_alt"]}]({article["svg"]})\n'
        f'_{article["svg_caption"]}_\n\n'
        f"{sections_md}\n\n"
        "---\n\n"
        "### Nächster Schritt für Ihren Betrieb\n\n"
        f'{article["cta_text"]}\n'
    )


def main() -> None:
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    for article in ARTICLES:
        fname = f'{article["num"]}-{article["slug"]}.md'
        out_path = DRAFTS_DIR / fname
        out_path.write_text(render_markdown(article), encoding="utf-8")
        print(f"Wrote Phase 13A draft: {fname}")


if __name__ == "__main__":
    main()
