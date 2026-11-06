import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const solutionSlug = slugify;

/** Lowercase a slug and remove whitespace or stray punctuation from its edges. */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Remove an accidental trailing numeric suffix, e.g. engineering-survey321. */
export function stripTrailingNumericSuffix(value: string): string {
  return normalizeSlug(value)
    .replace(/[-_]?\d+$/, "")
    .replace(/^-+|-+$/g, "");
}

export function getErrorMessage(error: unknown, fallback = "Internal server error"): string {
  return error instanceof Error ? error.message : fallback;
}
