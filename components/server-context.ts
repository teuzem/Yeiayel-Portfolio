import { cookies } from "next/headers";
import { defaultLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "fr" ? "fr" : value === "en" ? "en" : defaultLocale;
}
