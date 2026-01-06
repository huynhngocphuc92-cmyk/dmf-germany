"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { AssetImageWithDebug } from "@/components/ui/AssetImageWithDebug";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Sun,
  Users,
  Building,
  Utensils,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface ServiceFeature {
  text: string;
}

interface ServiceCard {
  id: string;
  icon: React.ElementType;
  secondaryIcon: React.ElementType;
  taglineDe: string;
  taglineVn: string;
  titleDe: string;
  titleVn: string;
  descriptionDe: string;
  descriptionVn: string;
  featuresDe: ServiceFeature[];
  featuresVn: ServiceFeature[];
  href: string;
  accentColor: string;
  bgGradient: string;
}

// ============================================
// SERVICE DATA
// ============================================

const services: ServiceCard[] = [
  {
    id: "azubi",
    icon: GraduationCap,
    secondaryIcon: BookOpen,
    taglineDe: "Investition in die Zukunft",
    taglineVn: "Đầu tư cho tương lai",
    titleDe: "Auszubildende",
    titleVn: "Du học nghề",
    descriptionDe:
      "Duale Ausbildung über 3 Jahre. Langfristige Bindung garantiert. Ideal für Krankenhäuser und Pflegeheime, die eigene Fachkräfte ausbilden möchten.",
    descriptionVn:
      "Đào tạo kép 3 năm. Cam kết gắn bó lâu dài. Dành cho Bệnh viện, Viện dưỡng lão muốn tự đào tạo nhân lực gốc.",
    featuresDe: [
      { text: "Deutschkenntnisse B1/B2 bei Einreise" },
      { text: "Interkulturelle Vorbereitung" },
      { text: "Betreuung während der gesamten Ausbildung" },
    ],
    featuresVn: [
      { text: "Tiếng Đức B1/B2 khi nhập cảnh" },
      { text: "Đào tạo văn hóa xuyên quốc gia" },
      { text: "Hỗ trợ suốt quá trình đào tạo" },
    ],
    href: "/services/azubi",
    accentColor: "blue",
    bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    id: "skilled",
    icon: Briefcase,
    secondaryIcon: Award,
    taglineDe: "Sofort einsatzbereit",
    taglineVn: "Sẵn sàng làm việc ngay",
    titleDe: "Fachkräfte",
    titleVn: "Lao động tay nghề cao",
    descriptionDe:
      "Qualifiziertes Personal mit Hochschulabschluss und Berufserfahrung in Vietnam. Unterstützung beim Anerkennungsverfahren (Visa §18a/b).",
    descriptionVn:
      "Nhân sự đã có bằng Cao đẳng/Đại học và kinh nghiệm tại VN. Quy trình công nhận bằng cấp (Anerkennung).",
    featuresDe: [
      { text: "Anerkannte Berufsqualifikation" },
      { text: "Beschleunigtes Fachkräfteverfahren" },
      { text: "Sofortige Arbeitsfähigkeit" },
    ],
    featuresVn: [
      { text: "Bằng cấp nghề được công nhận" },
      { text: "Quy trình visa nhanh" },
      { text: "Sẵn sàng làm việc ngay" },
    ],
    href: "/services/skilled-workers",
    accentColor: "emerald",
    bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    id: "seasonal",
    icon: Clock,
    secondaryIcon: Sun,
    taglineDe: "Flexibel & Schnell",
    taglineVn: "Linh hoạt & Nhanh chóng",
    titleDe: "Saisonkräfte",
    titleVn: "Lao động thời vụ",
    descriptionDe:
      "Unterstützung in der Hochsaison (3-6 Monate). Ideal für Landwirtschaft, Gastronomie und Hotellerie. Schnelles Visumverfahren.",
    descriptionVn:
      "Hỗ trợ mùa cao điểm (3-6 tháng). Dành cho Nông nghiệp, Nhà hàng, Khách sạn. Thủ tục Visa nhanh gọn.",
    featuresDe: [
      { text: "Flexible Einsatzdauer" },
      { text: "Schnelle Verfügbarkeit (< 8 Wochen)" },
      { text: "Bewährte Arbeitskräfte" },
    ],
    featuresVn: [
      { text: "Thời gian làm việc linh hoạt" },
      { text: "Sẵn sàng nhanh (< 8 tuần)" },
      { text: "Nhân lực đã qua kiểm chứng" },
    ],
    href: "/services/seasonal",
    accentColor: "amber",
    bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
];

// ============================================
// ACCENT COLOR MAPPING
// ============================================

const accentColors: Record<string, {
  badge: string;
  icon: string;
  iconBg: string;
  check: string;
  button: string;
  buttonHover: string;
  ring: string;
}> = {
  blue: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
    check: "text-blue-500",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonHover: "group-hover:bg-blue-600",
    ring: "ring-blue-500/20",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100",
    check: "text-emerald-500",
    button: "bg-emerald-600 hover:bg-emerald-700",
    buttonHover: "group-hover:bg-emerald-600",
    ring: "ring-emerald-500/20",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
    check: "text-amber-500",
    button: "bg-amber-600 hover:bg-amber-700",
    buttonHover: "group-hover:bg-amber-600",
    ring: "ring-amber-500/20",
  },
};

