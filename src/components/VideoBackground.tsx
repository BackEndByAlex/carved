import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";

const FRAME_COUNT = 240;
const FRAME_PATH = (i: number) =>
  `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

export interface VideoBackgroundHandle {
  setProgress: (progress: number) => void;
}

export const VideoBackground = forwardRef<VideoBackgroundHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const readyRef = useRef(false);

  useImperativeHandle(ref, () => ({
    setProgress: (progress: number) => {
      progressRef.current = progress;
    },
  }));

  useEffect(() => {
    let loadedCount = 0;
    const images = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) readyRef.current = true;
      };
      return img;
    });
    framesRef.current = images;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let rafId: number;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const idx = Math.min(
          Math.floor(progressRef.current * (FRAME_COUNT - 1)),
          FRAME_COUNT - 1,
        );
        const frame = framesRef.current[idx];
        if (frame?.complete && frame.naturalWidth > 0) {
          const cw = canvas.width;
          const ch = canvas.height;
          const ir = frame.naturalWidth / frame.naturalHeight;
          const cr = cw / ch;
          let dw: number, dh: number, dx: number, dy: number;
          if (ir > cr) {
            dh = ch;
            dw = dh * ir;
            dx = (cw - dw) / 2;
            dy = 0;
          } else {
            dw = cw;
            dh = dw / ir;
            dx = 0;
            dy = (ch - dh) / 2;
          }
          ctx.drawImage(frame, dx, dy, dw, dh);
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
    </div>
  );
});

VideoBackground.displayName = "VideoBackground";
