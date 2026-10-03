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
  NewsItem,
  CareerRole,
} from "@/lib/data-store";

interface CompanyManagerProps {
  company: {
    Leadership: LeaderItem[];
    Partners: PartnerItem[];
    Insights: NewsItem[];
    Careers: CareerRole[];
  };
  onSaveCompany: (updatedCompany: any) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

type SubTab = "leadership" | "partners" | "insights" | "careers";

export function CompanyManager({
  company,
  onSaveCompany,
  onTriggerToast,
}: CompanyManagerProps) {
  const [subTab, setSubTab] = useState<SubTab>("leadership");

  // Leadership editing state
  const [editingLeader, setEditingLeader] = useState<LeaderItem | null>(null);
  const [leaderForm, setLeaderForm] = useState<LeaderItem>({ name: "", role: "", division: "", bio: "" });

  // Partner editing state
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [partnerForm, setPartnerForm] = useState<PartnerItem>({ id: "", name: "", category: "", tier: "", description: "" });

  // News editing state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<NewsItem>({ slug: "", title: "", date: "", category: "", excerpt: "", body: [""] });

  // Career editing state
  const [editingCareer, setEditingCareer] = useState<CareerRole | null>(null);
  const [careerForm, setCareerForm] = useState<CareerRole>({
    slug: "",
    title: "",
    category: "",
    location: "",
    summary: "",
    responsibilities: [""],
    requirements: [""],
  });

  // Handler for Leadership
  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = company.Leadership || [];
    const exists = current.some((l) => l.name === editingLeader?.name);
    const updated = exists
      ? current.map((l) => (l.name === editingLeader?.name ? leaderForm : l))
      : [...current, leaderForm];

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
    const current = company.Partners || [];
    const exists = current.some((p) => p.name === editingPartner?.name);
    const updated = exists
      ? current.map((p) => (p.name === editingPartner?.name ? partnerForm : p))
      : [...current, { ...partnerForm, id: partnerForm.id || `PART-${Date.now().toString().slice(-4)}` }];

    await onSaveCompany({ ...company, Partners: updated });
    onTriggerToast("Partner Saved", `Updated partner ${partnerForm.name}`);
    setEditingPartner(null);
  };

  const handleDeletePartner = async (name: string) => {
    const updated = (company.Partners || []).filter((p) => p.name !== name);
    await onSaveCompany({ ...company, Partners: updated });
    onTriggerToast("Removed Partner", `Removed ${name}`);
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
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setSubTab("leadership")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "leadership"
              ? "bg-purple-600 text-white"
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
              ? "bg-purple-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Technology Partners ({company?.Partners?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("insights")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            subTab === "insights"
              ? "bg-purple-600 text-white"
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
              ? "bg-purple-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Careers & Roles ({company?.Careers?.length || 0})</span>
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
                setLeaderForm({ name: "", role: "", division: "", bio: "" });
                setEditingLeader({ name: "", role: "", division: "", bio: "" });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Leader
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(company.Leadership || []).map((leader) => (
              <div
                key={leader.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{leader.name}</h4>
                      <p className="text-xs text-purple-400 font-medium">{leader.role}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{leader.division}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLeaderForm(leader);
                          setEditingLeader(leader);
                        }}
                        className="p-1 text-zinc-400 hover:text-white"
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
                    {leader.bio}
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
                setEditingPartner({ id: "", name: "", category: "", tier: "", description: "" });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Partner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.Partners || []).map((partner) => (
              <div
                key={partner.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{partner.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                        {partner.tier}
                      </span>
                      <p className="text-xs text-zinc-400 mt-1">{partner.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
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
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                    {partner.description}
                  </p>
                </div>
              </div>
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
                });
                setEditingNews({
                  slug: "",
                  title: "",
                  date: new Date().toISOString().slice(0, 10),
                  category: "Operations",
                  excerpt: "",
                  body: [""],
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Write Article
            </button>
          </div>

          <div className="space-y-3">
            {(company.Insights || []).map((item) => (
              <div
                key={item.slug}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-start justify-between gap-4"
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
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
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
                    className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white"
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
                  category: "Engineering",
                  location: "Kathmandu / Field",
                  summary: "",
                  responsibilities: [""],
                  requirements: [""],
                });
                setEditingCareer({
                  slug: "",
                  title: "",
                  category: "Engineering",
                  location: "Kathmandu / Field",
                  summary: "",
                  responsibilities: [""],
                  requirements: [""],
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
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{job.title}</h4>
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
                        className="p-1 text-zinc-400 hover:text-white"
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

      {/* Leader Edit Modal */}
      {editingLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold mb-4">Leader Profile</h3>
            <form onSubmit={handleSaveLeader} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Name</label>
                <input
                  type="text"
                  value={leaderForm.name}
                  onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={leaderForm.role}
                  onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Division</label>
                <input
                  type="text"
                  value={leaderForm.division}
                  onChange={(e) => setLeaderForm({ ...leaderForm, division: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={leaderForm.bio}
                  onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingLeader(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-white"
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
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold mb-4">Partner Details</h3>
            <form onSubmit={handleSavePartner} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Tier / Partnership Level</label>
                <input
                  type="text"
                  value={partnerForm.tier}
                  onChange={(e) => setPartnerForm({ ...partnerForm, tier: e.target.value })}
                  placeholder="e.g. Global Technology Partner"
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Domain / Category</label>
                <input
                  type="text"
                  value={partnerForm.category}
                  onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                  placeholder="e.g. Satellite Imagery, Hardware"
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Collaboration Summary</label>
                <textarea
                  rows={3}
                  value={partnerForm.description}
                  onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Edit Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold mb-4">Article Editor</h3>
            <form onSubmit={handleSaveNews} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Article Title</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
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
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-white"
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
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold mb-4">Job Role Posting</h3>
            <form onSubmit={handleSaveCareer} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={careerForm.category}
                    onChange={(e) => setCareerForm({ ...careerForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={careerForm.location}
                    onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
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
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingCareer(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-purple-600 hover:bg-purple-500 text-white"
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
