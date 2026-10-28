import { z } from "zod";

export const inquiryStatusSchema = z.enum([
  "pending",
  "contacted",
  "completed",
  "archived",
]);

export const updateInquirySchema = z.object({
  id: z
    .string({ error: "Inquiry reference is required." })
    .trim()
    .regex(/^[a-f0-9]{24}$/i, "Inquiry reference is invalid."),
  status: inquiryStatusSchema,
});

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
