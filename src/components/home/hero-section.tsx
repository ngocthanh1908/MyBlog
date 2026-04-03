import { FadeUp } from "@/components/motion/fade-up";
import Link from "next/link";
import { Code, ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background blob */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <FadeUp>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-muted">Open to new projects</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] mb-6">
              Building Digital Products with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
                Code &amp; Design
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted mb-8 leading-relaxed">
              Hi, I&apos;m Ngoc Thanh. I share hands-on knowledge about Software Engineering,
              System Design, and the perspective of a developer who loves clean code.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-xl flex items-center gap-2"
              >
                Read Latest Posts
                <ArrowDown className="w-4 h-4" />
              </Link>
              <Link
                href="/projects"
                className="bg-surface hover:bg-surface/80 text-primary border border-border px-6 py-3 rounded-full font-semibold transition-all shadow-sm hover:shadow-md"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Hero image placeholder — replace with real image when available */}
        <FadeUp delay={0.2}>
          <div className="relative lg:ml-auto w-full max-w-md mx-auto">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative bg-gradient-to-br from-accent/20 to-blue-400/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="w-32 h-32 text-accent/30" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

              {/* Floating info card */}
              <div className="absolute bottom-6 left-6 right-6 bg-surface/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-2 rounded-xl text-accent">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">10+ Years Experience</p>
                    <p className="text-xs text-muted">SAP &amp; Software Engineering</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative dot grids */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 opacity-30 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-bd) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-32 h-32 opacity-30 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-bd) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
