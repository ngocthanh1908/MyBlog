import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedArticle } from "@/components/home/featured-article";
import { BlogGrid } from "@/components/home/blog-grid";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const featuredPost = posts[0]; // Latest post as featured
  const recentPosts = posts.slice(1, 7); // Next 6 posts for grid

  return (
    <main>
      <HeroSection />
      {featuredPost && <FeaturedArticle post={featuredPost} />}
      <BlogGrid posts={recentPosts} tags={tags} />
      <NewsletterSection />
    </main>
  );
}
