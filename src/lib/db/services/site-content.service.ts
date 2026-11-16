import { solutionService } from "./solution.service";
import { productService } from "./product.service";
import { companyService } from "./company.service";
import type { SiteContentData } from "../../content-types";
import { canonicalServiceSlug, canonicalServiceTitle } from "../../service-routing";
import { normalizeFaqs } from "../../faq-defaults";
import { resolveDescriptionAlignment } from "../../description-alignment";

/** Reads and writes the CMS collections. MongoDB is the source of truth. */
export class SiteContentService {
  async getFullSiteContent(): Promise<SiteContentData> {
    const [solutions, products, company] = await Promise.all([
      solutionService.getAllForAdmin(),
      productService.getAllForAdmin(),
      companyService.getCompanyData(),
    ]);

    return {
      Solutions: solutions.map((item) => ({
        id: String(item._id),
        title: canonicalServiceTitle(item.title, item.slug),
        slug: canonicalServiceSlug(item.title, item.slug),
        group: item.group,
        intro: item.intro, description: item.description,
        descriptionAlignment: resolveDescriptionAlignment(item.descriptionAlignment),
        outcomes: item.outcomes || [],
        images: (item.images || []).map((image) => ({ ...image, mediaId: image.mediaId ? String(image.mediaId) : undefined })),
        faqs: normalizeFaqs(item.faqs), isPublished: item.isPublished,
      })),
      Products: products.map((item) => ({
        id: String(item._id), title: item.title, slug: item.slug, group: item.group,
        subcategory: item.subcategory, brand: item.brand, brandUrl: item.brandUrl,
        intro: item.intro, description: item.description,
        descriptionAlignment: resolveDescriptionAlignment(item.descriptionAlignment),
        outcomes: item.outcomes || [],
        images: (item.images || []).map((image) => ({ ...image, mediaId: image.mediaId ? String(image.mediaId) : undefined })),
        resources: (item.resources || []).map((resource) => ({ ...resource, fileMediaId: resource.fileMediaId ? String(resource.fileMediaId) : undefined })),
        specifications: item.specifications || {}, faqs: normalizeFaqs(item.faqs), isPublished: item.isPublished,
      })),
      Company: company,
    };
  }

  async updateSection(section: string, data: unknown) {
    if (section === "Solutions") return solutionService.replaceAll(data as Parameters<typeof solutionService.replaceAll>[0]);
    if (section === "Products") return productService.replaceAll(data as Parameters<typeof productService.replaceAll>[0]);
    if (section === "Company") return companyService.updateCompany(data as Parameters<typeof companyService.updateCompany>[0]);
    throw new Error(`Unknown content section: ${section}`);
  }
}

export const siteContentService = new SiteContentService();
