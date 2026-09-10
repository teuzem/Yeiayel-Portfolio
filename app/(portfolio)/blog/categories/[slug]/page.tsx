import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { getServerLocale } from "@/components/server-context";
import { blogCategoryText, getBlogCategories, getBlogPosts } from "@/lib/blog";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, categories, posts] = await Promise.all([
    getServerLocale(),
    getBlogCategories(),
    getBlogPosts(),
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const text = blogCategoryText(category, locale);
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold text-primary">
        {locale === "fr" ? "Catégorie" : "Category"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {text.title}
      </h1>
      {text.description && (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          {text.description}
        </p>
      )}
      <div className="mt-10">
        <BlogExplorer
          posts={posts}
          categories={categories}
          locale={locale}
          initialCategory={slug}
        />
      </div>
    </main>
  );
}
