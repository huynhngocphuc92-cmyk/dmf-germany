"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  GraduationCap,
  Heart,
  Languages,
  Handshake,
  BookOpen,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  Shield,
  Star,
  Target,
  Lightbulb,
  UserCheck,
  BadgeCheck,
  Building2,
  Stethoscope,
  ChefHat,
  Wrench,
  HeartHandshake,
  FileCheck,
  Home,
  X,
  Check,
  CircleDot,
  Rocket,
  MessageCircle,
} from "lucide-react";

// ============================================
// CONTENT DATA
// ============================================

const heroContent = {
  de: {
    badge: "Ausbildung §16a AufenthG",
    headline: "Langfristige Personalsicherung",
    headlineAccent: "durch motivierte Auszubildende.",
    subheadline:
      "Verbinden Sie deutsche Ausbildungsqualität mit vietnamesischem Fleiß. Eine Investition in Loyalität und Zukunft.",
    cta1: "Azubi-Profile entdecken",
    cta2: "Beratung anfordern",
    stats: [
      { value: "18-23", label: "Jahre alt" },
      { value: "B1+", label: "Deutschniveau" },
      { value: "90%", label: "Bleibequote" },
    ],
  },
  vn: {
    badge: "Du học nghề §16a AufenthG",
    headline: "Đảm bảo nhân sự dài hạn",
    headlineAccent: "qua học viên đầy động lực.",
    subheadline:
      "Kết hợp chất lượng đào tạo Đức với sự cần cù Việt Nam. Một khoản đầu tư vào sự trung thành và tương lai.",
    cta1: "Khám phá hồ sơ học viên",
    cta2: "Yêu cầu tư vấn",
    stats: [
      { value: "18-23", label: "Tuổi" },
      { value: "B1+", label: "Trình độ tiếng Đức" },
      { value: "90%", label: "Tỷ lệ ở lại" },
    ],
  },
};

const advantagesContent = {
  de: {
    badge: "Warum Azubis aus Vietnam?",
    title: "3 Gründe für vietnamesische Azubis",
    subtitle: "Nachhaltige Lösung für Ihren Fachkräftemangel",
    advantages: [
      {
        icon: Heart,
        title: "Hohe Arbeitsmoral",
        description:
          "Diszipliniert, respektvoll und lernbereit – kulturell verankerte Werte, besonders wertvoll in der Pflege und im Handwerk.",
        highlight: "Respekt vor dem Lehrmeister",
        highlightDesc: "Kulturelle Stärke",
      },
      {
        icon: Handshake,
        title: "Langfristige Bindung",
        description:
          "Vietnamesische Azubis suchen eine neue Heimat. Hohe Bleibequote nach der Ausbildung statt Job-Hopping.",
        highlight: "90% Bleibequote",
        highlightDesc: "Kein Job-Hopping",
      },
      {
        icon: Shield,
        title: "Rundum-Betreuung",
        description:
          "Wir übernehmen Behördengänge und Integration. Sie konzentrieren sich zu 100% auf die fachliche Ausbildung.",
        highlight: "100% Fokus",
        highlightDesc: "Auf Ihre Kernaufgabe",
      },
    ],
  },
  vn: {
    badge: "Tại sao chọn học viên Việt Nam?",
    title: "3 lý do chọn học viên Việt Nam",
    subtitle: "Giải pháp bền vững cho tình trạng thiếu hụt nhân sự",
    advantages: [
      {
        icon: Heart,
        title: "Tinh thần làm việc cao",
        description:
          "Kỷ luật, tôn trọng và ham học – những giá trị văn hóa sâu sắc, đặc biệt quý trong ngành Điều dưỡng và Thủ công.",
        highlight: "Tôn sư trọng đạo",
        highlightDesc: "Sức mạnh văn hóa",
      },
      {
        icon: Handshake,
        title: "Gắn bó lâu dài",
        description:
          "Học viên Việt Nam tìm kiếm một ngôi nhà mới. Tỷ lệ ở lại cao sau đào tạo thay vì nhảy việc.",
        highlight: "90% ở lại",
        highlightDesc: "Không nhảy việc",
      },
      {
        icon: Shield,
        title: "Hỗ trợ toàn diện",
        description:
          "Chúng tôi đảm nhận thủ tục hành chính và hội nhập. Bạn tập trung 100% vào đào tạo chuyên môn.",
        highlight: "100% Tập trung",
        highlightDesc: "Vào nhiệm vụ chính",
      },
    ],
  },
};

