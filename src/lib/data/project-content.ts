import type { ContentImage } from "@/lib/content-types";

export interface ProjectItem {
  code: string;
  title: string;
  sector: string;
  body: string;
  tags: string[];
  images?: ContentImage[];
  isPublished?: boolean;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    code: "HYD-04",
    title: "Hydropower LiDAR corridors",
    sector: "Hydropower & Energy",
    body: "Full-surface corridor capture for penstock alignment and reservoir drawdown planning, delivered as classified point clouds with hydrographic bathymetry merged into one model.",
    tags: ["UAV LiDAR", "Bathymetry", "Volumetrics"],
    images: [],
    isPublished: true,
  },
  {
    code: "PWR-11",
    title: "Transmission route selection",
    sector: "Transmission Lines",
    body: "Comparative terrain corridors across steep valley geometry, so tower positions are chosen against surveyed ground rather than desktop contours.",
    tags: ["Corridor LiDAR", "Engineering Survey", "Slope analysis"],
    images: [],
    isPublished: true,
  },
  {
    code: "URB-02",
    title: "Municipal digital twin",
    sector: "Smart Cities & Digital Twins",
    body: "A city-scale spatial base combining aerial capture, enterprise GIS and asset registers — one authoritative model for planning and asset teams.",
    tags: ["Enterprise GIS", "Orthomosaics", "Asset registry"],
    images: [],
    isPublished: true,
  },
  {
    code: "FOR-07",
    title: "Forest biomass inventories",
    sector: "Forestry & Biomass",
    body: "Multispectral and LiDAR-derived canopy metrics for stand-level volume estimation, reducing field sampling density without losing confidence.",
    tags: ["Remote Sensing", "LiDAR", "Analysis"],
    images: [],
    isPublished: true,
  },
];
