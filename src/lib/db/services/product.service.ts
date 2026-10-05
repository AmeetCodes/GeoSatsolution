import { revalidatePath } from "next/cache";
import { productRepository, CreateProductDTO, UpdateProductDTO } from "../repositories/product.repository";
import { IProduct } from "../../models/product";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export class ProductService {
  async getAllPublished(): Promise<IProduct[]> {
    return productRepository.findAll({ isPublished: true });
  }

  async getAllForAdmin(group?: string): Promise<IProduct[]> {
    return productRepository.findAll(group ? { group } : {});
  }

  async getBySlug(slug: string, requirePublished = false): Promise<IProduct | null> {
    const product = await productRepository.findBySlug(slug);
    if (!product) return null;
    if (requirePublished && !product.isPublished) return null;
    return product;
  }

  async getByTitle(title: string): Promise<IProduct | null> {
    return productRepository.findByTitle(title);
  }

  async create(data: CreateProductDTO): Promise<IProduct> {
    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      throw new Error(`A product with slug "${slug}" already exists.`);
    }

    const created = await productRepository.create({
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

  async update(slugOrId: string, data: UpdateProductDTO): Promise<IProduct> {
    let target = await productRepository.findBySlug(slugOrId);
    if (!target) {
      target = await productRepository.findById(slugOrId);
    }
    if (!target) {
      throw new Error(`Product not found: ${slugOrId}`);
    }

    const newSlug = data.slug ? slugify(data.slug) : undefined;
    if (newSlug && newSlug !== target.slug) {
      const conflict = await productRepository.findBySlug(newSlug);
      if (conflict) {
        throw new Error(`A product with slug "${newSlug}" already exists.`);
      }
    }

    const updated = await productRepository.updateBySlug(target.slug, {
      ...data,
      ...(newSlug ? { slug: newSlug } : {}),
    });

    if (!updated) {
      throw new Error(`Failed to update product: ${slugOrId}`);
    }

    this.revalidate(target.slug);
    if (newSlug && newSlug !== target.slug) {
      this.revalidate(newSlug);
    }

    return updated;
  }

  async delete(slugOrId: string): Promise<boolean> {
    let target = await productRepository.findBySlug(slugOrId);
    if (!target) {
      target = await productRepository.findById(slugOrId);
    }
    if (!target) {
      return false;
    }

    const deleted = await productRepository.deleteBySlug(target.slug);
    if (deleted) {
      this.revalidate(target.slug);
    }
    return deleted;
  }

  async replaceAll(items: CreateProductDTO[]): Promise<IProduct[]> {
    const docs = items.map((item, index) => ({
      ...item,
      slug: item.slug || slugify(item.title),
      order: item.order !== undefined ? item.order : index + 1,
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
      outcomes: item.outcomes || [],
      faqs: item.faqs || [],
      images: item.images || [],
    }));

    const result = await productRepository.replaceAll(docs);
    this.revalidate();
    return result;
  }

  private revalidate(slug?: string) {
    try {
      revalidatePath("/", "layout");
      revalidatePath("/products");
      if (slug) {
        revalidatePath(`/products/${slug}`);
        revalidatePath(`/${slug}`);
      }
    } catch {
      // safe fallback
    }
  }
}

export const productService = new ProductService();
