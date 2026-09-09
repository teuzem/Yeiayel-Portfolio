/* Production service worker for resilient navigation and bounded asset caches. */
const CACHE_PREFIX = "yeiayel-portfolio";
const CACHE_VERSION = "v2";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${CACHE_VERSION}`;
const PAGE_CACHE = `${CACHE_PREFIX}-pages-${CACHE_VERSION}`;
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${CACHE_VERSION}`;
const APP_CACHES = [SHELL_CACHE, PAGE_CACHE, STATIC_CACHE, IMAGE_CACHE];
const PRECACHE_URLS = [
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];
const NEVER_CACHE_PATHS = [
  /^\/api(?:\/|$)/,
  /^\/studio(?:\/|$)/,
  /^\/confirmation(?:\/|$)/,
  /^\/sign-in(?:\/|$)/,
  /^\/sign-up(?:\/|$)/,
];

function isCacheableResponse(response) {
  if (!response || (!response.ok && response.type !== "opaque")) return false;
  if (response.type === "opaque") return true;

  const cacheControl = response.headers.get("cache-control") || "";
  return (
    !/(?:^|,)\s*(?:private|no-store)(?:\s|,|$)/i.test(cacheControl) &&
    !response.headers.has("set-cookie")
  );
}

async function putIfCacheable(cacheName, request, response) {
  if (!isCacheableResponse(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const excess = keys.length - maxEntries;
  if (excess > 0) {
    await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
  }
}

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  await Promise.allSettled(
    PRECACHE_URLS.map(async (url) => {
      const request = new Request(url, { cache: "reload" });
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response);
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith(`${CACHE_PREFIX}-`) && !APP_CACHES.includes(key),
          )
          .map((key) => caches.delete(key)),
      );

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "CLEAR_CACHES") {
    event.waitUntil(
      Promise.all(APP_CACHES.map((cacheName) => caches.delete(cacheName))),
    );
  }
});

async function networkFirstNavigation(event) {
  const request = event.request;
  try {
    const preload = await event.preloadResponse;
    const response = preload || (await fetch(request));
    await putIfCacheable(PAGE_CACHE, request, response);
    event.waitUntil(trimCache(PAGE_CACHE, 20));
    return response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match("/offline")) ||
      new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  await putIfCacheable(cacheName, request, response);
  await trimCache(cacheName, maxEntries);
  return response;
}

async function staleWhileRevalidate(event, cacheName, maxEntries) {
  const request = event.request;
  const cached = await caches.match(request);
  const update = fetch(request)
    .then(async (response) => {
      await putIfCacheable(cacheName, request, response);
      await trimCache(cacheName, maxEntries);
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(update);
    return cached;
  }

  return (
    (await update) || new Response("", { status: 503, statusText: "Offline" })
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = request.mode === "navigate";
  const isImmutableNextAsset =
    isSameOrigin && url.pathname.startsWith("/_next/static/");
  const isSameOriginAsset =
    isSameOrigin &&
    ["style", "script", "font", "worker"].includes(request.destination);
  const isImage =
    request.destination === "image" &&
    (isSameOrigin ||
      url.hostname === "cdn.sanity.io" ||
      url.hostname === "images.unsplash.com");

  if (
    isSameOrigin &&
    NEVER_CACHE_PATHS.some((pattern) => pattern.test(url.pathname))
  ) {
    return;
  }

  if (isNavigation && isSameOrigin) {
    event.respondWith(networkFirstNavigation(event));
    return;
  }

  if (isImmutableNextAsset) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 80));
    return;
  }

  if (isSameOriginAsset) {
    event.respondWith(staleWhileRevalidate(event, STATIC_CACHE, 80));
    return;
  }

  if (isImage) {
    event.respondWith(staleWhileRevalidate(event, IMAGE_CACHE, 60));
  }
});