// ============================================
// DMF QUALITY STANDARD CONTENT
// ============================================

const qualityStandardContent = {
  de: {
    badge: "DMF Qualitäts-Standard",
    title: "Ganzheitliche Vorbereitung & Begleitung",
    subtitle: "Von der Sprachausbildung bis zur erfolgreichen Integration",
    leftColumn: {
      title: "Vorbereitung in Vietnam",
      icon: GraduationCap,
      items: [
        { text: "Intensiv-Sprachkurse (B1/B2)", icon: Languages },
        { text: "Fachsprache-Training (Medizin/Technik)", icon: BookOpen },
        { text: "Interkulturelle Workshops", icon: Users },
        { text: "Deutsche Arbeitskultur", icon: Building2 },
      ],
    },
    rightColumn: {
      title: "Begleitung in Deutschland",
      icon: HeartHandshake,
      items: [
        { text: "24/7 Ansprechpartner", icon: MessageCircle },
        { text: "Wohnungssuche & Einzug", icon: Home },
        { text: "Behördenservice komplett", icon: FileCheck },
        { text: "Laufende Betreuung (3 Jahre)", icon: Shield },
      ],
    },
  },
  vn: {
    badge: "Tiêu chuẩn chất lượng DMF",
    title: "Chuẩn bị & Đồng hành toàn diện",
    subtitle: "Từ đào tạo ngôn ngữ đến hội nhập thành công",
    leftColumn: {
      title: "Chuẩn bị tại Việt Nam",
      icon: GraduationCap,
      items: [
        { text: "Khóa tiếng Đức chuyên sâu (B1/B2)", icon: Languages },
        { text: "Đào tạo ngôn ngữ chuyên ngành (Y tế/Kỹ thuật)", icon: BookOpen },
        { text: "Hội thảo giao thoa văn hóa", icon: Users },
        { text: "Văn hóa làm việc Đức", icon: Building2 },
      ],
    },
    rightColumn: {
      title: "Đồng hành tại Đức",
      icon: HeartHandshake,
      items: [
        { text: "Hỗ trợ 24/7", icon: MessageCircle },
        { text: "Tìm & dọn nhà", icon: Home },
        { text: "Dịch vụ thủ tục trọn gói", icon: FileCheck },
        { text: "Đồng hành liên tục (3 năm)", icon: Shield },
      ],
    },
  },
};

// ============================================
// SIMPLE PROCESS CONTENT
// ============================================

const processContent = {
  de: {
    badge: "Einfacher Prozess",
    title: "4 Schritte zu Ihrem Azubi",
    subtitle: "Schnell, transparent und unkompliziert",
    steps: [
      {
        number: "01",
        title: "Bedarfsanalyse",
        description: "Wir besprechen Ihre Anforderungen und den Zeitplan",
        icon: Target,
      },
      {
        number: "02",
        title: "Video-Interview",
        description: "Sie lernen passende Kandidaten persönlich kennen",
        icon: MessageCircle,
      },
      {
        number: "03",
        title: "Visa-Service",
        description: "Wir kümmern uns um alle Formalitäten",
        icon: FileCheck,
      },
      {
        number: "04",
        title: "Ausbildungsstart",
        description: "Ihr Azubi beginnt motiviert in Deutschland",
        icon: Rocket,
      },
    ],
  },
  vn: {
    badge: "Quy trình đơn giản",
    title: "4 bước để có học viên",
    subtitle: "Nhanh chóng, minh bạch và đơn giản",
    steps: [
      {
        number: "01",
        title: "Phân tích nhu cầu",
        description: "Chúng tôi trao đổi về yêu cầu và lịch trình của bạn",
        icon: Target,
      },
      {
        number: "02",
        title: "Phỏng vấn Video",
        description: "Bạn gặp gỡ trực tiếp các ứng viên phù hợp",
        icon: MessageCircle,
      },
      {
        number: "03",
        title: "Dịch vụ Visa",
        description: "Chúng tôi lo tất cả thủ tục giấy tờ",
        icon: FileCheck,
      },
      {
        number: "04",
        title: "Bắt đầu đào tạo",
        description: "Học viên của bạn bắt đầu với tinh thần cao tại Đức",
        icon: Rocket,
      },
    ],
  },
};

