import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  siteTitle,
  siteTitleFr,
  siteDescription,
  siteDescriptionFr,
  siteKeywords,
  siteKeywordsFr,
  canonicalUrl,
  twitterHandle,
  robotsIndex,
  favicon,
  ogImage,
  visitorFallbackAvatar
}`);

export interface SiteSettings {
  siteTitle?: string | null;
  siteTitleFr?: string | null;
  siteDescription?: string | null;
  siteDescriptionFr?: string | null;
  siteKeywords?: string[] | null;
  siteKeywordsFr?: string[] | null;
  canonicalUrl?: string | null;
  twitterHandle?: string | null;
  robotsIndex?: boolean | null;
  faviconUrl?: string | null;
  ogImageUrl?: string | null;
  visitorFallbackAvatarUrl?: string | null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  if (!data) return {};

  const imageUrl = (
    source: unknown,
    width: number,
    height: number,
  ): string | null => {
    if (!source) return null;
    try {
      return urlFor(source)
        .width(width)
        .height(height)
        .fit("crop")
        .format("png")
        .url();
    } catch {
      return null;
    }
  };

  return {
    ...data,
    faviconUrl: imageUrl(data.favicon, 128, 128),
    ogImageUrl: imageUrl(data.ogImage, 1200, 630),
    visitorFallbackAvatarUrl: imageUrl(data.visitorFallbackAvatar, 160, 160),
  };
}
