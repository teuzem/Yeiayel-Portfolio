import { BlogExplorer } from "@/components/blog/BlogExplorer";
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
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <BlogExplorer
        posts={posts}
        categories={categories}
        locale={locale}
        initialQuery={topic}
        title={`#${topic}`}
      />
    </main>
  );
}
