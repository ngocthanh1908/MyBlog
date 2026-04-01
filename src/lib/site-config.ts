export const siteConfig = {
  name: "Thanh.dev",
  description:
    "Senior SAP Consultant, AI-Enabled Architect, Marathon Runner — sharing insights on technology, running, and mindfulness.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  navLinks: [
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Habits", href: "/habits" },
  ],
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:hello@example.com",
  },
} as const;
