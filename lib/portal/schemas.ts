import { z } from "zod";
import { extractYouTubeVideoId } from "@/lib/utils/youtube";

export const programTrackSchema = z.enum(["azubi", "skilled", "studium", "seasonal"]);

export const educationEntrySchema = z.object({
  id: z.string().min(1),
  fromMonth: z.string().min(4, "Vui lòng nhập tháng bắt đầu (YYYY-MM)"),
  toMonth: z.string().min(4, "Vui lòng nhập tháng kết thúc (YYYY-MM hoặc heute)"),
  institutionVn: z.string().max(200),
  institutionDe: z.string().max(200),
  location: z.string().max(120),
  degreeVn: z.string().max(200),
  degreeDe: z.string().max(200),
  detailsDe: z.string().max(1000),
});

export const workExperienceEntrySchema = z.object({
  id: z.string().min(1),
  fromMonth: z.string().min(4, "Vui lòng nhập tháng bắt đầu (YYYY-MM)"),
  toMonth: z.string().min(4, "Vui lòng nhập tháng kết thúc (YYYY-MM hoặc heute)"),
  company: z.string().max(200),
  location: z.string().max(120),
  roleVn: z.string().max(200),
  roleDe: z.string().max(200),
  tasksVn: z.string().max(1500),
  tasksDe: z.string().max(1500),
});

export const languageSkillEntrySchema = z.object({
  languageDe: z.string().max(100),
  languageVn: z.string().max(100),
  level: z.string().max(50),
  provider: z.string().max(100).optional(),
  examDate: z.string().max(30).optional(),
  scores: z
    .object({
      lesen: z.string().max(20).optional(),
      hoeren: z.string().max(20).optional(),
      schreiben: z.string().max(20).optional(),
      sprechen: z.string().max(20).optional(),
    })
    .optional(),
});

export const specialSkillsSchema = z.object({
  drivingLicenseDe: z.string().max(200),
  edvSkillsDe: z.string().max(300),
  professionalSkillsDe: z.string().max(500),
  hobbiesDe: z.string().max(300),
});

export const studentProfileUpdateSchema = z.object({
  program_track: programTrackSchema,
  full_name: z.string().trim().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(200),
  given_name: z.string().trim().max(100),
  family_name: z.string().trim().max(100),
  phone: z.string().trim().max(50),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày sinh YYYY-MM-DD")
    .nullable()
    .optional()
    .or(z.literal("")),
  place_of_birth: z.string().trim().max(150),
  nationality: z.string().trim().max(100),
  marital_status: z.string().trim().max(100),
  passport_number: z.string().trim().max(40),
  passport_expiry: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày hết hạn YYYY-MM-DD")
    .nullable()
    .optional()
    .or(z.literal("")),
  address_street: z.string().trim().max(200),
  address_city: z.string().trim().max(120),
  address_country: z.string().trim().max(100),
  avatar_url: z.string().url().nullable().optional().or(z.literal("")),
  target_profession: z.string().trim().max(200),
  experience_years: z.number().min(0).max(50),
  german_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  education_history: z.array(educationEntrySchema),
  work_experience: z.array(workExperienceEntrySchema),
  language_skills: z.array(languageSkillEntrySchema),
  special_skills: specialSkillsSchema,
  video_url: z
    .string()
    .nullable()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || !!extractYouTubeVideoId(value) || value.startsWith("https://"),
      "Vui lòng nhập đường dẫn Video hợp lệ (YouTube hoặc link lưu trữ)."
    ),
  interview_script_de: z.string().max(6000),
});

export const motivationPromptAnswersSchema = z.object({
  whyProfessionVn: z.string().max(1500),
  practicalExperienceVn: z.string().max(1500),
  whyGermanyAndCompanyVn: z.string().max(1500),
  personalStrengthsVn: z.string().max(1500),
  futurePlanVn: z.string().max(1500),
  earliestStartDateDe: z.string().max(100),
});

export const studentMotivationLetterSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, "Vui lòng đặt tên phiên bản thư").max(200),
  is_primary: z.boolean(),
  target_company_name: z.string().trim().max(200),
  target_company_address: z.string().trim().max(300),
  target_city: z.string().trim().max(120),
  target_contact_person: z.string().trim().max(150),
  target_position_de: z.string().trim().max(200),
  prompt_answers: motivationPromptAnswersSchema,
  subject_de: z.string().trim().max(250),
  salutation_de: z.string().trim().max(150),
  body_de: z.string().max(8000),
  closing_de: z.string().trim().max(150),
});

export const legalSignatureSchema = z.object({
  signature_data_url: z
    .string()
    .min(20, "Vui lòng ký tên vào khung hoặc tải lên ảnh chữ ký.")
    .max(500000),
  signature_place: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập nơi ký (VD: Ho-Chi-Minh-Stadt)")
    .max(120),
  dsgvo_consent_accepted: z.boolean(),
  vollmacht_accepted: z.boolean(),
  vollmacht_employer_name: z.string().trim().max(200),
});
