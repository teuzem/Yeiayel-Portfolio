import type { MetadataRoute } from "next";
import { getSiteSettings, getSiteUrl } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = getSiteUrl(settings);

  return {
    rules:
      settings.robotsIndex === false
        ? { userAgent: "*", disallow: "/" }
        : { userAgent: "*", allow: "/", disallow: ["/studio/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
