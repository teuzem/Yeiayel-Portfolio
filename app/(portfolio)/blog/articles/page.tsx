import { LibraryBig } from "lucide-react";
import type { Metadata } from "next";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogPageHero } from "@/components/blog/BlogPageHero";
import { getServerLocale } from "@/components/server-context";
import { getBlogCategories, getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "All articles",
  description: "Search and filter the complete Yeiayel Journal archive.",
  alternates: { canonical: "/blog/articles" },
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const [filters, locale, posts, categories] = await Promise.all([
    searchParams,
    getServerLocale(),
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const isFr = locale === "fr";
  return (
    <main>
      <BlogPageHero
        eyebrow={isFr ? "Bibliothèque éditoriale" : "Editorial library"}
        title={isFr ? "Tous les articles" : "All articles"}
        description={
          isFr
            ? "Recherchez et filtrez l'ensemble des analyses, guides, retours d'expérience et évaluations."
            : "Search and filter the complete collection of analysis, guides, field notes, and reviews."
        }
        icon={LibraryBig}
        metrics={[
          { value: posts.length, label: isFr ? "articles" : "articles" },
          { value: categories.length, label: isFr ? "domaines" : "domains" },
        ]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <BlogExplorer
          posts={posts}
          categories={categories}
          locale={locale}
          initialQuery={filters.q || ""}
          initialCategory={filters.category || "all"}
        />
      </section>
    </main>
  );
}
