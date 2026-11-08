#!/usr/bin/env python3
"""
Enrich All Published DMF Talents Blog Articles with Curated Authentic Drive Visuals
===================================================================================
Uses the 28 hand-verified authentic photos exported by the `dmf-drive-visual-curator`
skill (`public/images/community/*.jpg`) to enrich all 161 published articles in
Supabase (`posts` table):
- Flagship 12 DMF Brand Series posts receive 3 bespoke inline `<figure>` blocks
  (total 4 images per post: 1 Hero Cover + 3 inline DMF Community photos).
- All other 149 German B2B SEO/GEO posts receive 2 topically matched inline
  `<figure>` blocks (total 3 images per post: 1 Hero Cover + 2 inline DMF Community
  photos) mapped via the 8-Pillar Topic-to-Pillar Allocation Matrix.
- Every `<figure class="dmf-community-figure">` includes:
  * Semantic `alt` attribute (German B2B & GEO optimized, formal "Sie" register)
  * Editorial `<figcaption>` introducing the real DMF Talents community, cohorts
    (K14–K50), faculty, German delegations, or Visa/Dossier milestones.
- Automatically picked up by `extractInlineImagesFromHtml()` in `lib/seo/blog.ts`
  to emit structured `ImageObject` arrays in `BlogPosting` JSON-LD.
"""

from __future__ import annotations

import hashlib
import json
import re
import urllib.request
from pathlib import Path

SUPABASE_URL = "https://iihprcuhmilmymlbktpy.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHByY3VobWlsbXltbGJrdHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTk4MiwiZXhwIjoyMDgzMTgxOTgyfQ.JbraSUKjSW4iN1FV-bvBfL1CO943dk29ThQcD3ya0vQ"

ROOT_DIR = Path(__file__).resolve().parent.parent
PUB_DIR = ROOT_DIR / "public"

