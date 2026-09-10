import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { getServerLocale } from "@/components/server-context";
import { blogImageUrl, getBlogPosts, getBlogSettings } from "@/lib/blog";
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
  const [locale, settings, posts, blogSettings] = await Promise.all([
    getServerLocale(),
    getSiteSettings(),
    getBlogPosts(),
    getBlogSettings(),
  ]);
  const isFr = locale === "fr";
  const name =
    (isFr
      ? blogSettings.nameFr || blogSettings.name
      : blogSettings.name || blogSettings.nameFr) || "Yeiayel Journal";
  const heroTitle =
    (isFr
      ? blogSettings.heroTitleFr || blogSettings.heroTitle
      : blogSettings.heroTitle || blogSettings.heroTitleFr) ||
    (isFr
      ? "Idées appliquées pour un avenir numérique utile"
      : "Applied ideas for a useful digital future");
  const heroDescription =
    (isFr
      ? blogSettings.heroDescriptionFr || blogSettings.heroDescription
      : blogSettings.heroDescription || blogSettings.heroDescriptionFr) ||
    (isFr
      ? "Des analyses concrètes sur la data science, l'IA, l'ingénierie logicielle et l'innovation numérique."
      : "Practical analysis on data science, AI, software engineering, and digital innovation.");
  const position =
    (isFr
      ? blogSettings.positionFr || blogSettings.position
      : blogSettings.position || blogSettings.positionFr) ||
    (isFr
      ? "Data Science et innovation numérique chez Bâtir le Pays SARL"
      : "Data Science and digital innovation at Bâtir le Pays SARL");
  const logoUrl =
    blogImageUrl(blogSettings.logo, 720, 288) || "/blog/batir-le-pays-logo.png";
  const accent = blogSettings.accentColor || settings.accentColor || "#0F766E";

  return (
    <main className="min-h-screen bg-background">
      <section
        className="border-b bg-muted/35"
        style={{ borderTopColor: accent, borderTopWidth: "4px" }}
      >
        <div className="container mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {isFr ? "Retour au portfolio" : "Back to portfolio"}
          </Link>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="size-4" />
                {position}
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {heroDescription}
              </p>
            </div>
            <div className="justify-self-start rounded-lg border bg-background p-4 shadow-sm lg:justify-self-end">
              <Image
                src={logoUrl}
                alt={name}
                width={360}
                height={144}
                className="h-auto w-52 object-contain sm:w-64"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">{name}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {isFr ? "Dernières publications" : "Latest publications"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {posts.length === 1
              ? isFr
                ? "1 article publié"
                : "1 published article"
              : isFr
                ? `${posts.length} articles publiés`
                : `${posts.length} published articles`}
          </p>
        </div>

        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center rounded-lg border border-dashed bg-muted/20 p-8 text-center">
            <div className="max-w-md">
              <BookOpen className="mx-auto size-10 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">
                {isFr
                  ? "Les premiers articles arrivent bientôt."
                  : "The first articles are coming soon."}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isFr
                  ? "Publiez un article dans Sanity Studio avec le statut « Publié » pour l'afficher ici."
                  : "Publish a post in Sanity Studio with the “Published” status to show it here."}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
