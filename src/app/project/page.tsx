import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listShowcaseProjects } from "@/lib/db/services/showcase-project.service";

export const metadata: Metadata = { title: "Projects | GeoSAT Solutions", description: "Service and sales projects by GeoSAT Solutions." };
export const dynamic = "force-dynamic";

function ProjectCard({ project }: { project: Awaited<ReturnType<typeof listShowcaseProjects>>[number] }) {
  const title = project.projectName ?? project.productName ?? "GeoSAT project";
  return <Link href={`/project/${project.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="relative aspect-[16/10] bg-slate-100">{project.coverImage ? <Image src={project.coverImage} alt={title} fill unoptimized className="object-cover transition duration-500 group-hover:scale-[1.03]"/> : <div className="grid h-full place-items-center text-sm text-slate-400">GeoSAT Solutions</div>}</div>
    <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">{project.type === "service" ? "Service project" : "Sales project"}</p><h3 className="mt-2 font-heading text-xl font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{project.type === "service" ? `${(project.districts ?? []).join(", ") || "Nepal"} · ${Number(project.area ?? 0).toLocaleString()} km²` : `Partner: ${project.partner || "—"}`}</p>{project.client && <p className="mt-1 text-sm text-slate-500">Client: {project.client}</p>}</div>
  </Link>;
}

export default async function ProjectPage() {
  const projects = await listShowcaseProjects().catch(() => []);
  const services = projects.filter((p) => p.type === "service");
  const sales = projects.filter((p) => p.type === "sales");
  return <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl">
    <Link href="/" aria-label="Back to home" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><ArrowLeft className="size-4"/></Link>
    <header className="mx-auto mb-14 max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-700">Our work</p><h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Projects</h1><p className="mt-4 text-base leading-7 text-slate-600">Explore our service work across Nepal and the geospatial products we deliver with our partners.</p></header>
    {[{ name: "Service Projects", items: services, desc: "Surveying, mapping, and monitoring work delivered across Nepal." }, { name: "Sales Projects", items: sales, desc: "Products supplied to clients in collaboration with our partners." }].map((section) => <section key={section.name} className="mb-16"><div className="mb-6"><h2 className="font-heading text-2xl font-semibold text-slate-900">{section.name}</h2><p className="mt-1 text-sm text-slate-600">{section.desc}</p></div>{section.items.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{section.items.map((project) => <ProjectCard key={String(project._id)} project={project}/>)}</div> : <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">Projects will be added here soon.</p>}</section>)}
  </div></main>;
}
