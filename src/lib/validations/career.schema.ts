import { z } from "zod";

import { requiredText, textList, uniqueBy, optionalText, slugSchema } from "./shared.schema";

export const careerSchema = z.object({
  slug: slugSchema,
  title: requiredText(160, "Role title"),
  category: requiredText(120, "Role category"),
  location: requiredText(120, "Role location"),
  summary: optionalText(600, "Role summary"),
  responsibilities: textList(50, 500, "Responsibilities"),
  requirements: textList(50, 500, "Requirements"),
});

export const careerListSchema = uniqueBy(careerSchema, {
  max: 300,
  maxMessage: "Too many roles",
  key: (career) => career.slug,
  label: "role slug",
});

export type CareerInput = z.output<typeof careerSchema>;
