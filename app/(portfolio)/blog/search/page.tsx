import { SearchCheck } from "lucide-react";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogPageHero } from "@/components/blog/BlogPageHero";
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
  const isFr = locale === "fr";
  return (
    <main>
      <BlogPageHero
        eyebrow={isFr ? "Recherche transversale" : "Cross-library search"}
        title={isFr ? "Recherche avancée" : "Advanced search"}
        description={
          isFr
            ? "Trouvez rapidement une publication par sujet, auteur, catégorie, période ou type de contenu."
            : "Find a publication quickly by topic, author, category, date range, or content type."
        }
        icon={SearchCheck}
        dark
      />
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <BlogExplorer
          posts={posts}
          categories={categories}
          locale={locale}
          initialQuery={q || ""}
        />
      </section>
    </main>
  );
}
