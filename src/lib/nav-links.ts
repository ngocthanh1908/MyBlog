export type NavLink = {
  label: string;
  href: string;
  /** Short blurb shown on a section landing page. */
  description?: string;
  children?: readonly NavLink[];
};

/** Site navigation, excluding the implicit "Trang chủ". "Sở thích" groups the hobby pages. */
export const navLinks: readonly NavLink[] = [
  { label: "Bài viết", href: "/blog" },
  { label: "Về tôi", href: "/about" },
  {
    label: "Sở thích",
    href: "/hobbies",
    children: [
      {
        label: "Chạy bộ",
        href: "/habits",
        description: "Cung đường chạy và sức bền kiên trì — nhật ký luyện tập MAF Running.",
      },
      {
        label: "Viết về những người thân yêu của tôi",
        href: "/nguoi-than",
        description: "Những dòng viết dành cho gia đình và những người tôi thương yêu.",
      },
    ],
  },
  { label: "RSS", href: "/rss.xml" },
];

/** True when `pathname` is the link itself or any page below it (a parent is active while a child is open). */
export function isNavLinkActive(link: NavLink, pathname: string): boolean {
  if (pathname === link.href || pathname.startsWith(`${link.href}/`)) return true;
  return (link.children ?? []).some((child) => isNavLinkActive(child, pathname));
}
