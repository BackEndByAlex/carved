import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Experience from "@/components/Experience";
import { progressRef, sceneOpacity } from "@/components/scrollProgress";
import {
  HeroOverlay,
  AboutOverlay,
  SkillsOverlay,
  ProjectsOverlay,
  CVOverlay,
  AIOverlay,
} from "@/components/Overlays";

const SCENES = 6;
const SCROLL_PER_SCENE = 100; // vh per scene
const SNAP_DELAY = 500; // ms idle before snapping

export function Portfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
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
      end: () => `+=${(SCENES - 1) * SCROLL_PER_SCENE}%`,
      pin: pinRef.current!,
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
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

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ height: `${SCENES * 100}vh` }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Experience />
        </div>

        {/* Top bar */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/60 sm:px-6 sm:py-5 sm:text-xs">
          <span className="truncate pr-2">Alexandru C.A</span>
          <span className="shrink-0 text-amber-glow">SCENE {Math.min(SCENES, Math.floor(progress * (SCENES - 1)) + 1)} / {SCENES}</span>
          <span className="hidden md:inline">scroll · explore the cave</span>
        </div>

        {/* Progress rail */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2">
          {Array.from({ length: SCENES }).map((_, i) => {
            const active = sceneOpacity(progress, i) > 0.4;
            return (
              <span
                key={i}
                className="h-0.5 w-7 rounded-full transition-all sm:h-1 sm:w-10"
                style={{
                  background: active ? "var(--amber-glow)" : "oklch(0.3 0.02 60 / 0.5)",
                  boxShadow: active ? "0 0 12px var(--amber-glow)" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Scene overlays */}
        <HeroOverlay progress={progress} />
        <AboutOverlay progress={progress} />
        <SkillsOverlay progress={progress} />
        <ProjectsOverlay progress={progress} />
        <CVOverlay progress={progress} />
        <AIOverlay progress={progress} />
      </div>
    </div>
  );
}
