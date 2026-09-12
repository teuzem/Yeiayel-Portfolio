import { ArrowRight, Clock3, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type BlogPost,
  blogPostImageUrl,
  localizedBlogCategory,
  localizedBlogText,
} from "@/lib/blog";
import type { Locale } from "@/lib/i18n";

export function BlogCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const title = localizedBlogText(post, locale, "title");
  const excerpt = localizedBlogText(post, locale, "excerpt");
  const imageUrl = blogPostImageUrl(post, 960, 600);
  const category = localizedBlogCategory(post, locale);
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null;
  const readLabel =
    locale === "fr"
      ? `${post.readTime || 4} min de lecture`
      : `${post.readTime || 4} min read`;

  return (
    <article className="group flex h-full flex-col overflow-hidden border-y bg-card transition-colors hover:border-primary/45">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={title}
      >
        <Image
          src={imageUrl}
          alt={post.featuredImage?.alt || title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {post.contentType === "Review" && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-background/95 px-2.5 py-1 text-xs font-semibold text-foreground">
            <Star className="size-3.5 fill-current" />
            {post.product?.score?.toFixed(1) || "Review"}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {category && (
            <span className="font-medium text-primary">{category}</span>
          )}
          {date && <time dateTime={post.publishedAt || undefined}>{date}</time>}
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {readLabel}
          </span>
        </div>
        <h2 className="break-words text-xl font-semibold leading-tight text-foreground">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </h2>
        {excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {excerpt}
          </p>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          {locale === "fr" ? "Lire l'article" : "Read article"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
