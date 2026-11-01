"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/lib/auth/admin-policy";
import {
  legalSignatureSchema,
  studentMotivationLetterSchema,
  studentProfileUpdateSchema,
} from "@/lib/portal/schemas";
import {
  evaluateStudentInterviewAnswer,
  generateDin5008MotivationLetter,
  generateInterviewPrepKit,
  inspectStudentDocument,
  translateAndStandardizeCVEntries,
} from "@/lib/portal/ai-service";
import {
  createSignedReadUrl,
  ensurePrivateStudentBucket,
  getOptionalServiceStorageClient,
  hydrateDocumentsWithSignedUrls,
  hydrateProfileVideoSignedUrl,
  normalizeStoredVideoReference,
  sanitizeStorageFileName,
  STORAGE_URI_PREFIX,
  STUDENT_DOCS_BUCKET,
} from "@/lib/portal/storage";
import {
  DOCUMENT_CHECKLIST_CONFIG,
  type DocumentTypeKey,
  type DocumentVariant,
  type InterviewAnswerEvaluation,
  type ProgramTrack,
  type StudentDocument,
  type StudentMotivationLetter,
  type StudentProfile,
} from "@/lib/portal/types";

const ALLOWED_DOC_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
const ALLOWED_VIDEO_MIME_TYPES = ["video/webm", "video/mp4"] as const;
const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB
const VALID_DOC_TYPES = new Set<string>(DOCUMENT_CHECKLIST_CONFIG.map((d) => d.docType));

function buildDefaultProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): StudentProfile {
  const fullName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const track =
    typeof user.user_metadata?.program_track === "string" &&
    ["azubi", "skilled", "studium", "seasonal"].includes(user.user_metadata.program_track)
      ? (user.user_metadata.program_track as ProgramTrack)
      : "azubi";

  return {
    id: user.id,
    user_id: user.id,
    candidate_id: null,
    program_track: track,
    ai_enabled: false,
    invite_code_used: null,
    full_name: fullName,
    given_name: "",
    family_name: "",
    email: user.email || "",
    phone: typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone.trim() : "",
    date_of_birth: null,
    place_of_birth: "",
    nationality: "Vietnamesisch",
    marital_status: "Ledig",
    passport_number: "",
    passport_expiry: null,
    address_street: "",
    address_city: "",
    address_country: "Vietnam",
    avatar_url: null,
    target_profession: "",
    experience_years: 0,
    german_level: "A1",
    education_history: [],
    work_experience: [],
    language_skills: [
      {
        languageDe: "Vietnamesisch",
        languageVn: "Tiếng Việt",
        level: "Muttersprache",
      },
    ],
    special_skills: {
      drivingLicenseDe: "",
      edvSkillsDe: "",
      professionalSkillsDe: "",
      hobbiesDe: "",
    },
    video_url: null,
    interview_script_de: "",
    interview_qa: [],
    signature_data_url: null,
    signature_place: "Ho-Chi-Minh-Stadt",
    signature_updated_at: null,
    dsgvo_consent_accepted: false,
    dsgvo_consent_signed_at: null,
    vollmacht_accepted: false,
    vollmacht_signed_at: null,
    vollmacht_employer_name: "",
    sync_status: "draft",
    admin_feedback: null,
    last_synced_at: null,
    last_synced_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function normalizeProfileRow(
  existingProfile: Partial<StudentProfile>,
  fallbackProfile: StudentProfile
): StudentProfile {
  return {
    ...fallbackProfile,
    ...(existingProfile as StudentProfile),
    education_history: Array.isArray(existingProfile.education_history)
      ? existingProfile.education_history
      : [],
    work_experience: Array.isArray(existingProfile.work_experience)
      ? existingProfile.work_experience
      : [],
    language_skills: Array.isArray(existingProfile.language_skills)
      ? existingProfile.language_skills
      : fallbackProfile.language_skills,
    special_skills:
      existingProfile.special_skills && typeof existingProfile.special_skills === "object"
        ? { ...fallbackProfile.special_skills, ...existingProfile.special_skills }
        : fallbackProfile.special_skills,
    interview_qa: Array.isArray(existingProfile.interview_qa) ? existingProfile.interview_qa : [],
  };
}

// ============================================================================
// 1. AUTHENTICATION ACTIONS (/portal/login & /portal/register)
// ============================================================================

export async function portalLogin(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ Email và Mật khẩu." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Email hoặc mật khẩu không chính xác." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư của bạn." };
    }
    return { error: error.message };
  }

  revalidatePath("/portal", "layout");
  redirect("/portal");
}

