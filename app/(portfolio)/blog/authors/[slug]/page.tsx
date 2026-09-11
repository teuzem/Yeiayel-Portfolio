import { ArrowLeft, BookOpenText, PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { getServerLocale } from "@/components/server-context";
import {
  blogImageUrl,
  getBlogAuthors,
  getBlogCategories,
  getBlogPosts,
} from "@/lib/blog";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, authors, posts, categories] = await Promise.all([
    getServerLocale(),
    getBlogAuthors(),
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const author = authors.find((item) => item.slug === slug);
  if (!author) notFound();
  const isFr = locale === "fr";
  const bio =
    (isFr ? author.bioFr || author.bio : author.bio || author.bioFr) || "";
  const role =
    (isFr ? author.roleFr || author.role : author.role || author.roleFr) || "";
  const image = blogImageUrl(author.image, 900, 1100);
  const authorPosts = posts.filter((post) => post.author?.slug === slug);
  const initials = (author.name || "Author")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/blog/authors"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {isFr ? "Tous les auteurs" : "All authors"}
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl items-stretch px-6 pb-14 sm:pb-20 lg:grid-cols-[minmax(300px,0.8fr)_1.2fr]">
          <div className="relative min-h-80 overflow-hidden bg-foreground lg:min-h-[540px]">
            {image ? (
              <Image
                src={image}
                alt={author.name || ""}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full min-h-80 place-items-center text-7xl font-semibold text-background/85">
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center bg-muted/35 p-7 sm:p-12 lg:p-16">
            <PenLine className="size-6 text-primary" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {isFr ? "Auteur et contributeur" : "Author and contributor"}
            </p>
            <h1 className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-6xl">
              {author.name}
            </h1>
            {role && (
              <p className="mt-5 text-lg font-medium text-primary">{role}</p>
            )}
            {bio && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {bio}
              </p>
            )}
            <div className="mt-10 flex items-center gap-3 border-t pt-6 text-sm font-semibold">
              <BookOpenText className="size-5 text-primary" />
              {authorPosts.length}{" "}
              {isFr ? "publications disponibles" : "available publications"}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            {isFr ? "Bibliothèque de l'auteur" : "Author library"}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {isFr ? "Dernières publications" : "Latest publications"}
          </h2>
        </div>
        <BlogExplorer
          posts={authorPosts}
          categories={categories}
          locale={locale}
        />
      </section>
    </main>
  );
}
