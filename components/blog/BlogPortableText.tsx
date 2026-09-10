import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import Image from "next/image";
import { blogImageUrl } from "@/lib/blog";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-3xl font-bold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-2xl font-semibold tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-primary pl-5 text-lg italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-5 leading-8 text-muted-foreground">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 list-disc space-y-2 pl-6 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="font-medium text-primary underline underline-offset-4"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imageUrl = blogImageUrl(value, 1440, 900);
      if (!imageUrl) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-lg border bg-muted">
          <Image
            src={imageUrl}
            alt={value?.alt || ""}
            width={1440}
            height={900}
            className="h-auto w-full object-cover"
          />
          {value?.caption && (
            <figcaption className="px-4 py-3 text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function BlogPortableText({ value }: { value: TypedObject[] }) {
  if (!value.length) return null;
  return <PortableText value={value} components={components} />;
}
