import { Color } from "three";

/**
 * Scene palette. Kept as a single module so the 3D layer and the DOM layer
 * cannot drift apart — the same hues appear on the globe and in the CSS
 * design tokens.
 */
export const SCENE = {
  oceanDeep: new Color("#05121f"),
  oceanShallow: new Color("#0d3350"),
  land: new Color("#ffb45c"),
  aqua: new Color("#3ce3d6"),
  aquaBright: new Color("#7cf5ea"),
  amberBright: new Color("#ffd39b"),
  star: new Color("#cfe4f5"),
} as const;

/**
 * Key light direction, in VIEW space — it points from the globe toward the
 * light. x/y are screen-relative, so the negative x and positive y put the
 * source up and to the left.
 *
 * The z is deliberately short of 1. A light aimed straight down the camera
 * axis would leave the visible disc uniformly lit with no terminator, which
 * reads flat. Pulling it back to 0.77 puts a shaded limb on the lower right
 * and matches the upper-left hotspot of the GlobePlate's ocean gradient.
 *
 * The shaders therefore dot this against the view-space normal, never the
 * object-space one. That keeps the lit hemisphere pinned to the screen, which
 * is what lets the WebGL globe match the server-rendered GlobePlate exactly
 * at the moment they crossfade.
 */
export const SUN_DIRECTION = { x: -0.52, y: 0.36, z: 0.77 } as const;
