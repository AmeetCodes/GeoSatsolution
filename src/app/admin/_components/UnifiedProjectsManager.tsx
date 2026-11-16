"use client";

import { useMemo, useState } from "react";
import { NEPAL_DISTRICTS } from "@/lib/data/nepal-districts";

type Entry = { _id?: string; id?: string; type: "service" | "sales"; slug: string; projectName?: string; productName?: string; districts: string[]; latitude?: number; longitude?: number; avgElevation?: number; client: string; partner: string; area: number; coverImage: string; galleryImages: string[] };
const blank = (type: Entry["type"]): Entry => ({ type, slug: "", projectName: "", productName: "", districts: [], client: "", partner: "", area: 0, coverImage: "", galleryImages: [] });

export function UnifiedProjectsManager({ initialProjects, onTriggerToast }: { initialProjects: Entry[]; onTriggerToast: (title: string, desc?: string) => void }) {
  const [projects, setProjects] = useState(initialProjects);
  const [type, setType] = useState<Entry["type"]>("service");
  const [form, setForm] = useState<Entry | null>(null);
  const [query, setQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(() => projects.filter((p) => p.type === type && `${p.projectName ?? ""} ${p.productName ?? ""} ${p.client}`.toLowerCase().includes(query.toLowerCase())), [projects, type, query]);
  const service = projects.filter((p) => p.type === "service");
  const area = service.reduce((sum, p) => sum + (Number(p.area) || 0), 0);
  const covered = new Set(service.flatMap((p) => p.districts ?? [])).size;
  const set = (key: keyof Entry, value: unknown) => setForm((old) => old ? { ...old, [key]: value } : old);

  async function upload(file: File, gallery: boolean) {
    const data = new FormData(); data.set("file", file);
    const response = await fetch("/api/admin/media", { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message ?? "Upload failed");
    if (gallery) setForm((old) => old ? { ...old, galleryImages: [...old.galleryImages, result.data.src] } : old);
    else set("coverImage", result.data.src);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (!form) return; setBusy(true);
    try {
      const response = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form._id ?? form.id, data: form }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.message ?? "Save failed");
      const next = result.data as Entry;
      setProjects((old) => form._id || form.id ? old.map((p) => (p._id ?? p.id) === (form._id ?? form.id) ? next : p) : [next, ...old]);
      setForm(null); onTriggerToast("Project saved", "Updates are live on the site and Nepal map.");
    } catch (e) { onTriggerToast("Could not save", e instanceof Error ? e.message : "Try again."); }
    finally { setBusy(false); }
  }
  async function remove(project: Entry) {
    if (!project._id && !project.id) return;
    const response = await fetch("/api/admin/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: project._id ?? project.id }) });
    if (response.ok) { setProjects((old) => old.filter((p) => (p._id ?? p.id) !== (project._id ?? project.id))); onTriggerToast("Project deleted"); }
  }

  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Service projects", service.length], ["Districts covered", `${covered} / 77`], ["Total area", `${area.toLocaleString()} km²`], ["Sales projects", projects.filter((p) => p.type === "sales").length]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div>)}</div>
    <div className="flex flex-wrap items-center gap-2"><button onClick={() => setType("service")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${type === "service" ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>Service Projects</button><button onClick={() => setType("sales")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${type === "sales" ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>Sales Projects</button><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"/><button onClick={() => setForm(blank(type))} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Add {type === "service" ? "service" : "sales"} project</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p) => <article key={p._id ?? p.id ?? p.slug} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{p.coverImage && <img src={p.coverImage} alt="" className="h-40 w-full object-cover"/>}<div className="p-4"><h3 className="font-semibold text-slate-900">{p.projectName ?? p.productName}</h3><p className="mt-1 text-sm text-slate-500">{p.type === "service" ? `${p.districts.join(", ")} · ${p.area} km²` : `Partner: ${p.partner || "—"}`}</p><p className="mt-1 text-sm text-slate-500">Client: {p.client || "—"}</p><div className="mt-3 flex gap-2"><button onClick={() => setForm({ ...p, districts: p.districts ?? [], galleryImages: p.galleryImages ?? [] })} className="rounded-md border px-3 py-1 text-sm">Edit</button><button onClick={() => void remove(p)} className="rounded-md border border-rose-200 px-3 py-1 text-sm text-rose-600">Delete</button></div></div></article>)}</div>
    {form && <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4"><form onSubmit={save} className="my-8 w-full max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex justify-between"><h2 className="text-xl font-bold">{form._id || form.id ? "Edit" : "Add"} {form.type === "service" ? "Service Project" : "Sales Project"}</h2><button type="button" onClick={() => setForm(null)}>Close</button></div>
      <label className="block text-sm">{form.type === "service" ? "Project name" : "Product name"}<input required value={form.type === "service" ? form.projectName : form.productName} onChange={(e) => set(form.type === "service" ? "projectName" : "productName", e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
      {form.type === "service" ? <><label className="block text-sm">Search districts<input value={districtQuery} onChange={(e) => setDistrictQuery(e.target.value)} placeholder="Filter districts" className="mt-1 w-full rounded-lg border p-2"/></label><div className="grid max-h-44 grid-cols-2 gap-2 overflow-auto rounded-lg border p-3 sm:grid-cols-3">{NEPAL_DISTRICTS.filter((d) => d.name.toLowerCase().includes(districtQuery.toLowerCase())).map((d) => <label key={d.name} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.districts.includes(d.name)} onChange={(e) => set("districts", e.target.checked ? [...form.districts, d.name] : form.districts.filter((x) => x !== d.name))}/>{d.name}</label>)}</div><div className="grid gap-3 sm:grid-cols-3">{([["latitude", "Latitude"], ["longitude", "Longitude"], ["avgElevation", "Avg elevation (m)"], ["area", "Area (km²)"]] as const).map(([key, label]) => <label key={key} className="text-sm">{label}<input type="number" step="any" value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>)}</div></> : <label className="block text-sm">Partner<input value={form.partner} onChange={(e) => set("partner", e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>}
      <label className="block text-sm">Client<input value={form.client} onChange={(e) => set("client", e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
      <label className="block text-sm">Cover photo<input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, false).catch((err) => onTriggerToast("Upload failed", err.message)); }} className="mt-1 block w-full text-sm"/></label>{form.coverImage && <img src={form.coverImage} alt="Cover preview" className="h-28 rounded-lg object-cover"/>}
      <label className="block text-sm">Gallery photos<input type="file" accept="image/*" multiple onChange={(e) => { for (const f of Array.from(e.target.files ?? [])) void upload(f, true).catch((err) => onTriggerToast("Upload failed", err.message)); }} className="mt-1 block w-full text-sm"/></label><div className="flex flex-wrap gap-2">{form.galleryImages.map((src, i) => <div key={`${src}-${i}`} className="relative"><img src={src} alt="Gallery preview" className="h-20 w-24 rounded object-cover"/><button type="button" onClick={() => set("galleryImages", form.galleryImages.filter((_, j) => i !== j))} className="absolute right-1 top-1 rounded bg-white px-1">×</button></div>)}</div>
      <div className="flex justify-end gap-2"><button type="button" onClick={() => setForm(null)} className="rounded-lg border px-4 py-2">Cancel</button><button disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save project"}</button></div></form></div>}
  </div>;
}
