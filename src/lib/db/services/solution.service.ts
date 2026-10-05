import { revalidatePath } from "next/cache";
import { solutionRepository, CreateSolutionDTO, UpdateSolutionDTO } from "../repositories/solution.repository";
import { ISolution } from "../../models/solution";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export class SolutionService {
  async getAllPublished(): Promise<ISolution[]> {
    return solutionRepository.findAll({ isPublished: true });
  }

  async getAllForAdmin(group?: string): Promise<ISolution[]> {
    return solutionRepository.findAll(group ? { group } : {});
  }

  async getBySlug(slug: string, requirePublished = false): Promise<ISolution | null> {
    const solution = await solutionRepository.findBySlug(slug);
    if (!solution) return null;
    if (requirePublished && !solution.isPublished) return null;
    return solution;
  }

  async getByTitle(title: string): Promise<ISolution | null> {
    return solutionRepository.findByTitle(title);
  }

  async create(data: CreateSolutionDTO): Promise<ISolution> {
    const slug = data.slug?.trim() || slugify(data.title);
    
    // Check if slug or title already exists
    const existing = await solutionRepository.findBySlug(slug);
    if (existing) {
      throw new Error(`A solution with slug "${slug}" already exists.`);
    }

    const created = await solutionRepository.create({
      ...data,
      slug,
      intro: data.intro || "",
      description: data.description || "",
      outcomes: data.outcomes || [],
      faqs: data.faqs || [],
      images: data.images || [],
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    });

    this.revalidate(slug);
    return created;
  }

  async update(slugOrId: string, data: UpdateSolutionDTO): Promise<ISolution> {
    let target = await solutionRepository.findBySlug(slugOrId);
    if (!target) {
      target = await solutionRepository.findById(slugOrId);
    }
    if (!target) {
      throw new Error(`Solution not found: ${slugOrId}`);
    }

    const newSlug = data.slug ? slugify(data.slug) : undefined;
    if (newSlug && newSlug !== target.slug) {
      const conflict = await solutionRepository.findBySlug(newSlug);
      if (conflict) {
        throw new Error(`A solution with slug "${newSlug}" already exists.`);
      }
    }

    const updated = await solutionRepository.updateBySlug(target.slug, {
      ...data,
      ...(newSlug ? { slug: newSlug } : {}),
    });

    if (!updated) {
      throw new Error(`Failed to update solution: ${slugOrId}`);
    }

    this.revalidate(target.slug);
    if (newSlug && newSlug !== target.slug) {
      this.revalidate(newSlug);
    }

    return updated;
  }

  async delete(slugOrId: string): Promise<boolean> {
    let target = await solutionRepository.findBySlug(slugOrId);
    if (!target) {
      target = await solutionRepository.findById(slugOrId);
    }
    if (!target) {
      return false;
    }

    const deleted = await solutionRepository.deleteBySlug(target.slug);
    if (deleted) {
      this.revalidate(target.slug);
    }
    return deleted;
  }

  async replaceAll(items: CreateSolutionDTO[]): Promise<ISolution[]> {
    const docs = items.map((item, index) => ({
      ...item,
      slug: item.slug || slugify(item.title),
      order: item.order !== undefined ? item.order : index + 1,
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
      outcomes: item.outcomes || [],
      faqs: item.faqs || [],
      images: item.images || [],
    }));

    const result = await solutionRepository.replaceAll(docs);
    this.revalidate();
    return result;
  }

  private revalidate(slug?: string) {
    try {
      revalidatePath("/", "layout");
      revalidatePath("/solutions");
      if (slug) {
        revalidatePath(`/solutions/${slug}`);
        revalidatePath(`/${slug}`);
      }
    } catch {
      // Revalidation may fail in test runners or non-Next request contexts; ignore safely
    }
  }
}

export const solutionService = new SolutionService();
