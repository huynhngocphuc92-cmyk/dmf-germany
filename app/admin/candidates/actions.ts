"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
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

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .single();

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

// ============================================
// HELPER: Sanitize form data for PostgreSQL
// ============================================

function sanitizeFormData(formData: CandidateFormData | Partial<CandidateFormData>) {
  return {
    ...formData,
    // Convert empty strings to null for DATE fields
    date_of_birth: formData.date_of_birth?.trim() || null,
    // Convert empty strings to null for optional TEXT fields
    phone: formData.phone?.trim() || null,
    profession: formData.profession?.trim() || null,
    notes: formData.notes?.trim() || null,
    avatar_url: formData.avatar_url?.trim() || null,
  };
}

// ============================================
// CREATE CANDIDATE
// ============================================

export async function createCandidate(
  formData: CandidateFormData
): Promise<{ success: boolean; error: string | null; data?: Candidate }> {
  try {
    const supabase = await createClient();

    // Sanitize data before sending to database
    const sanitizedData = sanitizeFormData(formData);

    const { data, error } = await supabase
      .from("candidates")
      .insert({
        ...sanitizedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating candidate:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/candidates");
    return { success: true, error: null, data: data as Candidate };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// UPDATE CANDIDATE
// ============================================

export async function updateCandidate(
  id: string,
  formData: Partial<CandidateFormData>
): Promise<{ success: boolean; error: string | null; data?: Candidate }> {
  try {
    const supabase = await createClient();

    // Sanitize data before sending to database
    const sanitizedData = sanitizeFormData(formData);

    const { data, error } = await supabase
      .from("candidates")
      .update({
        ...sanitizedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating candidate:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/candidates");
    return { success: true, error: null, data: data as Candidate };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// DELETE CANDIDATE
// ============================================

export async function deleteCandidate(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
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

    revalidatePath("/admin/candidates");
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
    const supabase = await createClient();

    // Extract filename from URL
    const fileName = url.split("/").pop();
    if (!fileName) {
      return { success: false, error: "Ungültige URL." };
    }

    const { error } = await supabase.storage
      .from("candidates")
      .remove([fileName]);

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

