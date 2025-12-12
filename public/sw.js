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

// 2. ✅ Clean up old caches on activate AND take immediate control (for programmatic update)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      
      // Allows the new SW to control all open tabs immediately after activation
      self.clientsClaim(); 
      
      console.log("Service Worker: Old caches cleared and clients claimed.");
    })()
  );
});

// 3. ✅ Listen for 'skipWaiting' message from the page (to fix the double-reload UX)
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
    console.log("Service Worker: Activated via skipWaiting.");
  }
});


// -------------------------------------------------------------------------
// --- SAFE CACHING STRATEGIES TO PREVENT HANGS ---
// -------------------------------------------------------------------------

/**
 * Strategy: Cache-First, then Network-Update (Stale-While-Revalidate)
 * This is fast and prevents deadlocks by IMMEDIATELY returning the cache.
 */
const staleWhileRevalidate = async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Start the network request to update the cache in the background.
    const networkFetch = fetch(request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(error => {
        console.warn(`SW: Background network update failed for ${request.url}`, error);
        return null; // Don't crash if the network update fails
      });

    // CRITICAL: Return the cached response immediately if available. 
    // This is the fastest response and prevents the page from waiting/hanging.
    if (cachedResponse) {
      console.log(`SW: Serving cached image (Stale-While-Revalidate) → ${request.url}`);
      return cachedResponse;
    } 
    
    // If no cache, wait for the network response (and throw if it fails)
    const networkResponse = await networkFetch;
    
    if (networkResponse) {
        return networkResponse;
    }
    
    // Final fallback if both cache and network failed
    console.error(`SW: Failed to fetch and no cache for ${request.url}`);
    return new Response(null, { status: 503, statusText: "Offline Fallback Failed" });
};

/**
 * Strategy: Network-First, then Cache-Fallback
 * Best for core assets like HTML, CSS, and JS.
 */
const networkFirst = async (request) => {
    const cache = await caches.open(CACHE_NAME);
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses for next time
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
        
        // If nothing is found, return an explicit 503 response
        console.error("SW: Network and Cache failed for:", request.url);
        return new Response("You are offline.", { status: 503 });
    }
};


// 4. ✅ Main Fetch Listener
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Use Stale-While-Revalidate for images
    if (request.destination === "image" && /\.(webp|avif)$/i.test(request.url)) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // Use Network-First for everything else
    event.respondWith(networkFirst(request));
});
