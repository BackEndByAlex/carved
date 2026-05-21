# Carved Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Three.js/R3F cave with a scroll-scrubbed video background and adopt the Prisma aesthetic (dark, warm cream, Cinzel, framer-motion animations) across 3 scenes: Hero → About → Projects.

**Architecture:** GSAP ScrollTrigger pins the viewport for 300vh, maps scroll progress 0→1 to `video.currentTime`, and drives scene opacity. Lenis handles smooth scroll. Three.js/R3F is deleted entirely. Framer-motion handles all UI animations.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind v4, GSAP, Lenis, framer-motion, lucide-react, Bun

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/lib/scenes.ts` | SCENES constant + sceneOpacity() |
| Create | `src/components/animations.tsx` | WordsPullUp + AnimatedText |
| Create | `src/components/VideoBackground.tsx` | forwardRef video element + overlays |
| Rewrite | `src/components/Portfolio.tsx` | Scroll orchestrator, navbar, scene layout |
| Rewrite | `src/components/Overlays.tsx` | Hero, About, Projects overlays |
| Modify | `src/styles.css` | Add noise-overlay utility, remove cave vars |
| Modify | `src/routes/index.tsx` | Update meta description |
| Modify | `package.json` | Remove R3F deps, add framer-motion |
| Delete | `src/components/Experience.tsx` | — |
| Delete | `src/components/scene/Cave.tsx` | — |
| Delete | `src/components/scene/Stations.tsx` | — |
| Delete | `src/components/scene/path.ts` | — |
| Delete | `src/components/scrollProgress.ts` | — |

---

## Task 1: Cleanup — delete R3F files and update dependencies

**Files:**
- Delete: `src/components/Experience.tsx`
- Delete: `src/components/scene/Cave.tsx`
- Delete: `src/components/scene/Stations.tsx`
- Delete: `src/components/scene/path.ts`
- Delete: `src/components/scrollProgress.ts`
- Modify: `package.json`

- [ ] **Step 1: Delete R3F source files**

```bash
rm /c/Users/alexs/Desktop/carved/src/components/Experience.tsx
rm /c/Users/alexs/Desktop/carved/src/components/scrollProgress.ts
rm /c/Users/alexs/Desktop/carved/src/components/scene/Cave.tsx
rm /c/Users/alexs/Desktop/carved/src/components/scene/Stations.tsx
rm /c/Users/alexs/Desktop/carved/src/components/scene/path.ts
rmdir /c/Users/alexs/Desktop/carved/src/components/scene
```

- [ ] **Step 2: Remove R3F deps and add framer-motion**

Run in `C:/Users/alexs/Desktop/carved/`:
```bash
bun remove @react-three/fiber @react-three/drei @react-three/postprocessing three postprocessing
bun add framer-motion
```

Expected output: packages removed/added with no errors.

- [ ] **Step 3: Verify build still compiles**

```bash
bun build
```

Expected: build may error on missing imports in Portfolio.tsx/Overlays.tsx — that is expected and will be fixed in later tasks. If it errors ONLY on those two files, proceed. If it errors elsewhere, investigate.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add -A
git commit -m "delete: remove Three.js cave, R3F deps — redesign starting"
```

---

## Task 2: Assets — copy video to public/

**Files:**
- Create: `public/hero.mp4`

- [ ] **Step 1: Copy video**

```bash
cp "/c/Users/alexs/Downloads/hf_20260521_114640_94f16403-bf02-4017-97b6-b9d7166a31c4.mp4" /c/Users/alexs/Desktop/carved/public/hero.mp4
```

- [ ] **Step 2: Verify file exists**

```bash
ls -lh /c/Users/alexs/Desktop/carved/public/hero.mp4
```

Expected: file present, size > 0.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add public/hero.mp4
git commit -m "add: hero video background asset"
```

---

## Task 3: Foundation — scenes utility + noise CSS

**Files:**
- Create: `src/lib/scenes.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Create `src/lib/scenes.ts`**

```ts
export const SCENES = 3;

export function sceneOpacity(progress: number, scene: number): number {
  const seg = 1 / (SCENES - 1);
  const center = scene * seg;
  const dist = Math.abs(progress - center);
  return Math.max(0, 1 - dist / seg);
}
```

- [ ] **Step 2: Add noise-overlay utility to `src/styles.css`**

Add this block inside the existing `@layer utilities { }` block, after the last existing utility (`.scene-overlay > *`):

```css
  .noise-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
  }
```

- [ ] **Step 3: Verify no syntax errors**

```bash
cd /c/Users/alexs/Desktop/carved && bun dev
```

