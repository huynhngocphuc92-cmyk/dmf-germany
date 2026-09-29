"use server";

import { z } from "zod";
import {
  candidateFormSchema,
  publicationReviewSchema,
  type PublicationReviewData,
} from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";
import { createAdminClient as createClient } from "@/lib/auth/admin";
import type { CandidateFormData, Candidate } from "./types";

// ============================================
// FETCH ALL CANDIDATES
// ============================================

export async function getCandidates(): Promise<{
  data: Candidate[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Candidate[], error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// FETCH SINGLE CANDIDATE
// ============================================

export async function getCandidate(id: string): Promise<{
  data: Candidate | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("candidates").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching candidate:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Candidate, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

function invalidateCandidates(id?: string) {
  revalidatePath("/admin/candidates");
  if (id) revalidatePath(`/admin/candidates/${id}/preview`);
  revalidatePath("/");
  revalidatePath("/fuer-arbeitgeber/kandidaten");
  revalidatePath("/sitemap.xml");
}

function normalizeCandidate(data: Partial<CandidateFormData>) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() || null : value,
    ])
  );
}

export async function createCandidate(
  formData: CandidateFormData
): Promise<{ success: boolean; error: string | null; data?: Candidate }> {
  try {
    const supabase = await createClient();
    const parsed = candidateFormSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    const { data, error } = await supabase
      .from("candidates")
      .insert({
        ...normalizeCandidate(parsed.data),
        publication_status: "draft",
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return { success: false, error: "Profil konnte nicht gespeichert werden." };
    invalidateCandidates(data.id);
    return { success: true, error: null, data: data as Candidate };
  } catch {
    return { success: false, error: "Profil konnte nicht gespeichert werden." };
  }
}

export async function updateCandidate(
  id: string,
  formData: Partial<CandidateFormData>
): Promise<{ success: boolean; error: string | null; data?: Candidate }> {
  try {
    const supabase = await createClient();
    const parsed = candidateFormSchema.partial().safeParse(formData);
    if (!z.string().uuid().safeParse(id).success || !parsed.success)
      return { success: false, error: "Bitte Profildaten prüfen." };
    const { data, error } = await supabase
      .from("candidates")
      .update({ ...normalizeCandidate(parsed.data), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) return { success: false, error: "Profil konnte nicht gespeichert werden." };
    invalidateCandidates(id);
    return { success: true, error: null, data: data as Candidate };
  } catch {
    return { success: false, error: "Profil konnte nicht gespeichert werden." };
  }
}

export async function publishCandidate(
  id: string,
  input: PublicationReviewData
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();
    const parsed = publicationReviewSchema.safeParse(input);
    if (!z.string().uuid().safeParse(id).success || !parsed.success)
      return { error: "Bitte Einwilligung und Gültigkeit vollständig prüfen." };
    const { error, data } = await supabase
      .from("candidates")
      .update({
        publication_status: "published",
        publication_valid_until: parsed.data.valid_until,
        publication_consent_note: parsed.data.consent_note,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("updated_at", parsed.data.expected_updated_at)
      .select("id")
      .single();
    if (error || !data)
      return {
        error:
          "Freigabe nicht möglich. Profil neu laden und Angaben, Musterinhalte sowie Einwilligung prüfen.",
      };
    invalidateCandidates(id);
    return { error: null };
  } catch {
    return { error: "Freigabe fehlgeschlagen." };
  }
}

export async function unpublishCandidate(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();
    if (!z.string().uuid().safeParse(id).success) return { error: "Ungültiges Profil." };
    const { error } = await supabase
      .from("candidates")
      .update({ publication_status: "draft", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: "Zurückziehen fehlgeschlagen." };
    invalidateCandidates(id);
    return { error: null };
  } catch {
    return { error: "Zurückziehen fehlgeschlagen." };
  }
}

// ============================================
// DELETE CANDIDATE
// ============================================

export async function deleteCandidate(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Verify authentication before any mutation
    const supabase = await createClient();

    // First, get the candidate to check for avatar
    const { data: candidate } = await supabase
      .from("candidates")
      .select("avatar_url")
      .eq("id", id)
      .single();

    // Delete avatar from storage if exists
    if (candidate?.avatar_url) {
      const avatarPath = candidate.avatar_url.split("/").pop();
      if (avatarPath) {
        await supabase.storage.from("candidates").remove([avatarPath]);
      }
    }

    // Delete the candidate
    const { error } = await supabase.from("candidates").delete().eq("id", id);

    if (error) {
      console.error("Error deleting candidate:", error);
      return { success: false, error: error.message };
    }

    invalidateCandidates(id);
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// UPLOAD AVATAR
// ============================================

export async function uploadAvatar(
  formData: FormData
): Promise<{ success: boolean; error: string | null; url?: string }> {
  try {
    // Verify authentication before any mutation
    const supabase = await createClient();

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Keine Datei ausgewählt." };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Nur JPG, PNG und WebP Dateien sind erlaubt.",
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Die Datei darf maximal 5MB groß sein.",
      };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("candidates")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("candidates").getPublicUrl(fileName);

    return { success: true, error: null, url: publicUrl };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// DELETE AVATAR
// ============================================

export async function deleteAvatar(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Verify authentication before any mutation
    const supabase = await createClient();

    // Extract filename from URL
    const fileName = url.split("/").pop();
    if (!fileName) {
      return { success: false, error: "Ungültige URL." };
    }

    const { error } = await supabase.storage.from("candidates").remove([fileName]);

    if (error) {
      console.error("Error deleting avatar:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}
