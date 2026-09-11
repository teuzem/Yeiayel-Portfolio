import { ArrowUpRight, Gauge, Star, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogPageHero } from "@/components/blog/BlogPageHero";
import { getServerLocale } from "@/components/server-context";
import { blogImageUrl, getBlogProducts } from "@/lib/blog";

export default async function ReviewsPage() {
  const [locale, products] = await Promise.all([
    getServerLocale(),
    getBlogProducts(),
  ]);
  const isFr = locale === "fr";
  const scored = products.filter((product) => product.score != null);
  const average = scored.length
    ? (
        scored.reduce((sum, product) => sum + (product.score || 0), 0) /
        scored.length
      ).toFixed(1)
    : "—";

  return (
    <main>
      <BlogPageHero
        eyebrow={isFr ? "Évaluations indépendantes" : "Independent reviews"}
        title={
          isFr ? "Produits et outils évalués" : "Reviewed products and tools"
        }
        description={
          isFr
            ? "Des évaluations structurées autour de l'utilité, la fiabilité, le coût, la sécurité et la maintenabilité."
            : "Structured reviews focused on usefulness, reliability, cost, security, and maintainability."
        }
        icon={Gauge}
        metrics={[
          { value: products.length, label: isFr ? "produits" : "products" },
          { value: average, label: isFr ? "note moyenne" : "average score" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const image = blogImageUrl(product.image, 960, 640);
              const description =
                (isFr
                  ? product.descriptionFr || product.description
                  : product.description || product.descriptionFr) || "";
              return (
                <article
                  key={product._id}
                  className="group flex min-h-[470px] flex-col overflow-hidden border-y bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.name || ""}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-foreground text-background">
                        <Wrench className="size-12 opacity-70" />
                      </div>
                    )}
                    <span className="absolute left-4 top-4 text-xs font-semibold text-white drop-shadow">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {product.brand || (isFr ? "Outil" : "Tool")}
                      </p>
                      {product.score != null ? (
                        <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
                          <Star className="size-4 fill-primary text-primary" />
                          {product.score.toFixed(1)}
                        </p>
                      ) : null}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">{product.name}</h2>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                    <Link
                      href={`/blog/articles?q=${encodeURIComponent(product.name || "")}`}
                      className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary hover:underline"
                    >
                      {isFr ? "Voir l'analyse" : "Read the analysis"}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="border-y py-16 text-center text-muted-foreground">
            {isFr
              ? "Les prochaines évaluations apparaîtront ici."
              : "Upcoming reviews will appear here."}
          </p>
        )}
      </section>
    </main>
  );
}
