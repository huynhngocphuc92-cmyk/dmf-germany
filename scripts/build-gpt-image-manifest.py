#!/usr/bin/env python3
"""
Builds the complete 146-post visual manifest for DMF Talents (/blog) — Phase 2 (De-AI Documentary Realism):
- 18 Authentic Inside-DMF & Case Study covers (retouched via Codex Image Edit `identity-preserve`)
- 128 Documentary Reportage B2B covers rendered across 5 distinct Camera Archetypes
  with 5500K overcast/neutral German daylight, f/5.6 deep depth of field, real skin pores,
  and weathered workwear, followed by ISO 400 Optical Sensor Emulation.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("/Users/chong/dmf-talents.de")

# 18 Inside-DMF & Authentic Case Study covers (retouched from real DMF photography)
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

# 5 Camera Archetype prefixes to guarantee visual variety and zero repetitive AI staging
ARCHETYPE_SOLO = (
    "Camera archetype: Candid Solo Action (35mm f/5.6, three-quarter angle over the shoulder, "
    "ONLY ONE person in frame, absorbed in work, zero eye contact with camera, overcast 5500K daylight, "
    "real skin pores, lived-in scuffed workwear). Scene: "
)
ARCHETYPE_DESK = (
    "Camera archetype: Documentary German Office Desk & Dossier Close-up (50mm f/5.6 high-angle overhead/three-quarter view, "
    "NO faces or posed models, focusing on real German grey mottled Leitz Ordner lever-arch binders, printed documents, "
    "ballpoint pen, half-empty porcelain coffee mug on a lived-in wooden desk in soft overcast window light). Scene: "
)
ARCHETYPE_WIDE = (
    "Camera archetype: Wide Environmental Reportage (28mm f/8 wide architectural & industrial view in Germany under "
    "pale overcast Northern European sky, wet or weathered concrete/asphalt, human figures small in scale within the environment, "
    "zero golden hour, zero dramatic sunset). Scene: "
)
ARCHETYPE_HANDS = (
    "Camera archetype: Technical Hands & Industrial Equipment Close-up (50mm f/4 macro-documentary framing on working hands "
    "in worn work gloves or nitrile gloves operating real industrial/medical equipment, authentic brushed metal and cables, "
    "neutral fluorescent/daylight mix, no posed faces). Scene: "
)
ARCHETYPE_OBSERVER = (
    "Camera archetype: Unposed Observer-View Workplace Moment (35mm f/5.6 shot from across the room through a doorway or glass partition, "
    "subjects seen in candid profile or three-quarter back view mid-activity, flat neutral workplace lighting, zero staged smiles). Scene: "
)

# 128 De-AI Documentary Reportage Prompts across the 5 Camera Archetypes
GPT_IMAGE_PROMPTS: dict[str, str] = {
    # --- REGIONAL BUNDESLÄNDER GUIDES (10) -> Primarily ARCHETYPE_WIDE ---
    "dmf-hamburg-schleswig-holstein-hafen-pflege-gastronomie.jpg": (
        ARCHETYPE_WIDE
        + "A rainy, overcast morning at the Port of Hamburg container terminal along the Elbe river, wet asphalt with puddles, "
        "stacked weathered shipping containers and gantry cranes in atmospheric mist, with a Vietnamese logistics coordinator in a worn yellow rain jacket walking along the quay."
    ),
    "dmf-mecklenburg-vorpommern-sachsen-anhalt-ostsee-industrie.jpg": (
        ARCHETYPE_WIDE
        + "Wide documentary view of the Rostock Baltic Sea industrial port and wind-turbine rotor blade storage yard under a grey coastal sky, "
        "wet concrete dock, crane structures, and a lone technician in weathered high-vis gear inspecting a turbine flange."
    ),
    "dmf-rheinland-pfalz-saarland-zfe-kaiserslautern-industrie.jpg": (
        ARCHETYPE_WIDE
        + "Exterior pipe-rack corridor and stainless-steel distillation towers of a chemical processing plant in Rheinland-Pfalz under pale overcast daylight, "
        "damp concrete walkway, steam vents in the distance, and a process technician in grey flame-retardant overalls checking a manual valve."
    ),
    "dmf-berlin-brandenburg-gesundheit-industrie-fachkraefte.jpg": (
        ARCHETYPE_WIDE
        + "Courtyard of a contemporary brick-and-glass municipal hospital complex in Berlin-Brandenburg on a cloudy autumn morning, "
        "fallen leaves on damp paving stones, bicycle racks, and hospital staff in scrubs walking between buildings in the midground."
    ),
    "dmf-ostdeutschland-sachsen-thueringen-dresden.jpg": (
        ARCHETYPE_OBSERVER
        + "Viewed through an observation window with faint glass reflections into a Dresden semiconductor cleanroom corridor, "
        "where a technician in full white cleanroom bunny suit, hood, and mask carries a wafer cassettier past automated machinery."
    ),
    "dmf-niedersachsen-bremen-handwerk-industrie.jpg": (
        ARCHETYPE_WIDE
        + "Wide interior view of a heavy wind-energy and automotive component manufacturing bay in Lower Saxony (Niedersachsen), "
        "yellow overhead bridge crane, scuffed grey epoxy floor with pallet jacks, and a worker operating a control pendant."
    ),
    "dmf-hessen-rhein-main-it-logistik-frankfurt.jpg": (
        ARCHETYPE_WIDE
        + "Overcast rainy day view from an office window in Niederrad looking toward the distant Frankfurt am Main banking skyline in mist, "
        "with an unposed IT systems engineer in the foreground seen from behind working at a dual-monitor Linux terminal."
    ),
    "dmf-nrw-kliniken-pflege-krankenhaus-team.jpg": (
        ARCHETYPE_OBSERVER
        + "Unposed morning shift handover at a hospital nurses station in North Rhine-Westphalia (NRW), seen from down the hallway: "
        "fluorescent corridor lighting, wheeled metal medication carts, binder racks, and two nurses in blue tunics looking at a wall schedule."
    ),
    "dmf-baden-wuerttemberg-maschinenbau-azubis.jpg": (
        ARCHETYPE_HANDS
        + "Close-up of a machinist's oil-smudged hands in a Baden-Württemberg precision Maschinenbau workshop using a Mitutoyo digital outside micrometer "
        "to measure a freshly turned steel shaft still mounted in a lathe chuck wet with milky cooling emulsion."
    ),
    "dmf-bayern-mittelstand-industrie-fachkraefte.jpg": (
        ARCHETYPE_WIDE
        + "Courtyard and loading bay of a family-owned Bavarian Mittelstand industrial factory on a cloudy morning with low forested hills in the background, "
        "wet tarmac, stacked Euro-pallets, and an engineer walking past the plant gate."
    ),

    # --- HEALTHCARE, MEDICAL, DENTAL & CARE PROFESSIONS (14) ---
    "dmf-mtra-radiologie-computertomographie-klinik.jpg": (
        ARCHETYPE_SOLO
        + "Seen from over the shoulder in a dimly lit German hospital radiology control room, a single Vietnamese radiology technologist (MTRA) "
        "in white clinic tunic sits at a diagnostic workstation examining grayscale axial chest CT slices, with the CT scanner visible through leaded glass."
    ),
    "dmf-mtla-medizinische-technologen-labor-analyse.jpg": (
        ARCHETYPE_HANDS
        + "Close-up documentary shot inside a German clinical laboratory showing hands in purple nitrile gloves holding an Eppendorf multichannel pipette "
        "over a 96-well microplate beside barcode-labeled EDTA blood sample tubes and a Roche analyzer."
    ),
    "dmf-mfa-arztpraxis-blutentnahme-labor.jpg": (
        ARCHETYPE_SOLO
        + "In a lived-in German general practitioner treatment room (Hausarztpraxis), a single Vietnamese medical assistant (MFA) in white polo and trousers "
        "prepares sterile blood-collection vacutainer tubes and tourniquet on a stainless steel tray beside an ECG cart."
    ),
    "dmf-zfa-zahnarztpraxis-behandlung-stuhl.jpg": (
        ARCHETYPE_SOLO
        + "Candid three-quarter view inside a German dental clinic treatment room between appointments: a single Vietnamese dental assistant (ZFA) "
        "in blue scrubs and surgical mask prepares sterilized handpieces and ultrasonic scaler tips on the swivel bracket table beside the dental chair."
    ),
    "dmf-zahntechnik-dentallabor-fraesen.jpg": (
        ARCHETYPE_HANDS
        + "Close-up of a dental technician's ceramic-dust-covered hands on a wooden bench pin in a German Dentallabor, using a high-speed micromotor handpiece "
        "and loupes to finish a zirconia dental bridge beside plaster articulators."
    ),
    "dmf-physiotherapie-reha-behandlung.jpg": (
        ARCHETYPE_OBSERVER
        + "Shot from the doorway of a German rehabilitation gym under overcast window light: a Vietnamese physiotherapist in運動 polo shirt "
        "assists an older patient stepping between parallel bars on a non-slip floor, with therapy balls and treatment tables in the background."
    ),
    "dmf-klinik-geburtshilfe-hebammen-team.jpg": (
        ARCHETYPE_SOLO
        + "In a quiet German hospital maternity room (Kreißsaal) under soft daylight, a single Vietnamese midwife (Hebamme) in hospital scrubs "
        "checks the paper strip printout emerging from a fetal cardiotocography (CTG) monitor beside an adjustable delivery bed."
    ),
    "dmf-pflege-station-visite-team.jpg": (
        ARCHETYPE_OBSERVER
        + "Candid view down a linoleum-floored German hospital ward corridor during early shift: a Vietnamese nurse pushes a stainless-steel mobile nursing chart trolley "
        "past closed patient room doors and wall-mounted hand sanitizer dispensers."
    ),
    "dmf-azubi-ankunft-deutschland.jpg": (
        ARCHETYPE_OBSERVER
        + "On the paved courtyard path of a German senior nursing home (Seniorenheim) under a cloudy sky, a young Vietnamese care assistant in scrubs "
        "walks beside an elderly resident using a wheeled rollator walker near brick garden planters."
    ),
    "dmf-unterricht-interaktiv.jpg": (
        ARCHETYPE_OBSERVER
        + "Candid documentary view inside a German municipal Kindergarten (Kita) group room with natural birch plywood shelves and coat hooks: "
        "a Vietnamese early childhood educator (Erzieherin) sits on a woven rug helping two toddlers assemble wooden train tracks."
    ),
    "dmf-medizin-simulation-saal.jpg": (
        ARCHETYPE_SOLO
        + "Inside a German hospital sterile supply and operating preparation room, a single Vietnamese surgical technologist (OTA) in green scrub cap, mask, and gown "
        "counts sterile hemostats and retractors on a green surgical drape under overhead clinical lights."
    ),
    "dmf-klinik-partner-audit.jpg": (
        ARCHETYPE_DESK
        + "A hospital Pflegedienstleitung office desk in Germany showing an open roster binder (Dienstplan), printed qualification recognition certificates, "
        "a hospital ID badge on a lanyard, a stethoscope, and a porcelain coffee cup."
    ),
    "dmf-pflege-station-praxis.jpg": (
        ARCHETYPE_HANDS
        + "Close-up documentary shot in a German hospital room of a nurse's hands adjusting the drip rate and digital keypad of a Braun IV infusion pump "
        "mounted on a metal IV pole beside a hospital bed rail."
    ),
    "dmf-augenoptiker-optometrie-brillen-refraktion.jpg": (
        ARCHETYPE_HANDS
        + "Close-up in a German optometry workshop (Augenoptiker-Werkstatt) showing an optician's hands using a digital lensmeter (Scheitelbrechwertmesser) "
        "and micro-screwdriver to align titanium eyeglass frames beside an automated lens edging machine."
    ),

    # --- INDUSTRY, CONSTRUCTION, CRAFTS & ENGINEERING (25) ---
    "dmf-dachdecker-solar-fassadenbau.jpg": (
        ARCHETYPE_SOLO
        + "On a weathered red clay-tile roof in a German residential neighborhood under an overcast grey sky with green scaffolding safety netting, "
        "a single Vietnamese roofer (Dachdecker) in dusty grey knee-pad work trousers and safety harness tightens an aluminum solar mounting rail with a torque wrench."
    ),
    "dmf-fluggeraetmechaniker-luftfahrt-wartung-hangar.jpg": (
        ARCHETYPE_SOLO
        + "Inside a German MRO aircraft maintenance hangar under high-bay industrial lighting, a single Vietnamese aviation mechanic (Fluggerätmechaniker) "
        "standing on a mobile yellow maintenance platform uses a flashlight and inspection mirror inside an open Airbus turbofan engine cowling."
    ),
    "dmf-geruestbau-montage-hoehe.jpg": (
        ARCHETYPE_SOLO
        + "On the exterior of a German brick apartment renovation site under a cloudy sky, a single Vietnamese scaffolder (Gerüstbauer) in worn leather tool belt, "
        "safety harness, and white hard hat hammers a steel wedge coupler on galvanized Layher scaffolding."
    ),
    "dmf-schornsteinfeger-brandschutz-feuerungsanlage.jpg": (
        ARCHETYPE_SOLO
        + "In a cramped concrete basement boiler room of a German apartment house, a single Vietnamese technician (Schornsteinfeger) in soot-dusted black work jacket "
        "inserts a stainless-steel flue-gas probe into the exhaust pipe of a Viessmann condensing boiler while reading a handheld Testo analyzer."
    ),
    "dmf-werkzeugmechaniker-feinwerkmechanik-formenbau.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a steel workbench in a German Formenbau toolmaking shop: a toolmaker's hands using an oilstone and dial test indicator (Fühlhebelmessgerät) "
        "to polish and measure a complex steel injection-mold core Cavity."
    ),
    "dmf-galabau-gartenbau-aussenanlage.jpg": (
        ARCHETYPE_SOLO
        + "At a damp German municipal courtyard landscaping site (GaLaBau) on a cloudy day, a single Vietnamese landscaper in muddy knee-pad work trousers "
        "uses a rubber mallet and spirit level to set grey granite cobblestone pavers into a crushed-gravel bedding layer."
    ),
    "dmf-kaeltetechnik-klimaanlage-wartung.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a wet gravel commercial rooftop in Germany showing a refrigeration technician's gloved hands connecting red and blue brass manifold pressure hoses "
        "to the service valves of a weathered outdoor commercial chiller unit."
    ),
    "dmf-konstruktionsmechanik-stahlbau-halle.jpg": (
        ARCHETYPE_SOLO
        + "In a gritty German structural steel fabrication hall (Stahlbau) with scorched welding tables and chain hoists, a single Vietnamese structural mechanic "
        "in leather welding apron and flipped-up grinding visor uses an angle grinder to bevel a heavy steel H-beam."
    ),
    "dmf-karosserie-lackier-werkstatt.jpg": (
        ARCHETYPE_SOLO
        + "Inside a German automotive body repair workshop (Karosseriebau), a single Vietnamese body technician in dust mask and grey coveralls "
        "uses an orbital vacuum sander on a primed car door panel mounted on a mobile stand, with masking paper and hoses on the floor."
    ),
    "dmf-gleisbau-schienen-infrastruktur.jpg": (
        ARCHETYPE_WIDE
        + "Wide documentary shot along a gravel-ballast railway track construction site (Gleisbau) in Germany under overcast mist, "
        "with a yellow Plasser & Theurer track machine in the background and a track worker in soiled orange high-vis trousers tightening Vossloh rail clips."
    ),
    "dmf-tiefbau-strassenbau-baustelle.jpg": (
        ARCHETYPE_WIDE
        + "At an excavated urban street trench in Germany (Tiefbau) with steel trench shoring plates, muddy earth, and orange PVC drainage pipes, "
        "a civil construction worker in yellow rubber boots and hard hat checks elevation with a laser receiver rod beside a compact excavator."
    ),
    "dmf-schreiner-tischler-fertigung.jpg": (
        ARCHETYPE_SOLO
        + "In a sawdust-covered German joinery workshop (Tischlerei) smelling of oak timber, a single Vietnamese carpenter in ear defenders and dusty work apron "
        "pushes a solid oak board across an Altendorf sliding table saw with extraction hoses overhead."
    ),
    "dmf-zimmerer-holzbau-montage.jpg": (
        ARCHETYPE_SOLO
        + "In a German timber-framing hall (Zimmerei), a single Vietnamese carpenter (Zimmerer) wearing traditional black corduroy flared trousers and leather belt "
        "uses a heavy Mafell portable circular saw to cut a mortise tenon joint on a massive spruce roof rafter."
    ),
    "dmf-landmaschinen-baumaschinen-werkstatt.jpg": (
        ARCHETYPE_SOLO
        + "Inside a high-door German agricultural machinery repair bay with grease stains on the concrete floor, a single Vietnamese heavy-equipment mechanic "
        "in oil-smudged green overalls uses a heavy torque wrench on the planetary wheel hub of a mud-splattered tractor."
    ),
    "dmf-lehrkraft-tafel.jpg": (
        ARCHETYPE_HANDS
        + "Close-up documentary shot inside a German factory electrical room showing an industrial electrician's hands probing DIN-rail terminal blocks "
        "and Siemens S7 PLC relays inside a densely wired switchgear cabinet (Schaltschrank) using insulated red/black multimeter leads."
    ),
    "dmf-azubi-erfolgreiche-ausreise.jpg": (
        ARCHETYPE_SOLO
        + "In a German manufacturing plant, a single Vietnamese industrial mechanic (Industriemechaniker) in dark blue workwear kneels beside a hydraulic stamping press, "
        "replacing a braided high-pressure hydraulic hose with open-end wrenches on an oil-absorbent mat."
    ),
    "dmf-seminar-fachkraft-diskussion.jpg": (
        ARCHETYPE_SOLO
        + "In an unfinished German residential utility room with exposed concrete walls, a single Vietnamese SHK heating installer (Anlagenmechaniker SHK) "
        "uses an electric radial press tool (Presszange) to crimp copper fittings onto a wall-mounted heat pump manifold."
    ),
    "dmf-lackier-ausbau-training.jpg": (
        ARCHETYPE_SOLO
        + "Inside a German commercial building renovation site with drop cloths and aluminum step ladders, a single Vietnamese painter (Maler und Lackierer) "
        "in paint-splattered white bib overalls skims joint compound across a drywall ceiling using a wide stainless-steel smoothing trowel."
    ),
    "dmf-bau-handwerk-simulation.jpg": (
        ARCHETYPE_SOLO
        + "On a damp German reinforced-concrete building site (Hochbau), a single Vietnamese concrete builder (Maurer und Betonbauer) in mud-splattered boots "
        "and hard hat ties steel reinforcement rebar intersections with tie wire and pliers inside Doka timber formwork."
    ),
    "dmf-kfz-diagnose-labor.jpg": (
        ARCHETYPE_HANDS
        + "Close-up in a German automotive workshop showing a technician's hands in orange Class-0 insulated high-voltage safety gloves "
        "removing the orange service disconnect plug on an opened electric vehicle lithium-ion battery pack under a two-post lift."
    ),
    "dmf-solar-elektro-schulung.jpg": (
        ARCHETYPE_SOLO
        + "Inside a German commercial building electrical room, a single Vietnamese solar electrician mounts a three-phase hybrid string inverter onto a brick wall, "
        "stripping black solar DC cables with a cable knife beside an open distribution board."
    ),
    "dmf-azubi-einarbeitung-werkstatt.jpg": (
        ARCHETYPE_SOLO
        + "At an enclosed 5-axis CNC milling machine with coolant droplets on the safety glass window in a German workshop, a single Vietnamese CNC machinist "
        "in safety glasses adjusts feed-rate overrides on the scratched hardware keys of a Siemens Sinumerik control panel."
    ),
    "dmf-arbeitgeber-kooperation-handwerk.jpg": (
        ARCHETYPE_SOLO
        + "In a dimly lit German metalworking booth with local exhaust ventilation hood, a single Vietnamese TIG welder in worn leather gauntlets and auto-darkening helmet "
        "welds a stainless-steel pipe flange, casting a crisp blue arc reflection on the workbench."
    ),
    "dmf-talent-partnerschaft-deutschland-vietnam.jpg": (
        ARCHETYPE_HANDS
        + "Close-up of a mechatronics technician's hands on an aluminum profile test rig in a German workshop, adjusting Festo pneumatic solenoid valves, "
        "blue polyurethane air tubing, and optical proximity sensors with a precision screwdriver."
    ),

    # --- GASTRONOMY, HOSPITALITY & FOOD TRADES (6) ---
    "dmf-brauer-maelzer-getraenketechnik-brauerei.jpg": (
        ARCHETYPE_SOLO
        + "Inside a wet-tiled German craft brewery cellar (Gärkeller) with stainless-steel cylindroconical fermentation tanks and rubber hoses on the floor, "
        "a single Vietnamese brewer (Brauer und Mälzer) in rubber apron and boots draws a wort sample from a sample cock into a glass cylinder."
    ),
    "dmf-hotelfach-restaurant-service-training.jpg": (
        ARCHETYPE_SOLO
        + "Behind the wooden reception counter of a German city business hotel during quiet morning hours, a single Vietnamese hotel specialist (Hotelfachfrau) "
        "in dark blazer checks room keycards and printed arrival registration lists beside a key rack and payment terminal."
    ),
    "dmf-fleischer-metzger-lebensmittelhandwerk.jpg": (
        ARCHETYPE_SOLO
        + "In a cold, white-tiled German butcher production room (Fleischerei), a single Vietnamese butcher in white coat, chainmail cut-resistant apron, and hairnet "
        "portions fresh meat cuts on a red polyethylene cutting board beside stainless-steel Euro-crates."
    ),
    "dmf-sprachpraxis-dialog-training.jpg": (
        ARCHETYPE_SOLO
        + "In a cramped, steaming German restaurant kitchen during prep hours, a single Vietnamese line cook (Koch) in stained apron and chef jacket "
        "sears medallions in a heavy stainless-steel sauté pan over an induction range surrounded by Gastronorm Bain-Marie pans."
    ),
    "dmf-praxis-uebung-labor.jpg": (
        ARCHETYPE_SOLO
        + "In a flour-dusted German artisan bakery (Backstube) at 5 AM under fluorescent tubes, a single Vietnamese baker (Bäcker) in white cotton trousers "
        "uses a long wooden peel to unload crusty rye sourdough loaves (Mischbrot) from a multi-deck stone oven."
    ),
    "dmf-gastronomie-hotellerie-service.jpg": (
        ARCHETYPE_SOLO
        + "In an empty German restaurant dining room before afternoon opening, a single Vietnamese restaurant professional (Restaurantfachmann) in black waistcoat "
        "polishes long-stemmed Riesling wine glasses with a linen cloth beside neatly folded cloth napkins."
    ),

    # --- IT, LOGISTICS, BUS/TRANSPORT & DUALES STUDIUM (7) ---
    "dmf-systemintegration-rechenzentrum-server.jpg": (
        ARCHETYPE_SOLO
        + "In the narrow cold aisle of a German colocation data center under stark white overhead lighting, a single Vietnamese IT systems technician "
        "in a fleece jacket kneels before an open 42U server rack tracing yellow single-mode fiber patch cords with a visual fault locator."
    ),
    "dmf-busfahrer-oepnv-linienbus-depot.jpg": (
        ARCHETYPE_WIDE
        + "At a wet municipal bus depot (ÖPNV Betriebshof) in a German city on a cloudy morning with rows of parked city buses and overhead charging pantographs, "
        "a Vietnamese bus driver in transit vest conducts a pre-trip tire and mirror walk-around check."
    ),
    "dmf-stapler-lagerlogistik-schulung.jpg": (
        ARCHETYPE_SOLO
        + "Inside a concrete-floored German freight warehouse (Hochregallager), a single Vietnamese forklift operator seated inside the cab of a Jungheinrich reach truck "
        "looks up while lifting a shrink-wrapped Euro-pallet onto a high steel storage rack."
    ),
    "dmf-duales-studium-hochschule-akademie.jpg": (
        ARCHETYPE_SOLO
        + "In a cluttered engineering laboratory at a German University of Applied Sciences (Hochschule), a single Vietnamese dual-study student (Duales Studium) "
        "sits at a workbench probing an embedded microcontroller PCB with a Rohde & Schwarz digital oscilloscope."
    ),
    "dmf-fuehrerschein-verkehr-mobilitaet.jpg": (
        ARCHETYPE_SOLO
        + "At a rainy German logistics delivery yard, a single Vietnamese commercial driver in a dark weatherproof jacket secures ratchet tie-down straps "
        "inside the open rear cargo bay of a white Mercedes-Benz Sprinter delivery van."
    ),
    "dmf-logistik-arbeitsplatz-training.jpg": (
        ARCHETYPE_HANDS
        + "Close-up at a German warehouse loading bay showing a logistics worker's gloved hands using a rugged Zebra handheld barcode scanner "
        "to scan a DHL/freight shipping label on a cardboard carton stacked on a wooden Euro-pallet."
    ),
    "dmf-it-arbeitsplaetze-schulung.jpg": (
        ARCHETYPE_SOLO
        + "Over-the-shoulder documentary shot in a quiet German software company office: a single Vietnamese backend developer in a sweater sits at a height-adjustable desk "
        "with mechanical keyboard, coffee mug, and two monitors displaying TypeScript code and Docker terminal logs."
    ),

    # --- VISA, IMMIGRATION LAW, ANERKENNUNG & AUTHORITIES (19) -> Primarily ARCHETYPE_DESK & ARCHETYPE_HANDS ---
    "dmf-auslandsportal-work-and-stay-agentur-digitalisierung.jpg": (
        ARCHETYPE_DESK
        + "A German HR specialist's desk showing a laptop open to an administrative visa tracking spreadsheet, a stack of grey Leitz Ordner binders, "
        "printed consular checklists with yellow sticky notes, and a black ceramic coffee mug in soft morning window light."
    ),
    "dmf-anerkennungspartnerschaft-praxis-erfahrungen.jpg": (
        ARCHETYPE_DESK
        + "An oak workbench desk in a German craft company office displaying an open 'Anerkennungspartnerschaft — Qualifizierungsplan' binder, "
        "a Chamber of Crafts (HWK) letter, a pair of safety glasses, and a steel vernier caliper."
    ),
    "dmf-zab-zeugnisbewertung-statement-comparability.jpg": (
        ARCHETYPE_DESK
        + "Close-up on a German HR desk showing an official ZAB Statement of Comparability (Zeugnisbewertung) document folder, "
        "notarized university diploma translations bound with red-white-black cord, reading glasses, and a silver Pelikan fountain pen."
    ),
    "dmf-daueraufenthalt-eu-niederlassung-pass.jpg": (
        ARCHETYPE_HANDS
        + "Close-up at a German municipal Bürgeramt counter where an administrative clerk's hand passes a plastic German electronic residence permit card (Aufenthaltstitel) "
        "and official PIN letter across a wooden desk to an applicant."
    ),
    "dmf-qualifikationsanalyse-werkstatt-test.jpg": (
        ARCHETYPE_SOLO
        + "In a German Handwerkskammer examination workshop, a single Vietnamese craftsman in work overalls uses a vernier height gauge on a cast-iron surface plate "
        "to lay out a practical metal test piece while a printed technical drawing lies beside him."
    ),
    "dmf-defizitbescheid-weiterbildung-plan.jpg": (
        ARCHETYPE_DESK
        + "A hospital clinical educator's desk in Germany showing a printed 'Defizitbescheid / Anpassungslehrgang' curriculum binder, "
        "a highlight marker, a hospital ward shift rota, and a stethoscope under neutral office lighting."
    ),
    "dmf-zav-arbeitsagentur-beratung.jpg": (
        ARCHETYPE_HANDS
        + "Close-up of a German compliance officer's hand stamping a 'Vorabzustimmung § 81a AufenthG' dossier on a wooden desk "
        "next to a date stamp rack, a green ink pad, and vertical cardboard file folders."
    ),
    "dmf-urkundenpruefung-legalisation-botschaft.jpg": (
        ARCHETYPE_DESK
        + "Overhead documentary still life on a dark wood desk: certified German translation dossiers fastened with brass eyelets and embossed notary seals, "
        "a magnifying glass, and a stack of consular verification files."
    ),
    "dmf-verpflichtungserklaerung-buergschaft-vertrag.jpg": (
        ARCHETYPE_DESK
        + "On a German Mittelstand managing director's desk: an open financial guarantee and sponsorship form (Verpflichtungserklärung), "
        "a desktop printing calculator with paper tape, company balance folders, and a fountain pen."
    ),
    "dmf-sprachpruefung-goethe-zertifikat.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a classroom desk showing a candidate's hand filling out a German B2 listening and reading examination answer sheet with a pencil, "
        "beside an analog desk watch and an ID card."
    ),
    "dmf-praesentation-bildung-arbeitsmarkt.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a German conference table showing a newly hired specialist's hand signing the signature line of a printed 'Unbefristeter Arbeitsvertrag' "
        "with a blue ballpoint pen next to a company key fob."
    ),
    "dmf-schulung-werkbank-montage.jpg": (
        ARCHETYPE_SOLO
        + "In a German electronics assembly plant, an experienced Vietnamese specialist in an ESD antistatic smock and wrist strap "
        "solders fine-pitch components under a benchtop illuminated magnifier lamp."
    ),
    "dmf-akademie-abschlussfeier-urkunde.jpg": (
        ARCHETYPE_DESK
        + "A German company onboarding desk prepared for day one: a welcome binder, a laminated employee RFID badge on a lanyard, "
        "a hard hat, safety shoes in an open box, and an induction schedule."
    ),
    "dmf-azubi-abschluss-zertifikat.jpg": (
        ARCHETYPE_DESK
        + "An oak desk in a German workshop office displaying a framed Chamber of Industry and Commerce (IHK) 'Prüfungszeugnis / Gesellenbrief' certificate "
        "beside a precision machined brass workpiece and micrometers."
    ),
    "dmf-campus-lehrsaal-modern.jpg": (
        ARCHETYPE_DESK
        + "A German training manager's desk showing an IHK 'Berufsausbildungsvertrag' training contract, a betrieblicher Ausbildungsplan binder, "
        "a laptop showing the digital IHK portal, and a cup of black coffee."
    ),
    "dmf-bewerber-profil-pruefung.jpg": (
        ARCHETYPE_DESK
        + "A German HR recruitment desk with printed candidate qualification scorecards, a points table for the Chancenkarte (§ 20a AufenthG), "
        "a highlighter pen, and an open notebook."
    ),
    "dmf-fachsprache-lehrkraft.jpg": (
        ARCHETYPE_DESK
        + "A dual-monitor workstation in a German vocational chamber office showing a side-by-side comparison of translated technical subject hours "
        "and a German Rahmenlehrplan reference binder open on the desk."
    ),
    "dmf-delegation-besuch-akademie.jpg": (
        ARCHETYPE_DESK
        + "An administrative compliance desk in Germany showing a wall calendar with red-circled statutory § 81a fast-track deadlines, "
        "an open case file folder, a landline office telephone with headset, and a laptop."
    ),

    # --- LABOR LAW, HR COMPLIANCE & OCCUPATIONAL SAFETY (15) ---
    "dmf-probezeit-management-ausbilder-meister-leitfaden.jpg": (
        ARCHETYPE_OBSERVER
        + "Seen through the wire-glass window of a German workshop master's office (Meisterbüro): a German Meister in a grey shop coat and a young Vietnamese apprentice "
        "sit across a small table reviewing a printed training logbook (Berichtsheft)."
    ),
    "dmf-statusfeststellung-scheinselbststaendigkeit-clearing.jpg": (
        ARCHETYPE_DESK
        + "A German labor-law and social-security compliance desk showing a Deutsche Rentenversicherung 'Statusfeststellungsverfahren § 7a SGB IV' folder, "
        "a red Beck'sche Textausgaben 'Arbeitsgesetze (ArbG)' paperback book, and a highlighter."
    ),
    "dmf-betriebsrat-mitbestimmung-99-betrvg-personal.jpg": (
        ARCHETYPE_OBSERVER
        + "Candid view from the doorway of a German company conference room during a Works Council (Betriebsrat) meeting: "
        "three committee members seen in profile/back view around a birch table covered with 'Anhörung nach § 99 BetrVG' folders and thermos carafes."
    ),
    "dmf-arbeitsvertrag-rueckzahlung-klausel-pruefung.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a German legal advisor's desk showing a hand using a steel ruler and red fineliner pen to strike out an invalid repayment clause "
        "in a printed German contract next to an open 'Bürgerliches Gesetzbuch (BGB)' code book."
    ),
    "dmf-arbeitsunfall-berufsgenossenschaft-schutz.jpg": (
        ARCHETYPE_WIDE
        + "Inside a German factory production aisle with yellow pedestrian floor markings, a green wall-mounted first-aid stretcher and eyewash station, "
        "DGUV safety helmets signage, and a worker walking along the marked safety walkway."
    ),
    "dmf-entgeltfortzahlung-attest-krankmeldung.jpg": (
        ARCHETYPE_DESK
        + "A German payroll clerk's desk showing a computer monitor with an electronic sick-leave certificate (eAU) retrieval screen, "
        "a DATEV payroll binder, a desk calendar, and a calculator."
    ),
    "dmf-mutterschutz-elternzeit-beratung-personal.jpg": (
        ARCHETYPE_DESK
        + "A quiet German HR counseling table showing an official BMFSFJ 'Leitfaden zum Mutterschutz' und 'Elternzeit' brochure, "
        "a workplace risk assessment form, a teapot, and two ceramic cups."
    ),
    "dmf-azubi-beratung-nebenjob-arbeitsvertrag.jpg": (
        ARCHETYPE_DESK
        + "A German training coordinator's desk showing a printed 'Arbeitszeitgesetz (ArbZG)' shift schedule, a secondary-employment approval form (Nebentätigkeitsgenehmigung), "
        "and a student vocational school timetable."
    ),
    "dmf-arbeitszeiterfassung-stempeluhr-schicht.jpg": (
        ARCHETYPE_HANDS
        + "Close-up at the concrete entrance wall of a German factory locker room: a worker's hand in a navy work jacket sleeve holding a white RFID plastic keycard "
        "up to a wall-mounted digital time-clock terminal (Zeiterfassungsterminal) reading 06:57."
    ),
    "dmf-personalbuero-kuendigung-beratung.jpg": (
        ARCHETYPE_DESK
        + "A German HR director's desk under overcast daylight showing a closed confidential personnel file (Personalakte), "
        "a statutory notice-period calendar, a fountain pen, and a locked steel filing cabinet in the background."
    ),
    "dmf-minderjaehrige-azubis-betreuung.jpg": (
        ARCHETYPE_DESK
        + "On a German vocational training center desk: a printed 'Jugendarbeitsschutzgesetz (JArbSchG)' handbook, a guardian consent document, "
        "a youth hostel dorm key, and a protective hard hat."
    ),
    "dmf-probezeit-gespraech-auswertung.jpg": (
        ARCHETYPE_DESK
        + "A German workshop supervisor's desk showing a 3-month apprentice probation evaluation grid with handwritten notes, "
        "an IHK training logbook, a pair of calipers, and a coffee mug."
    ),
    "dmf-gespraech-partner-unternehmensleitung.jpg": (
        ARCHETYPE_DESK
        + "A German industrial company boardroom table showing a comparison dossier between direct permanent hiring (Festanstellung) and temporary agency leasing (Arbeitnehmerüberlassung AÜG), "
        "alongside cost tables and a calculator."
    ),
    "dmf-vertrag-unterzeichnung.jpg": (
        ARCHETYPE_DESK
        + "An onboarding folder open on a German HR desk displaying the statutory written information sheet on fair working conditions (§ 45c AufenthG), "
        "alongside a collective bargaining agreement booklet (Tarifvertrag) and a ballpoint pen."
    ),
    "dmf-fachkraefte-auswahl-kommission.jpg": (
        ARCHETYPE_DESK
        + "A German corporate compliance desk displaying an 'Employer-Pays-Prinzip / Fair Recruitment' audit binder, "
        "ILO convention guidelines, and a transparent service-fee invoice breakdown."
    ),

    # --- SALARY, TAXES, SOCIAL SECURITY, HOUSING & LANGUAGE FUNDING (18) ---
    "dmf-blaue-karte-eu-2027-gehaltsgrenzen-akademiker.jpg": (
        ARCHETYPE_DESK
        + "A German HR compensation desk showing a printed 2027 EU Blue Card (Blaue Karte EU § 18g AufenthG) salary threshold table, "
        "an engineering employment contract, a calculator, and a laptop."
    ),
    "dmf-mindestausbildungsverguetung-2027-sperrkonto-kalkulation.jpg": (
        ARCHETYPE_DESK
        + "A German vocational training finance desk showing a 'Mindestausbildungsverguetung 2027 (§ 17 BBiG)' progression table across 1st to 4th training years, "
        "a blocked account (Sperrkonto) delta sheet, and a pen."
    ),
    "dmf-sprachfoerderung-qualifizierungschancengesetz-schulung.jpg": (
        ARCHETYPE_OBSERVER
        + "Seen from the back of a German company meeting room after shift: four international workers in work trousers sit around a U-shaped table "
        "with German B2 technical workbooks while an instructor writes trade vocabulary on a flipchart."
    ),
    "dmf-rentenbeitraege-drv-erstattung-antrag.jpg": (
        ARCHETYPE_DESK
        + "A German wooden desk showing an official Deutsche Rentenversicherung 'Versicherungsverlauf / Renteninformation' letter, "
        "a contribution refund form (§ 210 SGB VI), reading glasses, and a calculator."
    ),
    "dmf-einwohnermeldeamt-anmeldung-wohnung.jpg": (
        ARCHETYPE_HANDS
        + "Close-up at a German municipal Bürgeramt counter where a clerk stamps an official 'Amtliche Meldebestätigung' registration form "
        "beside a Wohnungsgeberbestätigung document and a passport."
    ),
    "dmf-bankkonto-girokonto-beratung.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a desk showing a newly arrived employee's hand inserting a German Girocard debit card into a portable TAN generator device "
        "beside an IBAN account confirmation letter and a laptop."
    ),
    "dmf-gehaltsabrechnung-lohnpruefung-tabelle.jpg": (
        ARCHETYPE_DESK
        + "A German payroll accounting desk showing a printed monthly German payslip (Lohn- und Gehaltsabrechnung) detailing Bruttolohn, Lohnsteuer, and Sozialversicherung, "
        "beside a regional Tarifvertrag table."
    ),
    "dmf-vorsorge-beratung-arbeitsplatz.jpg": (
        ARCHETYPE_DESK
        + "An HR benefits desk in Germany showing a 'Betriebliche Altersvorsorge (bAV) — Entgeltumwandlung' pension projection folder, "
        "a compound-interest chart, and a cup of coffee."
    ),
    "dmf-familiennachzug-wohnung-beratung.jpg": (
        ARCHETYPE_WIDE
        + "Exterior view of a typical German three-story residential apartment building (Mehrfamilienhaus) with balconies, bicycle shed, and green courtyard "
        "on a cloudy afternoon, with a young Vietnamese couple carrying moving boxes toward the entrance door."
    ),
    "dmf-finanzbuchhaltung-steuer-belege.jpg": (
        ARCHETYPE_DESK
        + "A German Steuerberater accounting desk with two monitors running DATEV accounting ledger software, "
        "stacks of stamped recruitment invoices (Betriebsausgaben), and grey binder folders."
    ),
    "dmf-krankenkasse-sozialversicherung-service.jpg": (
        ARCHETYPE_DESK
        + "A German HR onboarding desk showing an electronic health insurance card (elektronische Gesundheitskarte eGK), "
        "a social security registration printout (Meldebescheinigung zur Sozialversicherung), and a membership application."
    ),
    "dmf-doppelbesteuerung-finanzamt-beratung.jpg": (
        ARCHETYPE_DESK
        + "A German international tax advisor's desk showing a 'Doppelbesteuerungsabkommen (DBA) Deutschland–Vietnam' legal commentary volume, "
        "Lohnsteuerklasse forms, and a fountain pen."
    ),
    "dmf-interkulturell-austausch-gruppe.jpg": (
        ARCHETYPE_DESK
        + "A German apprentice welcome kit laid out on a wooden desk: a smartphone displaying a Deutschlandticket QR code, "
        "a 50-Euro tax-free Sachbezug benefit card, a bunch of apartment keys with a numbered tag, and a city transit map."
    ),
    "dmf-dozenten-fachunterricht.jpg": (
        ARCHETYPE_SOLO
        + "In a German craft training workshop, a single young Vietnamese trainee in an Einstiegsqualifizierung (EQ) program "
        "stands at a blue steel workbench filing a metal workpiece clamped in a bench vise."
    ),
    "dmf-fachbibliothek-unterricht.jpg": (
        ARCHETYPE_SOLO
        + "In a quiet German workplace breakroom after shift, a single Vietnamese employee in a work fleece sits at a table with over-ear headphones "
        "and an open 'Berufssprachkurs B2 (DeuFöV)' workbook taking vocabulary notes."
    ),
    "dmf-azubi-leben-in-deutschland.jpg": (
        ARCHETYPE_WIDE
        + "On a tree-lined pedestrian path in a German town residential neighborhood under soft overcast light, "
        "a Vietnamese skilled worker in a casual jacket walks with his wife and young child past brick row houses and parked bicycles."
    ),
    "dmf-azubi-motivation-lernen.jpg": (
        ARCHETYPE_HANDS
        + "Close-up on a wooden study table in a German vocational training center showing open technical mathematics and electrical engineering textbooks (Fachkunde Elektrotechnik), "
        "a Casio scientific calculator, a triangle ruler, and a hand writing equations on squared paper."
    ),
    "dmf-wohnraum-azubi-unterkunft.jpg": (
        ARCHETYPE_WIDE
        + "Interior documentary view of a clean, modest furnished single room for apprentices (Azubi-Apartment) in Germany under overcast window daylight: "
        "a simple single bed with white duvet, a compact desk with a German textbook, a small kitchenette, and an open suitcase on the floor."
    ),

    # --- B2B STRATEGY, ROI, DEMOGRAPHICS & LEADERSHIP (16) ---
    "dmf-babyboomer-rentenwelle-wissenstransfer-handwerk.jpg": (
        ARCHETYPE_OBSERVER
        + "Unposed observer-view photograph from across a lived-in German precision machine shop: a 63-year-old German senior master in a faded grey shop coat "
        "and a 22-year-old Vietnamese technician stand in profile beside an older manual lathe inspecting a technical blueprint."
    ),
    "dmf-tandem-kohorten-recruiting-team-einstellung.jpg": (
        ARCHETYPE_WIDE
        + "Early morning shift arrival at the turnstile gate of a German industrial factory under an overcast sky: "
        "three young Vietnamese apprentices in matching grey work jackets and safety boots walk together with backpacks into the plant yard."
    ),
    "dmf-laendervergleich-vietnam-indien-philippinen-rekrutierung.jpg": (
        ARCHETYPE_DESK
        + "A German corporate strategy desk showing a printed country-comparison matrix (Vietnam vs. Indien vs. Philippinen) with demographic charts, "
        "IHK recognition statistics, a pair of glasses, and a black notebook."
    ),
    "dmf-ausbildungsstart-2027-rueckwaerts-zeitplan-planung.jpg": (
        ARCHETYPE_DESK
        + "Close-up of a magnetic whiteboard and planning desk in a German HR office showing a 9-month backward Gantt timeline from November to August 1st (Ausbildungsstart), "
        "with pinned milestone cards for Visa § 81a, IHK registration, and arrival."
    ),
    "dmf-leitfaden-geschaeftsfuehrer-executive-strategie.jpg": (
        ARCHETYPE_WIDE
        + "Viewed from the upper mezzanine walkway of a German Mittelstand production hall under neutral industrial lighting, "
        "a managing director in a dark pullover and dress shirt stands at the railing looking down over CNC machines and assembly bays."
    ),
    "dmf-eigenrekrutierung-vs-agentur-analyse-vergleich.jpg": (
        ARCHETYPE_DESK
        + "A German CFO's desk showing a printed 'Make-or-Buy: Eigenrekrutierung vs. Vollservice-Agentur' Total Cost of Ownership spreadsheet, "
        "a calculator, and cost-of-vacancy charts."
    ),
    "dmf-ausbildungsabbruch-risikoabsicherung-garantie.jpg": (
        ARCHETYPE_OBSERVER
        + "Candid view inside a modest German factory canteen (Kantine) during mid-morning break: a Vietnamese apprentice and a workplace mentor "
        "sit at a laminate table with coffee mugs and bread rolls (Brötchen) in quiet conversation."
    ),
    "dmf-agentur-qualitaetskriterien-pruefung-audit.jpg": (
        ARCHETYPE_DESK
        + "A German procurement desk displaying a 10-point recruitment agency due-diligence checklist, verified telc/Goethe B2 sample certificates, "
        "and a red pen marking compliance items."
    ),
    "dmf-kosten-preise-honorarmodell-kalkulation.jpg": (
        ARCHETYPE_DESK
        + "Close-up on a German controlling desk showing a milestone-based recruitment fee schedule (Meilenstein-Honorarmodell), "
        "a 36-month ROI amortization curve on a monitor, and an Excel printout."
    ),
    "dmf-achim-fuehrung-seminar.jpg": (
        ARCHETYPE_OBSERVER
        + "In a German production hall beside a magnetic shopfloor SQCDP board (Schichtübergabe-Tafel), a workshop leader seen from a three-quarter back angle "
        "reviews daily production targets with three workers in grey workwear before the morning shift."
    ),
    "dmf-teamarbeit-fallstudien.jpg": (
        ARCHETYPE_OBSERVER
        + "Candid observer view through an open office door of a German engineering team standup meeting around a whiteboard covered in technical schematics, "
        "with German and Vietnamese colleagues in casual shirts discussing a prototype."
    ),
    "dmf-karriere-urkunde-erfolg.jpg": (
        ARCHETYPE_DESK
        + "A German factory controlling desk overlooking the shop floor through a window, showing a 3-year apprentice net-productivity vs. training-cost chart, "
        "a calculator, and IHK exam schedules."
    ),
    "dmf-partner-deutschland-meeting.jpg": (
        ARCHETYPE_WIDE
        + "Inside a quiet section of a German machine shop, an unstaffed CNC machining center sits idle with its status light on amber "
        "and a 'Schicht unbesetzt / Stelle vakant' maintenance clipboard hanging on the enclosure door, illustrating the cost of unfilled vacancies."
    ),
    "dmf-leben-in-deutschland-freizeit.jpg": (
        ARCHETYPE_WIDE
        + "At a casual afternoon gathering on the gravel courtyard outside a German craft workshop with wooden beer-garden benches (Bierzeltgarnitur), "
        "colleagues in everyday clothes and work trousers chat over mineral water and grilled sausages under an overcast sky."
    ),
    "dmf-angebote-pruefung.jpg": (
        ARCHETYPE_DESK
        + "A German managing director's desk with three competing international recruitment agency proposals laid out side by side, "
        "marked with yellow post-it notes and a red comparison pen."
    ),
    "dmf-betreuung-unterlagen.jpg": (
        ARCHETYPE_DESK
        + "A German HR manager's desk showing an open 'Leitfaden Ersteinstellung aus Vietnam' binder with tabbed checklists for IHK, ZAV, Wohnraum, and Onboarding, "
        "next to a coffee cup and keyboard."
    ),
}


def main() -> None:
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
