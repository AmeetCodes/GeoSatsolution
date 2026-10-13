import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Image as ImageIcon } from "lucide-react";
import type { Product } from "@/app/products/_lib/product-types";
import { productPathSlug, productSlug } from "@/app/products/_lib/product-types";

interface ProductCardProps {
  product: Product;
  currentSubcategorySlug?: string;
  priority?: boolean;
}

export function ProductCard({ product, currentSubcategorySlug, priority }: ProductCardProps) {
  const subSlug = currentSubcategorySlug || (product.subcategory ? productSlug(product.subcategory) : "");
  const detailHref = subSlug
    ? `/products/${subSlug}/${productPathSlug(product)}`
    : `/products/${productPathSlug(product)}`;

  const mainImage = product.images?.[0];

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/35 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-panel/60 hover:shadow-xl hover:shadow-aqua/5">
      <div>
        {/* Top media container with hover zoom */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-abyss/80 border border-line/60">
          {mainImage?.src ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt || product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority={priority}
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-3">
              <ImageIcon className="size-8 opacity-40" />
              <span className="text-xs uppercase tracking-wider font-mono">GeoSAT Instrument</span>
            </div>
          )}

          {/* Subcategory & Brand Badges overlay */}
          <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            {product.subcategory && (
              <span className="rounded-full bg-abyss/85 px-2.5 py-1 text-[11px] font-medium text-ink-2 backdrop-blur-md border border-line pointer-events-auto">
                {product.subcategory}
              </span>
            )}
            {product.brand && (
              <div className="ml-auto pointer-events-auto">
                {product.brandUrl ? (
                  <a
                    href={product.brandUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-aqua/15 px-2.5 py-1 text-[11px] font-semibold text-aqua backdrop-blur-md border border-aqua/30 transition-colors hover:bg-aqua/25"
                    title={`Visit official ${product.brand} page (opens external site)`}
                  >
                    <span>{product.brand}</span>
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-md border border-white/20">
                    {product.brand}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-4">
          <p className="text-[11px] font-mono uppercase tracking-widest text-ink-3">
            {product.group}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight text-ink transition-colors duration-200 group-hover:text-aqua">
            <Link href={detailHref} className="focus:outline-none">
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {product.title}
            </Link>
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-2 line-clamp-2">
            {product.intro}
          </p>
        </div>

        {/* Quick Specs Chips */}
        {product.outcomes && product.outcomes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.outcomes.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-abyss/70 px-2 py-1 text-[11px] text-ink-2 border border-line/60"
              >
                <Check className="size-3 text-aqua shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[200px]">{spec}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-line/60 flex items-center justify-between gap-3">
        <Link
          href={detailHref}
          className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl border border-line bg-panel/50 text-xs font-semibold text-ink transition-colors duration-200 hover:border-aqua/60 hover:bg-aqua/10 hover:text-aqua"
        >
          <span>View Specs & Inquire</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