export async function portalRegister(
  formData: FormData
): Promise<{ error?: string; requiresConfirmation?: boolean }> {
  const supabase = await createClient();
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const rawTrack = String(formData.get("program_track") || "azubi");
  const programTrack: ProgramTrack = ["azubi", "skilled", "studium", "seasonal"].includes(rawTrack)
    ? (rawTrack as ProgramTrack)
    : "azubi";
  const inviteCode = String(formData.get("invite_code") || "").trim();

  if (fullName.length < 2) {
    return { error: "Vui lòng nhập Họ và Tên đầy đủ (trùng với Hộ chiếu)." };
  }
  if (!email.includes("@")) {
    return { error: "Vui lòng nhập địa chỉ Email hợp lệ." };
  }
  if (password.length < 8) {
    return { error: "Mật khẩu phải có ít nhất 8 ký tự." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        program_track: programTrack,
        pending_invite_code: inviteCode || undefined,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session && data.user) {
    const defaultProfile = buildDefaultProfile(data.user);
    await supabase.from("student_profiles").upsert(
      {
        user_id: data.user.id,
        full_name: fullName,
        email,
        phone,
        program_track: programTrack,
        german_level: "A1",
        education_history: defaultProfile.education_history,
        language_skills: defaultProfile.language_skills,
        special_skills: defaultProfile.special_skills,
      },
      { onConflict: "user_id" }
    );

    if (inviteCode) {
      await supabase.rpc("dmf_redeem_student_code", { p_code: inviteCode });
    }

    revalidatePath("/portal", "layout");
    redirect("/portal");
  }

  return { requiresConfirmation: true };
}

export async function portalSignOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/portal", "layout");
  redirect("/portal/login");
}

// ============================================================================
// 2. FETCH / INITIALIZE STUDENT PORTAL DATA BUNDLE
// ============================================================================

export async function getOrCreateStudentPortalBundle(): Promise<{
  profile: StudentProfile;
  documents: StudentDocument[];
  letters: StudentMotivationLetter[];
  isAdmin: boolean;
  dbError?: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    redirect("/portal/login");
  }

  const isAdmin = isAdminUser(user);
  const fallbackProfile = buildDefaultProfile(user);

  try {
    const { data: existingProfile, error: existingErr } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingErr) {
      throw existingErr;
    }

    let profile: StudentProfile;

    if (!existingProfile) {
      const { data: inserted, error: insertErr } = await supabase
        .from("student_profiles")
        .insert({
          user_id: user.id,
          full_name: fallbackProfile.full_name,
          email: fallbackProfile.email,
          phone: fallbackProfile.phone,
          program_track: fallbackProfile.program_track,
          german_level: fallbackProfile.german_level,
          target_profession: fallbackProfile.target_profession,
          education_history: fallbackProfile.education_history,
          language_skills: fallbackProfile.language_skills,
          special_skills: fallbackProfile.special_skills,
        })
        .select("*")
        .single();

      if (insertErr || !inserted) {
        throw insertErr || new Error("Unable to initialize student profile");
      }

      profile = normalizeProfileRow(inserted as StudentProfile, fallbackProfile);

      // Redeem pending invite code from signUp metadata if present, then re-read persisted DB row
      const pendingCode =
        typeof user.user_metadata?.pending_invite_code === "string"
          ? user.user_metadata.pending_invite_code.trim()
          : "";
      if (pendingCode) {
        const { data: redeemResult } = await supabase.rpc("dmf_redeem_student_code", {
          p_code: pendingCode,
        });
        if (redeemResult?.success) {
          const { data: refreshed } = await supabase
            .from("student_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          if (refreshed) {
            profile = normalizeProfileRow(refreshed as StudentProfile, fallbackProfile);
          }
        }
      }
    } else {
      profile = normalizeProfileRow(existingProfile as StudentProfile, fallbackProfile);
    }

    if (isAdmin) {
      profile.ai_enabled = true;
    }

    const [docsRes, lettersRes] = await Promise.all([
      supabase
        .from("student_documents")
        .select("*")
        .eq("student_profile_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("student_motivation_letters")
        .select("*")
        .eq("student_profile_id", profile.id)
        .order("created_at", { ascending: false }),
    ]);

    const storageClient = getOptionalServiceStorageClient() || supabase;
    const [hydratedProfile, hydratedDocs] = await Promise.all([
      hydrateProfileVideoSignedUrl(storageClient, profile),
      hydrateDocumentsWithSignedUrls(
        storageClient,
        ((docsRes.data as StudentDocument[]) || []).map((doc) => ({ ...doc }))
      ),
    ]);

    return {
      profile: hydratedProfile,
      documents: hydratedDocs,
      letters: (lettersRes.data as StudentMotivationLetter[]) || [],
      isAdmin,
      dbError: null,
    };
  } catch (err) {
    console.error("[Portal] Failed to load or initialize student portal bundle:", err);
    return {
      profile: { ...fallbackProfile, ai_enabled: isAdmin },
      documents: [],
      letters: [],
      isAdmin,
      dbError:
        "Không thể kết nối dữ liệu hồ sơ học viên lúc này. Vui lòng tải lại trang trước khi lưu thay đổi.",
    };
  }
}

