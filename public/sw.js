const CACHE_NAME = "wedding-app-cache-v1";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching assets");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Service Worker: Caching failed:", error);
      })
  );
});

self.addEventListener("fetch", (event) => {
  // Use a cache-first strategy for all requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Otherwise, fetch from the network
      return fetch(event.request)
        .then((response) => {
          // Check if the response is valid
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Cache the new response for future use
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("Service Worker: Fetch failed:", error);
          // You can return an offline page here if needed
        });
    })
  );
});
