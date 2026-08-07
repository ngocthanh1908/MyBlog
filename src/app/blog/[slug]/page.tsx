import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx-utils";
import { blogPostJsonLd } from "@/lib/structured-data";
import { FontSizer } from "@/components/blog/font-sizer";
import { CommentsSection } from "@/components/blog/comments-section";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => <h1 {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <h2 {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <h3 {...props} />,
  p: (props: React.ComponentProps<"p">) => <p {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol {...props} />,
  li: (props: React.ComponentProps<"li">) => <li {...props} />,
  a: ({ href, ...props }: React.ComponentProps<"a">) => {
    const safeHref = href && /^javascript:/i.test(href) ? undefined : href;
    return <a href={safeHref} rel="noopener noreferrer" {...props} />;
  },
  img: ({ src, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} loading="lazy" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => <strong {...props} />,
  em: (props: React.ComponentProps<"em">) => <em {...props} />,
  code: (props: React.ComponentProps<"code">) => <code {...props} />,
  pre: (props: React.ComponentProps<"pre">) => <pre {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote {...props} />
  ),
  hr: (props: React.ComponentProps<"hr">) => <hr {...props} />,
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        images: [
          {
            url: `/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt)}`,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch {
    return { title: "Không tìm thấy bài viết" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const readTime = post.readTime ?? Math.max(1, Math.ceil((post.content.length || 500) / 1000));

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  return (
    <div className="max-w-[820px] mx-auto px-6 animate-slide-up">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostJsonLd(post)),
        }}
      />

      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 bg-surface border border-border text-primary font-semibold text-[0.88rem] px-4 py-2 rounded-lg mb-7 transition-colors hover:border-accent hover:text-accent no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách bài viết
      </Link>

      {/* Article detail card */}
      <article className="bg-surface border border-border rounded-[20px] p-12 mb-12 shadow-[var(--card-shadow)]">
        {/* Reader controls */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 text-[0.84rem] text-muted font-medium">
            <span className="bg-accent-light text-accent px-2.5 py-0.5 rounded-md font-bold text-[0.75rem] uppercase tracking-wider">
              {post.tags[0] || "Bài viết"}
            </span>
            <span>•</span>
            <span>
              {new Date(post.date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{readTime} phút đọc</span>
          </div>
          <FontSizer />
        </div>

        {/* Title */}
        <h1 className="font-serif text-[2.6rem] font-semibold leading-[1.25] mb-5 tracking-tight">
          {post.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none mt-7"
          style={{ fontSize: "var(--reading-font-size)" }}
        >
          <div className="[&_p]:text-muted [&_p]:mb-[22px] [&_p]:leading-[1.8] [&_h3]:font-serif [&_h3]:text-[1.6rem] [&_h3]:mt-9 [&_h3]:mb-4 [&_h3]:text-primary [&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline">
            {content}
          </div>
        </div>
      </article>

      <CommentsSection />
    </div>
  );
}
