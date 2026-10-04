import { z } from "zod";

import { requiredText, optionalText } from "./shared.schema";
import { solutionListSchema } from "./solution.schema";
import { productListSchema } from "./product.schema";
import { industryListSchema } from "./industry.schema";
import { articleListSchema } from "./article.schema";
import { careerListSchema } from "./career.schema";

export const leaderSchema = z.object({
  name: requiredText(160, "Leader name"),
  role: requiredText(160, "Leader role"),
  division: optionalText(160, "Leader division"),
  bio: optionalText(4000, "Leader bio"),
});

export const partnerSchema = z.object({
  id: requiredText(120, "Partner id"),
  name: requiredText(160, "Partner name"),
  category: optionalText(120, "Partner category"),
  tier: optionalText(120, "Partner tier"),
  description: optionalText(1000, "Partner description"),
});

export const companySchema = z.object({
  Leadership: z.array(leaderSchema).max(200, "Too many leaders").default([]),
  Partners: z.array(partnerSchema).max(500, "Too many partners").default([]),
  Insights: articleListSchema.default([]),
  Careers: careerListSchema.default([]),
});

export const siteContentSchema = z.object({
  Solutions: solutionListSchema.default([]),
  Products: productListSchema.default([]),
  Industries: industryListSchema.default([]),
  Company: companySchema,
});

export const SITE_CONTENT_SECTIONS = [
  "Solutions",
  "Products",
  "Industries",
  "Company",
] as const;

export type SiteContentSection = (typeof SITE_CONTENT_SECTIONS)[number];

export const siteContentSectionSchema = z.enum(SITE_CONTENT_SECTIONS, {
  error: "Unknown content section",
});

export const siteContentSectionPayloadSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("Solutions"), data: solutionListSchema }),
  z.object({ section: z.literal("Products"), data: productListSchema }),
  z.object({ section: z.literal("Industries"), data: industryListSchema }),
  z.object({ section: z.literal("Company"), data: companySchema }),
]);

export const siteContentSectionPayloadSchemas = {
  Solutions: solutionListSchema,
  Products: productListSchema,
  Industries: industryListSchema,
  Company: companySchema,
} as const;

export const adminContentRequestSchema = z
  .object({
    action: z.enum(["reset", "update-all"], { error: "Unknown action" }).optional(),
    section: siteContentSectionSchema.optional(),
    data: z.unknown().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.action && value.section) {
      ctx.addIssue({
        code: "custom",
        path: ["section"],
        message: "Send either an action or a content section, not both",
      });
      return;
    }

    if (!value.action && !value.section) {
      ctx.addIssue({
        code: "custom",
        message: "Provide either an action or a content section",
      });
      return;
    }

    const needsData = value.action === "update-all" || Boolean(value.section);

    if (needsData && value.data === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["data"],
        message:
          value.action === "update-all"
            ? "Full site content is required"
            : "Section data is required",
      });
    }
  });

export type SiteContentInput = z.output<typeof siteContentSchema>;
export type AdminContentRequestInput = z.output<typeof adminContentRequestSchema>;
