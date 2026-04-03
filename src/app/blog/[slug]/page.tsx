import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx-utils";
import { blogPostJsonLd } from "@/lib/structured-data";
import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";

/** Only allow safe HTML elements in MDX */
const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => <h1 {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <h2 {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <h3 {...props} />,
  p: (props: React.ComponentProps<"p">) => <p {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol {...props} />,
  li: (props: React.ComponentProps<"li">) => <li {...props} />,
  a: ({ href, ...props }: React.ComponentProps<"a">) => {
    const safeHref =
      href && /^javascript:/i.test(href) ? undefined : href;
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
    return { title: "Post Not Found" };
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

  const readTime = Math.max(1, Math.ceil((post.content.length || 500) / 1000));

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <article className="max-w-3xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostJsonLd(post)),
          }}
        />

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-accent/10 text-accent uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
            <span className="text-sm text-muted font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.1]">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Pham Ngoc Thanh</p>
              <p className="text-xs text-muted">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-extrabold prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          {content}
        </div>
      </article>
    </div>
  );
}
