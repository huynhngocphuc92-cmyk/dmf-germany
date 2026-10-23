import type { GermanLevel } from "@/app/admin/candidates/types";

export type ProgramTrack = "azubi" | "skilled" | "studium" | "seasonal";

export type PortalSyncStatus = "draft" | "submitted" | "approved" | "needs_revision";

export type DocumentVariant = "original" | "certified_translation";

export type DocumentVerificationStatus = "pending" | "verified" | "rejected";

export type DocumentTypeKey =
  | "passport"
  | "biometric_photo"
  | "high_school_diploma"
  | "high_school_transcript"
  | "german_certificate"
  | "vocational_degree"
  | "transcript_hours"
  | "work_certificate"
  | "anerkennung_bescheid"
  | "aps_certificate"
  | "testas_certificate"
  | "enrollment_certificate"
  | "health_certificate"
  | "criminal_record";

export interface DocumentRequirement {
  docType: DocumentTypeKey;
  titleVn: string;
  titleDe: string;
  descriptionVn: string;
  requiresTranslation: boolean;
  requiredForTracks: ProgramTrack[];
  optionalForTracks?: ProgramTrack[];
}

export const PROGRAM_TRACK_CONFIG: Record<
  ProgramTrack,
  {
    labelVn: string;
    labelDe: string;
    legalBasis: string;
    candidateCategory: "azubi" | "skilled" | "seasonal";
    descriptionVn: string;
  }
> = {
  azubi: {
    labelVn: "Du học nghề kép",
    labelDe: "Duale Berufsausbildung",
    legalBasis: "§ 16a AufenthG",
    candidateCategory: "azubi",
    descriptionVn: "Chương trình đào tạo nghề kép 3 năm tại doanh nghiệp và trường nghề Đức.",
  },
  skilled: {
    labelVn: "Lao động chuyên môn",
    labelDe: "Fachkräfte mit Berufsausbildung / Studium",
    legalBasis: "§ 18a / § 18b & § 81a AufenthG",
    candidateCategory: "skilled",
    descriptionVn:
      "Dành cho kỹ thuật viên, điều dưỡng, thợ lành nghề hoặc kỹ sư đã có bằng cấp/kinh nghiệm.",
  },
  studium: {
    labelVn: "Du học Đại học / Dự bị",
    labelDe: "Studium & Studienkolleg",
    legalBasis: "§ 16b AufenthG",
    candidateCategory: "azubi",
    descriptionVn: "Chương trình Cử nhân, Thạc sĩ hoặc Dự bị đại học tại các trường công lập Đức.",
  },
  seasonal: {
    labelVn: "Lao động thời vụ / Thực tập",
    labelDe: "Saisonbeschäftigung / Ferienbeschäftigung",
    legalBasis: "§ 15a BeschV",
    candidateCategory: "seasonal",
    descriptionVn: "Làm việc ngắn hạn hoặc thực tập trải nghiệm theo quy định của ZAV/BA.",
  },
};

