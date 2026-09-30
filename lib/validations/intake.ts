import { z } from "zod";
import { optionalBusinessPhoneSchema } from "./phone";
import { leadRequestSchema } from "./public-intake";
import { requestContextSchema, type HiringService } from "./hiring";

const common = {
  name: z.string().trim().min(2).max(200),
  email: z
    .email()
    .trim()
    .max(320)
    .transform((value) => value.toLowerCase()),
  phone: optionalBusinessPhoneSchema,
  company: z.string().trim().max(500).optional(),
  message: z.string().trim().min(10).max(10000),
  privacy: z.literal(true),
  bot_check: z.string().max(0).optional(),
  ...requestContextSchema.shape,
};

export const contactIntakeSchema = z
  .object({
    ...common,
    type: z.enum(["contact", "profile"]).default("contact"),
    candidateId: z.uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "profile" && !data.candidateId)
      ctx.addIssue({ code: "custom", path: ["candidateId"], message: "Kandidat fehlt." });
  });

export const profileIntakeSchema = z.object({
  ...common,
  message: z
    .string()
    .trim()
    .max(10000)
    .default("Bitte senden Sie mir weitere Informationen zum Kandidatenprofil."),
  candidateId: z.uuid(),
});
export const chatLeadIntakeSchema = leadRequestSchema.extend({
  email: common.email,
  name: z.string().trim().max(200).optional(),
  ...requestContextSchema.shape,
});
export type IntakePayload = {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  message?: string;
  interest?: string;
  sessionId?: string;
  candidateId?: string;
  privacy?: boolean;
  type?: "contact" | "profile";
  requestPurpose?: "hiring";
  service?: HiringService;
  headcount?: number;
  location?: string;
  timing?: string;
  sourcePath?: string;
  campaign?: { source?: string; medium?: string; campaign?: string };
};
export type IntakeKind = "contact" | "profile" | "lead";
