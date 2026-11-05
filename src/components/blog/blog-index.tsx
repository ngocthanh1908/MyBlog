"use client";

import { useSearchParams } from "next/navigation";
import { SearchBox } from "./search-box";
import { TagFilter } from "./tag-filter";
import { TopicSection } from "@/components/home/topic-section";
import { groupPostsByTopic } from "@/lib/group-posts-by-topic";
import type { BlogPost } from "@/lib/mdx-utils";

interface BlogIndexProps {
  posts: BlogPost[];
  tags: string[];
  /** The home page shows the bare topic grid; /blog keeps the search box above it. */
  showSearch?: boolean;
}

/**
 * Posts index. Without a `?tag=` it shows one card per topic (grid sized in globals.css `.topic-grid`);
 * with a tag it falls back to the filtered list with search and tag pills.
 */
export function BlogIndex({ posts, tags, showSearch = true }: BlogIndexProps) {
  const activeTag = useSearchParams().get("tag");
  if (activeTag) return <TagFilter posts={posts} tags={tags} />;

  const groups = groupPostsByTopic(posts);

  return (
    <>
      {showSearch && (
        <div className="mb-5">
          <SearchBox />
        </div>
      )}
      {groups.length === 0 ? (
        <p className="py-12 text-center text-muted">Chưa có bài viết nào.</p>
      ) : (
        <div className="topic-grid">
          {groups.map((group) => (
            <TopicSection key={group.topic} {...group} />
          ))}
        </div>
      )}
    </>
  );
}
