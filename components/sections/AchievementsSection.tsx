import { IconExternalLink, IconStar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ResponsiveDotCarousel } from "./ResponsiveDotCarousel";

const ACHIEVEMENTS_QUERY =
  defineQuery(`*[_type == "achievement"] | order(date desc){
  title,
  titleFr,
  type,
  issuer,
  date,
  description,
  descriptionFr,
  image,
  url,
  featured,
  order
}`);

interface AchievementRow {
  title?: string | null;
  titleFr?: string | null;
  type?: string | null;
  issuer?: string | null;
  date?: string | null;
  description?: string | null;
  descriptionFr?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity image fields use generated dynamic types.
  image?: any;
  url?: string | null;
  featured?: boolean | null;
}

export async function AchievementsSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const { data: achievements } = await sanityFetch<AchievementRow[]>({
    query: ACHIEVEMENTS_QUERY,
  });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!achievements?.length) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
    });

  const typeLabel = (type?: string | null) => {
    const labels: Record<string, { en: string; fr: string }> = {
      award: { en: "Award", fr: "Récompense" },
      hackathon: { en: "Hackathon", fr: "Hackathon" },
      publication: { en: "Publication", fr: "Publication" },
      speaking: { en: "Speaking", fr: "Conférence" },
      "open-source": { en: "Open Source", fr: "Open Source" },
      milestone: { en: "Milestone", fr: "Étape clé" },
      recognition: { en: "Recognition", fr: "Reconnaissance" },
      other: { en: "Achievement", fr: "Distinction" },
    };
    return labels[type || "other"]?.[locale] || labels.other[locale];
  };

  const card = (achievement: AchievementRow, featured: boolean) => {
    const title = isFr
      ? achievement.titleFr || achievement.title
      : achievement.title || achievement.titleFr;
    const description = isFr
      ? achievement.descriptionFr || achievement.description
      : achievement.description || achievement.descriptionFr;

    return (
      <article
        key={`${achievement.title}-${achievement.date}`}
        className="@container/card flex h-full min-h-[390px] min-w-0 flex-col border bg-card p-5 transition-colors hover:border-primary"
      >
        {achievement.image ? (
          <div className="relative mb-5 aspect-video w-full overflow-hidden">
            <Image
              src={urlFor(achievement.image).width(800).height(450).url()}
              alt={title || "Achievement"}
              fill
              sizes="(min-width: 1280px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {typeLabel(achievement.type)}
          </span>
          {featured ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
              <IconStar className="size-3.5 fill-current" />
              {dict.achievements.featured}
            </span>
          ) : null}
          {achievement.date ? (
            <span className="text-xs text-muted-foreground">
              {formatDate(achievement.date)}
            </span>
          ) : null}
        </div>

        <h4 className="line-clamp-2 text-xl font-semibold">{title}</h4>
        {achievement.issuer ? (
          <p className="mt-2 truncate font-medium text-primary">
            {achievement.issuer}
          </p>
        ) : null}
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}

        {achievement.url ? (
          <Link
            href={achievement.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary hover:underline"
          >
            {dict.achievements.learnMore}
            <IconExternalLink className="size-4" />
          </Link>
        ) : null}
      </article>
    );
  };

  const featured = achievements.filter((achievement) => achievement.featured);
  const regular = achievements.filter((achievement) => !achievement.featured);

  return (
    <section
      id="achievements"
      className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            {dict.achievements.title}
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            {dict.achievements.subtitle}
          </p>
        </div>

        {featured.length ? (
          <div className="mb-12">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <IconStar className="size-6 fill-amber-500 text-amber-500" />
              {dict.achievements.featured}
            </h3>
            <ResponsiveDotCarousel
              ariaLabel={dict.achievements.featured}
              items={featured.map((achievement) => card(achievement, true))}
              desktopItemsPerSlide={3}
              desktopGridClassName="grid grid-cols-3 gap-6"
              singleItemClassName="mx-auto w-full max-w-xl"
            />
          </div>
        ) : null}

        {regular.length ? (
          <div>
            {featured.length ? (
              <h3 className="mb-6 text-2xl font-bold">
                {dict.achievements.all}
              </h3>
            ) : null}
            <ResponsiveDotCarousel
              ariaLabel={dict.achievements.all}
              items={regular.map((achievement) => card(achievement, false))}
              desktopItemsPerSlide={3}
              desktopGridClassName="grid grid-cols-3 gap-6"
              singleItemClassName="mx-auto w-full max-w-xl"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
