"use client";

import type * as THREE from "three";
import type { RefObject } from "react";
import { EMBER } from "./shared";

/** Joints the walk cycle drives each frame. */
export interface Rig {
  root?: THREE.Group;
  body?: THREE.Group;
  head?: THREE.Group;
  antenna?: THREE.Group;
  armL?: THREE.Group;
  armR?: THREE.Group;
  legL?: THREE.Group;
  legR?: THREE.Group;
}

/**
 * The gallery guide: a small rounded walker built from primitives, with a
 * glowing ember visor, a scarf, and an antenna whose bulb echoes the site's
 * rope pull. Faces +Z; the parent rotates it.
 */
export function Character({
  rig,
  color,
  onClick,
}: {
  rig: RefObject<Rig>;
  color: string;
  onClick?: () => void;
}) {
  const bind = (k: keyof Rig) => (o: THREE.Group | null) => {
    if (o) rig.current[k] = o;
  };
  const skin = <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />;
  const glow = <meshStandardMaterial color={EMBER} emissive={EMBER} emissiveIntensity={1.4} roughness={0.3} />;

  return (
    <group
      ref={bind("root")}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => {
        if (onClick) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* legs: pivot at the hip */}
      {([-1, 1] as const).map((s) => (
        <group key={s} ref={bind(s < 0 ? "legL" : "legR")} position={[s * 0.12, 0.5, 0]}>
          <mesh position={[0, -0.21, 0]}>
            <capsuleGeometry args={[0.085, 0.24, 6, 12]} />
            {skin}
          </mesh>
          <mesh position={[0, -0.44, 0.04]} scale={[1, 0.62, 1.45]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            {skin}
          </mesh>
        </group>
      ))}

      {/* upper body: pivot at the hip so it can lean */}
      <group ref={bind("body")} position={[0, 0.5, 0]}>
        <mesh position={[0, 0.34, 0]}>
          <capsuleGeometry args={[0.235, 0.26, 8, 20]} />
          {skin}
        </mesh>
        {/* scarf */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.055, 10, 28]} />
          {glow}
        </mesh>
        <mesh position={[0.1, 0.48, -0.17]} rotation={[0.35, 0, -0.2]}>
          <boxGeometry args={[0.09, 0.22, 0.04]} />
          {glow}
        </mesh>

        {/* arms: pivot at the shoulder */}
        {([-1, 1] as const).map((s) => (
          <group key={s} ref={bind(s < 0 ? "armL" : "armR")} position={[s * 0.3, 0.56, 0]} rotation={[0, 0, s * 0.12]}>
            <mesh position={[0, -0.19, 0]}>
              <capsuleGeometry args={[0.068, 0.24, 6, 12]} />
              {skin}
            </mesh>
            <mesh position={[0, -0.37, 0]}>
              <sphereGeometry args={[0.078, 14, 10]} />
              {skin}
            </mesh>
          </group>
        ))}

        {/* head */}
        <group ref={bind("head")} position={[0, 0.98, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 24]} />
            {skin}
          </mesh>
          {/* visor */}
          <mesh position={[0, 0.02, 0.215]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.75]}>
            <capsuleGeometry args={[0.085, 0.26, 8, 16]} />
            {glow}
          </mesh>
          {/* antenna */}
          <group ref={bind("antenna")} position={[0.06, 0.27, 0]}>
            <mesh position={[0, 0.11, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
              {skin}
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.05, 14, 10]} />
              {glow}
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
