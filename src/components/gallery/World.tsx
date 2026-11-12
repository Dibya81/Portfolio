"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Character, type Rig } from "./Character";
import { drawFloor, drawIntroWall, drawMorePoster, drawPoster, drawShadow, drawFootprint, toTexture } from "./posters";
import { EMBER, HALL, START, WALK, readMove, type GalleryItem, type Palette, type Slot } from "./shared";
import { sfx } from "@/lib/sound";

export interface WorldProps {
  items: GalleryItem[];
  slots: Slot[];
  moreCount: number;
  mode: "full" | "preview";
  palette: Palette;
  /** Movement input is read only while this is true. */
  enabled: RefObject<boolean>;
  /** Set to a slot index to move the character there on the next frame. */
  teleportRef?: RefObject<number | null>;
  active: boolean;
  onSpot?: (slot: number | null) => void;
  onReady?: (posterUrls: string[]) => void;
  onCharacterClick?: () => void;
  /** DOM element kept floating above the character's head (preview "click me"). */
  labelRef?: RefObject<HTMLDivElement | null>;
}

const MAX_SPEED = 3.4; // m/s
const PRINTS = 80;
const PRINT_LIFE = 7; // s
const STRIDE = 6.2; // walk-cycle radians per metre: one step every π/STRIDE ≈ 0.5 m

/** Positions a DOM element in canvas pixels (kept outside components: it mutates a DOM node). */
function placeLabel(el: HTMLElement, x: number, y: number, show: boolean) {
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
  el.style.opacity = show ? "1" : "0";
}

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const angleDiff = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

