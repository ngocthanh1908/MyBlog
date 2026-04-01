import type { ReactNode } from "react";
import { FadeUp } from "@/components/motion/fade-up";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({ children, className = "", delay }: BentoCardProps) {
  return (
    <FadeUp delay={delay}>
      <div
        className={`rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent ${className}`}
      >
        {children}
      </div>
    </FadeUp>
  );
}
