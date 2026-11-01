/**
 * Shared, client-safe types for the Nepal district project map.
 * Kept free of server-only imports so both the API/service layer and the
 * browser components can consume them.
 */

export type DistrictProjectStatus = "COMPLETED" | "ONGOING";

export type DistrictProject = {
  id: string;
  district: string;
  province: number;
  status: DistrictProjectStatus;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DistrictProjectRecord = DistrictProject;

export type AdminMapState = {
  district: string;
  projectCount: number;
  status: DistrictProjectStatus;
};

export type DistrictCountEntry = {
  count: number;
  province: number;
  provinceName: string;
  lat: number;
  lng: number;
  projects: {
    id: string;
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
