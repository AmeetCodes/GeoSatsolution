"use client";


import React, { useState } from "react";
import {
  Users,
  Award,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Building,
  Calendar,
} from "lucide-react";
import type {
  CompanyClient,
  CompanyInsight,
  CompanyLeader,
  CompanyPartner,
  ContentImage,
  SiteContentData,
} from "@/lib/content-types";
import { ResourcesManager } from "./ResourcesManager";
import { ImageMediaEditor } from "./ImageMediaEditor";
import { Modal } from "@/components/ui/modal";

interface CompanyManagerProps {
  company: SiteContentData["Company"];
  onSaveCompany: (updatedCompany: SiteContentData["Company"]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

type SubTab = "leadership" | "partners" | "clients" | "insights" | "resources";

export function CompanyManager({
  company,
  onSaveCompany,
  onTriggerToast,
}: CompanyManagerProps) {
  const [subTab, setSubTab] = useState<SubTab>("leadership");

  // Leadership editing state
  const [editingLeader, setEditingLeader] = useState<CompanyLeader | null>(null);
  const [leaderForm, setLeaderForm] = useState<CompanyLeader>({ name: "", role: "", division: "", bio: "", expertise: "", accent: "#0d9488", imagePosition: "center top" });
  const [isUploadingLeaderImage, setIsUploadingLeaderImage] = useState(false);

  // Partner editing state
  const [editingPartner, setEditingPartner] = useState<CompanyPartner | null>(null);
  const [partnerForm, setPartnerForm] = useState<CompanyPartner>({ id: "", name: "", category: "", tier: "", description: "" });
  const [isUploadingPartnerLogo, setIsUploadingPartnerLogo] = useState(false);

  // Client and institution editing state
  const [editingClient, setEditingClient] = useState<CompanyClient | null>(null);
  const [clientForm, setClientForm] = useState<CompanyClient>({ name: "", category: "Institutional", description: "" });
  const [isUploadingClientImage, setIsUploadingClientImage] = useState(false);

  // News editing state
  const [editingNews, setEditingNews] = useState<CompanyInsight | null>(null);
  const [newsForm, setNewsForm] = useState<CompanyInsight>({ slug: "", title: "", date: "", category: "", excerpt: "", body: [""], author: "GeoSAT Editorial", isPublished: true });
  const [isUploadingNewsImage, setIsUploadingNewsImage] = useState(false);

  // Handler for Leadership
  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    const leaderToSave = {
      ...leaderForm,
      image: leaderForm.image?.src ? leaderForm.image : undefined,
    };
    const current = company.Leadership || [];
    const exists = current.some((l) => editingLeader?.id ? l.id === editingLeader.id : l.name === editingLeader?.name);
    const updated = exists
      ? current.map((l) => (editingLeader?.id ? l.id === editingLeader.id : l.name === editingLeader?.name) ? { ...leaderToSave, id: l.id } : l)
      : [...current, leaderToSave];

    await onSaveCompany({ ...company, Leadership: updated });
    onTriggerToast("Leadership Saved", `Updated ${leaderForm.name}`);
    setEditingLeader(null);
  };

  const handleDeleteLeader = async (name: string) => {
    const updated = (company.Leadership || []).filter((l) => l.name !== name);
    await onSaveCompany({ ...company, Leadership: updated });
    onTriggerToast("Removed Leader", `Removed ${name}`);
  };

  // Handler for Partners
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const partnerToSave = { ...partnerForm, logo: partnerForm.logo?.src ? partnerForm.logo : undefined };
    const current = company.Partners || [];
    const exists = current.some((p) => p.id === editingPartner?.id);
    const updated = exists
      ? current.map((p) => (p.id === editingPartner?.id ? partnerToSave : p))
      : [...current, { ...partnerToSave, id: partnerForm.id || `PART-${Date.now()}` }];

    await onSaveCompany({ ...company, Partners: updated });
    onTriggerToast("Partner Saved", `Updated partner ${partnerForm.name}`);
    setEditingPartner(null);
  };

  const handleDeletePartner = async (name: string) => {
    const updated = (company.Partners || []).filter((p) => p.name !== name);
    await onSaveCompany({ ...company, Partners: updated });
    onTriggerToast("Removed Partner", `Removed ${name}`);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientToSave = { ...clientForm, image: clientForm.image?.src ? clientForm.image : undefined };
    const current = company.Clients || [];
    const exists = current.some((client) => editingClient?.id
      ? client.id === editingClient.id
      : client.name === editingClient?.name);
    const updated = exists
      ? current.map((client) => (editingClient?.id
        ? client.id === editingClient.id
        : client.name === editingClient?.name)
        ? { ...clientToSave, id: client.id }
        : client)
      : [...current, clientToSave];

    await onSaveCompany({ ...company, Clients: updated });
    onTriggerToast("Client Saved", `Updated ${clientForm.name}`);
    setEditingClient(null);
  };

