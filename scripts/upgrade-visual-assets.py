#!/usr/bin/env python3
"""
DMF Talents — Comprehensive Visual Asset Upgrade Script
=======================================================
1. Fixes all 15 sideways (90-degree rotated) blog covers using EXIF transpose.
2. Replaces all 4 AI-generated fake images (with AI watermarks), 2 browser screenshots,
   and 1 Vietnamese Facebook banner overlay in public/images/blog/.
3. Eliminates all 5 exact binary duplicate pairs in public/images/blog/.
4. Replaces all 18 red-shirt BCIS high-school photos (Phase 9 & 10) and mismatched
   Uni Fair booth photos with unique, authentic DMF Academy, German Delegation,
   Achim Seminar, Native Teacher, Airport Departure, and Germany Arrival photos.
5. Generates high-resolution B2B static fallback & showcase images in:
   - public/images/home/
   - public/images/b2b/
   - public/images/candidates/
"""

import hashlib
from pathlib import Path
from PIL import Image, ImageOps

ROOT_DIR = Path("/Users/chong/dmf-talents.de")
BLOG_DIR = ROOT_DIR / "public" / "images" / "blog"
HOME_DIR = ROOT_DIR / "public" / "images" / "home"
B2B_DIR = ROOT_DIR / "public" / "images" / "b2b"
CAND_DIR = ROOT_DIR / "public" / "images" / "candidates"

TN_MKT = Path(
    "/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/"
    "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT"
)
MKT_4 = Path(
    "/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/"
    "Drive của tôi/4. Phòng Marketing"
)
SCRATCH_TT = Path(
    "/Users/chong/.gemini/antigravity/brain/"
    "c213b426-d7b4-4278-9730-ebae23d053c3/scratch/thien_tuan_jpgs"
)

FOLDERS = {
    "Achim": TN_MKT / "Achim",
    "CSVC": TN_MKT / "Cơ sở vật chất",
    "GiaoLuu": TN_MKT / "Đoàn Đức/Ảnh/Giao lưu lớp",
    "DD_15_07_2": TN_MKT / "Đoàn Đức/15 07.2",
    "DD_Canon": TN_MKT / "Đoàn Đức/Ảnh/13 07.4 - Canon",
    "DD_Fuji0": TN_MKT / "Đoàn Đức/Ảnh/13 07.0 - Fuji",
    "K27": TN_MKT / "Học viên/K27",
    "K14": TN_MKT / "K14",
    "K24": TN_MKT / "K24",
    "MayAnh": TN_MKT / "May anh ",
    "An_SanBay": TN_MKT / "Học viên phỏng vấn/An/Sân bay",
    "Profile": TN_MKT / "Profile",
    "Teacher": MKT_4 / "Hình ảnh MKT/DMF Teacher",
    "K50": MKT_4 / "Hình ảnh MKT/K50",
    "K32": MKT_4 / "Hình ảnh MKT/K32",
    "K35": MKT_4 / "Hình ảnh MKT/K35",
    "K49": MKT_4 / "Hình ảnh MKT/K49",
    "Khac": MKT_4 / "Hình ảnh MKT/Khác",
    "Duy": MKT_4 / "Hình ảnh MKT/Duy",
    "ThayKhang": MKT_4 / "Hình ảnh MKT/Thầy Khang",
    "ThayLoc": MKT_4 / "Hình ảnh MKT/Thầy Lộc",
    "ThienTuan": SCRATCH_TT,
}


