"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry } from "three";
import { getCoastlineSegments } from "@/lib/geo";
import { SCENE } from "./palette";

type CoastlinesProps = {
  radius?: number;
  opacity?: number;
};

/**
 * Vector coastlines as a single line-segment draw call, lifted a hair off the
 * surface. Depth testing hides the far side, so only the visible hemisphere
 * is ever shaded.
 */
export function Coastlines({ radius = 1.0022, opacity = 0.7 }: CoastlinesProps) {
  const geometry = useMemo(() => {
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new BufferAttribute(getCoastlineSegments(radius), 3));
    buffer.computeBoundingSphere();
    return buffer;
  }, [radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} renderOrder={2}>
      <lineBasicMaterial
        color={SCENE.aquaBright}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </lineSegments>
  );
}
