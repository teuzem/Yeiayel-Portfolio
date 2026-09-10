import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { getServerLocale } from "@/components/server-context";
import { getBlogCategories, getBlogPosts } from "@/lib/blog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, locale, posts, categories] = await Promise.all([
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
        initialQuery={q || ""}
        title={locale === "fr" ? "Recherche avancée" : "Advanced search"}
      />
    </main>
  );
}
