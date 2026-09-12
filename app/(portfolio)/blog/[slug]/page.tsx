import { ArrowDown, ArrowLeft, Clock3, ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleSidebar } from "@/components/blog/BlogArticleSidebar";
import { BlogComments } from "@/components/blog/BlogComments";
import { BlogPortableText } from "@/components/blog/BlogPortableText";
import { getServerLocale } from "@/components/server-context";
import {
  blogPostImageUrl,
  getApprovedBlogComments,
  getBlogPost,
  getBlogProducts,
  getBlogSettings,
  getBlogTableOfContents,
  getLatestBlogPosts,
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
  const image = blogPostImageUrl(
    { ...post, featuredImage: post.ogImage || post.featuredImage },
    1200,
    630,
  );

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
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, locale, latestPosts, products, settings] = await Promise.all([
    getBlogPost(slug),
    getServerLocale(),
    getLatestBlogPosts(6),
    getBlogProducts(),
    getBlogSettings(),
  ]);
  if (!post) notFound();
  const comments = await getApprovedBlogComments(post._id);

  const isFr = locale === "fr";
  const title = localizedBlogText(post, locale, "title");
  const excerpt = localizedBlogText(post, locale, "excerpt");
  const content = localizedBlogContent(post, locale);
  const toc = getBlogTableOfContents(content);
  const category = localizedBlogCategory(post, locale);
  const imageUrl = blogPostImageUrl(post, 1440, 900);
  const recentPosts = latestPosts.filter((item) => item._id !== post._id);
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
      <article className="container mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {isFr ? "Tous les articles" : "All articles"}
        </Link>

        <header className="mt-8 max-w-5xl">
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
          <h1 className="mt-5 break-words text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            {title}
          </h1>
          {excerpt && (
            <p className="mt-5 text-xl leading-8 text-muted-foreground">
              {excerpt}
            </p>
          )}
          {post.product?.score != null && (
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

        <figure className="mt-10 overflow-hidden rounded-lg bg-muted shadow-[0_25px_70px_-42px_rgba(0,0,0,0.75)] ring-1 ring-foreground/10">
          <Image
            src={imageUrl}
            alt={post.featuredImage?.alt || title}
            width={1440}
            height={900}
            priority
            className="aspect-[16/9] h-auto w-full object-cover"
          />
          {post.featuredImage?.caption && (
            <figcaption className="px-4 py-3 text-sm text-muted-foreground">
              {post.featuredImage.caption}
            </figcaption>
          )}
        </figure>

        <div className="mt-12 grid gap-12 lg:grid-cols-[290px_minmax(0,760px)] lg:justify-between xl:gap-16">
          <div className="order-2 lg:order-1">
            <BlogArticleSidebar
              locale={locale}
              toc={toc}
              recentPosts={recentPosts}
              products={products}
              settings={settings}
            />
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            {post.author?.name && (
              <div className="flex items-center gap-4 rounded-lg bg-muted/35 p-4 ring-1 ring-foreground/5">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                  {post.author.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold">{post.author.name}</p>
                  {authorRole && (
                    <p className="mt-0.5 text-muted-foreground">{authorRole}</p>
                  )}
                  {updatedDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {isFr
                        ? `Mis à jour le ${updatedDate}`
                        : `Updated ${updatedDate}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {toc.length > 0 && (
              <details className="group mt-8 rounded-lg bg-muted/35 p-4 ring-1 ring-foreground/5 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>
                    {isFr ? "Table des matières" : "Table of contents"}
                  </span>
                  <ArrowDown className="size-4 transition-transform group-open:rotate-180" />
                </summary>
                <ol className="mt-4 grid gap-2 text-sm">
                  {toc.map((item) => (
                    <li
                      key={item.id}
                      className={item.level === 3 ? "pl-4" : ""}
                    >
                      <a href={`#${item.id}`} className="text-muted-foreground">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
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
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/topics/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}

            {post.sources?.filter((source) => source.url).length ? (
              <aside className="mt-12 rounded-lg bg-muted/35 p-6 ring-1 ring-foreground/5">
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

            <BlogComments
              postId={post._id}
              slug={slug}
              locale={locale}
              comments={comments}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
