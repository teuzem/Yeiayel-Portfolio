import { WifiOff } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function OfflinePage(props: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const searchParams = await props.searchParams;
  const isFr = searchParams.locale === "fr";
  const locale: Locale = isFr ? "fr" : "en";
  const dict = getDictionary(locale);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3">{dict.offline.title}</h1>
        <p className="text-muted-foreground mb-6">{dict.offline.subtitle}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {dict.offline.backHome}
        </Link>
      </div>
    </main>
  );
}
