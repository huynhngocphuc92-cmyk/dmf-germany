"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  createStudentInviteCodeAction,
  reviewStudentDocumentAction,
  syncStudentProfileToB2BCandidateAction,
  toggleStudentAiAccessAction,
} from "@/app/admin/candidates/portal-actions";
import {
  GermanDocumentPreview,
  type GermanTemplateType,
} from "@/components/portal/GermanDocumentTemplates";
import {
  PROGRAM_TRACK_CONFIG,
  type ProgramTrack,
  type StudentDocument,
  type StudentInviteCode,
  type StudentMotivationLetter,
  type StudentProfile,
} from "@/lib/portal/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  Printer,
  KeyRound,
  FileText,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface StudentDossierReviewPanelProps {
  initialProfiles: StudentProfile[];
  initialDocuments: StudentDocument[];
  initialLetters: StudentMotivationLetter[];
  initialInviteCodes: StudentInviteCode[];
  onSyncedToCandidates?: () => void;
}

export function StudentDossierReviewPanel({
  initialProfiles,
  initialDocuments,
  initialLetters,
  initialInviteCodes,
  onSyncedToCandidates,
}: StudentDossierReviewPanelProps) {
  const [profiles, setProfiles] = useState<StudentProfile[]>(initialProfiles);
  const [documents, setDocuments] = useState<StudentDocument[]>(initialDocuments);
  const [inviteCodes, setInviteCodes] = useState<StudentInviteCode[]>(initialInviteCodes);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    initialProfiles[0]?.id || null
  );
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || null;
  const selectedDocs = documents.filter((d) => d.student_profile_id === selectedProfileId);
  const selectedLetters = initialLetters.filter((l) => l.student_profile_id === selectedProfileId);

  const [previewTemplate, setPreviewTemplate] = useState<GermanTemplateType>("full_cv");
  const [adminFeedbackInput, setAdminFeedbackInput] = useState<string>(
    selectedProfile?.admin_feedback || ""
  );

  // Invite Code Generator state
  const [newCode, setNewCode] = useState("DMF-2026-AZUBI");
  const [newCodeMaxUses, setNewCodeMaxUses] = useState(30);
  const [newCodeDesc, setNewCodeDesc] = useState("Lớp tiếng Đức B1/B2");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleSelectProfile = (p: StudentProfile) => {
    setSelectedProfileId(p.id);
    setAdminFeedbackInput(p.admin_feedback || "");
  };

  const handleCreateInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    setStatusMessage(null);
    const res = await createStudentInviteCodeAction({
      code: newCode,
      description: newCodeDesc,
      max_uses: newCodeMaxUses,
    });
    setIsBusy(false);
    if (res.success && res.data) {
      setInviteCodes((prev) => [res.data!, ...prev]);
      setStatusMessage(`Đã tạo mã học viên "${res.data.code}" (${res.data.max_uses} lượt)!`);
    } else {
      setStatusMessage(res.error || "Không thể tạo mã.");
    }
  };

  const handleToggleAi = async (profile: StudentProfile) => {
    const nextVal = !profile.ai_enabled;
    const res = await toggleStudentAiAccessAction(profile.id, nextVal);
    if (res.success) {
      setProfiles((prev) =>
        prev.map((item) => (item.id === profile.id ? { ...item, ai_enabled: nextVal } : item))
      );
      setStatusMessage(
        `Đã ${nextVal ? "mở khoá" : "tạm khoá"} quyền AI cho học viên ${profile.full_name}.`
      );
    }
  };

  const handleVerifyDocument = async (
    docId: string,
    status: "verified" | "rejected",
    note?: string
  ) => {
    const res = await reviewStudentDocumentAction({
      documentId: docId,
      status,
      reviewerNote: note,
    });
    if (res.success) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status, reviewer_note: note || null } : d))
      );
    }
  };

  const handleStagedSync = async (syncStatus: "approved" | "needs_revision") => {
    if (!selectedProfile) return;
    setIsBusy(true);
    setStatusMessage(null);
    const res = await syncStudentProfileToB2BCandidateAction({
      profileId: selectedProfile.id,
      syncStatus,
      adminFeedback: adminFeedbackInput,
    });
    setIsBusy(false);
    if (res.success) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === selectedProfile.id
            ? {
                ...p,
                sync_status: syncStatus,
                candidate_id: res.candidateId || p.candidate_id,
                admin_feedback: adminFeedbackInput,
              }
            : p
        )
      );
      setStatusMessage(
        syncStatus === "approved"
          ? `Đã duyệt & đồng bộ hồ sơ "${selectedProfile.full_name}" sang danh sách Candidates B2B (kèm chứng thực DSGVO)!`
          : `Đã gửi yêu cầu bổ sung hồ sơ cho "${selectedProfile.full_name}".`
      );
      if (syncStatus === "approved") {
        onSyncedToCandidates?.();
      }
    } else {
      setStatusMessage(res.error || "Lỗi đồng bộ.");
    }
  };

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Top Bar: Invite Code Manager & Portal Link */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm grid lg:grid-cols-12 gap-6 items-center print:hidden">
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900">
              Quản lý Mã Học Viên DMF & Cổng Hồ Sơ (/portal)
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Cấp mã cho lớp học để học viên tự mở khoá tính năng AI chuẩn hoá CV, viết
            Motivationsschreiben DIN 5008 & kiểm tra OCR giấy tờ tại{" "}
            <Link href="/portal" className="text-emerald-600 font-semibold underline">
              /portal
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {inviteCodes.slice(0, 5).map((c) => (
              <Badge
                key={c.id}
                variant="outline"
                className="text-xs font-mono border-emerald-300 bg-emerald-50 text-emerald-900"
              >
                {c.code} ({c.used_count}/{c.max_uses})
              </Badge>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleCreateInviteCode}
          className="lg:col-span-7 grid sm:grid-cols-4 gap-2.5 items-end"
        >
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Mã Học Viên mới
            </label>
            <Input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="DMF-2026-B1"
              className="text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Số lượt dùng tối đa
            </label>
            <Input
              type="number"
              min={1}
              max={500}
              value={newCodeMaxUses}
              onChange={(e) => setNewCodeMaxUses(parseInt(e.target.value, 10) || 20)}
              className="text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Ghi chú lớp/khoá
            </label>
            <Input
              value={newCodeDesc}
              onChange={(e) => setNewCodeDesc(e.target.value)}
              placeholder="Khoá Azubi K14"
              className="text-xs"
            />
          </div>
          <Button
            type="submit"
            disabled={isBusy}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          >
            + Tạo Mã Học Viên
          </Button>
        </form>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium print:hidden">
          {statusMessage}
        </div>
      )}

      {/* Main Split View: Student List (Left) & Dossier Inspector + German PDF Print (Right) */}
      <div className="grid xl:grid-cols-12 gap-6 items-start print:block">
        {/* Left List of Student Profiles */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm print:hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Hồ sơ Học viên trên /portal ({profiles.length})
            </h3>
            <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
              <Link href="/portal" target="_blank">
                Mở /portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {profiles.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Chưa có học viên nào đăng ký trên <code className="bg-slate-100 px-1">/portal</code>.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
              {profiles.map((p) => {
                const active = p.id === selectedProfileId;
                const track = PROGRAM_TRACK_CONFIG[p.program_track as ProgramTrack];
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    className={`p-4 cursor-pointer transition-colors ${
                      active ? "bg-emerald-50/80" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm text-slate-900">{p.full_name || p.email}</p>
                        <p className="text-xs text-slate-500">
                          {p.target_profession || track?.labelDe} • Deutsch {p.german_level}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          p.sync_status === "approved"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]"
                            : p.sync_status === "submitted"
                              ? "bg-amber-100 text-amber-800 border-amber-300 text-[10px]"
                              : "text-[10px]"
                        }
                      >
                        {p.sync_status === "approved"
                          ? "Đã đồng bộ B2B"
                          : p.sync_status === "submitted"
                            ? "Chờ duyệt"
                            : p.sync_status === "needs_revision"
                              ? "Cần sửa"
                              : "Nháp"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">
                        DSGVO: {p.dsgvo_consent_accepted ? "✓ Đã ký" : "Chưa ký"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAi(p);
                        }}
                        className={`px-2 py-0.5 rounded font-semibold ${
                          p.ai_enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {p.ai_enabled ? "✨ AI: Bật" : "🔒 Bật AI"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Dossier Inspector & German PDF Export */}
        <div className="xl:col-span-8 space-y-5">
          {!selectedProfile ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
              Chọn một học viên ở danh sách bên trái để kiểm duyệt giấy tờ, xem
              CV/Motivationsschreiben và đồng bộ sang B2B Candidate.
            </div>
          ) : (
            <>
              {/* Staged Sync Approval Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 print:hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Kiểm duyệt Staged Sync: {selectedProfile.full_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Email: {selectedProfile.email} • SĐT: {selectedProfile.phone || "–"} • Hộ
                      chiếu: {selectedProfile.passport_number || "–"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.candidate_id && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/candidates/${selectedProfile.candidate_id}/preview`}>
                          <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                          Vorschau & Freigabe B2B
                        </Link>
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isBusy}
                      onClick={() => handleStagedSync("needs_revision")}
                      className="border-amber-300 text-amber-800 hover:bg-amber-50"
                    >
                      Yêu cầu Học viên Bổ sung
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleStagedSync("approved")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-1.5" />
                      Duyệt & Đồng bộ sang B2B Candidate
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Nhận xét của Giáo viên / Admin gửi cho học viên (hiển thị trên /portal):
                  </label>
                  <Textarea
                    rows={2}
                    value={adminFeedbackInput}
                    onChange={(e) => setAdminFeedbackInput(e.target.value)}
                    placeholder="VD: CV và Motivationsschreiben đã rất tốt! Em vui lòng tải thêm bản dịch công chứng bằng THPT nhé."
                    className="text-xs"
                  />
                </div>

                {/* Uploaded Documents Verification Table */}
                {selectedDocs.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Giấy tờ đã nộp ({selectedDocs.length} file)
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {selectedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {doc.doc_type} (
                              {doc.variant === "original" ? "Bản gốc" : "Bản dịch ĐỨC"})
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{doc.file_name}</p>
                            {doc.ocr_data && (
                              <p className="text-[10px] text-emerald-700">
                                OCR Score: {doc.ocr_data.qualityScore}/100
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {doc.file_url && (
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                                title="Mở file"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleVerifyDocument(doc.id, "verified")}
                              className={`p-1.5 rounded border ${
                                doc.status === "verified"
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50"
                              }`}
                              title="Xác nhận đạt chuẩn"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleVerifyDocument(
                                  doc.id,
                                  "rejected",
                                  "Bản scan chưa rõ hoặc thiếu dấu công chứng, vui lòng tải lại."
                                )
                              }
                              className={`p-1.5 rounded border ${
                                doc.status === "rejected"
                                  ? "bg-red-600 text-white border-red-600"
                                  : "bg-white text-red-600 border-slate-200 hover:bg-red-50"
                              }`}
                              title="Yêu cầu nộp lại"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 8 German Standardized Documents Preview & 1-Click PDF Export */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 print:border-none print:shadow-none print:p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "full_cv" as const, label: "Full Lebenslauf" },
                      { id: "blind_kurzprofil" as const, label: "DMF Kurzprofil (#CODE)" },
                      { id: "din5008_anschreiben" as const, label: "Anschreiben DIN 5008" },
                      { id: "deckblatt_mappe" as const, label: "Deckblatt Mappe" },
                      { id: "dsgvo_consent" as const, label: "DSGVO Consent" },
                      { id: "vollmacht_81a" as const, label: "Vollmacht § 81a" },
                      { id: "ba_erklaerung" as const, label: "BA Erklärung (§ 39)" },
                      { id: "dmf_bewertungsbogen" as const, label: "DMF Bewertungsbogen" },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setPreviewTemplate(tpl.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          previewTemplate === tpl.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => window.print()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Printer className="w-4 h-4 mr-1.5" />
                    In / Xuất PDF
                  </Button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-slate-300 bg-slate-100 p-4 print:max-h-none print:overflow-visible print:border-none print:bg-white print:p-0">
                  <GermanDocumentPreview
                    template={previewTemplate}
                    profile={selectedProfile}
                    letter={selectedLetters[0] || null}
                    documents={selectedDocs}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
