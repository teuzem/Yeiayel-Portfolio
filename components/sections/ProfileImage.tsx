"use client";

import { MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useOptionalAuth } from "@/components/AuthProvider";
import { useLocale } from "../LocaleProvider";
import { useSidebar } from "../ui/sidebar";

interface ProfileImageProps {
  images: Array<{ url: string; alt: string }>;
  firstName: string;
  lastName: string;
}

export function ProfileImage({
  images,
  firstName,
  lastName,
}: ProfileImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { toggleSidebar, open } = useSidebar();
  const { enabled, isLoaded, isSignedIn, openSignIn } = useOptionalAuth();
  const { dict } = useLocale();

  const activeImage = images[activeIndex] || images[0];

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const handleClick = () => {
    if (!enabled || !isLoaded) return;
    if (isSignedIn) {
      toggleSidebar();
    } else {
      openSignIn();
    }
  };

  return (
    <div className="group relative block aspect-square w-full overflow-hidden rounded-2xl border-4 border-primary/20">
      <Image
        src={activeImage.url}
        alt={activeImage.alt || `${firstName} ${lastName}`}
        fill
        sizes="(max-width: 768px) 90vw, 600px"
        quality={100}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        preload
      />

      <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-medium text-white">
          {dict.misc.online}
        </span>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/70 focus-visible:ring-inset"
        aria-label={dict.misc.toggleChat}
      >
        <span className="sr-only">{dict.misc.toggleChat}</span>
      </button>

      {images.length > 1 ? (
        <div
          className="absolute bottom-4 left-1/2 z-30 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-2 backdrop-blur-sm"
          role="tablist"
          aria-label={`${firstName} ${lastName} profile images`}
        >
          {images.map((image, imageIndex) => (
            <button
              type="button"
              key={`${image.url}-${imageIndex}`}
              role="tab"
              aria-selected={imageIndex === activeIndex}
              aria-label={`${firstName} ${lastName} image ${imageIndex + 1}`}
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(imageIndex);
              }}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                imageIndex === activeIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="text-center space-y-3">
          {open ? (
            <X className="w-12 h-12 text-white mx-auto" />
          ) : (
            <MessageCircle className="w-12 h-12 text-white mx-auto" />
          )}

          <div className="text-white text-xl font-semibold">
            {open ? dict.misc.closeChat : dict.misc.openChat}
          </div>
          <div className="text-white/80 text-sm">
            {open ? dict.misc.closeChatHint : dict.misc.openChatHint}
          </div>
        </div>
      </div>
    </div>
  );
}