export const DOCUMENT_CHECKLIST_CONFIG: DocumentRequirement[] = [
  {
    docType: "passport",
    titleVn: "Hộ chiếu phổ thông",
    titleDe: "Gültiger Reisepass",
    descriptionVn:
      "Còn hạn ít nhất 12 tháng, chữ ký chủ hộ chiếu ở trang 3, còn tối thiểu 2 trang trống.",
    requiresTranslation: false,
    requiredForTracks: ["azubi", "skilled", "studium", "seasonal"],
  },
  {
    docType: "biometric_photo",
    titleVn: "Ảnh thẻ sinh trắc học & Ảnh CV",
    titleDe: "Biometrisches Passbild & Bewerbungsfoto",
    descriptionVn:
      "Chuẩn 3.5x4.5cm nền trắng/xám nhạt, chụp thẳng mặt không quá 6 tháng (dùng cho CV & Visa).",
    requiresTranslation: false,
    requiredForTracks: ["azubi", "skilled", "studium", "seasonal"],
  },
  {
    docType: "high_school_diploma",
    titleVn: "Bằng tốt nghiệp THPT",
    titleDe: "Schulabschlusszeugnis (Abitur / Oberschulabschluss)",
    descriptionVn: "Bản scan gốc rõ dấu mộc đỏ và bản dịch công chứng tiếng Đức.",
    requiresTranslation: true,
    requiredForTracks: ["azubi", "studium"],
    optionalForTracks: ["skilled"],
  },
  {
    docType: "high_school_transcript",
    titleVn: "Học bạ THPT 3 năm (Lớp 10, 11, 12)",
    titleDe: "Schulnotenübersicht (Klasse 10–12)",
    descriptionVn:
      "Đầy đủ tất cả các trang điểm số, nhận xét của giáo viên và trang bìa ký đóng dấu.",
    requiresTranslation: true,
    requiredForTracks: ["azubi", "studium"],
  },
  {
    docType: "german_certificate",
    titleVn: "Chứng chỉ tiếng Đức (Goethe / telc / ÖSD / TestDaF)",
    titleDe: "Sprachzertifikat Deutsch (GER B1 / B2)",
    descriptionVn:
      "Đủ 4 kỹ năng (Hören, Lesen, Schreiben, Sprechen). Lưu ý: Không quá 12 tháng khi nộp ĐSQ.",
    requiresTranslation: false,
    requiredForTracks: ["azubi", "skilled", "studium"],
    optionalForTracks: ["seasonal"],
  },
  {
    docType: "vocational_degree",
    titleVn: "Bằng Cao đẳng / Đại học / Trung cấp nghề",
    titleDe: "Berufsabschlusszeugnis / Hochschulurkunde",
    descriptionVn: "Bắt buộc đối với diện Fachkräfte (§18a/b) để thẩm định công nhận bằng cấp.",
    requiresTranslation: true,
    requiredForTracks: ["skilled"],
    optionalForTracks: ["azubi", "studium"],
  },
  {
    docType: "transcript_hours",
    titleVn: "Bảng điểm chi tiết kèm Khung chương trình (Số tiết Lý thuyết/Thực hành)",
    titleDe: "Fächer- und Stundenübersicht (Theorie & Praxis für Anerkennung)",
    descriptionVn:
      "Cực kỳ quan trọng cho IHK FOSA / ZAB / Sở Y tế Đức đối chiếu tương đương bằng cấp.",
    requiresTranslation: true,
    requiredForTracks: ["skilled"],
    optionalForTracks: ["studium"],
  },
  {
    docType: "work_certificate",
    titleVn: "Xác nhận kinh nghiệm làm việc / Thực tập",
    titleDe: "Arbeitszeugnisse / Praktikumsnachweise",
    descriptionVn: "Ghi rõ thời gian làm việc, chức danh và các nhiệm vụ chuyên môn đã thực hiện.",
    requiresTranslation: true,
    requiredForTracks: ["skilled"],
    optionalForTracks: ["azubi", "seasonal"],
  },
  {
    docType: "anerkennung_bescheid",
    titleVn: "Quyết định công nhận văn bằng / ZAB (Nếu đã có)",
    titleDe: "Anerkennungsbescheid / Defizitbescheid / ZAB-Zeugnisbewertung",
    descriptionVn: "Nếu đã nộp hồ sơ thẩm định tại Đức, vui lòng tải lên văn bản phản hồi.",
    requiresTranslation: false,
    requiredForTracks: [],
    optionalForTracks: ["skilled"],
  },
  {
    docType: "aps_certificate",
    titleVn: "Chứng chỉ APS & Kết quả thi TestAS",
    titleDe: "APS-Zertifikat & TestAS-Ergebnis",
    descriptionVn:
      "Bắt buộc cho học sinh/sinh viên nộp hồ sơ Du học Đại học/Dự bị đại học tại Đức.",
    requiresTranslation: false,
    requiredForTracks: ["studium"],
  },
  {
    docType: "enrollment_certificate",
    titleVn: "Giấy xác nhận sinh viên (Immatrikulationsbescheinigung)",
    titleDe: "Immatrikulationsbescheinigung der Hochschule",
    descriptionVn: "Dành cho sinh viên đi làm việc thời vụ kỳ nghỉ hè (Ferienbeschäftigung ZAV).",
    requiresTranslation: true,
    requiredForTracks: ["seasonal"],
  },
  {
    docType: "health_certificate",
    titleVn: "Giấy khám sức khỏe & Tiêm chủng (Sởi/Rubella)",
    titleDe: "Gesundheitszeugnis & Impfnachweis (Masernschutzgesetz)",
    descriptionVn:
      "Đặc biệt bắt buộc chứng nhận tiêm phòng Sởi (Masernschutz) đối với ngành Y tế/Điều dưỡng.",
    requiresTranslation: true,
    requiredForTracks: ["azubi", "skilled"],
    optionalForTracks: ["seasonal"],
  },
  {
    docType: "criminal_record",
    titleVn: "Phiếu Lý lịch tư pháp số 1",
    titleDe: "Polizeiliches Führungszeugnis (Nr. 1)",
    descriptionVn: "Cấp trong vòng 6 tháng gần nhất để phục vụ xin cấp phép hành nghề và Visa.",
    requiresTranslation: true,
    requiredForTracks: ["azubi", "skilled"],
  },
];

