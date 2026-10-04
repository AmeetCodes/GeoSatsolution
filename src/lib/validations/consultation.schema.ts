import { z } from "zod";

const EMAIL_MAX = 254;

export function createConsultationSchema(interests: readonly string[]) {
  const validInterests = new Set(interests);

  return z
    .object({
      name: z
        .string({ error: "Enter your full name." })
        .trim()
        .min(2, "Enter your full name.")
        .max(120, "Enter your full name."),
      organisation: z
        .string({ error: "Organisation is invalid." })
        .trim()
        .max(160, "Organisation is too long.")
        .optional()
        .default(""),
      email: z
        .string({ error: "Enter a valid email address." })
        .trim()
        .max(EMAIL_MAX, "Enter a valid email address.")
        .min(1, "Enter a valid email address.")
        .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email address."),
      phone: z
        .string({ error: "Enter a valid phone number." })
        .trim()
        .max(60, "Phone number is too long.")
        .optional()
        .default(""),
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
      details: z
        .string({ error: "Add a few details so our team can prepare." })
        .trim()
        .min(12, "Add a few details so our team can prepare.")
        .max(3000, "Add a few details so our team can prepare."),
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

      if (value.interest === "Other" && value.otherInterest.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["otherInterest"],
          message: "Tell us what service you need.",
        });
      }
    });
}

export type ConsultationInput = z.output<ReturnType<typeof createConsultationSchema>>;
