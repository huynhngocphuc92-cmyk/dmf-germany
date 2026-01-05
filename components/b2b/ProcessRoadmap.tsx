"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Handshake,
  FileCheck,
  Plane,
  Check,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface ChecklistItem {
  text: string;
}

interface ProcessStep {
  id: number;
  titleDe: string;
  titleVn: string;
  icon: React.ElementType;
  checklistDe: ChecklistItem[];
  checklistVn: ChecklistItem[];
}

// ============================================
// PROCESS DATA
// ============================================

const processSteps: ProcessStep[] = [
  {
    id: 1,
    titleDe: "Rekrutierung & Vorselektion",
    titleVn: "Tuyển dụng & Sơ tuyển",
    icon: Users,
    checklistDe: [
      { text: "Überprüfung der Qualifikationen (Abitur/Berufsausbildung)" },
      { text: "Motivationsgespräch und Eignungstest" },
      { text: "Vorläufige Gesundheitsprüfung" },
      { text: "Dokumentenprüfung und Referenzen" },
    ],
    checklistVn: [
      { text: "Kiểm tra bằng cấp (Tốt nghiệp THPT/Nghề)" },
      { text: "Phỏng vấn động lực và kiểm tra năng lực" },
      { text: "Kiểm tra sức khỏe sơ bộ" },
      { text: "Xác minh hồ sơ và tham chiếu" },
    ],
  },
  {
    id: 2,
    titleDe: "Intensive Sprachausbildung",
    titleVn: "Đào tạo tiếng Đức chuyên sâu",
    icon: BookOpen,
    checklistDe: [
      { text: "Deutschkurse A1 bis B2 nach Telc/Goethe-Standard" },
      { text: "Fachsprachlicher Unterricht (Pflege, Gastronomie, etc.)" },
      { text: "Interkulturelles Training: Deutsche Arbeitskultur" },
      { text: "Prüfungsvorbereitung und Zertifizierung" },
    ],
    checklistVn: [
      { text: "Khóa học tiếng Đức A1 đến B2 theo chuẩn Telc/Goethe" },
      { text: "Đào tạo ngôn ngữ chuyên ngành (Điều dưỡng, Nhà hàng...)" },
      { text: "Huấn luyện văn hóa: Văn hóa làm việc Đức" },
      { text: "Luyện thi và cấp chứng chỉ" },
    ],
  },
  {
    id: 3,
    titleDe: "Matching & Vertrag",
    titleVn: "Kết nối & Ký hợp đồng",
    icon: Handshake,
    checklistDe: [
      { text: "Übermittlung der Kandidatenprofile an deutsche Partner" },
      { text: "Online-Vorstellungsgespräch (Zoom/MS Teams)" },
      { text: "Vertragsverhandlung und Unterzeichnung" },
      { text: "Festlegung von Starttermin und Konditionen" },
    ],
    checklistVn: [
      { text: "Gửi hồ sơ ứng viên cho đối tác Đức" },
      { text: "Phỏng vấn online (Zoom/MS Teams)" },
      { text: "Đàm phán và ký kết hợp đồng" },
      { text: "Xác định ngày bắt đầu và điều kiện" },
    ],
  },
  {
    id: 4,
    titleDe: "Visum & Anerkennung",
    titleVn: "Visa & Công nhận bằng cấp",
    icon: FileCheck,
    checklistDe: [
      { text: "Beschleunigtes Fachkräfteverfahren bei der Botschaft" },
      { text: "Beglaubigte Übersetzungen aller Dokumente" },
      { text: "Unterstützung beim Anerkennungsverfahren" },
      { text: "Koordination mit deutschen Behörden" },
    ],
    checklistVn: [
      { text: "Thủ tục visa nhanh tại Đại sứ quán" },
      { text: "Dịch thuật công chứng tất cả hồ sơ" },
      { text: "Hỗ trợ quy trình công nhận bằng cấp" },
      { text: "Phối hợp với cơ quan Đức" },
    ],
  },
  {
    id: 5,
    titleDe: "Ankunft & Integration",
    titleVn: "Đến Đức & Hòa nhập",
    icon: Plane,
    checklistDe: [
      { text: "Flughafenabholung und erste Orientierung" },
      { text: "Unterstützung bei der Wohnungssuche" },
      { text: "Begleitung bei Behördengängen (Anmeldung, Bankkonto)" },
      { text: "Langfristige Nachbetreuung und Integration" },
    ],
    checklistVn: [
      { text: "Đón sân bay và hướng dẫn ban đầu" },
      { text: "Hỗ trợ tìm kiếm nhà ở" },
      { text: "Đồng hành thủ tục hành chính (Đăng ký cư trú, Tài khoản ngân hàng)" },
      { text: "Hỗ trợ dài hạn và hội nhập" },
    ],
  },
];

