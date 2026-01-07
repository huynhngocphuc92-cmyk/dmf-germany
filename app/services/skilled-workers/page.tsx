"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  FileCheck,
  Users,
  Award,
  Briefcase,
  Sparkles,
  TrendingUp,
  Handshake,
  Plane,
  Scale,
  Timer,
  Euro,
  Languages,
  HeartHandshake,
  ChevronRight,
  Check,
  X,
  BadgeCheck,
  Zap,
  Target,
  Star,
  GraduationCap,
  Wrench,
  ChefHat,
  Stethoscope,
  Eye,
  Calendar,
  MapPin,
  Cpu,
  Cog,
  Heart,
  Building2,
  Code,
  Server,
} from "lucide-react";

// ============================================
// CONTENT DATA
// ============================================

const heroContent = {
  de: {
    badge: "§18a/b Fachkräfteeinwanderung",
    headline: "Qualifizierte Fachkräfte.",
    headlineAccent: "Anerkannte Abschlüsse. Sofort einsatzbereit.",
    subheadline:
      "Schluss mit dem Behörden-Dschungel. Wir vermitteln Ingenieure, IT-Profis und Pflegekräfte aus Vietnam – rechtssicher nach §18a/b AufenthG.",
    cta1: "Verfügbare Experten prüfen",
    cta2: "Kostenlose Beratung",
    floatingCard1: {
      name: "Nguyen Van Minh",
      role: "Pflegefachkraft",
      badge: "Anabin H+ geprüft",
    },
    floatingCard2: {
      title: "Anerkennung",
      status: "ZAV-konform geprüft",
    },
    floatingCard3: {
      title: "Sprachniveau",
      level: "B2 + Fachsprache",
    },
  },
  vn: {
    badge: "§18a/b Visa lao động tay nghề",
    headline: "Nhân sự chất lượng.",
    headlineAccent: "Bằng cấp công nhận. Sẵn sàng làm việc.",
    subheadline:
      "Chấm dứt mê cung thủ tục. Chúng tôi giới thiệu Kỹ sư, IT và Điều dưỡng từ Việt Nam – hợp pháp theo §18a/b AufenthG.",
    cta1: "Xem chuyên gia sẵn sàng",
    cta2: "Tư vấn miễn phí",
    floatingCard1: {
      name: "Nguyễn Văn Minh",
      role: "Điều dưỡng viên",
      badge: "Anabin H+ đã kiểm tra",
    },
    floatingCard2: {
      title: "Công nhận bằng",
      status: "Đạt chuẩn ZAV",
    },
    floatingCard3: {
      title: "Trình độ ngôn ngữ",
      level: "B2 + Ngôn ngữ chuyên ngành",
    },
  },
};

const comparisonContent = {
  de: {
    badge: "Warum DMF?",
    title: "Der Unterschied ist messbar.",
    subtitle: "Vergleichen Sie selbst: Eigenrekrutierung vs. DMF Vietnam",
    oldWay: {
      title: "Risiko & Bürokratie",
      subtitle: "Eigenrekrutierung",
      items: [
        { text: "Unklare Anerkennung (9-12 Monate)", icon: Timer },
        { text: "Hohes Ablehnungsrisiko bei Dokumenten", icon: XCircle },
        { text: "Versteckte Kosten: Anwälte, Übersetzungen", icon: Euro },
        { text: "Sprachbarriere – oft nur A2 Niveau", icon: Languages },
        { text: "Keine Nachbetreuung", icon: HeartHandshake },
      ],
    },
    newWay: {
      title: "Sicherheit & Speed",
      subtitle: "Mit DMF Vietnam",
      badge: "Empfohlen",
      items: [
        { text: "Vorab-Check der Gleichwertigkeit (Sofort)", icon: Zap },
        { text: "Visumsgarantie dank §81a Verfahren", icon: Shield },
        { text: "Transparente Pauschalgebühr – keine Extras", icon: Euro },
        { text: "B1/B2 Zertifikat + Fachsprache inklusive", icon: BadgeCheck },
        { text: "12 Monate Integrationsbegleitung", icon: HeartHandshake },
      ],
    },
  },
  vn: {
    badge: "Tại sao chọn DMF?",
    title: "Sự khác biệt có thể đo lường.",
    subtitle: "Tự so sánh: Tự tuyển dụng vs. DMF Vietnam",
    oldWay: {
      title: "Rủi ro & Thủ tục",
      subtitle: "Tự tuyển dụng",
      items: [
        { text: "Công nhận bằng không rõ ràng (9-12 tháng)", icon: Timer },
        { text: "Rủi ro từ chối cao khi hồ sơ sai", icon: XCircle },
        { text: "Chi phí ẩn: luật sư, dịch thuật", icon: Euro },
        { text: "Rào cản ngôn ngữ – thường chỉ A2", icon: Languages },
        { text: "Không có hỗ trợ sau đó", icon: HeartHandshake },
      ],
    },
    newWay: {
      title: "An toàn & Nhanh chóng",
      subtitle: "Với DMF Vietnam",
      badge: "Khuyên dùng",
      items: [
        { text: "Kiểm tra tương đương trước (Ngay lập tức)", icon: Zap },
        { text: "Đảm bảo Visa nhờ quy trình §81a", icon: Shield },
        { text: "Phí trọn gói minh bạch – không phụ phí", icon: Euro },
        { text: "Chứng chỉ B1/B2 + Ngôn ngữ chuyên ngành", icon: BadgeCheck },
        { text: "Đồng hành hội nhập 12 tháng", icon: HeartHandshake },
      ],
    },
  },
};

