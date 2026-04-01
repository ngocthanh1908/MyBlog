import Link from "next/link";
import { FadeUp } from "@/components/motion/fade-up";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <FadeUp>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Engineering SAP Systems
          <br />
          <span className="text-accent">&amp; Running Marathons</span>
        </h1>
      </FadeUp>

      <FadeUp delay={0.1}>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          20 years in IT — Senior SAP Consultant turned AI-Enabled Architect.
          Sharing insights on technology, running, and mindfulness.
        </p>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="mt-8 flex gap-4">
          <Link
            href="/projects"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore Projects
          </Link>
          <Link
            href="/blog"
            className="rounded-xl border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface"
          >
            Read Blog
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}