const talentShowcaseContent = {
  de: {
    badge: "Talent Pool",
    title: "Unsere Azubi-Kandidaten",
    subtitle: "Jung, motiviert und bereit für die Ausbildung in Deutschland",
    viewProfile: "Profil ansehen",
    requestInterview: "Interview anfragen",
    ageLabel: "Alter",
    educationLabel: "Schulabschluss",
    goalLabel: "Ausbildungswunsch",
    statusLabel: "Status",
  },
  vn: {
    badge: "Talent Pool",
    title: "Ứng viên Du học nghề",
    subtitle: "Trẻ, có động lực và sẵn sàng đào tạo tại Đức",
    viewProfile: "Xem hồ sơ",
    requestInterview: "Yêu cầu phỏng vấn",
    ageLabel: "Tuổi",
    educationLabel: "Học vấn",
    goalLabel: "Nguyện vọng",
    statusLabel: "Trạng thái",
  },
};

interface AzubiProfile {
  id: string;
  nameDe: string;
  nameVn: string;
  avatar: string;
  age: number;
  educationDe: string;
  educationVn: string;
  goalDe: string;
  goalVn: string;
  statusDe: string;
  statusVn: string;
  statusType: "ready" | "learning" | "interview";
  germanLevel: string;
  icon: React.ElementType;
}

const azubiProfiles: AzubiProfile[] = [
  {
    id: "AZB-01",
    nameDe: "Pham Thi Linh",
    nameVn: "Phạm Thị Linh",
    avatar: "PTL",
    age: 19,
    educationDe: "Abitur - Gut (2,0)",
    educationVn: "THPT - Giỏi (8.0)",
    goalDe: "Pflegefachfrau",
    goalVn: "Điều dưỡng",
    statusDe: "Interviewbereit",
    statusVn: "Sẵn sàng phỏng vấn",
    statusType: "ready",
    germanLevel: "B1",
    icon: Stethoscope,
  },
  {
    id: "AZB-02",
    nameDe: "Nguyen Van Tuan",
    nameVn: "Nguyễn Văn Tuấn",
    avatar: "NVT",
    age: 20,
    educationDe: "Abitur - Sehr gut (1,5)",
    educationVn: "THPT - Xuất sắc (8.5)",
    goalDe: "Koch",
    goalVn: "Đầu bếp",
    statusDe: "B2 in Vorbereitung",
    statusVn: "Đang học B2",
    statusType: "learning",
    germanLevel: "B1",
    icon: ChefHat,
  },
  {
    id: "AZB-03",
    nameDe: "Tran Minh Duc",
    nameVn: "Trần Minh Đức",
    avatar: "TMD",
    age: 21,
    educationDe: "Berufsschule - Gut",
    educationVn: "Trung cấp nghề - Giỏi",
    goalDe: "Elektroniker",
    goalVn: "Kỹ thuật điện",
    statusDe: "Interviewbereit",
    statusVn: "Sẵn sàng phỏng vấn",
    statusType: "ready",
    germanLevel: "B2",
    icon: Wrench,
  },
  {
    id: "AZB-04",
    nameDe: "Le Thi Hong",
    nameVn: "Lê Thị Hồng",
    avatar: "LTH",
    age: 18,
    educationDe: "Abitur - Gut (1,8)",
    educationVn: "THPT - Giỏi (8.2)",
    goalDe: "Altenpflegerin",
    goalVn: "Chăm sóc người cao tuổi",
    statusDe: "Im Interview",
    statusVn: "Đang phỏng vấn",
    statusType: "interview",
    germanLevel: "B1",
    icon: HeartHandshake,
  },
];

