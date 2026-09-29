import { z } from "zod";

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
