/**
 * GLSL for the hero globe. Colours are authored in sRGB and converted to the
 * linear working space by three's ColorManagement before they reach a
 * uniform; `colorspace_fragment` converts the result back on the way out.
 */

export const globeVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vViewNormal;

  void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const globeFragment = /* glsl */ `
  uniform sampler2D uMask;
  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uOceanDeep;
  uniform vec3 uOceanShallow;
  uniform vec3 uLandColor;
  uniform vec3 uRimColor;
  uniform float uScanStrength;

  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vViewNormal;

  void main() {
    vec3 viewNormal = normalize(vViewNormal);
    vec3 viewDir = normalize(vViewPosition);

    float fresnel = pow(1.0 - max(dot(viewNormal, viewDir), 0.0), 3.0);

    // The key light is authored in view space, so it must be dotted with the
    // view-space normal. Using the object normal here would put the light
    // somewhere else entirely once the group is rotated to frame the Atlantic.
    float lambert = dot(viewNormal, normalize(uSunDirection));

    // The visible disc only spans roughly lambert 0..0.77, so the ramp is
    // stretched to match. Anything tighter saturates and the sphere goes flat.
    float daylight = smoothstep(-0.25, 0.95, lambert);

    // Ocean: a cold depth gradient that lifts toward the terminator.
    vec3 color = mix(uOceanDeep, uOceanShallow, daylight * 0.9);

    // Polar ice sheen keeps the poles from reading as dead space.
    float polar = smoothstep(0.72, 0.98, abs(vUv.y - 0.5) * 2.0);
    color = mix(color, uOceanShallow * 1.25 + vec3(0.02), polar * 0.35);

    // Land mass, lifted straight out of the generated occupancy mask.
    float mask = texture2D(uMask, vUv).r;
    float land = smoothstep(0.2, 0.6, mask);
    vec3 landShade = mix(uLandColor * 0.22, uLandColor * 1.05, daylight * 0.86 + 0.14);
    color = mix(color, landShade, land * 0.92);

    // A brighter lip right on the shoreline.
    float shore = smoothstep(0.1, 0.26, mask) * (1.0 - smoothstep(0.28, 0.5, mask));
    color += uRimColor * shore * 0.42;

    // Acquisition sweep: a soft band travelling pole to pole.
    float sweep = fract(uTime * 0.055);
    float delta = abs(vUv.y - sweep);
    delta = min(delta, 1.0 - delta);
    float band = smoothstep(0.035, 0.0, delta);
    color += uRimColor * band * uScanStrength;

    // Atmosphere rim, strongest on the lit limb.
    color += uRimColor * fresnel * (0.28 + daylight * 0.55);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 uGlowColor;
  uniform vec3 uSunDirection;
  uniform float uIntensity;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float intensity = pow(max(0.0, 1.0 - dot(normalize(vViewNormal), viewDir)), 3.4);

    // Forward scattering: the limb glows hardest where it faces the sun.
    float sunFacing = max(dot(normalize(vViewNormal), normalize(uSunDirection)), 0.0);

    float alpha = intensity * uIntensity * (0.45 + sunFacing * 0.9);
    gl_FragColor = vec4(uGlowColor * alpha, alpha);
    #include <colorspace_fragment>
  }
`;

export const landPointVertex = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vTwinkle;

  /**
   * uSizeScale is a perspective term, not a fudge factor: it is the world-space
   * height of the point sprite at unit depth. Survey points are meant to read
   * as 1-2px marks, so the constant stays small and the result is clamped —
   * without the clamp a near camera turns every point into a disc and
   * additive blending saturates the whole globe to white.
   */
  uniform float uSizeScale;
  uniform float uMaxPointSize;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831853);

    vTwinkle = twinkle;
    gl_PointSize = min(
      aSize * uPixelRatio * (uSizeScale / -mvPosition.z) * (0.75 + twinkle * 0.35),
      uMaxPointSize
    );
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const landPointFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vTwinkle;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if (distanceToCenter > 0.5) discard;

    float falloff = smoothstep(0.5, 0.05, distanceToCenter);
    vec3 color = mix(uColor, vec3(1.0), pow(falloff, 3.0) * 0.55);
    float alpha = falloff * uOpacity * (0.45 + vTwinkle * 0.55);

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export const starVertex = /* glsl */ `
  attribute float aSize;

  uniform float uPixelRatio;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if (distanceToCenter > 0.5) discard;

    float falloff = smoothstep(0.5, 0.0, distanceToCenter);
    gl_FragColor = vec4(uColor, falloff * uOpacity);
    #include <colorspace_fragment>
  }
`;
