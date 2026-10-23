"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  saveStudentProfile,
  redeemStudentInviteCode,
  runAiCvStandardization,
  uploadStudentDocumentAction,
  generateAndSaveMotivationLetter,
  saveMotivationLetterManual,
  deleteMotivationLetter,
  generateAiInterviewKitAction,
  saveStudentLegalSignatures,
  uploadRecordedIntroVideoAction,
  evaluateInterviewAnswerAction,
  portalSignOut,
} from "./actions";
import {
  DOCUMENT_CHECKLIST_CONFIG,
  PROGRAM_TRACK_CONFIG,
  detectTimelineGaps,
  type DocumentTypeKey,
  type DocumentVariant,
  type EducationEntry,
  type LanguageSkillEntry,
  type MotivationPromptAnswers,
  type ProgramTrack,
  type StudentDocument,
  type StudentMotivationLetter,
  type StudentProfile,
  type WorkExperienceEntry,
} from "@/lib/portal/types";
import {
  GermanDocumentPreview,
  type GermanTemplateType,
} from "@/components/portal/GermanDocumentTemplates";
import { SignaturePad } from "@/components/portal/SignaturePad";
import { TeleprompterStudio } from "@/components/portal/TeleprompterStudio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  FileText,
  FolderCheck,
  Sparkles,
  Video,
  FileSignature,
  Printer,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Loader2,
  LogOut,
  Send,
  Lock,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import type { GermanLevel } from "@/app/admin/candidates/types";

type PortalTab = "overview" | "documents" | "cv" | "motivation" | "interview" | "legal";

interface StudentPortalClientProps {
  initialProfile: StudentProfile;
  initialDocuments: StudentDocument[];
  initialLetters: StudentMotivationLetter[];
  isAdmin: boolean;
}

const DEFAULT_PROMPT_ANSWERS: MotivationPromptAnswers = {
  whyProfessionVn: "",
  practicalExperienceVn: "",
  whyGermanyAndCompanyVn: "",
  personalStrengthsVn: "",
  futurePlanVn: "",
  earliestStartDateDe: "01.09.2026",
};

