import { Bot } from "lucide-react";
import { BentoCard } from "./bento-card";

export function AiSpotlightCard() {
  return (
    <BentoCard delay={0.15}>
      <div className="flex items-center gap-2">
        <Bot size={20} className="text-accent" />
        <h3 className="font-bold">AI Spotlight</h3>
      </div>
      <p className="mt-3 text-sm text-muted">
        Building AI agents that augment SAP consulting workflows — from
        automated documentation to intelligent data migration assistants.
      </p>
    </BentoCard>
  );
}
