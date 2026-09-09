"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { type Dictionary, getDictionary } from "@/lib/i18n/dictionary";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dict: Dictionary;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "portfolio-locale";

function persistLocale(locale: Locale) {
  document.documentElement.lang = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Live locale state still works when storage is unavailable.
  }
  try {
    // biome-ignore lint/suspicious/noDocumentCookie: required fallback for broad browser support.
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // The document language and client state remain authoritative.
  }
}

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  // Prefer the cookie the server used to render, so hydration matches.
  const cookieLocale = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];
  if (cookieLocale === "en" || cookieLocale === "fr") return cookieLocale;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "fr") return stored;
  const browser = window.navigator?.language?.toLowerCase() ?? "";
  return browser.startsWith("fr") ? "fr" : defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const initialLocale = detectInitialLocale();
    setLocaleState(initialLocale);
    persistLocale(initialLocale);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === "en" ? "fr" : "en";
      persistLocale(next);
      return next;
    });
  }, []);

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, toggleLocale, dict, t: dict }),
    [locale, setLocale, toggleLocale, dict],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
