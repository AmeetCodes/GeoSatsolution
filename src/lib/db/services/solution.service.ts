import { revalidatePath, revalidateTag } from "next/cache";
import { solutionRepository, CreateSolutionDTO, UpdateSolutionDTO } from "../repositories/solution.repository";
import { ISolution } from "../../models/solution";
import { buildStarterFaqs, normalizeFaqs } from "../../faq-defaults";
import { resolveDescriptionAlignment } from "../../description-alignment";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export class SolutionService {
  async getAllPublished(): Promise<ISolution[]> {
    return this.initializeMissingFaqs(await solutionRepository.findAll({ isPublished: true }));
  }

  async getAllForAdmin(group?: string): Promise<ISolution[]> {
    return this.initializeMissingFaqs(await solutionRepository.findAll(group ? { group } : {}));
  }

  async getBySlug(slug: string, requirePublished = false): Promise<ISolution | null> {
    const solution = await solutionRepository.findBySlug(slug);
    if (!solution) return null;
    if (requirePublished && !solution.isPublished) return null;
    const [initialized] = await this.initializeMissingFaqs([solution]);
    return initialized;
  }

  async getByTitle(title: string): Promise<ISolution | null> {
    const solution = await solutionRepository.findByTitle(title);
    if (!solution) return null;
    const [initialized] = await this.initializeMissingFaqs([solution]);
    return initialized;
  }

  private async initializeMissingFaqs(items: ISolution[]): Promise<ISolution[]> {
    const pending = items.filter((item) => item.faqsInitialized !== true);
    if (!pending.length) return items;

    const faqsById = new Map<string, ReturnType<typeof normalizeFaqs>>();
    const entries = pending.map((item) => {
      const id = String(item._id);
      const faqs = normalizeFaqs(
        item.faqs?.length ? item.faqs : buildStarterFaqs(item.title, item.outcomes || []),
      );
      faqsById.set(id, faqs);
      return { id, faqs };
    });

    try {
      await solutionRepository.initializeFaqs(entries);
    } catch (error) {
      console.error("Failed to initialize solution FAQs:", error);
      return items;
    }

    return items.map((item) => {
      const faqs = faqsById.get(String(item._id));
      if (faqs) {
        item.faqs = faqs;
        item.faqsInitialized = true;
      }
      return item;
    });
  }

  private normalizeInput<T extends { descriptionAlignment?: string; faqs?: Parameters<typeof normalizeFaqs>[0] }>(data: T) {
    return {
      ...data,
      ...(data.descriptionAlignment !== undefined
        ? { descriptionAlignment: resolveDescriptionAlignment(data.descriptionAlignment) }
        : {}),
      ...(data.faqs !== undefined ? { faqs: normalizeFaqs(data.faqs) } : {}),
    };
  }

  async create(data: CreateSolutionDTO): Promise<ISolution> {
    const slug = data.slug?.trim() || slugify(data.title);
    
    // Check if slug or title already exists
    const existing = await solutionRepository.findBySlug(slug);
    if (existing) {
      throw new Error(`A solution with slug "${slug}" already exists.`);
    }

    const created = await solutionRepository.create({
      ...this.normalizeInput(data),
      slug,
      intro: data.intro || "",
      description: data.description || "",
      descriptionAlignment: resolveDescriptionAlignment(data.descriptionAlignment),
      outcomes: data.outcomes || [],
      faqs: normalizeFaqs(data.faqs),
      faqsInitialized: true,
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
      ...this.normalizeInput(data),
      ...(newSlug ? { slug: newSlug } : {}),
      ...(data.faqs !== undefined ? { faqsInitialized: true } : {}),
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
      ...this.normalizeInput(item),
      slug: item.slug || slugify(item.title),
      order: item.order !== undefined ? item.order : index + 1,
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
      descriptionAlignment: resolveDescriptionAlignment(item.descriptionAlignment),
      outcomes: item.outcomes || [],
      faqs: normalizeFaqs(item.faqs),
      faqsInitialized: true,
      images: item.images || [],
    }));

    const result = await solutionRepository.replaceAll(docs);
    this.revalidate();
    return result;
  }

  private revalidate(slug?: string) {
    try {
      revalidateTag("public-navigation", { expire: 0 });
      revalidatePath("/", "layout");
      revalidatePath("/services");
      revalidatePath("/services/[slug]", "page");
      if (slug) {
        revalidatePath(`/services/${slug}`);
        revalidatePath(`/${slug}`);
      }
    } catch {
      // Revalidation may fail in test runners or non-Next request contexts; ignore safely
    }
  }
}

export const solutionService = new SolutionService();
