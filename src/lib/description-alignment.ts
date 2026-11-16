export type DescriptionAlignment = "justify" | "left";

export const DEFAULT_DESCRIPTION_ALIGNMENT: DescriptionAlignment = "justify";

export function resolveDescriptionAlignment(
  value?: string | null,
): DescriptionAlignment {
  return value === "left" ? "left" : DEFAULT_DESCRIPTION_ALIGNMENT;
}
