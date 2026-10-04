import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEquipment extends Document {
  label: string;
  value: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema = new Schema<IEquipment>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Equipment: Model<IEquipment> =
  mongoose.models.Equipment || mongoose.model<IEquipment>("Equipment", EquipmentSchema);