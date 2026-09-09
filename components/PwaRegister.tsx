"use client";

import { useOffline } from "next/offline";
import { useCallback, useEffect, useRef, useState } from "react";

const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Registers and maintains the service worker, exposes connectivity feedback,
 * and lets users activate an updated offline shell without a stale reload.
 */
export function PwaRegister() {
  const frameworkOffline = useOffline();
  const [browserOffline, setBrowserOffline] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );
  const reloadForUpdate = useRef(false);

  const updateConnectivity = useCallback(() => {
    setBrowserOffline(!navigator.onLine);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const checkForUpdate = () => {
      if (navigator.onLine && registration) {
        registration.update().catch(() => {
          // A transient update failure must not affect the running application.
        });
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkForUpdate();
    };

    const handleControllerChange = () => {
      if (reloadForUpdate.current) window.location.reload();
    };

    const watchInstallingWorker = (worker: ServiceWorker | null) => {
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (
          worker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          setWaitingWorker(registration?.waiting || worker);
        }
      });
    };

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        setWaitingWorker(registration.waiting);
        watchInstallingWorker(registration.installing);
        registration.addEventListener("updatefound", () => {
          watchInstallingWorker(registration?.installing || null);
        });
        intervalId = setInterval(checkForUpdate, UPDATE_INTERVAL_MS);
      } catch {
        // Offline support is progressive enhancement; the app remains usable.
      }
    };

    updateConnectivity();
    window.addEventListener("online", updateConnectivity);
    window.addEventListener("offline", updateConnectivity);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", handleVisibility);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    if (document.readyState === "complete") {
      void register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      window.removeEventListener("load", register);
      window.removeEventListener("online", updateConnectivity);
      window.removeEventListener("offline", updateConnectivity);
      window.removeEventListener("online", checkForUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      if (intervalId) clearInterval(intervalId);
    };
  }, [updateConnectivity]);

  const applyUpdate = () => {
    if (!waitingWorker) return;
    reloadForUpdate.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  const isOffline = frameworkOffline || browserOffline;
  if (!isOffline && !waitingWorker) return null;

  return (
    <output
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground shadow-lg"
    >
      <span>
        {isOffline
          ? "Offline mode. Cached pages remain available and pending actions will retry when connected."
          : "An updated version is ready."}
      </span>
      {!isOffline && waitingWorker ? (
        <button
          type="button"
          onClick={applyUpdate}
          className="shrink-0 font-medium text-primary underline underline-offset-4"
        >
          Update
        </button>
      ) : null}
    </output>
  );
}