const supportEcosystemContent = {
  de: {
    badge: "3 Jahre Begleitung",
    title: "Unser Support-Ökosystem",
    subtitle: "Wir begleiten Ihre Azubis während der gesamten Ausbildung",
    years: [
      {
        year: "1",
        title: "Integration & Ankommen",
        description: "Wohnungssuche, Behördengänge, kulturelle Eingewöhnung, Sprachunterstützung",
        items: ["Anmeldung & Behörden", "Wohnungssuche", "Kulturtraining", "Sprachcoaching"],
        icon: Home,
      },
      {
        year: "2",
        title: "Ausbildung & Prüfung",
        description: "Begleitung bei Berufsschule, Prüfungsvorbereitung, Konfliktmanagement",
        items: ["Lernunterstützung", "Prüfungsvorbereitung", "Nachhilfe", "Mentoring"],
        icon: BookOpen,
      },
      {
        year: "3",
        title: "Abschluss & Übergang",
        description: "Prüfungsbegleitung, Visa-Umwandlung, Übernahmeunterstützung",
        items: ["Abschlussprüfung", "Visa-Umwandlung", "Arbeitsvertrag", "Karriereplanung"],
        icon: Award,
      },
    ],
  },
  vn: {
    badge: "Đồng hành 3 năm",
    title: "Hệ sinh thái hỗ trợ",
    subtitle: "Chúng tôi đồng hành cùng học viên trong suốt thời gian đào tạo",
    years: [
      {
        year: "1",
        title: "Hội nhập & Ổn định",
        description: "Tìm nhà, thủ tục hành chính, thích nghi văn hóa, hỗ trợ ngôn ngữ",
        items: ["Đăng ký cư trú", "Tìm nhà ở", "Đào tạo văn hóa", "Hỗ trợ ngôn ngữ"],
        icon: Home,
      },
      {
        year: "2",
        title: "Học tập & Thi cử",
        description: "Hỗ trợ trường nghề, ôn thi, giải quyết xung đột",
        items: ["Hỗ trợ học tập", "Ôn thi", "Phụ đạo", "Cố vấn"],
        icon: BookOpen,
      },
      {
        year: "3",
        title: "Tốt nghiệp & Chuyển đổi",
        description: "Hỗ trợ thi, chuyển đổi visa, hỗ trợ ký hợp đồng",
        items: ["Thi tốt nghiệp", "Chuyển đổi Visa", "Hợp đồng lao động", "Kế hoạch nghề nghiệp"],
        icon: Award,
      },
    ],
  },
};

const comparisonContent = {
  de: {
    badge: "Vergleich",
    title: "Azubis aus Vietnam vs. Deutschland",
    subtitle: "Objektive Vorteile der internationalen Rekrutierung",
    headers: {
      criteria: "Kriterium",
      vietnam: "Azubis aus Vietnam",
      germany: "Azubis aus Deutschland",
    },
    rows: [
      {
        criteria: "Verfügbarkeit",
        vietnam: "Hohe Anzahl motivierter Bewerber",
        vietnamPositive: true,
        germany: "Starker Bewerbermangel",
        germanyPositive: false,
      },
      {
        criteria: "Motivation",
        vietnam: "Sehr hoch – Karrierechance",
        vietnamPositive: true,
        germany: "Variabel",
        germanyPositive: false,
      },
      {
        criteria: "Abbruchquote",
        vietnam: "< 10% (sehr niedrig)",
        vietnamPositive: true,
        germany: "25-30% (Durchschnitt)",
        germanyPositive: false,
      },
      {
        criteria: "Loyalität",
        vietnam: "90% Übernahme nach Ausbildung",
        vietnamPositive: true,
        germany: "50-60% Übernahme",
        germanyPositive: false,
      },
      {
        criteria: "Kulturelle Anpassung",
        vietnam: "Interkulturelles Training inkl.",
        vietnamPositive: true,
        germany: "Nicht erforderlich",
        germanyPositive: true,
      },
    ],
  },
  vn: {
    badge: "So sánh",
    title: "Học viên Việt Nam vs. Đức",
    subtitle: "Lợi thế khách quan của tuyển dụng quốc tế",
    headers: {
      criteria: "Tiêu chí",
      vietnam: "Học viên Việt Nam",
      germany: "Học viên Đức",
    },
    rows: [],
  },
};

