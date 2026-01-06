// ============================================
// SITE CONFIG / THEME TYPES
// ============================================

// Database section names (from site_assets table)
export type DatabaseSection = 
  | "branding"      // Nhận diện
  | "home"          // Trang Chủ
  | "contact"       // Liên Hệ
  | "settings";     // Cài Đặt

// UI Tab names (for display)
export type ThemeSection = 
  | "identity"      // Nhận diện (maps to "branding" in DB)
  | "home"          // Trang Chủ
  | "header_footer" // Header & Footer (maps to "branding" in DB)
  | "contact"       // Liên Hệ
  | "system";       // Cài Đặt (maps to "settings" in DB)

export type AssetType = 
  | "image"
  | "color"
  | "text"
  | "boolean";

export interface SiteConfigItem {
  key: string;           // Primary key, e.g., 'home_hero_bg', 'primary_color'
  asset_type: AssetType; // Type of asset: image, color, text, boolean
  value: string | null;  // Main value field (site_assets table uses this column)
  image_url?: string | null; // Deprecated: Only for backward compatibility in UI, not in DB
  label: string;         // Display label, e.g., 'Hero Banner', 'Primary Color'
  description: string | null;
  section: DatabaseSection | ThemeSection; // Can be either DB section or UI section
  created_at?: string;
  updated_at?: string;
}

export interface SiteConfigGrouped {
  [section: string]: SiteConfigItem[];
}

// ============================================
// UI LABELS (Bilingual)
// ============================================

export type ThemeLanguage = "de" | "vn";

export const sectionLabelsI18n: Record<ThemeSection, Record<ThemeLanguage, string>> = {
  identity: { de: "Nhận diện", vn: "Nhận diện" },
  home: { de: "Trang Chủ", vn: "Trang chủ" },
  header_footer: { de: "Header & Footer", vn: "Header & Footer" },
  contact: { de: "Liên Hệ", vn: "Liên hệ" },
  system: { de: "Cài Đặt", vn: "Cài đặt" },
};

export const themeTranslations = {
  de: {
    pageTitle: "Giao diện Manager",
    pageDesc: "Quản lý toàn diện giao diện và cấu hình website.",
    uploadImage: "Bild hochladen",
    uploading: "Wird hochgeladen...",
    uploadSuccess: "Erfolgreich aktualisiert!",
    uploadError: "Fehler beim Speichern.",
    currentImage: "Aktuelles Bild",
    noImage: "Kein Bild vorhanden",
    changeImage: "Bild ändern",
    removeImage: "Bild entfernen",
    preview: "Vorschau",
    section: "Bereich",
    key: "Schlüssel",
    description: "Beschreibung",
    lastUpdated: "Zuletzt aktualisiert",
    selectImage: "Bild auswählen",
    dragDrop: "Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen",
    maxSize: "Maximale Größe: 5MB",
    supportedFormats: "Unterstützte Formate: JPG, PNG, WebP",
    saving: "Speichern...",
    saved: "Gespeichert!",
    selectColor: "Farbe auswählen",
    enterText: "Text eingeben",
    enterUrl: "URL eingeben",
    toggleOn: "Ein",
    toggleOff: "Aus",
  },
  vn: {
    pageTitle: "Quản lý Giao diện",
    pageDesc: "Quản lý toàn diện giao diện và cấu hình website.",
    uploadImage: "Tải ảnh lên",
    uploading: "Đang tải...",
    uploadSuccess: "Cập nhật thành công!",
    uploadError: "Lỗi khi lưu.",
    currentImage: "Ảnh hiện tại",
    noImage: "Chưa có ảnh",
    changeImage: "Đổi ảnh",
    removeImage: "Xóa ảnh",
    preview: "Xem trước",
    section: "Khu vực",
    key: "Khóa",
    description: "Mô tả",
    lastUpdated: "Cập nhật lần cuối",
    selectImage: "Chọn ảnh",
    dragDrop: "Kéo thả ảnh vào đây hoặc click để chọn",
    maxSize: "Dung lượng tối đa: 5MB",
    supportedFormats: "Định dạng hỗ trợ: JPG, PNG, WebP",
    saving: "Đang lưu...",
    saved: "Đã lưu!",
    selectColor: "Chọn màu",
    enterText: "Nhập văn bản",
    enterUrl: "Nhập URL",
    toggleOn: "Bật",
    toggleOff: "Tắt",
  },
};

