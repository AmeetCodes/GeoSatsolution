import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ProjectItem } from "@/lib/data/project-content";
import DomeGallery, { type DomeGalleryImage } from "@/components/ui/DomeGallery";

export function OurWorkTemplate({ item, tab, column, projects }: { item: any; tab: any; column: any; projects: ProjectItem[] }) {
  const images: DomeGalleryImage[] = projects
    .filter((project) => project.isPublished !== false)
    .flatMap((project) => (project.images || []).map((image) => ({
      src: image.src,
      alt: image.alt || project.title,
      caption: image.caption,
      title: project.title,
      sector: project.sector,
      description: project.body,
      code: project.code,
    })))
    .filter((image) => image.src);

  const projectPlaceholders: DomeGalleryImage[] = projects
    .filter((project) => project.isPublished !== false)
    .filter((project) => !(project.images || []).some((image) => image.src))
    .map((project) => ({
      src: "",
      alt: `${project.title} project tile`,
      caption: "Add project images in Admin → Projects to replace this visual.",
      title: project.title,
      sector: project.sector,
      description: project.body,
      code: project.code,
    }));

  return <main className="min-h-screen bg-abyss pb-16 pt-[calc(var(--nav-h)+1.5rem)] sm:pt-[calc(var(--nav-h)+2rem)]">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
      <nav className="mb-7 flex items-center gap-2 text-sm text-ink-3" aria-label="Breadcrumb">
        <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-aqua"><ArrowLeft className="size-4" aria-hidden="true" />Home</Link>
        <ChevronRight className="size-3 text-ink-4" aria-hidden="true" />
        <span>{tab.label}</span>
        <ChevronRight className="size-3 text-ink-4" aria-hidden="true" />
        <span className="text-aqua">{column.title}</span>
      </nav>
      <header className="mb-3 max-w-3xl">
        <p className="label text-aqua">{column.title}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">{item.title || "Our Work"}</h1>
        {(item.intro || item.description) && <p className="mt-4 text-base leading-7 text-ink-3">{item.intro || item.description}</p>}
      </header>
      <DomeGallery images={images} placeholderProjects={projectPlaceholders} fit={0.8} minRadius={600} maxVerticalRotationDeg={0} segments={34} dragDampening={2} grayscale />
    </div>
  </main>;
}
