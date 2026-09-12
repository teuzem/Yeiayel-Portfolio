import { ArrowRight, Compass, Layers3 } from "lucide-react";
import Link from "next/link";
import { CategoryIcon } from "@/components/blog/CategoryIcon";
import { getServerLocale } from "@/components/server-context";
import { blogCategoryText, getBlogCategories } from "@/lib/blog";

export default async function CategoriesPage() {
  const [locale, categories] = await Promise.all([
    getServerLocale(),
    getBlogCategories(),
  ]);
  const isFr = locale === "fr";
  const articleTotal = categories.reduce(
    (total, category) => total + (category.articleCount || 0),
    0,
  );

  return (
    <main>
      <section className="bg-muted/25">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[1fr_280px] lg:items-end">
          <div className="max-w-4xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Compass className="size-4" />
              {isFr ? "Carte éditoriale" : "Editorial map"}
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              {isFr
                ? "Explorez les idées par domaine"
                : "Explore ideas by professional domain"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {isFr
                ? "Une bibliothèque structurée autour de la data, des systèmes numériques, de l'ingénierie, de la sécurité et de l'innovation."
                : "A structured library spanning data, digital systems, engineering, security, education, and practical innovation."}
            </p>
          </div>
          <div className="flex gap-3">
            <Metric
              value={categories.length}
              label={isFr ? "domaines" : "domains"}
            />
            <Metric
              value={articleTotal}
              label={isFr ? "articles" : "articles"}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {categories.length ? (
          <div className="grid gap-3">
            {categories.map((category, index) => {
              const text = blogCategoryText(category, locale);
              return (
                <Link
                  key={category._id}
                  href={`/blog/categories/${category.slug}`}
                  className="group grid gap-5 rounded-lg bg-muted/25 p-5 transition-colors hover:bg-muted/50 sm:grid-cols-[42px_minmax(180px,0.8fr)_1.2fr_auto] sm:items-center sm:px-6"
                >
                  <span className="text-xs font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-4">
                    <CategoryIcon
                      icon={category.icon}
                      slug={category.slug}
                      className="size-7 shrink-0 text-primary"
                    />
                    <h2 className="text-xl font-semibold">{text.title}</h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    {text.description}
                  </p>
                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {category.articleCount || 0}{" "}
                      {isFr ? "articles" : "articles"}
                    </span>
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid place-items-center border-y py-20 text-center">
            <Layers3 className="size-9 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {isFr
                ? "Les catégories apparaîtront après leur publication."
                : "Categories will appear after publication."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-28 rounded-lg bg-background px-5 py-4 shadow-sm ring-1 ring-foreground/5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
