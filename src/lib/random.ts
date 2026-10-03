/**
 * Deterministic pseudo-randomness.
 *
 * The globe scatters points, stars and twinkle seeds. Deriving them from
 * `Math.random` would make every render produce a different scene, which the
 * React purity rules correctly flag — and it would also make the globe flicker
 * to a new arrangement on each hot reload. A fixed seed keeps the scene stable
 * for every visitor while still looking randomly distributed.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    // mulberry32 — small, fast, and good enough for visual scatter.
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
