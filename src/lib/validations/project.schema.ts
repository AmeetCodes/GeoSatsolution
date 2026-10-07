import { z } from "zod";

import { imageSchema, requiredText, textList, uniqueBy } from "./shared.schema";

const projectImageListSchema = z.array(imageSchema.superRefine((image, ctx) => {
  if (image.source === "upload" && image.mediaId && image.src !== `/api/media/${image.mediaId}`) {
    ctx.addIssue({ code: "custom", path: ["src"], message: "Uploaded project images must reference their stored media record." });
  }
})).max(30, "A project is limited to 30 images").default([]);

export const projectItemSchema = z.object({
  code: requiredText(40, "Project code"),
  title: requiredText(180, "Project title"),
  sector: requiredText(160, "Project sector"),
  body: requiredText(5000, "Project description"),
  tags: textList(30, 80, "Project tag"),
  images: projectImageListSchema,
  isPublished: z.boolean().default(true),
});

export const projectListSchema = uniqueBy(projectItemSchema, {
  max: 100,
  maxMessage: "Projects are limited to 100 records",
  key: (project) => project.code.toLowerCase(),
  label: "project code",
});
