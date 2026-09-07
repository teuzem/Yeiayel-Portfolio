import {
  getPlatformLabel,
  getSocialPlatform,
  normalizeSocialLink,
  type SocialLink,
} from "@/lib/social";
import { cn } from "@/lib/utils";

interface SocialLinkItem {
  platform?: string | null;
  url?: string | null;
  label?: string | null;
  showInContact?: boolean;
}

export function socialHref(
  platform: string | null | undefined,
  rawUrl: string,
): string {
  const url = rawUrl.trim();
  switch (platform) {
    case "email":
      return url.startsWith("mailto:") ? url : `mailto:${url}`;
    case "phone":
      return url.startsWith("tel:") ? url : `tel:${url}`;
    case "whatsapp": {
      const digits = url.replace(/\D/g, "");
      return digits ? `https://wa.me/${digits}` : url;
    }
    default:
      return /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
  }
}

/** Renders a row of social/professional/podcast links as brand icon buttons. */
export function SocialLinks({
  links,
  locale,
  size = "md",
  showInContact,
}: {
  links?: (SocialLinkItem | null)[] | null;
  locale: "en" | "fr";
  size?: "sm" | "md";
  showInContact?: boolean;
}) {
  const items = (links ?? [])
    .map(normalizeSocialLink)
    .filter((l): l is SocialLink => Boolean(l))
    .filter((l) => l.enabled)
    .filter((l) =>
      showInContact === undefined ? true : l.showInContact === showInContact,
    );

  if (items.length === 0) return null;

  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((link) => {
        const platform = getSocialPlatform(link.platform);
        const displayLabel =
          link.label || getPlatformLabel(link.platform, locale);
        const Icon = platform.icon;
        return (
          <a
            key={link.id}
            href={socialHref(link.platform, link.url)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={displayLabel}
            title={displayLabel}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-foreground transition-colors hover:bg-muted hover:text-primary hover:border-primary/40",
              box,
            )}
          >
            <Icon className={icon} strokeWidth={1.6} />
          </a>
        );
      })}
    </div>
  );
}