// ============================================================================
// 3. INVITE CODE REDEMPTION (MỞ KHOÁ AI)
// ============================================================================

export async function redeemStudentInviteCode(code: string): Promise<{
  success: boolean;
  error: string | null;
  profile?: StudentProfile;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
      return { success: false, error: "Vui lòng đăng nhập lại." };
    }

    const cleanCode = code.trim();
    const { data, error } = await supabase.rpc("dmf_redeem_student_code", {
      p_code: cleanCode,
    });

    if (error) {
      return { success: false, error: "Không thể kích hoạt mã lúc này. Vui lòng thử lại." };
    }

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || "Mã học viên không hợp lệ hoặc đã hết lượt.",
      };
    }

    // Re-read student_profiles to confirm ai_enabled persisted in Postgres
    const { data: persistedProfile, error: readErr } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (readErr || !persistedProfile?.ai_enabled) {
      return {
        success: false,
        error: "Mã hợp lệ nhưng chưa thể bật quyền AI trên hồ sơ. Vui lòng liên hệ Admin DMF.",
      };
    }

    const storageClient = getOptionalServiceStorageClient() || supabase;
    const hydrated = await hydrateProfileVideoSignedUrl(
      storageClient,
      normalizeProfileRow(persistedProfile as StudentProfile, buildDefaultProfile(user))
    );

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return { success: true, error: null, profile: hydrated };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi khi kiểm tra mã học viên." };
  }
}

// ============================================================================
// 4. SAVE PROFILE & CV DATA + SUBMIT FOR ADMIN REVIEW
// ============================================================================

export async function saveStudentProfile(
  input: unknown,
  submitForReview = false
): Promise<{ success: boolean; error: string | null; profile?: StudentProfile }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
      return { success: false, error: "Phiên đăng nhập đã hết hạn." };
    }

    const parsed = studentProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Vui lòng kiểm tra lại thông tin nhập.",
      };
    }

    const d = parsed.data;
    const normalizedVideo = normalizeStoredVideoReference(d.video_url, user.id);

    const payload = {
      program_track: d.program_track,
      full_name: d.full_name,
      given_name: d.given_name,
      family_name: d.family_name,
      phone: d.phone,
      date_of_birth: d.date_of_birth || null,
      place_of_birth: d.place_of_birth,
      nationality: d.nationality,
      marital_status: d.marital_status,
      passport_number: d.passport_number,
      passport_expiry: d.passport_expiry || null,
      address_street: d.address_street,
      address_city: d.address_city,
      address_country: d.address_country,
      avatar_url: d.avatar_url || null,
      target_profession: d.target_profession,
      experience_years: d.experience_years,
      german_level: d.german_level,
      education_history: d.education_history,
      work_experience: d.work_experience,
      language_skills: d.language_skills,
      special_skills: d.special_skills,
      video_url: normalizedVideo,
      interview_script_de: d.interview_script_de,
      ...(submitForReview ? { sync_status: "submitted" as const } : {}),
    };

    const { data, error } = await supabase
      .from("student_profiles")
      .update(payload)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể lưu hồ sơ. Vui lòng thử lại." };
    }

    const storageClient = getOptionalServiceStorageClient() || supabase;
    const hydrated = await hydrateProfileVideoSignedUrl(
      storageClient,
      normalizeProfileRow(data as StudentProfile, buildDefaultProfile(user))
    );

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return { success: true, error: null, profile: hydrated };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi khi lưu hồ sơ." };
  }
}

// ============================================================================
// 5. AI ACTIONS FOR CV, MOTIVATION LETTER & INTERVIEW PREP
// ============================================================================

export async function runAiCvStandardization(): Promise<{
  success: boolean;
  error: string | null;
  profile?: StudentProfile;
}> {
  const { profile, isAdmin } = await getOrCreateStudentPortalBundle();
  if (!profile.ai_enabled && !isAdmin) {
    return {
      success: false,
      error: "Vui lòng nhập Mã Học Viên DMF hoặc chờ Admin mở khoá tính năng AI.",
    };
  }

  const standardized = await translateAndStandardizeCVEntries({
    targetProfession: profile.target_profession,
    programTrack: profile.program_track,
    germanLevel: profile.german_level,
    education: profile.education_history,
    work: profile.work_experience,
  });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_profiles")
    .update({
      education_history: standardized.education,
      work_experience: standardized.work,
    })
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error || !data) {
    return { success: false, error: "Không thể lưu dữ liệu CV đã chuẩn hoá." };
  }

  const storageClient = getOptionalServiceStorageClient() || supabase;
  const hydrated = await hydrateProfileVideoSignedUrl(storageClient, data as StudentProfile);

  revalidatePath("/portal");
  return { success: true, error: null, profile: hydrated };
}

