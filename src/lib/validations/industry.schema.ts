import { z } from "zod";

import { requiredText, textList, uniqueBy, optionalText } from "./shared.schema";

export const industryItemSchema = z.object({
  title: requiredText(160, "Industry title"),
  intro: optionalText(600, "Industry intro"),
  description: optionalText(5000, "Industry description"),
  items: textList(60, 200, "Industry focus areas"),
});

export const industryListSchema = uniqueBy(industryItemSchema, {
  max: 200,
  maxMessage: "Too many industries",
  key: (industry) => industry.title.toLowerCase(),
  label: "industry title",
});

export type IndustryInput = z.output<typeof industryItemSchema>;