// ============================================
// PREMIUM TIMELINE NODE
// ============================================

interface PremiumTimelineNodeProps {
  step: ProcessStep;
  isInView: boolean;
}

function PremiumTimelineNode({ step, isInView }: PremiumTimelineNodeProps) {
  const Icon = step.icon;

  return (
    <div className="relative">
      {/* Outer Glow Ring - Only visible when active */}
      <div
        className={`
          absolute inset-0 rounded-full
          transition-all duration-700 ease-out
          ${isInView 
            ? "bg-gradient-to-br from-blue-400/40 to-blue-600/40 blur-xl scale-150 opacity-100" 
            : "opacity-0 scale-100"
          }
        `}
      />
      
      {/* Main Node */}
      <div
        className={`
          relative z-10 flex items-center justify-center
          w-16 h-16 md:w-20 md:h-20 rounded-full
          bg-white
          transition-all duration-500 ease-out
          ${isInView 
            ? "shadow-[0_0_30px_rgba(37,99,235,0.5)] scale-105" 
            : "shadow-lg scale-100"
          }
        `}
        style={{
          background: isInView 
            ? "linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #1e40af) border-box"
            : "white",
          border: isInView ? "4px solid transparent" : "4px solid #e2e8f0",
        }}
      >
        <Icon 
          className={`
            h-7 w-7 md:h-8 md:w-8 
            transition-all duration-500
            ${isInView ? "text-blue-600" : "text-slate-400"}
          `} 
        />
      </div>
    </div>
  );
}

// ============================================
// PREMIUM STEP CARD
// ============================================

interface PremiumStepCardProps {
  step: ProcessStep;
  index: number;
  language: "de" | "vn";
}

