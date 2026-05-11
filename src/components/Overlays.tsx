import { sceneOpacity } from "./scrollProgress";
import { ArrowDown, Download, Github, Linkedin, MapPin, ExternalLink } from "lucide-react";

function withFade(progress: number, scene: number): React.CSSProperties {
  const o = sceneOpacity(progress, scene);
  return {
    opacity: o,
    transform: `translateY(${(1 - o) * 24}px)`,
    transition: "opacity 0.2s linear, transform 0.4s ease-out",
    pointerEvents: o > 0.5 ? "auto" : "none",
  };
}

const PROJECTS = [
  {
    name: "salaryscope-api",
    desc: "GraphQL API serving 137k+ salary records. Apollo Server, Prisma, PostgreSQL, Elasticsearch, OAuth 2.0 PKCE, JWT — a school project that became my biggest API implementation.",
    tags: ["GraphQL", "Prisma", "Elasticsearch", "OAuth PKCE"],
    url: "https://github.com/BackEndByAlex/salaryscope-api",
  },
  {
    name: "salaryscope-wt",
    desc: "Salary insights dashboard consuming the GraphQL API. Interactive globe with MapLibre, Apollo Client, filters across 137k data points.",
    tags: ["React", "Apollo Client", "MapLibre", "Vite"],
    url: "https://github.com/BackEndByAlex/salaryscope-wt",
  },
  {
    name: "token-auth",
    desc: "Standalone JWT auth service — refresh token rotation, role-based access control, secure HttpOnly cookies. A school project for understanding how JWT really works under the hood.",
    tags: ["Node", "JWT", "RBAC", "Security"],
    url: "https://github.com/BackEndByAlex/token-auth",
  },
];

const SKILLS = [
  { t: "GraphQL · Apollo", d: "Schema-first APIs, resolvers, server functions" },
  { t: "PostgreSQL · Prisma", d: "Relational data, migrations, typed queries" },
  { t: "React · Vite", d: "Component design, Apollo Client, map UIs" },
  { t: "JWT · OAuth PKCE", d: "Auth flows, token rotation, secure cookies" },
  { t: "JavaScript", d: "The language, deeply" },
  { t: "Security & Privacy", d: "Defaults that protect" },
];

const AI_TOOLS = [
  { name: "GitHub Copilot", since: "2024", role: "First AI tool. Autocomplete, inline suggestions while coding.", tone: "amber" },
  { name: "ChatGPT", since: "2025", role: "Debugging, explanations, rubber duck at scale, learning.", tone: "cyan" },
  { name: "Claude", since: "2026", role: "Deep reasoning, architecture thinking, long-context work, security reviews, code review, and system design.", tone: "amber" },
  { name: "Gemini", since: "2026", role: "Research, Google ecosystem integration, quick lookups.", tone: "cyan" },
] as const;

// ─────── Hero ───────
export function HeroOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center justify-center px-6 text-center">
      <div className="max-w-2xl" style={withFade(progress, 0)}>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-glow">Stone · Circuits · Code</p>
        <h1 className="mt-5 font-display text-6xl font-bold leading-none text-amber-glow md:text-8xl">
          Alexandru C.A
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-foreground/75 md:text-lg">
          Web Developer Student — year two, growing roots in code, branches in systems, myself train.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/Alexandru_C_A_CV.pdf"
            download
            className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background/40 px-5 py-3 text-sm font-medium text-foreground/60 backdrop-blur transition hover:border-amber-glow/60 hover:text-amber-glow hover:bg-background/60"
          >
            <Download className="h-4 w-4" /> Download CV
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background/40 px-5 py-3 text-sm font-medium text-foreground/60 backdrop-blur transition hover:border-cyan-glow/60 hover:text-cyan-glow hover:bg-background/60"
          >
            See my work <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-16 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-foreground/50">
          <ArrowDown className="h-3 w-3 animate-bounce" /> scroll to descend
        </div>
      </div>
    </div>
  );
}

