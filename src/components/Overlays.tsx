import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Github, ExternalLink, ArrowRight, MapPin, Linkedin } from "lucide-react";
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

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
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

// ─── Contact ──────────────────────────────────────────────────

type FormStatus = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded border border-primary/20 bg-[#101010] px-4 py-2.5 text-sm text-primary/80 placeholder:text-primary/20 focus:border-primary/40 focus:outline-none transition-colors";

export function ContactOverlay({ progress }: { progress: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    const data = new FormData(formRef.current);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: data.get("from_name"),
          email: data.get("reply_to"),
          message: data.get("message"),
        }),
      });
      if (res.ok) {
        setStatus("sent");
        formRef.current.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="scene-overlay items-center px-4 py-14 sm:px-8 sm:py-0">
      <div className="mx-auto w-full max-w-4xl" style={fadeStyle(progress, 3)}>
        <div className="mb-8 text-center sm:mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/50 sm:text-xs">
            // contact
          </p>
          <WordsPullUp
            text="Let's work together."
            className="mt-2 font-display text-3xl font-semibold sm:mt-3 md:text-5xl"
          />
          <p className="mt-3 text-sm text-gray-400">
            Open to work opportunities, collaborations, and interesting projects.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-primary/40">
              Name
            </label>
            <input
              name="from_name"
              type="text"
              required
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-primary/40">
              Email
            </label>
            <input
              name="reply_to"
              type="email"
              required
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-primary/40">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="What are you working on?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center justify-between md:col-span-2">
            <div className="flex gap-2">
              <a
                href="https://github.com/BackEndByAlex"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-primary/20 bg-black/40 px-3 py-1.5 text-[11px] text-primary/60 transition hover:border-primary/60 hover:text-primary"
              >
                <Github className="h-3 w-3" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/alexandru-ca/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-primary/20 bg-black/40 px-3 py-1.5 text-[11px] text-primary/60 transition hover:border-primary/60 hover:text-primary"
              >
                <Linkedin className="h-3 w-3" /> LinkedIn
              </a>
            </div>

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="inline-flex items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition hover:bg-primary/90 disabled:opacity-60"
            >
              {status === "sent"
                ? "Message sent!"
                : status === "sending"
                  ? "Sending..."
                  : "Send message"}
              {status !== "sent" && status !== "sending" && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </span>
              )}
            </button>
          </div>

          {status === "error" && (
            <p className="font-mono text-xs text-red-400 md:col-span-2">
              Something went wrong. Email me directly at alexsept100@gmail.com
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
