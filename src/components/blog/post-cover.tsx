"use client";

import { useEffect, useRef, useState } from "react";

interface PostCoverProps {
  src?: string;
  alt: string;
  topic: string;
  className?: string;
}

/** Only same-origin paths: the site CSP (img-src 'self') blocks anything else. */
function isLocalPath(src: string | undefined): src is string {
  return !!src && src.startsWith("/") && !src.startsWith("//") && !src.includes("\\");
}

/**
 * 16:9 cover. Shows the image when `src` is a local path that loads;
 * otherwise a gradient with the topic label. Both share the same box,
 * so adding an image later never shifts the layout.
 */
export function PostCover({ src, alt, topic, className = "" }: PostCoverProps) {
  // Track the failing src (not a boolean) so a new src gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<string>();
  const imgRef = useRef<HTMLImageElement>(null);
  const showImage = isLocalPath(src) && failedSrc !== src;

  // The image can fail before hydration, so onError never fires: check once mounted
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailedSrc(src);
  }, [src]);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-lg bg-accent-light ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- runtime uploads; see plan decisions
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:brightness-90"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-light to-accent-border"
        >
          <span className="font-serif text-2xl font-semibold tracking-tight text-accent">
            {topic}
          </span>
        </div>
      )}
    </div>
  );
}
