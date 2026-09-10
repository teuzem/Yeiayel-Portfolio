import type { TypedObject } from "@portabletext/types";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

export interface BlogImage {
  asset?: { _ref?: string };
  alt?: string | null;
  caption?: string | null;
}

export interface BlogPost {
  _id: string;
  title?: string | null;
  titleFr?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  excerptFr?: string | null;
  content?: TypedObject[] | null;
  contentFr?: TypedObject[] | null;
  featuredImage?: BlogImage | null;
  ogImage?: BlogImage | null;
  category?: string | null;
  categoryRef?: {
    title?: string | null;
    titleFr?: string | null;
    slug?: string | null;
    color?: string | null;
  } | null;
  tags?: string[] | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  readTime?: number | null;
  featured?: boolean | null;
  trending?: boolean | null;
  contentType?: string | null;
  seoTitle?: string | null;
  seoTitleFr?: string | null;
  seoDescription?: string | null;
  seoDescriptionFr?: string | null;
  noIndex?: boolean | null;
  author?: {
    name?: string | null;
    role?: string | null;
    roleFr?: string | null;
    image?: BlogImage | null;
  } | null;
  product?: {
    name?: string | null;
    brand?: string | null;
    score?: number | null;
    url?: string | null;
  } | null;
  sources?: Array<{
    title?: string | null;
    publisher?: string | null;
    url?: string | null;
    accessedAt?: string | null;
  }> | null;
}

export interface BlogSettings {
  name?: string | null;
  nameFr?: string | null;
  logo?: BlogImage | null;
  heroTitle?: string | null;
  heroTitleFr?: string | null;
  heroDescription?: string | null;
  heroDescriptionFr?: string | null;
  position?: string | null;
  positionFr?: string | null;
  accentColor?: string | null;
}

const POST_FIELDS = `
  _id,
  title,
  titleFr,
  "slug": slug.current,
  excerpt,
  excerptFr,
  content,
  contentFr,
  featuredImage,
  ogImage,
  category,
  "categoryRef": categoryRef->{title, titleFr, "slug": slug.current, color},
  tags,
  publishedAt,
  updatedAt,
  readTime,
  featured,
  trending,
  contentType,
  seoTitle,
  seoTitleFr,
  seoDescription,
  seoDescriptionFr,
  noIndex,
  "author": author->{name, role, roleFr, image},
  "product": product->{name, brand, score, url},
  sources
`;

const PUBLISHED_FILTER = `_type == "blog" && !(_id in path("drafts.**")) && (status == "published" || !defined(status)) && publishedAt <= now()`;

const POSTS_QUERY = defineQuery(
  `*[${PUBLISHED_FILTER}] | order(featured desc, publishedAt desc){${POST_FIELDS}}`,
);

const POST_BY_SLUG_QUERY = defineQuery(
  `*[${PUBLISHED_FILTER} && slug.current == $slug][0]{${POST_FIELDS}}`,
);

const SLUGS_QUERY = defineQuery(
  `*[${PUBLISHED_FILTER} && defined(slug.current)]{"slug": slug.current}`,
);

const BLOG_SETTINGS_QUERY = defineQuery(`*[_type == "blogSettings"][0]{
  name,
  nameFr,
  logo,
  heroTitle,
  heroTitleFr,
  heroDescription,
  heroDescriptionFr,
  position,
  positionFr,
  accentColor
}`);

export function localizedBlogText(
  post: Pick<BlogPost, "title" | "titleFr" | "excerpt" | "excerptFr">,
  locale: Locale,
  field: "title" | "excerpt",
): string {
  const primary = post[field];
  const translated = post[`${field}Fr`];
  return (
    (locale === "fr" ? translated || primary : primary || translated) || ""
  );
}

export function localizedBlogContent(
  post: BlogPost,
  locale: Locale,
): TypedObject[] {
  const localized = locale === "fr" ? post.contentFr : post.content;
  return localized || (locale === "fr" ? post.content : post.contentFr) || [];
}

export function localizedBlogCategory(post: BlogPost, locale: Locale): string {
  const category = post.categoryRef;
  if (category) {
    return (
      (locale === "fr"
        ? category.titleFr || category.title
        : category.title || category.titleFr) || ""
    );
  }
  return post.category || "";
}

export function blogImageUrl(
  image: BlogImage | null | undefined,
  width: number,
  height: number,
): string | null {
  if (!image?.asset?._ref) return null;
  try {
    return urlFor(image)
      .width(width)
      .height(height)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const { data } = await sanityFetch<BlogPost[]>({ query: POSTS_QUERY });
  const posts = data || [];
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!slug || slug.length > 96) return null;
  const { data } = await sanityFetch<BlogPost | null>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
  });
  return data || null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const { data } = await sanityFetch<Array<{ slug?: string }>>({
    query: SLUGS_QUERY,
  });
  return (data || []).flatMap((entry) => (entry.slug ? [entry.slug] : []));
}

export async function getBlogSettings(): Promise<BlogSettings> {
  const { data } = await sanityFetch<BlogSettings>({
    query: BLOG_SETTINGS_QUERY,
  });
  return data || {};
}
