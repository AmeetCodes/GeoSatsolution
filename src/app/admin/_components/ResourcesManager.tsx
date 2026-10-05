"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ResourceItem } from "@/lib/data-store";

const emptyResource = (): ResourceItem => ({ slug: "", title: "", category: "Technical reference", description: "", fileUrl: "", updated: new Date().toISOString().slice(0, 10), isPublished: true });

export function ResourcesManager({ resources = [], onSave }: { resources?: ResourceItem[]; onSave: (items: ResourceItem[]) => Promise<void> }) {
  const [form, setForm] = useState<ResourceItem | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const update = (key: keyof ResourceItem, value: unknown) => setForm((current) => current ? { ...current, [key]: value } : current);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    const item = { ...form, slug: form.slug || form.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") };
    await onSave(editingSlug ? resources.map((resource) => resource.slug === editingSlug ? item : resource) : [item, ...resources]);
    setForm(null);
  };
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-zinc-950">Downloads &amp; Technical Resources</h3><p className="mt-1 text-xs text-zinc-500">Manage resources shown in the existing downloads layout.</p></div><button type="button" onClick={() => { setEditingSlug(null); setForm(emptyResource()); }} className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white"><Plus size={14} />Add resource</button></div>
    {form && <form onSubmit={save} className="grid gap-3 rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 sm:grid-cols-2">
      <input required placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white" />
      <input placeholder="Slug (generated from title when blank)" value={form.slug} onChange={(e) => update("slug", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white" />
      <input required placeholder="Category" value={form.category} onChange={(e) => update("category", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white" />
      <input type="date" value={form.updated} onChange={(e) => update("updated", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white" />
      <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white sm:col-span-2" rows={3} />
      <input placeholder="Resource file URL" value={form.fileUrl} onChange={(e) => update("fileUrl", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white sm:col-span-2" />
      <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />Published</label>
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setForm(null)} className="rounded-md px-3 py-2 text-xs text-zinc-400">Cancel</button><button className="rounded-md bg-cyan-500 px-3 py-2 text-xs font-semibold text-zinc-950">Save resource</button></div>
    </form>}
    <div className="space-y-2">{resources.map((resource) => <div key={resource.slug} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"><div><p className="text-sm font-semibold text-zinc-100">{resource.title}</p><p className="text-xs text-zinc-400">{resource.category} · {resource.isPublished ? "Published" : "Unpublished"}</p></div><div className="flex gap-2"><button type="button" aria-label={`Edit ${resource.title}`} onClick={() => { setEditingSlug(resource.slug); setForm({ ...resource }); }} className="rounded p-2 text-zinc-400 hover:text-white"><Pencil size={14} /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => void onSave(resources.filter((item) => item.slug !== resource.slug))} className="rounded p-2 text-red-400"><Trash2 size={14} /></button></div></div>)}</div>
  </div>;
}
