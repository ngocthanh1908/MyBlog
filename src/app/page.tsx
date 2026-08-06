import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { HeroSection } from "@/components/home/hero-section";
import { HumanNote } from "@/components/home/human-note";
import { TagFilter } from "@/components/blog/tag-filter";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-[820px] mx-auto px-6 animate-slide-up">
      <HeroSection />
      <HumanNote />
      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <TagFilter posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
