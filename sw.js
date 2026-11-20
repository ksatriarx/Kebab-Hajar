const CACHE_NAME = 'kebab-pwa-v17-offline-pos';
const APP_SHELL = [
  './',
  './index.html',
  './kasir.html',
  './pengaturan-toko.html',
  './pesan-mandiri.html',
  './mockup-pembayaran.html',
  './manifest.json',
  './profile.css',
  './profile.js',
  './logo.png',
  './firebase-messaging-sw.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache setiap halaman lokal yang tersedia. Satu aset gagal tidak
    // menggagalkan pemasangan seluruh app shell.
    await Promise.all(APP_SHELL.map(async url => {
      try { await cache.add(url); } catch (e) { console.warn('Gagal cache app shell:', url, e); }
    }));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Untuk navigasi halaman: jaringan dahulu, cache sebagai cadangan offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (_) {
        const cached = await caches.match(req);
        if (cached) return cached;
        const fallback = await caches.match('./index.html');
        return fallback || new Response('Halaman belum tersimpan untuk mode offline. Buka RX Kebab saat internet tersedia terlebih dahulu.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  // Untuk aset lokal: cache dahulu agar tampilan tetap dapat dimuat offline.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) {
      fetch(req).then(res => {
        if (res && res.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
      }).catch(() => {});
      return cached;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
      return res;
    } catch (_) {
      return new Response('', { status: 504, statusText: 'Offline asset unavailable' });
    }
  })());
});
