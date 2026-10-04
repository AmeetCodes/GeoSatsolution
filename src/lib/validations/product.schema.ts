import { z } from "zod";

import { requiredText, textList, uniqueBy, imageListSchema, optionalText } from "./shared.schema";

export const productItemSchema = z.object({
  title: requiredText(160, "Product title"),
  group: requiredText(120, "Product group"),
  intro: optionalText(600, "Product intro"),
  description: optionalText(5000, "Product description"),
  outcomes: textList(40, 300, "Product outcomes"),
  images: imageListSchema,
});

export const productListSchema = uniqueBy(productItemSchema, {
  max: 500,
  maxMessage: "Too many products",
  key: (product) => product.title.toLowerCase(),
  label: "product title",
});

export type ProductInput = z.output<typeof productItemSchema>;
