import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerLocale } from "@/components/server-context";
import { blogImageUrl, getBlogProducts } from "@/lib/blog";

export default async function ReviewsPage() {
  const [locale, products] = await Promise.all([
    getServerLocale(),
    getBlogProducts(),
  ]);
  const isFr = locale === "fr";
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold text-primary">
        {isFr ? "Évaluations" : "Reviews"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {isFr ? "Produits et outils évalués" : "Reviewed products and tools"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        {isFr
          ? "Des évaluations structurées autour de l'utilité, la fiabilité, le coût et la maintenabilité."
          : "Structured reviews focused on usefulness, reliability, cost, and maintainability."}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = blogImageUrl(product.image, 800, 520);
          const description =
            (isFr
              ? product.descriptionFr || product.description
              : product.description || product.descriptionFr) || "";
          return (
            <article
              key={product._id}
              className="overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-[16/10] bg-muted">
                {image && (
                  <Image
                    src={image}
                    alt={product.name || ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-primary">
                  {product.brand}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
                {product.score != null && (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm">
                    <Star className="size-4 fill-primary text-primary" />
                    <strong>{product.score.toFixed(1)}/5</strong>
                  </p>
                )}
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <Link
                  href={`/blog/articles?q=${encodeURIComponent(product.name || "")}`}
                  className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  {isFr ? "Voir les articles" : "View articles"}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
