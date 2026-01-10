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
  // Đảm bảo tất cả các trường bắt buộc được gửi đi
  return {
    // Required fields - Đảm bảo có giá trị
    full_name: formData.full_name?.trim() || "",
    email: formData.email?.trim() || "",
    category: formData.category || "skilled", // Default nếu không có
    experience_years: formData.experience_years ?? 0,
    german_level: formData.german_level || "B1", // Default nếu không có
    visa_status: formData.visa_status ?? false,
    is_featured: formData.is_featured ?? false,
    
    // Optional fields - Convert empty strings to null
    phone: formData.phone?.trim() || null,
    date_of_birth: formData.date_of_birth?.trim() || null,
    profession: formData.profession?.trim() || null,
    notes: formData.notes?.trim() || null,
    avatar_url: formData.avatar_url?.trim() || null,
    video_url: formData.video_url?.trim() || null, // YouTube video URL
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

    // Validate required fields
    if (!formData.full_name?.trim()) {
      return { success: false, error: "Name ist erforderlich." };
    }
    if (!formData.email?.trim()) {
      return { success: false, error: "E-Mail ist erforderlich." };
    }
    if (!formData.category) {
      return { success: false, error: "Kategorie ist erforderlich." };
    }

    // Sanitize data before sending to database
    const sanitizedData = sanitizeFormData(formData);

    // Log để debug (có thể xóa sau)
    console.log("Creating candidate with data:", {
      full_name: sanitizedData.full_name,
      email: sanitizedData.email,
      category: sanitizedData.category,
      phone: sanitizedData.phone,
      date_of_birth: sanitizedData.date_of_birth,
      profession: sanitizedData.profession,
      notes: sanitizedData.notes,
      experience_years: sanitizedData.experience_years,
      german_level: sanitizedData.german_level,
      visa_status: sanitizedData.visa_status,
      is_featured: sanitizedData.is_featured,
    });

    const { data, error } = await supabase
      .from("candidates")
      .insert({
        full_name: sanitizedData.full_name,
        email: sanitizedData.email,
        category: sanitizedData.category,
        phone: sanitizedData.phone,
        date_of_birth: sanitizedData.date_of_birth,
        profession: sanitizedData.profession,
        notes: sanitizedData.notes,
        experience_years: sanitizedData.experience_years,
        german_level: sanitizedData.german_level,
        visa_status: sanitizedData.visa_status,
        is_featured: sanitizedData.is_featured,
        avatar_url: sanitizedData.avatar_url,
        video_url: sanitizedData.video_url,
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

    // Build update object - chỉ cập nhật các trường có giá trị
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Chỉ thêm các trường có giá trị vào update object
    if (sanitizedData.full_name !== undefined) updateData.full_name = sanitizedData.full_name;
    if (sanitizedData.email !== undefined) updateData.email = sanitizedData.email;
    if (sanitizedData.category !== undefined) updateData.category = sanitizedData.category;
    if (sanitizedData.phone !== undefined) updateData.phone = sanitizedData.phone;
    if (sanitizedData.date_of_birth !== undefined) updateData.date_of_birth = sanitizedData.date_of_birth;
    if (sanitizedData.profession !== undefined) updateData.profession = sanitizedData.profession;
    if (sanitizedData.notes !== undefined) updateData.notes = sanitizedData.notes;
    if (sanitizedData.experience_years !== undefined) updateData.experience_years = sanitizedData.experience_years;
    if (sanitizedData.german_level !== undefined) updateData.german_level = sanitizedData.german_level;
    if (sanitizedData.visa_status !== undefined) updateData.visa_status = sanitizedData.visa_status;
    if (sanitizedData.is_featured !== undefined) updateData.is_featured = sanitizedData.is_featured;
    if (sanitizedData.avatar_url !== undefined) updateData.avatar_url = sanitizedData.avatar_url;
    if (sanitizedData.video_url !== undefined) updateData.video_url = sanitizedData.video_url;

    const { data, error } = await supabase
      .from("candidates")
      .update(updateData)
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

// ============================================
// GET FEATURED CANDIDATES (For Homepage Showcase)
// ============================================

export async function getFeaturedCandidates(): Promise<{
  data: Candidate[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // Query candidates: Ưu tiên lấy những người có is_featured = true hoặc visa_status = true
    // Nếu không có, lấy tất cả candidates mới nhất
    // Sắp xếp mới nhất trước, giới hạn tối đa 20 hồ sơ
    let { data, error } = await supabase
      .from("candidates")
      .select("*")
      .or("is_featured.eq.true,visa_status.eq.true")
      .order("created_at", { ascending: false })
      .limit(20);

    // Fallback: Nếu không có candidates featured/visa, lấy tất cả
    if (error || !data || data.length === 0) {
      const { data: allData, error: allError } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (allError) {
        console.error("Error fetching featured candidates:", allError);
        return { data: null, error: allError.message };
      }

      data = allData;
    }

    if (error && data && data.length === 0) {
      // Nếu có error nhưng không có data, log và trả về mảng rỗng
      console.warn("No featured candidates found, returning empty array");
      return { data: [], error: null };
    }

    return { data: (data || []) as Candidate[], error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    // Trả về mảng rỗng thay vì null để component có thể fallback
    return { data: [], error: null };
  }
}

