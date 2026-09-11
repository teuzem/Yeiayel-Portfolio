import {
  ArrowUpRight,
  BookOpenText,
  Box,
  Clock3,
  Megaphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type BlogPost,
  type BlogProduct,
  type BlogSettings,
  type BlogTableOfContentsItem,
  blogPostImageUrl,
  blogSettingsImageUrl,
  localizedBlogText,
} from "@/lib/blog";
import type { Locale } from "@/lib/i18n";

export function BlogArticleSidebar({
  locale,
  toc,
  recentPosts,
  products,
  settings,
}: {
  locale: Locale;
  toc: BlogTableOfContentsItem[];
  recentPosts: BlogPost[];
  products: BlogProduct[];
  settings: BlogSettings;
}) {
  const isFr = locale === "fr";
  const ad = settings.advertisement;
  const adTitle =
    (isFr ? ad?.titleFr || ad?.title : ad?.title || ad?.titleFr) ||
    (isFr ? "Construisons votre solution" : "Build your next solution");
  const adDescription =
    (isFr
      ? ad?.descriptionFr || ad?.description
      : ad?.description || ad?.descriptionFr) ||
    (isFr
      ? "Transformez une idée data, IA ou numérique en produit concret."
      : "Turn a data, AI, or digital idea into a practical product.");
  const adButton =
    (isFr
      ? ad?.buttonLabelFr || ad?.buttonLabel
      : ad?.buttonLabel || ad?.buttonLabelFr) ||
    (isFr ? "Discuter du projet" : "Discuss a project");
  const adImage = blogSettingsImageUrl(ad?.image, ad?.imageUrl, 720, 480);

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
      {toc.length > 0 && (
        <div className="hidden lg:block">
          <SidebarSection
            icon={BookOpenText}
            title={isFr ? "Table des matières" : "Table of contents"}
          >
            <nav aria-label={isFr ? "Table des matières" : "Table of contents"}>
              <ol className="grid gap-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                    <a
                      href={`#${item.id}`}
                      className="leading-5 text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </SidebarSection>
        </div>
      )}

      {recentPosts.length > 0 && (
        <SidebarSection
          icon={Clock3}
          title={isFr ? "Articles récents" : "Recent posts"}
        >
          <div className="grid gap-4">
            {recentPosts.slice(0, 4).map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[72px_1fr] gap-3"
              >
                <span className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blogPostImageUrl(post, 240, 240)}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </span>
                <span className="self-center text-sm font-medium leading-5 group-hover:text-primary">
                  {localizedBlogText(post, locale, "title")}
                </span>
              </Link>
            ))}
          </div>
        </SidebarSection>
      )}

      {products.length > 0 && (
        <SidebarSection
          icon={Box}
          title={isFr ? "Produits en vedette" : "Featured products"}
        >
          <div className="grid gap-4">
            {products.slice(0, 3).map((product) => (
              <div
                key={product._id}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{product.name}</p>
                  {product.score != null && (
                    <span className="text-xs font-semibold text-primary">
                      {product.score.toFixed(1)}/5
                    </span>
                  )}
                </div>
                {product.brand && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.brand}
                  </p>
                )}
                {product.url && (
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    {isFr ? "Voir le produit" : "View product"}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </SidebarSection>
      )}

      {ad?.enabled !== false && (
        <section className="overflow-hidden rounded-lg border bg-foreground text-background">
          {adImage && (
            <div className="relative aspect-[3/2]">
              <Image
                src={adImage}
                alt=""
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-5">
            <Megaphone className="size-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{adTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-background/70">
              {adDescription}
            </p>
            <a
              href={ad?.link || "/#contact"}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-background underline underline-offset-4"
            >
              {adButton}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </section>
      )}
    </aside>
  );
}

function SidebarSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookOpenText;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t pt-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}