export interface EducationEntry {
  id: string;
  fromMonth: string; // YYYY-MM
  toMonth: string; // YYYY-MM or "heute"
  institutionVn: string;
  institutionDe: string;
  location: string;
  degreeVn: string;
  degreeDe: string;
  detailsDe: string;
}

export interface WorkExperienceEntry {
  id: string;
  fromMonth: string; // YYYY-MM
  toMonth: string; // YYYY-MM or "heute"
  company: string;
  location: string;
  roleVn: string;
  roleDe: string;
  tasksVn: string;
  tasksDe: string;
}

export interface LanguageSkillEntry {
  languageDe: string;
  languageVn: string;
  level: string; // Muttersprache, A1..C2
  provider?: string; // Goethe, telc, ÖSD, IELTS...
  examDate?: string;
  scores?: {
    lesen?: string;
    hoeren?: string;
    schreiben?: string;
    sprechen?: string;
  };
}

export interface SpecialSkillsData {
  drivingLicenseDe: string; // z.B. Klasse A1 / B (Vietnam)
  edvSkillsDe: string; // z.B. MS Office, HIS/Pflegedokumentation, AutoCAD
  professionalSkillsDe: string; // Fachliche Stärken
  hobbiesDe: string; // Interessen & Engagement
}

export interface TimelineGapWarning {
  fromMonth: string;
  toMonth: string;
  missingMonths: number;
  suggestionDe: string;
  suggestionVn: string;
}

export interface MotivationPromptAnswers {
  whyProfessionVn: string;
  practicalExperienceVn: string;
  whyGermanyAndCompanyVn: string;
  personalStrengthsVn: string;
  futurePlanVn: string;
  earliestStartDateDe: string; // z.B. "01.09.2026" oder "ab sofort"
}

export interface InterviewAnswerEvaluation {
  overallScore: number; // 0-100
  grammatikScore: number; // 0-100
  inhaltScore: number; // 0-100
  kulturScore: number; // 0-100
  correctedGerman: string;
  upgradedB2VersionDe: string;
  feedbackVn: string;
  evaluatedAt: string;
}

export interface InterviewQAItem {
  id: string;
  questionDe: string;
  questionVn: string;
  sampleAnswerDe: string;
  sampleAnswerVn: string;
  pronunciationTip: string;
  studentAnswerDe?: string;
  evaluation?: InterviewAnswerEvaluation;
}

export interface StudentOcrResult {
  documentMatchesType: boolean;
  qualityScore: number; // 1-100
  extractedFullName?: string;
  extractedBirthDate?: string; // YYYY-MM-DD
  extractedDocumentNumber?: string;
  extractedIssueDate?: string; // YYYY-MM-DD
  extractedExpiryDate?: string; // YYYY-MM-DD
  warnings: string[];
  summaryVn: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  candidate_id: string | null;
  program_track: ProgramTrack;
  ai_enabled: boolean;
  invite_code_used: string | null;

  full_name: string;
  given_name: string;
  family_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  place_of_birth: string;
  nationality: string;
  marital_status: string;
  passport_number: string;
  passport_expiry: string | null;
  address_street: string;
  address_city: string;
  address_country: string;
  avatar_url: string | null;

  target_profession: string;
  experience_years: number;
  german_level: GermanLevel;

  education_history: EducationEntry[];
  work_experience: WorkExperienceEntry[];
  language_skills: LanguageSkillEntry[];
  special_skills: SpecialSkillsData;

  video_url: string | null;
  interview_script_de: string;
  interview_qa: InterviewQAItem[];

