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
  Heart,
  Wrench,
} from "lucide-react";

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
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
              <Badge className="mb-6 px-4 py-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 backdrop-blur-sm">
                <GraduationCap className="w-4 h-4 mr-2" />
                {b2b?.ausbildung?.badge || "Ausbildungsprogramm"}
              </Badge>
            </motion.div>

            {/* Main Statement */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">{b2b?.common?.hero_title || "DMF – Ihre Akademie für"}</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
                {b2b?.common?.hero_accent || "qualifizierte Talente"}
              </span>
              <br />
              <span className="text-white">{b2b?.common?.hero_suffix || "aus Vietnam"}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 max-w-lg">
              {b2b?.ausbildung?.subheadline || "Wir investieren in die Ausbildung Ihrer zukünftigen Fachkräfte. 156 Unterrichtseinheiten pro Jahr, Sprachniveau A1 bis B2, und vollständige Integration in Deutschland."}
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-bold">156</div>
                  <div className="text-slate-500 text-xs">{b2b?.ausbildung?.stat1_label || "Sessions/Jahr"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Languages className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-bold">A1-B2</div>
                  <div className="text-slate-500 text-xs">{b2b?.ausbildung?.stat2_label || "Sprachniveau"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-bold">3 Jahre</div>
                  <div className="text-slate-500 text-xs">{b2b?.ausbildung?.stat3_label || "Begleitung"}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                asChild
              >
                <Link href="/#contact">
                  {b2b?.common?.cta_profiles || "Kandidatenprofile anfordern"}
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
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.ausbildung?.language_training || "Sprachausbildung"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.ausbildung?.certified_courses || "Zertifizierte Deutschkurse"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.ausbildung?.technical_prep || "Fachliche Vorbereitung"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.ausbildung?.industry_training || "Branchenspezifisches Training"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{b2b?.ausbildung?.cultural_integration || "Kulturelle Integration"}</div>
                    <div className="text-slate-400 text-sm">{b2b?.ausbildung?.values_culture || "Werte und Arbeitskultur"}</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <div className="text-slate-400 text-sm">{b2b?.common?.costs_only_for || "Kosten ausschließlich für"}</div>
                <div className="text-white font-semibold mt-1">{b2b?.common?.education_legal || "Bildung & Rechtliche Begleitung"}</div>
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

  const phases = [
    { name: b2b?.common?.phase_preparation || "Vorbereitung", color: "blue", icon: BookOpen },
    { name: b2b?.common?.phase_administration || "Administration", color: "slate", icon: FileCheck },
    { name: b2b?.common?.phase_integration || "Integration", color: "emerald", icon: Home },
  ];

  const getServiceModules = () => [
    {
      code: "P1.1",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.ausbildung?.p1_1_service || "Rekrutierung & Screening",
      description: b2b?.ausbildung?.p1_1_desc || "Auswahl qualifizierter Kandidaten nach Ihren Anforderungen",
    },
    {
      code: "P1.2",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.ausbildung?.p1_2_service || "Deutschkurs A1-B2",
      description: b2b?.ausbildung?.p1_2_desc || "156 Unterrichtseinheiten/Jahr, zertifizierte Sprachschule",
    },
    {
      code: "P1.3",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.ausbildung?.p1_3_service || "Fachsprachliche Vorbereitung",
      description: b2b?.ausbildung?.p1_3_desc || "Branchenspezifisches Vokabular und Kommunikation",
    },
    {
      code: "P1.4",
      phase: b2b?.common?.phase_preparation || "Vorbereitung",
      phaseKey: "preparation",
      service: b2b?.ausbildung?.p1_4_service || "Interkulturelle Schulung",
      description: b2b?.ausbildung?.p1_4_desc || "Deutsche Arbeitskultur, Werte und Umgangsformen",
    },
    {
      code: "P2.1",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.ausbildung?.p2_1_service || "Visa-Antragstellung",
      description: b2b?.ausbildung?.p2_1_desc || "Komplette Dokumentenvorbereitung und Einreichung",
    },
    {
      code: "P2.2",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.ausbildung?.p2_2_service || "Beschleunigtes Verfahren",
      description: b2b?.ausbildung?.p2_2_desc || "§81a AufenthG Fachkräfteverfahren",
    },
    {
      code: "P2.3",
      phase: b2b?.common?.phase_administration || "Administration",
      phaseKey: "administration",
      service: b2b?.ausbildung?.p2_3_service || "Behördenkorrespondenz",
      description: b2b?.ausbildung?.p2_3_desc || "Kommunikation mit Ausländerbehörde, ZAV, Botschaft",
    },
    {
      code: "P3.1",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_1_service || "Flughafenabholung",
      description: b2b?.ausbildung?.p3_1_desc || "Persönliche Abholung und Transfer zur Unterkunft",
    },
    {
      code: "P3.2",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_2_service || "7-Tage Settling-in Kit",
      description: b2b?.ausbildung?.p3_2_desc || "Wohnung, Anmeldung, Bankkonto, SIM-Karte, Orientierung",
    },
    {
      code: "P3.3",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_3_service || "Behördengänge",
      description: b2b?.ausbildung?.p3_3_desc || "Begleitung zu Einwohnermeldeamt, Krankenkasse etc.",
    },
    {
      code: "P3.4",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_4_service || "24/7 Notfall-Hotline",
      description: b2b?.ausbildung?.p3_4_desc || "Deutschsprachiger Support für Arbeitgeber und Azubi",
    },
    {
      code: "P3.5",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_5_service || "Berufsschulbegleitung",
      description: b2b?.ausbildung?.p3_5_desc || "Unterstützung bei schulischen Herausforderungen",
    },
    {
      code: "P3.6",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_6_service || "Kulturelle Betreuung",
      description: b2b?.ausbildung?.p3_6_desc || "Community-Events, Mentoring, Heimweh-Prävention",
    },
    {
      code: "P3.7",
      phase: b2b?.common?.phase_integration || "Integration",
      phaseKey: "integration",
      service: b2b?.ausbildung?.p3_7_service || "3-Jahres-Begleitung",
      description: b2b?.ausbildung?.p3_7_desc || "Kontinuierliche Unterstützung während der Ausbildung",
    },
  ];

  const localizedModules = getServiceModules();

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
            <FileCheck className="w-4 h-4 mr-2" />
            {b2b?.common?.transparency_badge || "Vollständige Transparenz"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.common?.transparency_title || "Alle Leistungen im Überblick"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.common?.transparency_subtitle || "Von P1.1 bis P3.7 - jede Leistung ist klar definiert. Kosten ausschließlich für Bildung und rechtliche Dienstleistungen."}
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
                key={phase.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  phase.color === "blue"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
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
              {localizedModules.map((module) => (
                <TableRow
                  key={module.code}
                  className={`${
                    module.phaseKey === "preparation"
                      ? "bg-blue-50/50 hover:bg-blue-50"
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
                          ? "border-blue-200 text-blue-700 bg-blue-100"
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
          className="mt-8 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
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
// QUALITY GATES SECTION
// ============================================

function QualityGatesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();
  const b2b = t.b2b_pages;

  const getQualityGates = () => [
    {
      gate: `${b2b?.common?.gate || "Gate"} 1`,
      title: b2b?.ausbildung?.gate1_title || "Sprachkompetenz",
      description: b2b?.ausbildung?.gate1_desc || "Minimum B1, Ziel B2 vor Einreise",
      items: (b2b?.ausbildung?.gate1_items || "Goethe/TELC Zertifikat|Mündliche Prüfung|Fachvokabular").split("|"),
      icon: Languages,
      color: "blue",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 2`,
      title: b2b?.ausbildung?.gate2_title || "Fachliche Eignung",
      description: b2b?.ausbildung?.gate2_desc || "Branchenspezifische Vorbereitung",
      items: (b2b?.ausbildung?.gate2_items || "Theoretische Grundlagen|Praktische Übungen|Arbeitsschutz").split("|"),
      icon: Wrench,
      color: "emerald",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 3`,
      title: b2b?.ausbildung?.gate3_title || "Work Skills Training",
      description: b2b?.ausbildung?.gate3_desc || "Garantiert produktive Mitarbeiter",
      items: (b2b?.ausbildung?.gate3_items || "Deutsche Arbeitskultur|Teamarbeit & Kommunikation|Pünktlichkeit & Zuverlässigkeit").split("|"),
      icon: Target,
      color: "blue",
    },
    {
      gate: `${b2b?.common?.gate || "Gate"} 4`,
      title: b2b?.ausbildung?.gate4_title || "Interkulturelle Kompetenz",
      description: b2b?.ausbildung?.gate4_desc || "Erfolgreiche Integration",
      items: (b2b?.ausbildung?.gate4_items || "Kulturelle Unterschiede|Konfliktlösung|Alltagsleben in DE").split("|"),
      icon: Heart,
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
            {b2b?.ausbildung?.quality_title || "4 Quality Gates für produktive Azubis"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.ausbildung?.quality_subtitle || "Unser Work Skills Training garantiert, dass Ihre Azubis vom ersten Tag an produktiv arbeiten können. Jeder Kandidat durchläuft alle Quality Gates."}
          </p>
        </motion.div>

        {/* Quality Gates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityGates.map((gate, index) => {
            const Icon = gate.icon;
            return (
              <motion.div
                key={gate.gate}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                  {/* Gate Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`${
                        gate.color === "blue"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {gate.gate}
                    </Badge>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        gate.color === "blue"
                          ? "bg-blue-100 text-blue-600"
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
                          gate.color === "blue" ? "text-blue-500" : "text-emerald-500"
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
          className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-bold text-white">{b2b?.common?.work_skills_training || "Work Skills Training"}</h3>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            {b2b?.ausbildung?.work_skills_text || "Unsere Azubis sind nicht nur sprachlich, sondern auch fachlich und kulturell auf den deutschen Arbeitsmarkt vorbereitet. Das garantiert Produktivität ab Tag 1."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <BadgeCheck className="w-4 h-4 mr-2" />
              {b2b?.common?.certified_quality || "Zertifizierte Qualität"}
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
      title: b2b?.common?.day6_title || "Arbeitsplatz-Vorbereitung",
      items: (b2b?.common?.day6_items || "Weg zum Betrieb üben|Arbeitskleidung|Erste Kontakte im Betrieb").split("|"),
      icon: "👔",
    },
    {
      day: `${b2b?.common?.day || "Tag"} 7`,
      title: b2b?.common?.day7_title || "Abschluss & Start",
      items: (b2b?.common?.day7_items || "Checkliste durchgehen|Offene Fragen klären|Bereit für Tag 1!").split("|"),
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
            className="mb-6 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50"
          >
            <Home className="w-4 h-4 mr-2" />
            {b2b?.common?.settlement_badge || "Settling-in Service"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {b2b?.common?.settlement_title || "7-Tage Settling-in Kit"}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            {b2b?.ausbildung?.settlement_subtitle || "Vollständige Betreuung in der ersten Woche garantiert eine stressfreie Ankunft und minimiert das Risiko von Abbrüchen durch Heimweh oder Überforderung."}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-emerald-200 to-blue-200 rounded-full hidden lg:block" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {settlementDays.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative"
              >
                {/* Day Circle */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30 relative z-10">
                    {day.icon}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="text-center mb-3">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
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
          className="mt-16 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">&lt;5%</div>
              <div className="text-slate-600">{b2b?.common?.dropout_rate || "Abbruchquote im 1. Jahr"}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-slate-600">{b2b?.common?.retention_rate || "Übernahmequote nach Ausbildung"}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-slate-600">{b2b?.common?.support_rate || "Begleitung in der Startphase"}</div>
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
    <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
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
            {b2b?.ausbildung?.cta_highlight || "Nächster Ausbildungsstart: September 2026"}
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            {b2b?.ausbildung?.cta_title || "Bereit für qualifizierte Azubis?"}
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            {b2b?.ausbildung?.cta_subtitle || "Investieren Sie in die Zukunft Ihres Betriebs. Unsere Azubis bringen nicht nur Motivation mit, sondern sind durch unser Ausbildungsprogramm bestens vorbereitet."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              asChild
            >
              <Link href="/#contact">
                {b2b?.common?.cta_profiles || "Kandidatenprofile anfordern"}
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

export default function AusbildungPartnerPage() {
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
