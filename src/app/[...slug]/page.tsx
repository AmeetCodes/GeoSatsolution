import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { navigationService } from "@/lib/db/services/navigation.service";
import { solutionService } from "@/lib/db/services/solution.service";
import { productService } from "@/lib/db/services/product.service";
import { industryService } from "@/lib/db/services/industry.service";
import { contentService } from "@/lib/db/services/content.service";
import type { NavTreeTab, NavTreeColumn, NavTreeItem } from "@/lib/tree-store";
import {
  SolutionsTemplate,
  ProductsTemplate,
  IndustriesTemplate,
  CompanyTemplate,
  FallbackTemplate,
  OurWorkTemplate,
} from "./_templates";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

type DbContentItem = {
  title?: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
  images?: { src: string; alt?: string; caption?: string }[];
  metaTitle?: string;
  metaDescription?: string;
};

type ContentImage = { src: string; alt: string; caption: string };

// ─── DB-backed content enrichment ────────────────────────────────────────────

const getCachedDbContent = cache(async (
  tabId: string,
  explicitSlug: string,
  slugifiedTitle: string,
): Promise<DbContentItem | null> => {
  try {
    if (tabId === "solutions") {
      return (explicitSlug ? await solutionService.getBySlug(explicitSlug) : null)
        || await solutionService.getBySlug(slugifiedTitle);
    }
    if (tabId === "products") {
      return (explicitSlug ? await productService.getBySlug(explicitSlug) : null)
        || await productService.getBySlug(slugifiedTitle);
    }
    if (tabId === "industries") {
      return await industryService.getBySlug(slugifiedTitle);
    }
  } catch (err) {
    console.error("Error fetching DB content for tree item:", err);
  }
  return null;
});

async function getDbContentForTreeItem(match: {
  tab: NavTreeTab;
  column?: NavTreeColumn;
  item: NavTreeItem;
} | null): Promise<DbContentItem | null> {
  if (!match?.item.title) return null;
  const { tab, item } = match;
  const explicitSlug = item.slug || item.href?.split("/").filter(Boolean).at(-1) || "";
  const slugifiedTitle = item.title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return getCachedDbContent(tab.id, explicitSlug, slugifiedTitle);
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
  const canonicalUrl = `https://www.geosatsolutions.com.np/${pagePath}`;

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

  const dbManagedSection = tab.id === "solutions" || tab.id === "products";
  const heroImages = dbManagedSection
    ? (dbContent?.images || [])
    : (item.images?.length ? item.images : (dbContent?.images || []));

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
  const dbManagedSection = tab.id === "solutions" || tab.id === "products";
  const routeLeaf = (Array.isArray(slug) ? slug : [slug]).at(-1);
  const isOurWork = tab.id === "company" && (
    routeLeaf === "our-work" || item.slug === "our-work" || item.title?.trim().toLowerCase() === "our work"
  );

  const resolvedTitle = dbManagedSection ? (dbContent?.title ?? item.title ?? "Untitled page") : (item.title || dbContent?.title || "Untitled page");
  const rawImages = dbManagedSection
    ? (dbContent?.images || [])
    : (item.images?.length ? item.images : (dbContent?.images || []));
  const resolvedImages: ContentImage[] = rawImages.map((image) => ({
    src: image.src,
    alt: image.alt || resolvedTitle,
    caption: image.caption || "",
  }));

  const resolvedItem = {
    ...item,
    title: resolvedTitle,
    intro: dbManagedSection ? (dbContent?.intro ?? item.intro ?? "") : (item.intro || dbContent?.intro || ""),
    description: dbManagedSection ? (dbContent?.description ?? item.description ?? "") : (item.description || dbContent?.description || ""),
    outcomes: dbManagedSection ? (dbContent?.outcomes ?? item.outcomes ?? []) : (item.outcomes || dbContent?.outcomes || []),
    images: resolvedImages,
  };

  const galleryImages: ContentImage[] = dbManagedSection
    ? resolvedImages
    : (resolvedImages.length > 0 ? resolvedImages : DEFAULT_IMAGES);

  let projectRecords: Awaited<ReturnType<typeof contentService.getProjects>> = [];
  if (isOurWork) {
    try {
      projectRecords = await contentService.getProjects(true);
    } catch (error) {
      console.error("Failed to fetch Our Work projects from DB:", error);
    }
  }

  // ── JSON-LD Structured Data ─────────────────────────────────────────────────
  const pagePath = Array.isArray(slug) ? slug.join("/") : slug;
  const canonicalUrl = `https://www.geosatsolutions.com.np/${pagePath}`;

  let jsonLd: Record<string, unknown> | null = null;
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
        url: "https://www.geosatsolutions.com.np",
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
        url: "https://www.geosatsolutions.com.np",
      },
    };
  } else if (tab.id === "company") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: resolvedItem.title,
      description: resolvedItem.intro || resolvedItem.description,
      url: canonicalUrl,
      sameAs: ["https://www.geosatsolutions.com.np"],
    };
  }
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "https://www.geosatsolutions.com.np/" },
    { name: tab.label, url: `https://www.geosatsolutions.com.np/${tab.slug}` },
    ...(column ? [{ name: column.title, url: `https://www.geosatsolutions.com.np/${pagePath}` }] : []),
    { name: resolvedItem.title, url: canonicalUrl },
  ]);

  // ── Section-aware template routing ──────────────────────────────────────────
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd([jsonLd, breadcrumb]) }}
        />
      )}
      <Navbar />
      {tab.id === "products" ? (
        <ProductsTemplate item={resolvedItem} tab={tab} column={column!} galleryImages={galleryImages} />
      ) : tab.id === "industries" ? (
        <IndustriesTemplate item={resolvedItem} tab={tab} column={column!} />
      ) : tab.id === "company" ? (
        isOurWork ? <OurWorkTemplate item={resolvedItem} tab={tab} column={column!} projects={projectRecords.map((project) => ({
          code: project.code,
          title: project.title,
          sector: project.sector,
          body: project.body,
          tags: project.tags || [],
          images: (project.images || []).map((image) => ({ src: image.src, alt: image.alt || project.title, caption: image.caption || "", source: image.source, mediaId: image.mediaId ? String(image.mediaId) : undefined })),
          isPublished: project.isPublished !== false,
        }))} /> : <CompanyTemplate item={resolvedItem} tab={tab} column={column!} />
      ) : tab.id === "solutions" ? (
        <SolutionsTemplate item={resolvedItem} tab={tab} column={column!} galleryImages={galleryImages} />
      ) : (
        <FallbackTemplate item={resolvedItem} tab={tab} column={column} galleryImages={galleryImages} />
      )}
      <Footer />
    </>
  );
}
