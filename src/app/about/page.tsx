import { Database, Brain, Code, Mail } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { BentoCard } from "@/components/home/bento-card";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { siteConfig } from "@/lib/site-config";
import { bio, expertiseAreas, interests } from "@/data/about-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Senior SAP Consultant, AI Architect, and marathon runner — learn about my background, expertise, and interests.",
  openGraph: {
    images: [
      {
        url: "/og?title=About&description=Senior+SAP+Consultant%2C+AI+Architect%2C+and+marathon+runner",
        width: 1200,
        height: 630,
      },
    ],
  },
};

/** Maps icon name strings from about-data to lucide-react components */
const iconMap = { Database, Brain, Code } as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* ── Heading & Bio ── */}
      <FadeUp>
        <h1 className="mb-6 text-3xl font-bold">About Me</h1>
        <div className="space-y-4">
          {bio.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </FadeUp>

      {/* ── Expertise ── */}
      <FadeUp delay={0.1}>
        <h2 className="mb-6 mt-14 text-2xl font-semibold">Expertise</h2>
      </FadeUp>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {expertiseAreas.map((area, i) => {
          const Icon = iconMap[area.iconName];
          return (
            <BentoCard key={area.title} delay={0.15 + i * 0.08}>
              <Icon size={24} className="mb-3 text-accent" aria-hidden="true" />
              <h3 className="mb-2 font-semibold">{area.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {area.description}
              </p>
            </BentoCard>
          );
        })}
      </div>

      {/* ── Interests ── */}
      <FadeUp delay={0.35}>
        <h2 className="mb-6 mt-14 text-2xl font-semibold">Interests</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {interests.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent"
            >
              <h3 className="mb-1 font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* ── Social Links ── */}
      <FadeUp delay={0.45}>
        <div className="mt-14 flex items-center gap-5">
          <a
            href={siteConfig.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-accent"
          >
            <GitHubIcon size={22} />
          </a>
          <a
            href={siteConfig.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted transition-colors hover:text-accent"
          >
            <LinkedInIcon size={22} />
          </a>
          <a
            href={siteConfig.socialLinks.email}
            aria-label="Email"
            className="text-muted transition-colors hover:text-accent"
          >
            <Mail size={22} />
          </a>
        </div>
      </FadeUp>
    </div>
  );
}
