"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/DarkModeToggle";
import { useLocale } from "@/components/LocaleProvider";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import type { BlogSettings } from "@/lib/blog";
import { blogImageUrl } from "@/lib/blog";
import { cn } from "@/lib/utils";

const links = [
  { href: "/blog", en: "Home", fr: "Accueil" },
  { href: "/blog/articles", en: "Articles", fr: "Articles" },
  { href: "/blog/categories", en: "Categories", fr: "Catégories" },
  { href: "/blog/topics", en: "Topics", fr: "Sujets" },
  { href: "/blog/reviews", en: "Reviews", fr: "Évaluations" },
  { href: "/blog/authors", en: "Authors", fr: "Auteurs" },
  { href: "/blog/about", en: "About", fr: "À propos" },
];

export function BlogShell({
  settings,
  children,
}: {
  settings: BlogSettings;
  children: React.ReactNode;
}) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logo =
    blogImageUrl(settings.logo, 360, 144) || "/blog/batir-le-pays-logo.png";
  const name =
    (locale === "fr"
      ? settings.nameFr || settings.name
      : settings.name || settings.nameFr) || "Yeiayel Journal";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={cn(
          "sticky top-0 z-40 transition-all",
          scrolled
            ? "bg-background/92 shadow-[0_10px_35px_-28px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            : "bg-background",
        )}
      >
        <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-md bg-muted/70 xl:hidden"
            aria-expanded={menuOpen}
            aria-label={locale === "fr" ? "Ouvrir le menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link href="/blog" className="flex min-w-0 items-center gap-3">
            <Image
              src={logo}
              alt={name}
              width={150}
              height={60}
              className="h-11 w-auto max-w-36 object-contain"
              priority
            />
            <span className="hidden text-sm font-semibold sm:block">
              {name}
            </span>
          </Link>
          <div className="ml-auto hidden min-w-0 items-center gap-0.5 xl:flex">
            {links.map((link) => {
              const active =
                link.href === "/blog"
                  ? pathname === "/blog"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-2.5 py-2 text-sm font-medium transition-colors 2xl:px-3",
                    active
                      ? "text-foreground after:absolute after:inset-x-2.5 after:-bottom-1 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {locale === "fr" ? link.fr : link.en}
                </Link>
              );
            })}
          </div>
          <Link
            href="/blog/search"
            className="ml-auto grid size-10 place-items-center rounded-md bg-muted/70 transition-colors hover:bg-muted xl:ml-1"
            aria-label={locale === "fr" ? "Rechercher" : "Search"}
          >
            <Search className="size-4" />
          </Link>
          <div className="hidden 2xl:block">
            <LocaleSwitcher />
          </div>
          <div className="hidden 2xl:block">
            <ModeToggle />
          </div>
        </nav>
        {menuOpen && (
          <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto bg-background/98 px-4 py-4 shadow-xl xl:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-3 text-sm font-medium",
                    pathname === link.href ||
                      (link.href !== "/blog" && pathname.startsWith(link.href))
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {locale === "fr" ? link.fr : link.en}
                </Link>
              ))}
              <div className="mt-3 flex flex-wrap gap-2 border-t pt-4">
                <LocaleSwitcher />
                <ModeToggle />
              </div>
            </div>
          </div>
        )}
      </header>
      {children}
      <footer className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Image
              src={logo}
              alt={name}
              width={220}
              height={88}
              className="h-14 w-auto object-contain"
            />
            <p className="mt-4 max-w-xl text-sm leading-7 text-background/65">
              {locale === "fr"
                ? "Data science, systèmes numériques, ingénierie logicielle et innovation appliquées à des besoins concrets."
                : "Data science, digital systems, software engineering, and innovation applied to concrete needs."}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              {locale === "fr" ? "Explorer" : "Explore"}
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-background/60">
              {links.slice(1, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-background"
                >
                  {locale === "fr" ? link.fr : link.en}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              {locale === "fr" ? "Ressources" : "Resources"}
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-background/60">
              <Link href="/blog/authors" className="hover:text-background">
                {locale === "fr" ? "Auteurs" : "Authors"}
              </Link>
              <Link href="/blog/about" className="hover:text-background">
                {locale === "fr" ? "À propos" : "About"}
              </Link>
              <Link href="/" className="hover:text-background">
                {locale === "fr" ? "Portfolio" : "Portfolio"}
              </Link>
              <Link href="/#contact" className="hover:text-background">
                {locale === "fr" ? "Contact" : "Contact"}
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 px-6 py-6 text-center text-xs text-background/50">
          © {new Date().getUTCFullYear()} {name}.{" "}
          {locale === "fr" ? "Tous droits réservés." : "All rights reserved."}
        </div>
      </footer>
    </div>
  );
}
