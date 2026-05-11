import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AMBER = "#ffae5c";
const CYAN = "#5fd9ff";

// ───────── Scene 1: Hero portal ─────────
export function HeroPortal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* big rock face */}
      <mesh position={[0, 0, -3]} receiveShadow>
        <boxGeometry args={[14, 8, 1]} />
        <meshStandardMaterial color="#2a2018" roughness={1} />
      </mesh>
      {/* glowing carved arch */}
      <mesh position={[0, 0, -2.4]}>
        <torusGeometry args={[2.2, 0.08, 16, 64, Math.PI]} />
        <meshStandardMaterial
          color={AMBER}
          emissive={AMBER}
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0, -2]} color={AMBER} intensity={6} distance={12} />
      {/* CTA pads */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, -1.6, -2.3]}>
          <boxGeometry args={[1.6, 0.4, 0.15]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ───────── Scene 2: Stone terminal ─────────
export function StoneTerminal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[3, 0, -4]} receiveShadow castShadow>
        <boxGeometry args={[3, 4, 0.4]} />
        <meshStandardMaterial color="#28201a" roughness={0.95} />
      </mesh>
      <mesh position={[3, 0, -3.78]}>
        <planeGeometry args={[2.4, 3.2]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[3, 0, -3.5]} color={CYAN} intensity={3} distance={8} />
    </group>
  );
}

// ───────── Scene 3: Skill pillars ─────────
export function SkillPillars({ position }: { position: [number, number, number] }) {
  const pillars = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 1.2 - Math.PI * 0.6;
        return {
          x: Math.cos(angle) * 4.5,
          z: -8 + Math.sin(angle) * 2,
          h: 3 + (i % 3) * 0.5,
          phase: i * 0.7,
        };
      }),
    [],
  );
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.6 + Math.sin(s.clock.elapsedTime * 1.4 + pillars[i].phase) * 0.6;
    });
  });
  return (
    <group position={position}>
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, -1, p.z]}>
          <mesh castShadow receiveShadow position={[0, p.h / 2, 0]}>
            <cylinderGeometry args={[0.55, 0.7, p.h, 8]} />
            <meshStandardMaterial color="#2a2018" roughness={1} />
          </mesh>
          <mesh
            ref={(el) => {
              if (el) refs.current[i] = el;
            }}
            position={[0, p.h / 2, 0]}
          >
            <boxGeometry args={[0.08, p.h * 0.85, 0.08]} />
            <meshStandardMaterial
              color={AMBER}
              emissive={AMBER}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={[0, p.h / 2, 0]} color={AMBER} intensity={1.4} distance={4} />
        </group>
      ))}
    </group>
  );
}

// ───────── Scene 4: Project slabs ─────────
export function ProjectSlabs({ position }: { position: [number, number, number] }) {
  const slabs = useRef<THREE.Group[]>([]);
  useFrame((s) => {
    slabs.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = -0.5 + Math.sin(s.clock.elapsedTime * 0.6 + i) * 0.15;
      g.rotation.y = Math.sin(s.clock.elapsedTime * 0.3 + i) * 0.08;
    });
  });
  return (
    <group position={position}>
      {[-3, 0, 3].map((x, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) slabs.current[i] = el;
          }}
          position={[x, -0.5, -6]}
        >
          <mesh castShadow>
            <boxGeometry args={[2.2, 2.8, 0.18]} />
            <meshStandardMaterial color="#3a2d22" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[1.9, 2.5]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
          <pointLight color={CYAN} intensity={1.6} distance={5} />
        </group>
      ))}
    </group>
  );
}

// ───────── Scene 5: Monolith ─────────
export function Monolith({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 1, -6]}>
        <boxGeometry args={[2.4, 6, 1]} />
        <meshStandardMaterial color="#1f1812" roughness={1} />
      </mesh>
      {/* timeline lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-1.1, 3 - i * 1.1, -5.49]}>
          <boxGeometry args={[0.9, 0.05, 0.02]} />
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`r${i}`} position={[1.1, 3 - i * 1.1, -5.49]}>
          <boxGeometry args={[0.9, 0.05, 0.02]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* base socials */}
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, -2.2, -5.5]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight position={[0, 1, -4]} color={AMBER} intensity={3} distance={10} />
      <pointLight position={[0, -2, -4]} color={CYAN} intensity={2} distance={6} />
    </group>
  );
}

// ───────── Scene 6: AI nodes ─────────
export function AINodes({ position }: { position: [number, number, number] }) {
  const nodes = useRef<THREE.Mesh[]>([]);
  const data = useMemo(
    () => [
      { x: -3, y: 1, z: -6, c: AMBER },
      { x: 0, y: 2, z: -7, c: CYAN },
      { x: 3, y: 0.5, z: -6, c: AMBER },
      { x: -1.5, y: -1, z: -8, c: CYAN },
    ],
    [],
  );
  useFrame((s) => {
    nodes.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = data[i].y + Math.sin(s.clock.elapsedTime * 0.8 + i) * 0.25;
      m.rotation.y = s.clock.elapsedTime * 0.3 + i;
    });
  });
  return (
    <group position={position}>
      {data.map((n, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) nodes.current[i] = el;
          }}
          position={[n.x, n.y, n.z]}
        >
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color={n.c}
            emissive={n.c}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight position={[0, 1, -6]} color={CYAN} intensity={3} distance={12} />
    </group>
  );
}
