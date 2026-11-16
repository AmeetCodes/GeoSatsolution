import mongoose, { Schema, Document, Model } from "mongoose";
import { slugify } from "../utils";
import type { DescriptionAlignment } from "../description-alignment";

export type SolutionImageFitMode = "contain" | "cover";
export type SolutionImageFocalPosition = "center" | "top" | "bottom" | "left" | "right";

export interface ISolutionImage {
  src: string;
  alt: string;
  caption?: string;
  source?: "upload" | "url";
  mediaId?: string;
  order?: number;
  fitMode?: SolutionImageFitMode;
  focalPosition?: SolutionImageFocalPosition;
}

export interface ISolution extends Document {
  title: string;              // Service name (e.g., "LiDAR Survey")
  slug: string;               // URL-friendly slug (e.g., "lidar-survey")
  group: string;              // Class / Category Name (e.g., "Survey & Mapping")
  intro: string;              // Short summary
  description: string;        // Full details
  descriptionAlignment: DescriptionAlignment;
  outcomes: string[];         // Key deliverables/outcomes list
  faqs: { question: string; answer: string; order?: number }[];
  faqsInitialized: boolean;
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
    descriptionAlignment: { type: String, enum: ["justify", "left"], default: "justify" },
    outcomes: { type: [String], default: [] },
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
      order: { type: Number, default: 0 },
    }],
    faqsInitialized: { type: Boolean, default: false },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
        source: { type: String, enum: ["upload", "url"] },
        mediaId: { type: String, match: /^[a-f\d]{24}$/i },
        order: { type: Number, default: 0 },
        fitMode: { type: String, enum: ["contain", "cover"], default: "contain" },
        focalPosition: { type: String, enum: ["center", "top", "bottom", "left", "right"], default: "center" },
      },
    ],
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Generate a clean URL slug automatically when one is not supplied.
SolutionSchema.pre("validate", function () {
  if (!this.slug?.trim() && this.title?.trim()) {
    this.slug = slugify(this.title);
  }
});

// Rebuild a stale dev-server model after schema changes so newly added image
// fields are not dropped by Mongoose strict mode during hot reloads.
if (mongoose.models.Solution && (!mongoose.models.Solution.schema.path("images.fitMode") || !mongoose.models.Solution.schema.path("descriptionAlignment") || !mongoose.models.Solution.schema.path("faqsInitialized"))) {
  delete mongoose.models.Solution;
}

export const Solution: Model<ISolution> =
  mongoose.models.Solution || mongoose.model<ISolution>("Solution", SolutionSchema);
