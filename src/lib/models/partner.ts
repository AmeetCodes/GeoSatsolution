import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPartner extends Document {
  customId?: string;
  name: string;
  category: string;
  tier: string;
  description: string;
  logo?: {
    src: string;
    alt: string;
    source?: "upload" | "url";
    mediaId?: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    customId: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tier: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    logo: {
      src: { type: String },
      alt: { type: String },
      source: { type: String, enum: ["upload", "url"] },
      mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Partner: Model<IPartner> =
  mongoose.models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);
