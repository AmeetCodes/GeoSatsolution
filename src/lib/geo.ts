/**
 * Decoders that turn the compact generated land payloads into GPU-ready
 * buffers. Everything here runs in the browser, so it is imported only by
 * the lazily-loaded globe chunk and stays out of the initial bundle.
 *
 * Source data: Natural Earth (public domain) via world-atlas, quantised to
 * Int16 — see scripts/generate-coastlines.mjs.
 */
import {
  DataTexture,
  LinearFilter,
  RedFormat,
  RepeatWrapping,
  ClampToEdgeWrapping,
  UnsignedByteType,
} from "three";
import { LAND_ARCS_B64 } from "@/lib/data/land";
import { MASK_BASE64, MASK_HEIGHT, MASK_WIDTH } from "@/lib/data/landMask";
import { createRandom } from "@/lib/random";

const LON_SCALE = 32767 / 180;
const LAT_SCALE = 32767 / 90;

export type Ring = { lons: Float32Array; lats: Float32Array; count: number };

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const cached = new Map<string, unknown>();

function once<T>(key: string, build: () => T): T {
  if (!cached.has(key)) cached.set(key, build());
  return cached.get(key) as T;
}

/**
 * Land rings in degrees. Rings whose extent falls below `minSpan` are
 * dropped — at globe scale those are sub-pixel specks that would otherwise
 * cost thousands of line segments for no visible detail.
 */
export function getLandRings(minSpan = 0.35): Ring[] {
  return once(`rings:${minSpan}`, () => {
    const raw = new Int16Array(base64ToBytes(LAND_ARCS_B64).buffer);
    const rings: Ring[] = [];
    let cursor = 0;

    while (cursor < raw.length) {
      const count = raw[cursor];
      cursor += 1;
      const lons = new Float32Array(count);
      const lats = new Float32Array(count);

      let minLon = Infinity;
      let maxLon = -Infinity;
      let minLat = Infinity;
      let maxLat = -Infinity;

      for (let i = 0; i < count; i += 1) {
        const lon = raw[cursor] / LON_SCALE;
        const lat = raw[cursor + 1] / LAT_SCALE;
        cursor += 2;
        lons[i] = lon;
        lats[i] = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }

      if (maxLon - minLon < minSpan && maxLat - minLat < minSpan) continue;
      rings.push({ lons, lats, count });
    }

    return rings;
  });
}

/** Equirectangular lon/lat (degrees) to a point on a sphere. Y is up. */
export function lonLatToVector3(
  lon: number,
  lat: number,
  radius: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

/**
 * Coastlines as a flat line-segment list, closed at each ring boundary so
 * no ring needs a duplicate vertex.
 */
export function getCoastlineSegments(radius: number): Float32Array {
  return once(`coast:${radius}`, () => {
    const rings = getLandRings();
    let segments = 0;
    for (const ring of rings) segments += ring.count;

    const positions = new Float32Array(segments * 2 * 3);
    let cursor = 0;

    for (const ring of rings) {
      for (let i = 0; i < ring.count; i += 1) {
        const next = (i + 1) % ring.count;
        const [ax, ay, az] = lonLatToVector3(ring.lons[i], ring.lats[i], radius);
        const [bx, by, bz] = lonLatToVector3(ring.lons[next], ring.lats[next], radius);

        positions[cursor] = ax;
        positions[cursor + 1] = ay;
        positions[cursor + 2] = az;
        positions[cursor + 3] = bx;
        positions[cursor + 4] = by;
        positions[cursor + 5] = bz;
        cursor += 6;
      }
    }

    return positions;
  });
}

/** Land occupancy grid as a single-channel texture for the globe shader. */
export function getLandMaskTexture(): DataTexture {
  return once("mask", () => {
    const texture = new DataTexture(
      base64ToBytes(MASK_BASE64),
      MASK_WIDTH,
      MASK_HEIGHT,
      RedFormat,
      UnsignedByteType,
    );

    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  });
}

/**
 * Uniformly scattered points over land, derived from the mask grid. Used for
 * the globe's point-cloud shell — the visual cue that says "survey data".
 */
export function getLandPoints(radius: number, count: number): Float32Array {
  return once(`points:${radius}:${count}`, () => {
    const random = createRandom(0xc0a5);
    const mask = base64ToBytes(MASK_BASE64);
    const landCells: number[] = [];

    for (let row = 0; row < MASK_HEIGHT; row += 1) {
      for (let col = 0; col < MASK_WIDTH; col += 1) {
        if (mask[row * MASK_WIDTH + col] > 127) landCells.push(row * MASK_WIDTH + col);
      }
    }

    const points = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const cell = landCells[Math.floor(random() * landCells.length)];
      const row = Math.floor(cell / MASK_WIDTH);
      const col = cell % MASK_WIDTH;

      // Jitter within the cell so the scatter reads as a grid, not noise.
      const lon = -180 + ((col + random()) * 360) / MASK_WIDTH;
      const lat = 90 - ((row + random()) * 180) / MASK_HEIGHT;
      const [x, y, z] = lonLatToVector3(lon, lat, radius);
      points[i * 3] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    }

    return points;
  });
}
