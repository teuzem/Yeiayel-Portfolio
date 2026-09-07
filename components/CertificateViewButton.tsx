"use client";

import { IconExternalLink } from "@tabler/icons-react";
import { type MouseEvent, useCallback } from "react";

/**
 * Opens a certificate document/image in a new tab and triggers a download
 * onto the user's device. Falls back to simply opening the URL if fetching
 * across origins is blocked (e.g. for e-learning verification links).
 */
export function CertificateViewButton({
  href,
  label,
  autoDownload = true,
}: {
  href: string;
  label: string;
  autoDownload?: boolean;
}) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!autoDownload) return;
      // Always let the browser open the document in a new tab.
      // Attempt an automatic download in parallel.
      fetch(href)
        .then((res) => {
          if (!res.ok) throw new Error("unable to fetch");
          return res.blob();
        })
        .then((blob) => {
          const filename =
            href.split("/").pop()?.split("?")[0] || "certificate";
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        })
        .catch(() => {
          // Cross-origin blocked—opening the new tab is enough.
        });
      e.preventDefault();
    },
    [href, autoDownload],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      {label}
      <IconExternalLink className="w-4 h-4" />
    </a>
  );
}

export default CertificateViewButton;
