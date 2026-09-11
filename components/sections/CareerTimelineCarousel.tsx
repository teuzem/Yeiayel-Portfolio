"use client";

import { BriefcaseBusiness } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CareerTimelineItem {
  content: ReactNode;
  company: string;
  period: string;
  current?: boolean;
}

export function CareerTimelineCarousel({
  items,
  ariaLabel,
}: {
  items: CareerTimelineItem[];
  ariaLabel: string;
}) {
  const safeItems = useMemo(
    () => items.filter((item) => Boolean(item.content)),
    [items],
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused || safeItems.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeItems.length);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [paused, safeItems.length]);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, safeItems.length - 1)));
  }, [safeItems.length]);

  if (!safeItems.length) return null;

  return (
    <section
      ref={rootRef}
      className="w-full"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="mb-8 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={ariaLabel}
      >
        <div className="relative flex min-w-max items-start px-1 md:min-w-0">
          <div className="absolute left-5 right-5 top-5 h-px bg-border md:left-[8%] md:right-[8%]" />
          {safeItems.map((item, itemIndex) => (
            <button
              key={`${item.company}-${item.period}-${itemIndex}`}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              className="relative z-10 w-36 shrink-0 px-2 text-left md:min-w-0 md:flex-1 md:text-center"
            >
              <span
                className={cn(
                  "mx-0 grid size-10 place-items-center rounded-full border bg-background transition-all md:mx-auto",
                  itemIndex === index
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                <BriefcaseBusiness className="size-4" />
              </span>
              <span
                className={cn(
                  "mt-3 block truncate text-xs font-semibold",
                  itemIndex === index
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.company}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {item.current ? `${item.period} · Active` : item.period}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {safeItems.map((item, itemIndex) => (
            <div
              key={`${item.company}-slide-${itemIndex}`}
              className="w-full shrink-0 px-1"
              aria-hidden={itemIndex !== index}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {safeItems.length > 1 ? (
        <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
          {safeItems.map((item, itemIndex) => (
            <span
              key={`${item.company}-dot-${itemIndex}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                itemIndex === index
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-muted-foreground/25",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
