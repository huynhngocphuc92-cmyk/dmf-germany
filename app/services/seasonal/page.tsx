"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  Calendar,
  Plane,
  FileCheck,
  Wheat,
  UtensilsCrossed,
  Bed,
  Tractor,
  Grape,
  Hotel,
  ChefHat,
  Dumbbell,
  MessageCircle,
  Shield,
  Timer,
  TrendingUp,
  Sparkles,
  PhoneCall,
  BadgeCheck,
  CircleCheck,
  Rocket,
} from "lucide-react";

// ============================================
// CONTENT DATA
// ============================================

const heroContent = {
  de: {
    badge: "100% ZAV-konform",
    headline: "Erntehelfer & Servicekräfte",
    headlineAccent: "Schnell verfügbar.",
    subheadline:
      "Sichern Sie Ihre Ernte und Ihren Service. Körperlich belastbares Personal für die Hochsaison – einsatzbereit in 4-8 Wochen.",
    cta1: "Verfügbarkeit jetzt prüfen",
    cta2: "Rückruf anfordern",
    urgencyBadge: "Saison 2026 – Jetzt sichern!",
  },
  vn: {
    badge: "100% đạt chuẩn ZAV",
    headline: "Nhân sự thu hoạch & phục vụ",
    headlineAccent: "Sẵn sàng nhanh chóng.",
    subheadline:
      "Đảm bảo mùa vụ và dịch vụ của bạn. Nhân sự khỏe mạnh cho mùa cao điểm – sẵn sàng làm việc trong 4-8 tuần.",
    cta1: "Kiểm tra ngay",
    cta2: "Yêu cầu gọi lại",
    urgencyBadge: "Mùa vụ 2026 – Đặt ngay!",
  },
};

const timelineContent = {
  de: {
    badge: "Schneller Prozess",
    title: "In 4-8 Wochen einsatzbereit",
    subtitle: "Keine lange Wartezeit. Keine bürokratischen Hürden.",
    steps: [
      {
        week: "1",
        title: "Auswahl",
        description: "Wir stellen Ihnen passende Teams vor",
        icon: Users,
      },
      {
        week: "2-4",
        title: "ZAV-Antrag",
        description: "Behördliche Genehmigung durch Arbeitsagentur",
        icon: FileCheck,
      },
      {
        week: "5-8",
        title: "Anreise",
        description: "Gruppenflug und Transfer zum Einsatzort",
        icon: Plane,
      },
    ],
    keyMessage: "Keine lange Wartezeit",
  },
  vn: {
    badge: "Quy trình nhanh",
    title: "Sẵn sàng trong 4-8 tuần",
    subtitle: "Không chờ đợi lâu. Không rào cản thủ tục.",
    steps: [
      {
        week: "1",
        title: "Tuyển chọn",
        description: "Chúng tôi giới thiệu đội ngũ phù hợp",
        icon: Users,
      },
      {
        week: "2-4",
        title: "Hồ sơ ZAV",
        description: "Phê duyệt từ Cơ quan Lao động",
        icon: FileCheck,
      },
      {
        week: "5-8",
        title: "Di chuyển",
        description: "Bay theo nhóm và đưa đón đến nơi làm việc",
        icon: Plane,
      },
    ],
    keyMessage: "Không chờ đợi lâu",
  },
};

