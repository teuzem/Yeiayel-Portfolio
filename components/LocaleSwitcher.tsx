"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LOCALE_COOKIE, type Locale, localeName } from "@/lib/i18n";

const SUPPORTED: Locale[] = ["en", "fr"];

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, dict } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 w-full h-10 px-3 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium justify-center"
        aria-label={dict.nav.changeLanguage}
      >
        <span aria-hidden className="text-xs font-bold">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-label={dict.nav.closeMenu}
          />
          <div className="absolute right-0 top-12 z-50 w-40 rounded-lg border bg-popover shadow-lg overflow-hidden">
            {SUPPORTED.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLocale(l);
                  try {
                    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
                  } catch {
                    /* ignore */
                  }
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                  l === locale ? "text-primary font-medium" : ""
                }`}
              >
                {localeName[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