const processContent = {
  de: {
    badge: "Unser Prozess",
    title: "5 Schritte zum Erfolg",
    subtitle: "Transparent, planbar, zuverlässig",
    totalTime: "Gesamtdauer: 6-9 Monate",
    steps: [
      {
        id: 1,
        icon: Users,
        title: "Auswahl",
        description: "Sorgfältige Prüfung von Qualifikationen und Deutschkenntnissen",
        duration: "2-4 Wochen",
      },
      {
        id: 2,
        icon: FileCheck,
        title: "Anerkennung",
        description: "Begleitung beim Anerkennungsverfahren der Berufsqualifikation",
        duration: "3-6 Monate",
      },
      {
        id: 3,
        icon: Handshake,
        title: "Matching",
        description: "Professionelles Matching und Vertragsverhandlung",
        duration: "2-4 Wochen",
      },
      {
        id: 4,
        icon: Scale,
        title: "Visum",
        description: "Beschleunigtes Fachkräfteverfahren nach §81a AufenthG",
        duration: "4-8 Wochen",
      },
      {
        id: 5,
        icon: Plane,
        title: "Integration",
        description: "Begleitung bei Ankunft und langfristige Nachbetreuung",
        duration: "Fortlaufend",
      },
    ],
  },
  vn: {
    badge: "Quy trình",
    title: "5 bước đến thành công",
    subtitle: "Minh bạch, có kế hoạch, đáng tin cậy",
    totalTime: "Tổng thời gian: 6-9 tháng",
    steps: [
      {
        id: 1,
        icon: Users,
        title: "Tuyển chọn",
        description: "Kiểm tra kỹ lưỡng bằng cấp và trình độ tiếng Đức",
        duration: "2-4 tuần",
      },
      {
        id: 2,
        icon: FileCheck,
        title: "Công nhận",
        description: "Đồng hành thủ tục công nhận bằng cấp nghề",
        duration: "3-6 tháng",
      },
      {
        id: 3,
        icon: Handshake,
        title: "Kết nối",
        description: "Kết nối chuyên nghiệp và đàm phán hợp đồng",
        duration: "2-4 tuần",
      },
      {
        id: 4,
        icon: Scale,
        title: "Visa",
        description: "Thủ tục visa nhanh theo §81a Luật Cư trú",
        duration: "4-8 tuần",
      },
      {
        id: 5,
        icon: Plane,
        title: "Hội nhập",
        description: "Đồng hành khi đến và hỗ trợ lâu dài",
        duration: "Liên tục",
      },
    ],
  },
};

