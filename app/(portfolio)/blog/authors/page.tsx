import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerLocale } from "@/components/server-context";
import { blogImageUrl, getBlogAuthors } from "@/lib/blog";

export default async function AuthorsPage() {
  const [locale, authors] = await Promise.all([
    getServerLocale(),
    getBlogAuthors(),
  ]);
  const isFr = locale === "fr";
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold text-primary">
        {isFr ? "À propos" : "About"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {isFr ? "Auteurs et contributeurs" : "Authors and contributors"}
      </h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => {
          const image = blogImageUrl(author.image, 240, 240);
          const role =
            (isFr
              ? author.roleFr || author.role
              : author.role || author.roleFr) || "";
          return (
            <Link
              key={author._id}
              href={`/blog/authors/${author.slug}`}
              className="flex items-center gap-4 rounded-lg border bg-card p-5 hover:shadow-lg"
            >
              <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-muted">
                {image ? (
                  <Image
                    src={image}
                    alt={author.name || ""}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="size-9 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="font-semibold">{author.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {role}
                </p>
                <p className="mt-2 text-xs text-primary">
                  {author.articleCount || 0} articles
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
