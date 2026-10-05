"use client";

import React, { useMemo, useState } from "react";
import { Briefcase, Edit2, Plus, Search, Trash2 } from "lucide-react";
import type { ProjectItem } from "@/lib/data/project-content";

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
    setForm({ ...project });
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
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-[#f1ece5]/80 p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="w-full rounded-lg border border-zinc-700 bg-[#f1ece5] py-2 pl-9 pr-3 text-sm text-zinc-950 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 py-14 text-center">
          <Briefcase className="mx-auto mb-3 size-7 text-zinc-500" />
          <p className="text-sm font-medium text-zinc-300">
            {projects.length ? "No projects match your search" : "No projects yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <article
              key={project.code}
              className="rounded-xl border border-zinc-800 bg-[#f1ece5]/50 p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-xs font-semibold text-cyan-400">{project.code}</span>
                    <span className="text-xs text-zinc-500">{project.sector}</span>
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-zinc-100">{project.title}</h2>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-400">{project.body}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-zinc-700 px-2 py-1 text-[11px] text-zinc-300">
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
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    aria-label={`Delete ${project.title}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-red-900/70 text-red-400 transition-colors hover:bg-red-950/50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl border border-zinc-700 bg-zinc-950 p-5 text-zinc-100 shadow-2xl sm:p-6">
            <h2 className="text-lg font-semibold">{isNew ? "Add Project" : "Edit Project"}</h2>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-medium text-zinc-300">
                  Project code
                  <input
                    required
                    maxLength={40}
                    value={form.code}
                    onChange={(event) => setForm({ ...form, code: event.target.value })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </label>
                <label className="space-y-1.5 text-xs font-medium text-zinc-300">
                  Sector
                  <input
                    required
                    maxLength={160}
                    value={form.sector}
                    onChange={(event) => setForm({ ...form, sector: event.target.value })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </label>
              </div>
              <label className="block space-y-1.5 text-xs font-medium text-zinc-300">
                Project title
                <input
                  required
                  maxLength={180}
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-medium text-zinc-300">
                Description
                <textarea
                  required
                  maxLength={5000}
                  rows={5}
                  value={form.body}
                  onChange={(event) => setForm({ ...form, body: event.target.value })}
                  className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm leading-relaxed text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-medium text-zinc-300">
                Tags <span className="font-normal text-zinc-500">Separate with commas</span>
                <textarea
                  rows={2}
                  value={tagText}
                  onChange={(event) => setTagText(event.target.value)}
                  className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </label>
              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-3.5 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}