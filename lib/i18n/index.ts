export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "portfolio-locale";

export const localeName: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};
