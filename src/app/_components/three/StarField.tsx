"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry } from "three";
import { starFragment, starVertex } from "./globeShaders";
import { SCENE } from "./palette";
import { createRandom } from "@/lib/random";

type StarFieldProps = {
  radius?: number;
  count?: number;
  opacity?: number;
};

/**
 * Ambient depth behind the globe. Purely atmospheric — it exists so the hero
 * does not read as a flat disc floating on a flat background.
 */
export function StarField({ radius = 14, count = 900, opacity = 0.55 }: StarFieldProps) {
  const geometry = useMemo(() => {
    const random = createRandom(0x5eed);

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Even distribution on a shell, biased slightly away from the poles so
      // the visible band behind the globe stays evenly populated.
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u) * radius;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = u * radius * 0.6;
      positions[i * 3 + 2] = r * Math.sin(theta);
      sizes[i] = 0.7 + random() * 1.9;
    }

    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new BufferAttribute(positions, 3));
    buffer.setAttribute("aSize", new BufferAttribute(sizes, 1));
    buffer.computeBoundingSphere();
    return buffer;
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({
      uColor: { value: SCENE.star },
      uOpacity: { value: opacity },
      uPixelRatio: {
        value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2),
      },
    }),
    [opacity],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry} renderOrder={-1}>
      <shaderMaterial
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
