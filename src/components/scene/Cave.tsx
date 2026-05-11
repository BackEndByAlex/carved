import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STONE_COLOR = new THREE.Color("#7a6a58");
const STONE_DARK = new THREE.Color("#4a3d32");

export function CaveCorridor({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const { positions, scales, rotations, colors } = useMemo(() => {
    const rand = mulberry32(7);
    const N = 280;
    const positions: THREE.Vector3[] = [];
    const scales: THREE.Vector3[] = [];
    const rotations: THREE.Euler[] = [];
    const colors: THREE.Color[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const center = curve.getPointAt(t);
      const angle = rand() * Math.PI * 2;
      const radius = 6 + rand() * 5;
      const offX = Math.cos(angle) * radius;
      const offY = (rand() - 0.5) * 6;
      const offZ = Math.sin(angle) * radius;
      positions.push(new THREE.Vector3(center.x + offX, center.y + offY, center.z + offZ));
      const s = 1.2 + rand() * 2.0;
      scales.push(new THREE.Vector3(s, s * (0.6 + rand() * 0.8), s));
      rotations.push(new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI));
      const mix = rand() * 0.5;
      const c = STONE_DARK.clone().lerp(STONE_COLOR, 0.4 + mix);
      colors.push(c);
    }
    return { positions, scales, rotations, colors };
  }, [curve]);

  const init = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < positions.length; i++) {
      dummy.position.copy(positions[i]);
      dummy.rotation.copy(rotations[i]);
      dummy.scale.copy(scales[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  return (
    <instancedMesh
      ref={init}
      args={[undefined, undefined, positions.length]}
      castShadow
      receiveShadow
    >
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial roughness={0.95} metalness={0.05} flatShading />
    </instancedMesh>
  );
}

export function CircuitTraces({
  curve,
  color,
  count = 60,
  offset = 0,
}: {
  curve: THREE.CatmullRomCurve3;
  color: string;
  count?: number;
  offset?: number;
}) {
  const data = useMemo(() => {
    const rand = mulberry32(13 + offset);
    const items: { pos: THREE.Vector3; rot: THREE.Euler; len: number; phase: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count + rand() * 0.005;
      const center = curve.getPointAt(Math.min(0.999, Math.max(0.001, t)));
      const angle = rand() * Math.PI * 2;
      const radius = 4.2 + rand() * 1.5;
      const pos = new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y + (rand() - 0.5) * 4,
        center.z + Math.sin(angle) * radius,
      );
      const rot = new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
      items.push({ pos, rot, len: 0.6 + rand() * 2.2, phase: rand() * Math.PI * 2 });
    }
    return items;
  }, [curve, count, offset]);

  const ref = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      tmp.position.copy(d.pos);
      tmp.rotation.copy(d.rot);
      const pulse = 0.6 + Math.sin(t * 1.2 + d.phase) * 0.4;
      tmp.scale.set(0.04, 0.04, d.len * pulse);
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, data.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={col} emissive={col} emissiveIntensity={3} toneMapped={false} />
    </instancedMesh>
  );
}

export function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = mulberry32(42);
    const N = 600;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3]     = (rand() - 0.5) * 80;
      arr[i * 3 + 1] = (rand() - 0.5) * 30;
      arr[i * 3 + 2] = (rand() - 0.5) * 200 - 50;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) + Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.002);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d9b890"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
