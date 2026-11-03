"use client";

import { useSearchParams } from "next/navigation";
import { SearchBox } from "./search-box";
import { TagFilter } from "./tag-filter";
import { TopicSection } from "@/components/home/topic-section";
import { groupAllPosts, groupPostsByTopic } from "@/lib/group-posts-by-topic";
import type { BlogPost } from "@/lib/mdx-utils";

interface BlogIndexProps {
  posts: BlogPost[];
  tags: string[];
}

/**
 * Posts index. Without a `?tag=` it shows the topic cards ("Tất cả" first, then one per tag);
 * with a tag it falls back to the filtered list with search and tag pills.
 */
export function BlogIndex({ posts, tags }: BlogIndexProps) {
  const activeTag = useSearchParams().get("tag");
  if (activeTag) return <TagFilter posts={posts} tags={tags} />;

  const allGroup = groupAllPosts(posts);
  const groups = [...(allGroup ? [allGroup] : []), ...groupPostsByTopic(posts)];

  return (
    <>
      <div className="mb-10">
        <SearchBox />
      </div>
      {groups.length === 0 ? (
        <p className="py-12 text-center text-muted">Chưa có bài viết nào.</p>
      ) : (
        <div className="grid items-stretch gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <TopicSection key={group.topic} {...group} />
          ))}
        </div>
      )}
    </>
  );
}
