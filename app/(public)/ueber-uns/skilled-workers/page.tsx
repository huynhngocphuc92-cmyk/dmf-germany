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
  Briefcase,
  BookOpen,
  Users,
  Shield,
  CheckCircle2,
  Clock,
  Award,
  Building2,
  FileCheck,
  Home,
  Languages,
  Calendar,
  Target,
  Sparkles,
  PhoneCall,
  ArrowRight,
  BadgeCheck,
  Wrench,
  TrendingUp,
  ClipboardCheck,
  Handshake,
  UserCheck,
  Scale,
  FileText,
  Building,
  Hammer,
  Stethoscope,
} from "lucide-react";

// ============================================
// SERVICE MODULES DATA (P1.1 - P3.7) - SKILLED WORKERS
// ============================================

// Service modules are now defined inside TransparencySection to use translations

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
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
              <Badge className="mb-6 px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 backdrop-blur-sm">
                <Briefcase className="w-4 h-4 mr-2" />
                {b2b?.skilled_workers?.badge || "Fachkräfte §18a/b"}
              </Badge>
            </motion.div>

            {/* Main Statement */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">{b2b?.common?.hero_title || "DMF – Ihre Akademie für"}</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-blue-400 bg-clip-text text-transparent">
                {b2b?.common?.hero_accent || "qualifizierte Talente"}
              </span>
              <br />
              <span className="text-white">{b2b?.common?.hero_suffix || "aus Vietnam"}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 max-w-lg">
              {b2b?.skilled_workers?.subheadline || "Wir begleiten qualifizierte Fachkräfte bei der Anerkennung ihrer Abschlüsse und dem erfolgreichen Einstieg in den deutschen Arbeitsmarkt. Placement Service und 12 Monate Nachbetreuung inklusive."}
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-bold">{b2b?.skilled_workers?.recognition || "Anerkennung"}</div>
                  <div className="text-slate-500 text-xs">{b2b?.skilled_workers?.stat1_label || "Support"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-bold">Placement</div>
                  <div className="text-slate-500 text-xs">{b2b?.skilled_workers?.stat2_label || "Service"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-bold">12 {t.nav?.cooperation === "Cooperation & Programs" ? "Months" : "Monate"}</div>
                  <div className="text-slate-500 text-xs">{b2b?.skilled_workers?.stat3_label || "Nachbetreuung"}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  {b2b?.common?.cta_profiles || "Fachkräfteprofile anfordern"}
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
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  {b2b?.common?.your_academy || "Ihre Akademie für Talente"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.skilled_workers?.recognition || "Anerkennung"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.skilled_workers?.deficit_balance || "Defizitbescheid & Ausgleich"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.skilled_workers?.placement_service || "Placement Service"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.skilled_workers?.employer_matching || "Matching mit Arbeitgebern"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.skilled_workers?.months_care || "12 Monate Betreuung"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.skilled_workers?.for_ag_fk || "Für AG und Fachkraft"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <div className="text-slate-400 text-sm">{b2b?.common?.costs_only_for || "Kosten ausschließlich für"}</div>
                <div className="text-white font-semibold mt-1">{b2b?.skilled_workers?.education_legal_support || "Bildung & Rechtliche Begleitung"}</div>
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
    { name: b2b?.common?.phase_preparation || "Vorbereitung", color: "emerald", icon: BookOpen, key: "preparation" },
    { name: b2b?.common?.phase_administration || "Administration", color: "slate", icon: FileCheck, key: "administration" },
    { name: b2b?.common?.phase_integration || "Integration", color: "blue", icon: Home, key: "integration" },
  ];

  const getServiceModules = () => [
    {
      code: "P1.1",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.skilled_workers?.p1_1_service || "Rekrutierung & Vorauswahl",
      description: b2b?.skilled_workers?.p1_1_desc || "Qualifizierte Fachkräfte nach Ihren Anforderungen",
    },
    {
      code: "P1.2",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.skilled_workers?.p1_2_service || "Deutschkurs A1-B1/B2",
      description: b2b?.skilled_workers?.p1_2_desc || "Berufsbezogenes Deutsch, Fachvokabular",
    },
    {
      code: "P1.3",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.skilled_workers?.p1_3_service || "Anerkennung Support",
      description: b2b?.skilled_workers?.p1_3_desc || "Begleitung beim Anerkennungsverfahren ausländischer Abschlüsse",
    },
    {
      code: "P1.4",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.skilled_workers?.p1_4_service || "Anpassungsqualifizierung",
      description: b2b?.skilled_workers?.p1_4_desc || "Vorbereitung auf Defizitausgleich und Kenntnisprüfung",
    },
    {
      code: "P2.1",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.skilled_workers?.p2_1_service || "§18a/b Visa-Service",
      description: b2b?.skilled_workers?.p2_1_desc || "Fachkräfteeinwanderungsgesetz, beschleunigtes Verfahren",
    },
    {
      code: "P2.2",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.skilled_workers?.p2_2_service || "Beschleunigtes Verfahren",
      description: b2b?.skilled_workers?.p2_2_desc || "§81a AufenthG Fachkräfteverfahren bei der Ausländerbehörde",
    },
    {
      code: "P2.3",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.skilled_workers?.p2_3_service || "Behördenkorrespondenz",
      description: b2b?.skilled_workers?.p2_3_desc || "ZAV, Ausländerbehörde, Botschaft, Anerkennungsstellen",
    },
    {
      code: "P3.1",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_1_service || "Flughafenabholung",
      description: b2b?.skilled_workers?.p3_1_desc || "Persönliche Abholung und Transfer zur Unterkunft",
    },
    {
      code: "P3.2",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_2_service || "7-Tage Settling-in Kit",
      description: b2b?.skilled_workers?.p3_2_desc || "Wohnung, Anmeldung, Bankkonto, SIM-Karte, Orientierung",
    },
    {
      code: "P3.3",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_3_service || "Behördengänge",
      description: b2b?.skilled_workers?.p3_3_desc || "Begleitung zu Einwohnermeldeamt, Krankenkasse, Finanzamt",
    },
    {
      code: "P3.4",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_4_service || "Placement Service",
      description: b2b?.skilled_workers?.p3_4_desc || "Matching mit passenden Arbeitgebern, Vertragsverhandlung",
    },
    {
      code: "P3.5",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_5_service || "Onboarding-Begleitung",
      description: b2b?.skilled_workers?.p3_5_desc || "Unterstützung in den ersten Arbeitswochen",
    },
    {
      code: "P3.6",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_6_service || "Kulturelle Betreuung",
      description: b2b?.skilled_workers?.p3_6_desc || "Community-Events, Mentoring, Heimweh-Prävention",
    },
    {
      code: "P3.7",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.skilled_workers?.p3_7_service || "Nachbetreuung",
      description: b2b?.skilled_workers?.p3_7_desc || "12 Monate Ansprechpartner für Arbeitgeber und Fachkraft",
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
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            {b2b?.common?.transparency_badge || "Vollständige Transparenz"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.common?.transparency_title || "Alle Leistungen im Überblick"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.common?.transparency_subtitle || "Von P1.1 bis P3.7 - jede Leistung ist klar definiert. Kosten ausschließlich für Bildung und rechtliche Begleitung."}
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
                  phase.color === "emerald"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : phase.color === "blue"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
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
                      ? "bg-emerald-50/50 hover:bg-emerald-50"
                      : module.phaseKey === "administration"
                      ? "bg-white hover:bg-slate-50"
                      : "bg-blue-50/50 hover:bg-blue-50"
                  }`}
                >
                  <TableCell className="font-mono font-bold text-slate-600">{module.code}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        module.phaseKey === "preparation"
                          ? "border-emerald-200 text-emerald-700 bg-emerald-100"
                          : module.phaseKey === "administration"
                          ? "border-slate-200 text-slate-700 bg-slate-100"
                          : "border-blue-200 text-blue-700 bg-blue-100"
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
          className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            <span className="text-lg font-bold text-slate-900">
              {b2b?.common?.cost_disclaimer || "Transparente Kostenstruktur"}
            </span>
          </div>
          <p className="text-slate-600">
            {b2b?.common?.cost_disclaimer_text || "Alle Kosten sind ausschließlich für Bildungsdienstleistungen und rechtliche Begleitung. Keine versteckten Vermittlungsgebühren."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// QUALITY GATES SECTION - SKILLED WORKERS FOCUS
// ============================================

function QualityGatesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  const getQualityGates = () => [
    {
      gate: `${b2b?.common?.gate || "Gate"} 1`,
      title: b2b?.skilled_workers?.gate1_title || "Anerkennung Support",
      description: b2b?.skilled_workers?.gate1_desc || "Begleitung beim gesamten Anerkennungsverfahren",
      items: (b2b?.skilled_workers?.gate1_items || "Defizitbescheid-Analyse|Anpassungsqualifizierung|Kenntnisprüfung-Vorbereitung").split("|"),
      icon: Scale,
      color: "emerald",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 2`,
      title: b2b?.skilled_workers?.gate2_title || "Work Skills Training",
      description: b2b?.skilled_workers?.gate2_desc || "Garantiert produktive Mitarbeiter ab Tag 1",
      items: (b2b?.skilled_workers?.gate2_items || "Deutsche Arbeitskultur|Teamkommunikation|Arbeitssicherheit").split("|"),
      icon: Target,
      color: "blue",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 3`,
      title: b2b?.skilled_workers?.gate3_title || "Placement Service",
      description: b2b?.skilled_workers?.gate3_desc || "Professionelles Matching mit Arbeitgebern",
      items: (b2b?.skilled_workers?.gate3_items || "Anforderungsanalyse|Kandidatenvorstellung|Vertragsverhandlung").split("|"),
      icon: Handshake,
      color: "emerald",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 4`,
      title: b2b?.skilled_workers?.gate4_title || "Nachbetreuung",
      description: b2b?.skilled_workers?.gate4_desc || "12 Monate Support für nachhaltigen Erfolg",
      items: (b2b?.skilled_workers?.gate4_items || "Ansprechpartner für AG|Konfliktmediation|Retentionsmanagement").split("|"),
      icon: UserCheck,
      color: "blue",
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
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Award className="w-4 h-4 mr-2" />
            {b2b?.common?.quality_badge || "Qualitätssicherung"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.skilled_workers?.quality_title || "4 Quality Gates für nachhaltigen Erfolg"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.skilled_workers?.quality_subtitle || "Von der Anerkennung bis zur Nachbetreuung - wir begleiten den gesamten Prozess und garantieren geringe Fluktuation durch professionelles Work Skills Training."}
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
                <div className="h-full bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  {/* Gate Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`${
                        gate.color === "emerald"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {gate.gate}
                    </Badge>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        gate.color === "emerald"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
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
                          gate.color === "emerald" ? "text-emerald-500" : "text-blue-500"
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
          className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-bold text-white">{b2b?.common?.work_skills_training || "Work Skills Training"}</h3>
          </div>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-6">
            {b2b?.skilled_workers?.work_skills_text || "Unsere Fachkräfte sind nicht nur fachlich qualifiziert, sondern auch auf die deutsche Arbeitskultur vorbereitet. Das garantiert Produktivität ab Tag 1 und geringe Fluktuation."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <BadgeCheck className="w-4 h-4 mr-2" />
              {b2b?.skilled_workers?.productive_day1 || "Produktiv ab Tag 1"}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {b2b?.common?.low_turnover || "Geringe Fluktuation"}
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
      items: (b2b?.common?.day4_items || "Bankkonto eröffnen|SIM-Karte aktivieren|ÖPNV-Ticket organisieren").split("|"),
      icon: "💳",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 5`,
      title: b2b?.common?.day5_title || "Gesundheit & Soziales",
      items: (b2b?.common?.day5_items || "Krankenkasse anmelden|Hausarzt finden|Apotheken & Notdienste").split("|"),
      icon: "🏥",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 6`,
      title: b2b?.skilled_workers?.day6_title_skilled || "Arbeitsplatz-Vorbereitung",
      items: (b2b?.skilled_workers?.day6_items_skilled || "Weg zum Betrieb üben|Arbeitskleidung|Erste Kontakte im Betrieb").split("|"),
      icon: "👔",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 7`,
      title: b2b?.skilled_workers?.day7_title_skilled || "Arbeitsstart",
      items: (b2b?.skilled_workers?.day7_items_skilled || "Checkliste durchgehen|Offene Fragen klären|Bereit für Tag 1!").split("|"),
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
            className="mb-6 px-4 py-2 border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            <Home className="w-4 h-4 mr-2" />
            {b2b?.common?.settlement_badge || "Settling-in Service"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.common?.settlement_title || "7-Tage Settling-in Kit"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.skilled_workers?.settlement_subtitle || "Vollständige Betreuung in der ersten Woche garantiert einen stressfreien Start und minimiert das Risiko von frühzeitiger Kündigung durch Überforderung."}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-blue-200 to-emerald-200 rounded-full hidden lg:block" />

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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 relative z-10">
                    {day.icon}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="text-center mb-3">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                      {day.day}
                    </Badge>
                    <h4 className="font-bold text-slate-900 mt-2 text-sm">{day.title}</h4>
                  </div>
                  <ul className="space-y-1">
                    {day.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1 text-xs text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
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
          className="mt-16 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200 p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">&lt;10%</div>
              <div className="text-slate-600">{b2b?.skilled_workers?.turnover_rate || "Fluktuation im 1. Jahr"}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">98%</div>
              <div className="text-slate-600">{b2b?.skilled_workers?.onboarding_success || "Erfolgreiche Einarbeitung"}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">12 Mo.</div>
              <div className="text-slate-600">{b2b?.skilled_workers?.aftercare_months || "Nachbetreuung inklusive"}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTORS SECTION
// ============================================

function SectorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  const getSectors = () => [
    {
      title: b2b?.skilled_workers?.sector_healthcare || "Pflege & Gesundheit",
      description: b2b?.skilled_workers?.sector_healthcare_desc || "Pflegefachkräfte, Altenpfleger, Krankenpfleger",
      icon: Stethoscope,
      color: "emerald",
      stats: `60+ ${b2b?.skilled_workers?.workers_label || "Fachkräfte"}`,
    },
    {
      title: b2b?.skilled_workers?.sector_craft || "Handwerk & Bau",
      description: b2b?.skilled_workers?.sector_craft_desc || "Elektriker, Installateure, Schreiner, Maurer",
      icon: Hammer,
      color: "blue",
      stats: `40+ ${b2b?.skilled_workers?.workers_label || "Fachkräfte"}`,
    },
    {
      title: b2b?.skilled_workers?.sector_industry || "Industrie & Technik",
      description: b2b?.skilled_workers?.sector_industry_desc || "Maschinenbau, Elektrotechnik, Mechatronik",
      icon: Wrench,
      color: "emerald",
      stats: `50+ ${b2b?.skilled_workers?.workers_label || "Fachkräfte"}`,
    },
    {
      title: b2b?.skilled_workers?.sector_gastro || "Gastronomie & Hotel",
      description: b2b?.skilled_workers?.sector_gastro_desc || "Köche, Restaurantfachleute, Hotelfachleute",
      icon: Building,
      color: "blue",
      stats: `30+ ${b2b?.skilled_workers?.workers_label || "Fachkräfte"}`,
    },
  ];

  const sectors = getSectors();

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
            <Briefcase className="w-4 h-4 mr-2" />
            {b2b?.skilled_workers?.sectors_badge || "Branchen"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.skilled_workers?.sectors_title || "Fachkräfte für Ihre Branche"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.skilled_workers?.sectors_subtitle || "Wir vermitteln qualifizierte Fachkräfte aus Vietnam in den Bereichen mit dem größten Bedarf."}
          </p>
        </motion.div>

        {/* Sectors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      sector.color === "emerald"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{sector.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{sector.description}</p>
                  <Badge
                    className={`${
                      sector.color === "emerald"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    {sector.stats}
                  </Badge>
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Sparkles className="w-4 h-4 mr-2" />
            {b2b?.skilled_workers?.cta_highlight || "Nächste Einreise: Q2 2026"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            {b2b?.skilled_workers?.cta_title || "Bereit für qualifizierte Fachkräfte?"}
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            {b2b?.skilled_workers?.cta_subtitle || "Wir begleiten den gesamten Prozess - von der Anerkennung bis zur erfolgreichen Integration. Placement Service und 12 Monate Nachbetreuung inklusive."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                {b2b?.common?.cta_profiles || "Fachkräfteprofile anfordern"}
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

export default function SkilledWorkersPartnerPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TransparencySection />
      <QualityGatesSection />
      <SettlementKitSection />
      <SectorsSection />
      <CTASection />
    </main>
  );
}
