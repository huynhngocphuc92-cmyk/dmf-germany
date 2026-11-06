#!/usr/bin/env python3
"""
Builds the complete 146-post visual manifest for DMF Talents (/blog):
- 18 Authentic Inside-DMF & Case Study covers (100% distinct real DMF photos, zero burst overlap)
- 128 Bespoke Editorial B2B covers rendered via Codex GPT Image (1536x1024 -> 1200x675 JPEG)
"""

import json
from pathlib import Path

ROOT = Path("/Users/chong/dmf-talents.de")

# 18 Inside-DMF & Authentic Case Study covers (kept as real DMF photography)
AUTHENTIC_DMF_COVERS = {
    "dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt.jpg",
    "dmf-gemeinschaft-kultur-integration-campus-leben-vietnam.jpg",
    "dmf-fallstudie-hotellerie-zfa-thien-tuan-hoang-dung-erfolgsgeschichten.jpg",
    "dmf-fallstudie-industrie-handwerk-hoang-duy-ausbildung-meppen.jpg",
    "dmf-ankunft-onboarding-deutschland-30-tage-begleitung.jpg",
    "dmf-pflegeausbildung-vorbereitung-vietnam-sprachkompetenz-empathie.jpg",
    "dmf-praxisvorbereitung-gastronomie-hotellerie-bcis-vietnam.jpg",
    "dmf-quality-gate-entscheidungsfaehige-kandidatenprofile-video.jpg",
    "dmf-direkte-vertretung-deutschland-umit-elezov-arbeitgeberbetreuung.jpg",
    "dmf-interview-coaching-achim-betticher-vorbereitung-vietnam.jpg",
    "dmf-deutschunterricht-intensivkurs-a1-b2-akademie-vietnam.jpg",
    "dmf-vietnam-unternehmensprofil-ausbildungsakademie-deutschland.jpg",
    "dmf-achim-interview-coaching.jpg",
    "dmf-unterricht-materialien.jpg",
    "dmf-sprachuebung-tablet.jpg",
    "dmf-klassenzimmer.jpg",
    "dmf-ausreise-flughafen.jpg",
    "dmf-sprachkurs-praxis-unterricht.jpg",
}

