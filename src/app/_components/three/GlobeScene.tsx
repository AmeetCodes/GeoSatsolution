"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { Coastlines } from "./Coastlines";
import { GlobeSurface } from "./GlobeSurface";
import { Graticule } from "./Graticule";
import { LandPoints } from "./LandPoints";
import { StarField } from "./StarField";
import {
  GLOBE_PARALLAX_PITCH,
  GLOBE_PARALLAX_YAW,
  GLOBE_SPIN,
  GLOBE_START_ROT_Y,
  GLOBE_TILT_X,
} from "./framing";
import type { RenderTier } from "@/lib/hooks";

const POINT_QUALITY: Record<RenderTier, "high" | "medium" | "low"> = {
  high: "high",
  medium: "medium",
  low: "low",
  none: "low",
};

type GlobeSceneProps = {
  tier: RenderTier;
  /** Suppressed when the visitor prefers reduced motion. */
  animated?: boolean;
};

export function GlobeScene({ tier, animated = true }: GlobeSceneProps) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node || !animated) return;

    // Frame-rate independent, and clamped, so a stalled tab cannot teleport
    // the globe when it resumes.
    const step = Math.min(delta, 0.05);

    node.rotation.y += GLOBE_SPIN * step;

    // The canvas spans the hero, so R3F's normalised pointer gives a free,
    // correctly-clamped parallax signal. Touch devices report zero and the
    // idle drift carries the motion instead.
    const { x, y } = state.pointer;
    const targetTilt = GLOBE_TILT_X + y * GLOBE_PARALLAX_PITCH;
    const targetYaw = node.rotation.y + x * GLOBE_PARALLAX_YAW;
    const ease = Math.min(step * 2.4, 1);

    node.rotation.x += (targetTilt - node.rotation.x) * ease;
    node.rotation.y += (targetYaw - node.rotation.y) * ease;
  });

  return (
    <>
      <StarField count={tier === "high" ? 900 : 420} />

      <group ref={group} rotation={[GLOBE_TILT_X, GLOBE_START_ROT_Y, 0]}>
        <GlobeSurface detail={tier === "high" ? "high" : "low"} />
        <Graticule />
        <Coastlines opacity={tier === "high" ? 0.72 : 0.5} />
        <LandPoints quality={POINT_QUALITY[tier]} />
      </group>
    </>
  );
}
