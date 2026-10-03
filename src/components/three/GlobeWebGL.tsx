"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { GlobeScene } from "./GlobeScene";
import type { RenderTier } from "@/lib/hooks";

type GlobeWebGLProps = {
  tier: RenderTier;
  animated: boolean;
  /** False once the hero scrolls away — the loop stops entirely. */
  active: boolean;
  onReady?: () => void;
};

/** Fires once, on the first frame the renderer actually draws. */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);

  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });

  return null;
}

/** Re-arms the loop when the hero scrolls back into view. */
function LoopControl({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  return null;
}

export function GlobeWebGL({ tier, animated, active, onReady }: GlobeWebGLProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.35], fov: 32, near: 0.1, far: 80 }}
      dpr={tier === "high" ? [1, 2] : [1, 1.5]}
      frameloop={active ? (animated ? "always" : "demand") : "never"}
      gl={{
        alpha: true,
        antialias: tier === "high",
        powerPreference: "high-performance",
      }}
      style={{ touchAction: "pan-y" }}
    >
      <FirstFrame onReady={onReady} />
      <LoopControl active={active} />
      <GlobeScene tier={tier} animated={animated} />
    </Canvas>
  );
}
