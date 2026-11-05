import { Suspense } from "react";
import { getPublicPosts, getAllTags } from "@/lib/mdx-utils";
import { BlogIndex } from "@/components/blog/blog-index";

/** Home: one card per topic (featured post + related links), same grid as /blog. */
export default function Home() {
  const posts = getPublicPosts();
  const tags = getAllTags();

  return (
    <div className="site-container-wide animate-slide-up">
      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <BlogIndex posts={posts} tags={tags} showSearch={false} />
      </Suspense>
    </div>
  );
}
