import { Suspense } from "react";
import { getPublicPosts, getAllTags } from "@/lib/mdx-utils";
import { BlogIndex } from "@/components/blog/blog-index";

export const metadata = {
  title: "Bài viết",
  description: "Chia sẻ về SAP, AI, chạy bộ và công nghệ.",
};

export default function BlogPage() {
  const posts = getPublicPosts();
  const tags = getAllTags();

  return (
    <div className="site-container-wide animate-slide-up">
      <section className="mb-5">
        <h1 className="font-serif text-[1.9rem] font-medium mb-1">
          <span className="italic text-accent font-semibold">Bài viết</span>
        </h1>
        <p className="text-muted text-[0.98rem]">
          Chia sẻ về SAP, AI, chạy bộ và những suy ngẫm về công nghệ.
        </p>
      </section>

      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <BlogIndex posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
