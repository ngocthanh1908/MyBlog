"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const buttonClasses =
  "bg-surface border border-border px-2.5 py-1 rounded-md text-primary font-bold hover:border-accent transition-colors inline-flex items-center gap-1.5";

/** Social share links (Facebook/X/LinkedIn) plus a copy-link button for the blog detail page. */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [clipboardFailed, setClipboardFailed] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setClipboardFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setClipboardFailed(true);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 whitespace-nowrap text-[0.85rem] text-muted font-semibold">
      <span>Chia sẻ:</span>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        Facebook
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        X
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        LinkedIn
      </a>
      <button onClick={handleCopy} className={buttonClasses}>
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Đã sao chép
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Sao chép liên kết
          </>
        )}
      </button>
      {clipboardFailed && (
        <input
          type="text"
          value={url}
          readOnly
          aria-label="Đường dẫn bài viết"
          className="bg-surface border border-border px-2 py-1 rounded-md text-primary text-[0.8rem] w-40"
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
    </div>
  );
}