// ============================================
// SERVICE CARD COMPONENT
// ============================================

interface ServiceCardItemProps {
  service: ServiceCard;
  index: number;
  language: "de" | "vn";
  isInView: boolean;
  serviceImage?: string | null;
  serviceImageKey?: string; // Asset key for debug label
}

function ServiceCardItem({ service, index, language, isInView, serviceImage, serviceImageKey }: ServiceCardItemProps) {
  const Icon = service.icon;
  const SecondaryIcon = service.secondaryIcon;
  const colors = accentColors[service.accentColor];

  const tagline = language === "de" ? service.taglineDe : service.taglineVn;
  const title = language === "de" ? service.titleDe : service.titleVn;
  const description = language === "de" ? service.descriptionDe : service.descriptionVn;
  const features = language === "de" ? service.featuresDe : service.featuresVn;
  const ctaText = language === "de" ? "Mehr erfahren" : "Tìm hiểu thêm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={service.href} className="block h-full">
        <Card
          className={`
            relative h-full overflow-hidden
            bg-white border border-slate-200
            shadow-sm
            transition-all duration-500 ease-out
            hover:shadow-2xl hover:shadow-slate-200/50
            hover:-translate-y-2 hover:scale-[1.02]
            hover:border-slate-300
            group cursor-pointer
            ring-0 hover:ring-4 ${colors.ring}
          `}
        >
          {/* Background Gradient */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-br ${service.bgGradient}
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            `}
          />

          {/* Floating Secondary Icon - Background Decoration */}
          <SecondaryIcon
            className={`
              absolute -right-6 -top-6 w-32 h-32
              text-slate-100
              transition-all duration-500 ease-out
              group-hover:text-slate-200/80
              group-hover:scale-110 group-hover:rotate-12
            `}
            strokeWidth={0.5}
          />

          <CardContent className="relative z-10 p-8 h-full flex flex-col">
            {/* Service Image (if available) */}
            {serviceImage && (
              <div className="mb-6 -mx-8 -mt-8 aspect-video relative overflow-hidden rounded-t-lg">
                <AssetImageWithDebug
                  src={serviceImage}
                  configKey={serviceImageKey || `home_prog_${service.id}_img`}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
              </div>
            )}
            
            {/* Header */}
            <div className="mb-6">
              {/* Tagline Badge */}
              <Badge
                variant="outline"
                className={`mb-4 px-3 py-1 text-xs font-semibold ${colors.badge}`}
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                {tagline}
              </Badge>

              {/* Icon + Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`
                    flex-shrink-0 w-14 h-14 rounded-2xl
                    ${colors.iconBg}
                    flex items-center justify-center
                    transition-all duration-300
                    group-hover:scale-110 group-hover:shadow-lg
                  `}
                >
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {service.id === "azubi" && (language === "de" ? "Duale Ausbildung" : "Đào tạo kép")}
                    {service.id === "skilled" && (language === "de" ? "Visa §18a/b" : "Visa §18a/b")}
                    {service.id === "seasonal" && (language === "de" ? "3-6 Monate" : "3-6 tháng")}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
              {description}
            </p>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 ${colors.check} flex-shrink-0 mt-0.5`}
                  />
                  <span className="text-sm text-slate-700">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-auto">
              <Button
                className={`
                  w-full gap-2 
                  bg-slate-900 text-white
                  transition-all duration-300
                  ${colors.buttonHover}
                  group-hover:shadow-lg
                `}
              >
                {ctaText}
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ============================================
// TARGET INDUSTRIES SECTION
// ============================================

interface IndustryBadgeProps {
  icon: React.ElementType;
  label: string;
  delay: number;
  isInView: boolean;
}

function IndustryBadge({ icon: Icon, label, delay, isInView }: IndustryBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay }}
      className="
        flex items-center gap-2 px-4 py-2
        bg-slate-100 rounded-full
        text-sm font-medium text-slate-700
        transition-all duration-300
        hover:bg-slate-200 hover:scale-105
      "
    >
      <Icon className="w-4 h-4 text-slate-500" />
      {label}
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface ServiceGatewayProps {
  nursingImg?: string | null;
  techImg?: string | null;
  hotelImg?: string | null;
}