# ---------------------------------------------------------------------------
# 28 Curated Authentic DMF Community Visuals (from Google Drive Catalog)
# Zero informal pronouns (du/dir/dein/euch) - strictly formal German B2B tone
# ---------------------------------------------------------------------------
COMMUNITY_LIBRARY: dict[str, dict[str, str]] = {
    # PILLAR 1: VISA, DOSSIER, AIRPORT & GERMANY ARRIVAL
    "visa_hoang_duy": {
        "cluster_id": "C0003",
        "src": "/images/community/dmf-community-visa-hoang-duy.jpg",
        "pillar": "PILLAR_1_VISA_ARRIVAL",
        "alt": "DMF-Absolvent Hoàng Duy präsentiert sein erteiltes deutsches Visum gemeinsam mit dem Team der DMF Talents Academy in Vietnam",
        "caption": "Einblick in die DMF Talents Community: feierliche Übergabe des erteilten deutschen Visums an DMF-Absolvent Hoàng Duy vor seinem Ausbildungsstart in Meppen (Niedersachsen).",
    },
    "airport_briefing_duy": {
        "cluster_id": "C0140",
        "src": "/images/community/dmf-community-airport-briefing-duy.jpg",
        "pillar": "PILLAR_1_VISA_ARRIVAL",
        "alt": "DMF-Koordinator überprüft am internationalen Flughafen die Ausreise- und Visadokumente mit einem vietnamesischen Auszubildenden",
        "caption": "Strukturierte Ausreisebegleitung durch DMF Talents: persönliches Dokumenten- und Flug-Briefing am internationalen Flughafen vor dem Abflug nach Deutschland.",
    },
    "vfs_visa_application": {
        "cluster_id": "C1396",
        "src": "/images/community/dmf-community-vfs-visa-application.jpg",
        "pillar": "PILLAR_1_VISA_ARRIVAL",
        "alt": "Reisepass und vollständige Antragsunterlagen eines DMF-Kandidaten bei der Visabeantragung im VFS Global Zentrum in Vietnam",
        "caption": "Rechtssichere Visaprozesse (§ 16a / § 18a AufenthG): lückenlos vorbereitete Antragsunterlagen der DMF-Rechtsabteilung beim Einreichen im Visazentrum.",
    },
    "german_translated_transcript": {
        "cluster_id": "C1728",
        "src": "/images/community/dmf-community-german-translated-transcript.jpg",
        "pillar": "PILLAR_1_VISA_ARRIVAL",
        "alt": "Beglaubigte deutsche Übersetzung der schulischen und akademischen Leistungsnachweise in einer DMF-Kandidatenakte",
        "caption": "Dokumenten-Compliance ab Tag 1: beglaubigte deutsche Übersetzungen sämtlicher Zeugnisse und Fächerübersichten für IHK, HWK, ZAB und Ausländerbehörden.",
    },
    "visum_d_zusatzblatt": {
        "cluster_id": "C1730",
        "src": "/images/community/dmf-community-visum-d-zusatzblatt.jpg",
        "pillar": "PILLAR_1_VISA_ARRIVAL",
        "alt": "Originales nationales Visum für Deutschland (Kategorie D) mit offiziellem Zusatzblatt für die Berufsausbildung eines DMF-Talents",
        "caption": "Verifizierte Prozesssicherheit: originales nationales D-Visum („VISUM DEUTSCHLAND“) inklusive Zusatzblatt des Deutschen Generalkonsulats Ho-Chi-Minh-Stadt für einen DMF-Auszubildenden.",
    },
    "visa_hoang_dung": {
        "cluster_id": "C0006",
        "src": "/images/community/dmf-community-visa-hoang-dung.jpg",
        "pillar": "PILLAR_1_VISA_ARRIVAL",
        "alt": "DMF-Absolventin Trần Thị Hoàng Dung feiert ihr deutsches Ausbildungsvisum mit dem Akademieteam vor dem DMF-Education-Logo",
        "caption": "Erfolgsgeschichte aus der DMF Talents Community: Absolventin Trần Thị Hoàng Dung nach der erfolgreichen Visumerteilung für ihre Ausbildung zur Zahnmedizinischen Fachangestellten (ZFA) in Deutschland.",
    },
    # PILLAR 2: GERMAN EXPERTS & INTERVIEW COACHING
    "achim_interview_panel": {
        "cluster_id": "C1326",
        "src": "/images/community/dmf-community-achim-interview-panel.jpg",
        "pillar": "PILLAR_2_INTERVIEW_COACHING",
        "alt": "Deutscher Interview-Coach Achim Betticher und Fachkollege leiten ein praxisnahes Bewerbungstraining an der DMF Academy in Vietnam",
        "caption": "Vorbereitung nach deutschen Arbeitgeberstandards: Herr Achim Betticher und deutsche Experten trainieren mit DMF-Kandidaten reale Vorstellungsgespräche und betriebliche Erwartungen.",
    },
    "achim_candidate_speaking": {
        "cluster_id": "C1335",
        "src": "/images/community/dmf-community-achim-candidate-speaking.jpg",
        "pillar": "PILLAR_2_INTERVIEW_COACHING",
        "alt": "Vietnamesischer DMF-Kandidat antwortet frei auf Deutsch während einer realistischen Interview-Simulation vor deutschen Prüfern",
        "caption": "Aktive Sprechkompetenz statt reinem Auswendiglernen: im DMF-Interview-Coaching begründen Kandidaten ihre Motivation und Fachkenntnisse frei auf Deutsch.",
    },
    "german_instructor_k14": {
        "cluster_id": "C1346",
        "src": "/images/community/dmf-community-german-instructor-k14.jpg",
        "pillar": "PILLAR_2_INTERVIEW_COACHING",
        "alt": "Deutscher Dozent im blauen DMF-Education-Poloshirt vermittelt interkulturelle Arbeitskultur im Seminarraum der Akademie",
        "caption": "Praxisnahe Berufsvorbereitung in Kohorte K14: deutsche Dozenten an der DMF Talents Academy vermitteln Pünktlichkeit, Feedbackkultur und Kommunikation im deutschen Betrieb.",
    },
    "german_trainer_communication": {
        "cluster_id": "C1349",
        "src": "/images/community/dmf-community-german-trainer-communication.jpg",
        "pillar": "PILLAR_2_INTERVIEW_COACHING",
        "alt": "Deutscher Fachtrainer der DMF Talents Academy erläutert betriebliche Kommunikationsabläufe für angehende Auszubildende",
        "caption": "Direkter Wissenstransfer am Campus: muttersprachliche Trainer bereiten die DMF-Talente gezielt auf den Arbeitsalltag in deutschen Ausbildungsbetrieben vor.",
    },
    # PILLAR 3: GERMAN DELEGATION & NATIVE SPEAKER EXCHANGE
    "deutsche_kultur_whiteboard": {
        "cluster_id": "C0571",
        "src": "/images/community/dmf-community-deutsche-kultur-whiteboard.jpg",
        "pillar": "PILLAR_3_GERMAN_DELEGATION",
        "alt": "Deutscher Gastdozent unterrichtet an der DMF-Tafel das Modul Deutsche Kultur, Deutsches Essen, Ängste und Hoffnungen",
        "caption": "Kulturelle Integration vor der Ausreise: im interaktiven Workshop zu „Deutsche Kultur, Menschen, Ängste & Hoffnungen“ bauen DMF-Kandidaten Berührungsängste frühzeitig ab.",
    },
    "german_delegation_gruezi": {
        "cluster_id": "C0520",
        "src": "/images/community/dmf-community-german-delegation-gruezi.jpg",
        "pillar": "PILLAR_3_GERMAN_DELEGATION",
        "alt": "Deutsche Gastdelegation begrüßt eine vollbesetzte Klasse der DMF Talents Academy zum interkulturellen Praxisaustausch",
        "caption": "Gelebte Partnerschaft am DMF-Campus: regelmäßige Besuche deutscher Delegationen ermöglichen den Auszubildenden authentische Gespräche mit Muttersprachlern.",
    },
    "native_speaker_desk_coaching": {
        "cluster_id": "C0853",
        "src": "/images/community/dmf-community-native-speaker-desk-coaching.jpg",
        "pillar": "PILLAR_3_GERMAN_DELEGATION",
        "alt": "Deutscher Muttersprachler betreut eine vietnamesische Kursteilnehmerin im 1-zu-1-Sprachcoaching direkt am Schülertisch",
        "caption": "Individuelle Förderung im 1-zu-1-Dialog: deutsche Gastdozenten trainieren Aussprache, Hörverständnis und spontane Reaktionsfähigkeit direkt im Unterricht.",
    },
    "german_expert_1on1_laptop": {
        "cluster_id": "C0514",
        "src": "/images/community/dmf-community-german-expert-1on1-laptop.jpg",
        "pillar": "PILLAR_3_GERMAN_DELEGATION",
        "alt": "Deutscher Fachexperte bespricht digitale Lernmodule am Laptop mit einer DMF-Kursteilnehmerin im blauen Akademie-Poloshirt",
        "caption": "Qualitätssicherung vor Ort in Vietnam: gemeinsame Überprüfung der Lernfortschritte und Fachmodule durch deutsche Partner und DMF-Lehrkräfte.",
    },
    "intercultural_roundtable": {
        "cluster_id": "C0517",
        "src": "/images/community/dmf-community-intercultural-roundtable.jpg",
        "pillar": "PILLAR_3_GERMAN_DELEGATION",
        "alt": "Interkulturelle Gesprächsrunde zwischen deutschen Gästen, der DMF-Akademieleitung und fortgeschrittenen B1/B2-Absolventen",
        "caption": "Offener Dialog auf Augenhöhe: in moderierten Gesprächsrunden diskutieren DMF-Kandidaten mit deutschen Gästen über Lebensalltag, Berufsschule und gesellschaftliche Werte.",
    },
    "german_delegation_qa_classroom": {
        "cluster_id": "C0854",
        "src": "/images/community/dmf-community-german-delegation-qa-classroom.jpg",
        "pillar": "PILLAR_3_GERMAN_DELEGATION",
        "alt": "Weitwinkelaufnahme eines interaktiven Frage-und-Antwort-Seminars mit deutschen Muttersprachlern an der DMF Talents Academy",
        "caption": "Einblick in die DMF Talents Community: hohe Beteiligung und lebendige Fragerunden auf Deutsch während des Delegationsbesuchs am Campus Biên Hòa.",
    },
    # PILLAR 4: INTENSIVE GERMAN FACULTY
    "faculty_thay_khang_lecture": {
        "cluster_id": "C0053",
        "src": "/images/community/dmf-community-faculty-thay-khang-lecture.jpg",
        "pillar": "PILLAR_4_GERMAN_FACULTY",
        "alt": "DMF-Deutschdozent Thầy Khang unterrichtet Grammatik und Alltagsroutinen vor dem Smartboard der DMF Talents Academy",
        "caption": "Strukturierter Vollzeit-Deutschunterricht (A1 bis B2): DMF-Dozent Thầy Khang vermittelt komplexe Satzstrukturen und berufliche Routinen im modernen Seminarraum.",
    },
    "faculty_thay_loc_grammar": {
        "cluster_id": "C0074",
        "src": "/images/community/dmf-community-faculty-thay-loc-grammar.jpg",
        "pillar": "PILLAR_4_GERMAN_FACULTY",
        "alt": "DMF-Lehrkraft Thầy Lộc erklärt deutsche Grammatikstrukturen an der beschriebenen Tafel im Intensivkurs",
        "caption": "Methodische Sprachausbildung an der DMF Academy: Dozent Thầy Lộc kombiniert präzise Grammatikarbeit mit praxisnahen Dialogübungen für Telc- und Goethe-Prüfungen.",
    },
    "faculty_co_hanh_whiteboard": {
        "cluster_id": "C0103",
        "src": "/images/community/dmf-community-faculty-co-hanh-whiteboard.jpg",
        "pillar": "PILLAR_4_GERMAN_FACULTY",
        "alt": "DMF-Dozentin Cô Hạnh und Kursteilnehmer vor einer vollgeschriebenen Tafel mit deutschen Konnektoren und Satzbauübungen",
        "caption": "Engagiertes Lehrerkollegium bei DMF Talents: Dozentin Cô Hạnh begleitet ihre Klasse intensiv bis zum sicheren Bestehen der B1- und B2-Zertifikatsprüfungen.",
    },
    "faculty_1on1_tutoring": {
        "cluster_id": "C1352",
        "src": "/images/community/dmf-community-faculty-1on1-tutoring.jpg",
        "pillar": "PILLAR_4_GERMAN_FACULTY",
        "alt": "DMF-Sprachlehrer korrigiert gemeinsam mit einem Kursteilnehmer schriftliche Deutschaufgaben im Einzelgespräch",
        "caption": "Engmaschige Lernstandskontrolle: durch regelmäßiges 1-zu-1-Feedback im Unterricht stellt DMF Talents sicher, dass kein Kandidat bei Grammatik oder Fachwortschatz zurückbleibt.",
    },
    # PILLAR 5: CLASSROOM COHORTS & EXAMS (K20-K49)
    "cohort_k32_written_exam": {
        "cluster_id": "C0106",
        "src": "/images/community/dmf-community-cohort-k32-written-exam.jpg",
        "pillar": "PILLAR_5_CLASSROOM_COHORTS",
        "alt": "Kursteilnehmer der Kohorte K32 bearbeiten konzentriert eine schriftliche Deutsch-Zwischenprüfung an der DMF Talents Academy",
        "caption": "Verbindliche Qualitätsstandards in Kohorte K32: wöchentliche schriftliche und mündliche Lernzielkontrollen dokumentieren den realen Sprachfortschritt jedes Talents.",
    },
    "cohort_k35_textbook_study": {
        "cluster_id": "C0116",
        "src": "/images/community/dmf-community-cohort-k35-textbook-study.jpg",
        "pillar": "PILLAR_5_CLASSROOM_COHORTS",
        "alt": "Blick über die Schulter einer DMF-Kursteilnehmerin der Kohorte K35 beim Bearbeiten ihres deutschen Lehrwerks im Unterricht",
        "caption": "Tägliches Vollzeit-Training in Kohorte K35: Arbeit mit aktuellen deutschen Lehrwerken, Hörverständnismodulen und branchenspezifischem Fachvokabular.",
    },
    "cohort_k28_speaking_circle": {
        "cluster_id": "C0126",
        "src": "/images/community/dmf-community-cohort-k28-speaking-circle.jpg",
        "pillar": "PILLAR_5_CLASSROOM_COHORTS",
        "alt": "Interaktiver Stuhlkreis der Kohorte K28 beim freien Sprechtraining mit deutschen und vietnamesischen Lehrkräften der DMF Academy",
        "caption": "Kommunikativer Unterricht in Kohorte K28: im täglichen Gesprächskreis trainieren die angehenden Auszubildenden freies Sprechen, aktives Zuhören und Teamarbeit.",
    },
    "b1_b2_whiteboard_lernmotivation": {
        "cluster_id": "C0127",
        "src": "/images/community/dmf-community-b1-b2-whiteboard-lernmotivation.jpg",
        "pillar": "PILLAR_5_CLASSROOM_COHORTS",
        "alt": "Handschriftliches deutsches Tafelbild der Kohorte K20 zum B1/B2-Aufsatzthema Lernmotivation und Karriereentwicklung",
        "caption": "Authentischer B1/B2-Unterrichtseinblick (Kohorte K20): strukturierte Textproduktion auf Deutsch zu den Themen Lernmotivation, Disziplin und langfristige Karriereplanung.",
    },
    "cohort_k49_classroom": {
        "cluster_id": "C0183",
        "src": "/images/community/dmf-community-cohort-k49-classroom.jpg",
        "pillar": "PILLAR_5_CLASSROOM_COHORTS",
        "alt": "Aufmerksame Kursteilnehmer der Kohorte K49 während des Präsenzunterrichts im hellen Seminarraum der DMF Talents Academy",
        "caption": "Kontinuierlich wachsende Talent-Pipeline: Blick in den Präsenzunterricht der Kohorte K49 am DMF-Ausbildungszentrum in Vietnam.",
    },
    # PILLAR 7 & 8: CAMPUS OPERATIONS & COMMUNITY CULTURE
    "campus_reception_dossier": {
        "cluster_id": "C0084",
        "src": "/images/community/dmf-community-campus-reception-dossier.jpg",
        "pillar": "PILLAR_7_CAMPUS_OPERATIONS",
        "alt": "DMF-Koordinatorin am Empfangstresen der Akademie mit Deutsch-Lehrwerken, Kandidatenakten und deutsch-vietnamesischen Tischflaggen",
        "caption": "Professionelle Studien- und Prozesskoordination am DMF-Campus: zentrale Verwaltung von Kandidatendossiers, Prüfungsanmeldungen und Arbeitgeber-Unterlagen.",
    },
    "weihnachten_christmas_event": {
        "cluster_id": "C1011",
        "src": "/images/community/dmf-community-weihnachten-christmas-event.jpg",
        "pillar": "PILLAR_8_COMMUNITY_CULTURE",
        "alt": "Gemeinschaftsfoto der DMF-Studierenden bei der deutschen Weihnachtsfeier am geschmückten Weihnachtsbaum der Akademie",
        "caption": "Gelebte deutsch-vietnamesische Gemeinschaft: beim gemeinsamen Weihnachtsfest („Weihnachten bei DMF“) lernen die Studierenden deutsche Feiertagstraditionen und Kultur kennen.",
    },
    "tet_festival_lang_du_hoc_duc": {
        "cluster_id": "C1073",
        "src": "/images/community/dmf-community-tet-festival-lang-du-hoc-duc.jpg",
        "pillar": "PILLAR_8_COMMUNITY_CULTURE",
        "alt": "Studierende und Lehrkräfte der DMF Talents Community beim traditionellen Kulturfest im deutschen Studiendorf in Vietnam",
        "caption": "Starker Zusammenhalt in der DMF Talents Community: gemeinsame Kulturveranstaltungen am Campus fördern Teamgeist, soziale Reife und gegenseitige Unterstützung vor dem Start in Deutschland.",
    },
}

