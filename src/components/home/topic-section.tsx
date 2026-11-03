"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PostCover } from "@/components/blog/post-cover";
import { UNTAGGED_TOPIC } from "@/lib/group-posts-by-topic";
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
 * One topic card: coloured tab on the top border and the featured post.
 * Collapsed by default (title, short excerpt, date, cover) so every card fits on one screen;
 * "Xem thêm" reveals the full excerpt and the "Bài cùng chủ đề" list.
 */
export function TopicSection({ topic, featured, related }: TopicSectionProps) {
  // useId: tags may contain spaces/diacritics, which break aria-labelledby id lists
  const headingId = useId();
  const detailsId = useId();
  const [expanded, setExpanded] = useState(false);
  // /blog?tag= matches real tags only
  const filterable = topic !== UNTAGGED_TOPIC;
  const label = `#${topic}`;
  const tab = getTopicTabColor(topic, !filterable);

  return (
    <section
      aria-labelledby={headingId}
      className="relative mt-5 flex flex-col rounded-[5px] border-2 border-card-border px-4 pb-3 pt-7"
    >
      <h2
        id={headingId}
        style={tab}
        className="absolute left-1/2 top-0 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-[3px] border-2 border-card-border text-center text-[0.95rem] font-bold leading-7"
      >
        {filterable ? (
          <Link href={`/blog?tag=${encodeURIComponent(topic)}`} className="block no-underline" style={{ color: tab.color }}>
            {label}
          </Link>
        ) : (
          label
        )}
      </h2>

      <Link href={`/blog/${featured.slug}`} className="group block no-underline">
        <h3 className={`text-[1.05rem] font-semibold leading-[1.3] text-primary ${expanded ? "" : "line-clamp-2"}`}>
          {featured.title}
        </h3>
        <p className={`mt-2 text-[0.9rem] leading-[1.5] text-muted ${expanded ? "" : "line-clamp-2"}`}>{featured.excerpt}</p>
        <p className="mt-2 text-right text-[0.8rem] text-muted">{formatDate(featured.date)}</p>
        <PostCover src={featured.coverImage} alt={featured.title} topic={topic} className="mt-2" />
      </Link>

      <div id={detailsId}>
        {expanded && (
          <>
            {related.length > 0 && (
              <div className="mt-4 border-t-2 border-dashed border-border pt-3">
                <h4 className="mb-2 text-[0.95rem] font-bold text-primary">Bài cùng chủ đề</h4>
                <ul className="flex flex-col gap-2">
                  {related.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex gap-2 text-[0.88rem] leading-snug text-muted no-underline hover:text-primary hover:underline"
                      >
                        <ArrowRight size={14} className="mt-1 shrink-0" aria-hidden="true" />
                        <span>{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 self-start text-[0.85rem] font-semibold text-accent hover:underline"
      >
        {expanded ? "Thu gọn" : "Xem thêm"}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
    </section>
  );
}
