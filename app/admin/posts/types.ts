// ============================================
// POST TYPES
// ============================================

export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  created_at: string;
  updated_at: string;

  // Content
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;

  // Meta
  status: PostStatus;
  published_at?: string;
  author_id?: string;

  // SEO
  meta_title?: string;
  meta_description?: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  status: PostStatus;
  meta_title?: string;
  meta_description?: string;
}

// ============================================
// UI HELPERS
// ============================================

export type AdminLanguage = "de" | "en" | "vn";

export const statusLabelsI18n: Record<PostStatus, Record<AdminLanguage, string>> = {
  draft: { de: "Entwurf", en: "Draft", vn: "Bản nháp" },
  published: { de: "Veröffentlicht", en: "Published", vn: "Đã xuất bản" },
};

export const statusColors: Record<PostStatus, string> = {
  draft: "bg-amber-100 text-amber-700 border-amber-200",
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// ============================================
// ADMIN TRANSLATIONS
// ============================================

export const postTranslations = {
  de: {
    // List page
    pageTitle: "Beiträge verwalten",
    pageDesc: "Erstellen und verwalten Sie Blogbeiträge",
    newPost: "Neuer Beitrag",
    title: "Titel",
    status: "Status",
    createdAt: "Erstellt am",
    actions: "Aktionen",
    edit: "Bearbeiten",
    delete: "Löschen",
    deleteConfirm: "Möchten Sie diesen Beitrag wirklich löschen?",
    deleteDesc: "Diese Aktion kann nicht rückgängig gemacht werden.",
    cancel: "Abbrechen",
    noPosts: "Noch keine Beiträge vorhanden.",

    // Form page
    createTitle: "Neuen Beitrag erstellen",
    editTitle: "Beitrag bearbeiten",
    formTitle: "Titel",
    formTitlePlaceholder: "Geben Sie den Titel ein...",
    formSlug: "URL-Slug",
    formSlugPlaceholder: "url-slug-hier",
    formExcerpt: "Kurzbeschreibung",
    formExcerptPlaceholder: "Eine kurze Zusammenfassung...",
    formCoverImage: "Titelbild",
    formUpload: "Bild hochladen",
    formUploading: "Wird hochgeladen...",
    formContent: "Inhalt",
    formContentPlaceholder: "Schreiben Sie Ihren Beitrag...",
    formPublish: "Veröffentlichen",
    formSave: "Speichern",
    formSaving: "Wird gespeichert...",
    formBack: "Zurück zur Liste",

    // Messages
    saveSuccess: "Beitrag erfolgreich gespeichert",
    saveError: "Fehler beim Speichern",
    deleteSuccess: "Beitrag erfolgreich gelöscht",
    deleteError: "Fehler beim Löschen",
  },
  en: {
    // List page
    pageTitle: "Manage Posts",
    pageDesc: "Create and manage blog posts",
    newPost: "New Post",
    title: "Title",
    status: "Status",
    createdAt: "Created At",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this post?",
    deleteDesc: "This action cannot be undone.",
    cancel: "Cancel",
    noPosts: "No posts yet.",

    // Form page
    createTitle: "Create New Post",
    editTitle: "Edit Post",
    formTitle: "Title",
    formTitlePlaceholder: "Enter the title...",
    formSlug: "URL Slug",
    formSlugPlaceholder: "url-slug-here",
    formExcerpt: "Excerpt",
    formExcerptPlaceholder: "A short summary...",
    formCoverImage: "Cover Image",
    formUpload: "Upload Image",
    formUploading: "Uploading...",
    formContent: "Content",
    formContentPlaceholder: "Write your post...",
    formPublish: "Publish",
    formSave: "Save",
    formSaving: "Saving...",
    formBack: "Back to List",

    // Messages
    saveSuccess: "Post saved successfully",
    saveError: "Error saving post",
    deleteSuccess: "Post deleted successfully",
    deleteError: "Error deleting post",
  },
  vn: {
    // List page
    pageTitle: "Quản lý bài viết",
    pageDesc: "Tạo và quản lý các bài viết blog",
    newPost: "Bài viết mới",
    title: "Tiêu đề",
    status: "Trạng thái",
    createdAt: "Ngày tạo",
    actions: "Thao tác",
    edit: "Sửa",
    delete: "Xóa",
    deleteConfirm: "Bạn có chắc muốn xóa bài viết này?",
    deleteDesc: "Hành động này không thể hoàn tác.",
    cancel: "Hủy",
    noPosts: "Chưa có bài viết nào.",

    // Form page
    createTitle: "Tạo bài viết mới",
    editTitle: "Chỉnh sửa bài viết",
    formTitle: "Tiêu đề",
    formTitlePlaceholder: "Nhập tiêu đề bài viết...",
    formSlug: "Đường dẫn (Slug)",
    formSlugPlaceholder: "duong-dan-bai-viet",
    formExcerpt: "Mô tả ngắn",
    formExcerptPlaceholder: "Tóm tắt ngắn gọn về bài viết...",
    formCoverImage: "Ảnh bìa",
    formUpload: "Tải ảnh lên",
    formUploading: "Đang tải lên...",
    formContent: "Nội dung",
    formContentPlaceholder: "Viết nội dung bài viết...",
    formPublish: "Xuất bản",
    formSave: "Lưu",
    formSaving: "Đang lưu...",
    formBack: "Quay lại danh sách",

    // Messages
    saveSuccess: "Đã lưu bài viết thành công",
    saveError: "Lỗi khi lưu bài viết",
    deleteSuccess: "Đã xóa bài viết thành công",
    deleteError: "Lỗi khi xóa bài viết",
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate slug from title
 * "Tin Tức Mới Nhất" -> "tin-tuc-moi-nhat"
 */
export function generateSlug(title: string): string {
  // Vietnamese character map
  const vietnameseMap: Record<string, string> = {
    à: "a",
    á: "a",
    ạ: "a",
    ả: "a",
    ã: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ậ: "a",
    ẩ: "a",
    ẫ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ặ: "a",
    ẳ: "a",
    ẵ: "a",
    è: "e",
    é: "e",
    ẹ: "e",
    ẻ: "e",
    ẽ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ệ: "e",
    ể: "e",
    ễ: "e",
    ì: "i",
    í: "i",
    ị: "i",
    ỉ: "i",
    ĩ: "i",
    ò: "o",
    ó: "o",
    ọ: "o",
    ỏ: "o",
    õ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ộ: "o",
    ổ: "o",
    ỗ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ợ: "o",
    ở: "o",
    ỡ: "o",
    ù: "u",
    ú: "u",
    ụ: "u",
    ủ: "u",
    ũ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ự: "u",
    ử: "u",
    ữ: "u",
    ỳ: "y",
    ý: "y",
    ỵ: "y",
    ỷ: "y",
    ỹ: "y",
    đ: "d",
    À: "A",
    Á: "A",
    Ạ: "A",
    Ả: "A",
    Ã: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ậ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ặ: "A",
    Ẳ: "A",
    Ẵ: "A",
    È: "E",
    É: "E",
    Ẹ: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ệ: "E",
    Ể: "E",
    Ễ: "E",
    Ì: "I",
    Í: "I",
    Ị: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ò: "O",
    Ó: "O",
    Ọ: "O",
    Ỏ: "O",
    Õ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ộ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ợ: "O",
    Ở: "O",
    Ỡ: "O",
    Ù: "U",
    Ú: "U",
    Ụ: "U",
    Ủ: "U",
    Ũ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ự: "U",
    Ử: "U",
    Ữ: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỵ: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Đ: "D",
    ß: "ss",
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
  };

  let slug = title.toLowerCase();

  // Replace Vietnamese/German characters
  for (const [char, replacement] of Object.entries(vietnameseMap)) {
    slug = slug.split(char.toLowerCase()).join(replacement.toLowerCase());
  }

  // Replace spaces and special chars with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  return slug;
}
