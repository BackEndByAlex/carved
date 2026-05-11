import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Experience from "@/components/Experience";
import { progressRef, sceneOpacity, SCENES } from "@/components/scrollProgress";
import {
  HeroOverlay,
  AboutOverlay,
  SkillsOverlay,
  ProjectsOverlay,
  CVOverlay,
  AIOverlay,
  BehindBuildOverlay,
} from "@/components/Overlays";

const SCROLL_PER_SCENE = 100; // vh per scene
const SNAP_DELAY = 500; // ms idle before snapping

export function Portfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [progress, setProgress] = useState(0);
  const [hoveredScene, setHoveredScene] = useState<number | null>(null);

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
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Experience />
        </div>

        {/* Top bar */}
        {(() => {
          const currentScene = Math.round(progress * (SCENES - 1));
          const isDevScene = currentScene === SCENES - 1;
          return (
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/60 sm:px-6 sm:py-5 sm:text-xs">
              <span className="truncate pr-2">Alexandru C.A</span>
              {isDevScene
                ? <span className="shrink-0 text-cyan-glow">// DEV</span>
                : <span className="shrink-0 text-amber-glow">SCENE {currentScene + 1} / {SCENES - 1}</span>
              }
              <span className="hidden md:inline">scroll · explore the cave</span>
            </div>
          );
        })()}

        {/* Progress rail */}
        {(() => {
          const SCENE_NAMES = ["Hero", "About", "Skills", "Projects", "CV", "AI Journey"];
          const currentScene = Math.round(progress * (SCENES - 1));
          return (
            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-6 sm:gap-3">
              {/* 6 main scene dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {SCENE_NAMES.map((name, i) => {
                  const active = sceneOpacity(progress, i) > 0.4;
                  const hovered = hoveredScene === i;
                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      {/* hover label */}
                      <span
                        className="pointer-events-none absolute bottom-4 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest transition-all duration-200 sm:bottom-5 sm:text-[10px]"
                        style={{
                          opacity: hovered ? 1 : 0,
                          color: active ? "var(--amber-glow)" : "oklch(0.65 0.02 70)",
                          transform: hovered ? "translateY(0)" : "translateY(4px)",
                        }}
                      >
                        {name}
                      </span>
                      <button
                        onClick={() => scrollToScene(i)}
                        onMouseEnter={() => setHoveredScene(i)}
                        onMouseLeave={() => setHoveredScene(null)}
                        className="flex items-center justify-center px-1 py-3 transition-all duration-200"
                        style={{ background: "transparent" }}
                      >
                        <span
                          className="rounded-full transition-all duration-200"
                          style={{
                            width: hovered ? "2.8rem" : active ? "2.2rem" : "1.6rem",
                            height: hovered || active ? "4px" : "2px",
                            display: "block",
                            background: active || hovered ? "var(--amber-glow)" : "oklch(0.3 0.02 60 / 0.5)",
                            boxShadow: active ? "0 0 12px var(--amber-glow)" : hovered ? "0 0 8px var(--amber-glow)" : "none",
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* divider */}
              <span className="h-3 w-px bg-foreground/20" />

              {/* DEV scene button */}
              {(() => {
                const devActive = currentScene === SCENES - 1;
                const devHovered = hoveredScene === SCENES - 1;
                return (
                  <button
                    onClick={() => scrollToScene(SCENES - 1)}
                    onMouseEnter={() => setHoveredScene(SCENES - 1)}
                    onMouseLeave={() => setHoveredScene(null)}
                    className="rounded border px-3 py-2 font-mono text-[9px] uppercase tracking-widest transition-all duration-200 sm:text-[10px]"
                    style={{
                      borderColor: devActive || devHovered ? "var(--cyan-glow)" : "oklch(0.3 0.02 60 / 0.4)",
                      color: devActive || devHovered ? "var(--cyan-glow)" : "oklch(0.45 0.02 70)",
                      boxShadow: devActive ? "0 0 10px oklch(0.82 0.14 200 / 0.5)" : "none",
                      background: devActive || devHovered ? "oklch(0.82 0.14 200 / 0.08)" : "transparent",
                    }}
                  >
                    // dev
                  </button>
                );
              })()}
            </div>
          );
        })()}

        {/* Scene overlays */}
        <HeroOverlay progress={progress} onScrollToProjects={() => scrollToScene(3)} />
        <AboutOverlay progress={progress} />
        <SkillsOverlay progress={progress} />
        <ProjectsOverlay progress={progress} />
        <CVOverlay progress={progress} />
        <AIOverlay progress={progress} />
        <BehindBuildOverlay progress={progress} />
      </div>
    </div>
  );
}