Open browser at `http://localhost:5173`. The page will be broken (Portfolio.tsx still imports deleted files) — that is expected. Close dev server. Confirm bun dev started without CSS errors in terminal output.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add src/lib/scenes.ts src/styles.css
git commit -m "add: scenes utility and noise-overlay CSS"
```

---

## Task 4: Animation components

**Files:**
- Create: `src/components/animations.tsx`

- [ ] **Step 1: Create `src/components/animations.tsx`**

```tsx
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

// ─── WordsPullUp ───────────────────────────────────────────────

interface WordsPullUpProps {
  text: string;
  className?: string;
}

export function WordsPullUp({ text, className = "" }: WordsPullUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── AnimatedText ──────────────────────────────────────────────

function AnimatedLetter({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const charProgress = index / total;
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)],
    [0.2, 1],
  );
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = text.split("");

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <AnimatedLetter
          key={i}
          char={char}
          index={i}
          total={chars.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/alexs/Desktop/carved && bun run lint
```

Expected: no errors in `animations.tsx`. Other files may still error — ignore those.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add src/components/animations.tsx
git commit -m "add: WordsPullUp and AnimatedText animation components"
```

---

## Task 5: VideoBackground component

**Files:**
- Create: `src/components/VideoBackground.tsx`

- [ ] **Step 1: Create `src/components/VideoBackground.tsx`**

```tsx
import { forwardRef } from "react";

export const VideoBackground = forwardRef<HTMLVideoElement>((_, ref) => (
  <div className="absolute inset-0">
    <video
      ref={ref}
      src="/hero.mp4"
      muted
      playsInline
      preload="auto"
      className="h-full w-full object-cover"
    />
    <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
  </div>
));

VideoBackground.displayName = "VideoBackground";
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/alexs/Desktop/carved && bun run lint
```

Expected: no errors in `VideoBackground.tsx`.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add src/components/VideoBackground.tsx
git commit -m "add: VideoBackground component with noise and gradient overlays"
```

---

## Task 6: Overlays — Hero, About, Projects

**Files:**
- Rewrite: `src/components/Overlays.tsx`

- [ ] **Step 1: Rewrite `src/components/Overlays.tsx`**

```tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink, ArrowRight, MapPin } from "lucide-react";
import { sceneOpacity } from "@/lib/scenes";
import { WordsPullUp, AnimatedText } from "@/components/animations";

function fadeStyle(progress: number, scene: number): React.CSSProperties {
  const o = sceneOpacity(progress, scene);
  return {
    opacity: o,
    transform: `translateY(${(1 - o) * 16}px)`,
    transition: "opacity 0.15s linear, transform 0.3s ease-out",
    pointerEvents: o > 0.3 ? "auto" : "none",
  };
}

const PROJECTS = [
  {
    name: "salaryscope-api",
    desc: "GraphQL API serving 137k+ salary records. Apollo Server, Prisma, PostgreSQL, Elasticsearch, OAuth 2.0 PKCE, JWT.",
    tags: ["GraphQL", "Prisma", "Elasticsearch", "OAuth PKCE"],
    github: "https://github.com/BackEndByAlex/salaryscope-api",
    live: "https://backendbyalex.nu/graphql",
  },
  {
    name: "salaryscope-wt",
    desc: "Salary insights dashboard consuming the GraphQL API. Interactive globe with MapLibre, Apollo Client, filters across 137k data points.",
    tags: ["React", "Apollo Client", "MapLibre", "Vite"],
    github: "https://github.com/BackEndByAlex/salaryscope-wt",
    live: "https://backendbyalex.nu",
  },
  {
    name: "token-auth",
    desc: "Standalone JWT auth service — refresh token rotation, role-based access control, secure HttpOnly cookies.",
    tags: ["Node", "JWT", "RBAC", "Security"],
    github: "https://github.com/BackEndByAlex/token-auth",
    live: null,
  },
];

// ─── Hero ─────────────────────────────────────────────────────

