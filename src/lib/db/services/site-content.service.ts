import { solutionService } from "./solution.service";
import { productService } from "./product.service";
import { industryService } from "./industry.service";
import { companyService } from "./company.service";
import { DEFAULT_SITE_CONTENT, SiteContentData } from "../../data-store";

export class SiteContentService {
  async getFullSiteContent(): Promise<SiteContentData> {
    let [solutions, products, industries, company] = await Promise.all([
      solutionService.getAllForAdmin(),
      productService.getAllForAdmin(),
      industryService.getAllForAdmin(),
      companyService.getCompanyData(),
    ]);

    if (solutions.length === 0) {
      const { seedDatabase } = await import("../seed");
      await seedDatabase(false);
      [solutions, products, industries, company] = await Promise.all([
        solutionService.getAllForAdmin(),
        productService.getAllForAdmin(),
        industryService.getAllForAdmin(),
        companyService.getCompanyData(),
      ]);
    }

    return {
      Solutions: solutions.map((s) => ({
        title: s.title,
        group: s.group,
        intro: s.intro,
        description: s.description,
        outcomes: s.outcomes || [],
        images: (s.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
        })),
      })),
      Products: products.map((p) => ({
        title: p.title,
        group: p.group,
        intro: p.intro,
        description: p.description,
        outcomes: p.outcomes || [],
        images: (p.images || []).map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || "",
        })),
      })),
      Industries: industries.map((ind) => ({
        title: ind.title,
        intro: ind.intro,
        description: ind.description,
        items: ind.items || [],
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
