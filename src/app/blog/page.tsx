import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { TagFilter } from "@/components/blog/tag-filter";

export const metadata = {
  title: "Blog",
  description: "Thoughts on SAP, AI, running, and mindfulness.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>
      <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
        <TagFilter posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
