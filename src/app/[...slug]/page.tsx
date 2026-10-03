import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { findTreeItem, getAllTreeItems } from "@/lib/tree-store";
import {
  SolutionsTemplate,
  ProductsTemplate,
  IndustriesTemplate,
  CompanyTemplate,
  FallbackTemplate,
} from "./_templates";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

// ─── Static Params & Dynamic Config ──────────────────────────────────────────

export function generateStaticParams() {
  const allItems = getAllTreeItems();
  return allItems.map(({ tab, column, item }) => {
    const slugParts = item.href
      ? item.href.split("/").filter(Boolean)
      : [tab.slug, column.slug, item.slug].filter(Boolean);
    return {
      slug: slugParts,
    };
  });
}

export const dynamicParams = true;

// ─── Metadata Generation ──────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = findTreeItem(slug);

  if (!match) {
    return {
      title: "Page Not Found | GeoSAT Solutions",
      description: "The requested page does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { item, tab, column } = match;
  const pagePath = Array.isArray(slug) ? slug.join("/") : slug;
  const canonicalUrl = `https://geosatsoln.com/${pagePath}`;

  const title =
    item.metadata?.metaTitle ||
    `${item.title} | ${column?.title || tab?.label || "GeoSAT"} | GeoSAT Solutions`;

  const description =
    item.metadata?.metaDescription ||
    item.intro ||
    item.description ||
    `Survey-grade solutions and capabilities for ${item.title}.`;

  const keywords = [
    item.title,
    column?.title,
    tab?.label,
    "geospatial survey",
    "LiDAR",
    "GIS",
    "Nepal geospatial",
    "GeoSAT",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "GeoSAT Solutions",
      images:
        item.images && item.images.length > 0
          ? [{ url: item.images[0].src, alt: item.images[0].alt || item.title }]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ─── Default Imagery ──────────────────────────────────────────────────────────

const DEFAULT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=85",
    alt: "Field operations",
    caption: "High-precision survey execution and sensor deployment",
  },
  {
    src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=85",
    alt: "Aerial capture",
    caption: "Rigorous quality verification against national datum",
  },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default async function DynamicCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const match = findTreeItem(slug);

  if (!match) {
    notFound();
  }

  const { tab, column, item } = match;

  const galleryImages =
    item.images && item.images.length > 0 ? item.images : DEFAULT_IMAGES;

  // ── JSON-LD Structured Data ─────────────────────────────────────────────────
  const pagePath = Array.isArray(slug) ? slug.join("/") : slug;
  const canonicalUrl = `https://geosatsoln.com/${pagePath}`;

  let jsonLd: Record<string, any> | null = null;
  if (tab.id === "products") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: item.title,
      category: column?.title || "Geospatial Equipment",
      description: item.intro || item.description,
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
  } else if (tab.id === "solutions" || tab.id === "industries") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: item.title,
      serviceType: column?.title || tab.label,
      description: item.intro || item.description,
      provider: {
        "@type": "Organization",
        name: "GeoSAT Solutions",
        url: "https://geosatsoln.com",
      },
    };
  }

  // ── Section-aware template routing ──────────────────────────────────────────
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Navbar />
      {tab.id === "products" ? (
        <ProductsTemplate item={item} tab={tab} column={column} galleryImages={galleryImages} />
      ) : tab.id === "industries" ? (
        <IndustriesTemplate item={item} tab={tab} column={column} />
      ) : tab.id === "company" ? (
        <CompanyTemplate item={item} tab={tab} column={column} />
      ) : tab.id === "solutions" ? (
        <SolutionsTemplate item={item} tab={tab} column={column} galleryImages={galleryImages} />
      ) : (
        <FallbackTemplate item={item} tab={tab} column={column} galleryImages={galleryImages} />
      )}
      <Footer />
    </>
  );
}
