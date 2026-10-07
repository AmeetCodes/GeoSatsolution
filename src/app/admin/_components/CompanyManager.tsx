"use client";

import React, { useState } from "react";
import {
  Users,
  Award,
  BookOpen,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Building,
  Calendar,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type {
  LeaderItem,
  PartnerItem,
  CompanyClientItem,
  NewsItem,
  ContentImage,
  CareerRole,
  SiteContentData,
} from "@/lib/data-store";
import { ResourcesManager } from "./ResourcesManager";
import { ImageMediaEditor } from "./ImageMediaEditor";

interface CompanyManagerProps {
  company: SiteContentData["Company"];
  onSaveCompany: (updatedCompany: SiteContentData["Company"]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

type SubTab = "leadership" | "partners" | "clients" | "insights" | "careers" | "resources";

export function CompanyManager({
  company,
  onSaveCompany,
  onTriggerToast,
}: CompanyManagerProps) {
  const [subTab, setSubTab] = useState<SubTab>("leadership");

  // Leadership editing state
  const [editingLeader, setEditingLeader] = useState<LeaderItem | null>(null);
  const [leaderForm, setLeaderForm] = useState<LeaderItem>({ name: "", role: "", division: "", bio: "", expertise: "", accent: "#0d9488", imagePosition: "center top" });
  const [isUploadingLeaderImage, setIsUploadingLeaderImage] = useState(false);

  // Partner editing state
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [partnerForm, setPartnerForm] = useState<PartnerItem>({ id: "", name: "", category: "", tier: "", description: "" });
  const [isUploadingPartnerLogo, setIsUploadingPartnerLogo] = useState(false);

  // Client and institution editing state
  const [editingClient, setEditingClient] = useState<CompanyClientItem | null>(null);
  const [clientForm, setClientForm] = useState<CompanyClientItem>({ name: "", category: "Institutional", description: "" });
  const [isUploadingClientImage, setIsUploadingClientImage] = useState(false);

  // News editing state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<NewsItem>({ slug: "", title: "", date: "", category: "", excerpt: "", body: [""], author: "GeoSAT Editorial", isPublished: true });
  const [isUploadingNewsImage, setIsUploadingNewsImage] = useState(false);

  // Career editing state
  const [editingCareer, setEditingCareer] = useState<CareerRole | null>(null);
  const [careerForm, setCareerForm] = useState<CareerRole>({
    slug: "",
    title: "",
    category: "Survey & GIS Engineering Roles",
    location: "",
    summary: "",
    responsibilities: [""],
    requirements: [""],
    description: "",
    employmentType: "Full-time",
    applicationInfo: "",
    status: "open",
    isPublished: true,
  });

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

  // Handler for Careers
  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = company.Careers || [];
    const exists = current.some((c) => c.slug === editingCareer?.slug);
    const itemToSave = {
      ...careerForm,
      slug: careerForm.slug || careerForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      responsibilities: careerForm.responsibilities.filter((r) => r.trim() !== ""),
      requirements: careerForm.requirements.filter((r) => r.trim() !== ""),
    };

    const updated = exists
      ? current.map((c) => (c.slug === editingCareer?.slug ? itemToSave : c))
      : [...current, itemToSave];

    await onSaveCompany({ ...company, Careers: updated });
    onTriggerToast("Career Posting Saved", `Updated ${itemToSave.title}`);
    setEditingCareer(null);
  };

  const handleDeleteCareer = async (slug: string) => {
    const updated = (company.Careers || []).filter((c) => c.slug !== slug);
    await onSaveCompany({ ...company, Careers: updated });
    onTriggerToast("Job Role Deleted", `Removed vacancy posting`);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setSubTab("leadership")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "leadership"
              ? "bg-[#f1ece5] text-zinc-950"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Executive Leadership ({company?.Leadership?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("partners")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "partners"
              ? "bg-[#f1ece5] text-zinc-950"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Technology Partners ({company?.Partners?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("clients")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "clients"
              ? "bg-[#f1ece5] text-zinc-950"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Clients &amp; Institutions ({company?.Clients?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("insights")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "insights"
              ? "bg-[#f1ece5] text-zinc-950"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Insights & News ({company?.Insights?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("careers")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "careers"
              ? "bg-[#f1ece5] text-zinc-950"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Careers & Roles ({company?.Careers?.length || 0})</span>
        </button>
        <button type="button" onClick={() => setSubTab("resources")} className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${subTab === "resources" ? "bg-[#f1ece5] text-zinc-950" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>
          <BookOpen className="w-3.5 h-3.5" /><span>Downloads ({company.Resources?.length || 0})</span>
        </button>
      </div>

      {/* LEADERSHIP SECTION */}
      {subTab === "leadership" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Executive and technical leads directing survey operations, GIS, and mission deployment.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsUploadingLeaderImage(false);
                setLeaderForm({ name: "", role: "", division: "", bio: "", expertise: "", accent: "#0d9488", imagePosition: "center top" });
                setEditingLeader({ name: "", role: "", division: "", bio: "" });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Leader
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...(company.Leadership || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((leader) => (
              <div
                key={leader.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex min-w-0 items-center gap-3">
                      {leader.image?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={leader.image.src} alt="" className="size-11 shrink-0 rounded-lg border border-white/10 object-cover" />
                      ) : <div className="size-11 shrink-0 rounded-lg bg-teal-700/30" aria-hidden="true" />}
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-zinc-100">{leader.name}</h4>
                        <p className="text-xs font-medium text-teal-300">{leader.role}</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">{leader.division}</p>
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
                        className="p-1 text-zinc-400 hover:text-zinc-950"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLeader(leader.name)}
                        className="p-1 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2 line-clamp-4">
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
            <p className="text-xs text-zinc-400">
              Global technology vendors, instrument manufacturers, and institutional client partners.
            </p>
            <button
              type="button"
              onClick={() => {
                setPartnerForm({ id: "", name: "", category: "", tier: "", description: "" });
                setIsUploadingPartnerLogo(false);
                setEditingPartner({ id: "", name: "", category: "", tier: "", description: "" });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Partner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...(company.Partners || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((partner) => (
              <div
                key={partner.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex min-w-0 items-center gap-3">
                      {partner.logo?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={partner.logo.src} alt="" className="size-11 shrink-0 rounded-lg border border-white/10 bg-white object-contain p-1" />
                      ) : <div className="size-11 shrink-0 rounded-lg bg-teal-700/30" aria-hidden="true" />}
                      <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-zinc-100">{partner.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-200 border border-teal-800/50">
                        {partner.tier}
                      </span>
                      <p className="text-xs text-zinc-400 mt-1">{partner.category}</p>
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
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(partner.name)}
                        className="p-1 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-2">
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
            <p className="text-xs text-zinc-400">Manage the client and institution profiles shown in the public accordion gallery.</p>
            <button
              type="button"
              onClick={() => {
                setIsUploadingClientImage(false);
                setClientForm({ name: "", category: "Institutional", description: "", order: (company.Clients || []).length + 1 });
                setEditingClient({ name: "", category: "Institutional", description: "" });
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-500"
            >
              <Plus className="size-3.5" /> Add client
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...(company.Clients || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((client) => (
              <article key={client.id || client.name} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                {client.image?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={client.image.src} alt="" className="size-12 shrink-0 rounded-lg border border-white/10 bg-white object-contain p-1" />
                ) : <div className="size-12 shrink-0 rounded-lg bg-amber-700/25" aria-hidden="true" />}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-zinc-100">{client.name}</h3>
                  <p className="mt-0.5 text-xs text-amber-300">{client.category}</p>
                  {client.description ? <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">{client.description}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" aria-label={`Edit ${client.name}`} onClick={() => { setIsUploadingClientImage(false); setClientForm(client); setEditingClient(client); }} className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"><Edit2 className="size-3.5" /></button>
                  <button type="button" aria-label={`Delete ${client.name}`} onClick={() => void handleDeleteClient(client.id, client.name)} className="rounded-md p-1.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-300"><Trash2 className="size-3.5" /></button>
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
            <p className="text-xs text-zinc-400">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Write Article
            </button>
          </div>

          <div className="space-y-3">
            {(company.Insights || []).map((item) => (
              <div
                key={item.slug}
                className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 uppercase">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-950">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
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
                    className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-zinc-950"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNews(item.slug)}
                    className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAREERS SECTION */}
      {subTab === "careers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Open engineering positions, field operations roles, and software vacancies.
            </p>
            <button
              type="button"
              onClick={() => {
                setCareerForm({
                  slug: "",
                  title: "",
                  category: "Survey & GIS Engineering Roles",
                  location: "Kathmandu / Field",
                  summary: "",
                  responsibilities: [""],
                  requirements: [""],
                  description: "",
                  employmentType: "Full-time",
                  applicationInfo: "",
                  status: "open",
                  isPublished: true,
                });
                setEditingCareer({
                  slug: "",
                  title: "",
                  category: "Survey & GIS Engineering Roles",
                  location: "Kathmandu / Field",
                  summary: "",
                  responsibilities: [""],
                  requirements: [""],
                  description: "",
                  employmentType: "Full-time",
                  applicationInfo: "",
                  status: "open",
                  isPublished: true,
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Post Job Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.Careers || []).map((job) => (
              <div
                key={job.slug}
                className="rounded-xl border border-zinc-800 bg-[#f1ece5]/50 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950">{job.title}</h4>
                      <p className="text-xs text-purple-400 font-medium">{job.category}</p>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCareerForm({ ...job });
                          setEditingCareer({ ...job });
                        }}
                        className="p-1 text-zinc-400 hover:text-zinc-950"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCareer(job.slug)}
                        className="p-1 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2 line-clamp-3">
                    {job.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "resources" && <ResourcesManager resources={company.Resources || []} onSave={(resources) => onSaveCompany({ ...company, Resources: resources })} />}

      {/* Leader Edit Modal */}
      {editingLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#101820] p-6 text-white shadow-[0_32px_100px_-35px_rgba(0,0,0,0.85)] sm:p-7">
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300">Company content</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{editingLeader.id ? "Edit team member" : "Add team member"}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">These profile details are saved to the team database and shown on the leadership page.</p>
            </div>
            <form onSubmit={handleSaveLeader} className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Name</label>
                <input
                  type="text"
                  value={leaderForm.name}
                  onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Title / Designation</label>
                <input
                  type="text"
                  value={leaderForm.role}
                  onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Division</label>
                <input
                  type="text"
                  value={leaderForm.division}
                  onChange={(e) => setLeaderForm({ ...leaderForm, division: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Expertise</label>
                <textarea
                  rows={3}
                  value={leaderForm.expertise || ""}
                  onChange={(e) => setLeaderForm({ ...leaderForm, expertise: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
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
                <label className="mb-1 block text-xs font-medium text-slate-200">Image position</label>
                <select value={leaderForm.imagePosition || "center top"} onChange={(e) => setLeaderForm({ ...leaderForm, imagePosition: e.target.value })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20">
                  {["center top", "center", "center bottom", "left center", "right center"].map((position) => <option key={position} value={position}>{position}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Highlight color</label>
                <div className="flex h-[42px] items-center gap-3 rounded-lg border border-slate-600 bg-[#0b141b] px-3">
                  <input type="color" value={leaderForm.accent || "#0d9488"} onChange={(e) => setLeaderForm({ ...leaderForm, accent: e.target.value })} className="size-7 cursor-pointer rounded border-0 bg-transparent" />
                  <span className="font-mono text-xs text-slate-300">{leaderForm.accent || "#0d9488"}</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Display order</label>
                <input type="number" min={0} value={leaderForm.order ?? 0} onChange={(e) => setLeaderForm({ ...leaderForm, order: Number(e.target.value) })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" />
              </div>
              <details className="sm:col-span-2">
                <summary className="cursor-pointer text-xs font-medium text-slate-300">Legacy profile biography</summary>
                <textarea rows={3} value={leaderForm.bio || ""} onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" placeholder="Existing profile bio, retained for other site content." />
              </details>
              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setEditingLeader(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingLeaderImage}
                  className="rounded-lg bg-teal-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101820] disabled:cursor-wait disabled:opacity-60"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Edit Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#101820] p-6 text-white shadow-[0_32px_100px_-35px_rgba(0,0,0,0.85)] sm:p-7">
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300">Company content</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{editingPartner.id ? "Edit technology partner" : "Add technology partner"}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">Partner information and imagery displayed in the public gallery.</p>
            </div>
            <form onSubmit={handleSavePartner} className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Organization name
                <input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" required />
              </label>
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Tier / partnership level
                <input type="text" value={partnerForm.tier} onChange={(e) => setPartnerForm({ ...partnerForm, tier: e.target.value })} placeholder="Global Technology Partner" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" required />
              </label>
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Domain / category
                <input type="text" value={partnerForm.category} onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })} placeholder="Satellite imagery, hardware" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" required />
              </label>
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Display order
                <input type="number" min={0} value={partnerForm.order ?? 0} onChange={(e) => setPartnerForm({ ...partnerForm, order: Number(e.target.value) })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" />
              </label>
              <label className="block space-y-1 text-xs font-medium text-slate-200 sm:col-span-2">
                Collaboration summary
                <textarea rows={3} value={partnerForm.description} onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20" required />
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
              <div className="flex justify-end gap-2 border-t border-slate-700 pt-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPartnerLogo}
                  className="rounded-lg bg-teal-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-wait disabled:opacity-60"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Editor */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#101820] p-6 text-white shadow-[0_32px_100px_-35px_rgba(0,0,0,0.85)] sm:p-7">
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Company content</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{editingClient.id ? "Edit client profile" : "Add client or institution"}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">Add the image and details shown in the clients and institutions gallery.</p>
            </div>
            <form onSubmit={handleSaveClient} className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Organization name
                <input type="text" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20" required />
              </label>
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Category
                <input type="text" value={clientForm.category} onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })} placeholder="Energy & infrastructure" className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20" />
              </label>
              <label className="block space-y-1 text-xs font-medium text-slate-200 sm:col-span-2">
                Summary
                <textarea rows={3} value={clientForm.description} onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })} placeholder="Describe the work or relationship with GeoSAT." className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20" />
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
              <label className="block space-y-1 text-xs font-medium text-slate-200">
                Display order
                <input type="number" min={0} value={clientForm.order ?? 0} onChange={(e) => setClientForm({ ...clientForm, order: Number(e.target.value) })} className="w-full rounded-lg border border-slate-600 bg-[#0b141b] px-3 py-2.5 text-sm text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20" />
              </label>
              <div className="flex justify-end gap-2 border-t border-slate-700 pt-3 sm:col-span-2">
                <button type="button" onClick={() => setEditingClient(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">Cancel</button>
                <button type="submit" disabled={isUploadingClientImage} className="rounded-lg bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60">Save client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Edit Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#111c22] p-6 shadow-2xl text-white">
            <h3 className="text-lg font-bold mb-1">Article editor</h3>
            <p className="mb-5 text-sm text-slate-400">Manage the content, cover image, and publication status shown on the News &amp; Field Notes page.</p>
            <form onSubmit={handleSaveNews} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Article Title</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-zinc-300 mb-1">Slug</label><input value={newsForm.slug} onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" placeholder="generated-from-title" /></div><div><label className="block text-xs font-medium text-zinc-300 mb-1">Author</label><input value={newsForm.author || ""} onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" /></div></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
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
              <div><label className="block text-xs font-medium text-zinc-300 mb-1">Article content (one paragraph per line)</label><textarea rows={6} value={newsForm.body.join("\n")} onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value.split("\n") })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" required /></div>
              <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={newsForm.isPublished !== false} onChange={(e) => setNewsForm({ ...newsForm, isPublished: e.target.checked })} /> Published</label>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingNewsImage}
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-zinc-950 disabled:cursor-wait disabled:opacity-60"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Career Edit Modal */}
      {editingCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#f1ece5] p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold mb-4">Job Role Posting</h3>
            <form onSubmit={handleSaveCareer} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <select value={careerForm.category} onChange={(e) => setCareerForm({ ...careerForm, category: e.target.value })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" required>
                    {[...new Set([careerForm.category, "Survey & GIS Engineering Roles", "UAV & LiDAR Operations Roles", "Software Development Roles"])].filter(Boolean).map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={careerForm.location}
                    onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Role Summary</label>
                <textarea
                  rows={2}
                  value={careerForm.summary}
                  onChange={(e) => setCareerForm({ ...careerForm, summary: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"
                  required
                />
              </div>
              <div><label className="block text-xs font-medium text-zinc-300 mb-1">Full description</label><textarea rows={3} value={careerForm.description || ""} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" /></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-zinc-300 mb-1">Employment type</label><input value={careerForm.employmentType || ""} onChange={(e) => setCareerForm({ ...careerForm, employmentType: e.target.value })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" /></div><div><label className="block text-xs font-medium text-zinc-300 mb-1">Posting status</label><select value={careerForm.status || "open"} onChange={(e) => setCareerForm({ ...careerForm, status: e.target.value as "open" | "closed" })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white"><option value="open">Open</option><option value="closed">Closed</option></select></div></div>
              <div><label className="block text-xs font-medium text-zinc-300 mb-1">Responsibilities (one per line)</label><textarea rows={4} value={careerForm.responsibilities.join("\n")} onChange={(e) => setCareerForm({ ...careerForm, responsibilities: e.target.value.split("\n") })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" /></div>
              <div><label className="block text-xs font-medium text-zinc-300 mb-1">Requirements (one per line)</label><textarea rows={4} value={careerForm.requirements.join("\n")} onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value.split("\n") })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" /></div>
              <div><label className="block text-xs font-medium text-zinc-300 mb-1">Application information</label><textarea rows={2} value={careerForm.applicationInfo || ""} onChange={(e) => setCareerForm({ ...careerForm, applicationInfo: e.target.value })} className="w-full px-3 py-2 text-xs rounded bg-[#f1ece5] border border-zinc-800 text-white" /></div>
              <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={careerForm.isPublished !== false} onChange={(e) => setCareerForm({ ...careerForm, isPublished: e.target.checked })} /> Published</label>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingCareer(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-zinc-950"
                >
                  Post Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyManager;
