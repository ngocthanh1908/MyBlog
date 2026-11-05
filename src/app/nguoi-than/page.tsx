import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/blog-card";
import { NOINDEX_ROBOTS, getFamilyPosts } from "@/lib/family-posts";
import { getAllPosts } from "@/lib/mdx-utils";

export const metadata: Metadata = {
  title: "Viết về những người thân yêu của tôi",
  description: "Những dòng viết dành cho gia đình và những người tôi thương yêu.",
  robots: NOINDEX_ROBOTS,
};

export default function FamilyPage() {
  const posts = getFamilyPosts(getAllPosts());

  return (
    <div className="site-container animate-slide-up" data-pagefind-ignore="all">
      <section className="mb-8">
        <h1 className="font-serif text-[2.2rem] font-medium mb-2">Viết về những người thân yêu của tôi</h1>
        <p className="text-muted text-[1.05rem]">
          Những dòng viết dành cho gia đình và những người tôi thương yêu.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-muted">Những dòng viết đầu tiên sẽ sớm xuất hiện ở đây.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
