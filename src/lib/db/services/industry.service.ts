import { revalidatePath, revalidateTag } from "next/cache";
import { industryRepository, CreateIndustryDTO, UpdateIndustryDTO } from "../repositories/industry.repository";
import { IIndustry } from "../../models/Industry";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export class IndustryService {
  async getAllPublished(): Promise<IIndustry[]> {
    return industryRepository.findAll({ isPublished: true });
  }

  async getAllForAdmin(): Promise<IIndustry[]> {
    return industryRepository.findAll({});
  }

  async getBySlug(slug: string, requirePublished = false): Promise<IIndustry | null> {
    const industry = await industryRepository.findBySlug(slug);
    if (!industry) return null;
    if (requirePublished && !industry.isPublished) return null;
    return industry;
  }

  async getByTitle(title: string): Promise<IIndustry | null> {
    return industryRepository.findByTitle(title);
  }

  async create(data: CreateIndustryDTO): Promise<IIndustry> {
    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await industryRepository.findBySlug(slug);
    if (existing) {
      throw new Error(`An industry sector with slug "${slug}" already exists.`);
    }

    const created = await industryRepository.create({
      ...data,
      slug,
      intro: data.intro || "",
      description: data.description || "",
      items: data.items || [],
      images: data.images || [],
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    });

    this.revalidate(slug);
    return created;
  }

  async update(slugOrId: string, data: UpdateIndustryDTO): Promise<IIndustry> {
    let target = await industryRepository.findBySlug(slugOrId);
    if (!target) {
      target = await industryRepository.findById(slugOrId);
    }
    if (!target) {
      throw new Error(`Industry sector not found: ${slugOrId}`);
    }

    const newSlug = data.slug ? slugify(data.slug) : undefined;
    if (newSlug && newSlug !== target.slug) {
      const conflict = await industryRepository.findBySlug(newSlug);
      if (conflict) {
        throw new Error(`An industry sector with slug "${newSlug}" already exists.`);
      }
    }

    const updated = await industryRepository.updateBySlug(target.slug, {
      ...data,
      ...(newSlug ? { slug: newSlug } : {}),
    });

    if (!updated) {
      throw new Error(`Failed to update industry: ${slugOrId}`);
    }

    this.revalidate(target.slug);
    if (newSlug && newSlug !== target.slug) {
      this.revalidate(newSlug);
    }

    return updated;
  }

  async delete(slugOrId: string): Promise<boolean> {
    let target = await industryRepository.findBySlug(slugOrId);
    if (!target) {
      target = await industryRepository.findById(slugOrId);
    }
    if (!target) {
      return false;
    }

    const deleted = await industryRepository.deleteBySlug(target.slug);
    if (deleted) {
      this.revalidate(target.slug);
    }
    return deleted;
  }

  async replaceAll(items: CreateIndustryDTO[]): Promise<IIndustry[]> {
    const docs = items.map((item, index) => ({
      ...item,
      slug: item.slug || slugify(item.title),
      order: item.order !== undefined ? item.order : index + 1,
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
      items: item.items || [],
      images: item.images || [],
    }));

    const result = await industryRepository.replaceAll(docs);
    this.revalidate();
    return result;
  }

  private revalidate(slug?: string) {
    try {
      revalidateTag("public-navigation", { expire: 0 });
      revalidatePath("/", "layout");
      revalidatePath("/industries");
      if (slug) {
        revalidatePath(`/industries/${slug}`);
        revalidatePath(`/${slug}`);
      }
    } catch {
      // safe fallback
    }
  }
}

export const industryService = new IndustryService();
