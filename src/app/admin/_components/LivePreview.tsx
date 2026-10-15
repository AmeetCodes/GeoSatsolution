"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, Check } from "lucide-react";
import type { SiteContentData, SolutionItem, ProductItem } from "@/lib/data-store";

interface LivePreviewProps {
  content: SiteContentData;
}

export function LivePreview({ content }: LivePreviewProps) {
  const [view, setView] = useState<"solutions" | "products" | "industries" | "company">("solutions");
  const [activeSolution, setActiveSolution] = useState<SolutionItem>(
    content.Solutions[0] || ({} as SolutionItem)
  );
  const [activeProduct, setActiveProduct] = useState<ProductItem>(
    content.Products[0] || ({} as ProductItem)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#f1ece5]/80 p-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#f1ece5] animate-ping" />
            Live Component & Page Simulator
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Rendered in realtime with the identical styling, typography, and dark-theme tokens as the public customer interface.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setView("solutions")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              view === "solutions" ? "bg-[#f1ece5] text-zinc-950 font-semibold" : "bg-[#f1ece5]/80 text-zinc-300 border border-zinc-800"
            }`}
          >
            Solutions View
          </button>
          <button
            type="button"
            onClick={() => setView("products")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              view === "products" ? "bg-[#f1ece5] text-zinc-950 font-semibold" : "bg-[#f1ece5]/80 text-zinc-300 border border-zinc-800"
            }`}
          >
            Products View
          </button>
          <button
            type="button"
            onClick={() => setView("industries")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              view === "industries" ? "bg-[#f1ece5] text-zinc-950 font-semibold" : "bg-[#f1ece5]/80 text-zinc-300 border border-zinc-800"
            }`}
          >
            Industries View
          </button>
          <button
            type="button"
            onClick={() => setView("company")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              view === "company" ? "bg-[#f1ece5] text-zinc-950 font-semibold" : "bg-[#f1ece5]/80 text-zinc-300 border border-zinc-800"
            }`}
          >
            Company View
          </button>
        </div>
      </div>

      {/* SIMULATED CLIENT WORKSPACE */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#090b10] p-6 sm:p-10 shadow-2xl overflow-hidden relative text-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
            <span className="text-[11px] font-mono text-zinc-500 ml-2">
              Preview Mode · GeoSAT Design System (theme: #090b10)
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            Open Live Route <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* 1. SOLUTIONS VIEW */}
        {view === "solutions" && (
          <div className="space-y-8">
            {/* Quick solution pill selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {content.Solutions.map((sol) => (
                <button
                  key={sol.title}
                  onClick={() => setActiveSolution(sol)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    activeSolution.title === sol.title
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-[#f1ece5] text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {sol.title}
                </button>
              ))}
            </div>

            {/* Public Layout Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block text-xs uppercase font-bold tracking-widest text-cyan-400">
                  {activeSolution.group || "Survey & Mapping"} · GeoSAT Capability
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1ece5] leading-tight">
                  {activeSolution.title}
                </h1>

                <p className="text-lg text-zinc-300 leading-relaxed font-light">
                  {activeSolution.intro}
                </p>

                <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                  {activeSolution.description}
                </p>

                {/* Handover Deliverables */}
                <div className="pt-6 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                    A Clear Handover · Output Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeSolution.outcomes?.map((out, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f1ece5]/80 border border-zinc-800/80 text-xs text-zinc-200"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="font-medium">{out}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Image */}
              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#f1ece5] aspect-video relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element -- preview renders CMS-provided image URLs */}
                  <img
                    src={
                      activeSolution.images?.[0]?.src ||
                      "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85"
                    }
                    alt={activeSolution.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-xs text-zinc-300 font-medium">
                    {activeSolution.images?.[0]?.caption || "Field survey acquisition"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS VIEW */}
        {view === "products" && (
          <div className="space-y-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {content.Products.map((prod) => (
                <button
                  key={prod.title}
                  onClick={() => setActiveProduct(prod)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    activeProduct.title === prod.title
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : "bg-[#f1ece5] text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {prod.title}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block text-xs uppercase font-bold tracking-widest text-blue-400">
                  {activeProduct.group} · Hardware & Software
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1ece5] leading-tight">
                  {activeProduct.title}
                </h1>

                <p className="text-lg text-zinc-300 leading-relaxed font-light">
                  {activeProduct.intro}
                </p>

                <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                  {activeProduct.description}
                </p>

                <div className="pt-6 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                    Technical Specifications & Tolerances
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeProduct.outcomes?.map((out, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f1ece5]/80 border border-zinc-800/80 text-xs text-zinc-200"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="font-medium">{out}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#f1ece5] aspect-video relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element -- preview renders CMS-provided image URLs */}
                  <img
                    src={
                      activeProduct.images?.[0]?.src ||
                      "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85"
                    }
                    alt={activeProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-xs text-zinc-300 font-medium">
                    {activeProduct.images?.[0]?.caption || "High-precision instrumentation"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. INDUSTRIES VIEW */}
        {view === "industries" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.Industries.map((ind) => (
              <div
                key={ind.title}
                className="rounded-xl border border-zinc-800 bg-[#f1ece5]/40 p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Industry Sector
                  </span>
                  <h3 className="text-2xl font-bold text-zinc-950 mt-1 mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-sm text-zinc-300 mb-3 font-medium">
                    {ind.intro}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {ind.description}
                  </p>

                  <div className="pt-3 border-t border-zinc-800">
                    <div className="flex flex-wrap gap-2">
                      {ind.items.map((sub, sidx) => (
                        <span
                          key={sidx}
                          className="px-2.5 py-1 text-xs rounded bg-zinc-800/80 text-zinc-200 border border-zinc-700/60"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. COMPANY VIEW */}
        {view === "company" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-zinc-950 mb-4">
                Executive Leadership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(content.Company?.Leadership || []).map((leader) => (
                  <div
                    key={leader.name}
                    className="p-4 rounded-xl border border-zinc-800 bg-[#f1ece5]/50"
                  >
                    <h4 className="text-base font-bold text-zinc-950">{leader.name}</h4>
                    <p className="text-xs text-purple-400 font-medium mb-1">{leader.role}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{leader.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-zinc-950 mb-4">
                Technology Partners
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(content.Company?.Partners || []).map((partner) => (
                  <div
                    key={partner.name}
                    className="p-4 rounded-xl border border-zinc-800 bg-[#f1ece5]/50"
                  >
                    <h4 className="text-base font-bold text-zinc-950">{partner.name}</h4>
                    <span className="text-xs text-purple-400 font-medium">{partner.tier}</span>
                    <p className="text-xs text-zinc-400 mt-1">{partner.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LivePreview;