const statsContent = {
  de: {
    stats: [
      { value: "350+", label: "Vermittelte Fachkräfte", suffix: "" },
      { value: "98", label: "Visum-Erfolgsquote", suffix: "%" },
      { value: "<6", label: "Monate bis Arbeitsantritt", suffix: "" },
      { value: "100", label: "Haftungsausschluss", suffix: "%" },
    ],
  },
  vn: {
    stats: [
      { value: "350+", label: "Nhân sự đã giới thiệu", suffix: "" },
      { value: "98", label: "Tỷ lệ đậu Visa", suffix: "%" },
      { value: "<6", label: "Tháng đến khi làm việc", suffix: "" },
      { value: "100", label: "Miễn trừ rủi ro", suffix: "%" },
    ],
  },
};

const ctaContent = {
  de: {
    title: "Bereit für qualifizierte Fachkräfte?",
    subtitle: "Vereinbaren Sie ein unverbindliches Beratungsgespräch.",
    cta1: "Jetzt Beratung anfragen",
    cta2: "Kandidatenprofile anfordern",
  },
  vn: {
    title: "Sẵn sàng cho nhân sự chất lượng?",
    subtitle: "Đặt lịch tư vấn miễn phí ngay hôm nay.",
    cta1: "Yêu cầu tư vấn ngay",
    cta2: "Yêu cầu hồ sơ ứng viên",
  },
};

// ============================================
// EXPERTISE AREAS CONTENT
// ============================================

const expertiseAreasContent = {
  de: {
    badge: "Unsere Expertise",
    title: "Spezialisierte Fachkräfte",
    subtitle: "Fokussiert auf die Branchen mit höchstem Bedarf",
    areas: [
      {
        icon: Heart,
        title: "Gesundheitswesen",
        highlight: "Pflegefachkräfte",
        description: "Mit Anerkennungsbescheid, B2-Zertifikat und Berufserfahrung in Krankenhäusern",
        roles: ["Pflegefachkräfte", "Altenpfleger", "Krankenpfleger", "OP-Pflege"],
        badges: ["Anabin H+", "ZAV-konform", "B2 Goethe/Telc"],
      },
      {
        icon: Cog,
        title: "Ingenieurwesen",
        highlight: "Technische Experten",
        description: "Bachelor/Master von renommierten technischen Universitäten in Vietnam",
        roles: ["Maschinenbau", "Elektrotechnik", "Bauingenieure", "Mechatronik"],
        badges: ["Anabin H+", "Berufserfahrung", "CAD/CAM"],
      },
      {
        icon: Code,
        title: "IT & Software",
        highlight: "Digital-Talente",
        description: "Praxiserfahrene Entwickler mit starkem technischen Hintergrund",
        roles: ["Fullstack Developer", "Systemadministratoren", "DevOps", "Data Engineers"],
        badges: ["Portfolio geprüft", "Englisch + Deutsch", "Zertifiziert"],
      },
    ],
  },
  vn: {
    badge: "Chuyên môn của chúng tôi",
    title: "Nhân sự chuyên ngành",
    subtitle: "Tập trung vào các ngành có nhu cầu cao nhất",
    areas: [
      {
        icon: Heart,
        title: "Y tế",
        highlight: "Điều dưỡng viên",
        description: "Với giấy công nhận, chứng chỉ B2 và kinh nghiệm tại bệnh viện",
        roles: ["Điều dưỡng", "Chăm sóc người cao tuổi", "Y tá", "Hộ lý phẫu thuật"],
        badges: ["Anabin H+", "Đạt chuẩn ZAV", "B2 Goethe/Telc"],
      },
      {
        icon: Cog,
        title: "Kỹ thuật",
        highlight: "Chuyên gia kỹ thuật",
        description: "Cử nhân/Thạc sĩ từ các trường đại học kỹ thuật uy tín",
        roles: ["Cơ khí", "Điện", "Xây dựng", "Cơ điện tử"],
        badges: ["Anabin H+", "Có kinh nghiệm", "CAD/CAM"],
      },
      {
        icon: Code,
        title: "IT & Phần mềm",
        highlight: "Nhân tài số",
        description: "Lập trình viên có kinh nghiệm thực tế và nền tảng kỹ thuật vững",
        roles: ["Fullstack Developer", "System Admin", "DevOps", "Data Engineers"],
        badges: ["Portfolio đã kiểm tra", "Tiếng Anh + Tiếng Đức", "Có chứng chỉ"],
      },
    ],
  },
};

// ============================================
// AVAILABLE EXPERTS CONTENT
// ============================================

