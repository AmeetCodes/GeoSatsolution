import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdminLoginAttempt extends Document {
  key: string;
  count: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminLoginAttemptSchema = new Schema<IAdminLoginAttempt>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    count: { type: Number, required: true, default: 0, min: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

AdminLoginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminLoginAttempt: Model<IAdminLoginAttempt> =
  mongoose.models.AdminLoginAttempt ||
  mongoose.model<IAdminLoginAttempt>("AdminLoginAttempt", AdminLoginAttemptSchema);
