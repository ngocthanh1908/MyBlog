"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content.trim()) {
    return <p className="text-muted text-sm italic">Xem truoc noi dung...</p>;
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-sm [&_img]:rounded-xl [&_img]:shadow-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
    </div>
  );
}
