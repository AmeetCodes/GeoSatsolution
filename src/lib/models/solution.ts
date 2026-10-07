import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISolutionImage {
  src: string;
  alt: string;
  caption?: string;
  source?: "upload" | "url";
  mediaId?: string;
}

export interface ISolution extends Document {
  title: string;              // Subclass Name (e.g., "UAV LiDAR Survey")
  slug: string;               // URL-friendly slug (e.g., "uav-lidar-survey")
  group: string;              // Class / Category Name (e.g., "Survey & Mapping")
  intro: string;              // Short summary
  description: string;        // Full details
  outcomes: string[];         // Key deliverables/outcomes list
  faqs: { question: string; answer: string }[];
  images: ISolutionImage[];   // Gallery/Header images
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SolutionSchema = new Schema<ISolution>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    group: { type: String, required: true, trim: true, index: true },
    intro: { type: String, default: "" },
    description: { type: String, default: "" },
    outcomes: { type: [String], default: [] },
    faqs: [{ question: { type: String, required: true }, answer: { type: String, required: true } }],
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
        source: { type: String, enum: ["upload", "url"] },
        mediaId: { type: String, match: /^[a-f\d]{24}$/i },
      },
    ],
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Solution: Model<ISolution> =
  mongoose.models.Solution || mongoose.model<ISolution>("Solution", SolutionSchema);
