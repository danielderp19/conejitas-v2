const CACHE = "conjita-v3";
const STATIC = ["/manifest.json", "/bunny-icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("/api/")) return;

  const url = new URL(e.request.url);

  // HTML pages: network first, fallback to cache
  if (url.pathname === "/" || e.request.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets (_next/static): cache first (they have content hashes)
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // Everything else: network first
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
