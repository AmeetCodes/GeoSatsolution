import { GRATICULE_MAJOR_PATH, GRATICULE_MINOR_PATH } from "@/lib/data/globeGraticule";
import { LAND_OUTLINE_PATH } from "@/lib/data/landOutline";

/**
 * The hero globe, drawn as vector SVG on the server.
 *
 * This is what the visitor sees in the first paint — a real, correctly lit
 * Earth at the exact orientation the WebGL scene opens on, inlined into the
 * HTML with no JavaScript. When WebGL comes up it crossfades in over the top;
 * if WebGL is unavailable or motion is suppressed, the plate simply stays.
 *
 * Both paths are pre-projected at build time by scripts/generate-coastlines.mjs,
 * so nothing here runs a projection at request time. They are decoded to whole
 * viewBox units — sub-pixel at any realistic size, and about a third the
 * payload of full precision.
 */

/** 24 bezel ticks, every 90th degree drawn long. */
const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

export function GlobePlate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      role="img"
      aria-label="Wireframe globe centred on Africa and Europe, with a 15 degree graticule"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="plate-ocean" cx="29%" cy="33%" r="78%">
          <stop offset="0%" stopColor="#123f61" />
          <stop offset="34%" stopColor="#0b2a44" />
          <stop offset="72%" stopColor="#05121f" />
          <stop offset="100%" stopColor="#030a12" />
        </radialGradient>

        <linearGradient id="plate-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb45c" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#e0924a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8a5a2c" stopOpacity="0.12" />
        </linearGradient>

        <radialGradient id="plate-halo" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#3ce3d6" stopOpacity="0" />
          <stop offset="88%" stopColor="#3ce3d6" stopOpacity="0.1" />
          <stop offset="95%" stopColor="#7cf5ea" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3ce3d6" stopOpacity="0" />
        </radialGradient>

        <clipPath id="plate-limb">
          <circle cx="500" cy="500" r="500" />
        </clipPath>

        {/*
          The land outline is by far the largest string on the page, and it is
          drawn twice — once filled, once stroked. Declaring it once here and
          referencing it with <use> halves the document instead of shipping
          16 KB of identical path data.
        */}
        <path id="plate-land-shape" d={LAND_OUTLINE_PATH} />
      </defs>

      {/* Atmospheric bleed outside the limb. */}
      <circle cx="500" cy="500" r="560" fill="url(#plate-halo)" />

      <g clipPath="url(#plate-limb)">
        <circle cx="500" cy="500" r="500" fill="url(#plate-ocean)" />

        {/* 15° reference frame, then the emphasised equator and prime meridian. */}
        <path d={GRATICULE_MINOR_PATH} fill="none" stroke="#3ce3d6" strokeOpacity="0.1" strokeWidth="1" />
        <path d={GRATICULE_MAJOR_PATH} fill="none" stroke="#3ce3d6" strokeOpacity="0.2" strokeWidth="1" />

        {/* Land mass, pre-projected and horizon-clipped at build time. */}
        <use href="#plate-land-shape" fill="url(#plate-land)" />
        <use
          href="#plate-land-shape"
          fill="none"
          stroke="#7cf5ea"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </g>

      {/* Bezel: the instrument the globe is read against. */}
      <circle cx="500" cy="500" r="500" fill="none" stroke="#3ce3d6" strokeOpacity="0.32" strokeWidth="1.25" />
      <circle cx="500" cy="500" r="466" fill="none" stroke="#3ce3d6" strokeOpacity="0.1" strokeWidth="1" />

      {TICKS.map((angle) => {
        const long = angle % 90 === 0;
        const inner = long ? 508 : 514;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return (
          <line
            key={angle}
            x1={500 + cos * inner}
            y1={500 + sin * inner}
            x2={500 + cos * 524}
            y2={500 + sin * 524}
            stroke="#3ce3d6"
            strokeOpacity={long ? 0.55 : 0.28}
            strokeWidth={long ? 1.6 : 1}
          />
        );
      })}
    </svg>
  );
}
