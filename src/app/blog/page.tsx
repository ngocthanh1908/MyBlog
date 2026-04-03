import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { FadeUp } from "@/components/motion/fade-up";
import { TagFilter } from "@/components/blog/tag-filter";

export const metadata = {
  title: "Blog",
  description: "Thoughts on SAP, AI, running, and mindfulness.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <FadeUp>
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted">Articles</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-[1.1] mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Thoughts on SAP, AI, software engineering, running, and mindfulness.
          </p>
        </div>
      </FadeUp>

      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <TagFilter posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
