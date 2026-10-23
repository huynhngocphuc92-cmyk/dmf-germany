"use client";

import React, { useMemo, useState } from "react";
import type { InboxRequest } from "@/app/admin/requests/inbox-types";
import { tailorRequestAnschreibenAction } from "@/app/admin/requests/dossier-actions";
import {
  GermanDocumentPreview,
  type GermanTemplateType,
} from "@/components/portal/GermanDocumentTemplates";
import {
  PROGRAM_TRACK_CONFIG,
  computeCandidateAssessmentMetrics,
  type ProgramTrack,
  type StudentDocument,
  type StudentMotivationLetter,
  type StudentProfile,
} from "@/lib/portal/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileStack,
  Printer,
  Sparkles,
  Loader2,
  Mail,
  Building2,
  UserCheck,
  Layers,
  FileText,
} from "lucide-react";

interface RequestBewerbungsmappePanelProps {
  record: InboxRequest;
  profiles: StudentProfile[];
  documents: StudentDocument[];
  letters: StudentMotivationLetter[];
}

const BUNDLE_TEMPLATES: { id: GermanTemplateType; titleDe: string }[] = [
  { id: "deckblatt_mappe", titleDe: "1. Deckblatt & Anlagenverzeichnis" },
  { id: "dmf_bewertungsbogen", titleDe: "2. DMF Bewertungs- & Kompetenzbogen" },
  { id: "din5008_anschreiben", titleDe: "3. Motivationsschreiben (DIN 5008)" },
  { id: "full_cv", titleDe: "4. Tabellarischer Lebenslauf" },
  { id: "ba_erklaerung", titleDe: "5. Erklärung zum Beschäftigungsverhältnis (BA)" },
];

