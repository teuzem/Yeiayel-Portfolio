import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { getSiteSettings, getSiteUrl } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, posts] = await Promise.all([
    getSiteSettings(),
    getBlogPosts(),
  ]);
  const baseUrl = getSiteUrl(settings);

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  if (posts.length) {
    entries.push({
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });
    entries.push(
      ...posts
        .filter((post) => post.slug && !post.noIndex)
        .map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified:
            post.updatedAt || post.publishedAt || new Date().toISOString(),
          changeFrequency: "monthly" as const,
          priority: post.featured ? 0.8 : 0.7,
        })),
    );
  }

  return entries;
}
