const CACHE_NAME = "wedding-app-v12";

const APP_SHELL = [
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

/* -------------------------------------------------- */
/* INSTALL                                            */
/* -------------------------------------------------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    }),
  );
  self.skipWaiting();
});

/* -------------------------------------------------- */
/* ACTIVATE                                           */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* HELPERS                                            */
/* -------------------------------------------------- */
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((res) => {
      if (res && res.status === 200) {
        cache.put(request, res.clone());
      }
      return res;
    })
    .catch(() => null);

  return cached || networkFetch;
};

const networkFirstWithTimeout = async (request, timeout = 4000) => {
  const cache = await caches.open(CACHE_NAME);

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(request, { signal: controller.signal });
    clearTimeout(id);

    if (res && res.status === 200) {
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
};

/* -------------------------------------------------- */
/* FETCH                                              */
/* -------------------------------------------------- */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  /* 🚨 APP SHELL — MOST IMPORTANT PART */
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cached) => {
        return cached || fetch("/index.html");
      }),
    );
    return;
  }

  /* Images */
  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  /* Static assets */
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font"
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  /* Everything else */
  event.respondWith(networkFirstWithTimeout(request));
});
