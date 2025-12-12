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

// 1. ✅ Pre-cache essential files on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
      console.log("Service Worker: Essential files pre-cached successfully.");
    })()
  );
});

// 2. ✅ Clean up old caches on activate AND take immediate control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      
      // *** IMPORTANT NEW ADDITION: Takes immediate control of new clients ***
      self.clientsClaim(); 
      
      console.log("Service Worker: Old caches cleared and clients claimed.");
    })()
  );
});

// 3. ✅ Listen for 'skipWaiting' message from the page
// This allows the page to force the update after the user clicks "Refresh"
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
    console.log("Service Worker: Activated via skipWaiting.");
  }
});

// 4. ✅ Runtime caching for .webp and .avif images
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only intercept image requests (webp or avif)
  if (request.destination === "image" && /\.(webp|avif)$/i.test(request.url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Cache-First, then Network-Update
          fetch(request)
            .then((networkResponse) => {
              // Ensure we only cache successful responses
              if (networkResponse && networkResponse.status === 200) {
                 cache.put(request, networkResponse.clone());
              }
            })
            .catch(() => {});
          console.log(`Service Worker: Serving cached image → ${request.url}`);
          return cachedResponse;
        }

        // If not cached, fetch and cache
        try {
          const networkResponse = await fetch(request);
          // Ensure we only cache successful responses
          if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
          }
          console.log(`Service Worker: Cached new image → ${request.url}`);
          return networkResponse.clone(); // Return clone
        } catch (error) {
          console.error("Service Worker: Failed to fetch image:", request.url);
          return new Response(null, { status: 503 });
        }
      })()
    );
    return;
  }

  // 5. ✅ Default fetch strategy for other resources (network-first)
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        
        // Ensure we only cache successful responses for the Network-First strategy
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        return new Response("You are offline.", { status: 503 });
      }
    })()
  );
});
