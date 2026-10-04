import { z } from "zod";

import { requiredText, textList, uniqueBy, imageListSchema, optionalText } from "./shared.schema";

export const solutionItemSchema = z.object({
  title: requiredText(160, "Solution title"),
  group: requiredText(120, "Solution group"),
  intro: optionalText(600, "Solution intro"),
  description: optionalText(5000, "Solution description"),
  outcomes: textList(40, 300, "Solution outcomes"),
  images: imageListSchema,
});

export const solutionListSchema = uniqueBy(solutionItemSchema, {
  max: 500,
  maxMessage: "Too many solutions",
  key: (solution) => solution.title.toLowerCase(),
  label: "solution title",
});

export type SolutionInput = z.output<typeof solutionItemSchema>;