export function HeroOverlay({
  progress,
  onScrollToProjects,
}: {
  progress: number;
  onScrollToProjects: () => void;
}) {
  return (
    <div className="scene-overlay items-end px-4 pb-12 sm:px-8 sm:pb-16">
      <div style={fadeStyle(progress, 0)} className="max-w-5xl">
        <WordsPullUp
          text="Alexandru C.A"
          className="font-display text-[14vw] font-bold leading-none text-primary sm:text-[12vw] lg:text-[10vw]"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 sm:text-xs">
          Web Developer · Linnaeus University
        </p>
        <button
          onClick={onScrollToProjects}
          className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition hover:bg-primary/90"
        >
          See my work
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────

function InfoRow({ k, v, last }: { k: string; v: React.ReactNode; last?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2 ${last ? "" : "border-b border-primary/10"}`}
    >
      <span className="text-[10px] uppercase tracking-wider text-primary/40 sm:text-xs">{k}</span>
      <span className="text-right text-xs text-primary/80 sm:text-sm">{v}</span>
    </div>
  );
}

export function AboutOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-4 py-14 sm:px-8 sm:py-0">
      <div
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
        style={fadeStyle(progress, 1)}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/50 sm:text-xs">
            // about
          </p>
          <WordsPullUp
            text="Building things that actually work."
            className="mt-3 font-display text-3xl font-semibold leading-tight sm:mt-4 md:text-5xl"
          />
          <AnimatedText
            text="Second year at Linnaeus University. I treat every school assignment as a real project — applying best practices, understanding how everything works, and always asking why."
            className="mt-4 text-sm leading-relaxed text-gray-400 sm:mt-6 sm:text-base"
          />
          <AnimatedText
            text="Most of my time goes to researching best practices, finding the best way to make things secure, and learning how to work effectively with AI."
            className="mt-3 text-sm leading-relaxed text-gray-400 sm:mt-4"
          />
        </div>
        <div className="self-center rounded-lg border border-primary/20 bg-[#101010] p-4 font-mono backdrop-blur sm:p-6">
          <InfoRow k="Name" v="Alexandru C.A" />
          <InfoRow k="Role" v="Web developer student" />
          <InfoRow k="Year" v="Year 2 · LNU" />
          <InfoRow k="Mode" v="Backend-leaning, full-stack" />
          <InfoRow k="Status" v={<span className="text-primary">Open to work</span>} />
          <InfoRow
            k="Location"
            v={
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> SE · Kalmar
              </span>
            }
            last
          />
        </div>
      </div>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────

export function ProjectsOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-4 py-14 sm:px-8 sm:py-0">
      <div className="mx-auto w-full max-w-6xl" style={fadeStyle(progress, 2)}>
        <div className="mb-6 text-center sm:mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/50 sm:text-xs">
            // projects
          </p>
          <WordsPullUp
            text="My latest work."
            className="mt-2 font-display text-3xl font-semibold sm:mt-3 md:text-5xl"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.15, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
      className="flex flex-col rounded-lg border border-primary/10 bg-[#212121] p-4 sm:p-5"
    >
      <span className="font-display text-lg text-primary sm:text-xl">{project.name}</span>
      <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">{project.desc}</p>
      <div className="mt-auto flex flex-wrap gap-1 pt-3">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded border border-primary/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary/50"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded border border-primary/20 bg-black/40 px-3 py-1.5 text-[11px] text-primary/60 transition hover:border-primary/60 hover:text-primary"
        >
          <Github className="h-3 w-3" /> GitHub
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-primary/20 bg-black/40 px-3 py-1.5 text-[11px] text-primary/60 transition hover:border-primary/60 hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" /> Live
          </a>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Run lint**

```bash
cd /c/Users/alexs/Desktop/carved && bun run lint
```

Expected: no errors in `Overlays.tsx`.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add src/components/Overlays.tsx
git commit -m "add: Hero, About, Projects overlays with Prisma aesthetic"
```

---

## Task 7: Portfolio — scroll orchestrator (main rewrite)

**Files:**
- Rewrite: `src/components/Portfolio.tsx`

- [ ] **Step 1: Rewrite `src/components/Portfolio.tsx`**

```tsx
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { VideoBackground } from "@/components/VideoBackground";
import { HeroOverlay, AboutOverlay, ProjectsOverlay } from "@/components/Overlays";
import { SCENES } from "@/lib/scenes";

const SNAP_DELAY = 500;

const NAV_ITEMS = [
  { label: "About", scene: 1 },
  { label: "Projects", scene: 2 },
  { label: "Contact", scene: 2 },
];

export function Portfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ smoothWheel: true, duration: 1.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let snapTimeout: ReturnType<typeof setTimeout>;

    const snapToNearestScene = () => {
      const seg = 1 / (SCENES - 1);
      const current = progressRef.current;
      const nearest = Math.round(current / seg);
      const target = nearest * seg;
      if (Math.abs(current - target) < 0.01) return;
      const wrapperTop = wrapperRef.current?.offsetTop ?? 0;
      const totalDistance = (SCENES - 1) * window.innerHeight;
      lenis.scrollTo(wrapperTop + target * totalDistance, { duration: 1.0 });
    };

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current!,
      start: "top top",
      end: () => `+=${(SCENES - 1) * 100}%`,
      pin: pinRef.current!,
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
        const video = videoRef.current;
        if (video?.duration) video.currentTime = self.progress * video.duration;
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(snapToNearestScene, SNAP_DELAY);
      },
    });

    return () => {
      clearTimeout(snapTimeout);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      trigger.kill();
    };
  }, []);

  const scrollToScene = useCallback((index: number) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const wrapperTop = wrapperRef.current?.offsetTop ?? 0;
    const totalDistance = (SCENES - 1) * window.innerHeight;
    const target = (index / (SCENES - 1)) * totalDistance;
    lenis.scrollTo(wrapperTop + target, { duration: 1.4 });
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ height: `${SCENES * 100}vh` }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-black">
        <VideoBackground ref={videoRef} />

        {/* Navbar */}
        <nav className="pointer-events-auto absolute left-1/2 top-0 z-30 flex -translate-x-1/2 items-center gap-6 rounded-b-2xl bg-black px-6 py-3 sm:gap-10 sm:px-10">
          {NAV_ITEMS.map(({ label, scene }) => (
            <button
              key={label}
              onClick={() => scrollToScene(scene)}
              className="font-mono text-[9px] uppercase tracking-[0.3em] transition-colors duration-150 sm:text-[10px]"
              style={{ color: "rgba(225,224,204,0.7)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.7)")}
            >
              {label}
            </button>
          ))}
        </nav>

        <HeroOverlay progress={progress} onScrollToProjects={() => scrollToScene(2)} />
        <AboutOverlay progress={progress} />
        <ProjectsOverlay progress={progress} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and verify the site loads**

```bash
cd /c/Users/alexs/Desktop/carved && bun dev
```

Open `http://localhost:5173`. Verify:
- Site loads without a white screen
- Video plays/is visible in background
- Navbar appears at top center
- Hero overlay shows name and CTA button
- Scrolling transitions between Hero → About → Projects
- Snap-to-scene fires after stopping scroll

- [ ] **Step 3: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add src/components/Portfolio.tsx
git commit -m "refactor: Portfolio rewrite — video scrub, 3 scenes, Prisma nav"
```

---

## Task 8: Update meta description

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Update meta in `src/routes/index.tsx`**

Replace the `head()` return value with:

```tsx
head: () => ({
  meta: [
    { title: "Alexandru C.A — Web Developer" },
    {
      name: "description",
      content:
        "Portfolio of Alexandru C.A — web developer student at Linnaeus University. Projects, skills, and an honest look at how I build things.",
    },
    { property: "og:title", content: "Alexandru C.A — Web Developer" },
    {
      property: "og:description",
      content:
        "Scroll through my work — backend APIs, full-stack projects, and the tools I use to keep getting better.",
    },
  ],
}),
```

Also update the Suspense fallback text from `"entering the cave…"` to `"loading…"`:

```tsx
fallback={
  <div className="flex h-screen items-center justify-center bg-black">
    <span className="font-mono text-xs uppercase tracking-[0.4em] text-primary/60">
      loading…
    </span>
  </div>
}
```

- [ ] **Step 2: Final check — lint + dev**

```bash
cd /c/Users/alexs/Desktop/carved && bun run lint && bun dev
```

Expected: zero lint errors, site loads correctly.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/alexs/Desktop/carved
git add src/routes/index.tsx
git commit -m "update: meta description and loading state for new design"
```

---

## Self-Review

**Spec coverage:**
- ✅ Three.js/R3F deleted — Task 1
- ✅ Video scrubbed by scroll — Task 7 (Portfolio.tsx onUpdate)
- ✅ 3 scenes (Hero, About, Projects) — Tasks 6 + 7
- ✅ Noise overlay on video — Task 5 (VideoBackground.tsx)
- ✅ WordsPullUp animation — Task 4
- ✅ AnimatedText scroll character animation — Task 4
- ✅ Warm cream palette (#E1E0CC = `text-primary`) — uses existing Tailwind primary token
- ✅ Cinzel font — already loaded in index.html, `font-display` utility exists in styles.css
- ✅ Navbar — Task 7
- ✅ Project cards with stagger animation — Task 6
- ✅ Snap-to-scene — Task 7
- ✅ framer-motion added, R3F removed — Task 1

**No placeholders:** All steps contain complete code.

**Type consistency:** `sceneOpacity` defined in `src/lib/scenes.ts`, imported in `Overlays.tsx`. `VideoBackground` uses `forwardRef<HTMLVideoElement>`, ref passed as `videoRef` in `Portfolio.tsx`. `SCENES` imported from `src/lib/scenes.ts` in `Portfolio.tsx`. All consistent.
