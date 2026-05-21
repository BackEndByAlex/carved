import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { VideoBackground, type VideoBackgroundHandle } from "@/components/VideoBackground";
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
  const bgRef = useRef<VideoBackgroundHandle | null>(null);
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
        bgRef.current?.setProgress(self.progress);
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
        <VideoBackground ref={bgRef} />

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
