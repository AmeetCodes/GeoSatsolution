import { z } from "zod";

import { requiredText, textList, uniqueBy, optionalText, slugSchema, imageListSchema } from "./shared.schema";

export const industryItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Industry id is invalid").optional(),
  title: requiredText(160, "Industry title"),
  slug: slugSchema.optional(),
  intro: optionalText(600, "Industry intro"),
  description: optionalText(5000, "Industry description"),
  items: textList(60, 200, "Industry focus areas"),
  images: imageListSchema,
  isPublished: z.boolean().default(true),
});

const uniqueIndustryTitles = uniqueBy(industryItemSchema, {
  max: 200,
  maxMessage: "Too many industries",
  key: (industry) => industry.title.toLowerCase(),
  label: "industry title",
});

export const industryListSchema = uniqueIndustryTitles.superRefine((items, ctx) => {
  const slugs = new Set<string>();
  items.forEach((item, index) => {
    const slug = item.slug || item.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (slugs.has(slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: `Duplicate industry slug: "${slug}"` });
    slugs.add(slug);
  });
});

export type IndustryInput = z.output<typeof industryItemSchema>;
