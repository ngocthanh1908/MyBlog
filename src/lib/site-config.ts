import { navLinks } from "@/lib/nav-links";

export const siteConfig = {
  name: "Phạm Ngọc Thanh",
  authorHandle: "@ngocthanh1908",
  subtitle: "SAP Basis & Human Tech Journal",
  description:
    "Nhật ký công nghệ SAP Basis, phát triển sản phẩm AI và góc suy ngẫm chạy bộ marathon của Phạm Ngọc Thanh tại TP. Hồ Chí Minh.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  navLinks,
  socialLinks: {
    blog: "https://blog.phamngocthanh.io.vn",
    github: "https://github.com/ngocthanh1908",
    linkedin: "https://www.linkedin.com/in/pham-ngoc-thanh-81345b39/",
    email: "mailto:phamngocthanh@gmail.com",
  },
} as const;
