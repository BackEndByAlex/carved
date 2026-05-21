# Carved — Redesign Spec

**Date:** 2026-05-21
**Status:** Approved
**Author:** Alexandru C.A

---

## Overview

Full redesign of the carved portfolio site. Replaces the Three.js/R3F procedural cave with a scroll-scrubbed AI-generated video background (floating island developer scene). Adopts the Prisma Creative Studio aesthetic: dark, cinematic, warm cream palette, Cinzel font, pull-up word animations. Reduces from 7 scenes to 3: Hero → About → Projects.

---

## Goals

- Professional enough to send to recruiters
- Distinctive enough to be remembered
- Minimal hero — let the video do the talking
- Prisma-level visual quality

---

## What Gets Deleted

All Three.js / R3F code is removed entirely:

- `src/components/Experience.tsx`
- `src/components/scene/Cave.tsx`
- `src/components/scene/Stations.tsx`
- `src/components/scene/path.ts`
- `src/components/scrollProgress.ts`

Dependencies to remove from `package.json`:
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- `three`
- `postprocessing`

---

## New File Structure

```
src/
  components/
    Portfolio.tsx         ← scroll orchestrator, scene transitions
    VideoBackground.tsx   ← <video> scrub logic
    Overlays.tsx          ← HeroOverlay, AboutOverlay, ProjectsOverlay
    animations.tsx        ← WordsPullUp, AnimatedLetter (shared)
  styles.css              ← noise utilities, CSS custom properties
  routes/
    index.tsx             ← unchanged, renders <Portfolio />
```

---

## Scroll Architecture

- **3 scenes × 100vh** = 300vh total scroll distance
- GSAP ScrollTrigger pins the viewport for the full 300vh
- Lenis handles smooth wheel input, feeds into ScrollTrigger
- `onUpdate(self)` callback maps `self.progress` (0→1) to `video.currentTime`
- Snap-to-scene: 500ms idle timeout, lerps to nearest scene boundary via Lenis
- No mutable ref, no `useFrame`, no R3F — video scrub is direct DOM manipulation

```
scroll progress 0.0 → 0.33  =  Scene 0 (Hero)
scroll progress 0.33 → 0.66 =  Scene 1 (About)
scroll progress 0.66 → 1.0  =  Scene 2 (Projects)
```

Scene opacity: each scene fades in from 0→1 and out 1→0 around its center point. Same `sceneOpacity()` logic as before but inline in Portfolio.tsx — no separate file needed for 3 scenes.

---

## Video Background

**File:** `public/hero.mp4` (copy from Downloads, rename)
**Fallback:** black background (`#000000`)

```tsx
// VideoBackground.tsx
<video
  ref={videoRef}
  src="/hero.mp4"
  muted
  playsInline
  preload="auto"
  className="absolute inset-0 h-full w-full object-cover"
/>
```

Scrub: `videoRef.current.currentTime = progress * videoRef.current.duration`

Noise overlay on top of video:
- `.noise-overlay` SVG feTurbulence (baseFrequency: 0.85, numOctaves: 3)
- `opacity-[0.7] mix-blend-overlay pointer-events-none`

Gradient overlay:
- `bg-gradient-to-b from-black/30 via-transparent to-black/60`

---

## Visual System

### Colors

| Token | Value | Usage |
|---|---|---|
| Background | `#000000` | Global base |
| About card | `#101010` | About section inner card |
| Project cards | `#212121` | Project card backgrounds |
| Primary text | `#E1E0CC` | All headings and accents |
| Muted text | `text-gray-400` | Body copy, descriptions |

CSS custom properties in `styles.css`:
```css
:root {
  --primary: #E1E0CC;
}
```

Tailwind config extend:
```js
colors: { primary: '#DEDBC8' }
fontFamily: { serif: ['"Cinzel"', 'serif'] }
```

### Fonts

Load in `index.html`:
- **Cinzel** (weights: 400, 700) — headings, hero name
- **JetBrains Mono** — mono labels, navbar items, card metadata

### Noise Utilities (`styles.css`)