const statsContent = {
  de: {
    stats: [
      { value: "200", label: "Azubis vermittelt", suffix: "+", icon: Users },
      { value: "95", label: "Ausbildung abgeschlossen", suffix: "%", icon: Award },
      { value: "90", label: "Bleiben nach Abschluss", suffix: "%", icon: Handshake },
      { value: "3", label: "Jahre Begleitung", suffix: "", icon: HeartHandshake },
    ],
  },
  vn: {
    stats: [
      { value: "200", label: "Học viên đã giới thiệu", suffix: "+", icon: Users },
      { value: "95", label: "Hoàn thành đào tạo", suffix: "%", icon: Award },
      { value: "90", label: "Ở lại sau tốt nghiệp", suffix: "%", icon: Handshake },
      { value: "3", label: "Năm đồng hành", suffix: "", icon: HeartHandshake },
    ],
  },
};

const ctaContent = {
  de: {
    title: "Bereit für Ihre zukünftigen Fachkräfte?",
    subtitle: "Investieren Sie heute in motivierte Azubis aus Vietnam.",
    cta1: "Azubi-Profile anfordern",
    cta2: "Beratungsgespräch vereinbaren",
    highlight: "Nächster Ausbildungsstart: September 2026",
  },
  vn: {
    title: "Sẵn sàng cho nhân sự tương lai?",
    subtitle: "Đầu tư hôm nay vào học viên Việt Nam đầy động lực.",
    cta1: "Yêu cầu hồ sơ học viên",
    cta2: "Đặt lịch tư vấn",
    highlight: "Kỳ đào tạo tiếp theo: Tháng 9/2026",
  },
};

// ============================================
// ANIMATED COUNTER
// ============================================

