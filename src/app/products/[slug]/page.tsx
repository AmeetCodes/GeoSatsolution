import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DownloadResourcesButton } from "@/components/ui/DownloadResourcesButton";
import { ProductBuyDialog } from "@/components/ui/ProductBuyDialog";
import { SolutionFaq } from "@/components/ui/SolutionFaq";
import { SolutionGallery } from "@/components/ui/SolutionGallery";
import {
  productSlug,
  getDynamicProductBySlug,
  getDynamicProducts,
} from "../_lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const list = await getDynamicProducts();
  return list.map((product) => ({ slug: productSlug(product.title) }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDynamicProductBySlug(slug);

  if (!product) {
    return {
      title: "Product | GeoSAT Products",
      description: "Geospatial instruments and hardware systems.",
    };
  }

  const title = `${product.title} | GeoSAT Products`;
  const description = product.intro || product.description;
  const canonicalUrl = `https://geosat.co/products/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: product.images?.length
        ? [{ url: product.images[0].src, alt: product.images[0].alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getDynamicProductBySlug(slug);

  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    category: product.group,
    description: product.intro || product.description,
    brand: {
      "@type": "Brand",
      name: "GeoSAT",
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
      <Navbar />
      <main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All products
          </Link>

          <article className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <header className="max-w-xl py-2">
              <p className="label text-aqua">{product.group} · GeoSAT product</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.75rem]">
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
              <div className="mt-6">
                <DownloadResourcesButton />
              </div>
              <p className="mt-5 max-w-lg text-base leading-7 text-ink-3">
                {product.description}
              </p>
            </header>

            <SolutionGallery images={product.images && product.images.length > 0 ? product.images : []} />
          </article>

          <section className="mt-16 border-t border-line pt-9 sm:mt-20 sm:pt-12" aria-labelledby="specs-heading">
            <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
              <div>
                <p className="label text-aqua">Hardware Specifications</p>
                <h2 id="specs-heading" className="mt-4 max-w-sm font-display text-3xl leading-tight text-ink">
                  Engineered for rigorous field conditions.
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.outcomes.map((outcome) => (
                  <li key={outcome} className="flex min-h-16 items-start gap-3 border-b border-line py-4 text-sm leading-relaxed text-ink-2">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <SolutionFaq solutionTitle={product.title} deliverables={product.outcomes} />
        </div>
      </main>
      <Footer />
    </>
  );
}
