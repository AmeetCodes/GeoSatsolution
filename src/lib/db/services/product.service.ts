import { revalidatePath, revalidateTag } from "next/cache";
import { Types } from "mongoose";
import { productRepository, CreateProductDTO, UpdateProductDTO } from "../repositories/product.repository";
import { IProduct } from "../../models/product";

export interface GetRelatedProductsParams {
  currentProductId?: string;
  categoryId?: string;
  subcategorySlug?: string;
  limit?: number;
}

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  shortDescription: string;
  thumbnailImage?: string;
  images?: IProduct["images"];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export class ProductService {
  async getAllPublished(filter?: { group?: string; subcategory?: string; brand?: string }): Promise<IProduct[]> {
    return productRepository.findAll({ isPublished: true, ...filter });
  }

  async getAllForAdmin(group?: string, subcategory?: string): Promise<IProduct[]> {
    return productRepository.findAll({ ...(group ? { group } : {}), ...(subcategory ? { subcategory } : {}) });
  }

  async getBySubcategory(subcategory: string, requirePublished = true): Promise<IProduct[]> {
    return productRepository.findAll({
      subcategory,
      ...(requirePublished ? { isPublished: true } : {}),
    });
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

  async getRelatedProducts({
    currentProductId,
    categoryId,
    subcategorySlug,
    limit = 4,
  }: GetRelatedProductsParams): Promise<RelatedProduct[]> {
    const safeLimit = Math.min(Math.max(Math.trunc(limit) || 4, 1), 12);

    try {
      const current =
        currentProductId && Types.ObjectId.isValid(currentProductId)
          ? await productRepository.findById(currentProductId)
          : null;

      const currentId = current?._id?.toString() || currentProductId || "";
      const currentSlug = current?.slug || "";
      const targetGroup = (categoryId || current?.group || "").trim();
      const targetSubcategory = (subcategorySlug || current?.subcategory || "").trim();

      const isCurrent = (item: IProduct): boolean => {
        const id = item._id?.toString();
        return Boolean(
          (currentId && id === currentId) ||
            (currentSlug && item.slug === currentSlug)
        );
      };

      const buckets: IProduct[][] = [];
      if (targetGroup && targetSubcategory) {
        buckets.push(
          await productRepository.findAll({
            isPublished: true,
            group: targetGroup,
            subcategory: targetSubcategory,
          })
        );
      }
      if (targetGroup) {
        buckets.push(
          await productRepository.findAll({
            isPublished: true,
            group: targetGroup,
          })
        );
      }
      buckets.push(await productRepository.findAll({ isPublished: true }));

      const selected: IProduct[] = [];
      const seen = new Set<string>();

      for (const bucket of buckets) {
        for (const item of bucket) {
          if (selected.length >= safeLimit) break;
          if (isCurrent(item)) continue;

          const key = item._id?.toString() || item.slug;
          if (!key || seen.has(key)) continue;

          seen.add(key);
          selected.push(item);
        }
        if (selected.length >= safeLimit) break;
      }

      return selected.map((item) => ({
        id: item._id?.toString() || item.slug,
        name: item.title,
        slug: item.slug,
        category: item.subcategory || item.group,
        subcategory: item.subcategory,
        shortDescription: item.intro || item.description || "",
        thumbnailImage: item.images?.[0]?.src,
        images: item.images || [],
      }));
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
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
      resources: data.resources || [],
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
      resources: item.resources || [],
    }));

    const result = await productRepository.replaceAll(docs);
    this.revalidate();
    for (const item of docs) {
      if (item.slug) this.revalidate(item.slug);
    }
    return result;
  }

  private revalidate(slug?: string) {
    try {
      revalidateTag("public-navigation", { expire: 0 });
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
