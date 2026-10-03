"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Client capability probe for the 3D layer.
 *
 * `tier` drives geometry density, particle counts and antialiasing.
 * `none` means "do not mount WebGL at all" — the caller renders the vector
 * plate instead.
 *
 * The probe reads browser APIs, so it is exposed through `useSyncExternalStore`
 * with an explicit server snapshot. That keeps the server-rendered markup and
 * the first client render identical, then swaps in the real tier immediately
 * after hydration without a cascading re-render from an effect.
 */
export type RenderTier = "high" | "medium" | "low" | "none";

export type Capabilities = {
  ready: boolean;
  tier: RenderTier;
  reducedMotion: boolean;
  compact: boolean;
};

const SERVER_CAPABILITIES: Capabilities = {
  ready: false,
  tier: "none",
  reducedMotion: false,
  compact: false,
};

let cached: Capabilities | null = null;

const noopSubscribe = () => () => {};

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

function probe(): Capabilities {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 900px)").matches;

  if (!hasWebGL() || reducedMotion) {
    return { ready: true, tier: "none", reducedMotion, compact };
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  // navigator.deviceMemory is Chromium-only; absent means "assume desktop".
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (compact || coarse || cores <= 4 || memory <= 4) {
    return { ready: true, tier: "medium", reducedMotion, compact };
  }

  return { ready: true, tier: "high", reducedMotion, compact };
}

export function useCapabilities(): Capabilities {
  const getSnapshot = useCallback(() => (cached ??= probe()), []);

  return useSyncExternalStore(
    noopSubscribe,
    getSnapshot,
    useCallback(() => SERVER_CAPABILITIES, []),
  );
}

/**
 * Viewport gate. The globe sits behind the hero, so once it scrolls out of
 * view the render loop is stopped entirely rather than burning GPU on an
 * invisible scene. The unsupported-browser case resolves in the state
 * initialiser, so it never needs an effect either.
 */
export function useInViewport<T extends Element>(margin = "240px") {
  const ref = useRef<T | null>(null);

  // The unsupported-browser case resolves in the initialiser rather than in an
  // effect, so subscribing to the observer stays a pure subscription.
  const [visible, setVisible] = useState(
    typeof window !== "undefined" && typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: margin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, visible };
}