  signature_data_url: string | null;
  signature_place: string;
  signature_updated_at: string | null;
  dsgvo_consent_accepted: boolean;
  dsgvo_consent_signed_at: string | null;
  vollmacht_accepted: boolean;
  vollmacht_signed_at: string | null;
  vollmacht_employer_name: string;

  sync_status: PortalSyncStatus;
  admin_feedback: string | null;
  last_synced_at: string | null;
  last_synced_by: string | null;

  created_at: string;
  updated_at: string;
}

export interface StudentDocument {
  id: string;
  student_profile_id: string;
  user_id: string;
  doc_type: DocumentTypeKey;
  variant: DocumentVariant;
  file_name: string;
  file_path: string;
  file_url: string | null;
  file_size: number;
  mime_type: string;
  ocr_data: StudentOcrResult | null;
  ocr_checked_at: string | null;
  status: DocumentVerificationStatus;
  reviewer_note: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentMotivationLetter {
  id: string;
  student_profile_id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}

export interface StudentInviteCode {
  id: string;
  code: string;
  description: string | null;
  program_track: ProgramTrack | null;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Lücken-Detektor: Phát hiện các khoảng trống thời gian > 2 tháng trong CV chuẩn Đức.
 * Nhà tuyển dụng Đức và Ausländerbehörde yêu cầu Tabellarischer Lebenslauf phải "lückenlos".
 */
export function detectTimelineGaps(
  education: EducationEntry[],
  work: WorkExperienceEntry[]
): TimelineGapWarning[] {
  const parseYm = (ym: string): number | null => {
    if (!ym) return null;
    if (ym.toLowerCase() === "heute" || ym.toLowerCase() === "nay") {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const match = ym.match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;
    return parseInt(match[1], 10) * 12 + (parseInt(match[2], 10) - 1);
  };

  const formatYm = (totalMonths: number): string => {
    const year = Math.floor(totalMonths / 12);
    const month = (totalMonths % 12) + 1;
    return `${year}-${String(month).padStart(2, "0")}`;
  };

  const intervals: { start: number; end: number }[] = [];
  for (const item of [...education, ...work]) {
    const s = parseYm(item.fromMonth);
    const e = parseYm(item.toMonth);
    if (s !== null && e !== null && e >= s) {
      intervals.push({ start: s, end: e });
    }
  }

  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a.start - b.start);

  // Merge overlapping intervals
  const merged: { start: number; end: number }[] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr.start <= last.end + 1) {
      last.end = Math.max(last.end, curr.end);
    } else {
      merged.push({ ...curr });
    }
  }

  // Also check gap from last interval end to current month
  const now = new Date();
  const currentMonthIdx = now.getFullYear() * 12 + now.getMonth();
  const lastInterval = merged[merged.length - 1];
  if (lastInterval && currentMonthIdx - lastInterval.end > 2) {
    merged.push({ start: currentMonthIdx, end: currentMonthIdx });
  }

  const warnings: TimelineGapWarning[] = [];
  for (let i = 0; i < merged.length - 1; i++) {
    const gapMonths = merged[i + 1].start - merged[i].end - 1;
    if (gapMonths > 2) {
      const gapStart = formatYm(merged[i].end + 1);
      const gapEnd = formatYm(merged[i + 1].start - 1);
      warnings.push({
        fromMonth: gapStart,
        toMonth: gapEnd,
        missingMonths: gapMonths,
        suggestionDe:
          "Intensivsprachkurs Deutsch (A1–B2) und interkulturelle Berufsvorbereitung bei DMF Vietnam Academy",
        suggestionVn: `Đang trống ${gapMonths} tháng (từ ${gapStart} đến ${gapEnd}). CV chuẩn Đức (Lückenloser Lebenslauf) không được để trống quá 2 tháng. Gợi ý bổ sung giai đoạn học tiếng Đức / thực tập định hướng nghề.`,
      });
    }
  }

  return warnings;
}

export interface CandidateAssessmentMetrics {
  requiredDocsCount: number;
  uploadedRequiredDocsCount: number;
  verifiedDocsCount: number;
  dossierCompletenessPercent: number;
  isCvGapFree: boolean;
  interviewEvaluatedCount: number;
  avgInterviewScore: number;
  avgGrammatikScore: number;
  avgInhaltScore: number;
  avgKulturScore: number;
  overallReadinessScore: number;
  readinessLabelDe: string;
  readinessLabelVn: string;
}