export function RequestBewerbungsmappePanel({
  record,
  profiles,
  documents,
  letters,
}: RequestBewerbungsmappePanelProps) {
  // Automatically match initial candidate from record.candidate_id, record.candidate_code, or service track
  const initialCandidateId = useMemo(() => {
    if (profiles.length === 0) return "";
    if (record.candidate_id) {
      const exactMatch = profiles.find(
        (p) => p.candidate_id === record.candidate_id || p.id === record.candidate_id
      );
      if (exactMatch) return exactMatch.id;
    }
    if (record.candidate_code) {
      const codeUpper = record.candidate_code.toUpperCase();
      const codeMatch = profiles.find(
        (p) => (p.candidate_id || p.id).slice(0, 8).toUpperCase() === codeUpper
      );
      if (codeMatch) return codeMatch.id;
    }
    if (record.service) {
      const serviceMatch = profiles.find((p) => p.program_track === record.service);
      if (serviceMatch) return serviceMatch.id;
    }
    return profiles[0].id;
  }, [profiles, record.candidate_id, record.candidate_code, record.service]);

  const [selectedProfileId, setSelectedProfileId] = useState<string>(initialCandidateId);
  const [exportMode, setExportMode] = useState<"single" | "full_bundle">("full_bundle");
  const [activeTemplate, setActiveTemplate] = useState<GermanTemplateType>("dmf_bewertungsbogen");
  const [anonymizeCvInBundle, setAnonymizeCvInBundle] = useState<boolean>(false);
  const [isTailoringAi, setIsTailoringAi] = useState<boolean>(false);
  const [tailoredOverride, setTailoredOverride] = useState<{
    profileId: string;
    subject_de: string;
    salutation_de: string;
    body_de: string;
    closing_de: string;
  } | null>(null);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.id === selectedProfileId) || null,
    [profiles, selectedProfileId]
  );

  const selectedDocs = useMemo(
    () => documents.filter((d) => d.student_profile_id === selectedProfileId),
    [documents, selectedProfileId]
  );

  // Inject the requesting employer's name into the profile for Vollmacht § 81a & BA Erklärung
  const employerEnrichedProfile = useMemo<StudentProfile | null>(() => {
    if (!selectedProfile) return null;
    return {
      ...selectedProfile,
      vollmacht_employer_name:
        record.company || selectedProfile.vollmacht_employer_name || "Deutscher Arbeitgeber",
    };
  }, [selectedProfile, record.company]);

  // Build or enrich the DIN 5008 Motivation Letter with the requesting German employer's details
  const employerEnrichedLetter = useMemo<StudentMotivationLetter | null>(() => {
    if (!selectedProfile) return null;
    const baseLetter = letters.find((l) => l.student_profile_id === selectedProfile.id) || null;
    const isOverridden = tailoredOverride && tailoredOverride.profileId === selectedProfile.id;

    const companyName =
      record.company ||
      baseLetter?.target_company_name ||
      "An den Ausbildungs- / Personalverantwortlichen";
    const contactPerson = record.contact_name || baseLetter?.target_contact_person || "";
    const workLocation = record.work_location || baseLetter?.target_city || "Deutschland";
    const startWindow =
      record.start_window || baseLetter?.prompt_answers?.earliestStartDateDe || "01.09.2026";
    const targetPos =
      selectedProfile.target_profession ||
      PROGRAM_TRACK_CONFIG[selectedProfile.program_track as ProgramTrack]?.labelDe ||
      "Fachkraft";

    const defaultSalutation = contactPerson
      ? `Sehr geehrte(r) ${contactPerson},`
      : "Sehr geehrte Damen und Herren,";

    const defaultSubject = `Bewerbung als ${targetPos} bei ${companyName} (ab ${startWindow})`;

    const defaultBody =
      baseLetter?.body_de ||
      `mit großem Interesse bewerbe ich mich bei ${companyName} in ${workLocation} als ${targetPos}.\n\nIn meiner bisherigen Ausbildung sowie im intensiven Deutsch- und Fachvorbereitungsprogramm der DMF Vietnam Academy (aktuelles Sprachniveau: Deutsch ${selectedProfile.german_level}) habe ich mich gezielt auf die fachlichen und sprachlichen Anforderungen in Deutschland vorbereitet.\n\nIch zeichne mich durch hohe Zuverlässigkeit, Teamfähigkeit und schnelle Auffassungsgabe aus. Gerne überzeuge ich Sie in einem persönlichen Online-Vorstellungsgespräch von meiner Motivation.`;

    return {
      id: baseLetter?.id || "temp-request-letter",
      student_profile_id: selectedProfile.id,
      user_id: selectedProfile.user_id,
      title: `Anschreiben für ${companyName}`,
      is_primary: true,
      target_company_name: companyName,
      target_company_address: baseLetter?.target_company_address || "",
      target_city: workLocation,
      target_contact_person: contactPerson,
      target_position_de: targetPos,
      prompt_answers: {
        whyProfessionVn: baseLetter?.prompt_answers?.whyProfessionVn || "",
        practicalExperienceVn: baseLetter?.prompt_answers?.practicalExperienceVn || "",
        whyGermanyAndCompanyVn: baseLetter?.prompt_answers?.whyGermanyAndCompanyVn || "",
        personalStrengthsVn: baseLetter?.prompt_answers?.personalStrengthsVn || "",
        futurePlanVn: baseLetter?.prompt_answers?.futurePlanVn || "",
        earliestStartDateDe: startWindow,
      },
      subject_de: isOverridden ? tailoredOverride.subject_de : defaultSubject,
      salutation_de: isOverridden ? tailoredOverride.salutation_de : defaultSalutation,
      body_de: isOverridden ? tailoredOverride.body_de : defaultBody,
      closing_de: isOverridden
        ? tailoredOverride.closing_de
        : baseLetter?.closing_de || "Mit freundlichen Grüßen",
      created_at: baseLetter?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, [selectedProfile, letters, record, tailoredOverride]);

  const metrics = useMemo(
    () =>
      employerEnrichedProfile
        ? computeCandidateAssessmentMetrics(employerEnrichedProfile, selectedDocs)
        : null,
    [employerEnrichedProfile, selectedDocs]
  );

  const handleAiTailorForEmployer = async () => {
    if (!employerEnrichedProfile) return;
    setIsTailoringAi(true);
    setStatusNote(null);
    const res = await tailorRequestAnschreibenAction({
      profile: employerEnrichedProfile,
      companyName: record.company || "",
      contactPerson: record.contact_name || "",
      workLocation: record.work_location || "",
      startWindow: record.start_window || "01.09.2026",
      inquiryMessage: record.message || "",
    });
    setIsTailoringAi(false);
    if (res.success && res.data) {
      setTailoredOverride({
        profileId: employerEnrichedProfile.id,
        ...res.data,
      });
      setStatusNote(
        `Đã cá nhân hoá Anschreiben DIN 5008 dành riêng cho doanh nghiệp "${record.company || record.contact_name}"!`
      );
    } else {
      setStatusNote(res.error || "Không thể tạo Anschreiben tự động.");
    }
  };

  const candidateCode = employerEnrichedProfile
    ? (employerEnrichedProfile.candidate_id || employerEnrichedProfile.id).slice(0, 8).toUpperCase()
    : "DMF";

  const mailtoHref = useMemo(() => {
    if (!employerEnrichedProfile) return "#";
    const subject = encodeURIComponent(
      `Bewerbungsmappe Kandidat #${candidateCode} (${employerEnrichedProfile.target_profession || "Fachkraft"}) – Ihre Anfrage ${record.reference}`
    );
    const body = encodeURIComponent(
      `Sehr geehrte(r) ${record.contact_name || "Damen und Herren"},\n\nvielen Dank für Ihre Anfrage (${record.reference}) über dmf-talents.de.\n\nPassend zu Ihrem Personalbedarf bei ${record.company || "Ihrem Betrieb"} übersenden wir Ihnen im Anhang die geprüfte Bewerbungsmappe für:\n\n• Kandidat: #${candidateCode} (${employerEnrichedProfile.full_name})\n• Zielberuf: ${employerEnrichedProfile.target_profession || "Fachkraft / Auszubildende(r)"}\n• Sprachniveau: Deutsch ${employerEnrichedProfile.german_level} (GER)\n• DMF Gesamt-Score: ${metrics?.overallReadinessScore || 85}/100 (${metrics?.readinessLabelDe || "Sofort vermittelbar"})\n\nDie beigefügte Bewerbungsmappe enthält:\n1. Deckblatt & Anlagenübersicht\n2. Offiziellen DMF Bewertungs- & Kompetenzbogen\n3. Individuelles Motivationsschreiben nach DIN 5008\n4. Lückenlosen tabellarischen Lebenslauf / Kurzprofil\n5. Vorausgefüllte Erklärung zum Beschäftigungsverhältnis (Bundesagentur für Arbeit)\n\nGerne vereinbaren wir kurzfristig einen Termin für ein Online-Vorstellungsgespräch.\n\nMit freundlichen Grüßen\nIhr DMF Talents Vermittlungsteam`
    );
    return `mailto:${record.email}?subject=${subject}&body=${body}`;
  }, [employerEnrichedProfile, candidateCode, record, metrics]);

  if (profiles.length === 0) {
    return (
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Chưa có hồ sơ ứng viên nào trong hệ thống để ghép bộ Bewerbungsmappe.
      </section>
    );
  }

  return (
    <section
      aria-label="1-Click Bewerbungsmappe & Arbeitgeber-Dossier"
      className="mt-8 rounded-2xl border-2 border-emerald-200 bg-white p-5 md:p-7 shadow-sm space-y-6 print:mt-0 print:border-none print:p-0 print:shadow-none print:space-y-0"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileStack className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              1-Click Bewerbungsmappe Generator • B2B Matching
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Xuất Bộ Hồ Sơ Chuẩn Đức (Bewerbungsmappe PDF) Gửi Cho{" "}
            <span className="text-emerald-700">
              {record.company || record.contact_name || "Nhà Tuyển Dụng Đức"}
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Hệ thống tự động điền thông tin doanh nghiệp (
            <strong>{record.company || "Firma"}</strong> ·{" "}
            <strong>{record.work_location || "Deutschland"}</strong> · Người liên hệ:{" "}
            <strong>{record.contact_name || "Personalabteilung"}</strong>) vào{" "}
            <em>Anschreiben DIN 5008</em>, <em>Erklärung zum Beschäftigungsverhältnis (BA)</em> và{" "}
            <em>Vollmacht § 81a AufenthG</em>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            Soạn Email Gửi Kèm Dossier
          </a>
          <Button
            type="button"
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            {exportMode === "full_bundle"
              ? "In / Xuất PDF Trọn Bộ Bewerbungsmappe (5 Trang A4)"
              : "In / Xuất PDF Văn Bản Đang Chọn"}
          </Button>
        </div>
      </div>

      {/* Candidate Selector + Employer Tailoring Bar */}
      <div className="grid lg:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 items-end print:hidden">
        <div className="lg:col-span-5 space-y-1.5">
          <label
            htmlFor="dossier-candidate-select"
            className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Chọn Ứng Viên / Học Viên ghép cho yêu cầu này:
          </label>
          <select
            id="dossier-candidate-select"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900"
          >
            {profiles.map((p) => {
              const code = (p.candidate_id || p.id).slice(0, 8).toUpperCase();
              const isRequestedCandidate =
                (record.candidate_id &&
                  (p.candidate_id === record.candidate_id || p.id === record.candidate_id)) ||
                (record.candidate_code && record.candidate_code.toUpperCase() === code);
              return (
                <option key={p.id} value={p.id}>
                  {isRequestedCandidate ? "★ [Đúng mã yêu cầu] " : ""}#{code} – {p.full_name} (
                  {p.target_profession || p.program_track} • Deutsch {p.german_level})
                </option>
              );
            })}
          </select>
        </div>

        <div className="lg:col-span-4 space-y-1.5">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Doanh nghiệp đích (Tự động gắn vào hồ sơ):
          </span>
          <div className="h-10 px-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs text-slate-700 truncate">
            <span className="truncate font-medium">
              {record.company || "Chưa ghi tên công ty"} • {record.work_location || "Deutschland"}
            </span>
            {metrics && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] shrink-0 ml-2"
              >
                Score: {metrics.overallReadinessScore}/100
              </Badge>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleAiTailorForEmployer}
            disabled={isTailoringAi || !employerEnrichedProfile}
            className="h-10 border-emerald-300 text-emerald-900 hover:bg-emerald-50 text-xs font-semibold w-full"
          >
            {isTailoringAi ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Đang viết Anschreiben...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1.5 text-emerald-600" />
                AI Viết Anschreiben Riêng
              </>
            )}
          </Button>
        </div>
      </div>

      {statusNote && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium print:hidden">
          {statusNote}
        </div>
      )}

      {/* Mode Switcher: Full 5-Page Bewerbungsmappe Bundle vs. Single Template */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExportMode("full_bundle")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              exportMode === "full_bundle"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            Trọn Bộ Bewerbungsmappe B2B (5 Trang A4 Liên Hoàn)
          </button>
          <button
            type="button"
            onClick={() => setExportMode("single")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              exportMode === "single"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Xem & Xuất Lẻ Từng Mẫu (8 Văn Bản)
          </button>
        </div>

        {exportMode === "full_bundle" && (
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={anonymizeCvInBundle}
              onChange={(e) => setAnonymizeCvInBundle(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600"
            />
            Dùng Kurzprofil ẩn danh (#{candidateCode}) thay cho Full Lebenslauf
          </label>
        )}
      </div>

      {/* Template Pills when in Single Mode */}
      {exportMode === "single" && (
        <div className="flex flex-wrap gap-1.5 pt-1 print:hidden">
          {[
            { id: "deckblatt_mappe" as const, label: "1. Deckblatt Mappe" },
            { id: "dmf_bewertungsbogen" as const, label: "2. DMF Bewertungsbogen" },
            { id: "din5008_anschreiben" as const, label: "3. Anschreiben DIN 5008" },
            { id: "full_cv" as const, label: "4. Full Lebenslauf" },
            { id: "blind_kurzprofil" as const, label: "5. DMF Kurzprofil (#CODE)" },
            { id: "ba_erklaerung" as const, label: "6. BA Erklärung (§ 39)" },
            { id: "vollmacht_81a" as const, label: "7. Vollmacht § 81a" },
            { id: "dsgvo_consent" as const, label: "8. DSGVO Consent" },
          ].map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setActiveTemplate(tpl.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTemplate === tpl.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      )}

      {/* A4 Document Preview Container */}
      {employerEnrichedProfile && (
        <div className="max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-300 bg-slate-200/75 p-4 space-y-8 print:max-h-none print:overflow-visible print:border-none print:bg-white print:p-0">
          {exportMode === "single" ? (
            <GermanDocumentPreview
              template={activeTemplate}
              profile={employerEnrichedProfile}
              letter={employerEnrichedLetter}
              documents={selectedDocs}
            />
          ) : (
            BUNDLE_TEMPLATES.map((item, idx) => {
              const effectiveTemplate: GermanTemplateType =
                item.id === "full_cv" && anonymizeCvInBundle ? "blind_kurzprofil" : item.id;
              return (
                <div
                  key={item.id}
                  className={idx < BUNDLE_TEMPLATES.length - 1 ? "print:break-after-page" : ""}
                >
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-600 px-2 print:hidden">
                    <span>{item.titleDe}</span>
                    <span>
                      Trang {idx + 1} / {BUNDLE_TEMPLATES.length}
                    </span>
                  </div>
                  <GermanDocumentPreview
                    template={effectiveTemplate}
                    profile={employerEnrichedProfile}
                    letter={employerEnrichedLetter}
                    documents={selectedDocs}
                  />
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
