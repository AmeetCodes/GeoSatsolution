"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Filter, Layers, ArrowUpRight } from "lucide-react";
import type { Product } from "../_lib/product-types";
import { productSlug } from "../_lib/product-types";
import { PRODUCT_TAXONOMY } from "@/lib/product-taxonomy";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductsCatalogViewProps {
  products: Product[];
  initialCategory?: string;
  initialSubcategory?: string;
}

const CATEGORIES = [
  "All",
  "UAV & Payloads",
  "Survey Equipment",
  "Software",
  "Satellite & Monitoring",
] as const;

export function ProductsCatalogView({
  products,
  initialCategory = "All",
  initialSubcategory = "All",
}: ProductsCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const cat of CATEGORIES) {
      if (cat !== "All") {
        counts[cat] = products.filter((p) => p.group === cat).length;
      }
    }
    return counts;
  }, [products]);

  // Subcategories available for selected category
  const activeSubcategories = useMemo(() => {
    if (selectedCategory === "All") {
      const all: { name: string; group: string; count: number; slug: string }[] = [];
      for (const [group, subs] of Object.entries(PRODUCT_TAXONOMY)) {
        for (const sub of subs) {
          const count = products.filter(
            (p) =>
              p.subcategory === sub ||
              (!p.subcategory && p.title === sub)
          ).length;
          all.push({ name: sub, group, count, slug: productSlug(sub) });
        }
      }
      return all;
    }

    const subs = PRODUCT_TAXONOMY[selectedCategory] || [];
    return subs.map((sub) => {
      const count = products.filter(
        (p) =>
          p.group === selectedCategory &&
          (p.subcategory === sub || (!p.subcategory && p.title === sub))
      ).length;
      return { name: sub, group: selectedCategory, count, slug: productSlug(sub) };
    });
  }, [selectedCategory, products]);

  // Filter products by selected category and subcategory
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.group === selectedCategory;
      const matchesSub =
        selectedSubcategory === "All" ||
        p.subcategory === selectedSubcategory ||
        (!p.subcategory && p.title === selectedSubcategory);
      return matchesCat && matchesSub;
    });
  }, [products, selectedCategory, selectedSubcategory]);

  return (
    <div className="mt-8 space-y-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory("All");
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-aqua/15 text-aqua border border-aqua/40 shadow-sm"
                  : "bg-panel/30 text-ink-2 hover:bg-panel/60 hover:text-ink border border-line"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-mono ${
                  isActive
                    ? "bg-aqua/20 text-aqua"
                    : "bg-abyss/60 text-ink-3"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Browser & Fast Filter Grid */}
      <section aria-labelledby="subcategories-heading">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-aqua" aria-hidden="true" />
            <h2 id="subcategories-heading" className="text-sm font-semibold uppercase tracking-wider text-ink-3">
              Product Classes & Subcategories
            </h2>
          </div>
          {selectedSubcategory !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedSubcategory("All")}
              className="text-xs text-aqua hover:underline"
            >
              Show all classes
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {activeSubcategories.map((sub) => {
            const isSelected = selectedSubcategory === sub.name;
            return (
              <div
                key={sub.name}
                className={`group flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-aqua bg-aqua/10 text-aqua"
                    : "border-line bg-panel/20 text-ink-2 hover:border-line-strong hover:bg-panel/50 hover:text-ink"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory(isSelected ? "All" : sub.name)}
                  className="flex-1 text-left"
                >
                  <p className="text-xs font-semibold leading-snug">{sub.name}</p>
                  <p className="text-[11px] font-mono text-ink-3 mt-0.5">
                    {sub.count} {sub.count === 1 ? "model" : "models"}
                  </p>
                </button>
                <Link
                  href={`/products/${sub.slug}`}
                  className="ml-2 rounded-lg p-1 text-ink-3 transition-colors hover:bg-abyss/80 hover:text-aqua"
                  title={`Go to ${sub.name} catalog page`}
                >
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section aria-labelledby="models-heading" className="pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="models-heading" className="font-display text-2xl font-bold text-ink">
              {selectedSubcategory !== "All"
                ? `${selectedSubcategory} Models`
                : selectedCategory !== "All"
                ? `${selectedCategory} Equipment & Software`
                : "All Equipment & System Models"}
            </h2>
            <p className="mt-1 text-xs text-ink-3 font-mono">
              Displaying {filteredProducts.length} active hardware & software solutions
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-[var(--radius-panel)] border border-dashed border-line bg-panel/20 py-16 text-center">
            <Filter className="mx-auto size-8 text-ink-3 opacity-50" />
            <h3 className="mt-3 font-display text-lg text-ink">No product models in this selection</h3>
            <p className="mt-1 text-sm text-ink-3">
              Try selecting another category or check back as newly calibrated equipment is added.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id || product.slug || product.title}
                product={product}
                priority={idx < 2}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductsCatalogView;
