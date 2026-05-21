import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Portfolio = lazy(() =>
  import("@/components/Portfolio").then((m) => ({ default: m.Portfolio })),
);

export const Route = createFileRoute("/")({
  component: Index,
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
});

function Index() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-black">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-primary/60">
            loading…
          </span>
        </div>
      }
    >
      <Portfolio />
    </Suspense>
  );
}