# ---------------------------------------------------------------------------
# Hand-Assigned 3 Bespoke Inline Figures for the 12 Flagship Brand Articles
# (Ensures zero overlap with each post's Hero Cover and maximum narrative depth)
# ---------------------------------------------------------------------------
FLAGSHIP_BRAND_ASSIGNMENTS: dict[str, list[str]] = {
    "dmf-vietnam-unternehmensprofil-ausbildungsakademie-deutschland": [
        "campus_reception_dossier",
        "german_delegation_gruezi",
        "cohort_k49_classroom",
    ],
    "dmf-deutschunterricht-intensivkurs-a1-b2-akademie-vietnam": [
        "faculty_thay_khang_lecture",
        "b1_b2_whiteboard_lernmotivation",
        "cohort_k28_speaking_circle",
    ],
    "dmf-interview-coaching-achim-betticher-vorbereitung-vietnam": [
        "achim_interview_panel",
        "achim_candidate_speaking",
        "german_trainer_communication",
    ],
    "dmf-pflegeausbildung-vorbereitung-vietnam-sprachkompetenz-empathie": [
        "native_speaker_desk_coaching",
        "faculty_co_hanh_whiteboard",
        "cohort_k35_textbook_study",
    ],
    "dmf-praxisvorbereitung-gastronomie-hotellerie-bcis-vietnam": [
        "german_expert_1on1_laptop",
        "deutsche_kultur_whiteboard",
        "intercultural_roundtable",
    ],
    "dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt": [
        "german_delegation_qa_classroom",
        "campus_reception_dossier",
        "vfs_visa_application",
    ],
    "dmf-quality-gate-entscheidungsfaehige-kandidatenprofile-video": [
        "cohort_k32_written_exam",
        "achim_candidate_speaking",
        "german_translated_transcript",
    ],
    "dmf-ankunft-onboarding-deutschland-30-tage-begleitung": [
        "airport_briefing_duy",
        "visum_d_zusatzblatt",
        "deutsche_kultur_whiteboard",
    ],
    "dmf-direkte-vertretung-deutschland-umit-elezov-arbeitgeberbetreuung": [
        "intercultural_roundtable",
        "german_instructor_k14",
        "visa_hoang_duy",
    ],
    "dmf-fallstudie-industrie-handwerk-hoang-duy-ausbildung-meppen": [
        "visa_hoang_duy",
        "visum_d_zusatzblatt",
        "faculty_thay_loc_grammar",
    ],
    "dmf-fallstudie-hotellerie-zfa-thien-tuan-hoang-dung-erfolgsgeschichten": [
        "visa_hoang_dung",
        "german_translated_transcript",
        "visum_d_zusatzblatt",
    ],
    "dmf-gemeinschaft-kultur-integration-campus-leben-vietnam": [
        "weihnachten_christmas_event",
        "tet_festival_lang_du_hoc_duc",
        "cohort_k28_speaking_circle",
    ],
}

