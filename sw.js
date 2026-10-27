// Service Worker Minimalis - Syarat Mutlak PWA Chrome Android
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Biarkan kosong. Kehadiran event 'fetch' ini cukup untuk lolos seleksi Chrome.
});
