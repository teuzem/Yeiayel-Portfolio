import type { Metadata } from "next";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
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
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <BlogExplorer
        posts={posts}
        categories={categories}
        locale={locale}
        initialQuery={filters.q || ""}
        initialCategory={filters.category || "all"}
        title={locale === "fr" ? "Tous les articles" : "All articles"}
      />
    </main>
  );
}
