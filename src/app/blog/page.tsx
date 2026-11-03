import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { BlogIndex } from "@/components/blog/blog-index";

export const metadata = {
  title: "Bài viết",
  description: "Chia sẻ về SAP, AI, chạy bộ và công nghệ.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="site-container animate-slide-up">
      <section className="mb-8">
        <h1 className="font-serif text-[2.2rem] font-medium mb-2">
          Tất cả <span className="italic text-accent font-semibold">bài viết</span>
        </h1>
        <p className="text-muted text-[1.05rem]">
          Chia sẻ về SAP, AI, chạy bộ và những suy ngẫm về công nghệ.
        </p>
      </section>

      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <BlogIndex posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
