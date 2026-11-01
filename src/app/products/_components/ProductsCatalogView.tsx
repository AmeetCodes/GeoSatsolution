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
    <div className="mt-6 space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 pb-6">
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
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-sans text-xs font-medium tracking-normal transition-all lg:text-sm ${
                isActive
                  ? "border-teal-500 bg-teal-50/70 text-teal-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:bg-teal-50/50 hover:text-teal-700"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-sans text-xs tabular ${
                  isActive
                    ? "bg-teal-100 text-teal-700"
                    : "bg-slate-100 text-slate-500"
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
            <Layers className="size-4 text-teal-600" aria-hidden="true" />
            <h2 id="subcategories-heading" className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
              Product Classes & Subcategories
            </h2>
          </div>
          {selectedSubcategory !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedSubcategory("All")}
              className="font-sans text-xs font-medium text-teal-700 hover:underline"
            >
              Show all classes
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {activeSubcategories.map((sub) => {
            const isSelected = selectedSubcategory === sub.name;
            return (
              <div
                key={sub.name}
                className={`group flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-teal-500 bg-teal-50/60 text-teal-800 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50/40 hover:text-slate-900"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory(isSelected ? "All" : sub.name)}
                  className="flex-1 text-left"
                >
                  <p className="font-heading text-xs font-medium leading-snug tracking-tight">{sub.name}</p>
                  <p className="mt-0.5 font-sans text-[11px] tabular text-ink-3">
                    {sub.count} {sub.count === 1 ? "model" : "models"}
                  </p>
                </button>
                <Link
                  href={`/products/${sub.slug}`}
                  className="ml-2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-700"
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
            <h2 id="models-heading" className="font-heading text-2xl font-semibold tracking-tight text-ink">
              {selectedSubcategory !== "All"
                ? `${selectedSubcategory} Models`
                : selectedCategory !== "All"
                ? `${selectedCategory} Equipment & Software`
                : "All Equipment & System Models"}
            </h2>
            <p className="mt-1 font-sans text-sm text-slate-600">
              Displaying {filteredProducts.length} active hardware & software solutions
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-[var(--radius-panel)] border border-dashed border-line bg-panel/20 py-16 text-center">
            <Filter className="mx-auto size-8 text-ink-3 opacity-50" />
            <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight text-ink">No product models in this selection</h3>
            <p className="mt-1 font-sans text-sm text-slate-600">
              Try selecting another category or check back as newly calibrated equipment is added.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
