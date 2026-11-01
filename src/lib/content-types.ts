export type ContentImage = {
  src: string;
  alt: string;
  source?: "upload" | "url";
  mediaId?: string;
  caption?: string;
};

export type ContentFaq = {
  question: string;
  answer: string;
};

export type ProductDownloadItem = {
  id?: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName?: string;
  fileMediaId?: string;
  fileSource?: "upload" | "url";
  category?: string;
  fileType?: string;
  fileSize?: string | number;
};

export type ProductItem = {
  id?: string;
  title: string;
  slug?: string;
  group: string;
  subcategory?: string;
  brand?: string;
  brandUrl?: string;
  intro: string;
  description: string;
  outcomes: string[];
  images?: ContentImage[];
  specifications?: Record<string, string>;
  faqs?: ContentFaq[];
  resources?: ProductDownloadItem[];
  isPublished?: boolean;
  order?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type SolutionItem = {
  id?: string;
  title: string;
  slug?: string;
  group: string;
  intro: string;
  description: string;
  outcomes: string[];
  faqs?: ContentFaq[];
  images?: ContentImage[];
  isPublished?: boolean;
  order?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type IndustryItem = {
  id?: string;
  title: string;
  slug?: string;
  intro: string;
  description: string;
  items: string[];
  images?: ContentImage[];
  isPublished?: boolean;
  order?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type ResourceItem = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileSource?: "upload" | "url";
  fileMediaId?: string;
  fileName?: string;
  thumbnail?: ContentImage;
  updated: string;
  isPublished?: boolean;
  order?: number;
};

export type CompanyLeader = {
  id?: string;
  name: string;
  role: string;
  division?: string;
  bio?: string;
  expertise?: string;
  image?: ContentImage;
  accent?: string;
  imagePosition?: string;
  order?: number;
};

export type CompanyPartner = {
  id?: string;
  name: string;
  category?: string;
  tier?: string;
  description?: string;
  url?: string;
  logo?: ContentImage;
  order?: number;
};

export type CompanyClient = {
  id?: string;
  name: string;
  category: string;
  description?: string;
  url?: string;
  image?: ContentImage;
  order?: number;
};

export type CompanyInsight = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
  image?: ContentImage;
  author?: string;
  isPublished?: boolean;
};

export type CompanyContent = {
  Leadership: CompanyLeader[];
  Partners: CompanyPartner[];
  Clients: CompanyClient[];
  Insights: CompanyInsight[];
  Resources: ResourceItem[];
};

export type SiteContentData = {
  Solutions: SolutionItem[];
  Products: ProductItem[];
  Industries: IndustryItem[];
  Company: CompanyContent;
};
