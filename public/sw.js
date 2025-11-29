const CACHE_NAME = "sarah-andras-wedding-app-v4";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/assets/css/index.css",
  "/src/assets/fonts/Dawning.ttf",
  "/src/assets/fonts/RobotoExtraLight.ttf",
  "/src/assets/images/us.webp",
  "/src/assets/images/carousel/1.webp",
  "/src/assets/images/carousel/2.webp",
  "/src/assets/images/carousel/3.webp",
  "/src/assets/images/carousel/4.webp",
];

// ✅ Pre-cache essential files on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
      console.log("Service Worker: Essential files pre-cached successfully.");
    })()
  );
});

// ✅ Runtime caching for .webp and .avif images
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only intercept image requests (webp or avif)
  if (request.destination === "image" && /\.(webp|avif)$/i.test(request.url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Try to update the cache in the background
          fetch(request)
            .then((networkResponse) => {
              cache.put(request, networkResponse.clone());
            })
            .catch(() => {});
          console.log(`Service Worker: Serving cached image → ${request.url}`);
          return cachedResponse;
        }

        // If not cached, fetch and cache
        try {
          const networkResponse = await fetch(request);
          cache.put(request, networkResponse.clone());
          console.log(`Service Worker: Cached new image → ${request.url}`);
          return networkResponse;
        } catch (error) {
          console.error("Service Worker: Failed to fetch image:", request.url);
          return new Response(null, { status: 503 });
        }
      })()
    );
    return;
  }

  // ✅ Default fetch strategy for other resources (network-first)
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        return new Response("You are offline.", { status: 503 });
      }
    })()
  );
});

// ✅ Clean up old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      console.log("Service Worker: Old caches cleared.");
    })()
  );
});
