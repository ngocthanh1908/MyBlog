import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { label: "LinkedIn", href: siteConfig.socialLinks.linkedin },
  { label: "GitHub", href: siteConfig.socialLinks.github },
];

export function Footer() {
  return (
    <footer className="site-container mt-20">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-8 text-[0.88rem] text-muted">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. Viết bằng sự chân thành từ TP. Hồ Chí Minh.
        </p>
        <div className="flex gap-5">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
