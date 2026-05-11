// Shared mutable scroll progress (0..1) updated by ScrollTrigger,
// read by the R3F camera rig and overlay components.
export const progressRef = { current: 0 };

export const SCENES = 7;

// Per-scene visibility (0..1) computed from progress, used by HTML overlays.
export function sceneOpacity(progress: number, sceneIndex: number, total = SCENES) {
  const seg = 1 / (total - 1);
  const center = sceneIndex * seg;
  const dist = Math.abs(progress - center);
  const o = THREE_clamp01(1 - dist / (seg * 0.6));
  return o;
}

function THREE_clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
