"use client";

import { RotateCcw } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

export default function BlogError({ reset }: { reset: () => void }) {
  const { locale } = useLocale();
  const isFr = locale === "fr";

  return (
    <main className="grid min-h-[68vh] place-items-center px-6 py-16 text-center">
      <div className="max-w-lg rounded-lg bg-muted/30 px-7 py-10 ring-1 ring-foreground/5">
        <h1 className="text-3xl font-bold">
          {isFr
            ? "Le journal n'a pas pu charger"
            : "The journal could not load"}
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {isFr
            ? "Une interruption temporaire empêche l'affichage des publications. Réessayez dans un instant."
            : "A temporary interruption is preventing the publications from loading. Please try again."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <RotateCcw className="size-4" />
          {isFr ? "Réessayer" : "Try again"}
        </button>
      </div>
    </main>
  );
}
