import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICareer extends Document {
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  employmentType: string;
  applicationInfo: string;
  status: "open" | "closed";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    employmentType: { type: String, default: "Full-time" },
    applicationInfo: { type: String, default: "" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    summary: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Career: Model<ICareer> =
  mongoose.models.Career || mongoose.model<ICareer>("Career", CareerSchema);
