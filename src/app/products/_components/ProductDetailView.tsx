import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { DownloadResourcesButton } from "@/components/ui/DownloadResourcesButton";
import { ProductBuyDialog } from "@/components/ui/ProductBuyDialog";
import { SolutionFaq } from "@/components/ui/SolutionFaq";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import type { Product } from "../_lib/product-types";
import { productPathSlug, productSlug } from "../_lib/product-types";

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
    image: product.images?.map((image) => image.src),
    brand: {
      "@type": "Brand",
      name: product.brand || "GeoSAT",
    },
  };
  const canonical = `https://www.geosatsolutions.com.np/products/${subSlug}/${productPathSlug(product)}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "https://www.geosatsolutions.com.np/" },
    { name: "Products", url: "https://www.geosatsolutions.com.np/products" },
    ...(product.subcategory ? [{ name: product.subcategory, url: `https://www.geosatsolutions.com.np/products/${subSlug}` }] : []),
    { name: product.title, url: canonical },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([productJsonLd, breadcrumb]) }}
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb navigation */}
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
              <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
                {product.group.toUpperCase()} · GEOSAT PRODUCT
              </p>
              {product.subcategory && (
                <span className="rounded-full border border-line bg-panel/60 px-2.5 py-0.5 font-sans text-[11px] font-medium text-ink-2">
                  {product.subcategory}
                </span>
              )}
              {product.brand && (
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-amber-300">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink lg:text-5xl">
              {product.title}
            </h1>

            <p className="mt-6 font-sans text-base font-normal leading-relaxed text-slate-600 lg:text-lg">
              {product.intro}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <ProductBuyDialog productTitle={product.title} productGroup={product.group} />
              <p className="max-w-60 font-sans text-xs leading-relaxed text-ink-3">
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
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel/40 px-4 py-2.5 font-sans text-sm font-medium tracking-normal text-ink-2 transition-colors hover:border-aqua/50 hover:bg-aqua/10 hover:text-aqua"
                >
                  <span>Official {product.brand || "Manufacturer"} Page</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </div>

            <p className="mt-6 max-w-lg whitespace-pre-line font-sans text-base leading-relaxed text-slate-600">
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
              <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">Hardware Specifications</p>
              <h2
                id="specs-heading"
                className="mt-4 max-w-sm font-heading text-3xl leading-tight tracking-tight text-ink"
              >
                Engineered for rigorous field conditions.
              </h2>
              {product.brand && (
                <p className="mt-3 font-sans text-xs leading-relaxed text-ink-3">
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
                      className="flex min-h-16 items-start gap-3 border-b border-line py-4 font-sans text-sm leading-relaxed text-ink-2"
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
                  <h3 className="mb-4 font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
                    Technical Parameters
                  </h3>
                  <dl className="grid gap-3 font-sans text-sm sm:grid-cols-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-line/40 py-2">
                        <dt className="font-medium text-ink-3">{key}</dt>
                        <dd className="font-semibold text-ink">{value}</dd>
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
