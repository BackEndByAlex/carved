# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # start dev server (Vite)
bun build        # production build (Cloudflare Workers target)
bun lint         # ESLint
bun format       # Prettier
```

There are no tests in this project.

## Architecture

This is a **scroll-driven 3D portfolio** — a single-page site where scrolling moves a camera through a 3D cave scene and fades HTML overlays in/out for each "scene."

### The scroll → 3D bridge

`scrollProgress.ts` is the critical coupling point. It exports a plain mutable ref (`progressRef`) that GSAP's ScrollTrigger writes to, and the R3F `useFrame` loop reads from — avoiding React re-renders on every scroll tick. `sceneOpacity()` computes per-scene fade values (0–1) from the raw progress float.

### Scene system (6 scenes)

`path.ts` defines `WAYPOINTS` (6 camera positions + lookAt targets), then builds two `CatmullRomCurve3` splines (`CAMERA_CURVE`, `LOOK_CURVE`) that the camera travels along. `STATION_CENTERS` anchors the 3D geometry at fixed world-space Z positions matching each waypoint.

Scenes in order: Hero → About → Skills → Projects → CV/Contact → AI Journey.

### Component responsibilities

| File                 | Role                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `Portfolio.tsx`      | Lenis smooth scroll + GSAP ScrollTrigger pin. Owns `progress` state, renders `Experience` + all overlays  |
| `Experience.tsx`     | R3F `<Canvas>` with `CameraRig`, cave geometry, stations, and post-processing                             |
| `scene/Cave.tsx`     | Procedural cave tunnel geometry, circuit traces, dust particles                                           |
| `scene/Stations.tsx` | Six station meshes (`HeroPortal`, `StoneTerminal`, `SkillPillars`, `ProjectSlabs`, `Monolith`, `AINodes`) |
| `Overlays.tsx`       | Pure HTML/Tailwind overlays — one exported component per scene, all receiving `progress` prop             |

### Adding or editing a scene

1. Update `WAYPOINTS` and `STATION_CENTERS` in `path.ts` (new Z position)
2. Add station mesh in `Stations.tsx`, place it at the new `STATION_CENTERS` entry in `Experience.tsx`
3. Add/edit the HTML overlay in `Overlays.tsx`
4. Update `SCENES = 6` in `Portfolio.tsx` if the scene count changes

### Styling

Tailwind v4 with a dark stone/cave theme. Two brand colours used throughout: `text-amber-glow` (warm orange, `--amber-glow`) and `text-cyan-glow` (electric blue, `--cyan-glow`) — defined as CSS custom properties in `styles.css`. `.scene-overlay` is a utility class that makes a full-inset absolute flex container for HTML overlays.

Fonts: `font-display` = Cinzel (serif, used for headings), `font-mono` = JetBrains Mono.

### Deployment target

Cloudflare Workers via `@cloudflare/vite-plugin`. `src/server.ts` is the Worker entry point; it wraps the TanStack Start SSR handler and normalises catastrophic h3 errors into a branded 500 page. Config is in `wrangler.jsonc`.