interface ExpertProfile {
  id: string;
  nameDe: string;
  nameVn: string;
  roleDe: string;
  roleVn: string;
  avatar: string;
  badges: {
    textDe: string;
    textVn: string;
    type: "recognition" | "visa";
  }[];
  specs: {
    educationDe: string;
    educationVn: string;
    experienceYears: number;
    germanLevel: string;
    certType: string;
  };
  highlightDe: string;
  highlightVn: string;
  icon: React.ElementType;
}

const expertsContent = {
  de: {
    badge: "Sofort verfügbar",
    title: "Verfügbare Fachkräfte",
    subtitle: "Anabin H+ geprüft • ZAV-konform • Berufserfahrung verifiziert",
    viewProfile: "Profil ansehen",
    bookInterview: "Interview buchen",
    education: "Ausbildung",
    experience: "Erfahrung",
    german: "Deutsch",
    years: "Jahre",
  },
  vn: {
    badge: "Sẵn sàng ngay",
    title: "Nhân sự sẵn sàng",
    subtitle: "Anabin H+ đã kiểm tra • Đạt chuẩn ZAV • Kinh nghiệm đã xác minh",
    viewProfile: "Xem hồ sơ",
    bookInterview: "Đặt phỏng vấn",
    education: "Trình độ",
    experience: "Kinh nghiệm",
    german: "Tiếng Đức",
    years: "năm",
  },
};

const expertProfiles: ExpertProfile[] = [
  {
    id: "ENG-01",
    nameDe: "Tran Duc Anh",
    nameVn: "Trần Đức Anh",
    roleDe: "Maschinenbauingenieur",
    roleVn: "Kỹ sư Cơ khí",
    avatar: "TDA",
    badges: [
      { textDe: "Anabin H+ geprüft", textVn: "Anabin H+ đã kiểm tra", type: "recognition" },
      { textDe: "ZAV-konform", textVn: "Đạt chuẩn ZAV", type: "visa" },
    ],
    specs: {
      educationDe: "Bachelor - TU Hanoi",
      educationVn: "Cử nhân - ĐH Bách Khoa HN",
      experienceYears: 5,
      germanLevel: "B2",
      certType: "Telc",
    },
    highlightDe: "CAD/CAM, CNC-Programmierung, 5 Jahre Berufserfahrung",
    highlightVn: "CAD/CAM, Lập trình CNC, 5 năm kinh nghiệm",
    icon: Wrench,
  },
  {
    id: "PFL-02",
    nameDe: "Nguyen Thi Mai",
    nameVn: "Nguyễn Thị Mai",
    roleDe: "Pflegefachkraft",
    roleVn: "Điều dưỡng viên",
    avatar: "NTM",
    badges: [
      { textDe: "Anerkennungsbescheid erteilt", textVn: "Đã có Anerkennungsbescheid", type: "recognition" },
      { textDe: "§81a Visum bereit", textVn: "Visa §81a sẵn sàng", type: "visa" },
    ],
    specs: {
      educationDe: "Krankenpflege - Cho Ray",
      educationVn: "Điều dưỡng - BV Chợ Rẫy",
      experienceYears: 3,
      germanLevel: "B2",
      certType: "Goethe",
    },
    highlightDe: "Intensivpflege, 3 Jahre Berufserfahrung, Fachsprache",
    highlightVn: "Hồi sức tích cực, 3 năm kinh nghiệm, Ngôn ngữ chuyên ngành",
    icon: Stethoscope,
  },
  {
    id: "IT-03",
    nameDe: "Pham Quoc Bao",
    nameVn: "Phạm Quốc Bảo",
    roleDe: "Fullstack Developer",
    roleVn: "Lập trình viên Fullstack",
    avatar: "PQB",
    badges: [
      { textDe: "Portfolio geprüft", textVn: "Portfolio đã kiểm tra", type: "recognition" },
      { textDe: "Sofort verfügbar", textVn: "Sẵn sàng ngay", type: "visa" },
    ],
    specs: {
      educationDe: "Informatik - FPT University",
      educationVn: "CNTT - ĐH FPT",
      experienceYears: 4,
      germanLevel: "B1",
      certType: "Telc",
    },
    highlightDe: "React, Node.js, 4 Jahre Berufserfahrung, AWS",
    highlightVn: "React, Node.js, 4 năm kinh nghiệm, AWS",
    icon: Code,
  },
];