# Topic-based pools for all other 149 German B2B SEO/GEO articles
TOPIC_POOLS: list[tuple[list[str], list[str]]] = [
    # 1. Visa, Law, § 81a, ZAB, BA, Embassy, Contract, Recognition
    (
        [
            "visum", "visa", "81a", "beschleunigtes", "aufenthg", "zab", "anerkennung",
            "vorabzustimmung", "bundesagentur", "botschaft", "konsulat", "arbeitsvertrag",
            "vertrag", "rueckzahlung", "klausel", "mindestlohn", "gehalt", "verguetung",
            "recht", "compliance", "schengen", "einreise",
        ],
        [
            "visum_d_zusatzblatt",
            "vfs_visa_application",
            "german_translated_transcript",
            "visa_hoang_duy",
            "visa_hoang_dung",
            "airport_briefing_duy",
            "campus_reception_dossier",
        ],
    ),
    # 2. Language, B1, B2, Telc, Goethe, Sprachkurs, Fachsprache, Pflege Communication
    (
        [
            "sprach", "b1", "b2", "telc", "goethe", "deutsch", "kommunikation",
            "pflege", "klinik", "krankenhaus", "altenpflege", "station", "uebergabe",
            "medizin", "zfa", "apotheke", "gesundheit",
        ],
        [
            "faculty_thay_khang_lecture",
            "faculty_thay_loc_grammar",
            "faculty_co_hanh_whiteboard",
            "b1_b2_whiteboard_lernmotivation",
            "cohort_k32_written_exam",
            "cohort_k35_textbook_study",
            "cohort_k28_speaking_circle",
            "native_speaker_desk_coaching",
            "faculty_1on1_tutoring",
        ],
    ),
    # 3. Interview, Selection, Recruiting, ROI, Kosten, Vergleich, Employer Guide
    (
        [
            "interview", "auswahl", "rekrutierung", "recruiting", "roi", "kosten",
            "agentur", "vergleich", "checkliste", "arbeitgeber", "leitfaden",
            "personal", "fachkraeftemangel", "demografie", "babyboomer", "rentenwelle",
            "handwerk", "industrie", "maschinenbau", "elektro", "shk", "bau", "logistik",
        ],
        [
            "achim_interview_panel",
            "achim_candidate_speaking",
            "german_instructor_k14",
            "german_trainer_communication",
            "german_expert_1on1_laptop",
            "cohort_k49_classroom",
            "campus_reception_dossier",
            "german_delegation_qa_classroom",
        ],
    ),
    # 4. Onboarding, Integration, Housing, Retention, Culture, Arrival, Region/City
    (
        [
            "onboarding", "integration", "wohnraum", "unterkunft", "wohnung",
            "bindung", "abbrecher", "kultur", "ankunft", "erste-woche", "probezeit",
            "mentor", "patenschaft", "bayern", "baden", "nrw", "hessen", "sachsen",
            "niedersachsen", "hamburg", "berlin", "muenchen", "frankfurt", "stuttgart",
            "gastronomie", "hotellerie", "kueche", "service",
        ],
        [
            "deutsche_kultur_whiteboard",
            "german_delegation_gruezi",
            "intercultural_roundtable",
            "weihnachten_christmas_event",
            "tet_festival_lang_du_hoc_duc",
            "airport_briefing_duy",
            "visa_hoang_duy",
            "visa_hoang_dung",
        ],
    ),
]

