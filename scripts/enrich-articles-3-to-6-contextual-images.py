#!/usr/bin/env python3
"""
Section-by-Section (<h2>) Semantic Reader & 3–6 Inline Image Enricher (100-Image Pool)
======================================================================================
Reads the full text and every individual `<h2>` section of all 161 published blog posts:
1. Determines the exact inline image count (3 to 6 `<figure>` blocks) based on word count:
   - 600–719 words (51 posts)  -> 3 inline `<figure>` blocks (+ 1 Hero Cover = 4 images)
   - 720–819 words (66 posts)  -> 4 inline `<figure>` blocks (+ 1 Hero Cover = 5 images)
   - 820–919 words (25 posts)  -> 5 inline `<figure>` blocks (+ 1 Hero Cover = 6 images)
   - 920+ words    (19 posts)  -> 6 inline `<figure>` blocks (+ 1 Hero Cover = 7 images)
   Total: ~656 inline `<figure>` blocks across 161 posts!
2. Matches each individual `<h2>` section semantically against our 100-image pool:
   - 72 Authentic DMF Google Drive Photos (`dmf-community-*.jpg`)
   - 28 Bespoke German Workplace & Legal Praxis Documentary Photos (`de-praxis-*.jpg`)
3. Enforces strict B2B German formal register ("Sie", zero informal pronouns) and emits
   rich `<figcaption>` + `alt` attributes for `ImageObject[]` JSON-LD extraction.
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
# 100-IMAGE CURATED VISUAL LIBRARY
# Part A: 72 Authentic DMF Google Drive Photos (source_type="drive")
# Part B: 28 German Workplace & Legal Praxis Photos (source_type="de_praxis")
# ---------------------------------------------------------------------------
VISUAL_LIBRARY_100: dict[str, dict] = {
    # === PART A: BATCH 1 AUTHENTIC DRIVE PHOTOS (28) ===
    "visa_hoang_duy": {
        "src": "/images/community/dmf-community-visa-hoang-duy.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["visum", "visa", "erfolg", "meppen", "niedersachsen", "ausbildung", "16a", "einreise", "handwerk", "industrie"],
        "alt": "DMF-Absolvent Hoàng Duy präsentiert sein erteiltes deutsches Visum gemeinsam mit dem Team der DMF Talents Academy in Vietnam",
        "caption": "Einblick in die DMF Talents Community: feierliche Übergabe des erteilten deutschen Visums an DMF-Absolvent Hoàng Duy vor seinem Ausbildungsstart in Meppen (Niedersachsen).",
    },
    "airport_briefing_duy": {
        "src": "/images/community/dmf-community-airport-briefing-duy.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["flughafen", "ausreise", "einreise", "ankunft", "flug", "checkliste", "start", "begleitung", "unterlagen"],
        "alt": "DMF-Koordinator überprüft am internationalen Flughafen die Ausreise- und Visadokumente mit einem vietnamesischen Auszubildenden",
        "caption": "Strukturierte Ausreisebegleitung durch DMF Talents: persönliches Dokumenten- und Flug-Briefing am internationalen Flughafen vor dem Abflug nach Deutschland.",
    },
    "vfs_visa_application": {
        "src": "/images/community/dmf-community-vfs-visa-application.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["vfs", "botschaft", "konsulat", "termin", "antrag", "visum", "reisepass", "81a", "18a", "16a", "frist"],
        "alt": "Reisepass und vollständige Antragsunterlagen eines DMF-Kandidaten bei der Visabeantragung im VFS Global Zentrum in Vietnam",
        "caption": "Rechtssichere Visaprozesse (§ 16a / § 18a AufenthG): lückenlos vorbereitete Antragsunterlagen der DMF-Rechtsabteilung beim Einreichen im Visazentrum.",
    },
    "german_translated_transcript": {
        "src": "/images/community/dmf-community-german-translated-transcript.jpg",
        "source_type": "drive",
        "group": "dossier_legal",
        "keywords": ["zeugnis", "uebersetzung", "beglaubigt", "anerkennung", "zab", "ihk", "hwk", "bqfg", "unterlagen", "dokumente", "noten", "pruefung"],
        "alt": "Beglaubigte deutsche Übersetzung der schulischen und akademischen Leistungsnachweise in einer DMF-Kandidatenakte",
        "caption": "Dokumenten-Compliance ab Tag 1: beglaubigte deutsche Übersetzungen sämtlicher Zeugnisse und Fächerübersichten für IHK, HWK, ZAB und Ausländerbehörden.",
    },
    "visum_d_zusatzblatt": {
        "src": "/images/community/dmf-community-visum-d-zusatzblatt.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["visum", "zusatzblatt", "aufenthaltstitel", "16a", "18a", "81a", "konsulat", "arbeitserlaubnis", "nebenjob", "recht"],
        "alt": "Originales nationales Visum für Deutschland (Kategorie D) mit offiziellem Zusatzblatt für die Berufsausbildung eines DMF-Talents",
        "caption": "Verifizierte Prozesssicherheit: originales nationales D-Visum („VISUM DEUTSCHLAND“) inklusive Zusatzblatt des Deutschen Generalkonsulats Ho-Chi-Minh-Stadt.",
    },
    "visa_hoang_dung": {
        "src": "/images/community/dmf-community-visa-hoang-dung.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["zfa", "zahn", "pflege", "gesundheit", "visum", "erfolgsgeschichte", "medizin", "praxis", "klinik"],
        "alt": "DMF-Absolventin Trần Thị Hoàng Dung feiert ihr deutsches Ausbildungsvisum mit dem Akademieteam vor dem DMF-Education-Logo",
        "caption": "Erfolgsgeschichte aus der DMF Talents Community: Absolventin Trần Thị Hoàng Dung nach der erfolgreichen Visumerteilung für ihre Ausbildung zur Zahnmedizinischen Fachangestellten (ZFA).",
    },
    "achim_interview_panel": {
        "src": "/images/community/dmf-community-achim-interview-panel.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["interview", "vorstellungsgespraech", "achim", "auswahl", "eignung", "pruefung", "arbeitgeber", "fragen", "rekrutierung"],
        "alt": "Deutscher Interview-Coach Achim Betticher und Fachkollege leiten ein praxisnahes Bewerbungstraining an der DMF Academy in Vietnam",
        "caption": "Vorbereitung nach deutschen Arbeitgeberstandards: Herr Achim Betticher und deutsche Experten trainieren mit DMF-Kandidaten reale Vorstellungsgespräche.",
    },
    "achim_candidate_speaking": {
        "src": "/images/community/dmf-community-achim-candidate-speaking.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["interview", "sprechen", "vorstellungsgespraech", "kandidat", "motivation", "kommunikation", "mündlich", "video"],
        "alt": "Vietnamesischer DMF-Kandidat antwortet frei auf Deutsch während einer realistischen Interview-Simulation vor deutschen Prüfern",
        "caption": "Aktive Sprechkompetenz statt reinem Auswendiglernen: im DMF-Interview-Coaching begründen Kandidaten ihre Motivation und Fachkenntnisse frei auf Deutsch.",
    },
    "german_instructor_k14": {
        "src": "/images/community/dmf-community-german-instructor-k14.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["arbeitskultur", "disziplin", "puenktlichkeit", "handwerk", "ausbilder", "erwartungen", "betrieb", "alltag"],
        "alt": "Deutscher Dozent im blauen DMF-Education-Poloshirt vermittelt interkulturelle Arbeitskultur im Seminarraum der Akademie",
        "caption": "Praxisnahe Berufsvorbereitung in Kohorte K14: deutsche Dozenten an der DMF Talents Academy vermitteln Pünktlichkeit, Feedbackkultur und Kommunikation im Betrieb.",
    },
    "german_trainer_communication": {
        "src": "/images/community/dmf-community-german-trainer-communication.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["kommunikation", "fachsprache", "anleitung", "meister", "team", "feedback", "verstaendigung", "arbeitsplatz"],
        "alt": "Deutscher Fachtrainer der DMF Talents Academy erläutert betriebliche Kommunikationsabläufe für angehende Auszubildende",
        "caption": "Direkter Wissenstransfer am Campus: muttersprachliche Trainer bereiten die DMF-Talente gezielt auf den Arbeitsalltag in deutschen Ausbildungsbetrieben vor.",
    },
    "deutsche_kultur_whiteboard": {
        "src": "/images/community/dmf-community-deutsche-kultur-whiteboard.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["kultur", "integration", "essen", "gastronomie", "hotellerie", "hoffnungen", "leben", "mentalitaet", "onboarding"],
        "alt": "Deutscher Gastdozent unterrichtet an der DMF-Tafel das Modul Deutsche Kultur, Deutsches Essen, Ängste und Hoffnungen",
        "caption": "Kulturelle Integration vor der Ausreise: im interaktiven Workshop zu „Deutsche Kultur, Menschen, Ängste & Hoffnungen“ bauen DMF-Kandidaten Berührungsängste frühzeitig ab.",
    },
    "german_delegation_gruezi": {
        "src": "/images/community/dmf-community-german-delegation-gruezi.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["delegation", "partner", "besuch", "audit", "qualitaet", "muttersprachler", "kooperation", "agentur"],
        "alt": "Deutsche Gastdelegation begrüßt eine vollbesetzte Klasse der DMF Talents Academy zum interkulturellen Praxisaustausch",
        "caption": "Gelebte Partnerschaft am DMF-Campus: regelmäßige Besuche deutscher Delegationen ermöglichen den Auszubildenden authentische Gespräche mit Muttersprachlern.",
    },
    "native_speaker_desk_coaching": {
        "src": "/images/community/dmf-community-native-speaker-desk-coaching.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["pflege", "aussprache", "coaching", "muttersprachler", "betreuung", "individuell", "sprachpraxis", "patient"],
        "alt": "Deutscher Muttersprachler betreut eine vietnamesische Kursteilnehmerin im 1-zu-1-Sprachcoaching direkt am Schülertisch",
        "caption": "Individuelle Förderung im 1-zu-1-Dialog: deutsche Gastdozenten trainieren Aussprache, Hörverständnis und spontane Reaktionsfähigkeit direkt im Unterricht.",
    },
    "german_expert_1on1_laptop": {
        "src": "/images/community/dmf-community-german-expert-1on1-laptop.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["digital", "laptop", "profil", "qualitaetssicherung", "screening", "vorauswahl", "suchprofil", "anforderung"],
        "alt": "Deutscher Fachexperte bespricht digitale Lernmodule am Laptop mit einer DMF-Kursteilnehmerin im blauen Akademie-Poloshirt",
        "caption": "Qualitätssicherung vor Ort in Vietnam: gemeinsame Überprüfung der Lernfortschritte und Fachmodule durch deutsche Partner und DMF-Lehrkräfte.",
    },
    "intercultural_roundtable": {
        "src": "/images/community/dmf-community-intercultural-roundtable.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["gespraech", "diskussion", "werte", "willkommenskultur", "team", "integration", "kultur", "austausch"],
        "alt": "Interkulturelle Gesprächsrunde zwischen deutschen Gästen, der DMF-Akademieleitung und fortgeschrittenen B1/B2-Absolventen",
        "caption": "Offener Dialog auf Augenhöhe: in moderierten Gesprächsrunden diskutieren DMF-Kandidaten mit deutschen Gästen über Lebensalltag, Berufsschule und Werte.",
    },
    "german_delegation_qa_classroom": {
        "src": "/images/community/dmf-community-german-delegation-qa-classroom.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["fragen", "seminar", "klasse", "akademie", "transparenz", "vergleich", "auswahl", "kooperation"],
        "alt": "Weitwinkelaufnahme eines interaktiven Frage-und-Antwort-Seminars mit deutschen Muttersprachlern an der DMF Talents Academy",
        "caption": "Einblick in die DMF Talents Community: hohe Beteiligung und lebendige Fragerunden auf Deutsch während des Delegationsbesuchs am Campus Biên Hòa.",
    },
    "faculty_thay_khang_lecture": {
        "src": "/images/community/dmf-community-faculty-thay-khang-lecture.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["sprachkurs", "intensivkurs", "a1", "a2", "b1", "b2", "unterricht", "routine", "vollzeit", "lehrkraft"],
        "alt": "DMF-Deutschdozent Thầy Khang unterrichtet Grammatik und Alltagsroutinen vor dem Smartboard der DMF Talents Academy",
        "caption": "Strukturierter Vollzeit-Deutschunterricht (A1 bis B2): DMF-Dozent Thầy Khang vermittelt komplexe Satzstrukturen und berufliche Routinen im Seminarraum.",
    },
    "faculty_thay_loc_grammar": {
        "src": "/images/community/dmf-community-faculty-thay-loc-grammar.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["grammatik", "telc", "goethe", "oesd", "sprachzertifikat", "b1", "b2", "dozent", "methodik"],
        "alt": "DMF-Lehrkraft Thầy Lộc erklärt deutsche Grammatikstrukturen an der beschriebenen Tafel im Intensivkurs",
        "caption": "Methodische Sprachausbildung an der DMF Academy: Dozent Thầy Lộc kombiniert präzise Grammatikarbeit mit praxisnahen Dialogübungen für Telc- und Goethe-Prüfungen.",
    },
    "faculty_co_hanh_whiteboard": {
        "src": "/images/community/dmf-community-faculty-co-hanh-whiteboard.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["satzbau", "tafel", "lehrerin", "motivation", "erfolg", "kurs", "abschluss", "zertifikat"],
        "alt": "DMF-Dozentin Cô Hạnh und Kursteilnehmer vor einer vollgeschriebenen Tafel mit deutschen Konnektoren und Satzbauübungen",
        "caption": "Engagiertes Lehrerkollegium bei DMF Talents: Dozentin Cô Hạnh begleitet ihre Klasse intensiv bis zum sicheren Bestehen der B1- und B2-Zertifikatsprüfungen.",
    },
    "faculty_1on1_tutoring": {
        "src": "/images/community/dmf-community-faculty-1on1-tutoring.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["nachhilfe", "einzeltraining", "korrektur", "foerderung", "lernerfolg", "fruehwarnsignale", "betreuung", "stuetzunterricht"],
        "alt": "DMF-Sprachlehrer korrigiert gemeinsam mit einem Kursteilnehmer schriftliche Deutschaufgaben im Einzelgespräch",
        "caption": "Engmaschige Lernstandskontrolle: durch regelmäßiges 1-zu-1-Feedback im Unterricht stellt DMF Talents sicher, dass kein Kandidat bei Grammatik oder Fachwortschatz zurückbleibt.",
    },
    "cohort_k32_written_exam": {
        "src": "/images/community/dmf-community-cohort-k32-written-exam.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["pruefung", "test", "klausur", "kontrolle", "qualitaet", "k32", "schriftlich", "zertifikat"],
        "alt": "Kursteilnehmer der Kohorte K32 bearbeiten konzentriert eine schriftliche Deutsch-Zwischenprüfung an der DMF Talents Academy",
        "caption": "Verbindliche Qualitätsstandards in Kohorte K32: wöchentliche schriftliche und mündliche Lernzielkontrollen dokumentieren den realen Sprachfortschritt jedes Talents.",
    },
    "cohort_k35_textbook_study": {
        "src": "/images/community/dmf-community-cohort-k35-textbook-study.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["lehrwerk", "buch", "wortschatz", "lesen", "fachtheorie", "berufsschule", "vorbereitung", "lernen"],
        "alt": "Blick über die Schulter einer DMF-Kursteilnehmerin der Kohorte K35 beim Bearbeiten ihres deutschen Lehrwerks im Unterricht",
        "caption": "Tägliches Vollzeit-Training in Kohorte K35: Arbeit mit aktuellen deutschen Lehrwerken, Hörverständnismodulen und branchenspezifischem Fachvokabular.",
    },
    "cohort_k28_speaking_circle": {
        "src": "/images/community/dmf-community-cohort-k28-speaking-circle.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["sprechen", "dialog", "stuhlkreis", "teamarbeit", "kommunikation", "alltag", "interaktiv", "gruppe"],
        "alt": "Interaktiver Stuhlkreis der Kohorte K28 beim freien Sprechtraining mit deutschen und vietnamesischen Lehrkräften der DMF Academy",
        "caption": "Kommunikativer Unterricht in Kohorte K28: im täglichen Gesprächskreis trainieren die angehenden Auszubildenden freies Sprechen, aktives Zuhören und Teamarbeit.",
    },
    "b1_b2_whiteboard_lernmotivation": {
        "src": "/images/community/dmf-community-b1-b2-whiteboard-lernmotivation.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["motivation", "karriere", "b1", "b2", "aufsatz", "schreiben", "ziel", "bindung", "langfristig"],
        "alt": "Handschriftliches deutsches Tafelbild der Kohorte K20 zum B1/B2-Aufsatzthema Lernmotivation und Karriereentwicklung",
        "caption": "Authentischer B1/B2-Unterrichtseinblick (Kohorte K20): strukturierte Textproduktion auf Deutsch zu den Themen Lernmotivation, Disziplin und langfristige Karriereplanung.",
    },
    "cohort_k49_classroom": {
        "src": "/images/community/dmf-community-cohort-k49-classroom.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["kohorte", "pipeline", "talent", "auszubildende", "azubi", "jahrgang", "rekrutierung", "nachwuchs"],
        "alt": "Aufmerksame Kursteilnehmer der Kohorte K49 während des Präsenzunterrichts im hellen Seminarraum der DMF Talents Academy",
        "caption": "Kontinuierlich wachsende Talent-Pipeline: Blick in den Präsenzunterricht der Kohorte K49 am DMF-Ausbildungszentrum in Vietnam.",
    },
    "campus_reception_dossier": {
        "src": "/images/community/dmf-community-campus-reception-dossier.jpg",
        "source_type": "drive",
        "group": "dossier_legal",
        "keywords": ["verwaltung", "organisation", "koordination", "akte", "dossier", "prozess", "empfang", "management"],
        "alt": "DMF-Koordinatorin am Empfangstresen der Akademie mit Deutsch-Lehrwerken, Kandidatenakten und deutsch-vietnamesischen Tischflaggen",
        "caption": "Professionelle Studien- und Prozesskoordination am DMF-Campus: zentrale Verwaltung von Kandidatendossiers, Prüfungsanmeldungen und Arbeitgeber-Unterlagen.",
    },
    "weihnachten_christmas_event": {
        "src": "/images/community/dmf-community-weihnachten-christmas-event.jpg",
        "source_type": "drive",
        "group": "community_events",
        "keywords": ["weihnachten", "feiertag", "kultur", "gemeinschaft", "integration", "sozial", "bindung", "fest"],
        "alt": "Gemeinschaftsfoto der DMF-Studierenden bei der deutschen Weihnachtsfeier am geschmückten Weihnachtsbaum der Akademie",
        "caption": "Gelebte deutsch-vietnamesische Gemeinschaft: beim gemeinsamen Weihnachtsfest („Weihnachten bei DMF“) lernen die Studierenden deutsche Feiertagstraditionen kennen.",
    },
    "tet_festival_lang_du_hoc_duc": {
        "src": "/images/community/dmf-community-tet-festival-lang-du-hoc-duc.jpg",
        "source_type": "drive",
        "group": "community_events",
        "keywords": ["gemeinschaft", "community", "kulturfest", "zusammenhalt", "netzwerk", "alumni", "mentalitaet", "leben"],
        "alt": "Studierende und Lehrkräfte der DMF Talents Community beim traditionellen Kulturfest im deutschen Studiendorf in Vietnam",
        "caption": "Starker Zusammenhalt in der DMF Talents Community: gemeinsame Kulturveranstaltungen am Campus fördern Teamgeist, soziale Reife und gegenseitige Unterstützung.",
    },

    # === PART A (CONT.): BATCH 2 AUTHENTIC DRIVE PHOTOS (44) ===
    "visa_team_duy_celebration": {
        "src": "/images/community/dmf-community-visa-team-duy-celebration.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["visum", "erfolg", "team", "ausreise", "gratulation", "start", "azubi", "vermittlung"],
        "alt": "DMF-Absolvent Hoàng Duy feiert sein erteiltes Ausbildungsvisum mit dem Akademieteam vor der Fachbibliothek",
        "caption": "Gemeinsamer Meilenstein in der DMF Talents Community: das Beratungsteam begleitet jeden Kandidaten von der ersten Unterrichtsstunde bis zur Visumerteilung.",
    },
    "vfs_global_center_checkin": {
        "src": "/images/community/dmf-community-vfs-global-center-checkin.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["vfs", "visazentrum", "termin", "einreichung", "botschaft", "konsulat", "81a", "visumantrag"],
        "alt": "DMF-Rechtskoordinatorin begleitet einen Kandidaten persönlich beim Einreichen des Visumantrags im VFS Global Zentrum",
        "caption": "Persönliche Behördenbegleitung in Vietnam: unsere Rechtsabteilung begleitet die Kandidaten direkt zum Termin im Visazentrum VFS Global.",
    },
    "visum_d_hoang_dung_closeup": {
        "src": "/images/community/dmf-community-visum-d-hoang-dung-closeup.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["visum", "zusatzblatt", "aufenthg", "16a", "zfa", "arbeitserlaubnis", "dokument", "rechtssicher"],
        "alt": "Detailaufnahme des erteilten deutschen D-Visums und Zusatzblatts für die Auszubildende Trần Thị Hoàng Dung",
        "caption": "Dokumentierte Rechtssicherheit nach § 16a AufenthG: originales D-Visum mit betriebsbezogenem Zusatzblatt für den Ausbildungsstart in Deutschland.",
    },
    "airport_flight_check_phone": {
        "src": "/images/community/dmf-community-airport-flight-check-phone.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["flug", "ticket", "flughafen", "check-in", "reise", "ankunft", "organisation", "zeitplan"],
        "alt": "Überprüfung der digitalen Flugdaten und Bordkarte am Flughafen vor dem Abflug nach Deutschland",
        "caption": "Lückenlose Reisekoordination: Abstimmung der Flugzeiten, Zugverbindungen (ICE) und Abholung mit dem aufnehmenden Ausbildungsbetrieb in Deutschland.",
    },
    "airport_family_farewell_duy": {
        "src": "/images/community/dmf-community-airport-family-farewell-duy.jpg",
        "source_type": "drive",
        "group": "visa_arrival",
        "keywords": ["familie", "flughafen", "abschied", "ausreise", "gepaeck", "motivation", "verantwortung", "rückhalt"],
        "alt": "Ein vietnamesischer Auszubildender verabschiedet sich im Beisein des DMF-Koordinators und seiner Familie am internationalen Flughafen",
        "caption": "Starker familiärer Rückhalt: unsere DMF-Koordinatoren begleiten die Talente und ihre Familien persönlich bis zum Check-in am internationalen Flughafen.",
    },
    "german_employer_handshake": {
        "src": "/images/community/dmf-community-german-employer-handshake.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["handschlag", "arbeitgeber", "vertrag", "partnerschaft", "kooperation", "vertrauen", "einstellung", "auswahl"],
        "alt": "Verbindlicher Handschlag zwischen einem deutschen Arbeitgeber, einem vietnamesischen Kandidaten und der DMF-Vertretung",
        "caption": "Partnerschaft auf Augenhöhe: persönliches Kennenlernen und verbindliche Vertragsunterzeichnung zwischen deutschen Arbeitgebern und DMF-Kandidaten.",
    },
    "candidate_volunteer_certificate": {
        "src": "/images/community/dmf-community-candidate-volunteer-certificate.jpg",
        "source_type": "drive",
        "group": "dossier_legal",
        "keywords": ["zertifikat", "sozial", "engagement", "soft-skills", "lebenslauf", "dossier", "persoenlichkeit", "charakter"],
        "alt": "Zertifikat über soziales und ehrenamtliches Engagement als Bestandteil eines vollständigen DMF-Bewerberdossiers",
        "caption": "Ganzheitliche Bewerberprofile: neben Sprach- und Fachzeugnissen dokumentiert DMF auch soziales Engagement und Teamfähigkeit der Kandidaten.",
    },
    "achim_villa_campus_group": {
        "src": "/images/community/dmf-community-achim-villa-campus-group.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["achim", "campus", "akademie", "gruppe", "team", "vietnam", "standort", "unternehmen"],
        "alt": "Gruppenbild mit Herrn Achim Betticher, deutschen Experten, Lehrkräften und Studierenden vor dem Gebäude der DMF Academy",
        "caption": "Das deutsch-vietnamesische Team der DMF Talents Academy: gemeinsame Qualitätssicherung durch deutsche Ausbildungsberater und einheimische Lehrkräfte.",
    },
    "german_expert_2on1_mentoring": {
        "src": "/images/community/dmf-community-german-expert-2on1-mentoring.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["mentoring", "kleingruppe", "beratung", "gespraech", "vorbereitung", "coaching", "erwartungen", "feedback"],
        "alt": "Deutsche Fachexpertin betreut zwei DMF-Kursteilnehmerinnen im intensiven Kleingruppen-Mentoring am Laptop",
        "caption": "Kleingruppen-Mentoring mit deutschen Experten: individuelle Vorbereitung auf Bewerbungsgespräche, Arbeitsabläufe und betriebliche Kommunikation.",
    },
    "german_delegation_panel_talk": {
        "src": "/images/community/dmf-community-german-delegation-panel-talk.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["referentin", "vortrag", "delegation", "information", "aufklaerung", "arbeitsmarkt", "erwartungen", "realitaet"],
        "alt": "Mitglied einer deutschen Gastdelegation berichtet im DMF-Seminarraum über reale Arbeitsbedingungen in Deutschland",
        "caption": "Realistische Erwartungssteuerung: deutsche Gastreferenten informieren unsere Kurse transparent über Arbeitsalltag, Steuern, Wohnen und Pflichten in Deutschland.",
    },
    "german_lecturers_qa_session": {
        "src": "/images/community/dmf-community-german-lecturers-qa-session.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["fragestunde", "muttersprachler", "hoerverstaendnis", "dialog", "austausch", "dialekt", "alltagssprache", "praxis"],
        "alt": "Zwei deutsche Gastdozentinnen beantworten im offenen Unterrichtsgespräch die Fragen der DMF-Studierenden",
        "caption": "Training des natürlichen Hörverständnisses: im direkten Austausch mit deutschen Muttersprachlern gewöhnen sich die Talente frühzeitig an reales Sprechtempo.",
    },
    "delegation_student_dialogue": {
        "src": "/images/community/dmf-community-delegation-student-dialogue.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["dialog", "offenheit", "kultur", "selbstbewusstsein", "fragen", "motivation", "interkulturell", "austausch"],
        "alt": "Aufmerksamer Dialog zwischen deutschen Gästen und vietnamesischen Kursteilnehmern am Gruppentisch",
        "caption": "Förderung aktiver Fragekultur: bei DMF lernen Kandidaten, bei Unklarheiten aktiv nachzufragen – eine Schlüsselkompetenz für deutsche Betriebe.",
    },
    "lounge_cultural_exchange": {
        "src": "/images/community/dmf-community-lounge-cultural-exchange.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["lounge", "begegnung", "kultur", "alltag", "sprache", "gemeinschaft", "informell", "vertrauen"],
        "alt": "Informelle Gesprächsrunde zwischen deutschen Gästen und Studierenden in der Lounge der DMF Talents Academy",
        "caption": "Gelebte Sprachpraxis auch außerhalb des Klassenzimmers: lockere Konversationsrunden mit deutschen Gästen in der Studien-Lounge der Akademie.",
    },
    "german_guest_lounge_roundtable": {
        "src": "/images/community/dmf-community-german-guest-lounge-roundtable.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["erfahrungsaustausch", "bericht", "deutschland", "integration", "tipps", "leben", "wohnen", "eingewöhnung"],
        "alt": "Deutscher Gast im Gespräch mit DMF-Studierenden unter dem 3D-Wandlogo der DMF Education Academy",
        "caption": "Erfahrungsaustausch aus erster Hand: Berichte über das Leben und Arbeiten in deutschen Städten und Regionen stärken die Orientierung vor der Einreise.",
    },
    "multimedia_desk_slide_review": {
        "src": "/images/community/dmf-community-multimedia-desk-slide-review.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["curriculum", "lehrplan", "methodik", "abstimmung", "medien", "digital", "unterricht", "standard"],
        "alt": "DMF-Dozent und deutsche Gastreferentin stimmen am Multimedia-Pult die digitalen Unterrichtsmaterialien ab",
        "caption": "Abgestimmte Curricula: gemeinsame Unterrichtsplanung zwischen vietnamesischen Deutschlehrkräften und deutschen Fachreferenten.",
    },
    "german_lecturer_puenktlichkeit_ipad": {
        "src": "/images/community/dmf-community-german-lecturer-puenktlichkeit-ipad.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["puenktlichkeit", "sicherheit", "arbeitszeit", "regeln", "berufsschule", "pflichten", "disziplin", "arbeitgeber"],
        "alt": "Deutsche Dozentin zeigt am iPad Praxisbeispiele vor einer Tafel mit den Begriffen Pünktlichkeit, Sicherheit und Arbeitszeiten",
        "caption": "Fokus auf deutsche Arbeitstugenden: verbindliches Training zu Pünktlichkeit, Arbeitssicherheit und betrieblicher Zuverlässigkeit an der DMF Academy.",
    },
    "german_guest_coordinator_talk": {
        "src": "/images/community/dmf-community-german-guest-coordinator-talk.jpg",
        "source_type": "drive",
        "group": "delegation_culture",
        "keywords": ["koordination", "feedback", "lernstand", "bewertung", "partner", "gespraech", "qualitaet", "betreuung"],
        "alt": "Fachgespräch zwischen einer deutschen Besucherin und einer DMF-Koordinatorin im blauen Akademie-Poloshirt",
        "caption": "Kontinuierliches Qualitäts-Feedback: enge Abstimmung zwischen deutschen Praxispartnern und der pädagogischen Koordination von DMF Talents.",
    },
    "thay_khang_fremdsprache_board": {
        "src": "/images/community/dmf-community-thay-khang-fremdsprache-board.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["muttersprache", "fremdsprache", "deutsch", "sprachstruktur", "lernen", "didaktik", "a1", "a2", "b1"],
        "alt": "DMF-Dozent Thầy Khang schreibt den Vergleich zwischen vietnamesischer Muttersprache und deutscher Fremdsprache an die Tafel",
        "caption": "Kontrastive Sprachdidaktik: unsere Lehrkräfte erklären gezielt die strukturellen Unterschiede zwischen der vietnamesischen und der deutschen Sprache.",
    },
    "thay_khang_interactive_grammar": {
        "src": "/images/community/dmf-community-thay-khang-interactive-grammar.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["dozent", "erklärung", "grammatik", "verstaendnis", "rückfragen", "intensiv", "sprachkurs", "praxis"],
        "alt": "DMF-Dozent Thầy Khang im direkten Unterrichtsgespräch mit seiner Klasse während einer Grammatikeinheit",
        "caption": "Praxisnahe Grammatikvermittlung: statt sturer Theorie steht die sichere Anwendung im beruflichen Gespräch im Mittelpunkt des DMF-Unterrichts.",
    },
    "thay_loc_exam_review": {
        "src": "/images/community/dmf-community-thay-loc-exam-review.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["korrektur", "auswertung", "pruefung", "ergebnis", "qualitaetssicherung", "kontrolle", "leistungsnachweis", "b1"],
        "alt": "DMF-Dozent Thầy Lộc wertet die schriftlichen Prüfungsbögen seiner Deutschklasse aus",
        "caption": "Dokumentierte Leistungsentwicklung: sorgfältige Auswertung aller schriftlichen Zwischenprüfungen zur gezielten Schließung individueller Wissenslücken.",
    },
    "thay_loc_worksheet_prep": {
        "src": "/images/community/dmf-community-thay-loc-worksheet-prep.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["arbeitsblatt", "material", "vorbereitung", "uebung", "fachwortschatz", "training", "unterlagen", "ausbildung"],
        "alt": "DMF-Lehrkraft bereitet gedruckte Übungsblätter und Prüfungsunterlagen für den täglichen Intensivunterricht vor",
        "caption": "Maßgeschneiderte Unterrichtsmaterialien: ergänzend zu deutschen Standardlehrwerken erstellt DMF eigene Arbeitsblätter für den Berufswortschatz.",
    },
    "thay_loc_desk_coaching": {
        "src": "/images/community/dmf-community-thay-loc-desk-coaching.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["einzelbetreuung", "coaching", "fehleranalyse", "schreiben", "grammatik", "betreuung", "lehrer", "unterstuetzung"],
        "alt": "DMF-Dozent Thầy Lộc bespricht am Tisch individuell die Aufgabenlösung eines Kursteilnehmers",
        "caption": "Individuelle Lernbegleitung am Arbeitsplatz: unmittelbare Fehleranalyse und verständliche Erklärungen sichern ein homogenes Klassenniveau.",
    },
    "teacher_freizeit_whiteboard": {
        "src": "/images/community/dmf-community-teacher-freizeit-whiteboard.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["alltag", "konversation", "sprechen", "tafel", "a2", "b1", "unterricht", "kommunikation"],
        "alt": "DMF-Deutschlehrerin entwickelt mit ihrer Klasse ein Tafelbild zur Alltagskommunikation auf Deutsch",
        "caption": "Alltagskommunikation für das Leben in Deutschland: Training typischer Gesprächssituationen im Kollegenkreis, im Verein und in der Nachbarschaft.",
    },
    "co_hanh_cohort_celebration": {
        "src": "/images/community/dmf-community-co-hanh-cohort-celebration.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["abschluss", "erfolg", "kurs", "gemeinschaft", "teamgeist", "motivation", "kohorte", "bestandene"],
        "alt": "Dozentin Cô Hạnh und ihre gesamte Deutschklasse feiern gemeinsam den erfolgreichen Abschluss einer Kursstufe",
        "caption": "Motivation durch gemeinsame Etappenerfolge: feierlicher Abschluss eines Intensivmoduls mit Dozentin Cô Hạnh an der DMF Talents Academy.",
    },
    "full_classroom_lecture_notes": {
        "src": "/images/community/dmf-community-full-classroom-lecture-notes.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["disziplin", "konzentration", "klasse", "notizen", "vollzeit", "studierende", "akademie", "unterricht"],
        "alt": "Vollbesetzter Seminarraum der DMF Academy mit konzentriert mitschreibenden Kursteilnehmern",
        "caption": "Hohe Lernbereitschaft und Disziplin: sechs bis acht Stunden strukturiertes Sprachentraining pro Tag bilden die Basis für schnelle Fortschritte.",
    },
    "senior_german_teacher_lecture": {
        "src": "/images/community/dmf-community-senior-german-teacher-lecture.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["senior", "experte", "erfahrung", "wissenstransfer", "babyboomer", "generation", "ausbilder", "vortrag"],
        "alt": "Erfahrener deutscher Dozent referiert vor einer aufmerksamen Klasse der DMF Talents Academy in Vietnam",
        "caption": "Generationenübergreifender Wissenstransfer: erfahrene deutsche Ausbilder und Dozenten geben ihr Praxiswissen direkt an die junge Talente-Generation weiter.",
    },
    "vietnamese_german_cotraining": {
        "src": "/images/community/dmf-community-vietnamese-german-cotraining.jpg",
        "source_type": "drive",
        "group": "interview_experts",
        "keywords": ["tandem", "co-teaching", "zusammenarbeit", "deutsch", "vietnamesisch", "methodik", "lehrkraefte", "qualitaet"],
        "alt": "Vietnamesische DMF-Lehrkraft und deutscher Senior-Dozent führen gemeinsam ein Co-Teaching-Modul an der Tafel durch",
        "caption": "Bewährtes Tandem-Prinzip im Unterricht: vietnamesische Lehrkräfte sichern das grammatische Fundament, deutsche Muttersprachler trainieren die freie Sprechpraxis.",
    },
    "intensive_course_thumbs_up": {
        "src": "/images/community/dmf-community-intensive-course-thumbs-up.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["intensivkurs", "erfolg", "freude", "selbstvertrauen", "sprachkompetenz", "lehrerin", "fortschritt", "b1"],
        "alt": "DMF-Dozentin und Kursteilnehmer zeigen sich zuversichtlich nach einer erfolgreichen mündlichen Übungseinheit",
        "caption": "Aufbau von sprachlichem Selbstvertrauen: positive Bestärkung und intensives Sprechtraining nehmen die Scheu vor dem ersten Tag im deutschen Betrieb.",
    },
    "student_lounge_dmf_binders": {
        "src": "/images/community/dmf-community-student-lounge-dmf-binders.jpg",
        "source_type": "drive",
        "group": "dossier_legal",
        "keywords": ["ordner", "unterlagen", "profil", "kandidat", "bewerbung", "vorbereitung", "struktur", "dokumentation"],
        "alt": "DMF-Kandidatin im blauen Akademie-Poloshirt mit strukturierten blauen Ausbildungs- und Dokumentenordnern",
        "caption": "Strukturierte Kandidatenmappen: jedes DMF-Talent führt geordnete Unterlagen für Sprachzertifikate, Übersetzungen und Fachmodule.",
    },
    "cohort_k50_study_lounge": {
        "src": "/images/community/dmf-community-cohort-k50-study-lounge.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["lounge", "selbststudium", "lerngruppe", "k50", "hausaufgaben", "campus", "gemeinschaft", "vorbereitung"],
        "alt": "Studierende der Kohorte K50 beim gemeinsamen Selbststudium im offenen Lernbereich der DMF Talents Academy",
        "caption": "Lernkultur über den Unterricht hinaus: in den Studienbereichen des DMF-Campus vertiefen die Kohorten gemeinsam ihren Wortschatz.",
    },
    "cohort_k50_classroom_poster": {
        "src": "/images/community/dmf-community-cohort-k50-classroom-poster.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["k50", "klasse", "gewohnheiten", "routinen", "auszubildende", "fokus", "praesenzunterricht", "akademie"],
        "alt": "Kursteilnehmer der Kohorte K50 im modernen Klassenzimmer neben deutschen Lernpostern zu Gewohnheiten und Routinen",
        "caption": "Klare Tagesstruktur in Kohorte K50: visuelle Lernanker im gesamten Akademiegebäude unterstützen die tägliche Immersion in die deutsche Sprache.",
    },
    "cohort_k50_pair_study": {
        "src": "/images/community/dmf-community-cohort-k50-pair-study.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["tandem", "partnerarbeit", "lernen", "gegenseitig", "hilfe", "zusammenhalt", "k50", "uebung"],
        "alt": "Zwei Kursteilnehmerinnen der Kohorte K50 lösen gemeinsam deutsche Grammatik- und Dialogaufgaben",
        "caption": "Kooperatives Lernen im Tandem: durch Partnerübungen unterstützen sich die Studierenden gegenseitig bei der Vorbereitung auf die Modulprüfungen.",
    },
    "cohort_k50_group_discussion": {
        "src": "/images/community/dmf-community-cohort-k50-group-discussion.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["handwerk", "technik", "kandidaten", "k50", "motivation", "junge", "nachwuchs", "azubis"],
        "alt": "Motivierte männliche Kursteilnehmer der Kohorte K50 während einer interaktiven Unterrichtseinheit",
        "caption": "Starke Nachwuchskohorten für Handwerk, Industrie und Technik: engagierte Talente der Kohorte K50 während der sprachlichen Grundausbildung.",
    },
    "cohort_k32_focused_test": {
        "src": "/images/community/dmf-community-cohort-k32-focused-test.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["konzentration", "klausur", "pruefung", "k32", "leistungsdruck", "disziplin", "b1", "b2"],
        "alt": "Konzentrierte Arbeitsatmosphäre während einer schriftlichen Deutsch-Klausur der Kohorte K32",
        "caption": "Prüfungssimulation unter Echtbedingungen: regelmäßige Klausuren unter Zeitvorgabe bereiten optimal auf die offiziellen telc- und Goethe-Prüfungen vor.",
    },
    "cohort_k32_teacher_supervision": {
        "src": "/images/community/dmf-community-cohort-k32-teacher-supervision.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["aufsicht", "pruefung", "transparenz", "ehrlichkeit", "qualitaet", "niveau", "k32", "standard"],
        "caption": "Unabhängige Leistungskontrolle am DMF-Campus: nur wer die internen Zwischenprüfungen besteht, wird für die nächste Kursstufe und Arbeitgeber-Interviews freigegeben.",
        "alt": "Lehrkraft beaufsichtigt eine schriftliche Zwischenprüfung der Kohorte K32 im Seminarraum der DMF Academy",
    },
    "cohort_k35_dialogue_reading": {
        "src": "/images/community/dmf-community-cohort-k35-dialogue-reading.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["leseverstehen", "textarbeit", "buch", "k35", "fachsprache", "vokabeln", "fokus", "studium"],
        "alt": "Detailaufnahme einer Kursteilnehmerin beim intensiven Lesen eines deutschen Fachtextes im Kursbuch",
        "caption": "Gezieltes Training des Leseverstehens: Sicherheit im Umgang mit deutschen Arbeitsanweisungen, Dienstplänen und Berufsschultexten.",
    },
    "cohort_k35_smart_tv_lesson": {
        "src": "/images/community/dmf-community-cohort-k35-smart-tv-lesson.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["multimedia", "smartboard", "hoerverstehen", "video", "k35", "modern", "ausstattung", "unterricht"],
        "alt": "Interaktiver Deutschunterricht in Kohorte K35 mit Einsatz von Smart-TV und klassischer Tafelarbeit",
        "caption": "Moderner gestützter Sprachunterricht: Kombination aus audiovisuellen Hörverständnismodulen und strukturierter Tafelarbeit in Kohorte K35.",
    },
    "cohort_k20_1on1_desk_help": {
        "src": "/images/community/dmf-community-cohort-k20-1on1-desk-help.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["unterstuetzung", "hilfe", "betreuung", "k20", "lehrer", "schueler", "erklärung", "geduld"],
        "alt": "DMF-Lehrer erklärt einem Kursteilnehmer der Kohorte K20 individuell eine komplexe Grammatikregel am Platz",
        "caption": "Persönliche Betreuung statt Massenabfertigung: kleine Klassengrößen ermöglichen es unseren Lehrkräften, gezielt auf einzelne Fragen einzugehen.",
    },
    "cohort_k20_handout_distribution": {
        "src": "/images/community/dmf-community-cohort-k20-handout-distribution.jpg",
        "source_type": "drive",
        "group": "faculty_teaching",
        "keywords": ["uebungsblatt", "ausgabe", "test", "k20", "b1", "b2", "training", "vorbereitung"],
        "alt": "DMF-Dozent verteilt neue Prüfungs- und Übungsbögen vor der vollgeschriebenen B1/B2-Tafel in Kohorte K20",
        "caption": "Tägliches Training mit prüfungsnahen Aufgabenformaten: systematische Vorbereitung auf schriftliche und mündliche B1/B2-Prüfungsteile.",
    },
    "cohort_k30_classroom_overview": {
        "src": "/images/community/dmf-community-cohort-k30-classroom-overview.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["k30", "klasse", "atmosphaere", "lernumgebung", "akademie", "vietnam", "ausbildung", "gemeinschaft"],
        "alt": "Blick in die lernbereite Klasse der Kohorte K30 mit ihrem Dozenten an der DMF Talents Academy",
        "caption": "Positive Lernatmosphäre in Kohorte K30: ein strukturierter, wertschätzender Unterrichtsrahmen fördert Ausdauer und hohe Abschlussquoten.",
    },
    "cohort_k49_laptop_study": {
        "src": "/images/community/dmf-community-cohort-k49-laptop-study.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["digital", "laptop", "vorbereitung", "online", "k49", "selbststaendig", "kompetenz", "medien"],
        "alt": "Konzentrierter Kursteilnehmer der Kohorte K49 beim Bearbeiten digitaler Lernmodule am Laptop",
        "caption": "Digitale Lernkompetenz in Kohorte K49: unsere Kandidaten sind mit digitalen Lernplattformen, Online-Prüfungen und Video-Konferenzsystemen bestens vertraut.",
    },
    "b1_b2_handwritten_exam_grading": {
        "src": "/images/community/dmf-community-b1-b2-handwritten-exam-grading.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["schriftlich", "brief", "email", "korrektur", "rotstift", "pruefung", "b1", "b2", "textproduktion", "niveau"],
        "alt": "Nahaufnahme einer handgeschriebenen und detailliert korrigierten deutschen B1/B2-Prüfungsarbeit eines DMF-Talents",
        "caption": "Echter Leistungsnachweis aus dem DMF-Prüfungsarchiv: handgeschriebener deutscher Aufsatz (60 Minuten Prüfungszeit) mit detaillierter Korrektur durch die Lehrkraft.",
    },
    "b2_essay_teacher_corrections": {
        "src": "/images/community/dmf-community-b2-essay-teacher-corrections.jpg",
        "source_type": "drive",
        "group": "classroom_cohorts",
        "keywords": ["aufsatz", "b2", "schreibkompetenz", "dokumentation", "bericht", "korrektur", "grammatik", "ausdruck"],
        "alt": "Vollständige handgeschriebene deutsche Textarbeit mit lehrerseitigen Anmerkungen zu Ausdruck und Satzbau",
        "caption": "Training der schriftlichen Ausdrucksfähigkeit: sichere Textproduktion für spätere Berichtshefte, Pflegedokumentationen und betriebliche E-Mails.",
    },
    "seminar_room_facilities": {
        "src": "/images/community/dmf-community-seminar-room-facilities.jpg",
        "source_type": "drive",
        "group": "dossier_legal",
        "keywords": ["infrastruktur", "ausstattung", "seminarraum", "campus", "akademie", "qualitaetskriterien", "agentur", "checkliste"],
        "alt": "Heller, modern ausgestatteter Seminarraum der DMF Talents Academy mit Smart-TV, Whiteboard und deutschen Lernpostern",
        "caption": "Moderne Lerninfrastruktur am DMF-Campus: helle, klimatisierte Seminarräume bieten optimale Bedingungen für das Vollzeit-Sprachstudium.",
    },

    # === PART B: 28 GERMAN WORKPLACE & LEGAL PRAXIS DOCUMENTARY PHOTOS (source_type="de_praxis") ===
    "de_praxis_pflege_stationsuebergabe": {
        "src": "/images/community/de-praxis-pflege-stationsuebergabe.jpg",
        "source_type": "de_praxis",
        "group": "de_healthcare",
        "keywords": ["stationsuebergabe", "uebergabe", "station", "krankenhaus", "klinik", "pflege", "schicht", "pflegedienstleitung", "pdl", "dokumentation"],
        "alt": "Vietnamesische Pflegefachkraft und deutscher Stationsleiter bei der strukturierten Schichtübergabe am digitalen Visitenwagen im Krankenhaus",
        "caption": "Praxis im deutschen Klinikalltag: strukturierte Schichtübergabe und sichere Abstimmung am digitalen Patientenwagen zwischen vietnamesischer Pflegekraft und Stationsleitung.",
    },
    "de_praxis_altenpflege_vitalwerte": {
        "src": "/images/community/de-praxis-altenpflege-vitalwerte.jpg",
        "source_type": "de_praxis",
        "group": "de_healthcare",
        "keywords": ["altenpflege", "seniorenheim", "pflegeheim", "bewohner", "empathie", "vitalwerte", "blutdruck", "praxisanleitung", "pflegehelfer", "generalistik"],
        "alt": "Vietnamesischer Pflege-Auszubildender misst unter Anleitung einer Praxisanleiterin den Blutdruck bei einem Senioren im deutschen Pflegeheim",
        "caption": "Empathie und Fachpraxis in der deutschen Seniorenpflege: strukturierte Praxisanleitung bei der täglichen Grund- und Behandlungspflege.",
    },
    "de_praxis_klinik_ota_ata_op": {
        "src": "/images/community/de-praxis-klinik-ota-ata-op.jpg",
        "source_type": "de_praxis",
        "group": "de_healthcare",
        "keywords": ["ota", "ata", "op", "operation", "anaesthesie", "steril", "instrumente", "chirurgie", "klinikum"],
        "alt": "Vietnamesische OTA/ATA-Fachkraft bereitet im sterilen Einleitungsraum einer deutschen Klinik das chirurgische Instrumentarium vor",
        "caption": "Hochspezialisierter Einsatz im OP- und Anästhesiebereich: qualifizierte OTA- und ATA-Fachkräfte sichern die Funktionsfähigkeit deutscher Kliniken.",
    },
    "de_praxis_labor_mtla_mtra_diagnostik": {
        "src": "/images/community/de-praxis-labor-mtla-mtra-diagnostik.jpg",
        "source_type": "de_praxis",
        "group": "de_healthcare",
        "keywords": ["mtla", "mtra", "mtl", "mtr", "labor", "radiologie", "diagnostik", "analyse", "medizinisch", "apotheke", "pta"],
        "alt": "Vietnamesische medizinische Technologin (MTLA) arbeitet mit Präzisionspipette und Analysegerät in einem deutschen Kliniklabor",
        "caption": "Präzision in Labor und Diagnostik: Einsatz internationaler MTLA-, MTRA- und PTA-Fachkräfte in deutschen Krankenhäusern und medizinischen Versorgungszentren.",
    },
    "de_praxis_zfa_zahnarzt_behandlung": {
        "src": "/images/community/de-praxis-zfa-zahnarzt-behandlung.jpg",
        "source_type": "de_praxis",
        "group": "de_healthcare",
        "keywords": ["zfa", "zahnarzt", "zahnmedizin", "zahntechniker", "dentallabor", "prophylaxe", "stuhlassistenz", "praxis"],
        "alt": "Vietnamesische ZFA-Auszubildende bereitet die Behandlungseinheit in einer modernen deutschen Zahnarztpraxis vor",
        "caption": "Entlastung für deutsche Zahnarztpraxen und Dentallabore: sprachlich und praktisch geschulte ZFA-Auszubildende unterstützen ab dem ersten Lehrjahr in Stuhlassistenz und Hygiene.",
    },
    "de_praxis_industrie_cnc_werkstatt": {
        "src": "/images/community/de-praxis-industrie-cnc-werkstatt.jpg",
        "source_type": "de_praxis",
        "group": "de_industry",
        "keywords": ["cnc", "zerspanung", "maschinenbau", "industrie", "metall", "schweisser", "iso", "werkstatt", "fertigung", "bauteil", "messen"],
        "alt": "Deutscher Industriemeister und vietnamesischer Zerspanungsmechaniker prüfen ein gefrästes Bauteil mit Messschieber und Zeichnung an der CNC-Maschine",
        "caption": "Präzisionsarbeit im deutschen Maschinen- und Anlagenbau: gemeinsame Qualitätskontrolle an der CNC-Fräsmaschine nach technischer Zeichnung.",
    },
    "de_praxis_handwerk_shk_waermepumpe": {
        "src": "/images/community/de-praxis-handwerk-shk-waermepumpe.jpg",
        "source_type": "de_praxis",
        "group": "de_industry",
        "keywords": ["shk", "waermepumpe", "heizung", "sanitaer", "klima", "kaelte", "monteur", "anlagenmechaniker", "energiewende", "handwerk"],
        "alt": "Vietnamesischer SHK-Anlagenmechaniker und deutscher Meister installieren Rohrleitungen und Armaturen an einer modernen Wärmepumpe",
        "caption": "Umsetzung der Energiewende im deutschen SHK-Handwerk: qualifizierte Anlagenmechaniker unterstützen Meisterbetriebe bei Wärmepumpen- und Haustechnik-Projekten.",
    },
    "de_praxis_elektro_schaltschrank_vde": {
        "src": "/images/community/de-praxis-elektro-schaltschrank-vde.jpg",
        "source_type": "de_praxis",
        "group": "de_industry",
        "keywords": ["elektroniker", "elektro", "schaltschrank", "vde", "betriebstechnik", "automatisierung", "mechatroniker", "spannung", "solar", "photovoltaik"],
        "alt": "Vietnamesischer Elektroniker für Betriebstechnik führt eine VDE-Messung an einem geöffneten Industrieschaltschrank durch",
        "caption": "Fachgerechte Elektroinstallation und VDE-Prüfung: vietnamesische Elektroniker und Mechatroniker im Einsatz in deutschen Industrie- und Handwerksbetrieben.",
    },
    "de_praxis_kfz_hochvolt_elektroauto": {
        "src": "/images/community/de-praxis-kfz-hochvolt-elektroauto.jpg",
        "source_type": "de_praxis",
        "group": "de_industry",
        "keywords": ["kfz", "hochvolt", "elektromobilitaet", "autohaus", "werkstatt", "nutzfahrzeug", "landmaschinen", "diagnose", "fahrzeug"],
        "alt": "Vietnamesischer Kfz-Mechatroniker mit Hochvolt-Schutzhandschuhen und deutscher Werkstattleiter prüfen ein Elektrofahrzeug auf der Hebebühne",
        "caption": "Zukunftssichere Kfz-Meisterbetriebe: gemeinsame Diagnose und Wartung moderner Hochvolt- und Nutzfahrzeugsysteme in der deutschen Fachwerkstatt.",
    },
    "de_praxis_bau_handwerk_baustelle": {
        "src": "/images/community/de-praxis-bau-handwerk-baustelle.jpg",
        "source_type": "de_praxis",
        "group": "de_industry",
        "keywords": ["bau", "baustelle", "maurer", "betonbauer", "tiefbau", "dachdecker", "zimmerer", "dguv", "arbeitsschutz", "unfall", "berufsgenossenschaft"],
        "alt": "Deutscher Bauleiter und vietnamesische Baufachkräfte mit Schutzhelmen prüfen Baupläne und Nivelliergerät auf einer deutschen Baustelle",
        "caption": "Arbeitssicherheit nach DGUV-Standards auf deutschen Baustellen: eingespielte Teams im Hochbau, Tiefbau und Ausbauhandwerk.",
    },
    "de_praxis_handwerk_lebensmittel_optik": {
        "src": "/images/community/de-praxis-handwerk-lebensmittel-optik.jpg",
        "source_type": "de_praxis",
        "group": "de_industry",
        "keywords": ["tischler", "schreiner", "baecker", "fleischer", "augenoptiker", "hoerakustiker", "brauer", "schornsteinfeger", "meister", "werkbank"],
        "alt": "Erfahrener deutscher Handwerksmeister leitet einen vietnamesischen Auszubildenden bei der Präzisionsarbeit an der Werkbank an",
        "caption": "Gelebte Meister-Azubi-Tradition im deutschen Handwerk: direkte Weitergabe von handwerklichem Können und Qualitätsbewusstsein im Ausbildungsbetrieb.",
    },
    "de_praxis_gastro_kueche_haccp": {
        "src": "/images/community/de-praxis-gastro-kueche-haccp.jpg",
        "source_type": "de_praxis",
        "group": "de_service",
        "keywords": ["kueche", "koch", "haccp", "hygiene", "gastronomie", "restaurant", "systemgastronomie", "lebensmittel", "saison"],
        "alt": "Deutscher Küchenchef und vietnamesischer Koch-Auszubildender richten in einer Edelstahl-Hotelküche Speisen nach HACCP-Standard an",
        "caption": "Qualität und Hygiene nach HACCP in der deutschen Gastronomie: strukturierte Einarbeitung an allen Küchenposten durch erfahrene Küchenchefs.",
    },
    "de_praxis_hotellerie_rezeption_checkin": {
        "src": "/images/community/de-praxis-hotellerie-rezeption-checkin.jpg",
        "source_type": "de_praxis",
        "group": "de_service",
        "keywords": ["hotel", "hotellerie", "rezeption", "empfang", "gast", "service", "tourismus", "hotelfach", "restaurantfach"],
        "alt": "Freundliche vietnamesische Hotelfachfrau begrüßt einen Geschäftsreisenden beim Check-in an der Rezeption eines deutschen Hotels",
        "caption": "Serviceexzellenz am Empfang und im Restaurant: sprachlich sichere Nachwuchs- und Fachkräfte stärken die Gastgeberkultur deutscher Hotels.",
    },
    "de_praxis_logistik_lager_scanner": {
        "src": "/images/community/de-praxis-logistik-lager-scanner.jpg",
        "source_type": "de_praxis",
        "group": "de_service",
        "keywords": ["logistik", "lager", "intralogistik", "kommissionierung", "scanner", "stapler", "spedition", "lieferkette", "handel"],
        "alt": "Vietnamesische Fachkraft für Lagerlogistik prüft mit einem Handscanner eine Palettenlieferung im deutschen Logistikzentrum",
        "caption": "Verlässliche Abläufe in Intralogistik und Großhandel: geschulte Fachkräfte für Lagerlogistik sichern Kommissionierung und Warenfluss.",
    },
    "de_praxis_verkehr_busfahrer_cockpit": {
        "src": "/images/community/de-praxis-verkehr-busfahrer-cockpit.jpg",
        "source_type": "de_praxis",
        "group": "de_service",
        "keywords": ["busfahrer", "berufskraftfahrer", "lkw", "oepnv", "linienverkehr", "fuehrerschein", "eu-qualifikation", "transport", "mobilität"],
        "alt": "Vietnamesischer Berufskraftfahrer im Cockpit eines deutschen Linienbusses bei der digitalen Routenkontrolle mit seinem Fahrlehrer",
        "caption": "Sicherung der Mobilität im ÖPNV und Güterverkehr: strukturierte Qualifizierung zum Berufskraftfahrer (IHK-Grundqualifikation & EU-Fahrerlaubnis).",
    },
    "de_praxis_recht_81a_vorabzustimmung": {
        "src": "/images/community/de-praxis-recht-81a-vorabzustimmung.jpg",
        "source_type": "de_praxis",
        "group": "de_legal",
        "keywords": ["81a", "beschleunigtes", "vorabzustimmung", "vollmacht", "auslaenderbehoerde", "zav", "bundesagentur", "fristen", "gebuehr", "411"],
        "alt": "Verfahrensakte zum beschleunigten Fachkräfteverfahren (§ 81a AufenthG) mit Vollmacht und Fristenplan auf einem deutschen HR-Schreibtisch",
        "caption": "Planungssicherheit durch § 81a AufenthG: strukturierte Verfahrensführung mit Vollmacht, ZAV-Vorabprüfung und gesetzlich geregelten Behördenfristen.",
    },
    "de_praxis_anerkennung_zab_defizitbescheid": {
        "src": "/images/community/de-praxis-anerkennung-zab-defizitbescheid.jpg",
        "source_type": "de_praxis",
        "group": "de_legal",
        "keywords": ["anerkennung", "defizitbescheid", "16d", "anerkennungspartnerschaft", "qualifizierungsplan", "zab", "gleichwertigkeit", "anpassungslehrgang", "kenntnispruefung"],
        "alt": "Deutsche Personalreferentin und vietnamesische Fachkraft besprechen den Anerkennungsbescheid und den betrieblichen Qualifizierungsplan",
        "caption": "Anerkennungspartnerschaft (§ 16d AufenthG) und Gleichwertigkeitsprüfung: transparenter Abgleich von Defizitbescheid und betrieblichem Qualifizierungsplan.",
    },
    "de_praxis_vertrag_ihk_ausbildungsvertrag": {
        "src": "/images/community/de-praxis-vertrag-ihk-ausbildungsvertrag.jpg",
        "source_type": "de_praxis",
        "group": "de_legal",
        "keywords": ["arbeitsvertrag", "ausbildungsvertrag", "vertrag", "klausel", "rueckzahlung", "bag", "bbig", "agg", "verpflichtungserklaerung", "296a"],
        "alt": "Unterzeichnung eines IHK-/HWK-Ausbildungsvertrags am Konferenztisch eines deutschen Unternehmens",
        "caption": "Rechtssichere Vertragsgestaltung nach BBiG, AGG und BAG-Rechtsprechung: transparente Ausbildungs- und Arbeitsverträge ohne unwirksame Bindungsklauseln.",
    },
    "de_praxis_payroll_lohnabrechnung_sozialversicherung": {
        "src": "/images/community/de-praxis-payroll-lohnabrechnung-sozialversicherung.jpg",
        "source_type": "de_praxis",
        "group": "de_legal",
        "keywords": ["lohn", "gehalt", "verguetung", "sozialversicherung", "krankenkasse", "steuer", "mindestlohn", "entgelt", "bav", "altersvorsorge", "rente", "arbeitszeit", "urlaub"],
        "alt": "Überprüfung der deutschen Entgeltabrechnung, Sozialversicherungsanmeldung und Krankenkassenkarte in der Personalabteilung",
        "caption": "Korrekte Entgeltabrechnung und Sozialversicherung ab Tag 1: Einhaltung von Vergleichsentgelt, Mindestausbildungsvergütung und DEÜV-Meldepflichten.",
    },
    "de_praxis_wohnraum_azubi_wg_schluessel": {
        "src": "/images/community/de-praxis-wohnraum-azubi-wg-schluessel.jpg",
        "source_type": "de_praxis",
        "group": "de_integration",
        "keywords": ["wohnraum", "wohnung", "unterkunft", "wg", "miete", "schluessel", "sachbezug", "wohnzuschuss", "einzug", "immobilie"],
        "alt": "Schlüsselübergabe in einer hellen, möblierten deutschen Azubi-Wohngemeinschaft an zwei neu eingereiste vietnamesische Auszubildende",
        "caption": "Gelöste Wohnraumfrage vor der Einreise: bezugsfertige Azubi-WGs und Mitarbeiterwohnungen schaffen vom ersten Tag an Sicherheit und Wohlbefinden.",
    },
    "de_praxis_behoerde_buergeramt_anmeldung": {
        "src": "/images/community/de-praxis-behoerde-buergeramt-anmeldung.jpg",
        "source_type": "de_praxis",
        "group": "de_integration",
        "keywords": ["anmeldung", "buergeramt", "einwohnermeldeamt", "steuer-id", "bankkonto", "rundfunkbeitrag", "behoerdengang", "erste-woche", "30-tage"],
        "alt": "DMF-Betreuer begleitet eine neu eingereiste vietnamesische Fachkraft bei der Wohnsitzanmeldung im deutschen Bürgeramt",
        "caption": "Begleitete Behördengänge in den ersten 30 Tagen: Wohnsitzanmeldung (§ 17 BMG), Steuer-ID, Girokonto und elektronischer Aufenthaltstitel (eAT).",
    },
    "de_praxis_berufsschule_fachklasse_deutschland": {
        "src": "/images/community/de-praxis-berufsschule-fachklasse-deutschland.jpg",
        "source_type": "de_praxis",
        "group": "de_integration",
        "keywords": ["berufsschule", "fachklasse", "asa-flex", "deufoev", "berichtsheft", "zwischenpruefung", "abschlusspruefung", "fachtheorie", "kammer"],
        "alt": "Vietnamesische Auszubildende arbeiten gemeinsam mit deutschen Mitschülern im Fachunterricht einer deutschen Berufsschule",
        "caption": "Erfolg in der deutschen Berufsschule: Verbindung aus solider sprachlicher Vorbereitung, betrieblicher Lernzeit und begleitenden Förderinstrumenten (AsA flex / DeuFöV).",
    },
    "de_praxis_hr_video_interview_auswahl": {
        "src": "/images/community/de-praxis-hr-video-interview-auswahl.jpg",
        "source_type": "de_praxis",
        "group": "de_hr",
        "keywords": ["video-interview", "digital", "vorstellungsgespraech", "personalleitung", "auswahl", "shortlist", "matching", "suchprofil", "kandidatenprofil"],
        "alt": "Deutsche Personalleiterin und Fachabteilungsleiter führen im Konferenzraum ein Live-Video-Interview mit einem DMF-Kandidaten",
        "caption": "Strukturierte digitale Bewerberauswahl: deutsche Arbeitgeber prüfen Fachwissen, Sprachniveau und persönliche Passung im begleiteten Live-Video-Interview.",
    },
    "de_praxis_betriebsrat_mitbestimmung_meeting": {
        "src": "/images/community/de-praxis-betriebsrat-mitbestimmung-meeting.jpg",
        "source_type": "de_praxis",
        "group": "de_hr",
        "keywords": ["betriebsrat", "99", "betrvg", "mitbestimmung", "personalplanung", "gremium", "zustimmung", "geschäftsführung", "strategie"],
        "alt": "Konstruktive Sitzung zwischen Geschäftsführung, Personalleitung und Betriebsrat zur Abstimmung internationaler Einstellungen nach § 99 BetrVG",
        "caption": "Frühzeitige Einbindung des Betriebsrats (§ 99 BetrVG): vollständige Entscheidungsunterlagen zu Qualifikation, Eingruppierung und Integrationskonzept.",
    },
    "de_praxis_onboarding_patensystem_mentor": {
        "src": "/images/community/de-praxis-onboarding-patensystem-mentor.jpg",
        "source_type": "de_praxis",
        "group": "de_hr",
        "keywords": ["pate", "patensystem", "mentor", "onboarding", "einarbeitung", "90-tage", "probezeit", "ausbilder", "kollege", "team"],
        "alt": "Erfahrener deutscher Kollege erläutert als betrieblicher Pate einem neuen vietnamesischen Mitarbeiter den Schicht- und Einarbeitungsplan",
        "caption": "Das betriebliche Patensystem in den ersten 90 Tagen: klare Trennung zwischen fachlichem Ausbilder und vertrautem Kollegen als Alltags-Mentor.",
    },
    "de_praxis_roi_kosten_kalkulation_board": {
        "src": "/images/community/de-praxis-roi-kosten-kalkulation-board.jpg",
        "source_type": "de_praxis",
        "group": "de_hr",
        "keywords": ["roi", "kosten", "honorar", "budget", "zeitarbeit", "leiharbeit", "vakanz", "cost-of-vacancy", "amortisation", "wirtschaftlichkeit", "kalkulation"],
        "alt": "Geschäftsführung und HR-Leitung analysieren im Büro die Vollkosten- und ROI-Kalkulation der Direktrekrutierung im Vergleich zur Zeitarbeit",
        "caption": "Transparente Vollkosten- und ROI-Rechnung: nachhaltige Direktrekrutierung amortisiert sich gegenüber Zeitarbeit und unbesetzten Stellen oft schon im ersten Jahr.",
    },
    "de_praxis_arbeitsprobe_fachpraxis_test": {
        "src": "/images/community/de-praxis-arbeitsprobe-fachpraxis-test.jpg",
        "source_type": "de_praxis",
        "group": "de_hr",
        "keywords": ["arbeitsprobe", "praxistest", "qualifikationsanalyse", "14-bqfg", "handfertigkeit", "eignungstest", "fachpraxis", "kompetenz"],
        "alt": "Vietnamesische Fachkraft absolviert eine praktische Arbeitsprobe an einem Prüfstand unter Aufsicht eines deutschen technischen Prüfers",
        "caption": "Verifizierte Fachpraxis vor Vertragsabschluss: durch dokumentierte Arbeitsproben und praktische Eignungstests machen Sie handwerkliches Können messbar.",
    },
    "de_praxis_retention_team_integration": {
        "src": "/images/community/de-praxis-retention-team-integration.jpg",
        "source_type": "de_praxis",
        "group": "de_hr",
        "keywords": ["bindung", "bleibequote", "fluktuation", "abbrecher", "team", "integration", "familiennachzug", "niederlassungserlaubnis", "zukunft", "langfristig"],
        "alt": "Deutsch-vietnamesisches Mitarbeiterteam im kollegialen Gespräch während der Pause auf dem Unternehmensgelände in Deutschland",
        "caption": "Langfristige Mitarbeiterbindung (>95 % Bleibequote): gelebte Teamintegration und klare Bleibeperspektiven sichern Ihren Fachkräftebestand nachhaltig.",
    },
}

ALL_KEYS = list(VISUAL_LIBRARY_100.keys())
DRIVE_KEYS = [k for k, v in VISUAL_LIBRARY_100.items() if v["source_type"] == "drive"]
DE_PRAXIS_KEYS = [k for k, v in VISUAL_LIBRARY_100.items() if v["source_type"] == "de_praxis"]


def strip_existing_community_figures(html: str) -> str:
    cleaned = re.sub(
        r'\s*<figure class="dmf-community-figure">.*?</figure>\s*',
        "\n\n",
        html,
        flags=re.DOTALL,
    )
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def count_clean_words(html: str) -> int:
    text = re.sub(r"<[^>]+>", " ", html)
    return len(text.split())


def determine_target_figure_count(word_count: int, slug: str) -> int:
    if slug.startswith("dmf-"):
        return 6 if word_count >= 900 else 5
    if word_count < 720:
        return 3
    elif word_count < 820:
        return 4
    elif word_count < 920:
        return 5
    else:
        return 6


def build_figure_html(item_key: str) -> str:
    item = VISUAL_LIBRARY_100[item_key]
    return (
        f'<figure class="dmf-community-figure">'
        f'<img src="{item["src"]}" alt="{item["alt"]}" width="1200" height="675" loading="lazy" decoding="async" />'
        f'<figcaption>{item["caption"]}</figcaption>'
        f'</figure>'
    )


def score_image_for_section(
    item_key: str,
    h2_title: str,
    section_text: str,
    post_slug: str,
    post_title: str,
    usage_counter: dict[str, int],
    prefer_source_type: str | None = None,
) -> float:
    spec = VISUAL_LIBRARY_100[item_key]
    h2_lower = h2_title.lower()
    sec_lower = section_text.lower()
    post_lower = f"{post_slug} {post_title}".lower()

    score = 0.0
    for kw in spec["keywords"]:
        if kw in h2_lower:
            score += 4.5
        if kw in sec_lower:
            score += 2.0
        if kw in post_lower:
            score += 1.5

    if prefer_source_type and spec["source_type"] == prefer_source_type:
        score += 5.0

    # Strong anti-repetition penalty so all 100 images are balanced (~6.5 uses each across 656 slots)
    used = usage_counter.get(item_key, 0)
    score -= used * 2.2

    # Deterministic tie-breaker per (post_slug, h2_title, item_key)
    tie = int(hashlib.md5(f"{post_slug}:{h2_title}:{item_key}".encode("utf-8")).hexdigest()[:6], 16) / 0xFFFFFF
    score += tie * 0.8
    return score


def select_and_inject_figures(
    slug: str,
    title: str,
    raw_html: str,
    usage_counter: dict[str, int],
) -> tuple[str, list[str]]:
    clean_html = strip_existing_community_figures(raw_html)
    word_count = count_clean_words(clean_html)
    target_count = determine_target_figure_count(word_count, slug)

    # Find all H2 tags and their spans
    h2_matches = list(re.finditer(r"<h2\b[^>]*>(.*?)</h2>", clean_html, flags=re.IGNORECASE | re.DOTALL))

    # Build insertion slots: each slot has (insert_pos_in_clean_html, h2_heading_text, section_body_text)
    slots: list[tuple[int, str, str]] = []
    for i, m in enumerate(h2_matches):
        h2_text = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        start_pos = m.start()
        end_pos = h2_matches[i + 1].start() if i + 1 < len(h2_matches) else len(clean_html)
        sec_body = re.sub(r"<[^>]+>", " ", clean_html[m.end() : end_pos]).strip()
        slots.append((start_pos, h2_text, sec_body))

    # If a post has fewer H2 tags than target_count + 1, also look for H3 or paragraph boundaries in long sections
    selected_slots: list[tuple[int, str, str]] = []
    if len(slots) > target_count:
        # Avoid placing right before H2 #1 (which is immediately after TL;DR) if there are enough subsequent H2s
        candidate_slots = slots[1:] if len(slots) - 1 >= target_count else slots
        # Evenly sample target_count slots from candidate_slots
        n = len(candidate_slots)
        indices = []
        for k in range(target_count):
            idx = round(k * (n - 1) / max(1, target_count - 1)) if target_count > 1 else 0
            if idx in indices:
                for alt_i in range(n):
                    if alt_i not in indices:
                        idx = alt_i
                        break
            indices.append(idx)
        indices.sort()
        selected_slots = [candidate_slots[i] for i in indices]
    else:
        selected_slots = list(slots)
        # If we still need more slots (e.g., 3 H2s but target_count=4), split the longest section after a </p> or </ul>
        while len(selected_slots) < target_count:
            p_closings = [m.end() for m in re.finditer(r"</p>|</ul>|</table>", clean_html, flags=re.IGNORECASE)]
            existing_positions = {s[0] for s in selected_slots}
            best_pos = None
            best_dist = -1
            for pos in p_closings:
                if pos < 350 or pos > len(clean_html) - 250:
                    continue
                min_dist = min((abs(pos - ep) for ep in existing_positions), default=9999)
                if min_dist > best_dist:
                    best_dist = min_dist
                    best_pos = pos
            if best_pos is None:
                break
            snippet = re.sub(r"<[^>]+>", " ", clean_html[max(0, best_pos - 300) : min(len(clean_html), best_pos + 300)])
            selected_slots.append((best_pos, title, snippet))
            selected_slots.sort(key=lambda x: x[0])

    # Determine desired mix of Drive Authentic vs DE-Praxis for this post:
    # - Flagship DMF Brand posts ("dmf-*"): 100% Drive Authentic (or at most 1 DE-Praxis)
    # - Standard B2B SEO posts: ~2/3 Drive Authentic + ~1/3 DE-Praxis (e.g., for 3->2+1, 4->3+1, 5->3+2, 6->4+2)
    is_dmf_brand = slug.startswith("dmf-") or "dmf-vietnam" in slug
    desired_de_praxis = 0 if is_dmf_brand else (1 if target_count <= 4 else 2)

    chosen_keys: list[str] = []
    used_groups: set[str] = set()
    de_praxis_picked = 0

    for slot_idx, (_, h2_title, sec_text) in enumerate(selected_slots):
        # Decide if this slot prefers DE-Praxis or Drive Authentic
        remaining_slots = len(selected_slots) - slot_idx
        need_more_de = desired_de_praxis - de_praxis_picked
        if need_more_de <= 0:
            prefer_type = "drive"
        elif remaining_slots <= need_more_de:
            prefer_type = "de_praxis"
        else:
            prefer_type = None

        scored = []
        for k in ALL_KEYS:
            if k in chosen_keys:
                continue
            spec = VISUAL_LIBRARY_100[k]
            if is_dmf_brand and spec["source_type"] == "de_praxis":
                continue
            s = score_image_for_section(k, h2_title, sec_text, slug, title, usage_counter, prefer_type)
            # Encourage diverse visual groups within the same article
            if spec["group"] in used_groups:
                s -= 3.5
            scored.append((s, k))

        scored.sort(reverse=True)
        best_key = scored[0][1]
        chosen_keys.append(best_key)
        used_groups.add(VISUAL_LIBRARY_100[best_key]["group"])
        if VISUAL_LIBRARY_100[best_key]["source_type"] == "de_praxis":
            de_praxis_picked += 1
        usage_counter[best_key] = usage_counter.get(best_key, 0) + 1

    # Reconstruct HTML by inserting figures at selected_slots (from back to front so character offsets stay valid)
    result_html = clean_html
    for (pos, _, _), key in sorted(zip(selected_slots, chosen_keys), key=lambda x: x[0][0], reverse=True):
        fig_html = build_figure_html(key)
        result_html = result_html[:pos] + "\n\n" + fig_html + "\n\n" + result_html[pos:]

    result_html = re.sub(r"\n{3,}", "\n\n", result_html).strip()
    return result_html, chosen_keys


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
    import time
    url = f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post_id}"
    payload = json.dumps({"content": new_content}).encode("utf-8")
    for attempt in range(5):
        try:
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
            return
        except Exception as exc:
            if attempt == 4:
                raise
            time.sleep(1.5 * (attempt + 1))


def main() -> None:
    print(f"Validating 100-image pool ({len(DRIVE_KEYS)} Drive Authentic + {len(DE_PRAXIS_KEYS)} DE-Praxis)...")
    missing = []
    for k, spec in VISUAL_LIBRARY_100.items():
        p = PUB_DIR / spec["src"].lstrip("/")
        if not p.exists():
            missing.append((k, str(p)))
    if missing:
        raise FileNotFoundError(f"Missing {len(missing)} images on disk: {missing[:5]}")

    posts = fetch_published_posts()
    print(f"Fetched {len(posts)} published posts from Supabase.")

    usage_counter: dict[str, int] = {k: 0 for k in ALL_KEYS}
    tier_counts = {3: 0, 4: 0, 5: 0, 6: 0}
    total_figures = 0
    updated_count = 0

    for post in posts:
        slug = post["slug"]
        title = post.get("title") or ""
        content = post.get("content") or ""

        new_content, chosen_keys = select_and_inject_figures(slug, title, content, usage_counter)
        n_figs = len(chosen_keys)
        tier_counts[n_figs] = tier_counts.get(n_figs, 0) + 1
        total_figures += n_figs

        if new_content != content:
            update_post_content(post["id"], new_content)
            updated_count += 1

    drive_uses = sum(usage_counter[k] for k in DRIVE_KEYS)
    de_uses = sum(usage_counter[k] for k in DE_PRAXIS_KEYS)

    print(f"\n✓ Enriched {updated_count}/{len(posts)} posts with {total_figures} total inline `<figure>` blocks!")
    print(f"  - Tier breakdown (inline figures per post): {tier_counts}")
    print(f"  - Source mix: {drive_uses} Authentic DMF Drive figures ({drive_uses/total_figures*100:.1f}%) + {de_uses} DE-Praxis figures ({de_uses/total_figures*100:.1f}%)")
    print(f"  - Unique images utilized from 100-image pool: {sum(1 for v in usage_counter.values() if v > 0)}/100")
    print(f"  - Min / Avg / Max usage per image: {min(usage_counter.values())} / {total_figures/len(ALL_KEYS):.1f} / {max(usage_counter.values())}")


if __name__ == "__main__":
    main()
