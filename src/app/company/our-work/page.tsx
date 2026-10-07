import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { contentService } from "@/lib/db/services/content.service";
import { OurWorkTemplate } from "@/app/[...slug]/_templates/OurWorkTemplate";
import type { ProjectItem } from "@/lib/data/project-content";

export const metadata: Metadata = {
  title: "Our Work | GeoSAT Solutions",
  description: "Explore GeoSAT's survey, LiDAR, GIS, and geospatial project portfolio.",
  alternates: { canonical: "https://geosatsoln.com/company/our-work" },
  openGraph: {
    title: "Our Work | GeoSAT Solutions",
    description: "Explore GeoSAT's survey, LiDAR, GIS, and geospatial project portfolio.",
    url: "https://geosatsoln.com/company/our-work",
    type: "website",
  },
};

export default async function OurWorkPage() {
  let projects: ProjectItem[] = [];
  try {
    const records = await contentService.getProjects(true);
    projects = records.map((project) => ({
      code: project.code,
      title: project.title,
      sector: project.sector,
      body: project.body,
      tags: project.tags || [],
      images: (project.images || []).map((image) => ({
        src: image.src,
        alt: image.alt || project.title,
        caption: image.caption || "",
        source: image.source,
        mediaId: image.mediaId ? String(image.mediaId) : undefined,
      })),
      isPublished: project.isPublished !== false,
    }));
  } catch (error) {
    console.error("Failed to load Our Work projects:", error);
  }

  const tab = { label: "Company" };
  const column = { title: "Our Work" };
  const item = {
    title: "Selected work",
    intro: "A closer look at the survey, LiDAR, GIS, and spatial data work delivered by our teams.",
    description: "",
  };

  return <><Navbar /><OurWorkTemplate item={item} tab={tab} column={column} projects={projects} /><Footer /></>;
}
