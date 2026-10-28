import { z } from "zod";

import { requiredText, optionalText, slugSchema, imageSchema, uniqueBy } from "./shared.schema";
import { solutionListSchema } from "./solution.schema";
import { productListSchema } from "./product.schema";
import { industryListSchema } from "./industry.schema";
import { articleListSchema } from "./article.schema";

const leaderItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Leader id is invalid").optional(),
  name: requiredText(160, "Leader name"),
  role: requiredText(160, "Leader role"),
  division: optionalText(160, "Leader division"),
  bio: optionalText(4000, "Leader bio"),
  expertise: optionalText(500, "Leader expertise"),
  image: z.object({
    src: requiredText(2048, "Leader image URL")
      .refine((value) => value.startsWith("/") || /^https?:\/\//i.test(value), "Leader image must be an http(s) URL or site-relative path"),
    alt: optionalText(200, "Leader image alt"),
    source: z.enum(["upload", "url"]).optional(),
    mediaId: z.string().regex(/^[a-f\d]{24}$/i, "Leader image media id is invalid").optional(),
  }).superRefine((image, ctx) => {
    if (image.source === "upload" && (!image.mediaId || image.src !== `/api/media/${image.mediaId}`)) {
      ctx.addIssue({ code: "custom", path: ["src"], message: "Uploaded leader images must reference their stored media record." });
    }
  }).optional(),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i, "Leader accent must be a hex color").optional(),
  imagePosition: z.enum(["center", "center top", "center bottom", "left center", "right center"]).optional(),
  order: z.number().int().nonnegative().optional(),
});

const galleryImageSchema = z.object({
  src: requiredText(2048, "Image URL").refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Image must be an http(s) URL or site-relative path",
  ),
  alt: optionalText(200, "Image alt text"),
  source: z.enum(["upload", "url"]).optional(),
  mediaId: z.string().regex(/^[a-f\d]{24}$/i, "Image media id is invalid").optional(),
}).superRefine((image, ctx) => {
  if (image.source === "upload" && (!image.mediaId || image.src !== `/api/media/${image.mediaId}`)) {
    ctx.addIssue({ code: "custom", path: ["src"], message: "Uploaded images must reference their stored media record." });
  }
});

export const leaderSchema = leaderItemSchema;

const partnerItemSchema = z.object({
  id: requiredText(120, "Partner id"),
  name: requiredText(160, "Partner name"),
  category: optionalText(120, "Partner category"),
  tier: optionalText(120, "Partner tier"),
  description: optionalText(1000, "Partner description"),
  url: z.string().trim().max(2048).optional().refine((value) => !value || /^https?:\/\//i.test(value) || value.startsWith("/"), "Partner URL must be an http(s) URL or site-relative path"),
  logo: galleryImageSchema.optional(),
  order: z.number().int().nonnegative().optional(),
});

export const partnerSchema = partnerItemSchema;

const clientItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Client id is invalid").optional(),
  name: requiredText(160, "Client name"),
  category: optionalText(120, "Client category"),
  description: optionalText(1000, "Client description"),
  image: galleryImageSchema.optional(),
  url: z.string().trim().max(2048).optional().refine((value) => !value || /^https?:\/\//i.test(value) || value.startsWith("/"), "Client URL must be an http(s) URL or site-relative path"),
  order: z.number().int().nonnegative().optional(),
});

const clientListSchema = z.array(clientItemSchema).max(500, "Too many clients").superRefine((items, ctx) => {
  const names = new Set<string>();
  items.forEach((item, index) => {
    const key = item.name.toLowerCase();
    if (names.has(key)) ctx.addIssue({ code: "custom", path: [index, "name"], message: `Duplicate client name: "${item.name}"` });
    names.add(key);
  });
});

const resourceItemSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Resource id is invalid").optional(),
  slug: slugSchema,
  title: requiredText(200, "Resource title"),
  category: requiredText(100, "Resource category"),
  description: optionalText(3000, "Resource description"),
  fileUrl: z.string().trim().max(2048).default("").refine((value) => !value || (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value), "Resource file URL must be an http(s) URL or site-relative path"),
  fileSource: z.enum(["upload", "url"]).optional(),
  fileMediaId: z.string().regex(/^[a-f\d]{24}$/i, "Resource file media id is invalid").optional(),
  fileName: optionalText(200, "Resource file name"),
  thumbnail: imageSchema.optional(),
  updated: z.iso.date().optional(),
  isPublished: z.boolean().default(true),
}).superRefine((resource, ctx) => {
  if (resource.fileSource === "upload" && (!resource.fileMediaId || !resource.fileUrl.startsWith(`/api/media/${resource.fileMediaId}?download=1`))) {
    ctx.addIssue({ code: "custom", path: ["fileUrl"], message: "Uploaded resources must reference their stored file." });
  }
});

const resourceListSchema = uniqueBy(resourceItemSchema, { max: 500, maxMessage: "Too many resources", key: (item) => item.slug, label: "resource slug" });

export const companySchema = z.object({
  Leadership: z.array(leaderItemSchema).max(200, "Too many leaders").default([]).superRefine((items, ctx) => {
    const names = new Set<string>();
    items.forEach((item, index) => { const key = item.name.toLowerCase(); if (names.has(key)) ctx.addIssue({ code: "custom", path: [index, "name"], message: `Duplicate leader name: "${item.name}"` }); names.add(key); });
  }),
  Partners: z.array(partnerItemSchema).max(500, "Too many partners").default([]).superRefine((items, ctx) => {
    const ids = new Set<string>();
    items.forEach((item, index) => { if (ids.has(item.id)) ctx.addIssue({ code: "custom", path: [index, "id"], message: `Duplicate partner id: "${item.id}"` }); ids.add(item.id); });
  }),
  Clients: clientListSchema.default([]),
  Insights: articleListSchema.default([]),
  Resources: resourceListSchema.default([]),
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
