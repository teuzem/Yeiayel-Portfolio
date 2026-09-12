import { ArrowUpRight, Hash, Network } from "lucide-react";
import Link from "next/link";
import { BlogPageHero } from "@/components/blog/BlogPageHero";
import { getServerLocale } from "@/components/server-context";
import { getBlogPosts } from "@/lib/blog";

export default async function TopicsPage() {
  const [locale, posts] = await Promise.all([
    getServerLocale(),
    getBlogPosts(),
  ]);
  const isFr = locale === "fr";
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  const topics = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <main>
      <BlogPageHero
        eyebrow={isFr ? "Index transversal" : "Cross-disciplinary index"}
        title={isFr ? "Tous les sujets" : "All topics"}
        description={
          isFr
            ? "Explorez la bibliothèque par technologie, méthode, industrie ou enjeu professionnel."
            : "Explore the library by technology, method, industry, or professional challenge."
        }
        icon={Network}
        metrics={[
          { value: topics.length, label: isFr ? "sujets" : "topics" },
          { value: posts.length, label: isFr ? "articles" : "articles" },
        ]}
        dark
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {topics.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map(([topic, count], index) => (
              <Link
                key={topic}
                href={`/blog/topics/${encodeURIComponent(topic)}`}
                className="group flex min-h-36 flex-col justify-between rounded-lg bg-muted/25 p-5 transition-colors hover:bg-muted/50 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <Hash className="size-5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-7">
                  <h2 className="break-words text-lg font-semibold">{topic}</h2>
                  <p className="mt-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    <span>
                      {count} {isFr ? "publications" : "publications"}
                    </span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="border-y py-16 text-center text-muted-foreground">
            {isFr
              ? "Les sujets apparaîtront avec les prochaines publications."
              : "Topics will appear with upcoming publications."}
          </p>
        )}
      </section>
    </main>
  );
}
