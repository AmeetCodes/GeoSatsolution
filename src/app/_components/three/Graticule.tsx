"use client";

import { useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";
import { SCENE } from "./palette";

const DEG = Math.PI / 180;
const GLOBE_RADIUS = 1.0012;

/**
 * A 15° graticule — the reference frame every survey measurement is taken
 * against. Drawn as real geometry rather than in the surface shader so the
 * lines stay exactly one pixel wide at any zoom.
 */
export function Graticule() {
  const geometry = useMemo(() => {
    const positions: number[] = [];

    const push = (lon: number, lat: number, radius: number) => {
      const phi = (90 - lat) * DEG;
      const theta = (lon + 180) * DEG;
      positions.push(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    };

    // Meridians every 15°.
    for (let lon = -180; lon < 180; lon += 15) {
      for (let lat = -90; lat < 90; lat += 3) {
        push(lon, lat, GLOBE_RADIUS);
        push(lon, lat + 3, GLOBE_RADIUS);
      }
    }

    // Parallels every 15°, plus the equator drawn separately below.
    for (let lat = -75; lat <= 75; lat += 15) {
      if (lat === 0) continue;
      for (let lon = -180; lon < 180; lon += 3) {
        push(lon, lat, GLOBE_RADIUS);
        push(lon + 3, lat, GLOBE_RADIUS);
      }
    }

    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    buffer.computeBoundingSphere();
    return buffer;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} renderOrder={1}>
      <lineBasicMaterial color={SCENE.aqua} transparent opacity={0.11} depthWrite={false} />
    </lineSegments>
  );
}
