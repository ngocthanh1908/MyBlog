import { siteConfig } from "./site-config";

const PERSON_NAME = "Pham Ngoc Thanh";

/** Shared Person shape used by personJsonLd() and as blogPostJsonLd()'s publisher */
function personRef() {
  return {
    "@type": "Person" as const,
    name: PERSON_NAME,
  };
}

/** JSON-LD for Person (homepage) */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON_NAME,
    url: siteConfig.siteUrl,
    jobTitle: "Senior SAP Consultant & AI Architect",
    description: siteConfig.description,
    sameAs: [siteConfig.socialLinks.github, siteConfig.socialLinks.linkedin],
  };
}

/** JSON-LD for WebSite (homepage) */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    inLanguage: "vi-VN",
  };
}

/** JSON-LD for BreadcrumbList (blog post page) */
export function breadcrumbJsonLd(post: { title: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteConfig.siteUrl}/blog/${post.slug}`,
      },
    ],
  };
}

/** JSON-LD for BlogPosting */
export function blogPostJsonLd(post: {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
}) {
  const url = `${siteConfig.siteUrl}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    url,
    image: `${siteConfig.siteUrl}/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt)}`,
    keywords: post.tags.join(", "),
    articleSection: post.tags[0],
    inLanguage: "vi-VN",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: personRef(),
    publisher: personRef(),
  };
}