const talentPoolContent = {
  de: {
    badge: "Sofort verfügbar",
    title: "Belastbare Arbeitskräfte",
    subtitle: "ZAV-konform • Körperlich fit • Einsatzbereit in Wochen",
    availableBadge: "50+ Verfügbar",
    viewAll: "Alle Kandidaten ansehen",
    profiles: [
      {
        id: "AGR-01",
        role: "Erntehelfer",
        roleVn: "Người thu hoạch",
        category: "Landwirtschaft",
        categoryVn: "Nông nghiệp",
        avatar: "EH",
        skills: [
          { text: "Körperlich belastbar", icon: Dumbbell },
          { text: "Ernteerfahrung", icon: Wheat },
          { text: "Teamfähig", icon: Users },
        ],
        available: 25,
        icon: Wheat,
      },
      {
        id: "GAS-02",
        role: "Servicekraft",
        roleVn: "Nhân viên phục vụ",
        category: "Gastronomie",
        categoryVn: "Nhà hàng",
        avatar: "SK",
        skills: [
          { text: "Englischkenntnisse", icon: MessageCircle },
          { text: "Stressresistent", icon: Shield },
          { text: "Gastfreundlich", icon: Hotel },
        ],
        available: 30,
        icon: UtensilsCrossed,
      },
      {
        id: "HOU-03",
        role: "Zimmermädchen",
        roleVn: "Nhân viên buồng phòng",
        category: "Hotellerie",
        categoryVn: "Khách sạn",
        avatar: "ZM",
        skills: [
          { text: "Detailorientiert", icon: CheckCircle2 },
          { text: "Zuverlässig", icon: BadgeCheck },
          { text: "Schnell", icon: Zap },
        ],
        available: 20,
        icon: Bed,
      },
      {
        id: "KIT-04",
        role: "Küchenhilfe",
        roleVn: "Phụ bếp",
        category: "Gastronomie",
        categoryVn: "Nhà hàng",
        avatar: "KH",
        skills: [
          { text: "Hygienebewusst", icon: Shield },
          { text: "Belastbar", icon: Dumbbell },
          { text: "Lernbereit", icon: TrendingUp },
        ],
        available: 35,
        icon: ChefHat,
      },
    ],
  },
  vn: {
    badge: "Talent Pool",
    title: "Lực lượng lao động sẵn sàng",
    subtitle: "Khỏe mạnh, có động lực và sẵn sàng ngay",
    availableBadge: "50+ Sẵn sàng",
    viewAll: "Xem tất cả ứng viên",
    profiles: [],
  },
};

const sectorsContent = {
  de: {
    badge: "Einsatzbereiche",
    title: "Branchen, die wir bedienen",
    subtitle: "Spezialisiert auf saisonale Spitzenzeiten",
    sectors: [
      {
        title: "Landwirtschaft",
        subtitle: "Agrarsektor",
        icon: Tractor,
        secondaryIcon: Grape,
        color: "amber",
        jobs: ["Spargel", "Erdbeeren", "Weinbau", "Gemüseernte"],
        jobsVn: ["Măng tây", "Dâu tây", "Nho", "Rau củ"],
        description: "Erntehelfer für Spargel, Erdbeeren, Weinbau & Gemüse.",
        descriptionVn: "Nhân sự thu hoạch măng tây, dâu, nho và rau củ.",
        stats: { workers: "150+", time: "4-6 Wo." },
      },
      {
        title: "Gastronomie & Hotellerie",
        subtitle: "Hospitality",
        icon: UtensilsCrossed,
        secondaryIcon: Hotel,
        color: "orange",
        jobs: ["Spüler", "Küchenhilfen", "Zimmermädchen", "Servicekräfte"],
        jobsVn: ["Rửa bát", "Phụ bếp", "Dọn phòng", "Phục vụ"],
        description: "Spüler, Küchenhilfen & Zimmermädchen für Hotels & Restaurants.",
        descriptionVn: "Rửa bát, phụ bếp và dọn phòng cho khách sạn & nhà hàng.",
        stats: { workers: "100+", time: "6-8 Wo." },
      },
    ],
  },
  vn: {
    badge: "Lĩnh vực",
    title: "Ngành nghề chúng tôi phục vụ",
    subtitle: "Chuyên về mùa cao điểm",
    sectors: [],
  },
};

// ============================================
// ADVANTAGES CONTENT
// ============================================

