"use server";

import { requireAdmin } from "@/lib/auth/admin";
import type { GermanLevel } from "@/app/admin/candidates/types";
import { generateDin5008MotivationLetter } from "@/lib/portal/ai-service";
import type {
  ProgramTrack,
  StudentDocument,
  StudentMotivationLetter,
  StudentProfile,
} from "@/lib/portal/types";

interface CandidateTableRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  category: string;
  profession: string | null;
  experience_years: number | null;
  german_level: string;
  visa_status: boolean | null;
  avatar_url: string | null;
  video_url: string | null;
  cv_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function mapB2BCandidateToFallbackProfile(c: CandidateTableRow): StudentProfile {
  const validTracks: ProgramTrack[] = ["azubi", "skilled", "studium", "seasonal"];
  const track: ProgramTrack = validTracks.includes(c.category as ProgramTrack)
    ? (c.category as ProgramTrack)
    : "azubi";

  const validLevels: GermanLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const level: GermanLevel = validLevels.includes(c.german_level as GermanLevel)
    ? (c.german_level as GermanLevel)
    : "B1";

  const parts = (c.full_name || "").trim().split(/\s+/);
  const familyName = parts[0] || "";
  const givenName = parts.length > 1 ? parts.slice(1).join(" ") : "";

  return {
    id: `b2b-${c.id}`,
    user_id: c.id,
    candidate_id: c.id,
    program_track: track,
    ai_enabled: true,
    invite_code_used: "B2B-CANDIDATE",
    full_name: c.full_name,
    given_name: givenName,
    family_name: familyName,
    email: c.email || "kandidat@dmf-talents.de",
    phone: c.phone || "",
    date_of_birth: null,
    place_of_birth: "Vietnam",
    nationality: "Vietnamesisch",
    marital_status: "Ledig",
    passport_number: "",
    passport_expiry: null,
    address_street: "",
    address_city: "Ho-Chi-Minh-Stadt",
    address_country: "Vietnam",
    avatar_url: c.avatar_url,
    target_profession: c.profession || "",
    experience_years: c.experience_years || 0,
    german_level: level,
    education_history: [
      {
        id: "edu-b2b-1",
        fromMonth: "2023-01",
        toMonth: "heute",
        institutionVn: "DMF Vietnam Academy",
        institutionDe: "DMF Vietnam Academy",
        location: "Vietnam",
        degreeVn: `Đào tạo tiếng Đức (${level}) & Định hướng nghề`,
        degreeDe: `Intensivsprachkurs Deutsch (${level}) & Fachvorbereitung`,
        detailsDe: c.notes || "",
      },
    ],
    work_experience: [],
    language_skills: [
      {
        languageVn: "Tiếng Việt",
        languageDe: "Vietnamesisch",
        level: "Muttersprache",
        provider: "",
      },
      {
        languageVn: "Tiếng Đức",
        languageDe: "Deutsch",
        level,
        provider: "Goethe / Telc",
      },
    ],
    special_skills: {
      drivingLicenseDe: "",
      edvSkillsDe: "MS Office",
      professionalSkillsDe: "Zuverlässig, teamfähig, hohe Lernbereitschaft",
      hobbiesDe: "",
    },
    video_url: c.video_url,
    interview_script_de: "",
    interview_qa: [],
    signature_data_url: null,
    signature_place: "Ho-Chi-Minh-Stadt",
    signature_updated_at: c.updated_at,
    dsgvo_consent_accepted: Boolean(c.visa_status),
    dsgvo_consent_signed_at: c.updated_at,
    vollmacht_accepted: Boolean(c.visa_status),
    vollmacht_signed_at: c.updated_at,
    vollmacht_employer_name: "",
    sync_status: "approved",
    admin_feedback: c.notes,
    last_synced_at: c.updated_at,
    last_synced_by: null,
    created_at: c.created_at,
    updated_at: c.updated_at,
  };
}