export async function generateAndSaveMotivationLetter(input: unknown): Promise<{
  success: boolean;
  error: string | null;
  letter?: StudentMotivationLetter;
}> {
  const { profile, isAdmin } = await getOrCreateStudentPortalBundle();
  if (!profile.ai_enabled && !isAdmin) {
    return {
      success: false,
      error:
        "Tính năng AI viết Motivationsschreiben chuẩn DIN 5008 yêu cầu mở khoá Mã Học Viên DMF.",
    };
  }

  const parsed = studentMotivationLetterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Vui lòng kiểm tra thông tin thư động lực.",
    };
  }

  const d = parsed.data;
  const generated = await generateDin5008MotivationLetter({
    profile,
    targetCompanyName: d.target_company_name,
    targetCity: d.target_city,
    targetContactPerson: d.target_contact_person,
    targetPositionDe: d.target_position_de || profile.target_profession,
    answers: d.prompt_answers,
  });

  const supabase = await createClient();
  const rowPayload = {
    student_profile_id: profile.id,
    user_id: profile.user_id,
    title: d.title,
    is_primary: d.is_primary,
    target_company_name: d.target_company_name,
    target_company_address: d.target_company_address,
    target_city: d.target_city,
    target_contact_person: d.target_contact_person,
    target_position_de: d.target_position_de || profile.target_profession,
    prompt_answers: d.prompt_answers,
    subject_de: generated.subject_de,
    salutation_de: generated.salutation_de,
    body_de: generated.body_de,
    closing_de: generated.closing_de,
    updated_at: new Date().toISOString(),
  };

  let saved;
  if (d.id) {
    const { data, error } = await supabase
      .from("student_motivation_letters")
      .update(rowPayload)
      .eq("id", d.id)
      .eq("student_profile_id", profile.id)
      .select("*")
      .single();
    if (error) return { success: false, error: "Không thể cập nhật Motivationsschreiben." };
    saved = data;
  } else {
    const { data, error } = await supabase
      .from("student_motivation_letters")
      .insert(rowPayload)
      .select("*")
      .single();
    if (error) return { success: false, error: "Không thể lưu Motivationsschreiben mới." };
    saved = data;
  }

  revalidatePath("/portal");
  return { success: true, error: null, letter: saved as StudentMotivationLetter };
}

export async function saveMotivationLetterManual(input: unknown): Promise<{
  success: boolean;
  error: string | null;
  letter?: StudentMotivationLetter;
}> {
  const { profile } = await getOrCreateStudentPortalBundle();
  const parsed = studentMotivationLetterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Vui lòng kiểm tra nội dung thư.",
    };
  }

  const d = parsed.data;
  const supabase = await createClient();
  const rowPayload = {
    student_profile_id: profile.id,
    user_id: profile.user_id,
    title: d.title,
    is_primary: d.is_primary,
    target_company_name: d.target_company_name,
    target_company_address: d.target_company_address,
    target_city: d.target_city,
    target_contact_person: d.target_contact_person,
    target_position_de: d.target_position_de,
    prompt_answers: d.prompt_answers,
    subject_de: d.subject_de,
    salutation_de: d.salutation_de,
    body_de: d.body_de,
    closing_de: d.closing_de,
    updated_at: new Date().toISOString(),
  };

  if (d.id) {
    const { data, error } = await supabase
      .from("student_motivation_letters")
      .update(rowPayload)
      .eq("id", d.id)
      .eq("student_profile_id", profile.id)
      .select("*")
      .single();
    if (error) return { success: false, error: "Không thể lưu bản chỉnh sửa." };
    revalidatePath("/portal");
    return { success: true, error: null, letter: data as StudentMotivationLetter };
  }

  const { data, error } = await supabase
    .from("student_motivation_letters")
    .insert(rowPayload)
    .select("*")
    .single();
  if (error) return { success: false, error: "Không thể tạo phiên bản thư mới." };
  revalidatePath("/portal");
  return { success: true, error: null, letter: data as StudentMotivationLetter };
}

export async function deleteMotivationLetter(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const { profile } = await getOrCreateStudentPortalBundle();
  const supabase = await createClient();
  const { error } = await supabase
    .from("student_motivation_letters")
    .delete()
    .eq("id", id)
    .eq("student_profile_id", profile.id);
  if (error) return { success: false, error: "Không thể xoá phiên bản thư này." };
  revalidatePath("/portal");
  return { success: true, error: null };
}

