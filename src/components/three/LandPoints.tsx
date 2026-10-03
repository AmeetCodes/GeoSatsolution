"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, type Points, ShaderMaterial } from "three";
import { getLandPoints } from "@/lib/geo";
import { createRandom } from "@/lib/random";
import { landPointFragment, landPointVertex } from "./globeShaders";
import { SCENE } from "./palette";

type LandPointsProps = {
  radius?: number;
  count?: number;
  /** Hardware concurrency budget decides how dense the shell gets. */
  quality?: "high" | "medium" | "low";
};

/**
 * A scatter of survey points across every landmass. This is the layer that
 * carries the brand promise — the globe is not a picture of the earth, it is
 * a picture of data taken from it.
 */
export function LandPoints({ radius = 1.007, quality = "high" }: LandPointsProps) {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);

  const count = quality === "high" ? 7200 : quality === "medium" ? 4200 : 2400;

  const geometry = useMemo(() => {
    const positions = getLandPoints(radius, count);
    const random = createRandom(0x1a4d);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      seeds[i] = random();
      sizes[i] = 1.1 + random() * 1.5;
    }

    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new BufferAttribute(positions, 3));
    buffer.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    buffer.setAttribute("aSize", new BufferAttribute(sizes, 1));
    buffer.computeBoundingSphere();
    return buffer;
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2) },
      // Calibrated against the hero camera at [0, 0, 3.35]: an average point
      // lands at roughly 2 device pixels.
      uSizeScale: { value: 4 },
      uMaxPointSize: { value: 6 },
      uColor: { value: SCENE.amberBright },
      uOpacity: { value: 0.5 },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={landPointVertex}
        fragmentShader={landPointFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