  const handleDeleteClient = async (id: string | undefined, name: string) => {
    const updated = (company.Clients || []).filter((client) => id ? client.id !== id : client.name !== name);
    await onSaveCompany({ ...company, Clients: updated });
    onTriggerToast("Client Removed", `Removed ${name}`);
  };

  // Handler for Insights/News
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = company.Insights || [];
    const exists = current.some((n) => n.slug === editingNews?.slug);
    const cleanedBody = newsForm.body.filter((b) => b.trim() !== "");
    const itemToSave = {
      ...newsForm,
      slug: newsForm.slug || newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      body: cleanedBody.length > 0 ? cleanedBody : [newsForm.excerpt],
      image: newsForm.image?.src ? newsForm.image : undefined,
    };

    const updated = exists
      ? current.map((n) => (n.slug === editingNews?.slug ? itemToSave : n))
      : [itemToSave, ...current];

    await onSaveCompany({ ...company, Insights: updated });
    onTriggerToast("Insight Article Published", `Updated "${itemToSave.title}"`);
    setEditingNews(null);
  };

  const handleDeleteNews = async (slug: string) => {
    const updated = (company.Insights || []).filter((n) => n.slug !== slug);
    await onSaveCompany({ ...company, Insights: updated });
    onTriggerToast("Article Deleted", `Removed insight article`);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setSubTab("leadership")}
          className={`flex items-center gap-2 ${
            subTab === "leadership"
              ? "rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Executive Leadership ({company?.Leadership?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("partners")}
          className={`flex items-center gap-2 ${
            subTab === "partners"
              ? "rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Technology Partners ({company?.Partners?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("clients")}
          className={`flex items-center gap-2 ${
            subTab === "clients"
              ? "rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Clients &amp; Institutions ({company?.Clients?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("insights")}
          className={`flex items-center gap-2 ${
            subTab === "insights"
              ? "rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Insights & News ({company?.Insights?.length || 0})</span>
        </button>
        <button type="button" onClick={() => setSubTab("resources")} className={`flex items-center gap-2 ${subTab === "resources" ? "rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white" : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"}`}>
          <BookOpen className="w-3.5 h-3.5" /><span>Downloads ({company.Resources?.length || 0})</span>
        </button>
      </div>

      {/* LEADERSHIP SECTION */}
      {subTab === "leadership" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Executive and technical leads directing survey operations, GIS, and mission deployment.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsUploadingLeaderImage(false);
                setLeaderForm({ name: "", role: "", division: "", bio: "", expertise: "", accent: "#0d9488", imagePosition: "center top" });
                setEditingLeader({ name: "", role: "", division: "", bio: "" });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5" /> Add Leader
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...(company.Leadership || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((leader) => (
              <div
                key={leader.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex min-w-0 items-center gap-3">
                      {leader.image?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={leader.image.src} alt="" className="size-11 shrink-0 rounded-lg border border-slate-200 object-cover" />
                      ) : <div className="size-11 shrink-0 rounded-lg bg-emerald-50" aria-hidden="true" />}
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-900">{leader.name}</h4>
                        <p className="text-xs font-medium text-emerald-700">{leader.role}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">{leader.division}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUploadingLeaderImage(false);
                          setLeaderForm(leader);
                          setEditingLeader(leader);
                        }}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLeader(leader.name)}
                        className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-4">
                    {leader.expertise || leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTNERS SECTION */}
      {subTab === "partners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Global technology vendors, instrument manufacturers, and institutional client partners.
            </p>
            <button
              type="button"
              onClick={() => {
                setPartnerForm({ id: "", name: "", category: "", tier: "", description: "" });
                setIsUploadingPartnerLogo(false);
                setEditingPartner({ id: "", name: "", category: "", tier: "", description: "" });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5" /> Add Partner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...(company.Partners || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex min-w-0 items-center gap-3">
                      {partner.logo?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={partner.logo.src} alt="" className="size-11 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1" />
                      ) : <div className="size-11 shrink-0 rounded-lg bg-emerald-50" aria-hidden="true" />}
                      <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900">{partner.name}</h4>
                      <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {partner.tier}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">{partner.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUploadingPartnerLogo(false);
                          setPartnerForm(partner);
                          setEditingPartner(partner);
                        }}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(partner.name)}
                        className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-2">
                    {partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLIENTS & INSTITUTIONS SECTION */}
      {subTab === "clients" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">Manage the client and institution profiles shown in the public accordion gallery.</p>
            <button
              type="button"
              onClick={() => {
                setIsUploadingClientImage(false);
                setClientForm({ name: "", category: "Institutional", description: "", order: (company.Clients || []).length + 1 });
                setEditingClient({ name: "", category: "Institutional", description: "" });
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              <Plus className="size-3.5" /> Add client
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...(company.Clients || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((client) => (
              <article key={client.id || client.name} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                {client.image?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={client.image.src} alt="" className="size-12 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1" />
                ) : <div className="size-12 shrink-0 rounded-lg bg-emerald-50" aria-hidden="true" />}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{client.name}</h3>
                  <p className="mt-0.5 text-xs text-emerald-700">{client.category}</p>
                  {client.description ? <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">{client.description}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" aria-label={`Edit ${client.name}`} onClick={() => { setIsUploadingClientImage(false); setClientForm(client); setEditingClient(client); }} className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><Edit2 className="size-3.5" /></button>
                  <button type="button" aria-label={`Delete ${client.name}`} onClick={() => void handleDeleteClient(client.id, client.name)} className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"><Trash2 className="size-3.5" /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* INSIGHTS / NEWS SECTION */}
      {subTab === "insights" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Technical field notes, mission debriefs, and geospatial announcements.
            </p>
            <button
              type="button"
              onClick={() => {
                setNewsForm({
                  slug: "",
                  title: "",
                  date: new Date().toISOString().slice(0, 10),
                  category: "Operations",
                  excerpt: "",
                  body: [""],
                  author: "GeoSAT Editorial",
                  isPublished: true,
                });
                setEditingNews({
                  slug: "",
                  title: "",
                  date: new Date().toISOString().slice(0, 10),
                  category: "Operations",
                  excerpt: "",
                  body: [""],
                  author: "GeoSAT Editorial",
                  isPublished: true,
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5" /> Write Article
            </button>
          </div>

          <div className="space-y-3">
            {(company.Insights || []).map((item) => (
              <div
                key={item.slug}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md uppercase">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setNewsForm({ ...item });
                      setEditingNews({ ...item });
                    }}
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNews(item.slug)}
                    className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "resources" && <ResourcesManager resources={company.Resources || []} onSave={(resources) => onSaveCompany({ ...company, Resources: resources })} />}

      {/* Leader Edit Modal */}
      <Modal
        open={Boolean(editingLeader)}
        onClose={() => setEditingLeader(null)}
        eyebrow="Company content"
        title={editingLeader?.id ? "Edit team member" : "Add team member"}
        description="These profile details are saved to the team database and shown on the leadership page."
        onSubmit={handleSaveLeader}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingLeader(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingLeaderImage}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              Save Profile
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
                <input
                  type="text"
                  value={leaderForm.name}
                  onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Title / Designation</label>
                <input
                  type="text"
                  value={leaderForm.role}
                  onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Division</label>
                <input
                  type="text"
                  value={leaderForm.division}
                  onChange={(e) => setLeaderForm({ ...leaderForm, division: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Expertise</label>
                <textarea
                  rows={3}
                  value={leaderForm.expertise || ""}
                  onChange={(e) => setLeaderForm({ ...leaderForm, expertise: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <ImageMediaEditor
                  index={0}
                  showCaption={false}
                  image={leaderForm.image ? { ...leaderForm.image, caption: "" } : { src: "", alt: leaderForm.name, caption: "", source: "url" }}
                  onUploadingChange={setIsUploadingLeaderImage}
                  onChange={(image) => setLeaderForm({ ...leaderForm, image: { src: image.src, alt: image.alt || leaderForm.name, source: image.source, mediaId: image.mediaId } })}
                  onRemove={() => setLeaderForm({ ...leaderForm, image: undefined })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Image position</label>
                <select value={leaderForm.imagePosition || "center top"} onChange={(e) => setLeaderForm({ ...leaderForm, imagePosition: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15">
                  {["center top", "center", "center bottom", "left center", "right center"].map((position) => <option key={position} value={position}>{position}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Highlight color</label>
                <div className="flex h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
                  <input type="color" value={leaderForm.accent || "#0d9488"} onChange={(e) => setLeaderForm({ ...leaderForm, accent: e.target.value })} className="size-7 cursor-pointer rounded border-0 bg-transparent" />
                  <span className="font-mono text-xs text-slate-600">{leaderForm.accent || "#0d9488"}</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Display order</label>
                <input type="number" min={0} value={leaderForm.order ?? 0} onChange={(e) => setLeaderForm({ ...leaderForm, order: Number(e.target.value) })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" />
              </div>
              <details className="sm:col-span-2">
                <summary className="cursor-pointer text-xs font-medium text-slate-600">Legacy profile biography</summary>
                <textarea rows={3} value={leaderForm.bio || ""} onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" placeholder="Existing profile bio, retained for other site content." />
              </details>
        </div>
      </Modal>

      {/* Partner Edit Modal */}
      <Modal
        open={Boolean(editingPartner)}
        onClose={() => setEditingPartner(null)}
        eyebrow="Company content"
        title={editingPartner?.id ? "Edit technology partner" : "Add technology partner"}
        description="Partner information and imagery displayed in the public gallery."
        onSubmit={handleSavePartner}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingPartner(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingPartnerLogo}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              Save Partner
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Organization name
                <input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" required />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tier / partnership level
                <input type="text" value={partnerForm.tier} onChange={(e) => setPartnerForm({ ...partnerForm, tier: e.target.value })} placeholder="Global Technology Partner" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" required />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Domain / category
                <input type="text" value={partnerForm.category} onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })} placeholder="Satellite imagery, hardware" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" required />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Display order
                <input type="number" min={0} value={partnerForm.order ?? 0} onChange={(e) => setPartnerForm({ ...partnerForm, order: Number(e.target.value) })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:col-span-2">
                Collaboration summary
                <textarea rows={3} value={partnerForm.description} onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" required />
              </label>
              <div className="sm:col-span-2">
                <ImageMediaEditor
                  index={0}
                  showCaption={false}
                  image={partnerForm.logo ? { ...partnerForm.logo, caption: "" } : { src: "", alt: partnerForm.name, caption: "", source: "url" }}
                  onUploadingChange={setIsUploadingPartnerLogo}
                  onChange={(image) => setPartnerForm({ ...partnerForm, logo: { src: image.src, alt: image.alt || partnerForm.name, source: image.source, mediaId: image.mediaId } })}
                  onRemove={() => setPartnerForm({ ...partnerForm, logo: undefined })}
                />
              </div>
        </div>
      </Modal>

      {/* Client Editor */}
      <Modal
        open={Boolean(editingClient)}
        onClose={() => setEditingClient(null)}
        eyebrow="Company content"
        title={editingClient?.id ? "Edit client profile" : "Add client or institution"}
        description="Add the image and details shown in the clients and institutions gallery."
        onSubmit={handleSaveClient}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingClient(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingClientImage}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              Save client
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Organization name
                <input type="text" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" required />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
                <input type="text" value={clientForm.category} onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })} placeholder="Energy & infrastructure" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:col-span-2">
                Summary
                <textarea rows={3} value={clientForm.description} onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })} placeholder="Describe the work or relationship with GeoSAT." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" />
              </label>
              <div className="sm:col-span-2">
                <ImageMediaEditor
                  index={0}
                  showCaption={false}
                  image={clientForm.image ? { ...clientForm.image, caption: "" } : { src: "", alt: clientForm.name, caption: "", source: "url" }}
                  onUploadingChange={setIsUploadingClientImage}
                  onChange={(image) => setClientForm({ ...clientForm, image: { src: image.src, alt: image.alt || clientForm.name, source: image.source, mediaId: image.mediaId } })}
                  onRemove={() => setClientForm({ ...clientForm, image: undefined })}
                />
              </div>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Display order
                <input type="number" min={0} value={clientForm.order ?? 0} onChange={(e) => setClientForm({ ...clientForm, order: Number(e.target.value) })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" />
              </label>
        </div>
      </Modal>

      {/* News Edit Modal */}
      <Modal
        open={Boolean(editingNews)}
        onClose={() => setEditingNews(null)}
        eyebrow="Company content"
        title="Article editor"
        description="Manage the content, cover image, and publication status shown on the News & Field Notes page."
        onSubmit={handleSaveNews}
        bodyClassName="space-y-3"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingNews(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingNewsImage}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              Publish Article
            </button>
          </>
        }
      >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Article Title</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Slug</label><input value={newsForm.slug} onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" placeholder="generated-from-title" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Author</label><input value={newsForm.author || ""} onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" /></div></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                  <input
                    type="text"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>
              <ImageMediaEditor
                index={0}
                showCaption={false}
                image={newsForm.image ? { ...newsForm.image, caption: "" } : { src: "", alt: newsForm.title, caption: "", source: "url" }}
                onUploadingChange={setIsUploadingNewsImage}
                onChange={(image: ContentImage) => setNewsForm({ ...newsForm, image: { src: image.src, alt: image.alt || newsForm.title, source: image.source, mediaId: image.mediaId } })}
                onRemove={() => setNewsForm({ ...newsForm, image: undefined })}
              />
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Article content (one paragraph per line)</label><textarea rows={6} value={newsForm.body.join("\n")} onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value.split("\n") })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15" required /></div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={newsForm.isPublished !== false} onChange={(e) => setNewsForm({ ...newsForm, isPublished: e.target.checked })} /> Published</label>
      </Modal>
    </div>
  );
}

export default CompanyManager;