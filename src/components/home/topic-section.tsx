import { useId } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCover } from "@/components/blog/post-cover";
import { ALL_TOPIC, UNTAGGED_TOPIC } from "@/lib/group-posts-by-topic";
import { getTopicTabColor } from "@/lib/topic-tab-color";
import type { BlogPost } from "@/lib/mdx-utils";

interface TopicSectionProps {
  topic: string;
  featured: BlogPost;
  related: BlogPost[];
  total?: number;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });

/**
 * One topic card: coloured tab on the top border, featured post (title, excerpt,
 * date, cover) and a dashed-divided "Bài cùng chủ đề" list.
 */
export function TopicSection({ topic, featured, related }: TopicSectionProps) {
  // useId: tags may contain spaces/diacritics, which break aria-labelledby id lists
  const headingId = useId();
  const isAll = topic === ALL_TOPIC;
  // /blog?tag= matches real tags only; "Tất cả" goes to the unfiltered index
  const filterable = topic !== UNTAGGED_TOPIC;
  const href = isAll ? "/blog" : `/blog?tag=${encodeURIComponent(topic)}`;
  const label = isAll ? topic : `#${topic}`;
  const tab = getTopicTabColor(topic, isAll || !filterable);

  return (
    <section
      aria-labelledby={headingId}
      className="relative mt-5 flex flex-col rounded-[5px] border-2 border-card-border px-5 pb-6 pt-8"
    >
      <h2
        id={headingId}
        style={tab}
        className="absolute left-1/2 top-0 w-[calc(100%-2.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-[3px] border-2 border-card-border text-center text-[1rem] font-bold leading-8"
      >
        {filterable ? (
          <Link href={href} className="block no-underline" style={{ color: tab.color }}>
            {label}
          </Link>
        ) : (
          label
        )}
      </h2>

      <Link href={`/blog/${featured.slug}`} className="group block no-underline">
        <h3 className="text-[1.3rem] font-semibold leading-[1.3] text-primary">{featured.title}</h3>
        <p className="mt-3 line-clamp-4 text-[1rem] leading-[1.6] text-muted">{featured.excerpt}</p>
        <p className="mt-4 text-right text-[0.88rem] text-muted">{formatDate(featured.date)}</p>
        <PostCover src={featured.coverImage} alt={featured.title} topic={topic} className="mt-3" />
      </Link>

      {related.length > 0 && (
        <div className="mt-5 border-t-2 border-dashed border-border pt-4">
          <h4 className="mb-3 text-[1.05rem] font-bold text-primary">
            {isAll ? "Các bài khác" : "Bài cùng chủ đề"}
          </h4>
          <ul className="flex flex-col gap-2.5">
            {related.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex gap-2 text-[0.95rem] leading-snug text-muted no-underline hover:text-primary hover:underline"
                >
                  <ArrowRight size={14} className="mt-1 shrink-0" aria-hidden="true" />
                  <span>{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
