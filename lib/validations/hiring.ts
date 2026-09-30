import { z } from "zod";
import { optionalBusinessPhoneSchema } from "./phone";

export const serviceSchema = z.enum(["skilled", "azubi", "seasonal", "unsure"]);
export type HiringService = z.infer<typeof serviceSchema>;
export const requestContextSchema = z.object({
  sourcePath: z
    .string()
    .max(300)
    .regex(/^\/[a-zA-Z0-9/_-]*$/)
    .optional(),
  campaign: z
    .object({
      source: z
        .string()
        .max(100)
        .regex(/^[\w .-]*$/)
        .optional(),
      medium: z
        .string()
        .max(100)
        .regex(/^[\w .-]*$/)
        .optional(),
      campaign: z
        .string()
        .max(100)
        .regex(/^[\w .-]*$/)
        .optional(),
    })
    .optional(),
});

export const hiringFormSchema = z.object({
  company: z.string().trim().min(2, "Bitte geben Sie Ihr Unternehmen an.").max(500),
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(200),
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(320),
  service: serviceSchema,
  message: z
    .string()
    .trim()
    .min(10, "Bitte beschreiben Sie Ihren Bedarf mit mindestens 10 Zeichen.")
    .max(10000),
  phone: optionalBusinessPhoneSchema,
  location: z.string().trim().max(200).optional(),
  timing: z.string().trim().max(200).optional(),
  headcount: z
    .union([
      z.literal(""),
      z
        .string()
        .regex(/^\d+$/)
        .refine(
          (v) => Number(v) >= 1 && Number(v) <= 1000,
          "Bitte wählen Sie 1 bis 1000 Personen."
        ),
    ])
    .optional(),
  privacy: z.boolean().refine(Boolean, "Bitte bestätigen Sie den Datenschutzhinweis."),
  bot_check: z.string().max(0).optional(),
});
export type HiringFormValues = z.infer<typeof hiringFormSchema>;
export const hiringIntakeSchema = hiringFormSchema.omit({ headcount: true }).extend({
  email: z
    .email()
    .trim()
    .max(320)
    .transform((v) => v.toLowerCase()),
  privacy: z.literal(true),
  headcount: z.number().int().min(1).max(1000).optional(),
  candidateId: z.uuid().optional(),
  ...requestContextSchema.shape,
});
