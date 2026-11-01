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
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="py-2">
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
      <header className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">{categoryGroup.toUpperCase()} · PRODUCT CLASS</p>
        </div>
        <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink lg:text-5xl">
          {subcategoryTitle}
        </h1>
        <p className="mt-4 font-sans text-base font-normal leading-relaxed text-slate-600 lg:text-lg">
          Explore certified {subcategoryTitle.toLowerCase()} hardware systems, models, and calibrated payloads
          available from GeoSAT Solutions.
        </p>

        {/* Sibling Subcategories Navigation Pills */}
        {siblingSubcategories.length > 1 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line/60 pt-2">
            <span className="mr-1 font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
              Related Classes:
            </span>
            {siblingSubcategories.map((sub) => {
              const slug = productSlug(sub);
              const isCurrent = slug === subcategorySlug;
              return (
                <Link
                  key={sub}
                  href={`/products/${slug}`}
                  className={`rounded-lg px-3 py-1 font-sans text-xs font-medium tracking-normal transition-all ${
                    isCurrent
                      ? "bg-aqua/20 text-aqua border border-aqua/40 shadow-sm"
                      : "bg-panel/30 text-ink-2 hover:bg-panel/60 hover:text-ink border border-line"
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
      <section aria-labelledby="models-heading" className="mt-12">
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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
