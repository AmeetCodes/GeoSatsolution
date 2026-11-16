import type { DescriptionAlignment, ImageFitMode, ImageFocalPosition } from "@/lib/content-types";
import { normalizeFaqs } from "@/lib/faq-defaults";
import { resolveDescriptionAlignment } from "@/lib/description-alignment";
import { solutionService } from "@/lib/db/services/solution.service";
import { canonicalServiceSlug, canonicalServiceTitle, legacyServiceSlug, legacyServiceTitle } from "@/lib/service-routing";
import { normalizeSlug } from "@/lib/utils";
import { DEFAULT_NAVIGATION_TREE } from "@/lib/tree-store";

export type SolutionImage = {
  src: string;
  alt: string;
  caption?: string;
  order?: number;
  fitMode?: ImageFitMode;
  focalPosition?: ImageFocalPosition;
};

export type Solution = {
  slug?: string;
  title: string;
  group: string;
  intro: string;
  description: string;
  descriptionAlignment?: DescriptionAlignment;
  outcomes: string[];
  faqs?: { question: string; answer: string; order?: number }[];
  images: SolutionImage[];
  isPublished?: boolean;
};

export function solutionSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function solutionPathSlug(solution: Pick<Solution, "title" | "slug">): string {
  return canonicalServiceSlug(solution.title, solution.slug) || normalizeSlug(solution.slug || solutionSlug(solution.title));
}

export async function getDynamicSolutions(): Promise<Solution[]> {
  try {
    const list = await solutionService.getAllPublished();
    if (list && list.length > 0) {
      return list.map((item) => ({
        slug: canonicalServiceSlug(item.title, item.slug),
        title: canonicalServiceTitle(item.title, item.slug),
        group: item.group,
        intro: item.intro || "",
        description: item.description || "",
        descriptionAlignment: resolveDescriptionAlignment(item.descriptionAlignment),
        outcomes: item.outcomes || [],
        faqs: normalizeFaqs(item.faqs),
        images: (item.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
          order: img.order,
          fitMode: img.fitMode,
          focalPosition: img.focalPosition,
        })),
        isPublished: item.isPublished,
      }));
    }
  } catch (err) {
    console.error("Error fetching dynamic solutions:", err);
  }
  return [];
}

export async function getDynamicSolutionBySlug(slug: string): Promise<Solution | undefined> {
  try {
    const canonicalSlug = canonicalServiceSlug(undefined, slug);
    const legacySlug = legacyServiceSlug(canonicalSlug);
    const legacyTitle = legacyServiceTitle(canonicalSlug);
    const item = await solutionService.getBySlug(canonicalSlug || slug, true)
      || (legacySlug ? await solutionService.getBySlug(legacySlug, true) : null)
      || (legacyTitle ? await solutionService.getByTitle(legacyTitle) : null);
    if (!item) {
      const defaultService = DEFAULT_NAVIGATION_TREE.tabs
        .flatMap((tab) => tab.columns.flatMap((column) =>
          column.items.map((service) => ({ service, group: column.title })),
        ))
        .find(({ service }) => canonicalServiceSlug(service.title, service.slug) === canonicalSlug);

      if (!defaultService) return undefined;
      return {
        slug: canonicalServiceSlug(defaultService.service.title, defaultService.service.slug),
        title: canonicalServiceTitle(defaultService.service.title, defaultService.service.slug),
        group: defaultService.group,
        intro: defaultService.service.intro || "",
        description: defaultService.service.description || "",
        descriptionAlignment: "justify",
        outcomes: defaultService.service.outcomes || [],
        faqs: [],
        images: (defaultService.service.images || []).map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption,
        })),
        isPublished: true,
      };
    }
    if (item.isPublished !== true) return undefined;

    return {
      slug: canonicalServiceSlug(item.title, item.slug),
      title: canonicalServiceTitle(item.title, item.slug),
      group: item.group,
      intro: item.intro || "",
      description: item.description || "",
      descriptionAlignment: resolveDescriptionAlignment(item.descriptionAlignment),
      outcomes: item.outcomes || [],
      faqs: normalizeFaqs(item.faqs),
      images: (item.images || []).map((img) => ({
        src: img.src,
        alt: img.alt,
        caption: img.caption || "",
        order: img.order,
        fitMode: img.fitMode,
        focalPosition: img.focalPosition,
      })),
      isPublished: item.isPublished,
    };
  } catch (err) {
    // A database/query failure is not the same as a missing document: let the
    // error bubble up instead of incorrectly rendering the 404 page.
    console.error("Error fetching dynamic solution by slug:", err);
    throw err;
  }
}
