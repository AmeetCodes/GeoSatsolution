import { solutionService } from "./solution.service";
import { productService } from "./product.service";
import { industryService } from "./industry.service";
import { companyService } from "./company.service";
import { DEFAULT_SITE_CONTENT, SiteContentData } from "../../data-store";

export class SiteContentService {
  async getFullSiteContent(): Promise<SiteContentData> {
    const [solutions, products, industries, company] = await Promise.all([
      solutionService.getAllForAdmin(),
      productService.getAllForAdmin(),
      industryService.getAllForAdmin(),
      companyService.getCompanyData(),
    ]);

    return {
      Solutions: solutions.map((s) => ({
        id: s._id.toString(),
        title: s.title,
        slug: s.slug,
        group: s.group,
        intro: s.intro,
        description: s.description,
        outcomes: s.outcomes || [],
        images: (s.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
          source: img.source,
          mediaId: img.mediaId,
        })),
        faqs: s.faqs || [],
        isPublished: s.isPublished,
      })),
      Products: products.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        group: p.group,
        intro: p.intro,
        description: p.description,
        outcomes: p.outcomes || [],
        images: (p.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
          source: img.source,
          mediaId: img.mediaId,
        })),
        resources: (p.resources || []).map((resource) => ({
          ...resource,
          fileMediaId: resource.fileMediaId ? String(resource.fileMediaId) : undefined,
        })),
        specifications: p.specifications || {},
        faqs: p.faqs || [],
        isPublished: p.isPublished,
      })),
      Industries: industries.map((ind) => ({
        id: ind._id.toString(),
        title: ind.title,
        slug: ind.slug,
        intro: ind.intro,
        description: ind.description,
        items: ind.items || [],
        images: (ind.images || []).map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption || "",
          source: image.source,
          mediaId: image.mediaId ? String(image.mediaId) : undefined,
        })),
        isPublished: ind.isPublished,
      })),
      Company: company,
    };
  }

  async updateSection(section: string, data: any) {
    if (section === "Solutions") {
      return solutionService.replaceAll(data);
    }
    if (section === "Products") {
      return productService.replaceAll(data);
    }
    if (section === "Industries") {
      return industryService.replaceAll(data);
    }
    if (section === "Company") {
      return companyService.updateCompany(data);
    }
    throw new Error(`Unknown content section: ${section}`);
  }

  async resetAll() {
    await Promise.all([
      solutionService.replaceAll(DEFAULT_SITE_CONTENT.Solutions),
      productService.replaceAll(DEFAULT_SITE_CONTENT.Products),
      industryService.replaceAll(DEFAULT_SITE_CONTENT.Industries),
      companyService.updateCompany(DEFAULT_SITE_CONTENT.Company),
    ]);
    return this.getFullSiteContent();
  }
}

export const siteContentService = new SiteContentService();
