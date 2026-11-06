import { productService } from "@/lib/db/services/product.service";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
  subcategorySlug?: string;
  limit?: number;
}

export async function RelatedProducts({
  currentProductId,
  categoryId,
  subcategorySlug,
  limit = 8,
}: RelatedProductsProps) {
  const relatedProducts = await productService.getRelatedProducts({
    currentProductId,
    categoryId,
    subcategorySlug,
    limit,
  });

  if (relatedProducts.length === 0) {
    return null;
  }

  return <RelatedProductsCarousel products={relatedProducts} />;
}

export default RelatedProducts;
