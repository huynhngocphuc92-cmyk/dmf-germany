// ============================================
// CANDIDATE TYPES
// ============================================

export type CandidateCategory = "azubi" | "skilled" | "seasonal";

export type CandidatePoolStage =
  | "a_niveau"
  | "b_niveau"
  | "b1_b2_exam"
  | "interview_ready"
  | "in_germany";

export type CandidateStatus =
  | "new"
  | "screening"
  | "interview"
  | "documents"
  | "visa"
  | "approved"
  | "rejected";

export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Candidate {
  id: string;
  created_at: string;
  updated_at: string;

  // Personal Info
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string;
  video_url?: string; // YouTube video URL for candidate introduction video

  // Professional Info
  category: CandidateCategory;
  profession?: string;
  experience_years: number;
  german_level: GermanLevel;

  // Kandidaten Pool Stage & Cohort
  pool_stage?: CandidatePoolStage;
  cohort?: string;
  display_code?: string;

  publication_status: "draft" | "published";
  publication_valid_until: string | null;
  publication_consent_note: string | null;
  publication_reviewed_at: string | null;
  publication_reviewed_by: string | null;

  // Status (New Schema)
  visa_status: boolean;
  is_featured: boolean;
  notes?: string;
}

export interface CandidateFormData {
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  category: CandidateCategory;
  profession?: string;
  experience_years: number;
  german_level: GermanLevel;
  pool_stage?: CandidatePoolStage;
  cohort?: string;
  visa_status: boolean;
  is_featured: boolean;
  notes?: string;
  avatar_url?: string;
  video_url?: string; // YouTube video URL for candidate introduction video
}

// ============================================
// UI HELPERS
// ============================================

export type AdminLanguage = "de" | "en" | "vn";

// Bilingual labels for category
export const categoryLabelsI18n: Record<CandidateCategory, Record<AdminLanguage, string>> = {
  azubi: { de: "Auszubildende", en: "Apprentices", vn: "Học viên" },
  skilled: { de: "Fachkräfte", en: "Skilled Workers", vn: "Chuyên gia" },
  seasonal: { de: "Saisonkräfte", en: "Seasonal Workers", vn: "Thời vụ" },
};

// Legacy single-language labels (German only)
export const categoryLabels: Record<CandidateCategory, string> = {
  azubi: "Auszubildende",
  skilled: "Fachkräfte",
  seasonal: "Saisonkräfte",
};

export const categoryColors: Record<CandidateCategory, string> = {
  azubi: "bg-blue-100 text-blue-700 border-blue-200",
  skilled: "bg-emerald-100 text-emerald-700 border-emerald-200",
  seasonal: "bg-amber-100 text-amber-700 border-amber-200",
};

export const poolStageLabelsI18n: Record<CandidatePoolStage, Record<AdminLanguage, string>> = {
  interview_ready: {
    de: "Interviewbereit (Zertifiziert)",
    en: "Interview Ready (Certified)",
    vn: "Đã sẵn sàng phỏng vấn",
  },
  b1_b2_exam: {
    de: "In B1/B2-Prüfungsvorbereitung",
    en: "In B1/B2 Exam Prep",
    vn: "Đang ôn & thi B1/B2",
  },
  b_niveau: {
    de: "Sprachkurs B-Niveau (B1/B2)",
    en: "Language Training B-Level (B1/B2)",
    vn: "Đang học tiếng B-Niveaus",
  },
  a_niveau: {
    de: "Sprachkurs A-Niveau (A1/A2)",
    en: "Language Training A-Level (A1/A2)",
    vn: "Đang học tiếng A-Niveaus",
  },
  in_germany: {
    de: "In Deutschland (Referenz-Talent)",
    en: "In Germany (Placed Alumni)",
    vn: "Đã sang Đức học nghề",
  },
};

export const poolStageLabels: Record<CandidatePoolStage, string> = {
  interview_ready: "Interviewbereit",
  b1_b2_exam: "In B1/B2-Prüfung",
  b_niveau: "Sprachkurs B-Niveau",
  a_niveau: "Sprachkurs A-Niveau",
  in_germany: "In Deutschland",
};

export const poolStageColors: Record<CandidatePoolStage, string> = {
  interview_ready: "bg-emerald-100 text-emerald-800 border-emerald-300",
  b1_b2_exam: "bg-amber-100 text-amber-800 border-amber-300",
  b_niveau: "bg-blue-100 text-blue-800 border-blue-300",
  a_niveau: "bg-slate-100 text-slate-700 border-slate-300",
  in_germany: "bg-indigo-100 text-indigo-800 border-indigo-300",
};

