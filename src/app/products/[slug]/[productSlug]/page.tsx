import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  getDynamicProductBySlug,
  getDynamicProducts,
  productPathSlug,
  productSlug,
} from "../../_lib/products";
import { ProductDetailView } from "../../_components/ProductDetailView";

type ProductDetailPageProps = {
  params: Promise<{ slug: string; productSlug: string }>;
};

export async function generateStaticParams() {
  const products = await getDynamicProducts();
  return products.map((product) => ({
    slug: productSlug(product.subcategory || "general"),
    productSlug: productPathSlug(product),
  }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug, productSlug: modelSlug } = await params;
  const product = await getDynamicProductBySlug(modelSlug);

  if (!product) {
    return {
      title: "Product Detail | GeoSAT Products",
      description: "Geospatial instruments and hardware systems.",
    };
  }

  const title = `${product.title} | ${product.subcategory || product.group} | GeoSAT Products`;
  const description = product.intro || product.description;
  const canonicalUrl = `https://www.geosatsolutions.com.np/products/${slug}/${modelSlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug: subcategorySlug, productSlug: modelSlug } = await params;
  const product = await getDynamicProductBySlug(modelSlug);

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <ProductDetailView product={product} subcategorySlug={subcategorySlug} />
      </PageTransition>
      <Footer />
    </>
  );
}
