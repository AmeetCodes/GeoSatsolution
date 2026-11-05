"use client";

import { useState } from "react";
import type { LeaderItem } from "@/app/company/_lib/company-content";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function TeamLeadCard({ leader }: { leader: LeaderItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = leader.image?.src;
  const hasImage = Boolean(imageSrc) && !imageFailed;

  return (
    <li className="group relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-2xl transition-all duration-300 hover:border-teal-500/50 hover:shadow-teal-950/30">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6">
        <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10 text-xl font-bold text-teal-400 shadow-inner">
          {initials(leader.name)}
        </span>
        <span className="mt-3 font-mono text-xs uppercase tracking-wider text-slate-500">Photo Pending</span>
      </div>
      {hasImage ? (
        // A native image supports uploaded and externally hosted leader portraits.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc ?? ""}
          alt={leader.image?.alt || `${leader.name}, ${leader.role}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: leader.imagePosition || "center top" }}
        />
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      <div className="relative z-10 flex flex-col justify-end p-6">
        <h2 className="text-lg font-bold leading-tight text-white transition-colors group-hover:text-teal-300">
          {leader.name}
        </h2>
        <p className="mt-1 text-xs font-semibold text-teal-400">{leader.role}</p>
        {leader.expertise || leader.bio ? (
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-300 opacity-90">
            {leader.expertise || leader.bio}
          </p>
        ) : null}
      </div>
    </li>
  );
}
