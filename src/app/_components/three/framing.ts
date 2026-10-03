/**
 * Framing for the hero globe, shared by the WebGL scene, the statically
 * rendered SVG plate and the pre-projected outline in `lib/data/landOutline.ts`.
 * If any of these change, re-run `npm run gen:land` so the outline stays
 * aligned with the first painted WebGL frame.
 */

/** Longitude at the centre of the default view — Africa, Europe, the Atlantic. */
export const GLOBE_START_LON = 20;

/** Radians of Y rotation that brings `GLOBE_START_LON` to face the camera. */
export const GLOBE_START_ROT_Y = -((GLOBE_START_LON + 90) * Math.PI) / 180;

/** Slight tilt so the north pole leans toward the viewer. */
export const GLOBE_TILT_X = 0.22;

/** Radians per second. One revolution takes roughly five minutes. */
export const GLOBE_SPIN = 0.021;

/** Pointer parallax authority, in radians. */
export const GLOBE_PARALLAX_YAW = 0.34;
export const GLOBE_PARALLAX_PITCH = 0.2;

/** Radius of the limb in the plate's 1000x1000 viewBox. */
export const PLATE_VIEWBOX = 1000;
export const PLATE_RADIUS = 500;
export const PLATE_CENTER = PLATE_VIEWBOX / 2;