function PremiumStepCard({ step, index, language }: PremiumStepCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isLeft = index % 2 === 0;

  const title = language === "de" ? step.titleDe : step.titleVn;
  const checklist = language === "de" ? step.checklistDe : step.checklistVn;

  // Watermark number
  const watermarkNumber = String(step.id).padStart(2, "0");

  return (
    <div ref={ref} className="relative">
      {/* ======================= */}
      {/* MOBILE LAYOUT (<md)     */}
      {/* ======================= */}
      <div className="md:hidden flex items-start gap-6">
        {/* Timeline Node */}
        <div className="flex-shrink-0 relative z-10">
          <PremiumTimelineNode step={step} isInView={isInView} />
        </div>

        {/* Connector Line */}
        <div className="absolute left-[72px] top-8 w-6 h-0.5 bg-gradient-to-r from-blue-300 to-blue-500" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 10 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 pb-16"
        >
          <Card 
            className="
              relative overflow-hidden
              bg-white border border-slate-100 
              shadow-lg hover:shadow-2xl 
              hover:-translate-y-1
              transition-all duration-300 ease-out
              group
            "
          >
            {/* Accent Line - Left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700" />
            
            {/* Watermark Number */}
            <div 
              className="
                absolute -right-4 -top-6
                text-[120px] font-black leading-none
                text-slate-100/80
                select-none pointer-events-none
                transition-all duration-300
                group-hover:text-slate-100
              "
            >
              {watermarkNumber}
            </div>

            <CardContent className="relative z-10 p-6">
              {/* Step Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                  {language === "de" ? `Schritt ${step.id}` : `Bước ${step.id}`}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-800 mb-4 leading-tight">
                {title}
              </h3>

              {/* Checklist */}
              <ul className="space-y-3">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ======================= */}
      {/* DESKTOP LAYOUT (>=md)   */}
      {/* Zigzag Pattern          */}
      {/* ======================= */}
      <div className="hidden md:grid md:grid-cols-[1fr_120px_1fr] gap-0 items-center">
        {/* LEFT COLUMN */}
        <div className={`flex ${isLeft ? "justify-end" : "justify-start"}`}>
          {isLeft && (
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md"
            >
              <Card 
                className="
                  relative overflow-hidden
                  bg-white border border-slate-100 
                  shadow-lg hover:shadow-2xl 
                  hover:-translate-y-2
                  transition-all duration-300 ease-out
                  group
                "
              >
                {/* Accent Line - Right side (pointing to center) */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700" />
                
                {/* Watermark Number */}
                <div 
                  className="
                    absolute -left-2 -top-8
                    text-[160px] font-black leading-none
                    text-slate-100/70
                    select-none pointer-events-none
                    transition-all duration-300
                    group-hover:text-slate-100/90
                  "
                >
                  {watermarkNumber}
                </div>

                <CardContent className="relative z-10 p-8 text-right">
                  {/* Step Label */}
                  <div className="flex items-center justify-end gap-2 mb-3">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      {language === "de" ? `Schritt ${step.id}` : `Bước ${step.id}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-5 leading-tight">
                    {title}
                  </h3>

                  {/* Checklist */}
                  <ul className="space-y-3">
                    {checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start justify-end gap-3 text-sm">
                        <span className="text-slate-600 leading-relaxed">{item.text}</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* CENTER COLUMN - Node & Connectors */}
        <div className="flex items-center justify-center relative h-full">
          {/* Left Connector Line */}
          {isLeft && (
            <div className="absolute right-[60px] w-[60px] h-[3px] bg-gradient-to-r from-blue-300/50 to-blue-500">
              {/* Arrow tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 
                border-t-[5px] border-t-transparent 
                border-l-[8px] border-l-blue-500 
                border-b-[5px] border-b-transparent" 
              />
            </div>
          )}

          {/* Right Connector Line */}
          {!isLeft && (
            <div className="absolute left-[60px] w-[60px] h-[3px] bg-gradient-to-l from-blue-300/50 to-blue-500">
              {/* Arrow tip */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 
                border-t-[5px] border-t-transparent 
                border-r-[8px] border-r-blue-500 
                border-b-[5px] border-b-transparent" 
              />
            </div>
          )}

          {/* Timeline Node */}
          <PremiumTimelineNode step={step} isInView={isInView} />
        </div>

        {/* RIGHT COLUMN */}
        <div className={`flex ${!isLeft ? "justify-start" : "justify-end"}`}>
          {!isLeft && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md"
            >
              <Card 
                className="
                  relative overflow-hidden
                  bg-white border border-slate-100 
                  shadow-lg hover:shadow-2xl 
                  hover:-translate-y-2
                  transition-all duration-300 ease-out
                  group
                "
              >
                {/* Accent Line - Left side (pointing to center) */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700" />
                
                {/* Watermark Number */}
                <div 
                  className="
                    absolute -right-2 -top-8
                    text-[160px] font-black leading-none
                    text-slate-100/70
                    select-none pointer-events-none
                    transition-all duration-300
                    group-hover:text-slate-100/90
                  "
                >
                  {watermarkNumber}
                </div>

                <CardContent className="relative z-10 p-8">
                  {/* Step Label */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      {language === "de" ? `Schritt ${step.id}` : `Bước ${step.id}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-5 leading-tight">
                    {title}
                  </h3>

                  {/* Checklist */}
                  <ul className="space-y-3">
                    {checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProcessRoadmap() {
  const { language } = useLanguage();

  // Content
  const title = language === "de" ? "Unser Prozess" : "Quy trình của chúng tôi";
  const subtitle = language === "de"
    ? "Transparenter Ablauf von der Rekrutierung bis zur erfolgreichen Integration in Deutschland"
    : "Quy trình minh bạch từ tuyển dụng đến hội nhập thành công tại Đức";
  const badgeText = language === "de" ? "Schritt für Schritt" : "Từng bước một";
  const ctaText = language === "de"
    ? "Prozess-Guide als PDF herunterladen"
    : "Tải quy trình chi tiết (PDF)";
  const ctaSubtext = language === "de"
    ? "Ausführliche Dokumentation für Ihre interne Prüfung"
    : "Tài liệu chi tiết cho đánh giá nội bộ của bạn";

  return (
    <section
      id="process-roadmap"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container relative mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <Badge
            variant="outline"
            className="mb-6 px-5 py-2 text-sm font-medium border-blue-200 text-blue-700 bg-blue-50/80 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {badgeText}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {title}
          </h2>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* ======================= */}
          {/* GRADIENT TIMELINE LINE  */}
          {/* ======================= */}
          
          {/* Mobile - Left aligned - stops before success node */}
          <div 
            className="
              md:hidden absolute left-8 top-0 w-1 
              bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700
              rounded-full
            "
            style={{ bottom: '140px' }}
          />

          {/* Desktop - Center aligned - stops before success node */}
          <div 
            className="
              hidden md:block absolute left-1/2 top-0 w-1 
              -translate-x-1/2
              bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700
              rounded-full
            "
            style={{ bottom: '180px' }}
          />

          {/* Steps */}
          <div className="space-y-8 md:space-y-20">
            {processSteps.map((step, index) => (
              <PremiumStepCard 
                key={step.id} 
                step={step} 
                index={index} 
                language={language} 
              />
            ))}
          </div>

          {/* ======================= */}
          {/* SUCCESS END NODE        */}
          {/* ======================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mt-12 md:mt-20"
          >
            {/* Mobile */}
            <div className="md:hidden flex items-center gap-5">
              <div 
                className="
                  relative w-16 h-16 rounded-full 
                  bg-gradient-to-br from-emerald-400 to-emerald-600 
                  flex items-center justify-center 
                  shadow-[0_0_40px_rgba(16,185,129,0.4)]
                "
              >
                <Check className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800">
                  {language === "de" ? "Erfolg!" : "Thành công!"}
                </span>
                <p className="text-sm text-slate-500">
                  {language === "de" ? "Integration abgeschlossen" : "Hội nhập hoàn tất"}
                </p>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex flex-col items-center gap-4">
              <div 
                className="
                  relative w-24 h-24 rounded-full 
                  bg-gradient-to-br from-emerald-400 to-emerald-600 
                  flex items-center justify-center 
                  shadow-[0_0_60px_rgba(16,185,129,0.5)]
                "
              >
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-slate-800 block">
                  {language === "de" ? "Erfolg!" : "Thành công!"}
                </span>
                <p className="text-slate-500">
                  {language === "de" ? "Integration erfolgreich abgeschlossen" : "Hội nhập thành công tại Đức"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ======================= */}
        {/* CTA SECTION             */}
        {/* ======================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mt-20 md:mt-28"
        >
          <Card 
            className="
              relative overflow-hidden
              max-w-2xl mx-auto 
              bg-gradient-to-br from-slate-900 to-slate-800
              border-0
              shadow-2xl
            "
          >
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <CardContent className="relative z-10 p-10 md:p-12 text-center">
              <div className="mb-8">
                <div 
                  className="
                    w-16 h-16 mx-auto rounded-2xl 
                    bg-gradient-to-br from-blue-500 to-blue-600 
                    flex items-center justify-center 
                    mb-5
                    shadow-lg shadow-blue-500/30
                  "
                >
                  <Download className="h-8 w-8 text-white" />
                </div>
                <p className="text-slate-400 text-sm">{ctaSubtext}</p>
              </div>

              <Button
                size="lg"
                className="
                  gap-3 
                  bg-white hover:bg-slate-100 
                  text-slate-900 
                  shadow-lg hover:shadow-xl 
                  transition-all duration-300
                  px-8 py-6 text-base font-semibold
                  hover:-translate-y-0.5
                "
              >
                <Download className="h-5 w-5" />
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="mt-6 text-xs text-slate-500">
                {language === "de"
                  ? "PDF-Dokument • 12 Seiten • Deutsch"
                  : "Tài liệu PDF • 12 trang • Tiếng Đức"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