function AnimatedCounter({
  value,
  suffix,
  duration = 2,
}: {
  value: string;
  suffix: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    if (value.includes("<") || value.includes("+") || value.includes("-")) {
      setDisplayValue(value);
      return;
    }

    const numericValue = parseInt(value);
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * numericValue);
      setDisplayValue(current.toString());
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.azubi.hero.badge,
    headline: t.service_pages.azubi.hero.headline,
    headline_accent: t.service_pages.azubi.hero.headline_accent,
    subheadline: t.service_pages.azubi.hero.subheadline,
    cta1: t.service_pages.azubi.hero.cta1,
    cta2: t.service_pages.azubi.hero.cta2,
    stats: [
      { value: "18-23", label: t.service_pages.azubi.hero.stats_age },
      { value: "B1+", label: t.service_pages.azubi.hero.stats_german },
      { value: "90%", label: t.service_pages.azubi.hero.stats_retention },
    ],
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Mesh Background - Blue Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-400/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full py-24 lg:py-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge className="mb-8 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm">
                <GraduationCap className="w-4 h-4 mr-2" />
                {content.badge}
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white">{content.headline}</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                {content.headline_accent}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              {content.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                asChild
              >
                <Link href="#talent-pool">
                  {content.cta1}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-slate-700 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {content.cta2}
                </Link>
              </Button>
            </div>

            {/* Mini Stats */}
            <div className="flex flex-wrap gap-8">
              {content.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block h-[550px]"
          >
            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-4 z-20"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-64">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Ausbildung</p>
                    <p className="text-slate-400 text-xs">3 Jahre Duale System</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  IHK/HWK Anerkannt
                </Badge>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-24 right-0 z-10"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-56">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Bleibequote</p>
                    <p className="text-white font-bold text-lg">90%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-32 left-12 z-20"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <Languages className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Deutschniveau</p>
                    <p className="text-white font-semibold">B1/B2 Garantiert</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-sky-400 h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-16 right-8 z-10"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-5 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">200+</div>
                  <div className="text-blue-300 text-xs font-medium">
                    {t.service_pages.azubi.stats.stat1_label}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-blue-500/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-indigo-500/5 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// DUAL SYSTEM ADVANTAGES SECTION
// ============================================

function AdvantagesSection() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Build content from translations
  const content = {
    badge: t.service_pages.azubi.advantages.badge,
    title: t.service_pages.azubi.advantages.title,
    subtitle: t.service_pages.azubi.advantages.subtitle,
    advantages: [
      {
        icon: Heart,
        title: t.service_pages.azubi.advantages.advantage_1_title,
        description: t.service_pages.azubi.advantages.advantage_1_desc,
        highlight: t.service_pages.azubi.advantages.advantage_1_highlight,
        highlightDesc: t.service_pages.azubi.advantages.advantage_1_highlight_desc,
      },
      {
        icon: Handshake,
        title: t.service_pages.azubi.advantages.advantage_2_title,
        description: t.service_pages.azubi.advantages.advantage_2_desc,
        highlight: t.service_pages.azubi.advantages.advantage_2_highlight,
        highlightDesc: t.service_pages.azubi.advantages.advantage_2_highlight_desc,
      },
      {
        icon: Shield,
        title: t.service_pages.azubi.advantages.advantage_3_title,
        description: t.service_pages.azubi.advantages.advantage_3_desc,
        highlight: t.service_pages.azubi.advantages.advantage_3_highlight,
        highlightDesc: t.service_pages.azubi.advantages.advantage_3_highlight_desc,
      },
    ],
  };

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Advantage Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {content.advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{advantage.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{advantage.description}</p>

                  {/* Highlight Badge */}
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {advantage.highlight}
                    </div>
                    <div className="text-sm text-slate-500">{advantage.highlightDesc}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// DMF QUALITY STANDARD SECTION
// ============================================

function QualityStandardSection() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Build content from translations
  const content = {
    badge: t.service_pages.azubi.quality.badge,
    title: t.service_pages.azubi.quality.title,
    subtitle: t.service_pages.azubi.quality.subtitle,
    left_column: {
      title: t.service_pages.azubi.quality.prep_title,
      icon: GraduationCap,
      items: [
        { text: t.service_pages.azubi.quality.prep_item1, icon: Languages },
        { text: t.service_pages.azubi.quality.prep_item2, icon: BookOpen },
        { text: t.service_pages.azubi.quality.prep_item3, icon: Users },
        { text: t.service_pages.azubi.quality.prep_item4, icon: Building2 },
      ],
    },
    right_column: {
      title: t.service_pages.azubi.quality.support_title,
      icon: HeartHandshake,
      items: [
        { text: t.service_pages.azubi.quality.support_item1, icon: MessageCircle },
        { text: t.service_pages.azubi.quality.support_item2, icon: Home },
        { text: t.service_pages.azubi.quality.support_item3, icon: FileCheck },
        { text: t.service_pages.azubi.quality.support_item4, icon: Shield },
      ],
    },
  };

  const LeftIcon = content.left_column.icon;
  const RightIcon = content.right_column.icon;

  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Vietnam */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-full bg-white rounded-3xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <LeftIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{content.left_column.title}</h3>
                  <p className="text-sm text-blue-600">🇻🇳 Vietnam</p>
                </div>
              </div>

              <div className="space-y-4">
                {content.left_column.items.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <ItemIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-700">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Germany */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="h-full bg-white rounded-3xl p-8 border border-indigo-200 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <RightIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{content.right_column.title}</h3>
                  <p className="text-sm text-indigo-600">🇩🇪 Deutschland</p>
                </div>
              </div>

              <div className="space-y-4">
                {content.right_column.items.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <ItemIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-slate-700">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SIMPLE PROCESS SECTION
// ============================================

function SimpleProcessSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.azubi.process.badge,
    title: t.service_pages.azubi.process.title,
    subtitle: t.service_pages.azubi.process.subtitle,
    steps: [
      {
        number: "01",
        title: t.service_pages.azubi.process.step1_title,
        description: t.service_pages.azubi.process.step1_desc,
        icon: Target,
      },
      {
        number: "02",
        title: t.service_pages.azubi.process.step2_title,
        description: t.service_pages.azubi.process.step2_desc,
        icon: MessageCircle,
      },
      {
        number: "03",
        title: t.service_pages.azubi.process.step3_title,
        description: t.service_pages.azubi.process.step3_desc,
        icon: FileCheck,
      },
      {
        number: "04",
        title: t.service_pages.azubi.process.step4_title,
        description: t.service_pages.azubi.process.step4_desc,
        icon: Rocket,
      },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Target className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Process Steps - Horizontal on Desktop */}
        <div className="grid md:grid-cols-4 gap-6">
          {content.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                {/* Connection Line (except last) */}
                {index < content.steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-blue-100" />
                )}

                <div className="text-center">
                  {/* Step Number & Icon */}
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/20 mx-auto">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center font-bold text-blue-600 text-sm shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// AZUBI TALENT SHOWCASE SECTION
// ============================================

function TalentShowcaseSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.azubi.talent.badge,
    title: t.service_pages.azubi.talent.title,
    subtitle: t.service_pages.azubi.talent.subtitle,
    viewProfile: t.service_pages.azubi.talent.view_profile,
    request_interview: t.service_pages.azubi.talent.request_interview,
    age_label: t.service_pages.azubi.talent.age_label,
    education_label: t.service_pages.azubi.talent.education_label,
    goal_label: t.service_pages.azubi.talent.goal_label,
    statusLabel: t.service_pages.azubi.talent.status_label,
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const getStatusColor = (type: string) => {
    switch (type) {
      case "ready":
        return "bg-green-100 text-green-700 border-green-200";
      case "learning":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "interview":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <section id="talent-pool" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Users className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Profile Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {azubiProfiles.map((profile, index) => {
            const Icon = profile.icon;
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300">
                  {/* Header */}
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-center gap-4 mb-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                          {profile.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                          <Icon className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 font-mono">#{profile.id}</p>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {lang === "de" ? profile.nameDe : lang === "en" ? profile.nameDe : profile.nameVn}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge className={`text-xs ${getStatusColor(profile.statusType)}`}>
                      <CircleDot className="w-3 h-3 mr-1" />
                      {lang === "de" ? profile.statusDe : lang === "en" ? profile.statusDe : profile.statusVn}
                    </Badge>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    {/* Age */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 uppercase">{content.age_label}</span>
                      <span className="font-bold text-slate-900">{profile.age} Jahre</span>
                    </div>

                    {/* Education */}
                    <div>
                      <span className="text-xs text-slate-400 uppercase block mb-1">
                        {content.education_label}
                      </span>
                      <span className="text-sm text-slate-700">
                        {lang === "de" ? profile.educationDe : lang === "en" ? profile.educationDe : profile.educationVn}
                      </span>
                    </div>

                    {/* Goal */}
                    <div className="bg-blue-50 rounded-xl p-3">
                      <span className="text-xs text-blue-600 uppercase block mb-1">
                        {content.goal_label}
                      </span>
                      <span className="font-semibold text-blue-700">
                        {lang === "de" ? profile.goalDe : lang === "en" ? profile.goalDe : profile.goalVn}
                      </span>
                    </div>

                    {/* German Level */}
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                        {profile.germanLevel}
                      </Badge>
                      <span className="text-xs text-slate-500">Deutsch</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white shadow-md shadow-blue-500/20"
                      asChild
                    >
                      <Link href="/#contact">
                        <Calendar className="w-4 h-4 mr-2" />
                        {content.request_interview}
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-base font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 rounded-full"
            asChild
          >
            <Link href="/#contact">
              {t.service_pages.azubi.talent.request_more}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SUPPORT ECOSYSTEM SECTION
// ============================================

function SupportEcosystemSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.azubi.support.badge,
    title: t.service_pages.azubi.support.title,
    subtitle: t.service_pages.azubi.support.subtitle,
    years: [
      {
        year: "1",
        title: t.service_pages.azubi.support.year1_title,
        description: t.service_pages.azubi.support.year1_desc,
        items: [
          t.service_pages.azubi.support.year1_item1,
          t.service_pages.azubi.support.year1_item2,
          t.service_pages.azubi.support.year1_item3,
          t.service_pages.azubi.support.year1_item4,
        ],
        icon: Home,
      },
      {
        year: "2",
        title: t.service_pages.azubi.support.year2_title,
        description: t.service_pages.azubi.support.year2_desc,
        items: [
          t.service_pages.azubi.support.year2_item1,
          t.service_pages.azubi.support.year2_item2,
          t.service_pages.azubi.support.year2_item3,
          t.service_pages.azubi.support.year2_item4,
        ],
        icon: BookOpen,
      },
      {
        year: "3",
        title: t.service_pages.azubi.support.year3_title,
        description: t.service_pages.azubi.support.year3_desc,
        items: [
          t.service_pages.azubi.support.year3_item1,
          t.service_pages.azubi.support.year3_item2,
          t.service_pages.azubi.support.year3_item3,
          t.service_pages.azubi.support.year3_item4,
        ],
        icon: Award,
      },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <HeartHandshake className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-400 to-blue-200 rounded-full" />

          {/* Year Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {content.years.map((year, index) => {
              const Icon = year.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  className="relative"
                >
                  {/* Year Circle */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.2, type: "spring" }}
                      className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/30"
                    >
                      <span className="text-2xl font-bold text-white">
                        {t.service_pages.azubi.support.year_label} {year.year}
                      </span>
                    </motion.div>
                  </div>

                  {/* Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{year.title}</h3>
                    </div>

                    <p className="text-slate-600 text-sm mb-4">{year.description}</p>

                    {/* Items */}
                    <div className="space-y-2">
                      {year.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPARISON SECTION
// ============================================

function ComparisonSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations - keep comparison rows structure
  const content = {
    badge: t.service_pages.azubi.comparison.badge,
    title: t.service_pages.azubi.comparison.title,
    subtitle: t.service_pages.azubi.comparison.subtitle,
    headers: {
      criteria: t.service_pages.azubi.comparison.criteria_label,
      vietnam: t.service_pages.azubi.comparison.vietnam_label,
      germany: t.service_pages.azubi.comparison.germany_label,
    },
    rows: comparisonContent.de.rows, // Keep original data structure
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
            <div className="p-5 font-semibold text-slate-700">{comparisonContent.de.headers.criteria}</div>
            <div className="p-5 font-semibold text-blue-700 bg-blue-50 text-center border-x border-blue-100">
              🇻🇳 {comparisonContent.de.headers.vietnam}
            </div>
            <div className="p-5 font-semibold text-slate-500 text-center">
              🇩🇪 {comparisonContent.de.headers.germany}
            </div>
          </div>

          {/* Table Rows */}
          {comparisonContent.de.rows.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className={`grid grid-cols-3 ${index < comparisonContent.de.rows.length - 1 ? "border-b border-slate-100" : ""}`}
            >
              <div className="p-5 text-slate-700 font-medium">{row.criteria}</div>
              <div className={`p-5 text-center border-x ${row.vietnamPositive ? "bg-blue-50/50 border-blue-100" : "bg-slate-50 border-slate-100"}`}>
                <div className="flex items-center justify-center gap-2">
                  {row.vietnamPositive ? (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className={row.vietnamPositive ? "text-blue-700 font-medium" : "text-slate-500"}>
                    {row.vietnam}
                  </span>
                </div>
              </div>
              <div className={`p-5 text-center ${row.germanyPositive ? "bg-green-50/50" : "bg-slate-50"}`}>
                <div className="flex items-center justify-center gap-2">
                  {row.germanyPositive ? (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className={row.germanyPositive ? "text-green-700 font-medium" : "text-slate-500"}>
                    {row.germany}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// STATS SECTION
// ============================================

function StatsSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    stats: [
      { value: "200", label: t.service_pages.azubi.stats.stat1_label, suffix: "+", icon: Users },
      { value: "95", label: t.service_pages.azubi.stats.stat2_label, suffix: "%", icon: Award },
      { value: "90", label: t.service_pages.azubi.stats.stat3_label, suffix: "%", icon: Handshake },
      { value: "3", label: t.service_pages.azubi.stats.stat4_label, suffix: "", icon: HeartHandshake },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {content.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-blue-100 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    title: t.service_pages.azubi.cta.title,
    subtitle: t.service_pages.azubi.cta.subtitle,
    cta1: t.service_pages.azubi.cta.cta1,
    cta2: t.service_pages.azubi.cta.cta2,
    highlight: t.service_pages.azubi.cta.highlight,
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Highlight Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              <Calendar className="w-4 h-4 mr-2" />
              {content.highlight}
            </Badge>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                {content.cta1}
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                <MessageCircle className="w-5 h-5 mr-2" />
                {content.cta2}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function AzubiPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AdvantagesSection />
      <QualityStandardSection />
      <SimpleProcessSection />
      <TalentShowcaseSection />
      <SupportEcosystemSection />
      <ComparisonSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}

