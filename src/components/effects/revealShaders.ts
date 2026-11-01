/**
 * PRESERVED EFFECT #2 — ported from spider-porfolio-main/src/components/HeroShaders.js.
 *
 * Same maths as the original: cover-fit UVs, aspect-corrected circular mask
 * eased by uHovered (radius 0.42, softness 0.18), edge ripple on the revealed
 * layer, cool glow near the cursor. Changes for the shared canvas:
 *   - the hover zoom is applied to UVs instead of geometry, so it stays inside
 *     the slot instead of overflowing its DOM box (same visual result);
 *   - the mask is multiplied by uHovered so nothing shows through at rest
 *     (the original leaked a 50% blend under the resting cursor position);
 *   - rounded-corner alpha so the quad matches the slot's border radius;
 *   - uRipple lets reduced-motion users get the reveal without distortion.
 */

export const revealVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const revealFragmentShader = /* glsl */ `
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec2 uMouse;
uniform float uHovered;
uniform float uRadius;
uniform float uSoftness;
uniform float uScale;
uniform float uRipple;
uniform float uCorner;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

varying vec2 vUv;

float roundedBox(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );

  vec2 zoomed = (vUv - 0.5) / (1.0 + uHovered * uScale) + 0.5;
  vec2 uvCover = (zoomed - 0.5) * ratio + 0.5;

  vec4 color1 = texture2D(uTexture1, uvCover);

  vec2 screenRatio = vec2(uResolution.x / uResolution.y, 1.0);
  if (uResolution.y > uResolution.x) {
    screenRatio = vec2(1.0, uResolution.y / uResolution.x);
  }
  float dist = distance(vUv * screenRatio, uMouse * screenRatio);

  float currentRadius = uRadius * uHovered;
  float mask = (1.0 - smoothstep(currentRadius - uSoftness, currentRadius + uSoftness, dist)) * uHovered;

  vec2 distortedUv = uvCover + (mask * (1.0 - mask)) * 0.05 * uHovered * uRipple;
  vec4 color2 = texture2D(uTexture2, distortedUv);

  vec4 finalColor = mix(color1, color2, mask);

  float glow = 1.0 - smoothstep(0.0, currentRadius * 1.5, dist);
  finalColor.rgb += vec3(0.05, 0.08, 0.1) * glow * uHovered;

  vec2 px = (vUv - 0.5) * uResolution;
  float d = roundedBox(px, uResolution * 0.5, uCorner);
  float alpha = 1.0 - smoothstep(-1.0, 0.5, d);

  gl_FragColor = vec4(finalColor.rgb, alpha);
}
`;

/** Uniform defaults from the original effect. */
export const REVEAL_DEFAULTS = {
  radius: 0.42,
  softness: 0.18,
  scale: 0.05,
  /** Original lerp factor for the cursor per frame. */
  pointerLerp: 0.1,
  /** Approximates GSAP power3.out over 1.2s with exponential damping. */
  hoverLambda: 3.4,
} as const;
