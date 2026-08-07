import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { TagFilter } from "@/components/blog/tag-filter";
import { SearchBox } from "@/components/blog/search-box";

export const metadata = {
  title: "Bài viết",
  description: "Chia sẻ về SAP, AI, chạy bộ và công nghệ.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-[820px] mx-auto px-6 animate-slide-up">
      <section className="mb-11 bg-surface p-9 rounded-[20px] border border-border shadow-[var(--card-shadow)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
        <h2 className="font-serif text-[2.2rem] font-medium mb-4">
          Tất cả <span className="italic text-accent font-semibold">bài viết</span>
        </h2>
        <p className="text-muted text-[1.05rem]">
          Chia sẻ về SAP, AI, chạy bộ và những suy ngẫm về công nghệ.
        </p>
      </section>

      <Suspense>
        <SearchBox />
      </Suspense>

      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <TagFilter posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
