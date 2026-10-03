"use client";

import { useState } from "react";
import { GlobeCanvas } from "./GlobeCanvas";
import { GlobePlate } from "./GlobePlate";
import { cn } from "@/lib/utils";

/** Three arcs 120° apart — a targeting reticle, not a second globe. */
function arcPath(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number) {
  const pt = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
  };
  const [x1, y1] = pt(startDeg);
  const [x2, y2] = pt(startDeg + sweepDeg);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * The hero's globe stack.
 *
 * Three layers, cheapest first: a CSS glow, the server-rendered vector plate,
 * then WebGL. The plate is what guarantees a real Earth in the first paint —
 * it is already in the HTML — and it stays put if WebGL is declined,
 * unavailable, or the visitor prefers reduced motion.
 */
export function HeroGlobe({ className }: { className?: string }) {
  const [webglLive, setWebglLive] = useState(false);

  return (
    <div className={cn("pointer-events-none absolute", className)} aria-hidden="true">
      {/* Atmospheric bleed, the only piece that is pure CSS. */}
      <div className="absolute -inset-[22%] rounded-full bg-[radial-gradient(circle_at_42%_38%,rgba(60,227,214,0.16),rgba(13,51,80,0.14)_38%,transparent_66%)] blur-2xl" />

      {/* Reticle: arcs sweep slowly, the dashed ring runs the other way. */}
      <div className="absolute -inset-[13%] opacity-70">
        <svg viewBox="0 0 1000 1000" className="h-full w-full">
          <circle
            cx="500"
            cy="500"
            r="470"
            fill="none"
            stroke="#3ce3d6"
            strokeOpacity="0.16"
            strokeWidth="1"
            strokeDasharray="3 14"
            className="[animation:orbit-reverse_180s_linear_infinite] [transform-origin:50%_50%]"
          />
          <g
            stroke="#7cf5ea"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="[animation:orbit_90s_linear_infinite] [transform-origin:50%_50%]"
          >
            <path d={arcPath(500, 500, 468, 0, 34)} />
            <path d={arcPath(500, 500, 468, 130, 18)} />
            <path d={arcPath(500, 500, 468, 250, 26)} />
          </g>
        </svg>
      </div>

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[1100ms] ease-out",
          webglLive ? "opacity-0" : "opacity-100",
        )}
      >
        <GlobePlate className="h-full w-full" />
      </div>

      <GlobeCanvas className="absolute inset-0" onReady={() => setWebglLive(true)} />
    </div>
  );
}
