import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavItemImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface INavItemMetadata {
  metaTitle?: string;
  metaDescription?: string;
}

export interface INavTreeItemModel {
  id: string;
  title: string;
  slug: string;
  href?: string;
  order: number;
  intro?: string;
  description?: string;
  outcomes?: string[];
  images?: INavItemImage[];
  metadata?: INavItemMetadata;
}

export interface INavTreeColumnModel {
  id: string;
  title: string;
  slug: string;
  order: number;
  items: INavTreeItemModel[];
}

export interface INavTreeTabModel {
  id: string;
  label: string;
  slug: string;
  href: string;
  order: number;
  type?: "columns" | "cards";
  footerNote?: string;
  catalogueCta?: string;
  columns: INavTreeColumnModel[];
}

export interface INavigationTreeDoc extends Document {
  treeKey: string;
  tabs: INavTreeTabModel[];
  createdAt: Date;
  updatedAt: Date;
}

const NavItemImageSchema = new Schema<INavItemImage>(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const NavItemMetadataSchema = new Schema<INavItemMetadata>(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { _id: false }
);

const NavTreeItemSchema = new Schema<INavTreeItemModel>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    href: { type: String },
    order: { type: Number, default: 0 },
    intro: { type: String },
    description: { type: String },
    outcomes: { type: [String], default: [] },
    images: { type: [NavItemImageSchema], default: [] },
    metadata: { type: NavItemMetadataSchema },
  },
  { _id: false }
);

const NavTreeColumnSchema = new Schema<INavTreeColumnModel>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    items: { type: [NavTreeItemSchema], default: [] },
  },
  { _id: false }
);

const NavTreeTabSchema = new Schema<INavTreeTabModel>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    slug: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ["columns", "cards"], default: "columns" },
    footerNote: { type: String },
    catalogueCta: { type: String },
    columns: { type: [NavTreeColumnSchema], default: [] },
  },
  { _id: false }
);

const NavigationTreeSchema = new Schema<INavigationTreeDoc>(
  {
    treeKey: { type: String, required: true, unique: true, default: "default" },
    tabs: { type: [NavTreeTabSchema], default: [] },
  },
  { timestamps: true }
);

export const Navigation: Model<INavigationTreeDoc> =
  mongoose.models.Navigation ||
  mongoose.model<INavigationTreeDoc>("Navigation", NavigationTreeSchema);