def crop_and_save(
    src_path: Path,
    dst_path: Path,
    target_w: int = 1200,
    target_h: int = 675,
    y_anchor: float = 0.42,
    x_anchor: float = 0.50,
    quality: int = 88,
) -> None:
    if not src_path.exists():
        raise FileNotFoundError(f"Missing source file: {src_path}")

    with Image.open(src_path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        w, h = im.size
        target_ratio = target_w / target_h
        current_ratio = w / h

        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            max_left = w - new_w
            left = int(max_left * max(0.0, min(1.0, x_anchor)))
            im = im.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            max_top = h - new_h
            top = int(max_top * max(0.0, min(1.0, y_anchor)))
            im = im.crop((0, top, w, top + new_h))

        resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        resized.save(dst_path, "JPEG", quality=quality, optimize=True, progressive=True)


# ============================================================================
# 1. BLOG COVER REPLACEMENTS (Fixing rotated, AI, screenshots, duplicates, BCIS)
# Each entry maps: blog_filename -> (folder_key, source_filename, y_anchor)
# Every (folder_key, source_filename) is 100% unique!
# ============================================================================
BLOG_REPLACEMENTS = [
    # --- A. 15 Sideways / 90-degree rotated images ---
    ("dmf-achim-fuehrung-seminar.jpg", "Achim", "DSCF5449.JPG", 0.45),
    ("dmf-azubi-ankunft-deutschland.jpg", "ThienTuan", "IMG_5210.jpg", 0.42),
    ("dmf-azubi-einarbeitung-werkstatt.jpg", "K50", "DSCF8540.JPG", 0.45),
    ("dmf-azubi-leben-in-deutschland.jpg", "ThienTuan", "IMG_5219.jpg", 0.45),
    ("dmf-bau-handwerk-simulation.jpg", "Achim", "DSCF5479.JPG", 0.45),
    ("dmf-betreuung-unterlagen.jpg", "Duy", "DSCF8682.JPG", 0.45),
    ("dmf-campus-lehrsaal-modern.jpg", "CSVC", "DSCF5593.JPG", 0.50),
    ("dmf-fachbibliothek-unterricht.jpg", "CSVC", "DSCF5614.JPG", 0.50),
    ("dmf-it-arbeitsplaetze-schulung.jpg", "K50", "DSCF8592.JPG", 0.45),
    ("dmf-karriere-urkunde-erfolg.jpg", "DD_Canon", "2O0A0350.JPG", 0.45),
    ("dmf-lackier-ausbau-training.jpg", "ThayKhang", "DSCF7809.JPG", 0.45),
    ("dmf-leben-in-deutschland-freizeit.jpg", "ThienTuan", "IMG_5227.jpg", 0.35),
    ("dmf-lehrkraft-tafel.jpg", "Teacher", "DSCF6736.JPG", 0.40),
    ("dmf-sprachkurs-praxis-unterricht.jpg", "GiaoLuu", "IMG_5133.JPG", 0.45),
    ("dmf-wohnraum-azubi-unterkunft.jpg", "CSVC", "DSCF5603.JPG", 0.50),

    # --- B. 2 Browser Screenshots used as covers ---
    ("dmf-angebote-pruefung.jpg", "DD_15_07_2", "2O0A0490.JPG", 0.45),
    ("dmf-vorstellungsgespraech-online.jpg", "DD_15_07_2", "2O0A0496.JPG", 0.45),

    # --- C. 4 AI-Generated Fake Images with Watermarks ---
    ("dmf-arbeitgeber-kooperation-handwerk.jpg", "Achim", "DSCF5467.JPG", 0.45),
    ("dmf-gastronomie-hotellerie-service.jpg", "DD_Canon", "2O0A0362.JPG", 0.45),
    ("dmf-pflege-station-praxis.jpg", "DD_Fuji0", "DSCF9159.JPG", 0.45),
    ("dmf-talent-partnerschaft-deutschland-vietnam.jpg", "Achim", "DSCF5416.JPG", 0.45),

    # --- D. 1 Vietnamese Facebook Promotional Text Overlay ---
    ("dmf-ausreise-flughafen.jpg", "Duy", "DSCF8818.JPG", 0.45),

    # --- E. 5 Exact Binary Duplicate Pairs (replace both or second to ensure 100% distinctness) ---
    ("dmf-pflege-station-visite-team.jpg", "DD_Fuji0", "DSCF9263.JPG", 0.45),
    ("dmf-doppelbesteuerung-finanzamt-beratung.jpg", "Achim", "DSCF5431.JPG", 0.45),
    ("dmf-schulung-werkbank-montage.jpg", "K49", "DSCF8354.JPG", 0.45),
    ("dmf-finanzbuchhaltung-steuer-belege.jpg", "DD_15_07_2", "2O0A0485.JPG", 0.45),
    ("dmf-fleischer-metzger-lebensmittelhandwerk.jpg", "K27", "DSCF5978.JPG", 0.45),
    ("dmf-interkulturell-austausch-gruppe.jpg", "DD_Canon", "2O0A0332.JPG", 0.45),
    ("dmf-qualifikationsanalyse-werkstatt-test.jpg", "K27", "DSCF5980.JPG", 0.45),
    ("dmf-seminar-fachkraft-diskussion.jpg", "Achim", "DSCF5428.JPG", 0.45),

    # --- F. All 18 Red-Shirt BCIS High School Photos in Phase 9 & Phase 10 ---
    ("dmf-ostdeutschland-sachsen-thueringen-dresden.jpg", "Achim", "DSCF5437.JPG", 0.45),
    ("dmf-kosten-preise-honorarmodell-kalkulation.jpg", "Achim", "DSCF5446.JPG", 0.45),
    ("dmf-agentur-qualitaetskriterien-pruefung-audit.jpg", "Achim", "DSCF5458.JPG", 0.45),
    ("dmf-ausbildungsabbruch-risikoabsicherung-garantie.jpg", "Achim", "DSCF5471.JPG", 0.45),
    ("dmf-eigenrekrutierung-vs-agentur-analyse-vergleich.jpg", "Achim", "DSCF5482.JPG", 0.45),
    ("dmf-anerkennungspartnerschaft-praxis-erfahrungen.jpg", "Achim", "DSCF5485.JPG", 0.45),
    ("dmf-leitfaden-geschaeftsfuehrer-executive-strategie.jpg", "Achim", "DSCF5500.JPG", 0.45),
    ("dmf-mindestausbildungsverguetung-2027-sperrkonto-kalkulation.jpg", "DD_15_07_2", "2O0A0486.JPG", 0.45),
    ("dmf-blaue-karte-eu-2027-gehaltsgrenzen-akademiker.jpg", "DD_15_07_2", "2O0A0491.JPG", 0.45),
    ("dmf-ausbildungsstart-2027-rueckwaerts-zeitplan-planung.jpg", "DD_15_07_2", "2O0A0492.JPG", 0.45),
    ("dmf-auslandsportal-work-and-stay-agentur-digitalisierung.jpg", "DD_15_07_2", "2O0A0494.JPG", 0.45),
    ("dmf-laendervergleich-vietnam-indien-philippinen-rekrutierung.jpg", "DD_15_07_2", "2O0A0497.JPG", 0.45),
    ("dmf-tandem-kohorten-recruiting-team-einstellung.jpg", "DD_Canon", "2O0A0329.JPG", 0.45),
    ("dmf-babyboomer-rentenwelle-wissenstransfer-handwerk.jpg", "Teacher", "DSCF6711.JPG", 0.45),
    ("dmf-probezeit-management-ausbilder-meister-leitfaden.jpg", "Teacher", "DSCF6714.JPG", 0.45),
    ("dmf-berlin-brandenburg-gesundheit-industrie-fachkraefte.jpg", "Teacher", "DSCF6720.JPG", 0.45),
    ("dmf-hamburg-schleswig-holstein-hafen-pflege-gastronomie.jpg", "Teacher", "DSCF6723.JPG", 0.45),
    ("dmf-rheinland-pfalz-saarland-zfe-kaiserslautern-industrie.jpg", "Teacher", "DSCF6727.JPG", 0.45),
    ("dmf-mecklenburg-vorpommern-sachsen-anhalt-ostsee-industrie.jpg", "GiaoLuu", "IMG_5144.JPG", 0.45),

    # --- G. Mismatched / Repetitive Uni Fair Booth Photos (with Vietnamese banners/selfie frames) ---
    ("dmf-geruestbau-montage-hoehe.jpg", "K27", "DSCF5981.JPG", 0.45),
    ("dmf-zimmerer-holzbau-montage.jpg", "K27", "DSCF5982.JPG", 0.45),
    ("dmf-nrw-kliniken-pflege-krankenhaus-team.jpg", "DD_Fuji0", "DSCF9471.JPG", 0.45),
    ("dmf-bayern-mittelstand-industrie-fachkraefte.jpg", "DD_Fuji0", "DSCF9575.JPG", 0.45),
    ("dmf-arbeitsunfall-berufsgenossenschaft-schutz.jpg", "K27", "DSCF5983.JPG", 0.45),
    ("dmf-augenoptiker-optometrie-brillen-refraktion.jpg", "K27", "DSCF5984.JPG", 0.45),
    ("dmf-fluggeraetmechaniker-luftfahrt-wartung-hangar.jpg", "K27", "DSCF5985.JPG", 0.45),
    ("dmf-galabau-gartenbau-aussenanlage.jpg", "CSVC", "DSCF5599.JPG", 0.50),
    ("dmf-kaeltetechnik-klimaanlage-wartung.jpg", "K27", "DSCF5986.JPG", 0.45),
    ("dmf-krankenkasse-sozialversicherung-service.jpg", "CSVC", "DSCF5602.JPG", 0.50),
    ("dmf-mtla-medizinische-technologen-labor-analyse.jpg", "K27", "DSCF5988.JPG", 0.45),
    ("dmf-schreiner-tischler-fertigung.jpg", "K27", "DSCF5993.JPG", 0.45),
    ("dmf-verpflichtungserklaerung-buergschaft-vertrag.jpg", "An_SanBay", "DSCF5750.JPG", 0.45),
    ("dmf-minderjaehrige-azubis-betreuung.jpg", "GiaoLuu", "IMG_5125.JPG", 0.45),
    ("dmf-mutterschutz-elternzeit-beratung-personal.jpg", "GiaoLuu", "IMG_5126.JPG", 0.45),
    ("dmf-bankkonto-girokonto-beratung.jpg", "GiaoLuu", "IMG_5132.JPG", 0.45),
    ("dmf-bewerber-profil-pruefung.jpg", "GiaoLuu", "IMG_5135.JPG", 0.45),
    ("dmf-gleisbau-schienen-infrastruktur.jpg", "GiaoLuu", "IMG_5136.JPG", 0.45),
    ("dmf-rentenbeitraege-drv-erstattung-antrag.jpg", "GiaoLuu", "IMG_5138.JPG", 0.45),
    ("dmf-sprachpruefung-goethe-zertifikat.jpg", "GiaoLuu", "IMG_5140.JPG", 0.45),
    ("dmf-tiefbau-strassenbau-baustelle.jpg", "GiaoLuu", "IMG_5142.JPG", 0.45),
    ("dmf-zav-arbeitsagentur-beratung.jpg", "DD_Fuji0", "DSCF9783.JPG", 0.45),
    ("dmf-zfa-zahnarztpraxis-behandlung-stuhl.jpg", "DD_Fuji0", "DSCF9887.JPG", 0.45),
    ("dmf-landmaschinen-baumaschinen-werkstatt.jpg", "K32", "DSCF6424.JPG", 0.45),
    ("dmf-stapler-lagerlogistik-schulung.jpg", "K32", "DSCF6430.JPG", 0.45),
    ("dmf-werkzeugmechaniker-feinwerkmechanik-formenbau.jpg", "K32", "DSCF6436.JPG", 0.45),
    ("dmf-konstruktionsmechanik-stahlbau-halle.jpg", "K32", "DSCF6443.JPG", 0.45),
    ("dmf-karosserie-lackier-werkstatt.jpg", "K32", "DSCF6449.JPG", 0.45),
    ("dmf-zahntechnik-dentallabor-fraesen.jpg", "K32", "DSCF6455.JPG", 0.45),
    ("dmf-busfahrer-oepnv-linienbus-depot.jpg", "K32", "DSCF6461.JPG", 0.45),
    ("dmf-systemintegration-rechenzentrum-server.jpg", "K50", "DSCF8600.JPG", 0.45),
    ("dmf-mfa-arztpraxis-blutentnahme-labor.jpg", "K35", "DSCF6579.JPG", 0.45),
    ("dmf-mtra-radiologie-computertomographie-klinik.jpg", "K35", "DSCF6587.JPG", 0.45),
    ("dmf-brauer-maelzer-getraenketechnik-brauerei.jpg", "K35", "DSCF6595.JPG", 0.45),
    ("dmf-schornsteinfeger-brandschutz-feuerungsanlage.jpg", "K35", "DSCF6914.JPG", 0.45),
    ("dmf-dachdecker-solar-fassadenbau.jpg", "K35", "DSCF6925.JPG", 0.45),
    ("dmf-baden-wuerttemberg-maschinenbau-azubis.jpg", "K49", "DSCF8318.JPG", 0.45),
    ("dmf-hessen-rhein-main-it-logistik-frankfurt.jpg", "K49", "DSCF8330.JPG", 0.45),
    ("dmf-niedersachsen-bremen-handwerk-industrie.jpg", "K49", "DSCF8342.JPG", 0.45),
    ("dmf-daueraufenthalt-eu-niederlassung-pass.jpg", "An_SanBay", "DSCF5748.JPG", 0.45),
    ("dmf-urkundenpruefung-legalisation-botschaft.jpg", "An_SanBay", "DSCF5744.JPG", 0.45),
    ("dmf-zab-zeugnisbewertung-statement-comparability.jpg", "ThayLoc", "DSCF7623.JPG", 0.45),
    ("dmf-statusfeststellung-scheinselbststaendigkeit-clearing.jpg", "K14", "DSCF8292.JPG", 0.45),
    ("dmf-betriebsrat-mitbestimmung-99-betrvg-personal.jpg", "K24", "DSCF4938.JPG", 0.45),
    ("dmf-sprachfoerderung-qualifizierungschancengesetz-schulung.jpg", "K24", "DSCF4948.JPG", 0.45),
    ("dmf-einwohnermeldeamt-anmeldung-wohnung.jpg", "ThienTuan", "IMG_5229.jpg", 0.35),
    ("dmf-familiennachzug-wohnung-beratung.jpg", "CSVC", "DSCF5608.JPG", 0.50),
    ("dmf-entgeltfortzahlung-attest-krankmeldung.jpg", "ThayKhang", "DSCF7679.JPG", 0.45),
    ("dmf-arbeitsvertrag-rueckzahlung-klausel-pruefung.jpg", "K32", "DSCF6473.JPG", 0.45),
    ("dmf-arbeitszeiterfassung-stempeluhr-schicht.jpg", "ThayLoc", "DSCF7412.JPG", 0.45),
    ("dmf-gehaltsabrechnung-lohnpruefung-tabelle.jpg", "ThayLoc", "DSCF7448.JPG", 0.45),
    ("dmf-personalbuero-kuendigung-beratung.jpg", "Khac", "DSCF7239.JPG", 0.45),
    ("dmf-probezeit-gespraech-auswertung.jpg", "MayAnh", "DSCF0041.JPG", 0.45),
    ("dmf-duales-studium-hochschule-akademie.jpg", "K50", "DSCF8484.JPG", 0.45),
    ("dmf-fuehrerschein-verkehr-mobilitaet.jpg", "Duy", "DSCF8727.JPG", 0.45),
    ("dmf-defizitbescheid-weiterbildung-plan.jpg", "K14", "DSCF8259.JPG", 0.45),
    ("dmf-klinik-geburtshilfe-hebammen-team.jpg", "DD_Canon", "2O0A0326.JPG", 0.45),
    ("dmf-physiotherapie-reha-behandlung.jpg", "DD_Canon", "2O0A0335.JPG", 0.45),
    ("dmf-hotelfach-restaurant-service-training.jpg", "DD_Canon", "2O0A0359.JPG", 0.45),
    ("dmf-azubi-beratung-nebenjob-arbeitsvertrag.jpg", "MayAnh", "DSCF0033.JPG", 0.45),
]

# ============================================================================
# 2. HOMEPAGE STATIC FALLBACK ASSETS (public/images/home/)
# ============================================================================
HOME_ASSETS = [
    ("hero-bg.jpg", "Achim", "DSCF5419.JPG", 1920, 1080, 0.42),
    ("partner-banner.jpg", "Achim", "DSCF5449.JPG", 1600, 900, 0.45),
    ("about-academy.jpg", "DD_Canon", "2O0A0350.JPG", 1000, 1000, 0.45),
    ("prog-azubi.jpg", "Teacher", "DSCF6714.JPG", 1200, 675, 0.45),
    ("prog-skilled.jpg", "Achim", "DSCF5479.JPG", 1200, 675, 0.45),
    ("prog-seasonal.jpg", "DD_Canon", "2O0A0362.JPG", 1200, 675, 0.45),
]

# ============================================================================
# 3. B2B SUBPAGES & REFERENZEN VISUAL PROOF ASSETS (public/images/b2b/)
# ============================================================================
B2B_ASSETS = [
    # 4 Quality Gates
    ("gate-1-sprache.jpg", "Teacher", "DSCF6736.JPG", 1200, 675, 0.40),
    ("gate-2-fachlich.jpg", "K27", "DSCF5980.JPG", 1200, 675, 0.45),
    ("gate-3-workskills.jpg", "Achim", "DSCF5446.JPG", 1200, 675, 0.45),
    ("gate-4-kultur.jpg", "GiaoLuu", "IMG_5133.JPG", 1200, 675, 0.45),
    # 7-Tage Settling-in Kit & Arrival Proof
    ("settlement-1-flughafen.jpg", "Duy", "DSCF8838.JPG", 1200, 675, 0.45),
    ("settlement-2-ankunft.jpg", "ThienTuan", "IMG_5219.jpg", 1200, 675, 0.45),
    ("settlement-3-wohnung.jpg", "ThienTuan", "IMG_5229.jpg", 1200, 675, 0.35),
    ("settlement-4-alltag.jpg", "ThienTuan", "IMG_5210.jpg", 1200, 675, 0.42),
    # Subpage Hero & Showcase Visuals
    ("hero-ausbildung.jpg", "DD_Fuji0", "DSCF9471.JPG", 1200, 800, 0.45),
    ("hero-skilled.jpg", "DD_15_07_2", "2O0A0490.JPG", 1200, 800, 0.45),
    ("hero-studium.jpg", "CSVC", "DSCF5593.JPG", 1200, 800, 0.50),
    ("hero-seasonal.jpg", "DD_Canon", "2O0A0329.JPG", 1200, 800, 0.45),
    ("referenzen-delegation.jpg", "DD_Canon", "2O0A0332.JPG", 1200, 675, 0.45),
    ("referenzen-campus.jpg", "CSVC", "DSCF5603.JPG", 1200, 675, 0.50),
    ("referenzen-classroom.jpg", "K50", "DSCF8492.JPG", 1200, 675, 0.45),
]

# ============================================================================
# 4. CANDIDATE STUDIO PORTRAITS (public/images/candidates/)
# ============================================================================
CANDIDATE_PORTRAITS = [
    ("candidate-1.jpg", "Profile", "DSCF2837.JPG", 400, 400, 0.22),
    ("candidate-2.jpg", "Profile", "DSCF2864.JPG", 400, 400, 0.22),
    ("candidate-3.jpg", "Profile", "DSCF2877.JPG", 400, 400, 0.22),
    ("candidate-4.jpg", "Profile", "DSCF2911.JPG", 400, 400, 0.22),
    ("candidate-5.jpg", "Profile", "DSCF2935.JPG", 400, 400, 0.22),
    ("candidate-6.jpg", "Profile", "DSCF2983.JPG", 400, 400, 0.22),
]


def main() -> None:
    # Verify no duplicate source files in BLOG_REPLACEMENTS
    seen_sources = set()
    for out_name, folder_key, src_file, _ in BLOG_REPLACEMENTS:
        key = (folder_key, src_file)
        if key in seen_sources:
            raise ValueError(f"Duplicate source {key} for {out_name}")
        seen_sources.add(key)

    print(f"▶ Processing {len(BLOG_REPLACEMENTS)} blog cover upgrades...")
    for out_name, folder_key, src_file, y_anchor in BLOG_REPLACEMENTS:
        src_path = FOLDERS[folder_key] / src_file
        dst_path = BLOG_DIR / out_name
        crop_and_save(src_path, dst_path, 1200, 675, y_anchor=y_anchor)

    print(f"▶ Processing {len(HOME_ASSETS)} homepage fallback assets...")
    for out_name, folder_key, src_file, w, h, y_anchor in HOME_ASSETS:
        src_path = FOLDERS[folder_key] / src_file
        dst_path = HOME_DIR / out_name
        crop_and_save(src_path, dst_path, w, h, y_anchor=y_anchor)

    print(f"▶ Processing {len(B2B_ASSETS)} B2B subpage & Referenzen proof assets...")
    for out_name, folder_key, src_file, w, h, y_anchor in B2B_ASSETS:
        src_path = FOLDERS[folder_key] / src_file
        dst_path = B2B_DIR / out_name
        crop_and_save(src_path, dst_path, w, h, y_anchor=y_anchor)

    print(f"▶ Processing {len(CANDIDATE_PORTRAITS)} studio candidate portraits...")
    for out_name, folder_key, src_file, w, h, y_anchor in CANDIDATE_PORTRAITS:
        src_path = FOLDERS[folder_key] / src_file
        dst_path = CAND_DIR / out_name
        crop_and_save(src_path, dst_path, w, h, y_anchor=y_anchor)

    # Final Verification of all 135 Blog JPGs
    blog_jpgs = sorted(BLOG_DIR.glob("*.jpg"))
    hashes = {}
    bad_dims = []
    for p in blog_jpgs:
        h = hashlib.md5(p.read_bytes()).hexdigest()
        hashes.setdefault(h, []).append(p.name)
        with Image.open(p) as im:
            if im.size != (1200, 675):
                bad_dims.append((p.name, im.size))

    dups = {h: names for h, names in hashes.items() if len(names) > 1}
    print("\n============================================================")
    print(f"✓ Blog JPGs verified     : {len(blog_jpgs)} files")
    print(f"✓ Unique binary hashes   : {len(hashes)} / {len(blog_jpgs)} (Duplicates: {len(dups)})")
    print(f"✓ Dimension mismatches   : {len(bad_dims)}")
    print(f"✓ Homepage assets saved  : {len(list(HOME_DIR.glob('*.jpg')))} in public/images/home/")
    print(f"✓ B2B proof assets saved : {len(list(B2B_DIR.glob('*.jpg')))} in public/images/b2b/")
    print(f"✓ Candidate avatars saved: {len(list(CAND_DIR.glob('*.jpg')))} in public/images/candidates/")
    print("============================================================")
    if dups:
        print("Remaining duplicates:", dups)


if __name__ == "__main__":
    main()
