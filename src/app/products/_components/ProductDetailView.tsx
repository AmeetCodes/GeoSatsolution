import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { DownloadResourcesButton } from "@/components/ui/DownloadResourcesButton";
import { ProductBuyDialog } from "@/components/ui/ProductBuyDialog";
import { SolutionFaq } from "@/components/ui/SolutionFaq";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import { RelatedProducts } from "@/components/products/RelatedProducts";
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
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Breadcrumb navigation */}
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
        <article className="grid grid-cols-1 items-center gap-8 pt-8 pb-12 lg:grid-cols-12 lg:gap-12 lg:pt-12 lg:pb-20">
          <header className="max-w-2xl lg:col-span-5 lg:max-w-none">
            <p className="font-heading font-semibold text-xs tracking-wider uppercase text-teal-600 bg-teal-50/80 px-3 py-1 rounded-full w-fit mb-4">
              {product.group} · GeoSAT Product
            </p>

            {(product.subcategory || product.brand) && (
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                {product.subcategory && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-sans text-[11px] font-medium text-slate-600">
                    {product.subcategory}
                  </span>
                )}
                {product.brand && (
                  <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 font-sans text-[11px] font-semibold text-amber-600">
                    {product.brand}
                  </span>
                )}
              </div>
            )}

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-slate-900 tracking-tight leading-[1.1] mb-5">
              {product.title}
            </h1>

            <p className="font-sans text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
              {product.intro}
            </p>

            <div className="flex items-center gap-4 flex-wrap mb-5">
              <ProductBuyDialog productTitle={product.title} productGroup={product.group} />
              <DownloadResourcesButton
                productTitle={product.title}
                resources={product.resources}
                className="rounded-full border-2 border-teal-600 bg-teal-600 px-7 py-3.5 font-sans text-base font-medium normal-case tracking-normal text-white shadow-sm hover:border-teal-700 hover:bg-teal-700 dark:text-white"
              />
            </div>

            {product.brandUrl && (
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <a
                  href={product.brandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 font-sans text-sm font-medium tracking-normal text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-teal-50/50 hover:text-teal-700"
                >
                  <span>Official {product.brand || "Manufacturer"} Page</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            )}

            <p className="max-w-xl whitespace-pre-line font-sans text-base leading-relaxed text-slate-600">
              {product.description}
            </p>
          </header>

          <div className="lg:col-span-7">
            <SolutionGallery
              images={product.images && product.images.length > 0 ? product.images : []}
              className="rounded-3xl! border-slate-200/60 shadow-lg"
              frameClassName="min-h-[420px] aspect-[4/3] sm:aspect-[4/3] lg:min-h-[500px] xl:min-h-[560px]"
            />
          </div>
        </article>

        {/* Structured Hardware & Technical Specifications Section */}
        <section
          className="py-16 lg:py-24 border-t border-slate-100"
          aria-labelledby="specs-heading"
        >
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12 lg:gap-16">
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

      </div>

      <div className="w-full border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
          <SolutionFaq
            solutionTitle={product.title}
            deliverables={product.outcomes}
            items={product.faqs}
            className="mt-0 py-16 lg:py-24"
          />
        </div>
      </div>

      <RelatedProducts
        currentProductId={product.id || ""}
        categoryId={product.group}
        subcategorySlug={
          product.subcategory ? productSlug(product.subcategory) : undefined
        }
      />
    </>
  );
}

export default ProductDetailView;
