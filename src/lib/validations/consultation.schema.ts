import { z } from "zod";

import {
  isValidEmail,
  isValidOrganisation,
  isValidPhone,
  isHumanName,
  isMeaningfulLabel,
  isMeaningfulMessage,
} from "./text.rules";

export function createConsultationSchema(interests: readonly string[]) {
  const validInterests = new Set(interests);

  return z
    .object({
      name: z
        .string({ error: "Enter your full name." })
        .trim()
        .min(2, "Enter your full name.")
        .max(80, "Enter your full name.")
        .refine((value) => isHumanName(value), "Enter a valid full name (letters only)."),
      organisation: z
        .string({ error: "Enter a valid organisation name." })
        .trim()
        .max(160, "Organisation name must be 160 characters or fewer.")
        .optional()
        .default("")
        .refine(
          (value) => value.length === 0 || isValidOrganisation(value),
          "Enter a valid organisation name.",
        ),
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
      interest: z
        .string({ error: "Choose a valid area of interest." })
        .trim()
        .min(1, "Choose a valid area of interest.")
        .refine(
          (value) => value === "Other" || validInterests.has(value),
          "Choose a valid area of interest.",
        ),
      otherInterest: z
        .string({ error: "Tell us what service you need." })
        .trim()
        .max(160, "Service description is too long.")
        .optional()
        .default(""),
      type: z.enum(["CONSULTATION", "ASSESSMENT"]).optional().default("CONSULTATION"),
      details: z
        .string({ error: "Add a few details so our team can prepare." })
        .trim()
        .min(15, "Add a few details so our team can prepare.")
        .max(3000, "Add a few details so our team can prepare.")
        .refine(
          (value) => isMeaningfulMessage(value),
          "Please describe your requirement in a few clear words.",
        ),
      website: z.unknown().optional(),
    })
    .superRefine((value, ctx) => {
      if (/[\r\n]/.test(value.email)) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email address.",
        });
      }

      if (value.interest === "Other") {
        if (value.otherInterest.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["otherInterest"],
            message: "Tell us what service you need.",
          });
        } else if (!isMeaningfulLabel(value.otherInterest)) {
          ctx.addIssue({
            code: "custom",
            path: ["otherInterest"],
            message: "Tell us what service you need in a few clear words.",
          });
        }
      }
    });
}

export type ConsultationInput = z.output<ReturnType<typeof createConsultationSchema>>;
