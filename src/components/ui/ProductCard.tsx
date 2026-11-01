import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import type { Product } from "@/app/products/_lib/product-types";
import { productPathSlug, productSlug } from "@/app/products/_lib/product-types";

interface ProductCardProps {
  product: Product;
  currentSubcategorySlug?: string;
  priority?: boolean;
}

/**
 * UGREEN-style minimalist product card: clean top text + capsule CTA above a
 * bottom product showcase image. Clicking anywhere on the card, or the CTA,
 * navigates to the product detail route (which hosts the spec view and the
 * product inquiry / buy dialog).
 */
export function ProductCard({ product, currentSubcategorySlug, priority }: ProductCardProps) {
  const subSlug = currentSubcategorySlug || (product.subcategory ? productSlug(product.subcategory) : "");
  const detailHref = subSlug
    ? `/products/${subSlug}/${productPathSlug(product)}`
    : `/products/${productPathSlug(product)}`;

  const mainImage = product.images?.[0];

  const tagline =
    product.outcomes && product.outcomes.length > 0
      ? product.outcomes.filter(Boolean).slice(0, 3).join("  |  ")
      : [product.brand, product.group].filter(Boolean).join("  |  ");

  return (
    <div className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-[#F8F9FA] p-6 font-sans transition-all duration-300 hover:border-slate-300 hover:shadow-xl sm:p-7">
      {/* Whole-card overlay link keeps every click target navigating to the product detail route. */}
      <Link
        href={detailHref}
        aria-label={`View ${product.title} specifications`}
        className="absolute inset-0 z-10 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
      />

      {/* A. Top text + CTA zone */}
      <div className="pointer-events-none relative z-20 flex flex-col items-center text-center">
        {product.subcategory && (
          <span className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 font-heading text-[10px] font-medium uppercase tracking-[0.18em] text-teal-600">
            {product.subcategory}
          </span>
        )}

        <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-[28px]">
          {product.title}
        </h3>

        {tagline && (
          <p className="my-2 font-sans text-xs font-medium leading-normal tracking-normal text-slate-600 lg:text-sm">
            {tagline}
          </p>
        )}

        <Link
          href={detailHref}
          className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full border border-slate-900 px-6 py-2 font-sans text-sm font-medium tracking-normal text-slate-900 shadow-sm transition-all duration-300 hover:bg-slate-900 hover:text-white"
        >
          View Specs
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* B. Bottom product showcase image zone */}
      <div className="relative mt-6 flex min-h-[280px] w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100/80 shadow-inner sm:min-h-[320px]">
        {mainImage?.src ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon className="size-8 opacity-50" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider">GeoSAT Instrument</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