/**
 * Tính toán bộ chỉ số đánh giá năng lực & độ sẵn sàng hồ sơ cho DMF Bewertungsbogen
 */
export function computeCandidateAssessmentMetrics(
  profile: StudentProfile,
  documents: StudentDocument[] = []
): CandidateAssessmentMetrics {
  const requiredItems = DOCUMENT_CHECKLIST_CONFIG.filter((item) =>
    item.requiredForTracks.includes(profile.program_track)
  );
  const requiredDocsCount = requiredItems.length;
  const uploadedRequiredDocsCount = requiredItems.filter((item) =>
    documents.some((d) => d.doc_type === item.docType)
  ).length;
  const verifiedDocsCount = documents.filter((d) => d.status === "verified").length;

  const dossierCompletenessPercent =
    requiredDocsCount > 0 ? Math.round((uploadedRequiredDocsCount / requiredDocsCount) * 100) : 100;

  const gaps = detectTimelineGaps(profile.education_history, profile.work_experience);
  const isCvGapFree =
    (profile.education_history.length > 0 || profile.work_experience.length > 0) &&
    gaps.length === 0;

  const evaluatedItems = (profile.interview_qa || []).filter((q) => Boolean(q.evaluation));
  const interviewEvaluatedCount = evaluatedItems.length;

  const levelBaseScore: Record<GermanLevel, number> = {
    A1: 68,
    A2: 75,
    B1: 84,
    B2: 91,
    C1: 96,
    C2: 99,
  };
  const base = levelBaseScore[profile.german_level] || 82;

  const avgInterviewScore =
    interviewEvaluatedCount > 0
      ? Math.round(
          evaluatedItems.reduce((acc, q) => acc + (q.evaluation?.overallScore || base), 0) /
            interviewEvaluatedCount
        )
      : base;

  const avgGrammatikScore =
    interviewEvaluatedCount > 0
      ? Math.round(
          evaluatedItems.reduce((acc, q) => acc + (q.evaluation?.grammatikScore || base - 2), 0) /
            interviewEvaluatedCount
        )
      : base - 2;

  const avgInhaltScore =
    interviewEvaluatedCount > 0
      ? Math.round(
          evaluatedItems.reduce((acc, q) => acc + (q.evaluation?.inhaltScore || base + 1), 0) /
            interviewEvaluatedCount
        )
      : base + 1;

  const avgKulturScore =
    interviewEvaluatedCount > 0
      ? Math.round(
          evaluatedItems.reduce((acc, q) => acc + (q.evaluation?.kulturScore || 90), 0) /
            interviewEvaluatedCount
        )
      : 90;

  const structuralBonus =
    (isCvGapFree ? 10 : 5) +
    (profile.dsgvo_consent_accepted ? 10 : 0) +
    (profile.vollmacht_accepted ? 10 : 0);

  const overallReadinessScore = Math.min(
    100,
    Math.round(dossierCompletenessPercent * 0.35 + avgInterviewScore * 0.35 + structuralBonus)
  );

  let readinessLabelDe = "In Vorbereitung (Sprach- & Dossieraufbau)";
  let readinessLabelVn = "Đang hoàn thiện hồ sơ & ngoại ngữ";

  if (overallReadinessScore >= 85) {
    readinessLabelDe = "Sehr gut geeignet – Sofort vermittelbar (§ 81a AufenthG bereit)";
    readinessLabelVn = "Rất phù hợp – Sẵn sàng phỏng vấn & làm thủ tục § 81a AufenthG";
  } else if (overallReadinessScore >= 70) {
    readinessLabelDe = "Gut geeignet – Unterlagen in abschließender Prüfung";
    readinessLabelVn = "Khá phù hợp – Hồ sơ đang ở bước rà soát cuối";
  }

  return {
    requiredDocsCount,
    uploadedRequiredDocsCount,
    verifiedDocsCount,
    dossierCompletenessPercent,
    isCvGapFree,
    interviewEvaluatedCount,
    avgInterviewScore,
    avgGrammatikScore,
    avgInhaltScore,
    avgKulturScore,
    overallReadinessScore,
    readinessLabelDe,
    readinessLabelVn,
  };
}
