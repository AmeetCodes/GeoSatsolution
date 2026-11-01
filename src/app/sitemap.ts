import { MetadataRoute } from "next";
import { solutionService } from "@/lib/db/services/solution.service";
import { productService } from "@/lib/db/services/product.service";
import { industryService } from "@/lib/db/services/industry.service";
import { companyService } from "@/lib/db/services/company.service";
import { navigationService } from "@/lib/db/services/navigation.service";

const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.geosatsolutions.com.np"
).replace(/\/+$/, "");

type SitemapProductModel = {
  isActive?: boolean;
  slug?: string;
  updatedAt?: string | Date;
};

// Read database-backed slugs at request time so CMS changes appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/solutions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/industries`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/company/our-work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/company/insights/news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/company/insights/downloads-technical-resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/company/about/executive-technical-leads`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/company/about/geosat-partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/leadership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/request-assessment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const [solutions, products, industries, articles, treeItems] = await Promise.all([
      solutionService.getAllPublished().catch(() => []),
      productService.getAllPublished().catch(() => []),
      industryService.getAllPublished().catch(() => []),
      companyService.getArticles().catch(() => []),
      navigationService.getAllTreeItems().catch(() => []),
    ]);

    const solutionRoutes: MetadataRoute.Sitemap = solutions.map((solution) => ({
      url: `${BASE_URL}/solutions/${solution.slug}`,
      lastModified: solution.updatedAt || solution.createdAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.flatMap((product) => {
      const routes: MetadataRoute.Sitemap = [
        {
          url: `${BASE_URL}/products/${product.slug}`,
          lastModified: product.updatedAt || product.createdAt || new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        },
      ];
      const models = (product as typeof product & { models?: SitemapProductModel[] }).models;
      if (Array.isArray(models)) {
        models
          .filter((model) => model.isActive !== false && model.slug)
          .forEach((model) => {
            routes.push({
              url: `${BASE_URL}/products/${product.slug}/${model.slug}`,
              lastModified: model.updatedAt || product.updatedAt || product.createdAt || new Date(),
              changeFrequency: "monthly",
              priority: 0.7,
            });
          });
      }
      return routes;
    });

    const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
      url: `${BASE_URL}/industries/${industry.slug}`,
      lastModified: industry.updatedAt || industry.createdAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles
      .filter((article) => article.isPublished === true)
      .map((article) => ({
        url: `${BASE_URL}/company/insights/news/${article.slug}`,
        lastModified: article.date || article.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    const staticUrls = new Set(staticRoutes.map((route) => route.url));
    const managedUrls = new Set([
      ...solutionRoutes.map((route) => route.url),
      ...productRoutes.map((route) => route.url),
      ...industryRoutes.map((route) => route.url),
      ...articleRoutes.map((route) => route.url),
    ]);
    const navigationRoutes: MetadataRoute.Sitemap = treeItems.flatMap(({ tab, item }) => {
      // Solutions, products, and industries are sourced from their published DB collections above.
      if (["solutions", "products", "industries"].includes(tab.id)) return [];
      if (!item.href || !item.href.startsWith("/") || item.href.startsWith("//")) return [];
      const url = new URL(item.href, BASE_URL).toString();
      if (staticUrls.has(url) || managedUrls.has(url) || url.includes("?") || url.includes("#")) return [];
      if (url.startsWith(`${BASE_URL}/admin`) || url.startsWith(`${BASE_URL}/api`)) return [];
      return [{ url, changeFrequency: "monthly" as const, priority: 0.6 }];
    });

    const allRoutes = [...staticRoutes, ...solutionRoutes, ...productRoutes, ...industryRoutes, ...articleRoutes, ...navigationRoutes];
    return [...new Map(allRoutes.map((route) => [route.url, route])).values()];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
