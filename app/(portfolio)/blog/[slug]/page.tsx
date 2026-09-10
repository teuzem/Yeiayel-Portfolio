import { ArrowLeft, Clock3, ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPortableText } from "@/components/blog/BlogPortableText";
import { getServerLocale } from "@/components/server-context";
import {
  blogImageUrl,
  getBlogPost,
  localizedBlogCategory,
  localizedBlogContent,
  localizedBlogText,
} from "@/lib/blog";
import { getSiteSettings, getSiteUrl } from "@/lib/site-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings, locale] = await Promise.all([
    getBlogPost(slug),
    getSiteSettings(),
    getServerLocale(),
  ]);
  if (!post) return {};

  const isFr = locale === "fr";
  const title =
    (isFr
      ? post.seoTitleFr || post.seoTitle
      : post.seoTitle || post.seoTitleFr) ||
    localizedBlogText(post, locale, "title");
  const description =
    (isFr
      ? post.seoDescriptionFr || post.seoDescription
      : post.seoDescription || post.seoDescriptionFr) ||
    localizedBlogText(post, locale, "excerpt");
  const image = blogImageUrl(post.ogImage || post.featuredImage, 1200, 630);

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${getSiteUrl(settings)}/blog/${slug}`,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, locale] = await Promise.all([
    getBlogPost(slug),
    getServerLocale(),
  ]);
  if (!post) notFound();

  const isFr = locale === "fr";
  const title = localizedBlogText(post, locale, "title");
  const excerpt = localizedBlogText(post, locale, "excerpt");
  const content = localizedBlogContent(post, locale);
  const category = localizedBlogCategory(post, locale);
  const imageUrl = blogImageUrl(post.featuredImage, 1440, 900);
  const publishedDate = post.publishedAt
    ? new Intl.DateTimeFormat(isFr ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null;
  const updatedDate = post.updatedAt
    ? new Intl.DateTimeFormat(isFr ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(post.updatedAt))
    : null;
  const authorRole =
    (isFr
      ? post.author?.roleFr || post.author?.role
      : post.author?.role || post.author?.roleFr) || "";

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {isFr ? "Tous les articles" : "All articles"}
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            {category && (
              <span className="font-semibold text-primary">{category}</span>
            )}
            {publishedDate && (
              <time dateTime={post.publishedAt || undefined}>
                {publishedDate}
              </time>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4" />
              {isFr
                ? `${post.readTime || 4} min de lecture`
                : `${post.readTime || 4} min read`}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {excerpt && (
            <p className="mt-5 text-xl leading-8 text-muted-foreground">
              {excerpt}
            </p>
          )}
          {post.product?.score !== null &&
            post.product?.score !== undefined && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <Star className="size-4 fill-primary text-primary" />
                <strong>{post.product.score.toFixed(1)}/5</strong>
                <span className="text-muted-foreground">
                  {post.product.brand ? `${post.product.brand} · ` : ""}
                  {post.product.name}
                </span>
              </div>
            )}
        </header>

        {imageUrl && (
          <figure className="mt-10 overflow-hidden rounded-lg border bg-muted">
            <Image
              src={imageUrl}
              alt={post.featuredImage?.alt || title}
              width={1440}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
            {post.featuredImage?.caption && (
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                {post.featuredImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {post.author?.name && (
          <div className="mt-8 border-y py-5 text-sm">
            <p className="font-semibold">{post.author.name}</p>
            {authorRole && (
              <p className="mt-1 text-muted-foreground">{authorRole}</p>
            )}
            {updatedDate && (
              <p className="mt-2 text-xs text-muted-foreground">
                {isFr
                  ? `Mis à jour le ${updatedDate}`
                  : `Updated ${updatedDate}`}
              </p>
            )}
          </div>
        )}

        <div className="prose-like max-w-none">
          {content.length ? (
            <BlogPortableText value={content} />
          ) : (
            <p className="mt-10 leading-8 text-muted-foreground">
              {isFr
                ? "Le contenu complet de cet article sera publié prochainement."
                : "The full article content will be published shortly."}
            </p>
          )}
        </div>

        {post.tags?.length ? (
          <div className="mt-10 flex flex-wrap gap-2 border-t pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {post.sources?.filter((source) => source.url).length ? (
          <aside className="mt-10 rounded-lg border bg-muted/25 p-5">
            <h2 className="text-base font-semibold">
              {isFr ? "Sources éditoriales" : "Editorial sources"}
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              {post.sources
                .filter((source) => source.url)
                .map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url || ""}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4"
                    >
                      {source.title || source.publisher || source.url}
                      <ExternalLink className="size-3.5" />
                    </a>
                    {source.publisher && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {source.publisher}
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </aside>
        ) : null}
      </article>
    </main>
  );
}