const advantagesContent = {
  de: {
    badge: "Warum Vietnam?",
    title: "Ihre Vorteile auf einen Blick",
    subtitle: "Belastbares Personal für harte Arbeit",
    advantages: [
      {
        icon: Dumbbell,
        title: "Körperlich Belastbar",
        description: "Gewohnt an harte Arbeit und Hitze. Ideal für Feldarbeit und Gewächshäuser.",
        highlight: "100%",
        highlightDesc: "Einsatzbereit",
      },
      {
        icon: Zap,
        title: "Hohe Motivation",
        description: "Maximale Einsatzbereitschaft für 3-6 Monate. Wenig Fehlzeiten, hohe Produktivität.",
        highlight: "< 2%",
        highlightDesc: "Fehlzeiten",
      },
      {
        icon: Shield,
        title: "Rechtssicher",
        description: "Wir garantieren die Einhaltung aller Vorgaben (Mindestlohn, ZAV, Visum). Kein Risiko für Sie.",
        highlight: "100%",
        highlightDesc: "ZAV-konform",
      },
    ],
  },
  vn: {
    badge: "Tại sao Việt Nam?",
    title: "Lợi thế của bạn",
    subtitle: "Nhân sự chịu được công việc nặng",
    advantages: [
      {
        icon: Dumbbell,
        title: "Chịu được việc nặng",
        description: "Quen việc nặng và chịu nhiệt. Lý tưởng cho đồng ruộng và nhà kính.",
        highlight: "100%",
        highlightDesc: "Sẵn sàng làm việc",
      },
      {
        icon: Zap,
        title: "Động lực cao",
        description: "Sẵn sàng làm việc tối đa 3-6 tháng. Ít nghỉ, năng suất cao.",
        highlight: "< 2%",
        highlightDesc: "Tỷ lệ nghỉ",
      },
      {
        icon: Shield,
        title: "An toàn pháp lý",
        description: "Chúng tôi đảm bảo tuân thủ mọi quy định (Lương tối thiểu, ZAV, Visa). Không rủi ro cho bạn.",
        highlight: "100%",
        highlightDesc: "Đạt chuẩn ZAV",
      },
    ],
  },
};

const statsContent = {
  de: {
    stats: [
      { value: "<8", label: "Wochen bis Einsatz", suffix: "", icon: Timer },
      { value: "100", label: "Legal & Konform", suffix: "%", icon: Shield },
      { value: "250", label: "Vermittelt 2024", suffix: "+", icon: Users },
      { value: "95", label: "Zufriedenheit", suffix: "%", icon: TrendingUp },
    ],
  },
  vn: {
    stats: [
      { value: "<8", label: "Tuần đến khi làm việc", suffix: "", icon: Timer },
      { value: "100", label: "Hợp pháp & Tuân thủ", suffix: "%", icon: Shield },
      { value: "250", label: "Đã giới thiệu 2024", suffix: "+", icon: Users },
      { value: "95", label: "Hài lòng", suffix: "%", icon: TrendingUp },
    ],
  },
};

