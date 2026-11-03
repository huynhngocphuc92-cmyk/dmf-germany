import type { CandidateCategory } from "@/app/admin/candidates/types";
import type { HiringService } from "@/lib/validations/hiring";

export interface BrancheFaqItem {
  question: { de: string; en: string; vn: string };
  answer: { de: string; en: string; vn: string };
}

export interface BrancheRoleItem {
  title: { de: string; en: string; vn: string };
  kldbCode: string;
  germanRequirement: "A2" | "B1" | "B2";
  pathway: { de: string; en: string; vn: string };
}

export interface BrancheVisualDiagram {
  src: string;
  title: { de: string; en: string; vn: string };
  caption: { de: string; en: string; vn: string };
}

export interface BrancheConfig {
  slug: string;
  assetKey: string;
  heroImage: string;
  competencySvg: BrancheVisualDiagram;
  processSvg: BrancheVisualDiagram;
  serviceType: HiringService;
  candidateCategories: CandidateCategory[];
  professionKeywords: string[];
  badge: { de: string; en: string; vn: string };
  title: { de: string; en: string; vn: string };
  subtitle: { de: string; en: string; vn: string };
  metaTitle: string;
  metaDescription: string;
  heroStats: Array<{
    value: string;
    label: { de: string; en: string; vn: string };
  }>;
  legalPathway: {
    paragraph: string;
    authority: { de: string; en: string; vn: string };
    timelineMonths: string;
    summary: { de: string; en: string; vn: string };
  };
  roles: BrancheRoleItem[];
  advantages: Array<{
    title: { de: string; en: string; vn: string };
    description: { de: string; en: string; vn: string };
  }>;
  faqs: BrancheFaqItem[];
}