export async function getRequestDossierBundle(): Promise<{
  profiles: StudentProfile[];
  documents: StudentDocument[];
  letters: StudentMotivationLetter[];
}> {
  try {
    const { supabase } = await requireAdmin();
    const [profilesRes, docsRes, lettersRes, candidatesRes] = await Promise.all([
      supabase.from("student_profiles").select("*").order("updated_at", { ascending: false }),
      supabase.from("student_documents").select("*").order("created_at", { ascending: false }),
      supabase
        .from("student_motivation_letters")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("candidates").select("*").order("updated_at", { ascending: false }),
    ]);

    const portalProfiles = ((profilesRes.data as StudentProfile[]) || []).map((p) => ({
      ...p,
      education_history: Array.isArray(p.education_history) ? p.education_history : [],
      work_experience: Array.isArray(p.work_experience) ? p.work_experience : [],
      language_skills: Array.isArray(p.language_skills) ? p.language_skills : [],
      interview_qa: Array.isArray(p.interview_qa) ? p.interview_qa : [],
      special_skills: p.special_skills || {
        drivingLicenseDe: "",
        edvSkillsDe: "",
        professionalSkillsDe: "",
        hobbiesDe: "",
      },
    }));

    const linkedCandidateIds = new Set(
      portalProfiles.map((p) => p.candidate_id).filter((id): id is string => Boolean(id))
    );

    const b2bFallbacks = ((candidatesRes.data as CandidateTableRow[]) || [])
      .filter((c) => !linkedCandidateIds.has(c.id))
      .map(mapB2BCandidateToFallbackProfile);

    return {
      profiles: [...portalProfiles, ...b2bFallbacks],
      documents: (docsRes.data as StudentDocument[]) || [],
      letters: (lettersRes.data as StudentMotivationLetter[]) || [],
    };
  } catch {
    return {
      profiles: [],
      documents: [],
      letters: [],
    };
  }
}

export async function tailorRequestAnschreibenAction(input: {
  profile: StudentProfile;
  companyName: string;
  contactPerson: string;
  workLocation: string;
  startWindow: string;
  inquiryMessage: string;
}): Promise<{
  success: boolean;
  error: string | null;
  data?: {
    subject_de: string;
    salutation_de: string;
    body_de: string;
    closing_de: string;
  };
}> {
  try {
    await requireAdmin();
    const generated = await generateDin5008MotivationLetter({
      profile: input.profile,
      targetCompanyName: input.companyName || "Ausbildungs- und Fachkräftebetrieb",
      targetCity: input.workLocation || "Deutschland",
      targetContactPerson: input.contactPerson || "",
      targetPositionDe: input.profile.target_profession || "Fachkraft / Auszubildende(r)",
      answers: {
        whyProfessionVn: `Đam mê phát triển sự nghiệp trong ngành ${input.profile.target_profession || "chuyên môn"} tại Đức.`,
        practicalExperienceVn:
          input.profile.work_experience[0]?.tasksDe ||
          input.profile.education_history[0]?.degreeDe ||
          "Đã được đào tạo bài bản về tiếng Đức và kỹ năng thực hành nghề tại DMF Vietnam Academy.",
        whyGermanyAndCompanyVn: `Đặc biệt ấn tượng với môi trường làm việc chuyên nghiệp của ${input.companyName || "Quý doanh nghiệp"} tại ${input.workLocation || "Đức"}. ${input.inquiryMessage ? `Đáp ứng nhu cầu: ${input.inquiryMessage.slice(0, 160)}` : ""}`,
        personalStrengthsVn:
          input.profile.special_skills?.professionalSkillsDe ||
          "Đúng giờ, kỷ luật, tinh thần học hỏi cao và làm việc nhóm tốt.",
        futurePlanVn: "Gắn bó lâu dài và đóng góp tích cực cho sự phát triển của doanh nghiệp.",
        earliestStartDateDe: input.startWindow || "01.09.2026",
      },
    });

    return {
      success: true,
      error: null,
      data: generated,
    };
  } catch {
    return {
      success: false,
      error: "Không thể khởi tạo Anschreiben tự động cho doanh nghiệp này.",
    };
  }
}
