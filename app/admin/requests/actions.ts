"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { Inquiry, InquiryStatus } from "./types";

// ============================================
// FETCH ALL INQUIRIES
// ============================================

export async function getInquiries(): Promise<{
  data: Inquiry[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist, return empty array instead of error
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        console.warn("Inquiries table does not exist yet. Please create it in Supabase.");
        return { data: [], error: null };
      }
      console.error("Error fetching inquiries:", error);
      return { data: [], error: error.message };
    }

    return { data: (data || []) as Inquiry[], error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    // Return empty array instead of null to prevent crashes
    return { data: [], error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// FETCH SINGLE INQUIRY
// ============================================

export async function getInquiry(id: string): Promise<{
  data: Inquiry | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching inquiry:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Inquiry, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// ============================================
// UPDATE INQUIRY STATUS
// ============================================

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("inquiries")
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating inquiry status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/requests");
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { 
      success: false, 
      error: "Ein unerwarteter Fehler ist aufgetreten." 
    };
  }
}

// ============================================
// DELETE INQUIRY
// ============================================

export async function deleteInquiry(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting inquiry:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/requests");
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { 
      success: false, 
      error: "Ein unerwarteter Fehler ist aufgetreten." 
    };
  }
}

// ============================================
// GET NEW INQUIRIES COUNT (for badge)
// ============================================

export async function getNewInquiriesCount(): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    if (error) {
      // If table doesn't exist, return 0 (no badge)
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        return 0;
      }
      console.error("Error counting new inquiries:", error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error("Unexpected error:", err);
    return 0;
  }
}
