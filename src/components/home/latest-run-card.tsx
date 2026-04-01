import { Activity } from "lucide-react";
import { BentoCard } from "./bento-card";

export function LatestRunCard() {
  return (
    <BentoCard delay={0.3}>
      <div className="flex items-center gap-2">
        <Activity size={20} className="text-accent" />
        <h3 className="text-lg font-bold">Latest Run</h3>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">10</p>
          <p className="text-xs text-muted">km</p>
        </div>
        <div>
          <p className="text-2xl font-bold">135</p>
          <p className="text-xs text-muted">avg HR</p>
        </div>
        <div>
          <p className="text-2xl font-bold">6:15</p>
          <p className="text-xs text-muted">pace</p>
        </div>
      </div>

      <p className="mt-4 text-sm italic text-muted">
        &quot;The miracle isn&apos;t that I finished. The miracle is that I had
        the courage to start.&quot;
      </p>
    </BentoCard>
  );
}
