import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { productService } from "@/lib/db/services/product.service";
import { productSlug } from "@/app/products/_lib/product-types";

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
  limit = 4,
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

  return (
    <section
      className="w-full bg-slate-50/50 py-16 lg:py-24 border-t border-slate-200/60"
      aria-labelledby="related-products-heading"
    >
      <h2
        id="related-products-heading"
        className="font-heading font-bold text-2xl lg:text-3xl text-slate-900 tracking-tight text-center mb-10"
      >
        Related Products
      </h2>

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
        {relatedProducts.map((product) => {
          const subSlug = product.subcategory
            ? productSlug(product.subcategory)
            : "";
          const href = subSlug
            ? `/products/${subSlug}/${product.slug}`
            : `/products/${product.slug}`;

          return (
            <article
              key={product.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all duration-200"
            >
              <div className="bg-slate-50/80 rounded-xl p-4 h-48 flex items-center justify-center overflow-hidden mb-4">
                {product.thumbnailImage ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={product.thumbnailImage}
                      alt={product.images?.[0]?.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <ImageIcon className="size-8 opacity-50" aria-hidden="true" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      GeoSAT Equipment
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-heading font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors text-center line-clamp-1 mb-2">
                {product.name}
              </h3>

              <p className="font-sans text-xs text-slate-500 text-center line-clamp-2 leading-relaxed mb-6 flex-1">
                {product.shortDescription || product.category}
              </p>

              <Link
                href={href}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-sans font-medium text-xs py-2.5 rounded-full transition-colors duration-200 text-center block"
              >
                View Product
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedProducts;
