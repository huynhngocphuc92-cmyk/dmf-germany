export type BlogClusterId =
  | "pflege"
  | "handwerk"
  | "gastronomie"
  | "industrie"
  | "azubi"
  | "visum-recht"
  | "kosten-praxis";

export type LocalizedText = {
  de: string;
  en: string;
  vn: string;
};

export interface PillarLink {
  href: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface InlineLeadOffer {
  badge: LocalizedText;
  headline: LocalizedText;
  subheadline: LocalizedText;
  ctaLabel: LocalizedText;
  defaultInterest: string;
}

export interface BlogClusterConfig {
  id: BlogClusterId;
  label: LocalizedText;
  pillarLinks: PillarLink[];
  inlineLeadOffer: InlineLeadOffer;
}

export const BLOG_CLUSTERS: BlogClusterConfig[] = [
  {
    id: "pflege",
    label: {
      de: "Pflege & Gesundheit",
      en: "Nursing & Healthcare",
      vn: "Điều dưỡng & Y tế",
    },
    pillarLinks: [
      {
        href: "/fuer-arbeitgeber/branchen/pflege-gesundheit",
        label: {
          de: "Pflegefachkräfte & Azubis aus Vietnam",
          en: "Nursing Staff & Apprentices from Vietnam",
          vn: "Giải pháp Điều dưỡng & Y tế từ Việt Nam",
        },
        description: {
          de: "Anerkennung, 1+2-Modell & B1/B2-Fachsprache für Kliniken und Pflegeheime.",
          en: "Recognition, 1+2 pathway & B1/B2 medical German for hospitals and care homes.",
          vn: "Công nhận bằng cấp, mô hình 1+2 & tiếng Đức chuyên ngành B1/B2.",
        },
      },
      {
        href: "/services/skilled-workers",
        label: {
          de: "Fachkräfte (§ 18a / § 81a) einstellen",
          en: "Hire Skilled Professionals (§ 18a / § 81a)",
          vn: "Tuyển Lao động tay nghề (§ 18a / § 81a)",
        },
        description: {
          de: "Beschleunigtes Fachkräfteverfahren mit planbarem Start in 4–6 Monaten.",
          en: "Fast-track skilled immigration procedure in 4–6 months.",
          vn: "Thủ tục visa nhanh 4–6 tháng cho nhân sự có bằng cấp.",
        },
      },
      {
        href: "/fuer-arbeitgeber/zeitplan",
        label: {
          de: "§ 81a-Zeitplan & Ablauf prüfen",
          en: "Check § 81a Timeline & Process",
          vn: "Xem lộ trình & thời gian § 81a",
        },
        description: {
          de: "Meilensteine von der Vollmacht über Defizitbescheid bis zur Einreise.",
          en: "Step-by-step milestones from power of attorney to arrival.",
          vn: "Các mốc thời gian từ ủy quyền đến khi nhập cảnh Đức.",
        },
      },
      {
        href: "/fuer-arbeitgeber/kandidaten",
        label: {
          de: "Geprüfte Kandidatenprofile ansehen",
          en: "Browse Verified Candidate Profiles",
          vn: "Xem hồ sơ ứng viên đã kiểm định",
        },
        description: {
          de: "Anonymisierte B1/B2-Dossiers inkl. 90-Sekunden-Vorstellungsvideo.",
          en: "Anonymized B1/B2 dossiers including 90-second video introductions.",
          vn: "Hồ sơ B1/B2 ẩn danh kèm video giới thiệu 90 giây.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "Pflege-Rekrutierung · Kostenloses Dossier-Paket",
        en: "Nursing Recruiting · Free Candidate Dossiers",
        vn: "Tuyển Điều dưỡng · Bộ hồ sơ mẫu miễn phí",
      },
      headline: {
        de: "2–3 anonymisierte Pflege-Kandidatenprofile (B1/B2 inkl. Kurzvideo) kostenlos erhalten",
        en: "Receive 2–3 anonymized nursing candidate profiles (B1/B2 + short video) free of charge",
        vn: "Nhận miễn phí 2–3 hồ sơ Điều dưỡng viên (B1/B2 kèm video phỏng vấn)",
      },
      subheadline: {
        de: "Passend zu Ihrer Einrichtung – inkl. Einschätzung zu Landesamt-Anerkennung und § 81a-Vorlaufzeit.",
        en: "Matched to your facility, including recognition pathway and § 81a timeline assessment.",
        vn: "Phù hợp với cơ sở của bạn, kèm tư vấn lộ trình công nhận bằng và thời gian § 81a.",
      },
      ctaLabel: {
        de: "Pflege-Profile unverbindlich anfordern",
        en: "Request Nursing Profiles",
        vn: "Nhận hồ sơ Điều dưỡng ngay",
      },
      defaultInterest: "Pflege-Kandidatenprofile (B1/B2 + Video)",
    },
  },
  {
    id: "handwerk",
    label: {
      de: "Handwerk & Bau",
      en: "Trades & Construction",
      vn: "Thủ công & Xây dựng",
    },
    pillarLinks: [
      {
        href: "/fuer-arbeitgeber/branchen/handwerk-bau",
        label: {
          de: "Handwerker & Azubis (SHK, Elektro, Bau)",
          en: "Tradespeople & Apprentices (HVAC, Electrical, Construction)",
          vn: "Giải pháp Thủ công nghiệp & Xây dựng",
        },
        description: {
          de: "Rekrutierung für Elektro, SHK, Ausbau, Kfz & HWK-Anerkennung.",
          en: "Recruitment for electrical, plumbing/HVAC, finishing, automotive & HWK recognition.",
          vn: "Tuyển thợ điện, nhiệt lạnh, xây dựng, ô tô & thẩm định HWK.",
        },
      },
      {
        href: "/services/azubi",
        label: {
          de: "Auszubildende (§ 16a) gewinnen",
          en: "Recruit Vocational Trainees (§ 16a)",
          vn: "Tuyển Học viên nghề kép (§ 16a)",
        },
        description: {
          de: "Motivierte B1-Azubis für den nächsten Ausbildungsstart sichern.",
          en: "Secure motivated B1 vocational trainees for the upcoming intake.",
          vn: "Đảm bảo nguồn học viên B1 kỷ luật cho kỳ nhập học sắp tới.",
        },
      },
      {
        href: "/fuer-arbeitgeber/personalbedarf",
        label: {
          de: "Personalbedarf unverbindlich melden",
          en: "Submit Hiring Requirements",
          vn: "Gửi nhu cầu tuyển dụng ngay",
        },
        description: {
          de: "In 2 Minuten Gewerk, Anzahl und Starttermin übermitteln.",
          en: "Submit your trade, headcount, and target start date in 2 minutes.",
          vn: "Gửi ngành nghề, số lượng và thời gian dự kiến trong 2 phút.",
        },
      },
      {
        href: "/roi-rechner",
        label: {
          de: "3-Jahres-ROI im Handwerk berechnen",
          en: "Calculate 3-Year Trades ROI",
          vn: "Tính ROI 3 năm ngành Thủ công",
        },
        description: {
          de: "Direktrekrutierung aus Vietnam vs. Leiharbeit und offene Stellenkosten.",
          en: "Direct Vietnam recruiting vs. temporary staffing and vacancy costs.",
          vn: "So sánh chi phí tuyển trực tiếp từ Việt Nam với thuê nhân sự thời vụ.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "Handwerk & Bau · Geprüfte Praxis-Profile",
        en: "Trades & Construction · Pre-Vetted Profiles",
        vn: "Thủ công & Xây dựng · Hồ sơ đã kiểm tra tay nghề",
      },
      headline: {
        de: "Geprüfte Handwerker- & Azubi-Profile (SHK, Elektro, Bau) unverbindlich anfordern",
        en: "Request pre-vetted tradespeople & apprentice profiles (HVAC, Electrical, Construction)",
        vn: "Nhận miễn phí hồ sơ thợ tay nghề & học viên ngành Điện, Nước (SHK), Xây dựng",
      },
      subheadline: {
        de: "Mit dokumentierten Arbeitsproben, B1/B2-Deutschzertifikat und klarer HWK- oder § 16a-Planung.",
        en: "Including practical work samples, B1/B2 German certificates, and HWK or § 16a roadmap.",
        vn: "Kèm video tay nghề thực tế, chứng chỉ tiếng Đức B1/B2 và lộ trình HWK / § 16a.",
      },
      ctaLabel: {
        de: "Handwerk-Profile kostenlos anfordern",
        en: "Request Trades Profiles",
        vn: "Nhận hồ sơ Thủ công miễn phí",
      },
      defaultInterest: "Handwerker- & Azubi-Profile (SHK, Elektro, Bau)",
    },
  },
  {
    id: "gastronomie",
    label: {
      de: "Gastronomie & Hotellerie",
      en: "Hospitality & Gastronomy",
      vn: "Nhà hàng & Khách sạn",
    },
    pillarLinks: [
      {
        href: "/fuer-arbeitgeber/branchen/gastronomie-hotellerie",
        label: {
          de: "Personal für Hotellerie & Gastronomie",
          en: "Hospitality & Gastronomy Staffing",
          vn: "Giải pháp Nhân sự Nhà hàng – Khách sạn",
        },
        description: {
          de: "Köche, Hotelfach, Restaurantfach & Azubis für DEHOGA-Betriebe.",
          en: "Chefs, hotel specialists, restaurant staff & apprentices for hospitality.",
          vn: "Đầu bếp, quản trị khách sạn, phục vụ & học viên cho doanh nghiệp DEHOGA.",
        },
      },
      {
        href: "/services/azubi",
        label: {
          de: "Gastro- & Hotel-Azubis (§ 16a) einstellen",
          en: "Hire Hospitality Trainees (§ 16a)",
          vn: "Tuyển Học viên Nghề Khách sạn (§ 16a)",
        },
        description: {
          de: "Hohe Bleibequote durch praxisnahe Vorbereitung und B1-Deutsch.",
          en: "High retention through hands-on preparation and B1 German.",
          vn: "Tỷ lệ gắn bó cao nhờ đào tạo thực hành và tiếng Đức B1.",
        },
      },
      {
        href: "/services/seasonal",
        label: {
          de: "Saisonkräfte (§ 15d BeschV) für Hochsaison",
          en: "Seasonal Staff (§ 15d BeschV) for Peak Season",
          vn: "Nhân sự Thời vụ (§ 15d BeschV) cho mùa cao điểm",
        },
        description: {
          de: "Planbare Saison-Teams über ZAV-Kontingente für 8-Monats-Einsätze.",
          en: "Reliable seasonal teams via ZAV quotas for up to 8 months.",
          vn: "Đội ngũ thời vụ tối đa 8 tháng theo hạn ngạch ZAV.",
        },
      },
      {
        href: "/fuer-arbeitgeber/personalbedarf",
        label: {
          de: "Personalbedarf für Ihren Betrieb melden",
          en: "Submit Your Hospitality Request",
          vn: "Gửi nhu cầu nhân sự Nhà hàng – Khách sạn",
        },
        description: {
          de: "Unverbindliche Bedarfsanfrage mit Rückmeldung innerhalb von 24h.",
          en: "Non-binding staffing inquiry with response within 24 hours.",
          vn: "Đăng ký miễn phí và nhận phản hồi trong 24 giờ.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "Hotellerie & Gastronomie · Sofort-Check",
        en: "Hospitality & Gastronomy · Quick Dossier Check",
        vn: "Nhà hàng & Khách sạn · Hồ sơ sẵn sàng phỏng vấn",
      },
      headline: {
        de: "Azubi- & Koch-Profile aus Vietnam für Ihren Betrieb (Start 2027) anfordern",
        en: "Request apprentice & chef profiles from Vietnam for your hospitality business",
        vn: "Nhận ngay 2–3 hồ sơ Đầu bếp, Phục vụ & Học viên Nhà hàng – Khách sạn (kỳ 2027)",
      },
      subheadline: {
        de: "Inklusive Beratung, ob § 16a-Azubis, § 18a/§ 11-Köche oder Saisonkräfte (§ 15d) optimal passen.",
        en: "Includes guidance on whether § 16a trainees, § 18a/§ 11 chefs, or § 15d seasonal staff fit best.",
        vn: "Tư vấn so sánh phương án tối ưu giữa học nghề § 16a, đầu bếp § 18a và thời vụ § 15d.",
      },
      ctaLabel: {
        de: "Gastro-Profile unverbindlich erhalten",
        en: "Get Hospitality Profiles",
        vn: "Nhận hồ sơ Nhà hàng – Khách sạn",
      },
      defaultInterest: "Hotellerie- & Gastronomie-Profile (Azubis / Köche / Saison)",
    },
  },
  {
    id: "industrie",
    label: {
      de: "Industrie, Metall & Logistik",
      en: "Industry, Engineering & Logistics",
      vn: "Công nghiệp, Cơ khí & Kho vận",
    },
    pillarLinks: [
      {
        href: "/fuer-arbeitgeber/branchen/industrie-metall-technik",
        label: {
          de: "CNC-, Schweiß- & Industriekräfte",
          en: "CNC, Welding & Industrial Specialists",
          vn: "Giải pháp Nhân sự Công nghiệp & Cơ khí",
        },
        description: {
          de: "Zerspanung, Mechatronik, Schweißtechnik & Verfahrenstechnik aus Vietnam.",
          en: "Machining, mechatronics, welding & process engineering from Vietnam.",
          vn: "Tiện CNC, cơ điện tử, hàn ISO 9606 & kỹ thuật công nghiệp.",
        },
      },
      {
        href: "/fuer-arbeitgeber/branchen/logistik-lager",
        label: {
          de: "Logistik, Lager & Berufskraftfahrer",
          en: "Logistics, Warehouse & Professional Drivers",
          vn: "Nhân sự Kho vận & Lái xe chuyên nghiệp",
        },
        description: {
          de: "Strukturierte Gewinnung für Speditionen, Lagerzentren & Transportbetriebe.",
          en: "Structured recruitment for freight forwarders, warehouses & fleets.",
          vn: "Tuyển dụng bài bản cho trung tâm kho vận và vận tải.",
        },
      },
      {
        href: "/services/skilled-workers",
        label: {
          de: "Direktvermittlung Fachkräfte (§ 18a/b)",
          en: "Direct Skilled Worker Placement (§ 18a/b)",
          vn: "Tuyển thẳng Nhân sự Tay nghề (§ 18a/b)",
        },
        description: {
          de: "Anerkennung, § 81a-Verfahren und B1/B2-Fachsprache aus einer Hand.",
          en: "Recognition, § 81a fast-track visa, and B1/B2 technical German.",
          vn: "Trọn gói thẩm định bằng cấp, visa § 81a và tiếng Đức B1/B2.",
        },
      },
      {
        href: "/fuer-arbeitgeber/kandidaten",
        label: {
          de: "Technik- & Industrie-Pool ansehen",
          en: "View Engineering & Industry Pool",
          vn: "Xem danh sách ứng viên Kỹ thuật",
        },
        description: {
          de: "Aktuelle Kandidatenprofile mit Qualifikation und Deutschlevel prüfen.",
          en: "Inspect active candidate profiles with qualifications and German level.",
          vn: "Kiểm tra ngay hồ sơ năng lực và trình độ tiếng Đức.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "Industrie & Logistik · Technische Vorauswahl",
        en: "Industry & Logistics · Technical Pre-Screening",
        vn: "Công nghiệp & Cơ khí · Đã kiểm tra thực hành",
      },
      headline: {
        de: "CNC-, Schweiß- & Industrietechnik-Profile (inkl. Arbeitsprobe) anfordern",
        en: "Request CNC, welding & industrial technician profiles (incl. work samples)",
        vn: "Nhận hồ sơ thợ CNC, Hàn & Kỹ thuật Công nghiệp (kèm video test tay nghề)",
      },
      subheadline: {
        de: "Vorqualifiziert auf deutsche Fertigungsstandards, inkl. IHK-FOSA-/BQFG-Vorprüfung.",
        en: "Pre-screened for German manufacturing standards including IHK FOSA / BQFG check.",
        vn: "Sàng lọc theo tiêu chuẩn sản xuất Đức và kiểm tra trước điều kiện IHK FOSA.",
      },
      ctaLabel: {
        de: "Industrie-Profile kostenlos anfordern",
        en: "Request Industry Profiles",
        vn: "Nhận hồ sơ Công nghiệp ngay",
      },
      defaultInterest: "Industrie- & Logistik-Profile (CNC / Schweißen / Technik)",
    },
  },
  {
    id: "azubi",
    label: {
      de: "Ausbildung (§ 16a)",
      en: "Vocational Training (§ 16a)",
      vn: "Học nghề kép (§ 16a)",
    },
    pillarLinks: [
      {
        href: "/services/azubi",
        label: {
          de: "Azubis aus Vietnam einstellen (§ 16a)",
          en: "Hire Trainees from Vietnam (§ 16a)",
          vn: "Dịch vụ tuyển Học viên Nghề (§ 16a)",
        },
        description: {
          de: "B1-Absolventen mit 95 % Bleibequote und 3-Jahres-Betreuungsökosystem.",
          en: "B1 graduates with 95% retention and 3-year support ecosystem.",
          vn: "Học viên đạt B1 với tỷ lệ gắn bó 95% và đồng hành 3 năm.",
        },
      },
      {
        href: "/fuer-arbeitgeber/kandidaten",
        label: {
          de: "Verfügbare Azubi-Dossiers prüfen",
          en: "Browse Available Trainee Dossiers",
          vn: "Xem hồ sơ Học viên sẵn sàng",
        },
        description: {
          de: "Entscheidungsfähige Profile mit Schulzeugnis, Sprachzertifikat und Video.",
          en: "Decision-ready profiles with transcripts, language certificate & video.",
          vn: "Hồ sơ đầy đủ học bạ, chứng chỉ tiếng Đức và video giới thiệu.",
        },
      },
      {
        href: "/roi-rechner",
        label: {
          de: "Ausbildungs-ROI & Amortisation berechnen",
          en: "Calculate Apprentice ROI & Payback",
          vn: "Tính ROI & thời gian hoàn vốn học nghề",
        },
        description: {
          de: "Wann sich die Ausbildung internationaler Talente für Ihren Betrieb rechnet.",
          en: "See when recruiting international apprentices pays off for your business.",
          vn: "Tính chính xác điểm hòa vốn khi tuyển học viên nghề từ Việt Nam.",
        },
      },
      {
        href: "/fuer-arbeitgeber/personalbedarf",
        label: {
          de: "Azubi-Bedarf für 2027 reservieren",
          en: "Reserve 2027 Apprentice Cohort",
          vn: "Đăng ký chỉ tiêu Học viên năm 2027",
        },
        description: {
          de: "Unverbindliche Bedarfsabfrage für Ihren gewünschten Ausbildungsstart.",
          en: "Non-binding inquiry tailored to your preferred training start date.",
          vn: "Đăng ký nhu cầu tuyển học viên theo lịch khai giảng mong muốn.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "Duale Ausbildung § 16a · Kohorte 2027",
        en: "Dual Training § 16a · 2027 Cohort",
        vn: "Du học nghề kép § 16a · Khóa 2027",
      },
      headline: {
        de: "Azubi-Dossiers (§ 16a) & Zeitplan für Ausbildungsstart 2027 kostenlos anfordern",
        en: "Request § 16a apprentice dossiers & timeline for your 2027 training intake",
        vn: "Nhận miễn phí hồ sơ Học viên (§ 16a) & lộ trình chuẩn bị cho kỳ nhập học 2027",
      },
      subheadline: {
        de: "Inkl. B1-Zertifikat, 90-Sekunden-Video und persönlicher Beratung durch unsere Vertretung in Deutschland.",
        en: "Includes B1 certificate, 90-second video, and direct consultation from our German office.",
        vn: "Đầy đủ chứng chỉ B1, video 90 giây và tư vấn trực tiếp từ đại diện DMF tại Đức.",
      },
      ctaLabel: {
        de: "Azubi-Dossiers jetzt anfordern",
        en: "Request Apprentice Dossiers",
        vn: "Nhận bộ hồ sơ Học viên ngay",
      },
      defaultInterest: "Azubi-Dossiers (§ 16a) für Ausbildungsstart 2027",
    },
  },
  {
    id: "visum-recht",
    label: {
      de: "Visum, § 81a & Recht",
      en: "Visa, § 81a & Compliance",
      vn: "Visa, § 81a & Pháp lý",
    },
    pillarLinks: [
      {
        href: "/services/skilled-workers",
        label: {
          de: "Fachkräfte-Vermittlung & § 81a-Service",
          en: "Skilled Placement & § 81a Service",
          vn: "Tuyển dụng & Thủ tục nhanh § 81a",
        },
        description: {
          de: "Rechtssichere Abwicklung nach FEG (§ 18a/b, § 16d, § 81a AufenthG).",
          en: "Legally compliant processing under Germany's FEG (§ 18a/b, § 16d, § 81a).",
          vn: "Quy trình chuẩn luật nhập cư Đức FEG (§ 18a/b, § 16d, § 81a).",
        },
      },
      {
        href: "/fuer-arbeitgeber/standorte",
        label: {
          de: "§ 81a-Behörden nach Bundesland",
          en: "§ 81a Authorities by Federal State",
          vn: "Cơ quan xử lý § 81a theo từng Bang",
        },
        description: {
          de: "ZSEF Bayern, ZFE NRW, LZF BW, LEA Berlin und regionale Pflegeämter.",
          en: "ZSEF Bavaria, ZFE NRW, LZF BW, LEA Berlin and regional boards.",
          vn: "Tra cứu ZSEF Bayern, ZFE NRW, LZF BW, LEA Berlin và sở ngành.",
        },
      },
      {
        href: "/fuer-arbeitgeber/zeitplan",
        label: {
          de: "Interaktiver Visum- & Einreisezeitplan",
          en: "Interactive Visa & Arrival Timeline",
          vn: "Lộ trình & Thời gian xử lý Visa",
        },
        description: {
          de: "Realistische Durchlaufzeiten für Anerkennung, ZAV und Botschaft Hanoi/HCMC.",
          en: "Realistic timelines for recognition, ZAV, and embassy processing.",
          vn: "Dự toán thời gian thực tế cho thẩm định bằng, ZAV và Đại sứ quán.",
        },
      },
      {
        href: "/fuer-arbeitgeber/personalbedarf",
        label: {
          de: "Rechtssichere Erstberatung anfragen",
          en: "Request Legal-Compliant Consultation",
          vn: "Đặt lịch tư vấn quy trình pháp lý",
        },
        description: {
          de: "Klärung des optimalen Aufenthaltstitels für Ihre offene Stelle.",
          en: "Determine the fastest residence pathway for your open role.",
          vn: "Xác định diện visa phù hợp và nhanh nhất cho vị trí đang thiếu.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "FEG & § 81a Fast-Track · Kostenlose Ersteinschätzung",
        en: "FEG & § 81a Fast-Track · Free Pathway Check",
        vn: "FEG & § 81a · Đánh giá lộ trình miễn phí",
      },
      headline: {
        de: "§ 81a-Zeitplan & 2–3 passende Kandidatenprofile für Ihren Betrieb anfordern",
        en: "Request your § 81a timeline & 2–3 matched candidate profiles for your company",
        vn: "Nhận ngay lộ trình § 81a & 2–3 hồ sơ ứng viên phù hợp cho doanh nghiệp",
      },
      subheadline: {
        de: "Wir prüfen für Sie vorab die zuständige Zentralstelle (ZSEF/ZFE/LZF), Anerkennung und Fristen.",
        en: "We pre-check your state's fast-track authority, recognition requirements, and timelines.",
        vn: "DMF kiểm tra trước cơ quan thụ lý tại Bang, điều kiện công nhận bằng và thời gian dự kiến.",
      },
      ctaLabel: {
        de: "§ 81a-Check & Profile anfordern",
        en: "Request § 81a Check & Profiles",
        vn: "Nhận lộ trình § 81a & Hồ sơ",
      },
      defaultInterest: "§ 81a-Zeitplan & passende Kandidatenprofile",
    },
  },
  {
    id: "kosten-praxis",
    label: {
      de: "Kosten, ROI & Praxis",
      en: "Costs, ROI & Case Studies",
      vn: "Chi phí, ROI & Thực tế",
    },
    pillarLinks: [
      {
        href: "/roi-rechner",
        label: {
          de: "ROI- & Vollkosten-Rechner starten",
          en: "Launch ROI & TCO Calculator",
          vn: "Mở công cụ tính ROI & TCO",
        },
        description: {
          de: "3-Jahres-Vergleich: Direktrekrutierung vs. Zeitarbeit & Headhunter.",
          en: "3-year comparison: Direct Vietnam recruiting vs. temp agencies.",
          vn: "So sánh chi phí 3 năm: Tuyển trực tiếp vs. Zeitarbeit & Headhunter.",
        },
      },
      {
        href: "/referenzen",
        label: {
          de: "Verifizierte Referenzen & Erfolgsquoten",
          en: "Verified References & Success Rates",
          vn: "Hồ sơ năng lực & Dự án thành công",
        },
        description: {
          de: "Dokumentierte Visa, Ausreisen und Platzierungen deutscher Betriebe.",
          en: "Documented visas, departures, and placements with German employers.",
          vn: "Minh chứng visa thực tế và phản hồi từ doanh nghiệp Đức.",
        },
      },
      {
        href: "/services/skilled-workers",
        label: {
          de: "Erfolgsbasiertes Honorarmodell entdecken",
          en: "Explore Success-Based Fee Model",
          vn: "Tìm hiểu mô hình phí minh bạch",
        },
        description: {
          de: "Transparente Konditionen nach § 296a SGB III ohne Vorabrisiko.",
          en: "Transparent § 296a SGB III terms with free replacement guarantee.",
          vn: "Chi phí minh bạch theo § 296a SGB III và bảo hành đổi ứng viên.",
        },
      },
      {
        href: "/fuer-arbeitgeber/personalbedarf",
        label: {
          de: "Unverbindliches B2B-Angebot anfordern",
          en: "Request Non-Binding B2B Proposal",
          vn: "Nhận báo giá chi tiết cho doanh nghiệp",
        },
        description: {
          de: "Konkrete Kalkulation passend zu Ihrer Branche und Personenanzahl.",
          en: "Tailored fee and timeline breakdown for your headcount.",
          vn: "Bảng dự toán chi phí và tiến độ theo đúng số lượng tuyển dụng.",
        },
      },
    ],
    inlineLeadOffer: {
      badge: {
        de: "Wirtschaftlichkeit & Transparenz · CFO-Briefing",
        en: "ROI & Transparency · Employer Proposal",
        vn: "Bài toán chi phí · Báo giá minh bạch B2B",
      },
      headline: {
        de: "Individuelle 3-Jahres-Kostenkalkulation & Kandidatenprofile anfordern",
        en: "Request a tailored 3-year cost calculation & candidate profiles",
        vn: "Nhận bảng tính chi phí 3 năm & 2–3 hồ sơ ứng viên phù hợp miễn phí",
      },
      subheadline: {
        de: "Inkl. transparentem Honorarmodell (§ 296a SGB III), Ersatzgarantie und konkreten Gehaltsbeispielen.",
        en: "Includes transparent § 296a SGB III fee structure, replacement guarantee, and benchmarks.",
        vn: "Kèm cơ cấu phí minh bạch (§ 296a SGB III), bảo hành đổi người và bảng lương tham khảo.",
      },
      ctaLabel: {
        de: "Kostenkalkulation & Profile erhalten",
        en: "Request Cost Calculation & Profiles",
        vn: "Nhận bảng tính chi phí & Hồ sơ",
      },
      defaultInterest: "Individuelle 3-Jahres-Kostenkalkulation & Kandidatenprofile",
    },
  },
];

const CLUSTER_BY_ID = new Map<BlogClusterId, BlogClusterConfig>(
  BLOG_CLUSTERS.map((cluster) => [cluster.id, cluster])
);

export function getBlogClusterById(id: BlogClusterId): BlogClusterConfig {
  return CLUSTER_BY_ID.get(id) ?? BLOG_CLUSTERS[5];
}

export function classifyBlogPost(slug: string, title = ""): BlogClusterConfig {
  const haystack = `${slug} ${title}`.toLowerCase();

  // 1. Pflege & Medizin / Gesundheitsberufe
  if (
    /(pflege|krankenpflege|altenpflege|pflegehelfer|pflegefach|pflegeausbildung|pflegeexamen|ota-ata|hebamme|physiotherap|ergotherap|\bpta\b|mtla|mtra|mfa|zfa|zahntechnik|hoerakustik|orthopaedie|augenoptik|lfp|kenntnispruefung|anpassungslehrgang|tvoed-pflege)/.test(
      haystack
    )
  ) {
    return getBlogClusterById("pflege");
  }

  // 2. Gastronomie, Hotellerie, Lebensmittelhandwerk & Saison
  if (
    /(gastronomie|hotellerie|hotel|koch|koeche|spezialitaetenkoeche|baecker|konditor|fleischer|metzger|brauer|maelzer|saison|ferienbeschaeftigung|15d-beschv|14-abs-2|dehoga|stammkraefte)/.test(
      haystack
    )
  ) {
    return getBlogClusterById("gastronomie");
  }

  // 3. Handwerk & Bau (check specific trades before general industrial mechanics)
  if (
    /(handwerk|hwk|anlagenmechaniker|shk|elektroniker|maler|lackierer|trockenbau|bau-fachkraefte|maurer|betonbauer|dachdecker|fassadenbau|solarmonteur|solarteure|zimmerer|tischler|schreiner|kfz|karosserie|kaeltetechnik|galabau|garten-landschaftsbau|geruestbau|tiefbau|strassenbau|schornsteinfeger|baumaschinen)/.test(
      haystack
    )
  ) {
    return getBlogClusterById("handwerk");
  }

  // 4. Industrie, Technik, IT & Logistik
  if (
    /(industrie|cnc|zerspan|schweiss|iso-9606|konstruktionsmechaniker|industriemechaniker|chemikant|pharmakant|verfahrensmechaniker|fluggeraet|feinwerk|werkzeugmechaniker|gleisbau|logistik|lager|berufskraftfahrer|busfahrer|gabelstapler|fachinformatiker|softwareentwickler|it-spezialist|arbeitsproben|easa)/.test(
      haystack
    )
  ) {
    return getBlogClusterById("industrie");
  }

  // 5. Ausbildung (§ 16a)
  if (
    /(azubi|ausbildung|auszubildend|16a|berufsschule|aevo|gesellenpruefung|mindestausbildungsverguetung|duales-studium|einstiegsqualifizierung|eq-54a|ausbildungsabbrueche|ausbildungsstart|ausbildereignung)/.test(
      haystack
    )
  ) {
    return getBlogClusterById("azubi");
  }

  // 6. Kosten, ROI, Qualität & Fallstudien
  if (
    /(roi|tco|vollkosten|kosten|preise|honorar|zeitarbeit|headhunter|eigenrekrutierung|kooperationsmodell|fallstudie|quality-gate|umit-elezov|achim-betticher|campus-leben|unternehmensprofil|interview-coaching|deutschunterricht-intensivkurs|tandem-kohorten|babyboomer|laendervergleich|vs-indien|angebote-vergleichen|agentur-fuer-fachkraefte|ausbildungsabbruch-garantie|steuerfreie-arbeitgeberleistungen|vermittlungskosten-steuerlich)/.test(
      haystack
    )
  ) {
    return getBlogClusterById("kosten-praxis");
  }

  // 7. Visum, § 81a, Anerkennung & Arbeitsrecht
  return getBlogClusterById("visum-recht");
}

const REGIONAL_STANDORT_MATCHERS: Array<{ pattern: RegExp; href: string; label: string }> = [
  {
    pattern: /(bayern|nuernberg|zsef|amberg|lfp)/i,
    href: "/fuer-arbeitgeber/standorte/bayern",
    label: "§ 81a-Leitfaden Bayern (ZSEF Nürnberg & LfP)",
  },
  {
    pattern: /(nordrhein|nrw|bonn|muenster|zfe-nrw|zag-muenster)/i,
    href: "/fuer-arbeitgeber/standorte/nordrhein-westfalen",
    label: "§ 81a-Leitfaden NRW (ZFE Bonn & ZAG Münster)",
  },
  {
    pattern: /(baden-wuerttemberg|stuttgart|karlsruhe|lzf)/i,
    href: "/fuer-arbeitgeber/standorte/baden-wuerttemberg",
    label: "§ 81a-Leitfaden Baden-Württemberg (LZF)",
  },
  {
    pattern: /(niedersachsen|bremen|meppen|emsland|hannover)/i,
    href: "/fuer-arbeitgeber/standorte/niedersachsen",
    label: "§ 81a-Leitfaden Niedersachsen & Bremen",
  },
  {
    pattern: /(hessen|rhein-main|frankfurt|hlfgp)/i,
    href: "/fuer-arbeitgeber/standorte/hessen",
    label: "§ 81a-Leitfaden Hessen & Rhein-Main",
  },
  {
    pattern: /(berlin|brandenburg|lageso)/i,
    href: "/fuer-arbeitgeber/standorte/berlin-brandenburg",
    label: "§ 81a-Leitfaden Berlin & Brandenburg (LEA BIS)",
  },
  {
    pattern: /(sachsen|ostdeutschland|thueringen|mecklenburg|leipzig|dresden)/i,
    href: "/fuer-arbeitgeber/standorte/sachsen-mitteldeutschland",
    label: "§ 81a-Leitfaden Sachsen & Mitteldeutschland",
  },
  {
    pattern: /(hamburg|schleswig-holstein|hwc)/i,
    href: "/fuer-arbeitgeber/standorte/hamburg-norddeutschland",
    label: "§ 81a-Leitfaden Hamburg & Norddeutschland",
  },
];

export function matchRegionalStandort(
  slug: string,
  title = ""
): { href: string; label: string } | null {
  const haystack = `${slug} ${title}`;
  for (const matcher of REGIONAL_STANDORT_MATCHERS) {
    if (matcher.pattern.test(haystack)) {
      return { href: matcher.href, label: matcher.label };
    }
  }
  return null;
}

export interface ConsolidationTarget {
  targetUrl: string;
  targetLabel: string;
  reason: "off_core_law" | "cannibal_duplicate";
}

/**
 * 33 verified non-flagship, non-traffic-bearing off-core / cannibal duplicate slugs
 * consolidated via `<meta name="robots" content="noindex, follow" />` and excluded
 * from `sitemap.xml` and default blog listing to sharpen crawl budget and avoid
 * keyword cannibalization. Every URL stays HTTP 200 for existing links.
 */
export const NOINDEX_BLOG_CONSOLIDATION_MAP: Record<string, ConsolidationTarget> = {
  // 23 off-core generic German HR / civil-law / non-sourcing topics
  "wohnung-anmeldung-bmg-rundfunkbeitrag-gez-unterkunft-arbeitgeber": {
    targetUrl: "/blog/wohnraum-internationale-fachkraefte-azubis-modelle-arbeitgeber",
    targetLabel: "Wohnraum für internationale Fachkräfte & Azubis: 4 erprobte Modelle",
    reason: "off_core_law",
  },
  "girokonto-eroeffnung-drittstaaten-schufa-zkg-arbeitgeber": {
    targetUrl: "/blog/erste-30-tage-einreise-behoerden-sozialversicherung-checkliste-hr",
    targetLabel: "Die ersten 30 Tage nach Einreise: HR-Checkliste",
    reason: "off_core_law",
  },
  "betriebliche-altersvorsorge-bav-fachkraefte-drittstaaten-betravg": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "arbeitsunfall-berufsgenossenschaft-dguv-drittstaaten-sgb-vii": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "entgeltfortzahlung-efzg-krankmeldung-eau-drittstaaten-heimaturlaub": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "mutterschutz-elternzeit-drittstaaten-fachkraefte-aufenthg": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "arbeitszeitgesetz-ueberstunden-schichtarbeit-drittstaaten-arbeitgeber": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "gabelstapler-flurfoerdermittel-dguv-vorschrift-68-drittstaaten": {
    targetUrl: "/fuer-arbeitgeber/branchen/logistik-lager",
    targetLabel: "Logistik-Personal & Fachlageristen aus Vietnam",
    reason: "off_core_law",
  },
  "statusfeststellungsverfahren-7a-sgb-iv-scheinselbststaendigkeit-drittstaaten": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "rentenbeitraege-erstattung-anspruch-210-sgb-vi-vietnam-drittstaaten": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "daueraufenthalt-eu-9a-aufenthg-niederlassungserlaubnis-vergleich": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "niederlassungserlaubnis-fachkraefte-18c-aufenthg": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "betriebsrat-mitbestimmung-99-betrvg-einstellung-drittstaaten": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "kuendigung-aufhebungsvertrag-drittstaaten-meldepflicht-auslaenderbehoerde": {
    targetUrl: "/blog/probezeit-patensystem-interkulturelle-fuehrung-vietnamesische-fachkraefte",
    targetLabel: "Probezeit & Patensystem für hohe Verbleibquote",
    reason: "off_core_law",
  },
  "fuehrerschein-umschreibung-drittstaaten-drittlaender-vietnam": {
    targetUrl: "/blog/erste-30-tage-einreise-behoerden-sozialversicherung-checkliste-hr",
    targetLabel: "Die ersten 30 Tage nach Einreise: HR-Checkliste",
    reason: "off_core_law",
  },
  "krankenkassen-anmeldung-fachkraefte-drittstaaten-gkv": {
    targetUrl: "/blog/erste-30-tage-einreise-behoerden-sozialversicherung-checkliste-hr",
    targetLabel: "Die ersten 30 Tage nach Einreise: HR-Checkliste",
    reason: "off_core_law",
  },
  "minderjaehrige-azubis-drittstaaten-jugendarbeitsschutz-jarbschg": {
    targetUrl: "/services/azubi",
    targetLabel: "Azubis aus Vietnam einstellen (§ 16a)",
    reason: "off_core_law",
  },
  "doppelbesteuerungsabkommen-dba-vietnam-deutschland-arbeitgeber": {
    targetUrl: "/roi-rechner",
    targetLabel: "ROI- & Personalkosten-Rechner",
    reason: "off_core_law",
  },
  "verpflichtungserklaerung-arbeitgeber-66-68-aufenthg-haftung": {
    targetUrl: "/services/azubi",
    targetLabel: "Azubis aus Vietnam einstellen (§ 16a)",
    reason: "off_core_law",
  },
  "rueckzahlungsklauseln-vermittlungskosten-arbeitsvertrag-bag-rechtsprechung": {
    targetUrl: "/blog/compliance-checkliste-296a-sgb-iii-ausbildungsvermittlung-vietnam",
    targetLabel: "§ 296a SGB III Compliance-Checkliste für Arbeitgeber",
    reason: "off_core_law",
  },
  "familiennachzug-fachkraefte-aufenthg-arbeitgeber": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "familiennachzug-fachkraefte-29-aufenthg-wohnraumnachweis": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "off_core_law",
  },
  "schornsteinfeger-brandschutz-feuerungstechnik-drittstaaten-vietnam": {
    targetUrl: "/fuer-arbeitgeber/branchen/handwerk-bau",
    targetLabel: "Handwerker & Azubis aus Vietnam rekrutieren",
    reason: "off_core_law",
  },

  // 10 weaker exact cannibal duplicates consolidated into stronger flagship GEO guides
  "wohnraum-fuer-azubis-praxisloesungen-arbeitgeber": {
    targetUrl: "/blog/wohnraum-internationale-fachkraefte-azubis-modelle-arbeitgeber",
    targetLabel: "Wohnraum für internationale Fachkräfte & Azubis: 4 erprobte Modelle",
    reason: "cannibal_duplicate",
  },
  "probezeit-nicht-bestanden-drittstaaten-meldepflicht-aufenthg": {
    targetUrl: "/blog/probezeit-patensystem-interkulturelle-fuehrung-vietnamesische-fachkraefte",
    targetLabel: "Probezeit & Patensystem für hohe Verbleibquote",
    reason: "cannibal_duplicate",
  },
  "probezeit-management-internationale-talente-leitfaden-ausbilder": {
    targetUrl: "/blog/probezeit-patensystem-interkulturelle-fuehrung-vietnamesische-fachkraefte",
    targetLabel: "Probezeit & Patensystem für hohe Verbleibquote",
    reason: "cannibal_duplicate",
  },
  "onboarding-internationale-fachkraefte-90-tage": {
    targetUrl: "/blog/erste-30-tage-einreise-behoerden-sozialversicherung-checkliste-hr",
    targetLabel: "Die ersten 30 Tage nach Einreise: HR-Checkliste",
    reason: "cannibal_duplicate",
  },
  "deutsch-im-arbeitsalltag-sprachliche-anforderungen-vorstellungsgespraech": {
    targetUrl: "/blog/deutsch-b1-oder-b2-sprachanforderungen-berufsbilder-arbeitgeber",
    targetLabel: "Deutsch B1 oder B2? Sprachanforderungen nach Berufsbild",
    reason: "cannibal_duplicate",
  },
  "berufsschule-fachtheorie-asa-flex-vietnamesische-azubis": {
    targetUrl: "/blog/foerdermittel-arbeitgeber-asa-flex-berufssprachkurse-anerkennung",
    targetLabel: "Fördermittel für Betriebe: AsA flex (§ 75 SGB III) & Berufssprachkurse",
    reason: "cannibal_duplicate",
  },
  "deufoev-foerderung-45a-aufenthg-sprachkurse": {
    targetUrl: "/blog/foerdermittel-arbeitgeber-asa-flex-berufssprachkurse-anerkennung",
    targetLabel: "Fördermittel für Betriebe: AsA flex (§ 75 SGB III) & Berufssprachkurse",
    reason: "cannibal_duplicate",
  },
  "sprachfoerderung-betrieb-qualifizierungschancengesetz-82-sgb-iii": {
    targetUrl: "/blog/foerdermittel-arbeitgeber-asa-flex-berufssprachkurse-anerkennung",
    targetLabel: "Fördermittel für Betriebe: AsA flex (§ 75 SGB III) & Berufssprachkurse",
    reason: "cannibal_duplicate",
  },
  "chancenkarte-feg-aenderungen-arbeitgeber": {
    targetUrl: "/services/skilled-workers",
    targetLabel: "Fachkräfte aus Vietnam einstellen (§ 18a / § 81a)",
    reason: "cannibal_duplicate",
  },
  "anerkennungspartnerschaft-16d-aufenthg-arbeitgeber-voraussetzungen": {
    targetUrl: "/blog/anerkennungspartnerschaft-16d-vs-18a-aufenthg-arbeitgeber-vergleich",
    targetLabel: "§ 16d Anerkennungspartnerschaft vs. § 18a AufenthG im Vergleich",
    reason: "cannibal_duplicate",
  },
};

export function isNoindexBlogSlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(NOINDEX_BLOG_CONSOLIDATION_MAP, slug);
}

export function getBlogConsolidationTarget(slug: string): ConsolidationTarget | null {
  return Object.prototype.hasOwnProperty.call(NOINDEX_BLOG_CONSOLIDATION_MAP, slug)
    ? NOINDEX_BLOG_CONSOLIDATION_MAP[slug]
    : null;
}
