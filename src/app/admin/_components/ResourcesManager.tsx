"use client";

import type { ContentImage, ResourceItem } from '@/lib/content-types';

import { useState } from "react";
import { Download, FileText, LoaderCircle, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { ImageMediaEditor } from "./ImageMediaEditor";

const emptyResource = (): ResourceItem => ({
  slug: "", title: "", category: "Technical reference", description: "", fileUrl: "",
  fileSource: "upload", fileName: "", updated: new Date().toISOString().slice(0, 10), isPublished: true,
});
const ACCEPTED_FILES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rtf,.csv,.txt,.zip,.jpg,.jpeg,.png,.webp,.gif,.avif";

export function ResourcesManager({ resources = [], onSave }: { resources?: ResourceItem[]; onSave: (items: ResourceItem[]) => Promise<void> }) {
  const [form, setForm] = useState<ResourceItem | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof ResourceItem>(key: K, value: ResourceItem[K]) => setForm((current) => current ? { ...current, [key]: value } : current);

  const uploadFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/admin/documents", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "The file could not be uploaded.");
      setForm((current) => current ? {
        ...current,
        fileUrl: result.data.fileUrl,
        fileSource: "upload",
        fileMediaId: result.data.fileMediaId,
        fileName: result.data.fileName,
      } : current);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The file could not be uploaded.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form || uploading) return;
    setSaving(true);
    const item: ResourceItem = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      thumbnail: form.thumbnail?.src ? form.thumbnail : undefined,
      ...(form.fileSource === "upload" && form.fileMediaId ? {} : { fileSource: "url", fileMediaId: undefined, fileName: form.fileName || "" }),
    };
    try {
      await onSave(editingSlug ? resources.map((resource) => resource.slug === editingSlug ? item : resource) : [item, ...resources]);
      setForm(null);
      setEditingSlug(null);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (resource: ResourceItem) => {
    setError("");
    setEditingSlug(resource.slug);
    setForm({ ...resource, fileSource: resource.fileSource || "url" });
  };

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div><h3 className="text-lg font-semibold text-slate-900">Downloads &amp; Technical Resources</h3><p className="mt-1 text-xs text-slate-500">Upload PDFs, office files, images, or add an external download link. Published items appear on the resources page.</p></div>
      <button type="button" onClick={() => { setEditingSlug(null); setError(""); setForm(emptyResource()); }} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"><Plus size={14} />Add resource</button>
    </div>

    {form && <form onSubmit={save} className="grid gap-4 bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:grid-cols-2">
      <div className="sm:col-span-2"><h4 className="text-lg font-semibold text-slate-900">{editingSlug ? "Edit resource" : "New resource"}</h4><p className="mt-1 text-xs text-slate-500">Resource details and uploaded files are saved to the database.</p></div>
      <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Title<input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Resource title" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></label>
      <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Slug<input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="generated-from-title" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></label>
      <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Category<input required value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Technical reference" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></label>
      <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Last updated<input type="date" value={form.updated} onChange={(e) => update("updated", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></label>
      <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:col-span-2">Description<textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe what this resource contains and who it is for." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></label>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <div><p className="text-sm font-semibold text-slate-900">Download file</p><p className="mt-1 text-xs text-slate-500">Up to 20 MB. PDF, Word, Excel, PowerPoint, CSV, text, ZIP, or image files.</p></div>
        <label className="flex cursor-pointer flex-wrap items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-emerald-400">
          {uploading ? <LoaderCircle className="size-4 animate-spin text-emerald-600" /> : <Upload className="size-4 text-emerald-600" />}
          <span>{uploading ? "Uploading file…" : form.fileName || "Choose a local file"}</span>
          <input type="file" accept={ACCEPTED_FILES} disabled={uploading} onChange={(e) => void uploadFile(e.target.files?.[0])} className="sr-only" />
        </label>
        {form.fileUrl && <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"><span className="truncate">{form.fileName || form.fileUrl}</span><button type="button" onClick={() => setForm({ ...form, fileUrl: "", fileSource: "url", fileMediaId: undefined, fileName: "" })} className="shrink-0 font-semibold text-rose-600 transition-colors hover:text-rose-700">Remove</button></div>}
        <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Or use a file URL<input value={form.fileSource === "url" ? form.fileUrl : ""} onChange={(e) => setForm({ ...form, fileUrl: e.target.value, fileSource: "url", fileMediaId: undefined, fileName: e.target.value ? form.fileName : "" })} placeholder="https://… or /documents/file.pdf" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></label>
        {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      </div>

      <div className="sm:col-span-2"><ImageMediaEditor index={0} showCaption={false} image={form.thumbnail ? { ...form.thumbnail, caption: "" } : { src: "", alt: form.title, caption: "", source: "url" }} onChange={(image: ContentImage) => update("thumbnail", { src: image.src, alt: image.alt || form.title, source: image.source, mediaId: image.mediaId })} onRemove={() => update("thumbnail", undefined)} /></div>
      <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} className="accent-emerald-600" />Published</label>
      <div className="flex justify-end gap-2 border-t border-slate-200 pt-3 sm:col-span-2"><button type="button" onClick={() => setForm(null)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">Cancel</button><button disabled={uploading || saving} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60">{saving ? "Saving…" : "Save resource"}</button></div>
    </form>}

    <div className="grid gap-3 md:grid-cols-2">{resources.map((resource) => <article key={resource.slug} className="flex gap-3 bg-white border border-slate-200 rounded-xl shadow-sm p-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- thumbnails are CMS-provided and may be arbitrary remote hosts */}
      {resource.thumbnail?.src ? <img src={resource.thumbnail.src} alt={resource.thumbnail.alt || resource.title} className="size-16 shrink-0 rounded-lg object-cover" /> : <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-emerald-600"><FileText className="size-6" /></div>}
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{resource.title}</p><p className="mt-0.5 text-xs text-slate-500">{resource.category} · {resource.isPublished ? "Published" : "Unpublished"}</p><p className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-[11px] text-slate-500"><Download className="size-3 shrink-0" />{resource.fileName || (resource.fileUrl ? "External resource" : "No file attached")}</p></div>
      <div className="flex shrink-0 gap-1"><button type="button" aria-label={`Edit ${resource.title}`} onClick={() => startEdit(resource)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"><Pencil size={14} /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => void onSave(resources.filter((item) => item.slug !== resource.slug))} className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"><Trash2 size={14} /></button></div>
    </article>)}</div>
  </div>;
}