import { z } from "zod";

import { requiredText, textList, uniqueBy, imageListSchema, optionalText, slugSchema } from "./shared.schema";

const faqListSchema = z.array(z.object({ question: requiredText(300, "FAQ question"), answer: requiredText(3000, "FAQ answer") })).max(50).default([]);

export const solutionItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Solution id is invalid").optional(),
  title: requiredText(160, "Solution title"),
  slug: slugSchema.optional(),
  group: requiredText(120, "Solution group"),
  intro: optionalText(600, "Solution intro"),
  description: optionalText(5000, "Solution description"),
  outcomes: textList(40, 300, "Solution outcomes"),
  images: imageListSchema,
  faqs: faqListSchema,
  isPublished: z.boolean().default(true),
});

const uniqueSolutionTitles = uniqueBy(solutionItemSchema, {
  max: 500,
  maxMessage: "Too many solutions",
  key: (solution) => solution.title.toLowerCase(),
  label: "solution title",
});

export const solutionListSchema = uniqueSolutionTitles.superRefine((items, ctx) => {
  const slugs = new Set<string>();
  items.forEach((item, index) => {
    const slug = item.slug || item.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (slugs.has(slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: `Duplicate solution slug: "${slug}"` });
    slugs.add(slug);
  });
});

export type SolutionInput = z.output<typeof solutionItemSchema>;