export async function generateAiInterviewKitAction(): Promise<{
  success: boolean;
  error: string | null;
  profile?: StudentProfile;
}> {
  const { profile, isAdmin } = await getOrCreateStudentPortalBundle();
  if (!profile.ai_enabled && !isAdmin) {
    return {
      success: false,
      error:
        "Vui lòng mở khoá Mã Học Viên DMF để tạo Kịch bản Teleprompter & Bộ câu hỏi phỏng vấn AI.",
    };
  }

  const kit = await generateInterviewPrepKit(profile);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_profiles")
    .update({
      interview_script_de: kit.scriptDe,
      interview_qa: kit.qaList,
    })
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error || !data) {
    return { success: false, error: "Không thể lưu kịch bản phỏng vấn." };
  }

  const storageClient = getOptionalServiceStorageClient() || supabase;
  const hydrated = await hydrateProfileVideoSignedUrl(storageClient, data as StudentProfile);

  revalidatePath("/portal");
  return { success: true, error: null, profile: hydrated };
}

// ============================================================================
// 6. PRIVATE SIGNED UPLOADS (BYPASS 5MB ACTION LIMIT) & DOCUMENT OCR CHECK
// ============================================================================

export async function createStudentSignedUploadAction(input: {
  kind: "document" | "video";
  docType?: DocumentTypeKey;
  variant?: DocumentVariant;
  fileName: string;
  mimeType: string;
  fileSize: number;
}): Promise<{
  success: boolean;
  error: string | null;
  storagePath?: string;
  signedUrl?: string;
  token?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
      return { success: false, error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
    }

    if (!Number.isFinite(input.fileSize) || input.fileSize <= 0) {
      return { success: false, error: "Tệp tải lên không hợp lệ hoặc rỗng." };
    }

    let storagePath: string;

    if (input.kind === "document") {
      if (!input.docType || !VALID_DOC_TYPES.has(input.docType)) {
        return { success: false, error: "Loại giấy tờ không hợp lệ." };
      }
      if (
        !ALLOWED_DOC_MIME_TYPES.includes(input.mimeType as (typeof ALLOWED_DOC_MIME_TYPES)[number])
      ) {
        return {
          success: false,
          error: "Chỉ chấp nhận định dạng PDF, JPG, PNG hoặc WebP.",
        };
      }
      if (input.fileSize > MAX_DOC_BYTES) {
        return { success: false, error: "Dung lượng tài liệu tối đa là 10MB." };
      }
      const variant: DocumentVariant =
        input.variant === "certified_translation" ? "certified_translation" : "original";
      const safeName = sanitizeStorageFileName(input.fileName, "pdf");
      storagePath = `portal/${user.id}/${input.docType}-${variant}-${Date.now()}-${safeName}`;
    } else {
      const normalizedMime = input.mimeType.split(";")[0]?.trim() || "video/webm";
      if (
        !ALLOWED_VIDEO_MIME_TYPES.includes(
          normalizedMime as (typeof ALLOWED_VIDEO_MIME_TYPES)[number]
        )
      ) {
        return {
          success: false,
          error: "Chỉ hỗ trợ định dạng video WebM hoặc MP4.",
        };
      }
      if (input.fileSize > MAX_VIDEO_BYTES) {
        return {
          success: false,
          error: "Dung lượng video vượt quá 50MB. Vui lòng quay trong khoảng 60–90 giây.",
        };
      }
      const ext = normalizedMime.includes("mp4") ? "mp4" : "webm";
      storagePath = `portal/${user.id}/selbstvorstellung-${Date.now()}.${ext}`;
    }

    const serviceClient = getOptionalServiceStorageClient();
    await ensurePrivateStudentBucket(serviceClient);
    const storageClient = serviceClient || supabase;

    const { data, error } = await storageClient.storage
      .from(STUDENT_DOCS_BUCKET)
      .createSignedUploadUrl(storagePath, { upsert: true });

    if (error || !data?.signedUrl) {
      return {
        success: false,
        error: "Không thể khởi tạo đường dẫn tải tệp bảo mật lên Storage. Vui lòng thử lại.",
      };
    }

    return {
      success: true,
      error: null,
      storagePath,
      signedUrl: data.signedUrl,
      token: data.token,
    };
  } catch {
    return {
      success: false,
      error: "Đã xảy ra lỗi khi khởi tạo phiên tải tệp bảo mật.",
    };
  }
}

