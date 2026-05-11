import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Portfolio = lazy(() => import("@/components/Portfolio").then((m) => ({ default: m.Portfolio })));

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Alexandru C.A — Web Developer Student" },
      { name: "description", content: "A cinematic 3D portfolio carved into stone and circuits — backend, systems, and security from a year-two LNU student." },
      { property: "og:title", content: "Alexandru C.A — Web Developer Student" },
      { property: "og:description", content: "Stone and circuits — a scroll-driven 3D portfolio of projects, skills, and an honest AI journey." },
    ],
  }),
});

function Index() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-amber-glow">entering the cave…</span>
        </div>
      }
    >
      <Portfolio />
    </Suspense>
  );
}