export function ServiceGateway({ nursingImg, techImg, hotelImg }: ServiceGatewayProps = {}) {
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  // Map images to services
  const serviceImages: Record<string, string | null> = {
    azubi: nursingImg || null,
    skilled: techImg || null,
    seasonal: hotelImg || null,
  };

  // Map asset keys for debug labels
  const serviceImageKeys: Record<string, string> = {
    azubi: "home_prog_nursing_img",
    skilled: "home_prog_tech_img",
    seasonal: "home_prog_hotel_img",
  };

  // Content
  const content = {
    badge: language === "de" ? "Unsere Lösungen" : "Giải pháp của chúng tôi",
    title: language === "de"
      ? "Welche Fachkräfte suchen Sie?"
      : "Bạn đang tìm kiếm nhân lực nào?",
    subtitle: language === "de"
      ? "Wählen Sie die passende Lösung für Ihren Personalbedarf"
      : "Chọn giải pháp phù hợp với nhu cầu nhân sự của bạn",
    industriesTitle: language === "de"
      ? "Für alle Branchen"
      : "Cho mọi ngành nghề",
  };

  const industries = language === "de"
    ? [
        { icon: Building, label: "Krankenhäuser" },
        { icon: Users, label: "Pflegeheime" },
        { icon: Utensils, label: "Gastronomie" },
        { icon: Sun, label: "Landwirtschaft" },
        { icon: Building, label: "Hotellerie" },
      ]
    : [
        { icon: Building, label: "Bệnh viện" },
        { icon: Users, label: "Viện dưỡng lão" },
        { icon: Utensils, label: "Nhà hàng" },
        { icon: Sun, label: "Nông nghiệp" },
        { icon: Building, label: "Khách sạn" },
      ];

  return (
    <section
      ref={sectionRef}
      id="service-gateway"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container relative mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-5 py-2 text-sm font-medium border-slate-300 text-slate-700 bg-white"
          >
            <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
            {content.badge}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            {content.title}
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCardItem
              key={service.id}
              service={service}
              index={index}
              language={language}
              isInView={isInView}
              serviceImage={serviceImages[service.id]}
              serviceImageKey={serviceImageKeys[service.id]}
            />
          ))}
        </div>

        {/* Industries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-slate-500 mb-4">
            {content.industriesTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {industries.map((industry, index) => (
              <IndustryBadge
                key={index}
                icon={industry.icon}
                label={industry.label}
                delay={0.6 + index * 0.1}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

