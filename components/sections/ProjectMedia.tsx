"use client";

import { ExternalLink, MonitorUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const previewHosts: Record<string, string> = {
  "admission-desk": "admissiondesk.online",
  "batir-le-pays-website": "www.batirlepays.com",
  "batir-le-pays-portfolio": "portfolio.batirlepays.com",
  pryemo: "pryemo.com",
  "go2skul-web": "go2skuleducation.com",
  "batir-le-pays-blog": "www.batirlepays.com",
};

const previewAccents: Record<string, string> = {
  "admission-desk": "bg-emerald-600",
  "batir-le-pays-website": "bg-amber-600",
  "batir-le-pays-portfolio": "bg-sky-700",
  pryemo: "bg-fuchsia-700",
  "go2skul-web": "bg-blue-700",
  "batir-le-pays-blog": "bg-orange-700",
};

export function ProjectMedia({
  slug,
  title,
  liveUrl,
  cmsImage,
  locale = "en",
}: {
  slug: string;
  title: string;
  liveUrl?: string | null;
  cmsImage?: string | null;
  locale?: "en" | "fr";
}) {
  const [failed, setFailed] = useState(false);
  const host = previewHosts[slug];
  const screenshotUrl =
    host &&
    `https://image.thum.io/get/width/1200/crop/720/noanimate/https://${host}`;
  const source = failed ? (host ? null : cmsImage) : screenshotUrl || cmsImage;

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950 sm:aspect-[16/10]">
      {source ? (
        <Image
          src={source}
          alt={`${title} project interface`}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
          onError={() => setFailed(true)}
        />
      ) : (
        <ProjectFallback slug={slug} title={title} />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 text-white">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <MonitorUp className="size-3.5" />
          {locale === "fr" ? "Produit en ligne" : "Live product"}
        </span>
        {liveUrl ? (
          <ExternalLink className="size-4" aria-hidden="true" />
        ) : null}
      </div>
    </div>
  );
}

function ProjectFallback({ slug, title }: { slug: string; title: string }) {
  return (
    <div
      className={`grid h-full place-items-center px-7 text-white ${previewAccents[slug] || "bg-primary"}`}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-1.5 border-b border-white/25 pb-3">
          <span className="size-2 rounded-full bg-white/80" />
          <span className="size-2 rounded-full bg-white/50" />
          <span className="size-2 rounded-full bg-white/30" />
        </div>
        <p className="mt-7 text-2xl font-bold tracking-tight">{title}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <span className="h-12 rounded-sm bg-white/20" />
          <span className="h-12 rounded-sm bg-white/15" />
          <span className="h-12 rounded-sm bg-white/10" />
        </div>
        <span className="mt-3 block h-2 w-3/4 rounded-full bg-white/30" />
        <span className="mt-2 block h-2 w-1/2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