export async function finalizeStudentDocumentUploadAction(input: {
  docType: DocumentTypeKey;
  variant: DocumentVariant;
  fileName: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
}): Promise<{
  success: boolean;
  error: string | null;
  document?: StudentDocument;
}> {
  try {
    const { profile, isAdmin, dbError } = await getOrCreateStudentPortalBundle();
    if (dbError) {
      return { success: false, error: dbError };
    }

    if (!VALID_DOC_TYPES.has(input.docType)) {
      return { success: false, error: "Loại giấy tờ không hợp lệ." };
    }
    if (
      !ALLOWED_DOC_MIME_TYPES.includes(input.mimeType as (typeof ALLOWED_DOC_MIME_TYPES)[number])
    ) {
      return { success: false, error: "Định dạng file không được hỗ trợ." };
    }
    if (!Number.isFinite(input.fileSize) || input.fileSize <= 0 || input.fileSize > MAX_DOC_BYTES) {
      return { success: false, error: "Dung lượng file không hợp lệ (tối đa 10MB)." };
    }

    const expectedPrefix = `portal/${profile.user_id}/`;
    if (!input.storagePath.startsWith(expectedPrefix) || input.storagePath.includes("..")) {
      return { success: false, error: "Đường dẫn lưu trữ tài liệu không hợp lệ." };
    }

    const supabase = await createClient();
    const serviceClient = getOptionalServiceStorageClient();
    const storageClient = serviceClient || supabase;
    const objectFileName = input.storagePath.slice(expectedPrefix.length);

    // Verify object genuinely exists in Storage before persisting DB metadata
    const { data: listed, error: listErr } = await storageClient.storage
      .from(STUDENT_DOCS_BUCKET)
      .list(`portal/${profile.user_id}`, { search: objectFileName, limit: 10 });

    const existsInStorage = !listErr && listed?.some((item) => item.name === objectFileName);
    if (!existsInStorage) {
      return {
        success: false,
        error: "Tệp chưa được lưu hoàn tất trên Storage. Vui lòng tải lên lại.",
      };
    }

    let fileBytes: Uint8Array | undefined;
    const hasGeminiKey = Boolean(
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    );
    if ((profile.ai_enabled || isAdmin) && hasGeminiKey && input.fileSize <= 8 * 1024 * 1024) {
      const { data: downloaded } = await storageClient.storage
        .from(STUDENT_DOCS_BUCKET)
        .download(input.storagePath);
      if (downloaded) {
        fileBytes = new Uint8Array(await downloaded.arrayBuffer());
      }
    }

    const ocrResult =
      profile.ai_enabled || isAdmin
        ? await inspectStudentDocument({
            profile,
            docType: input.docType,
            variant: input.variant,
            fileName: input.fileName,
            fileSize: input.fileSize,
            mimeType: input.mimeType,
            fileBytes,
          })
        : null;

    const { data: savedDoc, error: dbErr } = await supabase
      .from("student_documents")
      .upsert(
        {
          student_profile_id: profile.id,
          user_id: profile.user_id,
          doc_type: input.docType,
          variant: input.variant,
          file_name: input.fileName,
          file_path: input.storagePath,
          file_url: null,
          file_size: input.fileSize,
          mime_type: input.mimeType,
          ocr_data: ocrResult,
          ocr_checked_at: ocrResult ? new Date().toISOString() : null,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "student_profile_id,doc_type,variant" }
      )
      .select("*")
      .single();

    if (dbErr || !savedDoc) {
      return { success: false, error: "Không thể lưu thông tin tài liệu. Vui lòng thử lại." };
    }

    const signedReadUrl = await createSignedReadUrl(storageClient, input.storagePath);

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      document: {
        ...(savedDoc as StudentDocument),
        file_url: signedReadUrl,
      },
    };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi khi xác nhận tài liệu tải lên." };
  }
}

export async function uploadStudentDocumentAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  document?: StudentDocument;
}> {
  try {
    const { profile, isAdmin, dbError } = await getOrCreateStudentPortalBundle();
    if (dbError) {
      return { success: false, error: dbError };
    }

    const file = formData.get("file") as File | null;
    const docType = String(formData.get("doc_type") || "") as DocumentTypeKey;
    const variant: DocumentVariant =
      formData.get("variant") === "certified_translation" ? "certified_translation" : "original";

    if (!file || !docType || !VALID_DOC_TYPES.has(docType)) {
      return { success: false, error: "Vui lòng chọn file PDF hoặc ảnh chụp rõ nét." };
    }

    if (!ALLOWED_DOC_MIME_TYPES.includes(file.type as (typeof ALLOWED_DOC_MIME_TYPES)[number])) {
      return {
        success: false,
        error: "Chỉ chấp nhận định dạng PDF, JPG, PNG hoặc WebP.",
      };
    }

    if (file.size <= 0 || file.size > MAX_DOC_BYTES) {
      return {
        success: false,
        error: "Dung lượng file tối đa là 10MB.",
      };
    }

    const supabase = await createClient();
    const serviceClient = getOptionalServiceStorageClient();
    await ensurePrivateStudentBucket(serviceClient);
    const storageClient = serviceClient || supabase;

    const safeName = sanitizeStorageFileName(file.name, "pdf");
    const storagePath = `portal/${profile.user_id}/${docType}-${variant}-${Date.now()}-${safeName}`;

    const { error: uploadErr } = await storageClient.storage
      .from(STUDENT_DOCS_BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: true });

    if (uploadErr) {
      return {
        success: false,
        error: "Không thể lưu tệp lên hệ thống Storage bảo mật. Vui lòng thử lại.",
      };
    }

    const fileBytes =
      (profile.ai_enabled || isAdmin) && file.size <= 8 * 1024 * 1024
        ? new Uint8Array(await file.arrayBuffer())
        : undefined;

    const ocrResult =
      profile.ai_enabled || isAdmin
        ? await inspectStudentDocument({
            profile,
            docType,
            variant,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            fileBytes,
          })
        : null;

    const { data: savedDoc, error: dbErr } = await supabase
      .from("student_documents")
      .upsert(
        {
          student_profile_id: profile.id,
          user_id: profile.user_id,
          doc_type: docType,
          variant,
          file_name: file.name,
          file_path: storagePath,
          file_url: null,
          file_size: file.size,
          mime_type: file.type,
          ocr_data: ocrResult,
          ocr_checked_at: ocrResult ? new Date().toISOString() : null,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "student_profile_id,doc_type,variant" }
      )
      .select("*")
      .single();

    if (dbErr || !savedDoc) {
      return { success: false, error: "Không thể lưu thông tin tài liệu. Vui lòng thử lại." };
    }

    const signedReadUrl = await createSignedReadUrl(storageClient, storagePath);

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      document: {
        ...(savedDoc as StudentDocument),
        file_url: signedReadUrl,
      },
    };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi khi tải tài liệu lên." };
  }
}

