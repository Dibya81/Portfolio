"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Texture, TextureLoader, Vector2 } from "three";
import { getExperience } from "@/lib/experience-store";
import { getRevealSlots, setRevealInvalidator, subscribeRevealSlots, type RevealSlotState } from "@/lib/reveal-registry";
import { REVEAL_DEFAULTS, revealFragmentShader, revealVertexShader } from "@/components/effects/revealShaders";

interface Entry {
  slot: RevealSlotState;
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  current: { x: number; y: number };
  hover: number;
  requested: boolean;
  ready: boolean;
  textures: Texture[];
}

/**
 * Screen-space overlay pass that draws the ported reveal shader behind each
 * DOM reveal slot — inside the one shared canvas (no second WebGL context).
 * Takes over rendering (useFrame priority 1): main scene first, overlay second.
 */
export function RevealLayer() {
  const invalidate = useThree((s) => s.invalidate);
  const overlayRef = useRef<Scene>(new Scene());
  const orthoRef = useRef<OrthographicCamera>(new OrthographicCamera(0, 1, 0, -1, -10, 10));
  const geometry = useMemo(() => new PlaneGeometry(1, 1), []);
  const loader = useMemo(() => new TextureLoader(), []);
  const entries = useRef(new Map<string, Entry>());

  useEffect(() => {
    setRevealInvalidator(() => invalidate());
    return () => setRevealInvalidator(null);
  }, [invalidate]);

  useEffect(() => {
    const map = entries.current;
    const overlay = overlayRef.current;
    const sync = () => {
      const slots = getRevealSlots();
      const ids = new Set(slots.map((s) => s.id));
      for (const [id, e] of map) {
        if (ids.has(id)) continue;
        overlay.remove(e.mesh);
        e.mesh.material.dispose();
        e.textures.forEach((t) => t.dispose());
        map.delete(id);
      }
      for (const slot of slots) {
        if (map.has(slot.id)) continue;
        const material = new ShaderMaterial({
          vertexShader: revealVertexShader,
          fragmentShader: revealFragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            uTexture1: { value: null },
            uTexture2: { value: null },
            uMouse: { value: new Vector2(0.5, 0.5) },
            uHovered: { value: 0 },
            uRadius: { value: REVEAL_DEFAULTS.radius },
            uSoftness: { value: REVEAL_DEFAULTS.softness },
            uScale: { value: REVEAL_DEFAULTS.scale },
            uRipple: { value: 1 },
            uCorner: { value: 14 },
            uResolution: { value: new Vector2(1, 1) },
            uImageResolution: { value: new Vector2(1600, 1000) },
          },
        });
        const mesh = new Mesh(geometry, material);
        mesh.visible = false;
        mesh.frustumCulled = false;
        overlay.add(mesh);
        map.set(slot.id, { slot, mesh, current: { x: 0.5, y: 0.5 }, hover: 0, requested: false, ready: false, textures: [] });
      }
      invalidate();
    };
    sync();
    const unsubscribe = subscribeRevealSlots(sync);
    return () => {
      unsubscribe();
      for (const e of map.values()) {
        overlay.remove(e.mesh);
        e.mesh.material.dispose();
        e.textures.forEach((t) => t.dispose());
      }
      map.clear();
    };
  }, [geometry, invalidate]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const load = (e: Entry) => {
    e.requested = true;
    Promise.all([loader.loadAsync(e.slot.product), loader.loadAsync(e.slot.architecture)])
      .then(([t1, t2]) => {
        for (const t of [t1, t2]) {
          t.generateMipmaps = false;
          t.needsUpdate = true;
        }
        const u = e.mesh.material.uniforms;
        u.uTexture1.value = t1;
        u.uTexture2.value = t2;
        const img = t1.image as { width?: number; height?: number } | undefined;
        if (img?.width && img?.height) (u.uImageResolution.value as Vector2).set(img.width, img.height);
        e.textures = [t1, t2];
        e.ready = true;
        invalidate();
      })
      .catch(() => {
        e.requested = false;
      });
  };

  useFrame((state, rawDelta) => {
    const { gl } = state;
    const overlay = overlayRef.current;
    const ortho = orthoRef.current;

    // 1. Main universe.
    gl.autoClear = true;
    gl.render(state.scene, state.camera);

    // 2. Reveal quads in CSS-pixel screen space.
    const { width, height } = state.size;
    ortho.left = 0;
    ortho.right = width;
    ortho.top = 0;
    ortho.bottom = -height;
    ortho.updateProjectionMatrix();

    const reduced = getExperience().reducedMotion;
    const delta = Math.min(rawDelta, 0.1);
    let animating = false;
    let drawn = false;

    for (const e of entries.current.values()) {
      const r = e.slot.el.getBoundingClientRect();
      const onScreen = r.width > 0 && r.bottom > 0 && r.top < height;
      if (!onScreen) {
        e.mesh.visible = false;
        continue;
      }
      if (!e.requested) load(e);
      if (!e.ready) {
        e.mesh.visible = false;
        continue;
      }

      const u = e.mesh.material.uniforms;
      e.mesh.visible = true;
      e.mesh.position.set(r.left + r.width / 2, -(r.top + r.height / 2), 0);
      e.mesh.scale.set(r.width, r.height, 1);
      (u.uResolution.value as Vector2).set(r.width, r.height);

      const tx = e.slot.target.x;
      const ty = e.slot.target.y;
      if (reduced) {
        e.current.x = tx;
        e.current.y = ty;
        e.hover = e.slot.hoverTarget;
      } else {
        e.current.x += (tx - e.current.x) * REVEAL_DEFAULTS.pointerLerp;
        e.current.y += (ty - e.current.y) * REVEAL_DEFAULTS.pointerLerp;
        e.hover += (e.slot.hoverTarget - e.hover) * (1 - Math.exp(-REVEAL_DEFAULTS.hoverLambda * delta));
      }
      (u.uMouse.value as Vector2).set(e.current.x, e.current.y);
      u.uHovered.value = e.hover;
      u.uRipple.value = reduced ? 0 : 1;
      u.uScale.value = reduced ? 0 : REVEAL_DEFAULTS.scale;

      if (Math.abs(tx - e.current.x) + Math.abs(ty - e.current.y) > 0.0005 || Math.abs(e.slot.hoverTarget - e.hover) > 0.002) animating = true;
      drawn = true;
    }

    if (drawn) {
      gl.autoClear = false;
      gl.clearDepth();
      gl.render(overlay, ortho);
      gl.autoClear = true;
    }
    if (animating && !document.hidden) state.invalidate();
  }, 1);

  return null;
}
