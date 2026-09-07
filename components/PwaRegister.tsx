"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for PWA + offline support.
 * Automatically hooks into Next.js lifecycle events.
 */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "onload" in window) {
      const swUrl = "/sw.js";
      // Wait for the window to be ready before registering
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log("Service Worker registered:", registration.scope);
          })
          .catch((err) => {
            console.warn("Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