ALL_KEYS = list(COMMUNITY_LIBRARY.keys())


def build_figure_html(item_key: str) -> str:
    item = COMMUNITY_LIBRARY[item_key]
    return (
        f'<figure class="dmf-community-figure">'
        f'<img src="{item["src"]}" alt="{item["alt"]}" width="1200" height="675" loading="lazy" decoding="async" />'
        f'<figcaption>{item["caption"]}</figcaption>'
        f'</figure>'
    )


def strip_existing_community_figures(html: str) -> str:
    # Remove any previously injected <figure class="dmf-community-figure">...</figure>
    cleaned = re.sub(
        r'\s*<figure class="dmf-community-figure">.*?</figure>\s*',
        "\n\n",
        html,
        flags=re.DOTALL,
    )
    return cleaned


def choose_images_for_post(slug: str, title: str, usage_counter: dict[str, int]) -> list[str]:
    if slug in FLAGSHIP_BRAND_ASSIGNMENTS:
        chosen = FLAGSHIP_BRAND_ASSIGNMENTS[slug]
        for k in chosen:
            usage_counter[k] = usage_counter.get(k, 0) + 1
        return chosen

    text = f"{slug} {title}".lower()
    matched_pool: list[str] = []
    for keywords, pool in TOPIC_POOLS:
        if any(kw in text for kw in keywords):
            for k in pool:
                if k not in matched_pool:
                    matched_pool.append(k)

    if len(matched_pool) < 4:
        for k in ALL_KEYS:
            if k not in matched_pool:
                matched_pool.append(k)

    # Sort candidate pool by least-used first, with deterministic hash tie-breaker
    def sort_key(k: str) -> tuple[int, str]:
        h = hashlib.md5(f"{slug}:{k}".encode("utf-8")).hexdigest()
        return (usage_counter.get(k, 0), h)

    ordered = sorted(matched_pool, key=sort_key)
    first = ordered[0]
    first_pillar = COMMUNITY_LIBRARY[first]["pillar"]

    # Pick second image preferably from a complementary pillar so the article shows 2 distinct facets
    second = None
    for cand in ordered[1:]:
        if COMMUNITY_LIBRARY[cand]["pillar"] != first_pillar:
            second = cand
            break
    if not second:
        second = ordered[1]

    chosen = [first, second]
    for k in chosen:
        usage_counter[k] = usage_counter.get(k, 0) + 1
    return chosen


