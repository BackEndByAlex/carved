# carved

A scroll-driven 3D portfolio. Scrolling moves a camera through a procedural cave while HTML overlays fade in and out for each scene.

Live at [backendbyalex.se](https://backendbyalex.se)

---

## How it works

### The scroll → 3D bridge

`scrollProgress.ts` is the coupling point between the scroll system and Three.js. It exports a plain mutable ref (`progressRef`) — not React state. GSAP's ScrollTrigger writes to it on every scroll tick, and the R3F `useFrame` loop reads from it every animation frame. This avoids React re-renders on scroll entirely.

`sceneOpacity(progress, sceneIndex)` converts the raw 0–1 progress float into a per-scene opacity value used to fade HTML overlays in and out. `SCENES` is exported from here as the single source of truth for scene count.

### Camera path

`scene/path.ts` defines 7 waypoints — one per scene — as `{ pos, look }` pairs. Two `CatmullRomCurve3` splines are built from them: `CAMERA_CURVE` for the camera position and `LOOK_CURVE` for the lookAt target. In `CameraRig`, `curve.getPointAt(progress)` samples both splines each frame and lerps the camera into position with a subtle breathing offset.

### Scene system

7 scenes in order. Scenes 1–6 are shown in the main progress rail; scene 7 is a hidden dev scene accessible via the `// dev` button.

| #   | Scene        | 3D Station                            |
| --- | ------------ | ------------------------------------- |
| 1   | Hero         | `HeroPortal` — glowing stone arch     |
| 2   | About        | `StoneTerminal` — glowing screen slab |
| 3   | Skills       | `SkillPillars` — 6 animated pillars   |
| 4   | Projects     | `ProjectSlabs` — 3 floating slabs     |
| 5   | CV / Contact | `Monolith` — timeline monolith        |
| 6   | AI Journey   | `AINodes` — floating icosahedrons     |
| 7   | Dev (hidden) | `BlueprintStation` — circuit tablets  |

`STATION_CENTERS` in `path.ts` anchors each station at a fixed world-space Z that matches its waypoint's lookAt target. Increasing scene index = more negative Z = deeper into the cave.

### Navigation

The progress rail at the bottom shows 6 clickable dot-bars — hovering reveals the scene name, clicking smoothly scrolls to that scene via `lenis.scrollTo()`. A separate `// dev` button jumps to scene 7. The scene counter in the top bar shows `SCENE X / 6` for the main scenes and `// DEV` when on scene 7.

### Cave geometry

`scene/Cave.tsx` builds the environment:

- **CaveCorridor** — 280 icosahedron rocks placed around the camera spline using instanced meshes (one draw call). A seeded PRNG (`mulberry32`) makes positions deterministic across renders.
- **CircuitTraces** — 120 thin glowing boxes along the tunnel walls, pulsing via `useFrame`.
- **Dust** — 600 points drifting slowly, updated per frame with `setY()` and `DynamicDrawUsage`.

### Smooth scroll + snap

`Portfolio.tsx` creates a Lenis instance for smooth wheel scrolling, feeds it into GSAP's RAF loop, and uses `ScrollTrigger` to pin the canvas and track progress. After 500ms of scroll idle, a timeout snaps to the nearest scene boundary by calling `lenis.scrollTo()`.

### Post-processing

`Experience.tsx` wraps everything in `<EffectComposer>` from `@react-three/postprocessing`:

- **Bloom** — makes emissive materials glow (`luminanceThreshold: 0.4`)
- **Vignette** — darkens the edges of the canvas

---

## Stack

| Layer   | Tech                                                       |
| ------- | ---------------------------------------------------------- |
| 3D      | Three.js, React Three Fiber, `@react-three/postprocessing` |
| Scroll  | Lenis, GSAP ScrollTrigger                                  |
| UI      | React 19, TypeScript, Tailwind v4                          |
| Routing | TanStack Router (single route)                             |
| Build   | Vite 7                                                     |
| Deploy  | Caddy on a VPS with Hostup CDN                             |

---

## Commands

```bash
npm run dev        # dev server
npm run build      # production build → dist/
npm run lint       # ESLint
npm run format     # Prettier
```

---

## Adding a scene

1. Increment `SCENES` in `scrollProgress.ts`
2. Add a waypoint to `WAYPOINTS` and a center to `STATION_CENTERS` in `scene/path.ts`
3. Add a station mesh in `scene/Stations.tsx`, place it in `Experience.tsx`
4. Add an overlay component in `Overlays.tsx` using `sceneOpacity(progress, N)`
5. Render it in `Portfolio.tsx`
