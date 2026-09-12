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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg bg-card shadow-[0_18px_55px_-36px_rgba(0,0,0,0.55)] ring-1 ring-foreground/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_-34px_rgba(0,0,0,0.6)] hover:ring-primary/30">
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
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        {post.contentType === "Review" && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-background/95 px-2.5 py-1 text-xs font-semibold text-foreground">
            <Star className="size-3.5 fill-current" />
            {post.product?.score?.toFixed(1) || "Review"}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
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
        <h2 className="break-words text-xl font-semibold leading-snug text-foreground">
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
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary"
        >
          {locale === "fr" ? "Lire l'article" : "Read article"}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
