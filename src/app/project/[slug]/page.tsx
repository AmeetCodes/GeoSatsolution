import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getShowcaseProject } from "@/lib/db/services/showcase-project.service";
import { ProjectPhotoGallery } from "./_components/ProjectPhotoGallery";
import { ProjectSpecifications, type ProjectSpecification } from "./_components/ProjectSpecifications";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getShowcaseProject(slug);
  return {
    title: project
      ? `${project.projectName ?? project.productName} | Projects`
      : "Project | GeoSAT Solutions",
  };
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function formatArea(value?: number | null) {
  if (value == null) return null;
  const area = Number(value);
  if (!Number.isFinite(area) || area <= 0) return null;
  return `${numberFormatter.format(area)} km²`;
}

function formatElevation(value?: number | null) {
  if (value == null) return null;
  const elevation = Number(value);
  if (!Number.isFinite(elevation)) return null;
  return `${numberFormatter.format(elevation)} m ASL`;
}

function formatCoordinate(
  value: number | null | undefined,
  positive: string,
  negative: string,
) {
  if (value == null) return null;
  const coordinate = Number(value);
  if (!Number.isFinite(coordinate)) return null;
  const direction = coordinate >= 0 ? positive : negative;
  return `${Math.abs(coordinate).toFixed(4)}° ${direction}`;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getShowcaseProject(slug);
  if (!project) notFound();

  const service = project.type === "service";
  const title = project.projectName ?? project.productName ?? "GeoSAT Project";
  const specs: ProjectSpecification[] = [];
  const addSpec = (label: string, value: string | null | undefined) => {
    if (value?.trim()) specs.push({ label, value: value.trim() });
  };

  if (service) {
    addSpec("Client", project.client);
    addSpec("Districts", project.districts?.join(", "));
    addSpec("Area covered", formatArea(project.area));
    addSpec("Average elevation", formatElevation(project.avgElevation));
    addSpec("Latitude", formatCoordinate(project.latitude, "N", "S"));
    addSpec("Longitude", formatCoordinate(project.longitude, "E", "W"));
  } else {
    addSpec("Product", project.productName ?? title);
    addSpec("Client", project.client);
    addSpec("Partner", project.partner);
  }

  const images = Array.from(
    new Set([project.coverImage, ...(project.galleryImages ?? [])].filter(Boolean)),
  ) as string[];

  return (
    <main className="min-h-screen bg-slate-50 px-5 pb-16 pt-5 sm:px-8 sm:pt-6 lg:px-12">
      <article className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link
            href="/project"
            aria-label="Back to projects"
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        <header className="mb-8 mt-7 border-b border-slate-200 pb-6 sm:mt-9">
          <p className="text-sm text-slate-500">{service ? "Service project" : "Sales project"}</p>
          <h1 className="mt-2 max-w-4xl font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
        </header>

        <section aria-labelledby="project-details-heading" className="mb-10">
          <h2
            id="project-details-heading"
            className="mb-4 font-heading text-xl font-semibold tracking-tight text-slate-900"
          >
            Project details
          </h2>

          {specs.length > 0 ? (
            <ProjectSpecifications items={specs} />
          ) : (
            <p className="border-y border-slate-200 py-5 text-sm text-slate-500">
              Specifications for this project will be added soon.
            </p>
          )}
        </section>

        {images.length > 0 && (
          <section aria-labelledby="project-photos-heading" className="mt-8">
            <h2
              id="project-photos-heading"
              className="mb-4 font-heading text-xl font-semibold tracking-tight text-slate-900"
            >
              Photos
            </h2>

            <ProjectPhotoGallery images={images} title={title} />
          </section>
        )}
      </article>
    </main>
  );
}
