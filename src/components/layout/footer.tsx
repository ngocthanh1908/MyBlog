import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { siteConfig } from "@/lib/site-config";
import { ExternalLink } from "@/components/ui/external-link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>

        <div className="flex items-center gap-3">
          <ExternalLink
            href={siteConfig.socialLinks.github}
            className="text-muted transition-colors hover:text-primary"
            aria-label="GitHub"
          >
            <GitHubIcon size={16} />
          </ExternalLink>
          <ExternalLink
            href={siteConfig.socialLinks.linkedin}
            className="text-muted transition-colors hover:text-primary"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={16} />
          </ExternalLink>
          <ExternalLink
            href={siteConfig.socialLinks.email}
            className="text-muted transition-colors hover:text-primary"
            aria-label="Email"
          >
            <Mail size={16} />
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
}
