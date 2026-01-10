// ============================================
// INQUIRY TYPES
// ============================================

export type InquiryStatus = "new" | "in_progress" | "completed";
export type InquiryType = "contact" | "profile";

export interface Inquiry {
  id: string;
  client_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  type: InquiryType;
  status: InquiryStatus;
  candidate_code?: string | null;
  candidate_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryFormData {
  client_name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  type: InquiryType;
  candidate_code?: string;
  candidate_id?: string;
}

// Status labels
export const statusLabels: Record<InquiryStatus, { de: string; vn: string }> = {
  new: { de: "Neu", vn: "Mới" },
  in_progress: { de: "In Bearbeitung", vn: "Đang xử lý" },
  completed: { de: "Abgeschlossen", vn: "Hoàn thành" },
};

// Status colors for badges
export const statusColors: Record<InquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-green-100 text-green-700 border-green-200",
};

// Type labels
export const typeLabels: Record<InquiryType, { de: string; vn: string }> = {
  contact: { de: "Kontakt", vn: "Liên hệ" },
  profile: { de: "Profil-Anfrage", vn: "Hồ sơ" },
};

// Type colors for badges
export const typeColors: Record<InquiryType, string> = {
  contact: "bg-indigo-100 text-indigo-700 border-indigo-200",
  profile: "bg-purple-100 text-purple-700 border-purple-200",
};
