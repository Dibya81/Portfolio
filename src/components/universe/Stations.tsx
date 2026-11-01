"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, EdgesGeometry, IcosahedronGeometry, InstancedMesh, Object3D, type Group } from "three";
import { flagshipProjects } from "@/data/projects";
import { getExperience, setExperience } from "@/lib/experience-store";
import { STATION_POSITIONS } from "./path";

/** Station animation is driven by scroll progress, never by a clock — no idle frames. */
const progressOf = (i: number) => getExperience().sectionProgress[i] ?? 0;
const near = (i: number) => {
  const s = getExperience();
  return Math.abs(s.sectionIndex - i) <= 1;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** True when the pointer event landed on page whitespace rather than on HTML content. */
function onEmptySpace(e: ThreeEvent<PointerEvent | MouseEvent>) {
  const target = e.nativeEvent.target as Element | null;
  if (!target) return false;
  return !target.closest("a,button,input,textarea,select,dialog,p,h1,h2,h3,h4,li,dl,figure,img,.panel,.reveal-slot,header,nav,[data-no-world]");
}

// ─────────────── 01 Gateway / 07 Connection: portal rings ───────────────
function Portal({ index, scale = 1 }: { index: number; scale?: number }) {
  const group = useRef<Group>(null);
  useFrame(() => {
    if (!group.current || !near(index)) return;
    const p = progressOf(index);
    group.current.rotation.z = p * Math.PI * 0.6;
  });
  return (
    <group ref={group} position={STATION_POSITIONS[index]} scale={scale}>
      <mesh>
        <torusGeometry args={[3.2, 0.035, 12, 160]} />
        <meshBasicMaterial color="#ff7a3d" toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[3.55, 0.012, 8, 160]} />
        <meshBasicMaterial color="#5b8cff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// ─────────────── 02 Core: wireframe icosahedron + rings ───────────────
function Core() {
  const group = useRef<Group>(null);
  const edges = useMemo(() => new EdgesGeometry(new IcosahedronGeometry(2.4, 1)), []);
  useFrame(() => {
    if (!group.current || !near(1)) return;
    const p = progressOf(1);
    group.current.rotation.y = p * Math.PI * 1.2;
    group.current.rotation.x = 0.25 + p * 0.4;
  });
  return (
    <group position={STATION_POSITIONS[1]}>
      <group ref={group}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#5b8cff" transparent opacity={0.75} />
        </lineSegments>
        <mesh>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#ff7a3d" emissive="#ff7a3d" emissiveIntensity={0.55} roughness={0.4} flatShading />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[3.4, 0.01, 6, 160]} />
          <meshBasicMaterial color="#ffb38a" transparent opacity={0.5} />
        </mesh>
      </group>
      <pointLight color="#ff7a3d" intensity={22} distance={16} decay={2} />
    </group>
  );
}

// ─────────────── 03 Laboratory: instanced lattice with a scroll wave ───────────────
function Laboratory({ low }: { low: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const nx = low ? 6 : 8;
  const ny = 8;
  const nz = 3;
  const count = nx * ny * nz;
  const dummy = useMemo(() => new Object3D(), []);
  const last = useRef(-1);

  useFrame(() => {
    const m = mesh.current;
    if (!m || !near(2)) return;
    const p = progressOf(2);
    if (Math.abs(p - last.current) < 0.0005) return;
    last.current = p;
    let i = 0;
    for (let x = 0; x < nx; x++)
      for (let y = 0; y < ny; y++)
        for (let z = 0; z < nz; z++) {
          const wave = Math.sin(x * 0.7 + z * 0.9 + p * 9) * 0.22;
          dummy.position.set((x - (nx - 1) / 2) * 0.62, (y - (ny - 1) / 2) * 0.62 + wave, (z - (nz - 1) / 2) * 0.62);
          const s = 0.75 + Math.max(0, Math.sin(y * 0.8 - p * 7)) * 0.6;
          dummy.scale.setScalar(s);
          dummy.rotation.set(p * 2 + x * 0.1, p * 3 + y * 0.1, 0);
          dummy.updateMatrix();
          m.setMatrixAt(i++, dummy.matrix);
        }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={STATION_POSITIONS[2]} rotation={[0.2, 0.6, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#5b8cff" emissive="#5b8cff" emissiveIntensity={0.45} roughness={0.5} />
      </instancedMesh>
      <pointLight color="#7ee0c3" intensity={14} distance={14} decay={2} position={[0, 2, 3]} />
    </group>
  );
}

// ─────────────── 04 Project Universe: clickable planets ───────────────
const PLANET_LAYOUT: { offset: [number, number, number]; radius: number }[] = [
  { offset: [-2.4, 1.6, 0.4], radius: 1.15 },
  { offset: [2.3, 0.7, -2.2], radius: 0.95 },
  { offset: [-1.1, -1.9, -3.2], radius: 0.85 },
  { offset: [2.1, -2.0, 1.0], radius: 0.8 },
  { offset: [0.2, 2.6, -4.2], radius: 0.7 },
];

function Planet({
  slug,
  title,
  accent,
  offset,
  radius,
  onNavigate,
}: {
  slug: string;
  title: string;
  accent: string;
  offset: [number, number, number];
  radius: number;
  onNavigate: (slug: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const invalidate = useThree((s) => s.invalidate);
  const ring = useRef<Group>(null);

  useFrame(() => {
    if (!ring.current || !near(3)) return;
    ring.current.rotation.z = progressOf(3) * Math.PI * 0.8 + radius;
  });

  useEffect(() => {
    if (!hovered) return;
    return () => {
      document.body.style.cursor = "";
      setExperience({ hint: null });
    };
  }, [hovered]);

  return (
    <group position={offset}>
      <mesh
        scale={hovered ? 1.12 : 1}
        onPointerOver={(e) => {
          if (!onEmptySpace(e)) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          setExperience({ hint: `Open ${title}` });
          invalidate();
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
          setExperience({ hint: null });
          invalidate();
        }}
        onClick={(e) => {
          if (!onEmptySpace(e)) return;
          e.stopPropagation();
          onNavigate(slug);
        }}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={hovered ? 0.6 : 0.16} roughness={0.55} metalness={0.1} />
      </mesh>
      <group ref={ring} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[radius * 1.55, 0.008, 6, 128]} />
          <meshBasicMaterial color={accent} transparent opacity={hovered ? 0.95 : 0.45} />
        </mesh>
      </group>
    </group>
  );
}

function ProjectUniverse({ onNavigate }: { onNavigate: (slug: string) => void }) {
  return (
    <group position={STATION_POSITIONS[3]}>
      {flagshipProjects.slice(0, PLANET_LAYOUT.length).map((p, i) => (
        <Planet key={p.slug} slug={p.slug} title={p.title} accent={p.accent} offset={PLANET_LAYOUT[i].offset} radius={PLANET_LAYOUT[i].radius} onNavigate={onNavigate} />
      ))}
      <pointLight color="#ffffff" intensity={28} distance={18} decay={2} position={[0, 3, 5]} />
    </group>
  );
}

// ─────────────── 05 Foundry: paper flowing along a print line into a kiosk ───────────────
function Foundry({ low }: { low: boolean }) {
  const sheets = useRef<InstancedMesh>(null);
  const count = low ? 10 : 18;
  const dummy = useMemo(() => new Object3D(), []);
  const last = useRef(-1);
  const LEN = 8.5;

  useFrame(() => {
    const m = sheets.current;
    if (!m || !near(4)) return;
    const p = progressOf(4);
    if (Math.abs(p - last.current) < 0.0005) return;
    last.current = p;
    for (let i = 0; i < count; i++) {
      const t = ((i / count + p * 1.4) % 1 + 1) % 1;
      const x = -LEN / 2 + t * LEN;
      dummy.position.set(x, 0.62 + Math.sin(t * Math.PI) * 0.35, 0);
      dummy.rotation.set(-Math.PI / 2 + 0.25 * Math.sin(t * 6.283), 0, (i % 3) * 0.04);
      const fade = t > 0.92 ? (1 - t) / 0.08 : 1;
      dummy.scale.setScalar(Math.max(fade, 0.001));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={STATION_POSITIONS[4]} rotation={[0.35, -0.28, 0.04]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[LEN, 0.06, 1.2]} />
        <meshStandardMaterial color="#1a2236" roughness={0.6} metalness={0.4} />
      </mesh>
      <instancedMesh ref={sheets} args={[undefined, undefined, count]}>
        <planeGeometry args={[0.7, 0.99]} />
        <meshStandardMaterial color="#f4ede4" emissive="#ff7a3d" emissiveIntensity={0.08} side={DoubleSide} roughness={0.85} />
      </instancedMesh>
      <group position={[LEN / 2 + 0.9, 1.1, 0]}>
        <mesh>
          <boxGeometry args={[1.4, 2.2, 1.1]} />
          <meshStandardMaterial color="#121a30" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[-0.71, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshBasicMaterial color="#ff7a3d" toneMapped={false} />
        </mesh>
      </group>
      <pointLight color="#ff7a3d" intensity={24} distance={16} decay={2} position={[2, 3, 2]} />
    </group>
  );
}

// ─────────────── 06 Archive: a field of monoliths ───────────────
function Archive({ low }: { low: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const cols = low ? 8 : 12;
  const rows = low ? 6 : 7;
  const count = cols * rows;

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const rand = mulberry32(6);
    const d = new Object3D();
    let i = 0;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++) {
        const h = 0.6 + rand() * rand() * 3.4;
        d.position.set((c - (cols - 1) / 2) * 1.6 + (rand() - 0.5) * 0.5, h / 2, (r - (rows - 1) / 2) * 1.6 + (rand() - 0.5) * 0.5);
        d.scale.set(1, h, 1);
        d.updateMatrix();
        m.setMatrixAt(i++, d.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, [cols, rows]);

  return (
    <group position={STATION_POSITIONS[5]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#1b2338" roughness={0.6} metalness={0.35} />
      </instancedMesh>
      <pointLight color="#5b8cff" intensity={30} distance={22} decay={2} position={[0, 6, 2]} />
    </group>
  );
}

// ─────────────── 07 Connection: final portal + beacon ───────────────
function Connection() {
  return (
    <group>
      <Portal index={6} scale={1.5} />
      <group position={STATION_POSITIONS[6]}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshBasicMaterial color="#ffb38a" toneMapped={false} />
        </mesh>
        <pointLight color="#ff7a3d" intensity={40} distance={24} decay={2} />
      </group>
    </group>
  );
}

export function Stations({ low, onNavigate }: { low: boolean; onNavigate: (slug: string) => void }) {
  return (
    <>
      <Portal index={0} />
      <Core />
      <Laboratory low={low} />
      <ProjectUniverse onNavigate={onNavigate} />
      <Foundry low={low} />
      <Archive low={low} />
      <Connection />
    </>
  );
}
