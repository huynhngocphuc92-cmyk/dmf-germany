#!/usr/bin/env python3
"""
Sync all 35 compiled blog articles to Supabase 'posts' table.
Sets status to 'published' so they immediately appear on the live website.
"""

import json
import os
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
COMPILED_FILE = BASE_DIR / "content" / "compiled" / "all-posts.json"

SUPABASE_URL = "https://iihprcuhmilmymlbktpy.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHByY3VobWlsbXltbGJrdHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTk4MiwiZXhwIjoyMDgzMTgxOTgyfQ.JbraSUKjSW4iN1FV-bvBfL1CO943dk29ThQcD3ya0vQ"
AUTHOR_ID = "f198e552-d96b-48d6-a537-86f8eec86c8a"

POST_COVER_MAPPING = {
    "lagerlogistik-berufskraftfahrer-vietnam-beschv": "/images/blog/dmf-logistik-arbeitsplatz-training.jpg",
    "vorstellungsgespraech-azubis-vietnam-fragen": "/images/blog/dmf-achim-interview-coaching.jpg",
    "maler-lackierer-trockenbau-vietnam-einstellen": "/images/blog/dmf-lackier-ausbau-training.jpg",
    "bau-fachkraefte-vietnam-maurer-betonbauer": "/images/blog/dmf-bau-handwerk-simulation.jpg",
    "einstiegsqualifizierung-eq-54a-sgb-iii-azubis": "/images/blog/dmf-dozenten-fachunterricht.jpg",
    "deufoev-foerderung-45a-aufenthg-sprachkurse": "/images/blog/dmf-fachbibliothek-unterricht.jpg",
    "niederlassungserlaubnis-fachkraefte-18c-aufenthg": "/images/blog/dmf-azubi-abschluss-zertifikat.jpg",
    "familiennachzug-fachkraefte-aufenthg-arbeitgeber": "/images/blog/dmf-azubi-leben-in-deutschland.jpg",
    "interkulturelle-fuehrung-vietnamesische-fachkraefte": "/images/blog/dmf-teamarbeit-fallstudien.jpg",
    "ota-ata-fachkraefte-aus-vietnam-kliniken": "/images/blog/dmf-medizin-simulation-saal.jpg",
    "guetesiegel-faire-anwerbung-pflege-deutschland": "/images/blog/dmf-klinik-partner-audit.jpg",
    "kfz-mechatroniker-hochvolt-e-mobilitaet-vietnam": "/images/blog/dmf-kfz-diagnose-labor.jpg",
    "solarteure-photovoltaik-fachkraefte-vietnam": "/images/blog/dmf-solar-elektro-schulung.jpg",
    "roi-kalkulation-auszubildende-amortisation-betrieb": "/images/blog/dmf-karriere-urkunde-erfolg.jpg",
    "employer-pays-prinzip-296a-sgb-iii-transparenz": "/images/blog/dmf-fachkraefte-auswahl-kommission.jpg",
    "berufsschule-fachtheorie-asa-flex-vietnamesische-azubis": "/images/blog/dmf-azubi-motivation-lernen.jpg",
    "visum-berufsausbildung-16a-voraussetzungen-pflichten": "/images/blog/dmf-campus-lehrsaal-modern.jpg",
    "chancenkarte-feg-aenderungen-arbeitgeber": "/images/blog/dmf-bewerber-profil-pruefung.jpg",
    "anerkennungsverfahren-vietnam-abschluesse-defizitbescheid": "/images/blog/dmf-fachsprache-lehrkraft.jpg",
    "cnc-fachkraefte-zerspanungsmechaniker-vietnam": "/images/blog/dmf-azubi-einarbeitung-werkstatt.jpg",
    "baecker-konditoren-lebensmittelhandwerk-vietnam": "/images/blog/dmf-praxis-uebung-labor.jpg",
    "it-spezialisten-softwareentwickler-vietnam-blaue-karte": "/images/blog/dmf-it-arbeitsplaetze-schulung.jpg",
    "schweisser-metallbauer-aus-vietnam-zertifikate": "/images/blog/dmf-arbeitgeber-kooperation-handwerk.jpg",
    "wohnraum-fuer-azubis-praxisloesungen-arbeitgeber": "/images/blog/dmf-wohnraum-azubi-unterkunft.jpg",
    "cost-of-vacancy-kosten-unbesetzter-stellen-rekrutierung": "/images/blog/dmf-partner-deutschland-meeting.jpg",
    "gastronomie-hotellerie-personal-vietnam-einstellen": "/images/blog/dmf-gastronomie-hotellerie-service.jpg",
    "handwerker-aus-vietnam-elektroniker-mechatroniker-shk": "/images/blog/dmf-talent-partnerschaft-deutschland-vietnam.jpg",
    "ausbildungsabbrueche-verhindern-fruehwarnsignale-betreuung": "/images/blog/dmf-leben-in-deutschland-freizeit.jpg",
    "beschleunigtes-fachkraefteverfahren-81a-ablauf": "/images/blog/dmf-delegation-besuch-akademie.jpg",
    "pflegekraefte-aus-vietnam-anerkennung-sprachpraxis-integration": "/images/blog/dmf-pflege-station-praxis.jpg",
    "vom-personalbedarf-zum-abgestimmten-suchprofil": "/images/blog/dmf-unterricht-materialien.jpg",
    "deutsch-im-arbeitsalltag-sprachliche-anforderungen-vorstellungsgespraech": "/images/blog/dmf-sprachuebung-tablet.jpg",
    "azubis-aus-vietnam-vorbereitung-ausbildungsbetrieb": "/images/blog/dmf-klassenzimmer.jpg",
    "onboarding-internationale-fachkraefte-90-tage": "/images/blog/dmf-ausreise-flughafen.jpg",
    "personalvermittlung-vietnam-angebote-vergleichen": "/images/blog/dmf-angebote-pruefung.jpg",
    "fachkraefte-aus-vietnam-einstellen-checkliste": "/images/blog/dmf-betreuung-unterlagen.jpg",
    "vietnamesische-fachkraefte-verlaesslich-statt-riskant-wie-dmf-ausbildungsabbrueche-und-ausbeutung-verhindert": "/images/blog/dmf-achim-fuehrung-seminar.jpg",
    "qualitaetssicherung-durch-sprache-wie-dmf-vietnam-ihre-zukuenftigen-fachkraefte-vorbereitet": "/images/blog/dmf-sprachkurs-praxis-unterricht.jpg",
    "informationspflicht-arbeitgeber-45c-aufenthg-faire-integration": "/images/blog/dmf-vertrag-unterzeichnung.jpg",
    "anerkennungspartnerschaft-16d-aufenthg-arbeitgeber-voraussetzungen": "/images/blog/dmf-akademie-abschlussfeier-urkunde.jpg",
    "berufserfahrung-fachkraefte-drittstaaten-beschv-ohne-anerkennung": "/images/blog/dmf-schulung-werkbank-montage.jpg",
    "zeitarbeit-drittstaaten-verbot-40-aufenthg-direktvermittlung": "/images/blog/dmf-gespraech-partner-unternehmensleitung.jpg",
    "anlagenmechaniker-shk-waermepumpen-monteure-vietnam": "/images/blog/dmf-seminar-fachkraft-diskussion.jpg",
    "erzieherinnen-aus-vietnam-kitas-traeger-anerkennung": "/images/blog/dmf-unterricht-interaktiv.jpg",
    "industriemechaniker-instandhaltung-maschinenbau-vietnam": "/images/blog/dmf-azubi-erfolgreiche-ausreise.jpg",
    "elektroniker-betriebstechnik-automatisierung-vietnam": "/images/blog/dmf-lehrkraft-tafel.jpg",
    "pflegehelfer-1-jaehrige-ausbildung-vietnam-kliniken": "/images/blog/dmf-azubi-ankunft-deutschland.jpg",
    "koeche-spezialitaetenkoeche-vietnam-beschv-dehoga": "/images/blog/dmf-sprachpraxis-dialog-training.jpg",
    "steuerfreie-arbeitgeberleistungen-azubis-sachbezug-wohnzuschuss": "/images/blog/dmf-interkulturell-austausch-gruppe.jpg",
    "chancenkarte-in-festanstellung-wechsel-arbeitgeber-leitfaden": "/images/blog/dmf-praesentation-bildung-arbeitsmarkt.jpg",
    "fuehrerschein-umschreibung-drittstaaten-drittlaender-vietnam": "/images/blog/dmf-fuehrerschein-verkehr-mobilitaet.jpg",
    "doppelbesteuerungsabkommen-dba-vietnam-deutschland-arbeitgeber": "/images/blog/dmf-doppelbesteuerung-finanzamt-beratung.jpg",
    "probezeit-nicht-bestanden-drittstaaten-meldepflicht-aufenthg": "/images/blog/dmf-probezeit-gespraech-auswertung.jpg",
    "krankenkassen-anmeldung-fachkraefte-drittstaaten-gkv": "/images/blog/dmf-krankenkasse-sozialversicherung-service.jpg",
    "duales-studium-vietnam-fachhochschule-unternehmen-aufenthg": "/images/blog/dmf-duales-studium-hochschule-akademie.jpg",
    "sprachzertifikate-goethe-telc-oesd-visum-drittstaaten": "/images/blog/dmf-sprachpruefung-goethe-zertifikat.jpg",
    "verpflichtungserklaerung-arbeitgeber-66-68-aufenthg-haftung": "/images/blog/dmf-verpflichtungserklaerung-buergschaft-vertrag.jpg",
    "dachdecker-fassadenbauer-solarmonteure-vietnam-handwerk": "/images/blog/dmf-dachdecker-solar-fassadenbau.jpg",
    "land-baumaschinenmechatroniker-drittstaaten-vietnam": "/images/blog/dmf-landmaschinen-baumaschinen-werkstatt.jpg",
    "fleischer-metzger-lebensmitteltechnik-vietnam-drittstaaten": "/images/blog/dmf-fleischer-metzger-lebensmittelhandwerk.jpg",
    "hotelfachmann-restaurantfachkraft-vietnam-dehoga-gastronomie": "/images/blog/dmf-hotelfach-restaurant-service-training.jpg",
    "urkundenpruefung-legalisation-vietnam-deutsche-botschaft-hanoi": "/images/blog/dmf-urkundenpruefung-legalisation-botschaft.jpg",
    "zav-vorabzustimmung-31-aufenthv-visum-beschleunigung": "/images/blog/dmf-zav-arbeitsagentur-beratung.jpg",
    "defizitbescheid-qualifizierungsplan-16d-aufenthg-arbeitgeber": "/images/blog/dmf-defizitbescheid-weiterbildung-plan.jpg",
    "qualifikationsanalyse-14-bqfg-nachweis-ohne-zeugnisse": "/images/blog/dmf-qualifikationsanalyse-werkstatt-test.jpg",
    "minderjaehrige-azubis-drittstaaten-jugendarbeitsschutz-jarbschg": "/images/blog/dmf-minderjaehrige-azubis-betreuung.jpg",
    "vermittlungskosten-steuerlich-absetzen-betriebsausgaben-vorsteuer": "/images/blog/dmf-finanzbuchhaltung-steuer-belege.jpg",
    "zimmerer-holzbau-fachkraefte-vietnam-abbund-handwerk": "/images/blog/dmf-zimmerer-holzbau-montage.jpg",
    "tischler-schreiner-vietnam-moebel-innenausbau-cnc": "/images/blog/dmf-schreiner-tischler-fertigung.jpg",
    "gabelstapler-flurfoerdermittel-dguv-vorschrift-68-drittstaaten": "/images/blog/dmf-stapler-lagerlogistik-schulung.jpg",
    "tiefbau-strassenbau-rohrleitungsbau-vietnam-infrastruktur": "/images/blog/dmf-tiefbau-strassenbau-baustelle.jpg",
    "krankenpflegehelfer-weiterbildung-pflegefachkraft-1plus2-modell": "/images/blog/dmf-pflege-station-visite-team.jpg",
    "familiennachzug-fachkraefte-29-aufenthg-wohnraumnachweis": "/images/blog/dmf-familiennachzug-wohnung-beratung.jpg",
    "betriebliche-altersvorsorge-bav-fachkraefte-drittstaaten-betravg": "/images/blog/dmf-vorsorge-beratung-arbeitsplatz.jpg",
    "geruestbauer-drittstaaten-vietnam-trbs-2121-handwerk": "/images/blog/dmf-geruestbau-montage-hoehe.jpg",
    "gleisbauer-schienenverkehr-bahn-infrastruktur-drittstaaten": "/images/blog/dmf-gleisbau-schienen-infrastruktur.jpg",
    "karosseriebauer-fahrzeuglackierer-unfallinstandsetzung-vietnam": "/images/blog/dmf-karosserie-lackier-werkstatt.jpg",
    "konstruktionsmechaniker-stahlbau-schweissen-din-en-1090": "/images/blog/dmf-konstruktionsmechanik-stahlbau-halle.jpg",
    "kuendigung-aufhebungsvertrag-drittstaaten-meldepflicht-auslaenderbehoerde": "/images/blog/dmf-personalbuero-kuendigung-beratung.jpg",
    "vergleichsentgelt-lohnpruefung-zav-arbeitsbedingungen-entgeltatlas": "/images/blog/dmf-gehaltsabrechnung-lohnpruefung-tabelle.jpg",
    "arbeitszeitgesetz-ueberstunden-schichtarbeit-drittstaaten-arbeitgeber": "/images/blog/dmf-arbeitszeiterfassung-stempeluhr-schicht.jpg",
    "nebenjob-minijob-auszubildende-fachkraefte-drittstaaten-erlaubnis": "/images/blog/dmf-azubi-beratung-nebenjob-arbeitsvertrag.jpg",
    "hebammen-entbindungspfleger-vietnam-anerkennung-hebg-klinik": "/images/blog/dmf-klinik-geburtshilfe-hebammen-team.jpg",
    "physiotherapeuten-aus-drittstaaten-anerkennung-mphg-praxen": "/images/blog/dmf-physiotherapie-reha-behandlung.jpg",
    "girokonto-eroeffnung-drittstaaten-schufa-zkg-arbeitgeber": "/images/blog/dmf-bankkonto-girokonto-beratung.jpg",
    "wohnung-anmeldung-bmg-rundfunkbeitrag-gez-unterkunft-arbeitgeber": "/images/blog/dmf-einwohnermeldeamt-anmeldung-wohnung.jpg",
    "mechatroniker-kaeltetechnik-kaelteanlagen-klimasysteme-vietnam": "/images/blog/dmf-kaeltetechnik-klimaanlage-wartung.jpg",
    "garten-landschaftsbau-galabau-fachkraefte-vietnam": "/images/blog/dmf-galabau-gartenbau-aussenanlage.jpg",
    "zahntechniker-dentallabor-cad-cam-drittstaaten-vietnam": "/images/blog/dmf-zahntechnik-dentallabor-fraesen.jpg",
    "busfahrer-oepnv-linienverkehr-drittstaaten-vietnam-beschv": "/images/blog/dmf-busfahrer-oepnv-linienbus-depot.jpg",
    "fachinformatiker-systemintegration-cloud-netzwerke-vietnam": "/images/blog/dmf-systemintegration-rechenzentrum-server.jpg",
    "zahnmedizinische-fachangestellte-zfa-praxen-vietnam-anerkennung": "/images/blog/dmf-zfa-zahnarztpraxis-behandlung-stuhl.jpg",
    "medizinische-fachangestellte-mfa-arztpraxen-mvz-vietnam": "/images/blog/dmf-mfa-arztpraxis-blutentnahme-labor.jpg",
    "mutterschutz-elternzeit-drittstaaten-fachkraefte-aufenthg": "/images/blog/dmf-mutterschutz-elternzeit-beratung-personal.jpg",
    "entgeltfortzahlung-efzg-krankmeldung-eau-drittstaaten-heimaturlaub": "/images/blog/dmf-entgeltfortzahlung-attest-krankmeldung.jpg",
    "arbeitsunfall-berufsgenossenschaft-dguv-drittstaaten-sgb-vii": "/images/blog/dmf-arbeitsunfall-berufsgenossenschaft-schutz.jpg",
    "rueckzahlungsklauseln-vermittlungskosten-arbeitsvertrag-bag-rechtsprechung": "/images/blog/dmf-arbeitsvertrag-rueckzahlung-klausel-pruefung.jpg",
    "daueraufenthalt-eu-9a-aufenthg-niederlassungserlaubnis-vergleich": "/images/blog/dmf-daueraufenthalt-eu-niederlassung-pass.jpg",
    "feinwerkmechaniker-werkzeugmechaniker-formenbau-vietnam": "/images/blog/dmf-werkzeugmechaniker-feinwerkmechanik-formenbau.jpg",
    "brauer-maelzer-getraenketechnologie-drittstaaten-vietnam": "/images/blog/dmf-brauer-maelzer-getraenketechnik-brauerei.jpg",
    "schornsteinfeger-brandschutz-feuerungstechnik-drittstaaten-vietnam": "/images/blog/dmf-schornsteinfeger-brandschutz-feuerungsanlage.jpg",
    "fluggeraetmechaniker-luftfahrt-instandhaltung-easa-vietnam": "/images/blog/dmf-fluggeraetmechaniker-luftfahrt-wartung-hangar.jpg",
    "medizinische-technologen-labor-mtla-mtl-vietnam-anerkennung": "/images/blog/dmf-mtla-medizinische-technologen-labor-analyse.jpg",
    "medizinische-technologen-radiologie-mtra-mtr-vietnam-anerkennung": "/images/blog/dmf-mtra-radiologie-computertomographie-klinik.jpg",
    "augenoptiker-optometrie-fachgeschaefte-drittstaaten-vietnam": "/images/blog/dmf-augenoptiker-optometrie-brillen-refraktion.jpg",
    "betriebsrat-mitbestimmung-99-betrvg-einstellung-drittstaaten": "/images/blog/dmf-betriebsrat-mitbestimmung-99-betrvg-personal.jpg",
    "rentenbeitraege-erstattung-anspruch-210-sgb-vi-vietnam-drittstaaten": "/images/blog/dmf-rentenbeitraege-drv-erstattung-antrag.jpg",
    "zab-zeugnisbewertung-statement-of-comparability-anabin-leitfaden": "/images/blog/dmf-zab-zeugnisbewertung-statement-comparability.jpg",
    "sprachfoerderung-betrieb-qualifizierungschancengesetz-82-sgb-iii": "/images/blog/dmf-sprachfoerderung-qualifizierungschancengesetz-schulung.jpg",
    "statusfeststellungsverfahren-7a-sgb-iv-scheinselbststaendigkeit-drittstaaten": "/images/blog/dmf-statusfeststellung-scheinselbststaendigkeit-clearing.jpg",
}