def inject_figures_into_html(html: str, image_keys: list[str]) -> str:
    clean_html = strip_existing_community_figures(html)
    h2_matches = list(re.finditer(r"<h2\b[^>]*>", clean_html, flags=re.IGNORECASE))

    figures = [build_figure_html(k) for k in image_keys]

    if len(h2_matches) >= 4 and len(figures) == 3:
        # Insert before H2 #2, H2 #3, and H2 #5 (or last H2)
        idx1 = h2_matches[1].start()
        idx2 = h2_matches[2].start()
        idx3 = h2_matches[min(4, len(h2_matches) - 1)].start()
        return (
            clean_html[:idx1]
            + "\n\n" + figures[0] + "\n\n"
            + clean_html[idx1:idx2]
            + "\n\n" + figures[1] + "\n\n"
            + clean_html[idx2:idx3]
            + "\n\n" + figures[2] + "\n\n"
            + clean_html[idx3:]
        )
    elif len(h2_matches) >= 3 and len(figures) >= 2:
        # Insert before H2 #2 and before H2 #4 (or last H2)
        idx1 = h2_matches[1].start()
        idx2 = h2_matches[min(3, len(h2_matches) - 1)].start()
        result = (
            clean_html[:idx1]
            + "\n\n" + figures[0] + "\n\n"
            + clean_html[idx1:idx2]
            + "\n\n" + figures[1] + "\n\n"
            + clean_html[idx2:]
        )
        if len(figures) == 3:
            result += "\n\n" + figures[2]
        return result
    elif len(h2_matches) >= 2 and len(figures) >= 2:
        idx1 = h2_matches[0].start()
        idx2 = h2_matches[1].start()
        return (
            clean_html[:idx1]
            + "\n\n" + figures[0] + "\n\n"
            + clean_html[idx1:idx2]
            + "\n\n" + figures[1] + "\n\n"
            + clean_html[idx2:]
        )
    else:
        return clean_html + "\n\n" + "\n\n".join(figures)


