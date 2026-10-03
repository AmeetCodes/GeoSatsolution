"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { getLandMaskTexture } from "@/lib/geo";
import { SCENE, SUN_DIRECTION } from "./palette";
import { atmosphereFragment, atmosphereVertex, globeFragment, globeVertex } from "./globeShaders";

type GlobeSurfaceProps = {
  /** Reduced on compact viewports and when motion is suppressed. */
  detail?: "high" | "low";
  scanStrength?: number;
};

/**
 * The globe body: an ocean sphere whose continents are lifted from the
 * generated land mask, wrapped in a back-faced atmosphere shell.
 */
export function GlobeSurface({ detail = "high", scanStrength = 0.22 }: GlobeSurfaceProps) {
  const surfaceMaterial = useRef<ShaderMaterial>(null);
  const atmosphereMaterial = useRef<ShaderMaterial>(null);

  const surfaceGeometry = useMemo(
    () => new SphereGeometry(1, detail === "high" ? 96 : 48, detail === "high" ? 64 : 32),
    [detail],
  );

  const atmosphereGeometry = useMemo(
    () => new SphereGeometry(1.16, 48, 32),
    [],
  );

  const sunDirection = useMemo(
    () => new Vector3(SUN_DIRECTION.x, SUN_DIRECTION.y, SUN_DIRECTION.z),
    [],
  );

  const surfaceUniforms = useMemo(
    () => ({
      uMask: { value: getLandMaskTexture() },
      uTime: { value: 0 },
      uSunDirection: { value: sunDirection },
      uOceanDeep: { value: SCENE.oceanDeep },
      uOceanShallow: { value: SCENE.oceanShallow },
      uLandColor: { value: SCENE.land },
      uRimColor: { value: SCENE.aqua },
      uScanStrength: { value: scanStrength },
    }),
    [scanStrength, sunDirection],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uGlowColor: { value: SCENE.aqua },
      uSunDirection: { value: sunDirection },
      uIntensity: { value: 1.15 },
    }),
    [sunDirection],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (surfaceMaterial.current) surfaceMaterial.current.uniforms.uTime.value = time;
    if (atmosphereMaterial.current) {
      atmosphereMaterial.current.uniforms.uIntensity.value = 1.05 + Math.sin(time * 0.7) * 0.1;
    }
  });

  return (
    <group>
      <mesh geometry={surfaceGeometry}>
        <shaderMaterial
          ref={surfaceMaterial}
          vertexShader={globeVertex}
          fragmentShader={globeFragment}
          uniforms={surfaceUniforms}
        />
      </mesh>

      <mesh geometry={atmosphereGeometry}>
        <shaderMaterial
          ref={atmosphereMaterial}
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmosphereUniforms}
          side={BackSide}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
