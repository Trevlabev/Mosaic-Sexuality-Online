/* MOSAIC Sexuality Online - Service Worker for Offline Capabilities (v1.1.4) */
const CACHE_NAME = 'mosaic-online-v1.1.4';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'triad/index.html',
  'scope/index.html',
  'assessment/index.html',
  'research/index.html',
  'about.html',
  'privacy.html',
  'terms.html',
  '404.html',
  'favicon.svg',
  'site.webmanifest',
  'assets/css/styles.css',
  'assets/public-overrides.css',
  'assets/js/app.js',
  'assets/js/assessment.js',
  'assets/js/profile-demo.js',
  'assets/img/logo.svg',
  'assessment/src/styles.css',
  'assessment/src/config.js',
  'assessment/src/combined-question-bank.js',
  'assessment/src/app.js',
  'assessment/data/atlas-ontology.json',
  'assessment/data/branch-rules.json',
  'assessment/data/deployment-config.json',
  'assessment/data/entity-schema.json',
  'assessment/data/scoring-packages.json'
];

// Install Event: Cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate caching strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
