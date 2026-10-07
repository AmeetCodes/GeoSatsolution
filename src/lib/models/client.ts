import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  name: string;
  logo?: string;
  category?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
    source?: "upload" | "url";
    mediaId?: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String },
    category: { type: String, default: "Institutional" },
    description: { type: String, default: "" },
    image: {
      src: { type: String },
      alt: { type: String },
      source: { type: String, enum: ["upload", "url"] },
      mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
