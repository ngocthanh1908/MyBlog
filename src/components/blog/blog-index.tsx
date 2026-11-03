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
}

/**
 * Posts index. Without a `?tag=` it shows one compact card per topic (4 in a row on wide screens,
 * so the default view fits one screen); with a tag it falls back to the filtered list with search and tag pills.
 */
export function BlogIndex({ posts, tags }: BlogIndexProps) {
  const activeTag = useSearchParams().get("tag");
  if (activeTag) return <TagFilter posts={posts} tags={tags} />;

  const groups = groupPostsByTopic(posts);

  return (
    <>
      <div className="mb-5">
        <SearchBox />
      </div>
      {groups.length === 0 ? (
        <p className="py-12 text-center text-muted">Chưa có bài viết nào.</p>
      ) : (
        // items-start: expanding one card must not stretch its neighbours
        <div className="grid items-start gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <TopicSection key={group.topic} {...group} />
          ))}
        </div>
      )}
    </>
  );
}
