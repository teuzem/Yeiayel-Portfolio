"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface DotCarouselProps {
  items: ReactNode[];
  ariaLabel: string;
  intervalMs?: number;
  className?: string;
  slideClassName?: string;
}

export function DotCarousel({
  items,
  ariaLabel,
  intervalMs = 10_000,
  className,
  slideClassName,
}: DotCarouselProps) {
  const safeItems = useMemo(() => items.filter(Boolean), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeItems.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeItems.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, safeItems.length]);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, safeItems.length - 1)));
  }, [safeItems.length]);

  if (!safeItems.length) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden">
        <div
          className="flex motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {safeItems.map((item, itemIndex) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: carousel items are positional slides.
              key={itemIndex}
              className={cn("w-full shrink-0", slideClassName)}
              aria-hidden={itemIndex !== index}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {safeItems.length > 1 ? (
        <div
          className="mt-5 flex items-center justify-center gap-2"
          role="tablist"
          aria-label={ariaLabel}
        >
          {safeItems.map((_, itemIndex) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: carousel dots map to positional slides.
              key={itemIndex}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={`${ariaLabel} ${itemIndex + 1}`}
              onClick={() => setIndex(itemIndex)}
              className={cn(
                "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                itemIndex === index
                  ? "w-7 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
