import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  findSubcategoryBySlug,
  getDynamicProductBySlug,
  getDynamicProducts,
  getDynamicProductsBySubcategory,
  productPathSlug,
  productSlug,
} from "../_lib/products";
import { PRODUCT_TAXONOMY } from "@/lib/product-taxonomy";
import { ProductDetailView } from "../_components/ProductDetailView";
import { SubcategoryCatalogView } from "../_components/SubcategoryCatalogView";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  // Add all subcategories from taxonomy
  for (const subs of Object.values(PRODUCT_TAXONOMY)) {
    for (const sub of subs) {
      params.push({ slug: productSlug(sub) });
    }
  }

  // Add all published products
  const products = await getDynamicProducts();
  for (const product of products) {
    params.push({ slug: productPathSlug(product) });
  }

  return params;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check if slug is a subcategory / class
  const subcatMeta = findSubcategoryBySlug(slug);
  if (subcatMeta) {
    const title = `${subcatMeta.subcategory} | GeoSAT Products Catalog`;
    const description = `Explore professional ${subcatMeta.subcategory.toLowerCase()} equipment, payloads, and solutions calibrated by GeoSAT Solutions.`;
    const canonicalUrl = `https://www.geosatsolutions.com.np/products/${slug}`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "GeoSAT Solutions",
        type: "website",
      },
    };
  }

  // 2. Check if slug is a specific product model
  const product = await getDynamicProductBySlug(slug);
  if (product) {
    const title = `${product.title} | GeoSAT Products`;
    const description = product.intro || product.description;
    const canonicalUrl = `https://www.geosatsolutions.com.np/products/${slug}`;
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

  return {
    title: "Product Catalog | GeoSAT Solutions",
    description: "Geospatial instruments and hardware systems.",
  };
}

export default async function DynamicProductOrSubcategoryPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Check if slug matches a subcategory class
  const subcatMeta = findSubcategoryBySlug(slug);
  if (subcatMeta) {
    const productsInSubcat = await getDynamicProductsBySubcategory(subcatMeta.subcategory);
    return (
      <>
        <Navbar />
        <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
          <SubcategoryCatalogView
            categoryGroup={subcatMeta.group}
            subcategoryTitle={subcatMeta.subcategory}
            subcategorySlug={slug}
            products={productsInSubcat}
          />
        </PageTransition>
        <Footer />
      </>
    );
  }

  // 2. Check if slug matches an individual product model
  const product = await getDynamicProductBySlug(slug);
  if (product) {
    return (
      <>
        <Navbar />
        <PageTransition className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
          <ProductDetailView product={product} />
        </PageTransition>
        <Footer />
      </>
    );
  }

  // Neither matched
  notFound();
}
