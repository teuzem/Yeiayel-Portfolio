import { ArrowUpRight, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { getServerLocale } from "@/components/server-context";
import { blogCategoryText, getBlogCategories } from "@/lib/blog";

export default async function CategoriesPage() {
  const [locale, categories] = await Promise.all([
    getServerLocale(),
    getBlogCategories(),
  ]);
  const isFr = locale === "fr";
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold text-primary">
        {isFr ? "Explorer" : "Explore"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {isFr ? "Toutes les catégories" : "All categories"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        {isFr
          ? "Des articles organisés selon les compétences, technologies et enjeux professionnels du portfolio."
          : "Articles organized around the portfolio’s skills, technologies, and professional focus areas."}
      </p>
      {categories.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const text = blogCategoryText(category, locale);
            return (
              <Link
                key={category._id}
                href={`/blog/categories/${category.slug}`}
                className="group flex min-h-56 flex-col rounded-lg border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="grid size-12 place-items-center rounded-md text-white"
                    style={{ backgroundColor: category.color || "#0F766E" }}
                  >
                    <Grid3X3 className="size-6" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <h2 className="mt-7 text-xl font-semibold">{text.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {text.description}
                </p>
                <p className="mt-auto pt-5 text-xs font-semibold text-primary">
                  {category.articleCount || 0} {isFr ? "articles" : "articles"}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          {isFr
            ? "Les catégories apparaîtront après leur publication dans Sanity."
            : "Categories will appear after they are published in Sanity."}
        </p>
      )}
    </main>
  );
}
