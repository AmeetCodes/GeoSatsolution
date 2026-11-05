import { z } from "zod";

import {
  isValidEmail,
  isValidOrganisation,
  isValidPhone,
  isHumanName,
  isMeaningfulMessage,
} from "./text.rules";

export const productInquirySchema = z.object({
  name: z
    .string({ error: "Enter your full name." })
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Enter your full name.")
    .refine((value) => isHumanName(value), "Enter a valid full name (letters only)."),
  company: z
    .string({ error: "Enter a valid company name." })
    .trim()
    .max(160, "Company name must be 160 characters or fewer.")
    .optional()
    .default("")
    .refine((value) => value.length === 0 || isValidOrganisation(value), "Enter a valid company name."),
  email: z
    .string({ error: "Enter a valid email address." })
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Enter a valid email address.")
    .refine((value) => isValidEmail(value), "Enter a valid email address."),
  phone: z
    .string({ error: "Enter your phone number." })
    .trim()
    .min(1, "Enter your phone number.")
    .refine((value) => isValidPhone(value), "Enter a valid 10-digit phone number starting with 6-9."),
  product: z
    .string({ error: "Choose a product." })
    .trim()
    .min(1, "Choose a product.")
    .max(4000, "Too many products were selected."),
  details: z
    .string({ error: "Add a few details so the team can prepare the quote." })
    .trim()
    .min(15, "Add a few details so the team can prepare the quote.")
    .max(3000, "Add a few details so the team can prepare the quote.")
    .refine(
      (value) => isMeaningfulMessage(value),
      "Please describe your requirement in a few clear words.",
    ),
  website: z.unknown().optional(),
});

export type ProductInquiryInput = z.output<typeof productInquirySchema>;
