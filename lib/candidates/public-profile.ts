import { z } from "zod";

export const publicCandidateDocumentSchema = z.object({
  label: z.string().min(1),
  type: z.enum(["cv", "motivation", "certificate", "dossier"]),
  url: z.string().min(1),
});

export type PublicCandidateDocument = z.infer<typeof publicCandidateDocumentSchema>;

// This allowlist is also enforced at runtime: unknown fields never enter public props.
const publicCandidateSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["azubi", "skilled", "seasonal"]),
  profession: z.string().nullish(),
  experience_years: z.number().nonnegative().nullish(),
  german_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).nullish(),
  visa_status: z.boolean(),
  avatar_url: z.string().nullish(),
  video_url: z.string().nullish(),
  pool_stage: z
    .enum(["a_niveau", "b_niveau", "b1_b2_exam", "interview_ready", "in_germany"])
    .nullish(),
  cohort: z.string().nullish(),
  display_code: z.string().nullish(),
  initials_label: z.string().nullish(),
  availability_label: z.string().nullish(),
  highlights: z.array(z.string()).nullish(),
  documents: z.array(publicCandidateDocumentSchema).nullish(),
});

export type PublicCandidate = z.infer<typeof publicCandidateSchema>;

export const PUBLIC_CANDIDATE_FIELDS =
  "id, category, profession, experience_years, german_level, visa_status, avatar_url, video_url";

export function toPublicCandidates(rows: unknown[]): PublicCandidate[] {
  return rows.flatMap((row) => {
    const parsed = publicCandidateSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
}
