import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";
import * as THREE from "three";
import { CaveCorridor, CircuitTraces, Dust } from "./scene/Cave";
import {
  HeroPortal,
  StoneTerminal,
  SkillPillars,
  ProjectSlabs,
  Monolith,
  AINodes,
} from "./scene/Stations";
import { CAMERA_CURVE, LOOK_CURVE, STATION_CENTERS } from "./scene/path";
import { progressRef } from "./scrollProgress";

const _tmp = new THREE.Vector3();
const _lookTmp = new THREE.Vector3();
const _breath = new THREE.Vector3();

function CameraRig() {
  const { camera } = useThree();
  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    CAMERA_CURVE.getPointAt(t, _tmp);
    LOOK_CURVE.getPointAt(t, _lookTmp);
    const breath = Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
    _breath.set(0, breath, 0);
    camera.position.lerp(_tmp.clone().add(_breath), Math.min(1, delta * 6));
    camera.lookAt(_lookTmp);
  });
  return null;
}

export default function Experience() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 4], fov: 55, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0a0805"]} />
      <fog attach="fog" args={["#0a0805", 20, 80]} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.45} color="#6a5040" />
        <directionalLight
          position={[6, 12, 4]}
          intensity={1.4}
          color="#ffd9a8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 4, 0]} intensity={0.6} color="#ffb870" distance={40} />

        <CaveCorridor curve={CAMERA_CURVE} />
        <CircuitTraces curve={CAMERA_CURVE} color="#ffae5c" count={70} offset={0} />
        <CircuitTraces curve={CAMERA_CURVE} color="#5fd9ff" count={50} offset={1} />
        <Dust />

        <HeroPortal position={STATION_CENTERS[0]} />
        <StoneTerminal position={STATION_CENTERS[1]} />
        <SkillPillars position={STATION_CENTERS[2]} />
        <ProjectSlabs position={STATION_CENTERS[3]} />
        <Monolith position={STATION_CENTERS[4]} />
        <AINodes position={STATION_CENTERS[5]} />

        <CameraRig />

        <EffectComposer>
          <Bloom intensity={1.1} luminanceThreshold={0.4} luminanceSmoothing={0.6} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