// ---------------- room ----------------
function Room({ palette, slots, posters, moreTex, count }: { palette: Palette; slots: Slot[]; posters: THREE.Texture[]; moreTex: THREE.Texture | null; count: number }) {
  const len = HALL.zFront - HALL.zBack;
  const midZ = (HALL.zFront + HALL.zBack) / 2;
  const floorTex = useMemo(() => toTexture(drawFloor(palette), [HALL.halfW / 2.5, len / 2.5]), [palette, len]);
  const intro = useMemo(() => toTexture(drawIntroWall(palette, count)), [palette, count]);
  useEffect(() => () => floorTex.dispose(), [floorTex]);
  useEffect(() => () => intro.dispose(), [intro]);

  const posts = useMemo(() => {
    const out: number[] = [];
    for (let z = WALK.maxZ + 0.2; z > WALK.minZ - 0.6; z -= 2.4) out.push(z);
    return out;
  }, []);
  const railX = HALL.halfW - 0.75;
  const railBackZ = WALK.minZ - 0.55;
  const railLen = WALK.maxZ + 0.2 - railBackZ;

  return (
    <group>
      {/* floor + ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, midZ]}>
        <planeGeometry args={[HALL.halfW * 2, len]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL.height, midZ]}>
        <planeGeometry args={[HALL.halfW * 2, len]} />
        <meshStandardMaterial color={palette.ceiling} roughness={1} />
      </mesh>
      {/* skylights */}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <group key={k} position={[0, HALL.height - 0.01, -2.5 - k * 5]}>
          <mesh position={[0, -0.04, 0]}>
            <boxGeometry args={[2.8, 0.08, 1.5]} />
            <meshStandardMaterial color={palette.rail} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[2.6, 0.1, 1.3]} />
            <meshBasicMaterial color={palette.skylight} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* walls */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * HALL.halfW, HALL.height / 2, midZ]} rotation={[0, -s * (Math.PI / 2), 0]}>
          <planeGeometry args={[len, HALL.height]} />
          <meshStandardMaterial color={palette.wall} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, HALL.height / 2, HALL.zBack]}>
        <planeGeometry args={[HALL.halfW * 2, HALL.height]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
      <mesh position={[0, HALL.height / 2, HALL.zFront]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[HALL.halfW * 2, HALL.height]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
      {/* skirting */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * (HALL.halfW - 0.02), 0.06, midZ]}>
          <boxGeometry args={[0.04, 0.12, len]} />
          <meshStandardMaterial color={palette.rail} />
        </mesh>
      ))}
      {/* intro text on the back wall */}
      <mesh position={[0, 3.1, HALL.zBack + 0.02]}>
        <planeGeometry args={[7.2, 3.6]} />
        <meshBasicMaterial map={intro} transparent toneMapped={false} />
      </mesh>

      {/* rails */}
      {([-1, 1] as const).map((s) => (
        <group key={s}>
          <mesh position={[s * railX, 0.95, railBackZ + railLen / 2]}>
            <boxGeometry args={[0.06, 0.06, railLen]} />
            <meshStandardMaterial color={palette.rail} roughness={0.5} />
          </mesh>
          {posts.map((z) => (
            <mesh key={z} position={[s * railX, 0.475, z]}>
              <boxGeometry args={[0.05, 0.95, 0.05]} />
              <meshStandardMaterial color={palette.rail} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.95, railBackZ]}>
        <boxGeometry args={[railX * 2, 0.06, 0.06]} />
        <meshStandardMaterial color={palette.rail} roughness={0.5} />
      </mesh>
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x, 0.475, railBackZ]}>
          <boxGeometry args={[0.05, 0.95, 0.05]} />
          <meshStandardMaterial color={palette.rail} roughness={0.5} />
        </mesh>
      ))}

      {/* frames */}
      {slots.map((sl, i) => {
        const tex = sl.kind === "more" ? moreTex : posters[sl.item];
        return (
          <group key={i} position={[sl.side * (HALL.halfW - 0.07), 2.75, sl.z]} rotation={[0, sl.side < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[2.66, 3.38, 0.09]} />
              <meshStandardMaterial color={palette.frame} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.047]}>
              <planeGeometry args={[2.42, 3.14]} />
              <meshStandardMaterial color={palette.mat} roughness={0.9} />
            </mesh>
            {tex ? (
              <mesh position={[0, 0, 0.05]}>
                <planeGeometry args={[2.02, 2.675]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

// ---------------- player: movement, walk cycle, footprints, camera ----------------
type PlayerProps = Pick<WorldProps, "slots" | "mode" | "palette" | "enabled" | "teleportRef" | "onSpot" | "onCharacterClick" | "labelRef">;

function Player({ slots, mode, palette, enabled, teleportRef, onSpot, onCharacterClick, labelRef }: PlayerProps) {
  const rig = useRef<Rig>({});
  const shadow = useRef<THREE.Mesh>(null);
  const prints = useRef<THREE.InstancedMesh>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const st = useRef({
    pos: new THREE.Vector3(START[0], 0, START[1]),
    vel: new THREE.Vector2(),
    yaw: Math.PI, // facing down the hall
    phase: 0,
    walk: 0,
    spot: null as number | null,
    look: new THREE.Vector3(0, 1.4, -6),
    camInit: false,
    printIdx: 0,
    births: new Float32Array(PRINTS).fill(-100),
    shown: new Uint8Array(PRINTS),
  });
  const shadowTex = useMemo(() => toTexture(drawShadow()), []);
  const printTex = useMemo(() => toTexture(drawFootprint()), []);
  const tmp = useMemo(
    () => ({
      cam: new THREE.Vector3(),
      look: new THREE.Vector3(),
      obj: new THREE.Object3D(),
      head: new THREE.Vector3(),
      c1: new THREE.Color(),
      c2: new THREE.Color(),
      c: new THREE.Color(),
    }),
    [],
  );
  const pal = useRef(palette);
  useEffect(() => {
    pal.current = palette;
  }, [palette]);

  // Hide every footprint until it is stepped.
  useEffect(() => {
    const m = prints.current;
    if (!m) return;
    const o = new THREE.Object3D();
    o.scale.setScalar(0);
    o.updateMatrix();
    const c = new THREE.Color("#888888");
    for (let i = 0; i < PRINTS; i++) {
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const t = state.clock.elapsedTime;
    const s = st.current;
    const r = rig.current;
    const P = pal.current;

    if (teleportRef && teleportRef.current != null) {
      const sl = slots[teleportRef.current];
      if (sl) {
        s.pos.set(sl.spot[0], 0, sl.spot[1]);
        s.vel.set(0, 0);
        s.yaw = sl.side < 0 ? -Math.PI / 2 : Math.PI / 2;
      }
      teleportRef.current = null;
    }

    // --- movement: eased velocity, clamped to the walkway ---
    const m = enabled.current ? readMove() : { x: 0, z: 0 };
    const k = 1 - Math.exp(-dt * 9);
    s.vel.x += (m.x * MAX_SPEED - s.vel.x) * k;
    s.vel.y += (m.z * MAX_SPEED - s.vel.y) * k;
    const wantX = s.pos.x + s.vel.x * dt;
    const wantZ = s.pos.z + s.vel.y * dt;
    s.pos.x = clamp(wantX, WALK.minX, WALK.maxX);
    s.pos.z = clamp(wantZ, WALK.minZ, WALK.maxZ);
    if (s.pos.x !== wantX) s.vel.x *= 0.5;
    if (s.pos.z !== wantZ) s.vel.y *= 0.5;
    const speed = Math.hypot(s.vel.x, s.vel.y);
    if (speed > 0.12) s.yaw += angleDiff(Math.atan2(s.vel.x, s.vel.y), s.yaw) * (1 - Math.exp(-dt * 12));

    // --- walk cycle: phase follows distance travelled, so feet don't skate ---
    const prev = s.phase;
    s.phase += speed * dt * STRIDE;
    s.walk += ((speed > 0.1 ? Math.min(1, speed / 2.2) : 0) - s.walk) * (1 - Math.exp(-dt * 10));
    const sw = Math.sin(s.phase) * s.walk;
    if (r.root) {
      r.root.position.set(s.pos.x, Math.abs(Math.cos(s.phase)) * 0.06 * s.walk, s.pos.z);
      r.root.rotation.y = s.yaw;
    }
    if (r.legL) r.legL.rotation.x = sw * 0.8;
    if (r.legR) r.legR.rotation.x = -sw * 0.8;
    if (r.armL) r.armL.rotation.x = -sw * 0.65;
    if (r.armR) r.armR.rotation.x = sw * 0.65;
    if (r.body) {
      r.body.rotation.x = 0.1 * s.walk;
      r.body.rotation.z = Math.sin(s.phase) * 0.04 * s.walk;
    }
    if (r.head) {
      r.head.position.y = 0.98 + Math.sin(t * 2.1) * 0.012 * (1 - s.walk);
      r.head.rotation.y = Math.sin(t * 0.7) * 0.18 * (1 - s.walk);
    }
    if (r.antenna) r.antenna.rotation.x = -s.walk * 0.5 + Math.sin(t * 3.2) * 0.08;
    if (shadow.current) {
      shadow.current.position.set(s.pos.x, 0.012, s.pos.z);
      shadow.current.scale.setScalar(1.05 - Math.abs(Math.cos(s.phase)) * 0.08 * s.walk);
    }

    // --- footprints: one per step, alternating feet, fading into the floor ---
    const pm = prints.current;
    if (pm) {
      if (Math.floor(prev / Math.PI) !== Math.floor(s.phase / Math.PI) && speed > 0.4) {
        // foot = 1 is the character's left (offset along (cos yaw, -sin yaw)).
        const foot = Math.floor(s.phase / Math.PI) % 2 === 0 ? 1 : -1;
        const i = s.printIdx;
        s.printIdx = (i + 1) % PRINTS;
        s.births[i] = t;
        s.shown[i] = 1;
        sfx.step(foot, (speed / MAX_SPEED) * (mode === "preview" ? 0.6 : 1));
        const o = tmp.obj;
        o.position.set(s.pos.x + Math.cos(s.yaw) * 0.12 * foot, 0.008, s.pos.z - Math.sin(s.yaw) * 0.12 * foot);
        // +π turns the texture's toe (+Y) to face the walking direction once laid flat.
        o.rotation.set(-Math.PI / 2, 0, s.yaw + Math.PI);
        // The texture is a right foot; mirror it for the left.
        o.scale.set(foot === 1 ? -0.16 : 0.16, 0.3, 1);
        o.updateMatrix();
        pm.setMatrixAt(i, o.matrix);
        pm.instanceMatrix.needsUpdate = true;
      }
      tmp.c1.set(P.print);
      tmp.c2.set(P.floor);
      let hid = false;
      for (let i = 0; i < PRINTS; i++) {
        const f = clamp((t - s.births[i]) / PRINT_LIFE, 0, 1);
        tmp.c.copy(tmp.c1).lerp(tmp.c2, f * f);
        pm.setColorAt(i, tmp.c);
        if (f >= 1 && s.shown[i]) {
          // fully faded: drop it so no ghost outline lingers on the lit floor
          s.shown[i] = 0;
          tmp.obj.scale.setScalar(0);
          tmp.obj.updateMatrix();
          pm.setMatrixAt(i, tmp.obj.matrix);
          hid = true;
        }
      }
      if (hid) pm.instanceMatrix.needsUpdate = true;
      if (pm.instanceColor) pm.instanceColor.needsUpdate = true;
    }

    // --- hotspots ---
    let spot: number | null = null;
    for (let i = 0; i < slots.length; i++) {
      if (Math.hypot(s.pos.x - slots[i].spot[0], s.pos.z - slots[i].spot[1]) < 0.95) spot = i;
    }
    if (spot !== s.spot) {
      s.spot = spot;
      onSpot?.(spot);
    }
    for (let i = 0; i < rings.current.length; i++) {
      const ring = rings.current[i];
      if (!ring) continue;
      const on = i === spot;
      (ring.material as THREE.MeshBasicMaterial).color.set(on ? EMBER : P.ring);
      ring.scale.setScalar(on ? 1.08 + Math.sin(t * 5) * 0.04 : 1);
    }

    // --- camera: follows from behind; frames the art when you stop on a circle ---
    const cam = state.camera;
    const sl = spot != null ? slots[spot] : null;
    const focus = sl && speed < 0.6;
    if (sl && focus) {
      tmp.cam.set(sl.side * -2.1, 2.55, sl.z + 0.15);
      tmp.look.set(sl.side * HALL.halfW, 2.75, sl.z);
    } else if (mode === "preview") {
      tmp.cam.set(s.pos.x * 0.5, 4.1, s.pos.z + 8.4);
      tmp.look.set(s.pos.x * 0.3, 1.5, s.pos.z - 4);
    } else {
      tmp.cam.set(s.pos.x * 0.55, 3.5, s.pos.z + 7.4);
      tmp.look.set(s.pos.x * 0.35, 1.45, s.pos.z - 3.5);
    }
    if (!s.camInit) {
      cam.position.copy(tmp.cam);
      s.look.copy(tmp.look);
      s.camInit = true;
    }
    const ck = 1 - Math.exp(-dt * (focus ? 2.4 : 3.4));
    cam.position.lerp(tmp.cam, ck);
    s.look.lerp(tmp.look, ck);
    cam.lookAt(s.look);

    // --- floating DOM label above the head ---
    const label = labelRef?.current;
    if (label) {
      cam.updateMatrixWorld();
      tmp.head.set(s.pos.x, 2.05 + Math.abs(Math.cos(s.phase)) * 0.06 * s.walk, s.pos.z).project(cam);
      const x = (tmp.head.x * 0.5 + 0.5) * state.size.width;
      const y = (-tmp.head.y * 0.5 + 0.5) * state.size.height;
      placeLabel(label, x, y, tmp.head.z < 1 && !focus);
    }
  });

  return (
    <group>
      <Character rig={rig} color={palette.body} onClick={onCharacterClick} />
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={palette.light ? 0.75 : 0.95} />
      </mesh>
      <instancedMesh ref={prints} args={[undefined, undefined, PRINTS]} renderOrder={1} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={printTex} transparent alphaTest={0.02} depthWrite={false} polygonOffset polygonOffsetFactor={-2} toneMapped={false} />
      </instancedMesh>
      {slots.map((sl, i) => (
        <mesh
          key={i}
          ref={(o) => {
            rings.current[i] = o;
          }}
          position={[sl.spot[0], 0.01, sl.spot[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.6, 0.65, 64]} />
          <meshBasicMaterial color={palette.ring} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Scene(props: WorldProps) {
  const { items, slots, palette, moreCount, onReady } = props;
  const [tex, setTex] = useState<{ posters: THREE.Texture[]; more: THREE.Texture | null }>({ posters: [], more: null });
  const ready = useRef(onReady);
  useEffect(() => {
    ready.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let dead = false;
    const made: THREE.Texture[] = [];
    (async () => {
      await document.fonts.ready;
      const canvases = await Promise.all(items.map((it, i) => drawPoster(it, i, items.length)));
      if (dead) return;
      const more = drawMorePoster(moreCount);
      const posters = canvases.map((c) => toTexture(c));
      const mt = toTexture(more);
      made.push(...posters, mt);
      setTex({ posters, more: mt });
      ready.current?.([...canvases, more].map((c) => c.toDataURL("image/jpeg", 0.85)));
    })();
    return () => {
      dead = true;
      made.forEach((t) => t.dispose());
    };
  }, [items, moreCount]);

  return (
    <>
      <color attach="background" args={[palette.fog]} />
      <fog attach="fog" args={[palette.fog, 16, 48]} />
      <hemisphereLight args={[palette.light ? "#ffffff" : "#d9d2c6", palette.floor, palette.light ? 1.25 : 0.85]} />
      <directionalLight position={[3, 9, 5]} intensity={palette.light ? 1.1 : 0.9} />
      <ambientLight intensity={palette.light ? 0.35 : 0.25} />
      <Room palette={palette} slots={slots} posters={tex.posters} moreTex={tex.more} count={items.length} />
      <Player {...props} />
    </>
  );
}

export default function World(props: WorldProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={props.active ? "always" : "never"}
      camera={{ fov: props.mode === "preview" ? 50 : 55, near: 0.1, far: 80, position: [0, 3.5, 8.6] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: props.mode === "preview" ? "pan-y" : "none" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
