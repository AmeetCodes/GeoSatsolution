"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Layers,
  Filter,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Archive02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import SwipeRow from "@/components/ui/SwipeRow";
import type { ContentImage, SolutionItem } from "@/lib/data-store";
import { ImageMediaEditor } from "./ImageMediaEditor";

interface SolutionsManagerProps {
  solutions: SolutionItem[];
  onSaveSolutions: (updated: SolutionItem[]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

const GROUPS = [
  "All",
  "Survey & Mapping",
  "GIS & Data",
  "Monitoring",
  "Professional Services",
] as const;

export function SolutionsManager({
  solutions,
  onSaveSolutions,
  onTriggerToast,
}: SolutionsManagerProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<SolutionItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [, setDeletedCache] = useState<{ index: number; item: SolutionItem } | null>(null);

  // Form states for modal
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formFaqs, setFormFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [formGroup, setFormGroup] = useState<string>("Survey & Mapping");
  const [formIntro, setFormIntro] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOutcomes, setFormOutcomes] = useState<string[]>([""]);
  const [formImages, setFormImages] = useState<ContentImage[]>([
    { src: "", alt: "", caption: "", source: "url" },
  ]);

  const filtered = useMemo(() => {
    return solutions.filter((item) => {
      const matchesGroup = selectedGroup === "All" || item.group === selectedGroup;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.intro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [solutions, selectedGroup, searchQuery]);

  const openAddModal = () => {
    setIsNew(true);
    setFormTitle("");
    setFormSlug("");
    setFormPublished(true);
    setFormFaqs([]);
    setFormGroup(selectedGroup !== "All" ? selectedGroup : "Survey & Mapping");
    setFormIntro("");
    setFormDesc("");
    setFormOutcomes([""]);
    setFormImages([{ src: "", alt: "", caption: "", source: "url" }]);
    setEditingItem({
      title: "",
      group: "Survey & Mapping",
      intro: "",
      description: "",
      outcomes: [],
      images: [],
    });
  };

  const openEditModal = (item: SolutionItem) => {
    setIsNew(false);
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSlug(item.slug || "");
    setFormPublished(item.isPublished !== false);
    setFormFaqs(item.faqs || []);
    setFormGroup(item.group);
    setFormIntro(item.intro);
    setFormDesc(item.description);
    setFormOutcomes(item.outcomes.length > 0 ? [...item.outcomes] : [""]);
    setFormImages(
      item.images?.length > 0
        ? [...item.images]
        : [{ src: "", alt: "", caption: "", source: "url" }]
    );
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (formImages.some((image) => image.source === "upload" && !image.mediaId)) {
      onTriggerToast("Image upload required", "Finish uploading the selected image or remove that image entry.");
      return;
    }

    const cleanedOutcomes = formOutcomes.filter((o) => o.trim() !== "");
    const cleanedImages = formImages.filter((img) => img.src.trim() !== "");

    const newSolution: SolutionItem = {
      id: isNew ? undefined : editingItem?.id,
      title: formTitle.trim(),
      slug: formSlug.trim() || formTitle.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      isPublished: formPublished,
      faqs: formFaqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
      group: formGroup,
      intro: formIntro.trim(),
      description: formDesc.trim(),
      outcomes: cleanedOutcomes,
      images: cleanedImages.map((image) => ({ ...image, alt: image.alt.trim() || formTitle.trim() })),
    };

    let updatedList: SolutionItem[];
    if (isNew) {
      updatedList = [newSolution, ...solutions];
    } else {
      updatedList = solutions.map((s) => (s.title === editingItem?.title ? newSolution : s));
    }

    await onSaveSolutions(updatedList);
    onTriggerToast(isNew ? "Solution Added" : "Solution Updated", isNew ? `"${newSolution.title}" is now active in ${newSolution.group}` : `Saved changes to "${newSolution.title}"`);
    setEditingItem(null);
  };

  const handleDelete = async (title: string) => {
    const idx = solutions.findIndex((s) => s.title === title);
    if (idx === -1) return;
    const removedItem = solutions[idx];
    const updated = solutions.filter((s) => s.title !== title);

    setDeletedCache({ index: idx, item: removedItem });
    await onSaveSolutions(updated);

    onTriggerToast(
      "Solution Deleted",
      `Removed "${removedItem.title}"`,
      "Undo",
      async () => {
        const restored = [...updated];
        restored.splice(idx, 0, removedItem);
        await onSaveSolutions(restored);
        onTriggerToast("Restored", `Restored "${removedItem.title}"`);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search solutions by title, intro, or discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
          />
        </div>

        {/* Group selector */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
          <Filter className="mr-1 hidden h-3.5 w-3.5 shrink-0 text-slate-400 sm:block" />
          {GROUPS.map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors ${
                selectedGroup === grp
                  ? "bg-emerald-600 font-semibold text-white"
                  : "border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-100"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Solution</span>
        </button>
      </div>

      {/* Solutions List with SwipeRow & Detailed Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
            <Layers className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No solutions match your filter</p>
            <p className="mt-1 text-xs text-slate-500">Try another search keyword or add a new solution.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow"
            >
              {/* SwipeRow wrapper enabling gesture actions */}
              <SwipeRow
                actions={[
                  {
                    id: "delete",
                    label: "Delete",
                    icon: <HugeiconsIcon icon={Delete02Icon} size={18} />,
                    color: "#e11d48",
                    dismiss: true,
                  },
                  {
                    id: "archive",
                    label: "Archive",
                    icon: <HugeiconsIcon icon={Archive02Icon} size={18} />,
                    color: "#64748b",
                    dismiss: true,
                  },
                ]}
                onAction={(act) => {
                  if (act.id === "delete") handleDelete(item.title);
                  if (act.id === "archive") {
                    onTriggerToast("Archived", `Solution "${item.title}" moved to archive`);
                  }
                }}
                onCommit={(act) => {
                  if (act.id === "delete") handleDelete(item.title);
                }}
                height={64}
                radius={12}
                rowColor="#ffffff"
                drawerColor="#f1f5f9"
                actionWidth={80}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-slate-900">
                          {item.title}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                          {item.group}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {item.intro}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="mr-2 hidden text-[11px] text-slate-400 sm:inline">
                      ← Swipe left to delete
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.title)}
                      className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100"
                      title="Delete solution"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SwipeRow>

              {/* Sub-details (Deliverables & description preview) */}
              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 text-xs sm:grid-cols-2">
                <div>
                  <span className="font-medium text-slate-500">Deliverables / Outcomes:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.outcomes.map((out, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {out}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-slate-500">Description:</span>
                  <p className="mt-1 line-clamp-2 leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {isNew ? "Add New Solution" : `Edit "${editingItem.title}"`}
            </h3>
            <p className="mb-6 text-xs text-slate-500">
              Configure parameters, deliverables, and gallery images for this solution.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Solution Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. UAV LiDAR Survey"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Page slug</label>
                <input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="uav-lidar-survey" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" />
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={formPublished} onChange={(e) => setFormPublished(e.target.checked)} /> Published</label>
              <section className="space-y-2">
                <div className="flex items-center justify-between"><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Frequently asked questions</label><button type="button" onClick={() => setFormFaqs([...formFaqs, { question: "", answer: "" }])} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Add FAQ</button></div>
                {formFaqs.map((faq, index) => <div key={index} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"><input value={faq.question} onChange={(e) => setFormFaqs(formFaqs.map((item, i) => i === index ? { ...item, question: e.target.value } : item))} placeholder="Question" className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /><textarea value={faq.answer} onChange={(e) => setFormFaqs(formFaqs.map((item, i) => i === index ? { ...item, answer: e.target.value } : item))} placeholder="Answer" rows={2} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /><button type="button" onClick={() => setFormFaqs(formFaqs.filter((_, i) => i !== index))} className="text-xs font-medium text-rose-600 hover:text-rose-700">Remove FAQ</button></div>)}
              </section>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Discipline / Group
                </label>
                <select
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                >
                  <option value="Survey & Mapping">Survey & Mapping</option>
                  <option value="GIS & Data">GIS & Data</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Professional Services">Professional Services</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Summary / Intro Hook
                </label>
                <textarea
                  rows={2}
                  value={formIntro}
                  onChange={(e) => setFormIntro(e.target.value)}
                  placeholder="High-level introductory pitch rendered at the top of the solution page..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Technical Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed explanation of methodology, sensors, and capabilities..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              {/* Outcomes / Deliverables */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deliverables & Handover Items
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormOutcomes([...formOutcomes, ""])}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus className="w-3 h-3" /> Add Outcome
                  </button>
                </div>
                <div className="space-y-2">
                  {formOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => {
                          const updated = [...formOutcomes];
                          updated[idx] = e.target.value;
                          setFormOutcomes(updated);
                        }}
                        placeholder={`Deliverable ${idx + 1}`}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formOutcomes.filter((_, i) => i !== idx);
                          setFormOutcomes(updated.length > 0 ? updated : [""]);
                        }}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="mb-3 flex items-center justify-between"><div><label className="block text-sm font-semibold text-slate-900">Solution images</label><p className="mt-0.5 text-xs text-slate-500">Upload images to store them in the database, or use an external image URL.</p></div><button type="button" disabled={formImages.length >= 30} onClick={() => setFormImages([...formImages, { src: "", alt: "", caption: "", source: "url" }])} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50">Add image</button></div>
                {formImages.map((img, idx) => (
                  <ImageMediaEditor
                    key={idx}
                    index={idx}
                    image={img}
                    onChange={(updatedImage) => setFormImages(formImages.map((image, index) => index === idx ? updatedImage : image))}
                    onRemove={() => setFormImages(formImages.filter((_, index) => index !== idx))}
                  />
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SolutionsManager;
