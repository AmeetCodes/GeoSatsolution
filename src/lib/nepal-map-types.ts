/**
 * Shared, client-safe types for the Nepal district project map.
 * Kept free of server-only imports so both the API/service layer and the
 * browser components can consume them.
 */

export type DistrictProjectStatus = "COMPLETED" | "ONGOING";

export type DistrictProjectRecord = {
  id: string;
  district: string;
  province: number;
  title?: string;
  category?: string;
  status: DistrictProjectStatus;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DistrictCountEntry = {
  count: number;
  province: number;
  provinceName: string;
  lat: number;
  lng: number;
  projects: {
    id: string;
    title: string;
    category: string;
    status: DistrictProjectStatus;
  }[];
};

export type DistrictCountResponse = {
  summary: {
    totalProjects: number;
    districtsCovered: number;
    totalDistricts: number;
    mostActiveProvince: { id: number; name: string; count: number } | null;
  };
  districts: Record<string, DistrictCountEntry>;
};
