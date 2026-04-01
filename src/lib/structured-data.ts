import { siteConfig } from "./site-config";

/** JSON-LD for Person (homepage) */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pham Ngoc Thanh",
    url: siteConfig.siteUrl,
    jobTitle: "Senior SAP Consultant & AI Architect",
    description: siteConfig.description,
    sameAs: [siteConfig.socialLinks.github, siteConfig.socialLinks.linkedin],
  };
}

/** JSON-LD for BlogPosting */
export function blogPostJsonLd(post: {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Pham Ngoc Thanh",
    },
  };
}