def sync_posts():
    if not COMPILED_FILE.exists():
        print(f"Error: {COMPILED_FILE} not found. Run compile-drafts.py first.")
        return

    posts = json.load(open(COMPILED_FILE, encoding="utf-8"))
    print(f"Loaded {len(posts)} posts from {COMPILED_FILE}")

    # Generate published dates spaced across recent days/weeks
    base_time = datetime(2026, 10, 1, 10, 0, 0, tzinfo=timezone.utc)

    payload = []
    for i, p in enumerate(posts):
        # Stagger publication dates nicely so they look natural
        pub_time = base_time - timedelta(days=(len(posts) - 1 - i) * 2, hours=(i % 5) * 3)
        pub_iso = pub_time.isoformat()

        cover = POST_COVER_MAPPING.get(p["slug"], p.get("cover_image") or "/images/blog/dmf-klassenzimmer.jpg")

        post_record = {
            "title": p["title"],
            "slug": p["slug"],
            "excerpt": p.get("excerpt") or "",
            "content": p["content"],
            "cover_image": cover,
            "status": "published",
            "published_at": pub_iso,
            "author_id": AUTHOR_ID,
            "meta_title": p.get("meta_title") or p["title"],
            "meta_description": p.get("meta_description") or "",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        payload.append(post_record)

    url = f"{SUPABASE_URL}/rest/v1/posts?on_conflict=slug"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # Upsert in batches of 10 to ensure clean transmission
    batch_size = 10
    total_synced = 0
    for i in range(0, len(payload), batch_size):
        batch = payload[i:i + batch_size]
        data_bytes = json.dumps(batch, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, method="POST", headers=headers)
        try:
            with urllib.request.urlopen(req) as resp:
                total_synced += len(batch)
                print(f"Batch {i//batch_size + 1}: synced {len(batch)} posts (Status {resp.status})")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()
            print(f"HTTP Error {e.code} on batch {i}: {err_body}")
            raise e

    print(f"\nSUCCESS: Synced all {total_synced} posts to Supabase table 'posts' with status 'published'!")

    # Explicitly update pre-existing posts with dedicated photographic covers
    pre_existing_updates = [
        ("vorstellungsgespraech-azubis-vietnam-fragen", POST_COVER_MAPPING["vorstellungsgespraech-azubis-vietnam-fragen"]),
        ("vietnamesische-fachkraefte-verlaesslich-statt-riskant-wie-dmf-ausbildungsabbrueche-und-ausbeutung-verhindert", POST_COVER_MAPPING["vietnamesische-fachkraefte-verlaesslich-statt-riskant-wie-dmf-ausbildungsabbrueche-und-ausbeutung-verhindert"]),
        ("qualitaetssicherung-durch-sprache-wie-dmf-vietnam-ihre-zukuenftigen-fachkraefte-vorbereitet", POST_COVER_MAPPING["qualitaetssicherung-durch-sprache-wie-dmf-vietnam-ihre-zukuenftigen-fachkraefte-vorbereitet"])
    ]
    for pe_slug, pe_cover in pre_existing_updates:
        patch_url = f"{SUPABASE_URL}/rest/v1/posts?slug=eq.{pe_slug}"
        patch_payload = json.dumps({"cover_image": pe_cover, "status": "published"}).encode("utf-8")
        patch_headers = {
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }
        patch_req = urllib.request.Request(patch_url, data=patch_payload, method="PATCH", headers=patch_headers)
        with urllib.request.urlopen(patch_req) as p_resp:
            print(f"Updated pre-existing post [{pe_slug}] cover -> {pe_cover} (Status {p_resp.status})")

    # Verify query
    verify_url = f"{SUPABASE_URL}/rest/v1/posts?select=slug,title,status,cover_image,published_at&order=published_at.desc"
    verify_req = urllib.request.Request(verify_url, headers={
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}"
    })
    with urllib.request.urlopen(verify_req) as resp:
        online_posts = json.loads(resp.read().decode())
        print(f"\nTotal posts currently published in Supabase: {len(online_posts)}")
        svg_count = sum(1 for op in online_posts if (op.get("cover_image") or "").endswith(".svg"))
        none_count = sum(1 for op in online_posts if not op.get("cover_image"))
        jpg_count = sum(1 for op in online_posts if (op.get("cover_image") or "").endswith((".jpg", ".png", ".webp")))
        print(f"Audit: {jpg_count} Photographic Covers, {svg_count} SVGs, {none_count} None/Missing")
        for op in online_posts[:5]:
            print(f"  * {op['published_at'][:10]} | [{op['status']}] {op['slug']} -> {op.get('cover_image')}")

if __name__ == "__main__":
    sync_posts()
