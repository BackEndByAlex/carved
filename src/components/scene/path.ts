import * as THREE from "three";

// 7 camera waypoints (position, lookAt) — one per scene
export const WAYPOINTS: { pos: THREE.Vector3; look: THREE.Vector3 }[] = [
  { pos: new THREE.Vector3(0, 0.2, 4), look: new THREE.Vector3(0, 0, -2) }, // Hero
  { pos: new THREE.Vector3(-1, 0.6, -8), look: new THREE.Vector3(2, 0, -14) }, // About
  { pos: new THREE.Vector3(-3, 0.3, -20), look: new THREE.Vector3(-2, -0.5, -28) }, // Skills
  { pos: new THREE.Vector3(0, -1, -36), look: new THREE.Vector3(0, -1.5, -44) }, // Projects
  { pos: new THREE.Vector3(2, -2.5, -52), look: new THREE.Vector3(0, -1.5, -60) }, // CV / Monolith
  { pos: new THREE.Vector3(7, -1, -66), look: new THREE.Vector3(10, 0, -74) }, // AI Journey
  { pos: new THREE.Vector3(0, 0.5, -82), look: new THREE.Vector3(0, 0, -90) }, // Behind the Build
];

// Centers used to anchor station geometry near each waypoint's lookAt
export const STATION_CENTERS: [number, number, number][] = [
  [0, 0, 0],
  [0, 0, -10],
  [0, 0, -22],
  [0, 0, -38],
  [0, 0, -54],
  [8, 0, -68],
  [0, 0, -84],
];

// A smooth curve through all positions for the camera to travel along
export const CAMERA_CURVE = new THREE.CatmullRomCurve3(
  WAYPOINTS.map((w) => w.pos.clone()),
  false,
  "catmullrom",
  0.4,
);

export const LOOK_CURVE = new THREE.CatmullRomCurve3(
  WAYPOINTS.map((w) => w.look.clone()),
  false,
  "catmullrom",
  0.4,
);
