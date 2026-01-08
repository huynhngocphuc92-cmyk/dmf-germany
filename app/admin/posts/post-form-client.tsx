"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Upload,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import type { Post, PostFormData, AdminLanguage } from "./types";
import { postTranslations, generateSlug } from "./types";
import { createPost, updatePost, uploadCoverImage, deleteCoverImage } from "./actions";

// ============================================
// TYPES
// ============================================

interface PostFormClientProps {
  mode: "create" | "edit";
  initialPost?: Post;
}

// ============================================
// POST FORM CLIENT COMPONENT
// ============================================

export function PostFormClient({ mode, initialPost }: PostFormClientProps) {
  const router = useRouter();
  const { lang: currentLang } = useLanguage();
  const lang = currentLang as AdminLanguage;
  const t = postTranslations[lang];

  // Form state
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(initialPost?.cover_image || "");
  const [isPublished, setIsPublished] = useState(initialPost?.status === "published");
  const [metaTitle, setMetaTitle] = useState(initialPost?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.meta_description || "");
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title (only if not manually edited)
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugEdited]);

  // Handle slug manual edit
  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlug(generateSlug(value));
  };

  // Handle cover image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(lang === "vn" ? "Vui lòng chọn file ảnh" : "Bitte wählen Sie eine Bilddatei");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(lang === "vn" ? "File quá lớn (tối đa 5MB)" : "Datei zu groß (max 5MB)");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const { url, error: uploadError } = await uploadCoverImage(formData);
      
      if (uploadError) {
        setError(uploadError);
      } else if (url) {
        // Delete old image if exists
        if (coverImage) {
          await deleteCoverImage(coverImage);
        }
        setCoverImage(url);
      }
    } catch (err) {
      setError(lang === "vn" ? "Lỗi tải ảnh" : "Fehler beim Hochladen");
    }

    setIsUploading(false);
  };

  // Remove cover image
  const handleRemoveImage = async () => {
    if (coverImage) {
      await deleteCoverImage(coverImage);
      setCoverImage("");
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!title.trim()) {
      setError(lang === "vn" ? "Vui lòng nhập tiêu đề" : "Bitte geben Sie einen Titel ein");
      return;
    }
    if (!content.trim()) {
      setError(lang === "vn" ? "Vui lòng nhập nội dung" : "Bitte geben Sie Inhalt ein");
      return;
    }

    setIsSaving(true);
    setError(null);

    const formData: PostFormData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content,
      cover_image: coverImage || undefined,
      status: isPublished ? "published" : "draft",
      meta_title: metaTitle.trim() || undefined,
      meta_description: metaDescription.trim() || undefined,
    };

    try {
      let result;
      
      if (mode === "create") {
        result = await createPost(formData);
      } else if (initialPost) {
        result = await updatePost(initialPost.id, formData);
      }

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (err) {
      setError(t.saveError);
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === "create" ? t.createTitle : t.editTitle}
            </h1>
            <p className="text-slate-500">{t.formBack}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Preview Button (only for published) */}
          {mode === "edit" && initialPost?.status === "published" && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${initialPost.slug}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                {lang === "vn" ? "Xem" : "Ansehen"}
              </Link>
            </Button>
          )}
          
          {/* Save Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.formSaving}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t.formSave}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    {t.formTitle} *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.formTitlePlaceholder}
                    className="mt-1.5 text-lg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug" className="text-sm font-medium">
                    {t.formSlug}
                  </Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-slate-500 text-sm">/blog/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder={t.formSlugPlaceholder}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t.formContent} *</CardTitle>
              </CardHeader>
              <CardContent>
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  placeholder={t.formContentPlaceholder}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Publish Status */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {lang === "vn" ? "Xuất bản" : "Veröffentlichen"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{t.formPublish}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isPublished 
                        ? (lang === "vn" ? "Bài viết sẽ hiển thị công khai" : "Öffentlich sichtbar")
                        : (lang === "vn" ? "Chỉ lưu nháp" : "Nur Entwurf")
                      }
                    </p>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t.formCoverImage}</CardTitle>
              </CardHeader>
              <CardContent>
                {coverImage ? (
                  <div className="relative">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      width={400}
                      height={200}
                      className="w-full h-36 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-7 h-7"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                        <span className="text-sm text-slate-500">{t.formUploading}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">{t.formUpload}</span>
                        <span className="text-xs text-slate-400 mt-1">
                          JPG, PNG, GIF (max 5MB)
                        </span>
                      </>
                    )}
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t.formExcerpt}</CardTitle>
                <CardDescription className="text-xs">
                  {lang === "vn" 
                    ? "Hiển thị trong danh sách bài viết" 
                    : "Wird in der Liste angezeigt"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder={t.formExcerptPlaceholder}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="metaTitle" className="text-xs">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title || "Meta Title"}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDesc" className="text-xs">Meta Description</Label>
                  <Textarea
                    id="metaDesc"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder={excerpt || "Meta Description"}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
