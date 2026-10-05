import { z } from "zod";

import { requiredText, textList, uniqueBy, optionalText, slugSchema, imageSchema } from "./shared.schema";

export const productItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Product id is invalid").optional(),
  title: requiredText(160, "Product title"),
  slug: slugSchema.optional(),
  group: requiredText(120, "Product group"),
  intro: optionalText(600, "Product intro"),
  description: optionalText(5000, "Product description"),
  outcomes: textList(40, 300, "Product outcomes"),
  images: z.array(imageSchema).max(4, "A product may use one main image and up to three carousel images").default([]),
  specifications: z.record(z.string(), z.string()).default({}),
  faqs: z.array(z.object({ question: requiredText(300, "FAQ question"), answer: requiredText(3000, "FAQ answer") })).max(50).default([]),
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
