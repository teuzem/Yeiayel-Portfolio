import { ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogPageHero } from "@/components/blog/BlogPageHero";
import { getServerLocale } from "@/components/server-context";
import { getBlogCategories, getBlogPosts } from "@/lib/blog";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const topic = decodeURIComponent(tag);
  const [locale, posts, categories] = await Promise.all([
    getServerLocale(),
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const isFr = locale === "fr";
  const count = posts.filter((post) =>
    (post.tags || []).some(
      (postTag) => postTag.toLocaleLowerCase() === topic.toLocaleLowerCase(),
    ),
  ).length;

  return (
    <main>
      <BlogPageHero
        eyebrow={isFr ? "Sujet éditorial" : "Editorial topic"}
        title={`#${topic}`}
        description={
          isFr
            ? "Une sélection ciblée d'analyses, de guides et de retours d'expérience autour de ce sujet."
            : "A focused collection of analysis, guides, and field notes related to this topic."
        }
        icon={Hash}
        metrics={[
          { value: count, label: isFr ? "publications" : "publications" },
        ]}
        action={
          <Link
            href="/blog/topics"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            {isFr ? "Tous les sujets" : "All topics"}
          </Link>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <BlogExplorer
          posts={posts}
          categories={categories}
          locale={locale}
          initialQuery={topic}
        />
      </section>
    </main>
  );
}
