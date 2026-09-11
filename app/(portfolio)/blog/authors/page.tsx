import { ArrowUpRight, BookOpen, PenLine, UsersRound } from "lucide-react";
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
  const articleTotal = authors.reduce(
    (total, author) => total + (author.articleCount || 0),
    0,
  );

  return (
    <main>
      <section className="border-b bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-background/65">
              <UsersRound className="size-4" />
              {isFr ? "Le collectif éditorial" : "The editorial collective"}
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              {isFr
                ? "Des voix expertes, ancrées dans la pratique"
                : "Expert voices grounded in practical work"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              {isFr
                ? "Découvrez les professionnels qui transforment l'expérience data, IA, ingénierie et innovation en analyses directement utiles."
                : "Meet the professionals turning hands-on data, AI, engineering, and innovation experience into useful editorial insight."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 border-t border-background/20 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <Metric
              value={authors.length}
              label={isFr ? "auteurs" : "authors"}
            />
            <Metric
              value={articleTotal}
              label={isFr ? "publications" : "publications"}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {authors.length ? (
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
            {authors.map((author, index) => {
              const image = blogImageUrl(author.image, 720, 900);
              const role =
                (isFr
                  ? author.roleFr || author.role
                  : author.role || author.roleFr) || "";
              const bio =
                (isFr
                  ? author.bioFr || author.bio
                  : author.bio || author.bioFr) || "";
              const initials = (author.name || "Author")
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("");
              return (
                <Link
                  key={author._id}
                  href={`/blog/authors/${author.slug}`}
                  className="group grid min-h-72 overflow-hidden border-y bg-background sm:grid-cols-[minmax(170px,0.78fr)_1.22fr]"
                >
                  <div className="relative min-h-56 overflow-hidden bg-muted sm:min-h-full">
                    {image ? (
                      <Image
                        src={image}
                        alt={author.name || ""}
                        fill
                        sizes="(min-width: 768px) 28vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid h-full min-h-56 place-items-center bg-foreground text-5xl font-semibold text-background/85">
                        {initials}
                      </div>
                    )}
                    <span className="absolute left-4 top-4 text-xs font-semibold text-white/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <PenLine className="size-5 text-primary" />
                      <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <h2 className="mt-8 text-2xl font-bold tracking-tight">
                      {author.name}
                    </h2>
                    {role && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        {role}
                      </p>
                    )}
                    {bio && (
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
                        {bio}
                      </p>
                    )}
                    <p className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <BookOpen className="size-4" />
                      {author.articleCount || 0}{" "}
                      {isFr ? "articles publiés" : "published articles"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="border-y py-16 text-center text-muted-foreground">
            {isFr
              ? "Les auteurs publiés apparaîtront ici."
              : "Published authors will appear here."}
          </p>
        )}
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-background/55">
        {label}
      </p>
    </div>
  );
}
