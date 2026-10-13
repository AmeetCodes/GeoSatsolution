import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { DownloadResourcesButton } from "@/components/ui/DownloadResourcesButton";
import { ProductBuyDialog } from "@/components/ui/ProductBuyDialog";
import { SolutionFaq } from "@/components/ui/SolutionFaq";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import type { Product } from "../_lib/product-types";
import { productSlug } from "../_lib/product-types";

interface ProductDetailViewProps {
  product: Product;
  subcategorySlug?: string;
}

export function ProductDetailView({ product, subcategorySlug }: ProductDetailViewProps) {
  const subSlug =
    subcategorySlug || (product.subcategory ? productSlug(product.subcategory) : "");

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    category: product.group,
    description: product.intro || product.description,
    brand: {
      "@type": "Brand",
      name: product.brand || "GeoSAT",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      seller: {
        "@type": "Organization",
        name: "GeoSAT Solutions",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb navigation */}
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
              <span className="text-ink-3">{product.group}</span>
            </li>
            {product.subcategory && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/products/${subSlug}`}
                    className="transition-colors hover:text-aqua"
                  >
                    {product.subcategory}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink truncate max-w-[260px] sm:max-w-none">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Hero Section matching GeoSAT Reference Screenshot UI */}
        <article className="mt-6 grid items-center gap-10 lg:mt-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <header className="max-w-xl py-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="label text-aqua">
                {product.group.toUpperCase()} · GEOSAT PRODUCT
              </p>
              {product.subcategory && (
                <span className="rounded-full bg-panel/60 px-2.5 py-0.5 text-[11px] font-mono text-ink-2 border border-line">
                  {product.subcategory}
                </span>
              )}
              {product.brand && (
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-400/25">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.75rem]">
              {product.title}
            </h1>

            <p className="mt-6 font-display text-xl leading-relaxed text-ink-2 sm:text-2xl">
              {product.intro}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <ProductBuyDialog productTitle={product.title} productGroup={product.group} />
              <p className="max-w-60 text-xs leading-relaxed text-ink-3">
                Talk directly with our equipment team to request quote and specs.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <DownloadResourcesButton productTitle={product.title} resources={product.resources} />

              {product.brandUrl && (
                <a
                  href={product.brandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel/40 px-4 py-2.5 text-xs font-semibold text-ink-2 transition-colors hover:border-aqua/50 hover:bg-aqua/10 hover:text-aqua"
                >
                  <span>Official {product.brand || "Manufacturer"} Page</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </div>

            <p className="mt-6 max-w-lg text-base leading-7 text-ink-3 whitespace-pre-line">
              {product.description}
            </p>
          </header>

          <SolutionGallery
            images={product.images && product.images.length > 0 ? product.images : []}
          />
        </article>

        {/* Structured Hardware & Technical Specifications Section */}
        <section
          className="mt-16 border-t border-line pt-9 sm:mt-20 sm:pt-12"
          aria-labelledby="specs-heading"
        >
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
            <div>
              <p className="label text-aqua">Hardware Specifications</p>
              <h2
                id="specs-heading"
                className="mt-4 max-w-sm font-display text-3xl leading-tight text-ink"
              >
                Engineered for rigorous field conditions.
              </h2>
              {product.brand && (
                <p className="mt-3 text-xs text-ink-3">
                  Calibrated and certified hardware solution from {product.brand}.
                </p>
              )}
            </div>

            <div className="space-y-6">
              {product.outcomes && product.outcomes.length > 0 && (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex min-h-16 items-start gap-3 border-b border-line py-4 text-sm leading-relaxed text-ink-2"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              )}

              {/* Technical Specifications Key-Value Grid if provided */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-6 rounded-xl border border-line bg-panel/20 p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-ink-3 mb-4">
                    Technical Parameters
                  </h3>
                  <dl className="grid gap-3 sm:grid-cols-2 text-xs">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-line/40 py-2">
                        <dt className="text-ink-3 font-medium">{key}</dt>
                        <dd className="text-ink font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <SolutionFaq
          solutionTitle={product.title}
          deliverables={product.outcomes}
          items={product.faqs}
        />
      </div>
    </>
  );
}

export default ProductDetailView;
