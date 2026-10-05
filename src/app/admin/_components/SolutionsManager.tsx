"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Image as ImageIcon,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Archive02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import SwipeRow from "@/components/ui/SwipeRow";
import type { SolutionItem } from "@/lib/data-store";

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
  const [deletedCache, setDeletedCache] = useState<{ index: number; item: SolutionItem } | null>(null);

  // Form states for modal
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formFaqs, setFormFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [formGroup, setFormGroup] = useState<string>("Survey & Mapping");
  const [formIntro, setFormIntro] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOutcomes, setFormOutcomes] = useState<string[]>([""]);
  const [formImages, setFormImages] = useState<{ src: string; alt: string; caption: string }[]>([
    { src: "", alt: "", caption: "" },
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
    setFormImages([{ src: "", alt: "", caption: "" }]);
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
        : [{ src: "", alt: "", caption: "" }]
    );
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#f1ece5]/80 p-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search solutions by title, intro, or discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Group selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1 shrink-0 hidden sm:block" />
          {GROUPS.map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedGroup === grp
                  ? "bg-cyan-500 text-zinc-950 font-semibold"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 text-xs font-semibold shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Solution</span>
        </button>
      </div>

      {/* Solutions List with SwipeRow & Detailed Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 bg-[#f1ece5]/30">
            <Layers className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-400 font-medium">No solutions match your filter</p>
            <p className="text-xs text-zinc-500 mt-1">Try another search keyword or add a new solution.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-800/80 bg-[#f1ece5]/50 hover:border-zinc-700 transition-all p-4"
            >
              {/* SwipeRow wrapper enabling gesture actions */}
              <SwipeRow
                actions={[
                  {
                    id: "delete",
                    label: "Delete",
                    icon: <HugeiconsIcon icon={Delete02Icon} size={18} />,
                    color: "#dc2626",
                    dismiss: true,
                  },
                  {
                    id: "archive",
                    label: "Archive",
                    icon: <HugeiconsIcon icon={Archive02Icon} size={18} />,
                    color: "#475569",
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
                height={70}
                rowColor="#18181b"
                drawerColor="#09090b"
                actionWidth={80}
              >
                <div className="w-full flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-950 tracking-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                          {item.group}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {item.intro}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 hidden sm:inline mr-2">
                      ← Swipe left to delete
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.title)}
                      className="p-1.5 text-xs font-medium rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors"
                      title="Delete solution"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SwipeRow>

              {/* Sub-details (Deliverables & description preview) */}
              <div className="mt-3 pt-3 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-medium">Deliverables / Outcomes:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.outcomes.map((out, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 text-[11px]"
                      >
                        <Check className="w-3 h-3 text-cyan-400" />
                        {out}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 font-medium">Description:</span>
                  <p className="text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#f1ece5] p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-zinc-950 mb-1">
              {isNew ? "Add New Solution" : `Edit "${editingItem.title}"`}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Configure parameters, deliverables, and gallery images for this solution.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Solution Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. UAV LiDAR Survey"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Page slug</label>
                <input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="uav-lidar-survey" className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white" />
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={formPublished} onChange={(e) => setFormPublished(e.target.checked)} /> Published</label>
              <section className="space-y-2">
                <div className="flex items-center justify-between"><label className="text-xs font-medium text-zinc-300">Frequently asked questions</label><button type="button" onClick={() => setFormFaqs([...formFaqs, { question: "", answer: "" }])} className="text-xs text-cyan-400">Add FAQ</button></div>
                {formFaqs.map((faq, index) => <div key={index} className="space-y-2 rounded-lg border border-zinc-800 p-3"><input value={faq.question} onChange={(e) => setFormFaqs(formFaqs.map((item, i) => i === index ? { ...item, question: e.target.value } : item))} placeholder="Question" className="w-full rounded bg-[#f1ece5] p-2 text-xs text-white" /><textarea value={faq.answer} onChange={(e) => setFormFaqs(formFaqs.map((item, i) => i === index ? { ...item, answer: e.target.value } : item))} placeholder="Answer" rows={2} className="w-full rounded bg-[#f1ece5] p-2 text-xs text-white" /><button type="button" onClick={() => setFormFaqs(formFaqs.filter((_, i) => i !== index))} className="text-xs text-red-400">Remove FAQ</button></div>)}
              </section>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Discipline / Group
                </label>
                <select
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Survey & Mapping">Survey & Mapping</option>
                  <option value="GIS & Data">GIS & Data</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Professional Services">Professional Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Summary / Intro Hook
                </label>
                <textarea
                  rows={2}
                  value={formIntro}
                  onChange={(e) => setFormIntro(e.target.value)}
                  placeholder="High-level introductory pitch rendered at the top of the solution page..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Technical Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed explanation of methodology, sensors, and capabilities..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Outcomes / Deliverables */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Deliverables & Handover Items
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormOutcomes([...formOutcomes, ""])}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
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
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formOutcomes.filter((_, i) => i !== idx);
                          setFormOutcomes(updated.length > 0 ? updated : [""]);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="mb-1.5 flex items-center justify-between"><label className="text-xs font-medium text-zinc-300">Hero image and gallery</label><button type="button" disabled={formImages.length >= 30} onClick={() => setFormImages([...formImages, { src: "", alt: "", caption: "" }])} className="text-xs text-cyan-400 disabled:opacity-50">Add image</button></div>
                {formImages.map((img, idx) => (
                  <div key={idx} className="p-3 mb-2 rounded-lg bg-[#f1ece5] border border-zinc-800 space-y-2">
                    <input
                      type="text"
                      value={img.src}
                      onChange={(e) => {
                        const updated = [...formImages];
                        updated[idx].src = e.target.value;
                        setFormImages(updated);
                      }}
                      placeholder="Image URL (e.g. Unsplash or hosted URL)"
                      className="w-full px-3 py-1.5 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                    />
                    <input type="text" value={img.alt} onChange={(e) => { const updated = [...formImages]; updated[idx].alt = e.target.value; setFormImages(updated); }} placeholder="Accessible image description" className="w-full px-3 py-1.5 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" />
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => {
                        const updated = [...formImages];
                        updated[idx].caption = e.target.value;
                        setFormImages(updated);
                      }}
                      placeholder="Image Caption"
                      className="w-full px-3 py-1.5 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                    />
                    <button type="button" onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))} className="text-xs text-red-400">Remove image</button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-[#f1ece5] hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 transition-all"
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