// Bilingual labels for status
export const statusLabelsI18n: Record<CandidateStatus, Record<AdminLanguage, string>> = {
  new: { de: "Neu", en: "New", vn: "Mới" },
  screening: { de: "Vorauswahl", en: "Screening", vn: "Sàng lọc" },
  interview: { de: "Interview", en: "Interview", vn: "Phỏng vấn" },
  documents: { de: "Dokumente", en: "Documents", vn: "Hồ sơ" },
  visa: { de: "Visum", en: "Visa", vn: "Visa" },
  approved: { de: "Genehmigt", en: "Approved", vn: "Đã duyệt" },
  rejected: { de: "Abgelehnt", en: "Rejected", vn: "Từ chối" },
};

// Legacy single-language labels (German only)
export const statusLabels: Record<CandidateStatus, string> = {
  new: "Neu",
  screening: "Vorauswahl",
  interview: "Interview",
  documents: "Dokumente",
  visa: "Visum",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
};

export const statusColors: Record<CandidateStatus, string> = {
  new: "bg-slate-100 text-slate-700 border-slate-200",
  screening: "bg-purple-100 text-purple-700 border-purple-200",
  interview: "bg-blue-100 text-blue-700 border-blue-200",
  documents: "bg-amber-100 text-amber-700 border-amber-200",
  visa: "bg-cyan-100 text-cyan-700 border-cyan-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

export const germanLevels: GermanLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// ============================================
// ADMIN TRANSLATIONS
// ============================================

export const adminTranslations = {
  de: {
    // Dashboard
    dashboardTitle: "Dashboard Overview",
    dashboardDesc: "Hier ist ein Überblick über Ihre aktuellen Kennzahlen.",
    totalCandidates: "Gesamt Kandidaten",
    newApplications: "Neue Bewerbungen",
    visaProcessing: "Visum in Bearbeitung",
    successRate: "Erfolgsquote",
    candidatesPerMonth: "Kandidaten pro Monat",
    monthlyOverview: "Monatliche Übersicht der Bewerbungen",
    categoryDistribution: "Kategorieverteilung",
    categoryDesc: "Anteil nach Kandidatentyp",
    quickAccess: "Schnellzugriff",
    quickAccessDesc: "Häufig verwendete Funktionen",
    recentCandidates: "Neueste Kandidaten",
    recentDesc: "Zuletzt hinzugefügte Profile",
    manageInquiries: "Anfragen verwalten",
    candidates: "Kandidaten",
    blog: "Blog verwalten",
    statistics: "Statistiken",
    settings: "Einstellungen",
    name: "Name",
    category: "Kategorie",
    status: "Status",
    logout: "Abmelden",
    demoDataWarning: "Demo-Daten werden angezeigt",
  },
  en: {
    // Dashboard
    dashboardTitle: "Dashboard Overview",
    dashboardDesc: "Here is an overview of your current metrics.",
    totalCandidates: "Total Candidates",
    newApplications: "New Applications",
    visaProcessing: "Visa Processing",
    successRate: "Success Rate",
    candidatesPerMonth: "Candidates per Month",
    monthlyOverview: "Monthly Overview of Applications",
    categoryDistribution: "Category Distribution",
    categoryDesc: "Share by Candidate Type",
    quickAccess: "Quick Access",
    quickAccessDesc: "Frequently Used Functions",
    recentCandidates: "Latest Candidates",
    recentDesc: "Recently Added Profiles",
    manageInquiries: "Manage Inquiries",
    candidates: "Candidates",
    blog: "Manage Blog",
    statistics: "Statistics",
    settings: "Settings",
    name: "Name",
    category: "Category",
    status: "Status",
    logout: "Logout",
    demoDataWarning: "Demo data is being displayed",
  },
  vn: {
    // Dashboard
    dashboardTitle: "Tổng quan Dashboard",
    dashboardDesc: "Đây là tổng quan các chỉ số hiện tại của bạn.",
    totalCandidates: "Tổng ứng viên",
    newApplications: "Đơn mới",
    visaProcessing: "Đang xử lý Visa",
    successRate: "Tỷ lệ thành công",
    candidatesPerMonth: "Ứng viên theo tháng",
    monthlyOverview: "Tổng quan hàng tháng về các đơn ứng tuyển",
    categoryDistribution: "Phân bổ danh mục",
    categoryDesc: "Tỷ lệ theo loại ứng viên",
    quickAccess: "Truy cập nhanh",
    quickAccessDesc: "Các chức năng thường dùng",
    recentCandidates: "Ứng viên mới nhất",
    recentDesc: "Hồ sơ vừa được thêm gần đây",
    manageInquiries: "Quản lý yêu cầu",
    candidates: "Ứng viên",
    blog: "Quản lý Blog",
    statistics: "Thống kê",
    settings: "Cài đặt",
    name: "Tên",
    category: "Danh mục",
    status: "Trạng thái",
    logout: "Đăng xuất",
    demoDataWarning: "Đang hiển thị dữ liệu demo",
  },
};
