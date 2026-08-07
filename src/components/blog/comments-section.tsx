"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function CommentsSection() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-serif text-[1.6rem] font-medium mb-6">Binh luan</h2>
      <Giscus
        repo="ngocthanh1908/MyBlog"
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
        category="Announcements"
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="vi"
        loading="lazy"
      />
    </section>
  );
}
