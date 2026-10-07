import { productService } from "@/lib/db/services/product.service";
import type { ProductDownloadItem } from "@/lib/data-store";

export type ProductImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Product = {
  slug?: string;
  title: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  specifications?: Record<string, string>;
  faqs?: { question: string; answer: string }[];
  resources?: ProductDownloadItem[];
  images: ProductImage[];
  isPublished?: boolean;
};

export function productSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function productPathSlug(product: Pick<Product, "title" | "slug">): string {
  return product.slug || productSlug(product.title);
}

export async function getDynamicProducts(): Promise<Product[]> {
  try {
    const list = await productService.getAllPublished();
    if (list && list.length > 0) {
      return list.map((item) => ({
        slug: item.slug,
        title: item.title,
        group: item.group,
        intro: item.intro || "",
        description: item.description || "",
        outcomes: item.outcomes || [],
        specifications: item.specifications || {},
        faqs: item.faqs || [],
        resources: (item.resources || []).map((resource) => ({
          ...resource,
          fileMediaId: resource.fileMediaId ? String(resource.fileMediaId) : undefined,
        })),
        images: (item.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
        })),
        isPublished: item.isPublished,
      }));
    }
  } catch (err) {
    console.error("Error fetching dynamic products:", err);
  }
  return [];
}

export async function getDynamicProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const item = await productService.getBySlug(slug, true);
    if (item) {
      return {
        slug: item.slug,
        title: item.title,
        group: item.group,
        intro: item.intro || "",
        description: item.description || "",
        outcomes: item.outcomes || [],
        specifications: item.specifications || {},
        faqs: item.faqs || [],
        resources: (item.resources || []).map((resource) => ({
          ...resource,
          fileMediaId: resource.fileMediaId ? String(resource.fileMediaId) : undefined,
        })),
        images: (item.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
        })),
        isPublished: item.isPublished,
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic product by slug:", err);
  }
  return undefined;
}
