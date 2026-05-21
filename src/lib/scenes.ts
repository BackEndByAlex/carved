export const SCENES = 3;

export function sceneOpacity(progress: number, scene: number): number {
  const seg = 1 / (SCENES - 1);
  const center = scene * seg;
  const dist = Math.abs(progress - center);
  return Math.max(0, 1 - dist / seg);
}
