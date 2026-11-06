"use client";


import React, { useMemo, useState } from "react";
import { Briefcase, Edit2, Plus, Search, Trash2 } from "lucide-react";
import type { ProjectItem } from "@/lib/data/project-content";
import type { ContentImage } from "@/lib/content-types";
import { ImageMediaEditor } from "./ImageMediaEditor";
import { Modal } from "@/components/ui/modal";

interface ProjectsManagerProps {
  projects: ProjectItem[];
  onSaveProjects: (updated: ProjectItem[]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string) => void;
}

const emptyProject: ProjectItem = {
  code: "",
  title: "",
  sector: "",
  body: "",
  tags: [],
  images: [],
  isPublished: true,
};

export function ProjectsManager({
  projects,
  onSaveProjects,
  onTriggerToast,
}: ProjectsManagerProps) {
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<ProjectItem>(emptyProject);
  const [tagText, setTagText] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      [project.code, project.title, project.sector, project.body, ...project.tags]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [projects, search]);

  const openAdd = () => {
    setIsNew(true);
    setEditingProject(emptyProject);
    setForm(emptyProject);
    setTagText("");
  };

  const openEdit = (project: ProjectItem) => {
    setIsNew(false);
    setEditingProject(project);
    setForm({ ...project, images: project.images || [], isPublished: project.isPublished !== false });
    setTagText(project.tags.join(", "));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProject) return;

    const project = {
      ...form,
      code: form.code.trim(),
      title: form.title.trim(),
      sector: form.sector.trim(),
      body: form.body.trim(),
      images: (form.images || []).filter((image) => image.src.trim()),
      isPublished: form.isPublished !== false,
      tags: tagText.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean),
    };
    const updated = isNew
      ? [...projects, project]
      : projects.map((item) => item.code === editingProject.code ? project : item);

    try {
      await onSaveProjects(updated);
      onTriggerToast(isNew ? "Project Added" : "Project Updated", `Saved ${project.title}`);
      setEditingProject(null);
    } catch {
      // The dashboard reports the save error; keep the form open for correction.
    }
  };

  const handleDelete = async (project: ProjectItem) => {
    try {
      await onSaveProjects(projects.filter((item) => item.code !== project.code));
      onTriggerToast("Project Deleted", `Removed ${project.title}`);
    } catch {
      // The dashboard reports the save error.
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
          />
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-slate-300 bg-white/60">
          <Briefcase className="mx-auto mb-3 size-7 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">
            {projects.length ? "No projects match your search" : "No projects yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <article
              key={project.code}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h2 className="text-base font-semibold text-slate-900">{project.title}</h2>
                    <span className="font-mono bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">{project.code}</span>
                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">{project.sector}</span>
                  </div>
                  {project.images?.[0]?.src && <div className="mt-3 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.images[0].src} alt={project.images[0].alt || ""} className="size-16 rounded-lg border border-slate-200 object-cover" />
                    <span className="text-xs text-slate-500">{project.images.length} gallery {project.images.length === 1 ? "image" : "images"}</span>
                  </div>}
                  <p className="mt-2 max-w-4xl text-xs text-slate-600 leading-relaxed line-clamp-2">{project.body}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(project)}
                    aria-label={`Edit ${project.title}`}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    aria-label={`Delete ${project.title}`}
                    className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        eyebrow="Project content"
        title={isNew ? "Add Project" : "Edit Project"}
        description="Manage project details, gallery images, and public visibility."
        onSubmit={handleSave}
        bodyClassName="space-y-4"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingImage}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {isUploadingImage ? "Uploading image…" : "Save Project"}
            </button>
          </>
        }
      >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Project code
                  <input
                    required
                    maxLength={40}
                    value={form.code}
                    onChange={(event) => setForm({ ...form, code: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </label>
                <label className="space-y-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sector
                  <input
                    required
                    maxLength={160}
                    value={form.sector}
                    onChange={(event) => setForm({ ...form, sector: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </label>
              </div>
              <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Project title
                <input
                  required
                  maxLength={180}
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
                <textarea
                  required
                  maxLength={5000}
                  rows={5}
                  value={form.body}
                  onChange={(event) => setForm({ ...form, body: event.target.value })}
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tags <span className="font-normal text-slate-500">Separate with commas</span>
                <textarea
                  rows={2}
                  value={tagText}
                  onChange={(event) => setTagText(event.target.value)}
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </label>
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">Gallery images</h3>
                  <button type="button" onClick={() => setForm({ ...form, images: [...(form.images || []), { src: "", alt: "", caption: "", source: "upload" }] })} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">Add image</button>
                </div>
                {(form.images || []).length === 0 && <p className="rounded-lg border border-dashed border-slate-300 p-4 text-xs text-slate-500">Add images here. Uploaded files are stored in MongoDB and displayed on the Our Work gallery.</p>}
                {(form.images || []).map((image, index) => <ImageMediaEditor
                  key={`${image.mediaId || image.src || "new"}-${index}`}
                  image={image}
                  index={index}
                  title={`Gallery image ${index + 1}`}
                  onChange={(updated: ContentImage) => setForm({ ...form, images: (form.images || []).map((item, itemIndex) => itemIndex === index ? updated : item) })}
                  onRemove={() => setForm({ ...form, images: (form.images || []).filter((_, itemIndex) => itemIndex !== index) })}
                  onUploadingChange={setIsUploadingImage}
                />)}
              </section>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={form.isPublished !== false} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} /> Show this project in the public gallery</label>
      </Modal>
    </div>
  );
}