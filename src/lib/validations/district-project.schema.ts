import { z } from "zod";
import { NEPAL_DISTRICT_NAMES } from "@/lib/data/nepal-districts";

const districtName = z
  .string({ error: "Choose a valid district." })
  .trim()
  .min(1, "Choose a valid district.")
  .refine(
    (value) => NEPAL_DISTRICT_NAMES.includes(value),
    "Choose a valid district in Nepal.",
  );

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .default("");

const patchText = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional();

const coordinate = z
  .number({ error: "Enter a valid coordinate." })
  .refine((value) => Number.isFinite(value), "Enter a valid coordinate.");

export const districtProjectStatusSchema = z.enum(["COMPLETED", "ONGOING"]);

export const createDistrictProjectSchema = z.object({
  district: districtName,
  title: optionalText(200),
  category: optionalText(120),
  status: districtProjectStatusSchema.optional().default("COMPLETED"),
  latitude: coordinate.optional(),
  longitude: coordinate.optional(),
});

export const incrementDistrictProjectSchema = z.object({
  district: districtName,
  title: optionalText(200),
  category: optionalText(120),
  status: districtProjectStatusSchema.optional().default("COMPLETED"),
});

export const updateDistrictProjectSchema = z
  .object({
    district: districtName.optional(),
    title: patchText(200),
    category: patchText(120),
    status: districtProjectStatusSchema.optional(),
    latitude: coordinate.nullable().optional(),
    longitude: coordinate.nullable().optional(),
  })
  .refine(
    (value) => Object.values(value).some((entry) => entry !== undefined),
    "Provide at least one field to update.",
  );

export type CreateDistrictProjectInput = z.output<typeof createDistrictProjectSchema>;
export type IncrementDistrictProjectInput = z.output<typeof incrementDistrictProjectSchema>;
export type UpdateDistrictProjectInput = z.output<typeof updateDistrictProjectSchema>;

export const districtProjectsRequestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), data: createDistrictProjectSchema }),
  z.object({ action: z.literal("increment"), data: incrementDistrictProjectSchema }),
  z.object({ action: z.literal("decrement"), data: z.object({ district: districtName }) }),
  z.object({ action: z.literal("update"), id: z.string().min(1), data: updateDistrictProjectSchema }),
  z.object({ action: z.literal("delete"), id: z.string().min(1) }),
]);

export type DistrictProjectsRequest = z.output<typeof districtProjectsRequestSchema>;
