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
  featuredImageUrl?: string | null;
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
    slug?: string | null;
    name?: string | null;
    role?: string | null;
    roleFr?: string | null;
    image?: BlogImage | null;
  } | null;
  product?: {
    slug?: string | null;
    name?: string | null;
    brand?: string | null;
    image?: BlogImage | null;
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
  advertisement?: {
    enabled?: boolean | null;
    title?: string | null;
    titleFr?: string | null;
    description?: string | null;
    descriptionFr?: string | null;
    image?: BlogImage | null;
    imageUrl?: string | null;
    link?: string | null;
    buttonLabel?: string | null;
    buttonLabelFr?: string | null;
  } | null;
}

export interface BlogCategory {
  _id: string;
  title?: string | null;
  titleFr?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionFr?: string | null;
  color?: string | null;
  icon?: string | null;
  articleCount?: number;
}

export interface BlogAuthor {
  _id: string;
  name?: string | null;
  slug?: string | null;
  role?: string | null;
  roleFr?: string | null;
  bio?: string | null;
  bioFr?: string | null;
  image?: BlogImage | null;
  articleCount?: number;
}

export interface BlogProduct {
  _id: string;
  name?: string | null;
  slug?: string | null;
  brand?: string | null;
  description?: string | null;
  descriptionFr?: string | null;
  image?: BlogImage | null;
  score?: number | null;
  url?: string | null;
  articleCount?: number;
}

export interface BlogComment {
  _id: string;
  name: string;
  message: string;
  locale: Locale;
  submittedAt: string;
}

export interface BlogTableOfContentsItem {
  id: string;
  text: string;
  level: 2 | 3;
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
  featuredImageUrl,
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
  "author": author->{name, "slug": slug.current, role, roleFr, image},
  "product": product->{name, "slug": slug.current, brand, image, score, url},
  sources
`;

const PUBLISHED_FILTER = `_type == "blog" && !(_id in path("drafts.**")) && (status == "published" || !defined(status)) && publishedAt <= now()`;

const POSTS_QUERY = defineQuery(
  `*[${PUBLISHED_FILTER}] | order(featured desc, publishedAt desc){${POST_FIELDS}}`,
);

const LATEST_POSTS_QUERY = defineQuery(
  `*[${PUBLISHED_FILTER}] | order(publishedAt desc){${POST_FIELDS}}`,
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
  accentColor,
  advertisement{
    enabled,
    title,
    titleFr,
    description,
    descriptionFr,
    image,
    imageUrl,
    link,
    buttonLabel,
    buttonLabelFr
  }
}`);

const CATEGORIES_QUERY =
  defineQuery(`*[_type == "blogCategory"] | order(title asc){
  _id, title, titleFr, "slug": slug.current, description, descriptionFr, color, icon,
  "articleCount": count(*[${PUBLISHED_FILTER} && references(^._id)])
}`);

const AUTHORS_QUERY = defineQuery(`*[_type == "blogAuthor"] | order(name asc){
  _id, name, "slug": slug.current, role, roleFr, bio, bioFr, image,
  "articleCount": count(*[${PUBLISHED_FILTER} && references(^._id)])
}`);

const PRODUCTS_QUERY = defineQuery(`*[_type == "blogProduct"] | order(name asc){
  _id, name, "slug": slug.current, brand, description, descriptionFr, image, score, url,
  "articleCount": count(*[${PUBLISHED_FILTER} && references(^._id)])
}`);

const APPROVED_COMMENTS_QUERY = defineQuery(
  `*[_type == "blogComment" && status == "approved" && references($postId)] | order(submittedAt desc){
    _id, name, message, locale, submittedAt
  }`,
);

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

export function getBlogTableOfContents(
  content: TypedObject[],
): BlogTableOfContentsItem[] {
  return content.flatMap((item) => {
    const block = item as {
      _key?: string;
      style?: string;
      children?: Array<{ text?: string }>;
    };
    if (!block._key || (block.style !== "h2" && block.style !== "h3")) {
      return [];
    }
    const text = (block.children || [])
      .map((child) => child.text || "")
      .join("")
      .trim();
    if (!text) return [];
    return [
      {
        id: `section-${block._key}`,
        text,
        level: block.style === "h3" ? (3 as const) : (2 as const),
      },
    ];
  });
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

const CATEGORY_COVER_IMAGES: Record<string, string> = {
  "data-science":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=82",
  "artificial-intelligence":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=82",
  "ai-ml":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=82",
  "data-analysis":
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=82",
  "software-engineering":
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=82",
  "web-dev":
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=82",
  "cloud-security":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=82",
  "career-education":
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=82",
  career:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=82",
  "product-reviews":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=82",
  review:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=82",
  "batir-le-pays":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=82",
};

export function blogPostImageUrl(
  post: Pick<
    BlogPost,
    "featuredImage" | "featuredImageUrl" | "category" | "categoryRef"
  >,
  width: number,
  height: number,
): string {
  return (
    blogImageUrl(post.featuredImage, width, height) ||
    safeExternalImageUrl(post.featuredImageUrl) ||
    CATEGORY_COVER_IMAGES[post.categoryRef?.slug || ""] ||
    CATEGORY_COVER_IMAGES[post.category || ""] ||
    CATEGORY_COVER_IMAGES["data-science"]
  );
}

export function blogSettingsImageUrl(
  image: BlogImage | null | undefined,
  externalUrl: string | null | undefined,
  width: number,
  height: number,
): string | null {
  return (
    blogImageUrl(image, width, height) || safeExternalImageUrl(externalUrl)
  );
}

function safeExternalImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const { data } = await sanityFetch<BlogPost[]>({ query: POSTS_QUERY });
  const posts = data || [];
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export async function getLatestBlogPosts(limit?: number): Promise<BlogPost[]> {
  const { data } = await sanityFetch<BlogPost[]>({
    query: LATEST_POSTS_QUERY,
  });
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

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await sanityFetch<BlogCategory[]>({
    query: CATEGORIES_QUERY,
  });
  return data || [];
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const { data } = await sanityFetch<BlogAuthor[]>({ query: AUTHORS_QUERY });
  return data || [];
}

export async function getBlogProducts(): Promise<BlogProduct[]> {
  const { data } = await sanityFetch<BlogProduct[]>({ query: PRODUCTS_QUERY });
  return data || [];
}

export async function getApprovedBlogComments(
  postId: string,
): Promise<BlogComment[]> {
  if (!postId) return [];
  const { data } = await sanityFetch<BlogComment[]>({
    query: APPROVED_COMMENTS_QUERY,
    params: { postId },
  });
  return data || [];
}

export function blogCategoryText(category: BlogCategory, locale: Locale) {
  return {
    title:
      (locale === "fr"
        ? category.titleFr || category.title
        : category.title || category.titleFr) || "",
    description:
      (locale === "fr"
        ? category.descriptionFr || category.description
        : category.description || category.descriptionFr) || "",
  };
}
