import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .max(254, "Email must be 254 characters or fewer"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password must be 200 characters or fewer"),
  rememberMe: z.boolean().optional().default(false),
});

export type AdminLoginInput = z.output<typeof adminLoginSchema>;
