const CACHE_NAME = "sarah-andras-wedding-app-v1";

// This function fetches the asset manifest and returns a list of files to cache.
async function getAssetsToCache() {
  try {
    // Attempt to fetch the asset manifest from the root.
    const response = await fetch("/asset-manifest.json");
    if (!response.ok) {
      console.warn(
        "Could not find asset-manifest.json. Falling back to default paths."
      );
      // If the manifest isn't found, you can return a simple list of files to cache.
      // This is a good fallback for when you're not using a build tool that generates a manifest.
      return [
        "/",
        "/index.html",
        "/src/assets/css/index.css",
        "/src/assets/fonts/RobotoExtraLight.ttf",
        "/src/assets/fonts/Dawning.ttf",
        "/src/assets/images/carousel/1.webp",
        "/src/assets/images/carousel/2.webp",
        "/src/assets/images/carousel/3.webp",
        "/src/assets/images/carousel/4.webp",
      ];
    }
    const manifest = await response.json();

    // Extract the URLs from the manifest.
    return Object.values(manifest.files || {}).filter((path) => {
      // You can add more filtering logic here if needed, or simply return all paths.
      return (
        path.endsWith(".html") ||
        path.endsWith(".js") ||
        path.endsWith(".css") ||
        path.endsWith(".ttf") ||
        path.endsWith(".webp")
      );
    });
  } catch (error) {
    console.error(
      "Service Worker Error: Unable to get assets to cache.",
      error
    );
    return [];
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const urlsToCache = await getAssetsToCache();
      const cache = await caches.open(CACHE_NAME);
      // We also cache the root URL for offline support.
      await cache.addAll(["/", ...urlsToCache]);
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        // You can choose to cache new responses here if you wish.
        return networkResponse;
      } catch (error) {
        console.error("Fetch failed: ", error);
        return new Response("You are offline.", { status: 503 });
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })()
  );
});
