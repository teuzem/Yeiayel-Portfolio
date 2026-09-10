import type { MetadataRoute } from "next";
import { getBlogAuthors, getBlogCategories, getBlogPosts } from "@/lib/blog";
import { getSiteSettings, getSiteUrl } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, posts, categories, authors] = await Promise.all([
    getSiteSettings(),
    getBlogPosts(),
    getBlogCategories(),
    getBlogAuthors(),
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
    for (const path of [
      "/blog",
      "/blog/articles",
      "/blog/categories",
      "/blog/topics",
      "/blog/reviews",
      "/blog/authors",
      "/blog/about",
      "/blog/search",
    ]) {
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "/blog" ? "daily" : "weekly",
        priority: path === "/blog" ? 0.8 : 0.6,
      });
    }
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

    entries.push(
      ...categories
        .filter((category) => category.slug)
        .map((category) => ({
          url: `${baseUrl}/blog/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        })),
    );

    entries.push(
      ...authors
        .filter((author) => author.slug)
        .map((author) => ({
          url: `${baseUrl}/blog/authors/${author.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        })),
    );

    const topics = Array.from(
      new Set(posts.flatMap((post) => post.tags || [])),
    );
    entries.push(
      ...topics.map((topic) => ({
        url: `${baseUrl}/blog/topics/${encodeURIComponent(topic)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
    );
  }

  return entries;
}
