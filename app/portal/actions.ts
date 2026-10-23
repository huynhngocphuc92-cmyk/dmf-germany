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
import type {
  DocumentTypeKey,
  DocumentVariant,
  InterviewAnswerEvaluation,
  ProgramTrack,
  StudentDocument,
  StudentMotivationLetter,
  StudentProfile,
} from "@/lib/portal/types";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  signStudentDocumentUrls,
  signStudentFilePath,
  signStudentVideoUrl,
} from "@/lib/portal/storage";

const AI_RATE_LIMIT_MESSAGE = "Bạn đã dùng hết lượt AI trong 1 giờ. Vui lòng thử lại sau.";

/**
 * Giới hạn lượt theo tài khoản cho các thao tác nhạy cảm của Portal.
 * Backend rate-limit gặp sự cố thì chặn luôn (fail-closed), giống intake.
 */
async function portalRateLimitBlocked(
  scope: "portal-ai" | "portal-invite",
  userId: string
): Promise<boolean> {
  try {
    const result = await checkRateLimit(
      `${scope}:${userId}`,
      scope === "portal-ai" ? RATE_LIMITS.PORTAL_AI : RATE_LIMITS.PORTAL_INVITE
    );
    return !result.success;
  } catch {
    return true;
  }
}

function buildDefaultProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): StudentProfile {
  const fullName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
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
    phone: typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone : "",
    date_of_birth: null,
    place_of_birth: "Ho-Chi-Minh-Stadt, Vietnam",
    nationality: "Vietnamesisch",
    marital_status: "Ledig",
    passport_number: "",
    passport_expiry: null,
    address_street: "",
    address_city: "Ho-Chi-Minh-Stadt",
    address_country: "Vietnam",
    avatar_url: null,
    target_profession: "Pflegefachfrau / Pflegefachmann",
    experience_years: 0,
    german_level: "B1",
    education_history: [
      {
        id: "edu-default-1",
        fromMonth: "2020-09",
        toMonth: "2023-06",
        institutionVn: "Trường THPT tại Việt Nam",
        institutionDe: "Oberschule in Vietnam",
        location: "Vietnam",
        degreeVn: "Bằng Tốt nghiệp Trung học Phổ thông",
        degreeDe: "Allgemeine Hochschulreife (Abitur-Äquivalent)",
        detailsDe: "Abschluss mit gutem Gesamtergebnis",
      },
      {
        id: "edu-default-2",
        fromMonth: "2023-08",
        toMonth: "heute",
        institutionVn: "Học viện DMF Vietnam Academy",
        institutionDe: "DMF Vietnam Academy",
        location: "Ho-Chi-Minh-Stadt",
        degreeVn: "Khoá tiếng Đức chuyên sâu A1–B2 & Định hướng nghề",
        degreeDe: "Intensivsprachkurs Deutsch (A1–B2) & Fachliche Berufsvorbereitung",
        detailsDe:
          "156 UE/Jahr, Fachsprache, interkulturelles Training und Vorbereitung auf den deutschen Arbeitsmarkt",
      },
    ],
    work_experience: [],
    language_skills: [
      {
        languageDe: "Vietnamesisch",
        languageVn: "Tiếng Việt",
        level: "Muttersprache",
      },
      {
        languageDe: "Deutsch",
        languageVn: "Tiếng Đức",
        level: "B1",
        provider: "Goethe-Institut / telc",
        examDate: "",
        scores: { lesen: "", hoeren: "", schreiben: "", sprechen: "" },
      },
      {
        languageDe: "Englisch",
        languageVn: "Tiếng Anh",
        level: "A2 / Grundkenntnisse",
      },
    ],
    special_skills: {
      drivingLicenseDe: "Führerschein Klasse A1 (Vietnam)",
      edvSkillsDe: "MS Office (Word, Excel, PowerPoint), digitale Dokumentation",
      professionalSkillsDe: "Teamfähigkeit, Sorgfalt, Zuverlässigkeit, schnelle Auffassungsgabe",
      hobbiesDe: "Kochen, Sport (Badminton, Joggen), Deutsch lernen",
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
  const programTrack = String(formData.get("program_track") || "azubi") as ProgramTrack;
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
    // Initialize profile row immediately if session is active
    const defaultProfile = buildDefaultProfile(data.user);
    await supabase.from("student_profiles").upsert(
      {
        user_id: data.user.id,
        full_name: fullName,
        email,
        phone,
        program_track: programTrack,
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
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const isAdmin = isAdminUser(user);
  const fallbackProfile = buildDefaultProfile(user);

  try {
    const { data: existingProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let profile: StudentProfile;

    if (!existingProfile) {
      const { data: inserted } = await supabase
        .from("student_profiles")
        .insert({
          user_id: user.id,
          full_name: fallbackProfile.full_name,
          email: fallbackProfile.email,
          phone: fallbackProfile.phone,
          program_track: fallbackProfile.program_track,
          target_profession: fallbackProfile.target_profession,
          education_history: fallbackProfile.education_history,
          language_skills: fallbackProfile.language_skills,
          special_skills: fallbackProfile.special_skills,
        })
        .select("*")
        .single();

      profile = (inserted as StudentProfile) || fallbackProfile;

      // Redeem pending invite code from signUp metadata if present
      const pendingCode =
        typeof user.user_metadata?.pending_invite_code === "string"
          ? user.user_metadata.pending_invite_code
          : "";
      if (pendingCode) {
        const { data: redeemResult } = await supabase.rpc("dmf_redeem_student_code", {
          p_code: pendingCode,
        });
        if (redeemResult?.success) {
          profile.ai_enabled = true;
          profile.invite_code_used = redeemResult.code;
        }
      }
    } else {
      profile = {
        ...fallbackProfile,
        ...(existingProfile as StudentProfile),
        education_history: Array.isArray(existingProfile.education_history)
          ? existingProfile.education_history
          : fallbackProfile.education_history,
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
        interview_qa: Array.isArray(existingProfile.interview_qa)
          ? existingProfile.interview_qa
          : [],
      };
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

    // Bucket student-documents là private: ký lại URL ngắn hạn cho mọi file.
    const documents = await signStudentDocumentUrls(
      supabase,
      (docsRes.data as StudentDocument[]) || []
    );
    profile.video_url = await signStudentVideoUrl(supabase, profile.video_url);

    return {
      profile,
      documents,
      letters: (lettersRes.data as StudentMotivationLetter[]) || [],
      isAdmin,
    };
  } catch {
    return {
      profile: { ...fallbackProfile, ai_enabled: isAdmin },
      documents: [],
      letters: [],
      isAdmin,
    };
  }
}

// ============================================================================
// 3. INVITE CODE REDEMPTION (MỞ KHOÁ AI)
// ============================================================================

export async function redeemStudentInviteCode(
  code: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Vui lòng đăng nhập lại." };

    // Chống dò mã mời: tối đa 10 lần thử / tài khoản / giờ.
    if (await portalRateLimitBlocked("portal-invite", user.id)) {
      return {
        success: false,
        error: "Bạn đã thử quá nhiều lần. Vui lòng đợi 1 giờ rồi thử lại.",
      };
    }

    const { data, error } = await supabase.rpc("dmf_redeem_student_code", {
      p_code: code.trim(),
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

    revalidatePath("/portal");
    return { success: true, error: null };
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
    if (!user) return { success: false, error: "Phiên đăng nhập đã hết hạn." };

    const parsed = studentProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Vui lòng kiểm tra lại thông tin nhập.",
      };
    }

    const d = parsed.data;
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
      video_url: d.video_url || null,
      interview_script_de: d.interview_script_de,
      ...(submitForReview ? { sync_status: "submitted" as const } : {}),
    };

    const { data, error } = await supabase
      .from("student_profiles")
      .update(payload)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      return { success: false, error: "Không thể lưu hồ sơ. Vui lòng thử lại." };
    }

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return { success: true, error: null, profile: data as StudentProfile };
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
  if (await portalRateLimitBlocked("portal-ai", profile.user_id)) {
    return { success: false, error: AI_RATE_LIMIT_MESSAGE };
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

  if (error) {
    return { success: false, error: "Không thể lưu dữ liệu CV đã chuẩn hoá." };
  }

  revalidatePath("/portal");
  return { success: true, error: null, profile: data as StudentProfile };
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
  if (await portalRateLimitBlocked("portal-ai", profile.user_id)) {
    return { success: false, error: AI_RATE_LIMIT_MESSAGE };
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
  if (await portalRateLimitBlocked("portal-ai", profile.user_id)) {
    return { success: false, error: AI_RATE_LIMIT_MESSAGE };
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

  if (error) {
    return { success: false, error: "Không thể lưu kịch bản phỏng vấn." };
  }

  revalidatePath("/portal");
  return { success: true, error: null, profile: data as StudentProfile };
}

// ============================================================================
// 6. DOCUMENT UPLOAD & AI OCR CHECK
// ============================================================================

export async function uploadStudentDocumentAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  document?: StudentDocument;
}> {
  try {
    const { profile, isAdmin } = await getOrCreateStudentPortalBundle();
    const file = formData.get("file") as File | null;
    const docType = String(formData.get("doc_type") || "") as DocumentTypeKey;
    const variant = String(formData.get("variant") || "original") as DocumentVariant;

    if (!file || !docType) {
      return { success: false, error: "Vui lòng chọn file PDF hoặc ảnh chụp rõ nét." };
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Chỉ chấp nhận định dạng PDF, JPG, PNG hoặc WebP.",
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Dung lượng file tối đa là 10MB.",
      };
    }

    const supabase = await createClient();
    const ext = file.name.split(".").pop() || "pdf";
    const storagePath = `portal/${profile.user_id}/${docType}-${variant}-${Date.now()}.${ext}`;

    // Bucket student-documents là private: lưu signed URL (app sẽ ký lại khi đọc).
    let storedUrl: string | null = null;
    const { error: uploadErr } = await supabase.storage
      .from("student-documents")
      .upload(storagePath, file, { upsert: true });

    if (!uploadErr) {
      storedUrl = await signStudentFilePath(supabase, storagePath);
    }

    // OCR cũng là lượt gọi AI: tính chung vào hạn mức AI của tài khoản.
    const aiAllowed =
      (profile.ai_enabled || isAdmin) &&
      !(await portalRateLimitBlocked("portal-ai", profile.user_id));
    const ocrResult = aiAllowed
      ? await inspectStudentDocument({
          profile,
          docType,
          variant,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
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
          file_url: storedUrl,
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

    if (dbErr) {
      return { success: false, error: "Không thể lưu thông tin tài liệu. Vui lòng thử lại." };
    }

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return { success: true, error: null, document: savedDoc as StudentDocument };
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
  const { profile } = await getOrCreateStudentPortalBundle();
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

  if (error) {
    return { success: false, error: "Không thể lưu chữ ký và biên bản đồng ý pháp lý." };
  }

  revalidatePath("/portal");
  revalidatePath("/admin/candidates");
  return { success: true, error: null, profile: data as StudentProfile };
}

// ============================================================================
// 8. WEBRTC VIDEO RECORDING UPLOAD & AI VOICE INTERVIEW EVALUATION
// ============================================================================

export async function uploadRecordedIntroVideoAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  videoUrl?: string;
  profile?: StudentProfile;
}> {
  try {
    const { profile } = await getOrCreateStudentPortalBundle();
    const file = formData.get("video") as File | null;

    if (!file) {
      return { success: false, error: "Không tìm thấy dữ liệu video vừa quay." };
    }

    const maxSize = 50 * 1024 * 1024; // 50MB max for 60-90s WebM/MP4
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Dung lượng video vượt quá 50MB. Vui lòng quay trong khoảng 60–90 giây.",
      };
    }

    if (file.type && !["video/webm", "video/mp4"].includes(file.type)) {
      return { success: false, error: "Chỉ chấp nhận video định dạng WebM hoặc MP4." };
    }

    const supabase = await createClient();
    const ext = file.type.includes("mp4") ? "mp4" : "webm";
    const storagePath = `portal/${profile.user_id}/selbstvorstellung-${Date.now()}.${ext}`;

    // Upload to student-documents bucket
    const { error: uploadErr } = await supabase.storage
      .from("student-documents")
      .upload(storagePath, file, {
        contentType: file.type || "video/webm",
        upsert: true,
      });

    if (uploadErr) {
      return {
        success: false,
        error:
          "Chưa thể tải trực tiếp lên Storage. Hãy tải file video về máy và dán link YouTube Unlisted thay thế.",
      };
    }

    const videoUrl = await signStudentFilePath(supabase, storagePath);
    if (!videoUrl) {
      return { success: false, error: "Đã tải file nhưng không thể tạo link xem video." };
    }

    const { data: updatedProfile, error: dbErr } = await supabase
      .from("student_profiles")
      .update({
        video_url: videoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (dbErr) {
      return { success: false, error: "Đã tải file nhưng không thể cập nhật link vào hồ sơ." };
    }

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      videoUrl,
      profile: updatedProfile as StudentProfile,
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
    const { profile, isAdmin } = await getOrCreateStudentPortalBundle();
    if (!profile.ai_enabled && !isAdmin) {
      return {
        success: false,
        error: "Vui lòng mở khoá Mã Học Viên DMF để sử dụng AI chấm điểm phỏng vấn tiếng Đức.",
      };
    }
    if (await portalRateLimitBlocked("portal-ai", profile.user_id)) {
      return { success: false, error: AI_RATE_LIMIT_MESSAGE };
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

    if (error) {
      return {
        success: true,
        error: null,
        evaluation,
        profile: { ...profile, interview_qa: updatedQaList },
      };
    }

    revalidatePath("/portal");
    revalidatePath("/admin/candidates");
    return {
      success: true,
      error: null,
      evaluation,
      profile: updatedProfile as StudentProfile,
    };
  } catch {
    return { success: false, error: "Không thể chấm điểm câu trả lời lúc này." };
  }
}
