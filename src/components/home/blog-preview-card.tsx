import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/mdx-utils";
import { BentoCard } from "./bento-card";

export function BlogPreviewCard() {
  const posts = getAllPosts();
  const latest = posts[0];

  return (
    <BentoCard delay={0.2}>
      <div className="flex items-center gap-2">
        <BookOpen size={20} className="text-accent" />
        <h3 className="font-bold">Blog</h3>
      </div>
      {latest ? (
        <>
          <p className="mt-3 text-sm font-medium">{latest.title}</p>
          <p className="mt-1 text-xs text-muted">
            {latest.date} &middot; {latest.tags.join(", ")}
          </p>
          <Link
            href={`/blog/${latest.slug}`}
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            Read more &rarr;
          </Link>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted">No posts yet.</p>
      )}
    </BentoCard>
  );
}