// ─────── About ───────
export function AboutOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-6">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2" style={withFade(progress, 1)}>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-amber-glow">// 02 · about</p>
          <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">A student carving paths through stone.</h2>
          <p className="mt-6 max-w-md text-foreground/75">
            Second year at Linnaeus University. I write projects with perspective — keeping them alive,
            trying to make them secure, and learning by shipping. APIs, auth flows, the boring bits
            that keep things alive at 3am.
          </p>
          <p className="mt-4 max-w-md text-foreground/60">
            Most of my time and coffee goes to researching best practices, finding the best way to make
            projects secure, and a drive to learn how to co-work with AI and get as effective as I can.
          </p>
        </div>
        <div className="self-center rounded-lg border border-cyan-glow/40 bg-background/70 p-6 font-mono text-sm backdrop-blur">
          <Row k="Name"     v="Alexandru C.A" />
          <Row k="Role"     v="Web developer student" />
          <Row k="Year"     v="Year 2 · LNU" />
          <Row k="Mode"     v="Backend-leaning, full-stack capable" />
          <Row k="Status"   v={<span className="text-amber-glow">Open to work</span>} />
          <Row k="Location" v={<span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> SE · Kalmar</span>} last />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, last }: { k: string; v: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${last ? "" : "border-b border-border/60"}`}>
      <span className="text-foreground/50 uppercase tracking-wider text-xs">{k}</span>
      <span className="text-foreground/90 text-right">{v}</span>
    </div>
  );
}

// ─────── Skills ───────
export function SkillsOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-6">
      <div className="mx-auto w-full max-w-6xl" style={withFade(progress, 2)}>
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-glow">// 03 · skills</p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Six pillars holding the chamber up.</h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {SKILLS.map((s, i) => (
            <li
              key={s.t}
              className="group rounded-md border border-border bg-background/70 p-5 backdrop-blur transition hover:border-amber-glow"
              style={{ animation: `pulse 4s ${i * 0.3}s ease-in-out infinite` }}
            >
              <div className="font-mono text-xs text-amber-glow">0{i + 1}</div>
              <div className="mt-1 font-display text-xl">{s.t}</div>
              <div className="mt-1 text-xs text-foreground/60">{s.d}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────── Projects ───────
export function ProjectsOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-6" id="projects">
      <div className="mx-auto w-full max-w-6xl" style={withFade(progress, 3)}>
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-amber-glow">// 04 · projects</p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Slabs lifted from the floor.</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-lg border border-cyan-glow/30 bg-background/75 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-glow"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">{p.name}</span>
                <ExternalLink className="h-4 w-4 text-cyan-glow opacity-60 group-hover:opacity-100" />
              </div>
              <p className="mt-2 text-sm text-foreground/70">{p.desc}</p>
              <div className="mt-auto flex flex-wrap gap-1 pt-4">
                {p.tags.map((t) => (
                  <span key={t} className="rounded border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/60">{t}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────── CV / Contact ───────
export function CVOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-6" id="cv">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2" style={withFade(progress, 4)}>
        <div className="rounded-lg border border-amber-glow/40 bg-background/75 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-amber-glow">// education</p>
          <ul className="mt-3 space-y-4 text-sm">
            <li>
              <p className="font-display text-base text-foreground/90">SI-ledarutbildning</p>
              <p className="text-foreground/60">Linnéuniversitetet, Kalmar</p>
              <p className="font-mono text-xs text-foreground/40">Aug 2025</p>
            </li>
            <li className="border-t border-border/40 pt-4">
              <p className="font-display text-base text-foreground/90">Webbprogrammerare</p>
              <p className="text-foreground/60">Linnéuniversitetet, Kalmar</p>
              <p className="font-mono text-xs text-foreground/40">Aug 2024 → Jun 2027</p>
            </li>
            <li className="border-t border-border/40 pt-4">
              <p className="font-display text-base text-foreground/90">Teknikprogrammet</p>
              <p className="text-foreground/60">Teknikum, Växjö · informations- och medieteknik</p>
              <p className="font-mono text-xs text-foreground/40">Aug 2020 → Jun 2023</p>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-cyan-glow/40 bg-background/75 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-glow">// experience</p>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <p className="font-display text-base text-foreground/90">Teaching Assistant <span className="font-sans text-foreground/50 font-normal">· Linnéuniversitetet, Kalmar</span></p>
              <p className="font-mono text-xs text-foreground/40">Sep 2025 → Apr 2026</p>
            </li>
            <li className="border-t border-border/40 pt-3">
              <p className="font-display text-base text-foreground/90">SI-Ledare HT 25 <span className="font-sans text-foreground/50 font-normal">· Linnéuniversitetet, Kalmar</span></p>
              <p className="font-mono text-xs text-foreground/40">Sep 2025 → Jan 2026</p>
            </li>
            <li className="border-t border-border/40 pt-3">
              <p className="font-display text-base text-foreground/90">IT-Tekniker <span className="font-sans text-foreground/50 font-normal">· Atea Logistics, Växjö</span></p>
              <p className="font-mono text-xs text-foreground/40">Jun 2025 → Aug 2025</p>
            </li>
            <li className="border-t border-border/40 pt-3">
              <p className="font-display text-base text-foreground/90">CNC Operatör <span className="font-sans text-foreground/50 font-normal">· SVAB Sweden, Alstermo</span></p>
              <p className="font-mono text-xs text-foreground/40">Jul 2023 → Aug 2024</p>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="https://linkedin.com/in/alexandru-ca/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-4 py-2 text-sm hover:border-cyan-glow"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/BackEndByAlex/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-4 py-2 text-sm hover:border-amber-glow"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href="/Alexandru_C_A_CV.pdf"
              download
              className="inline-flex items-center gap-2 rounded-md border border-amber-glow/40 bg-background/60 px-4 py-2 text-sm text-amber-glow hover:border-amber-glow"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────── AI Journey ───────
export function AIOverlay({ progress }: { progress: number }) {
  return (
    <div className="scene-overlay items-center px-6">
      <div className="mx-auto w-full max-w-6xl" style={withFade(progress, 5)}>
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-glow">// 06 · ai journey</p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Tools I use to become better.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/65">
            Each one makes me sharper — I use them to learn faster, think deeper, and grow at what I do.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {AI_TOOLS.map((tool) => (
            <li
              key={tool.name}
              className={`relative overflow-hidden rounded-lg border bg-background/75 p-5 backdrop-blur ${
                tool.tone === "amber" ? "border-amber-glow/40" : "border-cyan-glow/40"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl">{tool.name}</span>
                <span className={`font-mono text-xs uppercase tracking-wider ${tool.tone === "amber" ? "text-amber-glow" : "text-cyan-glow"}`}>
                  since {tool.since}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/75">{tool.role}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-foreground/40">
          end of cave · scroll back to surface
        </p>
      </div>
    </div>
  );
}
