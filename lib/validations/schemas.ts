import { z } from "zod";

// --- 1. CONTACT FORM SCHEMA ---
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Ungültige Telefonnummer (min. 6 Zeichen)",
    }),
  company: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Ihre Nachricht sollte mindestens 10 Zeichen enthalten." }),
  privacy: z
    .boolean()
    .refine((val) => val === true, {
      message: "Sie müssen der Datenschutzerklärung zustimmen.",
    })
    .optional(), // Optional in schema, required in UI
  bot_check: z.string().optional(),
});

// --- 2. ADMIN ASSET UPDATE SCHEMA ---
export const assetUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.string().nullable(),
  asset_type: z.enum(["image", "text", "color", "boolean", "video"]),
});

// --- 3. INQUIRY / CANDIDATE CONTACT SCHEMA ---
export const inquiryFormSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Ihre Nachricht sollte mindestens 10 Zeichen enthalten." }),
});

// --- 4. CANDIDATE FORM SCHEMA (Full Schema for Admin) ---
export const candidateFormSchema = z.object({
  full_name: z.string().min(2, { message: "Name ist erforderlich (mindestens 2 Zeichen)" }),
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
  phone: z.string().optional(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Ungültiges Datumsformat (YYYY-MM-DD)" })
    .optional(),
  category: z.enum(["azubi", "skilled", "seasonal"], { message: "Ungültige Kategorie" }),
  profession: z.string().optional(),
  experience_years: z
    .number()
    .min(0)
    .max(50, { message: "Erfahrung muss zwischen 0 und 50 Jahren liegen" }),
  german_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"], {
    message: "Ungültiges Sprachniveau",
  }),
  visa_status: z.boolean(),
  is_featured: z.boolean(),
  notes: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  video_url: z.string().url().optional().or(z.literal("")),
});

// --- 5. POST FORM SCHEMA ---
export const postFormSchema = z.object({
  title: z.string().min(1, { message: "Titel ist erforderlich" }),
  slug: z.string().min(1, { message: "Slug ist erforderlich" }),
  excerpt: z.string().optional(),
  content: z.string().min(1, { message: "Inhalt ist erforderlich" }),
  cover_image: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"], { message: "Ungültiger Status" }),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

// --- 6. CANDIDATE APPLICATION SCHEMA (Client-side Application Form) ---
export const applicationSchema = z.object({
  fullName: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein" }),
  email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
  phone: z.string().min(6, { message: "Ungültige Telefonnummer" }),
  program: z.enum(["azubi", "skilled", "seasonal"], { message: "Ungültiges Programm" }),
  message: z.string().optional(),
  // File validation is handled separately in the component for simplicity
  cvFile: z.any().optional(),
});

// Export types based on schemas
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type AssetUpdateData = z.infer<typeof assetUpdateSchema>;
export type InquiryFormData = z.infer<typeof inquiryFormSchema>;
export type CandidateFormData = z.infer<typeof candidateFormSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
