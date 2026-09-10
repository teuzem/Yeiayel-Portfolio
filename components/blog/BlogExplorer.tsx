"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogCategory, BlogPost } from "@/lib/blog";
import {
  blogCategoryText,
  localizedBlogCategory,
  localizedBlogText,
} from "@/lib/blog";
import type { Locale } from "@/lib/i18n";
import { BlogCard } from "./BlogCard";

const PAGE_SIZE = 9;

export function BlogExplorer({
  posts,
  categories,
  locale,
  initialQuery = "",
  initialCategory = "all",
  title,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
  locale: Locale;
  initialQuery?: string;
  initialCategory?: string;
  title?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [contentType, setContentType] = useState("all");
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const isFr = locale === "fr";

  const types = useMemo(
    () =>
      Array.from(
        new Set(
          posts.flatMap((post) => (post.contentType ? [post.contentType] : [])),
        ),
      ),
    [posts],
  );

  const suggestions = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    if (needle.length < 2) return [];
    const values = posts.flatMap((post) => [
      localizedBlogText(post, locale, "title"),
      localizedBlogCategory(post, locale),
      ...(post.tags || []),
      post.author?.name || "",
    ]);
    return Array.from(
      new Set(
        values.filter((value) =>
          value.toLocaleLowerCase(locale).includes(needle),
        ),
      ),
    ).slice(0, 6);
  }, [locale, posts, query]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    const now = Date.now();
    const cutoff =
      period === "30d"
        ? now - 30 * 86400000
        : period === "90d"
          ? now - 90 * 86400000
          : period === "year"
            ? now - 365 * 86400000
            : 0;
    return posts
      .filter((post) => {
        const haystack = [
          localizedBlogText(post, locale, "title"),
          localizedBlogText(post, locale, "excerpt"),
          localizedBlogCategory(post, locale),
          ...(post.tags || []),
          post.author?.name,
          post.contentType,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase(locale);
        const date = post.publishedAt
          ? new Date(post.publishedAt).getTime()
          : 0;
        return (
          (!needle || haystack.includes(needle)) &&
          (category === "all" ||
            post.categoryRef?.slug === category ||
            post.category === category) &&
          (contentType === "all" || post.contentType === contentType) &&
          (!cutoff || date >= cutoff)
        );
      })
      .sort((a, b) => {
        if (sort === "az")
          return localizedBlogText(a, locale, "title").localeCompare(
            localizedBlogText(b, locale, "title"),
            locale,
          );
        const first = new Date(a.publishedAt || 0).getTime();
        const second = new Date(b.publishedAt || 0).getTime();
        return sort === "oldest" ? first - second : second - first;
      });
  }, [category, contentType, locale, period, posts, query, sort]);

  const reset = () => {
    setQuery("");
    setCategory("all");
    setContentType("all");
    setPeriod("all");
    setSort("newest");
    setVisible(PAGE_SIZE);
  };

  return (
    <div>
      {title && (
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
      )}
      <section className="mb-8 rounded-lg border bg-muted/25 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">
              {isFr ? "Rechercher les articles" : "Search articles"}
            </span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder={
                isFr
                  ? "Titre, sujet, auteur ou mot-clé…"
                  : "Title, topic, author, or keyword…"
              }
              className="h-12 w-full rounded-md border bg-background pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            <SlidersHorizontal className="size-4" />{" "}
            {isFr ? "Filtres" : "Filters"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" /> {isFr ? "Réinitialiser" : "Clear"}
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full bg-muted px-3 py-1.5 text-xs hover:bg-primary hover:text-primary-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {filtersOpen && (
          <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <Filter
              label={isFr ? "Catégorie" : "Category"}
              value={category}
              onChange={setCategory}
              options={[
                { value: "all", label: isFr ? "Toutes" : "All categories" },
                ...categories.flatMap((item) =>
                  item.slug
                    ? [
                        {
                          value: item.slug,
                          label: blogCategoryText(item, locale).title,
                        },
                      ]
                    : [],
                ),
              ]}
            />
            <Filter
              label={isFr ? "Type" : "Content type"}
              value={contentType}
              onChange={setContentType}
              options={[
                { value: "all", label: isFr ? "Tous" : "All types" },
                ...types.map((value) => ({ value, label: value })),
              ]}
            />
            <Filter
              label={isFr ? "Période" : "Published"}
              value={period}
              onChange={setPeriod}
              options={[
                { value: "all", label: isFr ? "Toutes les dates" : "Any time" },
                {
                  value: "30d",
                  label: isFr ? "30 derniers jours" : "Last 30 days",
                },
                {
                  value: "90d",
                  label: isFr ? "90 derniers jours" : "Last 90 days",
                },
                { value: "year", label: isFr ? "Dernière année" : "Last year" },
              ]}
            />
            <Filter
              label={isFr ? "Trier" : "Sort"}
              value={sort}
              onChange={setSort}
              options={[
                { value: "newest", label: isFr ? "Plus récents" : "Newest" },
                { value: "oldest", label: isFr ? "Plus anciens" : "Oldest" },
                { value: "az", label: "A–Z" },
              ]}
            />
          </div>
        )}
      </section>
      <div className="mb-5 text-sm text-muted-foreground">
        {filtered.length} {isFr ? "article(s)" : "article(s)"}
      </div>
      {filtered.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((post) => (
              <BlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisible((value) => value + PAGE_SIZE)}
                className="rounded-md border px-6 py-3 text-sm font-semibold hover:bg-muted"
              >
                {isFr ? "Afficher plus" : "Load more"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          {isFr
            ? "Aucun article ne correspond à ces critères."
            : "No articles match these filters."}
        </div>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border bg-background px-3 text-sm text-foreground"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
