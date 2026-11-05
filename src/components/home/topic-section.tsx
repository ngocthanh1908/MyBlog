import Link from "next/link";
import { PostCover } from "@/components/blog/post-cover";
import { UNTAGGED_TOPIC } from "@/lib/group-posts-by-topic";
import { siteConfig } from "@/lib/site-config";
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
 * One topic card, laid out like ehkoo.com: coloured tab on the top border, the featured post
 * (title, excerpt, author + date, 16:9 cover), then the always-visible "Bài cùng chủ đề" list.
 * Styles live in globals.css (.topic*).
 */
export function TopicSection({ topic, featured, related }: TopicSectionProps) {
  const headingId = `topic-${encodeURIComponent(topic)}`;
  // /blog?tag= matches real tags only
  const filterable = topic !== UNTAGGED_TOPIC;
  const tab = getTopicTabColor(topic, !filterable);
  const label = `#${topic}`;

  return (
    <section aria-labelledby={headingId} className="topic">
      <h2
        id={headingId}
        className="topic-title"
        style={{ background: tab.background, color: tab.color, borderColor: tab.color }}
      >
        {filterable ? <Link href={`/blog?tag=${encodeURIComponent(topic)}`}>{label}</Link> : label}
      </h2>

      <article className="topic-article group">
        <header>
          <Link href={`/blog/${featured.slug}`}>
            <h3 className="topic-article-title">{featured.title}</h3>
          </Link>
        </header>
        <div className="topic-article-body">
          <p className="text-[0.95rem] leading-[1.5] text-muted">{featured.excerpt}</p>
          <address className="topic-meta">
            <span>{siteConfig.authorHandle}</span>
            <time dateTime={featured.date}>{formatDate(featured.date)}</time>
          </address>
        </div>
        <figure className="m-0">
          <PostCover src={featured.coverImage} alt={featured.title} topic={topic} className="!rounded-2xl" />
        </figure>
      </article>

      {related.length > 0 && (
        <>
          <hr className="topic-separator" />
          <div>
            <h3 className="topic-related-title">Bài cùng chủ đề</h3>
            <ul className="topic-related">
              {related.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
