import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200, "Slug must be 200 characters or fewer")
  .regex(SLUG_PATTERN, "Slug may only contain lowercase letters, numbers and hyphens");

export function requiredText(max: number, field: string) {
  return z
    .string()
    .trim()
    .min(1, `${field} is required`)
    .max(max, `${field} must be ${max} characters or fewer`);
}

export function optionalText(max: number, field: string) {
  return z
    .string()
    .trim()
    .max(max, `${field} must be ${max} characters or fewer`)
    .optional()
    .default("");
}

export function textList(maxItems: number, maxLength: number, field: string) {
  return z
    .array(
      z
        .string()
        .trim()
        .min(1, `${field} entries cannot be empty`)
        .max(maxLength, `${field} entries must be ${maxLength} characters or fewer`),
    )
    .max(maxItems, `${field} is limited to ${maxItems} entries`)
    .default([]);
}

export function orderSchema() {
  return z
    .number({ error: "Order must be a number" })
    .int("Order must be a whole number")
    .min(0, "Order cannot be negative")
    .max(10_000, "Order is out of range");
}

export const imageSchema = z.object({
  src: z
    .string()
    .trim()
    .min(1, "Image source is required")
    .max(2048, "Image source must be 2048 characters or fewer")
    .refine(
      (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
      "Image source must be an http(s) URL or a site-relative path",
    ),
  alt: optionalText(200, "Image alt text"),
  caption: optionalText(300, "Image caption"),
  source: z.enum(["upload", "url"]).optional(),
  mediaId: z.string().regex(/^[a-f\d]{24}$/i, "Media id is invalid").optional(),
}).superRefine((image, ctx) => {
  if (image.source === "upload" && (!image.mediaId || !image.src.startsWith("/api/media/"))) {
    ctx.addIssue({ code: "custom", path: ["src"], message: "Uploaded images must reference stored media." });
  }
});

export const imageListSchema = z
  .array(imageSchema)
  .max(30, "A record is limited to 30 images")
  .default([]);

export function idListSchema(field: string) {
  return z
    .array(requiredText(200, field))
    .max(500, `${field} is limited to 500 entries`);
}

export function uniqueBy<T extends z.ZodType>(
  itemSchema: T,
  options: {
    max: number;
    maxMessage: string;
    key: (item: z.output<T>) => string;
    label: string;
  },
) {
  return z
    .array(itemSchema)
    .max(options.max, options.maxMessage)
    .superRefine((items, ctx) => {
      const seen = new Set<string>();

      items.forEach((item, index) => {
        const value = options.key(item);

        if (seen.has(value)) {
          ctx.addIssue({
            code: "custom",
            path: [index],
            message: `Duplicate ${options.label}: "${value}"`,
          });
        }

        seen.add(value);
      });
    });
}