export const BRANCHEN_CONFIGS: BrancheConfig[] = [
  {
    slug: "pflege-gesundheit",
    assetKey: "branche_pflege_hero_img",
    heroImage: "/images/branchen/pflege-hero.jpg",
    competencySvg: {
      src: "/images/blog/pflege-aufstiegsmodell-1plus2.svg",
      title: {
        de: "Kompetenz- & Aufstiegsmodell (1+2 Karrierepfad)",
        en: "1+2 Nursing Career Progression Model",
        vn: "Mô hình thăng tiến 1+2 ngành Điều dưỡng tại Đức",
      },
      caption: {
        de: "Sprachschonender Einstieg als Pflegehelfer (B1) mit direktem Übergang zur vollen Pflegefachkraft (B2).",
        en: "Structured entry as Care Assistant (B1) transitioning directly to Registered Nurse (B2).",
        vn: "Lộ trình từ Trợ lý Điều dưỡng (B1) lên Điều dưỡng viên chính thức (B2) giảm áp lực thi cử.",
      },
    },
    processSvg: {
      src: "/images/blog/verfahren-81a-ablauf.svg",
      title: {
        de: "Behördlicher Ablauf nach § 81a AufenthG",
        en: "Fast-Track § 81a AufenthG Procedure",
        vn: "Quy trình 4 bước xin Visa nhanh § 81a AufenthG",
      },
      caption: {
        de: "Von der Vollmacht über den Defizitbescheid und die ZAV-Vorabzustimmung bis zur Einreise.",
        en: "From power of attorney and recognition assessment to ZAV pre-approval and visa issuance.",
        vn: "Từ ủy quyền pháp lý, thẩm định bằng cấp tại Sở Y tế Bang đến chấp thuận ZAV và nhập cảnh.",
      },
    },
    serviceType: "skilled",
    candidateCategories: ["skilled", "azubi"],
    professionKeywords: [
      "pflege",
      "kranken",
      "altenpflege",
      "gesundheit",
      "nurse",
      "nursing",
      "medizin",
      "hebamme",
      "betreuung",
    ],
    badge: {
      de: "Pflege & Gesundheitswesen (§ 16a / § 18a AufenthG)",
      en: "Nursing & Healthcare (§ 16a / § 18a AufenthG)",
      vn: "Điều dưỡng & Y tế (§ 16a / § 18a AufenthG)",
    },
    title: {
      de: "Pflegefachkräfte & Pflege-Azubis aus Vietnam rekrutieren",
      en: "Recruit Qualified Nursing Staff & Apprentices from Vietnam",
      vn: "Tuyển dụng Điều dưỡng viên & Học viên Điều dưỡng từ Việt Nam",
    },
    subtitle: {
      de: "Kliniken, Pflegeheime und ambulante Dienste sichern ihre Schichtbesetzung langfristig mit sprachlich (B1/B2) und fachlich vorbereiteten Pflegekräften aus Vietnam.",
      en: "Hospitals, care homes, and outpatient services secure long-term staffing with B1/B2 German-certified nursing professionals and apprentices from Vietnam.",
      vn: "Giải pháp nhân sự điều dưỡng bền vững cho bệnh viện và viện dưỡng lão tại Đức với ứng viên đạt chuẩn B1/B2 và đào tạo chuyên môn bài bản.",
    },
    metaTitle: "Pflegefachkräfte & Pflege-Azubis aus Vietnam rekrutieren",
    metaDescription:
      "Qualifizierte Pflegefachkräfte (B2) und Auszubildende zur Pflegefachfrau / zum Pflegefachmann aus Vietnam für Kliniken, Seniorenheime und Pflegedienste in Deutschland.",
    heroStats: [
      {
        value: "B1 / B2",
        label: {
          de: "Goethe / telc / ÖSD Sprachzertifikat",
          en: "Certified German Level",
          vn: "Chứng chỉ tiếng Đức chuẩn quốc tế",
        },
      },
      {
        value: "4–6 Mon.",
        label: {
          de: "Durchlaufzeit im § 81a-Verfahren",
          en: "Fast-track § 81a visa timeline",
          vn: "Thời gian xử lý hồ sơ § 81a",
        },
      },
      {
        value: "> 92%",
        label: {
          de: "Verbleibquote nach 24 Monaten",
          en: "24-month retention rate",
          vn: "Tỷ lệ gắn bó sau 24 tháng",
        },
      },
    ],
    legalPathway: {
      paragraph: "§ 18a AufenthG (Fachkräfte) & § 16a AufenthG (Generalistische Pflegeausbildung)",
      authority: {
        de: "Landesamt für Pflege / Regierungspräsidium & ZAV (Bundesagentur für Arbeit)",
        en: "State Nursing Board & Federal Employment Agency (ZAV)",
        vn: "Sở Y tế / Cơ quan công nhận văn bằng Bang & ZAV",
      },
      timelineMonths: "4 bis 6 Monate",
      summary: {
        de: "Wir begleiten den gesamten Anerkennungsprozess (Defizitbescheid, Kenntnisprüfung oder Anpassungslehrgang) sowie das beschleunigte Fachkräfteverfahren nach § 81a AufenthG bis zum Dienstantritt in Ihrer Einrichtung.",
        en: "We manage the entire professional recognition process (Defizitbescheid, adaptation course, or knowledge exam) and fast-track § 81a visa processing until onboarding.",
        vn: "DMF đồng hành trọn gói từ bước thẩm định bằng cấp (Defizitbescheid), khóa chuyển đổi đến thủ tục visa nhanh § 81a cho tới khi nhận việc.",
      },
    },
    roles: [
      {
        title: {
          de: "Pflegefachfrau / Pflegefachmann (B.Sc. / College Nursing)",
          en: "Registered Nurse (B.Sc. / College Nursing)",
          vn: "Điều dưỡng viên Đa khoa (Đại học / Cao đẳng)",
        },
        kldbCode: "81302 / 82102",
        germanRequirement: "B2",
        pathway: {
          de: "§ 18a AufenthG mit Anerkennungspartnerschaft oder Defizitbescheid",
          en: "§ 18a AufenthG with recognition partnership or deficit notice",
          vn: "§ 18a AufenthG kèm công nhận bằng cấp / khóa chuyển đổi",
        },
      },
      {
        title: {
          de: "Auszubildende zur Pflegefachfrau / zum Pflegefachmann",
          en: "Nursing Apprentice (Generalistische Ausbildung)",
          vn: "Học viên Du học nghề Điều dưỡng Đa khoa",
        },
        kldbCode: "81302-Azubi",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a AufenthG (3-jährige generalistische Pflegeausbildung, ab B1/B2)",
          en: "§ 16a AufenthG (3-year vocational nursing training, B1/B2)",
          vn: "§ 16a AufenthG (Đào tạo nghề 3 năm tại Đức)",
        },
      },
      {
        title: {
          de: "Pflegehelfer / Gesundheits- und Krankenpflegehelfer",
          en: "Nursing Assistant / Care Assistant",
          vn: "Trợ lý Điều dưỡng / Chăm sóc người cao tuổi",
        },
        kldbCode: "81301 / 82101",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a / § 18a AufenthG inkl. Fachsprachkurs Pflege",
          en: "§ 16a / § 18a AufenthG including medical German training",
          vn: "§ 16a / § 18a AufenthG kèm tiếng Đức chuyên ngành Y điều dưỡng",
        },
      },
    ],
    advantages: [
      {
        title: {
          de: "Fachsprache Pflege vor Ausreise",
          en: "Medical German Before Departure",
          vn: "Đào tạo tiếng Đức chuyên ngành Y tế trước xuất cảnh",
        },
        description: {
          de: "Neben dem B1/B2-Zertifikat trainieren unsere Kandidaten Pflegedokumentation, Übergabegespräche und Patientenkommunikation.",
          en: "Beyond B1/B2 certification, candidates practice care documentation, shift handovers, and patient communication.",
          vn: "Ứng viên được luyện viết hồ sơ bệnh án, giao ban ca trực và giao tiếp với bệnh nhân trước khi bay.",
        },
      },
      {
        title: {
          de: "Vollständige Dokumentenmappe für Landesbehörden",
          en: "Complete Dossier for State Authorities",
          vn: "Hồ sơ pháp lý hoàn chỉnh cho Sở Y tế các Bang",
        },
        description: {
          de: "Beglaubigte Übersetzungen, Stundennachweise, Gesundheitszeugnis und Führungszeugnis liegen strukturiert für den Antrag nach § 81a vor.",
          en: "Certified translations, curriculum hours, medical fitness, and police clearance prepared for immediate § 81a filing.",
          vn: "Bảng điểm, khung chương trình, giấy khám sức khỏe và lý lịch tư pháp được dịch thuật công chứng sẵn sàng nộp § 81a.",
        },
      },
      {
        title: {
          de: "Reduzierung teurer Zeitarbeit",
          en: "Replace Expensive Agency Temp Staffing",
          vn: "Cắt giảm chi phí thuê nhân sự thời vụ đắt đỏ",
        },
        description: {
          de: "Bereits ab dem 5. Monat amortisiert sich die Rekrutierung gegenüber Leiharbeitskräften in der stationären und ambulanten Pflege.",
          en: "Full ROI achieved within 5 months compared to domestic temporary nursing agencies.",
          vn: "Hoàn vốn đầu tư tuyển dụng chỉ sau 5 tháng so với thuê điều dưỡng thời vụ (Leiharbeit) tại Đức.",
        },
      },
    ],
    faqs: [
      {
        question: {
          de: "Wie läuft die Anerkennung vietnamesischer Pflegeabschlüsse in Deutschland ab?",
          en: "How does recognition of Vietnamese nursing degrees work in Germany?",
          vn: "Quy trình công nhận bằng Điều dưỡng Việt Nam tại Đức diễn ra như thế nào?",
        },
        answer: {
          de: "Kandidaten mit einem 3- bis 4-jährigen vietnamesischen Pflegeabschluss (College/Bachelor) erhalten über das zuständige Landesamt einen Defizitbescheid oder reisen über eine Anerkennungspartnerschaft ein. Während der praktischen Tätigkeit als Pflegehelfer absolvieren sie den Anpassungslehrgang oder die Kenntnisprüfung zur vollen Anerkennung als Pflegefachkraft.",
          en: "Candidates with a 3-4 year Vietnamese nursing degree enter via a recognition partnership or deficit notice, working as nursing assistants while completing their adaptation course or knowledge exam.",
          vn: "Ứng viên tốt nghiệp Cao đẳng/Đại học Điều dưỡng sẽ xin Defizitbescheid hoặc đi theo diện Anerkennungspartnerschaft, vừa làm việc hưởng lương vừa hoàn thành khóa chuyển đổi để nhận bằng Pflegefachkraft chính thức.",
        },
      },
      {
        question: {
          de: "Welches Sprachniveau bringen Pflege-Azubis und Pflegefachkräfte mit?",
          en: "What German level do nursing apprentices and professionals have?",
          vn: "Ứng viên điều dưỡng có trình độ tiếng Đức tối thiểu là bao nhiêu?",
        },
        answer: {
          de: "Auszubildende verfügen mindestens über ein zertifiziertes B1-Niveau (häufig B2 bei Einreise), examinierte Pflegefachkräfte im Anerkennungsverfahren über B1+ bis B2 inklusive pflegespezifischem Kommunikationstraining.",
          en: "Apprentices hold at least certified B1 (often B2 upon arrival); skilled nurses hold B1+ to B2 plus specialized medical communication training.",
          vn: "Học viên nghề đạt tối thiểu B1 (nhiều hồ sơ đạt B2), điều dưỡng viên chuyển đổi bằng đạt B1+/B2 kèm tiếng Đức giao tiếp bệnh viện.",
        },
      },
    ],
  },
  {
    slug: "gastronomie-hotellerie",
    assetKey: "branche_gastro_hero_img",
    heroImage: "/images/branchen/gastronomie-hero.jpg",
    competencySvg: {
      src: "/images/blog/hotelfach-kompetenz-matrix.svg",
      title: {
        de: "DEHOGA-Kompetenzmatrix & Rotationsplan",
        en: "DEHOGA Hospitality Competency Matrix",
        vn: "Ma trận năng lực & Luân chuyển bộ phận chuẩn DEHOGA",
      },
      caption: {
        de: "Einsatzbereiche unserer Auszubildenden und Fachkräfte in Empfang, Service, Housekeeping und Küche.",
        en: "Deployment modules across Front Office, Restaurant Service, Housekeeping, and Culinary.",
        vn: "Các học phần nghiệp vụ Lễ tân, Nhà hàng, Buồng phòng và Bếp Âu được đào tạo bài bản.",
      },
    },
    processSvg: {
      src: "/images/blog/koeche-visum-11-beschv-ablauf.svg",
      title: {
        de: "Visum- & IHK-Zulassungsprozess für Gastgewerbe",
        en: "Visa & IHK Registration Workflow for Hospitality",
        vn: "Quy trình thẩm định IHK/ZAV và cấp Visa ngành Nhà hàng – Khách sạn",
      },
      caption: {
        de: "Strukturierter Ablauf für Auszubildende (§ 16a AufenthG) sowie Spezialitäten- und Fachköche.",
        en: "Structured pathway for hospitality apprentices (§ 16a AufenthG) and professional chefs.",
        vn: "Lộ trình pháp lý rõ ràng cho cả Học viên du học nghề (§ 16a) và Đầu bếp chuyên nghiệp.",
      },
    },
    serviceType: "azubi",
    candidateCategories: ["azubi", "skilled", "seasonal"],
    professionKeywords: [
      "koch",
      "küche",
      "hotel",
      "gastro",
      "restaurant",
      "service",
      "bäcker",
      "konditor",
      "hospitality",
      "culinary",
    ],
    badge: {
      de: "Hotellerie, Gastronomie & Systemgastronomie",
      en: "Hospitality, Hotels & Culinary Arts",
      vn: "Nhà hàng, Khách sạn & Ẩm thực",
    },
    title: {
      de: "Auszubildende, Köche & Saisonkräfte für Hotellerie & Gastronomie",
      en: "Apprentices, Chefs & Seasonal Staff for German Hotels & Restaurants",
      vn: "Tuyển dụng Học viên, Đầu bếp & Nhân sự Nhà hàng – Khách sạn",
    },
    subtitle: {
      de: "Verlässliche Auszubildende (Koch/Köchin, Hotelfach, Restaurantfach), erfahrene Küchenfachkräfte und Saisonkräfte zur Sicherung Ihres Hotel- und Gastronomiebetriebs.",
      en: "Reliable apprentices, experienced chefs, and seasonal hospitality staff for hotels, resorts, and restaurant groups across Germany.",
      vn: "Cung ứng học viên du học nghề, đầu bếp chuyên nghiệp và lao động thời vụ cho hệ thống khách sạn, khu nghỉ dưỡng và nhà hàng tại Đức.",
    },
    metaTitle: "Azubis & Fachkräfte Gastronomie / Hotellerie aus Vietnam",
    metaDescription:
      "Motivierte Auszubildende (Koch, Hotelfachmann, Restaurantfachmann), Fachkräfte und Saisonpersonal aus Vietnam für Hotels und Gastronomiebetriebe in Deutschland.",
    heroStats: [
      {
        value: "B1+",
        label: {
          de: "Sprachniveau inkl. Gastro-Vokabular",
          en: "German B1+ with hospitality vocabulary",
          vn: "Tiếng Đức B1+ kèm từ vựng Nhà hàng - Khách sạn",
        },
      },
      {
        value: "Aug. / Feb.",
        label: {
          de: "Pünktlich zum Ausbildungsstart",
          en: "Aligned with German intake dates",
          vn: "Đúng kỳ nhập học tháng 8/9 & tháng 2/3",
        },
      },
      {
        value: "100%",
        label: {
          de: "ZAV-Vorabprüfung & IHK-konform",
          en: "ZAV & IHK compliant dossiers",
          vn: "Hồ sơ chuẩn IHK & ZAV",
        },
      },
    ],
    legalPathway: {
      paragraph: "§ 16a AufenthG (Duale Ausbildung) / § 18a AufenthG (Köche & Fachkräfte)",
      authority: {
        de: "IHK (Industrie- und Handelskammer), ZAV & Ausländerbehörde",
        en: "Chamber of Industry and Commerce (IHK), ZAV & Immigration Office",
        vn: "Phòng Công nghiệp & Thương mại Đức (IHK) & ZAV",
      },
      timelineMonths: "3 bis 5 Monate",
      summary: {
        de: "Von der Eintragung des Ausbildungsvertrags bei der IHK über die ZAV-Zustimmung bis zur Wohnraumkoordination begleiten wir Ihren Betrieb durch den gesamten Prozess.",
        en: "From IHK training contract registration and ZAV approval to accommodation onboarding, we handle the full administrative workflow.",
        vn: "Hỗ trợ trọn gói từ đăng ký hợp đồng đào tạo tại IHK, xin chấp thuận ZAV cho tới hướng dẫn thủ tục nhà ở và hội nhập.",
      },
    },
    roles: [
      {
        title: {
          de: "Auszubildende Hotelfachfrau / Hotelfachmann (m/w/d)",
          en: "Hotel Management Apprentice (Hotelfach)",
          vn: "Học viên Nghề Quản trị Khách sạn (Hotelfach)",
        },
        kldbCode: "63302",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a AufenthG (3-jährige duale Ausbildung nach IHK-Standard)",
          en: "§ 16a AufenthG (3-year dual IHK vocational training)",
          vn: "§ 16a AufenthG (Đào tạo nghề kép 3 năm chuẩn IHK)",
        },
      },
      {
        title: {
          de: "Auszubildende Koch / Köchin & Küchenfachkräfte",
          en: "Culinary Apprentice / Professional Chef",
          vn: "Học viên Nghề Đầu bếp & Đầu bếp Chuyên nghiệp",
        },
        kldbCode: "29302",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a AufenthG (Azubi) oder § 18a AufenthG (Fachkraft mit Berufserfahrung)",
          en: "§ 16a AufenthG (Apprentice) or § 18a AufenthG (Experienced Chef)",
          vn: "§ 16a (Du học nghề) hoặc § 18a (Đầu bếp có bằng cấp & kinh nghiệm)",
        },
      },
      {
        title: {
          de: "Restaurantfachleute & Fachkräfte Systemgastronomie",
          en: "Restaurant Service & System Gastronomy Specialists",
          vn: "Nhân sự Nghề Nhà hàng & Chuỗi Ẩm thực",
        },
        kldbCode: "63322 / 63332",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a AufenthG / Saisonale Unterstützung für Spitzenzeiten",
          en: "§ 16a AufenthG / Seasonal support for peak periods",
          vn: "§ 16a AufenthG / Hỗ trợ nhân sự mùa cao điểm du lịch",
        },
      },
    ],
    advantages: [
      {
        title: {
          de: "Hohe Serviceorientierung & Belastbarkeit",
          en: "Strong Service Mindset & Reliability",
          vn: "Tác phong dịch vụ chuyên nghiệp & chịu khó",
        },
        description: {
          de: "Vietnamesische Talente zeichnen sich in der deutschen Hotellerie durch Höflichkeit, Teamgeist und hohe Bereitschaft für Schicht- und Wochenenddienste aus.",
          en: "Vietnamese hospitality talents are valued across Germany for courtesy, teamwork, and reliability in shift and weekend operations.",
          vn: "Ứng viên Việt Nam được các khách sạn Đức đánh giá rất cao về sự hiếu khách, kỷ luật và sẵn sàng làm việc theo ca.",
        },
      },
      {
        title: {
          de: "Praxisnahe Vorbereitung auf DEHOGA-Standards",
          en: "Practical Preparation for German Hotel Standards",
          vn: "Thực hành nghiệp vụ bàn, buồng, bếp trước khi bay",
        },
        description: {
          de: "Training in Tischkultur, Hygienestandards (HACCP), Rezeptionsabläufen und Speisekarten-Vokabular bereits in Vietnam.",
          en: "Pre-departure training in European table service, HACCP hygiene standards, front-office routines, and culinary German.",
          vn: "Được đào tạo trước về tiêu chuẩn vệ sinh HACCP, văn hóa bàn tiệc Âu và thuật ngữ lễ tân – nhà hàng bằng tiếng Đức.",
        },
      },
      {
        title: {
          de: "Geringe Ausbildungsabbruchquote",
          en: "Exceptionally Low Dropout Rate",
          vn: "Tỷ lệ bỏ ngang cực thấp so với mặt bằng chung",
        },
        description: {
          de: "Während im deutschen Gastgewerbe fast 45% der Ausbildungen vorzeitig gelöst werden, liegt die Verbleibquote unserer begleiteten Azubis bei über 90%.",
          en: "While domestic hospitality apprenticeships face ~45% dropout rates, our mentored candidates achieve over 90% completion.",
          vn: "Khắc phục triệt để tình trạng bỏ học nghề giữa chừng tại Đức nhờ quy trình sàng lọc kỹ và hỗ trợ quản lý sinh viên trong suốt 3 năm.",
        },
      },
    ],
    faqs: [
      {
        question: {
          de: "Muss unser Hotel den Wohnraum für Auszubildende aus Vietnam stellen?",
          en: "Does our hotel need to provide accommodation for apprentices from Vietnam?",
          vn: "Khách sạn tại Đức có bắt buộc phải có ký túc xá cho học viên không?",
        },
        answer: {
          de: "Für das Visumverfahren ist der Nachweis einer angemessenen Unterkunft für die ersten Monate entscheidend. Viele Hotels stellen ein Personalzimmer zur Verfügung; alternativ unterstützt DMF Talents bei der Organisation einer WG oder eines Azubi-Wohnheims in Betriebsnähe.",
          en: "Proof of initial accommodation is required for visa issuance. Many hotels provide staff rooms, or DMF Talents assists in arranging nearby shared housing.",
          vn: "Trong hồ sơ xin Visa cần xác nhận chỗ ở giai đoạn đầu. Nhiều khách sạn bố trí phòng nhân viên (Personalzimmer), hoặc DMF sẽ phối hợp tìm nhà trọ/ký túc xá gần nơi làm việc.",
        },
      },
      {
        question: {
          de: "Bis wann sollten wir den Bedarf für das Ausbildungsjahr August/September anmelden?",
          en: "When should we register our need for the August/September intake?",
          vn: "Doanh nghiệp nên đăng ký tuyển dụng trước bao lâu cho kỳ tháng 8/9?",
        },
        answer: {
          de: "Idealerweise 4 bis 5 Monate vor Ausbildungsbeginn (also März bis Mai). Dank bereits vorbereiteter B1-Kandidaten im DMF-Pool können wir im beschleunigten Verfahren (§ 81a AufenthG) auch kurzfristigere Einstiege realisieren.",
          en: "Ideally 4 to 5 months prior (March–May). With pre-certified B1 candidates in our pool and § 81a fast-track processing, shorter lead times are also possible.",
          vn: "Tối ưu nhất là trước 4–5 tháng (từ tháng 3 đến tháng 5). Tuy nhiên với nguồn ứng viên có sẵn bằng B1 và thủ tục nhanh § 81a, DMF vẫn xử lý kịp các đơn hàng gấp.",
        },
      },
    ],
  },
  {
    slug: "handwerk-bau",
    assetKey: "branche_handwerk_hero_img",
    heroImage: "/images/branchen/handwerk-hero.jpg",
    competencySvg: {
      src: "/images/blog/shk-waermepumpen-qualifikation.svg",
      title: {
        de: "Qualifikationsmatrix: SHK, Elektro & Gebäudetechnik",
        en: "Qualification Matrix: HVAC, Electrical & Building Tech",
        vn: "Ma trận kỹ năng thực hành: Điện, Nhiệt lạnh (SHK) & Xây dựng",
      },
      caption: {
        de: "Geprüfte Praxiskompetenzen in Rohrleitungsbau, Schaltschrankverdrahtung und moderner Haustechnik.",
        en: "Verified practical competencies in piping, electrical wiring, and modern building systems.",
        vn: "Các kỹ năng tay nghề thực tế được kiểm tra qua video trước khi phỏng vấn với chủ xưởng Đức.",
      },
    },
    processSvg: {
      src: "/images/blog/anerkennungspartnerschaft-stufen.svg",
      title: {
        de: "Anerkennungspartnerschaft (§ 16d AufenthG) mit der HWK",
        en: "Recognition Partnership (§ 16d AufenthG) with HWK",
        vn: "Lộ trình Hợp tác Công nhận Bằng cấp (§ 16d AufenthG) cùng HWK",
      },
      caption: {
        de: "Sofortiger Praxiseinsatz im Handwerksbetrieb bei paralleler Nachqualifizierung zur vollen HWK-Gleichwertigkeit.",
        en: "Immediate productive employment in your trade company alongside on-the-job HWK equivalence.",
        vn: "Thợ kỹ thuật sang Đức làm việc ngay và hoàn thiện chứng nhận tương đương HWK song song tại xưởng.",
      },
    },
    serviceType: "skilled",
    candidateCategories: ["skilled", "azubi"],
    professionKeywords: [
      "handwerk",
      "bau",
      "elektro",
      "shk",
      "sanitär",
      "heizung",
      "klima",
      "dachdecker",
      "tischler",
      "maler",
      "maurer",
      "kfz",
      "installateur",
    ],
    badge: {
      de: "Handwerk, Bau & Gebäudetechnik (HWK)",
      en: "Skilled Trades, Construction & Building Tech (HWK)",
      vn: "Thủ công nghiệp, Xây dựng & Kỹ thuật Tòa nhà (HWK)",
    },
    title: {
      de: "Handwerker, Elektroniker & SHK-Fachkräfte aus Vietnam",
      en: "Electricians, HVAC Technicians & Construction Trades from Vietnam",
      vn: "Tuyển dụng Thợ Điện, Cơ điện lạnh (SHK) & Xây dựng từ Việt Nam",
    },
    subtitle: {
      de: "Praxiserprobte Fachkräfte und motivierte Auszubildende für Elektrohandwerk, Sanitär-Heizung-Klima (SHK), Ausbaugewerke und KFZ-Betriebe.",
      en: "Hands-on skilled tradespeople and apprentices for electrical installation, HVAC/plumbing, construction, and automotive workshops.",
      vn: "Cung ứng thợ lành nghề và học viên kỹ thuật cho các doanh nghiệp Điện công trình, Cấp thoát nước – Nhiệt lạnh (SHK), Xây dựng và Ô tô tại Đức.",
    },
    metaTitle: "Handwerker & Azubis (Elektro, SHK, Bau) aus Vietnam rekrutieren",
    metaDescription:
      "Qualifizierte Handwerker und Auszubildende aus Vietnam für Elektro, SHK, Bauhauptgewerbe und KFZ-Betriebe inklusive HWK-Anerkennung und § 81a Visumservice.",
    heroStats: [
      {
        value: "HWK",
        label: {
          de: "Begleitung der Gleichwertigkeitsprüfung",
          en: "Full HWK equivalence support",
          vn: "Hỗ trợ thẩm định tay nghề tại HWK",
        },
      },
      {
        value: "A2 / B1",
        label: {
          de: "Sprachniveau + Fachbegriffe Baustelle",
          en: "German + technical trade vocabulary",
          vn: "Tiếng Đức + từ vựng kỹ thuật công trường",
        },
      },
      {
        value: "100%",
        label: {
          de: "Geprüfte praktische Arbeitsproben",
          en: "Verified practical work tests",
          vn: "Kiểm tra tay nghề thực tế qua video",
        },
      },
    ],
    legalPathway: {
      paragraph: "§ 18a AufenthG / Anerkennungspartnerschaft (§ 16d AufenthG) & § 16a Ausbildung",
      authority: {
        de: "Handwerkskammer (HWK), ZAV & lokale Ausländerbehörde",
        en: "Chamber of Skilled Crafts (HWK), ZAV & Immigration Office",
        vn: "Phòng Thủ công nghiệp Đức (HWK) & ZAV",
      },
      timelineMonths: "4 bis 6 Monate",
      summary: {
        de: "Über die neue Anerkennungspartnerschaft (§ 16d Abs. 3 AufenthG) können erfahrene Handwerker mit staatlich anerkanntem Berufsabschluss bereits ab A2/B1 einreisen und die volle HWK-Gleichwertigkeit betriebsbegleitend in Deutschland abschließen.",
        en: "Via Germany's Recognition Partnership (§ 16d(3) AufenthG), experienced tradespeople can start working in your company while completing full HWK equivalence on the job.",
        vn: "Theo diện Hợp tác công nhận bằng cấp mới (§ 16d Abs. 3 AufenthG), thợ kỹ thuật có thể sang Đức làm việc ngay từ trình độ A2/B1 và hoàn thiện chứng nhận HWK song song tại doanh nghiệp.",
      },
    },
    roles: [
      {
        title: {
          de: "Elektroniker für Energie- und Gebäudetechnik (m/w/d)",
          en: "Electrician for Energy & Building Technology",
          vn: "Thợ Điện năng lượng & Kỹ thuật tòa nhà",
        },
        kldbCode: "26212",
        germanRequirement: "B1",
        pathway: {
          de: "§ 18a / § 16d AufenthG (HWK-Anerkennung) oder § 16a Ausbildung",
          en: "§ 18a / § 16d AufenthG (HWK recognition) or § 16a apprenticeship",
          vn: "§ 18a / § 16d AufenthG (Thẩm định HWK) hoặc § 16a Du học nghề",
        },
      },
      {
        title: {
          de: "Anlagenmechaniker für Sanitär-, Heizungs- und Klimatechnik (SHK)",
          en: "HVAC & Plumbing Technician (SHK)",
          vn: "Kỹ thuật viên Điện nước – Nhiệt – Điều hòa (SHK)",
        },
        kldbCode: "34212",
        germanRequirement: "B1",
        pathway: {
          de: "§ 18a AufenthG / § 16a Duale Ausbildung im SHK-Handwerk",
          en: "§ 18a AufenthG / § 16a dual vocational training in HVAC",
          vn: "§ 18a AufenthG / § 16a Đào tạo nghề kép ngành SHK",
        },
      },
      {
        title: {
          de: "Hochbaufacharbeiter, Maurer, Trockenbauer & KFZ-Mechatroniker",
          en: "Masons, Drywall Installers & Automotive Mechatronics",
          vn: "Thợ Xây dựng, Nội thất thạch cao & Cơ điện tử Ô tô",
        },
        kldbCode: "32102 / 25212",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a / § 18a AufenthG mit Video-Arbeitsprobe vorab",
          en: "§ 16a / § 18a AufenthG with pre-verified video skill assessment",
          vn: "§ 16a / § 18a AufenthG kèm video kiểm tra tay nghề thực tế",
        },
      },
    ],
    advantages: [
      {
        title: {
          de: "Video-Arbeitsproben vor dem Vorstellungsgespräch",
          en: "Video Skill Tests Before You Interview",
          vn: "Video kiểm tra tay nghề thực tế trước phỏng vấn",
        },
        description: {
          de: "Sie sehen vorab per Video, wie der Kandidat Schaltschränke verdrahtet, schweißt, lötet oder Werkzeuge nach deutschen Sicherheitsstandards einsetzt.",
          en: "Watch candidates wire control cabinets, weld, solder, or handle tools in verified video demonstrations before scheduling an interview.",
          vn: "Doanh nghiệp Đức xem trực tiếp video ứng viên đấu tủ điện, hàn ống, đọc bản vẽ kỹ thuật trước khi quyết định phỏng vấn.",
        },
      },
      {
        title: {
          de: "Nutzung der Anerkennungspartnerschaft (§ 16d AufenthG)",
          en: "Fast Entry via Recognition Partnership (§ 16d)",
          vn: "Tận dụng hành lang pháp lý mới § 16d AufenthG",
        },
        description: {
          de: "Kein monatelanges Warten auf den vollen Gleichwertigkeitsbescheid im Ausland: Die Fachkraft kann sofort produktiv im Betrieb mitarbeiten.",
          en: "No waiting months abroad for full equivalence: candidates begin productive work in your company while completing any remaining qualification modules.",
          vn: "Rút ngắn thời gian chờ đợi: ứng viên sang Đức làm việc hưởng lương ngay trong thời gian hoàn tất thủ tục công nhận tương đương tại HWK.",
        },
      },
      {
        title: {
          de: "Langfristige Betriebstreue im Mittelstand",
          en: "Long-Term Loyalty for Familienbetriebe",
          vn: "Gắn bó lâu dài với các doanh nghiệp gia đình (Mittelstand)",
        },
        description: {
          de: "Unsere Handwerker und Azubis suchen eine dauerhafte Perspektive in Deutschland und sichern Ihre Auftragsabwicklung über Jahre.",
          en: "Our tradespeople and apprentices seek long-term careers in Germany, helping family-owned businesses clear their order backlog.",
          vn: "Giải quyết bài toán thiếu thợ lâu năm cho các xưởng và công ty kỹ thuật vừa và nhỏ tại Đức.",
        },
      },
    ],
    faqs: [
      {
        question: {
          de: "Wie können wir die handwerkliche Qualifikation eines Bewerbers vorab prüfen?",
          en: "How can we verify a candidate's practical trade skills in advance?",
          vn: "Làm sao doanh nghiệp Đức kiểm tra được tay nghề thực tế của thợ Việt Nam từ xa?",
        },
        answer: {
          de: "Neben den übersetzten Ausbildungszeugnissen erstellt DMF Talents auf Wunsch eine individuelle Video-Arbeitsprobe nach Ihren Vorgaben (z.B. Schweißnaht, Schaltung nach Schaltplan) sowie ein technisches Live-Fachgespräch mit Dolmetscher.",
          en: "Alongside translated trade certificates, DMF Talents arranges custom video skill demonstrations based on your specifications and live technical interviews with interpretation.",
          vn: "Ngoài hồ sơ bằng cấp dịch thuật, DMF tổ chức quay video bài thi tay nghề theo đúng đề bài của xưởng Đức (đấu mạch điện, hàn, gia công...) và phỏng vấn kỹ thuật trực tiếp.",
        },
      },
    ],
  },
  {
    slug: "industrie-metall-technik",
    assetKey: "branche_industrie_hero_img",
    heroImage: "/images/branchen/industrie-hero.jpg",
    competencySvg: {
      src: "/images/blog/cnc-zerspanung-fertigungskompetenz.svg",
      title: {
        de: "Kompetenzprofil: CNC-Zerspanung & Industriemechanik",
        en: "Competency Profile: CNC Machining & Industrial Mechanics",
        vn: "Hồ sơ năng lực Kỹ thuật viên CNC & Cơ khí Chính xác",
      },
      caption: {
        de: "Praxiserfahrung an Siemens Sinumerik, Heidenhain und Fanuc sowie Qualitätssicherung nach DIN EN ISO 9001.",
        en: "Hands-on experience with Siemens, Heidenhain, and Fanuc controls plus ISO 9001 quality metrology.",
        vn: "Kinh nghiệm lập trình, vận hành máy tiện/phay CNC và đo kiểm dung sai theo chuẩn ISO 9001.",
      },
    },
    processSvg: {
      src: "/images/blog/elektroniker-betriebstechnik-module.svg",
      title: {
        de: "IHK FOSA Fachmodule & Industriestandards",
        en: "IHK FOSA Technical Modules & Industrial Standards",
        vn: "Khung đối chiếu năng lực kỹ thuật chuẩn IHK FOSA",
      },
      caption: {
        de: "Systematischer Abgleich vietnamesischer Polytechnikum-Abschlüsse mit deutschen IHK-Referenzberufen.",
        en: "Systematic mapping of Vietnamese polytechnic diplomas to German IHK industrial professions.",
        vn: "Đối chiếu chương trình đào tạo Cao đẳng/Đại học Kỹ thuật Việt Nam với tiêu chuẩn nhà máy Đức.",
      },
    },
    serviceType: "skilled",
    candidateCategories: ["skilled", "azubi"],
    professionKeywords: [
      "cnc",
      "metall",
      "industrie",
      "maschinen",
      "mechatronik",
      "zerspanung",
      "schweiß",
      "technik",
      "ingenieur",
      "it",
      "produktion",
    ],
    badge: {
      de: "Industrie, Metallbau, CNC & Mechatronik (IHK FOSA)",
      en: "Manufacturing, CNC Machining & Mechatronics (IHK FOSA)",
      vn: "Công nghiệp, Cơ khí CNC, Hàn & Cơ điện tử (IHK FOSA)",
    },
    title: {
      de: "CNC-Fachkräfte, Industriemechaniker & technische Azubis rekrutieren",
      en: "Recruit CNC Machinists, Industrial Mechanics & Technical Apprentices",
      vn: "Tuyển dụng Kỹ thuật viên CNC, Cơ khí Công nghiệp & Điện tử",
    },
    subtitle: {
      de: "Qualifizierte Zerspanungsmechaniker, Mechatroniker, Schweißer und Ingenieure aus Vietnam für den deutschen Maschinen- und Anlagenbau.",
      en: "Qualified CNC machinists, mechatronics technicians, certified welders, and engineers from Vietnam for German manufacturing.",
      vn: "Đội ngũ kỹ thuật viên vận hành CNC, cơ điện tử, thợ hàn quốc tế và kỹ sư từ Việt Nam cho các nhà máy sản xuất công nghiệp tại Đức.",
    },
    metaTitle: "CNC-Fachkräfte, Industriemechaniker & Azubis aus Vietnam",
    metaDescription:
      "Technische Fachkräfte (CNC, Zerspanung, Mechatronik, Schweißtechnik) und gewerblich-technische Auszubildende aus Vietnam für den deutschen Mittelstand.",
    heroStats: [
      {
        value: "IHK FOSA",
        label: {
          de: "Strukturierte Berufsanerkennung",
          en: "Structured IHK FOSA recognition",
          vn: "Thẩm định văn bằng chuẩn IHK FOSA",
        },
      },
      {
        value: "FANUC / Siemens",
        label: {
          de: "Praxiserfahrung an modernen Steuerungen",
          en: "Hands-on CNC control experience",
          vn: "Kinh nghiệm vận hành hệ điều khiển CNC hiện đại",
        },
      },
      {
        value: "B1 / B2",
        label: {
          de: "Technisches Deutsch & Arbeitssicherheit",
          en: "Technical German & shopfloor safety",
          vn: "Tiếng Đức kỹ thuật & an toàn lao động",
        },
      },
    ],
    legalPathway: {
      paragraph: "§ 18a / § 18b AufenthG, Blaue Karte EU (§ 18g) & § 16a Technische Ausbildung",
      authority: {
        de: "IHK FOSA (Foreign Skills Approval), ZAV & Zentralstelle Fachkräfteeinwanderung",
        en: "IHK FOSA, ZAV & Central Immigration Authority",
        vn: "Cơ quan thẩm định kỹ năng nghề IHK FOSA & ZAV",
      },
      timelineMonths: "3 bis 5 Monate",
      summary: {
        de: "Wir gleichen die Lehrpläne vietnamesischer technischer Hochschulen und Berufskollegs präzise mit den deutschen IHK-Referenzberufen ab und beschleunigen die Einreise über § 81a AufenthG.",
        en: "We map Vietnamese polytechnic and engineering curricula directly to German IHK reference professions and accelerate entry via § 81a AufenthG.",
        vn: "Đối chiếu chi tiết bảng điểm Cao đẳng nghề/Đại học Bách khoa tại Việt Nam với khung nghề chuẩn IHK FOSA của Đức để rút ngắn tối đa thời gian xét duyệt.",
      },
    },
    roles: [
      {
        title: {
          de: "Zerspanungsmechaniker / CNC-Fräser & CNC-Dreher (m/w/d)",
          en: "CNC Machinist / Milling & Turning Specialist",
          vn: "Kỹ thuật viên Gia công Cơ khí chính xác / Phay & Tiện CNC",
        },
        kldbCode: "24232",
        germanRequirement: "B1",
        pathway: {
          de: "§ 18a AufenthG / § 16d Anerkennungspartnerschaft mit IHK FOSA",
          en: "§ 18a AufenthG / § 16d Recognition Partnership with IHK FOSA",
          vn: "§ 18a / § 16d AufenthG thẩm định qua IHK FOSA",
        },
      },
      {
        title: {
          de: "Industriemechaniker, Mechatroniker & Elektroniker Betriebstechnik",
          en: "Industrial Mechanic, Mechatronics & Industrial Electrician",
          vn: "Kỹ thuật viên Cơ khí Công nghiệp, Cơ điện tử & Điện nhà máy",
        },
        kldbCode: "25102 / 25122 / 26222",
        germanRequirement: "B1",
        pathway: {
          de: "§ 18a AufenthG (Fachkraft) oder § 16a (3,5-jährige IHK-Ausbildung)",
          en: "§ 18a AufenthG (Skilled Worker) or § 16a (3.5-year IHK apprenticeship)",
          vn: "§ 18a (Thợ bậc cao/Kỹ sư) hoặc § 16a (Du học nghề công nghiệp 3,5 năm)",
        },
      },
      {
        title: {
          de: "Konstruktionsmechaniker & Zertifizierte Schweißer (MAG / WIG / MIG)",
          en: "Structural Mechanics & Certified Welders (MAG / TIG / MIG)",
          vn: "Thợ Kết cấu Thép & Thợ Hàn Công nghiệp chứng chỉ quốc tế (MAG/TIG/MIG)",
        },
        kldbCode: "24412 / 24302",
        germanRequirement: "B1",
        pathway: {
          de: "§ 18a AufenthG inkl. ISO 9606 Schweißerprüfungsnachweisen",
          en: "§ 18a AufenthG including ISO 9606 welding certifications",
          vn: "§ 18a AufenthG kèm chứng chỉ hàn tiêu chuẩn ISO 9606",
        },
      },
    ],
    advantages: [
      {
        title: {
          de: "Starke MINT-Ausbildung in Vietnam",
          en: "Strong STEM & Technical Foundation",
          vn: "Nền tảng đào tạo Bách khoa – Kỹ thuật vững chắc",
        },
        description: {
          de: "Absolventen technischer Universitäten und Berufshochschulen in Hanoi und Ho-Chi-Minh-Stadt bringen fundierte Kenntnisse in CAD/CAM, Technischem Zeichnen und Fertigungstechnik mit.",
          en: "Graduates from leading polytechnics in Hanoi and HCMC bring solid training in CAD/CAM, technical drawing, and modern manufacturing.",
          vn: "Ứng viên tốt nghiệp từ các trường Đại học/Cao đẳng Kỹ thuật lớn tại Việt Nam đọc hiểu tốt bản vẽ ISO, dung sai và quy trình vận hành máy.",
        },
      },
      {
        title: {
          de: "Bereitschaft für Mehrschichtbetrieb",
          en: "Ready for Multi-Shift Production",
          vn: "Sẵn sàng làm việc theo ca kíp công nghiệp (2–3 ca)",
        },
        description: {
          de: "Zuverlässige Besetzung von 2- und 3-Schicht-Systemen in der Serienfertigung und im Maschinenbau.",
          en: "Reliable staffing for 2-shift and 3-shift industrial production lines.",
          vn: "Đảm bảo nhân sự ổn định cho các dây chuyền sản xuất vận hành 2–3 ca liên tục tại Đức.",
        },
      },
      {
        title: {
          de: "Transparente Gesamtkosten über unseren ROI-Rechner",
          en: "Transparent Total Cost & ROI",
          vn: "Chi phí minh bạch, hoàn vốn nhanh",
        },
        description: {
          de: "Keine versteckten laufenden Gebühren – klare Einmalvergütung nach erfolgreichem Meilensteinfortschritt.",
          en: "No hidden recurring fees — transparent milestone-based recruitment structure.",
          vn: "Cấu trúc phí rõ ràng theo từng cột mốc hồ sơ, giúp nhà máy Đức giảm thiểu thiệt hại do máy dừng vì thiếu thợ.",
        },
      },
    ],
    faqs: [
      {
        question: {
          de: "Können vietnamesische Ingenieure auch direkt über die Blaue Karte EU eingestellt werden?",
          en: "Can Vietnamese engineers be hired directly via the EU Blue Card?",
          vn: "Kỹ sư Việt Nam có thể sang Đức theo diện Thẻ Xanh Châu Âu (Blaue Karte EU) không?",
        },
        answer: {
          de: "Ja. Sofern ein in der Datenbank ANABIN mit H+ bewerteter vietnamesischer Hochschulabschluss vorliegt und das Gehalt die aktuelle Schwelle für Engpassberufe nach § 18g AufenthG erfüllt, ist die Einreise ohne langwierige Gleichwertigkeitsprüfung binnen weniger Wochen möglich.",
          en: "Yes. With an ANABIN H+ recognized university degree and a salary meeting the § 18g AufenthG shortage occupation threshold, EU Blue Card entry is possible within weeks.",
          vn: "Hoàn toàn được. Với bằng Đại học kỹ thuật nằm trong danh sách H+ trên hệ thống ANABIN và mức lương đạt ngưỡng ngành thiếu hụt (§ 18g AufenthG), kỹ sư có thể xin EU Blue Card cực nhanh mà không cần chờ thẩm định IHK FOSA.",
        },
      },
    ],
  },
  {
    slug: "logistik-lager",
    assetKey: "branche_logistik_hero_img",
    heroImage: "/images/branchen/logistik-hero.jpg",
    competencySvg: {
      src: "/images/blog/berufskraftfahrer-anerkennung-pfad.svg",
      title: {
        de: "Qualifikations- & Einsatzpfade in Lager & Logistik",
        en: "Qualification & Deployment Pathways in Logistics",
        vn: "Lộ trình đào tạo & bố trí nhân sự Kho vận – Logistics",
      },
      caption: {
        de: "Stufenmodell für Fachlageristen, Fachkräfte für Lagerlogistik, Kommissionierung und Fuhrpark.",
        en: "Structured deployment for warehouse specialists, order picking, and logistics operations.",
        vn: "Mô hình chuẩn hóa cho nhân viên kho vận, vận hành xe nâng, đóng gói và điều phối đơn hàng.",
      },
    },
    processSvg: {
      src: "/images/blog/zav-vorabzustimmung-zeitstrahl.svg",
      title: {
        de: "ZAV-Vorabzustimmung (§ 31 AufenthV) Zeitvorteil",
        en: "ZAV Pre-Approval (§ 31 AufenthV) Time Advantage",
        vn: "So sánh tiến độ rút gọn qua ZAV Vorabzustimmung (§ 31 AufenthV)",
      },
      caption: {
        de: "Planbare Einreise zum Schicht- oder Saisonstart dank proaktiver Vorabprüfung durch die Bundesagentur für Arbeit.",
        en: "Predictable arrival for shift or seasonal peaks via proactive Federal Employment Agency pre-approval.",
        vn: "Rút ngắn một nửa thời gian chờ Visa nhờ xin chấp thuận trước từ Cơ quan Lao động Liên bang Đức (ZAV).",
      },
    },
    serviceType: "seasonal",
    candidateCategories: ["seasonal", "skilled", "azubi"],
    professionKeywords: [
      "logistik",
      "lager",
      "fahrer",
      "stapler",
      "spedition",
      "transport",
      "kommissionier",
      "ernte",
      "saison",
      "warehouse",
    ],
    badge: {
      de: "Logistik, Lagerwirtschaft & Saisonpersonal",
      en: "Logistics, Warehousing & Seasonal Operations",
      vn: "Kho vận, Logistics & Nhân sự Thời vụ",
    },
    title: {
      de: "Fachlageristen, Logistik-Azubis & Saisonkräfte aus Vietnam",
      en: "Warehouse Specialists, Logistics Apprentices & Seasonal Workers",
      vn: "Tuyển dụng Nhân sự Kho vận, Học viên Logistics & Lao động Thời vụ",
    },
    subtitle: {
      de: "Planbare Personalverstärkung für Logistikzentren, Großhandel, Speditionen sowie saisonale Arbeitsspitzen in Produktion und Landwirtschaft.",
      en: "Predictable workforce reinforcement for logistics hubs, wholesale distribution, freight forwarding, and seasonal production peaks.",
      vn: "Bổ sung nguồn nhân lực ổn định, kỷ luật cho trung tâm phân phối, kho vận, giao nhận và các đợt cao điểm sản xuất – nông nghiệp tại Đức.",
    },
    metaTitle: "Logistik-Personal, Fachlageristen & Saisonkräfte aus Vietnam",
    metaDescription:
      "Zuverlässige Fachkräfte für Lagerlogistik, Auszubildende und Saisonkräfte aus Vietnam für Speditionen, Logistikzentren und Saisonbetriebe in Deutschland.",
    heroStats: [
      {
        value: "A2 / B1",
        label: {
          de: "Einsatzbereites Deutsch für Lager & Versand",
          en: "Practical German for warehouse operations",
          vn: "Tiếng Đức thực hành trong kho vận & điều phối",
        },
      },
      {
        value: "Planbar",
        label: {
          de: "Rechtzeitige Kontingente für Saisonspitzen",
          en: "Predictable cohorts for peak seasons",
          vn: "Chủ động số lượng lớn cho mùa cao điểm",
        },
      },
      {
        value: "100%",
        label: {
          de: "Rechtskonforme ZAV-Abwicklung",
          en: "100% legally compliant ZAV processing",
          vn: "Tuân thủ 100% quy định pháp lý ZAV",
        },
      },
    ],
    legalPathway: {
      paragraph:
        "§ 16a AufenthG (Fachkraft für Lagerlogistik), § 18a AufenthG & Saisonbeschäftigung",
      authority: {
        de: "IHK, Bundesagentur für Arbeit (ZAV) & Ausländerbehörden",
        en: "IHK, Federal Employment Agency (ZAV) & Immigration Authorities",
        vn: "IHK & Cơ quan Lao động Liên bang Đức (ZAV)",
      },
      timelineMonths: "3 bis 5 Monate",
      summary: {
        de: "Ob mehrjährige Ausbildung zur Fachkraft für Lagerlogistik, qualifizierte Lagerwirtschaft oder zeitlich befristete Saisonunterstützung – wir strukturieren den rechtssicheren Einsatzpfad für Ihr Logistikzentrum.",
        en: "Whether 3-year warehouse logistics apprenticeships, skilled logistics staff, or seasonal peak reinforcement, we structure a legally compliant deployment pathway.",
        vn: "Tư vấn lộ trình pháp lý phù hợp nhất cho doanh nghiệp: từ đào tạo nghề 2–3 năm (Fachlagerist / Fachkraft für Lagerlogistik) đến nhân sự kho vận chuyên nghiệp và lao động thời vụ.",
      },
    },
    roles: [
      {
        title: {
          de: "Fachkraft für Lagerlogistik / Fachlagerist (Ausbildung & Fachkraft)",
          en: "Warehouse Logistics Specialist (Apprentice & Skilled)",
          vn: "Nhân viên & Học viên Nghề Quản lý Kho vận (Lagerlogistik)",
        },
        kldbCode: "51312",
        germanRequirement: "B1",
        pathway: {
          de: "§ 16a AufenthG (2- bzw. 3-jährige IHK-Ausbildung) oder § 18a AufenthG",
          en: "§ 16a AufenthG (2- or 3-year IHK training) or § 18a AufenthG",
          vn: "§ 16a AufenthG (Đào tạo nghề 2–3 năm) hoặc § 18a AufenthG",
        },
      },
      {
        title: {
          de: "Kommissionierer, Verpackungs- & Versandmitarbeiter (Saison / Vollzeit)",
          en: "Order Pickers, Packing & Dispatch Staff",
          vn: "Nhân viên Soạn hàng, Đóng gói & Điều phối Đơn hàng",
        },
        kldbCode: "51311",
        germanRequirement: "A2",
        pathway: {
          de: "Saisonale Kontingente / Ausbildungsbegleitende Beschäftigung",
          en: "Seasonal cohorts / training-integrated employment",
          vn: "Nhân sự thời vụ theo đợt / Lao động kết hợp đào tạo",
        },
      },
      {
        title: {
          de: "Kaufleute für Spedition und Logistikdienstleistung (Azubi)",
          en: "Freight Forwarding & Logistics Services Apprentice",
          vn: "Học viên Nghề Điều hành Giao nhận & Vận tải Quốc tế",
        },
        kldbCode: "51622",
        germanRequirement: "B2",
        pathway: {
          de: "§ 16a AufenthG für Bewerber mit starkem B2-Deutsch & Englisch",
          en: "§ 16a AufenthG for candidates with strong German B2 & English",
          vn: "§ 16a AufenthG dành cho ứng viên giỏi tiếng Đức B2 & tiếng Anh",
        },
      },
    ],
    advantages: [
      {
        title: {
          de: "Sorgfalt bei Scanner-, ERP- und Kommissioniersystemen",
          en: "Precision with WMS, Scanners & ERP Workflows",
          vn: "Thao tác chính xác với hệ thống quản lý kho (WMS/ERP)",
        },
        description: {
          de: "Schnelle Einarbeitung in digitale Lagerverwaltungssysteme, Pick-by-Voice/Pick-by-Scan und Qualitätskontrolle.",
          en: "Rapid onboarding into digital warehouse management systems, pick-by-scan workflows, and quality control.",
          vn: "Làm quen nhanh với thiết bị quét mã vạch, quy trình đóng gói tiêu chuẩn Đức và kiểm soát chất lượng hàng hóa.",
        },
      },
      {
        title: {
          de: "Gruppenrekrutierung für neue Standorte & Schichtlinien",
          en: "Cohort Hiring for New Warehouses & Shift Lines",
          vn: "Tuyển dụng theo nhóm đồng bộ cho kho mới hoặc ca mới",
        },
        description: {
          de: "Wir stellen abgestimmte Teams von 5 bis 20 Mitarbeitenden zusammen, die gemeinsam sprachlich vorbereitet werden und zeitgleich starten.",
          en: "We assemble coordinated cohorts of 5 to 20 candidates trained together to launch simultaneously at your facility.",
          vn: "Cung ứng theo đội nhóm từ 5–20 nhân sự được đào tạo cùng nhau và nhập cảnh đồng loạt để vận hành ca mới.",
        },
      },
      {
        title: {
          de: "Rechtssichere Dokumentation & Betreuung",
          en: "Full Legal Compliance & On-Site Support",
          vn: "Pháp lý minh bạch & Hỗ trợ quản lý tại Đức",
        },
        description: {
          de: "Klare Vertragsstrukturen nach deutschem Arbeits- und Aufenthaltsrecht ohne Grauzonen.",
          en: "Transparent employment structures strictly aligned with German labor and residence law.",
          vn: "Hợp đồng và thủ tục cư trú minh bạch theo đúng luật lao động CHLB Đức.",
        },
      },
    ],
    faqs: [
      {
        question: {
          de: "Wie schnell können wir eine Gruppe von 5–10 Auszubildenden oder Lagerkräften aufbauen?",
          en: "How quickly can we assemble a cohort of 5–10 logistics apprentices or warehouse staff?",
          vn: "Mất bao lâu để tuyển một nhóm 5–10 nhân sự kho vận từ Việt Nam?",
        },
        answer: {
          de: "Aus unserem bestehenden Bewerberpool können wir innerhalb von 14 Tagen passende Profile für Video-Interviews vorstellen. Nach Vertragsunterzeichnung dauert das Visumverfahren über § 81a AufenthG in der Regel 3 bis 5 Monate.",
          en: "From our active candidate pool, we present shortlisted profiles for video interviews within 14 days, followed by 3–5 months for § 81a fast-track visa processing.",
          vn: "Từ nguồn ứng viên có sẵn của DMF, doanh nghiệp có thể phỏng vấn qua video trong vòng 14 ngày. Sau khi ký hợp đồng, thủ tục visa nhanh § 81a mất khoảng 3–5 tháng.",
        },
      },
    ],
  },
];

export const BRANCHEN_SLUGS = BRANCHEN_CONFIGS.map((b) => b.slug);

export function getBrancheBySlug(slug: string): BrancheConfig | undefined {
  return BRANCHEN_CONFIGS.find((b) => b.slug === slug);
}