export function StudentPortalClient({
  initialProfile,
  initialDocuments,
  initialLetters,
  isAdmin,
}: StudentPortalClientProps) {
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [documents, setDocuments] = useState<StudentDocument[]>(initialDocuments);
  const [letters, setLetters] = useState<StudentMotivationLetter[]>(initialLetters);

  // Selected Motivation Letter in Studio
  const [selectedLetterId, setSelectedLetterId] = useState<string | "new">(
    initialLetters[0]?.id || "new"
  );
  const currentLetter = letters.find((l) => l.id === selectedLetterId) || null;

  const [letterDraft, setLetterDraft] = useState<{
    id?: string;
    title: string;
    is_primary: boolean;
    target_company_name: string;
    target_company_address: string;
    target_city: string;
    target_contact_person: string;
    target_position_de: string;
    prompt_answers: MotivationPromptAnswers;
    subject_de: string;
    salutation_de: string;
    body_de: string;
    closing_de: string;
  }>(() =>
    currentLetter
      ? {
          id: currentLetter.id,
          title: currentLetter.title,
          is_primary: currentLetter.is_primary,
          target_company_name: currentLetter.target_company_name,
          target_company_address: currentLetter.target_company_address,
          target_city: currentLetter.target_city,
          target_contact_person: currentLetter.target_contact_person,
          target_position_de: currentLetter.target_position_de,
          prompt_answers: { ...DEFAULT_PROMPT_ANSWERS, ...currentLetter.prompt_answers },
          subject_de: currentLetter.subject_de,
          salutation_de: currentLetter.salutation_de,
          body_de: currentLetter.body_de,
          closing_de: currentLetter.closing_de,
        }
      : {
          title: `Motivationsschreiben – ${initialProfile.target_profession || "Standard"}`,
          is_primary: true,
          target_company_name: "",
          target_company_address: "",
          target_city: "",
          target_contact_person: "",
          target_position_de: initialProfile.target_profession,
          prompt_answers: DEFAULT_PROMPT_ANSWERS,
          subject_de: `Bewerbung als ${initialProfile.target_profession || "Auszubildende(r)"}`,
          salutation_de: "Sehr geehrte Damen und Herren,",
          body_de: "",
          closing_de: "Mit freundlichen Grüßen",
        }
  );

  // Preview Template State
  const [previewTemplate, setPreviewTemplate] = useState<GermanTemplateType>("full_cv");

  // Invite Code State
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [isRedeemingCode, setIsRedeemingCode] = useState(false);

  // Loading & Feedback Toast State
  const [isSaving, setIsSaving] = useState(false);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [bannerMsg, setBannerMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const aiUnlocked = profile.ai_enabled || isAdmin;
  const trackConfig = PROGRAM_TRACK_CONFIG[profile.program_track];
  const timelineGaps = detectTimelineGaps(profile.education_history, profile.work_experience);

  // Calculate Checklist Progress
  const requiredDocsForTrack = DOCUMENT_CHECKLIST_CONFIG.filter((d) =>
    d.requiredForTracks.includes(profile.program_track)
  );
  const optionalDocsForTrack = DOCUMENT_CHECKLIST_CONFIG.filter((d) =>
    d.optionalForTracks?.includes(profile.program_track)
  );
  const uploadedRequiredCount = requiredDocsForTrack.filter((req) =>
    documents.some((d) => d.doc_type === req.docType && d.variant === "original")
  ).length;

  const selectLetterForEdit = (letter: StudentMotivationLetter | null) => {
    if (!letter) {
      setSelectedLetterId("new");
      setLetterDraft({
        title: `Anschreiben – Công ty mới (${new Date().toLocaleDateString("vi-VN")})`,
        is_primary: letters.length === 0,
        target_company_name: "",
        target_company_address: "",
        target_city: "",
        target_contact_person: "",
        target_position_de: profile.target_profession,
        prompt_answers: currentLetter?.prompt_answers || DEFAULT_PROMPT_ANSWERS,
        subject_de: `Bewerbung als ${profile.target_profession || "Fachkraft"}`,
        salutation_de: "Sehr geehrte Damen und Herren,",
        body_de: "",
        closing_de: "Mit freundlichen Grüßen",
      });
      return;
    }
    setSelectedLetterId(letter.id);
    setLetterDraft({
      id: letter.id,
      title: letter.title,
      is_primary: letter.is_primary,
      target_company_name: letter.target_company_name,
      target_company_address: letter.target_company_address,
      target_city: letter.target_city,
      target_contact_person: letter.target_contact_person,
      target_position_de: letter.target_position_de,
      prompt_answers: { ...DEFAULT_PROMPT_ANSWERS, ...letter.prompt_answers },
      subject_de: letter.subject_de,
      salutation_de: letter.salutation_de,
      body_de: letter.body_de,
      closing_de: letter.closing_de,
    });
  };

  const handleCloneLetterForNewEmployer = () => {
    setSelectedLetterId("new");
    setLetterDraft((prev) => ({
      ...prev,
      id: undefined,
      title: `Anschreiben – [Tên Công ty Đức mới]`,
      is_primary: false,
      target_company_name: "",
      target_company_address: "",
      target_city: "",
      target_contact_person: "",
    }));
    setBannerMsg({
      type: "success",
      text: "Đã nhân bản câu trả lời gốc! Hãy điền tên Công ty Đức mới và bấm 'AI Viết Thư DIN 5008'.",
    });
  };

  const handleSaveProfile = async (submitForReview = false) => {
    setIsSaving(true);
    setBannerMsg(null);
    const res = await saveStudentProfile(profile, submitForReview);
    setIsSaving(false);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBannerMsg({
        type: "success",
        text: submitForReview
          ? "Đã gửi hồ sơ lên Hệ thống Kiểm duyệt DMF (Staged Sync)! Giáo viên/Admin sẽ kiểm tra và phản hồi."
          : "Đã lưu dữ liệu hồ sơ & Lebenslauf thành công!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể lưu hồ sơ.",
      });
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    setIsRedeemingCode(true);
    setBannerMsg(null);
    const res = await redeemStudentInviteCode(inviteCodeInput);
    setIsRedeemingCode(false);
    if (res.success) {
      setProfile((prev) => ({ ...prev, ai_enabled: true, invite_code_used: inviteCodeInput }));
      setInviteCodeInput("");
      setBannerMsg({
        type: "success",
        text: "Kích hoạt Mã Học Viên DMF thành công! Toàn bộ tính năng AI chuẩn hoá Đức đã được mở khoá.",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Mã không hợp lệ.",
      });
    }
  };

  const handleAiStandardizeCv = async () => {
    setIsAiRunning(true);
    setBannerMsg(null);
    // First save current profile changes
    await saveStudentProfile(profile, false);
    const res = await runAiCvStandardization();
    setIsAiRunning(false);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBannerMsg({
        type: "success",
        text: "AI đã dịch & chuẩn hoá thuật ngữ nghề Đức (BERUFENET Standard) cho toàn bộ CV!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể chạy AI chuẩn hoá CV.",
      });
    }
  };

  const handleDocumentUpload = async (
    docType: DocumentTypeKey,
    variant: DocumentVariant,
    file: File
  ) => {
    const slotKey = `${docType}-${variant}`;
    setUploadingSlot(slotKey);
    setBannerMsg(null);
    const formData = new FormData();
    formData.set("doc_type", docType);
    formData.set("variant", variant);
    formData.set("file", file);

    const res = await uploadStudentDocumentAction(formData);
    setUploadingSlot(null);
    if (res.success && res.document) {
      setDocuments((prev) => {
        const filtered = prev.filter((d) => !(d.doc_type === docType && d.variant === variant));
        return [res.document!, ...filtered];
      });
      setBannerMsg({
        type: "success",
        text: `Đã tải lên "${file.name}" và kiểm tra định dạng thành công!`,
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Lỗi tải tài liệu.",
      });
    }
  };

  const handleGenerateAiLetter = async () => {
    setIsAiRunning(true);
    setBannerMsg(null);
    const res = await generateAndSaveMotivationLetter(letterDraft);
    setIsAiRunning(false);
    if (res.success && res.letter) {
      const saved = res.letter;
      setLetters((prev) => {
        const exists = prev.some((l) => l.id === saved.id);
        return exists ? prev.map((l) => (l.id === saved.id ? saved : l)) : [saved, ...prev];
      });
      selectLetterForEdit(saved);
      setPreviewTemplate("din5008_anschreiben");
      setBannerMsg({
        type: "success",
        text: "AI đã biên soạn Motivationsschreiben chuẩn DIN 5008 (B1/B2 tự nhiên) thành công!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể tạo Motivationsschreiben.",
      });
    }
  };

  const handleSaveLetterManual = async () => {
    setIsSaving(true);
    setBannerMsg(null);
    const res = await saveMotivationLetterManual(letterDraft);
    setIsSaving(false);
    if (res.success && res.letter) {
      const saved = res.letter;
      setLetters((prev) => {
        const exists = prev.some((l) => l.id === saved.id);
        return exists ? prev.map((l) => (l.id === saved.id ? saved : l)) : [saved, ...prev];
      });
      selectLetterForEdit(saved);
      setBannerMsg({
        type: "success",
        text: "Đã lưu bản Motivationsschreiben!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể lưu thư.",
      });
    }
  };

  const handleDeleteLetter = async (id: string) => {
    const res = await deleteMotivationLetter(id);
    if (res.success) {
      const remaining = letters.filter((l) => l.id !== id);
      setLetters(remaining);
      selectLetterForEdit(remaining[0] || null);
    }
  };

  const handleGenerateInterviewKit = async () => {
    setIsAiRunning(true);
    setBannerMsg(null);
    await saveStudentProfile(profile, false);
    const res = await generateAiInterviewKitAction();
    setIsAiRunning(false);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBannerMsg({
        type: "success",
        text: "Đã tạo Kịch bản Teleprompter 60–90s & Bộ câu hỏi Vorstellungsgespräch theo ngành!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể tạo bộ câu hỏi phỏng vấn.",
      });
    }
  };

  const handleUploadRecordedVideo = async (videoBlob: Blob) => {
    setBannerMsg(null);
    const formData = new FormData();
    const ext = videoBlob.type.includes("mp4") ? "mp4" : "webm";
    const file = new File([videoBlob], `selbstvorstellung-${Date.now()}.${ext}`, {
      type: videoBlob.type || "video/webm",
    });
    formData.set("video", file);

    const res = await uploadRecordedIntroVideoAction(formData);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBannerMsg({
        type: "success",
        text: "Đã tải Video giới thiệu (Selbstvorstellungsvideo) lên hệ thống và gắn vào Hồ sơ thành công!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể tải video lên.",
      });
    }
  };

  const handleEvaluateInterviewAnswer = async (questionId: string, studentAnswerDe: string) => {
    setBannerMsg(null);
    const res = await evaluateInterviewAnswerAction({
      questionId,
      studentAnswerDe,
    });
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBannerMsg({
        type: "success",
        text: `Giám khảo AI đã chấm điểm câu trả lời của bạn: ${res.evaluation?.overallScore || 0}/100 điểm!`,
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Không thể chấm điểm câu trả lời.",
      });
    }
  };

  const handleSaveLegal = async () => {
    setIsSaving(true);
    setBannerMsg(null);
    const res = await saveStudentLegalSignatures({
      signature_data_url: profile.signature_data_url || "",
      signature_place: profile.signature_place,
      dsgvo_consent_accepted: profile.dsgvo_consent_accepted,
      vollmacht_accepted: profile.vollmacht_accepted,
      vollmacht_employer_name: profile.vollmacht_employer_name,
    });
    setIsSaving(false);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setBannerMsg({
        type: "success",
        text: "Đã lưu Chữ ký điện tử (Unterschrift), Cam kết DSGVO và Giấy uỷ quyền § 81a AufenthG!",
      });
    } else {
      setBannerMsg({
        type: "error",
        text: res.error || "Vui lòng ký tên vào khung trước khi lưu.",
      });
    }
  };

  const printSelectedTemplate = (tpl: GermanTemplateType) => {
    setPreviewTemplate(tpl);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Helpers to add/update/remove CV arrays
  const addEducation = () => {
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      fromMonth: "2023-09",
      toMonth: "heute",
      institutionVn: "",
      institutionDe: "",
      location: "Vietnam",
      degreeVn: "",
      degreeDe: "",
      detailsDe: "",
    };
    setProfile((prev) => ({
      ...prev,
      education_history: [...prev.education_history, newEntry],
    }));
  };

  const addWorkExperience = () => {
    const newWork: WorkExperienceEntry = {
      id: `work-${Date.now()}`,
      fromMonth: "2024-01",
      toMonth: "2024-08",
      company: "",
      location: "Vietnam",
      roleVn: "",
      roleDe: "",
      tasksVn: "",
      tasksDe: "",
    };
    setProfile((prev) => ({
      ...prev,
      work_experience: [...prev.work_experience, newWork],
    }));
  };

  const addLanguageSkill = () => {
    const newLang: LanguageSkillEntry = {
      languageDe: "Deutsch",
      languageVn: "Tiếng Đức",
      level: "B1",
      provider: "Goethe-Institut / telc",
      examDate: "",
      scores: { lesen: "", hoeren: "", schreiben: "", sprechen: "" },
    };
    setProfile((prev) => ({
      ...prev,
      language_skills: [...prev.language_skills, newLang],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ====================================================================
          DEDICATED PRINT VIEW (Only visible when printing to A4 PDF)
      ==================================================================== */}
      <div className="hidden print:block print:bg-white">
        <GermanDocumentPreview
          template={previewTemplate}
          profile={profile}
          letter={
            letterDraft.body_de
              ? ({
                  ...letterDraft,
                  id: letterDraft.id || "draft",
                  student_profile_id: profile.id,
                  user_id: profile.user_id,
                  created_at: "",
                  updated_at: "",
                } as StudentMotivationLetter)
              : currentLetter
          }
          documents={documents}
        />
      </div>

      {/* ====================================================================
          INTERACTIVE PORTAL UI (Hidden during print)
      ==================================================================== */}
      <div className="print:hidden">
        {/* Top Navigation Header */}
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-base">
                    DMF Bewerber-Portal (Cổng Hồ Sơ Chuẩn Đức)
                  </h1>
                  <Badge
                    className={
                      aiUnlocked
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px]"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px]"
                    }
                  >
                    {aiUnlocked ? "✨ AI Đã Mở Khoá" : "🔒 Chế độ Cơ bản"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {profile.full_name || profile.email} • Diện: {trackConfig.labelVn} (
                  {trackConfig.labelDe})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="text-slate-900">
                  <Link href="/admin/candidates">Về trang Admin DMF</Link>
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => handleSaveProfile(true)}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Nộp Hồ Sơ Duyệt (Einreichen)
              </Button>
              <form action={portalSignOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Đăng xuất
                </Button>
              </form>
            </div>
          </div>

          {/* 6-Tab Navigation Bar */}
          <div className="container mx-auto px-4 border-t border-slate-800/80 overflow-x-auto">
            <nav className="flex items-center gap-1 py-1.5 min-w-max">
              {[
                {
                  id: "overview" as const,
                  labelVn: "1. Tổng quan & Mã AI",
                  labelDe: "Übersicht",
                  icon: LayoutDashboard,
                },
                {
                  id: "documents" as const,
                  labelVn: `2. Kho Giấy Tờ (${uploadedRequiredCount}/${requiredDocsForTrack.length})`,
                  labelDe: "Unterlagen & OCR",
                  icon: FolderCheck,
                },
                {
                  id: "cv" as const,
                  labelVn: "3. Làm CV Chuẩn Đức",
                  labelDe: "Tabellarischer Lebenslauf",
                  icon: FileText,
                },
                {
                  id: "motivation" as const,
                  labelVn: "4. Viết Motivationsschreiben",
                  labelDe: "Anschreiben DIN 5008",
                  icon: Sparkles,
                },
                {
                  id: "interview" as const,
                  labelVn: "5. Quay Vorstellungsgespräch",
                  labelDe: "Video & Interview",
                  icon: Video,
                },
                {
                  id: "legal" as const,
                  labelVn: "6. Chữ ký, DSGVO & § 81a",
                  labelDe: "Unterschrift & Vollmacht",
                  icon: FileSignature,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <span className="block font-bold leading-tight">{tab.labelVn}</span>
                      <span
                        className={`block text-[10px] ${
                          active ? "text-emerald-100" : "text-slate-400"
                        }`}
                      >
                        {tab.labelDe}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Main Workspace Container */}
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Status / Feedback Banner */}
          {bannerMsg && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
                bannerMsg.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {bannerMsg.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{bannerMsg.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setBannerMsg(null)}
                className="text-xs underline opacity-75 hover:opacity-100"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Admin Revision Feedback Banner if any */}
          {profile.admin_feedback && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm">
              <p className="font-bold">
                📌 Nhận xét từ Giáo viên / Phòng Hồ sơ DMF (Rückmeldung der Akademie):
              </p>
              <p className="mt-1">{profile.admin_feedback}</p>
            </div>
          )}

          {/* ================================================================
              TAB 1: OVERVIEW & AI UNLOCK
          ================================================================ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Program & Status Hero Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                      {trackConfig.labelDe} ({trackConfig.legalBasis})
                    </Badge>
                    <Badge variant="secondary">
                      Trạng thái duyệt:{" "}
                      {profile.sync_status === "approved"
                        ? "Đã duyệt lên B2B"
                        : profile.sync_status === "submitted"
                          ? "Đang chờ DMF duyệt"
                          : profile.sync_status === "needs_revision"
                            ? "Cần bổ sung"
                            : "Bản nháp (Entwurf)"}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Xin chào {profile.full_name || "Học viên DMF"}!
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hệ thống giúp bạn chuẩn hoá toàn bộ bộ hồ sơ ứng tuyển Đức (
                    <strong>Bewerbungsmappe</strong>) gồm: Kho giấy tờ dịch thuật công chứng,{" "}
                    <strong>Tabellarischer Lebenslauf</strong> không khoảng trống thời gian,{" "}
                    <strong>Motivationsschreiben chuẩn DIN 5008</strong>, kịch bản quay{" "}
                    <strong>Vorstellungsgespräch</strong> và giấy uỷ quyền{" "}
                    <strong>§ 81a AufenthG</strong>.
                  </p>
                </div>

                {/* Invite Code Unlock Box */}
                <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-xl space-y-3">
                  {aiUnlocked ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Sparkles className="w-5 h-5" />
                        Tài khoản đã mở khoá toàn bộ Trợ lý AI Đức!
                      </div>
                      <p className="text-xs text-slate-300">
                        Bạn có thể sử dụng AI dịch thuật ngữ nghề BERUFENET, kiểm tra OCR giấy tờ,
                        viết Motivationsschreiben chuẩn DIN 5008 và soạn kịch bản phỏng vấn.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRedeemCode} className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <Lock className="w-4 h-4" />
                        Mở khoá Trợ lý AI Chuẩn Hoá Đức (DMF-Freischaltcode)
                      </div>
                      <p className="text-xs text-slate-300">
                        Nhập Mã Học Viên do DMF cấp (hoặc liên hệ giáo viên quản nhiệm để được bật
                        quyền AI trên tài khoản của bạn).
                      </p>
                      <div className="flex gap-2">
                        <Input
                          value={inviteCodeInput}
                          onChange={(e) => setInviteCodeInput(e.target.value)}
                          placeholder="Nhập mã (VD: DMF-2026)"
                          className="bg-slate-950 border-slate-700 text-white text-xs"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isRedeemingCode}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
                        >
                          {isRedeemingCode ? "Đang kiểm tra..." : "Kích hoạt"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* 5-Pillar Action Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      Bước 1 • Unterlagen & OCR
                    </span>
                    <h3 className="font-bold text-slate-900">
                      Kho Giấy Tờ ({uploadedRequiredCount}/{requiredDocsForTrack.length} bắt buộc)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Tải lên Bản gốc & Bản dịch công chứng tiếng Đức theo đúng checklist diện{" "}
                      {trackConfig.labelDe}.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("documents")}
                    className="w-full"
                  >
                    Mở Kho Giấy Tờ →
                  </Button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      Bước 2 • Tabellarischer Lebenslauf
                    </span>
                    <h3 className="font-bold text-slate-900">
                      Trình tạo CV Chuẩn Đức (
                      {timelineGaps.length === 0
                        ? "Lückenlos ✓"
                        : `${timelineGaps.length} khoảng trống`}
                      )
                    </h3>
                    <p className="text-xs text-slate-600">
                      Nhập học vấn & kinh nghiệm, phát hiện khoảng trống thời gian và xuất cả Full
                      CV lẫn Kurzprofil ẩn danh.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("cv")}
                    className="w-full"
                  >
                    Chỉnh sửa Lebenslauf →
                  </Button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      Bước 3 • Anschreiben DIN 5008
                    </span>
                    <h3 className="font-bold text-slate-900">
                      Motivationsschreiben ({letters.length} phiên bản)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Trả lời 5 câu hỏi gợi mở bằng tiếng Việt để tạo thư ứng tuyển chuẩn DIN 5008
                      chân thực cho từng công ty Đức.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("motivation")}
                    className="w-full"
                  >
                    Viết Motivationsschreiben →
                  </Button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      Bước 4 • Vorstellungsgespräch
                    </span>
                    <h3 className="font-bold text-slate-900">
                      Quay Video Teleprompter & Luyện Phỏng Vấn
                    </h3>
                    <p className="text-xs text-slate-600">
                      Đọc kịch bản 60–90s chạy chữ ngang tầm mắt camera và luyện câu hỏi phỏng vấn
                      theo ngành nghề.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("interview")}
                    className="w-full"
                  >
                    Vào Phòng Phỏng Vấn →
                  </Button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 md:col-span-2">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      Bước 5 • Unterschrift, DSGVO & § 81a AufenthG
                    </span>
                    <h3 className="font-bold text-slate-900">
                      Chữ Ký Điện Tử & Xuất Trọn Bộ Hồ Sơ PDF Chuẩn Đức (Bewerbungsmappe)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Ký điện tử trực tiếp trên màn hình để chèn chữ ký vào Lebenslauf, Anschreiben,
                      Biên bản đồng ý DSGVO và Giấy uỷ quyền thủ tục nhanh § 81a AufenthG.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("legal")}
                      className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Ký tên & Xuất Bộ Hồ Sơ PDF →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 2: SMART DOCUMENT VAULT & AI OCR CHECK
          ================================================================ */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Kho Giấy Tờ Chuẩn Hoá Theo Diện Hồ Sơ (Dokumenten-Checkliste)
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Diện hiện tại: <strong>{trackConfig.labelVn}</strong> ({trackConfig.labelDe} –{" "}
                    {trackConfig.legalBasis}). Mỗi loại giấy tờ cần tách rõ{" "}
                    <strong>Bản gốc (Original)</strong> và{" "}
                    <strong>Bản dịch công chứng tiếng Đức (Beglaubigte Übersetzung)</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs text-slate-600 shrink-0">Đổi diện hồ sơ:</Label>
                  <select
                    value={profile.program_track}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        program_track: e.target.value as ProgramTrack,
                      }))
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    {(Object.keys(PROGRAM_TRACK_CONFIG) as ProgramTrack[]).map((k) => (
                      <option key={k} value={k}>
                        {PROGRAM_TRACK_CONFIG[k].labelVn} ({PROGRAM_TRACK_CONFIG[k].labelDe})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-4">
                {[...requiredDocsForTrack, ...optionalDocsForTrack].map((req) => {
                  const isRequired = req.requiredForTracks.includes(profile.program_track);
                  const origDoc = documents.find(
                    (d) => d.doc_type === req.docType && d.variant === "original"
                  );
                  const transDoc = documents.find(
                    (d) => d.doc_type === req.docType && d.variant === "certified_translation"
                  );

                  return (
                    <div
                      key={req.docType}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{req.titleVn}</h3>
                            <Badge
                              variant={isRequired ? "default" : "secondary"}
                              className={
                                isRequired ? "bg-emerald-600 text-white text-[10px]" : "text-[10px]"
                              }
                            >
                              {isRequired ? "Bắt buộc (Pflicht)" : "Bổ sung (Optional)"}
                            </Badge>
                          </div>
                          <p className="text-xs font-medium text-emerald-700">{req.titleDe}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{req.descriptionVn}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Slot 1: Original */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              🇻🇳 Bản gốc (Originaldokument)
                            </span>
                            {origDoc && (
                              <Badge
                                variant="outline"
                                className={
                                  origDoc.status === "verified"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]"
                                    : origDoc.status === "rejected"
                                      ? "bg-red-100 text-red-800 border-red-300 text-[10px]"
                                      : "bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                                }
                              >
                                {origDoc.status === "verified"
                                  ? "✓ DMF Đã duyệt"
                                  : origDoc.status === "rejected"
                                    ? "✕ Cần nộp lại"
                                    : "Đã tải lên"}
                              </Badge>
                            )}
                          </div>

                          {origDoc ? (
                            <div className="text-xs space-y-1.5">
                              <p className="font-medium text-slate-900 truncate">
                                📄 {origDoc.file_name} ({Math.round(origDoc.file_size / 1024)} KB)
                              </p>
                              {origDoc.ocr_data && (
                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1">
                                  <p className="font-semibold text-emerald-700">
                                    🤖 AI OCR Check (Điểm chất lượng:{" "}
                                    {origDoc.ocr_data.qualityScore}
                                    /100):
                                  </p>
                                  <p className="text-slate-600">{origDoc.ocr_data.summaryVn}</p>
                                  {origDoc.ocr_data.warnings.map((w, idx) => (
                                    <p key={idx} className="text-amber-700 font-medium">
                                      ⚠️ {w}
                                    </p>
                                  ))}
                                </div>
                              )}
                              {origDoc.reviewer_note && (
                                <p className="text-red-700 text-[11px] font-medium">
                                  Ghi chú Admin: {origDoc.reviewer_note}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400">Chưa có file bản gốc.</p>
                          )}

                          <div>
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer">
                              {uploadingSlot === `${req.docType}-original` ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Đang tải & quét OCR...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" />
                                  {origDoc ? "Tải lại bản gốc khác" : "Chọn file PDF/Ảnh Bản gốc"}
                                </>
                              )}
                              <input
                                type="file"
                                accept="application/pdf,image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleDocumentUpload(req.docType, "original", f);
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Slot 2: Certified German Translation (if applicable) */}
                        {req.requiresTranslation ? (
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800">
                                🇩🇪 Bản dịch công chứng tiếng Đức (Beglaubigte Übersetzung)
                              </span>
                              {transDoc && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                                >
                                  {transDoc.status === "verified" ? "✓ DMF Đã duyệt" : "Đã tải lên"}
                                </Badge>
                              )}
                            </div>

                            {transDoc ? (
                              <div className="text-xs space-y-1.5">
                                <p className="font-medium text-slate-900 truncate">
                                  📄 {transDoc.file_name} ({Math.round(transDoc.file_size / 1024)}{" "}
                                  KB)
                                </p>
                                {transDoc.ocr_data && (
                                  <p className="text-[11px] text-emerald-700">
                                    🤖 {transDoc.ocr_data.summaryVn}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400">
                                Chưa có bản dịch tiếng Đức công chứng.
                              </p>
                            )}

                            <div>
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer">
                                {uploadingSlot === `${req.docType}-certified_translation` ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Đang tải lên...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5" />
                                    {transDoc
                                      ? "Tải lại bản dịch khác"
                                      : "Chọn file PDF Bản dịch tiếng Đức"}
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="application/pdf,image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f)
                                      handleDocumentUpload(req.docType, "certified_translation", f);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                            Giấy tờ này là bản quốc tế / tiếng Đức sẵn, không cần bản dịch công
                            chứng riêng.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: GERMAN CV BUILDER (TABELLARISCHER LEBENSLAUF)
          ================================================================ */}
          {activeTab === "cv" && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Structured CV Editor */}
              <div className="xl:col-span-6 space-y-6">
                {/* Action Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Trình tạo CV Chuẩn Đức (Tabellarischer Lebenslauf)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Bạn có thể nhập bằng Tiếng Việt, sau đó bấm nút AI để chuẩn hoá sang thuật ngữ
                      nghề Đức.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAiStandardizeCv}
                      disabled={isAiRunning}
                      className="border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                    >
                      {isAiRunning ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          Đang dịch chuẩn Đức...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-1.5 text-emerald-600" />
                          AI Chuẩn Hoá Thuật Ngữ Đức
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveProfile(false)}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu CV"}
                    </Button>
                  </div>
                </div>

                {/* Lücken-Detektor Warning Box */}
                {timelineGaps.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      Lücken-Detektor: Phát hiện {timelineGaps.length} khoảng trống thời gian &gt; 2
                      tháng!
                    </div>
                    {timelineGaps.map((gap, i) => (
                      <div key={i} className="text-xs space-y-1 pl-6">
                        <p>{gap.suggestionVn}</p>
                        <p className="text-emerald-800 font-medium">
                          💡 Gợi ý điền tiếng Đức: „{gap.suggestionDe}“
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Lückenloser Lebenslauf: Tuyệt vời! Quá trình học tập và làm việc của bạn liền
                    mạch, không có khoảng trống thời gian.
                  </div>
                )}

                {/* Section 1: Persönliche Daten */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                    1. Thông tin cá nhân & Mục tiêu nghề nghiệp (Persönliche Daten & Zielberuf)
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <Label className="text-xs">Họ và Tên (Vor- und Nachname) *</Label>
                      <Input
                        value={profile.full_name}
                        onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ngành nghề mục tiêu tiếng Đức (Zielberuf) *</Label>
                      <Input
                        value={profile.target_profession}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, target_profession: e.target.value }))
                        }
                        placeholder="z.B. Pflegefachfrau, Anlagenmechaniker SHK, Koch"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ngày sinh (Geburtsdatum)</Label>
                      <Input
                        type="date"
                        value={profile.date_of_birth || ""}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, date_of_birth: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Nơi sinh theo Hộ chiếu (Geburtsort)</Label>
                      <Input
                        value={profile.place_of_birth}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, place_of_birth: e.target.value }))
                        }
                        placeholder="z.B. Ho-Chi-Minh-Stadt, Vietnam"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Số Hộ chiếu (Reisepass-Nr.)</Label>
                      <Input
                        value={profile.passport_number}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, passport_number: e.target.value }))
                        }
                        placeholder="C1234567"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ngày hết hạn Hộ chiếu (Gültig bis)</Label>
                      <Input
                        type="date"
                        value={profile.passport_expiry || ""}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, passport_expiry: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Trình độ tiếng Đức hiện tại (GER)</Label>
                      <select
                        value={profile.german_level}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            german_level: e.target.value as GermanLevel,
                          }))
                        }
                        className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                      >
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            Deutsch {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Số năm kinh nghiệm (Berufserfahrung)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={40}
                        value={profile.experience_years}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            experience_years: parseInt(e.target.value, 10) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Địa chỉ đường/phường (Straße & Hausnummer)</Label>
                      <Input
                        value={profile.address_street}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, address_street: e.target.value }))
                        }
                        placeholder="123 Nguyen Hue, Distrikt 1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Thành phố / Tỉnh (PLZ & Ort)</Label>
                      <Input
                        value={profile.address_city}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, address_city: e.target.value }))
                        }
                        placeholder="Ho-Chi-Minh-Stadt"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Số điện thoại (Telefon)</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Bildungsweg */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      2. Quá trình học tập & Đào tạo tiếng Đức (Schulbildung & Ausbildung)
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm chặng học tập
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {profile.education_history.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700">
                            Chặng học vấn #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setProfile((p) => ({
                                ...p,
                                education_history: p.education_history.filter(
                                  (item) => item.id !== edu.id
                                ),
                              }))
                            }
                            className="text-xs text-red-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xoá
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-2.5">
                          <div>
                            <Label className="text-[11px]">Từ tháng (YYYY-MM)</Label>
                            <Input
                              value={edu.fromMonth}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, fromMonth: val } : item
                                  ),
                                }));
                              }}
                              placeholder="2020-09"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px]">Đến tháng (YYYY-MM / heute)</Label>
                            <Input
                              value={edu.toMonth}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, toMonth: val } : item
                                  ),
                                }));
                              }}
                              placeholder="2023-06 hoặc heute"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px]">Tỉnh / Thành phố (Ort)</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, location: val } : item
                                  ),
                                }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2.5">
                          <div>
                            <Label className="text-[11px]">
                              🇻🇳 Tên trường & Bằng cấp (Tiếng Việt)
                            </Label>
                            <Input
                              value={edu.institutionVn}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, institutionVn: val } : item
                                  ),
                                }));
                              }}
                              placeholder="VD: Trường THPT Lê Quý Đôn"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px]">
                              🇩🇪 Tên trường trên CV Đức (Institution auf Deutsch)
                            </Label>
                            <Input
                              value={edu.institutionDe}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, institutionDe: val } : item
                                  ),
                                }));
                              }}
                              placeholder="Oberschule Le Quy Don"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px]">🇻🇳 Danh hiệu / Chuyên ngành (VN)</Label>
                            <Input
                              value={edu.degreeVn}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, degreeVn: val } : item
                                  ),
                                }));
                              }}
                              placeholder="Tốt nghiệp THPT"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px]">
                              🇩🇪 Bằng cấp chuẩn Đức (Abschluss auf Deutsch)
                            </Label>
                            <Input
                              value={edu.degreeDe}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProfile((p) => ({
                                  ...p,
                                  education_history: p.education_history.map((item) =>
                                    item.id === edu.id ? { ...item, degreeDe: val } : item
                                  ),
                                }));
                              }}
                              placeholder="Allgemeine Hochschulreife (Abitur-Äquivalent)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Berufserfahrung & Praktika */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      3. Kinh nghiệm làm việc & Thực tập (Berufserfahrung & Praktika)
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addWorkExperience}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm kinh nghiệm / Thực tập
                    </Button>
                  </div>

                  {profile.work_experience.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Nếu bạn đã từng đi thực tập, làm thêm hoặc làm việc chuyên môn, hãy thêm vào
                      đây để tăng sức thuyết phục với chủ doanh nghiệp Đức.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {profile.work_experience.map((work, index) => (
                        <div
                          key={work.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700">
                              Kinh nghiệm #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setProfile((p) => ({
                                  ...p,
                                  work_experience: p.work_experience.filter(
                                    (item) => item.id !== work.id
                                  ),
                                }))
                              }
                              className="text-xs text-red-600 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Xoá
                            </button>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-2.5">
                            <div>
                              <Label className="text-[11px]">Từ tháng (YYYY-MM)</Label>
                              <Input
                                value={work.fromMonth}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProfile((p) => ({
                                    ...p,
                                    work_experience: p.work_experience.map((item) =>
                                      item.id === work.id ? { ...item, fromMonth: val } : item
                                    ),
                                  }));
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-[11px]">Đến tháng (YYYY-MM / heute)</Label>
                              <Input
                                value={work.toMonth}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProfile((p) => ({
                                    ...p,
                                    work_experience: p.work_experience.map((item) =>
                                      item.id === work.id ? { ...item, toMonth: val } : item
                                    ),
                                  }));
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-[11px]">Tên đơn vị / Công ty</Label>
                              <Input
                                value={work.company}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProfile((p) => ({
                                    ...p,
                                    work_experience: p.work_experience.map((item) =>
                                      item.id === work.id ? { ...item, company: val } : item
                                    ),
                                  }));
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-2.5">
                            <div>
                              <Label className="text-[11px]">
                                🇻🇳 Vị trí & Nhiệm vụ (Tiếng Việt)
                              </Label>
                              <Textarea
                                rows={2}
                                value={work.tasksVn}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProfile((p) => ({
                                    ...p,
                                    work_experience: p.work_experience.map((item) =>
                                      item.id === work.id
                                        ? { ...item, roleVn: val.slice(0, 60), tasksVn: val }
                                        : item
                                    ),
                                  }));
                                }}
                                placeholder="VD: Thực tập điều dưỡng, đo huyết áp, hỗ trợ chăm sóc bệnh nhân..."
                              />
                            </div>
                            <div>
                              <Label className="text-[11px]">
                                🇩🇪 Mô tả chuyên ngành tiếng Đức (Tätigkeiten auf Deutsch)
                              </Label>
                              <Textarea
                                rows={2}
                                value={work.tasksDe}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProfile((p) => ({
                                    ...p,
                                    work_experience: p.work_experience.map((item) =>
                                      item.id === work.id ? { ...item, tasksDe: val } : item
                                    ),
                                  }));
                                }}
                                placeholder="Bấm 'AI Chuẩn Hoá Thuật Ngữ Đức' hoặc tự nhập..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 4: Sprachkenntnisse & Besondere Kenntnisse */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      4. Ngoại ngữ & Kỹ năng bổ trợ (Sprachkenntnisse & Besondere Kenntnisse)
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addLanguageSkill}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm ngoại ngữ
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {profile.language_skills.map((lang, idx) => (
                      <div
                        key={idx}
                        className="grid sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <Input
                          value={lang.languageDe}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProfile((p) => ({
                              ...p,
                              language_skills: p.language_skills.map((l, i) =>
                                i === idx ? { ...l, languageDe: val } : l
                              ),
                            }));
                          }}
                          placeholder="Deutsch / Englisch"
                        />
                        <Input
                          value={lang.level}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProfile((p) => ({
                              ...p,
                              language_skills: p.language_skills.map((l, i) =>
                                i === idx ? { ...l, level: val } : l
                              ),
                            }));
                          }}
                          placeholder="B1 / B2 / Muttersprache"
                        />
                        <Input
                          value={lang.provider || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProfile((p) => ({
                              ...p,
                              language_skills: p.language_skills.map((l, i) =>
                                i === idx ? { ...l, provider: val } : l
                              ),
                            }));
                          }}
                          placeholder="Goethe / telc / ÖSD"
                        />
                        <Input
                          type="date"
                          value={lang.examDate || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProfile((p) => ({
                              ...p,
                              language_skills: p.language_skills.map((l, i) =>
                                i === idx ? { ...l, examDate: val } : l
                              ),
                            }));
                          }}
                          title="Ngày thi chứng chỉ"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <Label className="text-xs">Kỹ năng chuyên môn (Fachkompetenzen)</Label>
                      <Input
                        value={profile.special_skills.professionalSkillsDe}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            special_skills: {
                              ...p.special_skills,
                              professionalSkillsDe: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tin học / Phần mềm (EDV-Kenntnisse)</Label>
                      <Input
                        value={profile.special_skills.edvSkillsDe}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            special_skills: { ...p.special_skills, edvSkillsDe: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Bằng lái xe (Führerschein)</Label>
                      <Input
                        value={profile.special_skills.drivingLicenseDe}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            special_skills: {
                              ...p.special_skills,
                              drivingLicenseDe: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Sở thích lành mạnh (Interessen)</Label>
                      <Input
                        value={profile.special_skills.hobbiesDe}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            special_skills: { ...p.special_skills, hobbiesDe: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Dual CV Preview (Full Lebenslauf & Blind Kurzprofil) */}
              <div className="xl:col-span-6 space-y-4 sticky top-28">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={previewTemplate === "full_cv" ? "default" : "outline"}
                      onClick={() => setPreviewTemplate("full_cv")}
                      className={previewTemplate === "full_cv" ? "bg-slate-900 text-white" : ""}
                    >
                      1. Full Lebenslauf (Đầy đủ)
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={previewTemplate === "blind_kurzprofil" ? "default" : "outline"}
                      onClick={() => setPreviewTemplate("blind_kurzprofil")}
                      className={
                        previewTemplate === "blind_kurzprofil" ? "bg-slate-900 text-white" : ""
                      }
                    >
                      2. DMF Kurzprofil (#CODE Ẩn danh)
                    </Button>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      printSelectedTemplate(
                        previewTemplate === "blind_kurzprofil" ? "blind_kurzprofil" : "full_cv"
                      )
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Printer className="w-4 h-4 mr-1.5" />
                    In / Xuất PDF A4
                  </Button>
                </div>

                <div className="max-h-[78vh] overflow-y-auto rounded-2xl border border-slate-300 bg-slate-200/70 p-4">
                  <GermanDocumentPreview
                    template={
                      previewTemplate === "blind_kurzprofil" ? "blind_kurzprofil" : "full_cv"
                    }
                    profile={profile}
                    documents={documents}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 4: MOTIVATIONSSCHREIBEN / ANSCHREIBEN STUDIO (DIN 5008)
          ================================================================ */}
          {activeTab === "motivation" && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Multi-Version Selector + 5 Guided Vietnamese Prompts */}
              <div className="xl:col-span-6 space-y-5">
                {/* Multi-version Manager */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Quản lý Đa Phiên Bản Motivationsschreiben (DIN 5008)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Lưu 1 bản gốc theo ngành và nhân bản cho từng Doanh nghiệp Đức mà bạn ứng
                        tuyển.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCloneLetterForNewEmployer}
                      >
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Nhân bản cho Công ty mới
                      </Button>
                    </div>
                  </div>

                  {letters.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {letters.map((l) => (
                        <div key={l.id} className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => selectLetterForEdit(l)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              selectedLetterId === l.id
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {l.title}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLetter(l.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                            title="Xoá phiên bản này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Target German Company & DIN 5008 Recipient Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    1. Thông tin Doanh nghiệp Đức nhận thư (Empfänger nach DIN 5008)
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Tên phiên bản thư (để dễ quản lý)</Label>
                      <Input
                        value={letterDraft.title}
                        onChange={(e) => setLetterDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="VD: Bản gốc ngành Điều dưỡng / Ứng tuyển Klinikum Stuttgart"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tên Công ty / Cơ sở đào tạo Đức</Label>
                      <Input
                        value={letterDraft.target_company_name}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            target_company_name: e.target.value,
                          }))
                        }
                        placeholder="z.B. Seniorenzentrum St. Elisabeth GmbH"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Người phụ trách (Ansprechpartner/in)</Label>
                      <Input
                        value={letterDraft.target_contact_person}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            target_contact_person: e.target.value,
                          }))
                        }
                        placeholder="z.B. Frau Müller / Herr Schmidt"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Thành phố tại Đức (Zielort)</Label>
                      <Input
                        value={letterDraft.target_city}
                        onChange={(e) =>
                          setLetterDraft((d) => ({ ...d, target_city: e.target.value }))
                        }
                        placeholder="z.B. 80331 München"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ngày có thể bắt đầu (Eintrittstermin)</Label>
                      <Input
                        value={letterDraft.prompt_answers.earliestStartDateDe}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            prompt_answers: {
                              ...d.prompt_answers,
                              earliestStartDateDe: e.target.value,
                            },
                          }))
                        }
                        placeholder="01.09.2026"
                      />
                    </div>
                  </div>
                </div>

                {/* 5 Anti-Cliché Guided Questions in Vietnamese */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        2. Trả lời 4 câu hỏi gợi mở bằng Tiếng Việt (Chất liệu cá nhân thật)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tránh văn mẫu ChatGPT sáo rỗng! Hãy kể trải nghiệm thật của bạn bằng tiếng
                        Việt để AI viết thành bức thư B1/B2 chân thực.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">
                        Câu 1: Điều gì ở thực tế (gia đình, trường học, tính cách) khiến bạn chọn
                        theo đuổi ngành nghề này?
                      </Label>
                      <Textarea
                        rows={2}
                        value={letterDraft.prompt_answers.whyProfessionVn}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            prompt_answers: {
                              ...d.prompt_answers,
                              whyProfessionVn: e.target.value,
                            },
                          }))
                        }
                        placeholder="VD: Em từng chăm sóc ông bà ở quê và rất thích công việc đòi hỏi sự kiên nhẫn, tỉ mỉ..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Câu 2: Kinh nghiệm thực hành, làm thêm hoặc kỹ năng thực tế nào bạn tự tin
                        nhất?
                      </Label>
                      <Textarea
                        rows={2}
                        value={letterDraft.prompt_answers.practicalExperienceVn}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            prompt_answers: {
                              ...d.prompt_answers,
                              practicalExperienceVn: e.target.value,
                            },
                          }))
                        }
                        placeholder="VD: Em đã thực tập 3 tháng tại bệnh viện quận, quen với việc trực ca và làm việc nhóm..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Câu 3: Tại sao bạn chọn nước Đức và công ty/thành phố này?
                      </Label>
                      <Textarea
                        rows={2}
                        value={letterDraft.prompt_answers.whyGermanyAndCompanyVn}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            prompt_answers: {
                              ...d.prompt_answers,
                              whyGermanyAndCompanyVn: e.target.value,
                            },
                          }))
                        }
                        placeholder="VD: Em ấn tượng với chương trình đào tạo thực hành bài bản của quý công ty..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Câu 4: Mục tiêu gắn bó của bạn sau khi hoàn thành khoá đào tạo / sang Đức là
                        gì?
                      </Label>
                      <Textarea
                        rows={2}
                        value={letterDraft.prompt_answers.futurePlanVn}
                        onChange={(e) =>
                          setLetterDraft((d) => ({
                            ...d,
                            prompt_answers: {
                              ...d.prompt_answers,
                              futurePlanVn: e.target.value,
                            },
                          }))
                        }
                        placeholder="VD: Mong muốn làm việc lâu dài tại doanh nghiệp sau khi tốt nghiệp và nâng cao tiếng Đức lên C1..."
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateAiLetter}
                    disabled={isAiRunning}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isAiRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang biên soạn Motivationsschreiben chuẩn DIN 5008...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Viết Motivationsschreiben Chuẩn DIN 5008 (Trình độ {
                          profile.german_level
                        }{" "}
                        tự nhiên)
                      </>
                    )}
                  </Button>
                </div>

                {/* Direct German Text Editor */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">
                      3. Chỉnh sửa trực tiếp nội dung tiếng Đức (Feinschliff)
                    </h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleSaveLetterManual}
                      disabled={isSaving}
                    >
                      Lưu nội dung thư
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Dòng tiêu đề chuẩn DIN 5008 (Betreff)</Label>
                    <Input
                      value={letterDraft.subject_de}
                      onChange={(e) =>
                        setLetterDraft((d) => ({ ...d, subject_de: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Lời chào mở đầu (Anrede)</Label>
                    <Input
                      value={letterDraft.salutation_de}
                      onChange={(e) =>
                        setLetterDraft((d) => ({ ...d, salutation_de: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Nội dung chính (Brieftext – 4 đoạn chuẩn)</Label>
                    <Textarea
                      rows={9}
                      value={letterDraft.body_de}
                      onChange={(e) => setLetterDraft((d) => ({ ...d, body_de: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live DIN 5008 A4 Preview */}
              <div className="xl:col-span-6 space-y-4 sticky top-28">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Xem trước Công văn Chuẩn DIN 5008 (1 Trang A4)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tự động căn lề chuẩn phong bì Đức và chèn chữ ký điện tử ở cuối thư.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => printSelectedTemplate("din5008_anschreiben")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Printer className="w-4 h-4 mr-1.5" />
                    In / Xuất PDF DIN 5008
                  </Button>
                </div>

                <div className="max-h-[78vh] overflow-y-auto rounded-2xl border border-slate-300 bg-slate-200/70 p-4">
                  <GermanDocumentPreview
                    template="din5008_anschreiben"
                    profile={profile}
                    letter={{
                      ...letterDraft,
                      id: letterDraft.id || "draft",
                      student_profile_id: profile.id,
                      user_id: profile.user_id,
                      created_at: "",
                      updated_at: "",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 5: VORSTELLUNGSGESPRÄCH & VIDEO TELEPROMPTER STUDIO
          ================================================================ */}
          {activeTab === "interview" && (
            <TeleprompterStudio
              scriptDe={profile.interview_script_de}
              onScriptChange={(val) =>
                setProfile((prev) => ({ ...prev, interview_script_de: val }))
              }
              videoUrl={profile.video_url || ""}
              onVideoUrlChange={(val) => setProfile((prev) => ({ ...prev, video_url: val }))}
              qaList={profile.interview_qa}
              aiEnabled={aiUnlocked}
              isGeneratingAi={isAiRunning}
              onGenerateAiKit={handleGenerateInterviewKit}
              onSave={() => handleSaveProfile(false)}
              isSaving={isSaving}
              onUploadRecordedVideo={handleUploadRecordedVideo}
              onEvaluateAnswer={handleEvaluateInterviewAnswer}
            />
          )}

          {/* ================================================================
              TAB 6: ELECTRONIC SIGNATURE, DSGVO & § 81a AUFENTHG DOSSIER
          ================================================================ */}
          {activeTab === "legal" && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Signature Pad & Legal Consent Checkboxes */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Chữ Ký Điện Tử Chuẩn Đức (Eigenhändige Unterschrift)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Chữ ký này sẽ tự động gắn vào cuối Lebenslauf, Motivationsschreiben, Bản
                        đồng ý DSGVO và Giấy uỷ quyền § 81a AufenthG.
                      </p>
                    </div>
                  </div>

                  <SignaturePad
                    value={profile.signature_data_url}
                    onChange={(dataUrl) =>
                      setProfile((prev) => ({ ...prev, signature_data_url: dataUrl }))
                    }
                  />

                  <div>
                    <Label className="text-xs">
                      Nơi ký hiển thị trên văn bản Đức (Ort der Unterschrift)
                    </Label>
                    <Input
                      value={profile.signature_place}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, signature_place: e.target.value }))
                      }
                      placeholder="Ho-Chi-Minh-Stadt hoặc Hanoi"
                    />
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.dsgvo_consent_accepted}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            dsgvo_consent_accepted: e.target.checked,
                          }))
                        }
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600"
                      />
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-slate-900 block">
                          1. Đồng ý Bảo mật & Chia sẻ Hồ sơ theo chuẩn DSGVO
                          (Einwilligungserklärung)
                        </span>
                        <span className="text-slate-600 block">
                          Tôi đồng ý cho DMF Talents xử lý dữ liệu, giới thiệu hồ sơ ẩn danh trên
                          dmf-talents.de và gửi Bewerbungsmappe/Video cho các nhà tuyển dụng & cơ
                          quan chức năng tại Đức.
                        </span>
                      </div>
                    </label>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.vollmacht_accepted}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              vollmacht_accepted: e.target.checked,
                            }))
                          }
                          className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600"
                        />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-slate-900 block">
                            2. Ký Giấy Uỷ Quyền Thủ tục Chuyên gia/Học nghề rút gọn (Vollmacht § 81a
                            AufenthG)
                          </span>
                          <span className="text-slate-600 block">
                            Uỷ quyền cho Doanh nghiệp tiếp nhận tại Đức và DMF Talents thực hiện xin
                            Vorabzustimmung & thẩm định văn bằng (Anerkennung).
                          </span>
                        </div>
                      </label>
                      <div>
                        <Label className="text-[11px]">
                          Tên Doanh nghiệp Đức được uỷ quyền (Nếu đã có hợp đồng):
                        </Label>
                        <Input
                          value={profile.vollmacht_employer_name}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              vollmacht_employer_name: e.target.value,
                            }))
                          }
                          placeholder="Để trống nếu chưa chốt doanh nghiệp cụ thể"
                          className="bg-white text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSaveLegal}
                    disabled={isSaving}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isSaving ? "Đang lưu chữ ký..." : "Lưu Chữ Ký & Xác Nhận Các Văn Bản Pháp Lý"}
                  </Button>
                </div>
              </div>

              {/* Right Column: 6 German Standardized PDF Document Switcher & Print Hub */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Bộ 8 Văn Bản Chuẩn Hoá Thị Trường Đức (1-Click A4 PDF Export)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Chọn mẫu văn bản bên dưới để xem trước và bấm &ldquo;Xuất PDF A4&rdquo;.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => printSelectedTemplate(previewTemplate)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Printer className="w-4 h-4 mr-1.5" />
                      Xuất PDF A4 Văn bản đang chọn
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "deckblatt_mappe" as const, label: "1. Deckblatt & Bewerbungsmappe" },
                      { id: "full_cv" as const, label: "2. Full Lebenslauf" },
                      { id: "blind_kurzprofil" as const, label: "3. DMF Kurzprofil (#CODE)" },
                      { id: "din5008_anschreiben" as const, label: "4. Anschreiben DIN 5008" },
                      { id: "dsgvo_consent" as const, label: "5. DSGVO-Einwilligung" },
                      { id: "vollmacht_81a" as const, label: "6. Vollmacht § 81a AufenthG" },
                      {
                        id: "ba_erklaerung" as const,
                        label: "7. BA Erklärung (§ 39 AufenthG)",
                      },
                      {
                        id: "dmf_bewertungsbogen" as const,
                        label: "8. DMF Bewertungsbogen",
                      },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setPreviewTemplate(tpl.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          previewTemplate === tpl.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-[78vh] overflow-y-auto rounded-2xl border border-slate-300 bg-slate-200/70 p-4">
                  <GermanDocumentPreview
                    template={previewTemplate}
                    profile={profile}
                    letter={currentLetter}
                    documents={documents}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
