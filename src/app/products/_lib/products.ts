import { productService } from "@/lib/db/services/product.service";
import {
  type Product,
  type ProductImage,
  productSlug,
  productPathSlug,
  findSubcategoryBySlug,
  isSubcategorySlug,
} from "./product-types";

export type { Product, ProductImage };
export { productSlug, productPathSlug, findSubcategoryBySlug, isSubcategorySlug };

export async function getDynamicProducts(): Promise<Product[]> {
  try {
    const list = await productService.getAllPublished();
    if (list && list.length > 0) {
      return list.map((item) => ({
        id: item._id?.toString(),
        slug: item.slug,
        title: item.title,
        group: item.group,
        subcategory: item.subcategory,
        brand: item.brand,
        brandUrl: item.brandUrl,
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
          source: img.source,
          mediaId: img.mediaId ? String(img.mediaId) : undefined,
          order: img.order,
          fitMode: img.fitMode,
          focalPosition: img.focalPosition,
        })),
        isPublished: item.isPublished,
      }));
    }
  } catch (err) {
    console.error("Error fetching dynamic products:", err);
  }
  return [];
}

export async function getDynamicProductsBySubcategory(subcategorySlugOrTitle: string): Promise<Product[]> {
  try {
    const all = await getDynamicProducts();
    const targetSlug = productSlug(subcategorySlugOrTitle);
    return all.filter((item) => {
      if (item.subcategory) {
        return (
          item.subcategory.toLowerCase() === subcategorySlugOrTitle.toLowerCase() ||
          productSlug(item.subcategory) === targetSlug
        );
      }
      return (
        item.title.toLowerCase() === subcategorySlugOrTitle.toLowerCase() ||
        productSlug(item.title) === targetSlug
      );
    });
  } catch (err) {
    console.error("Error fetching products by subcategory:", err);
    return [];
  }
}

export async function getDynamicProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const item = await productService.getBySlug(slug, true);
    if (item) {
      return {
        id: item._id?.toString(),
        slug: item.slug,
        title: item.title,
        group: item.group,
        subcategory: item.subcategory,
        brand: item.brand,
        brandUrl: item.brandUrl,
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
          source: img.source,
          mediaId: img.mediaId ? String(img.mediaId) : undefined,
          order: img.order,
          fitMode: img.fitMode,
          focalPosition: img.focalPosition,
        })),
        isPublished: item.isPublished,
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic product by slug:", err);
  }
  return undefined;
}
