import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import Image from "next/image";
import { blogImageUrl } from "@/lib/blog";

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2
        id={value?._key ? `section-${value._key}` : undefined}
        className="mb-4 mt-14 scroll-mt-24 text-3xl font-bold leading-tight tracking-tight"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={value?._key ? `section-${value._key}` : undefined}
        className="mb-3 mt-10 scroll-mt-24 text-2xl font-semibold leading-tight tracking-tight"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 rounded-r-lg border-l-4 border-primary bg-muted/45 px-6 py-5 text-lg italic leading-8 text-foreground/80">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-6 text-[1.04rem] leading-8 text-foreground/75">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc space-y-3 pl-6 leading-7 text-foreground/75 marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 list-decimal space-y-3 pl-6 leading-7 text-foreground/75 marker:font-semibold marker:text-primary">
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
        <figure className="my-10 overflow-hidden rounded-lg bg-muted shadow-[0_18px_50px_-36px_rgba(0,0,0,0.65)] ring-1 ring-foreground/10">
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
