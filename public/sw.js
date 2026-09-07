/* Portfolio Service Worker — offline-first with stale-while-revalidate caching */
const CACHE_NAME = "portfolio-v1";
const PRECACHE_URLS = ["/", "/manifest.json", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

// Network-first for navigation (so live Sanity content stays fresh when online),
// falling back to cache (offline shell) when offline.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Only handle same-origin & sanity assets, don't intercept cross-origin APIs
  const url = new URL(request.url);
  const isNavigation = request.mode === "navigate";
  const isSameOrigin = url.origin === self.location.origin;
  const isSanity =
    url.hostname.endsWith("sanity.io") ||
    url.hostname.endsWith("sanity.studio");

  if (!isSameOrigin && !isSanity) return;

  // Network-first with fallback to cache (stale-while-revalidate)
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (isNavigation) return caches.match("/offline");
        return new Response("", { status: 503, statusText: "Offline" });
      }),
  );
});
