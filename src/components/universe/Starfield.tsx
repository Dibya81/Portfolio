"use client";

import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from "three";

/** Deterministic PRNG so the sky is identical on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One static Points draw call along the whole camera path. No per-frame work. */
export function Starfield({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const rand = mulberry32(117);
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const tint = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 90;
      pos[i * 3 + 1] = (rand() - 0.65) * 60;
      pos[i * 3 + 2] = 25 - rand() * 200;
      size[i] = 0.6 + rand() * rand() * 2.6;
      const warm = rand() < 0.18;
      tint[i * 3] = warm ? 1.0 : 0.78;
      tint[i * 3 + 1] = warm ? 0.7 : 0.84;
      tint[i * 3 + 2] = warm ? 0.5 : 1.0;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSize", new BufferAttribute(size, 1));
    g.setAttribute("aTint", new BufferAttribute(tint, 3));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uDpr: { value: dpr } },
        vertexShader: /* glsl */ `
          attribute float aSize;
          attribute vec3 aTint;
          uniform float uDpr;
          varying vec3 vTint;
          varying float vAlpha;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            float depth = -mv.z;
            gl_PointSize = aSize * uDpr * (34.0 / max(depth, 1.0));
            vAlpha = clamp(1.0 - depth / 110.0, 0.06, 0.95);
            vTint = aTint;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vTint;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.05, d) * vAlpha;
            gl_FragColor = vec4(vTint, a);
          }
        `,
      }),
    [dpr],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
