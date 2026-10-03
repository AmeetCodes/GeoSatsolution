"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useCapabilities, useInViewport } from "@/lib/hooks";

/**
 * Three.js and the 96 KiB coastline payload live entirely in this chunk. It is
 * only requested after hydration, and never at all when the device probe
 * says the globe should not run.
 */
const GlobeWebGL = dynamic(
  () => import("./GlobeWebGL").then((mod) => mod.GlobeWebGL),
  { ssr: false, loading: () => null },
);

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("GeoSAT hero globe failed to render; keeping the vector plate.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type GlobeCanvasProps = {
  className?: string;
  onReady?: () => void;
};

export function GlobeCanvas({ className, onReady }: GlobeCanvasProps) {
  const { ready, tier, reducedMotion } = useCapabilities();
  const { ref, visible } = useInViewport<HTMLDivElement>("300px");

  if (!ready || tier === "none") {
    return <div ref={ref} className={className} aria-hidden="true" />;
  }

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <WebGLBoundary fallback={null}>
        <GlobeWebGL
          tier={tier}
          animated={!reducedMotion}
          active={visible}
          onReady={onReady}
        />
      </WebGLBoundary>
    </div>
  );
}
