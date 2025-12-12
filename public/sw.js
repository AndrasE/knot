const CACHE_NAME = "sarah-andras-wedding-app-v5";

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

// 1. ✅ INSTALL: Pre-cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(urlsToCache);
        console.log("Service Worker: Essential files pre-cached successfully.");
      } catch (error) {
        // Fail loudly if pre-caching fails to prevent a bad SW from activating
        console.error('SW Installation failed during pre-caching:', error);
        throw error; 
      }
    })()
  );
});

// 2. ✅ ACTIVATE: Clean up old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      
      // Ensure the new SW immediately controls new pages (fixes update flow)
      self.clientsClaim(); 
      
      console.log("Service Worker: Old caches cleared and clients claimed.");
    })()
  );
});

// 3. ✅ MESSAGE: Listener for programmatic skipWaiting (fixes double-reload UX)
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
    console.log("Service Worker: Activated via skipWaiting.");
  }
});


// -------------------------------------------------------------------------
// --- SAFE CACHING STRATEGIES (Prevents Deadlocks/Hangs on Mobile) ---
// -------------------------------------------------------------------------

/**
 * Strategy 1: Stale-While-Revalidate (for images)
 * Prioritizes speed (cache) while updating in the background.
 */
const staleWhileRevalidate = async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const networkFetch = fetch(request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(error => {
        console.warn(`SW: Background network update failed for ${request.url}`, error);
        return null;
      });

    // CRITICAL: Return cached response immediately to prevent page hang.
    if (cachedResponse) {
      console.log(`SW: Serving cached image (SWR) → ${request.url}`);
      return cachedResponse;
    } 
    
    // Fallback: If no cache, wait for the network.
    const networkResponse = await networkFetch;
    
    if (networkResponse) return networkResponse;
    
    // Final fallback
    console.error(`SW: Failed to fetch and no cache for ${request.url}`);
    return new Response(null, { status: 503, statusText: "Offline/Network Fallback Failed" });
};

/**
 * Strategy 2: Network-First, Cache-Fallback (for all other files)
 * Ensures the app tries for the newest code, but has a robust offline fallback.
 */
const networkFirst = async (request) => {
    const cache = await caches.open(CACHE_NAME);
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Network failed, try cache fallback
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log(`SW: Serving cached fallback for ${request.url}`);
            return cachedResponse;
        }
        
        // Return a response so the promise resolves (prevents hang)
        console.error("SW: Network and Cache failed for:", request.url);
        return new Response("You are offline and no cache is available.", { status: 503 });
    }
};


// 4. ✅ Main Fetch Listener
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.destination === "image" && /\.(webp|avif)$/i.test(request.url)) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    event.respondWith(networkFirst(request));
});
