import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { navigationService } from "@/lib/db/services/navigation.service";
import { solutionService } from "@/lib/db/services/solution.service";
import { productService } from "@/lib/db/services/product.service";
import { industryService } from "@/lib/db/services/industry.service";
import type { NavTreeTab, NavTreeColumn, NavTreeItem } from "@/lib/tree-store";
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

// ─── DB-backed content enrichment ────────────────────────────────────────────

async function getDbContentForTreeItem(match: {
  tab: NavTreeTab;
  column?: NavTreeColumn;
  item: NavTreeItem;
} | null): Promise<any | null> {
  if (!match) return null;
  const { tab, item } = match;

  const title = item.title || "";
  if (!title) return null;

  try {
    if (tab.id === "solutions") {
      const slugified = title
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return await solutionService.getBySlug(slugified);
    }
    if (tab.id === "products") {
      const slugified = title
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return await productService.getBySlug(slugified);
    }
    if (tab.id === "industries") {
      const slugified = title
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return await industryService.getBySlug(slugified);
    }
  } catch (err) {
    console.error("Error fetching DB content for tree item:", err);
  }
  return null;
}

// ─── Static Params & Dynamic Config ──────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const allItems = await navigationService.getAllTreeItems();
    return allItems.map(({ tab, column, item }) => {
      const slugParts = item.href
        ? item.href.split("/").filter(Boolean)
        : [tab.slug, column.slug, item.slug].filter(Boolean);
      return { slug: slugParts };
    });
  } catch {
    return [];
  }
}

export const dynamicParams = true;

// ─── Metadata Generation ──────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await navigationService.findTreeItem(slug);

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
  const dbContent = await getDbContentForTreeItem(match);
  const pagePath = Array.isArray(slug) ? slug.join("/") : slug;
  const canonicalUrl = `https://geosat.co/${pagePath}`;

  const title =
    item.metadata?.metaTitle ||
    dbContent?.metaTitle ||
    `${item.title} | ${column?.title || tab?.label || "GeoSAT"} | GeoSAT Solutions`;

  const description =
    item.metadata?.metaDescription ||
    dbContent?.metaDescription ||
    item.intro ||
    dbContent?.intro ||
    item.description ||
    dbContent?.description ||
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

  const heroImages = item.images && item.images.length > 0
    ? item.images
    : (dbContent?.images || []);

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
        heroImages.length > 0
          ? [{ url: heroImages[0].src, alt: heroImages[0].alt || item.title }]
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
  const match = await navigationService.findTreeItem(slug);

  if (!match) {
    notFound();
  }

  const { tab, column, item } = match;
  const dbContent = await getDbContentForTreeItem(match);

  const resolvedItem = {
    ...item,
    title: item.title || dbContent?.title || "Untitled page",
    intro: item.intro || dbContent?.intro || "",
    description: item.description || dbContent?.description || "",
    outcomes: item.outcomes || dbContent?.outcomes || [],
    images: (item.images && item.images.length > 0) ? item.images : (dbContent?.images || []),
  };

  const galleryImages =
    resolvedItem.images && resolvedItem.images.length > 0 ? resolvedItem.images : DEFAULT_IMAGES;

  // ── JSON-LD Structured Data ─────────────────────────────────────────────────
  const pagePath = Array.isArray(slug) ? slug.join("/") : slug;
  const canonicalUrl = `https://geosat.co/${pagePath}`;

  let jsonLd: Record<string, any> | null = null;
  if (tab.id === "products") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: resolvedItem.title,
      category: column?.title || "Geospatial Equipment",
      description: resolvedItem.intro || resolvedItem.description,
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
  } else if (tab.id === "solutions") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: resolvedItem.title,
      serviceType: column?.title || tab.label,
      description: resolvedItem.intro || resolvedItem.description,
      provider: {
        "@type": "Organization",
        name: "GeoSAT Solutions",
        url: "https://geosat.co",
      },
    };
  } else if (tab.id === "industries") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: resolvedItem.title,
      serviceType: column?.title || tab.label,
      description: resolvedItem.intro || resolvedItem.description,
      provider: {
        "@type": "Organization",
        name: "GeoSAT Solutions",
        url: "https://geosat.co",
      },
    };
  } else if (tab.id === "company") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: resolvedItem.title,
      description: resolvedItem.intro || resolvedItem.description,
      url: canonicalUrl,
      sameAs: ["https://geosat.co"],
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
        <ProductsTemplate item={resolvedItem} tab={tab} column={column} galleryImages={galleryImages} />
      ) : tab.id === "industries" ? (
        <IndustriesTemplate item={resolvedItem} tab={tab} column={column} />
      ) : tab.id === "company" ? (
        <CompanyTemplate item={resolvedItem} tab={tab} column={column} />
      ) : tab.id === "solutions" ? (
        <SolutionsTemplate item={resolvedItem} tab={tab} column={column} galleryImages={galleryImages} />
      ) : (
        <FallbackTemplate item={resolvedItem} tab={tab} column={column} galleryImages={galleryImages} />
      )}
      <Footer />
    </>
  );
}