def fetch_published_posts() -> list[dict]:
    url = f"{SUPABASE_URL}/rest/v1/posts?select=id,slug,title,content,status&status=eq.published&order=published_at.asc"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def update_post_content(post_id: str, new_content: str) -> None:
    url = f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post_id}"
    payload = json.dumps({"content": new_content}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        method="PATCH",
        headers={
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        _ = resp.read()


def main() -> None:
    # Verify all 28 files exist on disk first
    for key, spec in COMMUNITY_LIBRARY.items():
        disk_path = PUB_DIR / spec["src"].lstrip("/")
        if not disk_path.exists():
            raise FileNotFoundError(f"Missing community image for {key}: {disk_path}")

    posts = fetch_published_posts()
    print(f"Fetched {len(posts)} published posts from Supabase.")

    usage_counter: dict[str, int] = {k: 0 for k in ALL_KEYS}
    updated_count = 0
    total_figures = 0

    for post in posts:
        slug = post["slug"]
        title = post.get("title") or ""
        content = post.get("content") or ""

        chosen_keys = choose_images_for_post(slug, title, usage_counter)
        new_content = inject_figures_into_html(content, chosen_keys)

        if new_content != content:
            update_post_content(post["id"], new_content)
            updated_count += 1
        total_figures += len(chosen_keys)

    print(f"✓ Enriched {updated_count}/{len(posts)} published articles with {total_figures} inline DMF Community `<figure>` blocks.")
    print("\nUsage distribution across the 28 Curated DMF Drive Community Photos:")
    for k, count in sorted(usage_counter.items(), key=lambda x: (-x[1], x[0])):
        print(f"  - {k:34s} ({COMMUNITY_LIBRARY[k]['cluster_id']}): {count} articles")


if __name__ == "__main__":
    main()
