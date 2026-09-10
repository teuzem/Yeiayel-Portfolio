import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { getServerLocale } from "@/components/server-context";
import { getBlogAuthors, getBlogCategories, getBlogPosts } from "@/lib/blog";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, authors, posts, categories] = await Promise.all([
    getServerLocale(),
    getBlogAuthors(),
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const author = authors.find((item) => item.slug === slug);
  if (!author) notFound();
  const isFr = locale === "fr";
  const bio =
    (isFr ? author.bioFr || author.bio : author.bio || author.bioFr) || "";
  const authorPosts = posts.filter((post) => post.author?.slug === slug);
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold text-primary">
        {isFr ? "Auteur" : "Author"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {author.name}
      </h1>
      {bio && (
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {bio}
        </p>
      )}
      <div className="mt-10">
        <BlogExplorer
          posts={authorPosts}
          categories={categories}
          locale={locale}
        />
      </div>
    </main>
  );
}