// ============================================================================
// 7. SAVE ELECTRONIC SIGNATURE & DSGVO / §81a VOLLMACHT CONSENT
// ============================================================================

export async function saveStudentLegalSignatures(input: unknown): Promise<{
  success: boolean;
  error: string | null;
  profile?: StudentProfile;
}> {
  const { profile, dbError } = await getOrCreateStudentPortalBundle();
  if (dbError) {
    return { success: false, error: dbError };
  }

  const parsed = legalSignatureSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Vui lòng kiểm tra chữ ký điện tử.",
    };
  }

  const d = parsed.data;
  const nowIso = new Date().toISOString();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_profiles")
    .update({
      signature_data_url: d.signature_data_url,
      signature_place: d.signature_place,
      signature_updated_at: nowIso,
      dsgvo_consent_accepted: d.dsgvo_consent_accepted,
      dsgvo_consent_signed_at: d.dsgvo_consent_accepted
        ? profile.dsgvo_consent_signed_at || nowIso
        : null,
      vollmacht_accepted: d.vollmacht_accepted,
      vollmacht_signed_at: d.vollmacht_accepted ? profile.vollmacht_signed_at || nowIso : null,
      vollmacht_employer_name: d.vollmacht_employer_name,
    })
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error || !data) {
    return { success: false, error: "Không thể lưu chữ ký và biên bản đồng ý pháp lý." };
  }

  const storageClient = getOptionalServiceStorageClient() || supabase;
  const hydrated = await hydrateProfileVideoSignedUrl(storageClient, data as StudentProfile);

  revalidatePath("/portal");
  revalidatePath("/admin/candidates");
  return { success: true, error: null, profile: hydrated };
}

// ============================================================================
// 8. WEBRTC VIDEO RECORDING UPLOAD & AI VOICE INTERVIEW EVALUATION
// ============================================================================

