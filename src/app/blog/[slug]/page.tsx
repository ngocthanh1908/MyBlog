import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx-utils";
import { blogPostJsonLd } from "@/lib/structured-data";
import type { Metadata } from "next";

/** Only allow safe HTML elements in MDX [RT#12] */
const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => <h1 {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <h2 {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <h3 {...props} />,
  p: (props: React.ComponentProps<"p">) => <p {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol {...props} />,
  li: (props: React.ComponentProps<"li">) => <li {...props} />,
  a: ({ href, ...props }: React.ComponentProps<"a">) => {
    // Sanitize: block javascript: protocol [RT#12]
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

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">{post.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {post.date} &middot; {post.tags.join(", ")}
        </p>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  );
}
