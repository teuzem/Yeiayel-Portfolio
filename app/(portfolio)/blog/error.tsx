"use client";

import { RotateCcw } from "lucide-react";

export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-[65vh] place-items-center px-6 py-16 text-center">
      <div>
        <h1 className="text-3xl font-bold">The blog could not load</h1>
        <p className="mt-3 text-muted-foreground">
          Please retry. Published content remains safe in Sanity Studio.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <RotateCcw className="size-4" /> Retry
        </button>
      </div>
    </main>
  );
}
