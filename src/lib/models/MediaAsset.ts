import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaAsset extends Document {
  mimeType: string;
  originalName: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    mimeType: { type: String, required: true },
    originalName: { type: String, required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
