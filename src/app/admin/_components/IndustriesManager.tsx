"use client";

import type { ContentImage, IndustryItem } from '@/lib/content-types';

import React, { useState } from "react";
import {
  Building2,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";
import { ImageMediaEditor } from "./ImageMediaEditor";

interface IndustriesManagerProps {
  industries: IndustryItem[];
  onSaveIndustries: (updated: IndustryItem[]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

export function IndustriesManager({
  industries,
  onSaveIndustries,
  onTriggerToast,
}: IndustriesManagerProps) {
  const [editingItem, setEditingItem] = useState<IndustryItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Modal form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [intro, setIntro] = useState("");
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState<string[]>([""]);
  const [images, setImages] = useState<ContentImage[]>([]);
  const [uploadingImageIndexes, setUploadingImageIndexes] = useState<Set<number>>(() => new Set());

  const openAddModal = () => {
    setUploadingImageIndexes(new Set());
    setIsNew(true);
    setTitle("");
    setSlug("");
    setIsPublished(true);
    setIntro("");
    setDesc("");
    setItems(["Sector Sub-field 1", "Sector Sub-field 2"]);
    setImages([]);
    setEditingItem({
      title: "",
      intro: "",
      description: "",
      items: [],
    });
  };

  const openEditModal = (item: IndustryItem) => {
    setUploadingImageIndexes(new Set());
    setIsNew(false);
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug || "");
    setIsPublished(item.isPublished !== false);
    setIntro(item.intro);
    setDesc(item.description);
    setItems([...item.items]);
    setImages((item.images || []).map((image) => ({ ...image, caption: image.caption || "" })));
  };

  const setImageUploading = (index: number, uploading: boolean) => {
    setUploadingImageIndexes((current) => {
      const next = new Set(current);
      if (uploading) next.add(index);
      else next.delete(index);
      return next;
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanedItems = items.filter((i) => i.trim() !== "");

    const newIndustry: IndustryItem = {
      id: isNew ? undefined : editingItem?.id,
      title: title.trim(),
      slug: slug.trim() || title.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      isPublished,
      intro: intro.trim(),
      description: desc.trim(),
      items: cleanedItems.length > 0 ? cleanedItems : ["General Sector Solutions"],
      images: images
        .filter((image) => image.src.trim())
        .map((image) => ({ ...image, alt: image.alt.trim() || title.trim() })),
    };

    let updatedList: IndustryItem[];
    if (isNew) {
      updatedList = [...industries, newIndustry];
    } else {
      updatedList = industries.map((ind) => (ind.title === editingItem?.title ? newIndustry : ind));
    }

    await onSaveIndustries(updatedList);
    onTriggerToast(isNew ? "Industry Sector Added" : "Sector Updated", isNew ? `"${newIndustry.title}" sector has been added` : `Saved updates to "${newIndustry.title}"`);
    setEditingItem(null);
  };

  const handleDelete = async (targetTitle: string) => {
    const idx = industries.findIndex((ind) => ind.title === targetTitle);
    if (idx === -1) return;
    const removed = industries[idx];
    const updated = industries.filter((ind) => ind.title !== targetTitle);

    await onSaveIndustries(updated);
    onTriggerToast(
      "Sector Deleted",
      `Removed "${removed.title}"`,
      "Undo",
      async () => {
        const restored = [...updated];
        restored.splice(idx, 0, removed);
        await onSaveIndustries(restored);
        onTriggerToast("Restored", `Restored "${removed.title}"`);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Target Industry Sectors</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage industry-specific offerings, domain applications, and focus areas.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sector</span>
        </button>
      </div>

      {/* Grid of Industry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industries.map((ind) => (
          <div
            key={ind.title}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
          >
            <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base tracking-tight">
                      {ind.title}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {ind.items.length} Focus Disciplines
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(ind)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    title="Edit sector"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ind.title)}
                    className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                    title="Delete sector"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {ind.images?.[0]?.src ? (
                <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ind.images[0].src} alt="" className="h-32 w-full rounded-lg border border-slate-200 object-cover" />
                </div>
              ) : null}

              <p className="text-sm text-slate-700 font-medium leading-relaxed mb-2">
                {ind.intro}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                {ind.description}
              </p>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Specialized Verticals:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.items.map((sub, sidx) => (
                    <span
                      key={sidx}
                      className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full border border-emerald-200/60"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {isNew ? "Add Industry Sector" : `Edit "${editingItem.title}"`}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Configure sector overview, lead paragraph, and associated disciplines.
            </p>

          <form onSubmit={handleSaveModal} className="space-y-4">
            <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Industry slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="infrastructure" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />Published</label>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Sector Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Infrastructure, Natural Resources"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Lead Summary / Intro
                </label>
                <textarea
                  rows={2}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Key value proposition for this industry..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Full Sector Description
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detailed narrative describing our impact and case studies..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              <fieldset disabled={uploadingImageIndexes.size > 0} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 disabled:opacity-80" aria-labelledby="industry-images-label">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 id="industry-images-label" className="text-xs font-semibold text-slate-900">Industry images</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">The first image is used as the industry card cover. Add up to 5 images for the detail view.</p>
                  </div>
                  <button
                    type="button"
                    disabled={images.length >= 5}
                    onClick={() => setImages((current) => [...current, { src: "", alt: title, caption: "", source: "upload" }])}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ImagePlus className="size-3.5" aria-hidden="true" /> Add image
                  </button>
                </div>
                {images.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 bg-white/70 px-3 py-4 text-center text-xs text-slate-500">No industry images added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {images.map((image, index) => (
                      <ImageMediaEditor
                        key={`${image.mediaId || image.src || "new-image"}-${index}`}
                        image={image}
                        index={index}
                        title={`Industry image ${index + 1}`}
                        onChange={(updatedImage) => setImages((current) => current.map((entry, entryIndex) => entryIndex === index ? updatedImage : entry))}
                        onRemove={() => {
                          setImages((current) => current.filter((_, entryIndex) => entryIndex !== index));
                          setUploadingImageIndexes((current) => new Set([...current].filter((entryIndex) => entryIndex !== index).map((entryIndex) => entryIndex > index ? entryIndex - 1 : entryIndex)));
                        }}
                        onUploadingChange={(uploading) => setImageUploading(index, uploading)}
                      />
                    ))}
                  </div>
                )}
              </fieldset>

              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sector Focus Areas & Applications
                  </label>
                  <button
                    type="button"
                    onClick={() => setItems([...items, ""])}
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={it}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx] = e.target.value;
                          setItems(updated);
                        }}
                        placeholder={`Application ${idx + 1}`}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = items.filter((_, i) => i !== idx);
                          setItems(updated.length > 0 ? updated : [""]);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  disabled={uploadingImageIndexes.size > 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImageIndexes.size > 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {uploadingImageIndexes.size > 0 ? "Uploading image…" : "Save Sector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default IndustriesManager;