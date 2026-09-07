import {
  IconBrandApplePodcast,
  IconBrandAppstore,
  IconBrandBehance,
  IconBrandBitbucket,
  IconBrandBluesky,
  IconBrandCodepen,
  IconBrandCodesandbox,
  IconBrandDiscord,
  IconBrandDribbble,
  IconBrandFacebook,
  IconBrandFigma,
  IconBrandFlickr,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGooglePlay,
  IconBrandGooglePodcasts,
  IconBrandHackerrank,
  IconBrandInstagram,
  IconBrandLeetcode,
  IconBrandLinkedin,
  IconBrandLinktree,
  IconBrandMastodon,
  IconBrandMedium,
  IconBrandPatreon,
  IconBrandPinterest,
  IconBrandProducthunt,
  IconBrandReddit,
  IconBrandSnapchat,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconBrandStackoverflow,
  IconBrandTelegram,
  IconBrandThreads,
  IconBrandTiktok,
  IconBrandTumblr,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandVimeo,
  IconBrandVk,
  IconBrandWeibo,
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
  IconPhone,
  IconRobotFace,
  IconWorld,
} from "@tabler/icons-react";

/** A social/professional/podcast platform selectable in Sanity Studio. */
export interface SocialPlatform {
  /** Matching value of the Sanity `platform` select list. */
  value: string;
  icon: typeof IconWorld;
  /** Localized display label. */
  label: { en: string; fr: string };
}

/**
 * Catalog of every selectable platform. When a new platform is added here,
 * it also becomes available in Sanity Studio (see `san`/social schema) and
 * automatically gets its associated SVG brand icon on the website.
 */
