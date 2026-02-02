"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  CheckCircle2,
  Clock,
  Award,
  Building2,
  FileCheck,
  Home,
  Briefcase,
  Languages,
  Calendar,
  Target,
  Sparkles,
  PhoneCall,
  ArrowRight,
  BadgeCheck,
  Brain,
  School,
  TrendingUp,
  Lightbulb,
  ClipboardCheck,
} from "lucide-react";

// ============================================
// SERVICE MODULES DATA (P1.1 - P3.7) - STUDIUM
// ============================================

// Service modules are now defined inside TransparencySection to use translations

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl min-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full py-24 lg:py-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 px-4 py-2 bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 backdrop-blur-sm">
                <School className="w-4 h-4 mr-2" />
                {b2b?.studium?.badge || "Studienprogramm"}
              </Badge>
            </motion.div>

            {/* Main Statement */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">{b2b?.common?.hero_title || "DMF – Ihre Akademie für"}</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
                {b2b?.common?.hero_accent || "qualifizierte Talente"}
              </span>
              <br />
              <span className="text-white">{b2b?.common?.hero_suffix || "aus Vietnam"}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 max-w-lg">
              {b2b?.studium?.subheadline || "Wir bereiten vietnamesische Studierende auf ein erfolgreiches Studium in Deutschland vor. TestAS Coaching, 1. Semester Mentoring und Karrierebegleitung bis zum Berufseinstieg."}
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-white font-bold">TestAS</div>
                  <div className="text-slate-500 text-xs">{b2b?.studium?.stat1_label || "Coaching"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-bold">1. Semester</div>
                  <div className="text-slate-500 text-xs">{b2b?.studium?.stat2_label || "Mentoring"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-white font-bold">{t.nav?.cooperation === "Cooperation & Programs" ? "Career" : "Karriere"}</div>
                  <div className="text-slate-500 text-xs">{b2b?.studium?.stat3_label || "Coaching"}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  {b2b?.common?.cta_profiles || "Studentenprofile anfordern"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-slate-600 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  {b2b?.common?.cta_consultation || "Beratung vereinbaren"}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <div className="text-center mb-6">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  {b2b?.common?.your_academy || "Ihre Akademie für Talente"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.studium?.testas_prep || "TestAS Vorbereitung"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.studium?.intensive_coaching || "Intensives Coaching"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.studium?.academic_german || "Akademisches Deutsch"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.studium?.dsh_testdaf || "DSH/TestDaF Niveau"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.studium?.first_semester || "1. Semester Begleitung"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.studium?.academic_mentoring || "Akademisches Mentoring"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <div className="text-slate-400 text-sm">{b2b?.common?.costs_only_for || "Kosten ausschließlich für"}</div>
                <div className="text-white font-semibold mt-1">{b2b?.studium?.study_support || "Bildung & Studienbegleitung"}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRANSPARENCY GRID SECTION
// ============================================

function TransparencySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  const getPhases = () => [
    { name: b2b?.common?.phase_preparation || "Vorbereitung", color: "indigo", icon: BookOpen, key: "preparation" },
    { name: b2b?.common?.phase_administration || "Administration", color: "slate", icon: FileCheck, key: "administration" },
    { name: b2b?.common?.phase_integration || "Integration", color: "emerald", icon: Home, key: "integration" },
  ];

  const getServiceModules = () => [
    {
      code: "P1.1",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.studium?.p1_1_service || "Rekrutierung & Eignungstest",
      description: b2b?.studium?.p1_1_desc || "Akademische Eignung und Studierfähigkeit prüfen",
    },
    {
      code: "P1.2",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.studium?.p1_2_service || "Deutschkurs A1-B2/C1",
      description: b2b?.studium?.p1_2_desc || "DSH/TestDaF Vorbereitung, akademisches Deutsch",
    },
    {
      code: "P1.3",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.studium?.p1_3_service || "TestAS Coaching",
      description: b2b?.studium?.p1_3_desc || "Intensive Vorbereitung auf den Studierfähigkeitstest",
    },
    {
      code: "P1.4",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.studium?.p1_4_service || "Studienkolleg-Vorbereitung",
      description: b2b?.studium?.p1_4_desc || "Fachspezifische Grundlagen für das Studium",
    },
    {
      code: "P2.1",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.studium?.p2_1_service || "Uni-Bewerbungsservice",
      description: b2b?.studium?.p2_1_desc || "uni-assist, Direktbewerbung, Zulassungsverfahren",
    },
    {
      code: "P2.2",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.studium?.p2_2_service || "Visa-Antragstellung",
      description: b2b?.studium?.p2_2_desc || "Studienvisum, Sperrkonto, Krankenversicherung",
    },
    {
      code: "P2.3",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.studium?.p2_3_service || "Behördenkorrespondenz",
      description: b2b?.studium?.p2_3_desc || "Ausländerbehörde, Hochschule, Botschaft",
    },
    {
      code: "P3.1",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_1_service || "Flughafenabholung",
      description: b2b?.studium?.p3_1_desc || "Persönliche Abholung und Transfer zur Unterkunft",
    },
    {
      code: "P3.2",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_2_service || "7-Tage Settling-in Kit",
      description: b2b?.studium?.p3_2_desc || "Wohnung, Anmeldung, Bankkonto, SIM-Karte, Orientierung",
    },
    {
      code: "P3.3",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_3_service || "Immatrikulation",
      description: b2b?.studium?.p3_3_desc || "Begleitung zur Einschreibung und Studienberatung",
    },
    {
      code: "P3.4",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_4_service || "1. Semester Mentoring",
      description: b2b?.studium?.p3_4_desc || "Akademische Begleitung, Lernstrategien, Prüfungsvorbereitung",
    },
    {
      code: "P3.5",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_5_service || "Werkstudenten-Vermittlung",
      description: b2b?.studium?.p3_5_desc || "Unterstützung bei der Suche nach Nebenjobs",
    },
    {
      code: "P3.6",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_6_service || "Kulturelle Betreuung",
      description: b2b?.studium?.p3_6_desc || "Community-Events, Mentoring, Networking",
    },
    {
      code: "P3.7",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.studium?.p3_7_service || "Karriere-Coaching",
      description: b2b?.studium?.p3_7_desc || "Praktika-Vermittlung, Bewerbungstraining für deutschen Arbeitsmarkt",
    },
  ];

  const phases = getPhases();
  const serviceModules = getServiceModules();

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
            className="mb-6 px-4 py-2 border-indigo-200 text-indigo-700 bg-indigo-50"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            {b2b?.common?.transparency_badge || "Vollständige Transparenz"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.common?.transparency_title || "Alle Leistungen im Überblick"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.common?.transparency_subtitle || "Von P1.1 bis P3.7 - jede Leistung ist klar definiert. Kosten ausschließlich für Bildung und Studienbegleitung."}
          </p>
        </motion.div>

        {/* Phase Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  phase.color === "indigo"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : phase.color === "emerald"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{phase.name}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Service Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead className="font-bold text-slate-900 py-4">{b2b?.common?.table_code || "Code"}</TableHead>
                <TableHead className="font-bold text-slate-900">{b2b?.common?.table_phase || "Phase"}</TableHead>
                <TableHead className="font-bold text-slate-900">{b2b?.common?.table_service || "Leistung"}</TableHead>
                <TableHead className="font-bold text-slate-900 hidden md:table-cell">{b2b?.common?.table_description || "Beschreibung"}</TableHead>
                <TableHead className="font-bold text-slate-900 text-center">{b2b?.common?.table_included || "Inkl."}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceModules.map((module) => (
                <TableRow
                  key={module.code}
                  className={`${
                    module.phaseKey === "preparation"
                      ? "bg-indigo-50/50 hover:bg-indigo-50"
                      : module.phaseKey === "administration"
                      ? "bg-white hover:bg-slate-50"
                      : "bg-emerald-50/50 hover:bg-emerald-50"
                  }`}
                >
                  <TableCell className="font-mono font-bold text-slate-600">{module.code}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        module.phaseKey === "preparation"
                          ? "border-indigo-200 text-indigo-700 bg-indigo-100"
                          : module.phaseKey === "administration"
                          ? "border-slate-200 text-slate-700 bg-slate-100"
                          : "border-emerald-200 text-emerald-700 bg-emerald-100"
                      }`}
                    >
                      {module.phase}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{module.service}</TableCell>
                  <TableCell className="text-slate-600 hidden md:table-cell">{module.description}</TableCell>
                  <TableCell className="text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Cost Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl border border-indigo-200 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-bold text-slate-900">
              {b2b?.common?.cost_disclaimer || "Transparente Kostenstruktur"}
            </span>
          </div>
          <p className="text-slate-600">
            {b2b?.common?.cost_disclaimer_text || "Alle Kosten sind ausschließlich für Bildungsdienstleistungen und Studienbegleitung. Keine versteckten Vermittlungsgebühren."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// QUALITY GATES SECTION - STUDIUM FOCUS
// ============================================

function QualityGatesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  const getQualityGates = () => [
    {
      gate: `${b2b?.common?.gate || "Gate"} 1`,
      title: b2b?.studium?.gate1_title || "TestAS Coaching",
      description: b2b?.studium?.gate1_desc || "Intensive Vorbereitung auf den Studierfähigkeitstest",
      items: (b2b?.studium?.gate1_items || "Kerntest-Training|Fachmodule üben|Strategien & Zeitmanagement").split("|"),
      icon: Brain,
      color: "indigo",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 2`,
      title: b2b?.studium?.gate2_title || "Sprachkompetenz",
      description: b2b?.studium?.gate2_desc || "DSH/TestDaF Niveau für akademisches Studium",
      items: (b2b?.studium?.gate2_items || "Akademisches Deutsch|Wissenschaftliches Schreiben|Präsentationstechnik").split("|"),
      icon: Languages,
      color: "emerald",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 3`,
      title: b2b?.studium?.gate3_title || "1. Semester Mentoring",
      description: b2b?.studium?.gate3_desc || "Akademische Begleitung für erfolgreichen Start",
      items: (b2b?.studium?.gate3_items || "Lernstrategien|Prüfungsvorbereitung|Zeitmanagement").split("|"),
      icon: GraduationCap,
      color: "indigo",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 4`,
      title: b2b?.studium?.gate4_title || "Karriereentwicklung",
      description: b2b?.studium?.gate4_desc || "Vorbereitung auf den deutschen Arbeitsmarkt",
      items: (b2b?.studium?.gate4_items || "Praktika-Vermittlung|Bewerbungstraining|Networking-Events").split("|"),
      icon: TrendingUp,
      color: "emerald",
    },
  ];

  const qualityGates = getQualityGates();

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
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Award className="w-4 h-4 mr-2" />
            {b2b?.common?.quality_badge || "Qualitätssicherung"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.studium?.quality_title || "4 Quality Gates für Studienerfolg"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.studium?.quality_subtitle || "Von TestAS Coaching bis Karrierebegleitung - wir begleiten Studierende auf dem gesamten Weg zum erfolgreichen Berufseinstieg in Deutschland."}
          </p>
        </motion.div>

        {/* Quality Gates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityGates.map((gate, index) => {
            const Icon = gate.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                  {/* Gate Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`${
                        gate.color === "indigo"
                          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {gate.gate}
                    </Badge>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        gate.color === "indigo"
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{gate.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{gate.description}</p>

                  {/* Checklist */}
                  <ul className="space-y-2">
                    {gate.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className={`w-4 h-4 ${
                          gate.color === "indigo" ? "text-indigo-500" : "text-emerald-500"
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-bold text-white">{b2b?.studium?.gate3_title || "1. Semester Mentoring"}</h3>
          </div>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-6">
            {b2b?.studium?.mentoring_text || "Die ersten Monate im Studium sind entscheidend. Unser Mentoring-Programm begleitet Studierende bei akademischen Herausforderungen und sichert den Studienerfolg."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <BadgeCheck className="w-4 h-4 mr-2" />
              {b2b?.studium?.academic_support || "Akademische Begleitung"}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Lightbulb className="w-4 h-4 mr-2" />
              {b2b?.studium?.individual_support || "Individuelle Unterstützung"}
            </Badge>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SETTLEMENT KIT SECTION
// ============================================

function SettlementKitSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  const getSettlementDays = () => [
    {
      day: `${b2b?.common?.day || "Tag"} 1`,
      title: b2b?.common?.day1_title || "Ankunft & Transfer",
      items: (b2b?.common?.day1_items || "Flughafenabholung|Transfer zur Unterkunft|Erste Orientierung").split("|"),
      icon: "✈️",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 2`,
      title: b2b?.common?.day2_title || "Wohnung & Basics",
      items: (b2b?.common?.day2_items || "Schlüsselübergabe|Haushaltsausstattung|Nahversorgung erkunden").split("|"),
      icon: "🏠",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 3`,
      title: b2b?.common?.day3_title || "Behördengänge",
      items: (b2b?.common?.day3_items || "Einwohnermeldeamt|Aufenthaltstitel|Steuer-ID beantragen").split("|"),
      icon: "📋",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 4`,
      title: b2b?.common?.day4_title || "Finanzen & Kommunikation",
      items: (b2b?.common?.day4_items || "Bankkonto eröffnen|SIM-Karte aktivieren|Semesterticket").split("|"),
      icon: "💳",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 5`,
      title: b2b?.common?.day5_title || "Gesundheit & Soziales",
      items: (b2b?.common?.day5_items || "Krankenkasse anmelden|Hochschulsport|AStA & Beratung").split("|"),
      icon: "🏥",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 6`,
      title: b2b?.studium?.day6_title_studium || "Uni-Vorbereitung",
      items: (b2b?.studium?.day6_items_studium || "Campus-Tour|Bibliotheksausweis|IT-Zugänge einrichten").split("|"),
      icon: "🎓",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 7`,
      title: b2b?.studium?.day7_title_studium || "Studienstart",
      items: (b2b?.studium?.day7_items_studium || "Einschreibung|Stundenplan erstellen|Bereit für Semester!").split("|"),
      icon: "🎯",
    },
  ];

  const settlementDays = getSettlementDays();

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
            className="mb-6 px-4 py-2 border-indigo-200 text-indigo-700 bg-indigo-50"
          >
            <Home className="w-4 h-4 mr-2" />
            {b2b?.common?.settlement_badge || "Settling-in Service"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.common?.settlement_title || "7-Tage Settling-in Kit"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.studium?.settlement_subtitle || "Vollständige Betreuung in der ersten Woche garantiert einen stressfreien Studienstart und minimiert das Risiko von Studienabbrüchen."}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-emerald-200 to-indigo-200 rounded-full hidden lg:block" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {settlementDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative"
              >
                {/* Day Circle */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 relative z-10">
                    {day.icon}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="text-center mb-3">
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                      {day.day}
                    </Badge>
                    <h4 className="font-bold text-slate-900 mt-2 text-sm">{day.title}</h4>
                  </div>
                  <ul className="space-y-1">
                    {day.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1 text-xs text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Result Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-2xl border border-emerald-200 p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">&lt;8%</div>
              <div className="text-slate-600">{b2b?.studium?.dropout_studium || "Studienabbruchquote"}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">92%</div>
              <div className="text-slate-600">{b2b?.studium?.graduation_rate || "Regelstudienzeit"}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-slate-600">{b2b?.studium?.first_sem_support || "Begleitung im 1. Semester"}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <Sparkles className="w-4 h-4 mr-2" />
            {b2b?.studium?.cta_highlight || "Nächster Studienstart: Wintersemester 2026/27"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            {b2b?.studium?.cta_title || "Partner für internationale Studierende?"}
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            {b2b?.studium?.cta_subtitle || "Wir bereiten vietnamesische Studierende optimal auf das Studium in Deutschland vor. TestAS Coaching, Sprachkurse und 1. Semester Mentoring inklusive."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                {b2b?.common?.cta_profiles || "Studentenprofile anfordern"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-slate-600 text-white hover:bg-slate-800/50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                <PhoneCall className="w-5 h-5 mr-2" />
                {b2b?.common?.cta_consultation || "Beratung vereinbaren"}
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

export default function StudiumPartnerPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TransparencySection />
      <QualityGatesSection />
      <SettlementKitSection />
      <CTASection />
    </main>
  );
}
