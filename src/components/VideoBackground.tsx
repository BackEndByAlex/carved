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
