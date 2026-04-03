import { siteConfig } from "@/lib/site-config";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <a
              href={siteConfig.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon size={24} />
            </a>
            <a
              href={siteConfig.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={24} />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 flex items-center gap-2 justify-center md:justify-start">
            <div className="w-6 h-6 bg-accent text-white rounded-md flex items-center justify-center font-bold text-xs">
              P
            </div>
            <p className="text-sm text-muted font-medium">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
