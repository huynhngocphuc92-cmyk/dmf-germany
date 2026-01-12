"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Upload,
  X,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  createCandidate,
  updateCandidate,
  uploadAvatar,
  deleteAvatar,
} from "@/app/admin/candidates/actions";
import type {
  Candidate,
  CandidateFormData,
  CandidateCategory,
  GermanLevel,
} from "@/app/admin/candidates/types";
import {
  categoryLabels,
  germanLevels,
} from "@/app/admin/candidates/types";

// ============================================
// COMPONENT PROPS
// ============================================

interface CandidateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate | null;
  onSuccess?: () => void;
}

// ============================================
// CANDIDATE FORM COMPONENT
// ============================================

export function CandidateForm({
  open,
  onOpenChange,
  candidate,
  onSuccess,
}: CandidateFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!candidate;

  // Form state
  const [formData, setFormData] = useState<CandidateFormData>({
    full_name: candidate?.full_name || "",
    email: candidate?.email || "",
    phone: candidate?.phone || "",
    date_of_birth: candidate?.date_of_birth || "",
    category: candidate?.category || "skilled",
    profession: candidate?.profession || "",
    experience_years: candidate?.experience_years || 0,
    german_level: candidate?.german_level || "B1",
    visa_status: candidate?.visa_status ?? false,
    is_featured: candidate?.is_featured ?? false,
    notes: candidate?.notes || "",
    avatar_url: candidate?.avatar_url || "",
    video_url: candidate?.video_url || "",
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form when candidate changes
  const resetForm = () => {
    setFormData({
      full_name: candidate?.full_name || "",
      email: candidate?.email || "",
      phone: candidate?.phone || "",
      date_of_birth: candidate?.date_of_birth || "",
      category: candidate?.category || "skilled",
      profession: candidate?.profession || "",
      experience_years: candidate?.experience_years || 0,
      german_level: candidate?.german_level || "B1",
      visa_status: candidate?.visa_status ?? false,
      is_featured: candidate?.is_featured ?? false,
      notes: candidate?.notes || "",
      avatar_url: candidate?.avatar_url || "",
      video_url: candidate?.video_url || "",
    });
    setError(null);
    setSuccess(false);
  };

  // Handle input change
  const handleChange = (
    field: keyof CandidateFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Nur JPG, PNG und WebP Dateien sind erlaubt.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Die Datei darf maximal 5MB groß sein.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const result = await uploadAvatar(uploadFormData);

      if (result.success && result.url) {
        // Delete old avatar if exists
        if (formData.avatar_url) {
          await deleteAvatar(formData.avatar_url);
        }
        setFormData((prev) => ({ ...prev, avatar_url: result.url! }));
      } else {
        setError(result.error || "Upload fehlgeschlagen.");
      }
    } catch {
      setError("Ein Fehler ist beim Upload aufgetreten.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle avatar remove
  const handleRemoveAvatar = async () => {
    if (!formData.avatar_url) return;

    setIsUploading(true);
    try {
      await deleteAvatar(formData.avatar_url);
      setFormData((prev) => ({ ...prev, avatar_url: "" }));
    } catch {
      setError("Fehler beim Löschen des Bildes.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        setError("Bitte geben Sie einen Namen ein.");
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.trim()) {
        setError("Bitte geben Sie eine E-Mail ein.");
        setIsSubmitting(false);
        return;
      }

      let result;
      if (isEditing && candidate) {
        result = await updateCandidate(candidate.id, formData);
      } else {
        result = await createCandidate(formData);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          onSuccess?.();
          router.refresh();
          resetForm();
        }, 1000);
      } else {
        setError(result.error || "Ein Fehler ist aufgetreten.");
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {isEditing ? "Kandidat bearbeiten" : "Neuer Kandidat"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Aktualisieren Sie die Informationen des Kandidaten."
              : "Fügen Sie einen neuen Kandidaten hinzu."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                {isEditing ? "Kandidat aktualisiert!" : "Kandidat erstellt!"}
              </p>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label>Profilbild</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                {formData.avatar_url ? (
                  <>
                    <img
                      src={formData.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploading}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Bild hochladen"}
                </Button>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG oder WebP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Nguyen Van A"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="kandidat@example.com"
              required
            />
          </div>

          {/* Phone & Date of Birth Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+84 123 456 789"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Geburtsdatum</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Category & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>Kategorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  handleChange("category", value as CandidateCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as CandidateCategory[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {categoryLabels[key]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Visa Status */}
            <div className="space-y-2">
              <Label>Visa Status</Label>
              <Select
                value={formData.visa_status ? "true" : "false"}
                onValueChange={(value) =>
                  handleChange("visa_status", value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Visa Vorhanden</SelectItem>
                  <SelectItem value="false">In Bearbeitung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Is Featured */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_featured">Als Featured markieren</Label>
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
            </div>
            <p className="text-xs text-slate-500">
              Featured Kandidaten werden auf der Startseite angezeigt
            </p>
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="profession">Beruf</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => handleChange("profession", e.target.value)}
              placeholder="z.B. Pflegefachkraft, Ingenieur"
            />
          </div>

          {/* Experience & German Level Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Experience Years */}
            <div className="space-y-2">
              <Label htmlFor="experience_years">Erfahrung (Jahre)</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                max="50"
                value={formData.experience_years}
                onChange={(e) =>
                  handleChange("experience_years", parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* German Level */}
            <div className="space-y-2">
              <Label>Deutschniveau *</Label>
              <Select
                value={formData.german_level}
                onValueChange={(value) =>
                  handleChange("german_level", value as GermanLevel)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {germanLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video_url">Video-Link (YouTube)</Label>
            <Input
              id="video_url"
              type="url"
              value={formData.video_url}
              onChange={(e) => handleChange("video_url", e.target.value)}
              placeholder="https://youtu.be/... hoặc https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-slate-500">
              YouTube-Link für das Einführungsvideo des Kandidaten (optional)
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Zusätzliche Informationen..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Speichern...
                </>
              ) : isEditing ? (
                "Aktualisieren"
              ) : (
                "Erstellen"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

