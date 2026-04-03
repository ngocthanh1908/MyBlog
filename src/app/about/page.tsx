import { Database, Brain, Code, Mail } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
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

const iconMap = { Database, Brain, Code } as const;

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Hero Header */}
      <FadeUp>
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted">About Me</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-[1.1] mb-6">
            Building software &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
              running marathons
            </span>
          </h1>
          <div className="space-y-4">
            {bio.map((paragraph, i) => (
              <p key={i} className="text-lg leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Expertise */}
      <FadeUp delay={0.1}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-6">
          Expertise
        </h2>
      </FadeUp>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16">
        {expertiseAreas.map((area, i) => {
          const Icon = iconMap[area.iconName];
          return (
            <FadeUp key={area.title} delay={0.15 + i * 0.08}>
              <div className="bg-surface rounded-3xl border border-border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="bg-accent/10 p-3 rounded-2xl w-fit mb-4">
                  <Icon size={24} className="text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2">{area.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {area.description}
                </p>
              </div>
            </FadeUp>
          );
        })}
      </div>

      {/* Interests */}
      <FadeUp delay={0.3}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-6">
          Interests
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16">
          {interests.map((item) => (
            <div
              key={item.title}
              className="bg-surface rounded-3xl border border-border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Social Links */}
      <FadeUp delay={0.4}>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-3 text-muted hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
          >
            <GitHubIcon size={22} />
          </a>
          <a
            href={siteConfig.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-3 text-muted hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
          >
            <LinkedInIcon size={22} />
          </a>
          <a
            href={siteConfig.socialLinks.email}
            aria-label="Email"
            className="p-3 text-muted hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
          >
            <Mail size={22} />
          </a>
        </div>
      </FadeUp>
    </div>
  );
}