const ctaContent = {
  de: {
    title: "Hochsaison steht bevor?",
    subtitle: "Sichern Sie sich jetzt belastbares Personal – bevor es andere tun.",
    cta1: "Verfügbarkeit prüfen",
    cta2: "Rückruf anfordern",
    urgency: "Frühbucher-Vorteil: Priorisierte Bearbeitung",
  },
  vn: {
    title: "Mùa cao điểm đang đến?",
    subtitle: "Đảm bảo nhân sự khỏe mạnh ngay – trước khi đối thủ làm điều đó.",
    cta1: "Kiểm tra số lượng",
    cta2: "Yêu cầu gọi lại",
    urgency: "Ưu đãi đặt sớm: Xử lý ưu tiên",
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
  
  // Build hero content from translations
  const content = {
    badge: t.service_pages.seasonal.hero.badge,
    headline: t.service_pages.seasonal.hero.headline,
    headline_accent: t.service_pages.seasonal.hero.headline_accent,
    subheadline: t.service_pages.seasonal.hero.subheadline,
    cta1: t.service_pages.seasonal.hero.cta1,
    cta2: t.service_pages.seasonal.hero.cta2,
    urgency_badge: t.service_pages.seasonal.hero.urgency_badge,
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Mesh Background - Amber/Orange Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-amber-500/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-orange-400/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

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
            {/* Urgency Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <Badge className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 backdrop-blur-sm animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                {content.urgency_badge}
              </Badge>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 backdrop-blur-sm">
                <Zap className="w-4 h-4 mr-2" />
                {content.badge}
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white">{content.headline}</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                {content.headline_accent}
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
                className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                asChild
              >
                <Link href="#contact">
                  {content.cta1}
                  <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-slate-700 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  {content.cta2}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Visual Stats */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Central Speed Indicator */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-80 h-80 rounded-full border-2 border-dashed border-amber-500/20"
              />

              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-8 left-8 w-64 h-64 rounded-full border border-orange-500/30"
              />

              {/* Center content */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                  >
                    <div className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                      4-8
                    </div>
                    <div className="text-white font-medium text-lg">
                      {t.service_pages.seasonal.timeline.weeks_label}
                    </div>
                    <div className="text-amber-400 text-sm mt-1">
                      {t.service_pages.seasonal.timeline.until_work}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-8"
              >
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 px-3 py-1.5">
                  <Zap className="w-3 h-3 mr-1" />
                  {t.service_pages.seasonal.timeline.fast_label}
                </Badge>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 left-8"
              >
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3 py-1.5">
                  <Shield className="w-3 h-3 mr-1" />
                  100% Legal
                </Badge>
              </motion.div>

              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-12 -translate-y-1/2"
              >
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-3 py-1.5">
                  <Users className="w-3 h-3 mr-1" />
                  250+
                </Badge>
              </motion.div>
            </div>
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
          <motion.div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// ADVANTAGES SECTION
// ============================================

function AdvantagesSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    badge: t.service_pages.seasonal.advantages.badge,
    title: t.service_pages.seasonal.advantages.title,
    subtitle: t.service_pages.seasonal.advantages.subtitle,
    advantages: [
      {
        icon: Dumbbell,
        title: t.service_pages.seasonal.advantages.advantage_1_title,
        description: t.service_pages.seasonal.advantages.advantage_1_desc,
        highlight: t.service_pages.seasonal.advantages.advantage_1_highlight,
        highlightDesc: t.service_pages.seasonal.advantages.advantage_1_highlight_desc,
      },
      {
        icon: Zap,
        title: t.service_pages.seasonal.advantages.advantage_2_title,
        description: t.service_pages.seasonal.advantages.advantage_2_desc,
        highlight: t.service_pages.seasonal.advantages.advantage_2_highlight,
        highlightDesc: t.service_pages.seasonal.advantages.advantage_2_highlight_desc,
      },
      {
        icon: Shield,
        title: t.service_pages.seasonal.advantages.advantage_3_title,
        description: t.service_pages.seasonal.advantages.advantage_3_desc,
        highlight: t.service_pages.seasonal.advantages.advantage_3_highlight,
        highlightDesc: t.service_pages.seasonal.advantages.advantage_3_highlight_desc,
      },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-slate-50">
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
            className="mb-6 px-4 py-2 border-amber-200 text-amber-700 bg-amber-50"
          >
            <Zap className="w-4 h-4 mr-2" />
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
                <div className="h-full bg-white rounded-3xl p-8 border border-slate-200 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{advantage.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{advantage.description}</p>

                  {/* Highlight Badge */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
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
// SPEED TIMELINE SECTION
// ============================================

function SpeedTimelineSection() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  
  // Build content from translations
  const content = {
    badge: t.service_pages.seasonal.timeline.badge,
    title: t.service_pages.seasonal.timeline.title,
    subtitle: t.service_pages.seasonal.timeline.subtitle,
    steps: [
      {
        week: t.service_pages.seasonal.timeline.step1_week,
        title: t.service_pages.seasonal.timeline.step1_title,
        description: t.service_pages.seasonal.timeline.step1_desc,
        icon: Users,
      },
      {
        week: t.service_pages.seasonal.timeline.step2_week,
        title: t.service_pages.seasonal.timeline.step2_title,
        description: t.service_pages.seasonal.timeline.step2_desc,
        icon: FileCheck,
      },
      {
        week: t.service_pages.seasonal.timeline.step3_week,
        title: t.service_pages.seasonal.timeline.step3_title,
        description: t.service_pages.seasonal.timeline.step3_desc,
        icon: Plane,
      },
    ],
    key_message: t.service_pages.seasonal.timeline.key_message,
  };
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgress(100);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

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
            className="mb-6 px-4 py-2 border-amber-200 text-amber-700 bg-amber-50"
          >
            <Zap className="w-4 h-4 mr-2" />
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
          {/* Progress Bar Background */}
          <div className="absolute top-20 left-0 right-0 h-2 bg-slate-100 rounded-full mx-8 lg:mx-16" />

          {/* Animated Progress Bar */}
          <motion.div
            className="absolute top-20 left-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-full mx-8 lg:mx-16"
            initial={{ width: "0%" }}
            animate={{ width: isInView ? "100%" : "0%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            style={{ maxWidth: "calc(100% - 4rem)" }}
          />

          {/* Steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.3, type: "spring" }}
                    className="relative z-10 mb-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Week badge */}
                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {t.service_pages.seasonal.timeline.week_label} {step.week}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm max-w-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Key Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-6 py-3">
            <CircleCheck className="w-6 h-6 text-amber-600" />
            <span className="text-amber-800 font-semibold text-lg">{content.key_message}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TALENT POOL SECTION
// ============================================

function TalentPoolSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations - keep profiles structure from original
  const content = {
    badge: t.service_pages.seasonal.talent.badge,
    title: t.service_pages.seasonal.talent.title,
    subtitle: t.service_pages.seasonal.talent.subtitle,
    available_badge: t.service_pages.seasonal.talent.available_badge,
    view_all: t.service_pages.seasonal.talent.view_all,
    profiles: talentPoolContent.de.profiles, // Keep original profiles data
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="py-24 md:py-32 bg-slate-50">
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
            className="mb-6 px-4 py-2 border-amber-200 text-amber-700 bg-amber-50"
          >
            <Users className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-6">
            {content.subtitle}
          </p>

          {/* Available Badge */}
          <Badge className="bg-amber-500 text-white border-0 px-4 py-2 text-base shadow-lg shadow-amber-500/30">
            <Users className="w-4 h-4 mr-2" />
            {content.available_badge}
          </Badge>
        </motion.div>

        {/* Profile Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {talentPoolContent.de.profiles.map((profile, index) => {
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
                <div className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300">
                  {/* Header */}
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                        {profile.avatar}
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                        {profile.available}+ {t.service_pages.seasonal.talent.available_label}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-slate-900">
                      {lang === "de" ? profile.role : lang === "en" ? profile.role : profile.roleVn}
                    </h3>
                    <p className="text-sm text-amber-600">
                      {lang === "de" ? profile.category : lang === "en" ? profile.category : profile.categoryVn}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="p-5 space-y-3">
                    {profile.skills.map((skill, skillIdx) => {
                      const SkillIcon = skill.icon;
                      return (
                        <div key={skillIdx} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <SkillIcon className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="text-sm text-slate-600">{skill.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action */}
                  <div className="px-5 pb-5">
                    <Button
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-amber-500/20"
                      asChild
                    >
                      <Link href="/#contact">
                        <Calendar className="w-4 h-4 mr-2" />
                        {t.service_pages.seasonal.talent.request_label}
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
            className="px-8 py-6 text-base font-semibold border-amber-300 text-amber-700 hover:bg-amber-50 rounded-full"
            asChild
          >
            <Link href="/#contact">
              {content.view_all}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTORS SECTION
// ============================================

function SectorsSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations - keep sectors structure from original
  const content = {
    badge: t.service_pages.seasonal.sectors.badge,
    title: t.service_pages.seasonal.sectors.title,
    subtitle: t.service_pages.seasonal.sectors.subtitle,
    sectors: sectorsContent.de.sectors, // Keep original sectors data
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
            className="mb-6 px-4 py-2 border-amber-200 text-amber-700 bg-amber-50"
          >
            <Wheat className="w-4 h-4 mr-2" />
            {content.badge}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Sector Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {sectorsContent.de.sectors.map((sector, index) => {
            const Icon = sector.icon;
            const SecondaryIcon = sector.secondaryIcon;
            const isAmber = sector.color === "amber";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div
                  className={`h-full rounded-3xl p-8 lg:p-10 border-2 transition-all duration-300 ${
                    isAmber
                      ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10"
                      : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/10"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          isAmber
                            ? "bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30"
                            : "bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                        }`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{sector.title}</h3>
                        <p className={`text-sm font-medium ${isAmber ? "text-amber-600" : "text-orange-600"}`}>
                          {sector.subtitle}
                        </p>
                      </div>
                    </div>
                    <SecondaryIcon
                      className={`w-12 h-12 ${
                        isAmber ? "text-amber-200" : "text-orange-200"
                      } group-hover:scale-110 transition-transform`}
                    />
                  </div>

                  {/* Jobs List */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {sector.jobs.map((job, jobIdx) => (
                      <div
                        key={jobIdx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          isAmber ? "bg-amber-100/50" : "bg-orange-100/50"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${isAmber ? "text-amber-600" : "text-orange-600"}`}
                        />
                        <span className="text-sm text-slate-700">{job}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-2">
                      <Users className={`w-5 h-5 ${isAmber ? "text-amber-600" : "text-orange-600"}`} />
                      <span className="font-bold text-slate-900">{sector.stats.workers}</span>
                      <span className="text-sm text-slate-500">
                        {t.service_pages.seasonal.sectors.workers_label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className={`w-5 h-5 ${isAmber ? "text-amber-600" : "text-orange-600"}`} />
                      <span className="font-bold text-slate-900">{sector.stats.time}</span>
                      <span className="text-sm text-slate-500">
                        {t.service_pages.seasonal.sectors.lead_time_label}
                      </span>
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
// STATS SECTION
// ============================================

function StatsSection() {
  const { lang, t } = useLanguage();
  
  // Build content from translations
  const content = {
    stats: [
      { value: "200+", label: t.service_pages.seasonal.stats.stat1_label, suffix: "", icon: Users },
      { value: "98", label: t.service_pages.seasonal.stats.stat2_label, suffix: "%", icon: Shield },
      { value: "4-8", label: t.service_pages.seasonal.stats.stat3_label, suffix: "", icon: Clock },
    ],
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/20 rounded-full blur-[80px]" />
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
                <div className="text-amber-100 text-sm md:text-base font-medium">
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
    title: t.service_pages.seasonal.cta.title,
    subtitle: t.service_pages.seasonal.cta.subtitle,
    cta1: t.service_pages.seasonal.cta.cta1,
    cta2: t.service_pages.seasonal.cta.cta2,
    urgency: t.service_pages.seasonal.hero.urgency_badge, // Reuse from hero
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="contact" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Urgency Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="px-4 py-2 bg-amber-100 text-amber-800 border-amber-200">
              <Sparkles className="w-4 h-4 mr-2" />
              {content.urgency}
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
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
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
              className="px-8 py-6 text-base font-semibold border-amber-300 text-amber-700 hover:bg-amber-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                <PhoneCall className="w-5 h-5 mr-2" />
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

export default function SeasonalWorkersPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AdvantagesSection />
      <SpeedTimelineSection />
      <TalentPoolSection />
      <SectorsSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}

