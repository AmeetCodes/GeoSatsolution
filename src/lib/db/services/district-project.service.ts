import { revalidatePath } from "next/cache";
import {
  NEPAL_DISTRICTS,
  PROVINCE_NAMES,
  getDistrictByName,
} from "@/lib/data/nepal-districts";
import {
  districtProjectRepository,
  CreateDistrictProjectDTO,
  UpdateDistrictProjectDTO,
} from "../repositories/district-project.repository";
import type { IDistrictProject } from "../../models/district-project";
import type {
  DistrictCountEntry,
  DistrictCountResponse,
  DistrictProjectRecord,
  DistrictProjectStatus,
} from "@/lib/nepal-map-types";

export type { DistrictCountEntry, DistrictCountResponse } from "@/lib/nepal-map-types";

function emptyDistrictEntry(
  district: (typeof NEPAL_DISTRICTS)[number],
): DistrictCountEntry {
  return {
    count: 0,
    province: district.province,
    provinceName: PROVINCE_NAMES[district.province] ?? `Province ${district.province}`,
    lat: district.lat,
    lng: district.lng,
    projects: [],
  };
}

export class DistrictProjectService {
  async list(): Promise<IDistrictProject[]> {
    return districtProjectRepository.findAll();
  }

  /** Serializable list for server-rendered admin pages. */
  async listRecords(): Promise<DistrictProjectRecord[]> {
    let docs: IDistrictProject[] = [];
    try {
      docs = await districtProjectRepository.findAll();
    } catch (error) {
      console.error("Failed to list district projects:", error);
      return [];
    }

    return docs.map((doc) => ({
      id: String(doc._id),
      district: doc.district,
      province: doc.province,
      title: doc.title,
      category: doc.category,
      status: doc.status,
      latitude: doc.latitude,
      longitude: doc.longitude,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
    }));
  }

  /**
   * Returns project counts grouped by district for the public map. Every one of
   * Nepal's 77 districts is present (zero-count districts included) so tooltips
   * and the coverage summary stay accurate even when the database is empty.
   */
  async getDistrictCounts(): Promise<DistrictCountResponse> {
    const districts: Record<string, DistrictCountEntry> = {};
    for (const district of NEPAL_DISTRICTS) {
      districts[district.name] = emptyDistrictEntry(district);
    }

    let rows: Awaited<ReturnType<typeof districtProjectRepository.aggregateByDistrict>> = [];
    try {
      rows = await districtProjectRepository.aggregateByDistrict();
    } catch (error) {
      // A missing/unreachable database must not break the public map.
      console.error("Failed to aggregate district projects:", error);
    }

    let totalProjects = 0;
    const provinceTotals = new Map<number, number>();

    for (const row of rows) {
      const base = districts[row._id];
      if (!base) continue; // Ignore districts that are not in the canonical list.
      base.count = row.count;
      base.projects = (row.projects ?? []).map((project) => ({
        id: project.id,
        title: project.title || "Survey project",
        category: project.category || "Geospatial survey",
        status: project.status || "COMPLETED",
      }));
      totalProjects += row.count;
      provinceTotals.set(row.province, (provinceTotals.get(row.province) ?? 0) + row.count);
    }

    const districtsCovered = Object.values(districts).filter((entry) => entry.count > 0).length;

    let mostActiveProvince: DistrictCountResponse["summary"]["mostActiveProvince"] = null;
    for (const [id, count] of provinceTotals) {
      if (!mostActiveProvince || count > mostActiveProvince.count) {
        mostActiveProvince = { id, name: PROVINCE_NAMES[id] ?? `Province ${id}`, count };
      }
    }

    return {
      summary: {
        totalProjects,
        districtsCovered,
        totalDistricts: NEPAL_DISTRICTS.length,
        mostActiveProvince,
      },
      districts,
    };
  }

  private buildDTO(
    district: string,
    extra: Partial<CreateDistrictProjectDTO>,
  ): CreateDistrictProjectDTO {
    const meta = getDistrictByName(district);
    if (!meta) throw new Error(`Unknown district: ${district}`);
    return {
      district,
      province: meta.province,
      status: "COMPLETED",
      latitude: meta.lat,
      longitude: meta.lng,
      ...extra,
    };
  }

  async create(input: {
    district: string;
    title?: string;
    category?: string;
    status?: DistrictProjectStatus;
    latitude?: number;
    longitude?: number;
  }): Promise<IDistrictProject> {
    const saved = await districtProjectRepository.create(this.buildDTO(input.district, input));
    this.revalidate();
    return saved;
  }

  /** Adds a single project record to a district (bumps its count by one). */
  async increment(input: {
    district: string;
    title?: string;
    category?: string;
    status?: DistrictProjectStatus;
  }): Promise<IDistrictProject> {
    const saved = await districtProjectRepository.create(
      this.buildDTO(input.district, {
        title: input.title || "Field survey project",
        category: input.category || "Geospatial survey",
        status: input.status ?? "COMPLETED",
      }),
    );
    this.revalidate();
    return saved;
  }

  /** Removes the most recent project record from a district (count - one). */
  async decrement(district: string): Promise<boolean> {
    const latest = await districtProjectRepository.findLatestByDistrict(district);
    if (!latest) return false;
    const removed = await districtProjectRepository.deleteById(String(latest._id));
    if (removed) this.revalidate();
    return removed;
  }

  async update(id: string, data: UpdateDistrictProjectDTO): Promise<IDistrictProject | null> {
    const update: UpdateDistrictProjectDTO = { ...data };
    if (data.district) {
      const meta = getDistrictByName(data.district);
      if (!meta) throw new Error(`Unknown district: ${data.district}`);
      update.province = meta.province;
      if (data.latitude === undefined) update.latitude = meta.lat;
      if (data.longitude === undefined) update.longitude = meta.lng;
    }
    const saved = await districtProjectRepository.updateById(id, update);
    if (saved) this.revalidate();
    return saved;
  }

  async remove(id: string): Promise<boolean> {
    const removed = await districtProjectRepository.deleteById(id);
    if (removed) this.revalidate();
    return removed;
  }

  private revalidate() {
    try {
      revalidatePath("/", "page");
      revalidatePath("/admin", "page");
    } catch {
      // Revalidation is unavailable outside a Next.js request context.
    }
  }
}

export const districtProjectService = new DistrictProjectService();