# 128 Bespoke GPT Image Prompts (each tailored to the exact German B2B article topic)
GPT_IMAGE_PROMPTS = {
    # --- ALREADY RENDERED IN DEMO (3) ---
    "dmf-fluggeraetmechaniker-luftfahrt-wartung-hangar.jpg": (
        "A modern German aircraft maintenance hangar where a young Vietnamese aviation mechanic "
        "in clean dark-blue workwear inspects an open turbofan jet engine alongside a senior German lead engineer"
    ),
    "dmf-geruestbau-montage-hoehe.jpg": (
        "A young Vietnamese scaffolding specialist (Gerüstbauer) in professional German PPE safety harness "
        "and white hard hat assembling steel facade scaffolding on a modern German commercial building alongside a German Bauleiter"
    ),
    "dmf-augenoptiker-optometrie-brillen-refraktion.jpg": (
        "A young Vietnamese optician (Augenoptiker) in a bright, modern German optical studio operating "
        "a digital phoropter eye refraction unit with a senior German master optician and a customer"
    ),

    # --- REGIONAL BUNDESLÄNDER GUIDES (10) ---
    "dmf-mecklenburg-vorpommern-sachsen-anhalt-ostsee-industrie.jpg": (
        "Wide angle view of a modern Baltic Sea maritime port and offshore wind turbine assembly yard in Rostock, Germany, "
        "where a Vietnamese industrial technician and a German operations manager in high-vis jackets review blueprints by the harbor cranes"
    ),
    "dmf-rheinland-pfalz-saarland-zfe-kaiserslautern-industrie.jpg": (
        "A modern chemical and pharmaceutical process engineering plant in Ludwigshafen / Rheinland-Pfalz, Germany, "
        "with stainless steel piping and control gauges, where a Vietnamese process technician and a German plant engineer inspect a digital tablet"
    ),
    "dmf-hamburg-schleswig-holstein-hafen-pflege-gastronomie.jpg": (
        "Overlooking the Port of Hamburg container terminals and Elbe river at golden hour, a Vietnamese logistics specialist "
        "and a German shipping dispatcher in smart business-casual attire discuss supply chain schedules on a balcony"
    ),
    "dmf-berlin-brandenburg-gesundheit-industrie-fachkraefte.jpg": (
        "A sunlit modern innovation campus and hospital complex in Berlin-Brandenburg with contemporary glass architecture, "
        "where a Vietnamese healthcare professional and a German clinic director walk together across the courtyard"
    ),
    "dmf-ostdeutschland-sachsen-thueringen-dresden.jpg": (
        "Inside a high-tech Silicon Saxony semiconductor and microelectronics cleanroom facility in Dresden, Germany, "
        "a Vietnamese mechatronics technician and a German engineer inspect precision wafer automation equipment through glass"
    ),
    "dmf-niedersachsen-bremen-handwerk-industrie.jpg": (
        "An automated automotive and wind-energy manufacturing hall in Lower Saxony (Niedersachsen), Germany, "
        "with yellow industrial robotics arms in the background, where a Vietnamese skilled worker and a German Meister calibrate a sensor"
    ),
    "dmf-hessen-rhein-main-it-logistik-frankfurt.jpg": (
        "With the Frankfurt am Main skyline visible through floor-to-ceiling windows, a Vietnamese IT systems engineer "
        "and a German technology director review network architecture on a large ultrawide monitor in a modern Rhein-Main office"
    ),
    "dmf-nrw-kliniken-pflege-krankenhaus-team.jpg": (
        "At the nurses station of a modern university hospital in North Rhine-Westphalia (NRW), Germany, "
        "two Vietnamese registered nurses in clean medical scrubs collaborate with a German senior physician over digital patient charts"
    ),
    "dmf-baden-wuerttemberg-maschinenbau-azubis.jpg": (
        "Inside a flagship precision mechanical engineering (Maschinenbau) factory in Stuttgart / Baden-Württemberg, "
        "a Vietnamese apprentice and a German industrial master examine a freshly milled stainless-steel gear component with a micrometer"
    ),
    "dmf-bayern-mittelstand-industrie-fachkraefte.jpg": (
        "At a prosperous Bavarian Mittelstand manufacturing headquarters with subtle Alpine foothills in the distance, "
        "a Vietnamese engineering specialist and a German Geschäftsführer shake hands in front of a modern glass factory entrance"
    ),

    # --- HEALTHCARE, MEDICAL, DENTAL & CARE PROFESSIONS (14) ---
    "dmf-mtra-radiologie-computertomographie-klinik.jpg": (
        "In a modern German hospital radiology control room, a Vietnamese radiology technologist (MTRA) "
        "analyzes high-resolution 3D CT scanner cross-sections on dual medical monitors while looking through lead glass at a modern CT gantry"
    ),
    "dmf-mtla-medizinische-technologen-labor-analyse.jpg": (
        "In a bright, sterile German clinical diagnostics laboratory, a Vietnamese medical laboratory technologist (MTLA) "
        "in lab coat and nitrile gloves operates an automated hematology analyzer and multichannel pipette beside a German lab supervisor"
    ),
    "dmf-mfa-arztpraxis-blutentnahme-labor.jpg": (
        "In a friendly, contemporary German medical care center (MVZ Arztpraxis), a Vietnamese medical assistant (MFA) "
        "in crisp white clinic attire prepares an ECG and blood pressure check for an elderly German patient"
    ),
    "dmf-zfa-zahnarztpraxis-behandlung-stuhl.jpg": (
        "Inside a high-end German dental clinic (Zahnarztpraxis), a Vietnamese dental assistant (ZFA) "
        "assists a German dentist chairside using an intraoral 3D scanner and surgical suction unit under bright LED treatment lights"
    ),
    "dmf-zahntechnik-dentallabor-fraesen.jpg": (
        "In a modern German dental laboratory (Dentallabor), a Vietnamese dental technician (Zahntechniker) "
        "inspects a ceramic zirconia crown bridge beside a 5-axis CAD/CAM dental milling machine and 3D design screen"
    ),
    "dmf-physiotherapie-reha-behandlung.jpg": (
        "In a sunlit German rehabilitation and physiotherapy clinic, a Vietnamese physiotherapist "
        "guides a German patient through shoulder mobility and resistance exercises alongside parallel bars and therapy equipment"
    ),
    "dmf-klinik-geburtshilfe-hebammen-team.jpg": (
        "In a warm, modern German hospital maternity ward (Kreißsaal / Geburtshilfe), a compassionate Vietnamese midwife (Hebamme) "
        "and a German senior midwife check a cardiotocography (CTG) monitor in a comforting birthing room"
    ),
    "dmf-pflege-station-visite-team.jpg": (
        "During morning ward rounds in a modern German hospital corridor, a Vietnamese nursing assistant advancing to registered nurse "
        "walks with a German ward manager (Stationsleitung) reviewing a tablet computer"
    ),
    "dmf-azubi-ankunft-deutschland.jpg": (
        "In a welcoming German senior care facility garden terrace, a young Vietnamese nursing assistant (Krankenpflegehelfer) "
        "in medical scrubs warmly assists a smiling elderly German resident in a wheelchair"
    ),
    "dmf-unterricht-interaktiv.jpg": (
        "Inside a bright, colorful German kindergarten (Kita) playroom with wooden Montessori toys, "
        "a qualified Vietnamese early childhood educator (Erzieherin) builds wooden blocks at a low table with happy German children"
    ),
    "dmf-medizin-simulation-saal.jpg": (
        "Inside a sterile German hospital operating theater (OP-Saal), a Vietnamese surgical technologist (OTA) "
        "in green surgical scrubs gown and cap arranges sterile stainless-steel surgical instruments on a Mayo stand beside an anesthesia monitor"
    ),
    "dmf-klinik-partner-audit.jpg": (
        "In a modern German hospital boardroom, a German nursing director (Pflegedienstleitung) and a Vietnamese healthcare coordinator "
        "review quality certification documents with a green seal of approval on the table"
    ),
    "dmf-pflege-station-praxis.jpg": (
        "In a bright German hospital patient room, a skilled Vietnamese nurse checks an intravenous infusion pump "
        "and communicates empathetically in German with a recovering patient while a colleague takes notes"
    ),

    # --- INDUSTRY, CONSTRUCTION, CRAFTS & ENGINEERING (23 remaining) ---
    "dmf-schornsteinfeger-brandschutz-feuerungsanlage.jpg": (
        "In a clean German residential utility room, a Vietnamese chimney sweep and fire-safety technician (Schornsteinfeger) "
        "in black workwear uses a digital flue-gas analyzer probe on a modern condensing heating system with a German Bezirksschornsteinfeger"
    ),
    "dmf-werkzeugmechaniker-feinwerkmechanik-formenbau.jpg": (
        "In a German precision toolmaking and injection-mold workshop (Formenbau), a Vietnamese toolmaker (Werkzeugmechaniker) "
        "inspects a mirror-polished steel injection mold under a stereomicroscope next to a wire EDM machine"
    ),
    "dmf-galabau-gartenbau-aussenanlage.jpg": (
        "On a modern German urban landscaping project (Garten- und Landschaftsbau), a Vietnamese landscaper "
        "in outdoor workwear lays natural stone paving blocks and checks a laser level alongside a German landscape foreman"
    ),
    "dmf-kaeltetechnik-klimaanlage-wartung.jpg": (
        "On the rooftop of a German commercial building, a Vietnamese refrigeration and HVAC mechatronics technician (Mechatroniker für Kältetechnik) "
        "connects digital manifold pressure gauges to a large commercial heat pump and chiller unit"
    ),
    "dmf-konstruktionsmechanik-stahlbau-halle.jpg": (
        "Inside a heavy structural steel fabrication hall (Stahlbau) in Germany with overhead bridge cranes, "
        "a Vietnamese structural mechanic (Konstruktionsmechaniker) in welding helmet checks massive steel I-beam trusses with a German welding engineer"
    ),
    "dmf-karosserie-lackier-werkstatt.jpg": (
        "Inside a modern German automotive body and paint repair shop (Karosserie- und Fahrzeugbau), "
        "a Vietnamese body technician aligns an aluminum car fender frame using a digital laser measuring system beside a glass spray booth"
    ),
    "dmf-gleisbau-schienen-infrastruktur.jpg": (
        "Along a German railway track construction site (Gleisbau) with a yellow rail tamping machine in the background, "
        "a Vietnamese track construction worker in orange high-visibility PSA gear and hard hat inspects rail fasteners with a German site supervisor"
    ),
    "dmf-tiefbau-strassenbau-baustelle.jpg": (
        "At a German civil engineering and district-heating pipeline trench site (Tiefbau & Straßenbau), "
        "a Vietnamese civil construction specialist and a German Polier check a Theodolite surveyor level beside insulated underground pipes and an excavator"
    ),
    "dmf-schreiner-tischler-fertigung.jpg": (
        "In a bright German joinery and cabinetry workshop (Tischlerei / Schreinerei) filled with oak timber, "
        "a Vietnamese carpenter (Tischler) operates a modern format sliding table saw and checks a custom wooden cabinet with a German master carpenter"
    ),
    "dmf-zimmerer-holzbau-montage.jpg": (
        "Inside a large German timber-frame construction hall (Holzbau / Zimmerei), a Vietnamese timber framer (Zimmerer) "
        "in traditional corduroy carpenter trousers and ear protection measures a massive laminated spruce roof beam with a German Zimmerermeister"
    ),
    "dmf-landmaschinen-baumaschinen-werkstatt.jpg": (
        "In a spacious German agricultural and construction machinery service center, a Vietnamese heavy-equipment mechatronics technician "
        "connects a diagnostic rugged laptop to the hydraulic valve block of a large green tractor and wheel loader"
    ),
    "dmf-dachdecker-solar-fassadenbau.jpg": (
        "On a pitched clay-tile roof in Germany under a clear sky, a Vietnamese roofer and solar installer (Dachdecker) "
        "in safety harness mounts monocrystalline photovoltaic solar panels onto aluminum roof rails with a German colleague"
    ),
    "dmf-lehrkraft-tafel.jpg": (
        "In a German industrial automation factory, a Vietnamese industrial electrician (Elektroniker für Betriebstechnik) "
        "uses a Fluke multimeter to test PLC control relays inside a large open industrial switchgear cabinet (Schaltschrank)"
    ),
    "dmf-azubi-erfolgreiche-ausreise.jpg": (
        "In a clean German mechanical production plant, a Vietnamese industrial mechanic (Industriemechaniker) "
        "performs preventive maintenance on a hydraulic press and pneumatic actuator system alongside a German maintenance lead"
    ),
    "dmf-seminar-fachkraft-diskussion.jpg": (
        "In a modern German residential building utility room, a Vietnamese HVAC plumber (Anlagenmechaniker SHK) "
        "installs insulated copper piping and a hydronic manifold for an air-to-water heat pump (Wärmepumpe)"
    ),
    "dmf-lackier-ausbau-training.jpg": (
        "Inside a newly renovated German commercial office interior, a Vietnamese painter and drywall finisher (Maler und Lackierer) "
        "in clean white painter overalls applies smooth acoustic plaster and checks surface quality with a raking light"
    ),
    "dmf-bau-handwerk-simulation.jpg": (
        "On a modern German reinforced-concrete construction site (Hochbau), a Vietnamese mason and concrete builder (Maurer & Betonbauer) "
        "in hard hat and high-vis vest checks steel rebar formwork and plumb alignment with a German site foreman"
    ),
    "dmf-kfz-diagnose-labor.jpg": (
        "In a modern German electric vehicle service bay, a Vietnamese automotive mechatronics technician (Kfz-Mechatroniker) "
        "in insulated high-voltage safety gloves inspects an orange EV high-voltage battery pack and diagnostic terminal on a vehicle lift"
    ),
    "dmf-solar-elektro-schulung.jpg": (
        "On a commercial flat roof solar park in Germany, a Vietnamese photovoltaic technician (Solarteur) "
        "wires a three-phase solar string inverter and checks DC voltage readings with a German electrical master"
    ),
    "dmf-azubi-einarbeitung-werkstatt.jpg": (
        "At a 5-axis CNC machining center (Zerspanungsmechaniker) in a German precision factory, a Vietnamese CNC machinist "
        "reviews G-code toolpaths on the Siemens Sinumerik control panel while holding a precision turned metal shaft"
    ),
    "dmf-arbeitgeber-kooperation-handwerk.jpg": (
        "In a German metal fabrication workshop, a certified Vietnamese TIG/MAG welder (Schweißer) "
        "lifts his auto-darkening welding helmet to inspect a clean stainless-steel weld seam alongside a German welding supervisor (Schweißaufsicht)"
    ),
    "dmf-talent-partnerschaft-deutschland-vietnam.jpg": (
        "In a modern German mechatronics training workshop, a Vietnamese electronics and mechatronics technician "
        "tests an automated pneumatic sorting conveyor line alongside a German Ausbilder"
    ),

    # --- GASTRONOMY, HOSPITALITY & FOOD TRADES (6) ---
    "dmf-brauer-maelzer-getraenketechnik-brauerei.jpg": (
        "Inside a traditional yet modern German brewery brewhouse (Sudhaus) with gleaming copper and stainless-steel mash tuns, "
        "a Vietnamese brewer and maltster (Brauer und Mälzer) checks wort gravity in a glass cylinder with a German Braumeister"
    ),
    "dmf-hotelfach-restaurant-service-training.jpg": (
        "At the marble reception desk of a 4-star boutique hotel in Germany, a professionally dressed Vietnamese hospitality specialist (Hotelfachfrau) "
        "warmly welcomes a business traveler with a keycard while a German hotel manager smiles nearby"
    ),
    "dmf-fleischer-metzger-lebensmittelhandwerk.jpg": (
        "In a spotless, modern German artisan butcher and food-processing facility (Fleischerei), a Vietnamese food technologist and butcher "
        "in hygienic white coat and hairnet inspects premium cuts and digital temperature logs with a German Fleischermeister"
    ),
    "dmf-sprachpraxis-dialog-training.jpg": (
        "On the stainless-steel pass of a busy upscale German restaurant kitchen, a Vietnamese chef (Koch) "
        "in crisp white chef jacket plates a refined contemporary dish under warm pass lights alongside a German head chef (Küchenchef)"
    ),
    "dmf-praxis-uebung-labor.jpg": (
        "In a warm German artisan bakery (Backstube) at dawn, a Vietnamese baker and pastry chef (Bäcker & Konditor) "
        "in bakery whites pulls golden crusty sourdough loaves from a deck oven alongside a German Bäckermeister"
    ),
    "dmf-gastronomie-hotellerie-service.jpg": (
        "In an elegant German fine-dining restaurant dining room, a poised Vietnamese restaurant professional (Restaurantfachmann) "
        "in vest and apron arranges crystal wine glasses and fine table settings before evening service"
    ),

    # --- IT, LOGISTICS, BUS/TRANSPORT & DUALES STUDIUM (7) ---
    "dmf-systemintegration-rechenzentrum-server.jpg": (
        "Inside a modern German enterprise data center server aisle with blue LED rack indicators, a Vietnamese IT systems integration specialist "
        "(Fachinformatiker Systemintegration) patches fiber-optic network cables while holding a diagnostic laptop"
    ),
    "dmf-busfahrer-oepnv-linienbus-depot.jpg": (
        "At a modern German municipal public-transit bus depot (ÖPNV Betriebshof), a Vietnamese professional bus driver "
        "in neat transit uniform stands beside the open front door of a modern electric city bus holding a digital route tablet"
    ),
    "dmf-stapler-lagerlogistik-schulung.jpg": (
        "Inside a high-ceiling German logistics distribution center (Hochregallager), a Vietnamese warehouse operator "
        "in high-vis vest safely operates an electric reach-truck forklift (Gabelstapler) scanning pallet barcodes"
    ),
    "dmf-duales-studium-hochschule-akademie.jpg": (
        "In a modern German University of Applied Sciences (Hochschule) robotics and engineering lab, a Vietnamese dual-study student "
        "(Duales Studium) collaborates with a German professor and corporate mentor over a 3D CAD prototype"
    ),
    "dmf-fuehrerschein-verkehr-mobilitaet.jpg": (
        "At a German commercial driving academy yard, a Vietnamese professional driver holds a German EU card driving license "
        "while standing beside a modern German delivery van and a German driving instructor (Fahrlehrer)"
    ),
    "dmf-logistik-arbeitsplatz-training.jpg": (
        "At the loading dock of a modern German freight and logistics hub, a Vietnamese warehouse logistics specialist (Fachkraft für Lagerlogistik) "
        "and a German dispatcher verify digital shipping manifests with a handheld scanner next to a heavy-duty truck"
    ),
    "dmf-it-arbeitsplaetze-schulung.jpg": (
        "In a bright German software engineering studio, a Vietnamese full-stack software developer (IT-Spezialist) "
        "and a German tech lead pair-program at a standing desk with dual monitors showing clean architecture diagrams and code"
    ),

    # --- VISA, IMMIGRATION LAW, ANERKENNUNG & AUTHORITIES (19) ---
    "dmf-auslandsportal-work-and-stay-agentur-digitalisierung.jpg": (
        "In a modern German HR office, an HR manager reviews a sleek digital visa application dashboard on a laptop screen "
        "showing a green progress bar and digital document verification alongside a passport and coffee cup"
    ),
    "dmf-anerkennungspartnerschaft-praxis-erfahrungen.jpg": (
        "In a German industrial workshop office, a German employer and a newly arrived Vietnamese skilled worker "
        "review a structured 12-month recognition training plan binder together while smiling"
    ),
    "dmf-zab-zeugnisbewertung-statement-comparability.jpg": (
        "A close-up editorial shot on an oak executive desk in Germany where a German HR specialist and a Vietnamese engineer "
        "examine an official university degree certificate alongside a German Statement of Comparability dossier"
    ),
    "dmf-daueraufenthalt-eu-niederlassung-pass.jpg": (
        "In a bright German corporate office, a long-term Vietnamese specialist smiles while holding a German electronic residence permit card "
        "(Aufenthaltstitel / Niederlassungserlaubnis) during a congratulatory meeting with her German HR director"
    ),
    "dmf-qualifikationsanalyse-werkstatt-test.jpg": (
        "In a German Chamber of Crafts (Handwerkskammer) testing workshop, a Vietnamese craftsman demonstrates practical metalworking skills "
        "at a workbench while two senior German chamber examiners observe with clipboards"
    ),
    "dmf-defizitbescheid-weiterbildung-plan.jpg": (
        "In a German hospital training room, a German clinical educator and a Vietnamese nurse sit at a table "
        "mapping out practical adaptation modules on a structured qualification timeline chart"
    ),
    "dmf-zav-arbeitsagentur-beratung.jpg": (
        "In a modern German administrative office, a recruitment compliance specialist stamps and reviews an official fast-track "
        "pre-approval document folder next to a laptop and a desk calendar"
    ),
    "dmf-urkundenpruefung-legalisation-botschaft.jpg": (
        "A crisp overhead editorial composition on a wooden desk showing official notarized academic transcripts with red wax/embossed seals, "
        "certified German translations, a fountain pen, and a legal verification checklist"
    ),
    "dmf-verpflichtungserklaerung-buergschaft-vertrag.jpg": (
        "In a German company boardroom, a managing director (Geschäftsführer) and a legal advisor review a formal sponsorship "
        "and financial guarantee contract with a calculator and fountain pen on the conference table"
    ),
    "dmf-sprachpruefung-goethe-zertifikat.jpg": (
        "In a modern language examination center, a confident young Vietnamese candidate holds an official B2 German language certificate "
        "portfolio while shaking hands with an examiner in front of glass office walls"
    ),
    "dmf-praesentation-bildung-arbeitsmarkt.jpg": (
        "In a modern German company office, a Vietnamese professional transitioning from a job-search visa to permanent employment "
        "signs a permanent German employment contract (Festanstellung) with a smiling German HR manager"
    ),
    "dmf-schulung-werkbank-montage.jpg": (
        "In a German technical company, an experienced Vietnamese specialist with several years of vocational track record "
        "demonstrates advanced equipment setup to a German department head"
    ),
    "dmf-akademie-abschlussfeier-urkunde.jpg": (
        "On the first day at a German company, a German HR manager welcomes a Vietnamese talent with a welcome folder "
        "and workplace badge while showing the training schedule for parallel qualification recognition"
    ),
    "dmf-azubi-abschluss-zertifikat.jpg": (
        "A proud Vietnamese skilled professional in smart business attire stands in a modern German city business district "
        "holding a portfolio folder, symbolizing long-term settlement and career permanence in Germany"
    ),
    "dmf-campus-lehrsaal-modern.jpg": (
        "At a German company's apprentice training center, a German training manager checks a complete § 16a vocational training visa dossier "
        "and IHK training contract on a desk beside a laptop"
    ),
    "dmf-bewerber-profil-pruefung.jpg": (
        "In a German HR strategy meeting, two HR executives evaluate candidate qualification scorecards and points criteria "
        "on a tablet and printed dossier at a bright conference table"
    ),
    "dmf-fachsprache-lehrkraft.jpg": (
        "A side-by-side comparison desk scene in a German HR office where a specialist compares translated Vietnamese vocational transcripts "
        "with a German Chamber (IHK/HWK) reference curriculum on a dual-screen workstation"
    ),
    "dmf-delegation-besuch-akademie.jpg": (
        "In a modern German Ausländerbehörde / corporate compliance office, a coordinator tracks a fast-track § 81a timeline "
        "on a widescreen monitor while speaking with an employer on a headset"
    ),

    # --- LABOR LAW, HR COMPLIANCE & OCCUPATIONAL SAFETY (15) ---
    "dmf-probezeit-management-ausbilder-meister-leitfaden.jpg": (
        "In a bright glass-walled office inside a German production facility, a German Meister conducts a constructive 3-month "
        "probation feedback conversation (Probezeitgespräch) with a young Vietnamese apprentice over coffee and a checklist"
    ),
    "dmf-statusfeststellung-scheinselbststaendigkeit-clearing.jpg": (
        "In a German tax and labor-law advisory office, two legal compliance professionals review social security status classification "
        "contracts and organizational charts on a sleek conference table"
    ),
    "dmf-betriebsrat-mitbestimmung-99-betrvg-personal.jpg": (
        "In a modern German works council (Betriebsrat) meeting room, three committee members and an HR director review a new international "
        "hiring proposal dossier (§ 99 BetrVG) around a sunlit oval table"
    ),
    "dmf-arbeitsvertrag-rueckzahlung-klausel-pruefung.jpg": (
        "Close-up editorial photograph in a German law office where a labor lawyer highlights a paragraph in a German employment contract "
        "with a silver fountain pen beside a German Civil Code (BGB) volume"
    ),
    "dmf-arbeitsunfall-berufsgenossenschaft-schutz.jpg": (
        "On a clean German factory floor, a safety officer (Sicherheitsbeauftragter) and a Vietnamese worker in high-vis PPE and safety glasses "
        "inspect a green first-aid station and DGUV workplace safety signage"
    ),
    "dmf-entgeltfortzahlung-attest-krankmeldung.jpg": (
        "In a German HR payroll office, an HR specialist checks a digital electronic sick-leave notification (eAU) interface "
        "on a computer monitor alongside a payroll calendar"
    ),
    "dmf-mutterschutz-elternzeit-beratung-personal.jpg": (
        "In a warm, supportive German HR office, a female HR manager counsels a smiling pregnant international employee "
        "over a family-leave planning guide and tea"
    ),
    "dmf-azubi-beratung-nebenjob-arbeitsvertrag.jpg": (
        "At a German company HR desk, an advisor explains working-hour regulations and secondary-employment rules "
        "to a young Vietnamese apprentice holding a work schedule"
    ),
    "dmf-arbeitszeiterfassung-stempeluhr-schicht.jpg": (
        "At the entrance of a modern German manufacturing shift area, a Vietnamese employee taps a contactless RFID employee badge "
        "against a digital wall-mounted time-tracking terminal (Arbeitszeiterfassung) showing 07:58"
    ),
    "dmf-personalbuero-kuendigung-beratung.jpg": (
        "In a quiet, professional German executive office, an HR director reviews statutory notification deadlines and legal files "
        "at a clean desk with a calendar and laptop"
    ),
    "dmf-minderjaehrige-azubis-betreuung.jpg": (
        "In a German vocational training center, a caring German youth training coordinator welcomes a 17-year-old Vietnamese trainee "
        "and reviews youth labor protection rules in a bright study lounge"
    ),
    "dmf-probezeit-gespraech-auswertung.jpg": (
        "In a German HR office, a training manager and an HR specialist review an apprentice evaluation matrix "
        "and structured support options on a laptop"
    ),
    "dmf-gespraech-partner-unternehmensleitung.jpg": (
        "In a German Mittelstand boardroom, a managing director signs a direct permanent employment contract with a Vietnamese specialist, "
        "symbolizing direct hiring instead of temporary agency leasing"
    ),
    "dmf-vertrag-unterzeichnung.jpg": (
        "At a modern German onboarding desk, an HR specialist hands an official written information sheet on German labor rights (§ 45c AufenthG) "
        "to a newly hired Vietnamese employee"
    ),
    "dmf-fachkraefte-auswahl-kommission.jpg": (
        "In a transparent German corporate procurement meeting, a CFO and HR director review a fair-recruitment Employer-Pays compliance charter "
        "and transparent fee breakdown on a conference table"
    ),

    # --- SALARY, TAXES, SOCIAL SECURITY, HOUSING & LANGUAGE FUNDING (17) ---
    "dmf-blaue-karte-eu-2027-gehaltsgrenzen-akademiker.jpg": (
        "In a modern German tech headquarters in Munich, a Vietnamese graduate engineer and a German HR compensation manager "
        "review an annual salary package and EU Blue Card contract on a tablet"
    ),
    "dmf-mindestausbildungsverguetung-2027-sperrkonto-kalkulation.jpg": (
        "On a German finance manager's desk, a clean financial plan shows apprentice monthly remuneration tiers alongside "
        "a calculator, training contract, and laptop"
    ),
    "dmf-sprachfoerderung-qualifizierungschancengesetz-schulung.jpg": (
        "In a modern German company seminar room, a small group of international employees participates in an in-house job-related "
        "German language coaching session with a professional trainer and interactive screen"
    ),
    "dmf-rentenbeitraege-drv-erstattung-antrag.jpg": (
        "In a German financial advisory office, a consultant explains German statutory pension insurance statements "
        "and contribution records to an international professional over a cup of coffee"
    ),
    "dmf-einwohnermeldeamt-anmeldung-wohnung.jpg": (
        "At a bright, friendly German municipal citizens office (Bürgeramt / Einwohnermeldeamt), a clerk hands an official "
        "residential registration confirmation (Meldebestätigung) to a smiling young Vietnamese newcomer accompanied by a relocation mentor"
    ),
    "dmf-bankkonto-girokonto-beratung.jpg": (
        "Inside a modern German retail bank branch lounge, a bank advisor hands a new debit card and Girokonto welcome letter "
        "to a young Vietnamese professional in smart casual attire"
    ),
    "dmf-gehaltsabrechnung-lohnpruefung-tabelle.jpg": (
        "In a German payroll accounting department, a payroll specialist compares regional collective wage tables (Tarifgehalt / Vergleichsentgelt) "
        "on a wide monitor beside printed paystubs"
    ),
    "dmf-vorsorge-beratung-arbeitsplatz.jpg": (
        "In a modern German corporate lounge, an HR benefits specialist presents a company pension plan (betriebliche Altersvorsorge bAV) "
        "brochure to a Vietnamese engineer"
    ),
    "dmf-familiennachzug-wohnung-beratung.jpg": (
        "In front of a bright, modern German apartment building with a green courtyard, a Vietnamese professional couple holds apartment keys "
        "and a floor plan alongside a friendly German property manager"
    ),
    "dmf-finanzbuchhaltung-steuer-belege.jpg": (
        "In a German corporate tax and accounting office (Steuerberatung), a financial controller reviews recruitment invoice receipts "
        "and corporate tax deduction ledgers on a dual-monitor workstation"
    ),
    "dmf-krankenkasse-sozialversicherung-service.jpg": (
        "At a modern German statutory health insurance (Krankenkasse GKV) customer center, an advisor hands an electronic health insurance card "
        "(eGK) to a newly arrived Vietnamese employee"
    ),
    "dmf-doppelbesteuerung-finanzamt-beratung.jpg": (
        "In an international tax consultancy in Germany, a senior tax advisor (Steuerberater) explains cross-border double-taxation treaty rules "
        "to a corporate client with a globe and tax code volumes in the background"
    ),
    "dmf-interkulturell-austausch-gruppe.jpg": (
        "At a German company onboarding desk, an HR specialist hands a tax-free employee benefit card, a public transit Deutschlandticket pass, "
        "and apartment keys to a smiling Vietnamese apprentice"
    ),
    "dmf-dozenten-fachunterricht.jpg": (
        "In a German craft workshop, a young Vietnamese trainee in a pre-vocational introductory qualification (Einstiegsqualifizierung EQ) "
        "practices hands-on assembly alongside a supportive German instructor"
    ),
    "dmf-fachbibliothek-unterricht.jpg": (
        "In a bright German workplace learning lounge, two Vietnamese employees practice occupation-specific German (DeuFöV Berufssprachkurs) "
        "with headphones and digital language workbooks"
    ),
    "dmf-azubi-leben-in-deutschland.jpg": (
        "In a sunny German residential neighborhood park, a Vietnamese skilled worker walks happily with his spouse and young child "
        "near modern German townhomes, symbolizing successful family reunification"
    ),
    "dmf-azubi-motivation-lernen.jpg": (
        "In a quiet German company study room after vocational school (Berufsschule), a German tutor coaches two Vietnamese apprentices "
        "in technical mathematics and trade theory (AsA flex Stützunterricht)"
    ),
    "dmf-wohnraum-azubi-unterkunft.jpg": (
        "Inside a bright, newly furnished modern studio apartment for apprentices in Germany, with a neat desk, kitchenette, and large window, "
        "a young Vietnamese apprentice unpacks a suitcase with a smile"
    ),

    # --- B2B STRATEGY, ROI, DEMOGRAPHICS & LEADERSHIP (19) ---
    "dmf-babyboomer-rentenwelle-wissenstransfer-handwerk.jpg": (
        "In a traditional German precision workshop, a retiring 63-year-old German senior master craftsman with gray beard "
        "passes on specialized mechanical know-how to his young 22-year-old Vietnamese successor in matching workwear"
    ),
    "dmf-tandem-kohorten-recruiting-team-einstellung.jpg": (
        "Walking together into a modern German industrial plant entrance in the morning sun, a cohort of three confident young Vietnamese "
        "apprentices in matching company workwear smile alongside their German training manager"
    ),
    "dmf-laendervergleich-vietnam-indien-philippinen-rekrutierung.jpg": (
        "In a German executive boardroom, a strategy director and HR head analyze an international talent sourcing map "
        "and demographic comparison metrics on a large wall-mounted presentation screen"
    ),
    "dmf-ausbildungsstart-2027-rueckwaerts-zeitplan-planung.jpg": (
        "In a modern German HR planning room, two recruitment managers map out a 9-month backward project timeline "
        "for the autumn training intake on a large glass kanban board"
    ),
    "dmf-leitfaden-geschaeftsfuehrer-executive-strategie.jpg": (
        "Portrait-style editorial shot in a modern German Mittelstand headquarters overlooking the production hall, "
        "where a confident German Geschäftsführer and an international recruitment advisor discuss long-term workforce strategy"
    ),
    "dmf-eigenrekrutierung-vs-agentur-analyse-vergleich.jpg": (
        "In a German executive office, an operations director and CFO compare total cost of ownership and time-to-hire charts "
        "on a laptop and printed executive briefing"
    ),
    "dmf-ausbildungsabbruch-risikoabsicherung-garantie.jpg": (
        "In a German company cafeteria during a break, a dedicated retention mentor chats warmly with a Vietnamese apprentice "
        "and a German supervisor over coffee, illustrating proactive retention support"
    ),
    "dmf-agentur-qualitaetskriterien-pruefung-audit.jpg": (
        "At a German corporate conference table, a procurement team reviews a 10-point recruitment agency quality audit checklist "
        "and verified language certificates"
    ),
    "dmf-kosten-preise-honorarmodell-kalkulation.jpg": (
        "An editorial close-up of a German CFO and HR manager reviewing a transparent milestone-based recruitment fee schedule "
        "and ROI spreadsheet on an ultrawide monitor"
    ),
    "dmf-achim-fuehrung-seminar.jpg": (
        "On the shop floor of a German medium-sized company, a German department head clearly explains daily workflow responsibilities "
        "on a visual shopfloor board to two attentive Vietnamese team members"
    ),
    "dmf-teamarbeit-fallstudien.jpg": (
        "Around a modern meeting table in a German company, a culturally diverse team of German and Vietnamese colleagues "
        "collaborates in a constructive weekly feedback und project standup"
    ),
    "dmf-karriere-urkunde-erfolg.jpg": (
        "In a German factory office, a controlling manager and workshop leader review a 36-month apprentice productivity and ROI curve "
        "on a tablet while production runs smoothly through the window"
    ),
    "dmf-partner-deutschland-meeting.jpg": (
        "Inside a German production hall, a manager stands beside an idle CNC workstation with a 'Stelle vakant' clipboard, "
        "discussing the financial cost of vacancy with an HR strategist"
    ),
    "dmf-leben-in-deutschland-freizeit.jpg": (
        "At a warm German company welcome barbecue on a sunny terrace, German colleagues and young Vietnamese apprentices "
        "laugh and share food together, showing strong social integration outside work"
    ),
    "dmf-angebote-pruefung.jpg": (
        "On a bright German executive desk, a decision-maker compares three recruitment agency proposals side by side "
        "with a highlighter, checking candidate video profiles on a tablet"
    ),
    "dmf-betreuung-unterlagen.jpg": (
        "On a German HR manager's desk, a structured 'Ersteinstellung Vietnam' onboarding binder with checked-off milestones "
        "lies beside a headset, laptop, and welcome kit"
    ),
}

def main():
    posts = json.loads(Path("/tmp/all_146_posts.json").read_text())
    all_covers = {p["cover_file"] for p in posts}
    covered = AUTHENTIC_DMF_COVERS | set(GPT_IMAGE_PROMPTS.keys())
    missing = all_covers - covered
    extra = covered - all_covers
    print(f"Total unique cover files across 146 posts: {len(all_covers)}")
    print(f"Authentic DMF covers: {len(AUTHENTIC_DMF_COVERS)}")
    print(f"GPT Image prompts   : {len(GPT_IMAGE_PROMPTS)}")
    print(f"Missing covers      : {missing}")
    print(f"Extra covers        : {extra}")

if __name__ == "__main__":
    main()
