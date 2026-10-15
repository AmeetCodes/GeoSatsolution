import connectDB from "../connection";
import {
  DistrictProject,
  IDistrictProject,
  DistrictProjectStatus,
} from "../../models/district-project";

export interface CreateDistrictProjectDTO {
  district: string;
  province: number;
  title?: string;
  category?: string;
  status?: DistrictProjectStatus;
  latitude?: number;
  longitude?: number;
}

export interface UpdateDistrictProjectDTO {
  district?: string;
  province?: number;
  title?: string;
  category?: string;
  status?: DistrictProjectStatus;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DistrictAggregateRow {
  _id: string;
  count: number;
  province: number;
  projects: {
    id: string;
    title: string;
    category: string;
    status: DistrictProjectStatus;
  }[];
}

export class DistrictProjectRepository {
  async findAll(): Promise<IDistrictProject[]> {
    await connectDB();
    return DistrictProject.find({})
      .sort({ province: 1, district: 1, createdAt: -1 })
      .lean()
      .exec() as unknown as Promise<IDistrictProject[]>;
  }

  async count(): Promise<number> {
    await connectDB();
    return DistrictProject.countDocuments();
  }

  async create(data: CreateDistrictProjectDTO): Promise<IDistrictProject> {
    await connectDB();
    const doc = new DistrictProject(data);
    return doc.save() as unknown as Promise<IDistrictProject>;
  }

  async updateById(
    id: string,
    data: UpdateDistrictProjectDTO,
  ): Promise<IDistrictProject | null> {
    await connectDB();
    return DistrictProject.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    )
      .lean()
      .exec() as unknown as Promise<IDistrictProject | null>;
  }

  async findLatestByDistrict(district: string): Promise<IDistrictProject | null> {
    await connectDB();
    return DistrictProject.findOne({ district })
      .sort({ createdAt: -1 })
      .lean()
      .exec() as unknown as Promise<IDistrictProject | null>;
  }

  async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const res = await DistrictProject.findByIdAndDelete(id).exec();
    return Boolean(res);
  }

  async deleteByDistrict(district: string): Promise<number> {
    await connectDB();
    const res = await DistrictProject.deleteMany({ district }).exec();
    return res.deletedCount ?? 0;
  }

  /** Aggregate project counts (and light project metadata) per district. */
  async aggregateByDistrict(): Promise<DistrictAggregateRow[]> {
    await connectDB();
    const rows = await DistrictProject.aggregate<{
      _id: string;
      count: number;
      province: number;
      projects: {
        id: string;
        title: string;
        category: string;
        status: DistrictProjectStatus;
      }[];
    }>([
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 },
          province: { $first: "$province" },
          projects: {
            $push: {
              id: { $toString: "$_id" },
              title: { $ifNull: ["$title", ""] },
              category: { $ifNull: ["$category", ""] },
              status: { $ifNull: ["$status", "COMPLETED"] },
            },
          },
        },
      },
    ]).exec();

    return rows.map((row) => ({
      _id: row._id,
      count: row.count,
      province: row.province,
      projects: row.projects,
    }));
  }
}

export const districtProjectRepository = new DistrictProjectRepository();
