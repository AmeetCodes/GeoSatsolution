"use client";

import { useState } from "react";
import { Download, FileText, LoaderCircle, Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { ContentImage, ResourceItem } from "@/lib/data-store";
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
  const update = (key: keyof ResourceItem, value: unknown) => setForm((current) => current ? { ...current, [key]: value } : current);

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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      <div><h3 className="text-sm font-semibold text-white">Downloads &amp; Technical Resources</h3><p className="mt-1 text-xs text-slate-400">Upload PDFs, office files, images, or add an external download link. Published items appear on the resources page.</p></div>
      <button type="button" onClick={() => { setEditingSlug(null); setError(""); setForm(emptyResource()); }} className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-200"><Plus size={14} />Add resource</button>
    </div>

    {form && <form onSubmit={save} className="grid gap-4 rounded-2xl border border-slate-700 bg-[#111c22] p-5 sm:grid-cols-2">
      <div className="sm:col-span-2"><h4 className="font-semibold text-white">{editingSlug ? "Edit resource" : "New resource"}</h4><p className="mt-1 text-xs text-slate-400">Resource details and uploaded files are saved to the database.</p></div>
      <label className="space-y-1 text-xs font-medium text-slate-300">Title<input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Resource title" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500" /></label>
      <label className="space-y-1 text-xs font-medium text-slate-300">Slug<input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="generated-from-title" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500" /></label>
      <label className="space-y-1 text-xs font-medium text-slate-300">Category<input required value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Technical reference" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white" /></label>
      <label className="space-y-1 text-xs font-medium text-slate-300">Last updated<input type="date" value={form.updated} onChange={(e) => update("updated", e.target.value)} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white" /></label>
      <label className="space-y-1 text-xs font-medium text-slate-300 sm:col-span-2">Description<textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe what this resource contains and who it is for." className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500" /></label>

      <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-950/50 p-4 sm:col-span-2">
        <div><p className="text-sm font-semibold text-white">Download file</p><p className="mt-1 text-xs text-slate-400">Up to 20 MB. PDF, Word, Excel, PowerPoint, CSV, text, ZIP, or image files.</p></div>
        <label className="flex cursor-pointer flex-wrap items-center gap-3 rounded-lg border border-dashed border-slate-600 bg-[#0b141b] px-4 py-3 text-sm text-slate-200 hover:border-amber-300/70">
          {uploading ? <LoaderCircle className="size-4 animate-spin text-amber-300" /> : <Upload className="size-4 text-amber-300" />}
          <span>{uploading ? "Uploading file…" : form.fileName || "Choose a local file"}</span>
          <input type="file" accept={ACCEPTED_FILES} disabled={uploading} onChange={(e) => void uploadFile(e.target.files?.[0])} className="sr-only" />
        </label>
        {form.fileUrl && <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-800/70 px-3 py-2 text-xs text-slate-300"><span className="truncate">{form.fileName || form.fileUrl}</span><button type="button" onClick={() => setForm({ ...form, fileUrl: "", fileSource: "url", fileMediaId: undefined, fileName: "" })} className="shrink-0 text-rose-300 hover:text-rose-200">Remove</button></div>}
        <label className="block space-y-1 text-xs font-medium text-slate-300">Or use a file URL<input value={form.fileSource === "url" ? form.fileUrl : ""} onChange={(e) => setForm({ ...form, fileUrl: e.target.value, fileSource: "url", fileMediaId: undefined, fileName: e.target.value ? form.fileName : "" })} placeholder="https://… or /documents/file.pdf" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500" /></label>
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
      </div>

      <div className="sm:col-span-2"><ImageMediaEditor index={0} showCaption={false} image={form.thumbnail ? { ...form.thumbnail, caption: "" } : { src: "", alt: form.title, caption: "", source: "url" }} onChange={(image: ContentImage) => update("thumbnail", { src: image.src, alt: image.alt || form.title, source: image.source, mediaId: image.mediaId })} onRemove={() => update("thumbnail", undefined)} /></div>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} className="accent-amber-300" />Published</label>
      <div className="flex justify-end gap-2 border-t border-slate-700 pt-3 sm:col-span-2"><button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Cancel</button><button disabled={uploading || saving} className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving…" : "Save resource"}</button></div>
    </form>}

    <div className="grid gap-3 md:grid-cols-2">{resources.map((resource) => <article key={resource.slug} className="flex gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3">
      {resource.thumbnail?.src ? <img src={resource.thumbnail.src} alt={resource.thumbnail.alt || resource.title} className="size-16 shrink-0 rounded-lg object-cover" /> : <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-300"><FileText className="size-6" /></div>}
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{resource.title}</p><p className="mt-0.5 text-xs text-slate-400">{resource.category} · {resource.isPublished ? "Published" : "Unpublished"}</p><p className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-[11px] text-slate-500"><Download className="size-3 shrink-0" />{resource.fileName || (resource.fileUrl ? "External resource" : "No file attached")}</p></div>
      <div className="flex shrink-0 gap-1"><button type="button" aria-label={`Edit ${resource.title}`} onClick={() => startEdit(resource)} className="rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white"><Pencil size={14} /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => void onSave(resources.filter((item) => item.slug !== resource.slug))} className="rounded-md p-2 text-rose-400 hover:bg-rose-500/10"><Trash2 size={14} /></button></div>
    </article>)}</div>
  </div>;
}
