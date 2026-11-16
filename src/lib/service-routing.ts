import { normalizeSlug } from "@/lib/utils";

const LEGACY_SERVICE_ALIASES = [
  {
    oldTitle: "UAV LiDAR Survey",
    oldSlug: "uav-lidar-survey",
    title: "LiDAR Survey",
    slug: "lidar-survey",
  },
  {
    oldTitle: "Spatial Database & GIS Solutions",
    oldSlug: "spatial-database-and-gis-solutions",
    title: "Spatial Database & GIS Services",
    slug: "spatial-database-and-gis-services",
  },
] as const;

function findLegacyServiceAlias(title?: string, slug?: string) {
  const normalizedTitle = title?.trim().toLowerCase();
  const normalizedSlug = normalizeSlug(slug ?? "");
  return LEGACY_SERVICE_ALIASES.find(
    (alias) => normalizedTitle === alias.oldTitle.toLowerCase() || normalizedSlug === alias.oldSlug,
  );
}

export function canonicalServiceTitle(title: string, slug?: string): string {
  return findLegacyServiceAlias(title, slug)?.title ?? title;
}

export function canonicalServiceSlug(title?: string, slug?: string): string {
  const alias = findLegacyServiceAlias(title, slug);
  if (alias) return alias.slug;
  return normalizeSlug(slug || title || "");
}

export function legacyServiceSlug(canonicalSlug: string): string | undefined {
  return LEGACY_SERVICE_ALIASES.find((alias) => alias.slug === normalizeSlug(canonicalSlug))?.oldSlug;
}

export function legacyServiceTitle(canonicalSlug: string): string | undefined {
  return LEGACY_SERVICE_ALIASES.find((alias) => alias.slug === normalizeSlug(canonicalSlug))?.oldTitle;
}

export function canonicalServiceHref(href: string): string {
  const canonicalPath = href.replace(/^\/solutions(?=\/|#|\?|$)/i, "/services");
  return LEGACY_SERVICE_ALIASES.reduce(
    (path, alias) => path.replace(new RegExp(`/${alias.oldSlug}(?=[?#]|$)`, "i"), `/${alias.slug}`),
    canonicalPath,
  );
}
