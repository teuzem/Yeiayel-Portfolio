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
  const [isHovered, setIsHovered] = useState(false);
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
    <button
      type="button"
      onClick={handleClick}
      className="relative aspect-square rounded-2xl overflow-hidden border-4 border-primary/20 block group cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={dict.misc.toggleChat}
    >
      <Image
        src={activeImage.url}
        alt={activeImage.alt || `${firstName} ${lastName}`}
        fill
        sizes="(max-width: 768px) 90vw, 600px"
        quality={100}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />

      {/* Online Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-medium text-white">
          {dict.misc.online}
        </span>
      </div>

      {images.length > 1 ? (
        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-2 backdrop-blur-sm"
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
              onClick={() => setActiveIndex(imageIndex)}
              className={`h-1.5 rounded-full transition-all ${
                imageIndex === activeIndex
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
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
    </button>
  );
}
