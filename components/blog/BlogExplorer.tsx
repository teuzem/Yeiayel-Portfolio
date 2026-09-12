"use client";

import {
  ArrowDown,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogCategory, BlogPost } from "@/lib/blog";
import {
  blogCategoryText,
  localizedBlogCategory,
  localizedBlogText,
} from "@/lib/blog";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
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
      .sort((firstPost, secondPost) => {
        if (sort === "az") {
          return localizedBlogText(firstPost, locale, "title").localeCompare(
            localizedBlogText(secondPost, locale, "title"),
            locale,
          );
        }
        const first = new Date(firstPost.publishedAt || 0).getTime();
        const second = new Date(secondPost.publishedAt || 0).getTime();
        return sort === "oldest" ? first - second : second - first;
      });
  }, [category, contentType, locale, period, posts, query, sort]);

  const activeFilterCount = [
    category !== "all",
    contentType !== "all",
    period !== "all",
  ].filter(Boolean).length;

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setVisible(PAGE_SIZE);
  };

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
      {title ? (
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
      ) : null}

      <section className="mb-10 overflow-hidden rounded-lg bg-muted/30 p-3 ring-1 ring-foreground/5 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
          <label className="relative">
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
              className="h-14 w-full rounded-md border bg-muted/20 pl-12 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className={cn(
              "inline-flex h-14 items-center justify-center gap-2 rounded-md border px-5 text-sm font-semibold transition-colors",
              filtersOpen || activeFilterCount
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted",
            )}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="size-4" />
            {isFr ? "Filtres" : "Filters"}
            {activeFilterCount ? (
              <span className="grid size-5 place-items-center rounded-full bg-background/20 text-[10px]">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
            {isFr ? "Réinitialiser" : "Clear"}
          </button>
        </div>

        {suggestions.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
            <span className="mr-1 self-center text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {isFr ? "Suggestions" : "Suggestions"}
            </span>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  setVisible(PAGE_SIZE);
                }}
                className="rounded-full border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        {filtersOpen ? (
          <div className="mt-4 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <Filter
              label={isFr ? "Catégorie" : "Category"}
              value={category}
              onChange={(value) => updateFilter(setCategory, value)}
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
              label={isFr ? "Format" : "Content type"}
              value={contentType}
              onChange={(value) => updateFilter(setContentType, value)}
              options={[
                { value: "all", label: isFr ? "Tous" : "All types" },
                ...types.map((value) => ({ value, label: value })),
              ]}
            />
            <Filter
              label={isFr ? "Période" : "Published"}
              value={period}
              onChange={(value) => updateFilter(setPeriod, value)}
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
                {
                  value: "year",
                  label: isFr ? "Dernière année" : "Last year",
                },
              ]}
            />
            <Filter
              label={isFr ? "Trier" : "Sort"}
              value={sort}
              onChange={(value) => updateFilter(setSort, value)}
              options={[
                { value: "newest", label: isFr ? "Plus récents" : "Newest" },
                { value: "oldest", label: isFr ? "Plus anciens" : "Oldest" },
                { value: "az", label: "A–Z" },
              ]}
            />
          </div>
        ) : null}
      </section>

      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <LayoutGrid className="size-4 text-primary" />
            {filtered.length} {isFr ? "résultats" : "results"}
          </p>
          {query.trim() ? (
            <p className="mt-1 max-w-2xl truncate text-sm text-muted-foreground">
              {isFr ? "Recherche pour" : "Search for"} “{query.trim()}”
            </p>
          ) : null}
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          {isFr ? "Filtres instantanés" : "Instant filters"}
        </p>
      </div>

      {filtered.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((post) => (
              <BlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
          {visible < filtered.length ? (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisible((value) => value + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-semibold hover:bg-muted"
              >
                {isFr ? "Afficher plus" : "Load more"}
                <ArrowDown className="size-4" />
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="grid min-h-64 place-items-center rounded-lg bg-muted/25 text-center ring-1 ring-foreground/5">
          <div className="max-w-md px-6">
            <Search className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">
              {isFr ? "Aucun résultat" : "No results found"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isFr
                ? "Essayez un terme plus large ou réinitialisez les filtres actifs."
                : "Try a broader search term or clear the active filters."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 text-sm font-semibold text-primary hover:underline"
            >
              {isFr ? "Réinitialiser la recherche" : "Reset search"}
            </button>
          </div>
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
    <label className="grid gap-2 px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border bg-background px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
