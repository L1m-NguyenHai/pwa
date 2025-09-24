const CACHE_NAME = "expense-tracker-v5";
const STATIC_CACHE = "static-v2";
const RUNTIME_CACHE = "runtime-v2";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/index.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const staticAssets = [
  /\.js$/,
  /\.css$/,
  /\.png$/,
  /\.jpg$/,
  /\.svg$/,
  /\.woff2?$/,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
      caches.open(STATIC_CACHE)
    ])
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip dev resources
  if (
    url.pathname.includes("vite.svg") ||
    url.pathname.includes("@vite") ||
    url.pathname.includes("react-refresh") ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Cache strategy cho static assets
  if (staticAssets.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => 
        cache.match(request).then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(fetchResponse => {
            // Cache successful responses
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        })
      )
    );
    return;
  }

  // Network first for HTML and API calls với fallback
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => 
        caches.match(request).then(response => 
          response || caches.match('/')
        )
      )
    );
    return;
  }

  // Default: cache với stale-while-revalidate
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(cache =>
      cache.match(request).then(response => {
        const fetchPromise = fetch(request).then(fetchResponse => {
          if (fetchResponse.ok && fetchResponse.status === 200) {
            cache.put(request, fetchResponse.clone());
          }
          return fetchResponse;
        }).catch(() => response); // Return cached response on fetch error
        
        return response || fetchPromise;
      })
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![CACHE_NAME, STATIC_CACHE, RUNTIME_CACHE].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      clients.claim()
    ])
  );
});
