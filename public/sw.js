const CACHE_NAME = "sarah-andras-wedding-app-v1";

// List of essential files to pre-cache on install.
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
      console.log("Service Worker: Essential files pre-cached successfully.");
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      try {
        // Try to fetch the resource from the network first.
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);

        // Cache the new network response for future use.
        // We clone the response because the stream can only be read once.
        cache.put(event.request, networkResponse.clone());
        console.log(
          `Service Worker: Fetched from network and cached: ${event.request.url}`
        );
        return networkResponse;
      } catch (error) {
        // If the network fetch fails, look for a cached version.
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          console.log(
            `Service Worker: Serving from cache: ${event.request.url}`
          );
          return cachedResponse;
        }

        // If nothing is found in the cache, and the network is offline.
        console.error(
          "Service Worker: Fetch failed and no cache available.",
          error
        );
        return new Response("You are offline.", { status: 503 });
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches.
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
      console.log("Service Worker: Old caches cleared.");
    })()
  );
});
