import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="grid min-h-[65vh] place-items-center px-6 py-16 text-center">
      <div>
        <BookOpen className="mx-auto size-12 text-primary" />
        <h1 className="mt-5 text-3xl font-bold">Content not found</h1>
        <p className="mt-3 text-muted-foreground">
          This article or editorial page is unavailable.
        </p>
        <Link
          href="/blog"
          className="mt-7 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Return to the blog
        </Link>
      </div>
    </main>
  );
}
