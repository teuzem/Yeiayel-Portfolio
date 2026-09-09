"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale, localeName } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS: Array<{
  locale: Locale;
  code: string;
  symbol: string;
}> = [
  { locale: "en", code: "EN", symbol: "🇬🇧" },
  { locale: "fr", code: "FR", symbol: "🇫🇷" },
];

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, dict } = useLocale();

  const selectLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    setLocale(nextLocale);
  };

  return (
    <fieldset
      className={cn(
        "flex h-11 items-center gap-1 rounded-lg border border-border/70 bg-background/90 p-1 shadow-lg backdrop-blur-xl",
        className,
      )}
    >
      <legend className="sr-only">{dict.nav.changeLanguage}</legend>
      <Languages
        className="mx-1 h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      {LANGUAGE_OPTIONS.map((option) => {
        const active = option.locale === locale;
        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => selectLocale(option.locale)}
            className={cn(
              "relative flex h-8 min-w-12 items-center justify-center gap-1 rounded-md px-2 text-xs font-semibold transition-colors",
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-pressed={active}
            aria-label={localeName[option.locale]}
            title={localeName[option.locale]}
            lang={option.locale}
          >
            <span className="text-base leading-none" aria-hidden="true">
              {option.symbol}
            </span>
            <span>{option.code}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
