import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryIcon } from "@/components/blog/CategoryIcon";
import { getServerLocale } from "@/components/server-context";
import {
  blogCategoryText,
  blogImageUrl,
  blogPostImageUrl,
  getBlogCategories,
  getBlogPosts,
  getBlogSettings,
  getLatestBlogPosts,
} from "@/lib/blog";
import { getSiteSettings, getSiteUrl } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, blogSettings] = await Promise.all([
    getSiteSettings(),
    getBlogSettings(),
  ]);
  const title = blogSettings.name || "Yeiayel Journal";
  const description =
    blogSettings.heroDescription ||
    "Practical insights on data science, artificial intelligence, software engineering, and digital innovation.";
  const image = blogImageUrl(blogSettings.logo, 1200, 630);
  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${getSiteUrl(settings)}/blog`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPage() {
  const [locale, posts, latestPosts, categories, settings] = await Promise.all([
    getServerLocale(),
    getBlogPosts(),
    getLatestBlogPosts(),
    getBlogCategories(),
    getBlogSettings(),
  ]);
  const isFr = locale === "fr";
  const featured = posts.find((post) => post.featured) || posts[0];
  const latest = latestPosts
    .filter((post) => post._id !== featured?._id)
    .slice(0, 6);
  const trending = posts.filter((post) => post.trending).slice(0, 3);
  const featuredImage = featured
    ? blogPostImageUrl(featured, 1800, 1100)
    : null;
  const heroTitle =
    (isFr
      ? settings.heroTitleFr || settings.heroTitle
      : settings.heroTitle || settings.heroTitleFr) ||
    (isFr
      ? "Des idées appliquées pour un avenir numérique utile"
      : "Applied ideas for a useful digital future");
  const heroDescription =
    (isFr
      ? settings.heroDescriptionFr || settings.heroDescription
      : settings.heroDescription || settings.heroDescriptionFr) ||
    (isFr
      ? "Data science, IA, ingénierie logicielle et innovation numérique expliquées avec rigueur et orientées vers l'action."
      : "Data science, AI, software engineering, and digital innovation explained rigorously and built for action.");

  return (
    <main>
      <section className="relative min-h-[min(760px,82svh)] overflow-hidden bg-foreground text-background">
        {featuredImage && (
          <Image
            src={featuredImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[min(760px,82svh)] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 sm:pb-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/75">
              <Sparkles className="size-4" />
              {isFr ? "Perspectives de Yeiayel" : "Insights by Yeiayel"}
            </p>
            <h1 className="mt-5 break-words text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              {heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog/articles"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black"
              >
                {isFr ? "Explorer les articles" : "Explore articles"}{" "}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/blog/search"
                className="rounded-md border border-white/45 bg-black/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/35"
              >
                {isFr ? "Recherche avancée" : "Advanced search"}
              </Link>
            </div>
          </div>
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="mt-12 grid max-w-4xl gap-2 border-t border-white/35 pt-5 text-white sm:grid-cols-[1fr_auto] sm:items-end"
            >
              <span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  {isFr ? "Article à la une" : "Featured story"}
                </span>
                <span className="mt-2 block text-lg font-semibold sm:text-xl">
                  {isFr
                    ? featured.titleFr || featured.title
                    : featured.title || featured.titleFr}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                {isFr ? "Lire maintenant" : "Read now"}
                <ArrowRight className="size-4" />
              </span>
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              {isFr ? "Explorer" : "Explore"}
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {isFr ? "Domaines d'expertise" : "Areas of expertise"}
            </h2>
          </div>
          <Link
            href="/blog/categories"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {isFr ? "Toutes les catégories" : "All categories"}
          </Link>
        </div>
        <div className="grid border-y sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => {
            const text = blogCategoryText(category, locale);
            return (
              <Link
                key={category._id}
                href={`/blog/categories/${category.slug}`}
                className="group border-b p-5 transition-colors hover:bg-muted/35 sm:border-r"
              >
                <CategoryIcon
                  icon={category.icon}
                  slug={category.slug}
                  className="size-7"
                />
                <h3 className="mt-5 font-semibold">{text.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {text.description}
                </p>
                <p className="mt-4 text-xs font-medium text-primary">
                  {category.articleCount || 0} {isFr ? "articles" : "articles"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold">
              {isFr ? "Dernières publications" : "Latest publications"}
            </h2>
            <Link
              href="/blog/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {isFr ? "Voir tout" : "View all"}{" "}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <BlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="flex items-center gap-3 text-3xl font-bold">
            <TrendingUp className="size-7 text-primary" />
            {isFr ? "À lire maintenant" : "Trending now"}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((post) => (
              <BlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t bg-foreground px-6 py-16 text-background">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">
            {isFr
              ? "Transformer les idées en résultats"
              : "Turn ideas into useful outcomes"}
          </h2>
          <p className="mt-4 text-background/70">
            {isFr
              ? "Découvrez le portfolio, les services et les projets qui prolongent ces analyses."
              : "Explore the portfolio, services, and projects that put these insights into practice."}
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground"
          >
            {isFr ? "Voir le portfolio" : "View portfolio"}{" "}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
