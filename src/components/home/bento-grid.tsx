import { FeaturedProjectCard } from "./featured-project-card";
import { AiSpotlightCard } from "./ai-spotlight-card";
import { BlogPreviewCard } from "./blog-preview-card";
import { LatestRunCard } from "./latest-run-card";

export function BentoGrid() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Featured Project — spans 2 cols, 2 rows on desktop */}
        <div className="md:col-span-2 lg:row-span-2">
          <FeaturedProjectCard />
        </div>

        {/* AI Spotlight */}
        <div className="lg:col-span-2">
          <AiSpotlightCard />
        </div>

        {/* Blog Preview */}
        <div className="lg:col-span-2">
          <BlogPreviewCard />
        </div>

        {/* Latest Run — full width */}
        <div className="md:col-span-2 lg:col-span-4">
          <LatestRunCard />
        </div>
      </div>
    </section>
  );
}
