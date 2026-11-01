import { industryService } from "@/lib/db/services/industry.service";
import type { ContentImage } from "@/lib/content-types";

export type Industry = {
  slug?: string;
  title: string;
  intro: string;
  description: string;
  items: string[];
  images: ContentImage[];
  isPublished?: boolean;
};

export function industrySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function industryPathSlug(industry: Pick<Industry, "title" | "slug">): string {
  return industry.slug || industrySlug(industry.title);
}

export async function getDynamicIndustries(): Promise<Industry[]> {
  try {
    const list = await industryService.getAllPublished();
    if (list && list.length > 0) {
      return list.map((item) => ({
        slug: item.slug,
        title: item.title,
        intro: item.intro || "",
        description: item.description || "",
        items: item.items || [],
        images: (item.images || []).map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption || "",
          source: image.source,
          mediaId: image.mediaId ? String(image.mediaId) : undefined,
        })),
        isPublished: item.isPublished,
      }));
    }
  } catch (err) {
    console.error("Error fetching dynamic industries:", err);
  }
  return [];
}

export async function getDynamicIndustryBySlug(slug: string): Promise<Industry | undefined> {
  try {
    const item = await industryService.getBySlug(slug, true);
    if (item) {
      return {
        slug: item.slug,
        title: item.title,
        intro: item.intro || "",
        description: item.description || "",
        items: item.items || [],
        images: (item.images || []).map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption || "",
          source: image.source,
          mediaId: image.mediaId ? String(image.mediaId) : undefined,
        })),
        isPublished: item.isPublished,
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic industry by slug:", err);
  }
  return undefined;
}
