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
        <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
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
          <p className="label text-aqua">{categoryGroup.toUpperCase()} · PRODUCT CLASS</p>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-6xl">
          {subcategoryTitle}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
          Explore certified {subcategoryTitle.toLowerCase()} hardware systems, models, and calibrated payloads
          available from GeoSAT Solutions.
        </p>

        {/* Sibling Subcategories Navigation Pills */}
        {siblingSubcategories.length > 1 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-3 mr-1">
              Related Classes:
            </span>
            {siblingSubcategories.map((sub) => {
              const slug = productSlug(sub);
              const isCurrent = slug === subcategorySlug;
              return (
                <Link
                  key={sub}
                  href={`/products/${slug}`}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
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
          <h2 id="models-heading" className="font-display text-2xl font-bold text-ink">
            Available Models & Instruments
          </h2>
          <span className="text-xs font-mono text-ink-3">
            {products.length} {products.length === 1 ? "model" : "models"} listed
          </span>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-[var(--radius-panel)] border border-dashed border-line bg-panel/20 py-20 text-center">
            <Box className="mx-auto size-10 text-ink-3 opacity-40" />
            <h3 className="mt-4 font-display text-xl text-ink">
              New models are currently being calibrated
            </h3>
            <p className="mt-2 text-sm text-ink-3 max-w-md mx-auto">
              Our equipment team is actively updating product models for {subcategoryTitle}. Request custom specs or immediate quotes below.
            </p>
            <div className="mt-6">
              <Link
                href="/company/contact"
                className="inline-flex items-center rounded-xl bg-aqua/15 border border-aqua/40 px-5 py-2.5 text-xs font-semibold text-aqua transition-colors hover:bg-aqua/25"
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
