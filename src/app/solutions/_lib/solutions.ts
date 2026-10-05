import { solutionService } from "@/lib/db/services/solution.service";

export type SolutionImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Solution = {
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
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

export async function getDynamicSolutions(): Promise<Solution[]> {
  try {
    const list = await solutionService.getAllPublished();
    if (list && list.length > 0) {
      return list.map((item) => ({
        title: item.title,
        group: item.group,
        intro: item.intro || "",
        description: item.description || "",
        outcomes: item.outcomes || [],
        images: (item.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
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
    const item = await solutionService.getBySlug(slug, true);
    if (item) {
      return {
        title: item.title,
        group: item.group,
        intro: item.intro || "",
        description: item.description || "",
        outcomes: item.outcomes || [],
        images: (item.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
        })),
        isPublished: item.isPublished,
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic solution by slug:", err);
  }
  return undefined;
}