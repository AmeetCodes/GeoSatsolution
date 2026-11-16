import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IShowcaseProject extends Document {
  type: "service" | "sales";
  slug: string;
  projectName?: string;
  productName?: string;
  districts: string[];
  latitude?: number;
  longitude?: number;
  avgElevation?: number;
  client: string;
  partner: string;
  area: number;
  coverImage: string;
  galleryImages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ShowcaseProjectSchema = new Schema<IShowcaseProject>({
  type: { type: String, enum: ["service", "sales"], required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  projectName: { type: String, trim: true },
  productName: { type: String, trim: true },
  districts: { type: [String], default: [] },
  latitude: Number,
  longitude: Number,
  avgElevation: Number,
  client: { type: String, default: "", trim: true },
  partner: { type: String, default: "", trim: true },
  area: { type: Number, default: 0, min: 0 },
  coverImage: { type: String, default: "" },
  galleryImages: { type: [String], default: [] },
}, { timestamps: true });

export const ShowcaseProject: Model<IShowcaseProject> = mongoose.models.ShowcaseProject || mongoose.model<IShowcaseProject>("ShowcaseProject", ShowcaseProjectSchema);
