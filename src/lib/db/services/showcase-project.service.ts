import { connectDB } from "@/lib/db/connection";
import { ShowcaseProject } from "@/lib/models/showcase-project";
import { NEPAL_DISTRICT_NAMES } from "@/lib/data/nepal-districts";

export type ProjectType = "service" | "sales";
export type ShowcaseProjectInput = {
  type: ProjectType; slug?: string; projectName?: string; productName?: string;
  districts?: string[]; latitude?: number | string; longitude?: number | string;
  avgElevation?: number | string; client?: string; partner?: string; area?: number | string;
  coverImage?: string; galleryImages?: string[];
};

const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-");
const numeric = (v: number | string | undefined) => v === undefined || v === "" ? undefined : Number(v);

export async function listShowcaseProjects(type?: ProjectType) {
  await connectDB();
  return ShowcaseProject.find(type ? { type } : {}).sort({ createdAt: -1 }).lean().exec();
}

export async function getShowcaseProject(slug: string) {
  await connectDB();
  return ShowcaseProject.findOne({ slug }).lean().exec();
}

export async function saveShowcaseProject(input: ShowcaseProjectInput, id?: string) {
  const name = input.type === "service" ? input.projectName?.trim() : input.productName?.trim();
  if (!name) throw new Error(input.type === "service" ? "Project name is required." : "Product name is required.");
  const districts = input.type === "service" ? [...new Set(input.districts ?? [])] : [];
  if (districts.some((d) => !NEPAL_DISTRICT_NAMES.includes(d))) throw new Error("Select valid Nepal districts.");
  const slugBase = slugify(name);
  await connectDB();
  let slug = input.slug?.trim() || slugBase;
  let duplicate = await ShowcaseProject.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) }).lean().exec();
  if (!input.slug && !id) {
    let suffix = 2;
    while (duplicate) {
      slug = `${slugBase}-${suffix++}`;
      duplicate = await ShowcaseProject.findOne({ slug }).lean().exec();
    }
  } else if (duplicate) {
    throw new Error("That project URL is already in use.");
  }
  const values = {
    type: input.type, slug, projectName: input.type === "service" ? name : undefined,
    productName: input.type === "sales" ? name : undefined, districts,
    latitude: numeric(input.latitude), longitude: numeric(input.longitude), avgElevation: numeric(input.avgElevation),
    client: input.client?.trim() ?? "", partner: input.type === "sales" ? input.partner?.trim() ?? "" : "",
    area: input.type === "service" ? numeric(input.area) ?? 0 : 0, coverImage: input.coverImage?.trim() ?? "",
    galleryImages: input.galleryImages ?? [],
  };
  if (id) return ShowcaseProject.findByIdAndUpdate(id, values, { new: true, runValidators: true }).lean().exec();
  return new ShowcaseProject(values).save();
}

export async function deleteShowcaseProject(id: string) {
  await connectDB();
  return ShowcaseProject.findByIdAndDelete(id).lean().exec();
}
