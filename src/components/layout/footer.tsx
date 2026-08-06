import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="max-w-[820px] mx-auto px-6 border-t border-border py-10 text-center mt-20">
      <p className="text-muted text-[0.9rem] mb-2">
        &copy; {new Date().getFullYear()} {siteConfig.name}. Viết bằng sự chân thành từ TP. Hồ Chí Minh.
      </p>
      <p className="text-[0.82rem] text-muted mb-4">
        Minimalist & Human-Centric Design.
      </p>
      <div className="flex justify-center gap-6">
        <a
          href={siteConfig.socialLinks.blog}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted font-semibold hover:text-accent transition-colors text-sm"
        >
          blog.phamngocthanh.io.vn
        </a>
        <a
          href={siteConfig.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted font-semibold hover:text-accent transition-colors text-sm"
        >
          LinkedIn
        </a>
        <a
          href={siteConfig.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted font-semibold hover:text-accent transition-colors text-sm"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