// ============================================
// ANIMATED COUNTER COMPONENT
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

    // Handle special cases like "<6" or "350+"
    if (value.includes("<") || value.includes("+")) {
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
    badge: t.service_pages.skilled_workers.hero.badge,
    headline: t.service_pages.skilled_workers.hero.headline,
    headlineAccent: t.service_pages.skilled_workers.hero.headline_accent,
    subheadline: t.service_pages.skilled_workers.hero.subheadline,
    cta1: t.service_pages.skilled_workers.hero.cta1,
    cta2: t.service_pages.skilled_workers.hero.cta2,
    floatingCard1: {
      name: t.service_pages.skilled_workers.hero.card1_name,
      role: t.service_pages.skilled_workers.hero.card1_role,
      badge: t.service_pages.skilled_workers.hero.card1_badge,
    },
    floatingCard2: {
      title: t.service_pages.skilled_workers.hero.card2_title,
      status: t.service_pages.skilled_workers.hero.card2_status,
    },
    floatingCard3: {
      title: t.service_pages.skilled_workers.hero.card3_title,
      level: t.service_pages.skilled_workers.hero.card3_level,
    },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-500/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-400/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle grid pattern */}
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
          {/* Left Content - Text */}
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
              <Badge className="mb-8 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2" />
                {content.badge}
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white">{content.headline}</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                {content.headlineAccent}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              {content.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                asChild
              >
                <Link href="#comparison">
                  {content.cta1}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-slate-700 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  {content.cta2}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block h-[600px]"
          >
            {/* Floating Card 1 - Profile Card */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-8 left-8 z-20"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-72">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                    NM
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {content.floatingCard1.name}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {content.floatingCard1.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {content.floatingCard1.badge}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 - Status Card */}
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-32 right-4 z-10"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-64">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">
                      {content.floatingCard2.title}
                    </p>
                    <p className="text-white font-medium text-sm">
                      {content.floatingCard2.status}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3 - Language Level */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-32 left-16 z-20"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl w-56">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <Languages className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">
                      {content.floatingCard3.title}
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {content.floatingCard3.level}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 4 - Success Rate */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute bottom-16 right-8 z-10"
            >
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-5 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">98%</div>
                  <div className="text-emerald-300 text-xs font-medium">
                    {t.service_pages.skilled_workers.stats.success_rate}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-emerald-500/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-teal-500/5 rounded-full" />
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
          <motion.div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// COMPARISON SECTION (Pain & Solution)
// ============================================

function ComparisonSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.skilled_workers.comparison.badge,
    title: t.service_pages.skilled_workers.comparison.title,
    subtitle: t.service_pages.skilled_workers.comparison.subtitle,
    oldWay: {
      title: t.service_pages.skilled_workers.comparison.old_title,
      subtitle: t.service_pages.skilled_workers.comparison.old_subtitle,
      items: [
        { text: t.service_pages.skilled_workers.comparison.old_item1, icon: Timer },
        { text: t.service_pages.skilled_workers.comparison.old_item2, icon: XCircle },
        { text: t.service_pages.skilled_workers.comparison.old_item3, icon: Euro },
        { text: t.service_pages.skilled_workers.comparison.old_item4, icon: Languages },
        { text: t.service_pages.skilled_workers.comparison.old_item5, icon: HeartHandshake },
      ],
    },
    newWay: {
      title: t.service_pages.skilled_workers.comparison.new_title,
      subtitle: t.service_pages.skilled_workers.comparison.new_subtitle,
      badge: t.service_pages.skilled_workers.comparison.new_badge,
      items: [
        { text: t.service_pages.skilled_workers.comparison.new_item1, icon: Zap },
        { text: t.service_pages.skilled_workers.comparison.new_item2, icon: Shield },
        { text: t.service_pages.skilled_workers.comparison.new_item3, icon: Euro },
        { text: t.service_pages.skilled_workers.comparison.new_item4, icon: BadgeCheck },
        { text: t.service_pages.skilled_workers.comparison.new_item5, icon: HeartHandshake },
      ],
    },
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="comparison" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Old Way Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="h-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl p-8 lg:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                    <X className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-700">
                      {content.oldWay.title}
                    </h3>
                    <p className="text-sm text-slate-500">{content.oldWay.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {content.oldWay.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-slate-600">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* New Way Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <Badge className="px-4 py-2 bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/30">
                <Star className="w-4 h-4 mr-1.5 fill-current" />
                {content.newWay.badge}
              </Badge>
            </div>

            <div className="h-full bg-white border-2 border-emerald-500 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-emerald-500/10">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {content.newWay.title}
                    </h3>
                    <p className="text-sm text-emerald-600 font-medium">
                      {content.newWay.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {content.newWay.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{item.text}</span>
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
// AVAILABLE EXPERTS SECTION (Talent Showcase)
// ============================================

function AvailableExpertsSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.skilled_workers.experts.badge,
    title: t.service_pages.skilled_workers.experts.title,
    subtitle: t.service_pages.skilled_workers.experts.subtitle,
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="talent-pool" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
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

        {/* Expert Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {expertProfiles.map((expert, index) => {
            const Icon = expert.icon;
            return (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300">
                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                            {expert.avatar}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
                            <Icon className="w-3 h-3 text-emerald-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-mono mb-1">
                            #{expert.id}
                          </p>
                          <h3 className="font-bold text-slate-900">
                            {lang === "de" ? expert.nameDe : lang === "en" ? expert.nameDe : expert.nameVn}
                          </h3>
                          <p className="text-sm text-emerald-600 font-medium">
                            {lang === "de" ? expert.roleDe : lang === "en" ? expert.roleDe : expert.roleVn}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      {expert.badges.map((badge, badgeIdx) => (
                        <Badge
                          key={badgeIdx}
                          className={`text-xs ${
                            badge.type === "recognition"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-teal-100 text-teal-700 border-teal-200"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {lang === "de" ? badge.textDe : lang === "en" ? badge.textDe : badge.textVn}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Card Body - Specs */}
                  <div className="p-6 space-y-4">
                    {/* Education */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {content.education}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {language === "de"
                            ? expert.specs.educationDe
                            : expert.specs.educationVn}
                        </p>
                      </div>
                    </div>

                    {/* Experience & German Level */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Experience */}
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {expert.specs.experienceYears}
                        </div>
                        <p className="text-xs text-slate-500">
                          {content.years} {content.experience}
                        </p>
                      </div>

                      {/* German Level */}
                      <div className="bg-emerald-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">
                          {expert.specs.germanLevel}
                        </div>
                        <p className="text-xs text-emerald-600">
                          {expert.specs.certType} {content.german}
                        </p>
                      </div>
                    </div>

                    {/* Highlight Skills */}
                    <div className="pt-2">
                      <p className="text-xs text-slate-400 mb-2">Expertise:</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {lang === "de" ? expert.highlightDe : lang === "en" ? expert.highlightDe : expert.highlightVn}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="px-6 pb-6 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                      asChild
                    >
                      <Link href="/#contact">
                        <Eye className="w-4 h-4 mr-2" />
                        {content.viewProfile}
                      </Link>
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20"
                      asChild
                    >
                      <Link href="/#contact">
                        <Calendar className="w-4 h-4 mr-2" />
                        {content.bookInterview}
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
            className="px-8 py-6 text-base font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full transition-all"
            asChild
          >
            <Link href="/#contact">
              {t.service_pages.skilled_workers.experts.view_all}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS SECTION (Horizontal Timeline)
// ============================================

function ProcessSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.skilled_workers.process.badge,
    title: t.service_pages.skilled_workers.process.title,
    subtitle: t.service_pages.skilled_workers.process.subtitle,
    totalTime: t.service_pages.skilled_workers.process.total_time,
    steps: [
      {
        id: 1,
        icon: Users,
        title: t.service_pages.skilled_workers.process.step1_title,
        description: t.service_pages.skilled_workers.process.step1_desc,
        duration: t.service_pages.skilled_workers.process.step1_duration,
      },
      {
        id: 2,
        icon: FileCheck,
        title: t.service_pages.skilled_workers.process.step2_title,
        description: t.service_pages.skilled_workers.process.step2_desc,
        duration: t.service_pages.skilled_workers.process.step2_duration,
      },
      {
        id: 3,
        icon: Handshake,
        title: t.service_pages.skilled_workers.process.step3_title,
        description: t.service_pages.skilled_workers.process.step3_desc,
        duration: t.service_pages.skilled_workers.process.step3_duration,
      },
      {
        id: 4,
        icon: Scale,
        title: t.service_pages.skilled_workers.process.step4_title,
        description: t.service_pages.skilled_workers.process.step4_desc,
        duration: t.service_pages.skilled_workers.process.step4_duration,
      },
      {
        id: 5,
        icon: Plane,
        title: t.service_pages.skilled_workers.process.step5_title,
        description: t.service_pages.skilled_workers.process.step5_desc,
        duration: t.service_pages.skilled_workers.process.step5_duration,
      },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-4">
            {content.subtitle}
          </p>

          <Badge className="bg-emerald-100 text-emerald-800 border-0">
            <Clock className="w-4 h-4 mr-2" />
            {content.totalTime}
          </Badge>
        </motion.div>

        {/* Horizontal Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

          <div className="grid grid-cols-5 gap-4">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className="relative flex flex-col items-center"
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 mb-6">
                    <div className="w-32 h-32 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-xl flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        {String(step.id).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-200 text-slate-500"
                    >
                      <Timer className="w-3 h-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </div>

                  {/* Arrow (except last) */}
                  {index < content.steps.length - 1 && (
                    <div className="absolute top-16 -right-2 transform translate-x-1/2 z-20 hidden xl:block">
                      <ChevronRight className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vertical Timeline - Mobile/Tablet */}
        <div className="lg:hidden space-y-6">
          {content.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-4"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                      {String(step.id).padStart(2, "0")}
                    </Badge>
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{step.description}</p>
                  <span className="text-xs text-emerald-600 font-medium">
                    {step.duration}
                  </span>
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
// STATS SECTION (Trust Banner)
// ============================================

function StatsSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    stats: [
      { value: "350+", label: t.service_pages.skilled_workers.stats.stat1_label, suffix: "" },
      { value: "98", label: t.service_pages.skilled_workers.stats.stat2_label, suffix: "%" },
      { value: "<6", label: t.service_pages.skilled_workers.stats.stat3_label, suffix: "" },
      { value: "100", label: t.service_pages.skilled_workers.stats.stat4_label, suffix: "%" },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-emerald-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-800/40 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {content.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <div className="text-emerald-200 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// EXPERTISE AREAS SECTION
// ============================================

function ExpertiseAreasSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations - keep areas structure from original
  const content = {
    badge: t.service_pages.skilled_workers.expertise.badge,
    title: t.service_pages.skilled_workers.expertise.title,
    subtitle: t.service_pages.skilled_workers.expertise.subtitle,
    areas: expertiseAreasContent.de.areas.map((area, idx) => ({
      ...area,
      title: idx === 0 ? t.service_pages.skilled_workers.expertise.health_title :
             idx === 1 ? t.service_pages.skilled_workers.expertise.tech_title :
             t.service_pages.skilled_workers.expertise.it_title,
      highlight: idx === 0 ? t.service_pages.skilled_workers.expertise.health_highlight :
                  idx === 1 ? t.service_pages.skilled_workers.expertise.tech_highlight :
                  t.service_pages.skilled_workers.expertise.it_highlight,
    })),
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Target className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Expertise Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {content.areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{area.title}</h3>
                      <p className="text-sm text-emerald-600 font-medium">{area.highlight}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed mb-6">{area.description}</p>

                  {/* Roles */}
                  <div className="mb-6">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">
                      {language === "de" ? "Berufe" : "Nghề nghiệp"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {area.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex flex-wrap gap-2">
                      {area.badges.map((badge, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
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
// CTA SECTION
// ============================================

function CTASection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    title: t.service_pages.skilled_workers.cta.title,
    subtitle: t.service_pages.skilled_workers.cta.subtitle,
    cta1: t.service_pages.skilled_workers.cta.cta1,
    cta2: t.service_pages.skilled_workers.cta.cta2,
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                {content.cta1}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="#talent-pool">
                <Users className="w-5 h-5 mr-2" />
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

export default function SkilledWorkersPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ComparisonSection />
      <ExpertiseAreasSection />
      <AvailableExpertsSection />
      <ProcessSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}
