import { z } from "zod";
import { BUSINESS_PHONE_ERROR_MESSAGE, isValidBusinessPhone } from "./phone";

const contactFields = {
  email: z.email().max(320),
  company: z.string().max(500).optional(),
  phone: z
    .string()
    .max(50)
    .refine((value) => !value || isValidBusinessPhone(value), BUSINESS_PHONE_ERROR_MESSAGE)
    .optional(),
  interest: z.string().max(2000).optional(),
};

export const leadRequestSchema = z.object({
  ...contactFields,
  sessionId: z.string().min(1).max(200).optional(),
  source: z.string().max(100).optional(),
});

export const chatHistorySchema = z.object({
  sessionId: z.string().min(1).max(200),
  messages: z
    .array(
      z.object({
        id: z.string().max(200),
        role: z.enum(["user", "assistant"]),
        content: z.string().max(10000),
        timestamp: z.iso.datetime(),
      })
    )
    .max(200),
  leadData: z
    .object({ ...contactFields, email: z.union([z.email().max(320), z.literal("")]).optional() })
    .optional(),
});
