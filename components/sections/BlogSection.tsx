import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { getLatestBlogPosts } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function BlogSection({ locale = "en" }: { locale?: Locale }) {
  const [posts, dict] = await Promise.all([
    getLatestBlogPosts(3),
    getDictionary(locale),
  ]);
  if (!posts.length) return null;

  return (
    <section id="blog" className="bg-muted/30 px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold md:text-5xl">
              {dict.blog.title}
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              {dict.blog.subtitle}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {locale === "fr" ? "Voir tous les articles" : "View all articles"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
