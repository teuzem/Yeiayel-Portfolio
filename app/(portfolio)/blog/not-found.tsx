import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getServerLocale } from "@/components/server-context";

export default async function BlogNotFound() {
  const locale = await getServerLocale();
  const isFr = locale === "fr";

  return (
    <main className="grid min-h-[65vh] place-items-center px-6 py-16 text-center">
      <div className="max-w-lg">
        <BookOpen className="mx-auto size-12 text-primary" />
        <h1 className="mt-5 text-3xl font-bold">
          {isFr ? "Publication introuvable" : "Publication not found"}
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {isFr
            ? "Cette page a peut-être été déplacée, renommée ou retirée de la publication."
            : "This page may have been moved, renamed, or withdrawn from publication."}
        </p>
        <Link
          href="/blog"
          className="mt-7 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          {isFr ? "Retourner au journal" : "Return to the journal"}
        </Link>
      </div>
    </main>
  );
}
