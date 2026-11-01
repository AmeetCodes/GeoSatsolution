import React from "react";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import type { Product } from "../_lib/product-types";
import { productSlug } from "../_lib/product-types";
import { PRODUCT_TAXONOMY } from "@/lib/product-taxonomy";
import { ProductCard } from "@/components/ui/ProductCard";

interface SubcategoryCatalogViewProps {
  categoryGroup: string;
  subcategoryTitle: string;
  subcategorySlug: string;
  products: Product[];
}

export function SubcategoryCatalogView({
  categoryGroup,
  subcategoryTitle,
  subcategorySlug,
  products,
}: SubcategoryCatalogViewProps) {
  // Sibling subcategories in the same category group
  const siblingSubcategories = PRODUCT_TAXONOMY[categoryGroup] || [];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-2 font-sans text-sm text-ink-3">
          <li>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-aqua"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>All products</span>
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/products"
              className="transition-colors hover:text-aqua"
            >
              {categoryGroup}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink">
            {subcategoryTitle}
          </li>
        </ol>
      </nav>

      {/* Header Banner */}
      <header className="pt-8 pb-2 lg:pt-12">
        <p className="font-heading font-semibold text-xs tracking-wider uppercase text-teal-600 bg-teal-50/80 px-3 py-1 rounded-full w-fit">
          {categoryGroup} · Product Class
        </p>
        <h1 className="mt-5 max-w-4xl font-heading font-extrabold text-4xl leading-[1.1] tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
          {subcategoryTitle}
        </h1>
        <p className="mt-5 max-w-3xl font-sans text-base font-normal leading-relaxed text-slate-600 lg:text-lg">
          Explore certified {subcategoryTitle.toLowerCase()} hardware systems, models, and calibrated payloads
          available from GeoSAT Solutions.
        </p>

        {/* Sibling Subcategories Navigation Pills */}
        {siblingSubcategories.length > 1 && (
          <div className="my-6 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-6">
            <span className="mr-1 font-heading text-xs font-semibold uppercase tracking-wider text-teal-600">
              Related Classes
            </span>
            {siblingSubcategories.map((sub) => {
              const slug = productSlug(sub);
              const isCurrent = slug === subcategorySlug;
              return (
                <Link
                  key={sub}
                  href={`/products/${slug}`}
                  className={`rounded-xl border px-4 py-2 font-sans text-xs font-medium tracking-normal transition-all lg:text-sm ${
                    isCurrent
                      ? "border-teal-500 bg-teal-50/70 text-teal-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:bg-teal-50/50 hover:text-teal-700"
                  }`}
                >
                  {sub}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Product Models Grid */}
      <section aria-labelledby="models-heading" className="mt-6">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <h2 id="models-heading" className="font-heading text-2xl font-semibold tracking-tight text-ink">
            Available Models & Instruments
          </h2>
          <span className="font-sans text-sm tabular text-ink-3">
            {products.length} {products.length === 1 ? "model" : "models"} listed
          </span>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-[var(--radius-panel)] border border-dashed border-line bg-panel/20 py-20 text-center">
            <Box className="mx-auto size-10 text-ink-3 opacity-40" />
            <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-ink">
              New models are currently being calibrated
            </h3>
            <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-slate-600">
              Our equipment team is actively updating product models for {subcategoryTitle}. Request custom specs or immediate quotes below.
            </p>
            <div className="mt-6">
              <Link
                href="/company/contact"
                className="inline-flex items-center rounded-xl border border-aqua/40 bg-aqua/15 px-5 py-2.5 font-sans text-sm font-medium tracking-normal text-aqua transition-colors hover:bg-aqua/25"
              >
                Request Instrument Consultation
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id || product.slug || product.title}
                product={product}
                currentSubcategorySlug={subcategorySlug}
                priority={idx < 2}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SubcategoryCatalogView;
