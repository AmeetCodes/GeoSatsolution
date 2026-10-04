import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavGroup {
  title: string;
  links: string[];
}

export interface INavItem {
  label: string;
  href: string;
  groups?: INavGroup[];
  order: number;
}

export interface INavigation extends Document {
  items: INavItem[];
  updatedAt: Date;
}

const NavGroupSchema = new Schema<INavGroup>({
  title: { type: String, required: true },
  links: { type: [String], required: true },
});

const NavItemSchema = new Schema<INavItem>({
  label: { type: String, required: true },
  href: { type: String, required: true },
  groups: [NavGroupSchema],
  order: { type: Number, default: 0 },
});

const NavigationSchema = new Schema<INavigation>(
  {
    items: [NavItemSchema],
  },
  { timestamps: true }
);

export const Navigation: Model<INavigation> =
  mongoose.models.Navigation || mongoose.model<INavigation>("Navigation", NavigationSchema);