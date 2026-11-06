import type { ImageFitMode, ImageFocalPosition, ProductDownloadItem } from "@/lib/content-types";
import { PRODUCT_TAXONOMY } from "@/lib/product-taxonomy";

export type ProductImage = {
  src: string;
  alt: string;
  caption?: string;
  source?: "upload" | "url";
  mediaId?: string;
  order?: number;
  fitMode?: ImageFitMode;
  focalPosition?: ImageFocalPosition;
};

export type Product = {
  id?: string;
  slug?: string;
  title: string;
  group: string;
  subcategory?: string;
  brand?: string;
  brandUrl?: string;
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

/**
 * Looks up subcategory and parent group from PRODUCT_TAXONOMY matching the slug.
 */
export function findSubcategoryBySlug(slug: string): { group: string; subcategory: string } | undefined {
  const normalized = slug.toLowerCase();
  for (const [group, subcategories] of Object.entries(PRODUCT_TAXONOMY)) {
    for (const subcat of subcategories) {
      if (productSlug(subcat) === normalized) {
        return { group, subcategory: subcat };
      }
    }
  }
  return undefined;
}

/**
 * Returns true if the slug matches a known subcategory in the taxonomy.
 */
export function isSubcategorySlug(slug: string): boolean {
  return Boolean(findSubcategoryBySlug(slug));
}
