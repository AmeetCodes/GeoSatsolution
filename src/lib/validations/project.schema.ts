import { z } from "zod";

import { requiredText, textList, uniqueBy } from "./shared.schema";

export const projectItemSchema = z.object({
  code: requiredText(40, "Project code"),
  title: requiredText(180, "Project title"),
  sector: requiredText(160, "Project sector"),
  body: requiredText(5000, "Project description"),
  tags: textList(30, 80, "Project tag"),
});

export const projectListSchema = uniqueBy(projectItemSchema, {
  max: 100,
  maxMessage: "Projects are limited to 100 records",
  key: (project) => project.code.toLowerCase(),
  label: "project code",
});