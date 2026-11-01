import { solutionService } from "./solution.service";
import { productService } from "./product.service";
import { industryService } from "./industry.service";
import { companyService } from "./company.service";
import type { SiteContentData } from "../../content-types";

/** Reads and writes the CMS collections. MongoDB is the source of truth. */
export class SiteContentService {
  async getFullSiteContent(): Promise<SiteContentData> {
    const [solutions, products, industries, company] = await Promise.all([
      solutionService.getAllForAdmin(),
      productService.getAllForAdmin(),
      industryService.getAllForAdmin(),
      companyService.getCompanyData(),
    ]);

    return {
      Solutions: solutions.map((item) => ({
        id: String(item._id), title: item.title, slug: item.slug, group: item.group,
        intro: item.intro, description: item.description, outcomes: item.outcomes || [],
        images: (item.images || []).map((image) => ({ ...image, mediaId: image.mediaId ? String(image.mediaId) : undefined })),
        faqs: item.faqs || [], isPublished: item.isPublished,
      })),
      Products: products.map((item) => ({
        id: String(item._id), title: item.title, slug: item.slug, group: item.group,
        subcategory: item.subcategory, brand: item.brand, brandUrl: item.brandUrl,
        intro: item.intro, description: item.description, outcomes: item.outcomes || [],
        images: (item.images || []).map((image) => ({ ...image, mediaId: image.mediaId ? String(image.mediaId) : undefined })),
        resources: (item.resources || []).map((resource) => ({ ...resource, fileMediaId: resource.fileMediaId ? String(resource.fileMediaId) : undefined })),
        specifications: item.specifications || {}, faqs: item.faqs || [], isPublished: item.isPublished,
      })),
      Industries: industries.map((item) => ({
        id: String(item._id), title: item.title, slug: item.slug, intro: item.intro,
        description: item.description, items: item.items || [],
        images: (item.images || []).map((image) => ({ ...image, mediaId: image.mediaId ? String(image.mediaId) : undefined })),
        isPublished: item.isPublished,
      })),
      Company: company,
    };
  }

  async updateSection(section: string, data: unknown) {
    if (section === "Solutions") return solutionService.replaceAll(data as Parameters<typeof solutionService.replaceAll>[0]);
    if (section === "Products") return productService.replaceAll(data as Parameters<typeof productService.replaceAll>[0]);
    if (section === "Industries") return industryService.replaceAll(data as Parameters<typeof industryService.replaceAll>[0]);
    if (section === "Company") return companyService.updateCompany(data as Parameters<typeof companyService.updateCompany>[0]);
    throw new Error(`Unknown content section: ${section}`);
  }
}

export const siteContentService = new SiteContentService();
