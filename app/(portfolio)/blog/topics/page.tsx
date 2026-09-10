import { Hash } from "lucide-react";
import Link from "next/link";
import { getServerLocale } from "@/components/server-context";
import { getBlogPosts } from "@/lib/blog";

export default async function TopicsPage() {
  const [locale, posts] = await Promise.all([
    getServerLocale(),
    getBlogPosts(),
  ]);
  const counts = new Map<string, number>();
  for (const post of posts)
    for (const tag of post.tags || [])
      counts.set(tag, (counts.get(tag) || 0) + 1);
  const topics = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-center sm:py-16">
      <p className="text-sm font-semibold text-primary">Index</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {locale === "fr" ? "Tous les sujets" : "All topics"}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        {locale === "fr"
          ? "Retrouvez les articles par technologie, méthode, industrie ou enjeu."
          : "Find articles by technology, method, industry, or challenge."}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {topics.map(([topic, count]) => (
          <Link
            key={topic}
            href={`/blog/topics/${encodeURIComponent(topic)}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary"
          >
            <Hash className="size-4" /> {topic}{" "}
            <span className="text-xs text-muted-foreground">{count}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
