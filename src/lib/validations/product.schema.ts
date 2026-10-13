import { z } from "zod";

import { requiredText, textList, uniqueBy, optionalText, slugSchema, imageSchema } from "./shared.schema";

export const productItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Product id is invalid").optional(),
  title: requiredText(160, "Product title"),
  slug: slugSchema.optional(),
  group: requiredText(120, "Product group"),
  subcategory: optionalText(120, "Product subcategory"),
  brand: optionalText(120, "Product brand"),
  brandUrl: z.string().trim().max(2048).refine((val) => !val || /^https?:\/\//i.test(val) || val.startsWith("/"), "Brand URL must be valid").optional(),
  intro: optionalText(600, "Product intro"),
  description: optionalText(5000, "Product description"),
  outcomes: textList(40, 300, "Product outcomes"),
  images: z.array(imageSchema).max(4, "A product may use one main image and up to three carousel images").default([]),
  specifications: z.record(z.string(), z.string()).default({}),
  faqs: z.array(z.object({ question: requiredText(300, "FAQ question"), answer: requiredText(3000, "FAQ answer") })).max(50).default([]),
  resources: z.array(z.object({
    title: requiredText(200, "Download title"),
    fileUrl: z.string().trim().min(1).max(2048).refine((value) => (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value), "Download must use a site path or http(s) URL"),
    fileSource: z.enum(["upload", "url"]).optional(),
    fileMediaId: z.string().regex(/^[a-f\d]{24}$/i, "Download file media id is invalid").optional(),
    fileName: optionalText(200, "Download file name"),
  }).superRefine((file, ctx) => {
    if (file.fileSource === "upload" && (!file.fileMediaId || !file.fileUrl.startsWith(`/api/media/${file.fileMediaId}?download=1`))) {
      ctx.addIssue({ code: "custom", path: ["fileUrl"], message: "Uploaded downloads must reference their stored file." });
    }
  })).max(30, "A product may have up to 30 downloads").default([]),
  isPublished: z.boolean().default(true),
});

const uniqueProductTitles = uniqueBy(productItemSchema, {
  max: 500,
  maxMessage: "Too many products",
  key: (product) => product.title.toLowerCase(),
  label: "product title",
});

export const productListSchema = uniqueProductTitles.superRefine((items, ctx) => {
  const slugs = new Set<string>();
  items.forEach((item, index) => {
    const slug = item.slug || item.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (slugs.has(slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: `Duplicate product slug: "${slug}"` });
    slugs.add(slug);
  });
});

export type ProductInput = z.output<typeof productItemSchema>;
