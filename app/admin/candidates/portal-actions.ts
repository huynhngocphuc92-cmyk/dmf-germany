"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { signStudentDocumentUrls, signStudentVideoUrl } from "@/lib/portal/storage";
import { PROGRAM_TRACK_CONFIG } from "@/lib/portal/types";
import type {
  DocumentVerificationStatus,
  PortalSyncStatus,
  ProgramTrack,
  StudentDocument,
  StudentInviteCode,
  StudentMotivationLetter,
  StudentProfile,
} from "@/lib/portal/types";

export async function getAdminPortalOverview(): Promise<{
  profiles: StudentProfile[];
  documents: StudentDocument[];
  letters: StudentMotivationLetter[];
  inviteCodes: StudentInviteCode[];
}> {
  try {
    const { supabase } = await requireAdmin();
    const [profilesRes, docsRes, lettersRes, codesRes] = await Promise.all([
      supabase.from("student_profiles").select("*").order("updated_at", { ascending: false }),
      supabase.from("student_documents").select("*").order("created_at", { ascending: false }),
      supabase
        .from("student_motivation_letters")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("student_invite_codes").select("*").order("created_at", { ascending: false }),
    ]);

    // Bucket student-documents là private: ký lại URL ngắn hạn trước khi trả về.
    const documents = await signStudentDocumentUrls(
      supabase,
      (docsRes.data as StudentDocument[]) || []
    );
    const profiles = await Promise.all(
      ((profilesRes.data as StudentProfile[]) || []).map(async (profile) => ({
        ...profile,
        video_url: await signStudentVideoUrl(supabase, profile.video_url),
      }))
    );

    return {
      profiles,
      documents,
      letters: (lettersRes.data as StudentMotivationLetter[]) || [],
      inviteCodes: (codesRes.data as StudentInviteCode[]) || [],
    };
  } catch {
    return {
      profiles: [],
      documents: [],
      letters: [],
      inviteCodes: [],
    };
  }
}

export async function createStudentInviteCodeAction(input: {
  code: string;
  description?: string;
  program_track?: ProgramTrack | null;
  max_uses: number;
}): Promise<{ success: boolean; error: string | null; data?: StudentInviteCode }> {
  try {
    const { supabase, user } = await requireAdmin();
    const cleanCode = input.code.trim().toUpperCase();
    if (cleanCode.length < 8 || cleanCode.length > 40) {
      return { success: false, error: "Mã học viên phải từ 8 đến 40 ký tự." };
    }

    const { data, error } = await supabase
      .from("student_invite_codes")
      .insert({
        code: cleanCode,
        description: input.description?.trim() || null,
        program_track: input.program_track || null,
        max_uses: Math.max(1, input.max_uses || 20),
        created_by: user.id,
      })
      .select("*")
      .single();

    if (error) {
      return { success: false, error: "Không thể tạo mã (có thể mã đã tồn tại)." };
    }

    revalidatePath("/admin/candidates");
    return { success: true, error: null, data: data as StudentInviteCode };
  } catch {
    return { success: false, error: "Lỗi xác thực quyền Admin." };
  }
}

export async function toggleStudentAiAccessAction(
  profileId: string,
  enabled: boolean
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("student_profiles")
      .update({ ai_enabled: enabled, updated_at: new Date().toISOString() })
      .eq("id", profileId);

    if (error) return { success: false, error: "Không thể cập nhật quyền AI." };
    revalidatePath("/admin/candidates");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Lỗi phân quyền Admin." };
  }
}

