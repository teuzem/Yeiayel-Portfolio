"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DotCarousel } from "./DotCarousel";

interface ResponsiveDotCarouselProps {
  items: ReactNode[];
  ariaLabel: string;
  desktopItemsPerSlide: number;
  desktopGridClassName: string;
  intervalMs?: number;
  singleItemClassName?: string;
}

export function ResponsiveDotCarousel({
  items,
  ariaLabel,
  desktopItemsPerSlide,
  desktopGridClassName,
  intervalMs,
  singleItemClassName = "mx-auto w-full max-w-2xl",
}: ResponsiveDotCarouselProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const slides = useMemo(() => {
    const safeItems = items.filter(Boolean);
    const perSlide = isDesktop ? desktopItemsPerSlide : 1;

    return Array.from(
      { length: Math.ceil(safeItems.length / perSlide) },
      (_, slideIndex) => {
        const group = safeItems.slice(
          slideIndex * perSlide,
          slideIndex * perSlide + perSlide,
        );

        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: carousel groups are positional slides.
            key={`responsive-slide-${slideIndex}`}
            className={cn(
              isDesktop ? desktopGridClassName : singleItemClassName,
            )}
          >
            {group}
          </div>
        );
      },
    );
  }, [
    desktopGridClassName,
    desktopItemsPerSlide,
    isDesktop,
    items,
    singleItemClassName,
  ]);

  return (
    <DotCarousel
      key={isDesktop ? "desktop" : "compact"}
      items={slides}
      ariaLabel={ariaLabel}
      intervalMs={intervalMs}
    />
  );
}
