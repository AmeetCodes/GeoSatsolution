import mongoose, { Schema, Document, Model } from "mongoose";

export type DistrictProjectStatus = "COMPLETED" | "ONGOING";

export interface IDistrictProject extends Document {
  district: string; // e.g. "Jajarkot", "Rukum West", "Tanahu", "Palpa"
  province: number; // Province 1-7
  title?: string; // Optional project title
  category?: string; // e.g. "UAV LiDAR", "Cadastral Survey"
  status: DistrictProjectStatus;
  latitude?: number; // Optional pin offset
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictProjectSchema = new Schema<IDistrictProject>(
  {
    district: { type: String, required: true, trim: true, index: true },
    province: { type: Number, required: true, min: 1, max: 7, index: true },
    title: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["COMPLETED", "ONGOING"],
      default: "COMPLETED",
      index: true,
    },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true },
);

DistrictProjectSchema.index({ district: 1, createdAt: -1 });

export const DistrictProject: Model<IDistrictProject> =
  mongoose.models.DistrictProject ||
  mongoose.model<IDistrictProject>("DistrictProject", DistrictProjectSchema);
