import type { BlogPost } from "@/lib/mdx-utils";

export type TopicGroup = {
  topic: string;
  featured: BlogPost;
  related: BlogPost[];
  total: number;
};

export const UNTAGGED_TOPIC = "Khác";

// `|| 0`: an unparsable date must not turn the comparator into NaN (unstable sort)
const time = (p: BlogPost) => new Date(p.date).getTime() || 0;
const byDateDesc = (a: BlogPost, b: BlogPost) => time(b) - time(a);

/**
 * Group posts by tag. A post with several tags appears in the group of every tag.
 * Posts without tags go to "Khác".
 * Featured = newest post of the group; related = the next newest, capped.
 * Groups with more posts come first; ties go to the group with the newer featured post.
 * Pure (no fs/db) so it is safe in server and client components.
 */
export function groupPostsByTopic(posts: BlogPost[], relatedLimit = 5): TopicGroup[] {
  const buckets = new Map<string, BlogPost[]>();
  for (const post of posts) {
    // Set: a duplicated tag on one post must not list the post twice in a group
    const topics = post.tags.length > 0 ? new Set(post.tags) : [UNTAGGED_TOPIC];
    for (const topic of topics) {
      const bucket = buckets.get(topic);
      if (bucket) bucket.push(post);
      else buckets.set(topic, [post]);
    }
  }

  return Array.from(buckets, ([topic, list]) => {
    const sorted = list.slice().sort(byDateDesc);
    return {
      topic,
      featured: sorted[0],
      related: sorted.slice(1, 1 + relatedLimit),
      total: sorted.length,
    };
  }).sort((a, b) => b.total - a.total || byDateDesc(a.featured, b.featured));
}
