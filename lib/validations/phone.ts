import { z } from "zod";
import { isValidBusinessPhone, BUSINESS_PHONE_ERROR_MESSAGE } from "@/lib/validations/phone-rules";
export {
  isValidBusinessPhone,
  normalizePhoneNumber,
  BUSINESS_PHONE_ERROR_MESSAGE,
} from "@/lib/validations/phone-rules";

export const optionalBusinessPhoneSchema = z
  .string()
  .max(50)
  .optional()
  .refine(isValidBusinessPhone, {
    message: BUSINESS_PHONE_ERROR_MESSAGE,
  });
