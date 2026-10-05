import { z } from "zod";

import { requiredText, textList, uniqueBy, optionalText, slugSchema } from "./shared.schema";
import { imageSchema } from "./shared.schema";

export const isoDateSchema = z.iso.date("Publish date must be a valid YYYY-MM-DD date");

export const articleSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Article id is invalid").optional(),
  slug: slugSchema,
  title: requiredText(200, "Article title"),
  date: isoDateSchema,
  category: requiredText(80, "Article category"),
  excerpt: optionalText(400, "Article excerpt"),
  image: imageSchema.optional(),
  author: optionalText(160, "Article author"),
  isPublished: z.boolean().default(true),
  body: textList(200, 5000, "Article body"),
});

export const articleListSchema = uniqueBy(articleSchema, {
  max: 500,
  maxMessage: "Too many articles",
  key: (article) => article.slug,
  label: "article slug",
});

export type ArticleInput = z.output<typeof articleSchema>;