export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  website: {
    value: "website",
    icon: IconWorld,
    label: { en: "Website", fr: "Site web" },
  },
  email: {
    value: "email",
    icon: IconMail,
    label: { en: "Email", fr: "Email" },
  },
  phone: {
    value: "phone",
    icon: IconPhone,
    label: { en: "Phone", fr: "Téléphone" },
  },
  github: {
    value: "github",
    icon: IconBrandGithub,
    label: { en: "GitHub", fr: "GitHub" },
  },
  gitlab: {
    value: "gitlab",
    icon: IconBrandGitlab,
    label: { en: "GitLab", fr: "GitLab" },
  },
  bitbucket: {
    value: "bitbucket",
    icon: IconBrandBitbucket,
    label: { en: "Bitbucket", fr: "Bitbucket" },
  },
  linkedin: {
    value: "linkedin",
    icon: IconBrandLinkedin,
    label: { en: "LinkedIn", fr: "LinkedIn" },
  },
  x: {
    value: "x",
    icon: IconBrandX,
    label: { en: "X (Twitter)", fr: "X (Twitter)" },
  },
  twitter: {
    value: "twitter",
    icon: IconBrandTwitter,
    label: { en: "Twitter", fr: "Twitter" },
  },
  facebook: {
    value: "facebook",
    icon: IconBrandFacebook,
    label: { en: "Facebook", fr: "Facebook" },
  },
  instagram: {
    value: "instagram",
    icon: IconBrandInstagram,
    label: { en: "Instagram", fr: "Instagram" },
  },
  youtube: {
    value: "youtube",
    icon: IconBrandYoutube,
    label: { en: "YouTube", fr: "YouTube" },
  },
  tiktok: {
    value: "tiktok",
    icon: IconBrandTiktok,
    label: { en: "TikTok", fr: "TikTok" },
  },
  snapchat: {
    value: "snapchat",
    icon: IconBrandSnapchat,
    label: { en: "Snapchat", fr: "Snapchat" },
  },
  threads: {
    value: "threads",
    icon: IconBrandThreads,
    label: { en: "Threads", fr: "Threads" },
  },
  bluesky: {
    value: "bluesky",
    icon: IconBrandBluesky,
    label: { en: "Bluesky", fr: "Bluesky" },
  },
  mastodon: {
    value: "mastodon",
    icon: IconBrandMastodon,
    label: { en: "Mastodon", fr: "Mastodon" },
  },
  reddit: {
    value: "reddit",
    icon: IconBrandReddit,
    label: { en: "Reddit", fr: "Reddit" },
  },
  discord: {
    value: "discord",
    icon: IconBrandDiscord,
    label: { en: "Discord", fr: "Discord" },
  },
  telegram: {
    value: "telegram",
    icon: IconBrandTelegram,
    label: { en: "Telegram", fr: "Telegram" },
  },
  whatsapp: {
    value: "whatsapp",
    icon: IconBrandWhatsapp,
    label: { en: "WhatsApp", fr: "WhatsApp" },
  },
  twitch: {
    value: "twitch",
    icon: IconBrandTwitch,
    label: { en: "Twitch", fr: "Twitch" },
  },
  vk: { value: "vk", icon: IconBrandVk, label: { en: "VK", fr: "VK" } },
  weibo: {
    value: "weibo",
    icon: IconBrandWeibo,
    label: { en: "Weibo", fr: "Weibo" },
  },
  tumblr: {
    value: "tumblr",
    icon: IconBrandTumblr,
    label: { en: "Tumblr", fr: "Tumblr" },
  },
  flickr: {
    value: "flickr",
    icon: IconBrandFlickr,
    label: { en: "Flickr", fr: "Flickr" },
  },
  vimeo: {
    value: "vimeo",
    icon: IconBrandVimeo,
    label: { en: "Vimeo", fr: "Vimeo" },
  },
  soundcloud: {
    value: "soundcloud",
    icon: IconBrandSoundcloud,
    label: { en: "SoundCloud", fr: "SoundCloud" },
  },
  spotify: {
    value: "spotify",
    icon: IconBrandSpotify,
    label: { en: "Spotify", fr: "Spotify" },
  },
  applepodcast: {
    value: "applepodcast",
    icon: IconBrandApplePodcast,
    label: { en: "Apple Podcasts", fr: "Apple Podcasts" },
  },
  googlepodcasts: {
    value: "googlepodcasts",
    icon: IconBrandGooglePodcasts,
    label: { en: "Google Podcasts", fr: "Google Podcasts" },
  },
  patreon: {
    value: "patreon",
    icon: IconBrandPatreon,
    label: { en: "Patreon", fr: "Patreon" },
  },
  producthunt: {
    value: "producthunt",
    icon: IconBrandProducthunt,
    label: { en: "Product Hunt", fr: "Product Hunt" },
  },
  medium: {
    value: "medium",
    icon: IconBrandMedium,
    label: { en: "Medium", fr: "Medium" },
  },
  stackoverflow: {
    value: "stackoverflow",
    icon: IconBrandStackoverflow,
    label: { en: "Stack Overflow", fr: "Stack Overflow" },
  },
  codepen: {
    value: "codepen",
    icon: IconBrandCodepen,
    label: { en: "CodePen", fr: "CodePen" },
  },
  codesandbox: {
    value: "codesandbox",
    icon: IconBrandCodesandbox,
    label: { en: "CodeSandbox", fr: "CodeSandbox" },
  },
  hackerrank: {
    value: "hackerrank",
    icon: IconBrandHackerrank,
    label: { en: "HackerRank", fr: "HackerRank" },
  },
  leetcode: {
    value: "leetcode",
    icon: IconBrandLeetcode,
    label: { en: "LeetCode", fr: "LeetCode" },
  },
  behance: {
    value: "behance",
    icon: IconBrandBehance,
    label: { en: "Behance", fr: "Behance" },
  },
  dribbble: {
    value: "dribbble",
    icon: IconBrandDribbble,
    label: { en: "Dribbble", fr: "Dribbble" },
  },
  figma: {
    value: "figma",
    icon: IconBrandFigma,
    label: { en: "Figma", fr: "Figma" },
  },
  pinterest: {
    value: "pinterest",
    icon: IconBrandPinterest,
    label: { en: "Pinterest", fr: "Pinterest" },
  },
  appstore: {
    value: "appstore",
    icon: IconBrandAppstore,
    label: { en: "App Store", fr: "App Store" },
  },
  googleplay: {
    value: "googleplay",
    icon: IconBrandGooglePlay,
    label: { en: "Google Play", fr: "Google Play" },
  },
  linktree: {
    value: "linktree",
    icon: IconBrandLinktree,
    label: { en: "Linktree", fr: "Linktree" },
  },
  huggingface: {
    value: "huggingface",
    icon: IconRobotFace,
    label: { en: "Hugging Face", fr: "Hugging Face" },
  },
};

/** Generic fallback for any platform without a dedicated brand icon. */
export const SOCIAL_FALLBACK: SocialPlatform = {
  value: "other",
  icon: IconWorld,
  label: { en: "Link", fr: "Lien" },
};

export function getSocialPlatform(
  platform: string | null | undefined,
): SocialPlatform {
  return SOCIAL_PLATFORMS[platform || ""] ?? SOCIAL_FALLBACK;
}

export function getPlatformLabel(
  platform: string | null | undefined,
  locale: "en" | "fr",
): string {
  return getSocialPlatform(platform).label[locale];
}

/** Select options consumed by the Sanity schema `socialLink` platform field. */
export function socialPlatformOptions() {
  return Object.entries(SOCIAL_PLATFORMS).map(([value, p]) => ({
    title: p.label.en,
    value,
  }));
}

/** Normalize a Sanity social link row into a render-safe object. */
// biome-ignore lint/suspicious/noExplicitAny: Sanity CMS row shape
export function normalizeSocialLink(row: any) {
  if (!row || !row.url) return null;
  return {
    id: row._key ?? `${row.platform ?? "link"}-${row.url}`,
    platform: row.platform,
    url: String(row.url).trim(),
    label: row.label?.trim() || null,
    showInContact: Boolean(row.showInContact),
    enabled: row.enabled === undefined ? true : Boolean(row.enabled),
  };
}

export type SocialLink = NonNullable<ReturnType<typeof normalizeSocialLink>>;
