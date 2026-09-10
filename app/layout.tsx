import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/PwaRegister";
import { getServerLocale } from "@/components/server-context";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const fallbackTitle = "NGOUMTSOP TEUZEM Yeiayel | Data Scientist & AI Engineer";
const fallbackDescription =
  "Data Science, Machine Learning, AI and Fullstack development services for Africa and the world.";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getServerLocale(),
  ]);
  const isFr = locale === "fr";
  const title =
    (isFr ? settings.siteTitleFr : settings.siteTitle) ||
    settings.siteTitle ||
    fallbackTitle;
  const description =
    (isFr ? settings.siteDescriptionFr : settings.siteDescription) ||
    settings.siteDescription ||
    fallbackDescription;
  const keywords =
    (isFr ? settings.siteKeywordsFr : settings.siteKeywords) ||
    settings.siteKeywords ||
    [];
  const siteUrl =
    settings.canonicalUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const metadataBase = new URL(siteUrl);
  const images = settings.ogImageUrl ? [settings.ogImageUrl] : [];

  return {
    metadataBase,
    title,
    description,
    keywords,
    manifest: "/manifest.json",
    alternates: { canonical: "/" },
    robots:
      settings.robotsIndex === false
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: isFr ? "fr_FR" : "en_US",
      url: "/",
      siteName: title,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: settings.twitterHandle
        ? `@${settings.twitterHandle.replace(/^@/, "")}`
        : undefined,
      images,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
