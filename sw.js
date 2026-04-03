// ═══════════════════════════════════════════════════════════════════════
//  SERVICE WORKER — NFC Digital Card PWA
//  Strategy: Cache-first with network fallback; update in background
// ═══════════════════════════════════════════════════════════════════════

const CACHE  = 'nfc-card-v2';
const ASSETS = [
  './',
  './index.html',
  './card.html',
  './write.html',
  './edit.html',
  './config.js',
  './manifest.json',
  './icons/icon.svg',
];

// ── Install: pre-cache all app shell assets ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ──────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for app assets, network-first for CDN ─────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin Chrome extension requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Network-first for CDN resources (fonts, QR library)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for local assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Revalidate in background
        fetch(event.request).then(res => {
          caches.open(CACHE).then(c => c.put(event.request, res));
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, clone));
        return res;
      });
    })
  );
});