export async function reviewStudentDocumentAction(params: {
  documentId: string;
  status: DocumentVerificationStatus;
  reviewerNote?: string;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const { supabase, user } = await requireAdmin();
    const { error } = await supabase
      .from("student_documents")
      .update({
        status: params.status,
        reviewer_note: params.reviewerNote?.trim() || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", params.documentId);

    if (error) return { success: false, error: "Không thể cập nhật trạng thái giấy tờ." };
    revalidatePath("/admin/candidates");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Lỗi phân quyền Admin." };
  }
}

/**
 * Staged Sync: Duyệt hồ sơ từ Cổng Học Viên (/portal) và đồng bộ sang bảng public.candidates (B2B)
 */
export async function syncStudentProfileToB2BCandidateAction(params: {
  profileId: string;
  syncStatus: PortalSyncStatus;
  adminFeedback?: string;
}): Promise<{
  success: boolean;
  error: string | null;
  candidateId?: string;
}> {
  try {
    const { supabase, user } = await requireAdmin();

    const { data: studentProfile, error: fetchErr } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", params.profileId)
      .single();

    if (fetchErr || !studentProfile) {
      return { success: false, error: "Không tìm thấy hồ sơ học viên." };
    }

    const sp = studentProfile as StudentProfile;
    let linkedCandidateId = sp.candidate_id;

    if (params.syncStatus === "approved") {
      const mappedCategory = PROGRAM_TRACK_CONFIG[sp.program_track]?.candidateCategory || "azubi";
      const dsgvoNote = sp.dsgvo_consent_accepted
        ? `Elektronische DSGVO-Einwilligung im DMF Bewerberportal unterzeichnet am ${new Date(
            sp.dsgvo_consent_signed_at || sp.updated_at
          ).toLocaleDateString("de-DE")} in ${sp.signature_place || "Vietnam"} (Reisepass: ${
            sp.passport_number || "geprüft"
          }).`
        : null;

      // Check if candidate already exists by ID or email
      if (!linkedCandidateId && sp.email) {
        const { data: byEmail } = await supabase
          .from("candidates")
          .select("id")
          .ilike("email", sp.email)
          .maybeSingle();
        if (byEmail?.id) {
          linkedCandidateId = byEmail.id;
        }
      }

      const candidatePayload = {
        full_name: sp.full_name || "Bewerber DMF",
        email: sp.email,
        phone: sp.phone || null,
        date_of_birth: sp.date_of_birth || null,
        category: mappedCategory,
        profession:
          sp.target_profession || PROGRAM_TRACK_CONFIG[sp.program_track]?.labelDe || "Fachkraft",
        experience_years: sp.experience_years || 0,
        german_level: sp.german_level || "B1",
        avatar_url: sp.avatar_url || null,
        video_url: sp.video_url || null,
        ...(dsgvoNote ? { publication_consent_note: dsgvoNote } : {}),
        updated_at: new Date().toISOString(),
      };

      if (linkedCandidateId) {
        const { error: updErr } = await supabase
          .from("candidates")
          .update(candidatePayload)
          .eq("id", linkedCandidateId);
        if (updErr) {
          return {
            success: false,
            error: "Không thể đồng bộ sang bảng Candidates B2B: " + updErr.message,
          };
        }
      } else {
        const { data: createdCandidate, error: insErr } = await supabase
          .from("candidates")
          .insert({
            ...candidatePayload,
            visa_status: false,
            is_featured: false,
            publication_status: "draft",
          })
          .select("id")
          .single();

        if (insErr || !createdCandidate) {
          return {
            success: false,
            error: "Không thể tạo mới hồ sơ Candidate B2B.",
          };
        }
        linkedCandidateId = createdCandidate.id;
      }
    }

    const { error: profileUpdErr } = await supabase
      .from("student_profiles")
      .update({
        candidate_id: linkedCandidateId,
        sync_status: params.syncStatus,
        admin_feedback: params.adminFeedback?.trim() || null,
        last_synced_at: new Date().toISOString(),
        last_synced_by: user.id,
      })
      .eq("id", sp.id);

    if (profileUpdErr) {
      return { success: false, error: "Không thể cập nhật trạng thái duyệt hồ sơ học viên." };
    }

    revalidatePath("/admin/candidates");
    if (linkedCandidateId) {
      revalidatePath(`/admin/candidates/${linkedCandidateId}/preview`);
    }
    revalidatePath("/portal");
    return {
      success: true,
      error: null,
      candidateId: linkedCandidateId || undefined,
    };
  } catch {
    return { success: false, error: "Lỗi xác thực khi đồng bộ Staged Sync." };
  }
}