export async function finalizeRecordedIntroVideoAction(input: {
  storagePath: string;
  fileSize: number;
  mimeType: string;
}): Promise<{
  success: boolean;
  error: string | null;
  videoUrl?: string;
  profile?: StudentProfile;
}> {
  try {
    const { profile, dbError } = await getOrCreateStudentPortalBundle();
    if (dbError) {
      return { success: false, error: dbError };
    }

    if (
      !Number.isFinite(input.fileSize) ||
      input.fileSize <= 0 ||
      input.fileSize > MAX_VIDEO_BYTES
    ) {
      return {
        success: false,
        error: "Dung lượng video không hợp lệ (tối đa 50MB).",
      };
    }

    const expectedPrefix = `portal/${profile.user_id}/`;
    if (!input.storagePath.startsWith(expectedPrefix) || input.storagePath.includes("..")) {
      return { success: false, error: "Đường dẫn video lưu trữ không hợp lệ." };
    }

    const supabase = await createClient();
    const serviceClient = getOptionalServiceStorageClient();
    const storageClient = serviceClient || supabase;
    const objectFileName = input.storagePath.slice(expectedPrefix.length);

    const { data: listed, error: listErr } = await storageClient.storage
      .from(STUDENT_DOCS_BUCKET)
      .list(`portal/${profile.user_id}`, { search: objectFileName, limit: 10 });

    const existsInStorage = !listErr && listed?.some((item) => item.name === objectFileName);
    if (!existsInStorage) {
      return {
        success: false,
        error: "Video chưa được lưu hoàn tất trên Storage. Vui lòng thử tải lên lại.",
      };
    }

    const canonicalVideoUri = `${STORAGE_URI_PREFIX}${input.storagePath}`;
    const { data: updatedProfile, error: dbErr } = await supabase
      .from("student_profiles")
      .update({
        video_url: canonicalVideoUri,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (dbErr || !updatedProfile) {
      return { success: false, error: "Đã tải video nhưng không thể cập nhật vào hồ sơ." };
    }

    const hydrated = await hydrateProfileVideoSignedUrl(
      storageClient,
      updatedProfile as StudentProfile
    );

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      videoUrl: hydrated.video_url || canonicalVideoUri,
      profile: hydrated,
    };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi khi lưu video giới thiệu." };
  }
}

export async function uploadRecordedIntroVideoAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  videoUrl?: string;
  profile?: StudentProfile;
}> {
  try {
    const { profile, dbError } = await getOrCreateStudentPortalBundle();
    if (dbError) {
      return { success: false, error: dbError };
    }

    const file = formData.get("video") as File | null;
    if (!file) {
      return { success: false, error: "Không tìm thấy dữ liệu video vừa quay." };
    }

    if (file.size <= 0 || file.size > MAX_VIDEO_BYTES) {
      return {
        success: false,
        error: "Dung lượng video vượt quá 50MB. Vui lòng quay trong khoảng 60–90 giây.",
      };
    }

    const supabase = await createClient();
    const serviceClient = getOptionalServiceStorageClient();
    await ensurePrivateStudentBucket(serviceClient);
    const storageClient = serviceClient || supabase;

    const ext = file.type.includes("mp4") ? "mp4" : "webm";
    const storagePath = `portal/${profile.user_id}/selbstvorstellung-${Date.now()}.${ext}`;

    const { error: uploadErr } = await storageClient.storage
      .from(STUDENT_DOCS_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type || "video/webm",
        upsert: true,
      });

    if (uploadErr) {
      return {
        success: false,
        error:
          "Chưa thể tải trực tiếp lên Storage bảo mật. Vui lòng tải file video về máy hoặc dán link YouTube Unlisted.",
      };
    }

    const canonicalVideoUri = `${STORAGE_URI_PREFIX}${storagePath}`;
    const { data: updatedProfile, error: dbErr } = await supabase
      .from("student_profiles")
      .update({
        video_url: canonicalVideoUri,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (dbErr || !updatedProfile) {
      return { success: false, error: "Đã tải file nhưng không thể cập nhật link vào hồ sơ." };
    }

    const hydrated = await hydrateProfileVideoSignedUrl(
      storageClient,
      updatedProfile as StudentProfile
    );

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      videoUrl: hydrated.video_url || canonicalVideoUri,
      profile: hydrated,
    };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi khi lưu video giới thiệu." };
  }
}

export async function evaluateInterviewAnswerAction(input: {
  questionId: string;
  studentAnswerDe: string;
}): Promise<{
  success: boolean;
  error: string | null;
  evaluation?: InterviewAnswerEvaluation;
  profile?: StudentProfile;
}> {
  try {
    const { profile, isAdmin, dbError } = await getOrCreateStudentPortalBundle();
    if (dbError) {
      return { success: false, error: dbError };
    }
    if (!profile.ai_enabled && !isAdmin) {
      return {
        success: false,
        error: "Vui lòng mở khoá Mã Học Viên DMF để sử dụng AI chấm điểm phỏng vấn tiếng Đức.",
      };
    }

    const cleanAnswer = (input.studentAnswerDe || "").trim();
    if (cleanAnswer.length < 3) {
      return {
        success: false,
        error: "Vui lòng bấm Mic nói hoặc nhập câu trả lời bằng tiếng Đức trước khi chấm điểm.",
      };
    }

    const targetItem = profile.interview_qa.find((q) => q.id === input.questionId);
    if (!targetItem) {
      return { success: false, error: "Không tìm thấy câu hỏi phỏng vấn này." };
    }

    const evaluation = await evaluateStudentInterviewAnswer({
      profile,
      questionDe: targetItem.questionDe,
      questionVn: targetItem.questionVn,
      sampleAnswerDe: targetItem.sampleAnswerDe,
      studentAnswerDe: cleanAnswer,
    });

    const updatedQaList = profile.interview_qa.map((q) =>
      q.id === input.questionId
        ? {
            ...q,
            studentAnswerDe: cleanAnswer,
            evaluation,
          }
        : q
    );

    const supabase = await createClient();
    const { data: updatedProfile, error } = await supabase
      .from("student_profiles")
      .update({
        interview_qa: updatedQaList,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error || !updatedProfile) {
      return {
        success: false,
        error: "Đã chấm điểm câu trả lời nhưng không thể lưu kết quả vào hồ sơ.",
      };
    }

    const storageClient = getOptionalServiceStorageClient() || supabase;
    const hydrated = await hydrateProfileVideoSignedUrl(
      storageClient,
      updatedProfile as StudentProfile
    );

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      evaluation,
      profile: hydrated,
    };
  } catch {
    return { success: false, error: "Không thể chấm điểm câu trả lời lúc này." };
  }
}