```css
.noise-overlay {
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.85' numOctaves='3'...");
}
.bg-noise {
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.9' numOctaves='4'...");
}
```

---

## Navbar

- Absolutely positioned, top center
- Black pill hanging from top: `bg-black rounded-b-2xl px-6 py-2`
- 3 items: `About · Projects · Contact`
- Font: JetBrains Mono, `text-xs uppercase tracking-widest`
- Color: `rgba(225, 224, 204, 0.8)` hover `#E1E0CC`
- Contact scrolls to Projects section (GitHub/LinkedIn links)
- `pointer-events-auto` so it stays clickable regardless of scene

---

## Scene 1 — Hero

**Layout:** Full viewport, centered content, bottom-aligned text block

**Content:**
- Name: `Alexandru C.A` — Cinzel, `text-[18vw]` responsive, `font-bold`, `#E1E0CC`
- Title: `Web Developer · Linnaeus University` — mono, `text-xs`, `text-primary/70`
- CTA: `See my work →` pill button — `bg-primary`, black text, rounded-full, scrolls to Projects
- Scroll hint: `↓ scroll to descend` mono, animated bounce

**Animation:** WordsPullUp on name, fade-up on title + CTA (delay 0.5s, 0.7s)

---

## Scene 2 — About

**Layout:** Two-column grid, `max-w-6xl` centered

**Left column:**
- Label: `// about` — mono, cream
- Heading: `Building things that actually work.` — Cinzel, large
- Bio paragraph — `text-gray-400`, `text-sm`
- Second paragraph about AI workflow and best practices

**Right column:**
- Terminal info card: `bg-[#101010]`, `border border-primary/20`, `rounded-lg`
- Rows: Name · Role · Year · Mode · Status · Location
- Status: `Open to work` in cream
- Body text scroll-linked character opacity animation (AnimatedLetter)

**Animation:** WordsPullUp on heading, AnimatedLetter on bio paragraph

---

## Scene 3 — Projects

**Layout:** Centered, `max-w-6xl`

**Header:**
- Label: `// projects` — mono, cream
- Heading: `My latest work.` — Cinzel

**3 cards** (`bg-[#212121]`, `border border-primary/10`, `rounded-lg`):

| Project | Tags | Links |
|---|---|---|
| salaryscope-api | GraphQL · Prisma · Elasticsearch · OAuth PKCE | GitHub + Live |
| salaryscope-wt | React · Apollo Client · MapLibre · Vite | GitHub + Live |
| token-auth | Node · JWT · RBAC · Security | GitHub only |

Each card: project name (Cinzel), description (gray-400), tag pills, GitHub + Live buttons

**Animation:** Staggered scale-in (0.95→1) + fade, 0.15s intervals, triggered by useInView

---

## Animation Components (`animations.tsx`)

### WordsPullUp
- Splits text by spaces into `motion.span` elements
- Each slides up: `y: 20 → 0`, `opacity: 0 → 1`
- Stagger: `0.08s` per word
- Trigger: `useInView({ once: true })`
- Easing: `[0.16, 1, 0.3, 1]`

### AnimatedLetter
- Wraps each character individually
- Opacity driven by `useScroll` with target offset `['start 0.8', 'end 0.2']`
- Each char: `opacity 0.2 → 1` based on scroll position
- Stagger: `charProgress = index / totalChars`

---

## Dependencies

### Remove
```
@react-three/fiber
@react-three/drei
@react-three/postprocessing
three
postprocessing
```

### Add
```
framer-motion
```

### Keep
```
gsap
lenis
@tanstack/react-router
@tanstack/react-query
tailwindcss
lucide-react
react 19
typescript
vite
bun
```

---

## Assets

| File | Source | Destination |
|---|---|---|
| `hero.mp4` | `Downloads/hf_20260521_114640_...mp4` | `public/hero.mp4` |

---

## What Does NOT Change

- TanStack Router setup (`router.tsx`, `routes/`)
- `src/lib/utils.ts`
- Vite config
- TypeScript config
- ESLint / Prettier config
- Deployment (Caddy VPS at `backendbyalex.se`)
