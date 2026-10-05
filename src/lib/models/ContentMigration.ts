import mongoose, { Model, Schema } from "mongoose";

export interface IContentMigration {
  _id: string;
  appliedAt: Date;
}

const ContentMigrationSchema = new Schema<IContentMigration>({
  _id: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
}, { versionKey: false });

export const ContentMigration: Model<IContentMigration> = mongoose.models.ContentMigration || mongoose.model<IContentMigration>("ContentMigration", ContentMigrationSchema);
