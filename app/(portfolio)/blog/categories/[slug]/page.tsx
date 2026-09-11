import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { CategoryIcon } from "@/components/blog/CategoryIcon";
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
  const isFr = locale === "fr";
  const articleCount = posts.filter(
    (post) =>
      post.categoryRef?.slug === slug || post.category === category.slug,
  ).length;

  return (
    <main>
      <section className="border-b bg-muted/25">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
          <Link
            href="/blog/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {isFr ? "Toutes les catégories" : "All categories"}
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <CategoryIcon
                icon={category.icon}
                slug={category.slug}
                className="size-9 text-primary"
              />
              <h1 className="mt-6 break-words text-4xl font-bold tracking-tight sm:text-6xl">
                {text.title}
              </h1>
              {text.description && (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {text.description}
                </p>
              )}
            </div>
            <p className="border-t pt-5 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {articleCount} {isFr ? "publications" : "publications"}
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <BlogExplorer
          posts={posts}
          categories={categories}
          locale={locale}
          initialCategory={slug}
        />
      </section>
    </main>
  );
}
